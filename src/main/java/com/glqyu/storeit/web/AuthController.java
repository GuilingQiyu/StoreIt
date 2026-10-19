package com.glqyu.storeit.web;

import com.glqyu.storeit.dto.ApiResponse;
import com.glqyu.storeit.dto.LoginRequest;
import com.glqyu.storeit.mapper.InviteCodeMapper;
import com.glqyu.storeit.mapper.UserMapper;
import com.glqyu.storeit.model.InviteCode;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.AdminUserService;
import com.glqyu.storeit.service.AuthService;
import com.glqyu.storeit.service.LoginThrottle;
import com.glqyu.storeit.service.Usernames;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {
    public static final String TOO_MANY_ATTEMPTS = "登录尝试过多，请稍后再试";
    public static final String ACCOUNT_DISABLED = "该账号已被管理员禁用";

    private final AuthService authService;
    private final AdminUserService adminUserService;
    private final LoginThrottle loginThrottle;
    private final UserMapper userMapper;
    private final InviteCodeMapper inviteCodeMapper;

    public AuthController(AuthService authService,
                          AdminUserService adminUserService,
                          LoginThrottle loginThrottle,
                          UserMapper userMapper,
                          InviteCodeMapper inviteCodeMapper) {
        this.authService = authService;
        this.adminUserService = adminUserService;
        this.loginThrottle = loginThrottle;
        this.userMapper = userMapper;
        this.inviteCodeMapper = inviteCodeMapper;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @ModelAttribute LoginRequest req,
                                                                  HttpServletRequest request,
                                                                  HttpServletResponse response) {
        String key = clientKey(request, req.getUsername());
        long now = Instant.now().getEpochSecond();
        if (loginThrottle.isBlocked(key, now)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(ApiResponse.fail(TOO_MANY_ATTEMPTS));
        }
        Optional<User> u = authService.findUser(req.getUsername());
        boolean ok;
        if (u.isPresent()) {
            ok = authService.checkPassword(u.get(), req.getPassword());
        } else {
            authService.checkDummyPassword(req.getPassword());
            ok = false;
        }
        if (ok) {
            if (!u.get().isEnabled()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.fail(ACCOUNT_DISABLED));
            }
            loginThrottle.clear(key);
            authService.createSession(u.get().getUsername(), response);
            return ResponseEntity.ok(ApiResponse.ok("登录成功！您的会话已建立。", Map.of(
                    "username", u.get().getUsername(),
                    "must_change_password", u.get().isMustChangePassword()
            )));
        }
        loginThrottle.recordFailure(key, now);
        return ResponseEntity.status(401).body(ApiResponse.fail("登录失败，无效的用户名或密码"));
    }

    /**
     * 自主受邀注册接口：校验邀请码有效性并原子扣减可用次数，创建用户与个人存储目录并自动建立会话。
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@RequestBody Map<String, String> payload,
                                                                     HttpServletRequest request,
                                                                     HttpServletResponse response) {
        String username = payload.get("username") == null ? "" : payload.get("username").trim();
        String password = payload.get("password") == null ? "" : payload.get("password");
        String codeStr = payload.get("inviteCode") == null ? "" : payload.get("inviteCode").trim();

        String throttleKey = clientKey(request, "register");
        long now = Instant.now().getEpochSecond();
        if (loginThrottle.isBlocked(throttleKey, now)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(ApiResponse.fail(TOO_MANY_ATTEMPTS));
        }

        if (codeStr.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("请输入管理员发放的邀请码"));
        }

        try {
            Usernames.check(username);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        }

        if (password.length() < AdminUserService.MIN_PASSWORD_LENGTH) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(AdminUserService.PASSWORD_TOO_SHORT));
        }

        if (authService.findUser(username).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("该用户名已被注册"));
        }

        Optional<InviteCode> inviteOpt = inviteCodeMapper.findByCode(codeStr);
        if (inviteOpt.isEmpty()) {
            loginThrottle.recordFailure(throttleKey, now);
            return ResponseEntity.badRequest().body(ApiResponse.fail("邀请码无效或不存在"));
        }

        InviteCode invite = inviteOpt.get();
        if (invite.isRevoked()
                || (invite.getExpiresAt() != null && invite.getExpiresAt() < now)
                || (invite.getMaxUses() != null && invite.getMaxUses() > 0 && invite.getUsedCount() >= invite.getMaxUses())) {
            loginThrottle.recordFailure(throttleKey, now);
            return ResponseEntity.badRequest().body(ApiResponse.fail("该邀请码已过期或已达使用次数上限"));
        }

        if (inviteCodeMapper.consumeInvite(invite.getId(), now) <= 0) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("该邀请码已失效"));
        }

        try {
            long quota = invite.getDefaultQuota() == null ? 0L : Math.max(0L, invite.getDefaultQuota());
            User created = adminUserService.create(username, password, quota, false);
            loginThrottle.clear(throttleKey);
            authService.createSession(created.getUsername(), response);
            return ResponseEntity.ok(ApiResponse.ok("注册成功，欢迎使用储之 StoreIt！", Map.of(
                    "username", created.getUsername(),
                    "role", created.getRole(),
                    "storageQuota", created.getStorageQuota()
            )));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.fail("注册失败，请稍后重试"));
        }
    }

    private static String clientKey(HttpServletRequest request, String username) {
        String ip = request.getRemoteAddr() == null ? "" : request.getRemoteAddr();
        return ip + "\n" + username;
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.clearSession(request, response);
        return ResponseEntity.ok(ApiResponse.ok("已退出登录"));
    }

    @GetMapping("/user/status")
    public Map<String, Object> userStatus(HttpServletRequest request) {
        Optional<String> name = authService.getUsernameFromRequest(request);
        if (name.isEmpty()) {
            return Map.of("logged_in", false, "username", "", "role", "", "must_change_password", false);
        }
        Optional<User> userOpt = authService.findUser(name.get());
        String role = userOpt.map(User::getRole).orElse("");
        boolean mustChange = userOpt.map(User::isMustChangePassword).orElse(false);
        return Map.of(
                "logged_in", true,
                "username", name.get(),
                "role", role == null ? "" : role,
                "must_change_password", mustChange
        );
    }

    @PostMapping("/user/password")
    public ResponseEntity<ApiResponse<Void>> changeOwnPassword(HttpServletRequest request,
                                                               @RequestBody Map<String, String> payload) {
        Optional<String> name = authService.getUsernameFromRequest(request);
        if (name.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.fail("未登录"));
        }
        Optional<User> userOpt = authService.findUser(name.get());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.fail("用户不存在"));
        }
        User user = userOpt.get();
        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("newPassword");
        if (oldPassword == null || !authService.checkPassword(user, oldPassword)) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("当前原口令不正确"));
        }
        if (newPassword == null || newPassword.length() < AdminUserService.MIN_PASSWORD_LENGTH) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(AdminUserService.PASSWORD_TOO_SHORT));
        }
        user.setPasswordHash(BCrypt.hashpw(newPassword, BCrypt.gensalt()));
        user.setMustChangePassword(false);
        userMapper.updatePassword(user);
        return ResponseEntity.ok(ApiResponse.ok("口令修改成功"));
    }
}

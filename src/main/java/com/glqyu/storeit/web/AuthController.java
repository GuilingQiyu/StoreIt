package com.glqyu.storeit.web;

import com.glqyu.storeit.dto.ApiResponse;
import com.glqyu.storeit.dto.LoginRequest;
import com.glqyu.storeit.mapper.UserMapper;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.AdminUserService;
import com.glqyu.storeit.service.AuthService;
import com.glqyu.storeit.service.LoginThrottle;
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
    private final LoginThrottle loginThrottle;
    private final UserMapper userMapper;

    public AuthController(AuthService authService, LoginThrottle loginThrottle, UserMapper userMapper) {
        this.authService = authService;
        this.loginThrottle = loginThrottle;
        this.userMapper = userMapper;
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

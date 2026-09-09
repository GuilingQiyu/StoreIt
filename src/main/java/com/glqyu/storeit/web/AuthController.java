package com.glqyu.storeit.web;

import com.glqyu.storeit.dto.ApiResponse;
import com.glqyu.storeit.dto.LoginRequest;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.AuthService;
import com.glqyu.storeit.service.LoginRateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final AuthService authService;
    private final LoginRateLimiter loginRateLimiter;

    public AuthController(AuthService authService, LoginRateLimiter loginRateLimiter) {
        this.authService = authService;
        this.loginRateLimiter = loginRateLimiter;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @ModelAttribute LoginRequest req,
                                                                  HttpServletRequest request,
                                                                  HttpServletResponse response) {
        String clientKey = clientKey(request);
        if (loginRateLimiter.isLimited(clientKey)) {
            return ResponseEntity.status(429).body(ApiResponse.fail("登录尝试过于频繁，请稍后再试"));
        }
        loginRateLimiter.recordAttempt(clientKey);

        Optional<User> u = authService.findUser(req.getUsername());
        if (u.isPresent() && authService.checkPassword(u.get(), req.getPassword())) {
            if (!u.get().isEnabled()) {
                return ResponseEntity.status(403).body(ApiResponse.fail("账号已禁用，请联系管理员"));
            }
            loginRateLimiter.clear(clientKey);
            authService.createSession(u.get().getUsername(), request, response);
            boolean mustChange = authService.mustChangePassword(u.get());
            Map<String, Object> data = new HashMap<>();
            data.put("username", u.get().getUsername());
            data.put("role", u.get().getRole());
            data.put("must_change_password", mustChange);
            String msg = mustChange
                    ? "登录成功。检测到仍在使用默认弱口令，请立即修改密码后再使用。"
                    : "登录成功！您的会话已建立。";
            return ResponseEntity.ok(ApiResponse.ok(msg, data));
        }
        return ResponseEntity.status(401).body(ApiResponse.fail("登录失败，无效的用户名或密码"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.clearSession(request, response);
        return ResponseEntity.ok(ApiResponse.ok("已退出登录"));
    }

    @GetMapping("/user/status")
    public Map<String, Object> userStatus(HttpServletRequest request) {
        Optional<String> u = authService.getUsernameFromRequest(request);
        Map<String, Object> res = new HashMap<>();
        res.put("logged_in", u.isPresent());
        res.put("username", u.orElse(""));
        boolean mustChange = false;
        String role = "";
        if (u.isPresent()) {
            User user = authService.findUser(u.get()).orElse(null);
            mustChange = authService.mustChangePassword(user);
            if (user != null) role = user.getRole() == null ? "" : user.getRole();
        }
        res.put("must_change_password", mustChange);
        res.put("role", role);
        return res;
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(HttpServletRequest request,
                                                            HttpServletResponse response,
                                                            @RequestParam("currentPassword") String currentPassword,
                                                            @RequestParam("newPassword") String newPassword) {
        Optional<String> username = authService.getUsernameFromRequest(request);
        if (username.isEmpty()) {
            return ResponseEntity.status(401).body(ApiResponse.fail("未登录"));
        }
        User user = authService.findUser(username.get()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body(ApiResponse.fail("用户不存在"));
        }
        try {
            authService.changePassword(user, currentPassword, newPassword);
            // changePassword 会清除全部会话；立即重建当前会话
            authService.createSession(user.getUsername(), request, response);
            return ResponseEntity.ok(ApiResponse.ok("密码已更新，请继续使用"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        }
    }

    private String clientKey(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

package com.glqyu.storeit.web;

import com.glqyu.storeit.dto.ApiResponse;
import com.glqyu.storeit.dto.LoginRequest;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @ModelAttribute LoginRequest req, HttpServletResponse response) {
        Optional<User> u = authService.findUser(req.getUsername());
        if (u.isPresent() && authService.checkPassword(u.get(), req.getPassword())) {
            authService.createSession(u.get().getUsername(), response);
            return ResponseEntity.ok(ApiResponse.ok("登录成功！您的会话已建立。", Map.of("username", u.get().getUsername())));
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
        // Map.of 不允许 null，避免 NPE
        return Map.of("logged_in", u.isPresent(), "username", u.orElse(""));
    }
}

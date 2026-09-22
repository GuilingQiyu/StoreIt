package com.glqyu.storeit.web;

import com.glqyu.storeit.dto.ApiResponse;
import com.glqyu.storeit.dto.CreateUserRequest;
import com.glqyu.storeit.dto.ResetPasswordRequest;
import com.glqyu.storeit.dto.UpdateUserRequest;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.AdminUserService;
import com.glqyu.storeit.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private static final Logger log = LoggerFactory.getLogger(AdminUserController.class);

    private final AdminUserService adminUserService;
    private final AuthService authService;

    public AdminUserController(AdminUserService adminUserService, AuthService authService) {
        this.adminUserService = adminUserService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> list(HttpServletRequest request) {
        requireAdmin(request);
        List<Map<String, Object>> users = adminUserService.list().stream().map(this::summary).toList();
        return ResponseEntity.ok(ApiResponse.ok("用户列表", users));
    }

    @PostMapping
    public ResponseEntity<?> create(HttpServletRequest request, @Valid @RequestBody CreateUserRequest req) {
        requireAdmin(request);
        try {
            long quota = req.getStorageQuota() == null ? 0L : req.getStorageQuota();
            User created = adminUserService.create(req.getUsername(), req.getPassword(), quota);
            return ResponseEntity.ok(ApiResponse.ok("用户已创建", summary(created)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.warn("Create user failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(ApiResponse.fail("操作失败"));
        }
    }

    @PatchMapping("/{username}")
    public ResponseEntity<?> update(HttpServletRequest request, @PathVariable String username,
                                    @RequestBody UpdateUserRequest req) {
        User actor = requireAdmin(request);
        try {
            adminUserService.update(actor.getUsername(), username, req.getStorageQuota(), req.getRole());
            return ResponseEntity.ok(ApiResponse.ok("用户已更新"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.fail("用户不存在"));
        } catch (Exception e) {
            log.warn("Update user failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(ApiResponse.fail("操作失败"));
        }
    }

    @PostMapping("/{username}/password")
    public ResponseEntity<?> resetPassword(HttpServletRequest request, @PathVariable String username,
                                           @Valid @RequestBody ResetPasswordRequest req) {
        requireAdmin(request);
        try {
            adminUserService.resetPassword(username, req.getPassword());
            return ResponseEntity.ok(ApiResponse.ok("口令已重置"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.fail("用户不存在"));
        } catch (Exception e) {
            log.warn("Reset password failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(ApiResponse.fail("操作失败"));
        }
    }

    private User requireAdmin(HttpServletRequest request) {
        String name = authService.getUsernameFromRequest(request).orElseThrow(() -> new Denied(401, "未登录"));
        User user = authService.findUser(name).orElseThrow(() -> new Denied(401, "未登录"));
        if (user.getRole() == null || !user.getRole().equalsIgnoreCase("ADMIN")) {
            throw new Denied(403, "需要管理员权限");
        }
        return user;
    }

    private Map<String, Object> summary(User user) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", user.getId());
        row.put("username", user.getUsername());
        row.put("role", user.getRole() == null ? "USER" : user.getRole());
        row.put("storageQuota", user.getStorageQuota());
        row.put("createdAt", user.getCreatedAt());
        return row;
    }

    @ExceptionHandler(Denied.class)
    public ResponseEntity<ApiResponse<Void>> denied(Denied denied) {
        return ResponseEntity.status(denied.status).body(ApiResponse.fail(denied.getMessage()));
    }

    private static final class Denied extends RuntimeException {
        private final int status;

        private Denied(int status, String message) {
            super(message);
            this.status = status;
        }
    }
}

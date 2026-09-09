package com.glqyu.storeit.web;

import com.glqyu.storeit.dto.ApiResponse;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.AuthService;
import com.glqyu.storeit.service.ShareService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private final AuthService authService;
    private final ShareService shareService;

    public AdminController(AuthService authService, ShareService shareService) {
        this.authService = authService;
        this.shareService = shareService;
    }

    private User requireAdmin(HttpServletRequest request) {
        String username = authService.getUsernameFromRequest(request)
                .orElseThrow(() -> new SecurityException("未登录"));
        User user = authService.findUser(username).orElseThrow(() -> new SecurityException("用户不存在"));
        if (!user.isAdmin()) throw new SecurityException("需要管理员权限");
        return user;
    }

    private Map<String, Object> userView(User u) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("username", u.getUsername());
        m.put("role", u.getRole());
        m.put("storageQuota", u.getStorageQuota());
        m.put("enabled", u.isEnabled());
        m.put("mustChangePassword", u.isMustChangePassword());
        m.put("createdAt", u.getCreatedAt());
        return m;
    }

    @GetMapping("/users")
    public ResponseEntity<?> listUsers(HttpServletRequest request) {
        try {
            requireAdmin(request);
            List<Map<String, Object>> list = authService.listUsers().stream()
                    .map(this::userView).collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.ok("ok", list));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.warn("Admin list users failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(ApiResponse.fail("获取用户列表失败"));
        }
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        try {
            requireAdmin(request);
            String username = body.get("username") == null ? null : String.valueOf(body.get("username")).trim();
            String password = body.get("password") == null ? null : String.valueOf(body.get("password"));
            String role = body.get("role") == null ? "USER" : String.valueOf(body.get("role"));
            long quota = 0L;
            if (body.get("storageQuota") != null) {
                quota = Long.parseLong(String.valueOf(body.get("storageQuota")));
            }
            User created = authService.createUser(username, password, quota, role);
            return ResponseEntity.ok(ApiResponse.ok("用户已创建", userView(created)));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(ApiResponse.fail(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.warn("Admin create user failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(ApiResponse.fail("创建用户失败"));
        }
    }

    @PostMapping("/users/{username}/quota")
    public ResponseEntity<?> setQuota(HttpServletRequest request,
                                      @PathVariable String username,
                                      @RequestBody Map<String, Object> body) {
        try {
            requireAdmin(request);
            if (body.get("storageQuota") == null) {
                return ResponseEntity.badRequest().body(ApiResponse.fail("缺少 storageQuota"));
            }
            long quota = Long.parseLong(String.valueOf(body.get("storageQuota")));
            authService.setQuota(username, quota);
            return ResponseEntity.ok(ApiResponse.ok("配额已更新"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(ApiResponse.fail(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.warn("Admin set quota failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(ApiResponse.fail("更新配额失败"));
        }
    }

    @PostMapping("/users/{username}/enabled")
    public ResponseEntity<?> setEnabled(HttpServletRequest request,
                                        @PathVariable String username,
                                        @RequestBody Map<String, Object> body) {
        try {
            User admin = requireAdmin(request);
            if (admin.getUsername().equals(username)) {
                return ResponseEntity.badRequest().body(ApiResponse.fail("不能禁用当前登录的管理员账号"));
            }
            Object en = body.get("enabled");
            if (en == null) return ResponseEntity.badRequest().body(ApiResponse.fail("缺少 enabled"));
            boolean enabled = Boolean.parseBoolean(String.valueOf(en));
            authService.setEnabled(username, enabled);
            return ResponseEntity.ok(ApiResponse.ok(enabled ? "账号已启用" : "账号已禁用"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(ApiResponse.fail(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.warn("Admin set enabled failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(ApiResponse.fail("更新账号状态失败"));
        }
    }

    /** 管理员查看全部分享。 */
    @GetMapping("/shares")
    public ResponseEntity<?> allShares(HttpServletRequest request) {
        try {
            requireAdmin(request);
            return ResponseEntity.ok(ApiResponse.ok("ok", shareService.toViewList(shareService.listAll())));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.warn("Admin list shares failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(ApiResponse.fail("获取分享列表失败"));
        }
    }
}

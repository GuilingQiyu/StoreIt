package com.glqyu.storeit.web;

import com.glqyu.storeit.dto.ApiResponse;
import com.glqyu.storeit.mapper.InviteCodeMapper;
import com.glqyu.storeit.model.InviteCode;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/invites")
public class InviteAdminController {
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private final SecureRandom random = new SecureRandom();
    private final InviteCodeMapper inviteCodeMapper;
    private final AuthService authService;

    public InviteAdminController(InviteCodeMapper inviteCodeMapper, AuthService authService) {
        this.inviteCodeMapper = inviteCodeMapper;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> list(HttpServletRequest request) {
        User admin = requireAdmin(request);
        if (admin == null) {
            return ResponseEntity.status(403).body(ApiResponse.fail("需要管理员权限"));
        }
        List<Map<String, Object>> items = inviteCodeMapper.findAll().stream().map(this::toView).toList();
        return ResponseEntity.ok(ApiResponse.ok("邀请码列表", items));
    }

    @PostMapping
    public ResponseEntity<?> create(HttpServletRequest request, @RequestBody Map<String, Object> payload) {
        User admin = requireAdmin(request);
        if (admin == null) {
            return ResponseEntity.status(403).body(ApiResponse.fail("需要管理员权限"));
        }

        String customCode = payload.get("code") == null ? "" : String.valueOf(payload.get("code")).trim();
        String code = customCode.isEmpty() ? generateCode() : customCode;
        if (code.length() < 4 || code.length() > 64 || !code.matches("^[A-Za-z0-9_-]+$")) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("邀请码需为 4~64 位字母、数字、下划线或连字符"));
        }
        if (inviteCodeMapper.findByCode(code).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("该邀请码已存在"));
        }

        int maxUses = 1;
        if (payload.get("maxUses") != null) {
            try {
                maxUses = Integer.parseInt(String.valueOf(payload.get("maxUses")));
            } catch (NumberFormatException ignored) {}
        }

        long defaultQuota = 0L;
        if (payload.get("defaultQuota") != null) {
            try {
                defaultQuota = Math.max(0L, Long.parseLong(String.valueOf(payload.get("defaultQuota"))));
            } catch (NumberFormatException ignored) {}
        }

        Integer expireHours = 168; // default 7 days
        if (payload.get("expireHours") != null) {
            try {
                expireHours = Integer.parseInt(String.valueOf(payload.get("expireHours")));
            } catch (NumberFormatException ignored) {}
        }

        String note = payload.get("note") == null ? "" : String.valueOf(payload.get("note")).trim();
        long now = Instant.now().getEpochSecond();

        InviteCode invite = new InviteCode();
        invite.setCode(code);
        invite.setCreatedBy(admin.getUsername());
        invite.setMaxUses(maxUses <= 0 ? 0 : maxUses);
        invite.setUsedCount(0);
        invite.setDefaultQuota(defaultQuota);
        invite.setExpiresAt((expireHours == null || expireHours <= 0) ? null : now + expireHours * 3600L);
        invite.setRevoked(false);
        invite.setNote(note);
        invite.setCreatedAt(now);

        inviteCodeMapper.insert(invite);
        return ResponseEntity.ok(ApiResponse.ok("邀请码已生成", toView(invite)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(HttpServletRequest request, @PathVariable long id) {
        User admin = requireAdmin(request);
        if (admin == null) {
            return ResponseEntity.status(403).body(ApiResponse.fail("需要管理员权限"));
        }
        if (inviteCodeMapper.deleteById(id) <= 0) {
            return ResponseEntity.status(404).body(ApiResponse.fail("邀请码不存在"));
        }
        return ResponseEntity.ok(ApiResponse.ok("邀请码已删除"));
    }

    private User requireAdmin(HttpServletRequest request) {
        String name = authService.getUsernameFromRequest(request).orElse(null);
        if (name == null) return null;
        User user = authService.findUser(name).orElse(null);
        if (user == null || user.getRole() == null || !user.getRole().equalsIgnoreCase("ADMIN")) {
            return null;
        }
        return user;
    }

    private String generateCode() {
        StringBuilder sb = new StringBuilder("ST-");
        for (int i = 0; i < 8; i++) {
            if (i == 4) sb.append('-');
            sb.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }

    private Map<String, Object> toView(InviteCode ic) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", ic.getId());
        map.put("code", ic.getCode());
        map.put("createdBy", ic.getCreatedBy());
        map.put("maxUses", ic.getMaxUses());
        map.put("usedCount", ic.getUsedCount());
        map.put("defaultQuota", ic.getDefaultQuota());
        map.put("expiresAt", ic.getExpiresAt());
        map.put("revoked", ic.isRevoked());
        map.put("note", ic.getNote() == null ? "" : ic.getNote());
        map.put("createdAt", ic.getCreatedAt());
        return map;
    }
}

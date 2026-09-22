package com.glqyu.storeit.web;

import com.glqyu.storeit.dto.ApiResponse;
import com.glqyu.storeit.dto.ShareRequest;
import com.glqyu.storeit.model.FileShare;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.AuthService;
import com.glqyu.storeit.service.FileService;
import com.glqyu.storeit.service.ShareService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ShareController {
    private static final Logger log = LoggerFactory.getLogger(ShareController.class);
    private final ShareService shareService;
    private final FileService fileService;
    private final AuthService authService;

    public ShareController(ShareService shareService, FileService fileService, AuthService authService) {
        this.shareService = shareService;
        this.fileService = fileService;
        this.authService = authService;
    }

    private User getCurrentUser(HttpServletRequest request) {
        String username = authService.getUsernameFromRequest(request).orElseThrow(() -> new RuntimeException("Not logged in"));
        return authService.findUser(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/share")
    public ResponseEntity<?> createShare(HttpServletRequest request, @Valid @RequestBody ShareRequest req) {
        try {
            User user = getCurrentUser(request);
            if (!fileService.isSafePath(user, req.getFilePath())) return ResponseEntity.badRequest().body(ApiResponse.fail("无效路径"));
            FileShare s = shareService.createShare(user, req.getFilePath(), req.getExpireHours(), req.getMaxDownloads());
            return ResponseEntity.ok(ApiResponse.ok("分享链接已生成", Map.of("token", s.getToken(), "url", "/d/" + s.getToken())));
        } catch (Exception e) {
            log.warn("Create share failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(ApiResponse.fail("生成分享失败"));
        }
    }

    @GetMapping("/shares")
    public ResponseEntity<?> listShares(HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            List<Map<String, Object>> items = new ArrayList<>();
            for (FileShare share : shareService.list(user)) {
                items.add(shareView(share));
            }
            return ResponseEntity.ok(ApiResponse.ok("分享列表", items));
        } catch (Exception e) {
            log.warn("List shares failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(ApiResponse.fail("无法读取分享"));
        }
    }

    @DeleteMapping("/shares/{id}")
    public ResponseEntity<?> revokeShare(HttpServletRequest request, @PathVariable long id) {
        try {
            User user = getCurrentUser(request);
            if (!shareService.revoke(user, id)) {
                return ResponseEntity.status(404).body(ApiResponse.fail("分享不存在"));
            }
            return ResponseEntity.ok(ApiResponse.ok("分享已撤销"));
        } catch (Exception e) {
            log.warn("Revoke share failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(ApiResponse.fail("撤销失败"));
        }
    }

    private static Map<String, Object> shareView(FileShare share) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", share.getId());
        item.put("filePath", share.getFilePath() == null ? "" : share.getFilePath());
        item.put("token", share.getToken());
        item.put("url", "/d/" + share.getToken());
        item.put("expiry", share.getExpiry());
        item.put("maxDownloads", share.getMaxDownloads());
        item.put("downloads", share.getDownloads() == null ? 0 : share.getDownloads());
        item.put("createdAt", share.getCreatedAt());
        return item;
    }
}

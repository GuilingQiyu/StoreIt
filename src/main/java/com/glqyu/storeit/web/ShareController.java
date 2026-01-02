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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ShareController {
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
            return ResponseEntity.internalServerError().body(ApiResponse.fail("生成分享失败: " + e.getMessage()));
        }
    }
}

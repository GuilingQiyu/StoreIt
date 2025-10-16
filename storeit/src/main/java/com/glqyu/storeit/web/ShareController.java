package com.glqyu.storeit.web;

import com.glqyu.storeit.dto.ApiResponse;
import com.glqyu.storeit.dto.ShareRequest;
import com.glqyu.storeit.model.FileShare;
import com.glqyu.storeit.service.FileService;
import com.glqyu.storeit.service.ShareService;
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
    public ShareController(ShareService shareService, FileService fileService) { this.shareService = shareService; this.fileService = fileService; }

    @PostMapping("/share")
    public ResponseEntity<?> createShare(@Valid @RequestBody ShareRequest req) {
        try {
            if (!fileService.isSafePath(req.getFilePath())) return ResponseEntity.badRequest().body(ApiResponse.fail("无效路径"));
            FileShare s = shareService.createShare(req.getFilePath(), req.getExpireDays() == null ? 30 : req.getExpireDays(), req.getMaxDownloads());
            return ResponseEntity.ok(ApiResponse.ok("分享链接已生成", Map.of("token", s.getToken(), "url", "/d/" + s.getToken())));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.fail("生成分享失败: " + e.getMessage()));
        }
    }
}

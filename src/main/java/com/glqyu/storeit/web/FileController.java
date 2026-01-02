package com.glqyu.storeit.web;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.glqyu.storeit.dto.FileListResponse;
import com.glqyu.storeit.model.FileShare;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.AuthService;
import com.glqyu.storeit.service.FileService;
import com.glqyu.storeit.service.ShareService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class FileController {
    private final FileService fileService;
    private final ShareService shareService;
    private final AuthService authService;

    public FileController(FileService fileService, ShareService shareService, AuthService authService) {
        this.fileService = fileService;
        this.shareService = shareService;
        this.authService = authService;
    }

    private User getCurrentUser(HttpServletRequest request) {
        String username = authService.getUsernameFromRequest(request).orElseThrow(() -> new RuntimeException("Not logged in"));
        return authService.findUser(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/api/files")
    public ResponseEntity<?> list(HttpServletRequest request, @RequestParam(value = "path", required = false) String path) {
        try {
            User user = getCurrentUser(request);
            FileListResponse res = fileService.list(user, path == null ? "" : path);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/api/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(HttpServletRequest request,
                                    @RequestParam(value = "directory", required = false) String directory,
                                    @RequestParam("file") MultipartFile file) {
        try {
            User user = getCurrentUser(request);
            String saved = fileService.saveFile(user, directory == null ? "" : directory, file);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "文件上传成功",
                    "file", Map.of("name", file.getOriginalFilename(), "path", saved, "size", file.getSize())
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "上传失败: " + e.getMessage()));
        }
    }

    @GetMapping("/storage/**")
    public ResponseEntity<Resource> downloadStorage(HttpServletRequest request) throws IOException {
        try {
            User user = getCurrentUser(request);
            String uri = request.getRequestURI();
            String rel = uri.substring("/storage/".length());
            rel = java.net.URLDecoder.decode(rel, StandardCharsets.UTF_8);
            Resource r = fileService.getResource(user, rel);
            String filename = URLEncoder.encode(r.getFilename(), StandardCharsets.UTF_8);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + filename)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(r);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping("/api/file/delete")
    public ResponseEntity<?> deleteFile(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            User user = getCurrentUser(request);
            String path = payload.get("path");
            fileService.delete(user, path);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/api/file/rename")
    public ResponseEntity<?> renameFile(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            User user = getCurrentUser(request);
            String path = payload.get("path");
            String newName = payload.get("newName");
            fileService.rename(user, path, newName);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/api/folder/create")
    public ResponseEntity<?> createFolder(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            User user = getCurrentUser(request);
            String path = payload.get("path");
            fileService.createFolder(user, path);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/api/storage/usage")
    public ResponseEntity<?> getStorageUsage(HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            Map<String, Long> usage = fileService.getStorageUsage(user);
            return ResponseEntity.ok(usage);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/d/{token}")
    public ResponseEntity<?> downloadByToken(@PathVariable String token) {
        Optional<FileShare> s = shareService.validateToken(token);
        if (s.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "分享链接无效或已过期"));
        try {
            FileShare share = s.get();
            User owner = authService.findUserById(share.getUserId()).orElseThrow(() -> new IOException("Owner not found"));
            Resource r = fileService.getResource(owner, share.getFilePath());
            shareService.markDownloaded(share.getId());
            String filename = URLEncoder.encode(r.getFilename(), StandardCharsets.UTF_8);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + filename)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(r);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", "文件不存在"));
        }
    }
}

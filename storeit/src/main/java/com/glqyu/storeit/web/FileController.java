package com.glqyu.storeit.web;

import com.glqyu.storeit.dto.ApiResponse;
import com.glqyu.storeit.dto.FileListResponse;
import com.glqyu.storeit.model.FileShare;
import com.glqyu.storeit.service.FileService;
import com.glqyu.storeit.service.ShareService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;

@RestController
public class FileController {
    private final FileService fileService;
    private final ShareService shareService;
    public FileController(FileService fileService, ShareService shareService) { this.fileService = fileService; this.shareService = shareService; }

    @GetMapping("/api/files")
    public ResponseEntity<?> list(@RequestParam(value = "path", required = false) String path) {
        try {
            FileListResponse res = fileService.list(path == null ? "" : path);
            return ResponseEntity.ok(res);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/api/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(@RequestParam(value = "directory", required = false) String directory,
                                    @RequestParam("file") MultipartFile file) {
        try {
            String saved = fileService.saveFile(directory == null ? "" : directory, file);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "文件上传成功",
                    "file", Map.of("name", file.getOriginalFilename(), "path", saved, "size", file.getSize())
            ));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "上传失败: " + e.getMessage()));
        }
    }

    @GetMapping("/storage/**")
    public ResponseEntity<Resource> downloadStorage(HttpServletRequest request) throws IOException {
        String uri = request.getRequestURI();
        String rel = uri.substring("/storage/".length());
        Resource r = fileService.getResource(rel);
        String filename = URLEncoder.encode(r.getFilename(), StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + filename)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(r);
    }

    @GetMapping("/d/{token}")
    public ResponseEntity<?> downloadByToken(@PathVariable String token) {
        Optional<FileShare> s = shareService.validateToken(token);
        if (s.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "分享链接无效或已过期"));
        try {
            Resource r = fileService.getResource(s.get().getFilePath());
            shareService.markDownloaded(s.get().getId());
            String filename = URLEncoder.encode(r.getFilename(), StandardCharsets.UTF_8);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + filename)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(r);
        } catch (IOException e) {
            return ResponseEntity.status(404).body(Map.of("error", "文件不存在"));
        }
    }
}

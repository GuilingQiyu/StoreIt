package com.glqyu.storeit.web;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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
    private static final Logger log = LoggerFactory.getLogger(FileController.class);

    // 预览时单个 Range 分片的最大字节数（用于视频边下边播 / 拖动定位）
    private static final long PREVIEW_CHUNK = 2L * 1024 * 1024;

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
            log.warn("List files failed for path '{}': {}", path, e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "无法读取目录"));
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
        } catch (com.glqyu.storeit.service.QuotaExceededException e) {
            log.warn("Upload rejected by quota into '{}': {}", directory, e.getMessage());
            return ResponseEntity.status(413).body(Map.of("error", e.getMessage(), "code", "QUOTA_EXCEEDED"));
        } catch (Exception e) {
            log.warn("Upload failed into '{}': {}", directory, e.toString());
            String msg = e.getMessage() != null && e.getMessage().contains("磁盘空间不足") ? "磁盘空间不足" : "上传失败";
            return ResponseEntity.internalServerError().body(Map.of("error", msg));
        }
    }

    @GetMapping("/storage/**")
    public ResponseEntity<Resource> downloadStorage(HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            String rel = decodeStoragePath(request, "/storage/");
            Resource r = fileService.getResource(user, rel);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, attachment(r.getFilename()))
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(r);
        } catch (Exception e) {
            log.warn("Download failed: {}", e.toString());
            return ResponseEntity.status(404).build();
        }
    }

    /**
     * 内联预览（图片/视频/文本等）。设置正确的 Content-Type 与 inline 处置，
     * 并支持 HTTP Range 请求，使视频可以拖动定位、按需加载。
     */
    @GetMapping("/api/preview")
    public ResponseEntity<?> preview(HttpServletRequest request,
                                     @RequestParam("path") String path,
                                     @RequestHeader(value = HttpHeaders.RANGE, required = false) String rangeHeader) {
        try {
            User user = getCurrentUser(request);
            Resource r = fileService.getResource(user, path);
            long length = r.contentLength();
            MediaType mediaType = MediaType.parseMediaType(fileService.detectContentType(r.getFilename()));

            if (rangeHeader == null) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                        .header(HttpHeaders.CONTENT_DISPOSITION, inline(r.getFilename()))
                        .contentType(mediaType)
                        .contentLength(length)
                        .body(r);
            }

            List<HttpRange> ranges = HttpRange.parseRanges(rangeHeader);
            HttpRange range = ranges.isEmpty() ? null : ranges.get(0);
            if (range == null) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                        .contentType(mediaType)
                        .contentLength(length)
                        .body(r);
            }
            long start = range.getRangeStart(length);
            long end = range.getRangeEnd(length);
            // 限制单次响应分片大小（视频边下边播会发起多次 Range 请求）
            end = Math.min(end, start + PREVIEW_CHUNK - 1);
            end = Math.min(end, length - 1);
            int chunk = (int) (end - start + 1);
            byte[] data = new byte[chunk];
            try (java.io.RandomAccessFile raf = new java.io.RandomAccessFile(r.getFile(), "r")) {
                raf.seek(start);
                raf.readFully(data);
            }
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + length)
                    .header(HttpHeaders.CONTENT_DISPOSITION, inline(r.getFilename()))
                    .contentType(mediaType)
                    .contentLength(chunk)
                    .body(data);
        } catch (Exception e) {
            log.warn("Preview failed for '{}': {}", path, e.toString());
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping("/api/file/delete")
    public ResponseEntity<?> deleteFile(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            User user = getCurrentUser(request);
            fileService.delete(user, payload.get("path"));
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            log.warn("Delete failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "删除失败"));
        }
    }

    @PostMapping("/api/file/rename")
    public ResponseEntity<?> renameFile(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            User user = getCurrentUser(request);
            fileService.rename(user, payload.get("path"), payload.get("newName"));
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            log.warn("Rename failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "重命名失败"));
        }
    }

    @PostMapping("/api/folder/create")
    public ResponseEntity<?> createFolder(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            User user = getCurrentUser(request);
            fileService.createFolder(user, payload.get("path"));
            return ResponseEntity.ok(Map.of("success", true));
        } catch (com.glqyu.storeit.service.QuotaExceededException e) {
            log.warn("Create folder rejected by quota: {}", e.getMessage());
            return ResponseEntity.status(413).body(Map.of("error", e.getMessage(), "code", "QUOTA_EXCEEDED"));
        } catch (Exception e) {
            log.warn("Create folder failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "创建失败"));
        }
    }

    @GetMapping("/api/storage/usage")
    public ResponseEntity<?> getStorageUsage(HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            return ResponseEntity.ok(fileService.getStorageUsage(user));
        } catch (Exception e) {
            log.warn("Storage usage failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(Map.of("error", "无法获取存储用量"));
        }
    }

    @GetMapping("/d/{token}")
    public ResponseEntity<?> downloadByToken(@PathVariable String token) {
        Optional<FileShare> s = shareService.validateToken(token);
        if (s.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "分享链接无效或已过期"));
        FileShare share = s.get();
        // 原子化扣减下载额度，避免并发下超出 maxDownloads
        if (!shareService.consumeDownload(share.getId())) {
            return ResponseEntity.status(404).body(Map.of("error", "分享链接无效或已过期"));
        }
        try {
            User owner = authService.findUserById(share.getUserId()).orElseThrow(() -> new IOException("Owner not found"));
            Resource r = fileService.getResource(owner, share.getFilePath());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, attachment(r.getFilename()))
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(r);
        } catch (Exception e) {
            log.warn("Shared download failed for token: {}", e.toString());
            return ResponseEntity.status(404).body(Map.of("error", "文件不存在"));
        }
    }

    // --- helpers ---

    private String decodeStoragePath(HttpServletRequest request, String prefix) {
        String rel = request.getRequestURI().substring(prefix.length());
        return java.net.URLDecoder.decode(rel, StandardCharsets.UTF_8);
    }

    private String attachment(String filename) {
        return "attachment; filename*=UTF-8''" + encode(filename);
    }

    private String inline(String filename) {
        return "inline; filename*=UTF-8''" + encode(filename);
    }

    private String encode(String filename) {
        return URLEncoder.encode(filename == null ? "file" : filename, StandardCharsets.UTF_8);
    }
}

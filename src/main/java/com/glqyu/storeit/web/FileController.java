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
import org.springframework.web.bind.annotation.DeleteMapping;
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
                                    @RequestParam(value = "conflictStrategy", required = false, defaultValue = "rename") String conflictStrategy,
                                    @RequestParam("file") MultipartFile file) {
        try {
            User user = getCurrentUser(request);
            String saved = fileService.saveFile(user, directory == null ? "" : directory, file, conflictStrategy);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "文件上传成功",
                    "file", Map.of("name", file.getOriginalFilename(), "path", saved, "size", file.getSize())
            ));
        } catch (IOException e) {
            if (FileService.QUOTA_EXCEEDED.equals(e.getMessage())) {
                log.warn("Upload rejected by quota into '{}'", directory);
                return ResponseEntity.badRequest().body(Map.of("error", FileService.QUOTA_EXCEEDED));
            }
            log.warn("Upload failed into '{}': {}", directory, e.toString());
            return ResponseEntity.internalServerError().body(Map.of("error", "上传失败"));
        } catch (Exception e) {
            log.warn("Upload failed into '{}': {}", directory, e.toString());
            return ResponseEntity.internalServerError().body(Map.of("error", "上传失败"));
        }
    }

    private static final java.util.regex.Pattern SAFE_UPLOAD_ID =
            java.util.regex.Pattern.compile("^[A-Za-z0-9_-]{1,64}$");

    private java.nio.file.Path resolveChunksDir(User user, String uploadId) throws IOException {
        if (uploadId == null || !SAFE_UPLOAD_ID.matcher(uploadId).matches()) {
            throw new IllegalArgumentException("无效的 uploadId");
        }
        java.nio.file.Path chunksBase = java.nio.file.Paths
                .get(fileService.getResourceForUser(user, "").getFile().getAbsolutePath())
                .resolve(".chunks")
                .toAbsolutePath()
                .normalize();
        java.nio.file.Path target = chunksBase.resolve(uploadId).normalize();
        if (!target.startsWith(chunksBase) || target.equals(chunksBase)) {
            throw new IllegalArgumentException("无效的 uploadId");
        }
        return target;
    }

    @PostMapping("/api/upload/init")
    public ResponseEntity<?> initUpload(HttpServletRequest request, @RequestBody Map<String, Object> payload) {
        try {
            User user = getCurrentUser(request);
            String fileName = payload.get("fileName") != null ? String.valueOf(payload.get("fileName")) : "";
            long fileSize = Long.parseLong(String.valueOf(payload.get("fileSize")));
            String directory = payload.get("directory") != null ? String.valueOf(payload.get("directory")) : "";
            String conflictStrategy = payload.get("conflictStrategy") != null
                    ? String.valueOf(payload.get("conflictStrategy")) : "rename";

            fileService.validateUploadInit(user, directory, fileName, fileSize, conflictStrategy);

            String uploadId = java.util.UUID.randomUUID().toString();
            long chunkSize = 5L * 1024 * 1024;
            int totalChunks = Math.max(1, (int) Math.ceil((double) fileSize / chunkSize));

            java.nio.file.Path userChunksDir = resolveChunksDir(user, uploadId);
            java.nio.file.Files.createDirectories(userChunksDir);

            Map<String, Object> meta = new java.util.HashMap<>();
            meta.put("uploadId", uploadId);
            meta.put("fileName", fileName);
            meta.put("fileSize", fileSize);
            meta.put("directory", directory);
            meta.put("conflictStrategy", conflictStrategy);
            meta.put("chunkSize", chunkSize);
            meta.put("totalChunks", totalChunks);

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            mapper.writeValue(userChunksDir.resolve("meta.json").toFile(), meta);

            return ResponseEntity.ok(Map.of("uploadId", uploadId, "chunkSize", chunkSize, "totalChunks", totalChunks));
        } catch (IOException e) {
            if (FileService.QUOTA_EXCEEDED.equals(e.getMessage())) {
                return ResponseEntity.badRequest().body(Map.of("error", FileService.QUOTA_EXCEEDED));
            }
            if ("unsafe path".equals(e.getMessage()) || "无效路径".equals(e.getMessage())) {
                return ResponseEntity.badRequest().body(Map.of("error", "无效路径"));
            }
            log.warn("Init upload failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(Map.of("error", "初始化上传失败"));
        } catch (Exception e) {
            log.warn("Init upload failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "初始化上传失败"));
        }
    }

    @PostMapping(value = "/api/upload/chunk", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadChunk(HttpServletRequest request,
                                         @RequestParam("uploadId") String uploadId,
                                         @RequestParam("chunkIndex") int chunkIndex,
                                         @RequestParam("chunk") MultipartFile chunk) {
        try {
            User user = getCurrentUser(request);
            if (chunkIndex < 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "无效的分片索引"));
            }
            java.nio.file.Path userChunksDir = resolveChunksDir(user, uploadId);
            if (!java.nio.file.Files.exists(userChunksDir.resolve("meta.json"))) {
                return ResponseEntity.badRequest().body(Map.of("error", "上传会话无效"));
            }
            chunk.transferTo(userChunksDir.resolve(chunkIndex + ".part"));
            return ResponseEntity.ok(Map.of("success", true, "chunkIndex", chunkIndex));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "上传会话无效"));
        } catch (Exception e) {
            log.warn("Upload chunk failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(Map.of("error", "分片上传失败"));
        }
    }

    @PostMapping("/api/upload/complete")
    public ResponseEntity<?> completeUpload(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            User user = getCurrentUser(request);
            String uploadId = payload.get("uploadId");
            java.nio.file.Path userChunksDir = resolveChunksDir(user, uploadId);

            if (!java.nio.file.Files.exists(userChunksDir.resolve("meta.json"))) {
                return ResponseEntity.badRequest().body(Map.of("error", "上传会话无效"));
            }

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            Map<String, Object> meta = mapper.readValue(userChunksDir.resolve("meta.json").toFile(), Map.class);

            String fileName = (String) meta.get("fileName");
            String directory = (String) meta.get("directory");
            String conflictStrategy = meta.get("conflictStrategy") != null
                    ? String.valueOf(meta.get("conflictStrategy")) : "rename";
            int totalChunks = (Integer) meta.get("totalChunks");
            long fileSize = Long.parseLong(meta.get("fileSize").toString());

            String saved = fileService.saveChunkedFile(user, directory, fileName, userChunksDir, totalChunks, fileSize, conflictStrategy);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "文件上传成功",
                    "file", Map.of("name", fileName, "path", saved, "size", fileSize)
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "上传会话无效"));
        } catch (IOException e) {
            if (FileService.QUOTA_EXCEEDED.equals(e.getMessage())) {
                return ResponseEntity.badRequest().body(Map.of("error", FileService.QUOTA_EXCEEDED));
            }
            log.warn("Complete upload failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(Map.of("error", "合并文件失败"));
        } catch (Exception e) {
            log.warn("Complete upload failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(Map.of("error", "合并文件失败"));
        }
    }

    @GetMapping("/api/upload/status")
    public ResponseEntity<?> getUploadStatus(HttpServletRequest request, @RequestParam("uploadId") String uploadId) {
        try {
            User user = getCurrentUser(request);
            java.nio.file.Path userChunksDir = resolveChunksDir(user, uploadId);

            if (!java.nio.file.Files.exists(userChunksDir.resolve("meta.json"))) {
                return ResponseEntity.badRequest().body(Map.of("error", "上传会话无效"));
            }

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            Map<String, Object> meta = mapper.readValue(userChunksDir.resolve("meta.json").toFile(), Map.class);

            List<Integer> uploadedChunks = new java.util.ArrayList<>();
            try (java.util.stream.Stream<java.nio.file.Path> stream = java.nio.file.Files.list(userChunksDir)) {
                stream.forEach(p -> {
                    String name = p.getFileName().toString();
                    if (name.endsWith(".part")) {
                        uploadedChunks.add(Integer.parseInt(name.substring(0, name.length() - 5)));
                    }
                });
            }
            java.util.Collections.sort(uploadedChunks);
            meta.put("uploadedChunks", uploadedChunks);

            return ResponseEntity.ok(meta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "上传会话无效"));
        } catch (Exception e) {
            log.warn("Get upload status failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(Map.of("error", "获取上传状态失败"));
        }
    }

    @DeleteMapping("/api/upload/{uploadId}")
    public ResponseEntity<?> cancelUpload(HttpServletRequest request, @PathVariable("uploadId") String uploadId) {
        try {
            User user = getCurrentUser(request);
            java.nio.file.Path userChunksDir = resolveChunksDir(user, uploadId);
            if (java.nio.file.Files.exists(userChunksDir)) {
                org.springframework.util.FileSystemUtils.deleteRecursively(userChunksDir);
            }
            return ResponseEntity.ok(Map.of("success", true, "message", "上传任务已取消并清理"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "上传会话无效"));
        } catch (Exception e) {
            log.warn("Cancel upload failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(Map.of("error", "取消上传失败"));
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
            String filename = r.getFilename();

            if (length == 0) {
                return previewResponse(HttpStatus.OK, filename)
                        .contentLength(0)
                        .body(new byte[0]);
            }
            if (rangeHeader == null) {
                return previewResponse(HttpStatus.OK, filename)
                        .contentLength(length)
                        .body(r);
            }

            List<HttpRange> ranges = HttpRange.parseRanges(rangeHeader);
            HttpRange range = ranges.isEmpty() ? null : ranges.get(0);
            if (range == null) {
                return previewResponse(HttpStatus.OK, filename)
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
            return previewResponse(HttpStatus.PARTIAL_CONTENT, filename)
                    .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + length)
                    .contentLength(chunk)
                    .body(data);
        } catch (Exception e) {
            log.warn("Preview failed for '{}': {}", path, e.toString());
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/api/files/recent")
    public ResponseEntity<?> recent(HttpServletRequest request) {
        try {
            return ResponseEntity.ok(fileService.recent(getCurrentUser(request), 50));
        } catch (Exception e) {
            log.warn("Recent files failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "无法读取最近文件"));
        }
    }

    @GetMapping("/api/files/search")
    public ResponseEntity<?> search(HttpServletRequest request, @RequestParam(value = "q", required = false) String query) {
        try {
            return ResponseEntity.ok(fileService.search(getCurrentUser(request), query));
        } catch (Exception e) {
            log.warn("Search failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "搜索失败"));
        }
    }

    @PostMapping("/api/file/move")
    public ResponseEntity<?> moveFile(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            User user = getCurrentUser(request);
            String moved = fileService.move(user, payload.get("path"), payload.get("destination"));
            return ResponseEntity.ok(Map.of("success", true, "path", moved));
        } catch (IOException e) {
            String message = e.getMessage();
            if (FileService.MOVE_INTO_SELF.equals(message) || FileService.MOVE_EXISTS.equals(message)
                    || FileService.MOVE_DEST_MISSING.equals(message) || "无效路径".equals(message)) {
                return ResponseEntity.badRequest().body(Map.of("error", message));
            }
            log.warn("Move failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "移动失败"));
        } catch (Exception e) {
            log.warn("Move failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "移动失败"));
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
        } catch (Exception e) {
            log.warn("Create folder failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "创建失败"));
        }
    }

    @PostMapping("/api/folder/resolve-conflict")
    public ResponseEntity<?> resolveFolderConflict(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            User user = getCurrentUser(request);
            String parentPath = payload.getOrDefault("parentPath", "");
            String folderName = payload.getOrDefault("folderName", "");
            String strategy = payload.getOrDefault("strategy", "merge");
            Map<String, String> resolved = fileService.resolveFolderConflict(user, parentPath, folderName, strategy);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "folderName", resolved.get("folderName"),
                    "targetPath", resolved.get("targetPath")
            ));
        } catch (Exception e) {
            log.warn("Resolve folder conflict failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "处理同名文件夹冲突失败"));
        }
    }

    @GetMapping("/api/file/content")
    public ResponseEntity<?> getFileContent(HttpServletRequest request, @RequestParam("path") String path) {
        try {
            User user = getCurrentUser(request);
            return ResponseEntity.ok(fileService.readTextFile(user, path));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "读取文本内容失败"));
        } catch (Exception e) {
            log.warn("Read text file failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "读取文本内容失败"));
        }
    }

    @org.springframework.web.bind.annotation.RequestMapping(
            value = "/api/file/content",
            method = {org.springframework.web.bind.annotation.RequestMethod.PUT, org.springframework.web.bind.annotation.RequestMethod.POST}
    )
    public ResponseEntity<?> saveFileContent(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            User user = getCurrentUser(request);
            String path = payload.get("path");
            String content = payload.getOrDefault("content", "");
            Map<String, Object> saved = fileService.saveTextFile(user, path, content);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "文件已保存",
                    "file", saved
            ));
        } catch (IOException e) {
            if (FileService.QUOTA_EXCEEDED.equals(e.getMessage())) {
                return ResponseEntity.badRequest().body(Map.of("error", FileService.QUOTA_EXCEEDED));
            }
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "保存文件失败"));
        } catch (Exception e) {
            log.warn("Save text file failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "保存文件失败"));
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

    @PostMapping("/api/file/batch-delete")
    public ResponseEntity<?> batchDelete(HttpServletRequest request, @RequestBody Map<String, List<String>> payload) {
        try {
            User user = getCurrentUser(request);
            List<String> paths = payload.getOrDefault("paths", List.of());
            int deleted = 0;
            for (String p : paths) {
                if (p != null && !p.isBlank()) {
                    fileService.delete(user, p);
                    deleted++;
                }
            }
            return ResponseEntity.ok(Map.of("success", true, "deleted", deleted));
        } catch (Exception e) {
            log.warn("Batch delete failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "批量删除失败"));
        }
    }

    @PostMapping("/api/file/batch-move")
    public ResponseEntity<?> batchMove(HttpServletRequest request, @RequestBody Map<String, Object> payload) {
        try {
            User user = getCurrentUser(request);
            @SuppressWarnings("unchecked")
            List<String> paths = (List<String>) payload.getOrDefault("paths", List.of());
            String destination = payload.get("destination") != null ? String.valueOf(payload.get("destination")) : "";
            int moved = 0;
            for (String p : paths) {
                if (p != null && !p.isBlank()) {
                    fileService.move(user, p, destination);
                    moved++;
                }
            }
            return ResponseEntity.ok(Map.of("success", true, "moved", moved));
        } catch (IOException e) {
            String message = e.getMessage();
            if (FileService.MOVE_INTO_SELF.equals(message) || FileService.MOVE_EXISTS.equals(message)
                    || FileService.MOVE_DEST_MISSING.equals(message) || "无效路径".equals(message)) {
                return ResponseEntity.badRequest().body(Map.of("error", message));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "批量移动失败"));
        } catch (Exception e) {
            log.warn("Batch move failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "批量移动失败"));
        }
    }

    @org.springframework.web.bind.annotation.RequestMapping(
            value = "/d/{token}",
            method = {org.springframework.web.bind.annotation.RequestMethod.GET, org.springframework.web.bind.annotation.RequestMethod.HEAD}
    )
    public ResponseEntity<?> downloadByToken(HttpServletRequest request, @PathVariable String token) {
        Optional<FileShare> s = shareService.validateToken(token);
        if (s.isEmpty()) return shareErrorResponse(request, "分享链接无效或已过期");
        FileShare share = s.get();
        Resource resource;
        try {
            User owner = authService.findUserById(share.getUserId()).orElseThrow(() -> new IOException("Owner not found"));
            resource = fileService.getResource(owner, share.getFilePath());
            if (!resource.exists() || !resource.isReadable()) {
                return shareErrorResponse(request, "文件不存在");
            }
        } catch (Exception e) {
            log.warn("Shared download failed for token: {}", e.toString());
            return shareErrorResponse(request, "文件不存在");
        }
        // 对 HEAD 请求或社交软件链接预览爬虫（Link Preview Bot）仅返回头部，不扣减下载次数
        if ("HEAD".equalsIgnoreCase(request.getMethod()) || isLinkPreviewBot(request)) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, attachment(resource.getFilename()))
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .build();
        }
        // 文件确认可读后再原子扣减，避免文件已删除仍消耗次数
        if (!shareService.consumeDownload(share.getId())) {
            return shareErrorResponse(request, "分享链接无效或已过期");
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, attachment(resource.getFilename()))
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    private boolean isLinkPreviewBot(HttpServletRequest request) {
        String ua = request.getHeader(HttpHeaders.USER_AGENT);
        if (ua == null || ua.isBlank()) return false;
        String lower = ua.toLowerCase();
        return lower.contains("telegrambot") || lower.contains("discordbot") || lower.contains("twitterbot")
                || lower.contains("slackbot") || lower.contains("whatsapp") || lower.contains("facebookexternalhit")
                || lower.contains("linkedinbot") || lower.contains("skypeuripreview");
    }

    private ResponseEntity<?> shareErrorResponse(HttpServletRequest request, String message) {
        String accept = request.getHeader(HttpHeaders.ACCEPT);
        if (accept != null && accept.contains("text/html") && !accept.contains("application/json")) {
            String html = "<!DOCTYPE html><html lang=\"zh-CN\"><head><meta charset=\"UTF-8\">"
                    + "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
                    + "<title>分享链接失效 - 储之 StoreIt</title>"
                    + "<style>*{margin:0;padding:0;box-sizing:border-box}body{min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;background:linear-gradient(135deg,#f2e9e4 0%,#e9dfe1 50%,#c9ada7 100%);color:#22223b}.card{text-align:center;background:rgba(255,255,255,0.92);border:1px solid rgba(255,255,255,0.6);border-radius:24px;padding:48px 40px;max-width:420px;margin:16px;box-shadow:0 20px 50px -20px rgba(34,34,59,0.2)}.code{font-size:56px;font-weight:800;color:#4a4e69;line-height:1}h1{font-size:20px;margin:14px 0 8px}p{font-size:14px;color:#64748b;margin-bottom:26px}a{display:inline-block;padding:10px 24px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600;background:#22223b;color:#fff}</style>"
                    + "</head><body><div class=\"card\"><div class=\"code\">404</div><h1>" + message + "</h1>"
                    + "<p>该分享可能已到期、达到最大下载次数或源文件已被移除。</p>"
                    + "<a href=\"/\">返回储之首页</a></div></body></html>";
            return ResponseEntity.status(404)
                    .contentType(MediaType.parseMediaType("text/html; charset=UTF-8"))
                    .body(html);
        }
        return ResponseEntity.status(404).body(Map.of("error", message));
    }

    // --- helpers ---

    private String decodeStoragePath(HttpServletRequest request, String prefix) {
        String rel = request.getRequestURI().substring(prefix.length());
        return java.net.URLDecoder.decode(rel, StandardCharsets.UTF_8);
    }

    private ResponseEntity.BodyBuilder previewResponse(HttpStatus status, String filename) {
        return ResponseEntity.status(status)
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .header(HttpHeaders.CONTENT_DISPOSITION, inline(filename))
                .contentType(fileService.previewMediaType(filename));
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

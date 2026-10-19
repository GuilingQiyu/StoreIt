package com.glqyu.storeit.web;

import com.glqyu.storeit.dto.ApiResponse;
import com.glqyu.storeit.dto.FileListResponse;
import com.glqyu.storeit.dto.ShareRequest;
import com.glqyu.storeit.mapper.ShareMountMapper;
import com.glqyu.storeit.model.FileShare;
import com.glqyu.storeit.model.ShareMount;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.AuthService;
import com.glqyu.storeit.service.FileService;
import com.glqyu.storeit.service.ShareService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(
        origins = "*",
        allowedHeaders = {"Content-Type", "X-StoreIt-Share-Password", "Range", "Accept"},
        exposedHeaders = {"Content-Range", "Accept-Ranges", "Content-Disposition"},
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class ShareController {
    private static final Logger log = LoggerFactory.getLogger(ShareController.class);
    private static final long PREVIEW_CHUNK = 2L * 1024 * 1024;

    private final ShareService shareService;
    private final FileService fileService;
    private final AuthService authService;
    private final ShareMountMapper shareMountMapper;

    public ShareController(ShareService shareService,
                           FileService fileService,
                           AuthService authService,
                           ShareMountMapper shareMountMapper) {
        this.shareService = shareService;
        this.fileService = fileService;
        this.authService = authService;
        this.shareMountMapper = shareMountMapper;
    }

    private User getCurrentUser(HttpServletRequest request) {
        String username = authService.getUsernameFromRequest(request).orElseThrow(() -> new RuntimeException("Not logged in"));
        return authService.findUser(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/share")
    public ResponseEntity<?> createShare(HttpServletRequest request, @Valid @RequestBody ShareRequest req) {
        try {
            User user = getCurrentUser(request);
            if (!fileService.isSafePath(user, req.getFilePath())) {
                return ResponseEntity.badRequest().body(ApiResponse.fail("无效路径"));
            }
            Resource targetRes = fileService.getResourceForUser(user, req.getFilePath());
            if (!targetRes.exists()) {
                return ResponseEntity.badRequest().body(ApiResponse.fail("要分享的文件或目录不存在"));
            }
            boolean isDir = targetRes.getFile().isDirectory();
            FileShare s = shareService.createShare(
                    user,
                    req.getFilePath(),
                    req.getExpireHours(),
                    req.getMaxDownloads(),
                    isDir,
                    req.getPermission(),
                    req.getAccessPassword(),
                    req.getTitle()
            );
            Map<String, Object> result = shareView(s);
            return ResponseEntity.ok(ApiResponse.ok("分享链接已生成", result));
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

    // ==================== 共享挂载管理 (本机与跨服务器 SFSP/1.0 协议挂载) ====================

    @GetMapping("/shares/mounts")
    public ResponseEntity<?> listMounts(HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            List<ShareMount> mounts = shareMountMapper.findByUserId(user.getId());
            return ResponseEntity.ok(ApiResponse.ok("已挂载的共享列表", mounts));
        } catch (Exception e) {
            log.warn("List share mounts failed: {}", e.toString());
            return ResponseEntity.internalServerError().body(ApiResponse.fail("无法读取已挂载共享"));
        }
    }

    @PostMapping("/shares/mounts")
    public ResponseEntity<?> createMount(HttpServletRequest request, @RequestBody Map<String, Object> payload) {
        try {
            User user = getCurrentUser(request);
            String rawInput = payload.get("shareLinkOrToken") == null ? "" : String.valueOf(payload.get("shareLinkOrToken")).trim();
            String password = payload.get("accessPassword") == null ? "" : String.valueOf(payload.get("accessPassword")).trim();
            String customName = payload.get("mountName") == null ? "" : String.valueOf(payload.get("mountName")).trim();

            if (rawInput.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.fail("请输入分享链接、Token 或跨服挂载 URI"));
            }

            ParsedShareRef parsed = parseShareReference(rawInput, request);
            if (parsed.token.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.fail("无法从输入中解析有效的分享 Token"));
            }
            if (password.isEmpty() && !parsed.extractedPassword.isEmpty()) {
                password = parsed.extractedPassword;
            }

            ShareMount mount = new ShareMount();
            mount.setUserId(user.getId());
            mount.setRemoteServerUrl(parsed.remoteServerUrl);
            mount.setShareToken(parsed.token);
            mount.setAccessPassword(password.isEmpty() ? null : password);
            mount.setCreatedAt(Instant.now().getEpochSecond());

            if (parsed.remoteServerUrl.isEmpty()) {
                // 本机共享：直接校验有效性并读取真实元数据
                Optional<FileShare> shareOpt = shareService.validateToken(parsed.token);
                if (shareOpt.isEmpty()) {
                    return ResponseEntity.status(404).body(ApiResponse.fail("该本机分享链接不存在或已过期"));
                }
                FileShare share = shareOpt.get();
                if (!shareService.checkPassword(share, password)) {
                    return ResponseEntity.status(403).body(ApiResponse.fail("访问提取码不正确"));
                }
                Optional<User> ownerOpt = authService.findUserById(share.getUserId());
                String defaultName = share.getFilePath().contains("/")
                        ? share.getFilePath().substring(share.getFilePath().lastIndexOf('/') + 1)
                        : share.getFilePath();
                if (share.getTitle() != null && !share.getTitle().isBlank()) {
                    defaultName = share.getTitle();
                }
                mount.setMountName(customName.isEmpty() ? defaultName : customName);
                mount.setPermission(share.getPermission());
                mount.setOwnerName(ownerOpt.map(User::getUsername).orElse("unknown"));
                mount.setDirectory(share.isDirectory());
            } else {
                // 跨服务器 SFSP 挂载：保存远端服务器地址与 Token
                String fallbackName = customName.isEmpty() ? ("跨服共享-" + parsed.token.substring(0, Math.min(6, parsed.token.length()))) : customName;
                String perm = payload.get("permission") != null ? ShareService.normalizePermission(String.valueOf(payload.get("permission"))) : "READ_WRITE";
                String ownerName = payload.get("ownerName") != null ? String.valueOf(payload.get("ownerName")) : parsed.remoteServerUrl;
                boolean isDir = payload.get("isDirectory") == null || Boolean.parseBoolean(String.valueOf(payload.get("isDirectory")));
                mount.setMountName(fallbackName);
                mount.setPermission(perm);
                mount.setOwnerName(ownerName);
                mount.setDirectory(isDir);
            }

            shareMountMapper.insert(mount);
            return ResponseEntity.ok(ApiResponse.ok("共享已加载并挂载", mount));
        } catch (Exception e) {
            log.warn("Create share mount failed: {}", e.toString());
            return ResponseEntity.badRequest().body(ApiResponse.fail("挂载共享失败: " + e.getMessage()));
        }
    }

    @DeleteMapping("/shares/mounts/{id}")
    public ResponseEntity<?> deleteMount(HttpServletRequest request, @PathVariable long id) {
        try {
            User user = getCurrentUser(request);
            if (shareMountMapper.deleteByIdAndUser(id, user.getId()) <= 0) {
                return ResponseEntity.status(404).body(ApiResponse.fail("挂载记录不存在"));
            }
            return ResponseEntity.ok(ApiResponse.ok("已移除挂载的共享"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("移除失败"));
        }
    }

    // ==================== StoreIt Federated Share Protocol (SFSP/1.0) 跨服与共享文件夹读写接口 ====================

    @GetMapping("/fed/shares/{token}/manifest")
    public ResponseEntity<?> getShareManifest(@PathVariable String token,
                                              @RequestParam(value = "password", required = false) String queryPwd,
                                              @RequestHeader(value = "X-StoreIt-Share-Password", required = false) String headerPwd) {
        try {
            ResolvedShare rs = resolveAndAuthorize(token, queryPwd != null ? queryPwd : headerPwd, false);
            String name = rs.share.getFilePath().contains("/")
                    ? rs.share.getFilePath().substring(rs.share.getFilePath().lastIndexOf('/') + 1)
                    : rs.share.getFilePath();
            if (rs.share.getTitle() != null && !rs.share.getTitle().isBlank()) {
                name = rs.share.getTitle();
            }
            Map<String, Object> manifest = new LinkedHashMap<>();
            manifest.put("protocol", "SFSP/1.0");
            manifest.put("token", rs.share.getToken());
            manifest.put("name", name);
            manifest.put("filePath", rs.share.getFilePath());
            manifest.put("isDirectory", rs.share.isDirectory());
            manifest.put("permission", rs.share.getPermission());
            manifest.put("passwordProtected", rs.share.getAccessPassword() != null && !rs.share.getAccessPassword().isBlank());
            manifest.put("ownerUsername", rs.owner.getUsername());
            manifest.put("expiry", rs.share.getExpiry());
            manifest.put("maxDownloads", rs.share.getMaxDownloads());
            manifest.put("downloads", rs.share.getDownloads() == null ? 0 : rs.share.getDownloads());
            return ResponseEntity.ok(manifest);
        } catch (ShareAccessException e) {
            return ResponseEntity.status(e.status).body(Map.of(
                    "error", e.getMessage(),
                    "passwordRequired", e.passwordRequired
            ));
        }
    }

    @GetMapping("/fed/shares/{token}/list")
    public ResponseEntity<?> listSharedFolder(@PathVariable String token,
                                              @RequestParam(value = "subPath", required = false, defaultValue = "") String subPath,
                                              @RequestParam(value = "password", required = false) String queryPwd,
                                              @RequestHeader(value = "X-StoreIt-Share-Password", required = false) String headerPwd) {
        try {
            ResolvedShare rs = resolveAndAuthorize(token, queryPwd != null ? queryPwd : headerPwd, false);
            String cleanSub = sanitizeSubPath(subPath);
            if (!rs.share.isDirectory()) {
                Resource res = fileService.getResourceForUser(rs.owner, rs.share.getFilePath());
                if (!res.exists()) {
                    return ResponseEntity.status(404).body(Map.of("error", "被分享的文件已不存在"));
                }
                Map<String, Object> single = new LinkedHashMap<>();
                single.put("name", res.getFilename());
                single.put("path", "");
                single.put("isDirectory", false);
                single.put("size", res.contentLength());
                single.put("modifiedTime", res.getFile().lastModified() / 1000);
                return ResponseEntity.ok(Map.of(
                        "currentSubPath", "",
                        "permission", rs.share.getPermission(),
                        "isDirectory", false,
                        "items", List.of(single)
                ));
            }

            String targetOwnerRel = joinSharePath(rs.share.getFilePath(), cleanSub);
            if (!fileService.isSafePath(rs.owner, targetOwnerRel)) {
                return ResponseEntity.badRequest().body(Map.of("error", "无效子路径"));
            }
            FileListResponse listRes = fileService.list(rs.owner, targetOwnerRel);
            String basePrefix = rs.share.getFilePath() + "/";
            List<Map<String, Object>> items = new ArrayList<>();
            for (FileListResponse.Item it : listRes.getItems()) {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("name", it.getName());
                String relInsideShare = it.getPath().startsWith(basePrefix)
                        ? it.getPath().substring(basePrefix.length())
                        : (cleanSub.isEmpty() ? it.getName() : cleanSub + "/" + it.getName());
                row.put("path", relInsideShare);
                row.put("isDirectory", it.isDirectory());
                row.put("size", it.getSize());
                row.put("modifiedTime", it.getModifiedTime());
                items.add(row);
            }
            return ResponseEntity.ok(Map.of(
                    "currentSubPath", cleanSub,
                    "permission", rs.share.getPermission(),
                    "isDirectory", true,
                    "items", items
            ));
        } catch (ShareAccessException e) {
            return ResponseEntity.status(e.status).body(Map.of("error", e.getMessage(), "passwordRequired", e.passwordRequired));
        } catch (Exception e) {
            log.warn("List shared folder failed: {}", e.toString());
            return ResponseEntity.badRequest().body(Map.of("error", "无法读取共享目录"));
        }
    }

    @GetMapping("/fed/shares/{token}/preview")
    public ResponseEntity<?> previewSharedFile(@PathVariable String token,
                                               @RequestParam(value = "subPath", required = false, defaultValue = "") String subPath,
                                               @RequestParam(value = "password", required = false) String queryPwd,
                                               @RequestHeader(value = "X-StoreIt-Share-Password", required = false) String headerPwd,
                                               @RequestHeader(value = HttpHeaders.RANGE, required = false) String rangeHeader) {
        try {
            ResolvedShare rs = resolveAndAuthorize(token, queryPwd != null ? queryPwd : headerPwd, false);
            String targetOwnerRel = rs.share.isDirectory()
                    ? joinSharePath(rs.share.getFilePath(), sanitizeSubPath(subPath))
                    : rs.share.getFilePath();
            Resource r = fileService.getResourceForUser(rs.owner, targetOwnerRel);
            if (!r.exists() || r.getFile().isDirectory()) {
                return ResponseEntity.status(404).build();
            }
            long length = r.contentLength();
            String filename = r.getFilename();
            MediaType mediaType = fileService.previewMediaType(filename);

            if (length == 0 || rangeHeader == null) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename*=UTF-8''" + encode(filename))
                        .contentType(mediaType)
                        .contentLength(length)
                        .body(length == 0 ? new byte[0] : r);
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
            long end = Math.min(Math.min(range.getRangeEnd(length), start + PREVIEW_CHUNK - 1), length - 1);
            int chunk = (int) (end - start + 1);
            byte[] data = new byte[chunk];
            try (RandomAccessFile raf = new RandomAccessFile(r.getFile(), "r")) {
                raf.seek(start);
                raf.readFully(data);
            }
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + length)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename*=UTF-8''" + encode(filename))
                    .contentType(mediaType)
                    .contentLength(chunk)
                    .body(data);
        } catch (ShareAccessException e) {
            return ResponseEntity.status(e.status).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/fed/shares/{token}/download")
    public ResponseEntity<?> downloadSharedFile(@PathVariable String token,
                                                @RequestParam(value = "subPath", required = false, defaultValue = "") String subPath,
                                                @RequestParam(value = "password", required = false) String queryPwd,
                                                @RequestHeader(value = "X-StoreIt-Share-Password", required = false) String headerPwd) {
        try {
            ResolvedShare rs = resolveAndAuthorize(token, queryPwd != null ? queryPwd : headerPwd, false);
            String targetOwnerRel = rs.share.isDirectory()
                    ? joinSharePath(rs.share.getFilePath(), sanitizeSubPath(subPath))
                    : rs.share.getFilePath();
            Resource r = fileService.getResourceForUser(rs.owner, targetOwnerRel);
            if (!r.exists() || r.getFile().isDirectory()) {
                return ResponseEntity.status(404).body(Map.of("error", "文件不存在"));
            }
            if (!shareService.consumeDownload(rs.share.getId())) {
                return ResponseEntity.status(404).body(Map.of("error", "分享下载次数已耗尽或已过期"));
            }
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encode(r.getFilename()))
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(r);
        } catch (ShareAccessException e) {
            return ResponseEntity.status(e.status).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", "下载失败"));
        }
    }

    @GetMapping("/fed/shares/{token}/zip")
    public ResponseEntity<?> downloadSharedZip(@PathVariable String token,
                                               @RequestParam(value = "subPath", required = false, defaultValue = "") String subPath,
                                               @RequestParam(value = "password", required = false) String queryPwd,
                                               @RequestHeader(value = "X-StoreIt-Share-Password", required = false) String headerPwd,
                                               HttpServletResponse response) {
        try {
            ResolvedShare rs = resolveAndAuthorize(token, queryPwd != null ? queryPwd : headerPwd, false);
            String targetOwnerRel = rs.share.isDirectory()
                    ? joinSharePath(rs.share.getFilePath(), sanitizeSubPath(subPath))
                    : rs.share.getFilePath();
            Resource r = fileService.getResourceForUser(rs.owner, targetOwnerRel);
            if (!r.exists()) {
                return ResponseEntity.status(404).body(Map.of("error", "目标不存在"));
            }
            if (!shareService.consumeDownload(rs.share.getId())) {
                return ResponseEntity.status(404).body(Map.of("error", "分享下载次数已耗尽或已过期"));
            }
            String zipName = (r.getFilename() == null ? "Shared" : r.getFilename()) + ".zip";
            response.setStatus(HttpStatus.OK.value());
            response.setContentType("application/zip");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encode(zipName));
            fileService.writeZipArchive(rs.owner, List.of(targetOwnerRel), response.getOutputStream());
            response.flushBuffer();
            return null;
        } catch (ShareAccessException e) {
            return ResponseEntity.status(e.status).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            if (!response.isCommitted()) {
                return ResponseEntity.badRequest().body(Map.of("error", "打包下载失败"));
            }
            return null;
        }
    }

    @GetMapping("/fed/shares/{token}/content")
    public ResponseEntity<?> getSharedFileContent(@PathVariable String token,
                                                  @RequestParam(value = "subPath", required = false, defaultValue = "") String subPath,
                                                  @RequestParam(value = "password", required = false) String queryPwd,
                                                  @RequestHeader(value = "X-StoreIt-Share-Password", required = false) String headerPwd) {
        try {
            ResolvedShare rs = resolveAndAuthorize(token, queryPwd != null ? queryPwd : headerPwd, false);
            String targetOwnerRel = rs.share.isDirectory()
                    ? joinSharePath(rs.share.getFilePath(), sanitizeSubPath(subPath))
                    : rs.share.getFilePath();
            Map<String, Object> content = fileService.readTextFile(rs.owner, targetOwnerRel);
            content.put("permission", rs.share.getPermission());
            return ResponseEntity.ok(content);
        } catch (ShareAccessException e) {
            return ResponseEntity.status(e.status).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "读取内容失败"));
        }
    }

    // --- 以下为需要 READ_WRITE (读写) 权限的共享操作接口 ---

    @RequestMapping(value = "/fed/shares/{token}/content", method = {RequestMethod.PUT, RequestMethod.POST})
    public ResponseEntity<?> saveSharedFileContent(@PathVariable String token,
                                                   @RequestParam(value = "password", required = false) String queryPwd,
                                                   @RequestHeader(value = "X-StoreIt-Share-Password", required = false) String headerPwd,
                                                   @RequestBody Map<String, Object> payload) {
        try {
            String pwd = queryPwd != null ? queryPwd : (headerPwd != null ? headerPwd : (payload.get("password") != null ? String.valueOf(payload.get("password")) : null));
            ResolvedShare rs = resolveAndAuthorize(token, pwd, true);
            String subPath = payload.get("subPath") != null ? String.valueOf(payload.get("subPath")) : "";
            String targetOwnerRel = rs.share.isDirectory()
                    ? joinSharePath(rs.share.getFilePath(), sanitizeSubPath(subPath))
                    : rs.share.getFilePath();
            String content = payload.get("content") != null ? String.valueOf(payload.get("content")) : "";
            String charset = payload.get("charset") != null ? String.valueOf(payload.get("charset")) : null;
            Long expectedModifiedTime = null;
            if (payload.get("expectedModifiedTime") != null) {
                try {
                    expectedModifiedTime = Long.parseLong(String.valueOf(payload.get("expectedModifiedTime")));
                } catch (NumberFormatException ignored) {}
            }
            Map<String, Object> saved = fileService.saveTextFile(rs.owner, targetOwnerRel, content, expectedModifiedTime, charset);
            return ResponseEntity.ok(Map.of("success", true, "message", "共享文件已保存", "file", saved));
        } catch (ShareAccessException e) {
            return ResponseEntity.status(e.status).body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            if (FileService.EDIT_CONFLICT.equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", FileService.EDIT_CONFLICT, "conflict", true));
            }
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "保存失败"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "保存共享文件失败"));
        }
    }

    @PostMapping(value = "/fed/shares/{token}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadToSharedFolder(@PathVariable String token,
                                                  @RequestParam(value = "subPath", required = false, defaultValue = "") String subPath,
                                                  @RequestParam(value = "conflictStrategy", required = false, defaultValue = "rename") String conflictStrategy,
                                                  @RequestParam(value = "password", required = false) String queryPwd,
                                                  @RequestHeader(value = "X-StoreIt-Share-Password", required = false) String headerPwd,
                                                  @RequestParam("file") MultipartFile file) {
        try {
            ResolvedShare rs = resolveAndAuthorize(token, queryPwd != null ? queryPwd : headerPwd, true);
            if (!rs.share.isDirectory()) {
                return ResponseEntity.badRequest().body(Map.of("error", "单文件共享不支持上传子文件"));
            }
            String targetDir = joinSharePath(rs.share.getFilePath(), sanitizeSubPath(subPath));
            String saved = fileService.saveFile(rs.owner, targetDir, file, conflictStrategy);
            String basePrefix = rs.share.getFilePath() + "/";
            String relInShare = saved.startsWith(basePrefix) ? saved.substring(basePrefix.length()) : saved;
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "已上传至共享文件夹",
                    "file", Map.of("name", file.getOriginalFilename(), "path", relInShare, "size", file.getSize())
            ));
        } catch (ShareAccessException e) {
            return ResponseEntity.status(e.status).body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "上传失败"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "上传失败"));
        }
    }

    @PostMapping("/fed/shares/{token}/mkdir")
    public ResponseEntity<?> createSharedSubfolder(@PathVariable String token,
                                                   @RequestParam(value = "password", required = false) String queryPwd,
                                                   @RequestHeader(value = "X-StoreIt-Share-Password", required = false) String headerPwd,
                                                   @RequestBody Map<String, String> payload) {
        try {
            String pwd = queryPwd != null ? queryPwd : (headerPwd != null ? headerPwd : payload.get("password"));
            ResolvedShare rs = resolveAndAuthorize(token, pwd, true);
            if (!rs.share.isDirectory()) {
                return ResponseEntity.badRequest().body(Map.of("error", "单文件共享不支持新建子文件夹"));
            }
            String subPath = sanitizeSubPath(payload.getOrDefault("subPath", ""));
            String folderName = payload.getOrDefault("folderName", "").trim();
            if (folderName.isEmpty() || folderName.contains("/") || folderName.contains("\\") || "..".equals(folderName)) {
                return ResponseEntity.badRequest().body(Map.of("error", "无效的文件夹名称"));
            }
            String relInsideShare = subPath.isEmpty() ? folderName : subPath + "/" + folderName;
            String targetOwnerRel = joinSharePath(rs.share.getFilePath(), relInsideShare);
            fileService.createFolder(rs.owner, targetOwnerRel);
            return ResponseEntity.ok(Map.of("success", true, "path", relInsideShare));
        } catch (ShareAccessException e) {
            return ResponseEntity.status(e.status).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "新建文件夹失败"));
        }
    }

    @PostMapping("/fed/shares/{token}/create-file")
    public ResponseEntity<?> createSharedBlankFile(@PathVariable String token,
                                                   @RequestParam(value = "password", required = false) String queryPwd,
                                                   @RequestHeader(value = "X-StoreIt-Share-Password", required = false) String headerPwd,
                                                   @RequestBody Map<String, String> payload) {
        try {
            String pwd = queryPwd != null ? queryPwd : (headerPwd != null ? headerPwd : payload.get("password"));
            ResolvedShare rs = resolveAndAuthorize(token, pwd, true);
            if (!rs.share.isDirectory()) {
                return ResponseEntity.badRequest().body(Map.of("error", "单文件共享不支持新建子文件"));
            }
            String subPath = sanitizeSubPath(payload.getOrDefault("subPath", ""));
            String fileName = payload.getOrDefault("fileName", "").trim();
            String content = payload.getOrDefault("content", "");
            String parentOwnerRel = joinSharePath(rs.share.getFilePath(), subPath);
            Map<String, Object> created = fileService.createBlankFile(rs.owner, parentOwnerRel, fileName, content, "rename");
            String basePrefix = rs.share.getFilePath() + "/";
            String fullPath = String.valueOf(created.get("path"));
            if (fullPath.startsWith(basePrefix)) {
                created.put("path", fullPath.substring(basePrefix.length()));
            }
            return ResponseEntity.ok(Map.of("success", true, "file", created));
        } catch (ShareAccessException e) {
            return ResponseEntity.status(e.status).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "新建文件失败"));
        }
    }

    @PostMapping("/fed/shares/{token}/delete")
    public ResponseEntity<?> deleteSharedItem(@PathVariable String token,
                                              @RequestParam(value = "password", required = false) String queryPwd,
                                              @RequestHeader(value = "X-StoreIt-Share-Password", required = false) String headerPwd,
                                              @RequestBody Map<String, String> payload) {
        try {
            String pwd = queryPwd != null ? queryPwd : (headerPwd != null ? headerPwd : payload.get("password"));
            ResolvedShare rs = resolveAndAuthorize(token, pwd, true);
            if (!rs.share.isDirectory()) {
                return ResponseEntity.badRequest().body(Map.of("error", "不允许删除共享根文件本身"));
            }
            String subPath = sanitizeSubPath(payload.getOrDefault("subPath", ""));
            if (subPath.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "不允许删除共享根目录本身"));
            }
            String targetOwnerRel = joinSharePath(rs.share.getFilePath(), subPath);
            fileService.delete(rs.owner, targetOwnerRel);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (ShareAccessException e) {
            return ResponseEntity.status(e.status).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "删除失败"));
        }
    }

    @PostMapping("/fed/shares/{token}/rename")
    public ResponseEntity<?> renameSharedItem(@PathVariable String token,
                                              @RequestParam(value = "password", required = false) String queryPwd,
                                              @RequestHeader(value = "X-StoreIt-Share-Password", required = false) String headerPwd,
                                              @RequestBody Map<String, String> payload) {
        try {
            String pwd = queryPwd != null ? queryPwd : (headerPwd != null ? headerPwd : payload.get("password"));
            ResolvedShare rs = resolveAndAuthorize(token, pwd, true);
            if (!rs.share.isDirectory()) {
                return ResponseEntity.badRequest().body(Map.of("error", "不允许重命名共享根文件"));
            }
            String subPath = sanitizeSubPath(payload.getOrDefault("subPath", ""));
            String newName = payload.getOrDefault("newName", "").trim();
            if (subPath.isEmpty() || newName.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "参数无效"));
            }
            String targetOwnerRel = joinSharePath(rs.share.getFilePath(), subPath);
            fileService.rename(rs.owner, targetOwnerRel, newName);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (ShareAccessException e) {
            return ResponseEntity.status(e.status).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "重命名失败"));
        }
    }

    // ==================== Internal Helpers ====================

    private static final class ResolvedShare {
        final FileShare share;
        final User owner;

        ResolvedShare(FileShare share, User owner) {
            this.share = share;
            this.owner = owner;
        }
    }

    private static final class ShareAccessException extends Exception {
        final int status;
        final boolean passwordRequired;

        ShareAccessException(int status, String message, boolean passwordRequired) {
            super(message);
            this.status = status;
            this.passwordRequired = passwordRequired;
        }
    }

    private ResolvedShare resolveAndAuthorize(String token, String providedPassword, boolean requireWrite) throws ShareAccessException {
        Optional<FileShare> opt = shareService.validateToken(token);
        if (opt.isEmpty()) {
            throw new ShareAccessException(404, "分享链接不存在、已过期或已达到下载上限", false);
        }
        FileShare share = opt.get();
        if (!shareService.checkPassword(share, providedPassword)) {
            throw new ShareAccessException(403, "需要输入正确的访问提取码", true);
        }
        if (requireWrite && !"READ_WRITE".equalsIgnoreCase(share.getPermission())) {
            throw new ShareAccessException(403, "该共享为只读权限 (R)，不允许上传或修改", false);
        }
        User owner = authService.findUserById(share.getUserId())
                .orElseThrow(() -> new ShareAccessException(404, "分享所属用户不存在", false));
        return new ResolvedShare(share, owner);
    }

    private static String sanitizeSubPath(String subPath) throws ShareAccessException {
        if (subPath == null || subPath.isBlank()) return "";
        String normalized = subPath.replace('\\', '/').trim();
        while (normalized.startsWith("/")) normalized = normalized.substring(1);
        while (normalized.endsWith("/")) normalized = normalized.substring(0, normalized.length() - 1);
        if (normalized.isEmpty()) return "";
        String[] parts = normalized.split("/");
        List<String> cleanParts = new ArrayList<>();
        for (String p : parts) {
            if (p.isEmpty() || ".".equals(p)) continue;
            if ("..".equals(p) || ".chunks".equalsIgnoreCase(p)) {
                throw new ShareAccessException(400, "非法的共享子路径", false);
            }
            cleanParts.add(p);
        }
        return String.join("/", cleanParts);
    }

    private static String joinSharePath(String baseSharePath, String cleanSubPath) {
        if (cleanSubPath == null || cleanSubPath.isEmpty()) return baseSharePath;
        if (baseSharePath == null || baseSharePath.isEmpty()) return cleanSubPath;
        return baseSharePath + "/" + cleanSubPath;
    }

    private static final class ParsedShareRef {
        final String remoteServerUrl;
        final String token;
        final String extractedPassword;

        ParsedShareRef(String remoteServerUrl, String token, String extractedPassword) {
            this.remoteServerUrl = remoteServerUrl;
            this.token = token;
            this.extractedPassword = extractedPassword;
        }
    }

    private static ParsedShareRef parseShareReference(String raw, HttpServletRequest req) {
        String input = raw.trim();
        String extractedPwd = "";

        // Extract ?key=... or ?password=... if present
        int qIdx = input.indexOf('?');
        if (qIdx >= 0) {
            String query = input.substring(qIdx + 1);
            input = input.substring(0, qIdx);
            for (String pair : query.split("&")) {
                String[] kv = pair.split("=", 2);
                if (kv.length == 2 && ("key".equalsIgnoreCase(kv[0]) || "password".equalsIgnoreCase(kv[0]) || "pwd".equalsIgnoreCase(kv[0]))) {
                    extractedPwd = java.net.URLDecoder.decode(kv[1], StandardCharsets.UTF_8);
                }
            }
        }

        // Convert storeit+fed://host/... to http(s)://host/...
        if (input.startsWith("storeit+fed://")) {
            String rest = input.substring("storeit+fed://".length());
            boolean isLocal = rest.startsWith("localhost") || rest.startsWith("127.0.0.1");
            input = (isLocal ? "http://" : "https://") + rest;
        }

        String remoteOrigin = "";
        String pathPart = input;
        if (input.startsWith("http://") || input.startsWith("https://")) {
            try {
                java.net.URI uri = java.net.URI.create(input);
                String scheme = uri.getScheme();
                String authority = uri.getRawAuthority();
                remoteOrigin = scheme + "://" + authority;
                String currentOrigin = req.getScheme() + "://" + req.getHeader("Host");
                if (remoteOrigin.equalsIgnoreCase(currentOrigin)) {
                    remoteOrigin = "";
                }
                pathPart = (uri.getRawPath() == null ? "" : uri.getRawPath())
                        + (uri.getRawFragment() == null ? "" : "#" + uri.getRawFragment());
            } catch (Exception ignored) {}
        }

        // Extract token from /api/fed/shares/{token}, /d/{token}, #/s/{token}, or bare token
        String token = pathPart;
        if (token.contains("/api/fed/shares/")) {
            token = token.substring(token.indexOf("/api/fed/shares/") + "/api/fed/shares/".length());
        } else if (token.contains("#/s/")) {
            token = token.substring(token.indexOf("#/s/") + "#/s/".length());
        } else if (token.contains("/d/")) {
            token = token.substring(token.indexOf("/d/") + "/d/".length());
        }
        if (token.contains("/")) {
            token = token.substring(0, token.indexOf('/'));
        }
        token = token.replaceAll("[^A-Za-z0-9_-]", "");
        return new ParsedShareRef(remoteOrigin, token, extractedPwd);
    }

    private static Map<String, Object> shareView(FileShare share) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", share.getId());
        item.put("filePath", share.getFilePath() == null ? "" : share.getFilePath());
        item.put("token", share.getToken());
        item.put("url", "/d/" + share.getToken());
        item.put("webUrl", "/#/s/" + share.getToken());
        item.put("federatedUri", "/api/fed/shares/" + share.getToken());
        item.put("expiry", share.getExpiry());
        item.put("maxDownloads", share.getMaxDownloads());
        item.put("downloads", share.getDownloads() == null ? 0 : share.getDownloads());
        item.put("createdAt", share.getCreatedAt());
        item.put("isDirectory", share.isDirectory());
        item.put("permission", share.getPermission());
        item.put("passwordProtected", share.getAccessPassword() != null && !share.getAccessPassword().isBlank());
        item.put("title", share.getTitle() == null ? "" : share.getTitle());
        return item;
    }

    private static String encode(String filename) {
        return URLEncoder.encode(filename == null ? "file" : filename, StandardCharsets.UTF_8);
    }
}

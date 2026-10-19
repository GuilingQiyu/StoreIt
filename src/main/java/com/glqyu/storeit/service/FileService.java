package com.glqyu.storeit.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.glqyu.storeit.config.AppProperties;
import com.glqyu.storeit.dto.FileListResponse;
import com.glqyu.storeit.mapper.FavoriteMapper;
import com.glqyu.storeit.mapper.FileMetadataMapper;
import com.glqyu.storeit.mapper.FileShareMapper;
import com.glqyu.storeit.model.FileMetadata;
import com.glqyu.storeit.model.User;

@Service
public class FileService {
    public static final String QUOTA_EXCEEDED = "存储配额不足";
    public static final String MOVE_INTO_SELF = "不能移动到自身内部";
    public static final String MOVE_EXISTS = "目标已存在";
    public static final String MOVE_DEST_MISSING = "目标目录不存在";
    public static final String EDIT_CONFLICT = "文件已被其他终端修改，请刷新或选择强制覆盖";
    public static final String PREVIEW_CSP = String.join("; ",
            "default-src 'none'",
            "script-src 'none'",
            "style-src 'unsafe-inline'",
            "img-src 'self' data: blob:",
            "media-src 'self' blob:",
            "object-src 'self'",
            "base-uri 'none'",
            "frame-ancestors 'self'");

    private final AppProperties props;
    private final FileMetadataMapper metaMapper;
    private final FavoriteMapper favoriteMapper;
    private final FileShareMapper shareMapper;

    public FileService(AppProperties props, FileMetadataMapper metaMapper, FavoriteMapper favoriteMapper, FileShareMapper shareMapper) {
        this.props = props;
        this.metaMapper = metaMapper;
        this.favoriteMapper = favoriteMapper;
        this.shareMapper = shareMapper;
        ensureStorage();
    }

    private void ensureStorage() {
        Path p = Paths.get(props.getStorageRoot());
        try { Files.createDirectories(p); } catch (IOException ignored) {}
    }

    private Path getUserRoot(User user) {
        return Paths.get(props.getStorageRoot(), user.getUsername()).toAbsolutePath().normalize();
    }

    public boolean isSafePath(User user, String relativePath) {
        try {
            Path base = getUserRoot(user);
            Files.createDirectories(base);
            Path realBase = base.toRealPath();
            Path target = realBase.resolve(relativePath == null ? "" : relativePath).normalize();
            if (!target.startsWith(realBase)) {
                return false;
            }
            Path existing = target;
            while (existing != null && !Files.exists(existing)) {
                existing = existing.getParent();
            }
            if (existing == null) {
                return false;
            }
            return existing.toRealPath().startsWith(realBase);
        } catch (IOException e) {
            return false;
        }
    }

    public FileListResponse list(User user, String relativePath) throws IOException {
        if (!isSafePath(user, relativePath)) throw new IOException("unsafe path");
        
        Path base = getUserRoot(user);
        Path dir = base.resolve(relativePath == null ? "" : relativePath).normalize();
        if (!Files.exists(dir)) {
            Files.createDirectories(dir);
        }

        syncMetadata(user, relativePath, dir);

        List<FileMetadata> metas = metaMapper.findByUserIdAndParentPath(user.getId(), relativePath == null ? "" : relativePath);
        
        List<FileListResponse.Item> items = metas.stream()
                .filter(m -> !".chunks".equals(m.getName()) && (m.getPath() == null || !m.getPath().startsWith(".chunks")))
                .map(m -> {
            FileListResponse.Item it = new FileListResponse.Item();
            it.setName(m.getName());
            it.setDirectory(m.isDirectory());
            it.setSize(m.getSize());
            it.setModifiedTime(m.getLastModified());
            it.setContentType(m.getContentType());
            it.setPath((m.getParentPath() == null || m.getParentPath().isEmpty()) ? m.getName() : m.getParentPath() + "/" + m.getName());
            return it;
        }).collect(Collectors.toList());

        items.sort(Comparator.comparing(FileListResponse.Item::isDirectory).reversed()
                .thenComparing(i -> i.getName().toLowerCase()));
        
        FileListResponse res = new FileListResponse();
        res.setCurrentPath(relativePath == null ? "" : relativePath);
        res.setItems(items);
        return res;
    }

    private void syncMetadata(User user, String parentPath, Path dir) {
        try {
            List<FileMetadata> dbFiles = metaMapper.findByUserIdAndParentPath(user.getId(), parentPath == null ? "" : parentPath);
            File[] diskFiles = dir.toFile().listFiles();
            if (diskFiles == null) return;

            List<String> diskFileNames = new ArrayList<>();

            for (File f : diskFiles) {
                String name = f.getName();
                if (".chunks".equals(name) || (name.startsWith(".") && f.isDirectory())) continue;
                diskFileNames.add(name);
                
                Optional<FileMetadata> existing = dbFiles.stream().filter(m -> m.getName().equals(name)).findFirst();
                
                if (existing.isPresent()) {
                    FileMetadata m = existing.get();
                    boolean missingType = !f.isDirectory() && (m.getContentType() == null || m.getContentType().isEmpty());
                    if (m.getSize() != (f.isDirectory() ? 0 : f.length()) || m.getLastModified() != f.lastModified() / 1000 || missingType) {
                        m.setSize(f.isDirectory() ? 0 : f.length());
                        m.setLastModified(f.lastModified() / 1000);
                        if (missingType) m.setContentType(detectContentType(name));
                        metaMapper.update(m);
                    }
                } else {
                    FileMetadata m = new FileMetadata();
                    m.setUserId(user.getId());
                    m.setPath((parentPath == null || parentPath.isEmpty()) ? name : parentPath + "/" + name);
                    m.setName(name);
                    m.setDirectory(f.isDirectory());
                    m.setSize(f.isDirectory() ? 0 : f.length());
                    m.setLastModified(f.lastModified() / 1000);
                    m.setContentType(f.isDirectory() ? null : detectContentType(name));
                    m.setParentPath(parentPath == null ? "" : parentPath);
                    metaMapper.insert(m);
                }
            }

            for (FileMetadata m : dbFiles) {
                if (!diskFileNames.contains(m.getName())) {
                    metaMapper.deleteByPath(user.getId(), m.getPath());
                }
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String saveFile(User user, String directory, MultipartFile file) throws IOException {
        return saveFile(user, directory, file, "rename");
    }

    public String saveFile(User user, String directory, MultipartFile file, String conflictStrategy) throws IOException {
        if (!isSafePath(user, directory)) throw new IOException("unsafe path");
        String originalName = FilenameUtils.getName(file.getOriginalFilename());
        String fileName = originalName;
        Path base = getUserRoot(user);
        Path dir = base.resolve(directory == null ? "" : directory).normalize();
        Files.createDirectories(dir);
        Path dest = dir.resolve(fileName);

        boolean overwrite = "overwrite".equalsIgnoreCase(conflictStrategy);
        if (overwrite && Files.exists(dest) && !Files.isDirectory(dest)) {
            long existingSize = Files.size(dest);
            long netIncoming = Math.max(0L, file.getSize() - existingSize);
            enforceQuota(user, netIncoming);
            if (dir.toFile().getUsableSpace() < netIncoming) {
                throw new IOException("磁盘空间不足");
            }
            try (java.io.InputStream in = file.getInputStream()) {
                Files.copy(in, dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            }
        } else {
            // 自动重命名逻辑（兼容无扩展名文件，避免产生尾随点）
            int count = 1;
            String baseName = FilenameUtils.getBaseName(originalName);
            String extension = FilenameUtils.getExtension(originalName);
            String extSuffix = (extension == null || extension.isEmpty()) ? "" : "." + extension;
            while (Files.exists(dest)) {
                fileName = baseName + " (" + count++ + ")" + extSuffix;
                dest = dir.resolve(fileName);
            }
            if (!isSafePath(user, directory)) throw new IOException("unsafe path");
            enforceQuota(user, file.getSize());
            if (dir.toFile().getUsableSpace() < file.getSize()) {
                throw new IOException("磁盘空间不足");
            }
            file.transferTo(dest);
        }

        ensureParentDirectoriesMetadata(user, directory);
        updateSingleFileMetadata(user, directory, dest.toFile());

        return (directory == null || directory.isEmpty()) ? fileName : directory + "/" + fileName;
    }

    public Resource getResource(User user, String relativePath) throws IOException {
        if (!isSafePath(user, relativePath)) throw new IOException("unsafe path");
        Path base = getUserRoot(user);
        Path target = base.resolve(relativePath).normalize();
        if (!Files.exists(target)) throw new IOException("not found");
        return new FileSystemResource(target);
    }

    public String saveChunkedFile(User user, String directory, String fileName, Path chunksDir, int totalChunks, long fileSize) throws IOException {
        return saveChunkedFile(user, directory, fileName, chunksDir, totalChunks, fileSize, "rename");
    }

    public String saveChunkedFile(User user, String directory, String fileName, Path chunksDir, int totalChunks, long fileSize, String conflictStrategy) throws IOException {
        if (!isSafePath(user, directory)) throw new IOException("unsafe path");

        Path base = getUserRoot(user);
        Path dir = base.resolve(directory == null ? "" : directory).normalize();
        Files.createDirectories(dir);

        String originalName = FilenameUtils.getName(fileName);
        String finalFileName = originalName;
        Path dest = dir.resolve(finalFileName);

        boolean overwrite = "overwrite".equalsIgnoreCase(conflictStrategy);
        if (overwrite && Files.exists(dest) && !Files.isDirectory(dest)) {
            long existingSize = Files.size(dest);
            long netIncoming = Math.max(0L, fileSize - existingSize);
            enforceQuota(user, netIncoming);
            if (dir.toFile().getUsableSpace() < netIncoming) {
                throw new IOException("磁盘空间不足");
            }
        } else {
            enforceQuota(user, fileSize);
            int count = 1;
            String baseName = FilenameUtils.getBaseName(originalName);
            String extension = FilenameUtils.getExtension(originalName);
            String extSuffix = (extension == null || extension.isEmpty()) ? "" : "." + extension;
            while (Files.exists(dest)) {
                finalFileName = baseName + " (" + count++ + ")" + extSuffix;
                dest = dir.resolve(finalFileName);
            }
            if (dir.toFile().getUsableSpace() < fileSize) {
                throw new IOException("磁盘空间不足");
            }
        }

        try (java.io.OutputStream out = Files.newOutputStream(dest,
                java.nio.file.StandardOpenOption.CREATE,
                java.nio.file.StandardOpenOption.TRUNCATE_EXISTING,
                java.nio.file.StandardOpenOption.WRITE)) {
            for (int i = 0; i < totalChunks; i++) {
                Path partFile = chunksDir.resolve(i + ".part");
                if (!Files.exists(partFile)) {
                    if (!overwrite) Files.deleteIfExists(dest);
                    throw new IOException("Missing chunk: " + i);
                }
                Files.copy(partFile, out);
            }
        }

        ensureParentDirectoriesMetadata(user, directory);
        updateSingleFileMetadata(user, directory, dest.toFile());

        try (java.util.stream.Stream<Path> walk = Files.walk(chunksDir)) {
             walk.sorted(Comparator.reverseOrder())
                 .map(Path::toFile)
                 .forEach(File::delete);
        }

        return (directory == null || directory.isEmpty()) ? finalFileName : directory + "/" + finalFileName;
    }

    public void cleanStaleChunks() {
        Path storageRoot = Paths.get(props.getStorageRoot());
        if (!Files.exists(storageRoot)) return;
        
        long cutoff = System.currentTimeMillis() - 24 * 60 * 60 * 1000L;
        
        try (java.util.stream.Stream<Path> userDirs = Files.list(storageRoot)) {
            userDirs.filter(Files::isDirectory).forEach(userDir -> {
                Path chunksBase = userDir.resolve(".chunks");
                if (Files.exists(chunksBase) && Files.isDirectory(chunksBase)) {
                    try (java.util.stream.Stream<Path> uploadDirs = Files.list(chunksBase)) {
                        uploadDirs.filter(Files::isDirectory).forEach(uploadDir -> {
                            try {
                                if (Files.getLastModifiedTime(uploadDir).toMillis() < cutoff) {
                                    try (java.util.stream.Stream<Path> walk = Files.walk(uploadDir)) {
                                        walk.sorted(Comparator.reverseOrder())
                                            .map(Path::toFile)
                                            .forEach(File::delete);
                                    }
                                }
                            } catch (Exception e) {
                                // ignore
                            }
                        });
                    } catch (Exception e) {
                        // ignore
                    }
                }
            });
        } catch (Exception e) {
            // ignore
        }
    }

    
    public Resource getResourceForUser(User owner, String relativePath) throws IOException {
        return getResource(owner, relativePath);
    }

    /**
     * 分片上传初始化前置校验：校验文件名、大小、目标目录路径安全性以及用户存储配额。
     */
    public void validateUploadInit(User user, String directory, String fileName, long fileSize) throws IOException {
        validateUploadInit(user, directory, fileName, fileSize, "rename");
    }

    public void validateUploadInit(User user, String directory, String fileName, long fileSize, String conflictStrategy) throws IOException {
        String safeName = FilenameUtils.getName(fileName == null ? "" : fileName.trim());
        if (safeName.isEmpty() || ".".equals(safeName) || "..".equals(safeName) || fileSize < 0) {
            throw new IOException("无效路径");
        }
        String dir = directory == null ? "" : directory;
        if (!isSafePath(user, dir)) {
            throw new IOException("unsafe path");
        }
        Path base = getUserRoot(user);
        Files.createDirectories(base);
        long netSize = fileSize;
        if ("overwrite".equalsIgnoreCase(conflictStrategy)) {
            Path existing = base.resolve(dir).normalize().resolve(safeName);
            if (Files.exists(existing) && Files.isRegularFile(existing)) {
                netSize = Math.max(0L, fileSize - Files.size(existing));
            }
        }
        enforceQuota(user, netSize);
        if (base.toFile().getUsableSpace() < netSize) {
            throw new IOException("磁盘空间不足");
        }
    }

    /**
     * 同名文件夹上传冲突处理：支持 merge（合并）、rename（重命名）、overwrite（覆盖原目录）。
     */
    public java.util.Map<String, String> resolveFolderConflict(User user, String parentPath, String folderName, String strategy) throws IOException {
        String cleanName = FilenameUtils.getName(folderName == null ? "" : folderName.trim());
        if (cleanName.isEmpty() || ".".equals(cleanName) || "..".equals(cleanName)
                || cleanName.contains("/") || cleanName.contains("\\")) {
            throw new IOException("无效文件夹名称");
        }
        String parent = parentPath == null ? "" : parentPath.trim();
        if (!isSafePath(user, parent)) {
            throw new IOException("无效路径");
        }
        Path base = getUserRoot(user);
        Path parentDir = base.resolve(parent).normalize();
        Files.createDirectories(parentDir);

        String mode = strategy == null ? "merge" : strategy.trim().toLowerCase();
        String finalName = cleanName;
        String targetRel = childPath(parent, finalName);
        Path targetDir = parentDir.resolve(finalName).normalize();

        if ("overwrite".equals(mode)) {
            if (Files.exists(targetDir)) {
                delete(user, targetRel);
            }
            createFolder(user, targetRel);
        } else if ("rename".equals(mode)) {
            int count = 1;
            while (Files.exists(targetDir)) {
                finalName = cleanName + " (" + count++ + ")";
                targetRel = childPath(parent, finalName);
                targetDir = parentDir.resolve(finalName).normalize();
            }
            createFolder(user, targetRel);
        } else {
            // merge
            if (!Files.exists(targetDir)) {
                createFolder(user, targetRel);
            } else if (!Files.isDirectory(targetDir)) {
                int count = 1;
                while (Files.exists(targetDir)) {
                    finalName = cleanName + " (" + count++ + ")";
                    targetRel = childPath(parent, finalName);
                    targetDir = parentDir.resolve(finalName).normalize();
                }
                createFolder(user, targetRel);
            } else {
                ensureParentDirectoriesMetadata(user, targetRel);
            }
        }
        return java.util.Map.of("folderName", finalName, "targetPath", targetRel);
    }

    public static final long MAX_EDITABLE_TEXT_BYTES = 5L * 1024 * 1024; // 5 MB

    /**
     * 探测文件是否为二进制文件（检查前 8KB 是否包含 NUL 0x00 字节，排除 UTF-16 BOM 文本）。
     * 无 NUL 字节的任意扩展名或无扩展名文件均视为文本文件。
     */
    public boolean isBinaryFile(Path file) throws IOException {
        if (!Files.exists(file) || Files.isDirectory(file)) return false;
        long size = Files.size(file);
        if (size == 0) return false;
        int toRead = (int) Math.min(size, 8192L);
        byte[] buf = new byte[toRead];
        try (java.io.InputStream in = Files.newInputStream(file)) {
            int n = in.read(buf);
            if (n >= 2) {
                int b0 = buf[0] & 0xFF;
                int b1 = buf[1] & 0xFF;
                if ((b0 == 0xFF && b1 == 0xFE) || (b0 == 0xFE && b1 == 0xFF)) {
                    return false;
                }
            }
            for (int i = 0; i < n; i++) {
                if (buf[i] == 0) return true;
            }
        }
        return false;
    }

    /**
     * 自动识别文本字节编码（支持 UTF-8 / UTF-8 BOM / UTF-16LE / UTF-16BE / GB18030 回退）。
     */
    public java.util.Map.Entry<String, String> decodeTextWithCharset(byte[] bytes) {
        if (bytes == null || bytes.length == 0) {
            return java.util.Map.entry("UTF-8", "");
        }
        if (bytes.length >= 3 && (bytes[0] & 0xFF) == 0xEF && (bytes[1] & 0xFF) == 0xBB && (bytes[2] & 0xFF) == 0xBF) {
            return java.util.Map.entry("UTF-8", new String(bytes, 3, bytes.length - 3, java.nio.charset.StandardCharsets.UTF_8));
        }
        if (bytes.length >= 2 && (bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xFE) {
            return java.util.Map.entry("UTF-16LE", new String(bytes, 2, bytes.length - 2, java.nio.charset.StandardCharsets.UTF_16LE));
        }
        if (bytes.length >= 2 && (bytes[0] & 0xFF) == 0xFE && (bytes[1] & 0xFF) == 0xFF) {
            return java.util.Map.entry("UTF-16BE", new String(bytes, 2, bytes.length - 2, java.nio.charset.StandardCharsets.UTF_16BE));
        }
        try {
            java.nio.charset.CharsetDecoder decoder = java.nio.charset.StandardCharsets.UTF_8.newDecoder()
                    .onMalformedInput(java.nio.charset.CodingErrorAction.REPORT)
                    .onUnmappableCharacter(java.nio.charset.CodingErrorAction.REPORT);
            String decoded = decoder.decode(java.nio.ByteBuffer.wrap(bytes)).toString();
            return java.util.Map.entry("UTF-8", decoded);
        } catch (java.nio.charset.CharacterCodingException e) {
            try {
                java.nio.charset.Charset gb = java.nio.charset.Charset.forName("GB18030");
                return java.util.Map.entry("GB18030", new String(bytes, gb));
            } catch (Exception ex) {
                return java.util.Map.entry("UTF-8", new String(bytes, java.nio.charset.StandardCharsets.UTF_8));
            }
        }
    }

    public java.util.Map<String, Object> readTextFile(User user, String relativePath) throws IOException {
        if (relativePath == null || relativePath.isBlank() || !isSafePath(user, relativePath)) {
            throw new IOException("无效路径");
        }
        Path base = getUserRoot(user);
        Path target = base.resolve(relativePath).normalize();
        if (!Files.exists(target) || Files.isDirectory(target)) {
            throw new IOException("文件不存在");
        }
        long size = Files.size(target);
        if (size > MAX_EDITABLE_TEXT_BYTES) {
            throw new IOException("文件超过 5 MB，不支持在线编辑，请下载到本地修改");
        }
        if (isBinaryFile(target)) {
            throw new IOException("该文件为二进制格式，不支持作为文本在线编辑");
        }
        byte[] bytes = Files.readAllBytes(target);
        java.util.Map.Entry<String, String> decoded = decodeTextWithCharset(bytes);
        java.util.Map<String, Object> res = new java.util.HashMap<>();
        res.put("path", relativePath);
        res.put("name", target.getFileName().toString());
        res.put("size", size);
        res.put("modifiedTime", target.toFile().lastModified() / 1000);
        res.put("charset", decoded.getKey());
        res.put("content", decoded.getValue());
        return res;
    }

    public java.util.Map<String, Object> saveTextFile(User user, String relativePath, String content) throws IOException {
        return saveTextFile(user, relativePath, content, null, null);
    }

    public java.util.Map<String, Object> saveTextFile(User user, String relativePath, String content, Long expectedModifiedTime, String charsetName) throws IOException {
        if (relativePath == null || relativePath.isBlank() || !isSafePath(user, relativePath)) {
            throw new IOException("无效路径");
        }
        Path base = getUserRoot(user);
        Path target = base.resolve(relativePath).normalize();
        if (!Files.exists(target) || Files.isDirectory(target)) {
            throw new IOException("文件不存在");
        }
        long currentModified = target.toFile().lastModified() / 1000;
        if (expectedModifiedTime != null && expectedModifiedTime > 0 && currentModified != expectedModifiedTime) {
            throw new IOException(EDIT_CONFLICT);
        }
        java.nio.charset.Charset charset = java.nio.charset.StandardCharsets.UTF_8;
        String resolvedCharset = "UTF-8";
        if (charsetName != null && !charsetName.isBlank()) {
            String upper = charsetName.trim().toUpperCase();
            if ("GB18030".equals(upper) || "GBK".equals(upper)) {
                charset = java.nio.charset.Charset.forName("GB18030");
                resolvedCharset = "GB18030";
            } else if ("UTF-16LE".equals(upper)) {
                charset = java.nio.charset.StandardCharsets.UTF_16LE;
                resolvedCharset = "UTF-16LE";
            } else if ("UTF-16BE".equals(upper)) {
                charset = java.nio.charset.StandardCharsets.UTF_16BE;
                resolvedCharset = "UTF-16BE";
            }
        }
        byte[] rawBytes = (content == null ? "" : content).getBytes(charset);
        byte[] newBytes = rawBytes;
        if ("UTF-16LE".equals(resolvedCharset)) {
            newBytes = new byte[rawBytes.length + 2];
            newBytes[0] = (byte) 0xFF;
            newBytes[1] = (byte) 0xFE;
            System.arraycopy(rawBytes, 0, newBytes, 2, rawBytes.length);
        } else if ("UTF-16BE".equals(resolvedCharset)) {
            newBytes = new byte[rawBytes.length + 2];
            newBytes[0] = (byte) 0xFE;
            newBytes[1] = (byte) 0xFF;
            System.arraycopy(rawBytes, 0, newBytes, 2, rawBytes.length);
        }
        if (newBytes.length > MAX_EDITABLE_TEXT_BYTES) {
            throw new IOException("文本内容超过 5 MB 上限");
        }
        long oldSize = Files.size(target);
        long delta = newBytes.length - oldSize;
        if (delta > 0) {
            enforceQuota(user, delta);
        }
        Files.write(target, newBytes);
        String parent = relativePath.contains("/") ? relativePath.substring(0, relativePath.lastIndexOf('/')) : "";
        updateSingleFileMetadata(user, parent, target.toFile());

        java.util.Map<String, Object> res = new java.util.HashMap<>();
        res.put("path", relativePath);
        res.put("name", target.getFileName().toString());
        res.put("size", (long) newBytes.length);
        res.put("modifiedTime", target.toFile().lastModified() / 1000);
        res.put("charset", resolvedCharset);
        return res;
    }

    /**
     * 新建空白或带初始模板内容的文本/Markdown文件。
     */
    public java.util.Map<String, Object> createBlankFile(User user, String parentPath, String fileName, String content, String conflictStrategy) throws IOException {
        String rawName = fileName == null ? "" : fileName.trim();
        String cleanName = FilenameUtils.getName(rawName);
        if (cleanName.isEmpty() || ".".equals(cleanName) || "..".equals(cleanName)
                || rawName.contains("/") || rawName.contains("\\") || ".chunks".equalsIgnoreCase(cleanName)) {
            throw new IOException("无效文件名称");
        }
        String parent = parentPath == null ? "" : parentPath.trim();
        if (!isSafePath(user, parent)) {
            throw new IOException("无效路径");
        }
        Path base = getUserRoot(user);
        Path dir = base.resolve(parent).normalize();
        Files.createDirectories(dir);

        String mode = conflictStrategy == null ? "fail" : conflictStrategy.trim().toLowerCase();
        String finalName = cleanName;
        Path dest = dir.resolve(finalName).normalize();

        if (Files.exists(dest)) {
            if ("rename".equals(mode)) {
                String baseName = FilenameUtils.getBaseName(cleanName);
                String ext = FilenameUtils.getExtension(cleanName);
                String extWithDot = ext.isEmpty() ? "" : "." + ext;
                int count = 1;
                while (Files.exists(dest)) {
                    finalName = baseName + " (" + count++ + ")" + extWithDot;
                    dest = dir.resolve(finalName).normalize();
                }
            } else if ("overwrite".equals(mode)) {
                if (Files.isDirectory(dest)) {
                    throw new IOException("同名文件夹已存在，无法直接覆盖为文件");
                }
            } else {
                throw new IOException("同名文件已存在");
            }
        }

        byte[] bytes = (content == null ? "" : content).getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > MAX_EDITABLE_TEXT_BYTES) {
            throw new IOException("初始文件内容超过 5 MB 上限");
        }
        long existingSize = (Files.exists(dest) && Files.isRegularFile(dest)) ? Files.size(dest) : 0L;
        long netDelta = Math.max(0L, (long) bytes.length - existingSize);
        if (netDelta > 0) {
            enforceQuota(user, netDelta);
        }

        Files.write(dest, bytes);
        ensureParentDirectoriesMetadata(user, parent);
        updateSingleFileMetadata(user, parent, dest.toFile());

        String relPath = childPath(parent, finalName);
        java.util.Map<String, Object> res = new java.util.HashMap<>();
        res.put("path", relPath);
        res.put("name", finalName);
        res.put("size", (long) bytes.length);
        res.put("modifiedTime", dest.toFile().lastModified() / 1000);
        res.put("isDirectory", false);
        return res;
    }

    /**
     * 多级文件夹拖拽/上传时，确保中间父目录均已写入 file_metadata 表。
     */
    private void ensureParentDirectoriesMetadata(User user, String directory) {
        if (directory == null || directory.isBlank()) return;
        Path base = getUserRoot(user);
        String[] parts = directory.split("/");
        String currentParent = "";
        for (String part : parts) {
            if (part == null || part.isEmpty()) continue;
            String currentPath = currentParent.isEmpty() ? part : currentParent + "/" + part;
            Path dirFile = base.resolve(currentPath).normalize();
            if (Files.exists(dirFile) && Files.isDirectory(dirFile)) {
                updateSingleFileMetadata(user, currentParent, dirFile.toFile());
            }
            currentParent = currentPath;
        }
    }

    // 新增 updateSingleFileMetadata 方法
    private void updateSingleFileMetadata(User user, String parentPath, File file) {
        String name = file.getName();
        String parent = parentPath == null ? "" : parentPath;
        String relPath = childPath(parent, name);
        Optional<FileMetadata> existing = metaMapper.findByUserIdAndPath(user.getId(), relPath);

        FileMetadata m = existing.orElse(new FileMetadata());
        m.setUserId(user.getId());
        m.setPath(relPath);
        m.setName(name);
        m.setDirectory(file.isDirectory());
        m.setSize(file.isDirectory() ? 0 : file.length());
        m.setLastModified(file.lastModified() / 1000);
        m.setContentType(file.isDirectory() ? null : detectContentType(name));
        m.setParentPath(parent);
        if (existing.isPresent()) {
            metaMapper.update(m);
        } else {
            metaMapper.insert(m);
        }
    }

    public void delete(User user, String path) throws IOException {
        if (!isSafePath(user, path)) throw new IOException("unsafe path");
        Path base = getUserRoot(user);
        Path target = base.resolve(path).normalize();
        
        if (!Files.exists(target)) throw new IOException("not found");
        
        if (Files.isDirectory(target)) {
            try (java.util.stream.Stream<Path> walk = Files.walk(target)) {
                walk.sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
            }
            metaMapper.deleteByPath(user.getId(), path);
            metaMapper.deleteByPathPattern(user.getId(), path + "/%");
            favoriteMapper.deleteTree(user.getId(), path, path + "/%");
            shareMapper.deleteTree(user.getId(), path, path + "/%");
        } else {
            Files.delete(target);
            metaMapper.deleteByPath(user.getId(), path);
            favoriteMapper.deleteTree(user.getId(), path, path + "/%");
            shareMapper.deleteTree(user.getId(), path, path + "/%");
        }
    }

    public void rename(User user, String path, String newName) throws IOException {
        if (!isSafePath(user, path)) throw new IOException("unsafe path");
        if (newName.contains("/") || newName.contains("\\")) throw new IOException("invalid name");
        
        Path base = getUserRoot(user);
        Path source = base.resolve(path).normalize();
        if (!Files.exists(source)) throw new IOException("not found");
        
        Path dest = source.getParent().resolve(newName);
        if (Files.exists(dest)) throw new IOException("target exists");
        
        Files.move(source, dest);
        
        String parent = path.contains("/") ? path.substring(0, path.lastIndexOf('/')) : "";
        String newPath = (parent.isEmpty()) ? newName : parent + "/" + newName;

        if (Files.isDirectory(dest)) {
             metaMapper.renameFolderChildren(user.getId(), path, newPath, path + "/%");
             FileMetadata m = metaMapper.findByUserIdAndPath(user.getId(), path).orElse(null);
             if (m != null) {
                 m.setName(newName);
                 m.setPath(newPath);
                 metaMapper.updatePathInfo(m);
             }
        } else {
             FileMetadata m = metaMapper.findByUserIdAndPath(user.getId(), path).orElse(null);
             if (m != null) {
                 m.setName(newName);
                 m.setPath(newPath);
                 metaMapper.updatePathInfo(m);
             }
        }
        retargetReferences(user.getId(), path, newPath);
    }

    public String move(User user, String path, String destinationDir) throws IOException {
        if (path == null || path.isBlank()) throw new IOException("无效路径");
        String destDir = destinationDir == null ? "" : destinationDir;
        if (!isSafePath(user, path) || !isSafePath(user, destDir)) throw new IOException("无效路径");
        Path base = getUserRoot(user);
        Path source = base.resolve(path).normalize();
        if (!Files.exists(source) || !source.startsWith(base)) throw new IOException("not found");
        boolean directory = Files.isDirectory(source);
        if (!destDir.isEmpty()) {
            Path parent = base.resolve(destDir).normalize();
            if (!parent.startsWith(base) || !Files.isDirectory(parent)) throw new IOException(MOVE_DEST_MISSING);
        }
        String name = source.getFileName().toString();
        String newPath = destDir.isEmpty() ? name : destDir + "/" + name;
        if (newPath.equals(path)) return path;
        if (directory && (destDir.equals(path) || destDir.startsWith(path + "/"))) {
            throw new IOException(MOVE_INTO_SELF);
        }
        Path dest = base.resolve(newPath).normalize();
        if (!dest.startsWith(base)) throw new IOException("无效路径");
        if (Files.exists(dest)) throw new IOException(MOVE_EXISTS);
        Files.move(source, dest);
        if (directory) {
            metaMapper.renameFolderChildren(user.getId(), path, newPath, path + "/%");
            FileMetadata folder = metaMapper.findByUserIdAndPath(user.getId(), path).orElse(null);
            if (folder != null) {
                folder.setName(name);
                folder.setPath(newPath);
                folder.setParentPath(destDir);
                metaMapper.updatePathInfo(folder);
            }
        } else {
            FileMetadata file = metaMapper.findByUserIdAndPath(user.getId(), path).orElse(null);
            if (file != null) {
                file.setName(name);
                file.setPath(newPath);
                file.setParentPath(destDir);
                metaMapper.updatePathInfo(file);
            }
        }
        retargetReferences(user.getId(), path, newPath);
        return newPath;
    }

    /**
     * 复制单个文件或递归复制整个目录到目标目录（若目标存在同名项则自动重命名为 " (1)"）。
     */
    public String copy(User user, String path, String destinationDir) throws IOException {
        if (path == null || path.isBlank()) throw new IOException("无效路径");
        String destDir = destinationDir == null ? "" : destinationDir.trim();
        if (!isSafePath(user, path) || !isSafePath(user, destDir)) throw new IOException("无效路径");
        Path base = getUserRoot(user);
        Path source = base.resolve(path).normalize();
        if (!Files.exists(source) || !source.startsWith(base)) throw new IOException("not found");
        boolean directory = Files.isDirectory(source);
        if (!destDir.isEmpty()) {
            Path parent = base.resolve(destDir).normalize();
            if (!parent.startsWith(base) || !Files.isDirectory(parent)) throw new IOException(MOVE_DEST_MISSING);
        }
        if (directory && (destDir.equals(path) || destDir.startsWith(path + "/"))) {
            throw new IOException(MOVE_INTO_SELF);
        }

        long copyBytes = directory ? usedBytes(source) : Files.size(source);
        enforceQuota(user, copyBytes);

        String originalName = source.getFileName().toString();
        String finalName = originalName;
        String newPath = childPath(destDir, finalName);
        Path dest = base.resolve(newPath).normalize();

        if (Files.exists(dest)) {
            if (directory) {
                int count = 1;
                while (Files.exists(dest)) {
                    finalName = originalName + " (" + count++ + ")";
                    newPath = childPath(destDir, finalName);
                    dest = base.resolve(newPath).normalize();
                }
            } else {
                String baseName = FilenameUtils.getBaseName(originalName);
                String ext = FilenameUtils.getExtension(originalName);
                String extWithDot = ext.isEmpty() ? "" : "." + ext;
                int count = 1;
                while (Files.exists(dest)) {
                    finalName = baseName + " (" + count++ + ")" + extWithDot;
                    newPath = childPath(destDir, finalName);
                    dest = base.resolve(newPath).normalize();
                }
            }
        }

        if (directory) {
            final Path srcRoot = source;
            final Path dstRoot = dest;
            try (java.util.stream.Stream<Path> stream = Files.walk(srcRoot)) {
                java.util.List<Path> all = stream.collect(Collectors.toList());
                for (Path p : all) {
                    Path rel = srcRoot.relativize(p);
                    Path target = dstRoot.resolve(rel).normalize();
                    if (Files.isDirectory(p)) {
                        Files.createDirectories(target);
                    } else {
                        Files.createDirectories(target.getParent());
                        Files.copy(p, target, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                    }
                    String targetRel = base.relativize(target).toString().replace('\\', '/');
                    String targetParent = targetRel.contains("/") ? targetRel.substring(0, targetRel.lastIndexOf('/')) : "";
                    updateSingleFileMetadata(user, targetParent, target.toFile());
                }
            }
        } else {
            Files.copy(source, dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            ensureParentDirectoriesMetadata(user, destDir);
            updateSingleFileMetadata(user, destDir, dest.toFile());
        }
        return newPath;
    }

    /**
     * 将一个或多个文件/文件夹流式打包为 ZIP 写入输出流（无需在磁盘生成临时压缩包）。
     */
    public void writeZipArchive(User user, List<String> paths, java.io.OutputStream out) throws IOException {
        if (paths == null || paths.isEmpty()) {
            throw new IOException("未指定要下载的文件路径");
        }
        Path base = getUserRoot(user);
        List<Path> targets = new ArrayList<>();
        for (String rel : paths) {
            if (rel == null || rel.isBlank()) continue;
            if (!isSafePath(user, rel)) throw new IOException("无效路径");
            Path p = base.resolve(rel).normalize();
            if (!Files.exists(p) || !p.startsWith(base)) throw new IOException("文件不存在: " + rel);
            targets.add(p);
        }
        if (targets.isEmpty()) {
            throw new IOException("未找到可打包的文件");
        }

        java.util.Set<String> usedNames = new java.util.HashSet<>();
        try (java.util.zip.ZipOutputStream zos = new java.util.zip.ZipOutputStream(out, java.nio.charset.StandardCharsets.UTF_8)) {
            for (Path target : targets) {
                String rootName = target.getFileName().toString();
                String uniqueRoot = rootName;
                int dup = 1;
                while (usedNames.contains(uniqueRoot)) {
                    uniqueRoot = rootName + " (" + dup++ + ")";
                }
                usedNames.add(uniqueRoot);

                if (Files.isDirectory(target)) {
                    final String topPrefix = uniqueRoot;
                    try (java.util.stream.Stream<Path> walk = Files.walk(target)) {
                        List<Path> nodes = walk.collect(Collectors.toList());
                        for (Path node : nodes) {
                            String relName = target.relativize(node).toString().replace('\\', '/');
                            if (relName.equals(".chunks") || relName.startsWith(".chunks/")) continue;
                            String entryName = relName.isEmpty() ? topPrefix + "/" : topPrefix + "/" + relName + (Files.isDirectory(node) ? "/" : "");
                            if (Files.isDirectory(node)) {
                                java.util.zip.ZipEntry dirEntry = new java.util.zip.ZipEntry(entryName);
                                dirEntry.setTime(node.toFile().lastModified());
                                zos.putNextEntry(dirEntry);
                                zos.closeEntry();
                            } else if (Files.isRegularFile(node)) {
                                java.util.zip.ZipEntry fileEntry = new java.util.zip.ZipEntry(entryName);
                                fileEntry.setTime(node.toFile().lastModified());
                                zos.putNextEntry(fileEntry);
                                Files.copy(node, zos);
                                zos.closeEntry();
                            }
                        }
                    }
                } else if (Files.isRegularFile(target)) {
                    java.util.zip.ZipEntry fileEntry = new java.util.zip.ZipEntry(uniqueRoot);
                    fileEntry.setTime(target.toFile().lastModified());
                    zos.putNextEntry(fileEntry);
                    Files.copy(target, zos);
                    zos.closeEntry();
                }
            }
            zos.finish();
        }
    }

    /**
     * 递归全量扫描用户物理存储目录并校准 file_metadata 索引（包含深层外部拷入文件发现与孤儿记录清理）。
     */
    public java.util.Map<String, Integer> resyncAllMetadata(User user) throws IOException {
        Path base = getUserRoot(user);
        Files.createDirectories(base);
        Path chunksRoot = base.resolve(".chunks").normalize();

        java.util.Set<String> seenRelPaths = new java.util.HashSet<>();
        int indexed = 0;
        try (java.util.stream.Stream<Path> walk = Files.walk(base)) {
            List<Path> all = walk
                    .filter(p -> !p.equals(base))
                    .filter(p -> !p.normalize().startsWith(chunksRoot))
                    .collect(Collectors.toList());
            for (Path p : all) {
                String rel = base.relativize(p).toString().replace('\\', '/');
                if (rel.isEmpty() || ".chunks".equals(rel) || rel.startsWith(".chunks/")) continue;
                String parent = rel.contains("/") ? rel.substring(0, rel.lastIndexOf('/')) : "";
                updateSingleFileMetadata(user, parent, p.toFile());
                seenRelPaths.add(rel);
                indexed++;
            }
        }

        int removed = 0;
        for (FileMetadata existing : metaMapper.findAllByUserId(user.getId())) {
            if (existing.getPath() != null && !seenRelPaths.contains(existing.getPath())) {
                metaMapper.deleteByPath(user.getId(), existing.getPath());
                removed++;
            }
        }
        return java.util.Map.of("indexed", indexed, "removed", removed);
    }

    public FileListResponse recent(User user, int limit) {
        int capped = Math.min(Math.max(limit, 1), 100);
        return responseOf("", metaMapper.findRecent(user.getId(), capped));
    }

    public FileListResponse search(User user, String query) {
        FileListResponse empty = new FileListResponse();
        empty.setCurrentPath("");
        empty.setItems(List.of());
        if (query == null || query.isBlank()) return empty;
        String pattern = "%" + query.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%";
        return responseOf("", metaMapper.searchByName(user.getId(), pattern, 200));
    }

    private FileListResponse responseOf(String currentPath, List<FileMetadata> metas) {
        List<FileListResponse.Item> items = metas.stream()
                .filter(m -> !".chunks".equals(m.getName()) && (m.getPath() == null || !m.getPath().startsWith(".chunks")))
                .map(this::toItem)
                .collect(Collectors.toList());
        FileListResponse res = new FileListResponse();
        res.setCurrentPath(currentPath);
        res.setItems(items);
        return res;
    }

    private FileListResponse.Item toItem(FileMetadata meta) {
        FileListResponse.Item item = new FileListResponse.Item();
        item.setName(meta.getName());
        item.setDirectory(meta.isDirectory());
        item.setSize(meta.getSize());
        item.setModifiedTime(meta.getLastModified());
        item.setContentType(meta.getContentType());
        item.setPath(meta.getPath());
        return item;
    }

    private void retargetReferences(long userId, String oldPath, String newPath) {
        String pattern = oldPath + "/%";
        favoriteMapper.retarget(userId, oldPath, newPath, pattern);
        shareMapper.retarget(userId, oldPath, newPath, pattern);
    }
    
    public void createFolder(User user, String path) throws IOException {
        if (!isSafePath(user, path)) throw new IOException("unsafe path");
        Path base = getUserRoot(user);
        Path target = base.resolve(path).normalize();
        if (Files.exists(target)) throw new IOException("exists");
        Files.createDirectories(target);
        
        FileMetadata m = new FileMetadata();
        m.setUserId(user.getId());
        m.setPath(path);
        m.setName(FilenameUtils.getName(path));
        m.setDirectory(true);
        m.setSize(0);
        m.setLastModified(System.currentTimeMillis() / 1000);
        
        String parent = "";
        if (path.contains("/")) {
            parent = path.substring(0, path.lastIndexOf('/'));
        }
        m.setParentPath(parent);
        
        metaMapper.insert(m);
    }

    /**
     * 存储用量。
     * - 管理员（role=ADMIN）：返回整块磁盘的 总量/已用/空闲（scope=disk）。
     * - 普通用户：used = 个人目录实际占用；total = 配额（storage_quota>0）或在不限额时回退为磁盘总量并标记 unlimited。
     */
    public java.util.Map<String, Object> getStorageUsage(User user) {
        Path root = getUserRoot(user);
        File file = root.toFile();
        if (!file.exists()) file.mkdirs();

        java.util.Map<String, Object> res = new java.util.HashMap<>();

        if (isAdmin(user)) {
            long total = file.getTotalSpace();
            long free = file.getUsableSpace();
            res.put("scope", "disk");
            res.put("total", total);
            res.put("free", free);
            res.put("used", total - free);
            res.put("quota", 0L);
            res.put("unlimited", false);
            return res;
        }

        long used = directorySize(root);
        long quota = user.getStorageQuota();
        res.put("scope", "user");
        res.put("used", used);
        res.put("quota", quota);
        if (quota > 0) {
            res.put("total", quota);
            res.put("free", Math.max(0, quota - used));
            res.put("unlimited", false);
        } else {
            // 不限额：以磁盘总量作为进度条参考，并标记 unlimited 供前端展示“无限制”
            long total = file.getTotalSpace();
            res.put("total", total);
            res.put("free", file.getUsableSpace());
            res.put("unlimited", true);
        }
        return res;
    }

    private boolean isAdmin(User user) {
        return user.getRole() != null && user.getRole().equalsIgnoreCase("ADMIN");
    }

    /** 父路径为空时路径就是文件名，避免根目录被写成 "/文件名"。 */
    private static String childPath(String parentPath, String name) {
        if (parentPath == null || parentPath.isEmpty()) {
            return name;
        }
        return parentPath + "/" + name;
    }

    /**
     * storage_quota 大于 0 时，已占用加上本次大小不得超过配额。
     * 0 与负数表示不限额（管理员默认配额为 0）。
     */
    private void enforceQuota(User user, long incomingBytes) throws IOException {
        long quota = user.getStorageQuota();
        if (quota <= 0) {
            return;
        }
        long used = usedBytes(getUserRoot(user));
        if (used > quota || incomingBytes > quota - used) {
            throw new IOException(QUOTA_EXCEEDED);
        }
    }

    private long usedBytes(Path dir) throws IOException {
        if (!Files.exists(dir)) {
            return 0L;
        }
        Path chunksRoot = dir.resolve(".chunks").normalize();
        try (java.util.stream.Stream<Path> walk = Files.walk(dir)) {
            return walk.filter(Files::isRegularFile)
                    .filter(p -> !p.normalize().startsWith(chunksRoot))
                    .mapToLong(p -> p.toFile().length())
                    .sum();
        }
    }

    private long directorySize(Path dir) {
        try {
            return usedBytes(dir);
        } catch (IOException e) {
            return 0L;
        }
    }

    /**
     * 预览用的 Content-Type。图片（不含 SVG）、视频、音频和 PDF 保持真实类型并内联；
     * HTML、SVG、XML 以及其他文本改为 text/plain，避免浏览器把响应当成可执行文档。
     */
    public MediaType previewMediaType(String name) {
        if (isInlinePreview(name)) {
            return MediaType.parseMediaType(detectContentType(name));
        }
        return MediaType.parseMediaType("text/plain; charset=UTF-8");
    }

    private boolean isInlinePreview(String name) {
        String ext = FilenameUtils.getExtension(name == null ? "" : name).toLowerCase();
        switch (ext) {
            case "jpg": case "jpeg": case "jfif": case "pjpeg": case "pjp":
            case "png": case "apng": case "gif": case "webp": case "bmp": case "avif": case "ico": case "cur":
            case "mp4": case "m4v": case "webm": case "ogg": case "ogv": case "mov": case "3gp": case "mkv":
            case "mp3": case "wav": case "flac": case "aac": case "m4a": case "oga": case "opus": case "weba": case "mid": case "midi": case "amr":
            case "pdf":
                return true;
            default:
                return false;
        }
    }

    /**
     * 根据文件名推断 MIME 类型，用于元数据。优先用扩展名映射，回退到 NIO 探测。
     */
    public String detectContentType(String name) {
        String ext = FilenameUtils.getExtension(name == null ? "" : name).toLowerCase();
        switch (ext) {
            case "txt": case "log": case "md": case "markdown": case "rst": case "adoc": case "org":
            case "csv": case "tsv": case "ini": case "conf": case "cfg": case "config": case "properties":
            case "yml": case "yaml": case "toml": case "env": case "lock": case "gitignore": case "gitattributes":
            case "editorconfig": case "npmrc": case "yarnrc": case "babelrc": case "eslintrc": case "prettierrc":
            case "java": case "kt": case "kts": case "scala": case "groovy": case "gradle":
            case "py": case "pyw": case "pyi": case "rb": case "php": case "pl": case "pm": case "lua": case "r": case "jl":
            case "c": case "h": case "cpp": case "hpp": case "cc": case "cxx": case "cs": case "go": case "rs":
            case "swift": case "m": case "mm": case "dart": case "ex": case "exs": case "erl": case "hs": case "clj":
            case "ts": case "tsx": case "jsx": case "mjs": case "cjs": case "vue": case "svelte": case "astro":
            case "scss": case "sass": case "less": case "sql": case "graphql": case "gql": case "proto":
            case "sh": case "bash": case "zsh": case "fish": case "bat": case "cmd": case "ps1":
            case "tex": case "bib": case "srt": case "vtt": case "ass": case "diff": case "patch":
            case "cmake": case "mk": case "nix": case "tf": case "hcl": case "sol":
                return "text/plain; charset=UTF-8";
            case "json": case "jsonl": case "ndjson": case "json5": return "application/json";
            case "xml": case "plist": return "application/xml";
            case "html": case "htm": case "xhtml": return "text/html; charset=UTF-8";
            case "css": return "text/css; charset=UTF-8";
            case "js": return "text/javascript; charset=UTF-8";
            case "jpg": case "jpeg": case "jfif": case "pjpeg": case "pjp": return "image/jpeg";
            case "png": return "image/png";
            case "apng": return "image/apng";
            case "gif": return "image/gif";
            case "webp": return "image/webp";
            case "bmp": return "image/bmp";
            case "avif": return "image/avif";
            case "ico": case "cur": return "image/x-icon";
            case "svg": return "image/svg+xml";
            case "mp4": case "m4v": return "video/mp4";
            case "webm": return "video/webm";
            case "ogg": case "ogv": return "video/ogg";
            case "mov": return "video/quicktime";
            case "3gp": return "video/3gpp";
            case "mkv": return "video/x-matroska";
            case "mp3": return "audio/mpeg";
            case "wav": return "audio/wav";
            case "flac": return "audio/flac";
            case "aac": return "audio/aac";
            case "m4a": return "audio/mp4";
            case "oga": return "audio/ogg";
            case "opus": return "audio/opus";
            case "weba": return "audio/webm";
            case "mid": case "midi": return "audio/midi";
            case "amr": return "audio/amr";
            case "pdf": return "application/pdf";
            default:
                try {
                    String probed = Files.probeContentType(Paths.get(name == null ? "" : name));
                    return probed != null ? probed : "application/octet-stream";
                } catch (Exception e) {
                    return "application/octet-stream";
                }
        }
    }
}

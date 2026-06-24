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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.glqyu.storeit.config.AppProperties;
import com.glqyu.storeit.dto.FileListResponse;
import com.glqyu.storeit.mapper.FileMetadataMapper;
import com.glqyu.storeit.model.FileMetadata;
import com.glqyu.storeit.model.User;

@Service
public class FileService {
    private final AppProperties props;
    private final FileMetadataMapper metaMapper;

    public FileService(AppProperties props, FileMetadataMapper metaMapper) {
        this.props = props;
        this.metaMapper = metaMapper;
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
        Path base = getUserRoot(user);
        Path target = base.resolve(relativePath == null ? "" : relativePath).normalize();
        return target.startsWith(base);
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
        
        List<FileListResponse.Item> items = metas.stream().map(m -> {
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
        if (!isSafePath(user, directory)) throw new IOException("unsafe path");
        String originalName = FilenameUtils.getName(file.getOriginalFilename());
        String fileName = originalName;
        Path base = getUserRoot(user);
        Path dir = base.resolve(directory == null ? "" : directory).normalize();
        Files.createDirectories(dir);
        Path dest = dir.resolve(fileName);
        
        // 自动重命名逻辑
        int count = 1;
        String baseName = FilenameUtils.getBaseName(originalName);
        String extension = FilenameUtils.getExtension(originalName);
        while (Files.exists(dest)) {
            fileName = baseName + " (" + count++ + ")." + extension;
            dest = dir.resolve(fileName);
        }
        
        if (dir.toFile().getUsableSpace() < file.getSize()) {
            throw new IOException("磁盘空间不足");
        }
        file.transferTo(dest);
        
        // syncMetadata(user, directory, dir);
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
    
    public Resource getResourceForUser(User owner, String relativePath) throws IOException {
        return getResource(owner, relativePath);
    }

    // 新增 updateSingleFileMetadata 方法
    private void updateSingleFileMetadata(User user, String parentPath, File file) {
        String name = file.getName();
        Optional<FileMetadata> existing = metaMapper.findByUserIdAndPath(user.getId(), parentPath + "/" + name); // 需确保 Mapper 有此方法或类似逻辑
        
        FileMetadata m = existing.orElse(new FileMetadata());
        m.setUserId(user.getId());
        m.setPath((parentPath == null || parentPath.isEmpty()) ? name : parentPath + "/" + name);
        m.setName(name);
        m.setDirectory(file.isDirectory());
        m.setSize(file.isDirectory() ? 0 : file.length());
        m.setLastModified(file.lastModified() / 1000);
        m.setContentType(file.isDirectory() ? null : detectContentType(name));
        m.setParentPath(parentPath == null ? "" : parentPath);
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
        } else {
            Files.delete(target);
            metaMapper.deleteByPath(user.getId(), path);
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

    private long directorySize(Path dir) {
        if (!Files.exists(dir)) return 0L;
        try (java.util.stream.Stream<Path> walk = Files.walk(dir)) {
            return walk.filter(Files::isRegularFile)
                    .mapToLong(p -> p.toFile().length())
                    .sum();
        } catch (IOException e) {
            return 0L;
        }
    }

    /**
     * 根据文件名推断 MIME 类型，用于元数据与预览。优先用扩展名映射，回退到 NIO 探测。
     */
    public String detectContentType(String name) {
        String ext = FilenameUtils.getExtension(name == null ? "" : name).toLowerCase();
        switch (ext) {
            case "txt": case "log": case "md": case "csv": case "ini": case "conf": case "yml": case "yaml":
                return "text/plain; charset=UTF-8";
            case "json": return "application/json";
            case "xml": return "application/xml";
            case "html": case "htm": return "text/html; charset=UTF-8";
            case "css": return "text/css; charset=UTF-8";
            case "js": return "text/javascript; charset=UTF-8";
            case "java": case "py": case "c": case "cpp": case "h": case "go": case "rs": case "sh": case "sql":
                return "text/plain; charset=UTF-8";
            case "jpg": case "jpeg": return "image/jpeg";
            case "png": return "image/png";
            case "gif": return "image/gif";
            case "webp": return "image/webp";
            case "bmp": return "image/bmp";
            case "svg": return "image/svg+xml";
            case "mp4": return "video/mp4";
            case "webm": return "video/webm";
            case "ogg": case "ogv": return "video/ogg";
            case "mov": return "video/quicktime";
            case "mp3": return "audio/mpeg";
            case "wav": return "audio/wav";
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

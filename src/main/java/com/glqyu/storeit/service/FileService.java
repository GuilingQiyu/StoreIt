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
                    if (m.getSize() != (f.isDirectory() ? 0 : f.length()) || m.getLastModified() != f.lastModified() / 1000) {
                        m.setSize(f.isDirectory() ? 0 : f.length());
                        m.setLastModified(f.lastModified() / 1000);
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

    public java.util.Map<String, Long> getStorageUsage(User user) {
        Path root = getUserRoot(user);
        File file = root.toFile();
        // Ensure root exists
        if (!file.exists()) file.mkdirs();
        
        long total = file.getTotalSpace();
        long free = file.getUsableSpace();
        long used = total - free;
        
        return java.util.Map.of("total", total, "free", free, "used", used);
    }
}

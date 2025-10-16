package com.glqyu.storeit.service;

import com.glqyu.storeit.config.AppProperties;
import com.glqyu.storeit.dto.FileListResponse;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class FileService {
    private final AppProperties props;
    public FileService(AppProperties props) { this.props = props; ensureStorage(); }

    private void ensureStorage() {
        Path p = Paths.get(props.getStorageRoot());
        try { Files.createDirectories(p); } catch (IOException ignored) {}
    }

    public boolean isSafePath(String relativePath) {
        Path base = Paths.get(props.getStorageRoot()).toAbsolutePath().normalize();
        Path target = base.resolve(relativePath == null ? "" : relativePath).normalize();
        return target.startsWith(base);
    }

    public FileListResponse list(String relativePath) throws IOException {
        if (!isSafePath(relativePath)) throw new IOException("unsafe path");
        Path base = Paths.get(props.getStorageRoot()).toAbsolutePath().normalize();
        Path dir = base.resolve(relativePath == null ? "" : relativePath).normalize();
        Files.createDirectories(dir);
        List<FileListResponse.Item> items = new ArrayList<>();
        Files.list(dir).forEach(p -> {
            File f = p.toFile();
            FileListResponse.Item it = new FileListResponse.Item();
            it.setName(f.getName());
            it.setDirectory(f.isDirectory());
            it.setSize(f.isDirectory() ? 0 : f.length());
            it.setModifiedTime(f.lastModified() / 1000);
            Path rel = base.relativize(p);
            it.setPath(rel.toString().replace('\\', '/'));
            items.add(it);
        });
        items.sort(Comparator.comparing(FileListResponse.Item::isDirectory).reversed()
                .thenComparing(i -> i.getName().toLowerCase()));
        FileListResponse res = new FileListResponse();
        res.setCurrentPath(relativePath == null ? "" : relativePath);
        res.setItems(items);
        return res;
    }

    public String saveFile(String directory, MultipartFile file) throws IOException {
        if (!isSafePath(directory)) throw new IOException("unsafe path");
        String fileName = FilenameUtils.getName(file.getOriginalFilename());
        Path base = Paths.get(props.getStorageRoot()).toAbsolutePath().normalize();
        Path dir = base.resolve(directory == null ? "" : directory).normalize();
        Files.createDirectories(dir);
        Path dest = dir.resolve(fileName);
        file.transferTo(dest);
        return base.relativize(dest).toString().replace('\\', '/');
    }

    public Resource getResource(String relativePath) throws IOException {
        if (!isSafePath(relativePath)) throw new IOException("unsafe path");
        Path base = Paths.get(props.getStorageRoot()).toAbsolutePath().normalize();
        Path target = base.resolve(relativePath).normalize();
        if (!Files.exists(target)) throw new IOException("not found");
        return new FileSystemResource(target);
    }
}

package com.glqyu.storeit.web;

import com.glqyu.storeit.dto.ApiResponse;
import com.glqyu.storeit.dto.FileListResponse;
import com.glqyu.storeit.mapper.FavoriteMapper;
import com.glqyu.storeit.mapper.FileMetadataMapper;
import com.glqyu.storeit.model.Favorite;
import com.glqyu.storeit.model.FileMetadata;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.AuthService;
import com.glqyu.storeit.service.FileService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class FavoriteController {
    private final FavoriteMapper favoriteMapper;
    private final FileMetadataMapper metaMapper;
    private final FileService fileService;
    private final AuthService authService;

    public FavoriteController(FavoriteMapper favoriteMapper, FileMetadataMapper metaMapper, FileService fileService, AuthService authService) {
        this.favoriteMapper = favoriteMapper;
        this.metaMapper = metaMapper;
        this.fileService = fileService;
        this.authService = authService;
    }

    @GetMapping("/api/favorites")
    public ResponseEntity<?> list(HttpServletRequest request) {
        User user = currentUser(request);
        List<FileListResponse.Item> items = new ArrayList<>();
        for (Favorite favorite : favoriteMapper.findByUserId(user.getId())) {
            FileMetadata meta = metaMapper.findByUserIdAndPath(user.getId(), favorite.getPath()).orElse(null);
            FileListResponse.Item item = new FileListResponse.Item();
            if (meta != null) {
                item.setName(meta.getName());
                item.setDirectory(meta.isDirectory());
                item.setSize(meta.getSize());
                item.setModifiedTime(meta.getLastModified());
                item.setContentType(meta.getContentType());
                item.setPath(meta.getPath());
            } else {
                String path = favorite.getPath();
                int slash = path.lastIndexOf('/');
                item.setName(slash >= 0 ? path.substring(slash + 1) : path);
                item.setPath(path);
            }
            items.add(item);
        }
        FileListResponse response = new FileListResponse();
        response.setCurrentPath("");
        response.setItems(items);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/favorites")
    public ResponseEntity<?> add(HttpServletRequest request, @RequestBody Map<String, String> body) {
        User user = currentUser(request);
        String path = body.get("path");
        if (path == null || path.isBlank() || !fileService.isSafePath(user, path)) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("无效路径"));
        }
        try {
            fileService.getResource(user, path);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("文件不存在"));
        }
        Favorite favorite = new Favorite();
        favorite.setUserId(user.getId());
        favorite.setPath(path);
        favorite.setCreatedAt(Instant.now().getEpochSecond());
        favoriteMapper.insert(favorite);
        return ResponseEntity.ok(ApiResponse.ok("已收藏"));
    }

    @DeleteMapping("/api/favorites")
    public ResponseEntity<?> remove(HttpServletRequest request, @RequestParam("path") String path) {
        User user = currentUser(request);
        favoriteMapper.deleteOne(user.getId(), path == null ? "" : path);
        return ResponseEntity.ok(ApiResponse.ok("已取消收藏"));
    }

    private User currentUser(HttpServletRequest request) {
        String username = authService.getUsernameFromRequest(request).orElseThrow(() -> new RuntimeException("Not logged in"));
        return authService.findUser(username).orElseThrow(() -> new RuntimeException("User not found"));
    }
}

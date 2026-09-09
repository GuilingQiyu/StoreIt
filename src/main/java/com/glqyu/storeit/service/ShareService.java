package com.glqyu.storeit.service;

import com.glqyu.storeit.mapper.FileShareMapper;
import com.glqyu.storeit.model.FileShare;
import com.glqyu.storeit.model.User;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShareService {
    private final FileShareMapper mapper;
    private final SecureRandom random = new SecureRandom();
    public ShareService(FileShareMapper mapper) { this.mapper = mapper; }

    public String createToken(int bytes) {
        byte[] buf = new byte[bytes];
        random.nextBytes(buf);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
    }

    public FileShare createShare(User user, String filePath, Integer expireHours, Integer maxDownloads) {
        FileShare s = new FileShare();
        s.setUserId(user.getId());
        s.setFilePath(filePath);
        s.setToken(createToken(12));
        long now = Instant.now().getEpochSecond();
        s.setCreatedAt(now);

        if (expireHours != null && expireHours == -1) {
            s.setExpiry(null);
        } else {
            s.setExpiry(now + (expireHours == null ? 30 * 24 : expireHours) * 3600L);
        }

        // 0 / null = 不限次数
        if (maxDownloads != null && maxDownloads <= 0) {
            s.setMaxDownloads(null);
        } else {
            s.setMaxDownloads(maxDownloads);
        }
        s.setDownloads(0);
        mapper.insert(s);
        return s;
    }

    public Optional<FileShare> validateToken(String token) {
        Optional<FileShare> opt = mapper.findByToken(token);
        if (opt.isEmpty()) return Optional.empty();
        FileShare s = opt.get();
        if (s.getExpiry() != null && s.getExpiry() < Instant.now().getEpochSecond()) return Optional.empty();
        if (s.getMaxDownloads() != null && s.getMaxDownloads() > 0 && s.getDownloads() >= s.getMaxDownloads()) return Optional.empty();
        return Optional.of(s);
    }

    /**
     * 原子化消费一次下载额度。返回 true 表示成功（已自增下载计数）；
     * 返回 false 表示并发竞争下已过期或达到下载上限，不应继续提供文件。
     */
    public boolean consumeDownload(long id) {
        return mapper.consumeDownload(id, Instant.now().getEpochSecond()) > 0;
    }

    public List<FileShare> listByUser(long userId) {
        return mapper.findByUserId(userId);
    }

    public List<FileShare> listAll() {
        return mapper.findAll();
    }

    /** 撤销分享：所有者或管理员。 */
    public boolean revoke(User actor, long shareId) {
        Optional<FileShare> opt = mapper.findById(shareId);
        if (opt.isEmpty()) return false;
        FileShare s = opt.get();
        if (!actor.isAdmin() && (s.getUserId() == null || !s.getUserId().equals(actor.getId()))) {
            throw new SecurityException("无权撤销该分享");
        }
        return mapper.deleteById(shareId) > 0;
    }

    public Map<String, Object> toView(FileShare s) {
        long now = Instant.now().getEpochSecond();
        Map<String, Object> m = new HashMap<>();
        m.put("id", s.getId());
        m.put("filePath", s.getFilePath());
        m.put("token", s.getToken());
        m.put("url", "/d/" + s.getToken());
        m.put("expiry", s.getExpiry());
        m.put("createdAt", s.getCreatedAt());
        m.put("maxDownloads", s.getMaxDownloads());
        m.put("downloads", s.getDownloads() == null ? 0 : s.getDownloads());
        m.put("userId", s.getUserId());
        boolean expired = s.getExpiry() != null && s.getExpiry() < now;
        boolean maxed = s.getMaxDownloads() != null && s.getMaxDownloads() > 0
                && s.getDownloads() != null && s.getDownloads() >= s.getMaxDownloads();
        m.put("active", !expired && !maxed);
        Integer remaining = null;
        if (s.getMaxDownloads() != null && s.getMaxDownloads() > 0) {
            remaining = Math.max(0, s.getMaxDownloads() - (s.getDownloads() == null ? 0 : s.getDownloads()));
        }
        m.put("remainingDownloads", remaining);
        return m;
    }

    public List<Map<String, Object>> toViewList(List<FileShare> list) {
        return list.stream().map(this::toView).collect(Collectors.toList());
    }

    public int cleanup() { return mapper.deleteExpiredOrMaxed(Instant.now().getEpochSecond()); }
}

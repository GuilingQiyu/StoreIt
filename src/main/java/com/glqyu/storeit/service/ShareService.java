package com.glqyu.storeit.service;

import com.glqyu.storeit.mapper.FileShareMapper;
import com.glqyu.storeit.model.FileShare;
import com.glqyu.storeit.model.User;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

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
        return createShare(user, filePath, expireHours, maxDownloads, false, "READ", null, null);
    }

    public FileShare createShare(User user, String filePath, Integer expireHours, Integer maxDownloads,
                                 boolean isDirectory, String permission, String accessPassword, String title) {
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

        s.setMaxDownloads(maxDownloads);
        s.setDownloads(0);
        s.setDirectory(isDirectory);
        s.setPermission(normalizePermission(permission));
        String cleanPwd = accessPassword == null ? "" : accessPassword.trim();
        s.setAccessPassword(cleanPwd.isEmpty() ? null : cleanPwd);
        String cleanTitle = title == null ? "" : title.trim();
        s.setTitle(cleanTitle.isEmpty() ? null : cleanTitle);
        mapper.insert(s);
        return s;
    }

    public static String normalizePermission(String perm) {
        if (perm == null) return "READ";
        String upper = perm.trim().toUpperCase();
        if ("READ_WRITE".equals(upper) || "RW".equals(upper) || "WRITE".equals(upper)) {
            return "READ_WRITE";
        }
        return "READ";
    }

    public boolean checkPassword(FileShare share, String providedPassword) {
        String expected = share.getAccessPassword();
        if (expected == null || expected.isBlank()) {
            return true;
        }
        if (providedPassword == null) {
            return false;
        }
        return expected.equals(providedPassword.trim());
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

    public int cleanup() { return mapper.deleteExpiredOrMaxed(Instant.now().getEpochSecond()); }

    public List<FileShare> list(User user) {
        return mapper.findByUserId(user.getId());
    }

    public boolean revoke(User user, long id) {
        return mapper.deleteByIdAndUser(id, user.getId()) > 0;
    }
}

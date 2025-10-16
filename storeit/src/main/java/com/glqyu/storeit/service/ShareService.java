package com.glqyu.storeit.service;

import com.glqyu.storeit.mapper.FileShareMapper;
import com.glqyu.storeit.model.FileShare;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
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

    public FileShare createShare(String filePath, Integer expireDays, Integer maxDownloads) {
        FileShare s = new FileShare();
        s.setFilePath(filePath);
        s.setToken(createToken(12));
        s.setExpiry(expireDays == null ? null : Instant.now().plus(expireDays, ChronoUnit.DAYS).getEpochSecond());
        s.setMaxDownloads(maxDownloads);
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

    public void markDownloaded(long id) { mapper.incrementDownloads(id); }

    public int cleanup() { return mapper.deleteExpiredOrMaxed(Instant.now().getEpochSecond()); }
}

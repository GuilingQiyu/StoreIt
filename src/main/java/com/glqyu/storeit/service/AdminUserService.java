package com.glqyu.storeit.service;

import com.glqyu.storeit.config.AppProperties;
import com.glqyu.storeit.mapper.UserMapper;
import com.glqyu.storeit.model.User;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AdminUserService {
    public static final int MIN_PASSWORD_LENGTH = 8;
    public static final String PASSWORD_TOO_SHORT = "口令至少 8 位";

    private final UserMapper userMapper;
    private final AppProperties props;

    public AdminUserService(UserMapper userMapper, AppProperties props) {
        this.userMapper = userMapper;
        this.props = props;
    }

    public List<User> list() {
        return userMapper.findAll();
    }

    public User create(String username, String rawPassword, long storageQuota) throws IOException {
        Usernames.check(username);
        checkPassword(rawPassword);
        checkQuota(storageQuota);
        if (userMapper.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("用户已存在");
        }
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(BCrypt.hashpw(rawPassword, BCrypt.gensalt()));
        user.setCreatedAt(Instant.now().getEpochSecond());
        user.setRole("USER");
        user.setStorageQuota(storageQuota);
        userMapper.insert(user);
        Files.createDirectories(Paths.get(props.getStorageRoot(), username));
        return user;
    }

    public void update(String actorUsername, String username, Long storageQuota, String role) {
        User existing = userMapper.findByUsername(username).orElseThrow(NoSuchElementException::new);
        if (storageQuota == null && (role == null || role.isBlank())) {
            throw new IllegalArgumentException("没有要修改的内容");
        }
        if (storageQuota != null) {
            checkQuota(storageQuota);
            userMapper.updateQuota(existing.getUsername(), storageQuota);
        }
        if (role != null && !role.isBlank()) {
            String normalized = normalizeRole(role);
            if (actorUsername.equals(existing.getUsername()) && !"ADMIN".equals(normalized)) {
                throw new IllegalArgumentException("不能取消自己的管理员角色");
            }
            userMapper.updateRole(existing.getUsername(), normalized);
        }
    }

    public void resetPassword(String username, String rawPassword) {
        User existing = userMapper.findByUsername(username).orElseThrow(NoSuchElementException::new);
        checkPassword(rawPassword);
        existing.setPasswordHash(BCrypt.hashpw(rawPassword, BCrypt.gensalt()));
        userMapper.updatePassword(existing);
    }

    private static void checkPassword(String rawPassword) {
        if (rawPassword == null || rawPassword.length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalArgumentException(PASSWORD_TOO_SHORT);
        }
    }

    private static void checkQuota(long storageQuota) {
        if (storageQuota < 0) {
            throw new IllegalArgumentException("配额不能为负数");
        }
    }

    private static String normalizeRole(String role) {
        if ("ADMIN".equalsIgnoreCase(role)) {
            return "ADMIN";
        }
        if ("USER".equalsIgnoreCase(role)) {
            return "USER";
        }
        throw new IllegalArgumentException("角色只能是 USER 或 ADMIN");
    }
}

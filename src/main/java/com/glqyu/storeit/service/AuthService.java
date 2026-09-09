package com.glqyu.storeit.service;

import com.glqyu.storeit.config.AppProperties;
import com.glqyu.storeit.mapper.SessionMapper;
import com.glqyu.storeit.mapper.UserMapper;
import com.glqyu.storeit.model.SessionRecord;
import com.glqyu.storeit.model.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class AuthService {
    /** 文档与代码中的示例/默认弱口令；仍使用时强制改密。 */
    public static final String WEAK_DEFAULT_PASSWORD = "authorized_users";
    private static final Pattern USERNAME_OK = Pattern.compile("^[a-zA-Z0-9_]{3,32}$");

    private final UserMapper userMapper;
    private final SessionMapper sessionMapper;
    private final AppProperties props;

    public AuthService(UserMapper userMapper, SessionMapper sessionMapper, AppProperties props) {
        this.userMapper = userMapper;
        this.sessionMapper = sessionMapper;
        this.props = props;
    }

    public static boolean isWeakDefaultPassword(String raw) {
        return WEAK_DEFAULT_PASSWORD.equals(raw);
    }

    public Optional<User> findUser(String username) {
        return userMapper.findByUsername(username);
    }

    public Optional<User> findUserById(Long id) {
        return userMapper.findById(id);
    }

    public List<User> listUsers() {
        return userMapper.findAll();
    }

    public boolean checkPassword(User user, String raw) {
        return BCrypt.checkpw(raw, user.getPasswordHash());
    }

    /** 当前哈希是否仍对应文档示例弱口令。 */
    public boolean passwordMatchesWeakDefault(User user) {
        if (user == null || user.getPasswordHash() == null) return false;
        return BCrypt.checkpw(WEAK_DEFAULT_PASSWORD, user.getPasswordHash());
    }

    public boolean mustChangePassword(User user) {
        if (user == null) return false;
        if (user.isMustChangePassword()) return true;
        return passwordMatchesWeakDefault(user);
    }

    /**
     * 修改当前用户密码。新口令不得为弱默认口令，且不得与旧口令相同。
     * 成功后清除 must_change_password 标记，并踢掉该用户其他会话。
     */
    public void changePassword(User user, String currentPassword, String newPassword) {
        if (user == null) throw new IllegalArgumentException("用户不存在");
        if (currentPassword == null || newPassword == null) {
            throw new IllegalArgumentException("密码不能为空");
        }
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("新密码至少 8 位");
        }
        if (isWeakDefaultPassword(newPassword)) {
            throw new IllegalArgumentException("新密码不能使用文档示例默认口令");
        }
        if (!checkPassword(user, currentPassword)) {
            throw new IllegalArgumentException("当前密码不正确");
        }
        if (checkPassword(user, newPassword)) {
            throw new IllegalArgumentException("新密码不能与当前密码相同");
        }
        user.setPasswordHash(BCrypt.hashpw(newPassword, BCrypt.gensalt()));
        user.setMustChangePassword(false);
        userMapper.updatePassword(user);
        // 改密后使其它会话失效；当前请求随后可继续，调用方宜重建会话或保持本会话
        sessionMapper.deleteByUsername(user.getUsername());
    }

    public void setMustChangePassword(String username, boolean flag) {
        userMapper.updateMustChangePassword(username, flag);
    }

    /** 管理员创建普通用户。 */
    public User createUser(String username, String password, long storageQuotaBytes, String role) {
        if (username == null || !USERNAME_OK.matcher(username).matches()) {
            throw new IllegalArgumentException("用户名须为 3–32 位字母/数字/下划线");
        }
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("密码至少 8 位");
        }
        if (isWeakDefaultPassword(password)) {
            throw new IllegalArgumentException("不能使用文档示例默认口令");
        }
        if (userMapper.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("用户名已存在");
        }
        String r = (role == null || role.isBlank()) ? "USER" : role.trim().toUpperCase();
        if (!"USER".equals(r) && !"ADMIN".equals(r)) {
            throw new IllegalArgumentException("角色仅支持 USER 或 ADMIN");
        }
        User u = new User();
        u.setUsername(username);
        u.setPasswordHash(BCrypt.hashpw(password, BCrypt.gensalt()));
        u.setCreatedAt(Instant.now().getEpochSecond());
        u.setRole(r);
        u.setStorageQuota(Math.max(0L, storageQuotaBytes));
        u.setMustChangePassword(false);
        u.setEnabled(true);
        userMapper.insert(u);
        return u;
    }

    public void setQuota(String username, long quotaBytes) {
        User u = userMapper.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("用户不存在"));
        userMapper.updateQuota(u.getUsername(), Math.max(0L, quotaBytes));
    }

    public void setEnabled(String username, boolean enabled) {
        User u = userMapper.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("用户不存在"));
        userMapper.updateEnabled(u.getUsername(), enabled);
        if (!enabled) {
            sessionMapper.deleteByUsername(u.getUsername());
        }
    }

    public String createSession(String username, HttpServletResponse response) {
        return createSession(username, response, props.isSslEnabled());
    }

    public String createSession(String username, HttpServletRequest request, HttpServletResponse response) {
        boolean secure = props.isSslEnabled() || (request != null && request.isSecure());
        return createSession(username, response, secure);
    }

    private String createSession(String username, HttpServletResponse response, boolean secure) {
        String sid = UUID.randomUUID().toString().replace("-", "");
        long now = Instant.now().getEpochSecond();
        long exp = now + props.getSession().getMaxAgeDays() * 24L * 3600L;
        SessionRecord r = new SessionRecord();
        r.setId(sid); r.setUsername(username); r.setCreatedAt(now); r.setExpiresAt(exp);
        sessionMapper.insert(r);
        // SameSite=Lax 阻止跨站请求携带会话 Cookie，缓解 CSRF；Secure 在 HTTPS 时开启
        ResponseCookie cookie = ResponseCookie.from(props.getSession().getCookieName(), sid)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofSeconds(exp - now))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return sid;
    }

    public void clearSession(HttpServletRequest request, HttpServletResponse response) {
        String sid = readSessionId(request);
        if (sid != null) {
            sessionMapper.deleteById(sid);
        }
        boolean secure = props.isSslEnabled() || (request != null && request.isSecure());
        ResponseCookie cookie = ResponseCookie.from(props.getSession().getCookieName(), "")
                .httpOnly(true)
                .secure(secure)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public boolean requireSession(HttpServletRequest request, HttpServletResponse response) {
        return getUsernameFromRequest(request).isPresent();
    }

    public Optional<String> getUsernameFromRequest(HttpServletRequest request) {
        String sid = readSessionId(request);
        if (sid == null) return Optional.empty();
        Optional<SessionRecord> r = sessionMapper.findById(sid);
        if (r.isEmpty()) return Optional.empty();
        if (r.get().getExpiresAt() < Instant.now().getEpochSecond()) {
            return Optional.empty();
        }
        // 账号被禁用时会话视为无效
        Optional<User> user = userMapper.findByUsername(r.get().getUsername());
        if (user.isEmpty() || !user.get().isEnabled()) {
            return Optional.empty();
        }
        return Optional.of(r.get().getUsername());
    }

    public String readSessionId(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie c : request.getCookies()) {
            if (props.getSession().getCookieName().equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }
}

package com.glqyu.storeit.service;

import com.glqyu.storeit.config.AppProperties;
import com.glqyu.storeit.mapper.SessionMapper;
import com.glqyu.storeit.mapper.UserMapper;
import com.glqyu.storeit.model.SessionRecord;
import com.glqyu.storeit.model.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    private final UserMapper userMapper;
    private final SessionMapper sessionMapper;
    private final AppProperties props;

    public AuthService(UserMapper userMapper, SessionMapper sessionMapper, AppProperties props) {
        this.userMapper = userMapper;
        this.sessionMapper = sessionMapper;
        this.props = props;
    }

    public Optional<User> findUser(String username) {
        return userMapper.findByUsername(username);
    }

    public boolean checkPassword(User user, String raw) {
        return BCrypt.checkpw(raw, user.getPasswordHash());
    }

    public String createSession(String username, HttpServletResponse response) {
        String sid = UUID.randomUUID().toString().replace("-", "");
        long now = Instant.now().getEpochSecond();
        long exp = now + props.getSession().getMaxAgeDays() * 24L * 3600L;
        SessionRecord r = new SessionRecord();
        r.setId(sid); r.setUsername(username); r.setCreatedAt(now); r.setExpiresAt(exp);
        sessionMapper.insert(r);
        Cookie cookie = new Cookie(props.getSession().getCookieName(), sid);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) (exp - now));
        // In production with HTTPS, setSecure(true)
        response.addCookie(cookie);
        return sid;
    }

    public void clearSession(HttpServletRequest request, HttpServletResponse response) {
        String sid = readSessionId(request);
        if (sid != null) {
            sessionMapper.deleteById(sid);
        }
        Cookie cookie = new Cookie(props.getSession().getCookieName(), "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
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
            // expired
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

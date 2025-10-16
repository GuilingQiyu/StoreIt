package com.glqyu.storeit.web;

import com.glqyu.storeit.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    private final AuthService authService;
    public AuthInterceptor(AuthService authService) { this.authService = authService; }

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws Exception {
        String path = request.getRequestURI();
        // permit static and public pages (index, login, list) and share links
        if (path.startsWith("/static/") || path.equals("/") || path.equals("/login") || path.equals("/list") || path.equals("/403") || path.equals("/404") || path.startsWith("/d/")) {
            return true;
        }
        // allow login/logout and user status queries
        if (path.startsWith("/api/login") || path.startsWith("/api/logout") || path.startsWith("/api/user/status")) {
            return true;
        }
        // require session for other /api and /storage endpoints
        boolean ok = authService.requireSession(request, response);
        if (!ok) {
            // if it's an API call, return 401; otherwise, redirect to login page
            if (path.startsWith("/api/") || path.startsWith("/storage/")) {
                response.setStatus(401);
            } else {
                response.sendRedirect("/login");
            }
        }
        return ok;
    }
}

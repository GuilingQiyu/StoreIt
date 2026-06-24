package com.glqyu.storeit.web;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.glqyu.storeit.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    private final AuthService authService;
    public AuthInterceptor(AuthService authService) { this.authService = authService; }

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws Exception {
        String path = request.getRequestURI();
        // permit static assets, the public login/about pages, error pages, and share links
        if (path.startsWith("/static/") || path.equals("/login") || path.equals("/about")
                || path.equals("/403") || path.equals("/404") || path.startsWith("/d/")) {
            return true;
        }
        // allow login/logout and user status queries
        if (path.startsWith("/api/login") || path.startsWith("/api/logout") || path.startsWith("/api/user/status")) {
            return true;
        }
        // require session for the cloud-disk pages ("/", "/list"), all other /api and /storage endpoints
        boolean ok = authService.requireSession(request, response);
        if (!ok) {
            // if it's an API call, return 401; otherwise, redirect unauthenticated visitors to login
            if (path.startsWith("/api/") || path.startsWith("/storage/")) {
                response.setStatus(401);
            } else {
                response.sendRedirect("/login");
            }
        }
        return ok;
    }
}

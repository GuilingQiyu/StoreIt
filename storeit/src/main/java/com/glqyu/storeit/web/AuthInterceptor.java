package com.glqyu.storeit.web;

import com.glqyu.storeit.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    private final AuthService authService;
    public AuthInterceptor(AuthService authService) { this.authService = authService; }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getRequestURI();
        // permit static and login endpoints
        if (path.startsWith("/static/") || path.equals("/") || path.equals("/login") || path.equals("/403") || path.equals("/404") || path.startsWith("/d/")) {
            return true;
        }
        if (path.startsWith("/api/login") || path.startsWith("/api/user/status")) {
            return true;
        }
        // require session for other /api and /storage endpoints
        return authService.requireSession(request, response);
    }
}

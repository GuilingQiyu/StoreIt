package com.glqyu.storeit.web;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.glqyu.storeit.model.User;
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

        // 公开资源：静态文件、登录/关于/错误页、分享直链、改密页、健康检查
        if (path.startsWith("/static/") || path.equals("/login") || path.equals("/about")
                || path.equals("/403") || path.equals("/404") || path.equals("/error") || path.startsWith("/d/")
                || path.equals("/change-password")
                || path.equals("/actuator/health") || path.startsWith("/actuator/health/")) {
            return true;
        }
        // 登录接口公开；登出与状态查询可不强制会话（无会话时返回空状态）
        if (path.startsWith("/api/login") || path.startsWith("/api/logout") || path.startsWith("/api/user/status")) {
            return true;
        }

        // 其余路径（含 /api/change-password、文件 API、页面）要求已登录
        boolean ok = authService.requireSession(request, response);
        if (!ok) {
            if (path.startsWith("/api/") || path.startsWith("/storage/")) {
                response.setStatus(401);
            } else {
                response.sendRedirect("/login");
            }
            return false;
        }

        // 弱默认口令未改：仅允许改密 / 登出 / 状态
        if (isAllowedWhileMustChangePassword(path)) {
            return true;
        }
        var usernameOpt = authService.getUsernameFromRequest(request);
        if (usernameOpt.isPresent()) {
            User user = authService.findUser(usernameOpt.get()).orElse(null);
            if (authService.mustChangePassword(user)) {
                if (path.startsWith("/api/") || path.startsWith("/storage/")) {
                    response.setStatus(403);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"success\":false,\"message\":\"必须先修改默认密码\",\"must_change_password\":true}");
                } else {
                    response.sendRedirect("/change-password");
                }
                return false;
            }
        }
        return true;
    }

    private boolean isAllowedWhileMustChangePassword(String path) {
        return path.startsWith("/api/change-password")
                || path.startsWith("/api/logout")
                || path.startsWith("/api/user/status");
    }
}

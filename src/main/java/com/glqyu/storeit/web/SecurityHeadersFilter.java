package com.glqyu.storeit.web;

import com.glqyu.storeit.config.AppProperties;
import com.glqyu.storeit.service.FileService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(1)
public class SecurityHeadersFilter implements Filter {

    // 允许同源资源、内联脚本/样式，以及 SFSP/1.0 跨服联邦共享挂载所需的 http/https 跨域接口、图片、音视频与内联预览帧
    private static final String CONTENT_SECURITY_POLICY = String.join("; ",
            "default-src 'self'",
            "img-src 'self' data: blob: https: http:",
            "media-src 'self' blob: https: http:",
            "frame-src 'self' blob: https: http:",
            "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
            "font-src 'self' https://cdnjs.cloudflare.com",
            "script-src 'self' 'unsafe-inline'",
            "connect-src 'self' https: http:",
            "frame-ancestors 'self'",
            "object-src 'none'",
            "base-uri 'self'");

    private final AppProperties props;

    public SecurityHeadersFilter(AppProperties props) {
        this.props = props;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse res = (HttpServletResponse) response;
        // 仅在启用 HTTPS 时才下发 HSTS，避免在纯 HTTP 部署下产生误导
        if (props.isSslEnabled() || request.isSecure()) {
            res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        }
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "SAMEORIGIN");
        res.setHeader("X-XSS-Protection", "1; mode=block");
        res.setHeader("Referrer-Policy", "same-origin");
        String path = request instanceof HttpServletRequest http ? http.getRequestURI() : "";
        boolean isPreviewEndpoint = path.startsWith("/api/preview")
                || (path.startsWith("/api/fed/shares/") && path.endsWith("/preview"));
        res.setHeader("Content-Security-Policy",
                isPreviewEndpoint ? FileService.PREVIEW_CSP : CONTENT_SECURITY_POLICY);
        chain.doFilter(request, response);
    }
}

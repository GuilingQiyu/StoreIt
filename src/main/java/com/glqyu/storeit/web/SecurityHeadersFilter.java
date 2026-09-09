package com.glqyu.storeit.web;

import com.glqyu.storeit.config.AppProperties;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(1)
public class SecurityHeadersFilter implements Filter {

    /**
     * CSP 说明（1.4.0）：
     * - script-src 仅允许同源外部脚本（/static/js/*），页面不再依赖内联 onclick；
     * - style-src 仍保留 'unsafe-inline'：列表/进度等大量动态 style 与 FontAwesome 共存，彻底外联成本过高；
     * - FontAwesome 仍走 cdnjs。
     */
    private static final String CONTENT_SECURITY_POLICY = String.join("; ",
            "default-src 'self'",
            "img-src 'self' data: blob:",
            "media-src 'self' blob:",
            "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
            "font-src 'self' https://cdnjs.cloudflare.com",
            "script-src 'self'",
            "connect-src 'self'",
            "frame-ancestors 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'");

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
        res.setHeader("Content-Security-Policy", CONTENT_SECURITY_POLICY);
        chain.doFilter(request, response);
    }
}

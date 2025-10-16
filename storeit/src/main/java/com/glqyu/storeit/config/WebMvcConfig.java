package com.glqyu.storeit.config;

import com.glqyu.storeit.web.AuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    private final AuthInterceptor authInterceptor;
    public WebMvcConfig(AuthInterceptor authInterceptor) { this.authInterceptor = authInterceptor; }

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor).addPathPatterns("/**");
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // expose /static/** so HTML can reference /static/css/* etc.
        registry
                .addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}

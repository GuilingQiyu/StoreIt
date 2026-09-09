package com.glqyu.storeit.config;

import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.ErrorPageRegistrar;
import org.springframework.boot.web.server.ErrorPageRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

@Configuration
public class ErrorPageConfig {

    @Bean
    public ErrorPageRegistrar storeitErrorPageRegistrar() {
        return (ErrorPageRegistry registry) -> {
            registry.addErrorPages(
                    new ErrorPage(HttpStatus.NOT_FOUND, "/404"),
                    new ErrorPage(HttpStatus.FORBIDDEN, "/403"),
                    new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/404")
            );
        };
    }
}

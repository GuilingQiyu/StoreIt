package com.glqyu.storeit.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginRateLimiterTest {
    @Test
    void limitsAfterMaxAttempts() {
        LoginRateLimiter limiter = new LoginRateLimiter();
        String ip = "203.0.113.10";
        for (int i = 0; i < 10; i++) {
            assertFalse(limiter.isLimited(ip));
            limiter.recordAttempt(ip);
        }
        assertTrue(limiter.isLimited(ip));
        limiter.clear(ip);
        assertFalse(limiter.isLimited(ip));
    }
}

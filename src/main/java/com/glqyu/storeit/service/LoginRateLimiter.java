package com.glqyu.storeit.service;

import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 简易登录限流：按客户端 IP 滑动窗口统计失败/尝试次数。
 * 默认每分钟最多 10 次；超限返回 true（应拒绝）。
 */
@Component
public class LoginRateLimiter {
    private static final int MAX_ATTEMPTS = 10;
    private static final long WINDOW_MS = 60_000L;

    private final Map<String, Deque<Long>> attempts = new ConcurrentHashMap<>();

    public boolean isLimited(String clientKey) {
        if (clientKey == null || clientKey.isBlank()) clientKey = "unknown";
        long now = System.currentTimeMillis();
        Deque<Long> q = attempts.computeIfAbsent(clientKey, k -> new ArrayDeque<>());
        synchronized (q) {
            prune(q, now);
            return q.size() >= MAX_ATTEMPTS;
        }
    }

    public void recordAttempt(String clientKey) {
        if (clientKey == null || clientKey.isBlank()) clientKey = "unknown";
        long now = System.currentTimeMillis();
        Deque<Long> q = attempts.computeIfAbsent(clientKey, k -> new ArrayDeque<>());
        synchronized (q) {
            prune(q, now);
            q.addLast(now);
        }
    }

    public void clear(String clientKey) {
        if (clientKey == null) return;
        attempts.remove(clientKey);
    }

    private void prune(Deque<Long> q, long now) {
        while (!q.isEmpty() && now - q.peekFirst() > WINDOW_MS) {
            q.removeFirst();
        }
    }
}

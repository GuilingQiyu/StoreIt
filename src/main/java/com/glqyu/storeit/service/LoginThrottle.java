package com.glqyu.storeit.service;

import com.glqyu.storeit.config.AppProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 按 IP + 用户名滑动窗口统计登录失败。达到上限后，在窗口过期前拒绝新的尝试。
 */
@Component
public class LoginThrottle {
    private final int maxFailures;
    private final long windowSeconds;
    private final ConcurrentHashMap<String, Deque<Long>> failures = new ConcurrentHashMap<>();

    public LoginThrottle(AppProperties props) {
        this.maxFailures = Math.max(1, props.getLogin().getMaxFailures());
        this.windowSeconds = Math.max(1, props.getLogin().getWindowMinutes()) * 60L;
    }

    public boolean isBlocked(String key, long nowEpochSeconds) {
        Deque<Long> attempts = failures.get(key);
        if (attempts == null) {
            return false;
        }
        synchronized (attempts) {
            evict(attempts, nowEpochSeconds);
            return attempts.size() >= maxFailures;
        }
    }

    public void recordFailure(String key, long nowEpochSeconds) {
        Deque<Long> attempts = failures.computeIfAbsent(key, ignored -> new ArrayDeque<>());
        synchronized (attempts) {
            evict(attempts, nowEpochSeconds);
            attempts.addLast(nowEpochSeconds);
        }
    }

    public void clear(String key) {
        failures.remove(key);
    }

    private void evict(Deque<Long> attempts, long nowEpochSeconds) {
        long cutoff = nowEpochSeconds - windowSeconds;
        while (!attempts.isEmpty() && attempts.peekFirst() <= cutoff) {
            attempts.removeFirst();
        }
    }
}

package com.glqyu.storeit.service;

import com.glqyu.storeit.mapper.SessionMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * 周期性清理过期会话与失效（过期/达上限）的分享记录。
 * 依赖 {@code @EnableScheduling}（见 StoreitApplication）。
 */
@Component
public class CleanupTask {
    private static final Logger log = LoggerFactory.getLogger(CleanupTask.class);

    private final SessionMapper sessionMapper;
    private final ShareService shareService;

    public CleanupTask(SessionMapper sessionMapper, ShareService shareService) {
        this.sessionMapper = sessionMapper;
        this.shareService = shareService;
    }

    // 每小时整点执行一次
    @Scheduled(cron = "0 0 * * * *")
    public void cleanup() {
        try {
            int sessions = sessionMapper.deleteExpired(Instant.now().getEpochSecond());
            int shares = shareService.cleanup();
            if (sessions > 0 || shares > 0) {
                log.info("Cleanup done: removed {} expired sessions, {} expired/maxed shares", sessions, shares);
            }
        } catch (Exception e) {
            log.warn("Scheduled cleanup failed: {}", e.toString());
        }
    }
}

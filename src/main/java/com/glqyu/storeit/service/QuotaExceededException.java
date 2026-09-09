package com.glqyu.storeit.service;

import java.io.IOException;

/** 普通用户写入时超出 storage_quota。 */
public class QuotaExceededException extends IOException {
    public QuotaExceededException(String message) {
        super(message);
    }
}

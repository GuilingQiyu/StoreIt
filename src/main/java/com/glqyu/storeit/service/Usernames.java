package com.glqyu.storeit.service;

import java.util.regex.Pattern;

/**
 * 用户名会变成存储目录名，因此拒绝空串、{@code .}、{@code ..} 和路径分隔符。
 */
public final class Usernames {
    public static final int MAX_LENGTH = 64;
    public static final String INVALID_MESSAGE = "用户名只能包含字母、数字、点、下划线和短横线";
    private static final Pattern ALLOWED = Pattern.compile("[A-Za-z0-9._-]{1," + MAX_LENGTH + "}");

    private Usernames() {}

    public static void check(String username) {
        if (username == null || username.isBlank()
                || ".".equals(username) || "..".equals(username)
                || !ALLOWED.matcher(username).matches()) {
            throw new IllegalArgumentException(INVALID_MESSAGE);
        }
    }
}

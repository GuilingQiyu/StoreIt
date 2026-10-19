package com.glqyu.storeit.dto;

import jakarta.validation.constraints.NotBlank;

public class ShareRequest {
    @NotBlank
    private String filePath;
    private Integer expireHours; // -1 = permanent, null = default
    private Integer maxDownloads; // null/0 = unlimited
    private String permission; // READ or READ_WRITE
    private String accessPassword; // optional extraction password
    private String title;

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Integer getExpireHours() { return expireHours; }
    public void setExpireHours(Integer expireHours) { this.expireHours = expireHours; }
    public Integer getMaxDownloads() { return maxDownloads; }
    public void setMaxDownloads(Integer maxDownloads) { this.maxDownloads = maxDownloads; }
    public String getPermission() { return permission; }
    public void setPermission(String permission) { this.permission = permission; }
    public String getAccessPassword() { return accessPassword; }
    public void setAccessPassword(String accessPassword) { this.accessPassword = accessPassword; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}

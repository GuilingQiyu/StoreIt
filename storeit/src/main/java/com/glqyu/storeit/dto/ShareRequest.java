package com.glqyu.storeit.dto;

import jakarta.validation.constraints.NotBlank;

public class ShareRequest {
    @NotBlank
    private String filePath;
    private Integer expireDays; // null = default
    private Integer maxDownloads; // null/0 = unlimited

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Integer getExpireDays() { return expireDays; }
    public void setExpireDays(Integer expireDays) { this.expireDays = expireDays; }
    public Integer getMaxDownloads() { return maxDownloads; }
    public void setMaxDownloads(Integer maxDownloads) { this.maxDownloads = maxDownloads; }
}

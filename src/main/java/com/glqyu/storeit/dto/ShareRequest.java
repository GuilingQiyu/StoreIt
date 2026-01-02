package com.glqyu.storeit.dto;

import jakarta.validation.constraints.NotBlank;

public class ShareRequest {
    @NotBlank
    private String filePath;
    private Integer expireHours; // -1 = permanent, null = default
    private Integer maxDownloads; // null/0 = unlimited

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Integer getExpireHours() { return expireHours; }
    public void setExpireHours(Integer expireHours) { this.expireHours = expireHours; }
    public Integer getMaxDownloads() { return maxDownloads; }
    public void setMaxDownloads(Integer maxDownloads) { this.maxDownloads = maxDownloads; }
}

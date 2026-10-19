package com.glqyu.storeit.model;

public class FileShare {
    private Long id;
    private String filePath; // relative path under storage root
    private String token;
    private Long expiry; // epoch seconds, nullable
    private Integer maxDownloads; // null or 0 for unlimited
    private Integer downloads;
    private Long userId;
    private Long createdAt;
    private boolean directory;
    private String permission; // READ or READ_WRITE
    private String accessPassword;
    private String title;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getExpiry() { return expiry; }
    public void setExpiry(Long expiry) { this.expiry = expiry; }

    public Integer getMaxDownloads() { return maxDownloads; }
    public void setMaxDownloads(Integer maxDownloads) { this.maxDownloads = maxDownloads; }

    public Integer getDownloads() { return downloads; }
    public void setDownloads(Integer downloads) { this.downloads = downloads; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }

    public boolean isDirectory() { return directory; }
    public void setDirectory(boolean directory) { this.directory = directory; }

    public String getPermission() { return permission == null ? "READ" : permission; }
    public void setPermission(String permission) { this.permission = permission; }

    public String getAccessPassword() { return accessPassword; }
    public void setAccessPassword(String accessPassword) { this.accessPassword = accessPassword; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}

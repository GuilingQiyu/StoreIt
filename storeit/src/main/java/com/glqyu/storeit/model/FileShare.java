package com.glqyu.storeit.model;

public class FileShare {
    private Long id;
    private String filePath; // relative path under storage root
    private String token;
    private Long expiry; // epoch seconds, nullable
    private Integer maxDownloads; // null or 0 for unlimited
    private Integer downloads;

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
}

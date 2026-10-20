package com.glqyu.storeit.model;

public class ShareMount {
    private Long id;
    private Long userId;
    private String mountName;
    private String remoteServerUrl; // empty for local server
    private String shareToken;
    private String accessPassword;
    private String permission; // READ or READ_WRITE
    private String ownerName;
    private boolean directory;
    private Long createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getMountName() { return mountName; }
    public void setMountName(String mountName) { this.mountName = mountName; }

    public String getRemoteServerUrl() { return remoteServerUrl; }
    public void setRemoteServerUrl(String remoteServerUrl) { this.remoteServerUrl = remoteServerUrl; }

    public String getShareToken() { return shareToken; }
    public void setShareToken(String shareToken) { this.shareToken = shareToken; }

    public String getAccessPassword() { return accessPassword; }
    public void setAccessPassword(String accessPassword) { this.accessPassword = accessPassword; }

    public String getPermission() { return permission; }
    public void setPermission(String permission) { this.permission = permission; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public boolean isDirectory() { return directory; }
    public void setDirectory(boolean directory) { this.directory = directory; }

    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }
}

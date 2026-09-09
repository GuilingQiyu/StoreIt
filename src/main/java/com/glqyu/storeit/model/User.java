package com.glqyu.storeit.model;

public class User {
    private Long id;
    private String username;
    private String passwordHash;
    private long createdAt; // epoch seconds
    private String role; // USER, ADMIN
    private long storageQuota; // bytes, 0 = unlimited
    /** 为 true 时仅允许改密 / 健康检查等受限操作，直至更换弱默认口令 */
    private boolean mustChangePassword;
    /** false 时禁止登录与业务 API */
    private boolean enabled = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public long getStorageQuota() { return storageQuota; }
    public void setStorageQuota(long storageQuota) { this.storageQuota = storageQuota; }

    public boolean isMustChangePassword() { return mustChangePassword; }
    public void setMustChangePassword(boolean mustChangePassword) { this.mustChangePassword = mustChangePassword; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public boolean isAdmin() {
        return role != null && "ADMIN".equalsIgnoreCase(role);
    }
}

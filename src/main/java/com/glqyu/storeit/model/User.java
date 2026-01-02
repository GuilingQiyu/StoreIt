package com.glqyu.storeit.model;

public class User {
    private Long id;
    private String username;
    private String passwordHash;
    private long createdAt; // epoch seconds
    private String role; // USER, ADMIN
    private long storageQuota; // bytes, 0 = unlimited

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
}

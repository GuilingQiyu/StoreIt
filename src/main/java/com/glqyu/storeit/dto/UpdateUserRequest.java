package com.glqyu.storeit.dto;

public class UpdateUserRequest {
    private Long storageQuota;
    private String role;

    public Long getStorageQuota() { return storageQuota; }
    public void setStorageQuota(Long storageQuota) { this.storageQuota = storageQuota; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}

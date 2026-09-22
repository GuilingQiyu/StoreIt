package com.glqyu.storeit.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateUserRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    private Long storageQuota;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Long getStorageQuota() { return storageQuota; }
    public void setStorageQuota(Long storageQuota) { this.storageQuota = storageQuota; }
}

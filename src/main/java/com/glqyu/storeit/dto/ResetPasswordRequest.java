package com.glqyu.storeit.dto;

import jakarta.validation.constraints.NotBlank;

public class ResetPasswordRequest {
    @NotBlank
    private String password;
    private Boolean mustChangePassword;

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Boolean getMustChangePassword() { return mustChangePassword; }
    public void setMustChangePassword(Boolean mustChangePassword) { this.mustChangePassword = mustChangePassword; }
}

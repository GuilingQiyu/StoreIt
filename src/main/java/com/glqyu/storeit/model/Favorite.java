package com.glqyu.storeit.model;

public class Favorite {
    private Long id;
    private Long userId;
    private String path;
    private Long createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }
}

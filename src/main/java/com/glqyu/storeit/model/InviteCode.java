package com.glqyu.storeit.model;

public class InviteCode {
    private Long id;
    private String code;
    private String createdBy;
    private Integer maxUses; // <= 0 means unlimited
    private Integer usedCount;
    private Long defaultQuota; // 0 means unlimited
    private Long expiresAt; // epoch seconds, null means permanent
    private boolean revoked;
    private String note;
    private Long createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public Integer getMaxUses() { return maxUses; }
    public void setMaxUses(Integer maxUses) { this.maxUses = maxUses; }

    public Integer getUsedCount() { return usedCount; }
    public void setUsedCount(Integer usedCount) { this.usedCount = usedCount; }

    public Long getDefaultQuota() { return defaultQuota; }
    public void setDefaultQuota(Long defaultQuota) { this.defaultQuota = defaultQuota; }

    public Long getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Long expiresAt) { this.expiresAt = expiresAt; }

    public boolean isRevoked() { return revoked; }
    public void setRevoked(boolean revoked) { this.revoked = revoked; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }
}

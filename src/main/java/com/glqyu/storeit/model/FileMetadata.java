package com.glqyu.storeit.model;

public class FileMetadata {
    private Long id;
    private Long userId;
    private String path;
    private String name;
    private boolean isDirectory;
    private long size;
    private long lastModified;
    private String contentType;
    private String parentPath;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isDirectory() { return isDirectory; }
    public void setDirectory(boolean directory) { isDirectory = directory; }

    public long getSize() { return size; }
    public void setSize(long size) { this.size = size; }

    public long getLastModified() { return lastModified; }
    public void setLastModified(long lastModified) { this.lastModified = lastModified; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public String getParentPath() { return parentPath; }
    public void setParentPath(String parentPath) { this.parentPath = parentPath; }
}

package com.glqyu.storeit.dto;

import java.util.List;

public class FileListResponse {
    private String currentPath;
    private List<Item> items;

    public String getCurrentPath() { return currentPath; }
    public void setCurrentPath(String currentPath) { this.currentPath = currentPath; }
    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }

    public static class Item {
        private String name;
        private boolean isDirectory;
        private long size;
        private long modifiedTime;
        private String path;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public boolean isDirectory() { return isDirectory; }
        public void setDirectory(boolean directory) { isDirectory = directory; }
        public long getSize() { return size; }
        public void setSize(long size) { this.size = size; }
        public long getModifiedTime() { return modifiedTime; }
        public void setModifiedTime(long modifiedTime) { this.modifiedTime = modifiedTime; }
        public String getPath() { return path; }
        public void setPath(String path) { this.path = path; }
    }
}

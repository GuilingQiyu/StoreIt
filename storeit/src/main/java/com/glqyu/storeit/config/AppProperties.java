package com.glqyu.storeit.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String storageRoot = "storage";
    private boolean sslEnabled = false;
    private DefaultAdmin defaultAdmin = new DefaultAdmin();
    private Session session = new Session();

    public static class DefaultAdmin {
        private String username = "admin";
        private String password = "authorized_users";
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class Session {
        private int maxAgeDays = 30;
        private String cookieName = "STOREIT_SESSION";
        public int getMaxAgeDays() { return maxAgeDays; }
        public void setMaxAgeDays(int maxAgeDays) { this.maxAgeDays = maxAgeDays; }
        public String getCookieName() { return cookieName; }
        public void setCookieName(String cookieName) { this.cookieName = cookieName; }
    }

    public String getStorageRoot() { return storageRoot; }
    public void setStorageRoot(String storageRoot) { this.storageRoot = storageRoot; }
    public boolean isSslEnabled() { return sslEnabled; }
    public void setSslEnabled(boolean sslEnabled) { this.sslEnabled = sslEnabled; }
    public DefaultAdmin getDefaultAdmin() { return defaultAdmin; }
    public void setDefaultAdmin(DefaultAdmin defaultAdmin) { this.defaultAdmin = defaultAdmin; }
    public Session getSession() { return session; }
    public void setSession(Session session) { this.session = session; }
}

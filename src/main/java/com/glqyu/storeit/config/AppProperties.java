package com.glqyu.storeit.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    public static final String BUILTIN_ADMIN_USERNAME = "admin";
    public static final String BUILTIN_ADMIN_PASSWORD = "authorized_users";

    private String storageRoot = "storage";
    private boolean sslEnabled = false;
    private boolean requireCustomAdmin = false;
    private DefaultAdmin defaultAdmin = new DefaultAdmin();
    private Login login = new Login();
    private Session session = new Session();

    public static class DefaultAdmin {
        private String username = BUILTIN_ADMIN_USERNAME;
        private String password = BUILTIN_ADMIN_PASSWORD;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class Login {
        private int maxFailures = 5;
        private int windowMinutes = 15;
        public int getMaxFailures() { return maxFailures; }
        public void setMaxFailures(int maxFailures) { this.maxFailures = maxFailures; }
        public int getWindowMinutes() { return windowMinutes; }
        public void setWindowMinutes(int windowMinutes) { this.windowMinutes = windowMinutes; }
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
    public boolean isRequireCustomAdmin() { return requireCustomAdmin; }
    public void setRequireCustomAdmin(boolean requireCustomAdmin) { this.requireCustomAdmin = requireCustomAdmin; }
    public DefaultAdmin getDefaultAdmin() { return defaultAdmin; }
    public void setDefaultAdmin(DefaultAdmin defaultAdmin) { this.defaultAdmin = defaultAdmin; }
    public Login getLogin() { return login; }
    public void setLogin(Login login) { this.login = login; }
    public Session getSession() { return session; }
    public void setSession(Session session) { this.session = session; }

    public boolean isBuiltInDefaultAdmin() {
        return BUILTIN_ADMIN_USERNAME.equals(defaultAdmin.getUsername())
                && BUILTIN_ADMIN_PASSWORD.equals(defaultAdmin.getPassword());
    }
}

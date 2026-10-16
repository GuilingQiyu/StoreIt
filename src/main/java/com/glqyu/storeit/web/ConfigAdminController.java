package com.glqyu.storeit.web;

import com.glqyu.storeit.dto.ApiResponse;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.yaml.snakeyaml.Yaml;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/admin/config")
public class ConfigAdminController {
    private static final Logger log = LoggerFactory.getLogger(ConfigAdminController.class);
    private final AuthService authService;

    private static final Path CONFIG_DIR = Paths.get("config");
    private static final Path APP_CONFIG = CONFIG_DIR.resolve("application.yml");
    private static final Path ADMIN_CONFIG = CONFIG_DIR.resolve("admin.yml");
    private static final Path APP_EXAMPLE = Paths.get("src/main/resources/config/application.yml.example");
    private static final Path ADMIN_EXAMPLE = Paths.get("src/main/resources/config/admin.yml.example");

    private static final Pattern SIZE_PATTERN = Pattern.compile("^\\d+(?:B|KB|MB|GB|TB)$", Pattern.CASE_INSENSITIVE);
    private static final Pattern DURATION_PATTERN = Pattern.compile("^\\d+(?:ms|s|m|h|d)$", Pattern.CASE_INSENSITIVE);
    private static final Pattern COOKIE_NAME_PATTERN = Pattern.compile("^[A-Za-z0-9_-]{1,64}$");
    private static final Set<String> VALID_LOG_LEVELS = Set.of("trace", "debug", "info", "warn", "error", "off");

    public ConfigAdminController(AuthService authService) {
        this.authService = authService;
    }

    private User requireAdmin(HttpServletRequest request) {
        String name = authService.getUsernameFromRequest(request).orElseThrow(() -> new RuntimeException("未登录"));
        User user = authService.findUser(name).orElseThrow(() -> new RuntimeException("未登录"));
        if (user.getRole() == null || !user.getRole().equalsIgnoreCase("ADMIN")) {
            throw new RuntimeException("需要管理员权限");
        }
        return user;
    }

    @GetMapping
    @SuppressWarnings("unchecked")
    public ResponseEntity<?> getConfig(HttpServletRequest request) {
        try {
            requireAdmin(request);
            String appYamlStr = readFileOrExample(APP_CONFIG, APP_EXAMPLE);
            String adminYamlStr = readFileOrExample(ADMIN_CONFIG, ADMIN_EXAMPLE);

            Yaml yaml = new Yaml();
            Map<String, Object> appMap = new HashMap<>();
            Map<String, Object> adminMap = new HashMap<>();

            try {
                Object loaded = yaml.load(appYamlStr);
                if (loaded instanceof Map) {
                    appMap = (Map<String, Object>) loaded;
                }
            } catch (Exception e) {
                log.warn("Parse app yaml warning: {}", e.getMessage());
            }

            try {
                Object loaded = yaml.load(adminYamlStr);
                if (loaded instanceof Map) {
                    adminMap = (Map<String, Object>) loaded;
                }
            } catch (Exception e) {
                log.warn("Parse admin yaml warning: {}", e.getMessage());
            }

            boolean keystoreExists = false;
            try {
                Map<String, Object> server = (Map<String, Object>) appMap.get("server");
                if (server != null) {
                    Map<String, Object> ssl = (Map<String, Object>) server.get("ssl");
                    if (ssl != null && ssl.get("key-store") != null) {
                        keystoreExists = Files.exists(Paths.get(ssl.get("key-store").toString()));
                    }
                }
            } catch (Exception ignored) {}

            Map<String, Object> result = new HashMap<>();
            result.put("applicationYaml", appYamlStr);
            result.put("adminYaml", adminYamlStr);
            result.put("applicationConfig", appMap);
            result.put("adminConfig", adminMap);
            result.put("keystoreExists", keystoreExists);

            return ResponseEntity.ok(ApiResponse.ok("获取配置成功", result));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.error("Failed to read config", e);
            return ResponseEntity.internalServerError().body(ApiResponse.fail("读取配置文件失败: " + e.getMessage()));
        }
    }

    @PostMapping
    @SuppressWarnings("unchecked")
    public ResponseEntity<?> updateConfig(HttpServletRequest request, @RequestBody Map<String, Object> payload) {
        try {
            requireAdmin(request);

            if (!Files.exists(CONFIG_DIR)) {
                Files.createDirectories(CONFIG_DIR);
            }

            Yaml yaml = createYaml();

            // 1. Visual Form Mode: safely patch all configurable YAML properties
            if (payload.containsKey("visualConfig")) {
                Map<String, Object> visual = (Map<String, Object>) payload.get("visualConfig");

                boolean sslEnabled = Boolean.parseBoolean(String.valueOf(visual.get("sslEnabled")));
                String keyStorePath = String.valueOf(visual.getOrDefault("keyStorePath", "./keystore.p12")).trim();
                if (sslEnabled && !Files.exists(Paths.get(keyStorePath))) {
                    return ResponseEntity.badRequest().body(ApiResponse.fail(
                            "无法启用 HTTPS/SSL：未找到证书文件 [" + keyStorePath + "]。请先生成或将证书文件放置在该路径下。"));
                }

                String appYamlStr = readFileOrExample(APP_CONFIG, APP_EXAMPLE);
                Map<String, Object> appMap = new HashMap<>();
                try {
                    Object loaded = yaml.load(appYamlStr);
                    if (loaded instanceof Map) appMap = (Map<String, Object>) loaded;
                } catch (Exception ignored) {}

                StringBuilder validationError = new StringBuilder();
                Integer port = parseVisualInt(visual, "port", "服务端口 (server.port)", 1, 65535, validationError);
                Integer maxFailures = parseVisualInt(visual, "maxFailures", "连续错误锁定次数 (max-failures)", 1, 1000, validationError);
                Integer windowMinutes = parseVisualInt(visual, "windowMinutes", "统计时间窗口 (window-minutes)", 1, 1440, validationError);
                Integer sessionMaxAgeDays = parseVisualInt(visual, "sessionMaxAgeDays", "会话保持天数 (max-age-days)", 1, 365, validationError);

                String servletTimeout = visual.containsKey("servletSessionTimeout")
                        ? String.valueOf(visual.get("servletSessionTimeout")).trim() : null;
                if (servletTimeout != null && !servletTimeout.isEmpty() && !DURATION_PATTERN.matcher(servletTimeout).matches()) {
                    appendErr(validationError, "容器会话超时 (server.servlet.session.timeout) 格式需如 30d、12h、60m");
                }

                String maxFileSize = visual.containsKey("maxFileSize")
                        ? String.valueOf(visual.get("maxFileSize")).trim().toUpperCase() : null;
                if (maxFileSize != null && !maxFileSize.isEmpty() && !SIZE_PATTERN.matcher(maxFileSize).matches()) {
                    appendErr(validationError, "单文件最大上传限制 (max-file-size) 格式需如 100GB、10GB、500MB");
                }

                String maxRequestSize = visual.containsKey("maxRequestSize")
                        ? String.valueOf(visual.get("maxRequestSize")).trim().toUpperCase() : null;
                if (maxRequestSize != null && !maxRequestSize.isEmpty() && !SIZE_PATTERN.matcher(maxRequestSize).matches()) {
                    appendErr(validationError, "单次请求最大体积限制 (max-request-size) 格式需如 100GB、10GB、500MB");
                }

                String datasourceUrl = visual.containsKey("datasourceUrl")
                        ? String.valueOf(visual.get("datasourceUrl")).trim() : null;
                if (datasourceUrl != null && !datasourceUrl.isEmpty() && !datasourceUrl.startsWith("jdbc:sqlite:")) {
                    appendErr(validationError, "数据源 URL (spring.datasource.url) 必须以 jdbc:sqlite: 开头");
                }

                String cookieName = visual.containsKey("cookieName")
                        ? String.valueOf(visual.get("cookieName")).trim() : null;
                if (cookieName != null && !cookieName.isEmpty() && !COOKIE_NAME_PATTERN.matcher(cookieName).matches()) {
                    appendErr(validationError, "Cookie 名称 (app.session.cookie-name) 仅允许字母、数字、下划线和短横线");
                }

                String logLevel = visual.containsKey("logLevel")
                        ? String.valueOf(visual.get("logLevel")).trim().toLowerCase() : null;
                if (logLevel != null && !logLevel.isEmpty() && !VALID_LOG_LEVELS.contains(logLevel)) {
                    appendErr(validationError, "日志级别 (logging.level.root) 必须是 info、warn、error、debug 或 trace");
                }

                if (validationError.length() > 0) {
                    return ResponseEntity.badRequest().body(ApiResponse.fail(validationError.toString()));
                }

                // server.*
                Map<String, Object> server = (Map<String, Object>) appMap.computeIfAbsent("server", k -> new HashMap<>());
                if (port != null) {
                    server.put("port", port);
                }
                if (servletTimeout != null && !servletTimeout.isEmpty()) {
                    Map<String, Object> servlet = (Map<String, Object>) server.computeIfAbsent("servlet", k -> new HashMap<>());
                    Map<String, Object> srvSession = (Map<String, Object>) servlet.computeIfAbsent("session", k -> new HashMap<>());
                    srvSession.put("timeout", servletTimeout);
                }

                Map<String, Object> ssl = (Map<String, Object>) server.computeIfAbsent("ssl", k -> new HashMap<>());
                ssl.put("enabled", sslEnabled);
                ssl.put("key-store", keyStorePath);
                if (visual.containsKey("keyStorePass")) ssl.put("key-store-password", visual.get("keyStorePass"));
                if (visual.containsKey("keyStoreType")) ssl.put("key-store-type", visual.get("keyStoreType"));

                // spring.* (datasource.url & servlet.multipart.max-file-size / max-request-size)
                Map<String, Object> spring = (Map<String, Object>) appMap.computeIfAbsent("spring", k -> new HashMap<>());
                if (datasourceUrl != null && !datasourceUrl.isEmpty()) {
                    Map<String, Object> ds = (Map<String, Object>) spring.computeIfAbsent("datasource", k -> new HashMap<>());
                    ds.put("url", datasourceUrl);
                    ds.putIfAbsent("driver-class-name", "org.sqlite.JDBC");
                }
                if ((maxFileSize != null && !maxFileSize.isEmpty()) || (maxRequestSize != null && !maxRequestSize.isEmpty())) {
                    Map<String, Object> spServlet = (Map<String, Object>) spring.computeIfAbsent("servlet", k -> new HashMap<>());
                    Map<String, Object> multipart = (Map<String, Object>) spServlet.computeIfAbsent("multipart", k -> new HashMap<>());
                    if (maxFileSize != null && !maxFileSize.isEmpty()) multipart.put("max-file-size", maxFileSize);
                    if (maxRequestSize != null && !maxRequestSize.isEmpty()) multipart.put("max-request-size", maxRequestSize);
                }

                // app.*
                Map<String, Object> app = (Map<String, Object>) appMap.computeIfAbsent("app", k -> new HashMap<>());
                if (visual.containsKey("storageRoot")) app.put("storage-root", String.valueOf(visual.get("storageRoot")).trim());
                app.put("ssl-enabled", Boolean.parseBoolean(String.valueOf(visual.getOrDefault("appSslEnabled", sslEnabled))));
                if (visual.containsKey("requireCustomAdmin")) {
                    app.put("require-custom-admin", Boolean.parseBoolean(String.valueOf(visual.get("requireCustomAdmin"))));
                }

                Map<String, Object> login = (Map<String, Object>) app.computeIfAbsent("login", k -> new HashMap<>());
                if (maxFailures != null) login.put("max-failures", maxFailures);
                if (windowMinutes != null) login.put("window-minutes", windowMinutes);

                Map<String, Object> session = (Map<String, Object>) app.computeIfAbsent("session", k -> new HashMap<>());
                if (sessionMaxAgeDays != null) session.put("max-age-days", sessionMaxAgeDays);
                if (cookieName != null && !cookieName.isEmpty()) session.put("cookie-name", cookieName);

                // logging.level.root
                if (logLevel != null && !logLevel.isEmpty()) {
                    Map<String, Object> logging = (Map<String, Object>) appMap.computeIfAbsent("logging", k -> new HashMap<>());
                    Map<String, Object> level = (Map<String, Object>) logging.computeIfAbsent("level", k -> new HashMap<>());
                    level.put("root", logLevel);
                }

                backupConfig(APP_CONFIG);
                Files.writeString(APP_CONFIG, yaml.dump(appMap), StandardCharsets.UTF_8);

                // Patch admin.yml
                String adminYamlStr = readFileOrExample(ADMIN_CONFIG, ADMIN_EXAMPLE);
                Map<String, Object> adminMap = new HashMap<>();
                try {
                    Object loaded = yaml.load(adminYamlStr);
                    if (loaded instanceof Map) adminMap = (Map<String, Object>) loaded;
                } catch (Exception ignored) {}

                Map<String, Object> adminApp = (Map<String, Object>) adminMap.computeIfAbsent("app", k -> new HashMap<>());
                Map<String, Object> defAdmin = (Map<String, Object>) adminApp.computeIfAbsent("default-admin", k -> new HashMap<>());
                if (visual.containsKey("adminUsername") && visual.get("adminUsername") != null) {
                    defAdmin.put("username", String.valueOf(visual.get("adminUsername")).trim());
                }
                String newPass = visual.get("adminPassword") != null ? String.valueOf(visual.get("adminPassword")).trim() : "";
                if (!newPass.isEmpty()) {
                    defAdmin.put("password", newPass);
                }

                backupConfig(ADMIN_CONFIG);
                Files.writeString(ADMIN_CONFIG, yaml.dump(adminMap), StandardCharsets.UTF_8);

                return ResponseEntity.ok(ApiResponse.ok("可视化配置已安全更新并备份。提示：端口、数据源、上传限制与SSL等核心服务配置需重启后端应用后生效。"));
            }

            // 2. Raw YAML Mode
            String newAppYaml = (String) payload.get("applicationYaml");
            String newAdminYaml = (String) payload.get("adminYaml");

            if (newAppYaml != null) {
                try {
                    yaml.load(newAppYaml);
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(ApiResponse.fail("application.yml 语法错误: " + e.getMessage()));
                }
            }

            if (newAdminYaml != null) {
                try {
                    yaml.load(newAdminYaml);
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(ApiResponse.fail("admin.yml 语法错误: " + e.getMessage()));
                }
            }

            if (newAppYaml != null) {
                backupConfig(APP_CONFIG);
                Files.writeString(APP_CONFIG, newAppYaml, StandardCharsets.UTF_8);
            }

            if (newAdminYaml != null) {
                backupConfig(ADMIN_CONFIG);
                Files.writeString(ADMIN_CONFIG, newAdminYaml, StandardCharsets.UTF_8);
            }

            return ResponseEntity.ok(ApiResponse.ok("原始配置已保存并备份。提示：端口与SSL等核心服务配置需重启后端应用后生效。"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.error("Failed to save config", e);
            return ResponseEntity.internalServerError().body(ApiResponse.fail("保存配置失败: " + e.getMessage()));
        }
    }

    private Yaml createYaml() {
        org.yaml.snakeyaml.DumperOptions options = new org.yaml.snakeyaml.DumperOptions();
        options.setDefaultFlowStyle(org.yaml.snakeyaml.DumperOptions.FlowStyle.BLOCK);
        options.setPrettyFlow(true);
        options.setIndent(2);
        return new Yaml(options);
    }

    private void appendErr(StringBuilder sb, String msg) {
        if (sb.length() > 0) sb.append("；");
        sb.append(msg);
    }

    private Integer parseVisualInt(Map<String, Object> visual, String key, String label,
                                   int min, int max, StringBuilder error) {
        if (!visual.containsKey(key)) return null;
        int value;
        try {
            value = Integer.parseInt(String.valueOf(visual.get(key)).trim());
        } catch (NumberFormatException e) {
            appendErr(error, label + "必须是整数");
            return null;
        }
        if (value < min || value > max) {
            appendErr(error, label + "必须在 " + min + "–" + max + " 之间");
            return null;
        }
        return value;
    }

    private void backupConfig(Path target) throws IOException {
        Path bak = target.resolveSibling(target.getFileName().toString() + ".bak");
        Path bak1 = target.resolveSibling(target.getFileName().toString() + ".bak.1");
        if (Files.exists(bak)) {
            Files.copy(bak, bak1, StandardCopyOption.REPLACE_EXISTING);
        }
        if (Files.exists(target)) {
            Files.copy(target, bak, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    private String readFileOrExample(Path primary, Path example) throws IOException {
        if (Files.exists(primary)) {
            return Files.readString(primary, StandardCharsets.UTF_8);
        }
        Path externalExample = primary.resolveSibling(primary.getFileName().toString() + ".example");
        if (Files.exists(externalExample)) {
            return Files.readString(externalExample, StandardCharsets.UTF_8);
        }
        if (Files.exists(example)) {
            return Files.readString(example, StandardCharsets.UTF_8);
        }
        org.springframework.core.io.ClassPathResource cp =
                new org.springframework.core.io.ClassPathResource("config/" + primary.getFileName().toString() + ".example");
        if (cp.exists()) {
            try (java.io.InputStream in = cp.getInputStream()) {
                return new String(in.readAllBytes(), StandardCharsets.UTF_8);
            }
        }
        return "";
    }
}

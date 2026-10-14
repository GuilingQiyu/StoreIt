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

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

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

            Map<String, Object> result = new HashMap<>();
            result.put("applicationYaml", appYamlStr);
            result.put("adminYaml", adminYamlStr);
            result.put("applicationConfig", appMap);
            result.put("adminConfig", adminMap);

            return ResponseEntity.ok(ApiResponse.ok("获取配置成功", result));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.error("Failed to read config", e);
            return ResponseEntity.internalServerError().body(ApiResponse.fail("读取配置文件失败: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> updateConfig(HttpServletRequest request, @RequestBody Map<String, String> payload) {
        try {
            requireAdmin(request);
            String newAppYaml = payload.get("applicationYaml");
            String newAdminYaml = payload.get("adminYaml");

            Yaml yaml = new Yaml();
            // Validate YAML syntax
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

            if (!Files.exists(CONFIG_DIR)) {
                Files.createDirectories(CONFIG_DIR);
            }

            if (newAppYaml != null) {
                if (Files.exists(APP_CONFIG)) {
                    Files.copy(APP_CONFIG, CONFIG_DIR.resolve("application.yml.bak"), StandardCopyOption.REPLACE_EXISTING);
                }
                Files.writeString(APP_CONFIG, newAppYaml, StandardCharsets.UTF_8);
            }

            if (newAdminYaml != null) {
                if (Files.exists(ADMIN_CONFIG)) {
                    Files.copy(ADMIN_CONFIG, CONFIG_DIR.resolve("admin.yml.bak"), StandardCopyOption.REPLACE_EXISTING);
                }
                Files.writeString(ADMIN_CONFIG, newAdminYaml, StandardCharsets.UTF_8);
            }

            return ResponseEntity.ok(ApiResponse.ok("配置已保存。提示：端口与SSL等核心服务配置需重启后端应用后生效。"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(ApiResponse.fail(e.getMessage()));
        } catch (Exception e) {
            log.error("Failed to save config", e);
            return ResponseEntity.internalServerError().body(ApiResponse.fail("保存配置失败: " + e.getMessage()));
        }
    }

    private String readFileOrExample(Path primary, Path example) throws IOException {
        if (Files.exists(primary)) {
            return Files.readString(primary, StandardCharsets.UTF_8);
        }
        if (Files.exists(example)) {
            return Files.readString(example, StandardCharsets.UTF_8);
        }
        return "";
    }
}

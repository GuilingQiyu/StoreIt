package com.glqyu.storeit;

import com.glqyu.storeit.config.AppProperties;
import com.glqyu.storeit.mapper.SessionMapper;
import com.glqyu.storeit.mapper.UserMapper;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCrypt;

import java.time.Instant;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
@EnableScheduling
public class StoreitApplication {

	private static final Logger log = LoggerFactory.getLogger(StoreitApplication.class);

	// Ensure required runtime directories (e.g., for SQLite DB) exist before Spring initializes the DataSource
	static {
		try {
			Files.createDirectories(Paths.get("data"));
		} catch (Exception ignored) { }
	}

	public static void main(String[] args) {
		SpringApplication.run(StoreitApplication.class, args);
	}

	@Bean
	ApplicationRunner init(UserMapper userMapper, SessionMapper sessionMapper, AppProperties props) {
		return new ApplicationRunner() {
			@Override
			public void run(ApplicationArguments args) throws Exception {
				// 1) Generate external config templates on first run (won't affect current process config)
				try {
					Path cfgDir = Paths.get("config");
					Files.createDirectories(cfgDir);
					copyIfMissing("config/application.yml", "config/application.yml.example");
					copyIfMissing("config/admin.yml", "config/admin.yml.example");
				} catch (Exception e) {
					log.warn("Failed to prepare external config templates: {}", e.toString());
				}

				// ensure default admin exists
				String cfgUser = props.getDefaultAdmin().getUsername();
				String cfgPass = props.getDefaultAdmin().getPassword();
				boolean cfgIsWeak = AuthService.isWeakDefaultPassword(cfgPass);
				User existing = userMapper.findByUsername(cfgUser).orElse(null);
				if (existing == null) {
					User u = new User();
					u.setUsername(cfgUser);
					u.setPasswordHash(BCrypt.hashpw(cfgPass, BCrypt.gensalt()));
					u.setCreatedAt(Instant.now().getEpochSecond());
					u.setRole("ADMIN");
					u.setStorageQuota(0L); // 0 = 不限额
					u.setMustChangePassword(cfgIsWeak);
					u.setEnabled(true);
					userMapper.insert(u);
					if (cfgIsWeak) {
						log.warn("Default admin created with documented weak password '{}'. "
								+ "Normal use is blocked until password is changed via /change-password or a strong password is set in config/admin.yml.",
								AuthService.WEAK_DEFAULT_PASSWORD);
					}
				} else {
					// 仅当外部配置为非弱口令且与库中不同时同步，避免改密后被弱默认配置覆盖
					if (!cfgIsWeak && !BCrypt.checkpw(cfgPass, existing.getPasswordHash())) {
						existing.setPasswordHash(BCrypt.hashpw(cfgPass, BCrypt.gensalt()));
						existing.setMustChangePassword(false);
						userMapper.updatePassword(existing);
						log.info("Synced admin password from config/admin.yml for user '{}'", cfgUser);
					} else if (BCrypt.checkpw(AuthService.WEAK_DEFAULT_PASSWORD, existing.getPasswordHash())) {
						if (!existing.isMustChangePassword()) {
							userMapper.updateMustChangePassword(existing.getUsername(), true);
						}
						log.warn("Admin '{}' still uses the documented default password. "
								+ "Change it before normal use (POST /api/change-password or strong config/admin.yml).",
								cfgUser);
					}
					// backfill ADMIN role for pre-existing default admin (created before role support)
					if (existing.getRole() == null || existing.getRole().isBlank()) {
						userMapper.updateRole(existing.getUsername(), "ADMIN");
					}
				}
				// cleanup expired sessions
				sessionMapper.deleteExpired(Instant.now().getEpochSecond());
			}
		};
	}

	private void copyIfMissing(String targetPathStr, String classpathExample) {
		try {
			Path target = Paths.get(targetPathStr);
			if (Files.exists(target)) return;
			ClassPathResource res = new ClassPathResource(classpathExample);
			if (!res.exists()) {
				log.debug("Classpath example not found: {}", classpathExample);
				return;
			}
			try (InputStream in = res.getInputStream()) {
				Files.createDirectories(target.getParent());
				Files.copy(in, target);
				log.info("Created example config: {} (edit and restart to apply)", targetPathStr);
			}
		} catch (Exception e) {
			log.warn("Failed to create example config {}: {}", targetPathStr, e.toString());
		}
	}
}

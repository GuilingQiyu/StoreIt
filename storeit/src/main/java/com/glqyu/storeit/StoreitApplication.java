package com.glqyu.storeit;

import com.glqyu.storeit.config.AppProperties;
import com.glqyu.storeit.mapper.SessionMapper;
import com.glqyu.storeit.mapper.UserMapper;
import com.glqyu.storeit.model.User;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCrypt;

import java.time.Instant;

@SpringBootApplication
@EnableScheduling
public class StoreitApplication {

	// Ensure required runtime directories (e.g., for SQLite DB) exist before Spring initializes the DataSource
	static {
		try {
			java.nio.file.Files.createDirectories(java.nio.file.Paths.get("data"));
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
				// ensure default admin exists
				User existing = userMapper.findByUsername(props.getDefaultAdmin().getUsername()).orElse(null);
				if (existing == null) {
					User u = new User();
					u.setUsername(props.getDefaultAdmin().getUsername());
					u.setPasswordHash(BCrypt.hashpw(props.getDefaultAdmin().getPassword(), BCrypt.gensalt()));
					u.setCreatedAt(Instant.now().getEpochSecond());
					userMapper.insert(u);
				} else {
					// if config password has changed, update hash to keep in sync
					String cfgPass = props.getDefaultAdmin().getPassword();
					if (!BCrypt.checkpw(cfgPass, existing.getPasswordHash())) {
						existing.setPasswordHash(BCrypt.hashpw(cfgPass, BCrypt.gensalt()));
						userMapper.updatePassword(existing);
					}
				}
				// cleanup expired sessions
				sessionMapper.deleteExpired(Instant.now().getEpochSecond());
			}
		};
	}
}

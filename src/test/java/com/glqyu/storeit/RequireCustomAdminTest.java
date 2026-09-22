package com.glqyu.storeit;

import com.glqyu.storeit.config.AppProperties;
import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RequireCustomAdminTest {

	@Test
	void detectsTheBuiltInAdminPair() {
		AppProperties props = new AppProperties();
		assertThat(props.isBuiltInDefaultAdmin()).isTrue();
		props.getDefaultAdmin().setPassword("replaced");
		assertThat(props.isBuiltInDefaultAdmin()).isFalse();
	}

	@Test
	void refusesStartupWhenTheBuiltInPasswordIsStillRequiredToChange() throws Exception {
		Path root = Files.createTempDirectory("storeit-guard-");
		assertThatThrownBy(() -> SpringApplication.run(StoreitApplication.class, args(root, "authorized_users", true)))
				.satisfies(error -> assertThat(containsMessage(error, "require-custom-admin")).isTrue());
	}

	@Test
	void startsWhenRequireCustomAdminHasAReplacedPassword() throws Exception {
		Path root = Files.createTempDirectory("storeit-guard-ok-");
		try (ConfigurableApplicationContext ctx = SpringApplication.run(
				StoreitApplication.class, args(root, "custom-admin-pass", true))) {
			assertThat(ctx.isActive()).isTrue();
		}
	}

	private static String[] args(Path root, String password, boolean requireCustomAdmin) {
		return new String[] {
				"--spring.datasource.url=jdbc:sqlite:" + root.resolve("test.db").toAbsolutePath(),
				"--app.storage-root=" + root.resolve("storage").toAbsolutePath(),
				"--app.require-custom-admin=" + requireCustomAdmin,
				"--app.default-admin.username=admin",
				"--app.default-admin.password=" + password,
				"--server.ssl.enabled=false",
				"--server.port=0",
				"--spring.main.banner-mode=off"
		};
	}

	private static boolean containsMessage(Throwable error, String text) {
		Throwable current = error;
		while (current != null) {
			if (current.getMessage() != null && current.getMessage().contains(text)) {
				return true;
			}
			current = current.getCause();
		}
		return false;
	}
}

package com.glqyu.storeit;

import com.glqyu.storeit.mapper.UserMapper;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.FileService;
import com.glqyu.storeit.web.AuthController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class Phase2BehaviorTest {

	private static final Path TEMP_ROOT = createTempRoot();

	@Autowired MockMvc mockMvc;
	@Autowired FileService fileService;
	@Autowired UserMapper userMapper;

	@DynamicPropertySource
	static void isolate(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", () -> "jdbc:sqlite:" + TEMP_ROOT.resolve("test.db").toAbsolutePath());
		registry.add("app.storage-root", () -> TEMP_ROOT.resolve("storage").toAbsolutePath().toString());
		registry.add("app.default-admin.username", () -> "admin");
		registry.add("app.default-admin.password", () -> "test-password");
		registry.add("server.ssl.enabled", () -> "false");
		registry.add("app.ssl-enabled", () -> "false");
		registry.add("app.require-custom-admin", () -> "false");
	}

	@Test
	void loginLocksTheSameIpAndUsernameAfterFiveFailures() throws Exception {
		for (int i = 0; i < 5; i++) {
			mockMvc.perform(post("/api/login").param("username", "missing-user").param("password", "bad"))
					.andExpect(status().isUnauthorized());
		}
		mockMvc.perform(post("/api/login").param("username", "missing-user").param("password", "bad"))
				.andExpect(status().isTooManyRequests())
				.andExpect(jsonPath("$.message").value(AuthController.TOO_MANY_ATTEMPTS));

		newUser("locked-user");
		for (int i = 0; i < 5; i++) {
			mockMvc.perform(post("/api/login").param("username", "locked-user").param("password", "wrong"))
					.andExpect(status().isUnauthorized());
		}
		mockMvc.perform(post("/api/login").param("username", "locked-user").param("password", "secret"))
				.andExpect(status().isTooManyRequests());

		newUser("clear-user");
		for (int i = 0; i < 4; i++) {
			mockMvc.perform(post("/api/login").param("username", "clear-user").param("password", "wrong"))
					.andExpect(status().isUnauthorized());
		}
		mockMvc.perform(post("/api/login").param("username", "clear-user").param("password", "secret"))
				.andExpect(status().isOk());
		mockMvc.perform(post("/api/login").param("username", "clear-user").param("password", "wrong"))
				.andExpect(status().isUnauthorized());
		mockMvc.perform(post("/api/login").param("username", "clear-user").param("password", "wrong"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void symlinkCannotEscapeTheUserDirectory() throws Exception {
		User user = newUser("link-user");
		Path outside = TEMP_ROOT.resolve("outside");
		Files.createDirectories(outside);
		Files.writeString(outside.resolve("secret.txt"), "secret");
		Path userRoot = TEMP_ROOT.resolve("storage").resolve(user.getUsername());
		Files.createDirectories(userRoot);
		Files.createSymbolicLink(userRoot.resolve("leak"), outside);

		assertThatThrownBy(() -> fileService.getResource(user, "leak/secret.txt")).isInstanceOf(Exception.class);
		assertThatThrownBy(() -> fileService.list(user, "leak")).isInstanceOf(Exception.class);
		assertThatThrownBy(() -> fileService.saveFile(user, "leak", textFile("pwn.txt", "no")))
				.isInstanceOf(Exception.class);
		assertThat(Files.exists(outside.resolve("pwn.txt"))).isFalse();
		assertThat(Files.readString(outside.resolve("secret.txt"))).isEqualTo("secret");
	}

	@Test
	void previewKeepsPassiveTypesInlineAndNeutralizesMarkup() throws Exception {
		User user = newUser("preview-user");
		String png = fileService.saveFile(user, "", textFile("pic.png", "png"));
		String svg = fileService.saveFile(user, "", textFile("pic.svg", "<svg><script>alert(1)</script></svg>"));
		String html = fileService.saveFile(user, "", textFile("page.html", "<html><script>alert(1)</script></html>"));
		String pdf = fileService.saveFile(user, "", textFile("doc.pdf", "%PDF"));
		var cookie = login("preview-user");

		mockMvc.perform(get("/api/preview").param("path", png).cookie(cookie))
				.andExpect(status().isOk())
				.andExpect(header().string(HttpHeaders.CONTENT_TYPE, containsString("image/png")))
				.andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, containsString("inline")));
		mockMvc.perform(get("/api/preview").param("path", pdf).cookie(cookie))
				.andExpect(status().isOk())
				.andExpect(header().string(HttpHeaders.CONTENT_TYPE, containsString("application/pdf")));
		mockMvc.perform(get("/api/preview").param("path", svg).cookie(cookie))
				.andExpect(status().isOk())
				.andExpect(header().string(HttpHeaders.CONTENT_TYPE, containsString("text/plain")))
				.andExpect(header().string("Content-Security-Policy", containsString("script-src 'none'")));
		mockMvc.perform(get("/api/preview").param("path", html).header(HttpHeaders.RANGE, "bytes=0-3").cookie(cookie))
				.andExpect(status().isPartialContent())
				.andExpect(header().string(HttpHeaders.CONTENT_TYPE, containsString("text/plain")))
				.andExpect(header().string("Content-Security-Policy", containsString("script-src 'none'")));
	}

	@Test
	void healthIsPublicAndOtherActuatorEndpointsAreNot() throws Exception {
		mockMvc.perform(get("/actuator/health"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("UP"));
		mockMvc.perform(get("/actuator/env")).andExpect(status().is3xxRedirection());
		mockMvc.perform(get("/actuator/env").cookie(login("admin")))
				.andExpect(status().isNotFound());
	}

	private jakarta.servlet.http.Cookie login(String username) throws Exception {
		String password = "admin".equals(username) ? "test-password" : "secret";
		MvcResult login = mockMvc.perform(post("/api/login").param("username", username).param("password", password))
				.andExpect(status().isOk())
				.andReturn();
		return login.getResponse().getCookie("STOREIT_SESSION");
	}

	private User newUser(String username) {
		User user = new User();
		user.setUsername(username);
		user.setPasswordHash(BCrypt.hashpw("secret", BCrypt.gensalt()));
		user.setCreatedAt(Instant.now().getEpochSecond());
		user.setRole("USER");
		user.setStorageQuota(0);
		userMapper.insert(user);
		return userMapper.findByUsername(username).orElseThrow();
	}

	private static MockMultipartFile textFile(String name, String body) {
		return new MockMultipartFile("file", name, "text/plain", body.getBytes(StandardCharsets.UTF_8));
	}

	private static Path createTempRoot() {
		try {
			return Files.createTempDirectory("storeit-b-");
		} catch (Exception e) {
			throw new ExceptionInInitializerError(e);
		}
	}
}

package com.glqyu.storeit;

import com.glqyu.storeit.mapper.FileMetadataMapper;
import com.glqyu.storeit.mapper.FileShareMapper;
import com.glqyu.storeit.mapper.UserMapper;
import com.glqyu.storeit.model.FileShare;
import com.glqyu.storeit.model.User;
import com.glqyu.storeit.service.FileService;
import com.glqyu.storeit.service.ShareService;
import com.zaxxer.hikari.HikariDataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class Phase1BehaviorTest {

	private static final Path TEMP_ROOT = createTempRoot();

	@Autowired MockMvc mockMvc;
	@Autowired TestRestTemplate rest;
	@Autowired Environment environment;
	@Autowired DataSource dataSource;
	@Autowired FileService fileService;
	@Autowired ShareService shareService;
	@Autowired UserMapper userMapper;
	@Autowired FileMetadataMapper metaMapper;
	@Autowired FileShareMapper shareMapper;

	@DynamicPropertySource
	static void isolate(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", () -> "jdbc:sqlite:" + TEMP_ROOT.resolve("test.db").toAbsolutePath());
		registry.add("app.storage-root", () -> TEMP_ROOT.resolve("storage").toAbsolutePath().toString());
		registry.add("app.default-admin.username", () -> "admin");
		registry.add("app.default-admin.password", () -> "test-password");
		registry.add("server.ssl.enabled", () -> "false");
		registry.add("app.ssl-enabled", () -> "false");
	}

	@Test
	void contextUsesTemporaryDatabaseAndDisablesSsl() {
		assertThat(environment.getProperty("spring.datasource.url")).contains("storeit-it-");
		assertThat(environment.getProperty("app.storage-root")).contains("storeit-it-");
		assertThat(environment.getProperty("server.ssl.enabled")).isEqualTo("false");
		assertThat(environment.getProperty("app.default-admin.password")).isEqualTo("test-password");
		assertThat(environment.getProperty("spring.datasource.url")).doesNotContain("data/storeit.db");
	}

	@Test
	void sqliteEnforcesForeignKeysOnASingleConnection() throws Exception {
		HikariDataSource hikari = dataSource instanceof HikariDataSource ds
				? ds
				: dataSource.unwrap(HikariDataSource.class);
		assertThat(hikari.getMaximumPoolSize()).isEqualTo(1);
		try (Connection connection = dataSource.getConnection();
			 Statement statement = connection.createStatement();
			 ResultSet pragma = statement.executeQuery("PRAGMA foreign_keys")) {
			assertThat(pragma.next()).isTrue();
			assertThat(pragma.getInt(1)).isEqualTo(1);
		}
		assertThatThrownBy(() -> {
			try (Connection connection = dataSource.getConnection();
				 PreparedStatement insert = connection.prepareStatement(
						 "INSERT INTO sessions(id, username, created_at, expires_at) VALUES(?,?,?,?)")) {
				insert.setString(1, "missing-user-session");
				insert.setString(2, "no-such-user");
				insert.setLong(3, 1);
				insert.setLong(4, 2);
				insert.executeUpdate();
			}
		}).isInstanceOf(Exception.class);
	}

	@Test
	void loginAcceptsTheConfiguredAdminAndRejectsBadPasswords() throws Exception {
		mockMvc.perform(post("/api/login").param("username", "admin").param("password", "test-password"))
				.andExpect(status().isOk())
				.andExpect(cookie().exists("STOREIT_SESSION"));
		mockMvc.perform(post("/api/login").param("username", "admin").param("password", "wrong"))
				.andExpect(status().isUnauthorized());
		mockMvc.perform(post("/api/login").param("username", "nobody").param("password", "wrong"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void rejectsPathsThatEscapeTheUserDirectory() throws Exception {
		User user = newUser("escape-user", 0);
		assertThatThrownBy(() -> fileService.list(user, "..")).isInstanceOf(Exception.class);
		assertThatThrownBy(() -> fileService.getResource(user, "../secret")).isInstanceOf(Exception.class);
		assertThatThrownBy(() -> fileService.getResource(user, "/etc/passwd")).isInstanceOf(Exception.class);
		assertThatThrownBy(() -> fileService.saveFile(user, "..", textFile("a.txt", "x")))
				.isInstanceOf(Exception.class);
	}

	@Test
	void rootReuploadUpdatesTheSameMetadataRow() throws Exception {
		User user = newUser("reupload-user", 0);
		assertThat(fileService.saveFile(user, "", textFile("a.txt", "one"))).isEqualTo("a.txt");
		Path stored = TEMP_ROOT.resolve("storage").resolve("reupload-user").resolve("a.txt");
		Files.delete(stored);

		assertThat(fileService.saveFile(user, "", textFile("a.txt", "two"))).isEqualTo("a.txt");
		assertThat(Files.readString(stored)).isEqualTo("two");
		assertThat(metaMapper.findByUserIdAndPath(user.getId(), "a.txt")).isPresent();
		assertThat(metaMapper.findByUserIdAndPath(user.getId(), "/a.txt")).isEmpty();
		assertThat(metaMapper.findByUserIdAndParentPath(user.getId(), "")).hasSize(1);
	}

	@Test
	void secondRootUploadKeepsBothNamesWhenTheFileRemains() throws Exception {
		User user = newUser("rename-user", 0);
		fileService.saveFile(user, "", textFile("a.txt", "one"));
		assertThat(fileService.saveFile(user, "", textFile("a.txt", "two"))).isEqualTo("a (1).txt");
		assertThat(metaMapper.findByUserIdAndParentPath(user.getId(), "")).hasSize(2);
	}

	@Test
	void quotaBlocksTheExtraByteAndZeroMeansUnlimited() throws Exception {
		User limited = newUser("quota-user", 5);
		fileService.saveFile(limited, "", textFile("a.txt", "hello"));
		assertThatThrownBy(() -> fileService.saveFile(limited, "", textFile("b.txt", "x")))
				.isInstanceOf(Exception.class)
				.hasMessage(FileService.QUOTA_EXCEEDED);
		assertThat(Files.exists(TEMP_ROOT.resolve("storage").resolve("quota-user").resolve("b.txt"))).isFalse();

		User unlimited = newUser("free-user", 0);
		assertThat(fileService.saveFile(unlimited, "", textFile("big.txt", "0123456789"))).isEqualTo("big.txt");
	}

	@Test
	void uploadApiReturnsQuotaMessage() throws Exception {
		newUser("quota-http", 4);
		MvcResult login = mockMvc.perform(post("/api/login")
						.param("username", "quota-http")
						.param("password", "secret"))
				.andExpect(status().isOk())
				.andReturn();
		mockMvc.perform(multipart("/api/upload")
						.file(textFile("big.txt", "hello"))
						.cookie(login.getResponse().getCookie("STOREIT_SESSION")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.error").value(FileService.QUOTA_EXCEEDED));
	}

	@Test
	void shareDownloadConsumesOnlyWhenTheFileExistsAndWithinLimit() throws Exception {
		User user = newUser("share-user", 0);
		String path = fileService.saveFile(user, "", textFile("note.txt", "hello"));
		FileShare share = shareService.createShare(user, path, 24, 1);

		mockMvc.perform(get("/d/" + share.getToken())).andExpect(status().isOk());
		assertThat(shareMapper.findByToken(share.getToken()).orElseThrow().getDownloads()).isEqualTo(1);
		mockMvc.perform(get("/d/" + share.getToken()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.error").value("分享链接无效或已过期"));
		assertThat(shareMapper.findByToken(share.getToken()).orElseThrow().getDownloads()).isEqualTo(1);

		FileShare missing = shareService.createShare(user, "missing.txt", 24, 3);
		mockMvc.perform(get("/d/" + missing.getToken()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.error").value("文件不存在"));
		assertThat(shareMapper.findByToken(missing.getToken()).orElseThrow().getDownloads()).isZero();

		FileShare expired = new FileShare();
		expired.setUserId(user.getId());
		expired.setFilePath(path);
		expired.setToken("expired-token-140a");
		expired.setExpiry(Instant.now().getEpochSecond() - 60);
		expired.setMaxDownloads(5);
		expired.setDownloads(0);
		expired.setCreatedAt(Instant.now().getEpochSecond());
		shareMapper.insert(expired);
		mockMvc.perform(get("/d/expired-token-140a"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.error").value("分享链接无效或已过期"));
		assertThat(shareMapper.findByToken("expired-token-140a").orElseThrow().getDownloads()).isZero();
	}

	@Test
	void concurrentConsumeAllowsOnlyOneDownload() throws Exception {
		User user = newUser("race-user", 0);
		String path = fileService.saveFile(user, "", textFile("race.txt", "hello"));
		FileShare share = shareService.createShare(user, path, 24, 1);
		ExecutorService pool = Executors.newFixedThreadPool(2);
		try {
			Future<Boolean> first = pool.submit(() -> shareService.consumeDownload(share.getId()));
			Future<Boolean> second = pool.submit(() -> shareService.consumeDownload(share.getId()));
			int wins = (first.get() ? 1 : 0) + (second.get() ? 1 : 0);
			assertThat(wins).isEqualTo(1);
		} finally {
			pool.shutdownNow();
		}
		assertThat(shareMapper.findByToken(share.getToken()).orElseThrow().getDownloads()).isEqualTo(1);
	}

	@Test
	void signedInMissingPageRendersThe404Document() {
		MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
		form.add("username", "admin");
		form.add("password", "test-password");
		ResponseEntity<String> login = rest.postForEntity("/api/login", form, String.class);
		assertThat(login.getStatusCode().value()).isEqualTo(200);
		String setCookie = login.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
		assertThat(setCookie).contains("STOREIT_SESSION");

		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.COOKIE, setCookie.split(";", 2)[0]);
		headers.setAccept(List.of(MediaType.TEXT_HTML));
		ResponseEntity<String> page = rest.exchange(
				"/no-such-page-140a", HttpMethod.GET, new HttpEntity<>(headers), String.class);
		assertThat(page.getStatusCode().value()).isEqualTo(404);
		assertThat(page.getBody()).contains("页面未找到");
	}

	private User newUser(String username, long quota) {
		User user = new User();
		user.setUsername(username);
		user.setPasswordHash(BCrypt.hashpw("secret", BCrypt.gensalt()));
		user.setCreatedAt(Instant.now().getEpochSecond());
		user.setRole("USER");
		user.setStorageQuota(quota);
		userMapper.insert(user);
		return userMapper.findByUsername(username).orElseThrow();
	}

	private static MockMultipartFile textFile(String name, String body) {
		return new MockMultipartFile("file", name, "text/plain", body.getBytes(StandardCharsets.UTF_8));
	}

	private static Path createTempRoot() {
		try {
			return Files.createTempDirectory("storeit-it-");
		} catch (Exception e) {
			throw new ExceptionInInitializerError(e);
		}
	}
}

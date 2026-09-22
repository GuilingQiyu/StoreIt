package com.glqyu.storeit;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import jakarta.servlet.http.Cookie;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class Phase3BehaviorTest {

	private static final Path TEMP_ROOT = createTempRoot();

	@Autowired MockMvc mockMvc;

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
	void adminManagesUsersAndOrdinaryUsersStayInTheirOwnDirectory() throws Exception {
		mockMvc.perform(get("/api/admin/users")).andExpect(status().isUnauthorized());
		Cookie admin = login("admin", "test-password");
		mockMvc.perform(get("/api/user/status").cookie(admin))
				.andExpect(jsonPath("$.role").value("ADMIN"));

		mockMvc.perform(post("/api/admin/users").cookie(admin)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"../evil\",\"password\":\"secretpass\",\"storageQuota\":0}"))
				.andExpect(status().isBadRequest());
		mockMvc.perform(post("/api/admin/users").cookie(admin)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"alice\",\"password\":\"short\",\"storageQuota\":0}"))
				.andExpect(status().isBadRequest());

		mockMvc.perform(post("/api/admin/users").cookie(admin)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"alice\",\"password\":\"secretpass\",\"storageQuota\":100}"))
				.andExpect(status().isOk())
				.andExpect(content().string(not(containsString("passwordHash"))));
		mockMvc.perform(post("/api/admin/users").cookie(admin)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"alice\",\"password\":\"secretpass\",\"storageQuota\":0}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("用户已存在"));
		mockMvc.perform(post("/api/admin/users").cookie(admin)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"bob\",\"password\":\"secretpass\",\"storageQuota\":0}"))
				.andExpect(status().isOk());

		Cookie alice = login("alice", "secretpass");
		mockMvc.perform(post("/api/admin/users").cookie(alice)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"carol\",\"password\":\"secretpass\",\"storageQuota\":0}"))
				.andExpect(status().isForbidden());

		mockMvc.perform(patch("/api/admin/users/alice").cookie(admin)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"storageQuota\":42}"))
				.andExpect(status().isOk());
		mockMvc.perform(get("/api/admin/users").cookie(admin))
				.andExpect(jsonPath("$.data[?(@.username=='alice')].storageQuota").value(hasItem(42)))
				.andExpect(content().string(not(containsString("passwordHash"))));

		mockMvc.perform(patch("/api/admin/users/admin").cookie(admin)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"role\":\"USER\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("不能取消自己的管理员角色"));

		mockMvc.perform(post("/api/admin/users/bob/password").cookie(admin)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"password\":\"new-secret-1\"}"))
				.andExpect(status().isOk());
		mockMvc.perform(post("/api/login").param("username", "bob").param("password", "secretpass"))
				.andExpect(status().isUnauthorized());
		login("bob", "new-secret-1");

		mockMvc.perform(multipart("/api/upload").file(textFile("note.txt", "hello")).cookie(alice))
				.andExpect(status().isOk());
		assertThat(Files.readString(TEMP_ROOT.resolve("storage").resolve("alice").resolve("note.txt"))).isEqualTo("hello");
		assertThat(Files.exists(TEMP_ROOT.resolve("storage").resolve("bob").resolve("note.txt"))).isFalse();
	}

	@Test
	void ownerCanRevokeAShareAndOthersCannot() throws Exception {
		Cookie admin = login("admin", "test-password");
		mockMvc.perform(post("/api/admin/users").cookie(admin)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"share-alice\",\"password\":\"secretpass\",\"storageQuota\":0}"))
				.andExpect(status().isOk());
		mockMvc.perform(post("/api/admin/users").cookie(admin)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"share-bob\",\"password\":\"secretpass\",\"storageQuota\":0}"))
				.andExpect(status().isOk());
		Cookie alice = login("share-alice", "secretpass");
		Cookie bob = login("share-bob", "secretpass");
		mockMvc.perform(multipart("/api/upload").file(textFile("shared.txt", "data")).cookie(alice))
				.andExpect(status().isOk());
		MvcResult created = mockMvc.perform(post("/api/share").cookie(alice)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"filePath\":\"shared.txt\",\"expireHours\":24,\"maxDownloads\":3}"))
				.andExpect(status().isOk())
				.andReturn();
		String token = JsonPath.read(created.getResponse().getContentAsString(), "$.data.token");

		MvcResult listed = mockMvc.perform(get("/api/shares").cookie(alice))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data[0].token").value(token))
				.andExpect(jsonPath("$.data[0].maxDownloads").value(3))
				.andReturn();
		Number shareId = JsonPath.read(listed.getResponse().getContentAsString(), "$.data[0].id");
		mockMvc.perform(get("/api/shares").cookie(bob))
				.andExpect(jsonPath("$.data").isEmpty());
		mockMvc.perform(delete("/api/shares/" + shareId).cookie(bob))
				.andExpect(status().isNotFound());
		mockMvc.perform(get("/d/" + token)).andExpect(status().isOk());

		mockMvc.perform(delete("/api/shares/" + shareId).cookie(alice)).andExpect(status().isOk());
		mockMvc.perform(get("/d/" + token))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.error").value("分享链接无效或已过期"));
		mockMvc.perform(get("/api/shares").cookie(alice))
				.andExpect(jsonPath("$.data").isEmpty());
	}

	private Cookie login(String username, String password) throws Exception {
		MvcResult result = mockMvc.perform(post("/api/login").param("username", username).param("password", password))
				.andExpect(status().isOk())
				.andReturn();
		return result.getResponse().getCookie("STOREIT_SESSION");
	}

	private static MockMultipartFile textFile(String name, String body) {
		return new MockMultipartFile("file", name, "text/plain", body.getBytes(StandardCharsets.UTF_8));
	}

	private static Path createTempRoot() {
		try {
			return Files.createTempDirectory("storeit-c-");
		} catch (Exception e) {
			throw new ExceptionInInitializerError(e);
		}
	}
}

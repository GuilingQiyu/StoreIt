package com.glqyu.storeit;

import com.glqyu.storeit.mapper.FileMetadataMapper;
import com.glqyu.storeit.model.FileMetadata;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
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

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class Phase4BehaviorTest {

	private static final Path TEMP_ROOT = createTempRoot();

	@Autowired MockMvc mockMvc;
	@Autowired FileMetadataMapper metaMapper;

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
	void recentSearchFavoriteAndMoveStayInsideTheUser() throws Exception {
		Cookie admin = login("admin", "test-password");
		MvcResult createdUser = mockMvc.perform(post("/api/admin/users").cookie(admin).contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"files-user\",\"password\":\"secretpass\",\"storageQuota\":0}"))
				.andExpect(status().isOk())
				.andReturn();
		long userId = ((Number) JsonPath.read(createdUser.getResponse().getContentAsString(), "$.data.id")).longValue();
		mockMvc.perform(post("/api/admin/users").cookie(admin).contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"other-user\",\"password\":\"secretpass\",\"storageQuota\":0}"))
				.andExpect(status().isOk());
		Cookie user = login("files-user", "secretpass");
		Cookie other = login("other-user", "secretpass");

		mockMvc.perform(multipart("/api/upload").file(textFile("old.txt", "old")).cookie(user)).andExpect(status().isOk());
		mockMvc.perform(multipart("/api/upload").file(textFile("new.txt", "new")).cookie(user)).andExpect(status().isOk());
		mockMvc.perform(multipart("/api/upload").file(textFile("100%_done.txt", "pct")).cookie(user)).andExpect(status().isOk());
		mockMvc.perform(multipart("/api/upload").file(textFile("secret.txt", "nope")).cookie(other)).andExpect(status().isOk());
		mockMvc.perform(post("/api/folder/create").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"path\":\"docs\"}")).andExpect(status().isOk());

		FileMetadata old = metaMapper.findByUserIdAndPath(userId, "old.txt").orElseThrow();
		old.setLastModified(10);
		metaMapper.update(old);
		FileMetadata newer = metaMapper.findByUserIdAndPath(userId, "new.txt").orElseThrow();
		newer.setLastModified(4_000_000_000L);
		metaMapper.update(newer);

		mockMvc.perform(get("/api/files/recent").cookie(user))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.items[0].name").value("new.txt"));
		mockMvc.perform(get("/api/files/recent").cookie(other))
				.andExpect(jsonPath("$.items[?(@.name=='new.txt')]").isEmpty());

		mockMvc.perform(get("/api/files/search").param("q", "done").cookie(user))
				.andExpect(jsonPath("$.items[0].name").value("100%_done.txt"));
		mockMvc.perform(get("/api/files/search").param("q", "%").cookie(user))
				.andExpect(jsonPath("$.items.length()").value(1))
				.andExpect(jsonPath("$.items[0].name").value("100%_done.txt"));
		mockMvc.perform(get("/api/files/search").param("q", "secret").cookie(user))
				.andExpect(jsonPath("$.items").isEmpty());

		mockMvc.perform(post("/api/favorites").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"path\":\"old.txt\"}")).andExpect(status().isOk());
		mockMvc.perform(post("/api/file/move").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"path\":\"old.txt\",\"destination\":\"docs\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.path").value("docs/old.txt"));
		assertThat(Files.readString(TEMP_ROOT.resolve("storage/files-user/docs/old.txt"))).isEqualTo("old");
		mockMvc.perform(get("/api/favorites").cookie(user))
				.andExpect(jsonPath("$.items[0].path").value("docs/old.txt"));

		mockMvc.perform(post("/api/share").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"filePath\":\"docs/old.txt\",\"expireHours\":24,\"maxDownloads\":2}"))
				.andExpect(status().isOk());
		mockMvc.perform(post("/api/file/move").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"path\":\"docs/old.txt\",\"destination\":\"\"}"))
				.andExpect(jsonPath("$.path").value("old.txt"));
		MvcResult shares = mockMvc.perform(get("/api/shares").cookie(user)).andExpect(status().isOk()).andReturn();
		String token = JsonPath.read(shares.getResponse().getContentAsString(), "$.data[0].token");
		mockMvc.perform(get("/d/" + token)).andExpect(status().isOk());

		mockMvc.perform(post("/api/file/move").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"path\":\"docs\",\"destination\":\"docs\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.error").value("不能移动到自身内部"));
		mockMvc.perform(post("/api/file/move").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"path\":\"old.txt\",\"destination\":\"../other-user\"}"))
				.andExpect(status().isBadRequest());
		assertThat(Files.exists(TEMP_ROOT.resolve("storage/other-user/old.txt"))).isFalse();

		mockMvc.perform(post("/api/file/delete").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"path\":\"old.txt\"}")).andExpect(status().isOk());
		mockMvc.perform(get("/api/favorites").cookie(user))
				.andExpect(jsonPath("$.items").isEmpty());
	}

	@Test
	void movingAFolderKeepsNestedFiles() throws Exception {
		Cookie admin = login("admin", "test-password");
		mockMvc.perform(post("/api/admin/users").cookie(admin).contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"folder-user\",\"password\":\"secretpass\",\"storageQuota\":0}"))
				.andExpect(status().isOk());
		Cookie user = login("folder-user", "secretpass");
		mockMvc.perform(post("/api/folder/create").cookie(user).contentType(MediaType.APPLICATION_JSON)
				.content("{\"path\":\"box\"}")).andExpect(status().isOk());
		mockMvc.perform(post("/api/folder/create").cookie(user).contentType(MediaType.APPLICATION_JSON)
				.content("{\"path\":\"shelf\"}")).andExpect(status().isOk());
		mockMvc.perform(multipart("/api/upload").file(textFile("nested.txt", "inside"))
						.param("directory", "box").cookie(user)).andExpect(status().isOk());
		mockMvc.perform(post("/api/favorites").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"path\":\"box/nested.txt\"}")).andExpect(status().isOk());
		mockMvc.perform(post("/api/file/move").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"path\":\"box\",\"destination\":\"shelf\"}"))
				.andExpect(jsonPath("$.path").value("shelf/box"));
		assertThat(Files.readString(TEMP_ROOT.resolve("storage/folder-user/shelf/box/nested.txt"))).isEqualTo("inside");
		mockMvc.perform(get("/api/favorites").cookie(user))
				.andExpect(jsonPath("$.items[0].path").value("shelf/box/nested.txt"));
		mockMvc.perform(get("/api/files").param("path", "shelf/box").cookie(user))
				.andExpect(jsonPath("$.items[0].name").value("nested.txt"));
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
			return Files.createTempDirectory("storeit-d-");
		} catch (Exception e) {
			throw new ExceptionInInitializerError(e);
		}
	}
}

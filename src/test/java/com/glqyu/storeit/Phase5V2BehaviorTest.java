package com.glqyu.storeit;

import com.glqyu.storeit.service.FileService;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.head;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class Phase5V2BehaviorTest {

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
	void chunkedUploadLifecycleQuotaCheckAndTraversalProtection() throws Exception {
		Cookie admin = login("admin", "test-password");
		// Tight 20-byte quota: verifies .chunks temporary files are not double-counted during merge
		mockMvc.perform(post("/api/admin/users").cookie(admin).contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"chunk-user\",\"password\":\"secretpass\",\"storageQuota\":20}"))
				.andExpect(status().isOk());
		Cookie user = login("chunk-user", "secretpass");

		// Over-quota init is rejected upfront
		mockMvc.perform(post("/api/upload/init").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"fileName\":\"huge.bin\",\"fileSize\":100,\"directory\":\"\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.error").value(FileService.QUOTA_EXCEEDED));

		// Path traversal in uploadId is rejected
		mockMvc.perform(get("/api/upload/status").param("uploadId", "../evil").cookie(user))
				.andExpect(status().isBadRequest());
		mockMvc.perform(delete("/api/upload/..").cookie(user))
				.andExpect(status().isBadRequest());

		// Valid 11-byte chunked upload within 20-byte quota
		MvcResult initRes = mockMvc.perform(post("/api/upload/init").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"fileName\":\"Makefile\",\"fileSize\":11,\"directory\":\"nested/dir\"}"))
				.andExpect(status().isOk())
				.andReturn();
		String uploadId = JsonPath.read(initRes.getResponse().getContentAsString(), "$.uploadId");

		MockMultipartFile chunk0 = new MockMultipartFile("chunk", "chunk_0.part",
				MediaType.APPLICATION_OCTET_STREAM_VALUE, "hello-world".getBytes(StandardCharsets.UTF_8));
		mockMvc.perform(multipart("/api/upload/chunk").file(chunk0)
						.param("uploadId", uploadId)
						.param("chunkIndex", "0")
						.cookie(user))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/upload/status").param("uploadId", uploadId).cookie(user))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.uploadedChunks[0]").value(0));

		mockMvc.perform(post("/api/upload/complete").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"uploadId\":\"" + uploadId + "\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.file.path").value("nested/dir/Makefile"));

		// Verify parent directories were recorded in file_metadata for search
		mockMvc.perform(get("/api/files/search").param("q", "nested").cookie(user))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.items[0].name").value("nested"));
	}

	@Test
	void zeroByteFileRangePreviewAndPdfFrameAncestorsWork() throws Exception {
		Cookie admin = login("admin", "test-password");
		MockMultipartFile emptyTxt = new MockMultipartFile("file", "empty.txt", "text/plain", new byte[0]);
		mockMvc.perform(multipart("/api/upload").file(emptyTxt).cookie(admin))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/preview").param("path", "empty.txt")
						.header(HttpHeaders.RANGE, "bytes=0-262143")
						.cookie(admin))
				.andExpect(status().isOk())
				.andExpect(header().string("Content-Security-Policy", containsString("script-src 'none'")))
				.andExpect(header().string("Content-Security-Policy", containsString("frame-ancestors 'self'")));
	}

	@Test
	void shareBotPreviewDoesNotConsumeOneTimeDownloadAndUserCanChangeOwnPassword() throws Exception {
		Cookie admin = login("admin", "test-password");
		mockMvc.perform(post("/api/admin/users").cookie(admin).contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"ux-user\",\"password\":\"initpass12\",\"storageQuota\":0,\"mustChangePassword\":true}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.mustChangePassword").value(true));

		Cookie user = login("ux-user", "initpass12");
		mockMvc.perform(get("/api/user/status").cookie(user))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.must_change_password").value(true));

		// Self-service password change clears must_change_password
		mockMvc.perform(post("/api/user/password").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"oldPassword\":\"initpass12\",\"newPassword\":\"newpass123\"}"))
				.andExpect(status().isOk());
		mockMvc.perform(get("/api/user/status").cookie(user))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.must_change_password").value(false));

		// Upload file & create 1-time share link
		MockMultipartFile doc = new MockMultipartFile("file", "once.txt", "text/plain", "secret".getBytes(StandardCharsets.UTF_8));
		mockMvc.perform(multipart("/api/upload").file(doc).cookie(user)).andExpect(status().isOk());

		MvcResult shareRes = mockMvc.perform(post("/api/share").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"filePath\":\"once.txt\",\"expireHours\":24,\"maxDownloads\":1}"))
				.andExpect(status().isOk())
				.andReturn();
		String token = JsonPath.read(shareRes.getResponse().getContentAsString(), "$.data.token");

		// HEAD request and Link Preview Bot UA do NOT consume the 1-time download
		mockMvc.perform(head("/d/" + token)).andExpect(status().isOk());
		mockMvc.perform(get("/d/" + token).header(HttpHeaders.USER_AGENT, "TelegramBot (like TwitterBot)"))
				.andExpect(status().isOk());

		// Real user download still succeeds once
		mockMvc.perform(get("/d/" + token).header(HttpHeaders.USER_AGENT, "Mozilla/5.0"))
				.andExpect(status().isOk());

		// Second real download is rejected (and returns HTML error page if Accept: text/html)
		mockMvc.perform(get("/d/" + token).header(HttpHeaders.ACCEPT, "text/html"))
				.andExpect(status().isNotFound())
				.andExpect(header().string(HttpHeaders.CONTENT_TYPE, containsString("text/html")));

		// Admin disabling the user immediately blocks session & login
		mockMvc.perform(patch("/api/admin/users/ux-user").cookie(admin).contentType(MediaType.APPLICATION_JSON)
						.content("{\"enabled\":false}"))
				.andExpect(status().isOk());
		mockMvc.perform(get("/api/files").cookie(user))
				.andExpect(status().isUnauthorized());
		mockMvc.perform(post("/api/login").param("username", "ux-user").param("password", "newpass123"))
				.andExpect(status().isForbidden());
	}

	@Test
	void configAdminValidatesRangeAndRequiresAdmin() throws Exception {
		Cookie admin = login("admin", "test-password");
		mockMvc.perform(get("/api/admin/config").cookie(admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true));

		mockMvc.perform(post("/api/admin/config").cookie(admin).contentType(MediaType.APPLICATION_JSON)
						.content("{\"visualConfig\":{\"port\":0,\"sslEnabled\":false}}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.success").value(false));
	}

	@Test
	void onlineTextEditingUploadConflictStrategiesAndFullConfigWork() throws Exception {
		Cookie admin = login("admin", "test-password");

		// 1. Upload extensionless text file (Dockerfile) & edit online via GET/PUT /api/file/content
		MockMultipartFile dockerfile = new MockMultipartFile("file", "Dockerfile", "text/plain",
				"FROM eclipse-temurin:21-jre\n".getBytes(StandardCharsets.UTF_8));
		mockMvc.perform(multipart("/api/upload").file(dockerfile).cookie(admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.file.path").value("Dockerfile"));

		mockMvc.perform(get("/api/file/content").param("path", "Dockerfile").cookie(admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").value("FROM eclipse-temurin:21-jre\n"));

		mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/file/content")
						.cookie(admin)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"path\":\"Dockerfile\",\"content\":\"FROM eclipse-temurin:21-jre\\nEXPOSE 59898\\n\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true));

		mockMvc.perform(get("/api/file/content").param("path", "Dockerfile").cookie(admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").value("FROM eclipse-temurin:21-jre\nEXPOSE 59898\n"));

		// 2. Same-name file conflictStrategy: overwrite vs rename
		MockMultipartFile dockerfileOverwrite = new MockMultipartFile("file", "Dockerfile", "text/plain",
				"FROM alpine:3.20\n".getBytes(StandardCharsets.UTF_8));
		mockMvc.perform(multipart("/api/upload").file(dockerfileOverwrite)
						.param("conflictStrategy", "overwrite")
						.cookie(admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.file.path").value("Dockerfile"));
		mockMvc.perform(get("/api/file/content").param("path", "Dockerfile").cookie(admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").value("FROM alpine:3.20\n"));

		MockMultipartFile dockerfileRename = new MockMultipartFile("file", "Dockerfile", "text/plain",
				"FROM ubuntu:24.04\n".getBytes(StandardCharsets.UTF_8));
		mockMvc.perform(multipart("/api/upload").file(dockerfileRename)
						.param("conflictStrategy", "rename")
						.cookie(admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.file.path").value("Dockerfile (1)"));

		// 3. Same-name folder conflict resolution: merge, rename, overwrite
		mockMvc.perform(post("/api/folder/create").cookie(admin).contentType(MediaType.APPLICATION_JSON)
						.content("{\"path\":\"reports\"}"))
				.andExpect(status().isOk());
		MockMultipartFile insideReport = new MockMultipartFile("file", "q1.txt", "text/plain", "q1".getBytes(StandardCharsets.UTF_8));
		mockMvc.perform(multipart("/api/upload").file(insideReport).param("directory", "reports").cookie(admin))
				.andExpect(status().isOk());

		// Rename strategy creates "reports (1)"
		mockMvc.perform(post("/api/folder/resolve-conflict").cookie(admin).contentType(MediaType.APPLICATION_JSON)
						.content("{\"parentPath\":\"\",\"folderName\":\"reports\",\"strategy\":\"rename\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.folderName").value("reports (1)"))
				.andExpect(jsonPath("$.targetPath").value("reports (1)"));

		// Merge strategy keeps "reports" and preserves existing q1.txt
		mockMvc.perform(post("/api/folder/resolve-conflict").cookie(admin).contentType(MediaType.APPLICATION_JSON)
						.content("{\"parentPath\":\"\",\"folderName\":\"reports\",\"strategy\":\"merge\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.folderName").value("reports"));
		mockMvc.perform(get("/api/files").param("path", "reports").cookie(admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.items.length()").value(1));

		// Overwrite strategy clears old "reports" and recreates empty "reports"
		mockMvc.perform(post("/api/folder/resolve-conflict").cookie(admin).contentType(MediaType.APPLICATION_JSON)
						.content("{\"parentPath\":\"\",\"folderName\":\"reports\",\"strategy\":\"overwrite\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.folderName").value("reports"));
		mockMvc.perform(get("/api/files").param("path", "reports").cookie(admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.items").isEmpty());

		// 4. Expanded media preview whitelist (.mkv, .opus, .avif)
		MockMultipartFile mkv = new MockMultipartFile("file", "clip.mkv", "video/x-matroska", new byte[]{1, 2, 3, 4});
		mockMvc.perform(multipart("/api/upload").file(mkv).cookie(admin)).andExpect(status().isOk());
		mockMvc.perform(get("/api/preview").param("path", "clip.mkv").cookie(admin))
				.andExpect(status().isOk())
				.andExpect(header().string(HttpHeaders.CONTENT_TYPE, containsString("video/x-matroska")));
	}

	private Cookie login(String username, String password) throws Exception {
		MvcResult result = mockMvc.perform(post("/api/login").param("username", username).param("password", password))
				.andExpect(status().isOk())
				.andReturn();
		return result.getResponse().getCookie("STOREIT_SESSION");
	}

	private static Path createTempRoot() {
		try {
			return Files.createTempDirectory("storeit-v2-");
		} catch (Exception e) {
			throw new ExceptionInInitializerError(e);
		}
	}
}

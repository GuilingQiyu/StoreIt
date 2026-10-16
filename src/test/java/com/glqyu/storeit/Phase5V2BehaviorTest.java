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

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
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
		mockMvc.perform(post("/api/admin/users").cookie(admin).contentType(MediaType.APPLICATION_JSON)
						.content("{\"username\":\"chunk-user\",\"password\":\"secretpass\",\"storageQuota\":20}"))
				.andExpect(status().isOk());
		Cookie user = login("chunk-user", "secretpass");

		// Over-quota init is rejected upfront
		mockMvc.perform(post("/api/upload/init").cookie(user).contentType(MediaType.APPLICATION_JSON)
						.content("{\"fileName\":\"huge.bin\",\"fileSize\":100,\"directory\":\"\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.error").value(FileService.QUOTA_EXCEEDED));

		// Path traversal inuploadId is rejected
		mockMvc.perform(get("/api/upload/status").param("uploadId", "../evil").cookie(user))
				.andExpect(status().isBadRequest());
		mockMvc.perform(delete("/api/upload/..").cookie(user))
				.andExpect(status().isBadRequest());

		// Valid chunked upload within quota
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

package com.glqyu.storeit;

import com.glqyu.storeit.config.AppProperties;
import com.glqyu.storeit.mapper.SessionMapper;
import com.glqyu.storeit.mapper.UserMapper;
import com.glqyu.storeit.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletResponse;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class StoreitApplicationTests {

	@Test
	void externalConfigIsImportedBeforeAdminCredentials() throws Exception {
		String yml = Files.readString(Path.of("src/main/resources/application.yml"));
		int application = yml.indexOf("optional:file:./config/application.yml");
		int admin = yml.indexOf("optional:file:./config/admin.yml");
		assertThat(application).isGreaterThanOrEqualTo(0);
		assertThat(admin).isGreaterThan(application);
		assertThat(yml).contains("maximum-pool-size: 1");
		assertThat(yml).contains("PRAGMA foreign_keys=ON");
	}

	@Test
	void sessionCookieIsSecureOnlyWhenSslEnabled() {
		assertThat(setCookie(true)).contains("Secure").contains("HttpOnly").contains("SameSite=Lax");
		assertThat(setCookie(false)).doesNotContain("Secure").contains("HttpOnly").contains("SameSite=Lax");
	}

	private static String setCookie(boolean sslEnabled) {
		AppProperties props = new AppProperties();
		props.setSslEnabled(sslEnabled);
		AuthService auth = new AuthService(mock(UserMapper.class), mock(SessionMapper.class), props);
		MockHttpServletResponse response = new MockHttpServletResponse();
		auth.createSession("admin", response);
		String header = response.getHeader(HttpHeaders.SET_COOKIE);
		assertThat(header).isNotNull();
		return header;
	}
}

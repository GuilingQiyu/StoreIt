package com.glqyu.storeit;

import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.zip.CRC32;

import static org.assertj.core.api.Assertions.assertThat;

class MigrationChecksumTest {

	@Test
	void publishedMigrationsKeepTheChecksumsAlreadyAppliedOnTheServer() throws Exception {
		assertThat(flywayChecksum("src/main/resources/db/migration/V1__init.sql")).isEqualTo(-936223812);
		assertThat(flywayChecksum("src/main/resources/db/migration/V2__multiuser_metadata.sql")).isEqualTo(-707259257);
		assertThat(flywayChecksum("src/main/resources/db/migration/V3__must_change_password.sql")).isEqualTo(596314564);
		assertThat(flywayChecksum("src/main/resources/db/migration/V4__user_enabled.sql")).isEqualTo(-164637318);
		assertThat(Files.exists(Path.of("src/main/resources/db/migration/V5__favorites.sql"))).isTrue();
		assertThat(Files.exists(Path.of("src/main/resources/db/migration/V3__favorites.sql"))).isFalse();
	}

	private static int flywayChecksum(String path) throws Exception {
		CRC32 crc32 = new CRC32();
		for (String line : Files.readString(Path.of(path)).split("\\R")) {
			crc32.update(line.getBytes(java.nio.charset.StandardCharsets.UTF_8));
		}
		return (int) crc32.getValue();
	}
}

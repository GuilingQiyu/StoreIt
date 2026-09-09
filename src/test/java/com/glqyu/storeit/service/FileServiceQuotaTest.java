package com.glqyu.storeit.service;

import com.glqyu.storeit.config.AppProperties;
import com.glqyu.storeit.mapper.FileMetadataMapper;
import com.glqyu.storeit.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class FileServiceQuotaTest {

    @Mock FileMetadataMapper metaMapper;
    @TempDir Path tempDir;
    AppProperties props;
    FileService fileService;

    @BeforeEach
    void setUp() {
        props = new AppProperties();
        props.setStorageRoot(tempDir.toString());
        fileService = new FileService(props, metaMapper);
    }

    private User user(String name, String role, long quota) {
        User u = new User();
        u.setId(1L);
        u.setUsername(name);
        u.setRole(role);
        u.setStorageQuota(quota);
        return u;
    }

    @Test
    void userUploadRejectedWhenExceedingQuota() throws Exception {
        User u = user("alice", "USER", 100);
        Path root = tempDir.resolve("alice");
        Files.createDirectories(root);
        Files.write(root.resolve("existing.bin"), new byte[80]);

        MockMultipartFile big = new MockMultipartFile("file", "more.bin", "application/octet-stream", new byte[50]);
        QuotaExceededException ex = assertThrows(QuotaExceededException.class,
                () -> fileService.saveFile(u, "", big));
        assertTrue(ex.getMessage().contains("配额"));
    }

    @Test
    void userUploadAllowedWithinQuota() throws Exception {
        User u = user("bob", "USER", 10_000);
        MockMultipartFile small = new MockMultipartFile("file", "ok.txt", "text/plain", "hello".getBytes());
        String saved = fileService.saveFile(u, "", small);
        assertEquals("ok.txt", saved);
        assertTrue(Files.exists(tempDir.resolve("bob").resolve("ok.txt")));
    }

    @Test
    void adminIgnoresUserQuota() throws Exception {
        User admin = user("admin", "ADMIN", 10); // tiny quota must not apply
        MockMultipartFile file = new MockMultipartFile("file", "a.bin", "application/octet-stream", new byte[200]);
        String saved = fileService.saveFile(admin, "", file);
        assertEquals("a.bin", saved);
    }

    @Test
    void unlimitedUserSkipsQuotaCheck() throws Exception {
        User u = user("carol", "USER", 0);
        MockMultipartFile file = new MockMultipartFile("file", "x.bin", "application/octet-stream", new byte[500]);
        assertDoesNotThrow(() -> fileService.saveFile(u, "", file));
    }

    @Test
    void createFolderRejectedWhenAlreadyOverQuota() throws Exception {
        User u = user("dave", "USER", 50);
        Path root = tempDir.resolve("dave");
        Files.createDirectories(root);
        Files.write(root.resolve("big.bin"), new byte[60]);
        assertThrows(QuotaExceededException.class, () -> fileService.createFolder(u, "newdir"));
    }
}

package com.glqyu.storeit.service;

import com.glqyu.storeit.mapper.FileShareMapper;
import com.glqyu.storeit.model.FileShare;
import com.glqyu.storeit.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShareServiceTest {

    @Mock FileShareMapper mapper;
    ShareService shareService;

    @BeforeEach
    void setUp() {
        shareService = new ShareService(mapper);
    }

    private User user(long id, String role) {
        User u = new User();
        u.setId(id);
        u.setUsername("u" + id);
        u.setRole(role);
        return u;
    }

    @Test
    void createShareSetsExpiryAndUnlimitedDownloads() {
        User u = user(1, "USER");
        when(mapper.insert(any())).thenReturn(1);

        FileShare s = shareService.createShare(u, "a.txt", 24, 0);
        ArgumentCaptor<FileShare> cap = ArgumentCaptor.forClass(FileShare.class);
        verify(mapper).insert(cap.capture());
        assertEquals("a.txt", cap.getValue().getFilePath());
        assertNotNull(cap.getValue().getExpiry());
        assertNull(cap.getValue().getMaxDownloads());
        assertNotNull(s.getToken());
    }

    @Test
    void revokeOwnerOkAdminOkOthersDenied() {
        FileShare share = new FileShare();
        share.setId(9L);
        share.setUserId(1L);
        when(mapper.findById(9L)).thenReturn(Optional.of(share));
        when(mapper.deleteById(9L)).thenReturn(1);

        assertTrue(shareService.revoke(user(1, "USER"), 9L));

        User other = user(2, "USER");
        assertThrows(SecurityException.class, () -> shareService.revoke(other, 9L));

        reset(mapper);
        when(mapper.findById(9L)).thenReturn(Optional.of(share));
        when(mapper.deleteById(9L)).thenReturn(1);
        assertTrue(shareService.revoke(user(99, "ADMIN"), 9L));
    }

    @Test
    void toViewReportsRemainingDownloads() {
        FileShare s = new FileShare();
        s.setId(1L);
        s.setToken("tok");
        s.setFilePath("x.bin");
        s.setMaxDownloads(5);
        s.setDownloads(2);
        s.setExpiry(null);
        Map<String, Object> v = shareService.toView(s);
        assertEquals(true, v.get("active"));
        assertEquals(3, v.get("remainingDownloads"));
        assertEquals("/d/tok", v.get("url"));
        assertEquals(1, shareService.toViewList(List.of(s)).size());
    }
}

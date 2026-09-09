package com.glqyu.storeit.service;

import com.glqyu.storeit.config.AppProperties;
import com.glqyu.storeit.mapper.SessionMapper;
import com.glqyu.storeit.mapper.UserMapper;
import com.glqyu.storeit.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCrypt;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceAdminTest {

    @Mock UserMapper userMapper;
    @Mock SessionMapper sessionMapper;
    AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userMapper, sessionMapper, new AppProperties());
    }

    @Test
    void createUserValidatesAndInserts() {
        when(userMapper.findByUsername("alice")).thenReturn(Optional.empty());
        when(userMapper.insert(any())).thenReturn(1);

        User created = authService.createUser("alice", "password123", 1024, "USER");
        ArgumentCaptor<User> cap = ArgumentCaptor.forClass(User.class);
        verify(userMapper).insert(cap.capture());
        assertEquals("alice", cap.getValue().getUsername());
        assertEquals("USER", cap.getValue().getRole());
        assertEquals(1024L, cap.getValue().getStorageQuota());
        assertTrue(cap.getValue().isEnabled());
        assertTrue(BCrypt.checkpw("password123", cap.getValue().getPasswordHash()));
        assertNotNull(created);
    }

    @Test
    void createUserRejectsWeakPasswordAndBadName() {
        assertThrows(IllegalArgumentException.class,
                () -> authService.createUser("ab", "password123", 0, "USER"));
        assertThrows(IllegalArgumentException.class,
                () -> authService.createUser("alice", AuthService.WEAK_DEFAULT_PASSWORD, 0, "USER"));
    }

    @Test
    void setEnabledFalseClearsSessions() {
        User u = new User();
        u.setUsername("bob");
        when(userMapper.findByUsername("bob")).thenReturn(Optional.of(u));
        authService.setEnabled("bob", false);
        verify(userMapper).updateEnabled("bob", false);
        verify(sessionMapper).deleteByUsername("bob");
    }

    @Test
    void setQuotaUpdates() {
        User u = new User();
        u.setUsername("bob");
        when(userMapper.findByUsername("bob")).thenReturn(Optional.of(u));
        authService.setQuota("bob", 999);
        verify(userMapper).updateQuota("bob", 999L);
    }
}

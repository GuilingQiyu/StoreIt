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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServicePasswordTest {

    @Mock UserMapper userMapper;
    @Mock SessionMapper sessionMapper;
    AppProperties props;
    AuthService authService;

    @BeforeEach
    void setUp() {
        props = new AppProperties();
        authService = new AuthService(userMapper, sessionMapper, props);
    }

    @Test
    void weakDefaultConstantMatchesDocumentedExample() {
        assertTrue(AuthService.isWeakDefaultPassword("authorized_users"));
        assertFalse(AuthService.isWeakDefaultPassword("strong-enough-pass"));
    }

    @Test
    void mustChangePasswordWhenFlagOrWeakHash() {
        User flagged = new User();
        flagged.setMustChangePassword(true);
        flagged.setPasswordHash(BCrypt.hashpw("already-changed", BCrypt.gensalt()));
        assertTrue(authService.mustChangePassword(flagged));

        User weak = new User();
        weak.setMustChangePassword(false);
        weak.setPasswordHash(BCrypt.hashpw(AuthService.WEAK_DEFAULT_PASSWORD, BCrypt.gensalt()));
        assertTrue(authService.mustChangePassword(weak));

        User ok = new User();
        ok.setMustChangePassword(false);
        ok.setPasswordHash(BCrypt.hashpw("secure-password-1", BCrypt.gensalt()));
        assertFalse(authService.mustChangePassword(ok));
    }

    @Test
    void changePasswordRejectsWeakAndClearsFlag() {
        User user = new User();
        user.setUsername("admin");
        user.setMustChangePassword(true);
        user.setPasswordHash(BCrypt.hashpw(AuthService.WEAK_DEFAULT_PASSWORD, BCrypt.gensalt()));

        assertThrows(IllegalArgumentException.class,
                () -> authService.changePassword(user, AuthService.WEAK_DEFAULT_PASSWORD, AuthService.WEAK_DEFAULT_PASSWORD));

        authService.changePassword(user, AuthService.WEAK_DEFAULT_PASSWORD, "brand-new-secret");
        verify(sessionMapper).deleteByUsername("admin");
        ArgumentCaptor<User> cap = ArgumentCaptor.forClass(User.class);
        verify(userMapper).updatePassword(cap.capture());
        assertFalse(cap.getValue().isMustChangePassword());
        assertTrue(BCrypt.checkpw("brand-new-secret", cap.getValue().getPasswordHash()));
        assertFalse(authService.mustChangePassword(cap.getValue()));
    }
}

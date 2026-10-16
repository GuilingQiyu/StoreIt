package com.glqyu.storeit.mapper;

import com.glqyu.storeit.model.User;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {
    @Select("SELECT id, username, password_hash as passwordHash, created_at as createdAt, role, storage_quota as storageQuota, must_change_password as mustChangePassword, enabled FROM users WHERE username = #{username}")
    Optional<User> findByUsername(String username);

    @Select("SELECT id, username, password_hash as passwordHash, created_at as createdAt, role, storage_quota as storageQuota, must_change_password as mustChangePassword, enabled FROM users WHERE id = #{id}")
    Optional<User> findById(Long id);

    @Insert("INSERT INTO users(username, password_hash, created_at, role, storage_quota, must_change_password, enabled) VALUES(#{username}, #{passwordHash}, #{createdAt}, #{role}, #{storageQuota}, #{mustChangePassword}, #{enabled})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Update("UPDATE users SET password_hash = #{passwordHash}, must_change_password = #{mustChangePassword} WHERE username = #{username}")
    int updatePassword(User user);

    @Update("UPDATE users SET role = #{role} WHERE username = #{username}")
    int updateRole(@Param("username") String username, @Param("role") String role);

    @Update("UPDATE users SET storage_quota = #{quota} WHERE username = #{username}")
    int updateQuota(@Param("username") String username, @Param("quota") long quota);

    @Update("UPDATE users SET enabled = #{enabled} WHERE username = #{username}")
    int updateEnabled(@Param("username") String username, @Param("enabled") boolean enabled);

    @Update("UPDATE users SET must_change_password = #{mustChangePassword} WHERE username = #{username}")
    int updateMustChangePassword(@Param("username") String username, @Param("mustChangePassword") boolean mustChangePassword);

    @Select("SELECT id, username, created_at as createdAt, role, storage_quota as storageQuota, must_change_password as mustChangePassword, enabled FROM users ORDER BY username")
    List<User> findAll();
}

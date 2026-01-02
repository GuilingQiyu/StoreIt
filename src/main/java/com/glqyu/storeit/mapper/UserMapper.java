package com.glqyu.storeit.mapper;

import com.glqyu.storeit.model.User;
import org.apache.ibatis.annotations.*;

import java.util.Optional;

@Mapper
public interface UserMapper {
    @Select("SELECT id, username, password_hash as passwordHash, created_at as createdAt, role, storage_quota as storageQuota FROM users WHERE username = #{username}")
    Optional<User> findByUsername(String username);

    @Select("SELECT id, username, password_hash as passwordHash, created_at as createdAt, role, storage_quota as storageQuota FROM users WHERE id = #{id}")
    Optional<User> findById(Long id);

    @Insert("INSERT INTO users(username, password_hash, created_at, role, storage_quota) VALUES(#{username}, #{passwordHash}, #{createdAt}, #{role}, #{storageQuota})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Update("UPDATE users SET password_hash = #{passwordHash} WHERE username = #{username}")
    int updatePassword(User user);
}

package com.glqyu.storeit.mapper;

import com.glqyu.storeit.model.User;
import org.apache.ibatis.annotations.*;

import java.util.Optional;

@Mapper
public interface UserMapper {
    @Select("SELECT id, username, password_hash as passwordHash, created_at as createdAt FROM users WHERE username = #{username}")
    Optional<User> findByUsername(String username);

    @Insert("INSERT INTO users(username, password_hash, created_at) VALUES(#{username}, #{passwordHash}, #{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Update("UPDATE users SET password_hash = #{passwordHash} WHERE username = #{username}")
    int updatePassword(User user);
}

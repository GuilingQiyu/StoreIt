package com.glqyu.storeit.mapper;

import com.glqyu.storeit.model.SessionRecord;
import org.apache.ibatis.annotations.*;

import java.util.Optional;

@Mapper
public interface SessionMapper {
    @Select("SELECT id, username, created_at as createdAt, expires_at as expiresAt FROM sessions WHERE id = #{id}")
    Optional<SessionRecord> findById(String id);

    @Insert("INSERT INTO sessions(id, username, created_at, expires_at) VALUES(#{id}, #{username}, #{createdAt}, #{expiresAt})")
    int insert(SessionRecord record);

    @Delete("DELETE FROM sessions WHERE id = #{id}")
    int deleteById(String id);

    @Delete("DELETE FROM sessions WHERE expires_at < #{now}")
    int deleteExpired(long now);
}

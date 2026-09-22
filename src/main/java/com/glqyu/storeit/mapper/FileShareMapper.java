package com.glqyu.storeit.mapper;

import com.glqyu.storeit.model.FileShare;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface FileShareMapper {
    @Select("SELECT id, file_path as filePath, token, expiry, max_downloads as maxDownloads, downloads, user_id as userId, created_at as createdAt FROM file_shares WHERE token = #{token}")
    Optional<FileShare> findByToken(String token);

    @Insert("INSERT INTO file_shares(file_path, token, expiry, max_downloads, downloads, user_id, created_at) VALUES(#{filePath}, #{token}, #{expiry}, #{maxDownloads}, #{downloads}, #{userId}, #{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(FileShare share);

    // 原子化消费一次下载：仅当未过期且未达上限时才自增，返回受影响行数（0 表示不可下载）
    @Update("UPDATE file_shares SET downloads = downloads + 1 "
            + "WHERE id = #{id} "
            + "AND (expiry IS NULL OR expiry >= #{now}) "
            + "AND (max_downloads IS NULL OR max_downloads <= 0 OR downloads < max_downloads)")
    int consumeDownload(@Param("id") long id, @Param("now") long now);

    @Delete("DELETE FROM file_shares WHERE (expiry IS NOT NULL AND expiry < #{now}) OR (max_downloads IS NOT NULL AND downloads >= max_downloads)")
    int deleteExpiredOrMaxed(long now);

    @Select("SELECT id, file_path as filePath, token, expiry, max_downloads as maxDownloads, downloads, user_id as userId, created_at as createdAt FROM file_shares WHERE user_id = #{userId} ORDER BY created_at DESC, id DESC")
    List<FileShare> findByUserId(long userId);

    @Delete("DELETE FROM file_shares WHERE id = #{id} AND user_id = #{userId}")
    int deleteByIdAndUser(@Param("id") long id, @Param("userId") long userId);

    @Update("UPDATE file_shares SET file_path = #{newPath} || SUBSTR(file_path, LENGTH(#{oldPath}) + 1) WHERE user_id = #{userId} AND (file_path = #{oldPath} OR file_path LIKE #{pattern})")
    int retarget(@Param("userId") long userId, @Param("oldPath") String oldPath, @Param("newPath") String newPath, @Param("pattern") String pattern);
}

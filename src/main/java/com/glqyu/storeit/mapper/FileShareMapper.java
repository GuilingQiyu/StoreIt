package com.glqyu.storeit.mapper;

import com.glqyu.storeit.model.FileShare;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface FileShareMapper {
    @Select("SELECT id, file_path as filePath, token, expiry, max_downloads as maxDownloads, "
            + "downloads, user_id as userId, created_at as createdAt FROM file_shares WHERE token = #{token}")
    Optional<FileShare> findByToken(String token);

    @Select("SELECT id, file_path as filePath, token, expiry, max_downloads as maxDownloads, "
            + "downloads, user_id as userId, created_at as createdAt FROM file_shares WHERE id = #{id}")
    Optional<FileShare> findById(long id);

    @Select("SELECT id, file_path as filePath, token, expiry, max_downloads as maxDownloads, "
            + "downloads, user_id as userId, created_at as createdAt FROM file_shares "
            + "WHERE user_id = #{userId} ORDER BY created_at DESC, id DESC")
    List<FileShare> findByUserId(long userId);

    @Select("SELECT id, file_path as filePath, token, expiry, max_downloads as maxDownloads, "
            + "downloads, user_id as userId, created_at as createdAt FROM file_shares "
            + "ORDER BY created_at DESC, id DESC")
    List<FileShare> findAll();

    @Insert("INSERT INTO file_shares(file_path, token, expiry, max_downloads, downloads, user_id, created_at) "
            + "VALUES(#{filePath}, #{token}, #{expiry}, #{maxDownloads}, #{downloads}, #{userId}, #{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(FileShare share);

    @Update("UPDATE file_shares SET downloads = downloads + 1 "
            + "WHERE id = #{id} "
            + "AND (expiry IS NULL OR expiry >= #{now}) "
            + "AND (max_downloads IS NULL OR max_downloads <= 0 OR downloads < max_downloads)")
    int consumeDownload(@Param("id") long id, @Param("now") long now);

    @Delete("DELETE FROM file_shares WHERE id = #{id}")
    int deleteById(long id);

    @Delete("DELETE FROM file_shares WHERE (expiry IS NOT NULL AND expiry < #{now}) OR (max_downloads IS NOT NULL AND downloads >= max_downloads)")
    int deleteExpiredOrMaxed(long now);
}

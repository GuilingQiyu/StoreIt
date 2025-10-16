package com.glqyu.storeit.mapper;

import com.glqyu.storeit.model.FileShare;
import org.apache.ibatis.annotations.*;

import java.util.Optional;

@Mapper
public interface FileShareMapper {
    @Select("SELECT id, file_path as filePath, token, expiry, max_downloads as maxDownloads, downloads FROM file_shares WHERE token = #{token}")
    Optional<FileShare> findByToken(String token);

    @Insert("INSERT INTO file_shares(file_path, token, expiry, max_downloads, downloads) VALUES(#{filePath}, #{token}, #{expiry}, #{maxDownloads}, #{downloads})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(FileShare share);

    @Update("UPDATE file_shares SET downloads = downloads + 1 WHERE id = #{id}")
    int incrementDownloads(long id);

    @Delete("DELETE FROM file_shares WHERE (expiry IS NOT NULL AND expiry < #{now}) OR (max_downloads IS NOT NULL AND downloads >= max_downloads)")
    int deleteExpiredOrMaxed(long now);
}

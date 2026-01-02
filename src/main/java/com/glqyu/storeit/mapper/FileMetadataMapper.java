package com.glqyu.storeit.mapper;

import com.glqyu.storeit.model.FileMetadata;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface FileMetadataMapper {
    @Select("SELECT id, user_id as userId, path, name, is_directory as isDirectory, size, last_modified as lastModified, content_type as contentType, parent_path as parentPath FROM file_metadata WHERE user_id = #{userId} AND parent_path = #{parentPath}")
    List<FileMetadata> findByUserIdAndParentPath(long userId, String parentPath);

    @Select("SELECT id, user_id as userId, path, name, is_directory as isDirectory, size, last_modified as lastModified, content_type as contentType, parent_path as parentPath FROM file_metadata WHERE user_id = #{userId} AND path = #{path}")
    Optional<FileMetadata> findByUserIdAndPath(long userId, String path);

    @Insert("INSERT INTO file_metadata(user_id, path, name, is_directory, size, last_modified, content_type, parent_path) VALUES(#{userId}, #{path}, #{name}, #{isDirectory}, #{size}, #{lastModified}, #{contentType}, #{parentPath})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(FileMetadata meta);

    @Update("UPDATE file_metadata SET size = #{size}, last_modified = #{lastModified}, content_type = #{contentType} WHERE id = #{id}")
    int update(FileMetadata meta);

    @Delete("DELETE FROM file_metadata WHERE user_id = #{userId} AND path = #{path}")
    int deleteByPath(long userId, String path);
    
    @Delete("DELETE FROM file_metadata WHERE user_id = #{userId} AND path LIKE #{pathPattern}")
    int deleteByPathPattern(long userId, String pathPattern);
}

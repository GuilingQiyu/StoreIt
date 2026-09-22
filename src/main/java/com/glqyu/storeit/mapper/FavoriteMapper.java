package com.glqyu.storeit.mapper;

import com.glqyu.storeit.model.Favorite;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.annotations.Delete;

import java.util.List;

@Mapper
public interface FavoriteMapper {
    @Select("SELECT id, user_id as userId, path, created_at as createdAt FROM favorites WHERE user_id = #{userId} ORDER BY created_at DESC, id DESC")
    List<Favorite> findByUserId(long userId);

    @Insert("INSERT OR IGNORE INTO favorites(user_id, path, created_at) VALUES(#{userId}, #{path}, #{createdAt})")
    int insert(Favorite favorite);

    @Delete("DELETE FROM favorites WHERE user_id = #{userId} AND path = #{path}")
    int deleteOne(@Param("userId") long userId, @Param("path") String path);

    @Delete("DELETE FROM favorites WHERE user_id = #{userId} AND (path = #{path} OR path LIKE #{pattern})")
    int deleteTree(@Param("userId") long userId, @Param("path") String path, @Param("pattern") String pattern);

    @Update("UPDATE favorites SET path = #{newPath} || SUBSTR(path, LENGTH(#{oldPath}) + 1) WHERE user_id = #{userId} AND (path = #{oldPath} OR path LIKE #{pattern})")
    int retarget(@Param("userId") long userId, @Param("oldPath") String oldPath, @Param("newPath") String newPath, @Param("pattern") String pattern);
}

package com.glqyu.storeit.mapper;

import com.glqyu.storeit.model.ShareMount;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ShareMountMapper {
    @Select("SELECT id, user_id as userId, mount_name as mountName, remote_server_url as remoteServerUrl, share_token as shareToken, access_password as accessPassword, permission, owner_name as ownerName, is_directory as directory, created_at as createdAt FROM share_mounts WHERE user_id = #{userId} ORDER BY created_at DESC, id DESC")
    List<ShareMount> findByUserId(long userId);

    @Select("SELECT id, user_id as userId, mount_name as mountName, remote_server_url as remoteServerUrl, share_token as shareToken, access_password as accessPassword, permission, owner_name as ownerName, is_directory as directory, created_at as createdAt FROM share_mounts WHERE id = #{id} AND user_id = #{userId}")
    Optional<ShareMount> findByIdAndUser(@Param("id") long id, @Param("userId") long userId);

    @Insert("INSERT INTO share_mounts(user_id, mount_name, remote_server_url, share_token, access_password, permission, owner_name, is_directory, created_at) VALUES(#{userId}, #{mountName}, #{remoteServerUrl}, #{shareToken}, #{accessPassword}, #{permission}, #{ownerName}, #{directory}, #{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ShareMount mount);

    @Delete("DELETE FROM share_mounts WHERE id = #{id} AND user_id = #{userId}")
    int deleteByIdAndUser(@Param("id") long id, @Param("userId") long userId);
}

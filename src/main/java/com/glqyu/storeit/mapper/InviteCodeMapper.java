package com.glqyu.storeit.mapper;

import com.glqyu.storeit.model.InviteCode;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface InviteCodeMapper {
    @Select("SELECT id, code, created_by as createdBy, max_uses as maxUses, used_count as usedCount, default_quota as defaultQuota, expires_at as expiresAt, revoked, note, created_at as createdAt FROM invite_codes WHERE code = #{code}")
    Optional<InviteCode> findByCode(String code);

    @Select("SELECT id, code, created_by as createdBy, max_uses as maxUses, used_count as usedCount, default_quota as defaultQuota, expires_at as expiresAt, revoked, note, created_at as createdAt FROM invite_codes ORDER BY created_at DESC, id DESC")
    List<InviteCode> findAll();

    @Insert("INSERT INTO invite_codes(code, created_by, max_uses, used_count, default_quota, expires_at, revoked, note, created_at) VALUES(#{code}, #{createdBy}, #{maxUses}, #{usedCount}, #{defaultQuota}, #{expiresAt}, #{revoked}, #{note}, #{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(InviteCode invite);

    @Update("UPDATE invite_codes SET used_count = used_count + 1 WHERE id = #{id} AND revoked = 0 AND (expires_at IS NULL OR expires_at >= #{now}) AND (max_uses IS NULL OR max_uses <= 0 OR used_count < max_uses)")
    int consumeInvite(@Param("id") long id, @Param("now") long now);

    @Delete("DELETE FROM invite_codes WHERE id = #{id}")
    int deleteById(long id);
}

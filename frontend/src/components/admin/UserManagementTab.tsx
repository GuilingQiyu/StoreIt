"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  UserPlus,
  Save,
  KeyRound,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Ticket,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { api } from "@/lib/api";
import { InviteCodeItem, User } from "@/types";
import { copyToClipboard, formatBytes, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/stores/useAuthStore";
import { useI18n } from "@/stores/useFileStore";

type QuotaUnit = "unlimited" | "MB" | "GB" | "TB";

const UNIT_MULTIPLIER: Record<Exclude<QuotaUnit, "unlimited">, number> = {
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
};

function bytesToUnitValue(bytes?: number): { value: number; unit: QuotaUnit } {
  if (!bytes || bytes <= 0) return { value: 10, unit: "unlimited" };
  if (bytes % UNIT_MULTIPLIER.TB === 0) return { value: bytes / UNIT_MULTIPLIER.TB, unit: "TB" };
  if (bytes % UNIT_MULTIPLIER.GB === 0) return { value: bytes / UNIT_MULTIPLIER.GB, unit: "GB" };
  return { value: Math.max(1, Math.round(bytes / UNIT_MULTIPLIER.MB)), unit: "MB" };
}

function unitValueToBytes(value: number, unit: QuotaUnit): number {
  if (unit === "unlimited") return 0;
  const num = Math.max(1, Number(value) || 1);
  return Math.round(num * UNIT_MULTIPLIER[unit]);
}

export function UserManagementTab() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const { locale, t } = useI18n();

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newQuotaVal, setNewQuotaVal] = useState(10);
  const [newQuotaUnit, setNewQuotaUnit] = useState<QuotaUnit>("unlimited");
  const [newMustChange, setNewMustChange] = useState(false);

  const [customInviteCode, setCustomInviteCode] = useState("");
  const [inviteMaxUses, setInviteMaxUses] = useState("1");
  const [inviteExpireHours, setInviteExpireHours] = useState("168");
  const [inviteQuotaVal, setInviteQuotaVal] = useState(10);
  const [inviteQuotaUnit, setInviteQuotaUnit] = useState<QuotaUnit>("GB");
  const [inviteNote, setInviteNote] = useState("");
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => api.getAdminUsers(),
  });

  const { data: invitesData, isLoading: loadingInvites, refetch: refetchInvites } = useQuery({
    queryKey: ["adminInvites"],
    queryFn: () => api.getAdminInvites(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: {
      username: string;
      password: string;
      storageQuota: number;
      mustChangePassword?: boolean;
    }) => api.createAdminUser(payload),
    onSuccess: () => {
      setFeedback({ text: t("用户创建成功", "User created successfully"), type: "success" });
      setNewUsername("");
      setNewPassword("");
      setNewQuotaVal(10);
      setNewQuotaUnit("unlimited");
      setNewMustChange(false);
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err: any) => {
      setFeedback({ text: err.message || t("创建用户失败", "Failed to create user"), type: "error" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      username,
      quota,
      role,
      enabled,
    }: {
      username: string;
      quota: number;
      role: string;
      enabled: boolean;
    }) => api.updateAdminUser(username, { storageQuota: quota, role, enabled }),
    onSuccess: () => {
      setFeedback({ text: t("用户属性已保存", "User attributes saved"), type: "success" });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err: any) => {
      setFeedback({ text: err.message || t("保存失败", "Failed to save"), type: "error" });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({
      username,
      password,
      mustChangePassword,
    }: {
      username: string;
      password: string;
      mustChangePassword?: boolean;
    }) => api.resetAdminUserPassword(username, password, mustChangePassword),
    onSuccess: () => {
      setFeedback({ text: t("用户口令已重置", "User password reset"), type: "success" });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err: any) => {
      setFeedback({ text: err.message || t("口令重置失败", "Failed to reset password"), type: "error" });
    },
  });

  const createInviteMutation = useMutation({
    mutationFn: () => {
      const quotaBytes = unitValueToBytes(inviteQuotaVal, inviteQuotaUnit);
      return api.createAdminInvite({
        code: customInviteCode.trim() || undefined,
        maxUses: parseInt(inviteMaxUses, 10) || 0,
        expireHours: parseInt(inviteExpireHours, 10),
        defaultQuota: quotaBytes,
        note: inviteNote.trim(),
      });
    },
    onSuccess: (res) => {
      setFeedback({
        text: t(`邀请码 ${res.data.code} 已生成`, `Invite code ${res.data.code} generated`),
        type: "success",
      });
      setCustomInviteCode("");
      setInviteNote("");
      queryClient.invalidateQueries({ queryKey: ["adminInvites"] });
    },
    onError: (err: any) => {
      setFeedback({
        text: err.message || t("生成邀请码失败", "Failed to generate invite code"),
        type: "error",
      });
    },
  });

  const deleteInviteMutation = useMutation({
    mutationFn: (id: number) => api.deleteAdminInvite(id),
    onSuccess: () => {
      setFeedback({ text: t("邀请码已删除", "Invite code deleted"), type: "success" });
      queryClient.invalidateQueries({ queryKey: ["adminInvites"] });
    },
    onError: (err: any) => {
      setFeedback({
        text: err.message || t("删除邀请码失败", "Failed to delete invite code"),
        type: "error",
      });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || newPassword.length < 8) {
      setFeedback({
        text: t("用户名不能为空，口令至少 8 位", "Username is required and password must be at least 8 characters"),
        type: "error",
      });
      return;
    }
    const bytes = unitValueToBytes(newQuotaVal, newQuotaUnit);
    createMutation.mutate({
      username: newUsername.trim(),
      password: newPassword,
      storageQuota: bytes,
      mustChangePassword: newMustChange,
    });
  };

  const handleCopyInvite = async (key: string, text: string) => {
    if (await copyToClipboard(text)) {
      setCopiedInviteId(key);
      setTimeout(() => setCopiedInviteId(null), 1800);
    }
  };

  const users = data || [];
  const invites: InviteCodeItem[] = invitesData || [];
  const computedNewBytes = unitValueToBytes(newQuotaVal, newQuotaUnit);
  const computedInviteBytes = unitValueToBytes(inviteQuotaVal, inviteQuotaUnit);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-primary flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-secondary" />
            {t("系统用户与受邀注册管理", "User & Invited Registration Management")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t(
              "管理用户配额与状态、生成自助注册邀请码或重置用户口令",
              "Manage user storage quotas & status, generate invitation codes, or reset passwords"
            )}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            refetch();
            refetchInvites();
          }}
          className="gap-1.5"
        >
          <RefreshCw className="w-4 h-4" /> {t("刷新", "Refresh")}
        </Button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl flex items-center gap-2.5 text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Invite Codes Management Card */}
      <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-semibold text-brand-primary flex items-center gap-2">
              <Ticket className="w-4 h-4 text-brand-secondary" />
              {t("自主受邀注册 · 邀请码生成与管理", "Invited Registration · Invitation Codes")}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t(
                "生成邀请码或专属注册直链，新用户可在登录页切换至“受邀注册”自助开户并自动分配预设配额",
                "Generate invite codes or direct registration links so new users can sign up with preset storage quotas"
              )}
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            createInviteMutation.mutate();
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
        >
          <div className="sm:col-span-3">
            <label className="text-xs font-medium text-foreground block mb-1">
              {t("自定义邀请码 (留空随机生成)", "Custom Code (blank = random)")}
            </label>
            <Input
              value={customInviteCode}
              onChange={(e) => setCustomInviteCode(e.target.value)}
              placeholder={t("如 ST-TEAM-2026", "e.g. ST-TEAM-2026")}
              className="font-mono text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-foreground block mb-1">
              {t("可用次数", "Max Uses")}
            </label>
            <select
              value={inviteMaxUses}
              onChange={(e) => setInviteMaxUses(e.target.value)}
              className="w-full h-9 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="1">{t("1 次 (单人专属)", "1 use (Single)")}</option>
              <option value="5">{t("5 次", "5 uses")}</option>
              <option value="10">{t("10 次", "10 uses")}</option>
              <option value="50">{t("50 次", "50 uses")}</option>
              <option value="0">{t("不限次数", "Unlimited")}</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-foreground block mb-1">
              {t("有效期", "Expiration")}
            </label>
            <select
              value={inviteExpireHours}
              onChange={(e) => setInviteExpireHours(e.target.value)}
              className="w-full h-9 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="24">{t("1 天", "1 Day")}</option>
              <option value="168">{t("7 天", "7 Days")}</option>
              <option value="720">{t("30 天", "30 Days")}</option>
              <option value="-1">{t("永久有效", "Never Expire")}</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="text-xs font-medium text-foreground block mb-1">
              {t("注册初始配额", "Default Quota")} (
              {computedInviteBytes === 0 ? t("不限额", "Unlimited") : formatBytes(computedInviteBytes)})
            </label>
            <div className="flex gap-1">
              {inviteQuotaUnit !== "unlimited" && (
                <Input
                  type="number"
                  min="1"
                  value={inviteQuotaVal}
                  onChange={(e) => setInviteQuotaVal(Math.max(1, Number(e.target.value)))}
                  className="w-16 text-xs"
                />
              )}
              <select
                value={inviteQuotaUnit}
                onChange={(e) => setInviteQuotaUnit(e.target.value as QuotaUnit)}
                className="flex-1 h-9 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="unlimited">{t("不限额", "Unlimited")}</option>
                <option value="MB">MB</option>
                <option value="GB">GB</option>
                <option value="TB">TB</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={createInviteMutation.isPending} className="w-full gap-1.5">
              <Ticket className="w-4 h-4" /> {t("生成邀请码", "Generate")}
            </Button>
          </div>

          <div className="sm:col-span-12">
            <Input
              value={inviteNote}
              onChange={(e) => setInviteNote(e.target.value)}
              placeholder={t(
                "可选备注说明（例如：研发组新成员邀请、活动临时账号等）",
                "Optional note (e.g. R&D team onboarding, guest account, etc.)"
              )}
              className="h-8 text-xs"
            />
          </div>
        </form>

        {loadingInvites ? (
          <div className="py-4 text-center text-xs text-muted-foreground">
            {t("正在加载邀请码...", "Loading invitation codes...")}
          </div>
        ) : invites.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
            {t(
              "暂无邀请码，点击上方“生成邀请码”即可创建受邀注册凭证",
              "No invitation codes yet. Click 'Generate' above to create one."
            )}
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b bg-muted/40 text-muted-foreground">
                  <th className="py-2 px-3 font-semibold">{t("邀请码", "Code")}</th>
                  <th className="py-2 px-3 font-semibold">{t("已用 / 上限", "Used / Max")}</th>
                  <th className="py-2 px-3 font-semibold">{t("预设配额", "Default Quota")}</th>
                  <th className="py-2 px-3 font-semibold">{t("有效期至", "Expires")}</th>
                  <th className="py-2 px-3 font-semibold">{t("备注", "Note")}</th>
                  <th className="py-2 px-3 font-semibold text-right">{t("操作", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invites.map((inv) => {
                  const registerLink =
                    typeof window !== "undefined"
                      ? `${window.location.origin}/login?invite=${encodeURIComponent(inv.code)}`
                      : `/login?invite=${encodeURIComponent(inv.code)}`;
                  const maxedOut = inv.maxUses > 0 && inv.usedCount >= inv.maxUses;
                  const expired = Boolean(inv.expiresAt && inv.expiresAt * 1000 < Date.now());
                  return (
                    <tr key={inv.id} className="hover:bg-muted/20">
                      <td className="py-2.5 px-3 font-mono font-bold text-brand-primary">
                        {inv.code}
                        {(maxedOut || expired) && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 text-[10px] font-sans">
                            {expired ? t("已过期", "Expired") : t("已用尽", "Used Up")}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {inv.usedCount} / {inv.maxUses <= 0 ? t("不限", "∞") : inv.maxUses}
                      </td>
                      <td className="py-2.5 px-3">
                        {inv.defaultQuota <= 0
                          ? t("不限额", "Unlimited")
                          : formatBytes(inv.defaultQuota)}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {inv.expiresAt ? formatDate(inv.expiresAt, locale) : t("永久有效", "Never")}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground max-w-[160px] truncate">
                        {inv.note || "--"}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs gap-1"
                          onClick={() => handleCopyInvite(`code_${inv.id}`, inv.code)}
                        >
                          {copiedInviteId === `code_${inv.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" /> {t("已复制", "Copied")}
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> {t("复制码", "Copy Code")}
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs gap-1"
                          onClick={() => handleCopyInvite(`link_${inv.id}`, registerLink)}
                        >
                          {copiedInviteId === `link_${inv.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              {t("已复制直链", "Copied Link")}
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> {t("注册直链", "Invite Link")}
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                          onClick={() => deleteInviteMutation.mutate(inv.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create user form */}
      <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-brand-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-brand-secondary" />
          {t("管理员手动新增用户", "Create User Manually")}
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-3">
            <label className="text-xs font-medium text-foreground block mb-1">
              {t("用户名", "Username")}
            </label>
            <Input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={t("字母/数字/下划线", "Letters, digits, _")}
              required
            />
          </div>
          <div className="sm:col-span-3">
            <label className="text-xs font-medium text-foreground block mb-1">
              {t("初始口令 (≥8位)", "Initial Password (≥ 8 chars)")}
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("至少 8 位字符", "At least 8 characters")}
              required
            />
          </div>
          <div className="sm:col-span-4">
            <label className="text-xs font-medium text-foreground block mb-1">
              {t("存储配额", "Storage Quota")} (
              {computedNewBytes === 0 ? t("不限额", "Unlimited") : formatBytes(computedNewBytes)})
            </label>
            <div className="flex gap-1.5">
              {newQuotaUnit !== "unlimited" && (
                <Input
                  type="number"
                  min="1"
                  value={newQuotaVal}
                  onChange={(e) => setNewQuotaVal(Math.max(1, Number(e.target.value)))}
                  className="w-24"
                />
              )}
              <select
                value={newQuotaUnit}
                onChange={(e) => setNewQuotaUnit(e.target.value as QuotaUnit)}
                className="flex-1 h-9 rounded-lg border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="unlimited">{t("不限额 (Unlimited)", "Unlimited")}</option>
                <option value="MB">MB</option>
                <option value="GB">GB</option>
                <option value="TB">TB</option>
              </select>
            </div>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={createMutation.isPending} className="w-full gap-1.5">
              <UserPlus className="w-4 h-4" /> {t("开户", "Create")}
            </Button>
          </div>
          <div className="sm:col-span-12 flex items-center gap-2 pt-1 text-xs text-muted-foreground">
            <input
              id="new-must-change"
              type="checkbox"
              checked={newMustChange}
              onChange={(e) => setNewMustChange(e.target.checked)}
              className="rounded border-input"
            />
            <label htmlFor="new-must-change" className="cursor-pointer select-none">
              {t(
                "要求该用户首次登录后立即修改初始口令",
                "Require this user to change their initial password upon first login"
              )}
            </label>
          </div>
        </form>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-base font-semibold text-brand-primary">
            {t(`用户列表 (${users.length})`, `Users (${users.length})`)}
          </h3>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-brand-secondary" />
            {t("加载中...", "Loading...")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
                  <th className="py-2.5 px-4 font-semibold">{t("用户名", "Username")}</th>
                  <th className="py-2.5 px-4 font-semibold">{t("存储配额", "Quota")}</th>
                  <th className="py-2.5 px-4 font-semibold">{t("角色", "Role")}</th>
                  <th className="py-2.5 px-4 font-semibold">{t("账号状态", "Status")}</th>
                  <th className="py-2.5 px-4 font-semibold text-center">{t("保存属性", "Save")}</th>
                  <th className="py-2.5 px-4 font-semibold">{t("重置口令", "Reset Password")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <UserRow
                    key={u.username}
                    user={u}
                    isCurrent={u.username === currentUser?.username}
                    onSave={(quota, role, enabled) =>
                      updateMutation.mutate({ username: u.username, quota, role, enabled })
                    }
                    onResetPassword={(pwd, mustChange) =>
                      resetPasswordMutation.mutate({
                        username: u.username,
                        password: pwd,
                        mustChangePassword: mustChange,
                      })
                    }
                    onError={(msg) => setFeedback({ text: msg, type: "error" })}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function UserRow({
  user,
  isCurrent,
  onSave,
  onResetPassword,
  onError,
}: {
  user: User;
  isCurrent: boolean;
  onSave: (quota: number, role: string, enabled: boolean) => void;
  onResetPassword: (pwd: string, mustChange: boolean) => void;
  onError: (msg: string) => void;
}) {
  const initial = bytesToUnitValue(user.storageQuota);
  const [quotaVal, setQuotaVal] = useState(initial.value);
  const [quotaUnit, setQuotaUnit] = useState<QuotaUnit>(initial.unit);
  const [role, setRole] = useState(user.role || "USER");
  const [enabled, setEnabled] = useState(user.enabled !== false);
  const [newPwd, setNewPwd] = useState("");
  const [mustChange, setMustChange] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const parsed = bytesToUnitValue(user.storageQuota);
    setQuotaVal(parsed.value);
    setQuotaUnit(parsed.unit);
    setRole(user.role || "USER");
    setEnabled(user.enabled !== false);
  }, [user.storageQuota, user.role, user.enabled]);

  const bytes = unitValueToBytes(quotaVal, quotaUnit);

  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="py-3 px-4 font-semibold text-brand-primary whitespace-nowrap">
        <div>
          {user.username}
          {isCurrent && (
            <span className="ml-1.5 text-xs text-brand-secondary">
              ({t("当前登录", "You")})
            </span>
          )}
        </div>
        {user.mustChangePassword && (
          <span className="text-[10px] text-amber-600 font-normal block">
            {t("待改初始密码", "Must change password")}
          </span>
        )}
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5">
          {quotaUnit !== "unlimited" && (
            <Input
              type="number"
              min="1"
              value={quotaVal}
              onChange={(e) => setQuotaVal(Math.max(1, Number(e.target.value)))}
              className="w-20 h-8 text-xs font-mono"
            />
          )}
          <select
            value={quotaUnit}
            onChange={(e) => setQuotaUnit(e.target.value as QuotaUnit)}
            className="h-8 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="unlimited">{t("不限额", "Unlimited")}</option>
            <option value="MB">MB</option>
            <option value="GB">GB</option>
            <option value="TB">TB</option>
          </select>
        </div>
      </td>

      <td className="py-3 px-4">
        <select
          value={role}
          disabled={isCurrent}
          onChange={(e) => setRole(e.target.value)}
          className="h-8 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </td>

      <td className="py-3 px-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Switch
            checked={enabled}
            disabled={isCurrent}
            onCheckedChange={setEnabled}
          />
          <span className={`text-xs ${enabled ? "text-emerald-600 font-medium" : "text-destructive"}`}>
            {enabled ? t("正常", "Active") : t("已禁用", "Disabled")}
          </span>
        </div>
      </td>

      <td className="py-3 px-4 text-center">
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2.5 text-xs gap-1"
          onClick={() => onSave(bytes, role, enabled)}
        >
          <Save className="w-3.5 h-3.5" /> {t("保存", "Save")}
        </Button>
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Input
            type="password"
            placeholder={t("新口令 (≥8位)", "New pwd (≥8)")}
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            className="w-28 h-8 text-xs"
          />
          <label className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap cursor-pointer select-none">
            <input
              type="checkbox"
              checked={mustChange}
              onChange={(e) => setMustChange(e.target.checked)}
              className="rounded border-input"
            />
            {t("需改密", "Force change")}
          </label>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2.5 text-xs gap-1 shrink-0"
            onClick={() => {
              if (newPwd.length < 8) {
                onError(t("口令至少 8 位", "Password must be at least 8 characters"));
                return;
              }
              onResetPassword(newPwd, mustChange);
              setNewPwd("");
              setMustChange(false);
            }}
          >
            <KeyRound className="w-3.5 h-3.5" /> {t("重置", "Reset")}
          </Button>
        </div>
      </td>
    </tr>
  );
}

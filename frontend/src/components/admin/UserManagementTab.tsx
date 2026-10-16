"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, UserPlus, Save, KeyRound, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { User } from "@/types";
import { formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/stores/useAuthStore";

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

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newQuotaVal, setNewQuotaVal] = useState(10);
  const [newQuotaUnit, setNewQuotaUnit] = useState<QuotaUnit>("unlimited");
  const [newMustChange, setNewMustChange] = useState(false);

  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => api.getAdminUsers(),
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      username: string;
      password: string;
      storageQuota: number;
      mustChangePassword?: boolean;
    }) => api.createAdminUser(data),
    onSuccess: () => {
      setFeedback({ text: "用户创建成功", type: "success" });
      setNewUsername("");
      setNewPassword("");
      setNewQuotaVal(10);
      setNewQuotaUnit("unlimited");
      setNewMustChange(false);
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err: any) => {
      setFeedback({ text: err.message || "创建用户失败", type: "error" });
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
      setFeedback({ text: "用户属性已保存", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err: any) => {
      setFeedback({ text: err.message || "保存失败", type: "error" });
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
      setFeedback({ text: "用户口令已重置", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err: any) => {
      setFeedback({ text: err.message || "口令重置失败", type: "error" });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || newPassword.length < 8) {
      setFeedback({ text: "用户名不能为空，口令至少 8 位", type: "error" });
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

  const users = data || [];
  const computedNewBytes = unitValueToBytes(newQuotaVal, newQuotaUnit);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-primary flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-secondary" />
            系统用户管理
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            添加新用户、按 MB/GB/TB 单位设置存储配额、启用/禁用账号或重置登录口令
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RefreshCw className="w-4 h-4" /> 刷新
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

      {/* Create user form */}
      <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-brand-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-brand-secondary" />
          新增系统用户
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-3">
            <label className="text-xs font-medium text-foreground block mb-1">用户名</label>
            <Input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="字母/数字/下划线"
              required
            />
          </div>
          <div className="sm:col-span-3">
            <label className="text-xs font-medium text-foreground block mb-1">初始口令 (≥8位)</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="至少 8 位字符"
              required
            />
          </div>
          <div className="sm:col-span-4">
            <label className="text-xs font-medium text-foreground block mb-1">
              存储配额 ({computedNewBytes === 0 ? "不限额" : formatBytes(computedNewBytes)})
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
                <option value="unlimited">不限额 (Unlimited)</option>
                <option value="MB">MB (兆字节)</option>
                <option value="GB">GB (吉字节)</option>
                <option value="TB">TB (太字节)</option>
              </select>
            </div>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={createMutation.isPending} className="w-full gap-1.5">
              <UserPlus className="w-4 h-4" /> 开户
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
              要求该用户首次登录后立即修改初始口令
            </label>
          </div>
        </form>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-base font-semibold text-brand-primary">用户列表 ({users.length})</h3>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-brand-secondary" /> 加载中...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
                  <th className="py-2.5 px-4 font-semibold">用户名</th>
                  <th className="py-2.5 px-4 font-semibold">存储配额</th>
                  <th className="py-2.5 px-4 font-semibold">角色</th>
                  <th className="py-2.5 px-4 font-semibold">账号状态</th>
                  <th className="py-2.5 px-4 font-semibold text-center">保存属性</th>
                  <th className="py-2.5 px-4 font-semibold">重置口令</th>
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
          {isCurrent && <span className="ml-1.5 text-xs text-brand-secondary">(当前登录)</span>}
        </div>
        {user.mustChangePassword && (
          <span className="text-[10px] text-amber-600 font-normal block">待改初始密码</span>
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
            <option value="unlimited">不限额</option>
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
            {enabled ? "正常" : "已禁用"}
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
          <Save className="w-3.5 h-3.5" /> 保存
        </Button>
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Input
            type="password"
            placeholder="新口令 (≥8位)"
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
            需改密
          </label>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2.5 text-xs gap-1 shrink-0"
            onClick={() => {
              if (newPwd.length < 8) {
                onError("口令至少 8 位");
                return;
              }
              onResetPassword(newPwd, mustChange);
              setNewPwd("");
              setMustChange(false);
            }}
          >
            <KeyRound className="w-3.5 h-3.5" /> 重置
          </Button>
        </div>
      </td>
    </tr>
  );
}

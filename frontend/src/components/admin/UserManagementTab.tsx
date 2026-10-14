"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, UserPlus, Save, KeyRound, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { User } from "@/types";
import { formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";

export function UserManagementTab() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);

  // New User form
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newQuota, setNewQuota] = useState(0);

  // Status message
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => api.getAdminUsers(),
  });

  const createMutation = useMutation({
    mutationFn: (data: { username: string; password: string; storageQuota: number }) =>
      api.createAdminUser(data),
    onSuccess: () => {
      setFeedback({ text: "用户创建成功", type: "success" });
      setNewUsername("");
      setNewPassword("");
      setNewQuota(0);
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err: any) => {
      setFeedback({ text: err.message || "创建用户失败", type: "error" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ username, quota, role }: { username: string; quota: number; role: string }) =>
      api.updateAdminUser(username, { storageQuota: quota, role }),
    onSuccess: () => {
      setFeedback({ text: "用户属性已保存", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err: any) => {
      setFeedback({ text: err.message || "保存失败", type: "error" });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      api.resetAdminUserPassword(username, password),
    onSuccess: () => {
      setFeedback({ text: "用户口令已重置", type: "success" });
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
    createMutation.mutate({
      username: newUsername.trim(),
      password: newPassword,
      storageQuota: Number(newQuota) || 0,
    });
  };

  const users = data || [];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-primary flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-secondary" />
            系统用户管理
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            添加新用户、调整存储配额 (Quota)、分配角色或重置登录口令
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
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">用户名</label>
            <Input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="字母/数字/下划线"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">初始口令 (≥8位)</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="至少 8 位字符"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              存储配额 ({newQuota === 0 ? "不限额" : formatBytes(newQuota)})
            </label>
            <Input
              type="number"
              min="0"
              value={newQuota}
              onChange={(e) => setNewQuota(Number(e.target.value))}
              placeholder="0 表示不限额"
            />
          </div>
          <div>
            <Button type="submit" disabled={createMutation.isPending} className="w-full gap-1.5">
              <UserPlus className="w-4 h-4" /> 开户
            </Button>
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
                  <th className="py-2.5 px-4 font-semibold">存储配额 (字节)</th>
                  <th className="py-2.5 px-4 font-semibold">角色</th>
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
                    onSave={(quota, role) =>
                      updateMutation.mutate({ username: u.username, quota, role })
                    }
                    onResetPassword={(pwd) =>
                      resetPasswordMutation.mutate({ username: u.username, password: pwd })
                    }
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
}: {
  user: User;
  isCurrent: boolean;
  onSave: (quota: number, role: string) => void;
  onResetPassword: (pwd: string) => void;
}) {
  const [quota, setQuota] = useState(user.storageQuota || 0);
  const [role, setRole] = useState(user.role || "USER");
  const [newPwd, setNewPwd] = useState("");

  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="py-3 px-4 font-semibold text-brand-primary">
        {user.username}
        {isCurrent && <span className="ml-1.5 text-xs text-brand-secondary">(当前登录)</span>}
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            value={quota}
            onChange={(e) => setQuota(Number(e.target.value))}
            className="w-28 h-8 text-xs font-mono"
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {quota === 0 ? "不限额" : formatBytes(quota)}
          </span>
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

      <td className="py-3 px-4 text-center">
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2.5 text-xs gap-1"
          onClick={() => onSave(quota, role)}
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
            className="w-32 h-8 text-xs"
          />
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2.5 text-xs gap-1 shrink-0"
            onClick={() => {
              if (newPwd.length < 8) {
                alert("口令至少 8 位");
                return;
              }
              onResetPassword(newPwd);
              setNewPwd("");
            }}
          >
            <KeyRound className="w-3.5 h-3.5" /> 重置
          </Button>
        </div>
      </td>
    </tr>
  );
}

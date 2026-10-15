"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HardDrive, Lock, User as UserIcon, AlertCircle, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { login, checkAuth, isAuthenticated, isLoading } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkAuth().then((loggedIn) => {
      if (loggedIn) {
        router.push("/");
      }
    });
  }, [checkAuth, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("username", username.trim());
      fd.append("password", password);
      await login(fd);
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "登录失败，请检查账号与密码");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f2e9e4] via-[#e9dfe1] to-[#c9ada7]/40 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-brand-accent/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white mx-auto flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <HardDrive className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-primary pt-2">
            登录 储之 StoreIt
          </h1>
          <p className="text-xs text-muted-foreground">
            轻量级文件存储与分享服务
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground/80 block">
              用户名
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                required
                autoFocus
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9 h-10 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground/80 block">
              登录口令
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                required
                placeholder="请输入口令"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-10 rounded-xl text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 rounded-xl gap-2 font-semibold shadow-md mt-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:opacity-95"
          >
            {isSubmitting ? "正在验证..." : "登录系统"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="text-center pt-2 space-y-1">
          <p className="text-[11px] text-muted-foreground">
            © 2025–2026 归灵祈昱 · 基于{" "}
            <a
              href="https://www.gnu.org/licenses/agpl-3.0.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline font-medium"
            >
              GNU AGPL-3.0
            </a>{" "}
            开源协议发布
          </p>
          <p className="text-[11px] text-muted-foreground">
            <a
              href="https://github.com/GuilingQiyu/StoreIt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline inline-flex items-center gap-1 font-medium"
            >
              查看源码 (GitHub: GuilingQiyu/StoreIt)
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

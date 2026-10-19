"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HardDrive,
  Lock,
  User as UserIcon,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Ticket,
  Palette,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { api } from "@/lib/api";
import { THEME_OPTIONS, applyThemeToDom, getSavedTheme } from "@/lib/utils";
import { ThemeMode } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { login, checkAuth } = useAuthStore();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("classic");

  useEffect(() => {
    const saved = getSavedTheme();
    setTheme(saved);
    applyThemeToDom(saved);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get("invite") || params.get("code");
      if (codeParam) {
        setInviteCode(codeParam.trim());
        setMode("register");
      } else if (window.location.hash === "#register") {
        setMode("register");
      }
    }

    checkAuth().then((loggedIn) => {
      if (loggedIn) {
        router.push("/");
      }
    });
  }, [checkAuth, router]);

  const cycleTheme = () => {
    const idx = THEME_OPTIONS.findIndex((t) => t.key === theme);
    const next = THEME_OPTIONS[(idx + 1) % THEME_OPTIONS.length].key;
    setTheme(next);
    applyThemeToDom(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const fd = new FormData();
        fd.append("username", username.trim());
        fd.append("password", password);
        await login(fd);
        router.push("/");
      } else {
        if (password.length < 8) {
          throw new Error("口令至少需要 8 位字符");
        }
        if (password !== confirmPassword) {
          throw new Error("两次输入的口令不一致");
        }
        if (!inviteCode.trim()) {
          throw new Error("请输入管理员发放的邀请码");
        }
        await api.register(username.trim(), password, inviteCode.trim());
        setSuccessMsg("注册成功！正在进入储之工作台...");
        await checkAuth();
        router.push("/");
      }
    } catch (err: any) {
      setErrorMsg(
        err.message || (mode === "login" ? "登录失败，请检查账号与口令" : "注册失败，请检查邀请码")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentThemeMeta = THEME_OPTIONS.find((t) => t.key === theme) || THEME_OPTIONS[0];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-bg relative overflow-hidden transition-colors duration-300">
      {/* Top-right Theme Switcher */}
      <button
        type="button"
        onClick={cycleTheme}
        className="fixed top-5 right-5 z-30 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border shadow-sm text-xs font-medium text-foreground hover:bg-white transition-all"
        title="点击切换界面主题色"
      >
        <Palette className="w-3.5 h-3.5 text-brand-primary" />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: currentThemeMeta.swatch }}
        />
        <span>{currentThemeMeta.label}</span>
      </button>

      {/* Decorative background shapes */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-brand-accent/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 relative z-10 space-y-6 storeit-modal-spring">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white mx-auto flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <HardDrive className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-primary pt-2">
            储之 StoreIt
          </h1>
          <p className="text-xs text-muted-foreground">
            轻量级文件存储与跨服联邦共享服务
          </p>
        </div>

        {/* Mode Switch Tabs: 登录系统 / 受邀注册 */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-muted/60 border text-xs font-semibold select-none">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg("");
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === "login"
                ? "bg-white text-brand-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            账号登录
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg("");
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === "register"
                ? "bg-white text-brand-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            受邀注册
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/80 block">
                注册邀请码
              </label>
              <div className="relative">
                <Ticket className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" />
                <Input
                  type="text"
                  required
                  placeholder="请输入邀请码 (如 ST-XXXX-XXXX)"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="pl-9 h-10 rounded-xl text-sm font-mono"
                />
              </div>
            </div>
          )}

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
                placeholder={mode === "register" ? "3~32位字母/数字/下划线" : "请输入用户名"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9 h-10 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground/80 block">
              {mode === "register" ? "设置登录口令 (≥8位)" : "登录口令"}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                required
                placeholder={mode === "register" ? "至少 8 位字符" : "请输入口令"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-10 rounded-xl text-sm"
              />
            </div>
          </div>

          {mode === "register" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/80 block">
                确认登录口令
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  required
                  placeholder="再次输入登录口令"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 h-10 rounded-xl text-sm"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 rounded-xl gap-2 font-semibold shadow-md mt-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:opacity-95"
          >
            {isSubmitting
              ? "正在处理..."
              : mode === "login"
              ? "登录系统"
              : "验证邀请码并注册"}
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

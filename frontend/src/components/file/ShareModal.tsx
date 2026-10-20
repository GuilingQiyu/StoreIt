"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Share2, Copy, Check, Folder, FileText, ShieldCheck, Globe, Lock } from "lucide-react";
import { api } from "@/lib/api";
import { SharePermission } from "@/types";
import { useFileStore } from "@/stores/useFileStore";
import { copyToClipboard } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ShareModal() {
  const item = useFileStore((s) => s.shareModalFile);
  const setShareModalFile = useFileStore((s) => s.setShareModalFile);
  const openSharedSpace = useFileStore((s) => s.openSharedSpace);
  const showToast = useFileStore((s) => s.showToast);
  const queryClient = useQueryClient();

  const [permission, setPermission] = useState<SharePermission>("READ");
  const [accessPassword, setAccessPassword] = useState("");
  const [title, setTitle] = useState("");
  const [expireHours, setExpireHours] = useState("168");
  const [customHours, setCustomHours] = useState("");
  const [maxDownloads, setMaxDownloads] = useState("");
  const [generatedData, setGeneratedData] = useState<{
    token: string;
    directUrl: string;
    webSpaceUrl: string;
    federatedUri: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setPermission("READ");
      setAccessPassword("");
      setTitle(item.name);
      setExpireHours("168");
      setCustomHours("");
      setMaxDownloads("");
      setGeneratedData(null);
      setCopiedKey(null);
    }
  }, [item]);

  useEffect(() => {
    if (item) {
      setExpireHours("24");
      setCustomHours("");
      setMaxDownloads("");
      setGeneratedLink(null);
      setCopied(false);
    }
  }, [item]);

  const shareMutation = useMutation({
    mutationFn: (data: {
      filePath: string;
      expireHours: number;
      maxDownloads?: number;
      permission: SharePermission;
      accessPassword?: string;
      title?: string;
    }) =>
      api.createShare(
        data.filePath,
        data.expireHours,
        data.maxDownloads,
        data.permission,
        data.accessPassword,
        data.title
      ),
    onSuccess: (res) => {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const host = typeof window !== "undefined" ? window.location.host : "localhost:59898";
      const token = res.data.token;
      const pwdQuery = accessPassword.trim()
        ? `?key=${encodeURIComponent(accessPassword.trim())}`
        : "";
      setGeneratedData({
        token,
        directUrl: `${origin}/d/${token}`,
        webSpaceUrl: `${origin}/#/s/${token}`,
        federatedUri: `storeit+fed://${host}/api/fed/shares/${token}${pwdQuery}`,
      });
      queryClient.invalidateQueries({ queryKey: ["shares"] });
      showToast(
        item?.isDirectory ? "共享文件夹与跨服协议链接已生成" : "分享链接已生成",
        "success"
      );
    },
    onError: (err: any) => {
      showToast(err.message || "生成分享链接失败", "error");
    },
  });

  const handleClose = () => {
    setShareModalFile(null);
    setGeneratedData(null);
    setCopiedKey(null);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    let hours = parseInt(expireHours, 10);
    if (expireHours === "custom") {
      hours = parseInt(customHours, 10);
      if (!Number.isInteger(hours) || hours < 1) {
        showToast("自定义有效小时数必须为正整数", "error");
        return;
      }
    }

    let max: number | undefined = undefined;
    if (maxDownloads.trim()) {
      max = parseInt(maxDownloads, 10);
      if (!Number.isInteger(max) || max < 1) {
        showToast("最大下载次数必须为正整数", "error");
        return;
      }
    }

    shareMutation.mutate({
      filePath: item.path,
      expireHours: hours,
      maxDownloads: max,
      permission,
      accessPassword: accessPassword.trim() || undefined,
      title: title.trim() || item.name,
    });
  };

  const handleCopy = async (key: string, text: string) => {
    if (await copyToClipboard(text)) {
      setCopiedKey(key);
      showToast("已复制到剪贴板", "success");
      setTimeout(() => setCopiedKey(null), 1800);
    } else {
      showToast("复制失败，请手动选取复制", "error");
    }
  };

  return (
    <Dialog open={Boolean(item)} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg storeit-modal-spring">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-brand-secondary" />
            {item?.isDirectory ? "创建共享文件夹 / 跨服共享链接" : "创建文件分享 / 协同链接"}
          </DialogTitle>
        </DialogHeader>

        {generatedData ? (
          <div className="space-y-4 py-1 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 space-y-1">
              <p className="font-semibold">
                共享已生成（权限：{permission === "READ_WRITE" ? "可读写协同 RW" : "只读访问 R"}
                {accessPassword.trim() ? ` · 提取码: ${accessPassword.trim()}` : ""}）
              </p>
              <p className="text-[11px]">
                对方可通过 Web 互动链接在线浏览/编辑，或在任意 StoreIt 服务器通过 SFSP 跨服协议挂载。
              </p>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">
                1. Web 共享空间互动链接（推荐：支持在线浏览目录、预览与 RW 读写协同）
              </label>
              <div className="flex gap-2">
                <Input readOnly value={generatedData.webSpaceUrl} className="text-xs font-mono" />
                <Button
                  size="sm"
                  onClick={() => handleCopy("web", generatedData.webSpaceUrl)}
                  className="gap-1 shrink-0"
                >
                  {copiedKey === "web" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" /> 已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> 复制
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">
                2. 直接下载 / 文件夹 ZIP 打包直链（防聊天软件爬虫误扣次数）
              </label>
              <div className="flex gap-2">
                <Input readOnly value={generatedData.directUrl} className="text-xs font-mono" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy("direct", generatedData.directUrl)}
                  className="gap-1 shrink-0"
                >
                  {copiedKey === "direct" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> 已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> 复制
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                <Globe className="w-3.5 h-3.5 text-brand-secondary" />
                3. 跨服联邦挂载协议地址 (SFSP/1.0 · 可在其他 StoreIt 实例一键挂载)
              </label>
              <div className="flex gap-2">
                <Input readOnly value={generatedData.federatedUri} className="text-xs font-mono" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy("fed", generatedData.federatedUri)}
                  className="gap-1 shrink-0"
                >
                  {copiedKey === "fed" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> 已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> 复制协议串
                    </>
                  )}
                </Button>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const tok = generatedData.token;
                  const pwd = accessPassword.trim();
                  handleClose();
                  openSharedSpace(tok, "", pwd);
                }}
              >
                立即在共享空间中打开
              </Button>
              <Button type="button" onClick={handleClose}>
                完成
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40 border">
              {item?.isDirectory ? (
                <Folder className="w-5 h-5 text-amber-500 shrink-0" />
              ) : (
                <FileText className="w-5 h-5 text-brand-secondary shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-brand-primary truncate">{item?.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  路径: /{item?.path} ({item?.isDirectory ? "文件夹共享" : "单文件分享"})
                </p>
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-secondary" />
                共享读写权限管控 (R / RW)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPermission("READ")}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    permission === "READ"
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold"
                      : "bg-white hover:bg-black/5 text-foreground"
                  }`}
                >
                  <div>只读权限 (R)</div>
                  <div className="text-[10px] text-muted-foreground font-normal mt-0.5">
                    仅允许浏览子目录、在线预览与下载
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPermission("READ_WRITE")}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    permission === "READ_WRITE"
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold"
                      : "bg-white hover:bg-black/5 text-foreground"
                  }`}
                >
                  <div>可读写协同 (RW)</div>
                  <div className="text-[10px] text-muted-foreground font-normal mt-0.5">
                    允许上传、新建、在线编辑与删除子项
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-foreground flex items-center gap-1 mb-1">
                  <Lock className="w-3 h-3 text-brand-secondary" /> 访问提取码 (留空则公开)
                </label>
                <Input
                  type="text"
                  placeholder="可选，如 8888 或 team2026"
                  value={accessPassword}
                  onChange={(e) => setAccessPassword(e.target.value)}
                  className="font-mono text-xs h-9"
                />
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">共享显示名称</label>
                <Input
                  type="text"
                  placeholder="共享标题"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-foreground block mb-1">链接有效期</label>
                <select
                  value={expireHours}
                  onChange={(e) => setExpireHours(e.target.value)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="24">1 天</option>
                  <option value="168">7 天</option>
                  <option value="720">30 天</option>
                  <option value="-1">永久有效</option>
                  <option value="custom">自定义小时数</option>
                </select>
                {expireHours === "custom" && (
                  <Input
                    type="number"
                    min="1"
                    placeholder="有效小时数 (如 48)"
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value)}
                    className="mt-1.5 text-xs h-8"
                    required
                  />
                )}
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">
                  最大下载次数 (留空不限)
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="例如: 50"
                  value={maxDownloads}
                  onChange={(e) => setMaxDownloads(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            </div>

            <DialogFooter className="pt-1">
              <Button type="button" variant="outline" onClick={handleClose}>
                取消
              </Button>
              <Button type="submit" disabled={shareMutation.isPending}>
                {shareMutation.isPending ? "生成中..." : "生成共享与跨服协议链接"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

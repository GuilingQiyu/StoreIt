"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Share2, Copy, Check } from "lucide-react";
import { api } from "@/lib/api";
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
  const showToast = useFileStore((s) => s.showToast);
  const queryClient = useQueryClient();

  const [expireHours, setExpireHours] = useState("24");
  const [customHours, setCustomHours] = useState("");
  const [maxDownloads, setMaxDownloads] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    mutationFn: (data: { filePath: string; expireHours: number; maxDownloads?: number }) =>
      api.createShare(data.filePath, data.expireHours, data.maxDownloads),
    onSuccess: (res) => {
      const fullUrl = window.location.origin + res.data.url;
      setGeneratedLink(fullUrl);
      queryClient.invalidateQueries({ queryKey: ["shares"] });
      showToast("分享链接已生成", "success");
    },
    onError: (err: any) => {
      showToast(err.message || "生成分享链接失败", "error");
    },
  });

  const handleClose = () => {
    setShareModalFile(null);
    setGeneratedLink(null);
    setCopied(false);
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
    });
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    const ok = await copyToClipboard(generatedLink);
    if (ok) {
      setCopied(true);
      showToast("分享直链已复制到剪贴板", "success");
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast("复制失败，请手动选取输入框文本复制", "error");
    }
  };

  return (
    <Dialog open={Boolean(item)} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-brand-secondary" />
            生成分享链接
          </DialogTitle>
        </DialogHeader>

        {generatedLink ? (
          <div className="space-y-4 py-2">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
              分享链接已成功生成！可将下方链接直接发送给好友或对外公开发布（已内置防聊天软件预览爬虫误扣下载次数保护）。
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                访问直链
              </label>
              <div className="flex gap-2">
                <Input readOnly value={generatedLink} className="text-xs font-mono" />
                <Button size="sm" onClick={handleCopy} className="gap-1.5 shrink-0">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" /> 已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> 复制
                    </>
                  )}
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" onClick={handleClose}>
                完成
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-0.5">
                当前分享文件
              </label>
              <p className="text-sm font-semibold text-brand-primary truncate">{item?.name}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                链接有效期
              </label>
              <select
                value={expireHours}
                onChange={(e) => setExpireHours(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
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
                  placeholder="输入有效小时数 (如 48)"
                  value={customHours}
                  onChange={(e) => setCustomHours(e.target.value)}
                  className="mt-2 text-sm"
                  required
                />
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                最大下载次数 (留空表示不限制)
              </label>
              <Input
                type="number"
                min="1"
                placeholder="例如: 10"
                value={maxDownloads}
                onChange={(e) => setMaxDownloads(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                取消
              </Button>
              <Button type="submit" disabled={shareMutation.isPending}>
                生成链接
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

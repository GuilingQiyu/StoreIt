"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Share2, Copy, Check, Trash2, RefreshCw, Link as LinkIcon, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export function SharesTab() {
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["shares"],
    queryFn: () => api.getShares(),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: number) => api.revokeShare(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shares"] });
    },
  });

  const handleCopy = (shareId: number, url: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedId(shareId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleRevoke = (id: number, filePath: string) => {
    if (confirm(`确定要撤销对 "${filePath}" 的分享链接吗？`)) {
      revokeMutation.mutate(id);
    }
  };

  const shares = data || [];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-primary flex items-center gap-2">
            <Share2 className="w-6 h-6 text-brand-secondary" />
            我的分享链接
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            查看、复制或撤销您生成的对外分享访问直链
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RefreshCw className="w-4 h-4" /> 刷新
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-secondary" />
          <p>正在读取分享列表...</p>
        </div>
      ) : shares.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-2xl border border-dashed text-muted-foreground">
          <Share2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-brand-secondary" />
          <p className="font-semibold text-brand-primary">还没有分享记录</p>
          <p className="text-xs text-muted-foreground mt-1">在文件列表中选中文件并点击“分享”即可生成外链</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shares.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white/80 hover:bg-white rounded-2xl border shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground truncate max-w-md" title={item.filePath}>
                    {item.filePath}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full max-w-lg">
                  <input
                    readOnly
                    value={typeof window !== "undefined" ? window.location.origin + item.url : item.url}
                    className="flex-1 text-xs font-mono bg-muted/50 border rounded-lg px-2.5 py-1 text-muted-foreground outline-none select-all"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 text-xs gap-1 shrink-0"
                    onClick={() => handleCopy(item.id, item.url)}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> 已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> 复制链接
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-0.5">
                  <span>
                    下载限制:{" "}
                    <strong className="text-foreground">
                      {item.downloads || 0} / {item.maxDownloads ? item.maxDownloads : "不限"}
                    </strong>
                  </span>
                  <span>
                    有效期至:{" "}
                    <strong className="text-foreground">
                      {item.expiry ? formatDate(item.expiry) : "永久有效"}
                    </strong>
                  </span>
                </div>
              </div>

              <Button
                variant="destructive"
                size="sm"
                className="gap-1 shrink-0 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-0 shadow-none"
                onClick={() => handleRevoke(item.id, item.filePath)}
              >
                <Trash2 className="w-3.5 h-3.5" /> 撤销分享
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

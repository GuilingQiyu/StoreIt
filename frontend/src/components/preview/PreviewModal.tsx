"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download, X, FileText, AlertCircle, RefreshCw } from "lucide-react";
import { useFileStore } from "@/stores/useFileStore";
import { formatBytes, getDownloadUrl, getPreviewUrl, getPreviewKind, PreviewKind } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 文本预览仅通过 HTTP Range 拉取前 256KB，避免整文件下载
const MAX_TEXT_BYTES = 256 * 1024;
const MAX_TEXT_LENGTH = 200000;

export function PreviewModal() {
  const item = useFileStore((s) => s.previewFile);
  const setPreviewFile = useFileStore((s) => s.setPreviewFile);

  const [textContent, setTextContent] = useState<string | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  // 与后端白名单对齐的预览方式；null 表示不支持在线预览
  const kind: PreviewKind | null = item ? getPreviewKind(item.name) : null;
  const previewUrl = item ? getPreviewUrl(item.path) : "";
  const downloadUrl = item ? getDownloadUrl(item.path) : "";

  useEffect(() => {
    // 切换文件时重置媒体加载失败状态
    setPreviewFailed(false);
  }, [item]);

  useEffect(() => {
    if (item && kind === "text") {
      setLoadingText(true);
      setIsTruncated(false);
      setTextContent(null);

      // 后端 /api/preview 支持 HTTP Range，仅取前 256KB 按需加载
      fetch(previewUrl, { headers: { Range: `bytes=0-${MAX_TEXT_BYTES - 1}` } })
        .then((r) => {
          if (!r.ok) throw new Error("无法加载文本");
          return r.text();
        })
        .then((text) => {
          const truncated = text.length > MAX_TEXT_LENGTH;
          setTextContent(truncated ? text.slice(0, MAX_TEXT_LENGTH) : text);
          setIsTruncated(truncated);
          setLoadingText(false);
        })
        .catch(() => {
          setTextContent("加载文本内容失败");
          setLoadingText(false);
        });
    } else {
      setTextContent(null);
    }
  }, [item, kind, previewUrl]);

  const handleDownload = () => {
    if (!item) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 加载失败（或本就不支持的格式）时统一回退到下载
  const fallbackBlock = (
    <div className="text-center p-8 space-y-3">
      <FileText className="w-16 h-16 text-muted-foreground/40 mx-auto" />
      <p className="text-sm font-medium text-foreground">
        {previewFailed
          ? "该文件在线预览加载失败，请下载后查看"
          : "该文件格式暂不支持在线直接预览"}
      </p>
      <Button onClick={handleDownload} className="gap-2">
        <Download className="w-4 h-4" /> 立即下载到本地查看
      </Button>
    </div>
  );

  return (
    <Dialog open={Boolean(item)} onOpenChange={(open) => !open && setPreviewFile(null)}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="flex-row items-center justify-between space-y-0 pb-3 border-b">
          <div className="flex items-center gap-2 min-w-0 pr-6">
            <Eye className="w-5 h-5 text-brand-secondary shrink-0" />
            <DialogTitle className="text-base truncate font-semibold" title={item?.name}>
              {item?.name}
            </DialogTitle>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              ({formatBytes(item?.size || 0)})
            </span>
          </div>

          <Button size="sm" variant="outline" className="gap-1.5 h-8 shrink-0" onClick={handleDownload}>
            <Download className="w-3.5 h-3.5" /> 下载文件
          </Button>
        </DialogHeader>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto min-h-[300px] flex items-center justify-center p-2 bg-black/5 rounded-xl mt-3">
          {kind === "image" && !previewFailed && (
            <img
              src={previewUrl}
              alt={item?.name}
              className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm"
              onError={() => setPreviewFailed(true)}
            />
          )}

          {kind === "video" && !previewFailed && (
            <video
              src={previewUrl}
              controls
              autoPlay
              className="max-h-[60vh] max-w-full rounded-lg shadow-sm"
              onError={() => setPreviewFailed(true)}
            />
          )}

          {kind === "audio" && !previewFailed && (
            <div className="p-8 w-full max-w-md bg-white rounded-2xl shadow-sm text-center space-y-4">
              <p className="text-sm font-medium text-foreground">{item?.name}</p>
              <audio
                src={previewUrl}
                controls
                className="w-full"
                onError={() => setPreviewFailed(true)}
              />
            </div>
          )}

          {kind === "pdf" && !previewFailed && (
            <iframe
              src={previewUrl}
              className="w-full h-[60vh] rounded-lg border bg-white"
              title={item?.name}
            />
          )}

          {kind === "text" && (
            <div className="w-full h-[60vh] flex flex-col bg-[#1e1e2e] text-[#cdd6f4] p-4 rounded-lg font-mono text-xs leading-relaxed">
              {isTruncated && (
                <div className="mb-2 p-2 rounded bg-amber-500/20 text-amber-300 text-[11px] flex items-center gap-1.5 shrink-0">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>内容过大，仅显示前 200,000 字符。完整内容请下载后查看。</span>
                </div>
              )}
              <div className="flex-1 overflow-auto">
                {loadingText ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                    <RefreshCw className="w-4 h-4 animate-spin" /> 加载中...
                  </div>
                ) : (
                  <pre>{textContent}</pre>
                )}
              </div>
            </div>
          )}

          {(kind === null || previewFailed) ? fallbackBlock : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

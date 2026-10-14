"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download, X, FileText, AlertCircle, RefreshCw } from "lucide-react";
import { useFileStore } from "@/stores/useFileStore";
import { getFileCategory, formatBytes } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PreviewModal() {
  const item = useFileStore((s) => s.previewFile);
  const setPreviewFile = useFileStore((s) => s.setPreviewFile);

  const [textContent, setTextContent] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState(false);

  const cat = item ? getFileCategory(item.name) : "other";
  const fileUrl = item ? `/storage/${encodeURIComponent(item.path)}` : "";

  useEffect(() => {
    if (item && cat === "code") {
      setLoadingText(true);
      fetch(fileUrl)
        .then((r) => r.text())
        .then((text) => {
          setTextContent(text);
          setLoadingText(false);
        })
        .catch(() => {
          setTextContent("加载文本内容失败");
          setLoadingText(false);
        });
    } else {
      setTextContent(null);
    }
  }, [item, cat, fileUrl]);

  const handleDownload = () => {
    if (!item) return;
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
          {cat === "image" && (
            <img
              src={fileUrl}
              alt={item?.name}
              className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm"
            />
          )}

          {cat === "video" && (
            <video
              src={fileUrl}
              controls
              autoPlay
              className="max-h-[60vh] max-w-full rounded-lg shadow-sm"
            />
          )}

          {cat === "audio" && (
            <div className="p-8 w-full max-w-md bg-white rounded-2xl shadow-sm text-center space-y-4">
              <p className="text-sm font-medium text-foreground">{item?.name}</p>
              <audio src={fileUrl} controls className="w-full" />
            </div>
          )}

          {cat === "pdf" && (
            <iframe
              src={fileUrl}
              className="w-full h-[60vh] rounded-lg border bg-white"
              title={item?.name}
            />
          )}

          {cat === "code" && (
            <div className="w-full h-[60vh] overflow-auto bg-[#1e1e2e] text-[#cdd6f4] p-4 rounded-lg font-mono text-xs leading-relaxed">
              {loadingText ? (
                <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
                  <RefreshCw className="w-4 h-4 animate-spin" /> 加载中...
                </div>
              ) : (
                <pre>{textContent}</pre>
              )}
            </div>
          )}

          {cat === "document" || cat === "archive" || cat === "other" ? (
            <div className="text-center p-8 space-y-3">
              <FileText className="w-16 h-16 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-medium text-foreground">
                该文件格式暂不支持在线直接预览
              </p>
              <Button onClick={handleDownload} className="gap-2">
                <Download className="w-4 h-4" /> 立即下载到本地查看
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useRef } from "react";
import { 
  Play, 
  Pause, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Upload,
  Clock
} from "lucide-react";
import { UploadTask } from "@/types";
import { useUploadStore } from "@/stores/useUploadStore";
import { useFileStore, useI18n } from "@/stores/useFileStore";
import { formatBytes } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface UploadItemProps {
  task: UploadTask;
}

export function UploadItem({ task }: UploadItemProps) {
  const pauseTask = useUploadStore((s) => s.pauseTask);
  const resumeTask = useUploadStore((s) => s.resumeTask);
  const cancelTask = useUploadStore((s) => s.cancelTask);
  const retryTask = useUploadStore((s) => s.retryTask);
  const rebindFileAndResume = useUploadStore((s) => s.rebindFileAndResume);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  const handleFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await rebindFileAndResume(task.id, file);
      } catch (err: any) {
        useFileStore.getState().showToast(err.message || t("文件匹配失败", "File mismatch"), "error");
      }
    }
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case "uploading":
        return (
          <span className="text-xs text-brand-primary font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            {t("上传中", "Uploading")} ({formatBytes(task.speed)}/s)
          </span>
        );
      case "paused":
        return (
          <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
            <Pause className="w-3 h-3" /> {t("已暂停", "Paused")}
          </span>
        );
      case "merging":
        return (
          <span className="text-xs text-indigo-600 font-medium flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" /> {t("合并文件中...", "Merging chunks...")}
          </span>
        );
      case "completed":
        return (
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {t("上传完成", "Completed")}
          </span>
        );
      case "interrupted":
        return (
          <span className="text-xs text-orange-600 font-medium flex items-center gap-1" title={task.errorMessage}>
            <Clock className="w-3 h-3" /> {t("已中断 (点击重新选择文件)", "Interrupted (rebind file)")}
          </span>
        );
      case "error":
        return (
          <span className="text-xs text-destructive font-medium flex items-center gap-1" title={task.errorMessage}>
            <AlertCircle className="w-3 h-3" /> {t("上传失败", "Failed")}
          </span>
        );
      default:
        return <span className="text-xs text-muted-foreground">{t("准备中...", "Preparing...")}</span>;
    }
  };

  return (
    <div className="p-3 bg-white/70 hover:bg-white rounded-xl border border-black/5 transition-all shadow-sm">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <FileText className="w-4 h-4 text-brand-secondary shrink-0" />
          <span className="text-sm font-medium truncate" title={task.name}>
            {task.name}
          </span>
        </div>
        <div className="shrink-0">{getStatusBadge()}</div>
      </div>

      {/* Progress Bar */}
      <div className="my-1.5">
        <Progress 
          value={task.progress} 
          className="h-1.5 bg-black/5" 
          indicatorColor={
            task.status === "completed" 
              ? "bg-emerald-500" 
              : task.status === "paused"
              ? "bg-amber-500"
              : task.status === "error" || task.status === "interrupted"
              ? "bg-orange-500"
              : "bg-brand-primary"
          } 
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
        <div>
          <span>{formatBytes((task.size * task.progress) / 100)}</span>
          <span className="mx-1">/</span>
          <span>{formatBytes(task.size)}</span>
          {task.totalChunks > 1 && (
            <span className="ml-2 text-black/40">
              ({task.uploadedChunks.length}/{task.totalChunks} {t("分片", "chunks")})
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {task.status === "uploading" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => pauseTask(task.id)}
              title={t("暂停上传", "Pause upload")}
            >
              <Pause className="w-3.5 h-3.5" />
            </Button>
          )}

          {task.status === "paused" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => resumeTask(task.id)}
              title={t("继续上传", "Resume upload")}
            >
              <Play className="w-3.5 h-3.5" />
            </Button>
          )}

          {task.status === "error" && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs gap-1 border-rose-200 text-rose-700 hover:bg-rose-50"
              onClick={() => retryTask(task.id)}
              title={t("重试上传", "Retry upload")}
            >
              <RefreshCw className="w-3 h-3" /> {t("重试", "Retry")}
            </Button>
          )}

          {(task.status === "interrupted" || task.status === "error") && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFilePicked}
              />
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs gap-1 border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => fileInputRef.current?.click()}
                title={t("重新选取同名文件以恢复断点续传", "Re-select the same file to resume upload")}
              >
                <Upload className="w-3 h-3" /> {t("绑定续传", "Rebind")}
              </Button>
            </>
          )}

          {task.status !== "completed" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={() => cancelTask(task.id)}
              title={t("取消上传", "Cancel upload")}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {task.errorMessage && (
        <p className="text-[11px] text-destructive mt-1 truncate" title={task.errorMessage}>
          {task.errorMessage}
        </p>
      )}
    </div>
  );
}

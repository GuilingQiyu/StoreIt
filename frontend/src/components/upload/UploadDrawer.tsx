"use client";

import React from "react";
import { 
  CloudUpload, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  CheckCheck 
} from "lucide-react";
import { useUploadStore } from "@/stores/useUploadStore";
import { UploadItem } from "./UploadItem";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";

export function UploadDrawer() {
  const tasks = useUploadStore((s) => s.tasks);
  const isDrawerOpen = useUploadStore((s) => s.isDrawerOpen);
  const toggleDrawer = useUploadStore((s) => s.toggleDrawer);
  const clearCompleted = useUploadStore((s) => s.clearCompleted);

  if (tasks.length === 0) return null;

  const uploadingCount = tasks.filter((t) => t.status === "uploading" || t.status === "merging").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalSpeed = tasks.reduce((sum, t) => sum + (t.speed || 0), 0);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-black/10 overflow-hidden transition-all duration-300">
      {/* Header bar */}
      <div 
        onClick={toggleDrawer}
        className="flex items-center justify-between p-3.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <CloudUpload className="w-5 h-5" />
          <span className="font-semibold text-sm">上传任务</span>
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-mono">
            {completedCount}/{tasks.length}
          </span>
          {uploadingCount > 0 && totalSpeed > 0 && (
            <span className="text-xs text-white/80 font-mono">
              · {formatBytes(totalSpeed)}/s
            </span>
          )}
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {completedCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
              onClick={clearCompleted}
              title="清除已完成任务"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
            onClick={toggleDrawer}
            title={isDrawerOpen ? "收起面板" : "展开面板"}
          >
            {isDrawerOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Task list container */}
      {isDrawerOpen && (
        <div className="max-h-80 overflow-y-auto p-3 space-y-2 divide-y divide-transparent">
          {tasks.map((task) => (
            <UploadItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

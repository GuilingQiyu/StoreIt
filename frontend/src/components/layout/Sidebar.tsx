"use client";

import React from "react";
import { 
  Folder, 
  Clock, 
  Star, 
  Share2, 
  Users, 
  Settings, 
  Info, 
  FileText,
  Download,
  Trash2,
  Eye,
  Calendar,
  HardDrive
} from "lucide-react";
import { useFileStore, ViewMode } from "@/stores/useFileStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { formatBytes, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const viewMode = useFileStore((s) => s.viewMode);
  const setViewMode = useFileStore((s) => s.setViewMode);
  const setCurrentPath = useFileStore((s) => s.setCurrentPath);
  const selectedFile = useFileStore((s) => s.selectedFile);
  const setPreviewFile = useFileStore((s) => s.setPreviewFile);
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const navItems: { mode: ViewMode; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { mode: "files", label: "我的文件", icon: <Folder className="w-4 h-4" /> },
    { mode: "recent", label: "最近访问", icon: <Clock className="w-4 h-4" /> },
    { mode: "favorites", label: "收藏夹", icon: <Star className="w-4 h-4" /> },
    { mode: "shares", label: "我的分享", icon: <Share2 className="w-4 h-4" /> },
    { mode: "admin", label: "用户管理", icon: <Users className="w-4 h-4" />, adminOnly: true },
    { mode: "settings", label: "系统设置", icon: <Settings className="w-4 h-4" />, adminOnly: true },
    { mode: "about", label: "关于 储之", icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "files") {
      setCurrentPath("");
    }
  };

  return (
    <aside className="w-64 border-r bg-white/50 backdrop-blur-sm flex flex-col shrink-0 select-none">
      {/* Navigation list */}
      <div className="p-3 space-y-1">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          const isActive = viewMode === item.mode;

          return (
            <button
              key={item.mode}
              onClick={() => handleNavClick(item.mode)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected File Details Panel */}
      <div className="mt-auto border-t p-4 bg-white/40">
        <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          文件详情
        </h4>

        {selectedFile ? (
          <div className="space-y-3 animate-in fade-in-50 duration-150">
            <div className="flex items-start gap-2.5">
              <FileText className="w-6 h-6 text-brand-secondary shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {selectedFile.isDirectory ? "文件夹" : formatBytes(selectedFile.size || 0)}
                </p>
              </div>
            </div>

            {selectedFile.modifiedTime && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{formatDate(selectedFile.modifiedTime)}</span>
              </div>
            )}

            {!selectedFile.isDirectory && (
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs gap-1"
                  onClick={() => setPreviewFile(selectedFile)}
                >
                  <Eye className="w-3.5 h-3.5" /> 预览
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs gap-1"
                  asChild
                >
                  <a href={`/storage/${encodeURIComponent(selectedFile.path)}`} download={selectedFile.name}>
                    <Download className="w-3.5 h-3.5" /> 下载
                  </a>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground/60 text-xs">
            选择文件以查看详细属性
          </div>
        )}
      </div>
    </aside>
  );
}

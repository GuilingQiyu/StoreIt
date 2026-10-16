"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  HardDrive,
  Edit2,
  FolderInput,
  X,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive
} from "lucide-react";
import { useFileStore, ViewMode } from "@/stores/useFileStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { api } from "@/lib/api";
import { formatBytes, formatDate, getFileCategory, getDownloadUrl, isPreviewable } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const queryClient = useQueryClient();
  const viewMode = useFileStore((s) => s.viewMode);
  const setViewMode = useFileStore((s) => s.setViewMode);
  const setCurrentPath = useFileStore((s) => s.setCurrentPath);
  const selectedFile = useFileStore((s) => s.selectedFile);
  const setSelectedFile = useFileStore((s) => s.setSelectedFile);
  const setPreviewFile = useFileStore((s) => s.setPreviewFile);
  const setShareModalFile = useFileStore((s) => s.setShareModalFile);
  const setMoveModalFile = useFileStore((s) => s.setMoveModalFile);
  const setRenameModalFile = useFileStore((s) => s.setRenameModalFile);
  const sidebarOpen = useFileStore((s) => s.sidebarOpen);
  const setSidebarOpen = useFileStore((s) => s.setSidebarOpen);

  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const { data: quota } = useQuery({
    queryKey: ["quota"],
    queryFn: () => api.getQuota(),
  });

  const { data: favoritesData } = useQuery({
    queryKey: ["favoritesList"],
    queryFn: () => api.getFavorites(),
  });

  const isFavorite = Boolean(
    selectedFile && (favoritesData || []).some((f) => f.path === selectedFile.path)
  );

  const deleteMutation = useMutation({
    mutationFn: (path: string) => api.deleteFile(path),
    onSuccess: () => {
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["quota"] });
      queryClient.invalidateQueries({ queryKey: ["favoritesList"] });
    },
    onError: (err: any) => alert(err.message || "删除失败"),
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ path, favorite }: { path: string; favorite: boolean }) =>
      api.setFavorite(path, favorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoritesList"] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (err: any) => alert(err.message || "收藏操作失败"),
  });

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
    setSidebarOpen(false);
  };

  const percent = quota && quota.total > 0 ? (quota.used / quota.total) * 100 : 0;
  const storageColor =
    percent > 90 ? "bg-rose-500" : percent > 70 ? "bg-amber-500" : "bg-brand-primary";

  const getCategoryLabel = (name: string, isDir: boolean) => {
    if (isDir) return "文件夹";
    const cat = getFileCategory(name);
    switch (cat) {
      case "image": return "图片";
      case "video": return "视频";
      case "audio": return "音频";
      case "pdf": return "PDF 文档";
      case "code": return "文本/代码";
      case "archive": return "压缩包";
      case "document": return "Office 文档";
      default: return "文件";
    }
  };

  const renderFileIcon = (name: string, isDir: boolean) => {
    if (isDir) return <Folder className="w-5 h-5 text-amber-500" />;
    const cat = getFileCategory(name);
    switch (cat) {
      case "image": return <FileImage className="w-5 h-5 text-purple-500" />;
      case "video": return <FileVideo className="w-5 h-5 text-rose-500" />;
      case "audio": return <FileAudio className="w-5 h-5 text-emerald-500" />;
      case "pdf": return <FileText className="w-5 h-5 text-red-500" />;
      case "code": return <FileCode className="w-5 h-5 text-blue-500" />;
      case "archive": return <FileArchive className="w-5 h-5 text-amber-600" />;
      default: return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* Mobile close button */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <span className="font-semibold text-brand-primary text-sm">导航与详情</span>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation list */}
      <div className="p-3 space-y-1 overflow-y-auto">
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

      {/* Storage Usage Bar */}
      {quota && (
        <div className="px-4 py-3 mx-3 my-2 bg-black/[0.03] rounded-2xl border border-black/5">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-brand-secondary" />
              存储空间
            </span>
            <span>
              {quota.unlimited && quota.scope === "user"
                ? `${formatBytes(quota.used)} / 无限制`
                : `${formatBytes(quota.used)} / ${formatBytes(quota.total)}`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${storageColor}`}
              style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
            />
          </div>
        </div>
      )}

      {/* Selected File Details Panel */}
      <div className="mt-auto border-t p-4 bg-white/40">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            文件属性与详情
          </h4>
          {selectedFile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedFile(null)}
              title="关闭详情"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {selectedFile ? (
          <div className="space-y-3 animate-in fade-in-50 duration-150 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">
                {renderFileIcon(selectedFile.name, selectedFile.isDirectory)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground text-[11px] mt-0.5">
                  <span>{getCategoryLabel(selectedFile.name, selectedFile.isDirectory)}</span>
                  <span>·</span>
                  <span>{selectedFile.isDirectory ? "目录" : formatBytes(selectedFile.size || 0)}</span>
                </div>
              </div>
            </div>

            {selectedFile.modifiedTime && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{formatDate(selectedFile.modifiedTime)}</span>
              </div>
            )}

            <div className="text-[11px] text-muted-foreground break-all bg-black/[0.03] p-1.5 rounded font-mono">
              /{selectedFile.path}
            </div>

            {/* Quick Action Button Grid */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {!selectedFile.isDirectory && isPreviewable(selectedFile.name) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1"
                  onClick={() => setPreviewFile(selectedFile)}
                >
                  <Eye className="w-3 h-3 text-brand-secondary" /> 预览
                </Button>
              )}

              {!selectedFile.isDirectory && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1"
                  asChild
                >
                  <a href={getDownloadUrl(selectedFile.path)} download={selectedFile.name}>
                    <Download className="w-3 h-3 text-brand-secondary" /> 下载
                  </a>
                </Button>
              )}

              {!selectedFile.isDirectory && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1"
                  onClick={() => setShareModalFile(selectedFile)}
                >
                  <Share2 className="w-3 h-3 text-brand-secondary" /> 分享
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                className={`h-7 text-xs gap-1 ${isFavorite ? "text-amber-600 border-amber-300" : ""}`}
                onClick={() =>
                  favoriteMutation.mutate({
                    path: selectedFile.path,
                    favorite: !isFavorite,
                  })
                }
              >
                <Star className={`w-3 h-3 ${isFavorite ? "fill-amber-500 text-amber-500" : ""}`} />
                {isFavorite ? "取消收藏" : "加入收藏"}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={() => setRenameModalFile(selectedFile)}
              >
                <Edit2 className="w-3 h-3 text-brand-secondary" /> 重命名
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={() => setMoveModalFile(selectedFile)}
              >
                <FolderInput className="w-3 h-3 text-brand-secondary" /> 移动
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="col-span-2 h-7 text-xs gap-1 text-destructive hover:bg-destructive/10 border-destructive/20"
                onClick={() => {
                  if (confirm(`确定要彻底删除 "${selectedFile.name}" 吗？此操作不可撤销！`)) {
                    deleteMutation.mutate(selectedFile.path);
                  }
                }}
              >
                <Trash2 className="w-3 h-3" /> 删除
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground/60 text-xs">
            选择文件以查看详细属性与操作
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-white/50 backdrop-blur-sm flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-white shadow-2xl z-10 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

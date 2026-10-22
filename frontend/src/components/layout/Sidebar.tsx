"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Folder, 
  FolderOpen,
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
  Edit3,
  FolderInput,
  X,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive
} from "lucide-react";
import { useFileStore, useI18n, ViewMode } from "@/stores/useFileStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { api } from "@/lib/api";
import { formatBytes, formatDate, getFileCategory, getDownloadUrl, isEditableText, isPreviewable } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const queryClient = useQueryClient();
  const viewMode = useFileStore((s) => s.viewMode);
  const setViewMode = useFileStore((s) => s.setViewMode);
  const setCurrentPath = useFileStore((s) => s.setCurrentPath);
  const selectedFile = useFileStore((s) => s.selectedFile);
  const setSelectedFile = useFileStore((s) => s.setSelectedFile);
  const openContainingFolder = useFileStore((s) => s.openContainingFolder);
  const setPreviewFile = useFileStore((s) => s.setPreviewFile);
  const openEditor = useFileStore((s) => s.openEditor);
  const setShareModalFile = useFileStore((s) => s.setShareModalFile);
  const setMoveModalFile = useFileStore((s) => s.setMoveModalFile);
  const setRenameModalFile = useFileStore((s) => s.setRenameModalFile);
  const sidebarOpen = useFileStore((s) => s.sidebarOpen);
  const setSidebarOpen = useFileStore((s) => s.setSidebarOpen);
  const showToast = useFileStore((s) => s.showToast);
  const openConfirm = useFileStore((s) => s.openConfirm);
  const { locale, t } = useI18n();

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
      showToast(t("删除成功", "Deleted successfully"), "success");
    },
    onError: (err: any) => showToast(err.message || t("删除失败", "Failed to delete"), "error"),
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ path, favorite }: { path: string; favorite: boolean }) =>
      api.setFavorite(path, favorite),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["favoritesList"] });
      queryClient.invalidateQueries({ queryKey: ["files"] });
      showToast(
        vars.favorite
          ? t("已加入收藏夹", "Added to favorites")
          : t("已取消收藏", "Removed from favorites"),
        "success"
      );
    },
    onError: (err: any) =>
      showToast(err.message || t("收藏操作失败", "Failed to update favorite"), "error"),
  });

  const navItems: { mode: ViewMode; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { mode: "files", label: t("我的文件", "My Files"), icon: <Folder className="w-4 h-4" /> },
    { mode: "recent", label: t("最近访问", "Recent"), icon: <Clock className="w-4 h-4" /> },
    { mode: "favorites", label: t("收藏夹", "Favorites"), icon: <Star className="w-4 h-4" /> },
    { mode: "shares", label: t("我的分享", "Shares & Mounts"), icon: <Share2 className="w-4 h-4" /> },
    { mode: "admin", label: t("用户管理", "Users & Invites"), icon: <Users className="w-4 h-4" />, adminOnly: true },
    { mode: "settings", label: t("系统设置", "Settings"), icon: <Settings className="w-4 h-4" />, adminOnly: true },
    { mode: "about", label: t("关于 储之", "About StoreIt"), icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (mode: ViewMode) => {
    if (mode === "files") {
      setCurrentPath("");
    }
    setViewMode(mode);
    setSidebarOpen(false);
  };

  const percent = quota && quota.total > 0 ? (quota.used / quota.total) * 100 : 0;
  const storageColor =
    percent > 90 ? "bg-rose-500" : percent > 70 ? "bg-amber-500" : "bg-brand-primary";

  const getCategoryLabel = (name: string, isDir: boolean) => {
    if (isDir) return t("文件夹", "Folder");
    const cat = getFileCategory(name);
    switch (cat) {
      case "image": return t("图片", "Image");
      case "video": return t("视频", "Video");
      case "audio": return t("音频", "Audio");
      case "pdf": return t("PDF 文档", "PDF Document");
      case "code": return t("文本/代码", "Text / Code");
      case "archive": return t("压缩包", "Archive");
      case "document": return t("Office 文档", "Office Document");
      default: return t("文件", "File");
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
        <span className="font-semibold text-brand-primary text-sm">
          {t("导航与详情", "Navigation & Details")}
        </span>
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
              {t("存储空间", "Storage")}
            </span>
            <span>
              {quota.unlimited && quota.scope === "user"
                ? `${formatBytes(quota.used)} / ${t("无限制", "Unlimited")}`
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
            {t("文件属性与详情", "File Properties")}
          </h4>
          {selectedFile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedFile(null)}
              title={t("关闭详情", "Close details")}
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
                  <span>
                    {selectedFile.isDirectory
                      ? t("目录", "Directory")
                      : formatBytes(selectedFile.size || 0)}
                  </span>
                </div>
              </div>
            </div>

            {selectedFile.modifiedTime && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{formatDate(selectedFile.modifiedTime, locale)}</span>
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
                  <Eye className="w-3 h-3 text-brand-secondary" />
                  {t("预览", "Preview")}
                </Button>
              )}

              {!selectedFile.isDirectory && isEditableText(selectedFile.name) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1"
                  onClick={() => openEditor(selectedFile)}
                >
                  <Edit3 className="w-3 h-3 text-brand-secondary" />
                  {t("编辑", "Edit")}
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
                    <Download className="w-3 h-3 text-brand-secondary" />
                    {t("下载", "Download")}
                  </a>
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={() => setShareModalFile(selectedFile)}
              >
                <Share2 className="w-3 h-3 text-brand-secondary" />
                {selectedFile.isDirectory ? t("共享", "Share Folder") : t("分享", "Share")}
              </Button>

              {viewMode !== "files" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1"
                  onClick={() => openContainingFolder(selectedFile)}
                >
                  <FolderOpen className="w-3 h-3 text-brand-secondary" />
                  {t("所在目录", "Open Location")}
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
                {isFavorite ? t("取消收藏", "Unfavorite") : t("加入收藏", "Favorite")}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={() => setRenameModalFile(selectedFile)}
              >
                <Edit2 className="w-3 h-3 text-brand-secondary" />
                {t("重命名", "Rename")}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={() => setMoveModalFile(selectedFile)}
              >
                <FolderInput className="w-3 h-3 text-brand-secondary" />
                {t("移动", "Move")}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="col-span-2 h-7 text-xs gap-1 text-destructive hover:bg-destructive/10 border-destructive/20"
                onClick={() => {
                  openConfirm({
                    title: t("确认彻底删除", "Confirm Permanent Deletion"),
                    description: t(
                      `确定要彻底删除 "${selectedFile.name}" 吗？此操作不可撤销！`,
                      `Are you sure you want to permanently delete "${selectedFile.name}"? This action cannot be undone.`
                    ),
                    confirmText: t("彻底删除", "Delete"),
                    destructive: true,
                    onConfirm: () => deleteMutation.mutate(selectedFile.path),
                  });
                }}
              >
                <Trash2 className="w-3 h-3" />
                {t("删除", "Delete")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground/60 text-xs">
            {t("选择文件以查看详细属性与操作", "Select a file to view properties & actions")}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex w-64 border-r bg-white/50 backdrop-blur-sm flex-col shrink-0">
        {sidebarContent}
      </aside>

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

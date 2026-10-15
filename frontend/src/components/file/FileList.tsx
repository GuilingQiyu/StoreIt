"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  FolderOpen, 
  RefreshCw, 
  AlertCircle,
  Eye,
  Download,
  Share2,
  Star,
  Edit2,
  FolderInput,
  Trash2,
  Info
} from "lucide-react";
import { FileItem } from "@/types";
import { api } from "@/lib/api";
import { useFileStore } from "@/stores/useFileStore";
import { getDownloadUrl, isPreviewable } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileCard } from "./FileCard";
import { FileTableRow } from "./FileTableRow";

export function FileList() {
  const queryClient = useQueryClient();
  const currentPath = useFileStore((s) => s.currentPath);
  const viewMode = useFileStore((s) => s.viewMode);
  const layout = useFileStore((s) => s.layout);
  const searchQuery = useFileStore((s) => s.searchQuery);
  const openFolder = useFileStore((s) => s.openFolder);
  const setSelectedFile = useFileStore((s) => s.setSelectedFile);
  const setPreviewFile = useFileStore((s) => s.setPreviewFile);
  const setShareModalFile = useFileStore((s) => s.setShareModalFile);
  const setMoveModalFile = useFileStore((s) => s.setMoveModalFile);
  const setRenameModalFile = useFileStore((s) => s.setRenameModalFile);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: FileItem;
  } | null>(null);

  // Close context menu on global click or scroll
  useEffect(() => {
    const handleCloseMenu = () => setContextMenu(null);
    window.addEventListener("click", handleCloseMenu);
    window.addEventListener("scroll", handleCloseMenu, true);
    return () => {
      window.removeEventListener("click", handleCloseMenu);
      window.removeEventListener("scroll", handleCloseMenu, true);
    };
  }, []);

  // TanStack Query to fetch file items (searchQuery only in key when viewMode === 'search')
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["files", viewMode, viewMode === "search" ? searchQuery : currentPath],
    queryFn: async () => {
      if (viewMode === "recent") return api.getRecent();
      if (viewMode === "favorites") return api.getFavorites();
      if (viewMode === "search") return api.searchFiles(searchQuery);
      const res = await api.getFiles(currentPath);
      return res.items;
    },
  });

  // Query favorites list to keep real favorite status in sync
  const { data: favoritesData } = useQuery({
    queryKey: ["favoritesList"],
    queryFn: () => api.getFavorites(),
  });

  const favoritesSet = useMemo(() => {
    return new Set((favoritesData || []).map((f) => f.path));
  }, [favoritesData]);

  // Listen to custom upload complete event to auto-refresh
  useEffect(() => {
    const handleUploaded = () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["quota"] });
    };
    window.addEventListener("storeit:file-uploaded", handleUploaded);
    return () => window.removeEventListener("storeit:file-uploaded", handleUploaded);
  }, [refetch, queryClient]);

  // Mutations for actions
  const deleteMutation = useMutation({
    mutationFn: (path: string) => api.deleteFile(path),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["quota"] });
      setSelectedFile(null);
    },
    onError: (err: any) => alert(err.message || "删除文件失败"),
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ path, favorite }: { path: string; favorite: boolean }) =>
      api.setFavorite(path, favorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoritesList"] });
      refetch();
    },
    onError: (err: any) => alert(err.message || "更新收藏失败"),
  });

  const handleOpen = (item: FileItem) => {
    if (item.isDirectory) {
      openFolder(item.path);
    } else {
      setPreviewFile(item);
    }
  };

  const handleDownload = (item: FileItem) => {
    const link = document.createElement("a");
    link.href = getDownloadUrl(item.path);
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (item: FileItem) => {
    if (confirm(`确定要彻底删除 ${item.isDirectory ? "文件夹" : "文件"} "${item.name}" 吗？此操作不可逆！`)) {
      deleteMutation.mutate(item.path);
    }
  };

  const handleToggleFavorite = (item: FileItem) => {
    favoriteMutation.mutate({ path: item.path, favorite: !item.isFavorite });
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(item);
    setContextMenu({
      x: Math.min(e.clientX, typeof window !== "undefined" ? window.innerWidth - 180 : e.clientX),
      y: Math.min(e.clientY, typeof window !== "undefined" ? window.innerHeight - 250 : e.clientY),
      item,
    });
  };

  // Map items with true favorite state
  const rawItems = (data as FileItem[]) || [];
  const items: FileItem[] = useMemo(() => {
    return rawItems.map((it) => ({
      ...it,
      isFavorite: viewMode === "favorites" ? true : favoritesSet.has(it.path),
    }));
  }, [rawItems, favoritesSet, viewMode]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-secondary" />
        <p className="text-sm">正在加载文件列表...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-destructive select-none gap-3">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <p className="text-base font-semibold">读取文件列表失败</p>
        <p className="text-xs text-muted-foreground">
          {(error as any)?.message || "可能登录会话已过期或网络断开"}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5 mt-2">
          <RefreshCw className="w-3.5 h-3.5" /> 重新加载
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground select-none">
        <div className="w-20 h-20 rounded-full bg-brand-secondary/10 flex items-center justify-center mb-4 text-brand-secondary">
          <FolderOpen className="w-10 h-10" />
        </div>
        <p className="text-base font-semibold text-brand-primary">
          {viewMode === "search"
            ? "未找到匹配的文件"
            : viewMode === "favorites"
            ? "收藏夹暂无文件"
            : viewMode === "recent"
            ? "暂无最近访问记录"
            : "此目录下暂无文件"}
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm text-center">
          {viewMode === "files"
            ? "直接将文件或文件夹拖拽至此，或点击右上角“上传”按钮开始添加"
            : "可在我的文件中右键或点击星标将重要文件添加至此"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 relative min-h-full">
      {layout === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {items.map((item) => (
            <FileCard
              key={item.path}
              item={item}
              onOpen={handleOpen}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
              onShare={(it) => setShareModalFile(it)}
              onMove={(it) => setMoveModalFile(it)}
              onRename={(it) => setRenameModalFile(it)}
              onPreview={(it) => setPreviewFile(it)}
              onContextMenu={handleContextMenu}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white/80 rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="py-2.5 px-3 w-10"></th>
                <th className="py-2.5 px-3">名称</th>
                <th className="py-2.5 px-3 w-28">大小</th>
                <th className="py-2.5 px-3 w-40 hidden sm:table-cell">修改时间</th>
                <th className="py-2.5 px-3 w-16 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <FileTableRow
                  key={item.path}
                  item={item}
                  onOpen={handleOpen}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                  onShare={(it) => setShareModalFile(it)}
                  onMove={(it) => setMoveModalFile(it)}
                  onRename={(it) => setRenameModalFile(it)}
                  onPreview={(it) => setPreviewFile(it)}
                  onContextMenu={handleContextMenu}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating Custom Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 w-44 bg-white/95 backdrop-blur-md rounded-2xl border shadow-xl p-1.5 text-xs animate-in fade-in-50 zoom-in-95 duration-100 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1.5 font-semibold text-foreground truncate border-b mb-1">
            {contextMenu.item.name}
          </div>

          {!contextMenu.item.isDirectory && isPreviewable(contextMenu.item.name) && (
            <button
              onClick={() => {
                setPreviewFile(contextMenu.item);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
            >
              <Eye className="w-3.5 h-3.5 text-brand-secondary" /> 预览
            </button>
          )}

          {!contextMenu.item.isDirectory && (
            <button
              onClick={() => {
                handleDownload(contextMenu.item);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
            >
              <Download className="w-3.5 h-3.5 text-brand-secondary" /> 下载
            </button>
          )}

          {!contextMenu.item.isDirectory && (
            <button
              onClick={() => {
                setShareModalFile(contextMenu.item);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
            >
              <Share2 className="w-3.5 h-3.5 text-brand-secondary" /> 分享
            </button>
          )}

          <button
            onClick={() => {
              handleToggleFavorite(contextMenu.item);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
          >
            <Star
              className={`w-3.5 h-3.5 ${
                contextMenu.item.isFavorite ? "fill-amber-500 text-amber-500" : ""
              }`}
            />
            {contextMenu.item.isFavorite ? "取消收藏" : "加入收藏"}
          </button>

          <button
            onClick={() => {
              setRenameModalFile(contextMenu.item);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
          >
            <Edit2 className="w-3.5 h-3.5 text-brand-secondary" /> 重命名
          </button>

          <button
            onClick={() => {
              setMoveModalFile(contextMenu.item);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
          >
            <FolderInput className="w-3.5 h-3.5 text-brand-secondary" /> 移动到...
          </button>

          <button
            onClick={() => {
              setSelectedFile(contextMenu.item);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
          >
            <Info className="w-3.5 h-3.5 text-brand-secondary" /> 属性与详情
          </button>

          <div className="h-px bg-black/5 my-1" />

          <button
            onClick={() => {
              handleDelete(contextMenu.item);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-destructive/10 text-left text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" /> 删除
          </button>
        </div>
      )}
    </div>
  );
}

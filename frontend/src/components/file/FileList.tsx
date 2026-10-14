"use client";

import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderOpen, RefreshCw } from "lucide-react";
import { FileItem } from "@/types";
import { api } from "@/lib/api";
import { useFileStore } from "@/stores/useFileStore";
import { FileCard } from "./FileCard";
import { FileTableRow } from "./FileTableRow";

export function FileList() {
  const queryClient = useQueryClient();
  const currentPath = useFileStore((s) => s.currentPath);
  const viewMode = useFileStore((s) => s.viewMode);
  const layout = useFileStore((s) => s.layout);
  const searchQuery = useFileStore((s) => s.searchQuery);
  const navigateToFolder = useFileStore((s) => s.navigateToFolder);
  const setPreviewFile = useFileStore((s) => s.setPreviewFile);
  const setShareModalFile = useFileStore((s) => s.setShareModalFile);
  const setMoveModalFile = useFileStore((s) => s.setMoveModalFile);
  const setRenameModalFile = useFileStore((s) => s.setRenameModalFile);

  // TanStack Query to fetch file items
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["files", viewMode, currentPath, searchQuery],
    queryFn: async () => {
      if (viewMode === "recent") return api.getRecent();
      if (viewMode === "favorites") return api.getFavorites();
      if (viewMode === "search") return api.searchFiles(searchQuery);
      const res = await api.getFiles(currentPath);
      return res.items;
    },
  });

  // Listen to custom upload complete event to auto-refresh
  useEffect(() => {
    const handleUploaded = () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["quota"] });
    };
    window.addEventListener("storeit:file-uploaded", handleUploaded);
    return () => window.removeEventListener("storeit:file-uploaded", handleUploaded);
  }, [refetch, queryClient]);

  // Mutations for quick actions
  const deleteMutation = useMutation({
    mutationFn: (path: string) => api.deleteFile(path),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["quota"] });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ path, favorite }: { path: string; favorite: boolean }) =>
      api.setFavorite(path, favorite),
    onSuccess: () => refetch(),
  });

  const handleOpen = (item: FileItem) => {
    if (item.isDirectory) {
      navigateToFolder(item.name);
    } else {
      setPreviewFile(item);
    }
  };

  const handleDownload = (item: FileItem) => {
    const link = document.createElement("a");
    link.href = `/storage/${encodeURIComponent(item.path)}`;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (item: FileItem) => {
    if (confirm(`确定要删除 ${item.isDirectory ? "文件夹" : "文件"} "${item.name}" 吗？此操作不可逆！`)) {
      deleteMutation.mutate(item.path);
    }
  };

  const handleToggleFavorite = (item: FileItem) => {
    favoriteMutation.mutate({ path: item.path, favorite: !item.isFavorite });
  };

  const items = (data as FileItem[]) || [];

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-secondary" />
        <p className="text-sm">正在加载文件列表...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground select-none">
        <div className="w-20 h-20 rounded-full bg-brand-secondary/10 flex items-center justify-center mb-4 text-brand-secondary">
          <FolderOpen className="w-10 h-10" />
        </div>
        <p className="text-base font-semibold text-brand-primary">此目录下暂无文件</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm text-center">
          直接将文件或文件夹拖拽至此，或点击右上角“上传”按钮开始添加
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
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
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

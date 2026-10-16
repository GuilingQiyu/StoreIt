"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
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
  Info,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckSquare,
  X
} from "lucide-react";
import { FileItem, SortField } from "@/types";
import { api } from "@/lib/api";
import { useFileStore } from "@/stores/useFileStore";
import { getDownloadUrl, isEditableText, isPreviewable } from "@/lib/utils";
import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileCard } from "./FileCard";
import { FileTableRow } from "./FileTableRow";

export function FileList() {
  const queryClient = useQueryClient();
  const currentPath = useFileStore((s) => s.currentPath);
  const viewMode = useFileStore((s) => s.viewMode);
  const layout = useFileStore((s) => s.layout);
  const sortBy = useFileStore((s) => s.sortBy);
  const sortOrder = useFileStore((s) => s.sortOrder);
  const setSort = useFileStore((s) => s.setSort);
  const searchQuery = useFileStore((s) => s.searchQuery);
  const selectedPaths = useFileStore((s) => s.selectedPaths);
  const setSelectedPaths = useFileStore((s) => s.setSelectedPaths);
  const clearSelection = useFileStore((s) => s.clearSelection);
  const openFolder = useFileStore((s) => s.openFolder);
  const openContainingFolder = useFileStore((s) => s.openContainingFolder);
  const setSelectedFile = useFileStore((s) => s.setSelectedFile);
  const setPreviewFile = useFileStore((s) => s.setPreviewFile);
  const openEditor = useFileStore((s) => s.openEditor);
  const setShareModalFile = useFileStore((s) => s.setShareModalFile);
  const setMoveModalFile = useFileStore((s) => s.setMoveModalFile);
  const setBatchMovePaths = useFileStore((s) => s.setBatchMovePaths);
  const setRenameModalFile = useFileStore((s) => s.setRenameModalFile);
  const showToast = useFileStore((s) => s.showToast);
  const openConfirm = useFileStore((s) => s.openConfirm);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: FileItem;
  } | null>(null);

  useEffect(() => {
    const handleCloseMenu = () => setContextMenu(null);
    window.addEventListener("click", handleCloseMenu);
    window.addEventListener("scroll", handleCloseMenu, true);
    return () => {
      window.removeEventListener("click", handleCloseMenu);
      window.removeEventListener("scroll", handleCloseMenu, true);
    };
  }, []);

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

  const { data: favoritesData } = useQuery({
    queryKey: ["favoritesList"],
    queryFn: () => api.getFavorites(),
  });

  const favoritesSet = useMemo(() => {
    return new Set((favoritesData || []).map((f) => f.path));
  }, [favoritesData]);

  // 300ms 防抖处理上传完成刷新事件，避免多文件文件夹上传引发请求风暴
  const uploadTimerRef = useRef<any>(null);
  useEffect(() => {
    const handleUploaded = () => {
      if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
      uploadTimerRef.current = setTimeout(() => {
        refetch();
        queryClient.invalidateQueries({ queryKey: ["quota"] });
      }, 300);
    };
    window.addEventListener("storeit:file-uploaded", handleUploaded);
    return () => {
      window.removeEventListener("storeit:file-uploaded", handleUploaded);
      if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    };
  }, [refetch, queryClient]);

  const deleteMutation = useMutation({
    mutationFn: (path: string) => api.deleteFile(path),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["quota"] });
      queryClient.invalidateQueries({ queryKey: ["favoritesList"] });
      setSelectedFile(null);
      showToast("删除成功", "success");
    },
    onError: (err: any) => showToast(err.message || "删除文件失败", "error"),
  });

  const batchDeleteMutation = useMutation({
    mutationFn: (paths: string[]) => api.batchDeleteFiles(paths),
    onSuccess: (_res, paths) => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["quota"] });
      queryClient.invalidateQueries({ queryKey: ["favoritesList"] });
      setSelectedFile(null);
      clearSelection();
      showToast(`已成功删除 ${paths.length} 个项目`, "success");
    },
    onError: (err: any) => showToast(err.message || "批量删除失败", "error"),
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ path, favorite }: { path: string; favorite: boolean }) =>
      api.setFavorite(path, favorite),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["favoritesList"] });
      refetch();
      showToast(vars.favorite ? "已加入收藏夹" : "已取消收藏", "success");
    },
    onError: (err: any) => showToast(err.message || "更新收藏失败", "error"),
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
    openConfirm({
      title: `确认删除${item.isDirectory ? "文件夹" : "文件"}`,
      description: `确定要彻底删除 "${item.name}" 吗？此操作不可撤销！`,
      confirmText: "彻底删除",
      destructive: true,
      onConfirm: () => deleteMutation.mutate(item.path),
    });
  };

  const handleBatchDelete = () => {
    if (selectedPaths.length === 0) return;
    openConfirm({
      title: `确认批量删除 (${selectedPaths.length} 项)`,
      description: `确定要彻底删除选中的 ${selectedPaths.length} 个文件或文件夹吗？此操作不可撤销！`,
      confirmText: "确认批量删除",
      destructive: true,
      onConfirm: () => batchDeleteMutation.mutate(selectedPaths),
    });
  };

  const handleBatchFavorite = async () => {
    for (const p of selectedPaths) {
      try {
        await api.setFavorite(p, true);
      } catch {}
    }
    queryClient.invalidateQueries({ queryKey: ["favoritesList"] });
    refetch();
    showToast(`已将 ${selectedPaths.length} 个项目加入收藏夹`, "success");
    clearSelection();
  };

  const handleToggleFavorite = (item: FileItem) => {
    favoriteMutation.mutate({ path: item.path, favorite: !item.isFavorite });
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(item);
    setContextMenu({
      x: Math.min(e.clientX, typeof window !== "undefined" ? window.innerWidth - 190 : e.clientX),
      y: Math.min(e.clientY, typeof window !== "undefined" ? window.innerHeight - 280 : e.clientY),
      item,
    });
  };

  // Map items with true favorite state and apply client-side sorting (folders always first)
  const rawItems = (data as FileItem[]) || [];
  const items: FileItem[] = useMemo(() => {
    const mapped = rawItems.map((it) => ({
      ...it,
      isFavorite: viewMode === "favorites" ? true : favoritesSet.has(it.path),
    }));
    const dirFactor = sortOrder === "asc" ? 1 : -1;
    return mapped.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      if (sortBy === "size") {
        return ((a.size || 0) - (b.size || 0)) * dirFactor;
      }
      if (sortBy === "modifiedTime") {
        return (Number(a.modifiedTime || 0) - Number(b.modifiedTime || 0)) * dirFactor;
      }
      return a.name.localeCompare(b.name, "zh-CN", { numeric: true }) * dirFactor;
    });
  }, [rawItems, favoritesSet, viewMode, sortBy, sortOrder]);

  const renderSortIcon = (field: SortField) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 text-brand-primary" />
    ) : (
      <ArrowDown className="w-3 h-3 text-brand-primary" />
    );
  };

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

  const allSelected = items.length > 0 && selectedPaths.length === items.length;

  return (
    <div className="flex-1 overflow-y-auto p-4 relative min-h-full space-y-3">
      {/* Top Toolbar: Sort controls & Multi-select Batch Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        {selectedPaths.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 bg-brand-primary text-white px-3.5 py-1.5 rounded-xl shadow-sm text-xs animate-in fade-in-50 duration-150">
            <span className="font-semibold">已选 {selectedPaths.length} 项</span>
            <button
              type="button"
              onClick={() =>
                allSelected
                  ? clearSelection()
                  : setSelectedPaths(items.map((it) => it.path))
              }
              className="px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 transition-colors"
            >
              {allSelected ? "取消全选" : "全选当前页"}
            </button>
            <button
              type="button"
              onClick={() => setBatchMovePaths(selectedPaths)}
              className="px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 flex items-center gap-1 transition-colors"
            >
              <FolderInput className="w-3.5 h-3.5" /> 批量移动
            </button>
            <button
              type="button"
              onClick={handleBatchFavorite}
              className="px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 flex items-center gap-1 transition-colors"
            >
              <Star className="w-3.5 h-3.5" /> 批量收藏
            </button>
            <button
              type="button"
              onClick={handleBatchDelete}
              className="px-2 py-0.5 rounded bg-rose-500/80 hover:bg-rose-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> 批量删除
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="p-0.5 rounded hover:bg-white/20 ml-1"
              title="退出多选"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-muted-foreground select-none">
            <span>共 {items.length} 项</span>
            <button
              type="button"
              onClick={() => setSelectedPaths(items.map((it) => it.path))}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-black/5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5" /> 全选
            </button>
          </div>
        )}

        <div className="flex items-center gap-1 text-xs select-none">
          <span className="text-muted-foreground mr-1">排序:</span>
          {(
            [
              { key: "name", label: "名称" },
              { key: "size", label: "大小" },
              { key: "modifiedTime", label: "时间" },
            ] as { key: SortField; label: string }[]
          ).map((col) => (
            <button
              key={col.key}
              type="button"
              onClick={() => setSort(col.key)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                sortBy === col.key
                  ? "bg-white shadow-sm text-brand-primary font-semibold"
                  : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
              }`}
            >
              <span>{col.label}</span>
              {renderSortIcon(col.key)}
            </button>
          ))}
        </div>
      </div>

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
              <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground select-none">
                <th className="py-2.5 px-3 w-16"></th>
                <th
                  onClick={() => setSort("name")}
                  className="py-2.5 px-3 cursor-pointer hover:text-brand-primary"
                >
                  <span className="inline-flex items-center gap-1">
                    名称 {renderSortIcon("name")}
                  </span>
                </th>
                <th
                  onClick={() => setSort("size")}
                  className="py-2.5 px-3 w-28 cursor-pointer hover:text-brand-primary"
                >
                  <span className="inline-flex items-center gap-1">
                    大小 {renderSortIcon("size")}
                  </span>
                </th>
                <th
                  onClick={() => setSort("modifiedTime")}
                  className="py-2.5 px-3 w-44 hidden sm:table-cell cursor-pointer hover:text-brand-primary"
                >
                  <span className="inline-flex items-center gap-1">
                    修改时间 {renderSortIcon("modifiedTime")}
                  </span>
                </th>
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
          className="fixed z-50 w-48 bg-white/95 backdrop-blur-md rounded-2xl border shadow-xl p-1.5 text-xs animate-in fade-in-50 zoom-in-95 duration-100 select-none"
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

          {!contextMenu.item.isDirectory && isEditableText(contextMenu.item.name) && (
            <button
              onClick={() => {
                openEditor(contextMenu.item);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
            >
              <Edit3 className="w-3.5 h-3.5 text-brand-secondary" /> 在线编辑
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

          {viewMode !== "files" && (
            <button
              onClick={() => {
                openContainingFolder(contextMenu.item);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-black/5 text-left text-foreground"
            >
              <FolderOpen className="w-3.5 h-3.5 text-brand-secondary" /> 打开所在目录
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

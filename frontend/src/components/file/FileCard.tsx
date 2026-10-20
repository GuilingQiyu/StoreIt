"use client";

import React from "react";
import { 
  Folder, 
  FileText, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileCode, 
  FileArchive, 
  Star, 
  MoreVertical,
  Download,
  Share2,
  Trash2,
  FolderInput,
  Copy,
  FolderOpen,
  Edit2,
  Edit3,
  Eye,
  Check
} from "lucide-react";
import { FileItem } from "@/types";
import { useFileStore } from "@/stores/useFileStore";
import { formatBytes, getFileCategory, getParentDirectory, isEditableText, isPreviewable } from "@/lib/utils";
import { Edit3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FileCardProps {
  item: FileItem;
  index?: number;
  onOpen: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
  onDelete: (item: FileItem) => void;
  onToggleFavorite: (item: FileItem) => void;
  onShare: (item: FileItem) => void;
  onMove: (item: FileItem) => void;
  onCopy?: (item: FileItem) => void;
  onRename: (item: FileItem) => void;
  onPreview: (item: FileItem) => void;
  onContextMenu?: (e: React.MouseEvent, item: FileItem) => void;
}

export function FileCard({
  item,
  index = 0,
  onOpen,
  onDownload,
  onDelete,
  onToggleFavorite,
  onShare,
  onMove,
  onCopy,
  onRename,
  onPreview,
  onContextMenu,
}: FileCardProps) {
  const selectedFile = useFileStore((s) => s.selectedFile);
  const setSelectedFile = useFileStore((s) => s.setSelectedFile);
  const selectedPaths = useFileStore((s) => s.selectedPaths);
  const toggleSelectPath = useFileStore((s) => s.toggleSelectPath);
  const viewMode = useFileStore((s) => s.viewMode);
  const openContainingFolder = useFileStore((s) => s.openContainingFolder);
  const openEditor = useFileStore((s) => s.openEditor);
  const openCopyModal = useFileStore((s) => s.openCopyModal);

  const isSelected = selectedFile?.path === item.path;
  const isChecked = selectedPaths.includes(item.path);
  const parentDir = getParentDirectory(item.path);
  const showParentBadge = viewMode !== "files" && Boolean(parentDir);

  const renderIcon = () => {
    if (item.isDirectory) {
      return <Folder className="w-12 h-12 text-amber-500 fill-amber-500/20 transition-transform duration-200 group-hover:scale-105" />;
    }
    const cat = getFileCategory(item.name);
    const cls = "w-12 h-12 transition-transform duration-200 group-hover:scale-105";
    switch (cat) {
      case "image":
        return <FileImage className={`${cls} text-purple-500`} />;
      case "video":
        return <FileVideo className={`${cls} text-rose-500`} />;
      case "audio":
        return <FileAudio className={`${cls} text-emerald-500`} />;
      case "code":
        return <FileCode className={`${cls} text-blue-500`} />;
      case "archive":
        return <FileArchive className={`${cls} text-amber-600`} />;
      case "pdf":
        return <FileText className={`${cls} text-red-500`} />;
      case "document":
        return <FileText className={`${cls} text-sky-500`} />;
      default:
        return <FileText className={`${cls} text-muted-foreground`} />;
    }
  };

  return (
    <div
      style={{ animationDelay: `${Math.min(index * 15, 180)}ms` }}
      onClick={(e) => {
        if (e.ctrlKey || e.metaKey) {
          toggleSelectPath(item.path);
        }
        setSelectedFile(item);
      }}
      onDoubleClick={() => onOpen(item)}
      onContextMenu={(e) => onContextMenu?.(e, item)}
      className={`storeit-card-enter group relative flex flex-col items-center justify-between p-4 rounded-2xl bg-white/80 hover:bg-white border cursor-pointer shadow-sm hover:shadow-md select-none ${
        isChecked || isSelected
          ? "ring-2 ring-brand-primary border-transparent bg-white shadow-md"
          : "hover:-translate-y-1"
      }`}
    >
      {/* Top action row */}
      <div className="w-full flex items-center justify-between text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSelectPath(item.path);
            }}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              isChecked
                ? "bg-brand-primary border-brand-primary text-white opacity-100 scale-105"
                : "border-black/25 bg-white/80 opacity-0 group-hover:opacity-100"
            }`}
            title={isChecked ? "取消选择" : "多选此项"}
          >
            {isChecked && <Check className="w-3 h-3" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item);
            }}
            className={`hover:text-amber-500 transition-transform active:scale-125 ${
              item.isFavorite
                ? "text-amber-500 fill-amber-500 opacity-100"
                : "opacity-60 group-hover:opacity-100"
            }`}
            title={item.isFavorite ? "取消收藏" : "加入收藏"}
          >
            <Star className={`w-4 h-4 ${item.isFavorite ? "fill-amber-500" : ""}`} />
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-60 group-hover:opacity-100">
              <MoreVertical className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 storeit-menu-pop">
            {!item.isDirectory ? (
              <>
                {isPreviewable(item.name) && (
                  <DropdownMenuItem onClick={() => onPreview(item)} className="gap-2">
                    <Eye className="w-4 h-4 text-brand-secondary" /> 预览
                  </DropdownMenuItem>
                )}
                {isEditableText(item.name) && (
                  <DropdownMenuItem onClick={() => openEditor(item)} className="gap-2">
                    <Edit3 className="w-4 h-4 text-brand-secondary" /> 在线编辑
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDownload(item)} className="gap-2">
                  <Download className="w-4 h-4 text-brand-secondary" /> 下载
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(item)} className="gap-2">
                  <Share2 className="w-4 h-4 text-brand-secondary" /> 分享
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => onDownload(item)} className="gap-2">
                  <Download className="w-4 h-4 text-brand-secondary" /> 打包下载 (.zip)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(item)} className="gap-2">
                  <Share2 className="w-4 h-4 text-brand-secondary" /> 共享文件夹 (R/RW)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {viewMode !== "files" && (
              <DropdownMenuItem onClick={() => openContainingFolder(item)} className="gap-2">
                <FolderOpen className="w-4 h-4 text-brand-secondary" /> 打开所在目录
              </DropdownMenuItem>
            )}
            {viewMode !== "files" && (
              <DropdownMenuItem onClick={() => openContainingFolder(item)} className="gap-2">
                <FolderOpen className="w-4 h-4 text-brand-secondary" /> 打开所在目录
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onRename(item)} className="gap-2">
              <Edit2 className="w-4 h-4 text-brand-secondary" /> 重命名
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMove(item)} className="gap-2">
              <FolderInput className="w-4 h-4 text-brand-secondary" /> 移动到...
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => (onCopy ? onCopy(item) : openCopyModal(item))}
              className="gap-2"
            >
              <Copy className="w-4 h-4 text-brand-secondary" /> 复制到...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(item)}
              className="gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4" /> 删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center icon */}
      <div className="my-2">{renderIcon()}</div>

      {/* File name & size */}
      <div className="w-full text-center">
        <p
          className="text-xs font-medium text-foreground truncate px-1"
          title={item.name}
        >
          {item.name}
        </p>
        <span className="text-[11px] text-muted-foreground block mt-0.5 truncate">
          {item.isDirectory ? "文件夹" : formatBytes(item.size || 0)}
          {showParentBadge ? ` · /${parentDir}` : ""}
        </span>
      </div>
    </div>
  );
}

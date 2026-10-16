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
  MoreHorizontal,
  Download,
  Share2,
  Trash2,
  FolderInput,
  FolderOpen,
  Edit2,
  Eye,
  Check
} from "lucide-react";
import { FileItem } from "@/types";
import { useFileStore } from "@/stores/useFileStore";
import { formatBytes, formatDate, getFileCategory, getParentDirectory, isEditableText, isPreviewable } from "@/lib/utils";
import { Edit3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FileTableRowProps {
  item: FileItem;
  onOpen: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
  onDelete: (item: FileItem) => void;
  onToggleFavorite: (item: FileItem) => void;
  onShare: (item: FileItem) => void;
  onMove: (item: FileItem) => void;
  onRename: (item: FileItem) => void;
  onPreview: (item: FileItem) => void;
  onContextMenu?: (e: React.MouseEvent, item: FileItem) => void;
}

export function FileTableRow({
  item,
  onOpen,
  onDownload,
  onDelete,
  onToggleFavorite,
  onShare,
  onMove,
  onRename,
  onPreview,
  onContextMenu,
}: FileTableRowProps) {
  const selectedFile = useFileStore((s) => s.selectedFile);
  const setSelectedFile = useFileStore((s) => s.setSelectedFile);
  const selectedPaths = useFileStore((s) => s.selectedPaths);
  const toggleSelectPath = useFileStore((s) => s.toggleSelectPath);
  const viewMode = useFileStore((s) => s.viewMode);
  const openContainingFolder = useFileStore((s) => s.openContainingFolder);
  const openEditor = useFileStore((s) => s.openEditor);

  const isSelected = selectedFile?.path === item.path;
  const isChecked = selectedPaths.includes(item.path);
  const parentDir = getParentDirectory(item.path);
  const showParentBadge = viewMode !== "files" && Boolean(parentDir);

  const renderIcon = () => {
    if (item.isDirectory) {
      return <Folder className="w-5 h-5 text-amber-500 fill-amber-500/20" />;
    }
    const cat = getFileCategory(item.name);
    switch (cat) {
      case "image":
        return <FileImage className="w-5 h-5 text-purple-500" />;
      case "video":
        return <FileVideo className="w-5 h-5 text-rose-500" />;
      case "audio":
        return <FileAudio className="w-5 h-5 text-emerald-500" />;
      case "code":
        return <FileCode className="w-5 h-5 text-blue-500" />;
      case "archive":
        return <FileArchive className="w-5 h-5 text-amber-600" />;
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <tr
      onClick={(e) => {
        if (e.ctrlKey || e.metaKey) {
          toggleSelectPath(item.path);
        }
        setSelectedFile(item);
      }}
      onDoubleClick={() => onOpen(item)}
      onContextMenu={(e) => onContextMenu?.(e, item)}
      className={`border-b transition-colors cursor-pointer select-none group ${
        isChecked || isSelected ? "bg-brand-primary/10" : "hover:bg-white/80"
      }`}
    >
      <td className="py-2.5 px-3 w-16">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSelectPath(item.path);
            }}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              isChecked
                ? "bg-brand-primary border-brand-primary text-white"
                : "border-black/25 bg-white hover:border-brand-primary"
            }`}
          >
            {isChecked && <Check className="w-3 h-3" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item);
            }}
            className={`text-muted-foreground/40 hover:text-amber-500 transition-colors ${
              item.isFavorite ? "text-amber-500 fill-amber-500 opacity-100" : ""
            }`}
          >
            <Star className={`w-4 h-4 ${item.isFavorite ? "fill-amber-500" : ""}`} />
          </button>
        </div>
      </td>

      <td className="py-2.5 px-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0">{renderIcon()}</div>
          <div className="min-w-0">
            <span className="font-medium text-sm text-foreground truncate block max-w-md" title={item.name}>
              {item.name}
            </span>
            {showParentBadge && (
              <span className="text-[11px] text-muted-foreground font-mono block truncate">
                所在目录: /{parentDir}
              </span>
            )}
          </div>
        </div>
      </td>

      <td className="py-2.5 px-3 text-xs text-muted-foreground whitespace-nowrap">
        {item.isDirectory ? "--" : formatBytes(item.size || 0)}
      </td>

      <td className="py-2.5 px-3 text-xs text-muted-foreground whitespace-nowrap hidden sm:table-cell">
        {formatDate(item.modifiedTime)}
      </td>

      <td className="py-2.5 px-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {!item.isDirectory && (
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(item)}
              className="gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4" /> 删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

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
  Edit2,
  Eye
} from "lucide-react";
import { FileItem } from "@/types";
import { useFileStore } from "@/stores/useFileStore";
import { formatBytes, formatDate, getFileCategory } from "@/lib/utils";
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
  const isSelected = selectedFile?.path === item.path;

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
      onClick={() => setSelectedFile(item)}
      onDoubleClick={() => onOpen(item)}
      onContextMenu={(e) => onContextMenu?.(e, item)}
      className={`border-b transition-colors cursor-pointer select-none group ${
        isSelected ? "bg-brand-primary/10" : "hover:bg-white/80"
      }`}
    >
      <td className="py-2.5 px-3 w-10">
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
      </td>

      <td className="py-2.5 px-3">
        <div className="flex items-center gap-3">
          <div className="shrink-0">{renderIcon()}</div>
          <span className="font-medium text-sm text-foreground truncate max-w-md" title={item.name}>
            {item.name}
          </span>
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
          <DropdownMenuContent align="end" className="w-40">
            {!item.isDirectory && (
              <>
                <DropdownMenuItem onClick={() => onPreview(item)} className="gap-2">
                  <Eye className="w-4 h-4 text-brand-secondary" /> 预览
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(item)} className="gap-2">
                  <Download className="w-4 h-4 text-brand-secondary" /> 下载
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(item)} className="gap-2">
                  <Share2 className="w-4 h-4 text-brand-secondary" /> 分享
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
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

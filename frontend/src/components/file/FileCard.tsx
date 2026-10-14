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
  Edit2,
  Eye
} from "lucide-react";
import { FileItem } from "@/types";
import { useFileStore } from "@/stores/useFileStore";
import { formatBytes, getFileCategory } from "@/lib/utils";
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
  onOpen: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
  onDelete: (item: FileItem) => void;
  onToggleFavorite: (item: FileItem) => void;
  onShare: (item: FileItem) => void;
  onMove: (item: FileItem) => void;
  onRename: (item: FileItem) => void;
  onPreview: (item: FileItem) => void;
}

export function FileCard({
  item,
  onOpen,
  onDownload,
  onDelete,
  onToggleFavorite,
  onShare,
  onMove,
  onRename,
  onPreview,
}: FileCardProps) {
  const selectedFile = useFileStore((s) => s.selectedFile);
  const setSelectedFile = useFileStore((s) => s.setSelectedFile);
  const isSelected = selectedFile?.path === item.path;

  const renderIcon = () => {
    if (item.isDirectory) {
      return <Folder className="w-12 h-12 text-amber-500 fill-amber-500/20" />;
    }
    const cat = getFileCategory(item.name);
    switch (cat) {
      case "image":
        return <FileImage className="w-12 h-12 text-purple-500" />;
      case "video":
        return <FileVideo className="w-12 h-12 text-rose-500" />;
      case "audio":
        return <FileAudio className="w-12 h-12 text-emerald-500" />;
      case "code":
        return <FileCode className="w-12 h-12 text-blue-500" />;
      case "archive":
        return <FileArchive className="w-12 h-12 text-amber-600" />;
      case "pdf":
        return <FileText className="w-12 h-12 text-red-500" />;
      case "document":
        return <FileText className="w-12 h-12 text-sky-500" />;
      default:
        return <FileText className="w-12 h-12 text-muted-foreground" />;
    }
  };

  return (
    <div
      onClick={() => setSelectedFile(item)}
      onDoubleClick={() => onOpen(item)}
      className={`group relative flex flex-col items-center justify-between p-4 rounded-2xl bg-white/80 hover:bg-white border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md select-none ${
        isSelected
          ? "ring-2 ring-brand-primary border-transparent bg-white shadow-md"
          : "hover:-translate-y-1"
      }`}
    >
      {/* Top action row */}
      <div className="w-full flex items-center justify-between text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item);
          }}
          className={`hover:text-amber-500 transition-colors ${
            item.isFavorite ? "text-amber-500 fill-amber-500 opacity-100" : ""
          }`}
          title={item.isFavorite ? "取消收藏" : "加入收藏"}
        >
          <Star className={`w-4 h-4 ${item.isFavorite ? "fill-amber-500" : ""}`} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="w-3.5 h-3.5" />
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
        <span className="text-[11px] text-muted-foreground block mt-0.5">
          {item.isDirectory ? "文件夹" : formatBytes(item.size || 0)}
        </span>
      </div>
    </div>
  );
}

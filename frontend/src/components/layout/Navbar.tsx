"use client";

import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  HardDrive, 
  Search, 
  LayoutGrid, 
  List, 
  Upload, 
  FolderPlus, 
  LogOut, 
  User as UserIcon,
  ChevronDown
} from "lucide-react";
import { api } from "@/lib/api";
import { useFileStore } from "@/stores/useFileStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUploadStore } from "@/stores/useUploadStore";
import { formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const currentPath = useFileStore((s) => s.currentPath);
  const layout = useFileStore((s) => s.layout);
  const setLayout = useFileStore((s) => s.setLayout);
  const searchQuery = useFileStore((s) => s.searchQuery);
  const setSearchQuery = useFileStore((s) => s.setSearchQuery);
  const setViewMode = useFileStore((s) => s.setViewMode);
  const setNewFolderModalOpen = useFileStore((s) => s.setNewFolderModalOpen);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const addFile = useUploadStore((s) => s.addFile);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const { data: quota } = useQuery({
    queryKey: ["quota"],
    queryFn: () => api.getQuota(),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setViewMode("search");
    }
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      addFile(files[i], currentPath);
    }
    e.target.value = "";
  };

  const handleFoldersSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // webkitRelativePath contains the relative directory path
      const relPath = file.webkitRelativePath || "";
      const pathParts = relPath.split("/");
      pathParts.pop(); // Remove filename
      const subDir = pathParts.join("/");
      const targetDir = subDir
        ? currentPath
          ? `${currentPath}/${subDir}`
          : subDir
        : currentPath;
      addFile(file, targetDir);
    }
    e.target.value = "";
  };

  return (
    <header className="h-16 px-6 bg-white/80 backdrop-blur-md border-b flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Brand logo */}
      <div 
        onClick={() => {
          setViewMode("files");
          useFileStore.getState().setCurrentPath("");
        }}
        className="flex items-center gap-2.5 cursor-pointer shrink-0"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white flex items-center justify-center shadow-md">
          <HardDrive className="w-5 h-5" />
        </div>
        <span className="font-extrabold text-lg text-brand-primary tracking-tight hidden sm:inline-block">
          储之 <span className="text-xs font-normal text-brand-secondary ml-0.5">StoreIt</span>
        </span>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="搜索文件名..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 bg-muted/40 border-0 focus-visible:bg-white focus-visible:ring-1 rounded-xl text-xs"
        />
      </form>

      {/* Action controls */}
      <div className="flex items-center gap-3">
        {/* Hidden File inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFilesSelected}
        />
        <input
          ref={folderInputRef}
          type="file"
          // @ts-ignore
          webkitdirectory=""
          multiple
          className="hidden"
          onChange={handleFoldersSelected}
        />

        {/* Upload Buttons */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5 rounded-xl shadow-sm">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">上传</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-2">
              <Upload className="w-4 h-4 text-brand-secondary" /> 上传单个 / 多文件
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => folderInputRef.current?.click()} className="gap-2">
              <FolderPlus className="w-4 h-4 text-brand-secondary" /> 上传整个文件夹
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setNewFolderModalOpen(true)}
          className="gap-1.5 rounded-xl hidden sm:flex"
        >
          <FolderPlus className="w-4 h-4 text-amber-500" /> 新建文件夹
        </Button>

        {/* Layout toggle (grid/list) */}
        <div className="flex items-center border rounded-xl p-0.5 bg-muted/40">
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-lg ${layout === "grid" ? "bg-white shadow-sm text-brand-primary" : "text-muted-foreground"}`}
            onClick={() => setLayout("grid")}
            title="网格视图"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-lg ${layout === "list" ? "bg-white shadow-sm text-brand-primary" : "text-muted-foreground"}`}
            onClick={() => setLayout("list")}
            title="列表视图"
          >
            <List className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Storage Quota display */}
        {quota && quota.total > 0 && (
          <div className="hidden lg:flex flex-col text-[11px] text-muted-foreground shrink-0 w-28">
            <div className="flex justify-between mb-0.5 font-medium">
              <span>{formatBytes(quota.used)}</span>
              <span>{formatBytes(quota.total)}</span>
            </div>
            <div className="w-full h-1.5 bg-secondary/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-primary rounded-full transition-all"
                style={{ width: `${Math.min(100, (quota.used / quota.total) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-3 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-xs font-semibold text-foreground hidden sm:inline">
                {user?.username}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2 border-b">
              <p className="text-sm font-semibold truncate">{user?.username}</p>
              <p className="text-xs text-muted-foreground">角色: {user?.role || "USER"}</p>
            </div>
            <DropdownMenuItem
              onClick={() => logout()}
              className="gap-2 text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> 退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

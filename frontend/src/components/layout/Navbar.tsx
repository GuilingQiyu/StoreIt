"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  HardDrive, 
  Search, 
  LayoutGrid, 
  List, 
  Upload, 
  FolderPlus, 
  FilePlus2,
  LogOut, 
  Menu,
  ChevronDown,
  KeyRound,
  Palette,
  Globe,
  Check
} from "lucide-react";
import { useFileStore, useI18n } from "@/stores/useFileStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUploadStore } from "@/stores/useUploadStore";
import { THEME_OPTIONS, applyThemeToDom, getSavedTheme } from "@/lib/utils";
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
  const theme = useFileStore((s) => s.theme);
  const setTheme = useFileStore((s) => s.setTheme);
  const searchQuery = useFileStore((s) => s.searchQuery);
  const setSearchQuery = useFileStore((s) => s.setSearchQuery);
  const viewMode = useFileStore((s) => s.viewMode);
  const setViewMode = useFileStore((s) => s.setViewMode);
  const setNewFolderModalOpen = useFileStore((s) => s.setNewFolderModalOpen);
  const setNewFileModalOpen = useFileStore((s) => s.setNewFileModalOpen);
  const setPasswordModalOpen = useFileStore((s) => s.setPasswordModalOpen);
  const toggleSidebar = useFileStore((s) => s.toggleSidebar);
  const { locale, isEn, localeAuto, setLocale, t } = useI18n();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const enqueueWithConflictCheck = useUploadStore((s) => s.enqueueWithConflictCheck);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const searchDebounceRef = useRef<any>(null);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const saved = getSavedTheme();
    applyThemeToDom(saved);
    useFileStore.setState({ theme: saved });
    useFileStore.getState().syncLocaleFromBrowser();
  }, []);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const triggerSearch = (rawValue: string) => {
    const query = rawValue.trim();
    if (query) {
      setSearchQuery(query);
      if (useFileStore.getState().viewMode !== "search") {
        setViewMode("search");
      }
    } else {
      setSearchQuery("");
      if (useFileStore.getState().viewMode === "search") {
        setViewMode("files");
      }
    }
  };

  const handleSearchChange = (val: string) => {
    setLocalSearch(val);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      triggerSearch(val);
    }, 300);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    triggerSearch(localSearch);
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (viewMode !== "files") setViewMode("files");
    const entries = [];
    for (let i = 0; i < files.length; i++) {
      entries.push({ file: files[i], subPath: "" });
    }
    enqueueWithConflictCheck(entries, [], currentPath);
    e.target.value = "";
  };

  const handleFoldersSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (viewMode !== "files") setViewMode("files");
    const entries = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relPath = file.webkitRelativePath || "";
      const pathParts = relPath.split("/");
      pathParts.pop();
      const subDir = pathParts.join("/");
      entries.push({ file, subPath: subDir });
    }
    enqueueWithConflictCheck(entries, [], currentPath);
    e.target.value = "";
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      window.location.href = "/login";
    }
  };

  const activeThemeMeta = THEME_OPTIONS.find((item) => item.key === theme) || THEME_OPTIONS[0];
  const activeThemeLabel = isEn ? activeThemeMeta.labelEn : activeThemeMeta.label;

  return (
    <header className="h-16 px-4 sm:px-6 bg-white/80 backdrop-blur-md border-b flex items-center justify-between gap-3 sticky top-0 z-30 select-none">
      {/* Brand logo & Mobile hamburger */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 text-brand-primary"
          onClick={() => toggleSidebar()}
          title={t("打开侧边菜单", "Open sidebar menu")}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div 
          onClick={() => {
            useFileStore.getState().setCurrentPath("");
            setViewMode("files");
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105">
            <HardDrive className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg text-brand-primary tracking-tight hidden sm:inline-block">
            {isEn ? (
              "StoreIt"
            ) : (
              <>
                储之 <span className="text-xs font-normal text-brand-secondary ml-0.5">StoreIt</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Search Bar (with 300ms live debounce) */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xs sm:max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("输入关键词实时搜索文件...", "Search files in real time...")}
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 h-9 bg-muted/40 border-0 focus-visible:bg-white focus-visible:ring-1 rounded-xl text-xs transition-all duration-150"
        />
      </form>

      {/* Action controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5 rounded-xl shadow-sm px-2.5 sm:px-3">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">{t("上传", "Upload")}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 storeit-menu-pop">
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-2">
              <Upload className="w-4 h-4 text-brand-secondary" />
              {t("上传单个 / 多文件", "Upload Files")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => folderInputRef.current?.click()} className="gap-2">
              <FolderPlus className="w-4 h-4 text-brand-secondary" />
              {t("上传整个文件夹", "Upload Folder")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setNewFileModalOpen(true)} className="gap-2">
              <FilePlus2 className="w-4 h-4 text-brand-secondary" />
              {t("新建文本 / Markdown", "New Text / Markdown")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setNewFolderModalOpen(true)} className="gap-2">
              <FolderPlus className="w-4 h-4 text-amber-500" />
              {t("新建文件夹", "New Folder")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setNewFileModalOpen(true)}
          className="gap-1.5 rounded-xl hidden lg:flex"
          title={t("新建空白文本或 Markdown 文档", "Create a new text or Markdown file")}
        >
          <FilePlus2 className="w-4 h-4 text-brand-secondary" />
          {t("新建文件", "New File")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setNewFolderModalOpen(true)}
          className="gap-1.5 rounded-xl hidden sm:flex"
        >
          <FolderPlus className="w-4 h-4 text-amber-500" />
          {t("新建文件夹", "New Folder")}
        </Button>

        <div className="flex items-center border rounded-xl p-0.5 bg-muted/40">
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-lg transition-all duration-150 ${layout === "grid" ? "bg-white shadow-sm text-brand-primary" : "text-muted-foreground"}`}
            onClick={() => setLayout("grid")}
            title={t("网格视图", "Grid view")}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-lg transition-all duration-150 ${layout === "list" ? "bg-white shadow-sm text-brand-primary" : "text-muted-foreground"}`}
            onClick={() => setLayout("list")}
            title={t("列表视图", "List view")}
          >
            <List className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Language Switcher (next to Theme Switcher & User Menu) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 px-2.5 h-9 rounded-xl border border-transparent hover:border-border"
              title={t("切换语言 (Language)", "Switch Language")}
            >
              <Globe className="w-4 h-4 text-brand-primary" />
              <span className="text-xs font-medium text-foreground hidden md:inline">
                {isEn ? "EN" : "中文"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 storeit-menu-pop p-1.5">
            <div className="px-2.5 py-1.5 border-b mb-1">
              <p className="text-xs font-semibold text-brand-primary">
                {t("界面语言 (Language)", "Language")}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t("非中文浏览器自动切换为英文", "Auto-switches to English on non-Chinese browsers")}
              </p>
            </div>
            <DropdownMenuItem
              onClick={() => setLocale("auto")}
              className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg cursor-pointer"
            >
              <div>
                <p className={`text-xs ${localeAuto ? "font-bold text-brand-primary" : "font-medium"}`}>
                  {t("跟随浏览器 (自动)", "Follow Browser (Auto)")}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("根据系统/浏览器语言自动匹配", "Detect from browser language")}
                </p>
              </div>
              {localeAuto && <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLocale("zh")}
              className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg cursor-pointer"
            >
              <span className={`text-xs ${!localeAuto && locale === "zh" ? "font-bold text-brand-primary" : "font-medium"}`}>
                简体中文 (zh-CN)
              </span>
              {!localeAuto && locale === "zh" && (
                <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLocale("en")}
              className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg cursor-pointer"
            >
              <span className={`text-xs ${!localeAuto && locale === "en" ? "font-bold text-brand-primary" : "font-medium"}`}>
                English (en-US)
              </span>
              {!localeAuto && locale === "en" && (
                <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 px-2.5 h-9 rounded-xl border border-transparent hover:border-border"
              title={`${t("切换界面主题", "Switch Theme")} (${activeThemeLabel})`}
            >
              <Palette className="w-4 h-4 text-brand-primary" />
              <span
                className="w-2.5 h-2.5 rounded-full border border-white shadow-sm shrink-0"
                style={{ backgroundColor: activeThemeMeta.swatch }}
              />
              <span className="text-xs font-medium text-foreground hidden xl:inline">
                {activeThemeLabel}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 storeit-menu-pop p-1.5">
            <div className="px-2.5 py-1.5 border-b mb-1">
              <p className="text-xs font-semibold text-brand-primary">
                {t("界面主题色切换", "Theme Palette")}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t("选择配色方案（自动记忆）", "Choose a color palette (auto-saved)")}
              </p>
            </div>
            {THEME_OPTIONS.map((opt) => {
              const active = theme === opt.key;
              return (
                <DropdownMenuItem
                  key={opt.key}
                  onClick={() => setTheme(opt.key)}
                  className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shadow-sm shrink-0"
                      style={{ backgroundColor: opt.swatch }}
                    />
                    <div className="min-w-0">
                      <p className={`text-xs ${active ? "font-bold text-brand-primary" : "font-medium text-foreground"}`}>
                        {isEn ? opt.labelEn : opt.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {isEn ? opt.descEn : opt.desc}
                      </p>
                    </div>
                  </div>
                  {active && <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-2 sm:pr-3 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-xs font-semibold text-foreground hidden sm:inline">
                {user?.username}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 storeit-menu-pop">
            <div className="px-3 py-2 border-b">
              <p className="text-sm font-semibold truncate">{user?.username}</p>
              <p className="text-xs text-muted-foreground">
                {t("角色", "Role")}: {user?.role || "USER"}
              </p>
            </div>
            <DropdownMenuItem
              onClick={() => setPasswordModalOpen(true)}
              className="gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-brand-secondary" />
              {t("修改登录口令", "Change Password")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              {t("退出登录", "Sign Out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

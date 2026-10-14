"use client";

import React from "react";
import { Home, ChevronRight } from "lucide-react";
import { useFileStore } from "@/stores/useFileStore";

export function Breadcrumb() {
  const currentPath = useFileStore((s) => s.currentPath);
  const setCurrentPath = useFileStore((s) => s.setCurrentPath);
  const viewMode = useFileStore((s) => s.viewMode);
  const setViewMode = useFileStore((s) => s.setViewMode);

  if (viewMode !== "files" && viewMode !== "search") {
    const titles: Record<string, string> = {
      recent: "最近访问",
      favorites: "收藏夹",
      shares: "我的分享",
      admin: "用户管理",
      settings: "系统设置",
      about: "关于",
    };
    return (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground py-2 select-none">
        <button
          onClick={() => {
            setViewMode("files");
            setCurrentPath("");
          }}
          className="hover:text-brand-primary flex items-center gap-1 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>首页</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-black/30" />
        <span className="font-semibold text-brand-primary">
          {titles[viewMode] || viewMode}
        </span>
      </div>
    );
  }

  const parts = currentPath ? currentPath.split("/").filter(Boolean) : [];

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground py-2 select-none overflow-x-auto">
      <button
        onClick={() => {
          setViewMode("files");
          setCurrentPath("");
        }}
        className="hover:text-brand-primary flex items-center gap-1 transition-colors shrink-0"
      >
        <Home className="w-4 h-4" />
        <span>首页</span>
      </button>

      {parts.map((part, idx) => {
        const pathUpToHere = parts.slice(0, idx + 1).join("/");
        const isLast = idx === parts.length - 1;

        return (
          <React.Fragment key={pathUpToHere}>
            <ChevronRight className="w-3.5 h-3.5 text-black/30 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-brand-primary shrink-0 truncate max-w-[200px]">
                {part}
              </span>
            ) : (
              <button
                onClick={() => setCurrentPath(pathUpToHere)}
                className="hover:text-brand-primary transition-colors shrink-0 truncate max-w-[150px]"
              >
                {part}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

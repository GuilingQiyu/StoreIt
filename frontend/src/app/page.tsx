"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFileStore } from "@/stores/useFileStore";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DropZone } from "@/components/file/DropZone";
import { Breadcrumb } from "@/components/file/Breadcrumb";
import { FileList } from "@/components/file/FileList";
import { SharesTab } from "@/components/file/SharesTab";
import { UserManagementTab } from "@/components/admin/UserManagementTab";
import { SettingsTab } from "@/components/settings/SettingsTab";
import { AboutTab } from "@/components/file/AboutTab";
import { UploadDrawer } from "@/components/upload/UploadDrawer";
import { NewFolderModal } from "@/components/file/NewFolderModal";
import { RenameModal } from "@/components/file/RenameModal";
import { MoveModal } from "@/components/file/MoveModal";
import { ShareModal } from "@/components/file/ShareModal";
import { PreviewModal } from "@/components/preview/PreviewModal";

export default function MainPage() {
  const router = useRouter();
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore();
  const viewMode = useFileStore((s) => s.viewMode);

  // URL ↔ 视图模式同步：启动时识别后端映射的 /about 与 hash，
  // 浏览器前进/后退（popstate）时恢复对应视图
  useEffect(() => {
    const VALID_MODES = ["files", "recent", "favorites", "shares", "admin", "settings", "about", "search"];
    if (window.location.pathname === "/about" && !window.location.hash) {
      // 后端将 /about 转发到首页，仅在首次加载时用 replaceState 写入 hash，避免 pushState 造成后退死循环
      window.history.replaceState(null, "", "#/about");
      useFileStore.setState({ viewMode: "about", selectedFile: null });
    }
    const applyLocation = () => {
      const mode = window.location.hash.replace(/^#\/?/, "") || "files";
      if (VALID_MODES.includes(mode)) {
        useFileStore.setState({ viewMode: mode as any, selectedFile: null });
      }
    };
    applyLocation();
    window.addEventListener("popstate", applyLocation);
    return () => window.removeEventListener("popstate", applyLocation);
  }, []);

  useEffect(() => {
    checkAuth().then((loggedIn) => {
      if (!loggedIn) {
        router.push("/login");
      }
    });
  }, [checkAuth, router]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-muted-foreground gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-secondary" />
        <span className="text-sm">正在加载 StoreIt 存储服务...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-brand-bg">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden bg-white/40">
          <DropZone>
            <div className="px-6 py-2 border-b bg-white/30 backdrop-blur-sm shrink-0">
              <Breadcrumb />
            </div>

            <div className="flex-1 overflow-y-auto">
              {viewMode === "files" || viewMode === "recent" || viewMode === "favorites" || viewMode === "search" ? (
                <FileList />
              ) : viewMode === "shares" ? (
                <SharesTab />
              ) : viewMode === "admin" ? (
                <UserManagementTab />
              ) : viewMode === "settings" ? (
                <SettingsTab />
              ) : viewMode === "about" ? (
                <AboutTab />
              ) : null}
            </div>
          </DropZone>
        </main>
      </div>

      {/* Floating Upload Queue Drawer */}
      <UploadDrawer />

      {/* All Dialogs & Modals */}
      <NewFolderModal />
      <RenameModal />
      <MoveModal />
      <ShareModal />
      <PreviewModal />
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, AlertCircle, Info, X, KeyRound } from "lucide-react";
import { api } from "@/lib/api";
import { FileConflictStrategy, FolderConflictStrategy } from "@/types";
import { useUploadStore } from "@/stores/useUploadStore";
import { useQueryClient } from "@tanstack/react-query";

function UploadConflictModal() {
  const conflict = useFileStore((s) => s.uploadConflict);
  const setUploadConflict = useFileStore((s) => s.setUploadConflict);
  const showToast = useFileStore((s) => s.showToast);
  const addFile = useUploadStore((s) => s.addFile);
  const queryClient = useQueryClient();

  const [folderStrategy, setFolderStrategy] = useState<FolderConflictStrategy>("merge");
  const [fileStrategy, setFileStrategy] = useState<FileConflictStrategy>("rename");
  const [processing, setProcessing] = useState(false);

  if (!conflict) return null;

  const hasFolderConflicts = conflict.conflictingFolders.length > 0;
  const hasFileConflicts =
    conflict.conflictingFiles.length > 0 ||
    (hasFolderConflicts && folderStrategy === "merge");

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      const folderRenameMap = new Map<string, string>();
      for (const folderName of conflict.conflictingFolders) {
        const res = await api.resolveFolderConflict(
          conflict.targetDir,
          folderName,
          folderStrategy
        );
        folderRenameMap.set(folderName, res.folderName);
      }

      const remapSubPath = (subPath: string) => {
        if (!subPath) return "";
        const parts = subPath.split("/");
        const top = parts[0];
        if (folderRenameMap.has(top)) {
          parts[0] = folderRenameMap.get(top)!;
        }
        return parts.join("/");
      };

      for (const emptySub of conflict.emptyDirs) {
        const mapped = remapSubPath(emptySub);
        try {
          await api.createDirectory(conflict.targetDir, mapped);
        } catch {}
      }

      for (const entry of conflict.entries) {
        const mappedSub = remapSubPath(entry.subPath);
        const destDir = mappedSub
          ? conflict.targetDir
            ? `${conflict.targetDir}/${mappedSub}`
            : mappedSub
          : conflict.targetDir;
        await addFile(entry.file, destDir, fileStrategy);
      }

      queryClient.invalidateQueries({ queryKey: ["files"] });
      setUploadConflict(null);
    } catch (err: any) {
      showToast(err.message || "处理上传冲突失败", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={Boolean(conflict)} onOpenChange={(open) => !open && setUploadConflict(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            检测到同名文件或文件夹冲突
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-xs">
          <p className="text-muted-foreground">
            目标目录 <code className="bg-muted px-1.5 py-0.5 rounded font-mono">/{conflict.targetDir || "根目录"}</code> 中已存在同名项目，请选择处理方式：
          </p>

          {hasFolderConflicts && (
            <div className="p-3 rounded-xl border bg-muted/20 space-y-2">
              <p className="font-semibold text-foreground">
                同名文件夹 ({conflict.conflictingFolders.join(", ")})：
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { key: "merge", label: "合并目录", desc: "保留现有目录并传入内部" },
                    { key: "rename", label: "自动重命名", desc: "新建 文件夹 (1)" },
                    { key: "overwrite", label: "覆盖原目录", desc: "清空旧目录后写入" },
                  ] as { key: FolderConflictStrategy; label: string; desc: string }[]
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFolderStrategy(opt.key)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      folderStrategy === opt.key
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold"
                        : "bg-white hover:bg-black/5 text-foreground"
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-muted-foreground font-normal mt-0.5">
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasFileConflicts && (
            <div className="p-3 rounded-xl border bg-muted/20 space-y-2">
              <p className="font-semibold text-foreground">
                {conflict.conflictingFiles.length > 0
                  ? `同名文件 (${conflict.conflictingFiles.slice(0, 3).join(", ")}${
                      conflict.conflictingFiles.length > 3 ? " 等" : ""
                    })：`
                  : "合并目录内的同名文件处理方式："}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { key: "rename", label: "自动重命名", desc: "保留两者，如 file (1).ext" },
                    { key: "overwrite", label: "覆盖同名文件", desc: "直接替换已有同名文件" },
                  ] as { key: FileConflictStrategy; label: string; desc: string }[]
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFileStrategy(opt.key)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      fileStrategy === opt.key
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold"
                        : "bg-white hover:bg-black/5 text-foreground"
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-muted-foreground font-normal mt-0.5">
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => setUploadConflict(null)}>
            取消上传
          </Button>
          <Button type="button" disabled={processing} onClick={handleConfirm}>
            {processing ? "处理中..." : "按所选策略开始上传"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ChangePasswordModal() {
  const isOpen = useFileStore((s) => s.passwordModalOpen);
  const setOpen = useFileStore((s) => s.setPasswordModalOpen);
  const showToast = useFileStore((s) => s.showToast);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast("新口令至少需要 8 位字符", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("两次输入的新口令不一致", "error");
      return;
    }
    setSubmitting(true);
    try {
      await api.changeOwnPassword(oldPassword, newPassword);
      if (user) {
        setUser({ ...user, mustChangePassword: false });
      }
      showToast("登录口令已成功修改", "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpen(false);
    } catch (err: any) {
      showToast(err.message || "修改口令失败", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-brand-secondary" />
            修改登录口令
          </DialogTitle>
        </DialogHeader>

        {user?.mustChangePassword && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            系统检测到您的账号处于待修改初始口令状态，请设置新的个人登录口令。
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">当前原口令</label>
            <Input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="请输入当前口令"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">新口令 (≥8位)</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="至少 8 位字符"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">确认新口令</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再次输入新口令"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "保存中..." : "确认修改"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GlobalConfirmModal() {
  const confirmDialog = useFileStore((s) => s.confirmDialog);
  const closeConfirm = useFileStore((s) => s.closeConfirm);

  if (!confirmDialog) return null;

  return (
    <Dialog open={Boolean(confirmDialog)} onOpenChange={(open) => !open && closeConfirm()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{confirmDialog.title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground leading-relaxed">{confirmDialog.description}</p>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={closeConfirm}>
            取消
          </Button>
          <Button
            type="button"
            variant={confirmDialog.destructive ? "destructive" : "default"}
            onClick={() => {
              const fn = confirmDialog.onConfirm;
              closeConfirm();
              fn();
            }}
          >
            {confirmDialog.confirmText || "确定"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GlobalToastList() {
  const toasts = useFileStore((s) => s.toasts);
  const dismissToast = useFileStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-2.5 px-4 py-3 rounded-2xl shadow-lg border backdrop-blur-md text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-150 ${
            t.type === "success"
              ? "bg-emerald-50/95 text-emerald-800 border-emerald-200"
              : t.type === "error"
              ? "bg-rose-50/95 text-rose-800 border-rose-200"
              : "bg-white/95 text-foreground border-black/10"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {t.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : t.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-brand-secondary shrink-0" />
            )}
            <span className="break-words">{t.text}</span>
          </div>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            className="opacity-60 hover:opacity-100 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function MainPage() {
  const router = useRouter();
  const { checkAuth, isAuthenticated, isLoading, user } = useAuthStore();
  const viewMode = useFileStore((s) => s.viewMode);

  // URL ↔ 视图模式及子文件夹路径同步：支持 #/files/<subPath> 刷新保留位置与浏览器前进/后退
  useEffect(() => {
    const VALID_MODES = ["files", "recent", "favorites", "shares", "admin", "settings", "about", "search"];
    if (window.location.pathname === "/about" && !window.location.hash) {
      window.history.replaceState(null, "", "#/about");
      useFileStore.setState({ viewMode: "about", selectedFile: null, selectedPaths: [] });
    }
    const applyLocation = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, "");
      if (!rawHash || rawHash === "files") {
        useFileStore.setState({ viewMode: "files", currentPath: "", selectedFile: null, selectedPaths: [] });
        return;
      }
      if (rawHash.startsWith("files/")) {
        const encodedSub = rawHash.slice("files/".length);
        const decodedPath = encodedSub
          .split("/")
          .filter(Boolean)
          .map((seg) => {
            try {
              return decodeURIComponent(seg);
            } catch {
              return seg;
            }
          })
          .join("/");
        useFileStore.setState({ viewMode: "files", currentPath: decodedPath, selectedFile: null, selectedPaths: [] });
        return;
      }
      if (VALID_MODES.includes(rawHash)) {
        useFileStore.setState({ viewMode: rawHash as any, selectedFile: null, selectedPaths: [] });
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
    if (user?.mustChangePassword) {
      useFileStore.getState().setPasswordModalOpen(true);
    }
  }, [user?.mustChangePassword]);

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

      {/* Global Toast & Confirm Dialogs */}
      <GlobalToastList />
      <GlobalConfirmModal />

      {/* All Dialogs & Modals */}
      <NewFolderModal />
      <RenameModal />
      <MoveModal />
      <ShareModal />
      <PreviewModal />
      <ChangePasswordModal />
      <UploadConflictModal />
    </div>
  );
}

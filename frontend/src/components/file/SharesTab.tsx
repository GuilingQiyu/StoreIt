"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Share2,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  Folder,
  FolderOpen,
  FileText,
  Upload,
  FolderPlus,
  FilePlus2,
  Download,
  Eye,
  Edit3,
  Globe,
  Lock,
  ShieldCheck,
  ChevronRight,
  Home,
  Save,
  X,
  Columns,
} from "lucide-react";
import { api } from "@/lib/api";
import { FileItem, ShareMountItem, SharedSpaceManifest } from "@/types";
import { useFileStore, useI18n } from "@/stores/useFileStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatBytes,
  formatDate,
  copyToClipboard,
  getPreviewKind,
  getFileExtension,
} from "@/lib/utils";
import { MarkdownRenderer } from "@/components/preview/MarkdownRenderer";

function parseShareLinkInput(raw: string): {
  token: string;
  remoteServerUrl: string;
  extractedPassword: string;
} {
  let input = (raw || "").trim();
  let extractedPassword = "";

  const qIdx = input.indexOf("?");
  if (qIdx >= 0) {
    const qs = new URLSearchParams(input.slice(qIdx + 1));
    extractedPassword = qs.get("key") || qs.get("password") || qs.get("pwd") || "";
    input = input.slice(0, qIdx);
  }

  if (input.startsWith("storeit+fed://")) {
    const rest = input.slice("storeit+fed://".length);
    const isLocal = rest.startsWith("localhost") || rest.startsWith("127.0.0.1");
    input = (isLocal ? "http://" : "https://") + rest;
  }

  let remoteServerUrl = "";
  let pathPart = input;

  if (input.startsWith("http://") || input.startsWith("https://")) {
    try {
      const u = new URL(input);
      if (typeof window !== "undefined" && u.origin !== window.location.origin) {
        remoteServerUrl = u.origin;
      }
      pathPart = u.pathname + u.hash;
    } catch {}
  }

  let token = pathPart;
  if (token.includes("/api/fed/shares/")) {
    token = token.slice(token.indexOf("/api/fed/shares/") + "/api/fed/shares/".length);
  } else if (token.includes("#/s/")) {
    token = token.slice(token.indexOf("#/s/") + "#/s/".length);
  } else if (token.includes("/d/")) {
    token = token.slice(token.indexOf("/d/") + "/d/".length);
  }
  if (token.includes("/")) {
    token = token.slice(0, token.indexOf("/"));
  }
  token = token.replace(/[^A-Za-z0-9_-]/g, "");
  return { token, remoteServerUrl, extractedPassword };
}

export function SharesTab() {
  const queryClient = useQueryClient();
  const showToast = useFileStore((s) => s.showToast);
  const openConfirm = useFileStore((s) => s.openConfirm);
  const activeShareToken = useFileStore((s) => s.activeShareToken);
  const activeShareServerUrl = useFileStore((s) => s.activeShareServerUrl);
  const activeSharePassword = useFileStore((s) => s.activeSharePassword);
  const openSharedSpace = useFileStore((s) => s.openSharedSpace);
  const closeSharedSpace = useFileStore((s) => s.closeSharedSpace);
  const { locale, t } = useI18n();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [mountNameInput, setMountNameInput] = useState("");

  const [manifest, setManifest] = useState<SharedSpaceManifest | null>(null);
  const [subPath, setSubPath] = useState("");
  const [sharedItems, setSharedItems] = useState<FileItem[]>([]);
  const [loadingSpace, setLoadingSpace] = useState(false);
  const [spaceError, setSpaceError] = useState<string | null>(null);
  const [needsPasswordPrompt, setNeedsPasswordPrompt] = useState(false);

  const [viewingSharedItem, setViewingSharedItem] = useState<FileItem | null>(null);
  const [sharedTextContent, setSharedTextContent] = useState("");
  const [editingSharedText, setEditingSharedText] = useState(false);
  const [savingSharedText, setSavingSharedText] = useState(false);
  const [sharedSplitMd, setSharedSplitMd] = useState(true);

  const [newSubfolderName, setNewSubfolderName] = useState("");
  const [showMkdirBar, setShowMkdirBar] = useState(false);
  const [newSharedFileName, setNewSharedFileName] = useState("");
  const [showNewFileBar, setShowNewFileBar] = useState(false);
  const sharedUploadInputRef = useRef<HTMLInputElement>(null);

  const { data: sharesData, isLoading, refetch } = useQuery({
    queryKey: ["shares"],
    queryFn: () => api.getShares(),
  });

  const { data: mountsData, refetch: refetchMounts } = useQuery({
    queryKey: ["shareMounts"],
    queryFn: () => api.getShareMounts(),
  });

  const loadActiveShareSpace = async (
    token: string,
    serverUrl: string,
    pwd: string,
    targetSubPath = ""
  ) => {
    if (!token) return;
    setLoadingSpace(true);
    setSpaceError(null);
    setNeedsPasswordPrompt(false);
    try {
      const mf = await api.getFederatedManifest(token, pwd, serverUrl);
      setManifest(mf);
      const listRes = await api.listFederatedShare(token, targetSubPath, pwd, serverUrl);
      setSharedItems(listRes.items || []);
      setSubPath(listRes.currentSubPath || "");
    } catch (err: any) {
      if (err?.passwordRequired || err?.status === 403) {
        setNeedsPasswordPrompt(true);
      }
      setSpaceError(err.message || t("无法加载共享空间", "Failed to load shared space"));
    } finally {
      setLoadingSpace(false);
    }
  };

  useEffect(() => {
    if (activeShareToken) {
      setViewingSharedItem(null);
      loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, "");
    } else {
      setManifest(null);
      setSharedItems([]);
      setSubPath("");
    }
  }, [activeShareToken, activeShareServerUrl, activeSharePassword]);

  const handleLoadInputShare = async (saveAsMount: boolean) => {
    const parsed = parseShareLinkInput(linkInput);
    if (!parsed.token) {
      showToast(
        t(
          "请输入有效的分享链接、Token 或 storeit+fed:// 跨服协议地址",
          "Please enter a valid share link, token, or storeit+fed:// URI"
        ),
        "error"
      );
      return;
    }
    const pwd = passwordInput.trim() || parsed.extractedPassword;
    openSharedSpace(parsed.token, parsed.remoteServerUrl, pwd);

    if (saveAsMount) {
      try {
        let mf: SharedSpaceManifest | null = null;
        try {
          mf = await api.getFederatedManifest(parsed.token, pwd, parsed.remoteServerUrl);
        } catch {}
        await api.createShareMount({
          shareLinkOrToken: linkInput.trim(),
          accessPassword: pwd || undefined,
          mountName: mountNameInput.trim() || mf?.name || undefined,
          permission: mf?.permission || "READ_WRITE",
          ownerName: mf?.ownerUsername || parsed.remoteServerUrl || "local",
          isDirectory: mf ? mf.isDirectory : true,
        });
        refetchMounts();
        showToast(t("已保存到我的共享挂载列表", "Saved to mounted shares"), "success");
        setLinkInput("");
        setMountNameInput("");
      } catch (err: any) {
        showToast(err.message || t("保存挂载失败", "Failed to save mount"), "error");
      }
    }
  };

  const revokeMutation = useMutation({
    mutationFn: (id: number) => api.revokeShare(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shares"] });
      showToast(t("分享链接已撤销", "Share link revoked"), "success");
    },
    onError: (err: any) =>
      showToast(err.message || t("撤销分享失败", "Failed to revoke share"), "error"),
  });

  const deleteMountMutation = useMutation({
    mutationFn: (id: number) => api.deleteShareMount(id),
    onSuccess: () => {
      refetchMounts();
      showToast(t("已移除挂载项", "Mount removed"), "success");
    },
  });

  const handleCopy = async (key: string, text: string) => {
    if (await copyToClipboard(text)) {
      setCopiedId(key);
      showToast(t("已复制到剪贴板", "Copied to clipboard"), "success");
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  const handleRevoke = (id: number, filePath: string) => {
    openConfirm({
      title: t("确认撤销共享", "Confirm Revoke Share"),
      description: t(
        `确定要撤销对 "${filePath}" 的共享链接吗？撤销后所有访问与跨服挂载将立即失效。`,
        `Are you sure you want to revoke the share link for "${filePath}"? All web and federated mounts will stop working immediately.`
      ),
      confirmText: t("确认撤销", "Revoke"),
      destructive: true,
      onConfirm: () => revokeMutation.mutate(id),
    });
  };

  const fedBase = activeShareServerUrl ? activeShareServerUrl.replace(/\/+$/, "") : "";
  const pwdQuery = activeSharePassword
    ? `&password=${encodeURIComponent(activeSharePassword)}`
    : "";

  const getSharedPreviewUrl = (itemSubPath: string) =>
    `${fedBase}/api/fed/shares/${encodeURIComponent(
      activeShareToken || ""
    )}/preview?subPath=${encodeURIComponent(itemSubPath)}${pwdQuery}`;

  const getSharedDownloadUrl = (itemSubPath: string) =>
    `${fedBase}/api/fed/shares/${encodeURIComponent(
      activeShareToken || ""
    )}/download?subPath=${encodeURIComponent(itemSubPath)}${pwdQuery}`;

  const getSharedZipUrl = (targetSubPath: string) =>
    `${fedBase}/api/fed/shares/${encodeURIComponent(
      activeShareToken || ""
    )}/zip?subPath=${encodeURIComponent(targetSubPath)}${pwdQuery}`;

  const handleOpenSharedItem = async (it: FileItem) => {
    if (!activeShareToken) return;
    if (it.isDirectory) {
      setViewingSharedItem(null);
      await loadActiveShareSpace(
        activeShareToken,
        activeShareServerUrl,
        activeSharePassword,
        it.path
      );
      return;
    }
    setViewingSharedItem(it);
    setEditingSharedText(false);
    if (getPreviewKind(it.name) === "text") {
      try {
        const res = await api.getFederatedFileContent(
          activeShareToken,
          it.path,
          activeSharePassword,
          activeShareServerUrl
        );
        setSharedTextContent(res.content || "");
      } catch (err: any) {
        showToast(err.message || t("读取共享文件内容失败", "Failed to read shared file"), "error");
      }
    }
  };

  const handleSaveSharedText = async () => {
    if (!activeShareToken || !viewingSharedItem) return;
    setSavingSharedText(true);
    try {
      await api.saveFederatedFileContent(
        activeShareToken,
        viewingSharedItem.path,
        sharedTextContent,
        activeSharePassword,
        activeShareServerUrl
      );
      setEditingSharedText(false);
      showToast(t("共享文件内容已保存", "Shared file saved"), "success");
      loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, subPath);
    } catch (err: any) {
      showToast(err.message || t("保存共享文件失败", "Failed to save shared file"), "error");
    } finally {
      setSavingSharedText(false);
    }
  };

  const handleSharedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeShareToken) return;
    for (let i = 0; i < files.length; i++) {
      try {
        await api.uploadToFederatedShare(
          activeShareToken,
          subPath,
          files[i],
          "rename",
          activeSharePassword,
          activeShareServerUrl
        );
      } catch (err: any) {
        showToast(
          err.message || t(`上传 ${files[i].name} 失败`, `Failed to upload ${files[i].name}`),
          "error"
        );
      }
    }
    e.target.value = "";
    showToast(t("文件已上传至共享目录", "Files uploaded to shared folder"), "success");
    loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, subPath);
  };

  const handleCreateSharedSubfolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShareToken || !newSubfolderName.trim()) return;
    try {
      await api.createFederatedSubfolder(
        activeShareToken,
        subPath,
        newSubfolderName.trim(),
        activeSharePassword,
        activeShareServerUrl
      );
      setNewSubfolderName("");
      setShowMkdirBar(false);
      showToast(t("共享子文件夹已创建", "Subfolder created"), "success");
      loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, subPath);
    } catch (err: any) {
      showToast(err.message || t("创建子文件夹失败", "Failed to create subfolder"), "error");
    }
  };

  const handleCreateSharedBlankFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShareToken || !newSharedFileName.trim()) return;
    try {
      const name = newSharedFileName.trim();
      const initial = name.endsWith(".md") ? `# ${name}\n\n` : "";
      const res = await api.createFederatedBlankFile(
        activeShareToken,
        subPath,
        name,
        initial,
        activeSharePassword,
        activeShareServerUrl
      );
      setNewSharedFileName("");
      setShowNewFileBar(false);
      showToast(t("共享文件已创建", "Shared file created"), "success");
      await loadActiveShareSpace(
        activeShareToken,
        activeShareServerUrl,
        activeSharePassword,
        subPath
      );
      if (res.file) {
        setViewingSharedItem({
          name: res.file.name,
          path: res.file.path,
          isDirectory: false,
          size: res.file.size,
        });
        setSharedTextContent(initial);
        setEditingSharedText(true);
      }
    } catch (err: any) {
      showToast(err.message || t("创建共享文件失败", "Failed to create shared file"), "error");
    }
  };

  const handleDeleteSharedItem = async (it: FileItem) => {
    if (!activeShareToken) return;
    try {
      await api.deleteFederatedItem(
        activeShareToken,
        it.path,
        activeSharePassword,
        activeShareServerUrl
      );
      if (viewingSharedItem?.path === it.path) setViewingSharedItem(null);
      showToast(
        t(`已从共享目录删除 "${it.name}"`, `Deleted "${it.name}" from shared folder`),
        "success"
      );
      loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, subPath);
    } catch (err: any) {
      showToast(err.message || t("删除失败", "Failed to delete"), "error");
    }
  };

  const shares = sharesData || [];
  const mounts: ShareMountItem[] = mountsData || [];
  const isRW = manifest?.permission === "READ_WRITE";
  const subParts = subPath ? subPath.split("/").filter(Boolean) : [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 storeit-view-enter">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-primary flex items-center gap-2">
            <Share2 className="w-6 h-6 text-brand-secondary" />
            {t("共享文件夹 · 跨服联邦挂载与分享中心", "Shared Folders · Cross-Server Federation & Shares")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t(
              "管理单文件与文件夹共享（支持 R 只读 / RW 读写权限管控），或通过 SFSP/1.0 协议加载本机及跨服务器共享空间",
              "Manage file & folder shares (with R read-only / RW read-write permissions) or mount local & remote shared spaces via SFSP/1.0"
            )}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            refetch();
            refetchMounts();
            if (activeShareToken) {
              loadActiveShareSpace(
                activeShareToken,
                activeShareServerUrl,
                activeSharePassword,
                subPath
              );
            }
          }}
          className="gap-1.5"
        >
          <RefreshCw className="w-4 h-4" /> {t("刷新全部", "Refresh All")}
        </Button>
      </div>

      {/* 1. Mount / Load Shared Space Panel */}
      <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-brand-primary flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-secondary" />
              {t("加载共享链接 / 跨服联邦挂载 (SFSP/1.0)", "Open Share Link / Mount Federated Space (SFSP/1.0)")}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("支持粘贴本机分享 Token、Web 链接（", "Paste a share token, web URL (")}
              <code className="bg-muted px-1 rounded">/#/s/TOKEN</code>
              {t("）或任意远程 StoreIt 节点协议地址（", "), or remote StoreIt federation URI (")}
              <code className="bg-muted px-1 rounded">storeit+fed://host/api/fed/shares/TOKEN</code>
              {t("）", ")")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
          <div className="sm:col-span-5">
            <label className="text-xs font-medium text-foreground block mb-1">
              {t("分享链接 / Token / 跨服协议 URI", "Share Link / Token / Federation URI")}
            </label>
            <Input
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder={t("粘贴 #/s/... 或 storeit+fed://...", "Paste #/s/... or storeit+fed://...")}
              className="text-xs font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-foreground block mb-1">
              {t("提取码 (若设置)", "Access Code")}
            </label>
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder={t("可选提取码", "Optional")}
              className="text-xs"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-foreground block mb-1">
              {t("挂载备注名 (可选)", "Alias (Optional)")}
            </label>
            <Input
              value={mountNameInput}
              onChange={(e) => setMountNameInput(e.target.value)}
              placeholder={t("如：团队设计库", "e.g. Team Assets")}
              className="text-xs"
            />
          </div>
          <div className="sm:col-span-3 flex gap-1.5">
            <Button
              type="button"
              onClick={() => handleLoadInputShare(false)}
              className="flex-1 text-xs"
            >
              {t("立即打开", "Open Now")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleLoadInputShare(true)}
              className="flex-1 text-xs"
            >
              {t("保存并挂载", "Save & Mount")}
            </Button>
          </div>
        </div>

        {mounts.length > 0 && (
          <div className="pt-2 border-t space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              {t(`已保存的共享挂载 (${mounts.length})：`, `Saved Mounts (${mounts.length}):`)}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {mounts.map((m) => {
                const isActive =
                  activeShareToken === m.shareToken &&
                  (activeShareServerUrl || "") === (m.remoteServerUrl || "");
                return (
                  <div
                    key={m.id}
                    onClick={() =>
                      openSharedSpace(
                        m.shareToken,
                        m.remoteServerUrl || "",
                        m.accessPassword || ""
                      )
                    }
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      isActive
                        ? "border-brand-primary bg-brand-primary/10 shadow-sm"
                        : "bg-muted/20 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FolderOpen className="w-5 h-5 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-brand-primary truncate">
                          {m.mountName}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <span
                            className={`px-1.5 py-0.2 rounded font-semibold ${
                              m.permission === "READ_WRITE"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {m.permission === "READ_WRITE" ? t("RW 读写", "RW") : t("R 只读", "R")}
                          </span>
                          <span className="truncate">
                            {m.remoteServerUrl
                              ? `${t("跨服", "Remote")}: ${m.remoteServerUrl}`
                              : `${t("来自", "From")}: ${m.ownerName || t("本机", "Local")}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMountMutation.mutate(m.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive rounded"
                      title={t("移除挂载", "Remove mount")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Active Shared Space Explorer */}
      {activeShareToken && (
        <div className="bg-white rounded-2xl border-2 border-brand-primary/30 shadow-md overflow-hidden storeit-modal-spring">
          <div className="p-4 bg-brand-primary/5 border-b flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <FolderOpen className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-brand-primary truncate">
                    {manifest?.name || `${t("共享空间", "Shared Space")} (${activeShareToken})`}
                  </span>
                  {manifest && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isRW
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-blue-100 text-blue-800 border border-blue-300"
                      }`}
                    >
                      {isRW ? t("RW 可读写协同", "RW Read & Write") : t("R 只读访问", "R Read-Only")}
                    </span>
                  )}
                  <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                    {activeShareServerUrl
                      ? `${t("SFSP 跨服节点", "SFSP Remote Node")}: ${activeShareServerUrl}`
                      : t("SFSP/1.0 本机节点", "SFSP/1.0 Local Node")}
                  </span>
                </div>
                {manifest && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {t(
                      `所有者: ${manifest.ownerUsername} · 已下载 ${manifest.downloads} 次`,
                      `Owner: ${manifest.ownerUsername} · ${manifest.downloads} downloads`
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {manifest && isRW && manifest.isDirectory && (
                <>
                  <input
                    ref={sharedUploadInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleSharedUpload}
                  />
                  <Button
                    size="sm"
                    variant="default"
                    className="h-8 text-xs gap-1"
                    onClick={() => sharedUploadInputRef.current?.click()}
                  >
                    <Upload className="w-3.5 h-3.5" /> {t("上传文件", "Upload")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      setShowNewFileBar((v) => !v);
                      setShowMkdirBar(false);
                    }}
                  >
                    <FilePlus2 className="w-3.5 h-3.5" /> {t("新建文件", "New File")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      setShowMkdirBar((v) => !v);
                      setShowNewFileBar(false);
                    }}
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
                    {t("新建子目录", "New Subfolder")}
                  </Button>
                </>
              )}
              {manifest && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = getSharedZipUrl(subPath);
                    a.download = `${manifest.name || "Shared"}.zip`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                >
                  <Download className="w-3.5 h-3.5" /> {t("打包下载 (.zip)", "Download ZIP")}
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs gap-1"
                onClick={closeSharedSpace}
              >
                <X className="w-3.5 h-3.5" /> {t("关闭共享视图", "Close")}
              </Button>
            </div>
          </div>

          {manifest?.isDirectory && (
            <div className="px-4 py-2 bg-muted/20 border-b flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto">
              <button
                type="button"
                onClick={() => {
                  setViewingSharedItem(null);
                  loadActiveShareSpace(
                    activeShareToken,
                    activeShareServerUrl,
                    activeSharePassword,
                    ""
                  );
                }}
                className="inline-flex items-center gap-1 hover:text-brand-primary font-medium"
              >
                <Home className="w-3.5 h-3.5" /> {t("共享根目录", "Shared Root")}
              </button>
              {subParts.map((part, idx) => {
                const targetSub = subParts.slice(0, idx + 1).join("/");
                return (
                  <React.Fragment key={targetSub}>
                    <ChevronRight className="w-3 h-3 opacity-40" />
                    <button
                      type="button"
                      onClick={() => {
                        setViewingSharedItem(null);
                        loadActiveShareSpace(
                          activeShareToken,
                          activeShareServerUrl,
                          activeSharePassword,
                          targetSub
                        );
                      }}
                      className="hover:text-brand-primary font-medium"
                    >
                      {part}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {showMkdirBar && (
            <form
              onSubmit={handleCreateSharedSubfolder}
              className="px-4 py-2.5 bg-amber-50/60 border-b flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4 text-amber-500 shrink-0" />
              <Input
                autoFocus
                value={newSubfolderName}
                onChange={(e) => setNewSubfolderName(e.target.value)}
                placeholder={t("输入新子文件夹名称...", "Enter new subfolder name...")}
                className="h-8 text-xs max-w-xs"
              />
              <Button type="submit" size="sm" className="h-8 text-xs">
                {t("创建", "Create")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 text-xs"
                onClick={() => setShowMkdirBar(false)}
              >
                {t("取消", "Cancel")}
              </Button>
            </form>
          )}

          {showNewFileBar && (
            <form
              onSubmit={handleCreateSharedBlankFile}
              className="px-4 py-2.5 bg-blue-50/60 border-b flex items-center gap-2"
            >
              <FilePlus2 className="w-4 h-4 text-brand-secondary shrink-0" />
              <Input
                autoFocus
                value={newSharedFileName}
                onChange={(e) => setNewSharedFileName(e.target.value)}
                placeholder={t(
                  "输入新文件名称 (如 README.md 或 notes.txt)...",
                  "Enter file name (e.g. README.md or notes.txt)..."
                )}
                className="h-8 text-xs max-w-xs"
              />
              <Button type="submit" size="sm" className="h-8 text-xs">
                {t("创建并编辑", "Create & Edit")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 text-xs"
                onClick={() => setShowNewFileBar(false)}
              >
                {t("取消", "Cancel")}
              </Button>
            </form>
          )}

          <div className="p-4">
            {loadingSpace ? (
              <div className="py-12 text-center text-muted-foreground flex items-center justify-center gap-2 text-xs">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-secondary" />
                {t("正在通过 SFSP 协议同步共享目录...", "Syncing shared folder via SFSP...")}
              </div>
            ) : spaceError ? (
              <div className="py-8 max-w-md mx-auto text-center space-y-3">
                <Lock className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-sm font-semibold text-foreground">{spaceError}</p>
                {needsPasswordPrompt && (
                  <div className="flex gap-2 justify-center">
                    <Input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder={t("请输入该共享的访问提取码", "Enter access code")}
                      className="max-w-[200px] h-8 text-xs"
                    />
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() =>
                        openSharedSpace(activeShareToken, activeShareServerUrl, passwordInput.trim())
                      }
                    >
                      {t("验证提取码", "Unlock")}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {sharedItems.length === 0 ? (
                  <div className="py-10 text-center text-xs text-muted-foreground">
                    {t("此共享目录下暂无文件", "This shared folder is empty")}
                    {isRW &&
                      t(
                        "（可点击右上角“上传文件”或“新建文件”添加内容）",
                        " (use 'Upload' or 'New File' above to add content)"
                      )}
                  </div>
                ) : (
                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b bg-muted/40 text-muted-foreground">
                          <th className="py-2 px-3 font-semibold">{t("名称", "Name")}</th>
                          <th className="py-2 px-3 font-semibold w-28">{t("大小", "Size")}</th>
                          <th className="py-2 px-3 font-semibold w-40 hidden sm:table-cell">
                            {t("修改时间", "Modified")}
                          </th>
                          <th className="py-2 px-3 font-semibold text-right">{t("操作", "Actions")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {sharedItems.map((it) => (
                          <tr
                            key={it.path || it.name}
                            onDoubleClick={() => handleOpenSharedItem(it)}
                            className="hover:bg-muted/20 cursor-pointer"
                          >
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                {it.isDirectory ? (
                                  <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                                ) : (
                                  <FileText className="w-4 h-4 text-brand-secondary shrink-0" />
                                )}
                                <span
                                  onClick={() => handleOpenSharedItem(it)}
                                  className="font-medium text-foreground hover:text-brand-primary"
                                >
                                  {it.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {it.isDirectory ? t("文件夹", "Folder") : formatBytes(it.size || 0)}
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground hidden sm:table-cell">
                              {formatDate(it.modifiedTime, locale)}
                            </td>
                            <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs gap-1"
                                onClick={() => handleOpenSharedItem(it)}
                              >
                                <Eye className="w-3.5 h-3.5 text-brand-secondary" />
                                {it.isDirectory ? t("进入", "Open") : t("查看", "View")}
                              </Button>
                              {!it.isDirectory && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-xs gap-1"
                                  asChild
                                >
                                  <a href={getSharedDownloadUrl(it.path)} download={it.name}>
                                    <Download className="w-3.5 h-3.5 text-brand-secondary" />
                                    {t("下载", "Download")}
                                  </a>
                                </Button>
                              )}
                              {isRW && manifest?.isDirectory && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteSharedItem(it)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {viewingSharedItem && !viewingSharedItem.isDirectory && (
                  <div className="p-4 rounded-2xl border bg-muted/10 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-secondary" />
                        <span className="font-semibold text-sm text-brand-primary">
                          {viewingSharedItem.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({formatBytes(viewingSharedItem.size || 0)})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getPreviewKind(viewingSharedItem.name) === "text" && isRW && (
                          <>
                            {editingSharedText ? (
                              <>
                                {["md", "markdown"].includes(
                                  getFileExtension(viewingSharedItem.name)
                                ) && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs gap-1"
                                    onClick={() => setSharedSplitMd((v) => !v)}
                                  >
                                    <Columns className="w-3 h-3" />
                                    {sharedSplitMd ? t("分栏预览", "Split View") : t("纯源码", "Source Only")}
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  className="h-7 text-xs gap-1"
                                  disabled={savingSharedText}
                                  onClick={handleSaveSharedText}
                                >
                                  <Save className="w-3 h-3" />
                                  {savingSharedText ? t("保存中...", "Saving...") : t("保存修改", "Save")}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => setEditingSharedText(false)}
                                >
                                  {t("取消", "Cancel")}
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1"
                                onClick={() => setEditingSharedText(true)}
                              >
                                <Edit3 className="w-3 h-3 text-brand-secondary" />
                                {t("在线协同编辑", "Collaborate & Edit")}
                              </Button>
                            )}
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => setViewingSharedItem(null)}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {getPreviewKind(viewingSharedItem.name) === "image" ? (
                      <div className="flex justify-center p-2">
                        <img
                          src={getSharedPreviewUrl(viewingSharedItem.path)}
                          alt={viewingSharedItem.name}
                          className="max-h-96 rounded-xl shadow-sm object-contain"
                        />
                      </div>
                    ) : getPreviewKind(viewingSharedItem.name) === "video" ? (
                      <video
                        src={getSharedPreviewUrl(viewingSharedItem.path)}
                        controls
                        className="max-h-96 w-full rounded-xl bg-black"
                      />
                    ) : getPreviewKind(viewingSharedItem.name) === "audio" ? (
                      <audio
                        src={getSharedPreviewUrl(viewingSharedItem.path)}
                        controls
                        className="w-full"
                      />
                    ) : getPreviewKind(viewingSharedItem.name) === "pdf" ? (
                      <iframe
                        src={getSharedPreviewUrl(viewingSharedItem.path)}
                        className="w-full h-96 rounded-xl border bg-white"
                        title={viewingSharedItem.name}
                      />
                    ) : editingSharedText ? (
                      ["md", "markdown"].includes(getFileExtension(viewingSharedItem.name)) &&
                      sharedSplitMd ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-80">
                          <textarea
                            value={sharedTextContent}
                            onChange={(e) => setSharedTextContent(e.target.value)}
                            className="w-full h-full p-3 rounded-xl bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs outline-none resize-none"
                          />
                          <div className="w-full h-full p-3 rounded-xl bg-white border overflow-auto">
                            <MarkdownRenderer content={sharedTextContent} showToc={false} />
                          </div>
                        </div>
                      ) : (
                        <textarea
                          value={sharedTextContent}
                          onChange={(e) => setSharedTextContent(e.target.value)}
                          className="w-full h-72 p-3 rounded-xl bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs outline-none resize-none"
                        />
                      )
                    ) : ["md", "markdown"].includes(getFileExtension(viewingSharedItem.name)) ? (
                      <div className="p-4 rounded-xl bg-white border max-h-96 overflow-auto">
                        <MarkdownRenderer content={sharedTextContent} />
                      </div>
                    ) : (
                      <pre className="p-3 rounded-xl bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs max-h-80 overflow-auto whitespace-pre-wrap">
                        {sharedTextContent}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Shares Created by Me */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-brand-primary flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-secondary" />
          {t(`我发起的共享与外链 (${shares.length})`, `My Created Shares (${shares.length})`)}
        </h3>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-brand-secondary" />
            <p className="text-xs">{t("正在读取分享列表...", "Loading shares...")}</p>
          </div>
        ) : shares.length === 0 ? (
          <div className="text-center py-12 bg-white/60 rounded-2xl border border-dashed text-muted-foreground">
            <Share2 className="w-10 h-10 mx-auto mb-2 opacity-30 text-brand-secondary" />
            <p className="font-semibold text-brand-primary text-sm">
              {t("还没有发起过共享", "No active shares yet")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t(
                "在“我的文件”中右键任意文件夹或文件并点击“分享”，即可创建只读或 RW 读写协同共享",
                "Right-click any file or folder in 'My Files' and choose 'Share' to create a R or RW share"
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {shares.map((item) => {
              const origin = typeof window !== "undefined" ? window.location.origin : "";
              const host = typeof window !== "undefined" ? window.location.host : "localhost:59898";
              const webSpaceUrl = `${origin}/#/s/${item.token}`;
              const directUrl = `${origin}${item.url}`;
              const fedUri = `storeit+fed://${host}/api/fed/shares/${item.token}`;

              return (
                <div
                  key={item.id}
                  className="p-4 bg-white/80 hover:bg-white rounded-2xl border shadow-sm transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 min-w-0 flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.isDirectory ? (
                        <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-brand-secondary shrink-0" />
                      )}
                      <span
                        className="font-semibold text-sm text-foreground truncate max-w-md"
                        title={item.filePath}
                      >
                        {item.title || item.filePath}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {item.isDirectory ? t("共享文件夹", "Shared Folder") : t("单文件", "Single File")}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          item.permission === "READ_WRITE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.permission === "READ_WRITE"
                          ? t("RW 可读写", "RW Read/Write")
                          : t("R 只读", "R Read-Only")}
                      </span>
                      {item.passwordProtected && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> {t("含提取码", "Protected")}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        readOnly
                        value={webSpaceUrl}
                        className="w-full sm:w-80 text-xs font-mono bg-muted/50 border rounded-lg px-2.5 py-1 text-muted-foreground outline-none select-all"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2.5 text-xs gap-1"
                        onClick={() => handleCopy(`web_${item.id}`, webSpaceUrl)}
                      >
                        {copiedId === `web_${item.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> {t("已复制", "Copied")}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> {t("互动链接", "Web Link")}
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2.5 text-xs gap-1"
                        onClick={() => handleCopy(`dl_${item.id}`, directUrl)}
                      >
                        {copiedId === `dl_${item.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> {t("已复制", "Copied")}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> {t("下载直链", "Direct URL")}
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2.5 text-xs gap-1"
                        onClick={() => handleCopy(`fed_${item.id}`, fedUri)}
                      >
                        {copiedId === `fed_${item.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> {t("已复制协议", "Copied URI")}
                          </>
                        ) : (
                          <>
                            <Globe className="w-3 h-3 text-brand-secondary" />
                            {t("跨服 URI", "SFSP URI")}
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {t("路径", "Path")}: /{item.filePath}
                      </span>
                      <span>
                        {t("下载次数", "Downloads")}:{" "}
                        <strong className="text-foreground">
                          {item.downloads || 0} /{" "}
                          {item.maxDownloads ? item.maxDownloads : t("不限", "Unlimited")}
                        </strong>
                      </span>
                      <span>
                        {t("有效期至", "Expires")}:{" "}
                        <strong className="text-foreground">
                          {item.expiry ? formatDate(item.expiry, locale) : t("永久有效", "Never")}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => openSharedSpace(item.token, "", "")}
                    >
                      {t("打开共享空间", "Open Space")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1 h-8 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-0 shadow-none"
                      onClick={() => handleRevoke(item.id, item.filePath)}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> {t("撤销", "Revoke")}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

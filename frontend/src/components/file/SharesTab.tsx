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
  Edit2,
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
import { useFileStore } from "@/stores/useFileStore";
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

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [mountNameInput, setMountNameInput] = useState("");

  // Active shared folder browser state
  const [manifest, setManifest] = useState<SharedSpaceManifest | null>(null);
  const [subPath, setSubPath] = useState("");
  const [sharedItems, setSharedItems] = useState<FileItem[]>([]);
  const [loadingSpace, setLoadingSpace] = useState(false);
  const [spaceError, setSpaceError] = useState<string | null>(null);
  const [needsPasswordPrompt, setNeedsPasswordPrompt] = useState(false);

  // Active shared item preview / online editor inside shared space
  const [viewingSharedItem, setViewingSharedItem] = useState<FileItem | null>(null);
  const [sharedTextContent, setSharedTextContent] = useState("");
  const [editingSharedText, setEditingSharedText] = useState(false);
  const [savingSharedText, setSavingSharedText] = useState(false);
  const [sharedSplitMd, setSharedSplitMd] = useState(true);

  // Subfolder & new file creation inside RW shared folder
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
      setSpaceError(err.message || "无法加载共享空间");
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
      showToast("请输入有效的分享链接、Token 或 storeit+fed:// 跨服协议地址", "error");
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
        showToast("已保存到我的共享挂载列表", "success");
        setLinkInput("");
        setMountNameInput("");
      } catch (err: any) {
        showToast(err.message || "保存挂载失败", "error");
      }
    }
  };

  const revokeMutation = useMutation({
    mutationFn: (id: number) => api.revokeShare(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shares"] });
      showToast("分享链接已撤销", "success");
    },
    onError: (err: any) => showToast(err.message || "撤销分享失败", "error"),
  });

  const deleteMountMutation = useMutation({
    mutationFn: (id: number) => api.deleteShareMount(id),
    onSuccess: () => {
      refetchMounts();
      showToast("已移除挂载项", "success");
    },
  });

  const handleCopy = async (key: string, text: string) => {
    if (await copyToClipboard(text)) {
      setCopiedId(key);
      showToast("已复制到剪贴板", "success");
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  const handleRevoke = (id: number, filePath: string) => {
    openConfirm({
      title: "确认撤销共享",
      description: `确定要撤销对 "${filePath}" 的共享链接吗？撤销后所有访问与跨服挂载将立即失效。`,
      confirmText: "确认撤销",
      destructive: true,
      onConfirm: () => revokeMutation.mutate(id),
    });
  };

  // Shared Folder Explorer actions
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
        showToast(err.message || "读取共享文件内容失败", "error");
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
      showToast("共享文件内容已保存", "success");
      loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, subPath);
    } catch (err: any) {
      showToast(err.message || "保存共享文件失败", "error");
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
        showToast(err.message || `上传 ${files[i].name} 失败`, "error");
      }
    }
    e.target.value = "";
    showToast("文件已上传至共享目录", "success");
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
      showToast("共享子文件夹已创建", "success");
      loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, subPath);
    } catch (err: any) {
      showToast(err.message || "创建子文件夹失败", "error");
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
      showToast("共享文件已创建", "success");
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
      showToast(err.message || "创建共享文件失败", "error");
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
      showToast(`已从共享目录删除 "${it.name}"`, "success");
      loadActiveShareSpace(activeShareToken, activeShareServerUrl, activeSharePassword, subPath);
    } catch (err: any) {
      showToast(err.message || "删除失败", "error");
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
            共享文件夹 · 跨服联邦挂载与分享中心
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            管理单文件与文件夹共享（支持 R 只读 / RW 读写权限管控），或通过 SFSP/1.0 协议加载本机及跨服务器共享空间
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
          <RefreshCw className="w-4 h-4" /> 刷新全部
        </Button>
      </div>

      {/* 1. 加载共享链接 / 跨服务器 SFSP 协议挂载面板 */}
      <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-brand-primary flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-secondary" />
              加载共享链接 / 跨服联邦挂载 (SFSP/1.0)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              支持粘贴本机分享 Token、Web 链接（<code className="bg-muted px-1 rounded">/#/s/TOKEN</code>）或任意远程 StoreIt 节点协议地址（<code className="bg-muted px-1 rounded">storeit+fed://host/api/fed/shares/TOKEN</code>）
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
          <div className="sm:col-span-5">
            <label className="text-xs font-medium text-foreground block mb-1">
              分享链接 / Token / 跨服协议 URI
            </label>
            <Input
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="粘贴 #/s/... 或 storeit+fed://..."
              className="text-xs font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-foreground block mb-1">
              提取码 (若设置)
            </label>
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="可选提取码"
              className="text-xs"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-foreground block mb-1">
              挂载备注名 (可选)
            </label>
            <Input
              value={mountNameInput}
              onChange={(e) => setMountNameInput(e.target.value)}
              placeholder="如：团队设计库"
              className="text-xs"
            />
          </div>
          <div className="sm:col-span-3 flex gap-1.5">
            <Button
              type="button"
              onClick={() => handleLoadInputShare(false)}
              className="flex-1 text-xs"
            >
              立即打开
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleLoadInputShare(true)}
              className="flex-1 text-xs"
            >
              保存并挂载
            </Button>
          </div>
        </div>

        {/* 已挂载的共享列表 */}
        {mounts.length > 0 && (
          <div className="pt-2 border-t space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              已保存的共享挂载 ({mounts.length})：
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
                            {m.permission === "READ_WRITE" ? "RW 读写" : "R 只读"}
                          </span>
                          <span className="truncate">
                            {m.remoteServerUrl ? `跨服: ${m.remoteServerUrl}` : `来自: ${m.ownerName || "本机"}`}
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
                      title="移除挂载"
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

      {/* 2. 当前已加载的共享空间浏览器 (Active Shared Folder / File Explorer) */}
      {activeShareToken && (
        <div className="bg-white rounded-2xl border-2 border-brand-primary/30 shadow-md overflow-hidden storeit-modal-spring">
          <div className="p-4 bg-brand-primary/5 border-b flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <FolderOpen className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-brand-primary truncate">
                    {manifest?.name || `共享空间 (${activeShareToken})`}
                  </span>
                  {manifest && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isRW
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-blue-100 text-blue-800 border border-blue-300"
                      }`}
                    >
                      {isRW ? "RW 可读写协同" : "R 只读访问"}
                    </span>
                  )}
                  <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                    {activeShareServerUrl ? `SFSP 跨服节点: ${activeShareServerUrl}` : "SFSP/1.0 本机节点"}
                  </span>
                </div>
                {manifest && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    所有者: {manifest.ownerUsername} · 已下载 {manifest.downloads} 次
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
                    <Upload className="w-3.5 h-3.5" /> 上传文件
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
                    <FilePlus2 className="w-3.5 h-3.5" /> 新建文件
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
                    <FolderPlus className="w-3.5 h-3.5 text-amber-500" /> 新建子目录
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
                  <Download className="w-3.5 h-3.5" /> 打包下载 (.zip)
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs gap-1"
                onClick={closeSharedSpace}
              >
                <X className="w-3.5 h-3.5" /> 关闭共享视图
              </Button>
            </div>
          </div>

          {/* Breadcrumb inside shared folder */}
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
                <Home className="w-3.5 h-3.5" /> 共享根目录
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

          {/* Quick mkdir or create file bars */}
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
                placeholder="输入新子文件夹名称..."
                className="h-8 text-xs max-w-xs"
              />
              <Button type="submit" size="sm" className="h-8 text-xs">
                创建
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 text-xs"
                onClick={() => setShowMkdirBar(false)}
              >
                取消
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
                placeholder="输入新文件名称 (如 README.md 或 notes.txt)..."
                className="h-8 text-xs max-w-xs"
              />
              <Button type="submit" size="sm" className="h-8 text-xs">
                创建并编辑
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 text-xs"
                onClick={() => setShowNewFileBar(false)}
              >
                取消
              </Button>
            </form>
          )}

          {/* Body of Shared Folder Explorer */}
          <div className="p-4">
            {loadingSpace ? (
              <div className="py-12 text-center text-muted-foreground flex items-center justify-center gap-2 text-xs">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-secondary" />
                正在通过 SFSP 协议同步共享目录...
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
                      placeholder="请输入该共享的访问提取码"
                      className="max-w-[200px] h-8 text-xs"
                    />
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() =>
                        openSharedSpace(activeShareToken, activeShareServerUrl, passwordInput.trim())
                      }
                    >
                      验证提取码
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {sharedItems.length === 0 ? (
                  <div className="py-10 text-center text-xs text-muted-foreground">
                    此共享目录下暂无文件
                    {isRW && "（可点击右上角“上传文件”或“新建文件”添加内容）"}
                  </div>
                ) : (
                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b bg-muted/40 text-muted-foreground">
                          <th className="py-2 px-3 font-semibold">名称</th>
                          <th className="py-2 px-3 font-semibold w-28">大小</th>
                          <th className="py-2 px-3 font-semibold w-40 hidden sm:table-cell">修改时间</th>
                          <th className="py-2 px-3 font-semibold text-right">操作</th>
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
                              {it.isDirectory ? "文件夹" : formatBytes(it.size || 0)}
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground hidden sm:table-cell">
                              {formatDate(it.modifiedTime)}
                            </td>
                            <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs gap-1"
                                onClick={() => handleOpenSharedItem(it)}
                              >
                                <Eye className="w-3.5 h-3.5 text-brand-secondary" />
                                {it.isDirectory ? "进入" : "查看"}
                              </Button>
                              {!it.isDirectory && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-xs gap-1"
                                  asChild
                                >
                                  <a href={getSharedDownloadUrl(it.path)} download={it.name}>
                                    <Download className="w-3.5 h-3.5 text-brand-secondary" /> 下载
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

                {/* Inline Preview & RW Editor for selected file inside shared space */}
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
                                    {sharedSplitMd ? "分栏预览" : "纯源码"}
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  className="h-7 text-xs gap-1"
                                  disabled={savingSharedText}
                                  onClick={handleSaveSharedText}
                                >
                                  <Save className="w-3 h-3" />
                                  {savingSharedText ? "保存中..." : "保存修改"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => setEditingSharedText(false)}
                                >
                                  取消
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1"
                                onClick={() => setEditingSharedText(true)}
                              >
                                <Edit3 className="w-3 h-3 text-brand-secondary" /> 在线协同编辑
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

      {/* 3. 我发起的共享列表 */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-brand-primary flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-secondary" />
          我发起的共享与外链 ({shares.length})
        </h3>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-brand-secondary" />
            <p className="text-xs">正在读取分享列表...</p>
          </div>
        ) : shares.length === 0 ? (
          <div className="text-center py-12 bg-white/60 rounded-2xl border border-dashed text-muted-foreground">
            <Share2 className="w-10 h-10 mx-auto mb-2 opacity-30 text-brand-secondary" />
            <p className="font-semibold text-brand-primary text-sm">还没有发起过共享</p>
            <p className="text-xs text-muted-foreground mt-1">
              在“我的文件”中右键任意文件夹或文件并点击“分享”，即可创建只读或 RW 读写协同共享
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
                        {item.isDirectory ? "共享文件夹" : "单文件"}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          item.permission === "READ_WRITE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.permission === "READ_WRITE" ? "RW 可读写" : "R 只读"}
                      </span>
                      {item.passwordProtected && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> 含提取码
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
                            <Check className="w-3 h-3 text-emerald-600" /> 已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> 互动链接
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
                            <Check className="w-3 h-3 text-emerald-600" /> 已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> 下载直链
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
                            <Check className="w-3 h-3 text-emerald-600" /> 已复制协议
                          </>
                        ) : (
                          <>
                            <Globe className="w-3 h-3 text-brand-secondary" /> 跨服 URI
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span>路径: /{item.filePath}</span>
                      <span>
                        下载次数:{" "}
                        <strong className="text-foreground">
                          {item.downloads || 0} / {item.maxDownloads ? item.maxDownloads : "不限"}
                        </strong>
                      </span>
                      <span>
                        有效期至:{" "}
                        <strong className="text-foreground">
                          {item.expiry ? formatDate(item.expiry) : "永久有效"}
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
                      打开共享空间
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1 h-8 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-0 shadow-none"
                      onClick={() => handleRevoke(item.id, item.filePath)}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> 撤销
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

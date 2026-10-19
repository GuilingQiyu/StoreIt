"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  Download,
  FileText,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Code,
  BookOpen,
  Columns,
  Edit3,
  Save,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  WrapText,
} from "lucide-react";
import { FileItem } from "@/types";
import { api } from "@/lib/api";
import { useFileStore } from "@/stores/useFileStore";
import {
  copyToClipboard,
  formatBytes,
  getDownloadUrl,
  getPreviewUrl,
  getPreviewKind,
  getFileExtension,
  isPreviewable,
  PreviewKind,
} from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "./MarkdownRenderer";

// 文本预览仅通过 HTTP Range 拉取前 256KB，避免整文件下载；在线编辑支持最大 5MB 完整加载与保存
const MAX_TEXT_BYTES = 256 * 1024;
const MAX_EDITABLE_BYTES = 5 * 1024 * 1024;

function decodeTextBytesSmart(bytes: Uint8Array): { text: string; charset: string } {
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return {
      text: new TextDecoder("utf-8").decode(bytes.subarray(3)),
      charset: "UTF-8",
    };
  }
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return {
      text: new TextDecoder("utf-16le").decode(bytes.subarray(2)),
      charset: "UTF-16LE",
    };
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return {
      text: new TextDecoder("utf-16be").decode(bytes.subarray(2)),
      charset: "UTF-16BE",
    };
  }
  try {
    const strictUtf8 = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { text: strictUtf8, charset: "UTF-8" };
  } catch {
    try {
      const gbText = new TextDecoder("gb18030", { fatal: false }).decode(bytes);
      return { text: gbText, charset: "GB18030" };
    } catch {
      return {
        text: new TextDecoder("utf-8", { fatal: false }).decode(bytes),
        charset: "UTF-8",
      };
    }
  }
}

export function PreviewModal() {
  const queryClient = useQueryClient();
  const item = useFileStore((s) => s.previewFile);
  const previewAutoEdit = useFileStore((s) => s.previewAutoEdit);
  const setPreviewFile = useFileStore((s) => s.setPreviewFile);
  const viewMode = useFileStore((s) => s.viewMode);
  const currentPath = useFileStore((s) => s.currentPath);
  const searchQuery = useFileStore((s) => s.searchQuery);
  const showToast = useFileStore((s) => s.showToast);
  const openConfirm = useFileStore((s) => s.openConfirm);

  const [textContent, setTextContent] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [detectedCharset, setDetectedCharset] = useState<string>("UTF-8");
  const [loadedModifiedTime, setLoadedModifiedTime] = useState<number | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [savingText, setSavingText] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isBinaryDetected, setIsBinaryDetected] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [mdMode, setMdMode] = useState<"render" | "split" | "raw">("render");
  const [editSplitPreview, setEditSplitPreview] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [copiedText, setCopiedText] = useState(false);
  const [audioRate, setAudioRate] = useState(1);

  // 全屏状态：支持模态框窗口铺满全屏 + 浏览器原生 Fullscreen API
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const kind: PreviewKind | null = item ? getPreviewKind(item.name) : null;
  const isMarkdown = item ? ["md", "markdown"].includes(getFileExtension(item.name)) : false;
  const previewUrl = item ? getPreviewUrl(item.path) : "";
  const downloadUrl = item ? getDownloadUrl(item.path) : "";
  const fullActive = isFullscreen || isNativeFullscreen;

  const previewableSiblings = useMemo(() => {
    const key = ["files", viewMode, viewMode === "search" ? searchQuery : currentPath];
    const cached = (queryClient.getQueryData(key) as FileItem[]) || [];
    return cached.filter((f) => !f.isDirectory && isPreviewable(f.name));
  }, [queryClient, viewMode, currentPath, searchQuery, item]);

  const currentIndex = useMemo(() => {
    if (!item) return -1;
    return previewableSiblings.findIndex((f) => f.path === item.path);
  }, [item, previewableSiblings]);

  const hasPrev = !isEditing && currentIndex > 0;
  const hasNext = !isEditing && currentIndex >= 0 && currentIndex < previewableSiblings.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) setPreviewFile(previewableSiblings[currentIndex - 1]);
  }, [hasPrev, previewableSiblings, currentIndex, setPreviewFile]);

  const goNext = useCallback(() => {
    if (hasNext) setPreviewFile(previewableSiblings[currentIndex + 1]);
  }, [hasNext, previewableSiblings, currentIndex, setPreviewFile]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => {
      const next = !prev;
      if (!next && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      return next;
    });
  }, []);

  const toggleNativeFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        const targetEl = viewerRef.current || document.documentElement;
        await targetEl.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsFullscreen((v) => !v);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsNativeFullscreen(active);
      if (active) setIsFullscreen(true);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const startEditing = useCallback(async () => {
    if (!item) return;
    if ((item.size || 0) > MAX_EDITABLE_BYTES) {
      showToast("文件超过 5 MB，不支持在线编辑，请下载后修改", "error");
      return;
    }
    setLoadingText(true);
    try {
      const res = await api.getFileContent(item.path);
      setTextContent(res.content);
      setEditContent(res.content);
      setDetectedCharset(res.charset || "UTF-8");
      setLoadedModifiedTime(res.modifiedTime);
      setIsTruncated(false);
      setIsEditing(true);
    } catch (err: any) {
      showToast(err.message || "无法进入在线编辑模式", "error");
    } finally {
      setLoadingText(false);
    }
  }, [item, showToast]);

  const performSaveEdit = useCallback(
    async (forceOverwrite = false) => {
      if (!item || savingText) return;
      setSavingText(true);
      try {
        const res = await api.saveFileContent(
          item.path,
          editContent,
          forceOverwrite ? undefined : loadedModifiedTime,
          detectedCharset
        );
        setTextContent(editContent);
        setLoadedModifiedTime(res.file.modifiedTime);
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: ["files"] });
        queryClient.invalidateQueries({ queryKey: ["quota"] });
        const selected = useFileStore.getState().selectedFile;
        if (selected && selected.path === item.path) {
          useFileStore.getState().setSelectedFile({
            ...selected,
            size: res.file.size,
            modifiedTime: res.file.modifiedTime,
          });
        }
        showToast("文本内容已成功保存", "success");
      } catch (err: any) {
        if (err?.status === 409) {
          openConfirm({
            title: "检测到文件并发修改冲突",
            description:
              "该文件在您编辑期间已被其他窗口或上传任务修改。是否仍要以当前编辑器内容强制覆盖保存？",
            confirmText: "强制覆盖保存",
            destructive: true,
            onConfirm: () => {
              performSaveEdit(true);
            },
          });
        } else {
          showToast(err.message || "保存文件失败", "error");
        }
      } finally {
        setSavingText(false);
      }
    },
    [item, editContent, savingText, loadedModifiedTime, detectedCharset, queryClient, showToast, openConfirm]
  );

  useEffect(() => {
    setPreviewFailed(false);
    setIsBinaryDetected(false);
    setIsEditing(false);
    setZoom(1);
    setRotation(0);
    setMdMode("render");
    setAudioRate(1);
    if (!item) {
      setIsFullscreen(false);
      if (typeof document !== "undefined" && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
          e.preventDefault();
          performSaveEdit(false);
        }
        return;
      }
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (e.key === "ArrowLeft" && hasPrev) {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight" && hasNext) {
        e.preventDefault();
        goNext();
      } else if (e.key.toLowerCase() === "f" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, isEditing, hasPrev, hasNext, goPrev, goNext, performSaveEdit, toggleFullscreen]);

  useEffect(() => {
    if (item && kind === "text") {
      setLoadingText(true);
      setIsTruncated(false);
      setIsBinaryDetected(false);
      setTextContent(null);

      if (previewAutoEdit && (item.size || 0) <= MAX_EDITABLE_BYTES) {
        api
          .getFileContent(item.path)
          .then((res) => {
            setTextContent(res.content);
            setEditContent(res.content);
            setDetectedCharset(res.charset || "UTF-8");
            setLoadedModifiedTime(res.modifiedTime);
            setIsEditing(true);
            setLoadingText(false);
          })
          .catch((err) => {
            showToast(err.message || "无法加载可编辑文本", "error");
            setIsBinaryDetected(true);
            setLoadingText(false);
          });
        return;
      }

      if (item.size === 0) {
        setTextContent("");
        setEditContent("");
        setDetectedCharset("UTF-8");
        setIsTruncated(false);
        setLoadingText(false);
        return;
      }

      fetch(previewUrl, { headers: { Range: `bytes=0-${MAX_TEXT_BYTES - 1}` } })
        .then(async (r) => {
          if (!r.ok) throw new Error("无法加载文本");
          const contentRange = r.headers.get("Content-Range") || "";
          const match = contentRange.match(/\/(\d+)$/);
          const totalBytes = match ? Number(match[1]) : (item.size ?? 0);
          const truncated = (item.size ?? 0) > MAX_TEXT_BYTES || totalBytes > MAX_TEXT_BYTES;
          const buf = await r.arrayBuffer();
          const bytes = new Uint8Array(buf);
          const checkLen = Math.min(bytes.length, 8192);
          const isUtf16Bom =
            checkLen >= 2 &&
            ((bytes[0] === 0xff && bytes[1] === 0xfe) ||
              (bytes[0] === 0xfe && bytes[1] === 0xff));
          if (!isUtf16Bom) {
            for (let i = 0; i < checkLen; i++) {
              if (bytes[i] === 0) {
                return { text: "", charset: "UTF-8", truncated: false, binary: true };
              }
            }
          }
          const { text: raw, charset } = decodeTextBytesSmart(bytes);
          return {
            text: truncated ? raw.replace(/\uFFFD+$/, "") : raw,
            charset,
            truncated,
            binary: false,
          };
        })
        .then(({ text, charset, truncated, binary }) => {
          if (binary) {
            setIsBinaryDetected(true);
          } else {
            setTextContent(text);
            setEditContent(text);
            setDetectedCharset(charset);
            setIsTruncated(truncated);
          }
          setLoadingText(false);
        })
        .catch(() => {
          setTextContent("加载文本内容失败");
          setLoadingText(false);
        });
    } else {
      setTextContent(null);
    }
  }, [item, kind, previewUrl, previewAutoEdit, showToast]);

  const handleDownload = () => {
    if (!item) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyText = async () => {
    const val = isEditing ? editContent : textContent || "";
    if (await copyToClipboard(val)) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 1800);
    }
  };

  const insertMarkdownSnippet = (prefix: string, suffix = "", defaultText = "") => {
    const el = textareaRef.current;
    if (!el) {
      setEditContent((prev) => prev + prefix + defaultText + suffix);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = editContent.substring(start, end) || defaultText;
    const nextVal =
      editContent.substring(0, start) + prefix + selected + suffix + editContent.substring(end);
    setEditContent(nextVal);
    setTimeout(() => {
      el.focus();
      el.selectionStart = start + prefix.length;
      el.selectionEnd = start + prefix.length + selected.length;
    }, 0);
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextVal = editContent.substring(0, start) + "  " + editContent.substring(end);
      setEditContent(nextVal);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const isDirty = isEditing && editContent !== (textContent ?? "");

  const fallbackBlock = (
    <div className="text-center p-8 space-y-3">
      <FileText className="w-16 h-16 text-muted-foreground/40 mx-auto" />
      <p className="text-sm font-medium text-foreground">
        {isBinaryDetected
          ? "检测到该文件包含二进制数据，无法作为纯文本预览或编辑"
          : previewFailed
          ? "该文件在线预览加载失败，请下载后查看"
          : "该文件格式暂不支持在线直接预览"}
      </p>
      <Button onClick={handleDownload} className="gap-2">
        <Download className="w-4 h-4" /> 立即下载到本地查看
      </Button>
    </div>
  );

  return (
    <Dialog open={Boolean(item)} onOpenChange={(open) => !open && setPreviewFile(null)}>
      <DialogContent
        ref={viewerRef}
        className={`flex flex-col storeit-modal-spring ${
          fullActive
            ? "!w-screen !h-screen !max-w-none !max-h-none !rounded-none !border-0 p-4 sm:p-5"
            : "max-w-4xl max-h-[88vh] p-6"
        }`}
      >
        <DialogHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-3 border-b pr-7 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Eye className="w-5 h-5 text-brand-secondary shrink-0" />
            <DialogTitle className="text-base truncate font-semibold" title={item?.name}>
              {item?.name}
            </DialogTitle>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              ({formatBytes(item?.size || 0)})
            </span>
            {kind === "text" && !isBinaryDetected && (
              <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground whitespace-nowrap">
                {detectedCharset}
              </span>
            )}
            {isDirty && (
              <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                ● 未保存修改
              </span>
            )}
            {!isEditing && previewableSiblings.length > 1 && currentIndex >= 0 && (
              <span className="text-[11px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground whitespace-nowrap">
                {currentIndex + 1} / {previewableSiblings.length}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {!isEditing && previewableSiblings.length > 1 && (
              <div className="flex items-center gap-1 mr-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  disabled={!hasPrev}
                  onClick={goPrev}
                  title="上一个文件 (←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  disabled={!hasNext}
                  onClick={goNext}
                  title="下一个文件 (→)"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {kind === "text" && !isBinaryDetected && (
              <>
                {isEditing ? (
                  <>
                    {isMarkdown && (
                      <Button
                        size="sm"
                        variant={editSplitPreview ? "secondary" : "outline"}
                        className="gap-1 h-8"
                        onClick={() => setEditSplitPreview((v) => !v)}
                        title="切换实时分栏渲染预览"
                      >
                        <Columns className="w-3.5 h-3.5" />
                        {editSplitPreview ? "分栏预览中" : "开启分栏"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1.5 h-8"
                      disabled={savingText}
                      onClick={() => performSaveEdit(false)}
                      title="保存文本修改 (Ctrl+S)"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {savingText ? "保存中..." : "保存"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 h-8"
                      onClick={() => {
                        setIsEditing(false);
                        setEditContent(textContent || "");
                      }}
                    >
                      <X className="w-3.5 h-3.5" /> 取消
                    </Button>
                  </>
                ) : (
                  <>
                    {(item?.size || 0) <= MAX_EDITABLE_BYTES && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 h-8"
                        onClick={startEditing}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-brand-secondary" /> 在线编辑
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 h-8"
                      onClick={handleCopyText}
                      title="复制全部文本"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> 已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> 复制
                        </>
                      )}
                    </Button>
                    {(!isMarkdown || mdMode === "raw") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setWordWrap((w) => !w)}
                        title={wordWrap ? "切换为横向滚动" : "切换为自动换行"}
                      >
                        <WrapText className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </>
                )}
              </>
            )}

            {isMarkdown && kind === "text" && !isBinaryDetected && !isEditing && (
              <div className="inline-flex items-center rounded-lg border bg-muted/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setMdMode("render")}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                    mdMode === "render"
                      ? "bg-white text-brand-primary shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BookOpen className="w-3 h-3" /> 渲染
                </button>
                <button
                  type="button"
                  onClick={() => setMdMode("split")}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                    mdMode === "split"
                      ? "bg-white text-brand-primary shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Columns className="w-3 h-3" /> 分栏
                </button>
                <button
                  type="button"
                  onClick={() => setMdMode("raw")}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                    mdMode === "raw"
                      ? "bg-white text-brand-primary shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Code className="w-3 h-3" /> 源码
                </button>
              </div>
            )}

            {/* 窗口全屏与浏览器原生全屏按钮 */}
            <Button
              size="sm"
              variant="outline"
              className="gap-1 h-8"
              onClick={toggleFullscreen}
              onDoubleClick={toggleNativeFullscreen}
              title={
                fullActive
                  ? "退出全屏模式 (快捷键 F)"
                  : "铺满全屏预览 (快捷键 F，双击进入系统级全屏)"
              }
            >
              {fullActive ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" /> 退出全屏
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" /> 全屏
                </>
              )}
            </Button>

            <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5" /> 下载
            </Button>
          </div>
        </DialogHeader>

        {/* Content Viewer */}
        <div
          className={`relative flex-1 overflow-auto flex items-center justify-center p-2 bg-black/5 rounded-xl mt-3 transition-all duration-200 ${
            fullActive ? "min-h-0 h-full" : "min-h-[340px]"
          }`}
        >
          {kind === "image" && !previewFailed && (
            <div
              className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden"
              onWheel={(e) => {
                if (e.ctrlKey || e.metaKey) {
                  e.preventDefault();
                  const delta = e.deltaY < 0 ? 0.2 : -0.2;
                  setZoom((z) => Math.min(5, Math.max(0.25, +(z + delta).toFixed(2))));
                }
              }}
            >
              <div
                className={`overflow-auto max-w-full flex items-center justify-center p-4 ${
                  fullActive ? "h-[calc(100vh-140px)]" : "max-h-[62vh]"
                }`}
              >
                <img
                  src={previewUrl}
                  alt={item?.name}
                  onDoubleClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  className={`${
                    fullActive ? "max-h-[calc(100vh-160px)]" : "max-h-[58vh]"
                  } max-w-full object-contain rounded-lg shadow-sm cursor-zoom-in`}
                  onError={() => setPreviewFailed(true)}
                />
              </div>

              <div className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur border shadow-md text-xs">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.25).toFixed(2)))}
                  className="p-1 hover:bg-black/5 rounded transition-colors"
                  title="缩小"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setRotation(0);
                  }}
                  className="px-1.5 font-mono text-[11px] hover:bg-black/5 rounded"
                  title="点击复位 100% (双击图片快速放大)"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(5, +(z + 0.25).toFixed(2)))}
                  className="p-1 hover:bg-black/5 rounded transition-colors"
                  title="放大"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <span className="text-black/20">|</span>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1 hover:bg-black/5 rounded transition-colors"
                  title="顺时针旋转 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <span className="text-black/20">|</span>
                <button
                  type="button"
                  onClick={toggleNativeFullscreen}
                  className="p-1 hover:bg-black/5 rounded transition-colors"
                  title="切换浏览器系统全屏"
                >
                  {isNativeFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {kind === "video" && !previewFailed && (
            <video
              src={previewUrl}
              controls
              autoPlay
              className={`${
                fullActive ? "h-[calc(100vh-115px)] w-full bg-black" : "max-h-[62vh] max-w-full"
              } rounded-lg shadow-sm object-contain`}
              onError={() => setPreviewFailed(true)}
            />
          )}

          {kind === "audio" && !previewFailed && (
            <div
              className={`p-8 w-full ${
                fullActive ? "max-w-xl" : "max-w-md"
              } bg-white rounded-2xl shadow-sm text-center space-y-5 border`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white flex items-center justify-center mx-auto shadow-md">
                <Eye className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-semibold text-brand-primary break-all">{item?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatBytes(item?.size || 0)}</p>
              </div>
              <audio
                ref={audioRef}
                src={previewUrl}
                controls
                autoPlay
                className="w-full"
                onError={() => setPreviewFailed(true)}
              />
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <span>倍速:</span>
                {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      setAudioRate(rate);
                      if (audioRef.current) audioRef.current.playbackRate = rate;
                    }}
                    className={`px-2 py-0.5 rounded-md transition-colors ${
                      audioRate === rate
                        ? "bg-brand-primary text-white font-semibold"
                        : "bg-muted hover:bg-black/10 text-foreground"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          )}

          {kind === "pdf" && !previewFailed && (
            <iframe
              src={previewUrl}
              className={`w-full ${
                fullActive ? "h-[calc(100vh-110px)]" : "h-[64vh]"
              } rounded-lg border bg-white`}
              title={item?.name}
            />
          )}

          {kind === "text" && !isBinaryDetected && (
            <div
              className={`w-full ${
                fullActive ? "h-[calc(100vh-110px)]" : "h-[64vh]"
              } flex flex-col rounded-xl overflow-hidden border ${
                !isEditing && isMarkdown && mdMode === "render"
                  ? "bg-white text-foreground p-5"
                  : !isEditing && isMarkdown && mdMode === "split"
                  ? "bg-white text-foreground p-0"
                  : isEditing && isMarkdown && editSplitPreview
                  ? "bg-[#1e1e2e] text-[#cdd6f4] p-0"
                  : "bg-[#1e1e2e] text-[#cdd6f4] font-mono p-4"
              } text-xs leading-relaxed`}
            >
              {isTruncated && !isEditing && (
                <div className="mb-2 p-2 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/30 text-[11px] flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>内容过大，预览仅加载前 256 KB 内容。</span>
                  </div>
                  {(item?.size || 0) <= MAX_EDITABLE_BYTES && (
                    <button
                      type="button"
                      onClick={startEditing}
                      className="px-2.5 py-0.5 rounded bg-brand-primary text-white font-semibold hover:opacity-90"
                    >
                      加载完整文件并编辑
                    </button>
                  )}
                </div>
              )}

              {/* Markdown 编辑快捷工具栏 */}
              {isEditing && isMarkdown && (
                <div className="flex flex-wrap items-center gap-1 px-3 py-1.5 bg-[#181825] border-b border-white/10 text-[11px] text-[#cdd6f4] shrink-0 select-none">
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("## ", "", "二级标题")}
                    className="px-2 py-0.5 rounded hover:bg-white/10 font-semibold"
                    title="插入标题"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("**", "**", "加粗文本")}
                    className="px-2 py-0.5 rounded hover:bg-white/10 font-bold"
                    title="加粗"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("*", "*", "斜体文本")}
                    className="px-2 py-0.5 rounded hover:bg-white/10 italic"
                    title="斜体"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("~~", "~~", "删除线")}
                    className="px-2 py-0.5 rounded hover:bg-white/10 line-through"
                    title="删除线"
                  >
                    S
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("==", "==", "高亮重点")}
                    className="px-2 py-0.5 rounded hover:bg-white/10 text-amber-300"
                    title="高亮标记 ==text=="
                  >
                    ==高亮==
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("`", "`", "code")}
                    className="px-2 py-0.5 rounded hover:bg-white/10 font-mono"
                    title="行内代码"
                  >
                    {"`代码`"}
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("\n```js\n", "\n```\n", "console.log('hello');")}
                    className="px-2 py-0.5 rounded hover:bg-white/10 font-mono"
                    title="代码块"
                  >
                    代码块
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("\n- [ ] ", "", "待办事项")}
                    className="px-2 py-0.5 rounded hover:bg-white/10"
                    title="任务列表"
                  >
                    [x] 任务
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertMarkdownSnippet(
                        "\n| 列1 | 列2 | 列3 |\n| :--- | :---: | ---: |\n| ",
                        " | 数据2 | 100 |\n",
                        "数据1"
                      )
                    }
                    className="px-2 py-0.5 rounded hover:bg-white/10"
                    title="插入 GFM 表格"
                  >
                    表格
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertMarkdownSnippet("\n> [!NOTE]\n> ", "\n", "在此输入提示说明内容")
                    }
                    className="px-2 py-0.5 rounded hover:bg-white/10 text-sky-300"
                    title="插入 GitHub 风格提示块 [!NOTE]"
                  >
                    [!NOTE]
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("$$", "$$", "\\sum_{i=1}^{n} x_i")}
                    className="px-2 py-0.5 rounded hover:bg-white/10 font-serif italic"
                    title="插入数学公式"
                  >
                    ∑ 公式
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSnippet("[", "](https://example.com)", "链接文字")}
                    className="px-2 py-0.5 rounded hover:bg-white/10"
                    title="插入超链接"
                  >
                    链接
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-auto flex flex-col min-h-0">
                {loadingText ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                    <RefreshCw className="w-4 h-4 animate-spin" /> 加载中...
                  </div>
                ) : isEditing ? (
                  isMarkdown && editSplitPreview ? (
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 min-h-0 h-full">
                      <textarea
                        ref={textareaRef}
                        autoFocus
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={handleEditorKeyDown}
                        spellCheck={false}
                        className="w-full h-full p-4 bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs leading-relaxed outline-none resize-none selection:bg-brand-secondary/40 overflow-auto"
                        placeholder="在此输入 Markdown 内容（右侧实时预览渲染效果）..."
                      />
                      <div className="w-full h-full p-5 bg-white text-foreground overflow-auto">
                        <MarkdownRenderer
                          content={editContent}
                          basePath={item?.path}
                          showToc={false}
                        />
                      </div>
                    </div>
                  ) : (
                    <textarea
                      ref={textareaRef}
                      autoFocus
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyDown={handleEditorKeyDown}
                      spellCheck={false}
                      className="w-full flex-1 bg-transparent text-[#cdd6f4] font-mono text-xs leading-relaxed outline-none resize-none selection:bg-brand-secondary/40"
                      placeholder="在此输入文本内容（支持 Tab 缩进与 Ctrl+S 快捷保存）..."
                    />
                  )
                ) : isMarkdown && mdMode === "render" ? (
                  <MarkdownRenderer content={textContent || ""} basePath={item?.path} showToc />
                ) : isMarkdown && mdMode === "split" ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x min-h-0 h-full">
                    <pre className="p-4 bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs overflow-auto whitespace-pre-wrap break-words">
                      {textContent}
                    </pre>
                    <div className="p-5 bg-white text-foreground overflow-auto">
                      <MarkdownRenderer
                        content={textContent || ""}
                        basePath={item?.path}
                        showToc={false}
                      />
                    </div>
                  </div>
                ) : (
                  <pre
                    className={
                      wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre overflow-x-auto"
                    }
                  >
                    {textContent}
                  </pre>
                )}
              </div>
            </div>
          )}

          {kind === null || previewFailed || isBinaryDetected ? fallbackBlock : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

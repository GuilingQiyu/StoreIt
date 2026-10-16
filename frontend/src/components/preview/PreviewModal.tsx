"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Edit3,
  Save,
  X,
} from "lucide-react";
import { FileItem } from "@/types";
import { api } from "@/lib/api";
import { useFileStore } from "@/stores/useFileStore";
import {
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

// 文本预览仅通过 HTTP Range 拉取前 256KB，避免整文件下载；在线编辑支持最大 5MB 完整加载与保存
const MAX_TEXT_BYTES = 256 * 1024;
const MAX_EDITABLE_BYTES = 5 * 1024 * 1024;

function renderSimpleMarkdown(md: string): React.ReactNode {
  const lines = md.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];

  lines.forEach((line, idx) => {
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code_${idx}`}
            className="my-3 p-3 rounded-lg bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs overflow-x-auto"
          >
            {codeLines.join("\n")}
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={idx} className="text-xl font-bold text-brand-primary mt-4 mb-2 border-b pb-1">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={idx} className="text-lg font-bold text-brand-primary mt-3.5 mb-1.5">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={idx} className="text-base font-semibold text-brand-primary mt-3 mb-1">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={idx}
          className="border-l-4 border-brand-secondary/50 pl-3 py-0.5 my-2 text-muted-foreground italic"
        >
          {line.slice(2)}
        </blockquote>
      );
    } else if (/^\s*[-*]\s+/.test(line)) {
      elements.push(
        <li key={idx} className="ml-5 list-disc my-0.5">
          {line.replace(/^\s*[-*]\s+/, "")}
        </li>
      );
    } else if (!line.trim()) {
      elements.push(<div key={idx} className="h-2" />);
    } else {
      elements.push(
        <p key={idx} className="my-1 leading-relaxed">
          {line}
        </p>
      );
    }
  });

  if (inCodeBlock && codeLines.length > 0) {
    elements.push(
      <pre
        key="code_end"
        className="my-3 p-3 rounded-lg bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs overflow-x-auto"
      >
        {codeLines.join("\n")}
      </pre>
    );
  }

  return <div className="text-sm text-foreground space-y-0.5">{elements}</div>;
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

  const [textContent, setTextContent] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [savingText, setSavingText] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isBinaryDetected, setIsBinaryDetected] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [mdMode, setMdMode] = useState<"render" | "raw">("render");

  const kind: PreviewKind | null = item ? getPreviewKind(item.name) : null;
  const isMarkdown = item ? ["md", "markdown"].includes(getFileExtension(item.name)) : false;
  const previewUrl = item ? getPreviewUrl(item.path) : "";
  const downloadUrl = item ? getDownloadUrl(item.path) : "";

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
      setIsTruncated(false);
      setIsEditing(true);
    } catch (err: any) {
      showToast(err.message || "无法进入在线编辑模式", "error");
    } finally {
      setLoadingText(false);
    }
  }, [item, showToast]);

  const handleSaveEdit = useCallback(async () => {
    if (!item || savingText) return;
    setSavingText(true);
    try {
      const res = await api.saveFileContent(item.path, editContent);
      setTextContent(editContent);
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
      showToast(err.message || "保存文件失败", "error");
    } finally {
      setSavingText(false);
    }
  }, [item, editContent, savingText, queryClient, showToast]);

  useEffect(() => {
    setPreviewFailed(false);
    setIsBinaryDetected(false);
    setIsEditing(false);
    setZoom(1);
    setRotation(0);
    setMdMode("render");
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
          e.preventDefault();
          handleSaveEdit();
        }
        return;
      }
      if (e.key === "ArrowLeft" && hasPrev) {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight" && hasNext) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, isEditing, hasPrev, hasNext, goPrev, goNext, handleSaveEdit]);

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
          for (let i = 0; i < checkLen; i++) {
            if (bytes[i] === 0) {
              return { text: "", truncated: false, binary: true };
            }
          }
          const raw = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
          return {
            text: truncated ? raw.replace(/\uFFFD+$/, "") : raw,
            truncated,
            binary: false,
          };
        })
        .then(({ text, truncated, binary }) => {
          if (binary) {
            setIsBinaryDetected(true);
          } else {
            setTextContent(text);
            setEditContent(text);
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
      <DialogContent className="max-w-4xl max-h-[88vh] flex flex-col p-6">
        <DialogHeader className="flex-row items-center justify-between space-y-0 pb-3 border-b pr-6">
          <div className="flex items-center gap-2 min-w-0">
            <Eye className="w-5 h-5 text-brand-secondary shrink-0" />
            <DialogTitle className="text-base truncate font-semibold" title={item?.name}>
              {item?.name}
            </DialogTitle>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              ({formatBytes(item?.size || 0)})
            </span>
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

          <div className="flex items-center gap-1.5 shrink-0">
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
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1.5 h-8"
                      disabled={savingText}
                      onClick={handleSaveEdit}
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
                      <X className="w-3.5 h-3.5" /> 取消编辑
                    </Button>
                  </>
                ) : (
                  (item?.size || 0) <= MAX_EDITABLE_BYTES && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 h-8"
                      onClick={startEditing}
                    >
                      <Edit3 className="w-3.5 h-3.5 text-brand-secondary" /> 在线编辑
                    </Button>
                  )
                )}
              </>
            )}

            {isMarkdown && kind === "text" && !isBinaryDetected && !isEditing && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-8"
                onClick={() => setMdMode((m) => (m === "render" ? "raw" : "render"))}
              >
                {mdMode === "render" ? (
                  <>
                    <Code className="w-3.5 h-3.5" /> 源码视图
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5" /> 渲染视图
                  </>
                )}
              </Button>
            )}

            <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5" /> 下载文件
            </Button>
          </div>
        </DialogHeader>

        {/* Content Viewer */}
        <div className="relative flex-1 overflow-auto min-h-[340px] flex items-center justify-center p-2 bg-black/5 rounded-xl mt-3">
          {kind === "image" && !previewFailed && (
            <div className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden">
              <div className="overflow-auto max-h-[62vh] max-w-full flex items-center justify-center p-4">
                <img
                  src={previewUrl}
                  alt={item?.name}
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: "transform 0.15s ease",
                  }}
                  className="max-h-[58vh] max-w-full object-contain rounded-lg shadow-sm"
                  onError={() => setPreviewFailed(true)}
                />
              </div>

              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur border shadow-sm text-xs">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.25).toFixed(2)))}
                  className="p-1 hover:bg-black/5 rounded"
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
                  title="点击复位 100%"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(4, +(z + 0.25).toFixed(2)))}
                  className="p-1 hover:bg-black/5 rounded"
                  title="放大"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <span className="text-black/20">|</span>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1 hover:bg-black/5 rounded"
                  title="顺时针旋转 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {kind === "video" && !previewFailed && (
            <video
              src={previewUrl}
              controls
              autoPlay
              className="max-h-[62vh] max-w-full rounded-lg shadow-sm"
              onError={() => setPreviewFailed(true)}
            />
          )}

          {kind === "audio" && !previewFailed && (
            <div className="p-8 w-full max-w-md bg-white rounded-2xl shadow-sm text-center space-y-4">
              <p className="text-sm font-medium text-foreground">{item?.name}</p>
              <audio
                src={previewUrl}
                controls
                className="w-full"
                onError={() => setPreviewFailed(true)}
              />
            </div>
          )}

          {kind === "pdf" && !previewFailed && (
            <iframe
              src={previewUrl}
              className="w-full h-[62vh] rounded-lg border bg-white"
              title={item?.name}
            />
          )}

          {kind === "text" && !isBinaryDetected && (
            <div
              className={`w-full h-[62vh] flex flex-col p-4 rounded-lg text-xs leading-relaxed ${
                !isEditing && isMarkdown && mdMode === "render"
                  ? "bg-white text-foreground border"
                  : "bg-[#1e1e2e] text-[#cdd6f4] font-mono"
              }`}
            >
              {isTruncated && !isEditing && (
                <div className="mb-2 p-2 rounded bg-amber-500/20 text-amber-300 text-[11px] flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>内容过大，预览仅加载前 256 KB 内容。</span>
                  </div>
                  {(item?.size || 0) <= MAX_EDITABLE_BYTES && (
                    <button
                      type="button"
                      onClick={startEditing}
                      className="px-2 py-0.5 rounded bg-amber-500/30 hover:bg-amber-500/40 text-amber-100 font-semibold"
                    >
                      加载完整文件并编辑
                    </button>
                  )}
                </div>
              )}
              <div className="flex-1 overflow-auto flex flex-col">
                {loadingText ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                    <RefreshCw className="w-4 h-4 animate-spin" /> 加载中...
                  </div>
                ) : isEditing ? (
                  <textarea
                    autoFocus
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={handleEditorKeyDown}
                    spellCheck={false}
                    className="w-full flex-1 bg-transparent text-[#cdd6f4] font-mono text-xs leading-relaxed outline-none resize-none selection:bg-brand-secondary/40"
                    placeholder="在此输入文本内容（支持 Tab 缩进与 Ctrl+S 快捷保存）..."
                  />
                ) : isMarkdown && mdMode === "render" ? (
                  renderSimpleMarkdown(textContent || "")
                ) : (
                  <pre className="whitespace-pre-wrap break-words">{textContent}</pre>
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

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  if (bytes < 0 || isNaN(bytes)) return "--";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatDate(timestamp: number | string | undefined): string {
  if (!timestamp) return "--";
  const date = typeof timestamp === "number" 
    ? new Date(timestamp > 1e11 ? timestamp : timestamp * 1000) 
    : new Date(timestamp);
  if (isNaN(date.getTime())) return String(timestamp);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
}

export type FileCategory = "image" | "video" | "audio" | "archive" | "code" | "pdf" | "document" | "other";

export function getFileCategory(filename: string): FileCategory {
  const ext = getFileExtension(filename);
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico"].includes(ext)) return "image";
  if (["mp4", "webm", "ogg", "mov", "mkv", "flv", "avi"].includes(ext)) return "video";
  if (["mp3", "wav", "flac", "aac", "m4a", "ogg"].includes(ext)) return "audio";
  if (["zip", "tar", "gz", "tgz", "bz2", "7z", "rar"].includes(ext)) return "archive";
  if (["pdf"].includes(ext)) return "pdf";
  if (["txt", "md", "json", "xml", "html", "css", "js", "ts", "jsx", "tsx", "py", "java", "c", "cpp", "go", "rs", "sql", "sh", "yml", "yaml"].includes(ext)) return "code";
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv"].includes(ext)) return "document";
  return "other";
}

export function isPreviewable(filename: string): boolean {
  return getPreviewKind(filename) !== null;
}

/**
 * 预览方式判定。与后端 FileService.isInlinePreview 白名单严格对齐：
 * 仅以下类型后端会以内联真实类型返回；文本类后端按 text/plain 返回源码；
 * 其余格式（svg/ico/mkv/avi/flv/flac/aac/m4a 等）后端按 text/plain 返回，
 * 用 <img>/<video>/<audio> 加载只会得到坏图或无法播放，必须视为不可预览。
 */
const INLINE_IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "bmp"];
const INLINE_VIDEO_EXTS = ["mp4", "webm", "ogg", "ogv", "mov"];
const INLINE_AUDIO_EXTS = ["mp3", "wav"];
const TEXT_PREVIEW_EXTS = [
  "txt", "log", "md", "csv", "ini", "conf", "yml", "yaml",
  "json", "xml", "html", "htm", "css", "js", "ts", "jsx", "tsx",
  "py", "java", "c", "cpp", "go", "rs", "sql", "sh", "svg",
];

export type PreviewKind = "image" | "video" | "audio" | "pdf" | "text";

export function getPreviewKind(filename: string): PreviewKind | null {
  const ext = getFileExtension(filename);
  if (INLINE_IMAGE_EXTS.includes(ext)) return "image";
  if (INLINE_VIDEO_EXTS.includes(ext)) return "video";
  if (INLINE_AUDIO_EXTS.includes(ext)) return "audio";
  if (ext === "pdf") return "pdf";
  if (TEXT_PREVIEW_EXTS.includes(ext)) return "text";
  return null;
}

export function getDownloadUrl(path: string): string {
  if (!path) return "/storage/";
  const encoded = path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `/storage/${encoded}`;
}

export function getPreviewUrl(path: string): string {
  return `/api/preview?path=${encodeURIComponent(path || "")}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  } catch {
    return false;
  }
}

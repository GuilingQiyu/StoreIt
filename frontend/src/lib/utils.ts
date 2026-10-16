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
  if (!filename) return "";
  const base = filename.split("/").pop() || filename;
  if (base.startsWith(".") && !base.slice(1).includes(".")) {
    return base.slice(1).toLowerCase();
  }
  const parts = base.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
}

export function getParentDirectory(path: string): string {
  if (!path || !path.includes("/")) return "";
  return path.slice(0, path.lastIndexOf("/"));
}

export type FileCategory = "image" | "video" | "audio" | "archive" | "code" | "pdf" | "document" | "other";

const INLINE_IMAGE_EXTS = [
  "png", "apng", "jpg", "jpeg", "jfif", "pjpeg", "pjp",
  "gif", "webp", "bmp", "avif", "ico", "cur",
];
const INLINE_VIDEO_EXTS = [
  "mp4", "m4v", "webm", "ogg", "ogv", "mov", "3gp", "mkv",
];
const INLINE_AUDIO_EXTS = [
  "mp3", "wav", "flac", "aac", "m4a", "oga", "opus", "weba", "mid", "midi", "amr",
];
const ARCHIVE_EXTS = [
  "zip", "tar", "gz", "tgz", "bz2", "xz", "7z", "rar", "zst", "lz4", "cab", "iso", "dmg", "img",
];
const OFFICE_DOC_EXTS = [
  "doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp", "epub", "mobi",
];
const KNOWN_BINARY_EXTS = [
  ...ARCHIVE_EXTS,
  ...OFFICE_DOC_EXTS,
  "exe", "dll", "so", "dylib", "bin", "dat", "class", "jar", "war", "ear", "pyc", "pyo",
  "wasm", "o", "a", "lib", "obj", "db", "sqlite", "sqlite3", "mdb",
  "woff", "woff2", "ttf", "otf", "eot", "psd", "ai", "sketch", "fig",
  "apk", "ipa", "deb", "rpm", "msi", "flv", "avi", "wmv", "rmvb", "wma",
];

export function getFileCategory(filename: string): FileCategory {
  const ext = getFileExtension(filename);
  if (INLINE_IMAGE_EXTS.includes(ext) || ext === "svg") return "image";
  if (INLINE_VIDEO_EXTS.includes(ext) || ["flv", "avi", "wmv"].includes(ext)) return "video";
  if (INLINE_AUDIO_EXTS.includes(ext) || ["wma"].includes(ext)) return "audio";
  if (ARCHIVE_EXTS.includes(ext)) return "archive";
  if (ext === "pdf") return "pdf";
  if (OFFICE_DOC_EXTS.includes(ext)) return "document";
  if (!KNOWN_BINARY_EXTS.includes(ext)) return "code";
  return "other";
}

export function isPreviewable(filename: string): boolean {
  return getPreviewKind(filename) !== null;
}

export function isEditableText(filename: string): boolean {
  return getPreviewKind(filename) === "text";
}

export type PreviewKind = "image" | "video" | "audio" | "pdf" | "text";

/**
 * 预览方式判定：
 * - 媒体与 PDF 匹配后端内联白名单；
 * - 其余只要不属于已知二进制归档/可执行/Office/字体格式，统一归为 "text"，
 *   从而支持所有代码、配置、无扩展名文本（如 Dockerfile/Makefile/LICENSE/README）及自定义文本格式预览与在线编辑。
 */
export function getPreviewKind(filename: string): PreviewKind | null {
  const ext = getFileExtension(filename);
  if (INLINE_IMAGE_EXTS.includes(ext)) return "image";
  if (INLINE_VIDEO_EXTS.includes(ext)) return "video";
  if (INLINE_AUDIO_EXTS.includes(ext)) return "audio";
  if (ext === "pdf") return "pdf";
  if (KNOWN_BINARY_EXTS.includes(ext)) return null;
  return "text";
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

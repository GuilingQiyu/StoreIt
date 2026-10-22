import { Locale } from "@/types";

export const LOCALE_STORAGE_KEY = "storeit-locale";

/**
 * Detects browser language preference.
 * Automatically returns "en" whenever the primary browser language is not Chinese (`zh*`).
 */
export function detectBrowserLocale(): Locale {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "zh";
  }
  const candidates: string[] = [];
  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    candidates.push(...navigator.languages);
  }
  if (navigator.language) {
    candidates.push(navigator.language);
  }
  const legacyLang = (navigator as any).userLanguage || (navigator as any).browserLanguage;
  if (legacyLang) {
    candidates.push(legacyLang);
  }
  const primary = (candidates.find((c) => Boolean(c && c.trim())) || "zh-CN").trim();
  return /^zh\b/i.test(primary) ? "zh" : "en";
}

/**
 * Returns the active locale:
 * 1. If the user explicitly chose "zh" or "en" in localStorage, honor that.
 * 2. Otherwise ("auto" or unset), automatically switch to "en" if browser language is non-Chinese.
 */
export function getSavedLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "zh" || saved === "en") {
      return saved;
    }
  } catch {}
  return detectBrowserLocale();
}

export function isLocaleFollowingBrowser(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    return saved !== "zh" && saved !== "en";
  } catch {
    return true;
  }
}

export function applyLocaleToDom(locale: Locale, persistChoice?: boolean | "auto") {
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
    document.title =
      locale === "en"
        ? "StoreIt - File Storage & Sharing"
        : "储之 StoreIt - 文件管理与分享";
  }
  if (typeof window !== "undefined" && persistChoice !== undefined) {
    try {
      if (persistChoice === "auto") {
        localStorage.removeItem(LOCALE_STORAGE_KEY);
      } else if (persistChoice === true) {
        localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      }
    } catch {}
  }
}

/**
 * Non-hook translation helper for stores, utilities, and callbacks.
 */
export function tr<T = string>(zh: T, en: T, locale?: Locale): T {
  const active = locale || getSavedLocale();
  return active === "en" ? en : zh;
}

const SERVER_MSG_MAP: Record<string, string> = {
  "未登录": "Not logged in",
  "无权限": "Permission denied",
  "用户名或密码错误": "Invalid username or password",
  "账号已被禁用，请联系管理员": "Account is disabled. Please contact administrator.",
  "登录失败次数过多，请稍后再试": "Too many failed login attempts. Please try again later.",
  "请填写完整注册信息": "Please complete all registration fields",
  "口令长度至少 8 位": "Password must be at least 8 characters",
  "邀请码无效或不存在": "Invalid or non-existent invitation code",
  "该邀请码已被撤销": "This invitation code has been revoked",
  "该邀请码已过期": "This invitation code has expired",
  "该邀请码已达到使用次数上限": "This invitation code has reached its usage limit",
  "该用户名已存在": "Username already exists",
  "注册成功": "Registration successful",
  "原密码错误": "Current password is incorrect",
  "新密码长度至少 8 位": "New password must be at least 8 characters",
  "文件不存在": "File does not exist",
  "目标目录不存在": "Target directory does not exist",
  "无法读取文件": "Failed to read file",
  "文件保存成功": "File saved successfully",
  "文件创建成功": "File created successfully",
  "文件夹创建成功": "Folder created successfully",
  "删除成功": "Deleted successfully",
  "重命名成功": "Renamed successfully",
  "移动成功": "Moved successfully",
  "复制成功": "Copied successfully",
  "空间配额不足": "Insufficient storage quota",
  "分享不存在或已失效": "Share link does not exist or has expired",
  "该分享需要访问提取码": "Access code required for this shared item",
  "提取码错误": "Incorrect access code",
  "该共享为只读权限，禁止修改内容": "This share is read-only; modifications are not allowed",
  "配置已成功保存并创建备份": "Configuration saved and backed up successfully",
};

export function localizeServerMessage(message: string, locale?: Locale): string {
  if (!message) return message;
  const active = locale || getSavedLocale();
  if (active !== "en") return message;
  const trimmed = message.trim();
  if (SERVER_MSG_MAP[trimmed]) {
    return SERVER_MSG_MAP[trimmed];
  }
  for (const [zhKey, enVal] of Object.entries(SERVER_MSG_MAP)) {
    if (trimmed.includes(zhKey)) {
      return trimmed.replace(zhKey, enVal);
    }
  }
  return message;
}

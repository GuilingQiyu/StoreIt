import { Locale } from "@/types";

export const LOCALE_STORAGE_KEY = "storeit-locale";
export const BROWSER_LOCALE_CACHE_KEY = "storeit-browser-locale";

/**
 * Detects browser language preference.
 * Automatically returns "en" whenever the browser language is not Chinese (`zh*`).
 * Checks navigator.languages[0], navigator.language, and Intl resolved locale so
 * browser settings changes and DevTools Sensors locale overrides both take effect immediately.
 */
export function detectBrowserLocale(): Locale {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "zh";
  }

  const primarySignals: string[] = [];

  if (Array.isArray(navigator.languages) && navigator.languages.length > 0 && navigator.languages[0]) {
    primarySignals.push(String(navigator.languages[0]).trim());
  }
  if (navigator.language) {
    primarySignals.push(String(navigator.language).trim());
  }
  const legacyLang = (navigator as any).userLanguage || (navigator as any).browserLanguage;
  if (legacyLang) {
    primarySignals.push(String(legacyLang).trim());
  }
  try {
    const intlLocale = Intl?.DateTimeFormat?.().resolvedOptions?.()?.locale;
    if (intlLocale) {
      primarySignals.push(String(intlLocale).trim());
    }
  } catch {}

  const validSignals = primarySignals.filter(Boolean);
  if (validSignals.length === 0) {
    return "zh";
  }

  // If any active primary browser locale indicator is non-Chinese, switch to English ("en").
  const hasNonChinesePrimary = validSignals.some((lang) => !/^zh\b/i.test(lang));
  return hasNonChinesePrimary ? "en" : "zh";
}

/**
 * Returns the active locale:
 * 1. Honor URL query parameter `?lang=en|zh|auto` if present.
 * 2. If the browser's detected locale changed since last visit, automatically follow the new browser locale.
 * 3. If the user explicitly pinned "zh" or "en" in localStorage, honor that.
 * 4. Otherwise ("auto" or unset), automatically switch to "en" if browser language is non-Chinese.
 */
export function getSavedLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  const currentBrowserLocale = detectBrowserLocale();

  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = (params.get("lang") || params.get("locale") || "").trim().toLowerCase();
    if (urlLang === "en" || urlLang.startsWith("en-")) {
      localStorage.setItem(LOCALE_STORAGE_KEY, "en");
      localStorage.setItem(BROWSER_LOCALE_CACHE_KEY, currentBrowserLocale);
      return "en";
    }
    if (urlLang === "zh" || urlLang.startsWith("zh-")) {
      localStorage.setItem(LOCALE_STORAGE_KEY, "zh");
      localStorage.setItem(BROWSER_LOCALE_CACHE_KEY, currentBrowserLocale);
      return "zh";
    }
    if (urlLang === "auto") {
      localStorage.removeItem(LOCALE_STORAGE_KEY);
      localStorage.setItem(BROWSER_LOCALE_CACHE_KEY, currentBrowserLocale);
      return currentBrowserLocale;
    }

    const prevBrowserLocale = localStorage.getItem(BROWSER_LOCALE_CACHE_KEY);
    if (prevBrowserLocale && prevBrowserLocale !== currentBrowserLocale) {
      // Browser language preference itself was changed by the user; follow the new browser language
      localStorage.removeItem(LOCALE_STORAGE_KEY);
      localStorage.setItem(BROWSER_LOCALE_CACHE_KEY, currentBrowserLocale);
      return currentBrowserLocale;
    }
    localStorage.setItem(BROWSER_LOCALE_CACHE_KEY, currentBrowserLocale);

    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "zh" || saved === "en") {
      return saved;
    }
  } catch {}
  return currentBrowserLocale;
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
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(BROWSER_LOCALE_CACHE_KEY, detectBrowserLocale());
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
  "口令至少 8 位": "Password must be at least 8 characters",
  "邀请码无效或不存在": "Invalid or non-existent invitation code",
  "该邀请码已被撤销": "This invitation code has been revoked",
  "该邀请码已过期": "This invitation code has expired",
  "该邀请码已达到使用次数上限": "This invitation code has reached its usage limit",
  "该用户名已存在": "Username already exists",
  "注册成功": "Registration successful",
  "注册成功，欢迎使用储之 StoreIt！": "Registration successful! Welcome to StoreIt!",
  "原密码错误": "Current password is incorrect",
  "新密码长度至少 8 位": "New password must be at least 8 characters",
  "文件不存在": "File does not exist",
  "目标目录不存在": "Target directory does not exist",
  "无法读取文件": "Failed to read file",
  "无法读取目录": "Failed to read directory",
  "无法读取最近文件": "Failed to load recent files",
  "文件保存成功": "File saved successfully",
  "文件已保存": "File saved",
  "共享文件已保存": "Shared file saved",
  "文件创建成功": "File created successfully",
  "文件夹创建成功": "Folder created successfully",
  "文件上传成功": "File uploaded successfully",
  "已上传至共享文件夹": "Uploaded to shared folder",
  "上传任务已取消并清理": "Upload canceled and cleaned up",
  "删除成功": "Deleted successfully",
  "重命名成功": "Renamed successfully",
  "移动成功": "Moved successfully",
  "复制成功": "Copied successfully",
  "空间配额不足": "Insufficient storage quota",
  "存储配额不足": "Insufficient storage quota",
  "分享不存在或已失效": "Share link does not exist or has expired",
  "分享链接无效或已过期": "Share link is invalid or has expired",
  "分享下载次数已耗尽或已过期": "Share download limit reached or link has expired",
  "被分享的文件已不存在": "The shared file no longer exists",
  "该分享需要访问提取码": "Access code required for this shared item",
  "需要输入正确的访问提取码": "Please enter the correct access code",
  "提取码错误": "Incorrect access code",
  "该共享为只读权限，禁止修改内容": "This share is read-only; modifications are not allowed",
  "该共享为只读权限 (R)，不允许上传或修改": "This share is read-only (R); uploading or editing is not allowed",
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

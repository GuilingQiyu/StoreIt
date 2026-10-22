"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[819],{2381:function(e,t,n){n.d(t,{z:function(){return c},Button:function(){return c}});var a=n(7437),o=n(2265),i=n(7053),r=n(535),s=n(3448);let d=(0,r.j)("inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary/15 text-foreground hover:bg-secondary/25",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline",brand:"bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow hover:opacity-95"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),c=o.forwardRef(((e,t)=>{let{className:n,variant:o,size:r,asChild:c=!1,...p}=e,u=c?i.g7:"button";return(0,a.jsx)(u,{className:(0,s.cn)(d({variant:o,size:r,className:n})),ref:t,...p})}));c.displayName="Button"},279:function(e,t,n){n.d(t,{I:function(){return r},Input:function(){return r}});var a=n(7437),o=n(2265),i=n(3448);let r=o.forwardRef(((e,t)=>{let{className:n,type:o,...r}=e;return(0,a.jsx)("input",{type:o,className:(0,i.cn)("flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",n),ref:t,...r})}));r.displayName="Input"},1837:function(e,t,n){n.d(t,{h:function(){return api},api:function(){return api},ApiError:function(){return ApiError}});var _u=n(3448),tr=_u.tr,localizeServerMessage=_u.localizeServerMessage;
class ApiError extends Error {
  status;
  passwordRequired;
  constructor(message, status, passwordRequired) {
    super(localizeServerMessage(message));
    this.name = "ApiError";
    this.status = status;
    this.passwordRequired = passwordRequired;
  }
}
async function fetchJson(url, options) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Accept": "application/json",
      ...(options?.headers || {})
    }
  });
  if (!res.ok) {
    if (res.status === 401 && !url.includes("/api/fed/shares/")) {
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    let msg = `HTTP ${res.status}`;
    let pwdReq = false;
    try {
      const errData = await res.json();
      msg = errData.message || errData.error || msg;
      pwdReq = Boolean(errData.passwordRequired);
    } catch {
      // ignore
    }
    throw new ApiError(msg, res.status, pwdReq);
  }
  return res.json();
}
function fedBaseUrl(remoteServerUrl) {
  if (!remoteServerUrl || !remoteServerUrl.trim()) return "";
  return remoteServerUrl.trim().replace(/\/+$/, "");
}
function fedHeaders(password) {
  const h = {};
  if (password && password.trim()) {
    h["X-StoreIt-Share-Password"] = password.trim();
  }
  return h;
}
const api = {
  // Auth & Invited Registration
  async getStatus() {
    return fetchJson("/api/user/status");
  },
  async login(formData) {
    const res = await fetch("/api/login", {
      method: "POST",
      body: formData
    });
    if (!res.ok) {
      let msg = tr("登录失败", "Login failed");
      try {
        const body = await res.json();
        msg = body.message || body.error || msg;
      } catch {}
      throw new ApiError(msg, res.status);
    }
    return res.json();
  },
  async register(username, password, inviteCode) {
    return fetchJson("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
        inviteCode
      })
    });
  },
  async logout() {
    return fetchJson("/api/logout", {
      method: "POST"
    });
  },
  async changeOwnPassword(oldPassword, newPassword) {
    return fetchJson("/api/user/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        oldPassword,
        newPassword
      })
    });
  },
  // Files & Folders
  async getFiles(path = "") {
    const url = `/api/files?path=${encodeURIComponent(path)}`;
    const data = await fetchJson(url);
    const items = (data.items || []).map(item => ({
      name: item.name,
      path: item.path,
      isDirectory: Boolean(item.isDirectory ?? item.directory),
      size: item.size,
      modifiedTime: item.modifiedTime || item.modified_time,
      isFavorite: Boolean(item.isFavorite ?? item.favorite)
    }));
    return {
      items,
      currentPath: data.currentPath ?? data.current_path ?? ""
    };
  },
  async resyncFiles() {
    return fetchJson("/api/files/resync", {
      method: "POST"
    });
  },
  async getRecent() {
    const data = await fetchJson("/api/files/recent");
    const items = (data.items || []).map(item => ({
      name: item.name,
      path: item.path,
      isDirectory: Boolean(item.isDirectory ?? item.directory),
      size: item.size,
      modifiedTime: item.modifiedTime || item.modified_time,
      isFavorite: Boolean(item.isFavorite ?? item.favorite)
    }));
    return items;
  },
  async getFavorites() {
    const data = await fetchJson("/api/favorites");
    const items = (data.items || []).map(item => ({
      name: item.name,
      path: item.path,
      isDirectory: Boolean(item.isDirectory ?? item.directory),
      size: item.size,
      modifiedTime: item.modifiedTime || item.modified_time,
      isFavorite: true
    }));
    return items;
  },
  async searchFiles(query) {
    const data = await fetchJson(`/api/files/search?q=${encodeURIComponent(query || "")}`);
    const items = (data.items || []).map(item => ({
      name: item.name,
      path: item.path,
      isDirectory: Boolean(item.isDirectory ?? item.directory),
      size: item.size,
      modifiedTime: item.modifiedTime || item.modified_time,
      isFavorite: Boolean(item.isFavorite ?? item.favorite)
    }));
    return items;
  },
  async getQuota() {
    const data = await fetchJson("/api/storage/usage");
    return {
      used: Number(data.used) || 0,
      total: Number(data.total) || 0,
      free: Number(data.free) || 0,
      quota: Number(data.quota) || 0,
      unlimited: Boolean(data.unlimited),
      scope: data.scope
    };
  },
  async createDirectory(parentPath, name) {
    const fullPath = parentPath ? `${parentPath}/${name}` : name;
    return fetchJson("/api/folder/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        path: fullPath
      })
    });
  },
  async createBlankFile(parentPath, fileName, content = "", conflictStrategy = "rename") {
    return fetchJson("/api/file/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        parentPath,
        fileName,
        content,
        conflictStrategy
      })
    });
  },
  async resolveFolderConflict(parentPath, folderName, strategy) {
    return fetchJson("/api/folder/resolve-conflict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        parentPath,
        folderName,
        strategy
      })
    });
  },
  async getFileContent(path) {
    return fetchJson(`/api/file/content?path=${encodeURIComponent(path)}`);
  },
  async saveFileContent(path, content, expectedModifiedTime, charset) {
    return fetchJson("/api/file/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        path,
        content,
        expectedModifiedTime,
        charset
      })
    });
  },
  async deleteFile(path) {
    return fetchJson("/api/file/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        path
      })
    });
  },
  async batchDeleteFiles(paths) {
    return fetchJson("/api/file/batch-delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        paths
      })
    });
  },
  async moveFile(from, to) {
    return fetchJson("/api/file/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        path: from,
        destination: to
      })
    });
  },
  async batchMoveFiles(paths, destination) {
    return fetchJson("/api/file/batch-move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        paths,
        destination
      })
    });
  },
  async copyFile(from, to) {
    return fetchJson("/api/file/copy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        path: from,
        destination: to
      })
    });
  },
  async batchCopyFiles(paths, destination) {
    return fetchJson("/api/file/batch-copy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        paths,
        destination
      })
    });
  },
  async renameFile(path, newName) {
    return fetchJson("/api/file/rename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        path,
        newName
      })
    });
  },
  async setFavorite(path, favorite) {
    if (favorite) {
      return fetchJson("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          path
        })
      });
    } else {
      return fetchJson(`/api/favorites?path=${encodeURIComponent(path)}`, {
        method: "DELETE"
      });
    }
  },
  // Upload (Single / Simple upload for <= 50MB files & 0-byte files)
  async uploadSingleFile(file, directory, onProgress, signal, conflictStrategy = "rename") {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);
      if (signal) {
        signal.addEventListener("abort", () => {
          xhr.abort();
          reject(new DOMException("Upload aborted", "AbortError"));
        });
      }
      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = e => {
          if (e.lengthComputable) {
            onProgress(Math.round(e.loaded / e.total * 100));
          }
        };
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch {
            resolve({
              success: true,
              message: tr("文件上传成功", "File uploaded successfully"),
              file: {
                name: file.name
              }
            });
          }
        } else {
          let msg = `${tr("上传失败", "Upload failed")} (HTTP ${xhr.status})`;
          try {
            const data = JSON.parse(xhr.responseText);
            msg = data.error || data.message || msg;
          } catch {}
          reject(new ApiError(msg, xhr.status));
        }
      };
      xhr.onerror = () => {
        reject(new ApiError(tr("网络错误，上传失败", "Network error, upload failed")));
      };
      const fd = new FormData();
      fd.append("file", file);
      fd.append("directory", directory || "");
      fd.append("conflictStrategy", conflictStrategy || "rename");
      xhr.send(fd);
    });
  },
  // Shares & Cross-Server Federated Shares (SFSP/1.0)
  async getShares() {
    const data = await fetchJson("/api/shares");
    return data.data || [];
  },
  async createShare(filePath, expireHours, maxDownloads, permission = "READ", accessPassword, title) {
    return fetchJson("/api/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filePath,
        expireHours,
        maxDownloads,
        permission,
        accessPassword,
        title
      })
    });
  },
  async revokeShare(id) {
    return fetchJson(`/api/shares/${id}`, {
      method: "DELETE"
    });
  },
  async getShareMounts() {
    const data = await fetchJson("/api/shares/mounts");
    return data.data || [];
  },
  async createShareMount(payload) {
    return fetchJson("/api/shares/mounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  },
  async deleteShareMount(id) {
    return fetchJson(`/api/shares/mounts/${id}`, {
      method: "DELETE"
    });
  },
  // Federated Share Protocol (SFSP/1.0) Client Operations (supports local or remoteServerUrl)
  async getFederatedManifest(token, password, remoteServerUrl) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson(`${base}/api/fed/shares/${encodeURIComponent(token)}/manifest`, {
      headers: fedHeaders(password)
    });
  },
  async listFederatedShare(token, subPath = "", password, remoteServerUrl) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson(`${base}/api/fed/shares/${encodeURIComponent(token)}/list?subPath=${encodeURIComponent(subPath)}`, {
      headers: fedHeaders(password)
    });
  },
  async getFederatedFileContent(token, subPath, password, remoteServerUrl) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson(`${base}/api/fed/shares/${encodeURIComponent(token)}/content?subPath=${encodeURIComponent(subPath)}`, {
      headers: fedHeaders(password)
    });
  },
  async saveFederatedFileContent(token, subPath, content, password, remoteServerUrl, charset) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson(`${base}/api/fed/shares/${encodeURIComponent(token)}/content`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...fedHeaders(password)
      },
      body: JSON.stringify({
        subPath,
        content,
        charset,
        password
      })
    });
  },
  async createFederatedSubfolder(token, subPath, folderName, password, remoteServerUrl) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson(`${base}/api/fed/shares/${encodeURIComponent(token)}/mkdir`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...fedHeaders(password)
      },
      body: JSON.stringify({
        subPath,
        folderName,
        password
      })
    });
  },
  async createFederatedBlankFile(token, subPath, fileName, content, password, remoteServerUrl) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson(`${base}/api/fed/shares/${encodeURIComponent(token)}/create-file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...fedHeaders(password)
      },
      body: JSON.stringify({
        subPath,
        fileName,
        content,
        password
      })
    });
  },
  async uploadToFederatedShare(token, subPath, file, conflictStrategy = "rename", password, remoteServerUrl) {
    const base = fedBaseUrl(remoteServerUrl);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("subPath", subPath || "");
    fd.append("conflictStrategy", conflictStrategy);
    if (password) fd.append("password", password);
    return fetchJson(`${base}/api/fed/shares/${encodeURIComponent(token)}/upload`, {
      method: "POST",
      headers: fedHeaders(password),
      body: fd
    });
  },
  async deleteFederatedItem(token, subPath, password, remoteServerUrl) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson(`${base}/api/fed/shares/${encodeURIComponent(token)}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...fedHeaders(password)
      },
      body: JSON.stringify({
        subPath,
        password
      })
    });
  },
  async renameFederatedItem(token, subPath, newName, password, remoteServerUrl) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson(`${base}/api/fed/shares/${encodeURIComponent(token)}/rename`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...fedHeaders(password)
      },
      body: JSON.stringify({
        subPath,
        newName,
        password
      })
    });
  },
  // Admin Users & Invite Codes
  async getAdminUsers() {
    const data = await fetchJson("/api/admin/users");
    return data.data || [];
  },
  async createAdminUser(data) {
    return fetchJson("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  },
  async updateAdminUser(username, data) {
    return fetchJson(`/api/admin/users/${encodeURIComponent(username)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  },
  async resetAdminUserPassword(username, password, mustChangePassword) {
    return fetchJson(`/api/admin/users/${encodeURIComponent(username)}/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        mustChangePassword
      })
    });
  },
  async getAdminInvites() {
    const data = await fetchJson("/api/admin/invites");
    return data.data || [];
  },
  async createAdminInvite(data) {
    return fetchJson("/api/admin/invites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  },
  async deleteAdminInvite(id) {
    return fetchJson(`/api/admin/invites/${id}`, {
      method: "DELETE"
    });
  },
  // Admin Config
  async getAdminConfig() {
    const res = await fetchJson("/api/admin/config");
    return res.data;
  },
  async updateAdminConfig(payload) {
    return fetchJson("/api/admin/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  },
  // Resumable Chunked Uploads
  async initChunkedUpload(fileName, fileSize, directory, conflictStrategy = "rename") {
    return fetchJson("/api/upload/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileName,
        fileSize,
        directory,
        conflictStrategy
      })
    });
  },
  async uploadChunk(uploadId, chunkIndex, chunk, signal, onProgress) {
    return new Promise((resolve, reject) => {
      const fd = new FormData();
      fd.append("uploadId", uploadId);
      fd.append("chunkIndex", String(chunkIndex));
      fd.append("chunk", chunk, `chunk_${chunkIndex}.part`);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload/chunk", true);
      if (signal) {
        if (signal.aborted) {
          reject(new DOMException("Upload aborted", "AbortError"));
          return;
        }
        signal.addEventListener("abort", () => {
          xhr.abort();
          reject(new DOMException("Upload aborted", "AbortError"));
        });
      }
      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = e => {
          if (e.lengthComputable) onProgress(e.loaded);
        };
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            resolve({
              success: true,
              chunkIndex
            });
          }
        } else {
          let msg = tr("分片上传失败", "Chunk upload failed");
          try {
            const body = JSON.parse(xhr.responseText);
            msg = body.message || body.error || msg;
          } catch {}
          reject(new ApiError(msg, xhr.status));
        }
      };
      xhr.onerror = () => {
        reject(new ApiError(tr("网络错误，分片上传失败", "Network error, chunk upload failed")));
      };
      xhr.send(fd);
    });
  },
  async completeChunkedUpload(uploadId) {
    return fetchJson("/api/upload/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uploadId
      })
    });
  },
  async getUploadStatus(uploadId) {
    return fetchJson(`/api/upload/status?uploadId=${encodeURIComponent(uploadId)}`);
  },
  async cancelChunkedUpload(uploadId) {
    return fetchJson(`/api/upload/${encodeURIComponent(uploadId)}`, {
      method: "DELETE"
    });
  }
};
},3448:function(e,t,n){n.d(t,{M:function(){return isPreviewable},VO:function(){return getFileCategory},Wr:function(){return getPreviewKind},cn:function(){return cn},km:function(){return getDownloadUrl},p6:function(){return formatDate},pC:function(){return getPreviewUrl},td:function(){return formatBytes},vQ:function(){return copyToClipboard},formatBytes:function(){return formatBytes},formatDate:function(){return formatDate},getFileExtension:function(){return getFileExtension},getParentDirectory:function(){return getParentDirectory},getFileCategory:function(){return getFileCategory},isPreviewable:function(){return isPreviewable},isEditableText:function(){return isEditableText},getPreviewKind:function(){return getPreviewKind},getDownloadUrl:function(){return getDownloadUrl},getZipDownloadUrl:function(){return getZipDownloadUrl},getPreviewUrl:function(){return getPreviewUrl},copyToClipboard:function(){return copyToClipboard},THEME_OPTIONS:function(){return THEME_OPTIONS},getSavedTheme:function(){return getSavedTheme},applyThemeToDom:function(){return applyThemeToDom},detectBrowserLocale:function(){return detectBrowserLocale},getSavedLocale:function(){return getSavedLocale},isLocaleFollowingBrowser:function(){return isLocaleFollowingBrowser},applyLocaleToDom:function(){return applyLocaleToDom},tr:function(){return tr},localizeServerMessage:function(){return localizeServerMessage}});var _clsx=n(1994),_tw=n(3335),clsx=_clsx.W,twMerge=_tw.m6;
const LOCALE_STORAGE_KEY = "storeit-locale";
function detectBrowserLocale() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "zh";
  }
  const candidates = [];
  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    candidates.push(...navigator.languages);
  }
  if (navigator.language) {
    candidates.push(navigator.language);
  }
  const legacyLang = navigator.userLanguage || navigator.browserLanguage;
  if (legacyLang) {
    candidates.push(legacyLang);
  }
  const primary = (candidates.find(c => Boolean(c && c.trim())) || "zh-CN").trim();
  return /^zh\b/i.test(primary) ? "zh" : "en";
}
function getSavedLocale() {
  if (typeof window === "undefined") return "zh";
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "zh" || saved === "en") {
      return saved;
    }
  } catch {}
  return detectBrowserLocale();
}
function isLocaleFollowingBrowser() {
  if (typeof window === "undefined") return true;
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    return saved !== "zh" && saved !== "en";
  } catch {
    return true;
  }
}
function applyLocaleToDom(locale, persistChoice) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
    document.title = locale === "en" ? "StoreIt - File Storage & Sharing" : "储之 StoreIt - 文件管理与分享";
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
function tr(zh, en, locale) {
  const active = locale || getSavedLocale();
  return active === "en" ? en : zh;
}
const SERVER_MSG_MAP = {
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
  "配置已成功保存并创建备份": "Configuration saved and backed up successfully"
};
function localizeServerMessage(message, locale) {
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
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const THEME_OPTIONS = [{
  key: "classic",
  label: "暮紫莫兰迪",
  labelEn: "Morandi Dusk",
  desc: "默认温润雅致",
  descEn: "Warm & elegant default",
  swatch: "#4a4e69"
}, {
  key: "ocean",
  label: "深海蔚蓝",
  labelEn: "Ocean Blue",
  desc: "清爽科技蓝调",
  descEn: "Crisp tech blue palette",
  swatch: "#1e40af"
}, {
  key: "forest",
  label: "翡翠森绿",
  labelEn: "Emerald Forest",
  desc: "自然护眼青绿",
  descEn: "Natural eye-care green",
  swatch: "#065f46"
}, {
  key: "sunset",
  label: "琥珀暖阳",
  labelEn: "Amber Sunset",
  desc: "活力温暖橙棕",
  descEn: "Vibrant warm amber",
  swatch: "#9a3412"
}, {
  key: "sakura",
  label: "樱花粉黛",
  labelEn: "Sakura Pink",
  desc: "柔和浪漫粉紫",
  descEn: "Soft romantic rose",
  swatch: "#9d174d"
}, {
  key: "dark",
  label: "极夜暗黑",
  labelEn: "Midnight Dark",
  desc: "深色低光护眼",
  descEn: "Low-light dark mode",
  swatch: "#312e81"
}];
function getSavedTheme() {
  if (typeof window === "undefined") return "classic";
  try {
    const saved = localStorage.getItem("storeit-theme");
    if (saved && THEME_OPTIONS.some(t => t.key === saved)) {
      return saved;
    }
  } catch {}
  return "classic";
}
function applyThemeToDom(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  try {
    localStorage.setItem("storeit-theme", theme);
  } catch {}
}
function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return "0 B";
  if (bytes < 0 || isNaN(bytes)) return "--";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
function formatDate(timestamp, locale) {
  if (!timestamp) return "--";
  const date = typeof timestamp === "number" ? new Date(timestamp > 1e11 ? timestamp : timestamp * 1000) : new Date(timestamp);
  if (isNaN(date.getTime())) return String(timestamp);
  const activeLocale = locale || getSavedLocale();
  return date.toLocaleString(activeLocale === "en" ? "en-US" : "zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
}
function getFileExtension(filename) {
  if (!filename) return "";
  const base = filename.split("/").pop() || filename;
  if (base.startsWith(".") && !base.slice(1).includes(".")) {
    return base.slice(1).toLowerCase();
  }
  const parts = base.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
}
function getParentDirectory(path) {
  if (!path || !path.includes("/")) return "";
  return path.slice(0, path.lastIndexOf("/"));
}
const INLINE_IMAGE_EXTS = ["png", "apng", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "gif", "webp", "bmp", "avif", "ico", "cur"];
const INLINE_VIDEO_EXTS = ["mp4", "m4v", "webm", "ogg", "ogv", "mov", "3gp", "mkv"];
const INLINE_AUDIO_EXTS = ["mp3", "wav", "flac", "aac", "m4a", "oga", "opus", "weba", "mid", "midi", "amr"];
const ARCHIVE_EXTS = ["zip", "tar", "gz", "tgz", "bz2", "xz", "7z", "rar", "zst", "lz4", "cab", "iso", "dmg", "img"];
const OFFICE_DOC_EXTS = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp", "epub", "mobi"];
const KNOWN_BINARY_EXTS = [...ARCHIVE_EXTS, ...OFFICE_DOC_EXTS, "exe", "dll", "so", "dylib", "bin", "dat", "class", "jar", "war", "ear", "pyc", "pyo", "wasm", "o", "a", "lib", "obj", "db", "sqlite", "sqlite3", "mdb", "woff", "woff2", "ttf", "otf", "eot", "psd", "ai", "sketch", "fig", "apk", "ipa", "deb", "rpm", "msi", "flv", "avi", "wmv", "rmvb", "wma"];
function getFileCategory(filename) {
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
function isPreviewable(filename) {
  return getPreviewKind(filename) !== null;
}
function isEditableText(filename) {
  return getPreviewKind(filename) === "text";
}
function getPreviewKind(filename) {
  const ext = getFileExtension(filename);
  if (INLINE_IMAGE_EXTS.includes(ext)) return "image";
  if (INLINE_VIDEO_EXTS.includes(ext)) return "video";
  if (INLINE_AUDIO_EXTS.includes(ext)) return "audio";
  if (ext === "pdf") return "pdf";
  if (KNOWN_BINARY_EXTS.includes(ext)) return null;
  return "text";
}
function getDownloadUrl(path) {
  if (!path) return "/storage/";
  const encoded = path.split("/").map(seg => encodeURIComponent(seg)).join("/");
  return `/storage/${encoded}`;
}
function getZipDownloadUrl(paths) {
  const valid = (paths || []).filter(Boolean);
  if (valid.length === 0) return "/api/download/zip";
  const query = valid.map(p => `paths=${encodeURIComponent(p)}`).join("&");
  return `/api/download/zip?${query}`;
}
function getPreviewUrl(path) {
  return `/api/preview?path=${encodeURIComponent(path || "")}`;
}
async function copyToClipboard(text) {
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
},3864:function(e,t,n){n.d(t,{t:function(){return useAuthStore},useAuthStore:function(){return useAuthStore}});var _z=n(3011),_api=n(1837),create=_z.U,api=_api.h;
const useAuthStore = create(set => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  checkAuth: async () => {
    try {
      set({
        isLoading: true
      });
      const status = await api.getStatus();
      if (status.logged_in && status.username) {
        const user = {
          username: status.username,
          role: status.role || "USER",
          mustChangePassword: status.must_change_password
        };
        set({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        return false;
      }
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      return false;
    }
  },
  login: async formData => {
    await api.login(formData);
    const status = await api.getStatus();
    const user = {
      username: status.username || "",
      role: status.role || "USER",
      mustChangePassword: status.must_change_password
    };
    set({
      user,
      isAuthenticated: true
    });
  },
  logout: async () => {
    try {
      await api.logout();
    } catch {}
    set({
      user: null,
      isAuthenticated: false
    });
  },
  setUser: user => set({
    user,
    isAuthenticated: Boolean(user)
  })
}));
}}]);
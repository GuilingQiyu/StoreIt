import {
  AdminConfigData,
  FileConflictStrategy,
  FileItem,
  FileShare,
  FolderConflictStrategy,
  InviteCodeItem,
  ShareMountItem,
  SharePermission,
  SharedSpaceManifest,
  StorageQuota,
  User,
} from "@/types";

export class ApiError extends Error {
  status?: number;
  passwordRequired?: boolean;
  constructor(message: string, status?: number, passwordRequired?: boolean) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.passwordRequired = passwordRequired;
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Accept": "application/json",
      ...(options?.headers || {}),
    },
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

  return res.json() as Promise<T>;
}

function fedBaseUrl(remoteServerUrl?: string): string {
  if (!remoteServerUrl || !remoteServerUrl.trim()) return "";
  return remoteServerUrl.trim().replace(/\/+$/, "");
}

function fedHeaders(password?: string): Record<string, string> {
  const h: Record<string, string> = {};
  if (password && password.trim()) {
    h["X-StoreIt-Share-Password"] = password.trim();
  }
  return h;
}

export const api = {
  // Auth & Invited Registration
  async getStatus() {
    return fetchJson<{
      logged_in: boolean;
      username?: string;
      role?: string;
      must_change_password?: boolean;
    }>("/api/user/status");
  },

  async login(formData: FormData) {
    const res = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      let msg = "登录失败";
      try {
        const body = await res.json();
        msg = body.message || body.error || msg;
      } catch {}
      throw new ApiError(msg, res.status);
    }
    return res.json();
  },

  async register(username: string, password: string, inviteCode: string) {
    return fetchJson<{
      success: boolean;
      message: string;
      data: { username: string; role: string; storageQuota: number };
    }>("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, inviteCode }),
    });
  },

  async logout() {
    return fetchJson<{ success: boolean }>("/api/logout", { method: "POST" });
  },

  async changeOwnPassword(oldPassword: string, newPassword: string) {
    return fetchJson<{ success: boolean; message: string }>("/api/user/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  },

  // Files & Folders
  async getFiles(path = "") {
    const url = `/api/files?path=${encodeURIComponent(path)}`;
    const data = await fetchJson<any>(url);
    const items: FileItem[] = (data.items || []).map((item: any) => ({
      name: item.name,
      path: item.path,
      isDirectory: Boolean(item.isDirectory ?? item.directory),
      size: item.size,
      modifiedTime: item.modifiedTime || item.modified_time,
      isFavorite: Boolean(item.isFavorite ?? item.favorite),
    }));
    return {
      items,
      currentPath: data.currentPath ?? data.current_path ?? "",
    };
  },

  async resyncFiles() {
    return fetchJson<{ success: boolean; indexed: number; removed: number }>("/api/files/resync", {
      method: "POST",
    });
  },

  async getRecent() {
    const data = await fetchJson<any>("/api/files/recent");
    const items: FileItem[] = (data.items || []).map((item: any) => ({
      name: item.name,
      path: item.path,
      isDirectory: Boolean(item.isDirectory ?? item.directory),
      size: item.size,
      modifiedTime: item.modifiedTime || item.modified_time,
      isFavorite: Boolean(item.isFavorite ?? item.favorite),
    }));
    return items;
  },

  async getFavorites() {
    const data = await fetchJson<any>("/api/favorites");
    const items: FileItem[] = (data.items || []).map((item: any) => ({
      name: item.name,
      path: item.path,
      isDirectory: Boolean(item.isDirectory ?? item.directory),
      size: item.size,
      modifiedTime: item.modifiedTime || item.modified_time,
      isFavorite: true,
    }));
    return items;
  },

  async searchFiles(query: string) {
    const data = await fetchJson<any>(`/api/files/search?q=${encodeURIComponent(query || "")}`);
    const items: FileItem[] = (data.items || []).map((item: any) => ({
      name: item.name,
      path: item.path,
      isDirectory: Boolean(item.isDirectory ?? item.directory),
      size: item.size,
      modifiedTime: item.modifiedTime || item.modified_time,
      isFavorite: Boolean(item.isFavorite ?? item.favorite),
    }));
    return items;
  },

  async getQuota(): Promise<StorageQuota> {
    const data = await fetchJson<any>("/api/storage/usage");
    return {
      used: Number(data.used) || 0,
      total: Number(data.total) || 0,
      free: Number(data.free) || 0,
      quota: Number(data.quota) || 0,
      unlimited: Boolean(data.unlimited),
      scope: data.scope,
    };
  },

  async createDirectory(parentPath: string, name: string) {
    const fullPath = parentPath ? `${parentPath}/${name}` : name;
    return fetchJson<{ success: boolean }>("/api/folder/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: fullPath }),
    });
  },

  async createBlankFile(
    parentPath: string,
    fileName: string,
    content = "",
    conflictStrategy = "rename"
  ) {
    return fetchJson<{
      success: boolean;
      message: string;
      file: { path: string; name: string; size: number; modifiedTime: number; isDirectory: boolean };
    }>("/api/file/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentPath, fileName, content, conflictStrategy }),
    });
  },

  async resolveFolderConflict(
    parentPath: string,
    folderName: string,
    strategy: FolderConflictStrategy
  ) {
    return fetchJson<{ success: boolean; folderName: string; targetPath: string }>(
      "/api/folder/resolve-conflict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentPath, folderName, strategy }),
      }
    );
  },

  async getFileContent(path: string) {
    return fetchJson<{
      path: string;
      name: string;
      size: number;
      modifiedTime: number;
      charset?: string;
      content: string;
    }>(`/api/file/content?path=${encodeURIComponent(path)}`);
  },

  async saveFileContent(
    path: string,
    content: string,
    expectedModifiedTime?: number,
    charset?: string
  ) {
    return fetchJson<{
      success: boolean;
      message: string;
      file: { path: string; name: string; size: number; modifiedTime: number; charset?: string };
    }>("/api/file/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, content, expectedModifiedTime, charset }),
    });
  },

  async deleteFile(path: string) {
    return fetchJson<{ success: boolean }>("/api/file/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
  },

  async batchDeleteFiles(paths: string[]) {
    return fetchJson<{ success: boolean; deleted: number }>("/api/file/batch-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });
  },

  async moveFile(from: string, to: string) {
    return fetchJson<{ success: boolean; path: string }>("/api/file/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: from, destination: to }),
    });
  },

  async batchMoveFiles(paths: string[], destination: string) {
    return fetchJson<{ success: boolean; moved: number }>("/api/file/batch-move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths, destination }),
    });
  },

  async copyFile(from: string, to: string) {
    return fetchJson<{ success: boolean; path: string }>("/api/file/copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: from, destination: to }),
    });
  },

  async batchCopyFiles(paths: string[], destination: string) {
    return fetchJson<{ success: boolean; copied: number }>("/api/file/batch-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths, destination }),
    });
  },

  async renameFile(path: string, newName: string) {
    return fetchJson<{ success: boolean }>("/api/file/rename", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, newName }),
    });
  },

  async setFavorite(path: string, favorite: boolean) {
    if (favorite) {
      return fetchJson<{ success: boolean }>("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
    } else {
      return fetchJson<{ success: boolean }>(`/api/favorites?path=${encodeURIComponent(path)}`, {
        method: "DELETE",
      });
    }
  },

  // Upload (Single / Simple upload for <= 50MB files & 0-byte files)
  async uploadSingleFile(
    file: File,
    directory: string,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal,
    conflictStrategy: FileConflictStrategy = "rename"
  ): Promise<{ success: boolean; message: string; file: any }> {
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
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch {
            resolve({ success: true, message: "文件上传成功", file: { name: file.name } });
          }
        } else {
          let msg = `上传失败 (HTTP ${xhr.status})`;
          try {
            const data = JSON.parse(xhr.responseText);
            msg = data.error || data.message || msg;
          } catch {}
          reject(new ApiError(msg, xhr.status));
        }
      };

      xhr.onerror = () => {
        reject(new ApiError("网络错误，上传失败"));
      };

      const fd = new FormData();
      fd.append("file", file);
      fd.append("directory", directory || "");
      fd.append("conflictStrategy", conflictStrategy || "rename");
      xhr.send(fd);
    });
  },

  // Shares & Cross-Server Federated Shares (SFSP/1.0)
  async getShares(): Promise<FileShare[]> {
    const data = await fetchJson<{ data: FileShare[] }>("/api/shares");
    return data.data || [];
  },

  async createShare(
    filePath: string,
    expireHours: number,
    maxDownloads?: number,
    permission: SharePermission = "READ",
    accessPassword?: string,
    title?: string
  ) {
    return fetchJson<{
      data: {
        token: string;
        url: string;
        webUrl?: string;
        federatedUri?: string;
        isDirectory?: boolean;
        permission?: SharePermission;
      };
    }>("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filePath,
        expireHours,
        maxDownloads,
        permission,
        accessPassword,
        title,
      }),
    });
  },

  async revokeShare(id: number) {
    return fetchJson(`/api/shares/${id}`, {
      method: "DELETE",
    });
  },

  async getShareMounts(): Promise<ShareMountItem[]> {
    const data = await fetchJson<{ data: ShareMountItem[] }>("/api/shares/mounts");
    return data.data || [];
  },

  async createShareMount(payload: {
    shareLinkOrToken: string;
    accessPassword?: string;
    mountName?: string;
    permission?: SharePermission;
    ownerName?: string;
    isDirectory?: boolean;
  }) {
    return fetchJson<{ data: ShareMountItem }>("/api/shares/mounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async deleteShareMount(id: number) {
    return fetchJson(`/api/shares/mounts/${id}`, {
      method: "DELETE",
    });
  },

  // Federated Share Protocol (SFSP/1.0) Client Operations (supports local or remoteServerUrl)
  async getFederatedManifest(
    token: string,
    password?: string,
    remoteServerUrl?: string
  ): Promise<SharedSpaceManifest> {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson<SharedSpaceManifest>(
      `${base}/api/fed/shares/${encodeURIComponent(token)}/manifest`,
      { headers: fedHeaders(password) }
    );
  },

  async listFederatedShare(
    token: string,
    subPath = "",
    password?: string,
    remoteServerUrl?: string
  ) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson<{
      currentSubPath: string;
      permission: SharePermission;
      isDirectory: boolean;
      items: FileItem[];
    }>(
      `${base}/api/fed/shares/${encodeURIComponent(token)}/list?subPath=${encodeURIComponent(subPath)}`,
      { headers: fedHeaders(password) }
    );
  },

  async getFederatedFileContent(
    token: string,
    subPath: string,
    password?: string,
    remoteServerUrl?: string
  ) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson<{
      path: string;
      name: string;
      size: number;
      modifiedTime: number;
      charset?: string;
      content: string;
      permission?: SharePermission;
    }>(
      `${base}/api/fed/shares/${encodeURIComponent(token)}/content?subPath=${encodeURIComponent(subPath)}`,
      { headers: fedHeaders(password) }
    );
  },

  async saveFederatedFileContent(
    token: string,
    subPath: string,
    content: string,
    password?: string,
    remoteServerUrl?: string,
    charset?: string
  ) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson<{ success: boolean; message: string; file: any }>(
      `${base}/api/fed/shares/${encodeURIComponent(token)}/content`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...fedHeaders(password),
        },
        body: JSON.stringify({ subPath, content, charset, password }),
      }
    );
  },

  async createFederatedSubfolder(
    token: string,
    subPath: string,
    folderName: string,
    password?: string,
    remoteServerUrl?: string
  ) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson<{ success: boolean; path: string }>(
      `${base}/api/fed/shares/${encodeURIComponent(token)}/mkdir`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...fedHeaders(password),
        },
        body: JSON.stringify({ subPath, folderName, password }),
      }
    );
  },

  async createFederatedBlankFile(
    token: string,
    subPath: string,
    fileName: string,
    content: string,
    password?: string,
    remoteServerUrl?: string
  ) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson<{ success: boolean; file: any }>(
      `${base}/api/fed/shares/${encodeURIComponent(token)}/create-file`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...fedHeaders(password),
        },
        body: JSON.stringify({ subPath, fileName, content, password }),
      }
    );
  },

  async uploadToFederatedShare(
    token: string,
    subPath: string,
    file: File,
    conflictStrategy: FileConflictStrategy = "rename",
    password?: string,
    remoteServerUrl?: string
  ) {
    const base = fedBaseUrl(remoteServerUrl);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("subPath", subPath || "");
    fd.append("conflictStrategy", conflictStrategy);
    if (password) fd.append("password", password);
    return fetchJson<{ success: boolean; file: any }>(
      `${base}/api/fed/shares/${encodeURIComponent(token)}/upload`,
      {
        method: "POST",
        headers: fedHeaders(password),
        body: fd,
      }
    );
  },

  async deleteFederatedItem(
    token: string,
    subPath: string,
    password?: string,
    remoteServerUrl?: string
  ) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson<{ success: boolean }>(
      `${base}/api/fed/shares/${encodeURIComponent(token)}/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...fedHeaders(password),
        },
        body: JSON.stringify({ subPath, password }),
      }
    );
  },

  async renameFederatedItem(
    token: string,
    subPath: string,
    newName: string,
    password?: string,
    remoteServerUrl?: string
  ) {
    const base = fedBaseUrl(remoteServerUrl);
    return fetchJson<{ success: boolean }>(
      `${base}/api/fed/shares/${encodeURIComponent(token)}/rename`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...fedHeaders(password),
        },
        body: JSON.stringify({ subPath, newName, password }),
      }
    );
  },

  // Admin Users & Invite Codes
  async getAdminUsers(): Promise<User[]> {
    const data = await fetchJson<{ data: User[] }>("/api/admin/users");
    return data.data || [];
  },

  async createAdminUser(data: {
    username: string;
    password: string;
    storageQuota: number;
    mustChangePassword?: boolean;
  }) {
    return fetchJson<{ data: User }>("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async updateAdminUser(
    username: string,
    data: { storageQuota?: number; role?: string; enabled?: boolean; mustChangePassword?: boolean }
  ) {
    return fetchJson(`/api/admin/users/${encodeURIComponent(username)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async resetAdminUserPassword(username: string, password: string, mustChangePassword?: boolean) {
    return fetchJson(`/api/admin/users/${encodeURIComponent(username)}/password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, mustChangePassword }),
    });
  },

  async getAdminInvites(): Promise<InviteCodeItem[]> {
    const data = await fetchJson<{ data: InviteCodeItem[] }>("/api/admin/invites");
    return data.data || [];
  },

  async createAdminInvite(data: {
    code?: string;
    maxUses?: number;
    defaultQuota?: number;
    expireHours?: number;
    note?: string;
  }) {
    return fetchJson<{ data: InviteCodeItem }>("/api/admin/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async deleteAdminInvite(id: number) {
    return fetchJson(`/api/admin/invites/${id}`, {
      method: "DELETE",
    });
  },

  // Admin Config
  async getAdminConfig(): Promise<AdminConfigData> {
    const res = await fetchJson<{ data: AdminConfigData }>("/api/admin/config");
    return res.data;
  },

  async updateAdminConfig(payload: {
    visualConfig?: Record<string, any>;
    applicationYaml?: string;
    adminYaml?: string;
  }) {
    return fetchJson<{ message: string }>("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  // Resumable Chunked Uploads
  async initChunkedUpload(
    fileName: string,
    fileSize: number,
    directory: string,
    conflictStrategy: FileConflictStrategy = "rename"
  ) {
    return fetchJson<{ uploadId: string; chunkSize: number; totalChunks: number }>("/api/upload/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, fileSize, directory, conflictStrategy }),
    });
  },

  async uploadChunk(
    uploadId: string,
    chunkIndex: number,
    chunk: Blob,
    signal?: AbortSignal,
    onProgress?: (loaded: number) => void
  ): Promise<{ success: boolean; chunkIndex: number }> {
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
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) onProgress(e.loaded);
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            resolve({ success: true, chunkIndex });
          }
        } else {
          let msg = "分片上传失败";
          try {
            const body = JSON.parse(xhr.responseText);
            msg = body.message || body.error || msg;
          } catch {}
          reject(new ApiError(msg, xhr.status));
        }
      };

      xhr.onerror = () => {
        reject(new ApiError("网络错误，分片上传失败"));
      };

      xhr.send(fd);
    });
  },

  async completeChunkedUpload(uploadId: string) {
    return fetchJson<{ success: boolean; message: string; file: any }>("/api/upload/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadId }),
    });
  },

  async getUploadStatus(uploadId: string) {
    return fetchJson<{
      uploadId: string;
      fileName: string;
      fileSize: number;
      chunkSize: number;
      totalChunks: number;
      uploadedChunks: number[];
    }>(`/api/upload/status?uploadId=${encodeURIComponent(uploadId)}`);
  },

  async cancelChunkedUpload(uploadId: string) {
    return fetchJson<{ success: boolean; message: string }>(`/api/upload/${encodeURIComponent(uploadId)}`, {
      method: "DELETE",
    });
  },
};

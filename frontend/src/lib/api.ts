import { AdminConfigData, FileItem, FileShare, StorageQuota, User } from "@/types";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
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
    if (res.status === 401) {
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    let msg = `HTTP ${res.status}`;
    try {
      const errData = await res.json();
      msg = errData.message || errData.error || msg;
    } catch {
      // ignore
    }
    throw new ApiError(msg, res.status);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Auth
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

  async logout() {
    return fetchJson<{ success: boolean }>("/api/logout", { method: "POST" });
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

  async deleteFile(path: string) {
    return fetchJson<{ success: boolean }>("/api/file/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
  },

  async moveFile(from: string, to: string) {
    return fetchJson<{ success: boolean; path: string }>("/api/file/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: from, destination: to }),
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
    signal?: AbortSignal
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
      xhr.send(fd);
    });
  },

  // Shares
  async getShares(): Promise<FileShare[]> {
    const data = await fetchJson<{ data: FileShare[] }>("/api/shares");
    return data.data || [];
  },

  async createShare(filePath: string, expireHours: number, maxDownloads?: number) {
    return fetchJson<{ data: { token: string; url: string } }>("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filePath, expireHours, maxDownloads }),
    });
  },

  async revokeShare(id: number) {
    return fetchJson(`/api/shares/${id}`, {
      method: "DELETE",
    });
  },

  // Admin Users
  async getAdminUsers(): Promise<User[]> {
    const data = await fetchJson<{ data: User[] }>("/api/admin/users");
    return data.data || [];
  },

  async createAdminUser(data: { username: string; password: string; storageQuota: number }) {
    return fetchJson<{ data: User }>("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async updateAdminUser(username: string, data: { storageQuota?: number; role?: string }) {
    return fetchJson(`/api/admin/users/${encodeURIComponent(username)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async resetAdminUserPassword(username: string, password: string) {
    return fetchJson(`/api/admin/users/${encodeURIComponent(username)}/password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
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
  async initChunkedUpload(fileName: string, fileSize: number, directory: string) {
    return fetchJson<{ uploadId: string; chunkSize: number; totalChunks: number }>("/api/upload/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, fileSize, directory }),
    });
  },

  async uploadChunk(
    uploadId: string,
    chunkIndex: number,
    chunk: Blob,
    signal?: AbortSignal,
    onProgress?: (loaded: number) => void
  ): Promise<{ success: boolean; chunkIndex: number }> {
    // 使用 XHR 以获取上传进度事件（fetch 无法监听上传进度）
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

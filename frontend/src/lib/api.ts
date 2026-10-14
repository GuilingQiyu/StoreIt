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

  async changePassword(password: string) {
    return fetchJson("/api/user/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
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

  async getQuota() {
    const data = await fetchJson<any>("/api/quota");
    return {
      used: data.used || 0,
      total: data.total || 0,
      ratio: data.ratio || 0,
    } as StorageQuota;
  },

  async createDirectory(path: string, name: string) {
    return fetchJson("/api/mkdir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, name }),
    });
  },

  async deleteFile(path: string) {
    return fetchJson(`/api/files?path=${encodeURIComponent(path)}`, {
      method: "DELETE",
    });
  },

  async moveFile(from: string, to: string) {
    return fetchJson("/api/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to }),
    });
  },

  async renameFile(path: string, newName: string) {
    return fetchJson("/api/rename", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, newName }),
    });
  },

  async setFavorite(path: string, favorite: boolean) {
    return fetchJson("/api/favorites", {
      method: favorite ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
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

  async updateAdminConfig(payload: { applicationYaml?: string; adminYaml?: string }) {
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
    signal?: AbortSignal
  ): Promise<{ success: boolean; chunkIndex: number }> {
    const fd = new FormData();
    fd.append("uploadId", uploadId);
    fd.append("chunkIndex", String(chunkIndex));
    fd.append("chunk", chunk, `chunk_${chunkIndex}.part`);

    const res = await fetch("/api/upload/chunk", {
      method: "POST",
      body: fd,
      signal,
    });

    if (!res.ok) {
      let msg = "分片上传失败";
      try {
        const body = await res.json();
        msg = body.message || body.error || msg;
      } catch {}
      throw new ApiError(msg, res.status);
    }

    return res.json();
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

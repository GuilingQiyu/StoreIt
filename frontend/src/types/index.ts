export interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  modifiedTime?: number | string;
  isFavorite?: boolean;
}

export interface User {
  id?: number;
  username: string;
  role: "USER" | "ADMIN" | string;
  storageQuota?: number;
  createdAt?: number | string;
  mustChangePassword?: boolean;
}

export interface StorageQuota {
  used: number;
  total: number;
  free?: number;
  quota?: number;
  unlimited?: boolean;
  scope?: "disk" | "user";
}

export interface FileShare {
  id: number;
  filePath: string;
  token: string;
  url: string;
  expiry?: number;
  maxDownloads?: number;
  downloads: number;
  createdAt?: number;
}

export type UploadStatus = 
  | "pending" 
  | "initializing" 
  | "uploading" 
  | "paused" 
  | "merging" 
  | "completed" 
  | "error" 
  | "interrupted";

export interface UploadTask {
  id: string; // uploadId
  fingerprint: string; // filename-filesize-lastmodified-dir
  name: string;
  size: number;
  directory: string;
  chunkSize: number;
  totalChunks: number;
  uploadedChunks: number[]; // indices of completed chunks
  status: UploadStatus;
  progress: number; // 0 to 100
  speed: number; // bytes/sec
  errorMessage?: string;
  createdAt: number;
  lastUpdated: number;
}

export interface AdminConfigData {
  applicationYaml: string;
  adminYaml: string;
  applicationConfig: Record<string, any>;
  adminConfig: Record<string, any>;
  keystoreExists?: boolean;
}

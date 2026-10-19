export type ThemeMode = "classic" | "ocean" | "forest" | "sunset" | "sakura" | "dark";

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
  enabled?: boolean;
}

export interface InviteCodeItem {
  id: number;
  code: string;
  createdBy: string;
  maxUses: number;
  usedCount: number;
  defaultQuota: number;
  expiresAt?: number;
  revoked: boolean;
  note?: string;
  createdAt: number;
}

export interface StorageQuota {
  used: number;
  total: number;
  free?: number;
  quota?: number;
  unlimited?: boolean;
  scope?: "disk" | "user";
}

export type SharePermission = "READ" | "READ_WRITE";

export interface FileShare {
  id: number;
  filePath: string;
  token: string;
  url: string;
  webUrl?: string;
  federatedUri?: string;
  expiry?: number;
  maxDownloads?: number;
  downloads: number;
  createdAt?: number;
  isDirectory?: boolean;
  permission?: SharePermission;
  passwordProtected?: boolean;
  title?: string;
}

export interface ShareMountItem {
  id: number;
  userId: number;
  mountName: string;
  remoteServerUrl: string;
  shareToken: string;
  accessPassword?: string;
  permission: SharePermission;
  ownerName?: string;
  directory: boolean;
  createdAt: number;
}

export interface SharedSpaceManifest {
  protocol: string;
  token: string;
  name: string;
  filePath: string;
  isDirectory: boolean;
  permission: SharePermission;
  passwordProtected: boolean;
  ownerUsername: string;
  expiry?: number;
  maxDownloads?: number;
  downloads: number;
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

export type FileConflictStrategy = "rename" | "overwrite";
export type FolderConflictStrategy = "merge" | "rename" | "overwrite";

export interface UploadTask {
  id: string;
  fingerprint: string;
  name: string;
  size: number;
  directory: string;
  conflictStrategy?: FileConflictStrategy;
  chunkSize: number;
  totalChunks: number;
  uploadedChunks: number[];
  status: UploadStatus;
  progress: number;
  speed: number;
  errorMessage?: string;
  createdAt: number;
  lastUpdated: number;
}

export interface PendingUploadEntry {
  file: File;
  subPath: string;
}

export interface UploadConflictState {
  targetDir: string;
  entries: PendingUploadEntry[];
  emptyDirs: string[];
  conflictingFolders: string[];
  conflictingFiles: string[];
}

export interface AdminConfigData {
  applicationYaml: string;
  adminYaml: string;
  applicationConfig: Record<string, any>;
  adminConfig: Record<string, any>;
  keystoreExists?: boolean;
}

export type SortField = "name" | "size" | "modifiedTime";
export type SortOrder = "asc" | "desc";

export interface ToastItem {
  id: string;
  text: string;
  type: "success" | "error" | "info";
}

export interface ConfirmDialogOptions {
  title: string;
  description: string;
  confirmText?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

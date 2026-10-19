import { create } from "zustand";
import { ConfirmDialogOptions, FileItem, SortField, SortOrder, ThemeMode, ToastItem, UploadConflictState } from "@/types";
import { applyThemeToDom, getSavedTheme } from "@/lib/utils";

export type ViewMode = 
  | "files" 
  | "recent" 
  | "favorites" 
  | "shares" 
  | "admin" 
  | "settings" 
  | "about" 
  | "search";

interface FileState {
  currentPath: string;
  viewMode: ViewMode;
  layout: "grid" | "list";
  theme: ThemeMode;
  sortBy: SortField;
  sortOrder: SortOrder;
  searchQuery: string;
  selectedFile: FileItem | null;
  selectedPaths: string[];
  previewFile: FileItem | null;
  previewAutoEdit: boolean;
  uploadConflict: UploadConflictState | null;
  shareModalFile: FileItem | null;
  activeShareToken: string | null;
  activeShareServerUrl: string;
  activeSharePassword: string;
  moveModalFile: FileItem | null;
  batchMovePaths: string[] | null;
  moveModalMode: "move" | "copy";
  renameModalFile: FileItem | null;
  newFolderModalOpen: boolean;
  newFileModalOpen: boolean;
  passwordModalOpen: boolean;
  sidebarOpen: boolean;
  toasts: ToastItem[];
  confirmDialog: ConfirmDialogOptions | null;

  setCurrentPath: (path: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setLayout: (layout: "grid" | "list") => void;
  setTheme: (theme: ThemeMode) => void;
  setSort: (field: SortField) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFile: (file: FileItem | null) => void;
  toggleSelectPath: (path: string) => void;
  setSelectedPaths: (paths: string[]) => void;
  clearSelection: () => void;
  setPreviewFile: (file: FileItem | null) => void;
  openEditor: (file: FileItem) => void;
  setUploadConflict: (conflict: UploadConflictState | null) => void;
  setShareModalFile: (file: FileItem | null) => void;
  openSharedSpace: (token: string, remoteServerUrl?: string, password?: string) => void;
  closeSharedSpace: () => void;
  setMoveModalFile: (file: FileItem | null) => void;
  setBatchMovePaths: (paths: string[] | null) => void;
  setMoveModalMode: (mode: "move" | "copy") => void;
  openCopyModal: (file: FileItem) => void;
  openBatchCopyModal: (paths: string[]) => void;
  setRenameModalFile: (file: FileItem | null) => void;
  setNewFolderModalOpen: (open: boolean) => void;
  setNewFileModalOpen: (open: boolean) => void;
  setPasswordModalOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  navigateToFolder: (target: string) => void;
  openFolder: (path: string) => void;
  openContainingFolder: (item: FileItem) => void;
  navigateUp: () => void;
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  dismissToast: (id: string) => void;
  openConfirm: (options: ConfirmDialogOptions) => void;
  closeConfirm: () => void;
}

export const useFileStore = create<FileState>((set, get) => ({
  currentPath: "",
  viewMode: "files",
  layout: "grid",
  theme: "classic",
  sortBy: "name",
  sortOrder: "asc",
  searchQuery: "",
  selectedFile: null,
  selectedPaths: [],
  previewFile: null,
  previewAutoEdit: false,
  uploadConflict: null,
  shareModalFile: null,
  activeShareToken: null,
  activeShareServerUrl: "",
  activeSharePassword: "",
  moveModalFile: null,
  batchMovePaths: null,
  moveModalMode: "move",
  renameModalFile: null,
  newFolderModalOpen: false,
  newFileModalOpen: false,
  passwordModalOpen: false,
  sidebarOpen: false,
  toasts: [],
  confirmDialog: null,

  setCurrentPath: (path: string) => {
    set({ currentPath: path, selectedFile: null, selectedPaths: [] });
    if (get().viewMode === "files") {
      syncHash("files", path);
    }
  },
  setViewMode: (mode: ViewMode) => {
    set({ viewMode: mode, selectedFile: null, selectedPaths: [] });
    syncHash(mode, mode === "files" ? get().currentPath : "");
  },
  setLayout: (layout: "grid" | "list") => set({ layout }),
  setTheme: (theme: ThemeMode) => {
    applyThemeToDom(theme);
    set({ theme });
  },
  setSort: (field: SortField) => {
    const { sortBy, sortOrder } = get();
    if (sortBy === field) {
      set({ sortOrder: sortOrder === "asc" ? "desc" : "asc" });
    } else {
      set({ sortBy: field, sortOrder: field === "name" ? "asc" : "desc" });
    }
  },
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedFile: (file: FileItem | null) => set({ selectedFile: file }),
  toggleSelectPath: (path: string) => {
    const { selectedPaths } = get();
    if (selectedPaths.includes(path)) {
      set({ selectedPaths: selectedPaths.filter((p) => p !== path) });
    } else {
      set({ selectedPaths: [...selectedPaths, path] });
    }
  },
  setSelectedPaths: (paths: string[]) => set({ selectedPaths: paths }),
  clearSelection: () => set({ selectedPaths: [] }),
  setPreviewFile: (file: FileItem | null) => set({ previewFile: file, previewAutoEdit: false }),
  openEditor: (file: FileItem) => set({ previewFile: file, previewAutoEdit: true }),
  setUploadConflict: (conflict: UploadConflictState | null) => set({ uploadConflict: conflict }),
  setShareModalFile: (file: FileItem | null) => set({ shareModalFile: file }),
  openSharedSpace: (token: string, remoteServerUrl = "", password = "") => {
    set({
      viewMode: "shares",
      activeShareToken: token,
      activeShareServerUrl: remoteServerUrl,
      activeSharePassword: password,
    });
    if (typeof window !== "undefined" && !remoteServerUrl) {
      window.history.pushState(null, "", `#/s/${encodeURIComponent(token)}`);
    }
  },
  closeSharedSpace: () => {
    set({ activeShareToken: null, activeShareServerUrl: "", activeSharePassword: "" });
    if (typeof window !== "undefined" && window.location.hash.startsWith("#/s/")) {
      window.history.pushState(null, "", "#/shares");
    }
  },
  setMoveModalFile: (file: FileItem | null) => set({ moveModalFile: file, moveModalMode: "move" }),
  setBatchMovePaths: (paths: string[] | null) => set({ batchMovePaths: paths, moveModalMode: "move" }),
  setMoveModalMode: (mode: "move" | "copy") => set({ moveModalMode: mode }),
  openCopyModal: (file: FileItem) => set({ moveModalFile: file, moveModalMode: "copy" }),
  openBatchCopyModal: (paths: string[]) => set({ batchMovePaths: paths, moveModalMode: "copy" }),
  setRenameModalFile: (file: FileItem | null) => set({ renameModalFile: file }),
  setNewFolderModalOpen: (open: boolean) => set({ newFolderModalOpen: open }),
  setNewFileModalOpen: (open: boolean) => set({ newFileModalOpen: open }),
  setPasswordModalOpen: (open: boolean) => set({ passwordModalOpen: open }),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  navigateToFolder: (target: string) => {
    const { currentPath, viewMode } = get();
    let nextPath = target;
    if (viewMode === "files" && !target.includes("/")) {
      nextPath = currentPath ? `${currentPath}/${target}` : target;
    }
    set({ currentPath: nextPath, viewMode: "files", selectedFile: null, selectedPaths: [] });
    syncHash("files", nextPath);
  },

  openFolder: (path: string) => {
    set({ currentPath: path, viewMode: "files", selectedFile: null, selectedPaths: [] });
    syncHash("files", path);
  },

  openContainingFolder: (item: FileItem) => {
    const parent = item.path.includes("/") ? item.path.slice(0, item.path.lastIndexOf("/")) : "";
    set({ currentPath: parent, viewMode: "files", selectedFile: item, selectedPaths: [] });
    syncHash("files", parent);
  },

  navigateUp: () => {
    const { currentPath } = get();
    if (!currentPath) return;
    const parts = currentPath.split("/");
    parts.pop();
    const nextPath = parts.join("/");
    set({ currentPath: nextPath, selectedFile: null, selectedPaths: [], viewMode: "files" });
    syncHash("files", nextPath);
  },

  showToast: (text: string, type: "success" | "error" | "info" = "info") => {
    const id = "t_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    set((s) => ({ toasts: [...s.toasts, { id, text, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3200);
  },

  dismissToast: (id: string) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },

  openConfirm: (options: ConfirmDialogOptions) => set({ confirmDialog: options }),
  closeConfirm: () => set({ confirmDialog: null }),
}));

export function viewModeToHash(mode: ViewMode, currentPath = ""): string {
  if (mode === "files") {
    if (!currentPath) return "#/";
    const encoded = currentPath
      .split("/")
      .filter(Boolean)
      .map(encodeURIComponent)
      .join("/");
    return encoded ? `#/files/${encoded}` : "#/";
  }
  return `#/${mode}`;
}

export function syncHash(mode: ViewMode, currentPath = "") {
  if (typeof window === "undefined") return;
  const target = viewModeToHash(mode, currentPath);
  if (window.location.hash !== target) {
    window.history.pushState(null, "", target);
  }
}

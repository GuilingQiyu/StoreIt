import { create } from "zustand";
import { ConfirmDialogOptions, FileItem, SortField, SortOrder, ToastItem, UploadConflictState } from "@/types";

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
  sortBy: SortField;
  sortOrder: SortOrder;
  searchQuery: string;
  selectedFile: FileItem | null;
  selectedPaths: string[];
  previewFile: FileItem | null;
  previewAutoEdit: boolean;
  uploadConflict: UploadConflictState | null;
  shareModalFile: FileItem | null;
  moveModalFile: FileItem | null;
  batchMovePaths: string[] | null;
  renameModalFile: FileItem | null;
  newFolderModalOpen: boolean;
  passwordModalOpen: boolean;
  sidebarOpen: boolean;
  toasts: ToastItem[];
  confirmDialog: ConfirmDialogOptions | null;

  setCurrentPath: (path: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setLayout: (layout: "grid" | "list") => void;
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
  setMoveModalFile: (file: FileItem | null) => void;
  setBatchMovePaths: (paths: string[] | null) => void;
  setRenameModalFile: (file: FileItem | null) => void;
  setNewFolderModalOpen: (open: boolean) => void;
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
  sortBy: "name",
  sortOrder: "asc",
  searchQuery: "",
  selectedFile: null,
  selectedPaths: [],
  previewFile: null,
  previewAutoEdit: false,
  uploadConflict: null,
  shareModalFile: null,
  moveModalFile: null,
  batchMovePaths: null,
  renameModalFile: null,
  newFolderModalOpen: false,
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
  setMoveModalFile: (file: FileItem | null) => set({ moveModalFile: file }),
  setBatchMovePaths: (paths: string[] | null) => set({ batchMovePaths: paths }),
  setRenameModalFile: (file: FileItem | null) => set({ renameModalFile: file }),
  setNewFolderModalOpen: (open: boolean) => set({ newFolderModalOpen: open }),
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

/** 各视图模式及子目录路径对应的 URL hash（根目录用 "#/"，子目录用 "#/files/a/b"） */
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

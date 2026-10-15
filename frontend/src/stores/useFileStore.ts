import { create } from "zustand";
import { FileItem } from "@/types";

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
  searchQuery: string;
  selectedFile: FileItem | null;
  previewFile: FileItem | null;
  shareModalFile: FileItem | null;
  moveModalFile: FileItem | null;
  renameModalFile: FileItem | null;
  newFolderModalOpen: boolean;
  sidebarOpen: boolean;

  setCurrentPath: (path: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setLayout: (layout: "grid" | "list") => void;
  setSearchQuery: (query: string) => void;
  setSelectedFile: (file: FileItem | null) => void;
  setPreviewFile: (file: FileItem | null) => void;
  setShareModalFile: (file: FileItem | null) => void;
  setMoveModalFile: (file: FileItem | null) => void;
  setRenameModalFile: (file: FileItem | null) => void;
  setNewFolderModalOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  navigateToFolder: (target: string) => void;
  openFolder: (path: string) => void;
  navigateUp: () => void;
}

export const useFileStore = create<FileState>((set, get) => ({
  currentPath: "",
  viewMode: "files",
  layout: "grid",
  searchQuery: "",
  selectedFile: null,
  previewFile: null,
  shareModalFile: null,
  moveModalFile: null,
  renameModalFile: null,
  newFolderModalOpen: false,
  sidebarOpen: false,

  setCurrentPath: (path: string) => set({ currentPath: path, selectedFile: null }),
  setViewMode: (mode: ViewMode) => set({ viewMode: mode, selectedFile: null }),
  setLayout: (layout: "grid" | "list") => set({ layout }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedFile: (file: FileItem | null) => set({ selectedFile: file }),
  setPreviewFile: (file: FileItem | null) => set({ previewFile: file }),
  setShareModalFile: (file: FileItem | null) => set({ shareModalFile: file }),
  setMoveModalFile: (file: FileItem | null) => set({ moveModalFile: file }),
  setRenameModalFile: (file: FileItem | null) => set({ renameModalFile: file }),
  setNewFolderModalOpen: (open: boolean) => set({ newFolderModalOpen: open }),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  navigateToFolder: (target: string) => {
    const { currentPath, viewMode } = get();
    // If opening from search/recent/favorites or target already has path, open directly
    if (viewMode !== "files" || target.includes("/")) {
      set({ currentPath: target, viewMode: "files", selectedFile: null });
    } else {
      const newPath = currentPath ? `${currentPath}/${target}` : target;
      set({ currentPath: newPath, viewMode: "files", selectedFile: null });
    }
  },

  openFolder: (path: string) => {
    set({ currentPath: path, viewMode: "files", selectedFile: null });
  },

  navigateUp: () => {
    const { currentPath } = get();
    if (!currentPath) return;
    const parts = currentPath.split("/");
    parts.pop();
    set({ currentPath: parts.join("/"), selectedFile: null, viewMode: "files" });
  },
}));

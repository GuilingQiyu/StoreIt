"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FolderInput,
  Copy,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Home,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";
import { useFileStore } from "@/stores/useFileStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TreeFolder {
  name: string;
  path: string;
  children?: TreeFolder[];
  loaded?: boolean;
  expanded?: boolean;
}

export function MoveModal() {
  const item = useFileStore((s) => s.moveModalFile);
  const setMoveModalFile = useFileStore((s) => s.setMoveModalFile);
  const batchPaths = useFileStore((s) => s.batchMovePaths);
  const setBatchMovePaths = useFileStore((s) => s.setBatchMovePaths);
  const mode = useFileStore((s) => s.moveModalMode);
  const setMode = useFileStore((s) => s.setMoveModalMode);
  const clearSelection = useFileStore((s) => s.clearSelection);
  const showToast = useFileStore((s) => s.showToast);

  const [targetDir, setTargetDir] = useState("");
  const [rootFolders, setRootFolders] = useState<TreeFolder[]>([]);
  const [loadingTree, setLoadingTree] = useState(false);
  const queryClient = useQueryClient();

  const isOpen = Boolean(item) || Boolean(batchPaths && batchPaths.length > 0);
  const movingPaths = batchPaths && batchPaths.length > 0 ? batchPaths : item ? [item.path] : [];
  const isCopy = mode === "copy";

  const isDisabledTarget = (folderPath: string) => {
    return movingPaths.some(
      (mp) => folderPath === mp || folderPath.startsWith(mp + "/")
    );
  };

  useEffect(() => {
    if (!isOpen) return;
    setLoadingTree(true);
    api
      .getFiles("")
      .then((res) => {
        const dirs = res.items
          .filter((it) => it.isDirectory)
          .map((it) => ({ name: it.name, path: it.path, loaded: false, expanded: false }));
        setRootFolders(dirs);
      })
      .catch(() => setRootFolders([]))
      .finally(() => setLoadingTree(false));
  }, [isOpen]);

  const toggleExpandFolder = async (targetPath: string) => {
    const updateTree = async (nodes: TreeFolder[]): Promise<TreeFolder[]> => {
      const next: TreeFolder[] = [];
      for (const n of nodes) {
        if (n.path === targetPath) {
          if (!n.loaded) {
            try {
              const res = await api.getFiles(n.path);
              const subDirs = res.items
                .filter((it) => it.isDirectory)
                .map((it) => ({ name: it.name, path: it.path, loaded: false, expanded: false }));
              next.push({ ...n, loaded: true, expanded: true, children: subDirs });
            } catch {
              next.push({ ...n, loaded: true, expanded: !n.expanded, children: [] });
            }
          } else {
            next.push({ ...n, expanded: !n.expanded });
          }
        } else if (n.children && n.children.length > 0) {
          next.push({ ...n, children: await updateTree(n.children) });
        } else {
          next.push(n);
        }
      }
      return next;
    };
    setRootFolders(await updateTree(rootFolders));
  };

  const handleClose = () => {
    setMoveModalFile(null);
    setBatchMovePaths(null);
    setTargetDir("");
  };

  const actionMutation = useMutation({
    mutationFn: async (to: string) => {
      if (isCopy) {
        if (batchPaths && batchPaths.length > 0) {
          return api.batchCopyFiles(batchPaths, to);
        }
        return api.copyFile(item!.path, to);
      } else {
        if (batchPaths && batchPaths.length > 0) {
          return api.batchMoveFiles(batchPaths, to);
        }
        return api.moveFile(item!.path, to);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["favoritesList"] });
      queryClient.invalidateQueries({ queryKey: ["quota"] });
      if (!isCopy) {
        const selected = useFileStore.getState().selectedFile;
        if (selected && movingPaths.includes(selected.path)) {
          useFileStore.getState().setSelectedFile(null);
        }
      }
      if (batchPaths && batchPaths.length > 0) {
        clearSelection();
        showToast(
          isCopy
            ? `已成功复制 ${batchPaths.length} 个项目`
            : `已成功移动 ${batchPaths.length} 个项目`,
          "success"
        );
      } else {
        showToast(isCopy ? "文件已复制" : "文件已移动", "success");
      }
      handleClose();
    },
    onError: (err: any) => {
      showToast(err.message || (isCopy ? "复制失败" : "移动失败"), "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actionMutation.mutate(targetDir.trim());
  };

  const renderTree = (nodes: TreeFolder[], depth = 0): React.ReactNode => {
    return nodes.map((node) => {
      const disabled = isDisabledTarget(node.path);
      const selected = targetDir === node.path;
      return (
        <div key={node.path}>
          <div
            onClick={() => !disabled && setTargetDir(node.path)}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            className={`flex items-center gap-1.5 py-1.5 pr-2 rounded-lg text-xs cursor-pointer transition-colors ${
              disabled
                ? "opacity-40 cursor-not-allowed"
                : selected
                ? "bg-brand-primary text-white font-semibold"
                : "hover:bg-black/5 text-foreground"
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) toggleExpandFolder(node.path);
              }}
              className="p-0.5 rounded hover:bg-black/10 shrink-0"
              title={node.expanded ? "折叠子目录" : "展开子目录"}
            >
              {node.expanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
            {node.expanded ? (
              <FolderOpen className={`w-4 h-4 shrink-0 ${selected ? "text-amber-300" : "text-amber-500"}`} />
            ) : (
              <Folder className={`w-4 h-4 shrink-0 ${selected ? "text-amber-300" : "text-amber-500"}`} />
            )}
            <span className="truncate">{node.name}</span>
          </div>
          {node.expanded && node.children && node.children.length > 0 && renderTree(node.children, depth + 1)}
        </div>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md storeit-modal-spring">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-6">
            <span className="flex items-center gap-2">
              {isCopy ? (
                <Copy className="w-5 h-5 text-brand-secondary" />
              ) : (
                <FolderInput className="w-5 h-5 text-brand-secondary" />
              )}
              {batchPaths && batchPaths.length > 0
                ? `批量${isCopy ? "复制" : "移动"} (${batchPaths.length} 项)`
                : `${isCopy ? "复制" : "移动"}文件 / 目录`}
            </span>

            <div className="inline-flex rounded-lg border bg-muted/40 p-0.5 text-xs font-normal">
              <button
                type="button"
                onClick={() => setMode("move")}
                className={`px-2.5 py-0.5 rounded-md transition-all ${
                  !isCopy ? "bg-white text-brand-primary font-semibold shadow-sm" : "text-muted-foreground"
                }`}
              >
                移动
              </button>
              <button
                type="button"
                onClick={() => setMode("copy")}
                className={`px-2.5 py-0.5 rounded-md transition-all ${
                  isCopy ? "bg-white text-brand-primary font-semibold shadow-sm" : "text-muted-foreground"
                }`}
              >
                复制
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              点击选择目标文件夹
            </label>
            <div className="border rounded-xl p-2 max-h-56 overflow-y-auto bg-muted/20 space-y-0.5 select-none">
              <div
                onClick={() => setTargetDir("")}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  targetDir === ""
                    ? "bg-brand-primary text-white font-semibold"
                    : "hover:bg-black/5 text-foreground"
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>根目录 (/)</span>
              </div>

              {loadingTree ? (
                <div className="py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> 正在加载目录树...
                </div>
              ) : (
                renderTree(rootFolders, 0)
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              目标目录路径 (可直接点选上方目录或手动输入，留空为根目录)
            </label>
            <Input
              value={targetDir}
              onChange={(e) => setTargetDir(e.target.value)}
              placeholder="例如: documents 或 photos/2026"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              取消
            </Button>
            <Button type="submit" disabled={actionMutation.isPending}>
              {actionMutation.isPending
                ? "处理中..."
                : isCopy
                ? "确定复制到此处"
                : "确定移动到此处"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

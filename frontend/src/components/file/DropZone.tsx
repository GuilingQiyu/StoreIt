"use client";

import React, { useState, useCallback, useRef } from "react";
import { UploadCloud, FolderPlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useUploadStore } from "@/stores/useUploadStore";
import { useFileStore } from "@/stores/useFileStore";

interface DropZoneProps {
  children: React.ReactNode;
}

export function DropZone({ children }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);
  const queryClient = useQueryClient();
  const currentPath = useFileStore((s) => s.currentPath);
  const viewMode = useFileStore((s) => s.viewMode);
  const setViewMode = useFileStore((s) => s.setViewMode);
  const showToast = useFileStore((s) => s.showToast);
  const enqueueWithConflictCheck = useUploadStore((s) => s.enqueueWithConflictCheck);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (viewMode !== "files" && viewMode !== "recent" && viewMode !== "favorites" && viewMode !== "search") return;
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, [viewMode]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      setIsDragOver(false);
      dragCounter.current = 0;
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Recursively read items from DataTransferItemList (including empty directories)
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      dragCounter.current = 0;

      const items = e.dataTransfer.items;
      if (!items || items.length === 0) return;

      if (viewMode !== "files") {
        setViewMode("files");
      }

      const filesToUpload: { file: File; subPath: string }[] = [];
      const emptyDirsToCreate: string[] = [];

      const readEntry = async (entry: any, relativeDir: string) => {
        if (entry.isFile) {
          await new Promise<void>((resolve) => {
            entry.file((file: File) => {
              filesToUpload.push({ file, subPath: relativeDir });
              resolve();
            });
          });
        } else if (entry.isDirectory) {
          const dirReader = entry.createReader();
          const allChildren: any[] = [];
          const readEntries = async () => {
            const entries: any[] = await new Promise((resolve) => {
              dirReader.readEntries((results: any[]) => resolve(results));
            });
            if (entries.length > 0) {
              allChildren.push(...entries);
              await readEntries();
            }
          };
          await readEntries();
          const thisDir = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
          if (allChildren.length === 0) {
            emptyDirsToCreate.push(thisDir);
          } else {
            for (const child of allChildren) {
              await readEntry(child, thisDir);
            }
          }
        }
      };

      const entryPromises: Promise<void>[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (typeof item.webkitGetAsEntry === "function") {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            entryPromises.push(readEntry(entry, ""));
          }
        } else if (item.kind === "file") {
          const f = item.getAsFile();
          if (f) filesToUpload.push({ file: f, subPath: "" });
        }
      }

      await Promise.all(entryPromises);

      await enqueueWithConflictCheck(filesToUpload, emptyDirsToCreate, currentPath);
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    [currentPath, viewMode, setViewMode, enqueueWithConflictCheck, queryClient]
  );

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative flex-1 flex flex-col h-full overflow-hidden"
    >
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-brand-primary/80 backdrop-blur-sm text-white animate-in fade-in-0 duration-150 p-6 pointer-events-none">
          <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center mb-6 shadow-2xl animate-bounce">
            <UploadCloud className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">释放鼠标立即上传</h3>
          <p className="text-white/80 text-sm max-w-md text-center flex items-center gap-1.5">
            <FolderPlus className="w-4 h-4" />
            目标目录：
            <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-white font-medium">
              /{currentPath || "根目录"}
            </span>
          </p>
          <p className="text-white/60 text-xs mt-3">支持单文件、特大文件以及多级文件夹（含空目录）递归拖入上传</p>
        </div>
      )}
      {children}
    </div>
  );
}

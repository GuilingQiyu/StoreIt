"use client";

import React, { useState, useCallback, useRef } from "react";
import { UploadCloud, FolderPlus } from "lucide-react";
import { useUploadStore } from "@/stores/useUploadStore";
import { useFileStore } from "@/stores/useFileStore";

interface DropZoneProps {
  children: React.ReactNode;
}

export function DropZone({ children }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);
  const currentPath = useFileStore((s) => s.currentPath);
  const addFile = useUploadStore((s) => s.addFile);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

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

  // Recursively read items from DataTransferItemList
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      dragCounter.current = 0;

      const items = e.dataTransfer.items;
      if (!items || items.length === 0) return;

      const filesToUpload: { file: File; subPath: string }[] = [];

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
          const readEntries = async () => {
            const entries: any[] = await new Promise((resolve) => {
              dirReader.readEntries((results: any[]) => resolve(results));
            });
            if (entries.length > 0) {
              for (const child of entries) {
                const nextDir = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
                await readEntry(child, nextDir);
              }
              await readEntries(); // Read next batch until empty
            }
          };
          await readEntries();
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

      // Add all discovered files to the upload queue
      for (const item of filesToUpload) {
        const targetDir = item.subPath
          ? currentPath
            ? `${currentPath}/${item.subPath}`
            : item.subPath
          : currentPath;
        addFile(item.file, targetDir);
      }
    },
    [currentPath, addFile]
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
          <p className="text-white/60 text-xs mt-3">支持单文件、特大文件以及文件夹递归拖入上传</p>
        </div>
      )}
      {children}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderPlus } from "lucide-react";
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

export function NewFolderModal() {
  const isOpen = useFileStore((s) => s.newFolderModalOpen);
  const setOpen = useFileStore((s) => s.setNewFolderModalOpen);
  const currentPath = useFileStore((s) => s.currentPath);
  const [folderName, setFolderName] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (name: string) => api.createDirectory(currentPath, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      setFolderName("");
      setOpen(false);
    },
    onError: (err: any) => {
      alert(err.message || "创建文件夹失败");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    createMutation.mutate(folderName.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-amber-500" />
            新建文件夹
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              文件夹名称
            </label>
            <Input
              autoFocus
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="请输入文件夹名称"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              创建
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

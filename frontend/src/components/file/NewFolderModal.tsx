"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderPlus } from "lucide-react";
import { api } from "@/lib/api";
import { useFileStore, useI18n } from "@/stores/useFileStore";
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
  const showToast = useFileStore((s) => s.showToast);
  const [folderName, setFolderName] = useState("");
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const createMutation = useMutation({
    mutationFn: (name: string) => api.createDirectory(currentPath, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      showToast(t("文件夹创建成功", "Folder created successfully"), "success");
      setFolderName("");
      setOpen(false);
    },
    onError: (err: any) => {
      showToast(err.message || t("创建文件夹失败", "Failed to create folder"), "error");
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
            {t("新建文件夹", "New Folder")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              {t("文件夹名称", "Folder Name")}
            </label>
            <Input
              autoFocus
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder={t("请输入文件夹名称", "Enter folder name")}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("取消", "Cancel")}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {t("创建", "Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

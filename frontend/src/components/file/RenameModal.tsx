"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2 } from "lucide-react";
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

export function RenameModal() {
  const item = useFileStore((s) => s.renameModalFile);
  const setRenameModalFile = useFileStore((s) => s.setRenameModalFile);
  const showToast = useFileStore((s) => s.showToast);
  const [newName, setNewName] = useState("");
  const queryClient = useQueryClient();
  const { t } = useI18n();

  useEffect(() => {
    if (item) {
      setNewName(item.name);
    }
  }, [item]);

  const renameMutation = useMutation({
    mutationFn: (name: string) => api.renameFile(item!.path, name),
    onSuccess: (_data, name) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["favoritesList"] });
      const selected = useFileStore.getState().selectedFile;
      if (item && selected && selected.path === item.path) {
        const parent = item.path.includes("/") ? item.path.slice(0, item.path.lastIndexOf("/")) : "";
        const nextPath = parent ? `${parent}/${name}` : name;
        useFileStore.getState().setSelectedFile({ ...selected, name, path: nextPath });
      }
      showToast(t("重命名成功", "Renamed successfully"), "success");
      setRenameModalFile(null);
    },
    onError: (err: any) => {
      showToast(err.message || t("重命名失败", "Failed to rename"), "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName === item?.name) return;
    renameMutation.mutate(newName.trim());
  };

  return (
    <Dialog open={Boolean(item)} onOpenChange={(open) => !open && setRenameModalFile(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-brand-secondary" />
            {t("重命名", "Rename")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              {t("新名称", "New Name")}
            </label>
            <Input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("请输入新名称", "Enter new name")}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRenameModalFile(null)}>
              {t("取消", "Cancel")}
            </Button>
            <Button type="submit" disabled={renameMutation.isPending}>
              {t("确定", "Save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

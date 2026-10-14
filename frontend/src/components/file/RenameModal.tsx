"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2 } from "lucide-react";
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

export function RenameModal() {
  const item = useFileStore((s) => s.renameModalFile);
  const setRenameModalFile = useFileStore((s) => s.setRenameModalFile);
  const [newName, setNewName] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (item) {
      setNewName(item.name);
    }
  }, [item]);

  const renameMutation = useMutation({
    mutationFn: (name: string) => api.renameFile(item!.path, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      setRenameModalFile(null);
    },
    onError: (err: any) => {
      alert(err.message || "重命名失败");
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
            重命名
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              新名称
            </label>
            <Input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="请输入新名称"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRenameModalFile(null)}>
              取消
            </Button>
            <Button type="submit" disabled={renameMutation.isPending}>
              确定
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

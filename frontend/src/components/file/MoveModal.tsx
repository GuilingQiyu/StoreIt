"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderInput } from "lucide-react";
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

export function MoveModal() {
  const item = useFileStore((s) => s.moveModalFile);
  const setMoveModalFile = useFileStore((s) => s.setMoveModalFile);
  const [targetDir, setTargetDir] = useState("");
  const queryClient = useQueryClient();

  const moveMutation = useMutation({
    mutationFn: (to: string) => api.moveFile(item!.path, to),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      // 后端移动会同步更新收藏路径，立即刷新收藏列表避免星标短暂错误
      queryClient.invalidateQueries({ queryKey: ["favoritesList"] });
      setMoveModalFile(null);
      setTargetDir("");
    },
    onError: (err: any) => {
      alert(err.message || "移动失败");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    moveMutation.mutate(targetDir.trim());
  };

  return (
    <Dialog open={Boolean(item)} onOpenChange={(open) => !open && setMoveModalFile(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderInput className="w-5 h-5 text-brand-secondary" />
            移动文件 / 目录
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              目标目录路径 (留空表示移动到根目录)
            </label>
            <Input
              autoFocus
              value={targetDir}
              onChange={(e) => setTargetDir(e.target.value)}
              placeholder="例如: documents 或 photos/2026"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setMoveModalFile(null)}>
              取消
            </Button>
            <Button type="submit" disabled={moveMutation.isPending}>
              确定移动
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

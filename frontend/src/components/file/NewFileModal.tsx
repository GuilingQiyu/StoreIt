"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FilePlus2 } from "lucide-react";
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

const QUICK_TEMPLATES: { label: string; ext: string; defaultName: string; template: string }[] = [
  {
    label: "Markdown 文档 (.md)",
    ext: ".md",
    defaultName: "未命名笔记.md",
    template: "# 标题\n\n> [!NOTE]\n> 在此记录想法、文档或待办事项。\n\n- [ ] 待办事项 1\n- [x] 已完成事项\n",
  },
  {
    label: "纯文本 (.txt)",
    ext: ".txt",
    defaultName: "新建文本.txt",
    template: "",
  },
  {
    label: "YAML 配置 (.yml)",
    ext: ".yml",
    defaultName: "config.yml",
    template: "# 配置文件\napp:\n  name: demo\n  enabled: true\n",
  },
  {
    label: "JSON 数据 (.json)",
    ext: ".json",
    defaultName: "data.json",
    template: "{\n  \"name\": \"example\",\n  \"version\": \"1.0.0\"\n}\n",
  },
];

export function NewFileModal() {
  const isOpen = useFileStore((s) => s.newFileModalOpen);
  const setOpen = useFileStore((s) => s.setNewFileModalOpen);
  const currentPath = useFileStore((s) => s.currentPath);
  const openEditor = useFileStore((s) => s.openEditor);
  const showToast = useFileStore((s) => s.showToast);

  const [fileName, setFileName] = useState("未命名笔记.md");
  const [useStarterContent, setUseStarterContent] = useState(true);
  const [autoOpenEditor, setAutoOpenEditor] = useState(true);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async () => {
      const trimmed = fileName.trim();
      const matched = QUICK_TEMPLATES.find((t) => trimmed.toLowerCase().endsWith(t.ext));
      const initialContent = useStarterContent && matched ? matched.template : "";
      return api.createBlankFile(currentPath, trimmed, initialContent, "rename");
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["quota"] });
      showToast(`文件 "${res.file.name}" 创建成功`, "success");
      setOpen(false);
      if (autoOpenEditor && res.file) {
        openEditor({
          name: res.file.name,
          path: res.file.path,
          isDirectory: false,
          size: res.file.size,
          modifiedTime: res.file.modifiedTime,
        });
      }
    },
    onError: (err: any) => {
      showToast(err.message || "创建文件失败", "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;
    createMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md storeit-modal-spring">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePlus2 className="w-5 h-5 text-brand-secondary" />
            新建文本 / Markdown 文件
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              快速选择文件类型
            </label>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_TEMPLATES.map((tpl) => {
                const active = fileName.trim().toLowerCase().endsWith(tpl.ext);
                return (
                  <button
                    key={tpl.ext}
                    type="button"
                    onClick={() => setFileName(tpl.defaultName)}
                    className={`px-3 py-2 rounded-xl border text-left text-xs transition-all ${
                      active
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold"
                        : "bg-white hover:bg-black/5 text-foreground"
                    }`}
                  >
                    {tpl.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              文件名称 (支持任意文本扩展名或无扩展名，如 Dockerfile)
            </label>
            <Input
              autoFocus
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="例如: README.md 或 notes.txt"
              required
            />
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useStarterContent}
                onChange={(e) => setUseStarterContent(e.target.checked)}
                className="rounded border-input text-brand-primary focus:ring-brand-primary"
              />
              <span>写入默认文件模板内容（如 Markdown 标题与大纲示例）</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoOpenEditor}
                onChange={(e) => setAutoOpenEditor(e.target.checked)}
                className="rounded border-input text-brand-primary focus:ring-brand-primary"
              />
              <span>创建后立即打开在线编辑器</span>
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "创建中..." : "立即创建"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

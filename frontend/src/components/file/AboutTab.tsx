"use client";

import React from "react";
import { HardDrive, Github, ExternalLink, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutTab() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border shadow-lg text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white mx-auto flex items-center justify-center shadow-xl">
          <HardDrive className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-primary">关于 储之 (StoreIt)</h1>
          <p className="text-sm font-medium text-brand-secondary mt-1">
            轻量级、高性能、现代化的大文件存储与分享服务
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          系统运行正常 · 版本 v2.0.0
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed max-w-lg mx-auto">
          储之是一个基于 Spring Boot 3 与现代 React / Next.js 构建的文件服务器。默认支持 100GB
          级特大文件多分片并行断点续传、文件拖拽极速归档、细粒度分享链接控制以及可视化系统配置维护。
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href="https://github.com/GuilingQiyu/StoreIt"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-medium hover:bg-brand-primary/90 transition-all shadow-md"
          >
            <Github className="w-4 h-4" />
            GitHub 仓库
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        <div className="border-t pt-6 text-xs text-muted-foreground space-y-2">
          <p>© 2025–2026 归灵祈昱. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            本程序基于{" "}
            <a
              href="https://www.gnu.org/licenses/agpl-3.0.html"
              target="_blank"
              rel="noreferrer"
              className="text-brand-primary font-medium hover:underline inline-flex items-center gap-0.5"
            >
              GNU AGPL-3.0 或更高版本
            </a>{" "}
            开源授权。
          </p>
        </div>
      </div>
    </div>
  );
}

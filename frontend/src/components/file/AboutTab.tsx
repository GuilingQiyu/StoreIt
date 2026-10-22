"use client";

import React from "react";
import { HardDrive, Github, ExternalLink } from "lucide-react";
import { useI18n } from "@/stores/useFileStore";

export function AboutTab() {
  const { t } = useI18n();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border shadow-lg text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white mx-auto flex items-center justify-center shadow-xl">
          <HardDrive className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-primary">
            {t("关于 储之 (StoreIt)", "About StoreIt")}
          </h1>
          <p className="text-sm font-medium text-brand-secondary mt-1">
            {t(
              "轻量级、高性能、现代化的大文件存储与分享服务",
              "Lightweight, high-performance modern file storage & federated sharing server"
            )}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {t("系统运行正常 · 版本 v2.1.0-dev", "System Healthy · Version v2.1.0-dev")}
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed max-w-lg mx-auto">
          {t(
            "储之是一个基于 Spring Boot 3 与现代 React / Next.js 构建的文件服务器。默认支持 100GB 级特大文件多分片并行断点续传、文件拖拽极速归档、R/RW 共享文件夹与 SFSP 跨服联邦挂载，以及全量可视化系统配置维护。",
            "StoreIt is a self-hosted file server built on Spring Boot 3 and modern React / Next.js. It supports 100GB+ parallel resumable chunked uploads, drag-and-drop folder archiving, R/RW shared folders with SFSP cross-server federation, and visual YAML system configuration."
          )}
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href="https://github.com/GuilingQiyu/StoreIt"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-medium hover:bg-brand-primary/90 transition-all shadow-md"
          >
            <Github className="w-4 h-4" />
            {t("GitHub 仓库", "GitHub Repository")}
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        <div className="border-t pt-6 text-xs text-muted-foreground space-y-2">
          <p>{t("© 2025–2026 归灵祈昱. All rights reserved.", "© 2025–2026 GuilingQiyu. All rights reserved.")}</p>
          <p className="flex items-center justify-center gap-1">
            {t("本程序基于 ", "Licensed under ")}
            <a
              href="https://www.gnu.org/licenses/agpl-3.0.html"
              target="_blank"
              rel="noreferrer"
              className="text-brand-primary font-medium hover:underline inline-flex items-center gap-0.5"
            >
              {t("GNU AGPL-3.0 或更高版本", "GNU AGPL-3.0 or later")}
            </a>
            {t(" 开源授权。", ".")}
          </p>
        </div>
      </div>
    </div>
  );
}

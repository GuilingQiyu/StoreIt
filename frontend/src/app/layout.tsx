import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "储之 StoreIt - 文件管理与分享",
  description: "基于 Spring Boot 3 与 Next.js 的现代化大文件断点续传与分享服务",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-brand-bg text-foreground font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

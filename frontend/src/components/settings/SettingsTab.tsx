"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Settings, 
  Save, 
  FileCode, 
  Sliders, 
  ShieldCheck, 
  Server, 
  HardDrive, 
  KeyRound, 
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function SettingsTab() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"visual" | "raw">("visual");
  const [yamlTab, setYamlTab] = useState<"app" | "admin">("app");

  // Raw YAML state
  const [appYamlText, setAppYamlText] = useState("");
  const [adminYamlText, setAdminYamlText] = useState("");

  // Visual form state
  const [port, setPort] = useState<number>(59898);
  const [sessionTimeout, setSessionTimeout] = useState("30d");
  const [sslEnabled, setSslEnabled] = useState(false);
  const [keyStorePath, setKeyStorePath] = useState("./keystore.p12");
  const [keyStorePass, setKeyStorePass] = useState("changeit");
  const [keyStoreType, setKeyStoreType] = useState("PKCS12");
  const [storageRoot, setStorageRoot] = useState("storage");
  const [appSslEnabled, setAppSslEnabled] = useState(false);
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("");
  const [maxFailures, setMaxFailures] = useState(5);
  const [windowMinutes, setWindowMinutes] = useState(15);

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["adminConfig"],
    queryFn: () => api.getAdminConfig(),
  });

  useEffect(() => {
    if (data) {
      setAppYamlText(data.applicationYaml || "");
      setAdminYamlText(data.adminYaml || "");

      // Extract visual fields safely from parsed maps
      const appCfg = data.applicationConfig || {};
      const serverCfg = appCfg.server || {};
      const servletCfg = serverCfg.servlet || {};
      const sessionCfg = servletCfg.session || {};
      const sslCfg = serverCfg.ssl || {};
      const appProp = appCfg.app || {};
      const loginProp = appProp.login || {};

      if (serverCfg.port !== undefined) setPort(Number(serverCfg.port));
      if (sessionCfg.timeout !== undefined) setSessionTimeout(String(sessionCfg.timeout));
      if (sslCfg.enabled !== undefined) setSslEnabled(Boolean(sslCfg.enabled));
      if (sslCfg["key-store"] !== undefined) setKeyStorePath(String(sslCfg["key-store"]));
      if (sslCfg["key-store-password"] !== undefined) setKeyStorePass(String(sslCfg["key-store-password"]));
      if (sslCfg["key-store-type"] !== undefined) setKeyStoreType(String(sslCfg["key-store-type"]));

      if (appProp["storage-root"] !== undefined) setStorageRoot(String(appProp["storage-root"]));
      if (appProp["ssl-enabled"] !== undefined) setAppSslEnabled(Boolean(appProp["ssl-enabled"]));
      if (loginProp["max-failures"] !== undefined) setMaxFailures(Number(loginProp["max-failures"]));
      if (loginProp["window-minutes"] !== undefined) setWindowMinutes(Number(loginProp["window-minutes"]));

      const adminCfg = data.adminConfig || {};
      const defaultAdmin = (adminCfg.app || {})["default-admin"] || {};
      if (defaultAdmin.username) setAdminUsername(String(defaultAdmin.username));
      if (defaultAdmin.password) setAdminPassword(String(defaultAdmin.password));
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload: { applicationYaml?: string; adminYaml?: string }) =>
      api.updateAdminConfig(payload),
    onSuccess: (res) => {
      setMessage({ text: res.message || "配置保存成功！", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["adminConfig"] });
    },
    onError: (err: any) => {
      setMessage({ text: err.message || "保存配置失败", type: "error" });
    },
  });

  const handleSaveVisual = () => {
    // Generate updated application.yml & admin.yml strings based on form
    const appYaml = `# External application overrides for StoreIt
server:
  port: ${port}
  servlet:
    session:
      timeout: ${sessionTimeout}
  ssl:
    enabled: ${sslEnabled}
    key-store: ${keyStorePath}
    key-store-password: ${keyStorePass}
    key-store-type: ${keyStoreType}

spring:
  datasource:
    url: jdbc:sqlite:./data/storeit.db
    driver-class-name: org.sqlite.JDBC
  flyway:
    enabled: true
    locations: classpath:db/migration

app:
  storage-root: ${storageRoot}
  ssl-enabled: ${appSslEnabled}
  require-custom-admin: false
  login:
    max-failures: ${maxFailures}
    window-minutes: ${windowMinutes}
  session:
    max-age-days: 30
    cookie-name: STOREIT_SESSION

logging:
  level:
    root: info
`;

    const adminYaml = `# External admin credentials for StoreIt
app:
  default-admin:
    username: ${adminUsername}
    password: ${adminPassword || "authorized_users"}
`;

    saveMutation.mutate({ applicationYaml: appYaml, adminYaml });
  };

  const handleSaveRaw = () => {
    saveMutation.mutate({
      applicationYaml: appYamlText,
      adminYaml: adminYamlText,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-primary flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-secondary" />
            系统配置管理
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            可视化修改与维护 StoreIt 核心运行参数及外部配置文件（./config/*.yml）
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "visual" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("visual")}
            className="gap-1.5"
          >
            <Sliders className="w-4 h-4" />
            可视化配置
          </Button>
          <Button
            variant={activeTab === "raw" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("raw")}
            className="gap-1.5"
          >
            <FileCode className="w-4 h-4" />
            YAML 原文编辑
          </Button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-start gap-3 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-destructive" />
          )}
          <div className="text-sm">
            <p className="font-semibold">{message.text}</p>
            {message.type === "success" && (
              <p className="text-xs text-emerald-700 mt-1">
                注意：端口 (port) 与 SSL 证书等服务器核心网络参数修改后，需要重启 StoreIt 进程生效。
              </p>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-secondary" />
          <p>正在读取服务器配置...</p>
        </div>
      ) : activeTab === "visual" ? (
        /* Visual Form Configuration */
        <div className="space-y-6">
          {/* Server Settings */}
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-semibold text-base border-b pb-2">
              <Server className="w-5 h-5 text-brand-secondary" />
              服务与网络 (Server)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  服务端口 (server.port)
                </label>
                <Input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  placeholder="59898"
                />
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  StoreIt 运行所监听的 HTTP/HTTPS 端口
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  会话超时时间 (session.timeout)
                </label>
                <Input
                  type="text"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  placeholder="30d"
                />
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  支持 ISO-8601 或时间缩写，例如 30d (30天)、12h (12小时)
                </span>
              </div>
            </div>
          </div>

          {/* SSL Settings */}
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-brand-primary font-semibold text-base">
                <ShieldCheck className="w-5 h-5 text-brand-secondary" />
                HTTPS 与 SSL 安全设置
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {sslEnabled ? "已启用 SSL" : "未启用 (HTTP 模式)"}
                </span>
                <Switch checked={sslEnabled} onCheckedChange={setSslEnabled} />
              </div>
            </div>

            {sslEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    KeyStore 证书文件路径
                  </label>
                  <Input
                    type="text"
                    value={keyStorePath}
                    onChange={(e) => setKeyStorePath(e.target.value)}
                    placeholder="./keystore.p12"
                  />
                  <span className="text-[11px] text-muted-foreground mt-0.5 block">
                    相对工作目录的 .p12 证书路径
                  </span>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    KeyStore 访问口令
                  </label>
                  <Input
                    type="password"
                    value={keyStorePass}
                    onChange={(e) => setKeyStorePass(e.target.value)}
                    placeholder="changeit"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    KeyStore 类型
                  </label>
                  <Input
                    type="text"
                    value={keyStoreType}
                    onChange={(e) => setKeyStoreType(e.target.value)}
                    placeholder="PKCS12"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Storage & Rate Limiting */}
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-semibold text-base border-b pb-2">
              <HardDrive className="w-5 h-5 text-brand-secondary" />
              存储与防暴力破解规则 (Storage & Security)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  物理存储根目录 (storage-root)
                </label>
                <Input
                  type="text"
                  value={storageRoot}
                  onChange={(e) => setStorageRoot(e.target.value)}
                  placeholder="storage"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  密码错误锁定次数 (max-failures)
                </label>
                <Input
                  type="number"
                  value={maxFailures}
                  onChange={(e) => setMaxFailures(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  锁定统计窗口分钟数 (window-minutes)
                </label>
                <Input
                  type="number"
                  value={windowMinutes}
                  onChange={(e) => setWindowMinutes(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Admin Credentials */}
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-semibold text-base border-b pb-2">
              <KeyRound className="w-5 h-5 text-brand-secondary" />
              默认外部管理员凭据 (admin.yml)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  默认管理员账号
                </label>
                <Input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  默认管理员口令 (初始启动时自动散列)
                </label>
                <Input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="authorized_users"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveVisual}
              disabled={saveMutation.isPending}
              className="gap-2 px-6 h-10 shadow-md"
            >
              {saveMutation.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              保存全部配置
            </Button>
          </div>
        </div>
      ) : (
        /* Raw YAML Editor */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={yamlTab === "app" ? "default" : "outline"}
                size="sm"
                onClick={() => setYamlTab("app")}
              >
                application.yml
              </Button>
              <Button
                variant={yamlTab === "admin" ? "default" : "outline"}
                size="sm"
                onClick={() => setYamlTab("admin")}
              >
                admin.yml
              </Button>
            </div>

            <Button
              onClick={handleSaveRaw}
              disabled={saveMutation.isPending}
              size="sm"
              className="gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              保存 YAML 文件
            </Button>
          </div>

          <div className="relative border rounded-2xl bg-[#1e1e2e] text-[#cdd6f4] p-4 font-mono text-sm shadow-inner">
            <textarea
              className="w-full h-[450px] bg-transparent outline-none resize-none font-mono text-xs leading-relaxed selection:bg-brand-secondary/40"
              value={yamlTab === "app" ? appYamlText : adminYamlText}
              onChange={(e) =>
                yamlTab === "app"
                  ? setAppYamlText(e.target.value)
                  : setAdminYamlText(e.target.value)
              }
              spellCheck={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}

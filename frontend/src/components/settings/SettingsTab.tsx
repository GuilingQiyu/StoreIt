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
  RefreshCw,
  Clock,
  ShieldAlert
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function SettingsTab() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"visual" | "raw">("visual");
  const [yamlTab, setYamlTab] = useState<"app" | "admin">("app");

  // Raw YAML state
  const [appYamlText, setAppYamlText] = useState("");
  const [adminYamlText, setAdminYamlText] = useState("");

  // Visual form state
  const [port, setPort] = useState<number>(59898);
  const [sessionMaxAgeDays, setSessionMaxAgeDays] = useState<number>(30);
  const [sslEnabled, setSslEnabled] = useState(false);
  const [keyStorePath, setKeyStorePath] = useState("./keystore.p12");
  const [keyStorePass, setKeyStorePass] = useState("changeit");
  const [keyStoreType, setKeyStoreType] = useState("PKCS12");
  const [storageRoot, setStorageRoot] = useState("storage");
  const [appSslEnabled, setAppSslEnabled] = useState(false);
  const [requireCustomAdmin, setRequireCustomAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("");
  const [maxFailures, setMaxFailures] = useState(5);
  const [windowMinutes, setWindowMinutes] = useState(15);

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminConfig"],
    queryFn: () => api.getAdminConfig(),
  });

  useEffect(() => {
    if (data) {
      setAppYamlText(data.applicationYaml || "");
      setAdminYamlText(data.adminYaml || "");

      // Extract visual fields safely from parsed configuration maps
      const appCfg = data.applicationConfig || {};
      const serverCfg = appCfg.server || {};
      const sslCfg = serverCfg.ssl || {};
      const appProp = appCfg.app || {};
      const loginProp = appProp.login || {};
      const sessionProp = appProp.session || {};

      if (serverCfg.port !== undefined) setPort(Number(serverCfg.port));
      if (sessionProp["max-age-days"] !== undefined) {
        setSessionMaxAgeDays(Number(sessionProp["max-age-days"]));
      }
      if (sslCfg.enabled !== undefined) setSslEnabled(Boolean(sslCfg.enabled));
      if (sslCfg["key-store"] !== undefined) setKeyStorePath(String(sslCfg["key-store"]));
      if (sslCfg["key-store-password"] !== undefined) setKeyStorePass(String(sslCfg["key-store-password"]));
      if (sslCfg["key-store-type"] !== undefined) setKeyStoreType(String(sslCfg["key-store-type"]));

      if (appProp["storage-root"] !== undefined) setStorageRoot(String(appProp["storage-root"]));
      if (appProp["ssl-enabled"] !== undefined) setAppSslEnabled(Boolean(appProp["ssl-enabled"]));
      if (appProp["require-custom-admin"] !== undefined) setRequireCustomAdmin(Boolean(appProp["require-custom-admin"]));
      if (loginProp["max-failures"] !== undefined) setMaxFailures(Number(loginProp["max-failures"]));
      if (loginProp["window-minutes"] !== undefined) setWindowMinutes(Number(loginProp["window-minutes"]));

      const adminCfg = data.adminConfig || {};
      const defaultAdmin = (adminCfg.app || {})["default-admin"] || {};
      if (defaultAdmin.username) setAdminUsername(String(defaultAdmin.username));
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload: {
      visualConfig?: Record<string, any>;
      applicationYaml?: string;
      adminYaml?: string;
    }) => api.updateAdminConfig(payload),
    onSuccess: (res) => {
      setMessage({ text: res.message || "配置保存成功！", type: "success" });
      setAdminPassword(""); // Clear password field after save
      queryClient.invalidateQueries({ queryKey: ["adminConfig"] });
    },
    onError: (err: any) => {
      setMessage({ text: err.message || "保存配置失败", type: "error" });
    },
  });

  const handleSaveVisual = () => {
    // Send safe patch without overwriting unmapped YAML configurations
    saveMutation.mutate({
      visualConfig: {
        port,
        sessionMaxAgeDays,
        sslEnabled,
        keyStorePath,
        keyStorePass,
        keyStoreType,
        storageRoot,
        appSslEnabled,
        requireCustomAdmin,
        maxFailures,
        windowMinutes,
        adminUsername,
        adminPassword: adminPassword.trim() || undefined,
      },
    });
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
            安全维护 StoreIt 核心运行参数与外部配置文件（./config/*.yml），自动创建 .bak 备份
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
                  会话保持天数 (app.session.max-age-days)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={sessionMaxAgeDays}
                  onChange={(e) => setSessionMaxAgeDays(Number(e.target.value))}
                  placeholder="30"
                />
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  客户端 Cookie 会话有效时长（单位：天，默认 30 天）
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
                <Switch
                  checked={sslEnabled}
                  onCheckedChange={(checked) => {
                    setSslEnabled(checked);
                    if (checked) setAppSslEnabled(true);
                  }}
                />
              </div>
            </div>

            {sslEnabled && (
              <div className="space-y-4 pt-1">
                {data?.keystoreExists === false && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      警告：未在服务端路径 <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-semibold">{keyStorePath}</code> 找到 Keystore 文件。若未准备证书直接开启，重启后服务器可能无法启动。
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div className="flex items-center justify-between pt-2 border-t text-xs">
                  <div>
                    <p className="font-medium text-foreground">Cookie Secure 强制安全标记 (app.ssl-enabled)</p>
                    <p className="text-muted-foreground text-[11px]">开启后仅允许在 HTTPS 安全加密通道下发送用户 Session Cookie</p>
                  </div>
                  <Switch checked={appSslEnabled} onCheckedChange={setAppSslEnabled} />
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
                  连续错误锁定次数 (max-failures)
                </label>
                <Input
                  type="number"
                  value={maxFailures}
                  onChange={(e) => setMaxFailures(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  统计时间窗口分钟数 (window-minutes)
                </label>
                <Input
                  type="number"
                  value={windowMinutes}
                  onChange={(e) => setWindowMinutes(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Admin Credentials & Policies */}
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-semibold text-base border-b pb-2">
              <KeyRound className="w-5 h-5 text-brand-secondary" />
              初始外部管理员配置 (admin.yml)
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
                  修改默认管理员口令
                </label>
                <Input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="留空保持原口令不变"
                />
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  若留空则不会改动 admin.yml 中的已有口令
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t text-xs">
              <div>
                <p className="font-medium text-foreground">拒绝默认内置口令启动 (app.require-custom-admin)</p>
                <p className="text-muted-foreground text-[11px]">
                  若开启，当系统仍在使用初始口令 admin / authorized_users 时将直接拒绝启动以保障安全
                </p>
              </div>
              <Switch checked={requireCustomAdmin} onCheckedChange={setRequireCustomAdmin} />
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

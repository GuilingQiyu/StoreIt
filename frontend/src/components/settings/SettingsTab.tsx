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
  ShieldAlert,
  Database
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

  // Visual form state covering all configurable YAML items
  const [port, setPort] = useState<number>(59898);
  const [servletSessionTimeout, setServletSessionTimeout] = useState<string>("30d");
  const [sessionMaxAgeDays, setSessionMaxAgeDays] = useState<number>(30);
  const [cookieName, setCookieName] = useState<string>("STOREIT_SESSION");
  const [sslEnabled, setSslEnabled] = useState(false);
  const [keyStorePath, setKeyStorePath] = useState("./keystore.p12");
  const [keyStorePass, setKeyStorePass] = useState("changeit");
  const [keyStoreType, setKeyStoreType] = useState("PKCS12");
  const [storageRoot, setStorageRoot] = useState("storage");
  const [datasourceUrl, setDatasourceUrl] = useState("jdbc:sqlite:./data/storeit.db");
  const [maxFileSize, setMaxFileSize] = useState("100GB");
  const [maxRequestSize, setMaxRequestSize] = useState("100GB");
  const [appSslEnabled, setAppSslEnabled] = useState(false);
  const [requireCustomAdmin, setRequireCustomAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("");
  const [maxFailures, setMaxFailures] = useState(5);
  const [windowMinutes, setWindowMinutes] = useState(15);
  const [logLevel, setLogLevel] = useState("info");

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminConfig"],
    queryFn: () => api.getAdminConfig(),
  });

  useEffect(() => {
    if (data) {
      setAppYamlText(data.applicationYaml || "");
      setAdminYamlText(data.adminYaml || "");

      const appCfg = data.applicationConfig || {};
      const serverCfg = appCfg.server || {};
      const servletCfg = serverCfg.servlet || {};
      const srvSessionCfg = servletCfg.session || {};
      const sslCfg = serverCfg.ssl || {};
      const springCfg = appCfg.spring || {};
      const dsCfg = springCfg.datasource || {};
      const spServletCfg = springCfg.servlet || {};
      const multipartCfg = spServletCfg.multipart || {};
      const appProp = appCfg.app || {};
      const loginProp = appProp.login || {};
      const sessionProp = appProp.session || {};
      const loggingCfg = appCfg.logging || {};
      const levelCfg = loggingCfg.level || {};

      if (serverCfg.port !== undefined) setPort(Number(serverCfg.port));
      if (srvSessionCfg.timeout !== undefined) setServletSessionTimeout(String(srvSessionCfg.timeout));
      if (sessionProp["max-age-days"] !== undefined) setSessionMaxAgeDays(Number(sessionProp["max-age-days"]));
      if (sessionProp["cookie-name"] !== undefined) setCookieName(String(sessionProp["cookie-name"]));

      if (sslCfg.enabled !== undefined) setSslEnabled(Boolean(sslCfg.enabled));
      if (sslCfg["key-store"] !== undefined) setKeyStorePath(String(sslCfg["key-store"]));
      if (sslCfg["key-store-password"] !== undefined) setKeyStorePass(String(sslCfg["key-store-password"]));
      if (sslCfg["key-store-type"] !== undefined) setKeyStoreType(String(sslCfg["key-store-type"]));

      if (appProp["storage-root"] !== undefined) setStorageRoot(String(appProp["storage-root"]));
      if (dsCfg.url !== undefined) setDatasourceUrl(String(dsCfg.url));
      if (multipartCfg["max-file-size"] !== undefined) setMaxFileSize(String(multipartCfg["max-file-size"]));
      if (multipartCfg["max-request-size"] !== undefined) setMaxRequestSize(String(multipartCfg["max-request-size"]));

      if (appProp["ssl-enabled"] !== undefined) setAppSslEnabled(Boolean(appProp["ssl-enabled"]));
      if (appProp["require-custom-admin"] !== undefined) setRequireCustomAdmin(Boolean(appProp["require-custom-admin"]));
      if (loginProp["max-failures"] !== undefined) setMaxFailures(Number(loginProp["max-failures"]));
      if (loginProp["window-minutes"] !== undefined) setWindowMinutes(Number(loginProp["window-minutes"]));
      if (levelCfg.root !== undefined) setLogLevel(String(levelCfg.root).toLowerCase());

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
      setAdminPassword("");
      queryClient.invalidateQueries({ queryKey: ["adminConfig"] });
    },
    onError: (err: any) => {
      setMessage({ text: err.message || "保存配置失败", type: "error" });
    },
  });

  const handleSaveVisual = () => {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      setMessage({ text: "保存失败：服务端口必须是 1–65535 之间的整数", type: "error" });
      return;
    }
    if (!Number.isInteger(sessionMaxAgeDays) || sessionMaxAgeDays < 1 || sessionMaxAgeDays > 365) {
      setMessage({ text: "保存失败：会话保持天数必须是 1–365 之间的整数", type: "error" });
      return;
    }
    if (!Number.isInteger(maxFailures) || maxFailures < 1 || maxFailures > 1000) {
      setMessage({ text: "保存失败：连续错误锁定次数必须是不小于 1 的整数", type: "error" });
      return;
    }
    if (!Number.isInteger(windowMinutes) || windowMinutes < 1 || windowMinutes > 1440) {
      setMessage({ text: "保存失败：统计时间窗口分钟数必须是不小于 1 的整数", type: "error" });
      return;
    }
    if (!datasourceUrl.trim().startsWith("jdbc:sqlite:")) {
      setMessage({ text: "保存失败：SQLite 数据源 URL 必须以 jdbc:sqlite: 开头", type: "error" });
      return;
    }

    saveMutation.mutate({
      visualConfig: {
        port,
        servletSessionTimeout: servletSessionTimeout.trim() || "30d",
        sessionMaxAgeDays,
        cookieName: cookieName.trim() || "STOREIT_SESSION",
        sslEnabled,
        keyStorePath: keyStorePath.trim() || "./keystore.p12",
        keyStorePass,
        keyStoreType: keyStoreType.trim() || "PKCS12",
        storageRoot: storageRoot.trim() || "storage",
        datasourceUrl: datasourceUrl.trim(),
        maxFileSize: maxFileSize.trim() || "100GB",
        maxRequestSize: maxRequestSize.trim() || "100GB",
        appSslEnabled,
        requireCustomAdmin,
        maxFailures,
        windowMinutes,
        logLevel,
        adminUsername: adminUsername.trim() || "admin",
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-primary flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-secondary" />
            系统配置管理
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            安全维护 StoreIt 核心运行参数与外部配置文件（./config/*.yml），自动创建 .bak 备份。
            注意：可视化保存会重写 YAML 且不保留注释，如需保留注释请使用「YAML 原文编辑」模式。
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
                注意：端口、数据源、上传体积限制与 SSL 证书等核心参数修改后，需重启 StoreIt 进程生效。
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
        <div className="space-y-6">
          {/* 1. Server & Session Settings */}
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-semibold text-base border-b pb-2">
              <Server className="w-5 h-5 text-brand-secondary" />
              服务、会话与日志 (Server & Session)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  服务监听端口 (server.port)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={65535}
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  placeholder="59898"
                />
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  HTTP/HTTPS 监听端口 (1–65535)
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
                  登录会话有效时长（单位：天，1–365）
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  容器会话超时 (server.servlet.session.timeout)
                </label>
                <Input
                  type="text"
                  value={servletSessionTimeout}
                  onChange={(e) => setServletSessionTimeout(e.target.value)}
                  placeholder="30d"
                />
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  Spring 容器超时时长 (如 30d、12h、60m)
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  会话 Cookie 名称 (app.session.cookie-name)
                </label>
                <Input
                  type="text"
                  value={cookieName}
                  onChange={(e) => setCookieName(e.target.value)}
                  placeholder="STOREIT_SESSION"
                />
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  多实例同域名部署时可自定义区分
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  系统日志级别 (logging.level.root)
                </label>
                <select
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="info">INFO (默认推荐)</option>
                  <option value="warn">WARN (仅警告与错误)</option>
                  <option value="error">ERROR (仅错误)</option>
                  <option value="debug">DEBUG (调试详情)</option>
                  <option value="trace">TRACE (全量追踪)</option>
                </select>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  全局日志输出粒度
                </span>
              </div>
            </div>
          </div>

          {/* 2. Storage, Database & Multipart Upload Limits */}
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-semibold text-base border-b pb-2">
              <Database className="w-5 h-5 text-brand-secondary" />
              存储目录、数据库与上传限制 (Storage & Multipart)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  物理存储根目录 (app.storage-root)
                </label>
                <Input
                  type="text"
                  value={storageRoot}
                  onChange={(e) => setStorageRoot(e.target.value)}
                  placeholder="storage"
                />
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  用户上传文件在磁盘上的根文件夹路径
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  SQLite 数据库连接 URL (spring.datasource.url)
                </label>
                <Input
                  type="text"
                  value={datasourceUrl}
                  onChange={(e) => setDatasourceUrl(e.target.value)}
                  placeholder="jdbc:sqlite:./data/storeit.db"
                />
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  元数据库文件路径（需以 jdbc:sqlite: 开头）
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  单文件最大上传限制 (spring.servlet.multipart.max-file-size)
                </label>
                <Input
                  type="text"
                  value={maxFileSize}
                  onChange={(e) => setMaxFileSize(e.target.value)}
                  placeholder="100GB"
                />
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  支持 MB / GB / TB 单位（如 100GB、10GB）
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  单次请求最大体积 (spring.servlet.multipart.max-request-size)
                </label>
                <Input
                  type="text"
                  value={maxRequestSize}
                  onChange={(e) => setMaxRequestSize(e.target.value)}
                  placeholder="100GB"
                />
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  建议与 max-file-size 保持一致（如 100GB）
                </span>
              </div>
            </div>
          </div>

          {/* 3. SSL Settings */}
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-brand-primary font-semibold text-base">
                <ShieldCheck className="w-5 h-5 text-brand-secondary" />
                HTTPS 与 SSL 安全设置
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {sslEnabled ? "已启用直连 SSL" : "未启用 (HTTP 模式)"}
                </span>
                <Switch
                  checked={sslEnabled}
                  onCheckedChange={(checked) => {
                    setSslEnabled(checked);
                    setAppSslEnabled(checked);
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
                      KeyStore 证书文件路径 (server.ssl.key-store)
                    </label>
                    <Input
                      type="text"
                      value={keyStorePath}
                      onChange={(e) => setKeyStorePath(e.target.value)}
                      placeholder="./keystore.p12"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      KeyStore 访问口令 (server.ssl.key-store-password)
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
                      KeyStore 类型 (server.ssl.key-store-type)
                    </label>
                    <Input
                      type="text"
                      value={keyStoreType}
                      onChange={(e) => setKeyStoreType(e.target.value)}
                      placeholder="PKCS12"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t text-xs">
              <div>
                <p className="font-medium text-foreground">Cookie Secure 强制安全标记与 HSTS (app.ssl-enabled)</p>
                <p className="text-muted-foreground text-[11px] max-w-lg">
                  开启后 Session Cookie 仅允许在 HTTPS 加密通道下发送。直连 SSL 或由 Nginx / Caddy
                  等反向代理终结 HTTPS 时均应开启；纯 HTTP 部署必须关闭。
                </p>
              </div>
              <Switch checked={appSslEnabled} onCheckedChange={setAppSslEnabled} />
            </div>
          </div>

          {/* 4. Login Rate Limiting */}
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-semibold text-base border-b pb-2">
              <HardDrive className="w-5 h-5 text-brand-secondary" />
              登录防暴力破解规则 (app.login.*)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  连续错误锁定次数 (app.login.max-failures)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={1000}
                  value={maxFailures}
                  onChange={(e) => setMaxFailures(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  统计时间窗口分钟数 (app.login.window-minutes)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={1440}
                  value={windowMinutes}
                  onChange={(e) => setWindowMinutes(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* 5. Admin Credentials & Policies */}
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-semibold text-base border-b pb-2">
              <KeyRound className="w-5 h-5 text-brand-secondary" />
              初始外部管理员配置 (admin.yml)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  默认管理员账号 (app.default-admin.username)
                </label>
                <Input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  修改默认管理员口令 (app.default-admin.password)
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

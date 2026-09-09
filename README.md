# StoreIt | 储之 — 文件服务应用 
中文 | [English](./README-EN.md)

一个基于 Spring Boot 3（JDK 21）、SQLite 的轻量级文件存储与分享服务。支持登录会话、文件浏览/上传/下载、分享直链、基础安全头、可选 HTTPS，以及通过外部配置文件管理默认管理员账号。

![StoreIt Example](./example.png)

[更新日志](./Version.md)

核心默认配置：
- 端口：59898
- 数据库：`./data/storeit.db`（自动创建）
- 存储根目录：`./storage/`
- 默认管理员：`admin / authorized_users`（**仅为开箱示例**；仍使用时强制改密，可通过外部配置覆盖）

## 功能一览
- UI 页面：`/`（文件列表）、`/login`、`/change-password`、`/admin`（管理员）、`/about`；未登录访问云盘页面由服务端重定向到 `/login`
- 认证与会话：`POST /api/login`、`POST /api/logout`、`GET /api/user/status`、`POST /api/change-password`（弱口令强制改密）
- 文件：`GET /api/files?path=...`、`POST /api/upload`（multipart）、受保护下载 `GET /storage/**`
- 在线预览：`GET /api/preview?path=...`，内联返回图片 / 视频 / 纯文本，视频支持 HTTP Range 拖动定位
- 分享：创建 `POST /api/share`；列表 `GET /api/shares`；撤销 `DELETE /api/shares/{id}`；公开下载 `GET /d/{token}`（次数原子扣减）
- 管理：`/api/admin/users*`、`/api/admin/shares`（ADMIN）；前端 `/admin` 可建用户、配额、启停账号
- 存储用量：`GET /api/storage/usage`；普通用户展示个人目录实际占用与配额，管理员展示整盘容量
- 安全：会话 Cookie `HttpOnly` / `SameSite=Lax`（HTTPS 时 `Secure`）；CSP `script-src 'self'`；路径安全检查
- 配置：`application.yml` + 外部 `./config/admin.yml`

## 快速开始
前置要求：JDK 21、Maven

- 构建：`mvn -DskipTests package`
- 运行：`java -jar target/storeit-1.4.0.jar`

可选：在 `src/main/resources/application.yml` 调整配置；或通过外部文件覆盖（适用于发布 JAR 部署）：

1) 复制示例到本地配置目录：
	- `cp config/application.yml.example config/application.yml`
	- `cp config/admin.yml.example config/admin.yml`
2) 按需修改 `config/*.yml`，然后运行 jar。应用会自动读取 `./config/application.yml` 与 `./config/admin.yml`。

### 外部管理员凭据（推荐）
本项目通过 Spring Boot `spring.config.import` 支持从外部文件加载管理员用户名/密码，避免在仓库中存放明文：

- 外部文件路径：`./config/admin.yml`
- 示例内容：

```
app:
	default-admin:
		username: admin
		password: your_secret_here
```

`application.yml` 已配置：
```
spring:
	config:
		import:
			- optional:file:./config/application.yml
			- optional:file:./config/admin.yml
```
仓库的 `.gitignore` 已忽略实际的 `config/*.yml`（保留 `*.example`），适合直接携带 release JAR 进行外部配置。

> ⚠️ **安全建议（务必修改默认凭据）**
> 内置默认管理员 `admin / authorized_users` 仅为「开箱即用」，**严禁在生产/公网环境直接使用**。
> **1.4.0 起**：若库中口令仍为该示例弱口令，登录后只能访问改密页 / 健康检查，直至 `POST /api/change-password` 成功或通过外部配置设置**非弱**口令并重启同步。
> 推荐部署方式——在 `config/admin.yml` 配置强口令（非示例值时启动会同步到数据库）：
>
> ```
> # config/admin.yml
> app:
>   default-admin:
>     username: your_admin
>     password: <一段足够长的随机口令>
> ```
>
> 补充加固建议：
> - **启用 HTTPS**：在 `config/application.yml` 配置 `server.ssl.*` 并设 `app.ssl-enabled: true`，会话 Cookie 会自动附加 `Secure`，并下发 HSTS。
> - **登录限流**：应用层已内置简易 IP 滑动窗口限流；置于反向代理后可再叠加一层，例如 Nginx：
>   ```
>   limit_req_zone $binary_remote_addr zone=storeit_login:10m rate=5r/m;
>   location = /api/login {
>       limit_req zone=storeit_login burst=5 nodelay;
>       proxy_pass http://127.0.0.1:59898;
>   }
>   ```
> - **用户配额**：普通用户 `storage_quota`（字节，0=不限额）在上传/建目录时强制校验；管理员按整盘可用空间，不受用户配额约束。
> - **Actuator**：默认仅暴露 `GET /actuator/health`（无详情），勿随意扩大 `management.endpoints.web.exposure.include`。

### 路由与 API 说明
- 页面：
	- `GET /` -> `static/list.html`（网盘）
	- `GET /about` -> `static/index.html`
	- `GET /login` -> `static/login.html`
	- `GET /change-password` -> `static/change-password.html`
	- `GET /admin` -> `static/admin.html`（需 ADMIN）
	- `GET /list` -> 重定向到 `/`
- 认证：
	- `POST /api/login`（表单：username、password；成功时 `data.must_change_password` 指示是否需改密）
	- `POST /api/logout`
	- `GET /api/user/status`（含 `must_change_password`）
	- `POST /api/change-password`（表单：currentPassword、newPassword；需登录）
	- 页面：`GET /change-password`
- 文件：
	- `GET /api/files?path=...` — 列出目录内容
	- `POST /api/upload` — 上传文件（multipart/form-data，字段名：file，可选 directory）
	- `GET /storage/**` — 已登录受保护下载（`attachment`）
	- `GET /api/preview?path=...` — 已登录内联预览（`inline`，图片/视频/纯文本，视频支持 Range）
	- `POST /api/file/delete`、`POST /api/file/rename`、`POST /api/folder/create` — 删除 / 重命名 / 新建文件夹
	- `GET /api/storage/usage` — 存储用量（普通用户=个人占用/配额，管理员=整盘）
- 分享：
	- `POST /api/share` — 生成分享（`filePath`、`expireHours`（-1=永久）、`maxDownloads`（null/0=不限））
	- `GET /api/shares` — 当前用户分享列表（含剩余次数、是否有效）
	- `DELETE /api/shares/{id}` — 撤销（所有者或 ADMIN）
	- `GET /d/{token}` — 公开下载（有效期/次数，原子扣减）
- 管理（ADMIN）：
	- `GET /api/admin/users`、`POST /api/admin/users`（username/password/role/storageQuota）
	- `POST /api/admin/users/{username}/quota`、`POST /api/admin/users/{username}/enabled`
	- `GET /api/admin/shares` — 全站分享


### 运维：备份、升级与健康检查
- **备份**：停止写入或停服务后，一并备份 `./data/`（含 `storeit.db`）与 `./storage/`；配置目录 `./config/` 建议一并备份。
- **升级到 1.4.0**：替换 jar 后启动即可；Flyway 会自动执行 `V3`（改密标记）与 `V4`（`users.enabled`）。升级前请先备份。弱默认口令管理员首次登录需改密。
- **健康检查**：`GET /actuator/health`（默认无详情）；可用于进程探活。勿扩大 Actuator 暴露面。
- **CSP 说明**：脚本已外置到 `/static/js/script.js`，CSP 使用 `script-src 'self'`；样式仍允许 `'unsafe-inline'`（列表/进度等动态 style + FontAwesome）。

### 数据库存储
- SQLite 数据库：`./data/storeit.db`
- 表：`users`、`sessions`、`file_shares`（初始由 Flyway `V1__init.sql` 创建）
- 启动时会确保默认管理员存在；若外部配置为**非弱**口令且与库中不同则同步哈希；弱默认口令不会覆盖已改密的库记录

### HTTPS 与安全
- 支持在 `server.ssl.*` 配置中启用证书（见 `application.yml` 注释）
- 全局安全响应头通过 `SecurityHeadersFilter` 添加
- 路径安全检查与登录拦截通过 `AuthInterceptor`、`FileService.isSafePath` 实现

### 目录结构（关键部分）
- `storage/` — 文件存储根目录
- `src/main/resources/static/` — 静态资源（前端页面与脚本）
- `src/main/resources/db/migration/` — Flyway SQL 脚本
- `config/admin.yml` — 外部管理员配置（不入库）

### 从旧 Python 版本迁移
- 旧版基于 Flask + IP 白名单；新版改为 登录会话 + SQLite + Spring Boot 3
- 不再使用 `config.json` 与 `ip_whitelist.json`；改用 `application.yml` 与数据库
- HTTPS 配置方式变化：参考 Spring Boot SSL 配置；支持 PKCS12 keystore

---


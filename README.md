# StoreIt | 储之 — 文件服务应用 
中文 | [English](./README-EN.md)

一个基于 Spring Boot 3（JDK 21）、SQLite 的轻量级文件存储与分享服务。支持登录会话、文件浏览/上传/下载、分享直链、基础安全头、可选 HTTPS，以及通过外部配置文件管理默认管理员账号。

![StoreIt Example](./example.png)

[更新日志](./Version.md)

核心默认配置：
- 端口：59898
- 数据库：`./data/storeit.db`（自动创建）
- 存储根目录：`./storage/`
- 默认管理员：`admin / authorized_users`（可通过外部配置覆盖）

## 功能一览
- UI 页面：`/`、`/login`、`/list`（未登录访问云盘页面会由服务端直接重定向到 `/login`）
- 认证与会话：`POST /api/login`、`POST /api/logout`、`GET /api/user/status`
- 文件：`GET /api/files?path=...`、`POST /api/upload`（multipart）、受保护下载 `GET /storage/**`
- 在线预览：`GET /api/preview?path=...`，内联返回图片 / 视频 / 纯文本，视频支持 HTTP Range 拖动定位
- 分享直链：`POST /api/share` 生成分享，公开下载 `GET /d/{token}`（先确认文件可读，再原子扣减下载次数；文件已删除时不扣次）
- 存储用量：`GET /api/storage/usage`；普通用户展示个人目录实际占用与配额，管理员展示整盘容量。`storage_quota` 大于 0 时上传会校验配额，超出返回「存储配额不足」；0 表示不限额
- 安全：会话 Cookie 设置 `HttpOnly` / `SameSite=Lax`（`app.ssl-enabled: true` 时附加 `Secure`）；`Content-Security-Policy` 与 `X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy` 等响应头；`Strict-Transport-Security` 仅在 HTTPS 下下发；路径安全检查，防目录穿越
- 配置：classpath 中的 `application.yml` 会先导入外部 `./config/application.yml`（端口、SSL、数据源、存储目录、`app.ssl-enabled`），再导入 `./config/admin.yml`（管理员口令；同名项以后者为准）

## 快速开始
前置要求：JDK 21、Maven

- 构建：`mvn package`（会运行测试）
- 运行：`java -jar target/storeit-1.4.0a.jar`

可选：在 `src/main/resources/application.yml` 调整配置；或通过外部文件覆盖（适用于发布 JAR 部署）：

1) 复制示例到本地配置目录：
	- `cp config/application.yml.example config/application.yml`
	- `cp config/admin.yml.example config/admin.yml`
2) 按需修改 `config/*.yml`，然后运行 jar。应用先读 `./config/application.yml`，再读 `./config/admin.yml`。后加载的文件覆盖同名项，因此管理员口令以 `admin.yml` 为准。

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

> **安全建议：务必修改默认凭据**
> 内置默认管理员 `admin / authorized_users` 仅为「开箱即用」，**严禁在生产/公网环境直接使用**。
> 部署前请通过外部配置覆盖为强口令，应用启动时会自动用新口令重算 BCrypt 哈希并同步到数据库：
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
> - **置于反向代理之后**：由 Nginx/Caddy 终止 TLS 并按需做登录限流，弥补应用层暂未内置的登录速率限制。
> - **设置用户配额**：`storage_quota`（字节）大于 0 时，上传前会比较个人目录已占用与本次文件大小，超出则拒绝；0 表示不限额。管理员默认配额为 0。

### 路由与 API 说明
- 页面：
	- `GET /` -> `static/index.html`
	- `GET /login` -> `static/login.html`
	- `GET /list` -> `static/list.html`
- 认证：
	- `POST /api/login`（表单：username、password）
	- `POST /api/logout`
	- `GET /api/user/status`
- 文件：
	- `GET /api/files?path=...` — 列出目录内容
	- `POST /api/upload` — 上传文件（multipart/form-data，字段名：file，可选 directory）。配额不足时返回 400，`error` 为「存储配额不足」
	- `GET /storage/**` — 已登录受保护下载（`attachment`）
	- `GET /api/preview?path=...` — 已登录内联预览（`inline`，图片/视频/纯文本，视频支持 Range）
	- `POST /api/file/delete`、`POST /api/file/rename`、`POST /api/folder/create` — 删除 / 重命名 / 新建文件夹
	- `GET /api/storage/usage` — 存储用量（普通用户=个人占用/配额，管理员=整盘）
- 分享：
	- `POST /api/share` — 生成分享链接（请求体：`{"filePath":"...","expireHours":720,"maxDownloads":null}`，`expireHours=-1` 为永久）
	- `GET /d/{token}` — 公开下载（受有效期/下载次数限制）。文件仍可读时才原子扣减次数；文件已删除时返回「文件不存在」且不扣次

### 数据库存储
- SQLite 数据库：`./data/storeit.db`
- 表：`users`、`sessions`、`file_shares`（Flyway `V1__init.sql`），以及 `V2` 增加的角色、`storage_quota`、`file_metadata`
- 每个 SQLite 连接执行 `PRAGMA foreign_keys=ON`，连接池最多 1 个连接
- 启动时会确保默认管理员存在；若配置中密码变更，会同步更新其哈希

### HTTPS 与安全
- 支持在 `server.ssl.*` 配置中启用证书（见 `application.yml` 注释）
- 全局安全响应头通过 `SecurityHeadersFilter` 添加
- 路径安全检查与登录拦截通过 `AuthInterceptor`、`FileService.isSafePath` 实现

### 目录结构（关键部分）
- `storage/` — 文件存储根目录
- `src/main/resources/static/` — 静态资源（前端页面与脚本）
- `src/main/resources/static/error/` — 403 / 404 错误页
- `src/main/resources/db/migration/` — Flyway SQL 脚本
- `config/application.yml` — 外部应用配置（不入库，先于管理员配置加载）
- `config/admin.yml` — 外部管理员配置（不入库）


# StoreIt — File Service 

[中文](./README.md) | English: 

A lightweight file storage and sharing service built with Spring Boot 3 (JDK 21) and SQLite. Provides login sessions, browse/upload/download, share links, security headers, optional HTTPS, and externalized admin credentials.

Licensed under the [GNU AGPL-3.0 or later](https://www.gnu.org/licenses/agpl-3.0.html) (`AGPL-3.0-or-later`). See [LICENSE](./LICENSE). Source: <https://github.com/GuilingQiyu/StoreIt>.

[Version log](./Version.md)

Defaults:
- Port: 59898
- DB: `./data/storeit.db`
- Storage root: `./storage/`
- Default admin: `admin / authorized_users` (override via external config)

## Features
- UI: `/`, `/login`, `/list`
- Auth: `POST /api/login`, `POST /api/logout`, `GET /api/user/status`. Five failed attempts for the same IP and username within 15 minutes are then rejected.
- Files: `GET /api/files?path=...`, `POST /api/upload` (multipart), protected download `GET /storage/**`
- Preview: images (except SVG), video, audio, and PDF stay inline. HTML, SVG, and XML are served as `text/plain` with `script-src 'none'`.
- Health: `GET /actuator/health` is public. Other Actuator endpoints are not exposed.
- Share: `POST /api/share` to create, `GET /api/shares` to list your links, `DELETE /api/shares/{id}` to revoke, public `GET /d/{token}` to download. The download count is consumed only after the file is readable.
- Admin users: `GET/POST /api/admin/users`, `PATCH /api/admin/users/{username}`, `POST /api/admin/users/{username}/password`. Usernames are limited to letters, digits, `.`, `_`, and `-`. Other users receive 403.
- Storage quota: `storage_quota` greater than 0 is enforced on upload (0 means unlimited). Over quota returns "存储配额不足".
- Security: common headers (`HSTS`, `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`), path safety checks. Session cookie is `Secure` when `app.ssl-enabled` is true.
- Config: `./config/application.yml` is imported first (port, SSL, datasource, storage, `app.ssl-enabled`), then `./config/admin.yml` (admin password wins on duplicate keys).

## Quick start
Prereqs: JDK 21, Maven

- Build: `mvn package` (runs tests; to rebuild frontend, run `npm run export` inside `frontend/` first)
- Run: `java -jar target/storeit-2.0.0.jar`

### Frontend Development & Build
The StoreIt 2.0.0 frontend is completely refactored with Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, and Zustand, supporting 100GB+ chunked concurrent resumable uploads, visual configuration, context menus, and responsive design:

1. Enter frontend folder: `cd frontend`
2. Install dependencies: `npm ci` (or `npm install`)
3. Development mode: `npm run dev` (built-in proxy forwards `/api/*` to backend `http://localhost:59898`)
4. Build & sync to JAR static directory: `npm run export` (builds static export and syncs into `src/main/resources/static/`)

### External admin credentials
Path: `./config/admin.yml`

```
app:
  default-admin:
    username: admin
    password: your_secret_here
```

Imported via `spring.config.import`, with `optional:file:./config/application.yml` before `optional:file:./config/admin.yml`. Both files are ignored by VCS.

## Routes & APIs
- Pages: `/`, `/login`, `/list`
- Auth: `POST /api/login`, `POST /api/logout`, `GET /api/user/status`
- Files: `GET /api/files?path=...`, `POST /api/upload`, `GET /storage/**`
- Share: `POST /api/share`, `GET /d/{token}`

## DB & Security
- SQLite at `./data/storeit.db` with Flyway initialization
- Default admin ensured/updated on startup
- Security headers via filter; path and auth interception applied

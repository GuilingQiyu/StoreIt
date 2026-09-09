# StoreIt — File Service 

[中文](./README.md) | English: 

A lightweight file storage and sharing service built with Spring Boot 3 (JDK 21) and SQLite. Provides login sessions, browse/upload/download, share links, security headers, optional HTTPS, and externalized admin credentials.

[Version log](./Version.md)

Defaults:
- Port: 59898
- DB: `./data/storeit.db`
- Storage root: `./storage/`
- Default admin: `admin / authorized_users` (example only; 1.4.0 forces password change if still in use)

## Features
- UI: `/`, `/login`, `/list`
- Auth: `POST /api/login`, `POST /api/logout`, `GET /api/user/status`, `POST /api/change-password`
- Files: `GET /api/files?path=...`, `POST /api/upload` (multipart), protected download `GET /storage/**`
- Share: `POST /api/share` to create, public `GET /d/{token}` to download
- Security: common headers (`HSTS`, `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`), path safety checks
- Config: `application.yml` and external `./config/admin.yml`

## Quick start
Prereqs: JDK 21, Maven

- Build: `mvn -DskipTests package`
- Run: `java -jar target/storeit-1.4.0.jar`

### External admin credentials
Path: `./config/admin.yml`

```
app:
  default-admin:
    username: admin
    password: your_secret_here
```

Already imported via `spring.config.import=optional:file:./config/admin.yml`. Ignored by VCS.

## Routes & APIs
- Pages: `/`, `/login`, `/list`
- Auth: `POST /api/login`, `POST /api/logout`, `GET /api/user/status`
- Files: `GET /api/files?path=...`, `POST /api/upload`, `GET /storage/**`
- Share: `POST /api/share`, `GET /d/{token}`

## DB & Security
- SQLite at `./data/storeit.db` with Flyway initialization
- Default admin ensured/updated on startup
- Security headers via filter; path and auth interception applied

## 1.4.0 notes
- Weak default password blocks normal use until changed (`/change-password`).
- USER role `storage_quota` is enforced on upload/folder create; ADMIN uses whole-disk free space.
- Actuator exposes only `/actuator/health` by default.
- Built-in login rate limit (per IP); Nginx example available in the Chinese README.

## Ops (1.4.0)
- Backup both `./data/` and `./storage/` (plus `./config/` if customized).
- Upgrades run Flyway V3/V4 automatically; backup first.
- Health: `GET /actuator/health` only by default.
- Share manage: `GET /api/shares`, `DELETE /api/shares/{id}`; Admin UI at `/admin` (`/api/admin/...`).

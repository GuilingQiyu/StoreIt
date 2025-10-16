# StoreIt — File Service (v1.1.1)

A lightweight file storage and sharing service built with Spring Boot 3 (JDK 21) and SQLite. Provides login sessions, browse/upload/download, share links, security headers, optional HTTPS, and externalized admin credentials.

Defaults:
- Port: 59898
- DB: `./data/storeit.db`
- Storage root: `./storage/`
- Default admin: `admin / authorized_users` (override via external config)

## Features
- UI: `/`, `/login`, `/list`
- Auth: `POST /api/login`, `POST /api/logout`, `GET /api/user/status`
- Files: `GET /api/files?path=...`, `POST /api/upload` (multipart), protected download `GET /storage/**`
- Share: `POST /api/share` to create, public `GET /d/{token}` to download
- Security: common headers (`HSTS`, `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`), path safety checks
- Config: `application.yml` and external `./config/admin.yml`

## Quick start
Prereqs: JDK 21, Maven

- Build: `mvn -DskipTests package`
- Run: `java -jar target/storeit-1.1.1.jar`

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

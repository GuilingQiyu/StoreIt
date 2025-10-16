# StoreIt Spring Boot 3 (JDK 21)

Port: 59898
DB: SQLite file at `./data/storeit.db` (auto-created)
Storage root: `./storage/`
Default admin: `admin / authorized_users`

## Endpoints
UI: `/`, `/login`, `/list`
Auth API: `POST /api/login`, `POST /api/logout`, `GET /api/user/status`
File API: `GET /api/files?path=...`, `POST /api/upload` (multipart), `GET /storage/**`
Share API: `POST /api/share`, Public download `GET /d/{token}`

## Build & Run
Requires: JDK 21, Maven
Build: `mvn -DskipTests package`
Run: `java -jar target/storeit-0.0.1-SNAPSHOT.jar`

Optional: configure in `src/main/resources/application.yml`.
CREATE TABLE IF NOT EXISTS invite_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    created_by TEXT NOT NULL,
    max_uses INTEGER NOT NULL DEFAULT 1,
    used_count INTEGER NOT NULL DEFAULT 0,
    default_quota INTEGER NOT NULL DEFAULT 0,
    expires_at INTEGER,
    revoked INTEGER NOT NULL DEFAULT 0,
    note TEXT,
    created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON invite_codes(code);

ALTER TABLE file_shares ADD COLUMN is_directory BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE file_shares ADD COLUMN permission TEXT NOT NULL DEFAULT 'READ';
ALTER TABLE file_shares ADD COLUMN access_password TEXT;
ALTER TABLE file_shares ADD COLUMN title TEXT;

CREATE TABLE IF NOT EXISTS share_mounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    mount_name TEXT NOT NULL,
    remote_server_url TEXT NOT NULL DEFAULT '',
    share_token TEXT NOT NULL,
    access_password TEXT,
    permission TEXT NOT NULL DEFAULT 'READ',
    owner_name TEXT,
    is_directory BOOLEAN NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_share_mounts_user ON share_mounts(user_id);

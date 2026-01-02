ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'USER';
ALTER TABLE users ADD COLUMN storage_quota INTEGER DEFAULT 0;

CREATE TABLE file_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    path TEXT NOT NULL,
    name TEXT NOT NULL,
    is_directory BOOLEAN NOT NULL,
    size INTEGER NOT NULL,
    last_modified INTEGER NOT NULL,
    content_type TEXT,
    parent_path TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, path)
);

CREATE INDEX idx_file_metadata_user_parent ON file_metadata(user_id, parent_path);

ALTER TABLE file_shares ADD COLUMN user_id INTEGER;
ALTER TABLE file_shares ADD COLUMN created_at INTEGER;

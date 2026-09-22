ALTER TABLE users ADD COLUMN enabled INTEGER NOT NULL DEFAULT 1;
CREATE INDEX IF NOT EXISTS idx_file_shares_user ON file_shares(user_id);

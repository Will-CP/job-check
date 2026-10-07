CREATE TABLE IF NOT EXISTS updates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id TEXT NOT NULL,
  outcome TEXT NOT NULL,
  note TEXT,
  name TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now')),
  in_tapi INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_updates_job ON updates (job_id, id);
CREATE TABLE IF NOT EXISTS login_fails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_fails_ip ON login_fails (ip, at);

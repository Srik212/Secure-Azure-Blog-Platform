import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

/*
|--------------------------------------------------------------------------
| Database Path
|--------------------------------------------------------------------------
|
| Local development:
|   apps/backend/data.sqlite
|
| Docker / Azure:
|   DB_PATH=/data/data.sqlite
|
*/

const DB_PATH =
  process.env.DB_PATH ||
  path.join(__dirname, "..", "data.sqlite");

/*
|--------------------------------------------------------------------------
| Ensure database directory exists
|--------------------------------------------------------------------------
*/

const dbDirectory = path.dirname(DB_PATH);

if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

/*
|--------------------------------------------------------------------------
| Database Connection
|--------------------------------------------------------------------------
*/

export const db = new Database(DB_PATH);

/*
|--------------------------------------------------------------------------
| SQLite Configuration
|--------------------------------------------------------------------------
|
| WAL works well locally.
|
| Azure persistent storage will eventually use Azure Files, which is
| network-backed storage, so WAL should not be used there.
|
*/

if (process.env.NODE_ENV === "production") {
  db.pragma("journal_mode = DELETE");
} else {
  db.pragma("journal_mode = WAL");
}

/*
| Enable foreign key enforcement.
|
| Required for:
| ON DELETE CASCADE
*/

db.pragma("foreign_keys = ON");

/*
| Wait briefly instead of immediately failing when the DB is locked.
*/

db.pragma("busy_timeout = 5000");

/*
|--------------------------------------------------------------------------
| Database Schema
|--------------------------------------------------------------------------
*/

db.exec(`

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  author_id INTEGER NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  title TEXT NOT NULL,

  content_md TEXT NOT NULL,

  tags TEXT NOT NULL DEFAULT '[]',

  emoji TEXT NOT NULL DEFAULT '📝',

  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  post_id INTEGER NOT NULL
    REFERENCES posts(id)
    ON DELETE CASCADE,

  author_id INTEGER NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  body TEXT NOT NULL,

  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  post_id INTEGER NOT NULL
    REFERENCES posts(id)
    ON DELETE CASCADE,

  user_id INTEGER NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  emoji TEXT NOT NULL,

  UNIQUE(post_id, user_id, emoji)
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

CREATE INDEX IF NOT EXISTS idx_posts_created
ON posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_post
ON comments(post_id);

CREATE INDEX IF NOT EXISTS idx_reactions_post
ON reactions(post_id);

`);

/*
|--------------------------------------------------------------------------
| Database Startup Information
|--------------------------------------------------------------------------
*/

console.log(`SQLite database initialized`);

console.log(
  `Database environment: ${
    process.env.NODE_ENV === "production"
      ? "production"
      : "development"
  }`
);

console.log(`Database location: ${DB_PATH}`);
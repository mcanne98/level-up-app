-- Level Up — Auth Schema Additions
-- Run after schema.sql

-- ==================== USERS (updated) ====================

-- Drop and recreate users with full fields
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS auth_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  role          TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('parent', 'admin')),
  first_name    TEXT NOT NULL DEFAULT '',
  last_name     TEXT NOT NULL DEFAULT '',
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== AUTH TOKENS ====================

CREATE TABLE auth_tokens (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  token_hash   TEXT NOT NULL,
  token_type   TEXT NOT NULL CHECK (token_type IN ('parent_verification', 'parent_login')),
  expires_at   TIMESTAMPTZ NOT NULL,
  used_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  request_ip   TEXT,
  user_agent   TEXT
);

CREATE INDEX idx_auth_tokens_email ON auth_tokens(email);
CREATE INDEX idx_auth_tokens_hash  ON auth_tokens(token_hash);

-- ==================== SESSIONS ====================

CREATE TABLE sessions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_type    TEXT NOT NULL CHECK (user_type IN ('parent', 'child', 'admin')),
  user_id      UUID NOT NULL,   -- references users.id OR child_profiles.id
  session_hash TEXT NOT NULL UNIQUE,
  expires_at   TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  revoked_at   TIMESTAMPTZ
);

CREATE INDEX idx_sessions_hash    ON sessions(session_hash);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- ==================== CHILD_PROFILES (updated) ====================

ALTER TABLE child_profiles
  ADD COLUMN IF NOT EXISTS username      TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS avatar_animal TEXT DEFAULT 'panda';

CREATE UNIQUE INDEX IF NOT EXISTS idx_child_profiles_username ON child_profiles(username);

-- ==================== RATE LIMITING ====================

CREATE TABLE IF NOT EXISTS rate_limit_events (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        TEXT NOT NULL,  -- e.g. "token_request:user@example.com"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rate_limit_key_time ON rate_limit_events(key, created_at);

-- ==================== RLS ====================

ALTER TABLE auth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Service-role only — no direct client access

-- Reader comments (text and/or voice). Held for moderation. Safe to re-run.
CREATE TABLE IF NOT EXISTS comments (
  id serial PRIMARY KEY,
  post_id integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  audio bytea,
  audio_type text NOT NULL DEFAULT '',
  audio_bytes integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved')),
  ip_hash text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz
);
CREATE INDEX IF NOT EXISTS comments_post_status_idx ON comments (post_id, status, created_at);
CREATE INDEX IF NOT EXISTS comments_ip_idx ON comments (ip_hash, created_at);
CREATE INDEX IF NOT EXISTS comments_status_idx ON comments (status, created_at DESC);

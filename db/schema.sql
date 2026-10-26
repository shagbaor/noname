-- Kin Archive schema. Safe to re-run.
CREATE TABLE IF NOT EXISTS admins (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  form text NOT NULL CHECK (form IN ('essay','memoir','letter','diary','poem','fiction','oral-history','interview','song','photo-essay','artwork','film','document','tribute')),
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT '',
  region text NOT NULL DEFAULT '',
  era text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT '',
  cover_url text NOT NULL DEFAULT '',
  pattern text NOT NULL DEFAULT 'mudcloth' CHECK (pattern IN ('mudcloth','kente','adire','chevron')),
  audio_url text NOT NULL DEFAULT '',
  duration_sec integer NOT NULL DEFAULT 0,
  transcribed boolean NOT NULL DEFAULT false,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  video_url text NOT NULL DEFAULT '',
  themes text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_status_published_idx ON posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS posts_form_idx ON posts (form);
CREATE INDEX IF NOT EXISTS posts_themes_idx ON posts USING gin (themes);
-- Mailing list sign-ups from the footer form. Safe to re-run.
CREATE TABLE IF NOT EXISTS subscribers (
  id serial PRIMARY KEY,
  email text NOT NULL,
  source text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_key ON subscribers (lower(email));
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
-- News posts share the posts table. Safe to re-run.
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_form_check;
ALTER TABLE posts ADD CONSTRAINT posts_form_check CHECK (form IN (
  'essay','memoir','letter','diary','poem','fiction',
  'oral-history','interview','song',
  'photo-essay','artwork','film',
  'document','tribute',
  'news'
));
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT '';

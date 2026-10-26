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
  form text NOT NULL CHECK (form IN ('essay','oral-history','letter','poem','photo-essay','interview','fiction')),
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
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_status_published_idx ON posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS posts_form_idx ON posts (form);

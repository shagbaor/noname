-- Mailing list sign-ups from the footer form. Safe to re-run.
CREATE TABLE IF NOT EXISTS subscribers (
  id serial PRIMARY KEY,
  email text NOT NULL,
  source text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_key ON subscribers (lower(email));

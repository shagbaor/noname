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

-- Expand story types, add themes and video. Additive and safe to re-run.
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_form_check;
ALTER TABLE posts ADD CONSTRAINT posts_form_check CHECK (form IN (
  'essay','memoir','letter','diary','poem','fiction',
  'oral-history','interview','song',
  'photo-essay','artwork','film',
  'document','tribute'
));
ALTER TABLE posts ADD COLUMN IF NOT EXISTS themes text[] NOT NULL DEFAULT '{}';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_url text NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS posts_themes_idx ON posts USING gin (themes);

-- Tag the sample stories with themes
UPDATE posts SET themes = '{tradition}' WHERE slug = 'the-names-we-were-given' AND themes = '{}';
UPDATE posts SET themes = '{love-family,faith}' WHERE slug = 'my-grandmother-called-it-a-gift' AND themes = '{}';
UPDATE posts SET themes = '{activism,joy}' WHERE slug = 'the-first-march-1990' AND themes = '{}';
UPDATE posts SET themes = '{love-family,health}' WHERE slug = 'a-kitchen-full-of-aunties' AND themes = '{}';
UPDATE posts SET themes = '{love-family}' WHERE slug = 'letters-from-hillbrow' AND themes = '{}';
UPDATE posts SET themes = '{tradition,joy}' WHERE slug = 'praise-song-for-the-unnamed' AND themes = '{}';
UPDATE posts SET themes = '{nightlife,joy}' WHERE slug = 'dance-floors-as-archives' AND themes = '{}';
UPDATE posts SET themes = '{activism}' WHERE slug = 'in-conversation-with-an-elder' AND themes = '{}';
UPDATE posts SET themes = '{love-family,tradition}' WHERE slug = 'the-tailor-of-ouagadougou' AND themes = '{}';

-- SAMPLE stories for some of the new types
INSERT INTO posts (slug, title, form, excerpt, body, author, region, era, location, language, pattern, duration_sec, themes, status, published_at)
VALUES
('a-song-for-the-wedding-we-never-had', 'A song for the wedding we never had', 'song',
 'A love song passed between friends, with the story of who first sang it.',
 E'**Narrator:** We sang it in the kitchen, softly, so the neighbours would think it was the radio.\n\n*Sample song entry. Add an audio URL in the admin to make it playable.*',
 'Sample — Singer', 'West Africa', '2000s', 'Lagos, Nigeria', 'Yoruba', 'kente', 214, '{love-family,joy}', 'published', now() - interval '10 days'),
('a-flyer-for-a-house-party-1994', 'A flyer for a house party, 1994', 'document',
 'A photocopied invitation that travelled hand to hand.',
 E'Found folded inside a novel. The address is handwritten; the date is circled twice.\n\nAdd scans of the document from the admin.\n\n*Sample document.*',
 'Sample — Archivist', 'Southern Africa', '1994', 'Cape Town, South Africa', 'English', 'chevron', 0, '{nightlife,joy}', 'published', now() - interval '11 days'),
('remembering-a-friend', 'Remembering a friend who held the door open', 'tribute',
 'A tribute to an organiser whose kitchen table became a meeting room.',
 E'She kept a spare key under the third flowerpot, and everyone knew it.\n\n> She never asked who you were. She asked if you had eaten.\n\n*Sample tribute.*',
 'Sample — Friend', 'East Africa', '1956 – 2021', 'Nairobi, Kenya', 'English', 'adire', 0, '{activism,love-family}', 'published', now() - interval '12 days')
ON CONFLICT (slug) DO NOTHING;

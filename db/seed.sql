-- SAMPLE CONTENT: placeholder stories that show each story form.
-- Authors are marked "Sample". Delete or replace these from /admin before launch.
INSERT INTO posts (slug, title, form, excerpt, body, author, region, era, location, language, pattern, duration_sec, transcribed, images, featured, status, published_at)
VALUES
(
  'the-names-we-were-given', 'The names we were given, and the names we kept', 'essay',
  'Before colonial penal codes, many African languages already held words for us. A long read on vocabulary, memory, and what survives translation.',
  E'Every archive begins with a vocabulary. Before there were files, there were words: names spoken at weddings, at funerals, in teasing and in praise.\n\n## What the codes erased\n\nColonial penal codes arrived with their own language, and that language was a language of crime. What they could not do was erase the older words entirely. They went quiet, then they went underground, and then, slowly, they came back.\n\n> A word that survives is a door someone left open for you.\n\n## Reading the silence\n\nThis essay is a sample. Replace it with your first long read from the admin.',
  'Sample — Editorial Collective', 'Pan-African', 'Pre-1900 – Present', '', '', 'mudcloth', 0, false, '[]', true, 'published', now() - interval '1 day'
),
(
  'my-grandmother-called-it-a-gift', 'My grandmother called it a gift', 'oral-history',
  'A narrator remembers the elder who first told them there was nothing to fix.',
  E'**Interviewer:** When did you first hear someone speak about it openly?\n\n**Narrator:** My grandmother. She was shelling groundnuts. She said, some people are born with two spirits, and it is a gift, not a curse.\n\n*Transcript excerpt — sample content.*',
  'Sample — Anonymous narrator', 'East Africa', '1970s', 'Kampala, Uganda', 'Luganda', 'adire', 1724, true, '[]', false, 'published', now() - interval '2 days'
),
(
  'the-first-march-1990', 'The first march, 1990', 'oral-history',
  'Memories of walking through Johannesburg in what is widely recorded as Africa''s first Pride.',
  E'**Narrator:** We were maybe eight hundred people. Some of us wore paper bags over our heads, because we could lose our jobs. By the end, some of the bags had come off.\n\n*Transcript excerpt — sample content.*',
  'Sample — Narrator', 'Southern Africa', '1990', 'Johannesburg, South Africa', 'isiZulu', 'kente', 2410, true, '[]', false, 'published', now() - interval '3 days'
),
(
  'a-kitchen-full-of-aunties', 'A kitchen full of aunties', 'oral-history',
  'On chosen family, cooking pots, and the women who kept each other safe.',
  E'Transcript pending. This is sample content.',
  'Sample — Anonymous narrator', 'West Africa', '1990s', 'Accra, Ghana', 'Twi', 'chevron', 1188, false, '[]', false, 'published', now() - interval '4 days'
),
(
  'letters-from-hillbrow', 'Letters from Hillbrow', 'letter',
  'Reading a decade of correspondence between two friends in 1980s Johannesburg.',
  E'Dear T.,\n\nThe rains came early this year and the flat smells of wet concrete. I keep your last letter under the radio, where no one looks.\n\nYou asked if I am lonely. I am less lonely than I was. There is a bar on Pretoria Street where nobody asks your surname.\n\nWrite soon, and write small.\n\nYours, always,\nM.\n\n*Sample letter.*',
  'Sample — Correspondent', 'Southern Africa', '1980s', 'Johannesburg', 'English', 'kente', 0, false, '[]', false, 'published', now() - interval '5 days'
),
(
  'praise-song-for-the-unnamed', 'Praise song for the unnamed', 'poem',
  'A praise poem for the ancestors whose names were never written down.',
  E'We sing you who were not recorded,\nwho danced at the edge of the firelight,\nwho loved in the language of looking.\n\nWe sing your hands in the clay,\nyour voice in the call and the answer,\nyour name in the space where a name should be.\n\nWe are the record now.\nWe are the record now.\n\n— Sample poem',
  'Sample — Poet', 'Pan-African', 'Contemporary', '', '', 'adire', 0, false, '[]', false, 'published', now() - interval '6 days'
),
(
  'dance-floors-as-archives', 'Dance floors as archives', 'photo-essay',
  'How nightlife in Lagos, Nairobi and Dakar kept community records no library would.',
  E'Nightlife has always been an archive: of music, of fashion, of who was there and who was missing. Add photographs from the admin to fill this photo essay.\n\n*Sample photo essay.*',
  'Sample — Photographer', 'West Africa', '1990s – 2010s', 'Lagos · Nairobi · Dakar', '', 'adire', 0, false, '[]', false, 'published', now() - interval '7 days'
),
(
  'in-conversation-with-an-elder', 'In conversation with an elder organiser', 'interview',
  'Forty years of organising, in one long afternoon conversation.',
  E'**Q:** What did organising look like before the internet?\n\n**A:** Phone trees. Envelopes with no return address. A lot of tea.\n\n**Q:** What do you want young people to know?\n\n**A:** That we were here, and that we were not sad all the time. We laughed so much.\n\n*Sample interview.*',
  'Sample — Interviewer', 'East Africa', '1980s – Present', 'Nairobi, Kenya', 'English', 'chevron', 0, false, '[]', false, 'published', now() - interval '8 days'
),
(
  'the-tailor-of-ouagadougou', 'The tailor of Ouagadougou', 'fiction',
  'A short story about a tailor, a wedding suit, and a secret sewn into the lining.',
  E'The suit was midnight blue, and Idrissa had sewn something into the lining that only the groom would ever find.\n\nIt was a name, stitched small in gold thread. Not the bride''s name.\n\n*Sample short fiction.*',
  'Sample — Writer', 'West Africa', 'Fiction', 'Ouagadougou, Burkina Faso', '', 'mudcloth', 0, false, '[]', false, 'published', now() - interval '9 days'
)
ON CONFLICT (slug) DO NOTHING;

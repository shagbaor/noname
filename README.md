# Kin Archive (working name)

An archive and journal of queer African history: stories in every form (essays, oral histories, letters, poems, photo essays, interviews, fiction), recorded testimonies, a timeline, and a searchable archive. Built with Next.js 16, Tailwind CSS v4 and Postgres (Neon) on the **Terracotta & Archival Joy** design system ([DESIGN.md](./DESIGN.md)).

## Run it locally

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql      # optional sample stories
node scripts/create-admin.mjs you@example.com | psql "$DATABASE_URL"
pnpm dev                                 # http://localhost:3000
```

## Environment

| Variable | What |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Neon pooled URL in production) |
| `SESSION_SECRET` | 32+ random characters; signs the admin session cookie |
| `NEXT_PUBLIC_DONATE_URL` | Optional. Payment link (Paystack, Flutterwave, Stripe…). Until set, the Donate page shows "being set up" |

## Pages

| Route | What |
| --- | --- |
| `/` | Home: featured story, story groups, latest, testimonies, timeline, donate |
| `/stories` | Stories hub: four groups (Written, Spoken, Visual, From the archive) with their types; `?theme=` filters by theme |
| `/stories/written`, `/stories/essays`, `/stories/testimonies`… | A group or a single type |
| `/stories/<type>/<slug>` | A story, laid out to suit its type (poem, letter, transcript, film, gallery…) |
| `/archive`, `/archive/timeline` | Search and timeline |
| `/about`, `/donate`, `/submit` | What we are about; donations; submission guidelines (submissions by email to the address in `lib/site.ts`) |
| `/admin` | Editor: search/filter, create, edit, publish and delete posts; `/admin/subscribers` to search, export (CSV) and remove mailing-list sign-ups; change password at `/admin/account` |

## Comments

Readers can respond to any story without an account (text only; voice responses are emailed in and uploaded by editors). Every comment is held for approval at `/admin/comments`.

Spam defences (all server-side, see `lib/anti-spam.ts` and `postComment` in `app/actions.ts`): moderation queue; HMAC-signed form token tied to the story with a minimum 3 s and maximum 6 h age; honeypot field; per-visitor rate limit (3 per 10 min, 15 per day) keyed on a hashed IP (raw IPs are never stored); length limits, at most one link, duplicate detection; 

## Editing & uploads

The editor (`components/admin/post-editor.tsx`) adapts to each type using `lib/editor-config.ts`: labels, placeholders, which details are asked for, which media (audio, video or image gallery), whether media comes first, the writing style (prose, verse, letter paper, transcript with speaker buttons), starter templates and a live preview. Editors upload audio, video and images straight from the browser to Vercel Blob (`/api/admin/upload` issues short-lived, type- and size-limited tokens to signed-in editors only; `BLOB_READ_WRITE_TOKEN` is set by the connected Blob store).

## News

News posts (`/news`, `/news/<slug>`) share the posts table (`form = 'news'`, with a `category`) but are kept out of story listings, counts and search.

## Writing posts

Bodies use light plain-text markup: blank line = new paragraph, `## Heading`, `> pull quote`, `**bold**`, `*italic*`. Interviews and transcripts: start turns with `**Q:**` / `**A:**` or `**Narrator:**`. Poems and letters keep their line breaks. Photo essays take one `image URL | caption` per line.

## Before launch

- **Sample content:** the seeded stories are marked "Sample". Delete or replace them from `/admin`. Timeline entries (`lib/content.ts`) are real milestones but need an editorial fact-check.
- **Audio:** oral histories play their audio URL if one is set, otherwise playback is simulated.
- **Name:** change the site name in `lib/site.ts`.

## Database migrations

Fresh databases: run `db/schema.sql`. Existing databases: also run each file in `db/migrations/` in order (they're safe to re-run).

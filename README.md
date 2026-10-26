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
| `/` | Home: featured story, story forms, latest, testimonies, timeline, donate |
| `/stories`, `/stories?form=poem` | All stories, filterable by form |
| `/stories/[slug]` | A story, laid out to suit its form (poem, letter, transcript, photo essay…) |
| `/essays`, `/testimonies`, `/timeline`, `/archive`, `/donate` | Standalone nav pages |
| `/admin` | Editor: sign in, then create, edit, publish and delete posts; change password at `/admin/account` |

## Writing posts

Bodies use light plain-text markup: blank line = new paragraph, `## Heading`, `> pull quote`, `**bold**`, `*italic*`. Interviews and transcripts: start turns with `**Q:**` / `**A:**` or `**Narrator:**`. Poems and letters keep their line breaks. Photo essays take one `image URL | caption` per line.

## Before launch

- **Sample content:** the seeded stories are marked "Sample". Delete or replace them from `/admin`. Timeline entries (`lib/content.ts`) are real milestones but need an editorial fact-check.
- **Audio:** oral histories play their audio URL if one is set, otherwise playback is simulated.
- **Name:** change the site name in `lib/site.ts`.

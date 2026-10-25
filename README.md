# Kin Archive (working name)

An archive and journal of queer African history: essays, recorded testimonies, a timeline, and an archive browser. Built with Next.js 16 and Tailwind CSS v4 on the **Terracotta & Archival Joy** design system ([DESIGN.md](./DESIGN.md)).

## Run it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
```

## Where things live

| Path | What |
| --- | --- |
| `app/globals.css` | Design tokens (`@theme`): colours, fonts, radii, shadows, plus the type scale as utilities (`text-display-lg`, `text-label-md`, …) |
| `app/layout.tsx` | Fonts: Bebas Neue, Anybody, Archivo Narrow, Newsreader (italic, for quotes) |
| `lib/site.ts` | Site name, tagline and nav. Change the name here |
| `lib/content.ts` | Home page content |
| `components/` | Page sections, the docked oral-narrative player, and textile-pattern artwork |

## Before launch

- **Content is placeholder.** The essays, testimonies and quote are samples that show the layout. The timeline lists real milestones, but they still need an editorial fact-check.
- **Audio is simulated.** The player runs on a timer. See the note at the top of `components/player.tsx` for how to wire up real audio files.
- **Images:** the textile SVG patterns (`components/textile.tsx`) stand in for archive photography.
- Links point to anchors on the home page until the other pages exist.

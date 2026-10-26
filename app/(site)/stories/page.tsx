import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { StoryCard } from "@/components/story-card"
import { StoryGrid } from "@/components/story-grid"
import { StoryNav, ThemeChips } from "@/components/story-nav"
import { GROUPS, isThemeId, themeLabel, typesInGroup } from "@/lib/forms"
import { countByForm, countByTheme, listPublished } from "@/lib/posts"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Stories" }

export default async function StoriesPage({ searchParams }: { searchParams: Promise<{ theme?: string }> }) {
  const { theme: raw } = await searchParams
  const theme = isThemeId(raw) ? raw : undefined
  const [counts, themeCounts] = await Promise.all([countByForm(), countByTheme()])

  return (
    <>
      <PageHeader
        eyebrow="Stories"
        title={theme ? themeLabel(theme) : "Stories in every form"}
        intro={
          theme
            ? "Stories on this theme, across every form."
            : "Written, spoken, visual and archival: the many ways our histories are told. Browse by group, by type, or by theme."
        }
      >
        <div className="space-y-4">
          <StoryNav counts={counts} />
          <ThemeChips basePath="/stories" active={theme} counts={themeCounts} />
        </div>
      </PageHeader>

      {theme ? (
        <div className="shell pb-[clamp(3rem,6vw,5rem)]">
          <StoryGrid posts={await listPublished({ theme })} empty="No stories on this theme yet." />
        </div>
      ) : (
        <GroupSections counts={counts} />
      )}
    </>
  )
}

async function GroupSections({ counts }: { counts: Record<string, number> }) {
  const latest = await Promise.all(
    GROUPS.map((g) => listPublished({ forms: typesInGroup(g.id).map((t) => t.id), limit: 3 })),
  )
  return (
    <div className="shell space-y-[clamp(2.5rem,5vw,4rem)] pb-[clamp(3rem,6vw,5rem)]">
      {GROUPS.map((g, gi) => (
        <section key={g.id} aria-labelledby={`g-${g.id}`} className="border-t border-outline-variant/60 pt-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <p className="text-label-sm uppercase tabular-nums text-marigold">0{gi + 1}</p>
              <h2 id={`g-${g.id}`} className="mt-1 text-display-sm uppercase">
                <Link href={`/stories/${g.id}`} className="hover:text-primary">
                  {g.label}
                </Link>
              </h2>
              <p className="mt-2 max-w-[26rem] text-body-sm text-on-surface-variant">{g.blurb}</p>
              <ul className="mt-4 divide-y divide-outline-variant/50 border-y border-outline-variant/50">
                {typesInGroup(g.id).map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/stories/${t.section}`}
                      className="group flex items-center justify-between gap-3 py-2 text-body-sm transition-colors hover:text-primary"
                    >
                      <span className="flex items-center gap-2">
                        <span className="size-1.5 rotate-45 bg-terracotta transition-transform duration-300 group-hover:scale-150" aria-hidden />
                        {t.plural}
                      </span>
                      <span className="tabular-nums text-outline">{counts[t.id] ?? 0}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
            <div className="lg:col-span-8">
              {latest[gi].length ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))] gap-4">
                  {latest[gi].map((p, i) => (
                    <Reveal key={p.id} delay={i * 80}>
                      <StoryCard post={p} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <p className="rounded-md border border-dashed border-outline-variant p-8 text-center text-body-sm text-on-surface-variant">
                  Nothing published here yet.
                </p>
              )}
              <Link href={`/stories/${g.id}`} className="link-ghost mt-4 inline-block text-label-md uppercase text-on-surface-variant hover:text-on-surface">
                All {g.label.toLowerCase()} stories →
              </Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

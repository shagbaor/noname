import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { StoryGrid } from "@/components/story-grid"
import { StoryNav, ThemeChips } from "@/components/story-nav"
import { SubmitBand } from "@/components/submit-band"
import { TestimonyRow } from "@/components/testimony-row"
import { groupById, isThemeId, storyHref, typeBySection, typesInGroup, USES_AUDIO } from "@/lib/forms"
import { countByForm, countByTheme, getPublishedBySlug, listPublished } from "@/lib/posts"
import { toTrack } from "@/lib/track"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ section: string }>
  searchParams: Promise<{ theme?: string }>
}

/** Resolves /stories/<x> to a story group ("written") or a type ("essays"). */
function resolve(section: string) {
  const type = typeBySection(section)
  if (type) return { type, group: groupById(type.group)! }
  const group = groupById(section)
  if (group) return { type: undefined, group }
  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = resolve((await params).section)
  return r ? { title: r.type ? r.type.plural : `${r.group.label} stories` } : {}
}

export default async function SectionPage({ params, searchParams }: Props) {
  const { section } = await params
  const r = resolve(section)
  if (!r) {
    // Old /stories/<slug> links: send them to the story's new home
    const post = await getPublishedBySlug(section)
    if (post) permanentRedirect(storyHref(post))
    notFound()
  }

  const { theme: raw } = await searchParams
  const theme = isThemeId(raw) ? raw : undefined
  const forms = r.type ? [r.type.id] : typesInGroup(r.group.id).map((t) => t.id)
  const [posts, counts, themeCounts] = await Promise.all([
    listPublished({ forms, theme, limit: 100 }),
    countByForm(),
    countByTheme(),
  ])
  const asList = r.type && (USES_AUDIO as string[]).includes(r.type.id) && r.type.id !== "interview"

  return (
    <>
      <PageHeader
        eyebrow={r.type ? `Stories · ${r.group.label}` : "Stories"}
        title={r.type ? r.type.plural : r.group.label}
        intro={r.type ? r.type.blurb : r.group.blurb}
      >
        <div className="space-y-4">
          <StoryNav group={r.group.id} section={r.type?.section} counts={counts} />
          <ThemeChips basePath={`/stories/${section}`} active={theme} counts={themeCounts} />
        </div>
      </PageHeader>

      <div className="shell pb-[clamp(3rem,6vw,5rem)]">
        {asList ? (
          posts.length ? (
            <ul className="divide-y divide-outline-variant/60 border-y border-outline-variant/60">
              {posts.map((t, i) => (
                <Reveal as="li" key={t.id} delay={(i % 4) * 70}>
                  <TestimonyRow track={toTrack(t)} location={t.location} recorded={t.era} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="text-body-md text-on-surface-variant">Nothing published here yet.</p>
          )
        ) : (
          <StoryGrid posts={posts} empty="Nothing published here yet. New stories are added regularly." />
        )}
      </div>
      <SubmitBand type={r.type?.label} />
    </>
  )
}

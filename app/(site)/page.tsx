import Link from "next/link"
import { DonateBand } from "@/components/donate-band"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { Cover, StoryCard } from "@/components/story-card"
import { TestimonyRow } from "@/components/testimony-row"
import { TextileArt } from "@/components/textile"
import { Badge, formTone } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { timeline } from "@/lib/content"
import { FORM_IDS, formMeta, GROUPS, storyHref, typesInGroup, type Pattern } from "@/lib/forms"
import { countByForm, getFeatured, listPublished } from "@/lib/posts"
import { toTrack } from "@/lib/track"

export const dynamic = "force-dynamic"

const GROUP_PATTERNS: Pattern[] = ["mudcloth", "adire", "kente", "chevron"]

export default async function Home() {
  const [featured, counts, testimonies] = await Promise.all([
    getFeatured(),
    countByForm(),
    listPublished({ form: "oral-history", limit: 3 }),
  ])
  // Testimonies get their own section below, so leave them out of "Latest"
  const latest = await listPublished({
    forms: FORM_IDS.filter((f) => f !== "oral-history"),
    limit: 3,
    excludeId: featured?.id,
  })

  return (
    <>
      {/* Hero */}
      <section className="shell pt-[clamp(1.75rem,4.5vw,3.5rem)] pb-[clamp(2.5rem,6vw,4.5rem)]">
        <div className="grid items-end gap-[clamp(2rem,4vw,3rem)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="text-display-xl uppercase">
              {["Our histories", "were never", "silent."].map((line, i) => (
                <span key={line} className="animate-rise block" style={{ "--delay": `${i * 110}ms` } as React.CSSProperties}>
                  {i === 1 ? (
                    <>
                      were <span className="text-terracotta">never</span>
                    </>
                  ) : i === 2 ? (
                    <>
                      silent<span className="text-marigold">.</span>
                    </>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>
            <p
              className="animate-rise mt-6 max-w-[34rem] text-body-lg text-on-surface-variant"
              style={{ "--delay": "380ms" } as React.CSSProperties}
            >
              An archive and journal of queer African life, gathered with care and held in community.
              Memory as resistance. Memory as joy.
            </p>
            <div className="animate-rise mt-7 flex flex-wrap gap-3" style={{ "--delay": "480ms" } as React.CSSProperties}>
              <Button href="/stories">Read the stories</Button>
              <Button href="/about" variant="secondary-violet">
                What we&apos;re about
              </Button>
            </div>
          </div>

          {featured && (
            <div className="animate-rise lg:col-span-5" style={{ "--delay": "300ms" } as React.CSSProperties}>
              <Link
                href={storyHref(featured)}
                className="group block overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-low shadow-sheet transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[5/4] w-full overflow-hidden">
                  <Cover post={featured} className="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/85 to-transparent p-5 pt-20">
                    <Badge tone={formTone(featured.form)}>Featured · {formMeta(featured.form).label}</Badge>
                    <h2 className="mt-2 text-display-sm uppercase">{featured.title}</h2>
                    <p className="mt-1 line-clamp-2 text-body-sm text-on-surface-variant">{featured.excerpt}</p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Story groups */}
      <section className="shell section-y border-t border-outline-variant/60">
        <SectionHeading
          index="01"
          eyebrow="Stories"
          title="Every form a story takes"
          action={<Button href="/stories" variant="ghost">All stories →</Button>}
        />
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((g, i) => {
            const types = typesInGroup(g.id)
            const n = types.reduce((a, t) => a + (counts[t.id] ?? 0), 0)
            return (
              <Reveal as="li" key={g.id} delay={i * 70}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-md border border-outline-variant/60 bg-surface-container-low p-5 transition-[border-color,transform] duration-500 hover:-translate-y-0.5 hover:border-outline">
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-25">
                    <TextileArt pattern={GROUP_PATTERNS[i]} />
                  </div>
                  <div className="relative flex items-baseline justify-between gap-2">
                    <h3 className="text-headline-lg uppercase">
                      <Link href={`/stories/${g.id}`} className="hover:text-primary">
                        {g.label}
                      </Link>
                    </h3>
                    <span className="text-label-md tabular-nums text-outline">{n}</span>
                  </div>
                  <ul className="relative mt-3 flex flex-wrap gap-1.5">
                    {types.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/stories/${t.section}`}
                          className="block rounded-full border border-outline-variant px-2.5 py-1 text-label-sm uppercase text-on-surface-variant transition-colors hover:border-terracotta hover:text-on-surface"
                        >
                          {t.plural}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </section>

      {/* Latest */}
      {latest.length > 0 && (
        <section className="shell section-y pt-0!">
          <SectionHeading index="02" eyebrow="New in the archive" title="Latest stories" />
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,17rem),1fr))] gap-4">
            {latest.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <StoryCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Testimonies */}
      {testimonies.length > 0 && (
        <section className="bg-surface-container-lowest">
          <div className="shell section-y">
            <SectionHeading
              index="03"
              eyebrow="Spoken"
              title="Voices in the archive"
              action={<Button href="/stories/testimonies" variant="ghost">All testimonies →</Button>}
            />
            <ul className="mt-4 divide-y divide-outline-variant/60">
              {testimonies.map((t, i) => (
                <Reveal as="li" key={t.id} delay={i * 80}>
                  <TestimonyRow track={toTrack(t)} location={t.location} recorded={t.era} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Timeline teaser */}
      <section className="shell section-y">
        <SectionHeading
          index="04"
          eyebrow="Archive"
          title="Moments we carry"
          action={<Button href="/archive/timeline" variant="ghost">Full timeline →</Button>}
        />
        <ol className="mt-6 grid gap-x-8 md:grid-cols-3">
          {timeline.slice(-3).map((t, i) => (
            <Reveal as="li" key={t.year} delay={i * 90} className="relative border-t border-outline-variant/60 py-5 pl-5">
              <span className="absolute top-7 left-0 size-2 rotate-45 bg-marigold" aria-hidden />
              <p className="font-display text-[clamp(2.25rem,1.8rem+1.4vw,2.75rem)] leading-none tabular-nums text-terracotta">{t.year}</p>
              <h3 className="mt-2 text-title-lg">{t.title}</h3>
              <p className="mt-1.5 text-body-sm text-on-surface-variant">{t.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <DonateBand />
    </>
  )
}

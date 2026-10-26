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
import { FORMS, formMeta, type Pattern } from "@/lib/forms"
import { countByForm, getFeatured, listPublished } from "@/lib/posts"
import { toTrack } from "@/lib/track"

export const dynamic = "force-dynamic"

const FORM_PATTERNS: Pattern[] = ["mudcloth", "adire", "kente", "chevron"]

export default async function Home() {
  const [featured, counts, testimonies] = await Promise.all([
    getFeatured(),
    countByForm(),
    listPublished({ form: "oral-history", limit: 3 }),
  ])
  const latest = await listPublished({ limit: 3, excludeId: featured?.id })

  return (
    <>
      {/* Hero */}
      <section className="shell pt-[clamp(2rem,6vw,5rem)] pb-[clamp(3.5rem,8vw,7rem)]">
        <div className="grid items-end gap-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-12">
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
              className="animate-rise mt-8 max-w-[36rem] text-body-lg text-on-surface-variant"
              style={{ "--delay": "380ms" } as React.CSSProperties}
            >
              An archive and journal of queer African life, gathered with care and held in community.
              Memory as resistance. Memory as joy.
            </p>
            <div className="animate-rise mt-10 flex flex-wrap gap-4" style={{ "--delay": "480ms" } as React.CSSProperties}>
              <Button href="/stories">Read the stories</Button>
              <Button href="/testimonies" variant="secondary-violet">
                Listen to testimonies
              </Button>
            </div>
          </div>

          {featured && (
            <div className="animate-rise lg:col-span-5" style={{ "--delay": "300ms" } as React.CSSProperties}>
              <Link
                href={`/stories/${featured.slug}`}
                className="group block overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-low shadow-sheet transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] max-h-[34rem] w-full overflow-hidden">
                  <Cover post={featured} className="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/85 to-transparent p-6 pt-28">
                    <Badge tone={formTone(featured.form)}>Featured · {formMeta(featured.form).label}</Badge>
                    <h2 className="mt-3 text-display-sm uppercase">{featured.title}</h2>
                    <p className="mt-2 line-clamp-2 text-body-md text-on-surface-variant">{featured.excerpt}</p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stories in every form */}
      <section className="shell section-y border-t border-outline-variant/60">
        <SectionHeading
          index="01"
          eyebrow="Stories"
          title="Every form a story takes"
          action={<Button href="/stories" variant="ghost">All stories →</Button>}
        />
        <ul className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))] gap-4">
          {FORMS.map((f, i) => (
            <Reveal as="li" key={f.id} delay={i * 60}>
              <Link
                href={`/stories?form=${f.id}`}
                className="group relative flex h-full min-h-44 flex-col justify-end overflow-hidden rounded-md border border-outline-variant/60 bg-surface-container-low p-5 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-outline"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-35">
                  <TextileArt pattern={FORM_PATTERNS[i % FORM_PATTERNS.length]} />
                </div>
                <div className="relative">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-headline-lg uppercase">{f.plural}</h3>
                    <span className="text-label-lg tabular-nums text-outline">{counts[f.id] ?? 0}</span>
                  </div>
                  <p className="mt-1 text-body-sm text-on-surface-variant">{f.blurb}</p>
                  <span className="mt-4 block h-px w-8 bg-terracotta transition-[width] duration-500 group-hover:w-full" aria-hidden />
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Latest */}
      {latest.length > 0 && (
        <section className="shell section-y">
          <SectionHeading index="02" eyebrow="New in the archive" title="Latest stories" />
          <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-[clamp(1rem,2vw,2rem)]">
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
              eyebrow="Oral histories"
              title="Voices in the archive"
              action={<Button href="/testimonies" variant="ghost">All testimonies →</Button>}
            />
            <ul className="mt-6 divide-y divide-outline-variant/60">
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
          eyebrow="Timeline"
          title="Moments we carry"
          action={<Button href="/timeline" variant="ghost">Full timeline →</Button>}
        />
        <ol className="mt-10 grid gap-x-8 md:grid-cols-3">
          {timeline.slice(-3).map((t, i) => (
            <Reveal as="li" key={t.year} delay={i * 90} className="relative border-t border-outline-variant/60 py-6 pl-6">
              <span className="absolute top-8 left-0 size-2.5 rotate-45 bg-marigold" aria-hidden />
              <p className="font-display text-[clamp(2.75rem,2rem+2vw,3.5rem)] leading-none tabular-nums text-terracotta">{t.year}</p>
              <h3 className="mt-3 text-title-lg">{t.title}</h3>
              <p className="mt-2 text-body-md text-on-surface-variant">{t.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <DonateBand />
    </>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PlayButton, TrackWaveform } from "@/components/player"
import { Reveal } from "@/components/reveal"
import { Cover, StoryCard } from "@/components/story-card"
import { StoryBody } from "@/components/story-body"
import { Badge, formTone } from "@/components/ui/badge"
import { formatDate, formatTime } from "@/lib/format"
import { formMeta } from "@/lib/forms"
import { getPublishedBySlug, listPublished } from "@/lib/posts"
import { toTrack } from "@/lib/track"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedBySlug((await params).slug)
  return post ? { title: post.title, description: post.excerpt } : {}
}

export default async function StoryPage({ params }: Props) {
  const post = await getPublishedBySlug((await params).slug)
  if (!post) notFound()
  const meta = formMeta(post.form)
  const related = await listPublished({ form: post.form, excludeId: post.id, limit: 3 })
  const facts = [
    ["Region", post.region],
    ["Era", post.era],
    ["Place", post.location],
    ["Language", post.language],
  ].filter(([, v]) => v)

  return (
    <article>
      <header className="shell pt-[clamp(2rem,5vw,4rem)]">
        <Link href={`/stories?form=${post.form}`} className="animate-rise inline-block">
          <Badge tone={formTone(post.form)}>{meta.label}</Badge>
        </Link>
        <h1
          className="animate-rise mt-5 max-w-[22ch] text-[clamp(2.75rem,1.6rem+4.6vw,6rem)] leading-[0.98] font-display uppercase"
          style={{ "--delay": "80ms" } as React.CSSProperties}
        >
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="animate-rise mt-6 max-w-[42rem] text-body-lg text-on-surface-variant" style={{ "--delay": "160ms" } as React.CSSProperties}>
            {post.excerpt}
          </p>
        )}
        <p className="animate-rise mt-6 text-label-lg uppercase text-outline" style={{ "--delay": "220ms" } as React.CSSProperties}>
          {[post.author, formatDate(post.publishedAt)].filter(Boolean).join(" · ")}
        </p>
      </header>

      {post.form !== "poem" && post.form !== "letter" && (
        <div className="shell mt-[clamp(2rem,4vw,3rem)]">
          <div className="animate-rise aspect-[16/9] overflow-hidden rounded-lg md:aspect-[21/9]" style={{ "--delay": "260ms" } as React.CSSProperties}>
            <Cover post={post} />
          </div>
        </div>
      )}

      <div className="shell grid gap-[clamp(2rem,5vw,4rem)] py-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
        <div className="lg:col-span-8">
          {post.form === "oral-history" && (
            <Reveal className="mb-10 flex items-center gap-5 rounded-lg border border-outline-variant/60 bg-surface-container-low p-5">
              <PlayButton track={toTrack(post)} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-label-md uppercase text-on-surface-variant">
                  Listen · {formatTime(post.durationSec)}
                  {!post.audioUrl && " · recording coming soon"}
                </p>
                <TrackWaveform track={toTrack(post)} className="mt-2" />
              </div>
            </Reveal>
          )}

          {post.form === "photo-essay" && post.images.length > 0 && (
            <div className="mb-12 grid gap-6 sm:grid-cols-2">
              {post.images.map((img, i) => (
                <Reveal key={img.url + i} delay={(i % 2) * 90} className={i % 3 === 0 ? "sm:col-span-2" : ""}>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.caption} className="w-full rounded-md object-cover" loading="lazy" />
                    {img.caption && <figcaption className="mt-2 text-body-sm text-on-surface-variant">{img.caption}</figcaption>}
                  </figure>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal>
            <StoryBody body={post.body} form={post.form} />
          </Reveal>
        </div>

        {facts.length > 0 && (
          <aside className="lg:col-span-3 lg:col-start-10">
            <Reveal>
              <dl className="sticky top-28 divide-y divide-outline-variant/60 border-y border-outline-variant/60">
                {facts.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-3">
                    <dt className="text-label-md uppercase text-outline">{k}</dt>
                    <dd className="text-right text-body-sm">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section className="shell border-t border-outline-variant/60 pt-12 pb-[clamp(4rem,8vw,6rem)]">
          <h2 className="text-display-sm uppercase">More {meta.plural.toLowerCase()}</h2>
          <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-[clamp(1rem,2vw,2rem)]">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <StoryCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { PlayButton, TrackWaveform } from "@/components/player"
import { Reveal } from "@/components/reveal"
import { Cover, StoryCard } from "@/components/story-card"
import { StoryBody } from "@/components/story-body"
import { Badge, formTone } from "@/components/ui/badge"
import { formatDate, formatTime } from "@/lib/format"
import { formMeta, groupById, storyHref, themeLabel, USES_IMAGES } from "@/lib/forms"
import { getPublishedBySlug, listPublished } from "@/lib/posts"
import { toTrack } from "@/lib/track"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ section: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedBySlug((await params).slug)
  return post ? { title: post.title, description: post.excerpt } : {}
}

/** YouTube / Vimeo links become embeds; anything else plays as a video file. */
function videoEmbed(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\.|^m\./, "")
    if (host === "youtube.com" && u.searchParams.get("v")) return `https://www.youtube-nocookie.com/embed/${u.searchParams.get("v")}`
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed${u.pathname}`
    if (host === "vimeo.com" && /^\/\d+/.test(u.pathname)) return `https://player.vimeo.com/video${u.pathname}`
  } catch {}
  return null
}

export default async function StoryPage({ params }: Props) {
  const { section, slug } = await params
  const post = await getPublishedBySlug(slug)
  if (!post) notFound()
  const meta = formMeta(post.form)
  if (meta.section !== section) permanentRedirect(storyHref(post))
  const group = groupById(meta.group)!

  const related = await listPublished({ form: post.form, excludeId: post.id, limit: 3 })
  const facts = [
    ["Region", post.region],
    ["Era", post.era],
    ["Place", post.location],
    ["Language", post.language],
  ].filter(([, v]) => v)

  const hasPlayer = post.form === "oral-history" || post.form === "song" || (post.form === "interview" && post.audioUrl)
  const gallery = (USES_IMAGES as string[]).includes(post.form) && post.images.length > 0
  const embed = post.videoUrl ? videoEmbed(post.videoUrl) : null
  const textOnly = ["poem", "letter", "diary"].includes(post.form)
  const showCover = !textOnly && !post.videoUrl && !(gallery && !post.coverUrl)

  return (
    <article>
      <header className="shell pt-[clamp(1.5rem,4vw,3rem)]">
        <nav aria-label="Breadcrumb" className="animate-rise flex flex-wrap items-center gap-2 text-label-sm uppercase text-outline">
          <Link href="/stories" className="hover:text-on-surface">Stories</Link>
          <span aria-hidden>/</span>
          <Link href={`/stories/${group.id}`} className="hover:text-on-surface">{group.label}</Link>
          <span aria-hidden>/</span>
          <Link href={`/stories/${meta.section}`}>
            <Badge tone={formTone(post.form)}>{meta.label}</Badge>
          </Link>
        </nav>
        <h1
          className="animate-rise mt-4 max-w-[24ch] text-[clamp(2.25rem,1.5rem+3vw,4.25rem)] leading-[1] font-display uppercase"
          style={{ "--delay": "80ms" } as React.CSSProperties}
        >
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="animate-rise mt-4 max-w-[40rem] text-body-lg text-on-surface-variant" style={{ "--delay": "160ms" } as React.CSSProperties}>
            {post.excerpt}
          </p>
        )}
        <p className="animate-rise mt-4 text-label-md uppercase text-outline" style={{ "--delay": "220ms" } as React.CSSProperties}>
          {[post.author, formatDate(post.publishedAt)].filter(Boolean).join(" · ")}
        </p>
      </header>

      {post.videoUrl && (
        <div className="shell mt-[clamp(1.5rem,3vw,2.5rem)]">
          <div className="animate-rise aspect-video overflow-hidden rounded-lg bg-obsidian" style={{ "--delay": "260ms" } as React.CSSProperties}>
            {embed ? (
              <iframe
                src={embed}
                title={post.title}
                className="h-full w-full"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                loading="lazy"
              />
            ) : (
              <video src={post.videoUrl} controls preload="metadata" className="h-full w-full" />
            )}
          </div>
        </div>
      )}

      {showCover && (
        <div className="shell mt-[clamp(1.5rem,3vw,2.5rem)]">
          <div className="animate-rise aspect-[16/9] overflow-hidden rounded-lg md:aspect-[24/9]" style={{ "--delay": "260ms" } as React.CSSProperties}>
            <Cover post={post} />
          </div>
        </div>
      )}

      <div className="shell grid gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,5vw,3.5rem)] lg:grid-cols-12">
        <div className="lg:col-span-8">
          {hasPlayer && (
            <Reveal className="mb-8 flex items-center gap-4 rounded-md border border-outline-variant/60 bg-surface-container-low p-4">
              <PlayButton track={toTrack(post)} />
              <div className="min-w-0 flex-1">
                <p className="text-label-sm uppercase text-on-surface-variant">
                  Listen{post.durationSec ? ` · ${formatTime(post.durationSec)}` : ""}
                  {!post.audioUrl && " · recording coming soon"}
                </p>
                <TrackWaveform track={toTrack(post)} className="mt-1.5 h-8" />
              </div>
            </Reveal>
          )}

          {gallery && (
            <div className="mb-10 grid gap-4 sm:grid-cols-2">
              {post.images.map((img, i) => (
                <Reveal key={img.url + i} delay={(i % 2) * 80} className={i % 3 === 0 ? "sm:col-span-2" : ""}>
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

        <aside className="lg:col-span-3 lg:col-start-10">
          <Reveal className="sticky top-24 space-y-6">
            {facts.length > 0 && (
              <dl className="divide-y divide-outline-variant/60 border-y border-outline-variant/60">
                {facts.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-label-sm uppercase text-outline">{k}</dt>
                    <dd className="text-right text-body-sm">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {post.themes.length > 0 && (
              <div>
                <p className="text-label-sm uppercase text-outline">Themes</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {post.themes.map((t) => (
                    <li key={t}>
                      <Link href={`/stories?theme=${t}`} className="block rounded-full bg-violet/20 px-2.5 py-1 text-label-sm uppercase text-secondary transition-colors hover:bg-violet/35">
                        {themeLabel(t)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="shell border-t border-outline-variant/60 pt-10 pb-[clamp(3rem,6vw,5rem)]">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-display-sm uppercase">More {meta.plural.toLowerCase()}</h2>
            <Link href={`/stories/${meta.section}`} className="link-ghost text-label-md uppercase text-on-surface-variant hover:text-on-surface">
              View all →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,17rem),1fr))] gap-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <StoryCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

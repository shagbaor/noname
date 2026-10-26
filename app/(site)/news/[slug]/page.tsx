import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { NewsCard } from "@/components/news-card"
import { Reveal } from "@/components/reveal"
import { StoryBody } from "@/components/story-body"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import { storyHref } from "@/lib/forms"
import { getPublishedBySlug, listPublished } from "@/lib/posts"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedBySlug((await params).slug)
  return post ? { title: post.title, description: post.excerpt } : {}
}

export default async function NewsArticle({ params }: Props) {
  const post = await getPublishedBySlug((await params).slug)
  if (!post) notFound()
  if (post.form !== "news") permanentRedirect(storyHref(post))
  const more = (await listPublished({ form: "news", excludeId: post.id, limit: 3 }))

  return (
    <article>
      <header className="shell max-w-[52rem]! pt-[clamp(1.5rem,4vw,3rem)]">
        <nav aria-label="Breadcrumb" className="animate-rise flex flex-wrap items-center gap-2 text-label-sm uppercase text-outline">
          <Link href="/news" className="hover:text-on-surface">News</Link>
          {post.category && (
            <>
              <span aria-hidden>/</span>
              <Link href={`/news?category=${encodeURIComponent(post.category)}`}>
                <Badge tone="marigold">{post.category}</Badge>
              </Link>
            </>
          )}
        </nav>
        <h1 className="animate-rise mt-4 text-[clamp(2.25rem,1.6rem+2.6vw,3.75rem)] leading-[1.02] font-display uppercase" style={{ "--delay": "80ms" } as React.CSSProperties}>
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="animate-rise mt-4 text-body-lg text-on-surface-variant" style={{ "--delay": "160ms" } as React.CSSProperties}>
            {post.excerpt}
          </p>
        )}
        <p className="animate-rise mt-4 text-label-md uppercase text-outline" style={{ "--delay": "220ms" } as React.CSSProperties}>
          {[formatDate(post.publishedAt), post.author].filter(Boolean).join(" · ")}
        </p>
        {(post.era || post.location) && (
          <dl className="animate-rise mt-5 flex flex-wrap gap-x-8 gap-y-2 rounded-md border border-marigold/40 bg-marigold/10 px-5 py-3" style={{ "--delay": "260ms" } as React.CSSProperties}>
            {post.era && (
              <div>
                <dt className="text-label-sm uppercase text-marigold">When</dt>
                <dd className="text-title-md">{post.era}</dd>
              </div>
            )}
            {post.location && (
              <div>
                <dt className="text-label-sm uppercase text-marigold">Where</dt>
                <dd className="text-title-md">{post.location}</dd>
              </div>
            )}
          </dl>
        )}
      </header>

      {post.coverUrl && (
        <div className="shell max-w-[60rem]! mt-[clamp(1.5rem,3vw,2.5rem)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverUrl} alt="" className="animate-rise aspect-[16/9] w-full rounded-lg object-cover" />
        </div>
      )}

      <div className="shell max-w-[52rem]! py-[clamp(2rem,5vw,3.5rem)]">
        <Reveal>
          <StoryBody body={post.body} form="essay" />
        </Reveal>
      </div>

      {more.length > 0 && (
        <section className="shell border-t border-outline-variant/60 pt-10 pb-[clamp(3rem,6vw,5rem)]">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-display-sm uppercase">More news</h2>
            <Link href="/news" className="link-ghost text-label-md uppercase text-on-surface-variant hover:text-on-surface">All news →</Link>
          </div>
          <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,19rem),1fr))] gap-4">
            {more.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 80}>
                <NewsCard post={p} />
              </Reveal>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

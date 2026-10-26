import clsx from "clsx"
import type { Metadata } from "next"
import Link from "next/link"
import { NewsCard } from "@/components/news-card"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { NEWS_CATEGORIES } from "@/lib/forms"
import { listPublished } from "@/lib/posts"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "News", description: "Announcements, events, calls for submissions and press." }

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: raw } = await searchParams
  const category = (NEWS_CATEGORIES as readonly string[]).includes(raw ?? "") ? raw : undefined
  const all = await listPublished({ form: "news", limit: 100 })
  const posts = category ? all.filter((p) => p.category === category) : all
  const [lead, ...rest] = posts

  return (
    <>
      <PageHeader eyebrow="News" title="From the archive" intro="Announcements, events, calls for submissions and press.">
        <nav aria-label="News categories" className="flex flex-wrap gap-1.5">
          {[undefined, ...NEWS_CATEGORIES].map((c) => {
            const on = category === c
            return (
              <Link
                key={c ?? "all"}
                href={c ? `/news?category=${encodeURIComponent(c)}` : "/news"}
                scroll={false}
                aria-current={on ? "page" : undefined}
                className={clsx(
                  "rounded-full px-3.5 py-1.5 text-label-md uppercase transition-colors duration-300",
                  on ? "bg-terracotta text-on-primary-container" : "bg-surface-container-high text-on-surface-variant hover:text-on-surface",
                )}
              >
                {c ?? "All"}
              </Link>
            )
          })}
        </nav>
      </PageHeader>

      <div className="shell pb-[clamp(3rem,6vw,5rem)]">
        {!lead ? (
          <p className="rounded-md border border-dashed border-outline-variant p-10 text-center text-body-md text-on-surface-variant">
            No news here yet.
          </p>
        ) : (
          <>
            <Reveal>
              <NewsCard post={lead} size="lg" />
            </Reveal>
            {rest.length > 0 && (
              <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,19rem),1fr))] gap-4">
                {rest.map((p, i) => (
                  <Reveal as="li" key={p.id} delay={(i % 3) * 80}>
                    <NewsCard post={p} />
                  </Reveal>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  )
}

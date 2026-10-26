import clsx from "clsx"
import Link from "next/link"
import { formatDate } from "@/lib/format"
import type { Post } from "@/lib/posts"
import { TextileArt } from "./textile"
import { Badge } from "./ui/badge"

export function NewsCard({ post, size = "md" }: { post: Post; size?: "md" | "lg" }) {
  const lg = size === "lg"
  return (
    <article
      className={clsx(
        "group relative grid h-full overflow-hidden rounded-md border border-outline-variant/60 bg-surface-container-low transition-[border-color,transform] duration-500 hover:-translate-y-0.5 hover:border-outline",
        lg && "md:grid-cols-[1.1fr_1fr]",
      )}
    >
      <div className={clsx("overflow-hidden", lg ? "aspect-[16/10] md:aspect-auto md:min-h-72" : "aspect-[16/8]")}>
        {post.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverUrl} alt="" className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.05]" />
        ) : (
          <TextileArt pattern={post.pattern} className="transition-transform duration-[1.2s] group-hover:scale-[1.05]" />
        )}
      </div>
      <div className={clsx("flex flex-col gap-2.5", lg ? "p-[clamp(1.25rem,3vw,2rem)]" : "p-5")}>
        <div className="flex flex-wrap items-center gap-2">
          {post.category && <Badge tone="marigold">{post.category}</Badge>}
          <time className="text-label-sm uppercase text-outline tabular-nums">{formatDate(post.publishedAt)}</time>
        </div>
        <h3 className={clsx("uppercase", lg ? "text-display-sm" : "text-headline-md")}>
          <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className={clsx("text-on-surface-variant", lg ? "text-body-md" : "line-clamp-2 text-body-sm")}>{post.excerpt}</p>}
        {(post.era || post.location) && (
          <p className="mt-auto pt-2 text-label-sm uppercase text-marigold">
            {[post.era, post.location].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </article>
  )
}

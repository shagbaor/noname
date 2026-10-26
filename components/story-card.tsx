import clsx from "clsx"
import Link from "next/link"
import { formMeta } from "@/lib/forms"
import type { Post } from "@/lib/posts"
import { formatTime } from "@/lib/format"
import { TextileArt } from "./textile"
import { Badge, formTone } from "./ui/badge"

export function Cover({ post, className }: { post: Post; className?: string }) {
  return post.coverUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={post.coverUrl} alt="" className={clsx("h-full w-full object-cover", className)} />
  ) : (
    <TextileArt pattern={post.pattern} className={className} />
  )
}

export function StoryCard({ post, size = "md" }: { post: Post; size?: "md" | "lg" }) {
  const meta = formMeta(post.form)
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md border border-outline-variant/60 bg-surface-container-low shadow-card transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-outline hover:shadow-sheet">
      <div className={clsx("overflow-hidden", size === "lg" ? "aspect-[4/5] md:aspect-[16/10]" : "aspect-[16/10]")}>
        <Cover post={post} className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <Badge tone={formTone(post.form)} className="self-start">
          {meta.label}
        </Badge>
        <h3 className={clsx("uppercase", size === "lg" ? "text-display-sm" : "text-headline-lg")}>
          <Link href={`/stories/${post.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="line-clamp-3 text-body-md text-on-surface-variant">{post.excerpt}</p>}
        <p className="mt-auto flex items-center justify-between gap-4 border-t border-outline-variant/60 pt-4 text-label-md uppercase text-outline">
          <span className="truncate">{post.location || post.region || post.author}</span>
          <span className="shrink-0 tabular-nums">
            {post.form === "oral-history" && post.durationSec ? formatTime(post.durationSec) : post.era}
          </span>
        </p>
      </div>
    </article>
  )
}

import type { Post } from "@/lib/posts"
import { Reveal } from "./reveal"
import { StoryCard } from "./story-card"

export function StoryGrid({ posts, empty = "Nothing here yet. New stories are added regularly." }: { posts: Post[]; empty?: string }) {
  if (posts.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-outline-variant p-10 text-center text-body-md text-on-surface-variant">
        {empty}
      </p>
    )
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-[clamp(1rem,2vw,2rem)]">
      {posts.map((p, i) => (
        <Reveal key={p.id} delay={(i % 3) * 90}>
          <StoryCard post={p} />
        </Reveal>
      ))}
    </div>
  )
}

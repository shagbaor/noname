import { formToken } from "@/lib/anti-spam"
import { listApproved } from "@/lib/comments"
import { formatDate } from "@/lib/format"
import { CommentForm } from "./comment-form"
import { Reveal } from "./reveal"

export async function Comments({ postId }: { postId: number }) {
  const comments = await listApproved(postId)
  return (
    <section aria-labelledby="comments-title" className="shell pb-[clamp(2.5rem,5vw,4rem)]">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 id="comments-title" className="flex items-baseline gap-3 text-display-sm uppercase">
            Responses
            <span className="text-label-lg tabular-nums text-outline">{comments.length}</span>
          </h2>

          {comments.length > 0 ? (
            <ol className="mt-5 divide-y divide-outline-variant/60 border-y border-outline-variant/60">
              {comments.map((c, i) => (
                <Reveal as="li" key={c.id} delay={(i % 4) * 60} className="py-5">
                  <p className="flex flex-wrap items-baseline gap-x-3 text-label-md uppercase">
                    <span className="text-on-surface">{c.name || "Anonymous"}</span>
                    <span className="text-outline">{formatDate(c.createdAt)}</span>
                  </p>
                  {c.body && (
                    <p className="mt-2 text-body-md whitespace-pre-line text-on-surface-variant">{c.body}</p>
                  )}
                  {c.hasAudio && (
                    <audio
                      src={`/api/comments/${c.id}/audio`}
                      controls
                      preload="none"
                      className="mt-3 h-10 w-full max-w-md"
                      aria-label={`Voice note from ${c.name || "Anonymous"}`}
                    />
                  )}
                </Reveal>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-body-md text-on-surface-variant">Be the first to respond to this story.</p>
          )}

          <div className="mt-8">
            <h3 className="mb-3 text-headline-md uppercase">Leave a response</h3>
            {/* Fresh token on every render: signed, tied to this story, and time-checked on submit */}
            <CommentForm postId={postId} token={formToken(postId)} />
          </div>
        </div>
      </div>
    </section>
  )
}

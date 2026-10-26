import clsx from "clsx"
import Link from "next/link"
import { inputClass } from "@/components/admin/field"
import { formatBytes, formatDate } from "@/lib/format"
import { storyHref } from "@/lib/forms"
import { countPending, listForAdmin } from "@/lib/comments"
import { moderateComment } from "../../actions"
import { ModerateButton } from "@/components/admin/moderate-button"

export default async function CommentsAdmin({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const sp = await searchParams
  const status = sp.status === "approved" ? "approved" : sp.status === "all" ? "" : "pending"
  const q = (sp.q ?? "").trim().slice(0, 100)
  const [comments, pending] = await Promise.all([listForAdmin({ status: status || undefined, q: q || undefined }), countPending()])
  const tab = (s: string, label: string) => {
    const on = (status || "all") === s
    const qs = new URLSearchParams({ status: s, ...(q ? { q } : {}) })
    return (
      <Link
        href={`/admin/comments?${qs}`}
        aria-current={on ? "page" : undefined}
        className={clsx(
          "rounded-full px-4 py-1.5 text-label-md uppercase",
          on ? "bg-terracotta text-on-primary-container" : "text-on-surface-variant hover:text-on-surface",
        )}
      >
        {label}
      </Link>
    )
  }

  return (
    <>
      <h1 className="text-display-lg uppercase">Comments</h1>
      <p className="text-body-sm text-on-surface-variant">
        {pending} awaiting review. Nothing appears on the site until you approve it.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <nav className="inline-flex rounded-full bg-surface-container-high p-1">
          {tab("pending", `Pending${pending ? ` (${pending})` : ""}`)}
          {tab("approved", "Approved")}
          {tab("all", "All")}
        </nav>
        <form role="search" action="/admin/comments" className="flex min-w-[16rem] flex-1 gap-2">
          <input type="hidden" name="status" value={status || "all"} />
          <input name="q" type="search" defaultValue={q} placeholder="Search comments, names or story titles…" className={inputClass} />
          <button type="submit" className="rounded-full bg-terracotta px-5 text-label-md uppercase text-on-primary-container hover:bg-sienna">
            Search
          </button>
        </form>
      </div>

      {comments.length === 0 ? (
        <p className="mt-6 rounded-md border border-dashed border-outline-variant p-10 text-center text-on-surface-variant">
          {q ? "No comments match." : status === "pending" ? "All caught up. No comments waiting." : "No comments here yet."}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-md border border-outline-variant/60 bg-surface-container-low p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-label-md uppercase">
                  <span className="text-on-surface">{c.name || "Anonymous"}</span>
                  <span className="text-outline"> · {formatDate(c.createdAt)} · on </span>
                  <Link href={storyHref({ form: c.postForm, slug: c.postSlug })} className="text-primary hover:underline">
                    {c.postTitle}
                  </Link>
                </p>
                <span
                  className={clsx(
                    "rounded-full px-2.5 py-0.5 text-label-sm uppercase",
                    c.status === "approved" ? "bg-acacia/20 text-tertiary" : "bg-marigold/15 text-marigold",
                  )}
                >
                  {c.status}
                </span>
              </div>
              {c.body && <p className="mt-2 text-body-md whitespace-pre-line text-on-surface-variant">{c.body}</p>}
              {c.hasAudio && (
                <div className="mt-3 flex items-center gap-3">
                  <audio src={`/api/comments/${c.id}/audio`} controls preload="none" className="h-10 w-full max-w-md" />
                  <span className="text-label-sm text-outline tabular-nums">{formatBytes(c.audioBytes)}</span>
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {c.status === "pending" ? (
                  <ModerateButton action={moderateComment} id={c.id} op="approve" label="Approve" tone="primary" />
                ) : (
                  <ModerateButton action={moderateComment} id={c.id} op="unapprove" label="Unpublish" />
                )}
                <ModerateButton action={moderateComment} id={c.id} op="delete" label="Delete" tone="danger" confirm="Delete this comment?" />
                {c.status === "pending" && (
                  <ModerateButton
                    action={moderateComment}
                    id={c.id}
                    op="delete-source"
                    label="Delete all pending from this sender"
                    tone="danger"
                    confirm="Delete every pending comment from the same sender? Use this for spam."
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

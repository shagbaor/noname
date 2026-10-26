"use client"

import clsx from "clsx"
import { startTransition, useActionState, useState } from "react"
import { postComment } from "@/app/actions"

export function CommentForm({ postId, token, voiceMailto, email }: { postId: number; token: string; voiceMailto: string; email: string }) {
  const [state, action, pending] = useActionState(postComment, undefined)
  const [body, setBody] = useState("")

  if (state?.ok) {
    return (
      <div role="status" className="animate-rise rounded-md border border-tertiary/40 bg-tertiary-container/20 p-5">
        <p className="text-title-md text-on-tertiary-container">{state.ok}</p>
        <p className="mt-1 text-body-sm text-on-surface-variant">Every comment is read by a person before it is published.</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => action(data))
      }}
      className="space-y-4 rounded-md border border-outline-variant/60 bg-surface-container-low p-[clamp(1rem,3vw,1.5rem)]"
    >
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="token" value={token} />
      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-label-md uppercase text-on-surface-variant">
          Name <span className="normal-case text-outline">(optional; leave blank to post as Anonymous)</span>
        </span>
        <input
          name="name"
          maxLength={60}
          autoComplete="off"
          className="w-full rounded-sm border border-outline-variant bg-surface-container px-4 py-2.5 text-body-md focus:border-terracotta focus:ring-4 focus:ring-terracotta/25 focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-label-md uppercase text-on-surface-variant">Your comment</span>
        <textarea
          name="body"
          rows={4}
          maxLength={2000}
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share a memory, a thank you, or what this story means to you…"
          className="w-full rounded-sm border border-outline-variant bg-surface-container px-4 py-3 text-body-md placeholder:text-outline focus:border-terracotta focus:ring-4 focus:ring-terracotta/25 focus:outline-none"
        />
        <span className="mt-1 block text-right text-label-sm tabular-nums text-outline">{body.length}/2000</span>
      </label>

      <p className="flex gap-3 rounded-sm border border-dashed border-outline-variant px-4 py-3 text-body-sm text-on-surface-variant">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-primary" aria-hidden>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
        </svg>
        <span>
          Want to respond with your voice? Email a recording to{" "}
          <a href={voiceMailto} className="font-semibold text-on-surface underline decoration-terracotta underline-offset-4 hover:text-primary">
            {email}
          </a>{" "}
          and our editors will add it to the archive with your permission.
        </span>
      </p>

      {state?.error && (
        <p role="alert" className="rounded-sm bg-error-container/40 px-4 py-2.5 text-body-sm text-on-error-container">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[30rem] text-body-sm text-outline">
          Comments are reviewed before they appear. Please don&apos;t share details that could identify you or others.
        </p>
        <button
          type="submit"
          disabled={pending}
          className={clsx(
            "rounded-full bg-terracotta px-6 py-2.5 text-label-lg uppercase text-on-primary-container transition-[background-color,transform] hover:bg-sienna active:scale-[0.98]",
            pending && "opacity-60",
          )}
        >
          {pending ? "Sending…" : "Post comment"}
        </button>
      </div>
    </form>
  )
}

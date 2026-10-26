"use client"

import { startTransition, useActionState, useState } from "react"
import { savePost } from "@/app/admin/actions"
import { ButtonEl } from "@/components/ui/button"
import { formatTime } from "@/lib/format"
import { FORMS, PATTERNS, REGIONS, type FormId } from "@/lib/forms"
import type { Post } from "@/lib/posts"
import { Field, inputClass } from "./field"

const BODY_HINTS: Partial<Record<FormId, string>> = {
  poem: "Each line on its own line; blank line between stanzas.",
  letter: "Line breaks are kept, so write it as the letter reads.",
  interview: "Start each turn with **Q:** and **A:** (or speaker names), separated by blank lines.",
  "oral-history": "Paste the transcript. Start turns with **Narrator:** / **Interviewer:**.",
}

export function PostEditor({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(savePost, undefined)
  const [form, setForm] = useState<FormId>(post?.form ?? "essay")

  return (
    <form
      action={action}
      // Submit manually so React doesn't reset the fields when validation fails
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => action(data))
      }}
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"
    >
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="space-y-6">
        <Field label="Title">
          <input name="title" required defaultValue={post?.title} className={`${inputClass} text-title-lg`} />
        </Field>
        <Field label="Excerpt" hint="One or two sentences shown on cards and at the top of the story.">
          <textarea name="excerpt" rows={2} defaultValue={post?.excerpt} className={inputClass} />
        </Field>
        <Field
          label={form === "oral-history" ? "Transcript" : "Body"}
          hint={`${BODY_HINTS[form] ?? "Blank line = new paragraph."} Use ## for headings, > for a pull quote, **bold**, *italic*.`}
        >
          <textarea
            name="body"
            rows={18}
            defaultValue={post?.body}
            className={`${inputClass} font-mono text-[14px] leading-relaxed`}
          />
        </Field>

        {form === "oral-history" && (
          <fieldset className="grid gap-5 rounded-md border border-outline-variant/60 p-5 sm:grid-cols-2">
            <legend className="px-2 text-label-md uppercase text-tertiary">Recording</legend>
            <Field label="Audio URL" hint="Link to an .mp3/.m4a file. Leave empty if not ready." className="sm:col-span-2">
              <input name="audioUrl" type="url" defaultValue={post?.audioUrl} placeholder="https://…" className={inputClass} />
            </Field>
            <Field label="Duration" hint="mm:ss">
              <input
                name="duration"
                defaultValue={post?.durationSec ? formatTime(post.durationSec) : ""}
                placeholder="28:44"
                className={inputClass}
              />
            </Field>
            <label className="flex items-center gap-3 self-end pb-3">
              <input type="checkbox" name="transcribed" defaultChecked={post?.transcribed} className="size-5 accent-terracotta" />
              <span className="text-body-sm">Transcript available</span>
            </label>
          </fieldset>
        )}

        {form === "photo-essay" && (
          <Field label="Photographs" hint="One per line: image URL | caption">
            <textarea
              name="images"
              rows={6}
              defaultValue={post?.images.map((i) => `${i.url}${i.caption ? ` | ${i.caption}` : ""}`).join("\n")}
              placeholder="https://…/photo1.jpg | Lagos, 1998"
              className={`${inputClass} font-mono text-[14px]`}
            />
          </Field>
        )}
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-5 rounded-md border border-outline-variant/60 bg-surface-container-low p-5">
          <Field label="Status">
            <select name="status" defaultValue={post?.status ?? "draft"} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="Form">
            <select name="form" value={form} onChange={(e) => setForm(e.target.value as FormId)} className={inputClass}>
              {FORMS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="featured" defaultChecked={post?.featured} className="size-5 accent-terracotta" />
            <span className="text-body-sm">Feature on the home page</span>
          </label>
          {state?.error && (
            <p role="alert" className="rounded-sm bg-error-container/40 px-3 py-2 text-body-sm text-on-error-container">
              {state.error}
            </p>
          )}
          <ButtonEl type="submit" disabled={pending} className="w-full">
            {pending ? "Saving…" : post ? "Save changes" : "Create post"}
          </ButtonEl>
        </div>

        <div className="space-y-5 rounded-md border border-outline-variant/60 bg-surface-container-low p-5">
          <Field label={form === "oral-history" ? "Narrator" : "Author"}>
            <input name="author" defaultValue={post?.author} className={inputClass} />
          </Field>
          <Field label="Region">
            <select name="region" defaultValue={post?.region ?? ""} className={inputClass}>
              <option value="">—</option>
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field label="Place">
            <input name="location" defaultValue={post?.location} placeholder="Accra, Ghana" className={inputClass} />
          </Field>
          <Field label="Era">
            <input name="era" defaultValue={post?.era} placeholder="1990s" className={inputClass} />
          </Field>
          <Field label="Language">
            <input name="language" defaultValue={post?.language} className={inputClass} />
          </Field>
          <Field label="Cover image URL" hint="Optional. Without one, a textile pattern is used.">
            <input name="coverUrl" type="url" defaultValue={post?.coverUrl} placeholder="https://…" className={inputClass} />
          </Field>
          <Field label="Pattern">
            <select name="pattern" defaultValue={post?.pattern ?? "mudcloth"} className={inputClass}>
              {PATTERNS.map((p) => (
                <option key={p} value={p}>
                  {p[0].toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="URL slug" hint="Leave blank to generate from the title.">
            <input name="slug" defaultValue={post?.slug} className={`${inputClass} font-mono text-[14px]`} />
          </Field>
        </div>
      </aside>
    </form>
  )
}

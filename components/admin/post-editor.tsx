"use client"

import clsx from "clsx"
import { startTransition, useActionState, useRef, useState } from "react"
import { savePost } from "@/app/admin/actions"
import { StoryBody } from "@/components/story-body"
import { Badge, formTone } from "@/components/ui/badge"
import { ButtonEl } from "@/components/ui/button"
import { EDITOR, type EditorConfig } from "@/lib/editor-config"
import { formMeta, GROUPS, NEWS, REGIONS, THEMES, typesInGroup, type FormId } from "@/lib/forms"
import type { Post } from "@/lib/posts"
import { Field, inputClass } from "./field"
import { AudioField, CoverField, ImagesField, VideoField } from "./media"

// Small glyphs so each type reads at a glance in the picker
const GLYPH: Record<string, string> = {
  essay: "¶", memoir: "✎", letter: "✉", diary: "❡", poem: "❦", fiction: "✧",
  "oral-history": "◉", interview: "⇄", song: "♪", "photo-essay": "▣", artwork: "◈", film: "▶",
  document: "⎙", tribute: "✦", news: "◆",
}

export function PostEditor({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(savePost, undefined)
  const [form, setForm] = useState<FormId | null>(post?.form ?? null)
  const [picking, setPicking] = useState(!post)

  const picker = (
    <TypePicker
      current={form}
      onPick={(f) => {
        setForm(f)
        setPicking(false)
        window.scrollTo({ top: 0 })
      }}
      onCancel={form ? () => setPicking(false) : undefined}
    />
  )
  if (!form) return picker

  const cfg = EDITOR[form]
  const meta = formMeta(form)

  return (
    <>
    {/* The form stays mounted (just hidden) while picking, so nothing typed is lost */}
    {picking && picker}
    <form
      hidden={picking}
      // Submit manually so React doesn't reset the fields when validation fails
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => action(data))
      }}
      className="space-y-6"
    >
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="form" value={form} />

      {/* Type banner */}
      <div className="flex flex-wrap items-start gap-4 rounded-md border border-outline-variant/60 bg-surface-container-low p-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-container-high text-[22px] text-primary" aria-hidden>
          {GLYPH[form]}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={formTone(form)}>{meta.label}</Badge>
            <span className="text-label-sm uppercase text-outline">
              {form === "news" ? "News" : GROUPS.find((g) => g.id === meta.group)?.label}
            </span>
          </div>
          <p className="mt-1.5 text-body-sm text-on-surface-variant">{cfg.tip}</p>
        </div>
        <button type="button" onClick={() => setPicking(true)} className="rounded-full border border-outline-variant px-4 py-2 text-label-md uppercase hover:border-outline">
          Change type
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <Field label={cfg.title.label}>
            <input
              name="title"
              required
              defaultValue={post?.title}
              placeholder={cfg.title.placeholder}
              className={`${inputClass} font-display text-[1.75rem] leading-tight uppercase placeholder:normal-case placeholder:font-sans placeholder:text-body-md`}
            />
          </Field>
          <Field label={cfg.excerpt.label}>
            <textarea name="excerpt" rows={2} defaultValue={post?.excerpt} placeholder={cfg.excerpt.placeholder} className={inputClass} />
          </Field>

          {cfg.mediaFirst && <Media cfg={cfg} post={post} />}
          <BodyEditor cfg={cfg} form={form} defaultValue={post?.body ?? ""} />
          {!cfg.mediaFirst && <Media cfg={cfg} post={post} />}
          {/* Keep media values from other types if this one doesn't use them */}
          <HiddenMedia cfg={cfg} post={post} />

          <fieldset>
            <legend className="mb-2 block text-label-md uppercase text-on-surface-variant">Themes</legend>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <label key={t.id} className="cursor-pointer">
                  <input type="checkbox" name="themes" value={t.id} defaultChecked={post?.themes.includes(t.id)} className="peer sr-only" />
                  <span className="block rounded-full border border-outline-variant px-3 py-1.5 text-label-md uppercase text-on-surface-variant transition-colors peer-checked:border-violet peer-checked:bg-violet/25 peer-checked:text-secondary peer-focus-visible:outline-2 peer-focus-visible:outline-secondary">
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <PublishBox post={post} pending={pending} error={state?.error} isNews={form === "news"} />

          <div className="space-y-4 rounded-md border border-outline-variant/60 bg-surface-container-low p-5">
            <p className="text-label-md uppercase text-primary">Details</p>
            {cfg.category && (
              <Field label="Category">
                <select name="category" defaultValue={post?.category || cfg.category[0]} className={inputClass}>
                  {cfg.category.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            )}
            <Detail name="author" cfg={cfg.author} value={post?.author} />
            <Detail name="era" cfg={cfg.era} value={post?.era} />
            <Detail name="location" cfg={cfg.location} value={post?.location} />
            <Detail name="language" cfg={cfg.language} value={post?.language} />
            {cfg.region ? (
              <Field label="Region">
                <select name="region" defaultValue={post?.region ?? ""} className={inputClass}>
                  <option value="">—</option>
                  {REGIONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
            ) : (
              <input type="hidden" name="region" value={post?.region ?? ""} />
            )}
          </div>

          <div className="rounded-md border border-outline-variant/60 bg-surface-container-low p-5">
            <CoverField label={cfg.cover.label} hint={cfg.cover.hint ?? ""} defaultUrl={post?.coverUrl ?? ""} defaultPattern={post?.pattern ?? "mudcloth"} />
          </div>

          <details className="rounded-md border border-outline-variant/60 bg-surface-container-low p-5">
            <summary className="cursor-pointer text-label-md uppercase text-on-surface-variant">Advanced</summary>
            <div className="mt-4">
              <Field label="URL slug" hint="Leave blank to generate from the title.">
                <input name="slug" defaultValue={post?.slug} className={`${inputClass} font-mono text-[14px]`} />
              </Field>
            </div>
          </details>
        </aside>
      </div>
    </form>
    </>
  )
}

/** A detail field the type asks for, or a hidden input that preserves its value if it doesn't. */
function Detail({ name, cfg, value }: { name: string; cfg: EditorConfig["era"]; value?: string }) {
  if (!cfg) return <input type="hidden" name={name} value={value ?? ""} />
  return (
    <Field label={cfg.label} hint={cfg.hint}>
      <input name={name} defaultValue={value} placeholder={cfg.placeholder} className={inputClass} />
    </Field>
  )
}

function Media({ cfg, post }: { cfg: EditorConfig; post?: Post }) {
  const m = cfg.media
  if (!m) return null
  if (m.kind === "audio")
    return (
      <AudioField
        label={m.label}
        hint={m.hint ?? ""}
        accept={m.accept}
        defaultUrl={post?.audioUrl ?? ""}
        defaultDuration={post?.durationSec ?? 0}
        transcribed={cfg.transcribed}
        defaultTranscribed={post?.transcribed ?? false}
      />
    )
  if (m.kind === "video") return <VideoField label={m.label} hint={m.hint ?? ""} accept={m.accept} defaultUrl={post?.videoUrl ?? ""} />
  return <ImagesField label={m.label} hint={m.hint ?? ""} defaultImages={post?.images ?? []} />
}

function HiddenMedia({ cfg, post }: { cfg: EditorConfig; post?: Post }) {
  const kind = cfg.media?.kind
  return (
    <>
      {kind !== "audio" && (
        <>
          <input type="hidden" name="audioUrl" value={post?.audioUrl ?? ""} />
          <input type="hidden" name="duration" value={post?.durationSec ? String(post.durationSec) : ""} />
          <input type="hidden" name="transcribed" value={post?.transcribed ? "on" : ""} />
        </>
      )}
      {kind !== "video" && <input type="hidden" name="videoUrl" value={post?.videoUrl ?? ""} />}
      {kind !== "images" && (
        <input type="hidden" name="images" value={(post?.images ?? []).map((i) => `${i.url}${i.caption ? ` | ${i.caption}` : ""}`).join("\n")} />
      )}
    </>
  )
}

function PublishBox({ post, pending, error, isNews }: { post?: Post; pending: boolean; error?: string; isNews: boolean }) {
  const [status, setStatus] = useState(post?.status ?? "draft")
  return (
    <div className="space-y-4 rounded-md border border-outline-variant/60 bg-surface-container-low p-5">
      <input type="hidden" name="status" value={status} />
      <div className="relative grid grid-cols-2 rounded-full bg-surface-container-high p-1" role="radiogroup" aria-label="Status">
        <span
          className={clsx(
            "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full transition-[transform,background-color] duration-300",
            status === "published" ? "translate-x-full bg-acacia" : "bg-surface-bright",
          )}
          aria-hidden
        />
        {(["draft", "published"] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={status === s}
            onClick={() => setStatus(s)}
            className={clsx("relative z-10 rounded-full py-2 text-label-md uppercase", status === s ? "text-on-surface" : "text-on-surface-variant")}
          >
            {s === "draft" ? "Draft" : "Published"}
          </button>
        ))}
      </div>
      {!isNews ? (
        <label className="flex items-center gap-3">
          <input type="checkbox" name="featured" defaultChecked={post?.featured} className="size-5 accent-terracotta" />
          <span className="text-body-sm">Feature on the home page</span>
        </label>
      ) : (
        <input type="hidden" name="featured" value="" />
      )}
      {error && (
        <p role="alert" className="rounded-sm bg-error-container/40 px-3 py-2 text-body-sm text-on-error-container">
          {error}
        </p>
      )}
      <ButtonEl type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : status === "published" ? (post?.status === "published" ? "Update" : "Publish") : "Save draft"}
      </ButtonEl>
    </div>
  )
}

// ---- Writing area ----

const BODY_STYLES = {
  prose: "font-sans text-[16px] leading-[1.75]",
  verse: "font-serif text-[19px] leading-[1.9] italic",
  letter: "font-serif text-[17px] leading-[1.85] bg-[#1d1a17] bg-[repeating-linear-gradient(transparent,transparent_31px,rgba(225,191,181,0.08)_32px)]",
  transcript: "font-mono text-[14px] leading-[1.8]",
}

function BodyEditor({ cfg, form, defaultValue }: { cfg: EditorConfig; form: FormId; defaultValue: string }) {
  const [body, setBody] = useState(defaultValue)
  const [tab, setTab] = useState<"write" | "preview">("write")
  const ref = useRef<HTMLTextAreaElement>(null)
  const b = cfg.body

  /** Insert text at the cursor (or wrap the selection) and keep focus. */
  const insert = (before: string, after = "", block = false) => {
    const el = ref.current
    if (!el) return
    const { selectionStart: s, selectionEnd: e, value } = el
    const pre = block && s > 0 && value[s - 1] !== "\n" ? "\n\n" : ""
    const next = value.slice(0, s) + pre + before + value.slice(s, e) + after + value.slice(e)
    setBody(next)
    requestAnimationFrame(() => {
      el.focus()
      const pos = s + pre.length + before.length + (e - s)
      el.setSelectionRange(pos, pos)
    })
  }

  const words = body.trim() ? body.trim().split(/\s+/).length : 0
  const lines = body ? body.split("\n").filter((l) => l.trim()).length : 0

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <span className="text-label-md uppercase text-on-surface-variant">{b.label}</span>
        <div className="inline-flex rounded-full bg-surface-container-high p-0.5" role="tablist">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={clsx("rounded-full px-3 py-1 text-label-sm uppercase", tab === t ? "bg-terracotta text-on-primary-container" : "text-on-surface-variant")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <input type="hidden" name="body" value={body} />
      {tab === "write" ? (
        <div className="overflow-hidden rounded-sm border border-outline-variant focus-within:border-terracotta focus-within:ring-4 focus-within:ring-terracotta/25">
          <div className="flex flex-wrap items-center gap-1 border-b border-outline-variant/60 bg-surface-container px-2 py-1.5">
            {b.turns &&
              b.turns.map((who) => (
                <Tool key={who} onClick={() => insert(`**${who}:** `, "", true)} label={`+ ${who}`} accent />
              ))}
            {b.style !== "verse" && <Tool onClick={() => insert("## ", "", true)} label="Heading" />}
            <Tool onClick={() => insert("> ", "", true)} label="Quote" />
            <Tool onClick={() => insert("**", "**")} label="B" bold />
            <Tool onClick={() => insert("*", "*")} label="I" italic />
            {b.template && !body.trim() && <Tool onClick={() => setBody(b.template!)} label="Use template" accent />}
            <span className="ml-auto pr-1 text-label-sm tabular-nums text-outline">
              {b.style === "verse" ? `${lines} lines` : `${words} words`}
            </span>
          </div>
          <textarea
            ref={ref}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={b.rows}
            placeholder={b.placeholder}
            className={clsx("block w-full resize-y px-5 py-4 text-on-surface placeholder:text-outline focus:outline-none", BODY_STYLES[b.style], b.style !== "letter" && "bg-surface-container")}
          />
        </div>
      ) : (
        <div className="min-h-48 rounded-sm border border-outline-variant bg-surface p-6">
          {body.trim() ? <StoryBody body={body} form={form} /> : <p className="text-body-sm text-outline">Nothing to preview yet.</p>}
        </div>
      )}
      {b.hint && <p className="mt-1.5 text-body-sm text-outline">{b.hint}</p>}
    </div>
  )
}

function Tool({ onClick, label, bold, italic, accent }: { onClick: () => void; label: string; bold?: boolean; italic?: boolean; accent?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-sm px-2.5 py-1 text-label-sm uppercase transition-colors",
        accent ? "bg-terracotta/20 text-primary hover:bg-terracotta/30" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
        bold && "font-bold normal-case",
        italic && "italic normal-case",
      )}
    >
      {label}
    </button>
  )
}

// ---- Type picker ----

function TypePicker({ current, onPick, onCancel }: { current: FormId | null; onPick: (f: FormId) => void; onCancel?: () => void }) {
  const sections = [
    ...GROUPS.map((g) => ({ id: g.id, label: g.label, blurb: g.blurb, types: typesInGroup(g.id) as { id: FormId; label: string; blurb: string }[] })),
    { id: "news", label: "Updates", blurb: "For the community, outside the archive.", types: [NEWS] as { id: FormId; label: string; blurb: string }[] },
  ]
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-display-sm uppercase">What are you adding?</h2>
          <p className="text-body-sm text-on-surface-variant">The editor adapts to each type, with the right fields, media and layout.</p>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-full border border-outline-variant px-4 py-2 text-label-md uppercase hover:border-outline">
            Keep current type
          </button>
        )}
      </div>
      {sections.map((s) => (
        <section key={s.id}>
          <h3 className="text-headline-md uppercase">{s.label}</h3>
          <p className="mb-3 text-body-sm text-outline">{s.blurb}</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-3">
            {s.types.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onPick(t.id)}
                className={clsx(
                  "group flex items-start gap-3 rounded-md border bg-surface-container-low p-4 text-left transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-terracotta",
                  current === t.id ? "border-marigold" : "border-outline-variant/60",
                )}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-container-high text-[18px] text-primary transition-colors group-hover:bg-terracotta group-hover:text-on-primary-container" aria-hidden>
                  {GLYPH[t.id]}
                </span>
                <span>
                  <span className="block text-title-md">{t.label}</span>
                  <span className="block text-body-sm text-on-surface-variant">{t.blurb}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

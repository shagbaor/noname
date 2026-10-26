"use client"

import { upload } from "@vercel/blob/client"
import clsx from "clsx"
import { useRef, useState } from "react"
import { TextileArt } from "@/components/textile"
import { formatBytes, formatTime } from "@/lib/format"
import { PATTERNS, type Pattern } from "@/lib/forms"
import { videoEmbed } from "@/lib/video"
import { inputClass } from "./field"

type Kind = "audio" | "video" | "image"

/** Uploads straight from the browser to Vercel Blob, with progress. */
function useUpload(kind: Kind) {
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState("")
  async function send(file: File): Promise<string | null> {
    setError("")
    setProgress(0)
    try {
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-80)
      const blob = await upload(`${kind}/${safe}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        clientPayload: kind,
        multipart: file.size > 8 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      })
      return blob.url
    } catch (e) {
      setError(
        e instanceof Error && /type|size|content/i.test(e.message)
          ? `That file can't be used here: ${e.message}`
          : "Upload failed. Check your connection and try again, or paste a link instead.",
      )
      return null
    } finally {
      setProgress(null)
    }
  }
  return { send, progress, error }
}

function UploadButton({
  kind,
  accept,
  multiple,
  label,
  onUploaded,
}: {
  kind: Kind
  accept: string
  multiple?: boolean
  label: string
  onUploaded: (url: string, file: File) => void
}) {
  const { send, progress, error } = useUpload(kind)
  const input = useRef<HTMLInputElement>(null)
  const [queue, setQueue] = useState("")
  return (
    <div className="space-y-2">
      <label
        className={clsx(
          "inline-flex cursor-pointer items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-label-md uppercase text-on-primary-container transition-colors hover:bg-sienna focus-within:outline-2 focus-within:outline-secondary",
          progress !== null && "pointer-events-none opacity-70",
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
        </svg>
        {progress !== null ? `Uploading ${Math.round(progress)}%${queue}` : label}
        <input
          ref={input}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? [])
            for (const [i, f] of files.entries()) {
              setQueue(files.length > 1 ? ` (${i + 1}/${files.length})` : "")
              const url = await send(f)
              if (url) onUploaded(url, f)
            }
            setQueue("")
            if (input.current) input.current.value = ""
          }}
        />
      </label>
      {progress !== null && (
        <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-surface-container-highest" aria-hidden>
          <div className="h-full bg-marigold transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <p role="alert" className="text-body-sm text-error">{error}</p>}
    </div>
  )
}

function Panel({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-md border border-outline-variant/60 bg-surface-container-low p-5">
      <legend className="px-2 text-label-md uppercase text-tertiary">{title}</legend>
      {hint && <p className="-mt-2 text-body-sm text-outline">{hint}</p>}
      {children}
    </fieldset>
  )
}

// ---- Audio ----

export function AudioField({
  label,
  hint,
  accept,
  defaultUrl,
  defaultDuration,
  transcribed,
  defaultTranscribed,
}: {
  label: string
  hint: string
  accept: string
  defaultUrl: string
  defaultDuration: number
  transcribed: boolean
  defaultTranscribed: boolean
}) {
  const [url, setUrl] = useState(defaultUrl)
  const [duration, setDuration] = useState(defaultDuration ? formatTime(defaultDuration) : "")
  const [size, setSize] = useState("")
  return (
    <Panel title={label} hint={hint}>
      <input type="hidden" name="audioUrl" value={url} />
      {url ? (
        <div className="space-y-2">
          <audio
            src={url}
            controls
            preload="metadata"
            className="w-full"
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration
              if (Number.isFinite(d) && d > 0 && !duration) setDuration(formatTime(d))
            }}
          />
          <div className="flex flex-wrap items-center gap-3 text-body-sm text-outline">
            <span className="truncate">{url.split("/").pop()}</span>
            {size && <span>{size}</span>}
            <button type="button" onClick={() => setUrl("")} className="ml-auto text-label-md uppercase text-error hover:underline">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-4">
          <UploadButton
            kind="audio"
            accept={accept}
            label="Upload recording"
            onUploaded={(u, f) => {
              setUrl(u)
              setSize(formatBytes(f.size))
              setDuration("")
            }}
          />
          <span className="pt-2 text-label-sm uppercase text-outline">or</span>
          <input
            type="url"
            placeholder="Paste a link to an audio file"
            className={`${inputClass} min-w-[14rem] flex-1`}
            onBlur={(e) => e.target.value && setUrl(e.target.value.trim())}
          />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-label-md uppercase text-on-surface-variant">Duration</span>
          <input name="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="mm:ss (filled in automatically)" className={inputClass} />
        </label>
        {transcribed ? (
          <label className="flex items-center gap-3 self-end pb-3">
            <input type="checkbox" name="transcribed" defaultChecked={defaultTranscribed} className="size-5 accent-terracotta" />
            <span className="text-body-sm">Transcript included below</span>
          </label>
        ) : (
          <input type="hidden" name="transcribed" value={defaultTranscribed ? "on" : ""} />
        )}
      </div>
    </Panel>
  )
}

// ---- Video ----

export function VideoField({ label, hint, accept, defaultUrl }: { label: string; hint: string; accept: string; defaultUrl: string }) {
  const [url, setUrl] = useState(defaultUrl)
  const embed = url ? videoEmbed(url) : null
  return (
    <Panel title={label} hint={hint}>
      <input type="hidden" name="videoUrl" value={url} />
      {url ? (
        <div className="space-y-2">
          <div className="aspect-video overflow-hidden rounded-sm bg-obsidian">
            {embed ? (
              <iframe src={embed} title="Preview" className="h-full w-full" allow="encrypted-media; picture-in-picture; fullscreen" />
            ) : (
              <video src={url} controls preload="metadata" className="h-full w-full" />
            )}
          </div>
          <div className="flex items-center gap-3 text-body-sm text-outline">
            <span className="truncate">{embed ? "Embedded from " + new URL(url).hostname : url.split("/").pop()}</span>
            <button type="button" onClick={() => setUrl("")} className="ml-auto text-label-md uppercase text-error hover:underline">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-4">
          <UploadButton kind="video" accept={accept} label="Upload video" onUploaded={(u) => setUrl(u)} />
          <span className="pt-2 text-label-sm uppercase text-outline">or</span>
          <input
            type="url"
            placeholder="Paste a YouTube or Vimeo link"
            className={`${inputClass} min-w-[14rem] flex-1`}
            onBlur={(e) => e.target.value && setUrl(e.target.value.trim())}
          />
        </div>
      )}
    </Panel>
  )
}

// ---- Image gallery ----

type Img = { url: string; caption: string }

export function ImagesField({ label, hint, defaultImages }: { label: string; hint: string; defaultImages: Img[] }) {
  const [items, setItems] = useState<Img[]>(defaultImages)
  const [link, setLink] = useState("")
  const move = (i: number, d: number) =>
    setItems((xs) => {
      const j = i + d
      if (j < 0 || j >= xs.length) return xs
      const next = [...xs]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  return (
    <Panel title={label} hint={hint}>
      {/* Serialised in the format the server already parses: "url | caption" per line */}
      <input type="hidden" name="images" value={items.map((i) => `${i.url}${i.caption ? ` | ${i.caption}` : ""}`).join("\n")} />
      {items.length > 0 && (
        <ol className="grid gap-3 sm:grid-cols-2">
          {items.map((img, i) => (
            <li key={img.url + i} className={clsx("overflow-hidden rounded-sm border border-outline-variant/60 bg-surface-container", i === 0 && "sm:col-span-2")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className={clsx("w-full object-cover", i === 0 ? "aspect-[21/9]" : "aspect-[4/3]")} />
              <div className="space-y-2 p-3">
                <input
                  value={img.caption}
                  onChange={(e) => setItems((xs) => xs.map((x, k) => (k === i ? { ...x, caption: e.target.value } : x)))}
                  placeholder="Caption"
                  className={`${inputClass} py-2 text-body-sm`}
                />
                <div className="flex items-center gap-1 text-label-sm uppercase">
                  <span className="mr-auto text-outline tabular-nums">#{i + 1}</span>
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-full px-2 py-1 hover:bg-surface-container-high disabled:opacity-30" aria-label="Move earlier">
                    ←
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded-full px-2 py-1 hover:bg-surface-container-high disabled:opacity-30" aria-label="Move later">
                    →
                  </button>
                  <button type="button" onClick={() => setItems((xs) => xs.filter((_, k) => k !== i))} className="rounded-full px-2 py-1 text-error hover:bg-error-container/40">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
      <div className="flex flex-wrap items-start gap-4">
        <UploadButton
          kind="image"
          accept="image/*"
          multiple
          label={items.length ? "Add more" : "Upload images"}
          onUploaded={(u) => setItems((xs) => [...xs, { url: u, caption: "" }])}
        />
        <span className="pt-2 text-label-sm uppercase text-outline">or</span>
        <div className="flex min-w-[14rem] flex-1 gap-2">
          <input value={link} onChange={(e) => setLink(e.target.value)} type="url" placeholder="Paste an image link" className={inputClass} />
          <button
            type="button"
            onClick={() => {
              if (link.trim()) setItems((xs) => [...xs, { url: link.trim(), caption: "" }])
              setLink("")
            }}
            className="rounded-full border border-outline-variant px-4 text-label-md uppercase hover:border-outline"
          >
            Add
          </button>
        </div>
      </div>
    </Panel>
  )
}

// ---- Cover + pattern ----

export function CoverField({ label, hint, defaultUrl, defaultPattern }: { label: string; hint: string; defaultUrl: string; defaultPattern: Pattern }) {
  const [url, setUrl] = useState(defaultUrl)
  const [pattern, setPattern] = useState<Pattern>(defaultPattern)
  return (
    <div className="space-y-3">
      <span className="block text-label-md uppercase text-on-surface-variant">{label}</span>
      <input type="hidden" name="coverUrl" value={url} />
      <input type="hidden" name="pattern" value={pattern} />
      <div className="aspect-[16/9] overflow-hidden rounded-sm border border-outline-variant/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : <TextileArt pattern={pattern} />}
      </div>
      {url ? (
        <button type="button" onClick={() => setUrl("")} className="text-label-md uppercase text-error hover:underline">
          Remove image
        </button>
      ) : (
        <>
          <UploadButton kind="image" accept="image/*" label="Upload image" onUploaded={(u) => setUrl(u)} />
          <div>
            <span className="mb-1.5 block text-label-sm uppercase text-outline">Or use a pattern</span>
            <div className="grid grid-cols-4 gap-2">
              {PATTERNS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPattern(p)}
                  aria-pressed={pattern === p}
                  aria-label={`${p} pattern`}
                  className={clsx(
                    "aspect-square overflow-hidden rounded-sm border-2 transition-[border-color,transform] hover:scale-105",
                    pattern === p ? "border-marigold" : "border-transparent",
                  )}
                >
                  <TextileArt pattern={p} />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      <p className="text-body-sm text-outline">{hint}</p>
    </div>
  )
}

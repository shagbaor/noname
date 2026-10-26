"use client"

import clsx from "clsx"
import { startTransition, useActionState, useEffect, useRef, useState } from "react"
import { postComment } from "@/app/actions"
import { formatBytes, formatTime } from "@/lib/format"

const MAX_SECONDS = 180
const MAX_BYTES = 3 * 1024 * 1024

type Voice = { blob: Blob; url: string; name: string }

export function CommentForm({ postId, token }: { postId: number; token: string }) {
  const [state, action, pending] = useActionState(postComment, undefined)
  const [voice, setVoice] = useState<Voice | null>(null)
  const [voiceError, setVoiceError] = useState("")
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [body, setBody] = useState("")
  const recorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const timer = useRef<ReturnType<typeof setInterval>>(undefined)
  const fileInput = useRef<HTMLInputElement>(null)

  // Release mic and object URLs when leaving
  useEffect(
    () => () => {
      clearInterval(timer.current)
      recorder.current?.stream.getTracks().forEach((t) => t.stop())
    },
    [],
  )
  useEffect(() => () => void (voice && URL.revokeObjectURL(voice.url)), [voice])

  const setClip = (blob: Blob, name: string) => {
    if (blob.size > MAX_BYTES) {
      setVoiceError("That recording is over 3 MB. Please keep it under about 3 minutes.")
      return
    }
    setVoiceError("")
    setVoice({ blob, url: URL.createObjectURL(blob), name })
  }

  async function startRecording() {
    setVoiceError("")
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setVoiceError("Recording isn't supported in this browser. You can upload an audio file instead.")
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mime = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"].find((m) => MediaRecorder.isTypeSupported(m))
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 64_000 } : undefined)
      chunks.current = []
      rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data)
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        clearInterval(timer.current)
        setRecording(false)
        const type = rec.mimeType || "audio/webm"
        setClip(new Blob(chunks.current, { type }), `voice-note.${type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm"}`)
      }
      recorder.current = rec
      rec.start(1000)
      setRecording(true)
      setElapsed(0)
      const started = Date.now()
      timer.current = setInterval(() => {
        const s = Math.floor((Date.now() - started) / 1000)
        setElapsed(s)
        if (s >= MAX_SECONDS) rec.state === "recording" && rec.stop()
      }, 250)
    } catch {
      setVoiceError("We couldn't use your microphone. Check your browser's permission, or upload a file instead.")
    }
  }

  const stopRecording = () => recorder.current?.state === "recording" && recorder.current.stop()

  const discard = () => {
    setVoice(null)
    if (fileInput.current) fileInput.current.value = ""
  }

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
        if (recording) return
        const data = new FormData(e.currentTarget)
        data.delete("audio")
        if (voice) data.set("audio", voice.blob, voice.name)
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
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share a memory, a thank you, or what this story means to you…"
          className="w-full rounded-sm border border-outline-variant bg-surface-container px-4 py-3 text-body-md placeholder:text-outline focus:border-terracotta focus:ring-4 focus:ring-terracotta/25 focus:outline-none"
        />
        <span className="mt-1 block text-right text-label-sm tabular-nums text-outline">{body.length}/2000</span>
      </label>

      {/* Voice note */}
      <fieldset className="rounded-sm border border-dashed border-outline-variant p-4">
        <legend className="px-1 text-label-md uppercase text-on-surface-variant">Voice note (optional)</legend>
        {voice ? (
          <div className="flex flex-wrap items-center gap-3">
            <audio src={voice.url} controls className="h-10 min-w-0 flex-1" />
            <span className="text-label-sm tabular-nums text-outline">{formatBytes(voice.blob.size)}</span>
            <button type="button" onClick={discard} className="rounded-full border border-outline-variant px-3 py-1.5 text-label-md uppercase hover:border-outline">
              Remove
            </button>
          </div>
        ) : recording ? (
          <div className="flex items-center gap-3">
            <span className="size-3 animate-pulse rounded-full bg-error" aria-hidden />
            <span className="text-title-md tabular-nums" aria-live="polite">
              Recording {formatTime(elapsed)} <span className="text-outline">/ {formatTime(MAX_SECONDS)}</span>
            </span>
            <button
              type="button"
              onClick={stopRecording}
              className="ml-auto rounded-full bg-terracotta px-4 py-2 text-label-md uppercase text-on-primary-container hover:bg-sienna"
            >
              Stop
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={startRecording}
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-terracotta px-4 py-2 text-label-md uppercase hover:bg-terracotta/15"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v4" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              Record
            </button>
            <span className="text-label-sm uppercase text-outline">or</span>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-outline-variant px-4 py-2 text-label-md uppercase hover:border-outline focus-within:outline-2 focus-within:outline-secondary">
              Upload audio
              <input
                ref={fileInput}
                type="file"
                name="audio"
                accept="audio/*,.m4a,.mp3,.wav,.ogg,.webm"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) setClip(f, f.name)
                }}
              />
            </label>
            <span className="text-body-sm text-outline">Up to 3 minutes</span>
          </div>
        )}
        {voiceError && (
          <p role="alert" className="mt-2 text-body-sm text-error">
            {voiceError}
          </p>
        )}
      </fieldset>

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
          disabled={pending || recording}
          className={clsx(
            "rounded-full bg-terracotta px-6 py-2.5 text-label-lg uppercase text-on-primary-container transition-[background-color,transform] hover:bg-sienna active:scale-[0.98]",
            (pending || recording) && "opacity-60",
          )}
        >
          {pending ? "Sending…" : "Post comment"}
        </button>
      </div>
    </form>
  )
}

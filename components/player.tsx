"use client"

import clsx from "clsx"
import Link from "next/link"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { formatTime } from "@/lib/format"
import { Badge } from "./ui/badge"

/*
 * Oral Narrative Player — docked at the bottom of every public page.
 * Plays the testimony's audio file when it has one; otherwise (sample content
 * without recordings) it simulates playback with a timer so the UI still works.
 */

export type Track = {
  id: number
  slug: string
  title: string
  narrator: string
  language: string
  transcribed: boolean
  durationSec: number
  audioUrl: string
}

type PlayerState = {
  current: Track | null
  playing: boolean
  position: number
  duration: number
  play: (t: Track) => void
  toggle: () => void
  seek: (sec: number) => void
  close: () => void
}

const PlayerContext = createContext<PlayerState | null>(null)

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>")
  return ctx
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [current, setCurrent] = useState<Track | null>(null)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const real = Boolean(current?.audioUrl)

  // Simulated clock for tracks without audio
  useEffect(() => {
    if (!playing || !current || real) return
    const t = setInterval(() => {
      setPosition((p) => {
        if (p + 1 >= duration) {
          setPlaying(false)
          return duration
        }
        return p + 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [playing, current, real, duration])

  // Drive the <audio> element for real tracks
  useEffect(() => {
    const el = audio.current
    if (!el || !real) return
    if (playing) el.play().catch(() => setPlaying(false))
    else el.pause()
  }, [playing, real, current])

  const value: PlayerState = {
    current,
    playing,
    position,
    duration,
    play: (t) => {
      if (current?.id === t.id) {
        setPlaying((p) => !p)
        return
      }
      setCurrent(t)
      setPosition(0)
      setDuration(t.durationSec || 0)
      setPlaying(true)
    },
    toggle: () => setPlaying((p) => !p),
    seek: (sec) => {
      setPosition(sec)
      if (audio.current && real) audio.current.currentTime = sec
    },
    close: () => {
      setPlaying(false)
      setCurrent(null)
    },
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {current?.audioUrl && (
        <audio
          ref={audio}
          src={current.audioUrl}
          preload="metadata"
          onLoadedMetadata={(e) => setDuration(Math.round(e.currentTarget.duration) || current.durationSec)}
          onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
          onEnded={() => setPlaying(false)}
        />
      )}
      <DockedPlayer />
    </PlayerContext.Provider>
  )
}

/** Deterministic pseudo-waveform from a seed so server and client match. */
export function waveFor(seed: number, n = 56): number[] {
  const out: number[] = []
  let x = seed * 7919 + 17
  for (let i = 0; i < n; i++) {
    x = (x * 9301 + 49297) % 233280
    const envelope = 0.45 + 0.55 * Math.sin((i / n) * Math.PI)
    out.push(Math.max(0.12, Math.min(1, (x / 233280) * envelope + 0.1)))
  }
  return out
}

export function Waveform({
  seed,
  progress = 0,
  active = false,
  className,
}: {
  seed: number
  progress?: number
  active?: boolean
  className?: string
}) {
  const wave = waveFor(seed)
  return (
    <div className={clsx("flex h-10 items-center gap-[3px]", className)} aria-hidden>
      {wave.map((a, i) => (
        <span
          key={i}
          className={clsx(
            "w-[3px] flex-1 rounded-full transition-colors duration-300",
            i / wave.length < progress ? "bg-terracotta" : "bg-outline-variant",
            active && "animate-wave",
          )}
          style={{ height: `${Math.round(a * 100)}%`, animationDelay: active ? `${(i % 9) * 90}ms` : undefined }}
        />
      ))}
    </div>
  )
}

function DockedPlayer() {
  const { current, playing, position, duration, toggle, seek, close } = usePlayer()
  const [shown, setShown] = useState<Track | null>(null)

  // Keep the last track rendered while the dock animates out
  useEffect(() => {
    if (current) setShown(current)
  }, [current])

  const t = current ?? shown
  if (!t) return null
  const progress = duration ? position / duration : 0

  return (
    <div
      role="region"
      aria-label="Oral narrative player"
      aria-hidden={!current}
      inert={!current}
      className={clsx(
        "fixed inset-x-0 bottom-0 z-50 p-3 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] md:p-4",
        current ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
      )}
      onTransitionEnd={() => !current && setShown(null)}
    >
      <div className="mx-auto flex max-w-[1100px] items-center gap-3 rounded-lg border border-outline-variant/70 bg-obsidian/95 p-3 shadow-sheet backdrop-blur-md md:gap-5 md:p-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="grid size-12 shrink-0 place-items-center rounded-full bg-terracotta text-on-primary-container transition-[background-color,transform] hover:bg-sienna active:scale-95"
        >
          <PlayPause playing={playing} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/stories/${t.slug}`} className="truncate font-display text-headline-sm uppercase hover:text-primary">
              {t.title}
            </Link>
            {t.transcribed && t.language && (
              <Badge tone="violet" className="hidden shrink-0 sm:inline-flex">
                Transcript · {t.language}
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-label-md tabular-nums text-marigold">{formatTime(position)}</span>
            <div className="relative flex-1">
              <Waveform seed={t.id} progress={progress} active={playing} className="h-7" />
              <input
                type="range"
                min={0}
                max={duration || 1}
                value={position}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label="Seek"
                aria-valuetext={`${formatTime(position)} of ${formatTime(duration)}`}
                className="absolute inset-0 w-full cursor-pointer opacity-0"
              />
              <span
                className="pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-marigold ring-4 ring-marigold/25"
                style={{ left: `${progress * 100}%` }}
                aria-hidden
              />
            </div>
            <span className="hidden text-label-md tabular-nums text-outline sm:inline">{formatTime(duration)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="Close player"
          className="grid size-10 shrink-0 place-items-center rounded-full text-outline hover:bg-surface-container-high hover:text-on-surface"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function PlayPause({ playing }: { playing: boolean }) {
  return playing ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="4.5" width="4" height="15" rx="1" />
      <rect x="14" y="4.5" width="4" height="15" rx="1" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 4.5v15l12-7.5z" />
    </svg>
  )
}

/** Play button that loads a track into the docked player. */
export function PlayButton({ track, size = "md" }: { track: Track; size?: "md" | "lg" }) {
  const { current, playing, play } = usePlayer()
  const isPlaying = current?.id === track.id && playing
  return (
    <button
      type="button"
      onClick={() => play(track)}
      aria-label={`${isPlaying ? "Pause" : "Play"} “${track.title}”`}
      className={clsx(
        "relative z-10 grid shrink-0 place-items-center rounded-full border-[1.5px] border-terracotta transition-[background-color,transform] active:scale-95",
        size === "lg" ? "size-16" : "size-12",
        isPlaying ? "bg-terracotta text-on-primary-container" : "text-primary hover:bg-terracotta/15",
      )}
    >
      <PlayPause playing={isPlaying} />
    </button>
  )
}

/** Waveform that reflects playback progress for a given track. */
export function TrackWaveform({ track, className }: { track: Track; className?: string }) {
  const { current, playing, position, duration } = usePlayer()
  const active = current?.id === track.id
  return (
    <Waveform
      seed={track.id}
      progress={active && duration ? position / duration : 0}
      active={active && playing}
      className={className}
    />
  )
}

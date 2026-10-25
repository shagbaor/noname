"use client"

import clsx from "clsx"
import { createContext, useContext, useEffect, useState } from "react"
import type { Testimony } from "@/lib/content"
import { Badge } from "./ui/badge"

/*
 * Oral Narrative Player — a docked player shared across the page.
 * There are no audio files yet, so playback is simulated with a timer. To wire
 * real audio, add a `src` to each testimony and drive `position` from an
 * <audio> element's timeupdate event instead of the interval below.
 */

type PlayerState = {
  current: Testimony | null
  playing: boolean
  position: number
  play: (t: Testimony) => void
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
  const [current, setCurrent] = useState<Testimony | null>(null)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)

  useEffect(() => {
    if (!playing || !current) return
    const t = setInterval(() => {
      setPosition((p) => {
        if (p + 1 >= current.durationSec) {
          setPlaying(false)
          return current.durationSec
        }
        return p + 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [playing, current])

  const value: PlayerState = {
    current,
    playing,
    position,
    play: (t) => {
      if (current?.id === t.id) {
        setPlaying((p) => !p)
        return
      }
      setCurrent(t)
      setPosition(0)
      setPlaying(true)
    },
    toggle: () => setPlaying((p) => !p),
    seek: (sec) => setPosition(sec),
    close: () => {
      setPlaying(false)
      setCurrent(null)
    },
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <DockedPlayer />
    </PlayerContext.Provider>
  )
}

export function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function Waveform({
  wave,
  progress = 0,
  className,
}: {
  wave: number[]
  progress?: number
  className?: string
}) {
  return (
    <div className={clsx("flex h-10 items-center gap-[3px]", className)} aria-hidden>
      {wave.map((a, i) => (
        <span
          key={i}
          className={clsx(
            "w-[3px] flex-1 rounded-full transition-colors",
            i / wave.length < progress ? "bg-terracotta" : "bg-outline-variant",
          )}
          style={{ height: `${Math.round(a * 100)}%` }}
        />
      ))}
    </div>
  )
}

function DockedPlayer() {
  const { current, playing, position, toggle, seek, close } = usePlayer()
  if (!current) return null
  const progress = position / current.durationSec

  return (
    <div
      role="region"
      aria-label="Oral narrative player"
      className="fixed inset-x-0 bottom-0 z-50 p-3 md:p-4"
    >
      <div className="mx-auto flex max-w-[1100px] items-center gap-3 rounded-lg border border-outline-variant/70 bg-obsidian/95 p-3 shadow-sheet backdrop-blur-md md:gap-5 md:p-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="grid size-12 shrink-0 place-items-center rounded-full bg-terracotta text-on-primary-container transition-colors hover:bg-sienna"
        >
          <PlayPause playing={playing} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-display text-headline-sm uppercase">{current.title}</p>
            {current.transcribed && (
              <Badge tone="violet" className="hidden shrink-0 sm:inline-flex">
                Transcript · {current.language}
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-label-md tabular-nums text-marigold">{formatTime(position)}</span>
            <div className="relative flex-1">
              <Waveform wave={current.wave} progress={progress} className="h-7" />
              <input
                type="range"
                min={0}
                max={current.durationSec}
                value={position}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label="Seek"
                aria-valuetext={`${formatTime(position)} of ${formatTime(current.durationSec)}`}
                className="absolute inset-0 w-full cursor-pointer opacity-0"
              />
              <span
                className="pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-marigold ring-4 ring-marigold/25"
                style={{ left: `${progress * 100}%` }}
                aria-hidden
              />
            </div>
            <span className="hidden text-label-md tabular-nums text-outline sm:inline">
              {formatTime(current.durationSec)}
            </span>
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

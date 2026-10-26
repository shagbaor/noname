"use client"

import Link from "next/link"
import { formatTime } from "@/lib/format"
import { PlayButton, TrackWaveform, usePlayer, type Track } from "./player"
import { Badge } from "./ui/badge"

export function TestimonyRow({
  track,
  location,
  recorded,
}: {
  track: Track
  location: string
  recorded: string
}) {
  const { current } = usePlayer()
  const active = current?.id === track.id
  const initials = track.narrator
    .replace(/^Sample\s*[—-]\s*/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div
      className={`group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md px-2 py-5 transition-colors duration-500 md:grid-cols-[auto_minmax(0,1.3fr)_minmax(0,1fr)_auto] md:gap-6 md:px-4 ${active ? "bg-surface-container-low" : "hover:bg-surface-container-low/60"}`}
    >
      <div className="relative grid size-14 place-items-center rounded-full bg-surface-container-high font-display text-headline-sm text-primary transition-transform duration-500 group-hover:scale-105 md:size-16">
        {initials || "—"}
        <span className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-surface bg-tertiary" aria-hidden />
      </div>

      <div className="min-w-0">
        <h3 className="text-headline-md uppercase">
          <Link href={`/stories/${track.slug}`} className="hover:text-primary">
            {track.title}
          </Link>
        </h3>
        <p className="mt-1 truncate text-body-sm text-on-surface-variant">
          {[track.narrator, location].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {recorded && <Badge tone="acacia">Recorded {recorded}</Badge>}
          {track.language &&
            (track.transcribed ? (
              <Badge tone="violet">Transcript · {track.language}</Badge>
            ) : (
              <Badge>{track.language}</Badge>
            ))}
        </div>
      </div>

      <TrackWaveform track={track} className="hidden md:flex" />

      <div className="flex items-center gap-3">
        <span className="hidden text-label-lg tabular-nums text-outline sm:inline">{formatTime(track.durationSec)}</span>
        <PlayButton track={track} />
      </div>
    </div>
  )
}

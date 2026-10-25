"use client"

import clsx from "clsx"
import { testimonies } from "@/lib/content"
import { formatTime, PlayPause, usePlayer, Waveform } from "./player"
import { SectionHeading } from "./section-heading"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

export function Testimonies() {
  const { current, playing, position, play } = usePlayer()

  return (
    <section id="testimonies" className="bg-surface-container-lowest">
      <div className="page-x mx-auto max-w-[1440px] py-space-2xl lg:py-space-3xl">
        <SectionHeading
          index="02"
          eyebrow="Oral history index"
          title="Voices in the archive"
          action={<Button href="#testimonies" variant="ghost">Full index →</Button>}
        />

        <ul className="mt-6 divide-y divide-outline-variant/60">
          {testimonies.map((t) => {
            const active = current?.id === t.id
            const isPlaying = active && playing
            return (
              <li
                key={t.id}
                className={clsx(
                  "grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md py-5 transition-colors md:grid-cols-[auto_minmax(0,1.3fr)_minmax(0,1fr)_auto] md:gap-6 md:px-4",
                  active && "bg-surface-container-low",
                )}
              >
                {/* Speaker portrait placeholder */}
                <div className="relative grid size-14 place-items-center rounded-full bg-surface-container-high font-display text-headline-sm text-primary md:size-16">
                  {t.initials}
                  <span className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-surface-container-lowest bg-tertiary" aria-hidden />
                </div>

                <div className="min-w-0">
                  <h3 className="text-headline-md uppercase">{t.title}</h3>
                  <p className="mt-1 text-body-sm text-on-surface-variant">
                    {t.narrator} · {t.location}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge tone="acacia">Recorded {t.recorded}</Badge>
                    {t.transcribed ? (
                      <Badge tone="violet">Transcript · {t.language}</Badge>
                    ) : (
                      <Badge>{t.language} · transcript pending</Badge>
                    )}
                  </div>
                </div>

                <Waveform
                  wave={t.wave}
                  progress={active ? position / t.durationSec : 0}
                  className="hidden md:flex"
                />

                <div className="flex items-center gap-3">
                  <span className="hidden text-label-lg tabular-nums text-outline sm:inline">
                    {formatTime(t.durationSec)}
                  </span>
                  <button
                    type="button"
                    onClick={() => play(t)}
                    aria-label={`${isPlaying ? "Pause" : "Play"} “${t.title}”`}
                    className={clsx(
                      "grid size-12 place-items-center rounded-full border-[1.5px] transition-colors",
                      isPlaying
                        ? "border-terracotta bg-terracotta text-on-primary-container"
                        : "border-terracotta text-primary hover:bg-terracotta/15",
                    )}
                  >
                    <PlayPause playing={isPlaying} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

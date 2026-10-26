"use client"

import clsx from "clsx"
import { useState } from "react"
import type { TimelineEntry } from "@/lib/content"
import { Reveal } from "./reveal"
import { Badge } from "./ui/badge"

export function TimelineList({ entries }: { entries: TimelineEntry[] }) {
  const regions = ["All", ...Array.from(new Set(entries.map((e) => e.region)))]
  const [region, setRegion] = useState("All")
  const shown = region === "All" ? entries : entries.filter((e) => e.region === region)

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by region">
        {regions.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={region === r}
            onClick={() => setRegion(r)}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-label-md uppercase transition-colors duration-300",
              region === r
                ? "bg-terracotta text-on-primary-container"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Vertical spine on wide screens */}
      <ol className="relative mt-8 md:before:absolute md:before:inset-y-0 md:before:left-[8rem] md:before:w-px md:before:bg-outline-variant/70">
        {shown.map((t, i) => (
          <Reveal
            as="li"
            key={t.year + t.title}
            delay={(i % 3) * 80}
            className="relative grid gap-2 border-t border-outline-variant/60 py-6 md:grid-cols-[6.5rem_1fr] md:gap-12 md:border-t-0"
          >
            <p className="font-display text-[clamp(2.25rem,1.7rem+2vw,3.25rem)] leading-none tabular-nums text-terracotta">{t.year}</p>
            <div className="relative md:pl-6">
              <span className="absolute top-3 -left-[calc(1.5rem+5px)] hidden size-2.5 rotate-45 bg-marigold md:block" aria-hidden />
              <h2 className="text-headline-md uppercase">{t.title}</h2>
              <p className="mt-1.5 max-w-[40rem] text-body-md text-on-surface-variant">{t.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="marigold">{t.place}</Badge>
                <Badge>{t.region}</Badge>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </>
  )
}

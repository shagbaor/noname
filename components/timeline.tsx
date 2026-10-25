"use client"

import clsx from "clsx"
import { useState } from "react"
import { timeline, type Region } from "@/lib/content"
import { SectionHeading } from "./section-heading"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

const regions: ("All" | Region)[] = ["All", "Southern Africa", "Central Africa", "East Africa", "West Africa"]

export function Timeline() {
  const [region, setRegion] = useState<(typeof regions)[number]>("All")
  const entries = region === "All" ? timeline : timeline.filter((t) => t.region === region)

  return (
    <section id="timeline" className="page-x mx-auto max-w-[1440px] py-space-2xl lg:py-space-3xl">
      <SectionHeading
        index="03"
        eyebrow="A living timeline"
        title="Moments we carry"
        action={<Button href="#timeline" variant="ghost">Open the timeline →</Button>}
      />

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by region">
        {regions.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={region === r}
            onClick={() => setRegion(r)}
            className={clsx(
              "rounded-full px-4 py-2 text-label-lg uppercase transition-colors",
              region === r
                ? "bg-terracotta text-on-primary-container"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <ol className="mt-10 grid gap-x-8 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((t) => (
          <li key={t.year + t.title} className="relative border-t border-outline-variant/60 py-6 pl-6">
            <span className="absolute top-8 left-0 size-2.5 rotate-45 bg-marigold" aria-hidden />
            <p className="font-display text-[56px] leading-none tabular-nums text-terracotta">{t.year}</p>
            <h3 className="mt-3 text-title-lg">{t.title}</h3>
            <p className="mt-2 text-body-md text-on-surface-variant">{t.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="marigold">{t.place}</Badge>
              <Badge>{t.region}</Badge>
            </div>
          </li>
        ))}
        {entries.length === 0 && (
          <li className="border-t border-outline-variant/60 py-10 text-body-md text-on-surface-variant md:col-span-2 lg:col-span-3">
            Nothing catalogued for this region yet.{" "}
            <a href="#contribute" className="link-ghost text-primary">
              Help us fill the gap.
            </a>
          </li>
        )}
      </ol>
    </section>
  )
}

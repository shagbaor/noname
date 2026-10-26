import clsx from "clsx"
import { useId } from "react"
import type { Pattern } from "@/lib/forms"

/*
 * Textile-inspired SVG fields used in place of photography until real archive
 * imagery is available. Loosely references bògòlanfini (mud cloth), kente
 * strip-weaving and adire resist-dye geometry, abstracted into clean motifs.
 */

const palettes: Record<Pattern, { bg: string; a: string; b: string; c: string }> = {
  mudcloth: { bg: "#2a1a14", a: "#c2410c", b: "#e1bfb5", c: "#f59e0b" },
  kente: { bg: "#1b1b1e", a: "#f59e0b", b: "#059669", c: "#c2410c" },
  adire: { bg: "#1a1530", a: "#7c3aed", b: "#d2bbff", c: "#c2410c" },
  chevron: { bg: "#10231c", a: "#059669", b: "#68dba9", c: "#f59e0b" },
}

export function TextileArt({
  pattern,
  className,
  label,
}: {
  pattern: Pattern
  className?: string
  label?: string
}) {
  const p = palettes[pattern]
  const id = `tx-${pattern}-${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  return (
    <svg
      className={clsx("block h-full w-full", className)}
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        {pattern === "mudcloth" && (
          <pattern id={id} width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill={p.bg} />
            <path d="M0 20h80M0 60h80" stroke={p.b} strokeOpacity=".35" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx="20" cy="40" r="5" fill={p.a} />
            <circle cx="60" cy="40" r="5" fill="none" stroke={p.c} strokeWidth="2" />
            <path d="M40 0v12M40 68v12" stroke={p.a} strokeWidth="3" />
            <path d="M32 40l8-8 8 8-8 8z" fill={p.b} fillOpacity=".8" />
          </pattern>
        )}
        {pattern === "kente" && (
          <pattern id={id} width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill={p.bg} />
            <rect x="0" width="25" height="100" fill={p.a} fillOpacity=".85" />
            <rect x="25" width="25" height="50" fill={p.b} />
            <rect x="25" y="50" width="25" height="50" fill={p.c} />
            <rect x="50" width="50" height="100" fill={p.bg} />
            <path d="M50 10h50M50 30h50M50 70h50M50 90h50" stroke={p.a} strokeWidth="4" />
            <path d="M62 50h26" stroke={p.c} strokeWidth="10" />
            <path d="M0 50h25" stroke={p.bg} strokeWidth="6" />
          </pattern>
        )}
        {pattern === "adire" && (
          <pattern id={id} width="90" height="90" patternUnits="userSpaceOnUse">
            <rect width="90" height="90" fill={p.bg} />
            <circle cx="45" cy="45" r="28" fill="none" stroke={p.a} strokeWidth="6" />
            <circle cx="45" cy="45" r="14" fill="none" stroke={p.b} strokeOpacity=".6" strokeWidth="2" />
            <circle cx="45" cy="45" r="4" fill={p.c} />
            <circle cx="0" cy="0" r="10" fill={p.b} fillOpacity=".25" />
            <circle cx="90" cy="90" r="10" fill={p.b} fillOpacity=".25" />
            <circle cx="90" cy="0" r="10" fill={p.b} fillOpacity=".25" />
            <circle cx="0" cy="90" r="10" fill={p.b} fillOpacity=".25" />
          </pattern>
        )}
        {pattern === "chevron" && (
          <pattern id={id} width="60" height="40" patternUnits="userSpaceOnUse">
            <rect width="60" height="40" fill={p.bg} />
            <path d="M0 30l15-15 15 15 15-15 15 15" fill="none" stroke={p.a} strokeWidth="5" />
            <path d="M0 10l15-15 15 15 15-15 15 15" fill="none" stroke={p.b} strokeOpacity=".4" strokeWidth="2" />
            <circle cx="30" cy="38" r="2.5" fill={p.c} />
          </pattern>
        )}
        <radialGradient id={`${id}-glow`} cx="30%" cy="20%" r="90%">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#0e0e11" stopOpacity=".75" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#${id})`} />
      <rect width="400" height="400" fill={`url(#${id}-glow)`} />
    </svg>
  )
}

/** Rhythmic hairline band used between chapters. */
export function TextileDivider({ className }: { className?: string }) {
  return (
    <div className={clsx("page-x", className)} aria-hidden>
      <svg className="h-4 w-full text-outline-variant" preserveAspectRatio="none">
        <defs>
          <pattern id="divider" width="32" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 8h10M22 8h10" stroke="currentColor" strokeWidth="1" />
            <path d="M12 8l4-4 4 4-4 4z" fill="#c2410c" fillOpacity=".7" />
          </pattern>
        </defs>
        <rect width="100%" height="16" fill="url(#divider)" />
      </svg>
    </div>
  )
}

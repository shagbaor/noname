import clsx from "clsx"
import { useId } from "react"
import { site } from "@/lib/site"

/*
 * The Kin Archive mark: a terracotta lozenge (the bògòlanfini diamond) holding
 * a marigold heart, with four mud-cloth stitches cut into its band. The open
 * ring between band and heart is the "archive": space held for what's kept.
 * The same geometry is used for app/icon.svg.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  const mask = `kin-mark-${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  return (
    <svg
      viewBox="0 0 64 64"
      className={clsx("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <mask id={mask}>
          <path d="M32 2 62 32 32 62 2 32Z" fill="#fff" />
          <path d="M32 16 48 32 32 48 16 32Z" fill="#000" />
          <circle cx="43" cy="21" r="2.4" fill="#000" />
          <circle cx="43" cy="43" r="2.4" fill="#000" />
          <circle cx="21" cy="43" r="2.4" fill="#000" />
          <circle cx="21" cy="21" r="2.4" fill="#000" />
        </mask>
      </defs>
      <path d="M32 2 62 32 32 62 2 32Z" fill="#c2410c" mask={`url(#${mask})`} />
      <path d="M32 22 42 32 32 42 22 32Z" fill="#f59e0b" />
      <circle cx="32" cy="32" r="2.6" fill="#7c3aed" />
    </svg>
  )
}

export function Logo({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const [first, ...rest] = site.name.split(" ")
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={size === "lg" ? "size-12" : "size-8"} />
      <span className="flex flex-col leading-none">
        <span
          className={clsx(
            "font-display tracking-[0.04em] uppercase",
            size === "lg" ? "text-[44px]" : "text-[26px]",
          )}
        >
          {first}
        </span>
        {rest.length > 0 && (
          <span
            className={clsx(
              "font-label font-semibold tracking-[0.42em] text-on-surface-variant uppercase",
              size === "lg" ? "mt-1 text-[12px]" : "-mt-0.5 text-[8.5px]",
            )}
          >
            {rest.join(" ")}
          </span>
        )}
      </span>
    </span>
  )
}

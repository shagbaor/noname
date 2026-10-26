import clsx from "clsx"
import Link from "next/link"
import { FORMS } from "@/lib/forms"

/** Filter chips for story forms. Links, so filtering works without JS. */
export function FormTabs({
  active,
  counts,
  basePath = "/stories",
  keep = {},
}: {
  active?: string
  counts: Record<string, number>
  basePath?: string
  /** Other query params to preserve, e.g. the archive search term */
  keep?: Record<string, string>
}) {
  const hrefFor = (form: string) => {
    const qs = new URLSearchParams({ ...keep, ...(form ? { form } : {}) }).toString()
    return qs ? `${basePath}?${qs}` : basePath
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const tabs = [{ id: "", label: "All", n: total }, ...FORMS.map((f) => ({ id: f.id, label: f.plural, n: counts[f.id] ?? 0 }))]
  return (
    <nav aria-label="Story forms" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
      {tabs.map((t) => {
        const on = (active ?? "") === t.id
        return (
          <Link
            key={t.id || "all"}
            href={hrefFor(t.id)}
            scroll={false}
            aria-current={on ? "page" : undefined}
            className={clsx(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-label-lg uppercase transition-colors duration-300",
              on
                ? "bg-terracotta text-on-primary-container"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface",
            )}
          >
            {t.label}
            <span className={clsx("tabular-nums", on ? "text-on-primary-container/70" : "text-outline")}>{t.n}</span>
          </Link>
        )
      })}
    </nav>
  )
}

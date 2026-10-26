import clsx from "clsx"
import Link from "next/link"
import { GROUPS, THEMES, typesInGroup, type GroupId } from "@/lib/forms"

const chip =
  "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-label-md uppercase transition-colors duration-300"
const chipOn = "bg-terracotta text-on-primary-container"
const chipOff = "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"

/**
 * Two-level story navigation: groups, then the types inside the active group.
 * Plain links, so it works without JS and every view has its own URL.
 */
export function StoryNav({
  group,
  section,
  counts,
}: {
  group?: GroupId
  section?: string
  counts: Record<string, number>
}) {
  const groupCount = (id: GroupId) => typesInGroup(id).reduce((n, t) => n + (counts[t.id] ?? 0), 0)
  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-3">
      <nav aria-label="Story groups" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        <Link href="/stories" aria-current={!group ? "page" : undefined} className={clsx(chip, !group ? chipOn : chipOff)}>
          All <span className="tabular-nums opacity-70">{total}</span>
        </Link>
        {GROUPS.map((g) => (
          <Link
            key={g.id}
            href={`/stories/${g.id}`}
            aria-current={group === g.id && !section ? "page" : undefined}
            className={clsx(chip, group === g.id ? chipOn : chipOff)}
          >
            {g.label} <span className="tabular-nums opacity-70">{groupCount(g.id)}</span>
          </Link>
        ))}
      </nav>
      {group && (
        <nav aria-label="Story types" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
          {typesInGroup(group).map((t) => (
            <Link
              key={t.id}
              href={`/stories/${t.section}`}
              aria-current={section === t.section ? "page" : undefined}
              className={clsx(
                chip,
                section === t.section
                  ? "bg-on-surface text-surface"
                  : "border border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface",
              )}
            >
              {t.plural} <span className="tabular-nums opacity-60">{counts[t.id] ?? 0}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}

/** Theme filter chips; keeps the current path and toggles ?theme=. */
export function ThemeChips({
  basePath,
  active,
  counts,
  keep = {},
}: {
  basePath: string
  active?: string
  counts: Record<string, number>
  keep?: Record<string, string>
}) {
  const href = (theme?: string) => {
    const qs = new URLSearchParams({ ...keep, ...(theme ? { theme } : {}) }).toString()
    return qs ? `${basePath}?${qs}` : basePath
  }
  return (
    <nav aria-label="Themes" className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-label-sm uppercase text-outline">Themes</span>
      {THEMES.map((t) => {
        const on = active === t.id
        return (
          <Link
            key={t.id}
            href={on ? href() : href(t.id)}
            scroll={false}
            aria-current={on ? "true" : undefined}
            className={clsx(
              "rounded-full px-3 py-1 text-label-sm uppercase transition-colors duration-300",
              on ? "bg-violet/30 text-secondary" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
            )}
          >
            {t.label}
            {counts[t.id] ? <span className="ml-1 opacity-60">{counts[t.id]}</span> : null}
            {on && <span aria-hidden> ×</span>}
          </Link>
        )
      })}
    </nav>
  )
}

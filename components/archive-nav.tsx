import clsx from "clsx"
import Link from "next/link"

const tabs = [
  { href: "/archive", label: "Search" },
  { href: "/archive/timeline", label: "Timeline" },
]

export function ArchiveNav({ active }: { active: "/archive" | "/archive/timeline" }) {
  return (
    <nav aria-label="Archive sections" className="inline-flex rounded-full bg-surface-container-high p-1">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={active === t.href ? "page" : undefined}
          className={clsx(
            "rounded-full px-4 py-1.5 text-label-md uppercase transition-colors duration-300",
            active === t.href ? "bg-terracotta text-on-primary-container" : "text-on-surface-variant hover:text-on-surface",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  )
}

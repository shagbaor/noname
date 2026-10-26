import Link from "next/link"
import { nav, site } from "@/lib/site"
import { Logo } from "./logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant/60 bg-surface-container-lowest pb-28">
      <div className="shell grid gap-8 pt-10 pb-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <Logo />
          <p className="mt-4 max-w-[28rem] text-body-sm text-on-surface-variant">{site.description}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          {[...nav, { label: "Timeline", href: "/archive/timeline" }, { label: "Donate", href: "/donate" }].map((l) => (
            <Link key={l.href} href={l.href} className="link-ghost text-label-lg uppercase text-on-surface-variant hover:text-on-surface">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="shell flex flex-wrap justify-between gap-4 border-t border-outline-variant/60 pt-6 text-label-sm uppercase text-outline">
        <span>
          © {new Date().getFullYear()} {site.name}. Held in community.
        </span>
        <Link href="/admin" className="hover:text-on-surface-variant">
          Editors
        </Link>
      </div>
    </footer>
  )
}

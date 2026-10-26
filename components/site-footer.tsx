import Link from "next/link"
import { site } from "@/lib/site"
import { Logo } from "./logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant/60 bg-surface-container-lowest pb-28">
      <div className="shell grid gap-10 pt-14 pb-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <Logo size="lg" />
          <p className="mt-5 max-w-[30rem] text-body-md text-on-surface-variant">{site.description}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          {[...site.nav, { label: "Donate", href: "/donate" }].map((l) => (
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

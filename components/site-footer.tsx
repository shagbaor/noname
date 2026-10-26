import Link from "next/link"
import { nav, site, submitMailto } from "@/lib/site"
import { Logo } from "./logo"
import { SubscribeForm } from "./subscribe-form"

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant/60 bg-surface-container-lowest pb-28">
      {/* Mailing list + submissions, on every page */}
      <div className="shell grid gap-8 border-b border-outline-variant/60 py-10 md:grid-cols-2 md:gap-12">
        <div>
          <h2 className="text-headline-lg uppercase">Join the mailing list</h2>
          <p className="mt-1 mb-4 max-w-[28rem] text-body-sm text-on-surface-variant">
            New stories, testimonies and archive news, a few times a year. No spam; unsubscribe any time.
          </p>
          <SubscribeForm />
        </div>
        <div>
          <h2 className="text-headline-lg uppercase">Submit a story</h2>
          <p className="mt-1 max-w-[28rem] text-body-sm text-on-surface-variant">
            Essays, testimonies, letters, poems, photographs and more. Email your submission to
          </p>
          <a
            href={submitMailto()}
            className="mt-3 inline-flex items-center gap-2 text-title-lg text-on-surface underline decoration-terracotta decoration-2 underline-offset-[6px] transition-colors hover:text-primary"
          >
            {site.submissionsEmail}
          </a>
          <p className="mt-2 text-body-sm text-outline">
            <Link href="/submit" className="hover:text-on-surface">Read the submission guidelines →</Link>
          </p>
        </div>
      </div>

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
        <Link href="/about#for-oliver" className="normal-case tracking-normal italic font-serif text-[13px] text-on-surface-variant hover:text-marigold">
          Dedicated to Oliver, who always listened.
        </Link>
        <Link href="/admin" className="hover:text-on-surface-variant">
          Editors
        </Link>
      </div>
    </footer>
  )
}

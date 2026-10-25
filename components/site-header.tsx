"use client"

import { useState } from "react"
import { site } from "@/lib/site"
import { Button } from "./ui/button"

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/50 bg-surface/85 backdrop-blur-md">
      <div className="page-x mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 md:h-20">
        <a href="#top" className="flex items-baseline gap-2" aria-label={`${site.name}, home`}>
          <Mark />
          <span className="font-display text-[28px] leading-none tracking-wide md:text-[32px]">
            {site.name}
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-ghost text-label-lg uppercase text-on-surface-variant hover:text-on-surface"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#archive"
            aria-label="Search the archive"
            className="grid size-11 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <SearchIcon />
          </a>
          <Button href="#contribute" className="hidden sm:inline-flex">
            Contribute
          </Button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-on-surface hover:bg-surface-container-high lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="page-x border-t border-outline-variant/50 pb-6 lg:hidden">
          <ul className="divide-y divide-outline-variant/50">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-4 font-display text-headline-md"
                >
                  {item.label}
                  <span className="size-2 rounded-full bg-terracotta" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <Button href="#contribute" className="mt-4 w-full" onClick={() => setOpen(false)}>
            Contribute a story
          </Button>
        </nav>
      )}
    </header>
  )
}

function Mark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="translate-y-0.5">
      <path d="M12 2l10 10-10 10L2 12z" fill="#c2410c" />
      <path d="M12 7l5 5-5 5-5-5z" fill="#f59e0b" />
      <circle cx="12" cy="12" r="1.6" fill="#131316" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

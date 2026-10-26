"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { site } from "@/lib/site"
import { Logo } from "./logo"
import { Button } from "./ui/button"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 transition-[background-color,border-color] duration-300",
        scrolled || open
          ? "border-b border-outline-variant/50 bg-surface/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
        <Link href="/" aria-label={`${site.name}, home`} className="transition-opacity hover:opacity-85">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={clsx(
                "link-ghost text-label-lg uppercase transition-colors",
                isActive(item.href) ? "text-primary after:left-0! after:right-0!" : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/archive"
            aria-label="Search the archive"
            className="grid size-11 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </Link>
          <Button href="/donate" className="hidden sm:inline-flex">
            Donate
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
              <path
                className="origin-center transition-transform duration-300"
                style={{ transform: open ? "translateY(4px) rotate(45deg)" : undefined }}
                d="M4 8h16"
              />
              <path
                className="origin-center transition-transform duration-300"
                style={{ transform: open ? "translateY(-4px) rotate(-45deg)" : undefined }}
                d="M4 16h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={clsx(
          "grid overflow-hidden transition-[grid-template-rows] duration-400 ease-out lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <nav aria-label="Mobile" className="min-h-0" inert={!open}>
          <ul className="shell divide-y divide-outline-variant/50 pb-6">
            {site.nav.map((item, i) => (
              <li
                key={item.href}
                className={clsx("transition-[opacity,transform] duration-500", open ? "opacity-100" : "-translate-y-2 opacity-0")}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  className="flex items-center justify-between py-4 font-display text-headline-lg uppercase"
                >
                  {item.label}
                  <span
                    className={clsx("size-2 rotate-45", isActive(item.href) ? "bg-marigold" : "bg-terracotta")}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Button href="/donate" className="w-full">
                Donate
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

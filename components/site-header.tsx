"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { nav, site, type NavItem } from "@/lib/site"
import { Logo } from "./logo"
import { Button } from "./ui/button"

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menu, setMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    setMobileOpen(false)
    setMenu(null)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null)
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setMenu(null)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("keydown", onKey)
    document.addEventListener("click", onClick)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("keydown", onKey)
      document.removeEventListener("click", onClick)
    }
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      ref={ref}
      className={clsx(
        "sticky top-0 z-40 transition-[background-color,border-color] duration-300",
        scrolled || mobileOpen || menu
          ? "border-b border-outline-variant/50 bg-surface/90 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="shell flex h-14 items-center justify-between gap-6 md:h-16">
        <Link href="/" aria-label={`${site.name}, home`} className="transition-opacity hover:opacity-85">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            item.columns ? (
              <div
                key={item.href}
                // Wide (multi-column) menus anchor to the header; small ones to their button
                className={(item.columns.length ?? 0) > 1 ? undefined : "relative"}
                onMouseEnter={() => setMenu(item.label)}
                onMouseLeave={() => setMenu((m) => (m === item.label ? null : m))}
              >
                <button
                  type="button"
                  aria-expanded={menu === item.label}
                  aria-controls={`menu-${item.label}`}
                  onClick={() => setMenu((m) => (m === item.label ? null : item.label))}
                  className={clsx(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-label-lg uppercase transition-colors",
                    isActive(item.href) ? "text-primary" : "text-on-surface-variant hover:text-on-surface",
                  )}
                >
                  {item.label}
                  <Chevron open={menu === item.label} />
                </button>
                <DesktopMenu item={item} open={menu === item.label} />
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={clsx(
                  "rounded-full px-3.5 py-2 text-label-lg uppercase transition-colors",
                  isActive(item.href) ? "text-primary" : "text-on-surface-variant hover:text-on-surface",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/archive"
            aria-label="Search the archive"
            className="grid size-10 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </Link>
          <Button href="/donate" className="hidden sm:inline-flex">
            Donate
          </Button>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-on-surface hover:bg-surface-container-high lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path
                className="origin-center transition-transform duration-300"
                style={{ transform: mobileOpen ? "translateY(4px) rotate(45deg)" : undefined }}
                d="M4 8h16"
              />
              <path
                className="origin-center transition-transform duration-300"
                style={{ transform: mobileOpen ? "translateY(-4px) rotate(-45deg)" : undefined }}
                d="M4 16h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <MobileNav open={mobileOpen} isActive={isActive} />
    </header>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
      className={clsx("transition-transform duration-300", open && "rotate-180")}
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  )
}

function DesktopMenu({ item, open }: { item: NavItem; open: boolean }) {
  const cols = item.columns ?? []
  const wide = cols.length > 1
  return (
    <div
      id={`menu-${item.label}`}
      inert={!open}
      className={clsx(
        "absolute top-full transition-[opacity,transform] duration-300 ease-out",
        wide ? "inset-x-0" : "left-0 w-72 pt-2",
        open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
      )}
    >
      <div className={clsx(wide && "shell pt-2")}>
      <div
        className={clsx(
          "grid gap-6 overflow-hidden rounded-md border border-outline-variant/60 bg-surface-container-low p-5 shadow-sheet",
          wide && "grid-cols-4",
        )}
      >
        {cols.map((col) => (
          <div key={col.title}>
            {wide && (
              <Link href={col.href} className="mb-2 flex items-center gap-2 text-label-md uppercase text-primary hover:text-on-surface">
                <span className="size-1.5 rotate-45 bg-marigold" aria-hidden />
                {col.title}
              </Link>
            )}
            <ul className="space-y-0.5">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="block rounded-sm px-2 py-1.5 -mx-2 text-body-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface">
                    <span className={clsx(l.blurb && "block font-semibold text-on-surface")}>{l.label}</span>
                    {l.blurb && <span className="block text-[13px] text-outline">{l.blurb}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {wide && (
          <Link
            href={item.href}
            className="col-span-4 -mx-5 -mb-5 border-t border-outline-variant/60 px-5 py-3 text-label-md uppercase text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            All {item.label.toLowerCase()} →
          </Link>
        )}
      </div>
      </div>
    </div>
  )
}

function MobileNav({ open, isActive }: { open: boolean; isActive: (href: string) => boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  return (
    <div
      id="mobile-nav"
      className={clsx(
        "grid overflow-hidden transition-[grid-template-rows] duration-400 ease-out lg:hidden",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <nav aria-label="Mobile" className="min-h-0" inert={!open}>
        <ul className="shell max-h-[calc(100dvh-3.5rem)] divide-y divide-outline-variant/50 overflow-y-auto pb-5">
          {nav.map((item) => (
            <li key={item.href}>
              {item.columns ? (
                <>
                  <button
                    type="button"
                    aria-expanded={expanded === item.label}
                    onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}
                    className="flex w-full items-center justify-between py-3.5 font-display text-headline-md uppercase"
                  >
                    <span className={isActive(item.href) ? "text-primary" : undefined}>{item.label}</span>
                    <Chevron open={expanded === item.label} />
                  </button>
                  <div className={clsx("grid transition-[grid-template-rows] duration-300", expanded === item.label ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="min-h-0 overflow-hidden">
                      <div className="space-y-4 pb-4">
                        {item.columns.map((col) => (
                          <div key={col.title}>
                            {item.columns!.length > 1 && (
                              <Link href={col.href} className="text-label-md uppercase text-primary">
                                {col.title}
                              </Link>
                            )}
                            <ul className="mt-1.5 flex flex-wrap gap-1.5">
                              {col.links.map((l) => (
                                <li key={l.href + l.label}>
                                  <Link href={l.href} className="block rounded-full bg-surface-container-high px-3 py-1.5 text-label-md uppercase text-on-surface-variant">
                                    {l.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <Link href={item.href} className="inline-block text-label-md uppercase text-on-surface-variant">
                          All {item.label.toLowerCase()} →
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Link href={item.href} className="flex items-center justify-between py-3.5 font-display text-headline-md uppercase">
                  <span className={isActive(item.href) ? "text-primary" : undefined}>{item.label}</span>
                </Link>
              )}
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
  )
}

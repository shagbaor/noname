import clsx from "clsx"
import type { Metadata } from "next"
import Link from "next/link"
import { ArchiveNav } from "@/components/archive-nav"
import { PageHeader } from "@/components/page-header"
import { StoryGrid } from "@/components/story-grid"
import { SubmitBand } from "@/components/submit-band"
import { GROUPS, groupById, typesInGroup } from "@/lib/forms"
import { listPublished } from "@/lib/posts"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Archive" }

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; group?: string }>
}) {
  const sp = await searchParams
  const q = (sp.q ?? "").trim().slice(0, 100)
  const group = groupById(sp.group ?? "")
  const posts = await listPublished({
    q: q || undefined,
    forms: group ? typesInGroup(group.id).map((t) => t.id) : undefined,
    limit: 100,
  })
  const href = (g?: string) => {
    const qs = new URLSearchParams({ ...(q ? { q } : {}), ...(g ? { group: g } : {}) }).toString()
    return qs ? `/archive?${qs}` : "/archive"
  }

  return (
    <>
      <PageHeader
        eyebrow="Archive"
        title="Search the archive"
        intro="Search every published story by name, place, decade, language or keyword."
      >
        <ArchiveNav active="/archive" />
        <form action="/archive" role="search" className="mt-5 max-w-[40rem]">
          {group && <input type="hidden" name="group" value={group.id} />}
          <label htmlFor="archive-q" className="sr-only">
            Search the archive
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-outline"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              id="archive-q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Names, places, decades, languages…"
              className="h-12 w-full rounded-full border border-outline-variant bg-surface-container pr-28 pl-11 text-body-md text-on-surface transition-[border-color,box-shadow] duration-300 placeholder:text-outline focus:border-[1.5px] focus:border-terracotta focus:ring-4 focus:ring-terracotta/25 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute top-1 right-1 h-10 rounded-full bg-terracotta px-5 text-label-md uppercase text-on-primary-container transition-colors hover:bg-sienna"
            >
              Search
            </button>
          </div>
        </form>
        <nav aria-label="Filter by group" className="mt-4 flex flex-wrap gap-1.5">
          {[{ id: "", label: "Everything" }, ...GROUPS].map((g) => {
            const on = (group?.id ?? "") === g.id
            return (
              <Link
                key={g.id || "all"}
                href={href(g.id || undefined)}
                scroll={false}
                aria-current={on ? "page" : undefined}
                className={clsx(
                  "rounded-full px-3.5 py-1.5 text-label-md uppercase transition-colors duration-300",
                  on ? "bg-terracotta text-on-primary-container" : "bg-surface-container-high text-on-surface-variant hover:text-on-surface",
                )}
              >
                {g.label}
              </Link>
            )
          })}
        </nav>
      </PageHeader>

      <div className="shell pb-[clamp(3rem,6vw,5rem)]">
        <p className="mb-5 text-label-md uppercase text-outline" aria-live="polite">
          {posts.length} {posts.length === 1 ? "result" : "results"}
          {q && <> for “{q}”</>}
        </p>
        <StoryGrid posts={posts} empty="No matches. Try a different word, place or decade." />
      </div>
      <SubmitBand />
    </>
  )
}

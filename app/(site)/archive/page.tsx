import type { Metadata } from "next"
import { FormTabs } from "@/components/form-tabs"
import { PageHeader } from "@/components/page-header"
import { StoryGrid } from "@/components/story-grid"
import { isFormId } from "@/lib/forms"
import { countByForm, listPublished } from "@/lib/posts"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Archive" }

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; form?: string }>
}) {
  const sp = await searchParams
  const q = (sp.q ?? "").trim().slice(0, 100)
  const form = isFormId(sp.form) ? sp.form : undefined
  const [posts, counts] = await Promise.all([listPublished({ q: q || undefined, form, limit: 100 }), countByForm()])

  return (
    <>
      <PageHeader
        eyebrow="Archival retrieval"
        title="Search the archive"
        intro="Search every published story by name, place, decade, language or keyword."
      >
        <form action="/archive" role="search" className="max-w-[44rem]">
          {form && <input type="hidden" name="form" value={form} />}
          <label htmlFor="archive-q" className="sr-only">
            Search the archive
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-outline"
              width="20"
              height="20"
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
              className="h-14 w-full rounded-full border border-outline-variant bg-surface-container pr-32 pl-13 text-body-md text-on-surface transition-[border-color,box-shadow] duration-300 placeholder:text-outline focus:border-[1.5px] focus:border-terracotta focus:ring-4 focus:ring-terracotta/25 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute top-1.5 right-1.5 h-11 rounded-full bg-terracotta px-5 text-label-lg uppercase text-on-primary-container transition-colors hover:bg-sienna"
            >
              Search
            </button>
          </div>
        </form>
        <div className="mt-6">
          <FormTabs active={form} counts={counts} basePath="/archive" keep={q ? { q } : {}} />
        </div>
      </PageHeader>

      <div className="shell pb-[clamp(4rem,8vw,6rem)]">
        <p className="mb-6 text-label-lg uppercase text-outline" aria-live="polite">
          {posts.length} {posts.length === 1 ? "result" : "results"}
          {q && <> for “{q}”</>}
        </p>
        <StoryGrid posts={posts} empty="No matches. Try a different word, place or decade." />
      </div>
    </>
  )
}

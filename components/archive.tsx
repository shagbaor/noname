import { archiveCollections } from "@/lib/content"
import { SectionHeading } from "./section-heading"

const quick = ["Pride", "Letters", "1980s", "Nightlife", "Activism", "Spirituality", "Lagos", "Nairobi"]

export function Archive() {
  return (
    <section id="archive" className="bg-surface-container-lowest">
      <div className="page-x mx-auto grid max-w-[1440px] gap-10 py-space-2xl lg:grid-cols-12 lg:gap-8 lg:py-space-3xl">
        <div className="lg:col-span-7">
          <SectionHeading index="04" eyebrow="Archival retrieval" title="Search the archive" />

          <form action="#archive" role="search" className="mt-8">
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
                placeholder="Names, places, decades, languages…"
                className="h-14 w-full rounded-full border border-outline-variant bg-surface-container pr-32 pl-13 text-body-md text-on-surface placeholder:text-outline transition-[border-color,box-shadow] focus:border-[1.5px] focus:border-terracotta focus:ring-4 focus:ring-terracotta/25 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute top-1.5 right-1.5 h-11 rounded-full bg-terracotta px-5 text-label-lg uppercase text-on-primary-container transition-colors hover:bg-sienna"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {quick.map((q) => (
              <a
                key={q}
                href={`#archive`}
                className="rounded-full bg-surface-container-high px-3.5 py-1.5 text-label-md uppercase text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
              >
                {q}
              </a>
            ))}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 self-end lg:col-span-4 lg:col-start-9">
          {archiveCollections.map((c, i) => (
            <div
              key={c.label}
              className="rounded-md border border-outline-variant/60 bg-surface-container-low p-5"
            >
              <dt className="flex items-center gap-2 text-label-md uppercase text-on-surface-variant">
                <span
                  className={i % 2 ? "size-1.5 rounded-full bg-marigold" : "size-1.5 rounded-full bg-terracotta"}
                  aria-hidden
                />
                {c.label}
              </dt>
              <dd className="mt-2 font-display text-[44px] leading-none tabular-nums">
                {c.count.toLocaleString("en")}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

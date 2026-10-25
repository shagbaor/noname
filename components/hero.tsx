import { featuredEssay } from "@/lib/content"
import { TextileArt } from "./textile"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

export function Hero() {
  const e = featuredEssay
  return (
    <section id="top" className="page-x mx-auto max-w-[1440px] pt-10 pb-space-2xl md:pt-16 lg:pb-space-3xl">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-8 md:gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Masthead */}
        <div className="col-span-4 md:col-span-8 lg:col-span-7">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Badge tone="terracotta">Vol. 01 · Archive &amp; Journal</Badge>
            <Badge tone="acacia">
              <span className="size-1.5 rounded-full bg-tertiary" aria-hidden />
              318 testimonies recorded
            </Badge>
          </div>

          <h1 className="text-display-xl uppercase">
            Our histories
            <br />
            were <span className="text-terracotta">never</span>
            <br />
            silent<span className="text-marigold">.</span>
          </h1>

          <p className="mt-8 max-w-[38rem] text-body-lg text-on-surface-variant">
            An archive and journal of queer African life — essays, oral histories, letters and
            photographs, gathered with care and held in community. Memory as resistance. Memory
            as joy.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="#archive">Explore the archive</Button>
            <Button href="#testimonies" variant="secondary-violet">
              <PlayGlyph /> Listen to testimonies
            </Button>
          </div>
        </div>

        {/* Lead feature — offset into the 4-column annotation track */}
        <aside className="col-span-4 md:col-span-6 md:col-start-2 lg:col-span-5 lg:col-start-8 lg:mt-24">
          <a
            href={`#essays`}
            className="group block overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-low shadow-sheet transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <TextileArt
                pattern={e.pattern}
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/80 to-transparent p-6 pt-24">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge tone="violet">{e.category}</Badge>
                  <Badge>{e.readMinutes} min read</Badge>
                </div>
                <h2 className="text-display-sm uppercase">{e.title}</h2>
              </div>
            </div>
            <div className="space-y-4 p-6 pt-2">
              <p className="text-body-md text-on-surface-variant">{e.dek}</p>
              <dl className="flex flex-wrap gap-x-6 gap-y-1 text-label-md uppercase text-outline">
                <div className="flex gap-1.5">
                  <dt className="sr-only">Region</dt>
                  <dd>{e.region}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="sr-only">Era</dt>
                  <dd>{e.era}</dd>
                </div>
              </dl>
            </div>
          </a>
        </aside>
      </div>
    </section>
  )
}

function PlayGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  )
}

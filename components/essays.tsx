import { essays } from "@/lib/content"
import { SectionHeading } from "./section-heading"
import { TextileArt } from "./textile"
import { Badge, categoryTone } from "./ui/badge"
import { Button } from "./ui/button"

export function Essays() {
  return (
    <section id="essays" className="page-x mx-auto max-w-[1440px] py-space-2xl lg:py-space-3xl">
      <SectionHeading
        index="01"
        eyebrow="From the journal"
        title="Essays & retrospectives"
        action={<Button href="#essays" variant="ghost">All essays →</Button>}
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {essays.map((e) => (
          <article
            key={e.slug}
            className="group relative flex flex-col overflow-hidden rounded-md border border-outline-variant/60 bg-surface-container-low shadow-card transition-colors hover:border-outline"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <TextileArt pattern={e.pattern} className="transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="flex flex-wrap gap-2">
                <Badge tone={categoryTone(e.category)}>{e.category}</Badge>
                <Badge>{e.era}</Badge>
              </div>
              <h3 className="text-headline-lg uppercase">
                <a href={`#essays`} className="after:absolute after:inset-0 focus-visible:outline-none">
                  {e.title}
                </a>
              </h3>
              <p className="text-body-md text-on-surface-variant">{e.dek}</p>
              <p className="mt-auto flex items-center justify-between border-t border-outline-variant/60 pt-4 text-label-md uppercase text-outline">
                <span>{e.region}</span>
                <span className="tabular-nums">{e.readMinutes} min</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

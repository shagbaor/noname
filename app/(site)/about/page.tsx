import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { TextileArt } from "@/components/textile"
import { Button } from "@/components/ui/button"
import { GROUPS, typesInGroup } from "@/lib/forms"
import { site, submitMailto } from "@/lib/site"

export const metadata: Metadata = {
  title: "What we're about",
  description: `Why ${site.name} exists, what we collect, and how we care for the stories in our keeping.`,
}

const principles = [
  {
    title: "Consent leads",
    body: "Nothing is published without the permission of the people in it. Narrators choose what is public, what is anonymous, and what stays with family. Consent can be withdrawn at any time.",
  },
  {
    title: "Care over speed",
    body: "We record slowly and edit gently. Names, places and faces are protected when publishing them could put someone at risk.",
  },
  {
    title: "Joy belongs in the record",
    body: "Our histories are not only stories of harm. We keep the weddings, the jokes, the dance floors and the love letters too.",
  },
  {
    title: "Open to all",
    body: "Reading, listening and searching the archive is free, forever. Stories are told in the languages they were lived in, with translation where we can.",
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="What we're about"
        title={
          <>
            Our histories, <span className="text-terracotta">in our own words</span>
          </>
        }
        intro={`${site.name} is a living archive and journal of queer African life. We gather, protect and share the stories that official records left out, so the people who come after us know we were always here.`}
      />

      {/* Mission */}
      <section className="shell section-y border-t border-outline-variant/60">
        <div className="grid items-center gap-[clamp(1.5rem,4vw,3rem)] lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="text-display-lg uppercase">Why we exist</h2>
            <div className="mt-4 space-y-4 text-body-lg text-on-surface-variant">
              <p>
                Colonial laws, censorship and fear pushed queer African lives out of libraries, newspapers and
                textbooks. But the stories never disappeared. They were kept in songs and letters, in kitchens and on
                dance floors, in the memories of elders.
              </p>
              <p>
                We exist to bring those stories home: to record them before they are lost, to keep them safe, and to
                share them with care, across the continent and the diaspora.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <figure className="relative overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container p-6">
              <div className="absolute inset-0 opacity-25">
                <TextileArt pattern="adire" />
              </div>
              <blockquote className="relative font-serif text-[1.35rem] leading-snug italic">
                “The archive is just us, remembering out loud.”
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* What we keep */}
      <section className="shell section-y">
        <Reveal>
          <h2 className="text-display-lg uppercase">What we keep</h2>
          <p className="mt-2 max-w-[36rem] text-body-md text-on-surface-variant">
            Stories come to us in many forms. We care for all of them.
          </p>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((g, i) => (
            <Reveal key={g.id} delay={i * 80}>
              <Link
                href={`/stories/${g.id}`}
                className="group block h-full rounded-md border border-outline-variant/60 bg-surface-container-low p-5 transition-[border-color,transform] duration-500 hover:-translate-y-0.5 hover:border-outline"
              >
                <h3 className="text-headline-lg uppercase">{g.label}</h3>
                <p className="mt-1 text-body-sm text-on-surface-variant">{g.blurb}</p>
                <p className="mt-3 text-label-sm uppercase text-outline">
                  {typesInGroup(g.id).map((t) => t.plural).join(" · ")}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="bg-surface-container-lowest">
        <div className="shell section-y">
          <Reveal>
            <h2 className="text-display-lg uppercase">How we work</h2>
          </Reveal>
          <ol className="mt-6 grid gap-x-8 gap-y-2 md:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={(i % 2) * 80} className="border-t border-outline-variant/60 py-5">
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-[1.5rem] leading-none tabular-nums text-terracotta">0{i + 1}</span>
                  <span className="text-title-lg">{p.title}</span>
                </p>
                <p className="mt-2 text-body-md text-on-surface-variant">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Get involved */}
      <section className="shell section-y">
        <Reveal className="grid gap-6 rounded-lg border border-outline-variant/60 bg-surface-container-low p-[clamp(1.5rem,4vw,2.5rem)] md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-display-sm uppercase">Get involved</h2>
            <p className="mt-2 max-w-[36rem] text-body-md text-on-surface-variant">
              Read and share the stories, support the work, or send us a story that belongs here. Submissions are made by
              email to{" "}
              <a href={submitMailto()} className="font-semibold text-on-surface underline decoration-terracotta underline-offset-4 hover:text-primary">
                {site.submissionsEmail}
              </a>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/stories" variant="secondary">
              Read the stories
            </Button>
            <Button href="/submit" variant="secondary-violet">
              Submit a story
            </Button>
            <Button href="/donate">Donate</Button>
          </div>
        </Reveal>
      </section>
    </>
  )
}

import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { GROUPS, typesInGroup } from "@/lib/forms"
import { site, submitMailto } from "@/lib/site"

export const metadata: Metadata = {
  title: "Submit a story",
  description: `Send your story to ${site.name} by email: ${site.submissionsEmail}`,
}

const steps = [
  {
    title: "Write to us",
    body: "Email your story, or a short note about it, with any files attached or linked. Large audio, video or photo sets can be shared with a link (Google Drive, Dropbox, WeTransfer).",
  },
  {
    title: "Tell us how to credit you",
    body: "Your full name, initials, a pseudonym, or anonymous. If other people appear in your story, let us know whether they've agreed to be included.",
  },
  {
    title: "We reply and work with you",
    body: "An editor will read your submission and reply. Nothing is published without your final approval, and you can ask us to take it down at any time.",
  },
]

export default function SubmitPage() {
  return (
    <>
      <PageHeader
        eyebrow="Submissions"
        title={
          <>
            Your story <span className="text-terracotta">belongs here</span>
          </>
        }
        intro="We welcome stories in every form from across the continent and the diaspora. Submissions are made by email."
      >
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={submitMailto()}
            className="inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-3 text-label-lg uppercase text-on-primary-container shadow-card transition-[background-color,transform] hover:-translate-y-px hover:bg-sienna"
          >
            Email your submission
          </a>
          <a href={submitMailto()} className="text-title-lg underline decoration-terracotta decoration-2 underline-offset-[6px] hover:text-primary">
            {site.submissionsEmail}
          </a>
        </div>
      </PageHeader>

      <section className="shell section-y border-t border-outline-variant/60">
        <Reveal>
          <h2 className="text-display-lg uppercase">How it works</h2>
        </Reveal>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 80} className="rounded-md border border-outline-variant/60 bg-surface-container-low p-5">
              <span className="font-display text-[1.75rem] leading-none tabular-nums text-terracotta">0{i + 1}</span>
              <h3 className="mt-2 text-title-lg">{s.title}</h3>
              <p className="mt-1.5 text-body-sm text-on-surface-variant">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="shell section-y pt-0!">
        <Reveal>
          <h2 className="text-display-lg uppercase">What you can send</h2>
          <p className="mt-2 max-w-[36rem] text-body-md text-on-surface-variant">
            Pick the closest fit; it pre-fills the email subject. Not sure? Just write to us.
          </p>
        </Reveal>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((g, i) => (
            <Reveal key={g.id} delay={i * 70}>
              <h3 className="text-headline-md uppercase">{g.label}</h3>
              <ul className="mt-2 divide-y divide-outline-variant/50 border-y border-outline-variant/50">
                {typesInGroup(g.id).map((t) => (
                  <li key={t.id}>
                    <a
                      href={submitMailto(t.label)}
                      className="group flex items-center justify-between gap-2 py-2 text-body-sm text-on-surface-variant transition-colors hover:text-on-surface"
                    >
                      {t.plural}
                      <span className="text-label-sm uppercase text-outline transition-colors group-hover:text-primary">Email →</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-lowest">
        <div className="shell section-y">
          <Reveal className="max-w-[44rem]">
            <h2 className="text-display-sm uppercase">Your safety comes first</h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              If sharing your story could put you or others at risk, tell us. We can remove names, places and identifying
              details, publish under a pseudonym, or hold a story privately in the archive until it is safe to share.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}

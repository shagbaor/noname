import Link from "next/link"
import { site, submitMailto } from "@/lib/site"
import { Reveal } from "./reveal"

/** "Share your story" prompt; `type` pre-fills the email subject. */
export function SubmitBand({ type, className }: { type?: string; className?: string }) {
  return (
    <section className={className ?? "shell pb-[clamp(3rem,6vw,5rem)]"}>
      <Reveal className="flex flex-col gap-4 rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-[clamp(1.25rem,3vw,2rem)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-label-md uppercase text-primary">
            <span className="size-1.5 rotate-45 bg-marigold" aria-hidden />
            Submissions open
          </p>
          <h2 className="mt-1 text-headline-lg uppercase">
            {type ? `Have ${aOrAn(type)} ${type.toLowerCase()} for the archive?` : "Have a story for the archive?"}
          </h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Email it to{" "}
            <a href={submitMailto(type)} className="font-semibold text-on-surface underline decoration-terracotta underline-offset-4 hover:text-primary">
              {site.submissionsEmail}
            </a>
            . You choose how you&apos;re credited, including anonymously.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <a
            href={submitMailto(type)}
            className="inline-flex items-center justify-center rounded-full bg-terracotta px-5 py-2.5 text-label-lg uppercase text-on-primary-container transition-[background-color,transform] hover:-translate-y-px hover:bg-sienna"
          >
            Email a submission
          </a>
          <Link href="/submit" className="inline-flex items-center rounded-full px-3 py-2.5 text-label-lg uppercase text-on-surface-variant hover:text-on-surface">
            Guidelines →
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

function aOrAn(word: string) {
  return /^[aeiou]/i.test(word) ? "an" : "a"
}

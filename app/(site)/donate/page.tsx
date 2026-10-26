import type { Metadata } from "next"
import { DonateForm } from "@/components/donate-form"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { site } from "@/lib/site"

export const metadata: Metadata = { title: "Donate" }

const impact = [
  { amount: "$10", text: "Transcribes ten minutes of a recorded testimony." },
  { amount: "$25", text: "Translates a transcript into a second language." },
  { amount: "$50", text: "Digitises and preserves a box of letters or photographs." },
  { amount: "$100", text: "Funds a full oral history session with a narrator." },
]

export default function DonatePage() {
  return (
    <>
      <PageHeader
        eyebrow="Support the archive"
        title={
          <>
            Keep our histories <span className="text-terracotta">alive</span>
          </>
        }
        intro={`${site.name} is free to read and listen to, forever. Your gift pays for recording, transcription, translation and safe storage, so no story is lost again.`}
      />

      <div className="shell grid gap-[clamp(2rem,5vw,4rem)] pb-[clamp(4rem,8vw,6rem)] lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <DonateForm donateUrl={site.donateUrl} />
        </Reveal>

        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal>
            <h2 className="text-headline-lg uppercase">What your gift does</h2>
          </Reveal>
          <ul className="mt-6 divide-y divide-outline-variant/60 border-y border-outline-variant/60">
            {impact.map((i, n) => (
              <Reveal as="li" key={i.amount} delay={n * 80} className="flex gap-6 py-5">
                <span className="w-16 shrink-0 font-display text-[2rem] leading-none text-marigold">{i.amount}</span>
                <span className="text-body-md text-on-surface-variant">{i.text}</span>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-10 rounded-md bg-surface-container-low p-6">
            <h3 className="text-title-lg">Your privacy</h3>
            <p className="mt-2 text-body-sm text-on-surface-variant">
              We never publish donor names without permission. Gifts are processed by our payment
              provider; we don&apos;t store card details.
            </p>
          </Reveal>
        </div>
      </div>
    </>
  )
}

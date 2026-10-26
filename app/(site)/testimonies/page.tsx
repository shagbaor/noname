import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { TestimonyRow } from "@/components/testimony-row"
import { listPublished } from "@/lib/posts"
import { toTrack } from "@/lib/track"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Testimonies" }

export default async function TestimoniesPage() {
  const posts = await listPublished({ form: "oral-history" })
  return (
    <>
      <PageHeader
        eyebrow="Oral history index"
        title="Voices in the archive"
        intro="Recorded testimonies in narrators' own words and languages. Press play on any recording; it keeps playing as you browse."
      />
      <div className="shell pb-[clamp(4rem,8vw,6rem)]">
        {posts.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">No testimonies published yet.</p>
        ) : (
          <ul className="divide-y divide-outline-variant/60 border-y border-outline-variant/60">
            {posts.map((t, i) => (
              <Reveal as="li" key={t.id} delay={(i % 4) * 70}>
                <TestimonyRow track={toTrack(t)} location={t.location} recorded={t.era} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

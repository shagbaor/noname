import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { StoryGrid } from "@/components/story-grid"
import { listPublished } from "@/lib/posts"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Essays" }

export default async function EssaysPage() {
  const posts = await listPublished({ form: "essay" })
  return (
    <>
      <PageHeader
        eyebrow="From the journal"
        title="Essays"
        intro="Long reads on history, language, faith, law and love, written by scholars, organisers and the people who lived it."
      />
      <div className="shell pb-[clamp(4rem,8vw,6rem)]">
        <StoryGrid posts={posts} />
      </div>
    </>
  )
}

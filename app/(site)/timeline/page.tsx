import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { TimelineList } from "@/components/timeline-list"
import { timeline } from "@/lib/content"

export const metadata: Metadata = { title: "Timeline" }

export default function TimelinePage() {
  return (
    <>
      <PageHeader
        eyebrow="A living timeline"
        title="Moments we carry"
        intro="Milestones of struggle, law and celebration across the continent. This timeline grows as the archive does."
      />
      <div className="shell pb-[clamp(4rem,8vw,6rem)]">
        <TimelineList entries={timeline} />
      </div>
    </>
  )
}

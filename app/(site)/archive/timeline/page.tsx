import type { Metadata } from "next"
import { ArchiveNav } from "@/components/archive-nav"
import { PageHeader } from "@/components/page-header"
import { TimelineList } from "@/components/timeline-list"
import { timeline } from "@/lib/content"

export const metadata: Metadata = { title: "Timeline" }

export default function TimelinePage() {
  return (
    <>
      <PageHeader
        eyebrow="Archive"
        title="Moments we carry"
        intro="Milestones of struggle, law and celebration across the continent. This timeline grows as the archive does."
      >
        <ArchiveNav active="/archive/timeline" />
      </PageHeader>
      <div className="shell pb-[clamp(3rem,6vw,5rem)]">
        <TimelineList entries={timeline} />
      </div>
    </>
  )
}

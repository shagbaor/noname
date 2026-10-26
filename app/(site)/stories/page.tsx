import type { Metadata } from "next"
import { FormTabs } from "@/components/form-tabs"
import { PageHeader } from "@/components/page-header"
import { StoryGrid } from "@/components/story-grid"
import { formMeta, isFormId } from "@/lib/forms"
import { countByForm, listPublished } from "@/lib/posts"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Stories" }

export default async function StoriesPage({ searchParams }: { searchParams: Promise<{ form?: string }> }) {
  const { form: raw } = await searchParams
  const form = isFormId(raw) ? raw : undefined
  const [posts, counts] = await Promise.all([listPublished({ form }), countByForm()])
  const meta = form ? formMeta(form) : null

  return (
    <>
      <PageHeader
        eyebrow="Stories"
        title={meta ? meta.plural : "Stories in every form"}
        intro={
          meta
            ? meta.blurb
            : "Essays, oral histories, letters, poems, photographs, conversations and fiction: the many ways our histories are told."
        }
      >
        <FormTabs active={form} counts={counts} />
      </PageHeader>
      <div className="shell pb-[clamp(4rem,8vw,6rem)]">
        <StoryGrid posts={posts} />
      </div>
    </>
  )
}

import Link from "next/link"
import { notFound } from "next/navigation"
import { DeleteButton } from "@/components/admin/delete-button"
import { PostEditor } from "@/components/admin/post-editor"
import { getById } from "@/lib/posts"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const post = await getById(Number((await params).id))
  if (!post) notFound()
  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="text-label-md uppercase text-outline hover:text-on-surface">
            ← All posts
          </Link>
          <h1 className="mt-2 text-display-lg uppercase">Edit post</h1>
        </div>
        <div className="flex items-center gap-2">
          {post.status === "published" && (
            <Link href={`/stories/${post.slug}`} className="rounded-full px-3 py-1.5 text-label-md uppercase text-outline hover:text-on-surface">
              View live ↗
            </Link>
          )}
          <DeleteButton id={post.id} title={post.title} label="Delete post" />
        </div>
      </div>
      <PostEditor post={post} />
    </>
  )
}

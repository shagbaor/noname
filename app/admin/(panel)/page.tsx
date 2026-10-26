import Link from "next/link"
import { DeleteButton } from "@/components/admin/delete-button"
import { Badge, formTone } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/format"
import { formMeta } from "@/lib/forms"
import { listAll } from "@/lib/posts"

export default async function AdminPosts({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const [posts, sp] = await Promise.all([listAll(), searchParams])
  const published = posts.filter((p) => p.status === "published").length

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display-lg uppercase">Posts</h1>
          <p className="text-body-sm text-on-surface-variant">
            {posts.length} total · {published} published · {posts.length - published} drafts
          </p>
        </div>
        <Button href="/admin/posts/new">New post</Button>
      </div>

      {(sp.saved || sp.deleted) && (
        <p role="status" className="animate-rise mt-6 rounded-sm bg-tertiary-container/30 px-4 py-3 text-body-sm text-on-tertiary-container">
          {sp.saved ? `Saved “${sp.saved}”.` : "Post deleted."}
        </p>
      )}

      {posts.length === 0 ? (
        <p className="mt-10 rounded-md border border-dashed border-outline-variant p-10 text-center text-on-surface-variant">
          No posts yet. <Link href="/admin/posts/new" className="text-primary underline">Write the first one.</Link>
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-md border border-outline-variant/60">
          <table className="w-full min-w-[40rem] text-left text-body-sm">
            <thead className="bg-surface-container text-label-md uppercase text-on-surface-variant">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Form</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {posts.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-surface-container-low">
                  <td className="px-4 py-3">
                    <Link href={`/admin/posts/${p.id}`} className="font-semibold text-on-surface hover:text-primary">
                      {p.title}
                    </Link>
                    {p.featured && <span className="ml-2 text-label-sm uppercase text-marigold">★ Featured</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={formTone(p.form)}>{formMeta(p.form).label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={p.status === "published" ? "acacia" : "neutral"}>{p.status}</Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-on-surface-variant">{formatDate(p.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {p.status === "published" && (
                        <Link href={`/stories/${p.slug}`} className="rounded-full px-3 py-1.5 text-label-md uppercase text-outline hover:text-on-surface">
                          View
                        </Link>
                      )}
                      <Link href={`/admin/posts/${p.id}`} className="rounded-full border border-outline-variant px-3 py-1.5 text-label-md uppercase hover:border-outline">
                        Edit
                      </Link>
                      <DeleteButton id={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

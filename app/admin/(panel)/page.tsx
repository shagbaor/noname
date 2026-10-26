import Link from "next/link"
import { DeleteButton } from "@/components/admin/delete-button"
import { Badge, formTone } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/format"
import { formMeta, GROUPS, isFormId, storyHref, typesInGroup } from "@/lib/forms"
import { countAll, listAll } from "@/lib/posts"
import { inputClass } from "@/components/admin/field"

export default async function AdminPosts({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; q?: string; form?: string; status?: string }>
}) {
  const sp = await searchParams
  const q = (sp.q ?? "").trim().slice(0, 100)
  const form = isFormId(sp.form) ? sp.form : ""
  const status = sp.status === "published" || sp.status === "draft" ? sp.status : ""
  const filtering = Boolean(q || form || status)
  const [posts, totals] = await Promise.all([listAll({ q, form, status }), countAll()])

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display-lg uppercase">Posts</h1>
          <p className="text-body-sm text-on-surface-variant">
            {totals.total} total · {totals.published} published · {totals.total - totals.published} drafts
          </p>
        </div>
        <Button href="/admin/posts/new">New post</Button>
      </div>

      {(sp.saved || sp.deleted) && (
        <p role="status" className="animate-rise mt-6 rounded-sm bg-tertiary-container/30 px-4 py-3 text-body-sm text-on-tertiary-container">
          {sp.saved ? `Saved “${sp.saved}”.` : "Post deleted."}
        </p>
      )}

      <form role="search" action="/admin" className="mt-6 flex flex-wrap items-end gap-3">
        <label className="min-w-[14rem] flex-1">
          <span className="sr-only">Search posts</span>
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search title, author, place or text…"
            className={inputClass}
          />
        </label>
        <label>
          <span className="sr-only">Type</span>
          <select name="form" defaultValue={form} className={inputClass}>
            <option value="">All types</option>
            {GROUPS.map((g) => (
              <optgroup key={g.id} label={g.label}>
                {typesInGroup(g.id).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.plural}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Status</span>
          <select name="status" defaultValue={status} className={inputClass}>
            <option value="">Any status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <button type="submit" className="h-[50px] rounded-full bg-terracotta px-5 text-label-md uppercase text-on-primary-container hover:bg-sienna">
          Search
        </button>
        {filtering && (
          <Link href="/admin" className="px-2 py-3 text-label-md uppercase text-outline hover:text-on-surface">
            Clear
          </Link>
        )}
      </form>
      {filtering && (
        <p className="mt-3 text-label-md uppercase text-outline" aria-live="polite">
          {posts.length} {posts.length === 1 ? "match" : "matches"}
          {q && <> for “{q}”</>}
        </p>
      )}

      {posts.length === 0 ? (
        <p className="mt-6 rounded-md border border-dashed border-outline-variant p-10 text-center text-on-surface-variant">
          {filtering ? (
            "No posts match. Try a different word or clear the filters."
          ) : (
            <>
              No posts yet. <Link href="/admin/posts/new" className="text-primary underline">Write the first one.</Link>
            </>
          )}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-md border border-outline-variant/60">
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
                        <Link href={storyHref(p)} className="rounded-full px-3 py-1.5 text-label-md uppercase text-outline hover:text-on-surface">
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

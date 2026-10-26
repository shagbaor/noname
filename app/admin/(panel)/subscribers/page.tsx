import Link from "next/link"
import { inputClass } from "@/components/admin/field"
import { formatDate } from "@/lib/format"
import { countSubscribers, listSubscribers } from "@/lib/subscribers"
import { removeSubscriber } from "../../actions"
import { ConfirmButton } from "@/components/admin/confirm-button"

export default async function SubscribersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 100)
  const [subs, total] = await Promise.all([listSubscribers(q || undefined), countSubscribers()])

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display-lg uppercase">Subscribers</h1>
          <p className="text-body-sm text-on-surface-variant">
            {total} {total === 1 ? "person" : "people"} on the mailing list
          </p>
        </div>
        <a
          href="/admin/subscribers.csv"
          className="inline-flex items-center rounded-full border-[1.5px] border-terracotta px-5 py-2.5 text-label-lg uppercase hover:bg-terracotta/15"
        >
          Export CSV
        </a>
      </div>

      <form role="search" action="/admin/subscribers" className="mt-6 flex flex-wrap gap-3">
        <label className="min-w-[14rem] flex-1">
          <span className="sr-only">Search subscribers</span>
          <input name="q" type="search" defaultValue={q} placeholder="Search by email or page…" className={inputClass} />
        </label>
        <button type="submit" className="h-[50px] rounded-full bg-terracotta px-5 text-label-md uppercase text-on-primary-container hover:bg-sienna">
          Search
        </button>
        {q && (
          <Link href="/admin/subscribers" className="px-2 py-3 text-label-md uppercase text-outline hover:text-on-surface">
            Clear
          </Link>
        )}
      </form>

      {subs.length === 0 ? (
        <p className="mt-6 rounded-md border border-dashed border-outline-variant p-10 text-center text-on-surface-variant">
          {q ? "No subscribers match." : "No subscribers yet. The sign-up form is in the footer of every page."}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-md border border-outline-variant/60">
          <table className="w-full min-w-[34rem] text-left text-body-sm">
            <thead className="bg-surface-container text-label-md uppercase text-on-surface-variant">
              <tr>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Signed up on</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {subs.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container-low">
                  <td className="px-4 py-3">
                    <a href={`mailto:${s.email}`} className="text-on-surface hover:text-primary">{s.email}</a>
                  </td>
                  <td className="px-4 py-3 font-mono text-[13px] text-on-surface-variant">{s.source || "—"}</td>
                  <td className="px-4 py-3 tabular-nums text-on-surface-variant">{formatDate(s.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <ConfirmButton action={removeSubscriber} id={s.id} message={`Remove ${s.email} from the list?`} label="Remove" />
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

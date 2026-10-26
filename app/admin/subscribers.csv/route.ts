import { getSession } from "@/lib/auth"
import { listSubscribers } from "@/lib/subscribers"

export const dynamic = "force-dynamic"

/** Downloads the mailing list as CSV (editors only). */
export async function GET() {
  if (!(await getSession())) return new Response("Not found", { status: 404 })
  const subs = await listSubscribers()
  // Quote every field; neutralise spreadsheet formula injection
  const cell = (v: string) => `"${(/^[=+\-@]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`
  const rows = [
    ["email", "signed_up_on", "date"],
    ...subs.map((s) => [s.email, s.source, new Date(s.createdAt).toISOString()]),
  ]
  const csv = rows.map((r) => r.map(cell).join(",")).join("\r\n")
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}

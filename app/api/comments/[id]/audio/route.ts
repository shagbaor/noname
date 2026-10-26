import { getSession } from "@/lib/auth"
import { getAudio } from "@/lib/comments"

export const dynamic = "force-dynamic"

const SAFE_TYPES = new Set(["audio/webm", "audio/ogg", "audio/mp4", "audio/wav", "audio/mpeg"])

/**
 * Streams a comment's voice note. Approved notes are public; pending ones are
 * editors-only. Supports Range requests (Safari needs them to play audio).
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id)
  const row = id ? await getAudio(id) : null
  if (!row || (row.status !== "approved" && !(await getSession()))) return new Response("Not found", { status: 404 })

  const buf = row.audio
  const total = buf.length
  const headers: Record<string, string> = {
    "Content-Type": SAFE_TYPES.has(row.type) ? row.type : "application/octet-stream",
    "Accept-Ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
    "Content-Disposition": "inline",
    "Cache-Control": row.status === "approved" ? "public, max-age=3600" : "private, no-store",
  }

  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") ?? "")
  if (range) {
    let start = range[1] ? Number(range[1]) : total - Number(range[2])
    let end = range[1] && range[2] ? Number(range[2]) : total - 1
    if (!range[1]) end = total - 1
    start = Math.max(0, start)
    end = Math.min(end, total - 1)
    if (start > end || start >= total)
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${total}` } })
    return new Response(new Uint8Array(buf.subarray(start, end + 1)), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${total}`, "Content-Length": String(end - start + 1) },
    })
  }
  return new Response(new Uint8Array(buf), { headers: { ...headers, "Content-Length": String(total) } })
}

import "server-only"
import { query } from "./db"

export type Comment = {
  id: number
  postId: number
  name: string
  body: string
  hasAudio: boolean
  audioBytes: number
  status: "pending" | "approved"
  createdAt: Date
}

export type AdminComment = Comment & { postTitle: string; postSlug: string; postForm: string }

const COLS = `c.id, c.post_id AS "postId", c.name, c.body, (c.audio IS NOT NULL) AS "hasAudio",
  c.audio_bytes AS "audioBytes", c.status, c.created_at AS "createdAt"`

export async function listApproved(postId: number): Promise<Comment[]> {
  return query<Comment>(
    `SELECT ${COLS} FROM comments c WHERE c.post_id = $1 AND c.status = 'approved' ORDER BY c.created_at ASC LIMIT 500`,
    [postId],
  )
}

/** How many comments this (hashed) visitor posted recently. */
export async function recentCount(ipHash: string, minutes: number): Promise<number> {
  const rows = await query<{ n: number }>(
    `SELECT count(*)::int AS n FROM comments WHERE ip_hash = $1 AND created_at > now() - make_interval(mins => $2)`,
    [ipHash, minutes],
  )
  return rows[0]?.n ?? 0
}

export async function isDuplicate(ipHash: string, body: string): Promise<boolean> {
  if (!body) return false
  const rows = await query<{ id: number }>(
    `SELECT id FROM comments WHERE (ip_hash = $1 OR created_at > now() - interval '1 day') AND lower(body) = lower($2) LIMIT 1`,
    [ipHash, body],
  )
  return rows.length > 0
}

export async function addComment(c: {
  postId: number
  name: string
  body: string
  audio: Buffer | null
  audioType: string
  ipHash: string
}) {
  await query(
    `INSERT INTO comments (post_id, name, body, audio, audio_type, audio_bytes, ip_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [c.postId, c.name, c.body, c.audio, c.audioType, c.audio?.length ?? 0, c.ipHash],
  )
}

export async function getAudio(id: number) {
  const rows = await query<{ audio: Buffer; type: string; status: string }>(
    `SELECT audio, audio_type AS type, status FROM comments WHERE id = $1 AND audio IS NOT NULL`,
    [id],
  )
  return rows[0] ?? null
}

// ---- Admin ----

export async function listForAdmin(filter: { status?: string; q?: string }): Promise<AdminComment[]> {
  const where: string[] = []
  const params: unknown[] = []
  if (filter.status) {
    params.push(filter.status)
    where.push(`c.status = $${params.length}`)
  }
  if (filter.q) {
    params.push(`%${filter.q}%`)
    where.push(`(c.body ILIKE $${params.length} OR c.name ILIKE $${params.length} OR p.title ILIKE $${params.length})`)
  }
  return query<AdminComment>(
    `SELECT ${COLS}, p.title AS "postTitle", p.slug AS "postSlug", p.form AS "postForm"
     FROM comments c JOIN posts p ON p.id = c.post_id
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY c.created_at DESC LIMIT 500`,
    params,
  )
}

export async function countPending(): Promise<number> {
  const rows = await query<{ n: number }>(`SELECT count(*)::int AS n FROM comments WHERE status = 'pending'`)
  return rows[0]?.n ?? 0
}

export async function setCommentStatus(id: number, status: "pending" | "approved") {
  await query(
    `UPDATE comments SET status = $2, approved_at = CASE WHEN $2 = 'approved' THEN now() END WHERE id = $1`,
    [id, status],
  )
}

export async function deleteComment(id: number) {
  await query(`DELETE FROM comments WHERE id = $1`, [id])
}

/** Removes every comment from the same (hashed) source as this one: one click to clear a spam burst. */
export async function deleteFromSameSource(id: number) {
  await query(
    `DELETE FROM comments WHERE ip_hash = (SELECT ip_hash FROM comments WHERE id = $1) AND status = 'pending'`,
    [id],
  )
}

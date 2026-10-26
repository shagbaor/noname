import "server-only"
import { query } from "./db"

export type Subscriber = { id: number; email: string; source: string; createdAt: Date }

/** Adds an email; returns false if it was already on the list. */
export async function addSubscriber(email: string, source: string): Promise<boolean> {
  const rows = await query<{ id: number }>(
    `INSERT INTO subscribers (email, source) VALUES ($1, $2)
     ON CONFLICT (lower(email)) DO NOTHING RETURNING id`,
    [email, source],
  )
  return rows.length > 0
}

export async function listSubscribers(q?: string): Promise<Subscriber[]> {
  const params: unknown[] = []
  let where = ""
  if (q) {
    params.push(`%${q}%`)
    where = `WHERE email ILIKE $1 OR source ILIKE $1`
  }
  return query<Subscriber>(
    `SELECT id, email, source, created_at AS "createdAt" FROM subscribers ${where} ORDER BY created_at DESC LIMIT 5000`,
    params,
  )
}

export async function countSubscribers(): Promise<number> {
  const rows = await query<{ n: number }>(`SELECT count(*)::int AS n FROM subscribers`)
  return rows[0]?.n ?? 0
}

export async function deleteSubscriber(id: number) {
  await query(`DELETE FROM subscribers WHERE id = $1`, [id])
}

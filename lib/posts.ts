import "server-only"
import { query } from "./db"
import type { FormId, Pattern } from "./forms"

export type PostImage = { url: string; caption: string }

export type Post = {
  id: number
  slug: string
  title: string
  form: FormId
  excerpt: string
  body: string
  author: string
  region: string
  era: string
  location: string
  language: string
  coverUrl: string
  pattern: Pattern
  audioUrl: string
  durationSec: number
  transcribed: boolean
  images: PostImage[]
  videoUrl: string
  themes: string[]
  featured: boolean
  status: "draft" | "published"
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

const COLUMNS = `
  id, slug, title, form, excerpt, body, author, region, era, location, language,
  cover_url AS "coverUrl", pattern, audio_url AS "audioUrl", duration_sec AS "durationSec",
  transcribed, images, video_url AS "videoUrl", themes, featured, status,
  published_at AS "publishedAt", created_at AS "createdAt", updated_at AS "updatedAt"
`

export type PostFilter = {
  form?: FormId
  /** Any of these types, e.g. every type in a group */
  forms?: FormId[]
  theme?: string
  region?: string
  q?: string
  limit?: number
  excludeId?: number
}

export async function listPublished(filter: PostFilter = {}): Promise<Post[]> {
  const where = ["status = 'published'"]
  const params: unknown[] = []
  if (filter.form) {
    params.push(filter.form)
    where.push(`form = $${params.length}`)
  }
  if (filter.forms?.length) {
    params.push(filter.forms)
    where.push(`form = ANY($${params.length})`)
  }
  if (filter.theme) {
    params.push(filter.theme)
    where.push(`$${params.length} = ANY(themes)`)
  }
  if (filter.region) {
    params.push(filter.region)
    where.push(`region = $${params.length}`)
  }
  if (filter.q) {
    params.push(`%${filter.q}%`)
    const p = `$${params.length}`
    where.push(
      `(title ILIKE ${p} OR excerpt ILIKE ${p} OR body ILIKE ${p} OR author ILIKE ${p} OR location ILIKE ${p} OR language ILIKE ${p} OR era ILIKE ${p})`,
    )
  }
  if (filter.excludeId) {
    params.push(filter.excludeId)
    where.push(`id <> $${params.length}`)
  }
  params.push(filter.limit ?? 60)
  return query<Post>(
    `SELECT ${COLUMNS} FROM posts WHERE ${where.join(" AND ")}
     ORDER BY published_at DESC NULLS LAST, id DESC LIMIT $${params.length}`,
    params,
  )
}

export async function getFeatured(): Promise<Post | null> {
  const rows = await query<Post>(
    `SELECT ${COLUMNS} FROM posts WHERE status = 'published'
     ORDER BY featured DESC, published_at DESC NULLS LAST LIMIT 1`,
  )
  return rows[0] ?? null
}

export async function getPublishedBySlug(slug: string): Promise<Post | null> {
  const rows = await query<Post>(
    `SELECT ${COLUMNS} FROM posts WHERE slug = $1 AND status = 'published'`,
    [slug],
  )
  return rows[0] ?? null
}

export async function getPublishedById(id: number): Promise<{ id: number } | null> {
  const rows = await query<{ id: number }>(`SELECT id FROM posts WHERE id = $1 AND status = 'published'`, [id])
  return rows[0] ?? null
}

export async function countByForm(): Promise<Record<string, number>> {
  const rows = await query<{ form: string; n: number }>(
    `SELECT form, count(*)::int AS n FROM posts WHERE status = 'published' GROUP BY form`,
  )
  return Object.fromEntries(rows.map((r) => [r.form, r.n]))
}

export async function countByTheme(): Promise<Record<string, number>> {
  const rows = await query<{ theme: string; n: number }>(
    `SELECT unnest(themes) AS theme, count(*)::int AS n FROM posts WHERE status = 'published' GROUP BY 1`,
  )
  return Object.fromEntries(rows.map((r) => [r.theme, r.n]))
}

// ---- Admin ----

export async function listAll(filter: { q?: string; form?: string; status?: string } = {}): Promise<Post[]> {
  const where: string[] = []
  const params: unknown[] = []
  if (filter.q) {
    params.push(`%${filter.q}%`)
    const p = `$${params.length}`
    where.push(`(title ILIKE ${p} OR slug ILIKE ${p} OR author ILIKE ${p} OR excerpt ILIKE ${p} OR body ILIKE ${p} OR location ILIKE ${p})`)
  }
  if (filter.form) {
    params.push(filter.form)
    where.push(`form = $${params.length}`)
  }
  if (filter.status) {
    params.push(filter.status)
    where.push(`status = $${params.length}`)
  }
  return query<Post>(
    `SELECT ${COLUMNS} FROM posts ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY updated_at DESC`,
    params,
  )
}

export async function countAll(): Promise<{ total: number; published: number }> {
  const rows = await query<{ total: number; published: number }>(
    `SELECT count(*)::int AS total, count(*) FILTER (WHERE status = 'published')::int AS published FROM posts`,
  )
  return rows[0]
}

export async function getById(id: number): Promise<Post | null> {
  const rows = await query<Post>(`SELECT ${COLUMNS} FROM posts WHERE id = $1`, [id])
  return rows[0] ?? null
}

export type PostInput = Omit<Post, "id" | "publishedAt" | "createdAt" | "updatedAt">

function values(p: PostInput) {
  return [
    p.slug, p.title, p.form, p.excerpt, p.body, p.author, p.region, p.era, p.location,
    p.language, p.coverUrl, p.pattern, p.audioUrl, p.durationSec, p.transcribed,
    JSON.stringify(p.images), p.featured, p.status, p.videoUrl, p.themes,
  ]
}

export async function createPost(p: PostInput): Promise<number> {
  const rows = await query<{ id: number }>(
    `INSERT INTO posts (slug, title, form, excerpt, body, author, region, era, location,
       language, cover_url, pattern, audio_url, duration_sec, transcribed, images, featured,
       status, video_url, themes, published_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
       CASE WHEN $18 = 'published' THEN now() END)
     RETURNING id`,
    values(p),
  )
  return rows[0].id
}

export async function updatePost(id: number, p: PostInput): Promise<void> {
  await query(
    `UPDATE posts SET slug=$1, title=$2, form=$3, excerpt=$4, body=$5, author=$6, region=$7,
       era=$8, location=$9, language=$10, cover_url=$11, pattern=$12, audio_url=$13,
       duration_sec=$14, transcribed=$15, images=$16, featured=$17, status=$18,
       video_url=$19, themes=$20,
       published_at = CASE WHEN $18 = 'published' THEN COALESCE(published_at, now()) END,
       updated_at = now()
     WHERE id = $21`,
    [...values(p), id],
  )
}

export async function deletePost(id: number): Promise<void> {
  await query(`DELETE FROM posts WHERE id = $1`, [id])
}

export async function slugTaken(slug: string, exceptId?: number): Promise<boolean> {
  const rows = await query<{ id: number }>(`SELECT id FROM posts WHERE slug = $1`, [slug])
  return rows.some((r) => r.id !== exceptId)
}

"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  endSession,
  findAdminByEmail,
  requireAdmin,
  setAdminPassword,
  startSession,
  verifyPassword,
} from "@/lib/auth"
import { isFormId, PATTERNS, type Pattern } from "@/lib/forms"
import { createPost, deletePost, getById, slugTaken, updatePost, type PostImage, type PostInput } from "@/lib/posts"

export type FormState = { error?: string; ok?: string; email?: string } | undefined

// ---- Auth ----

export async function login(_: FormState, data: FormData): Promise<FormState> {
  const email = String(data.get("email") ?? "").trim()
  const password = String(data.get("password") ?? "")
  const admin = email && password ? await findAdminByEmail(email) : null
  const valid = admin ? await verifyPassword(password, admin.password_hash) : false
  if (!admin || !valid) {
    await new Promise((r) => setTimeout(r, 600)) // slow down guessing
    return { error: "That email and password don't match.", email }
  }
  await startSession({ id: admin.id, email: admin.email })
  redirect("/admin")
}

export async function logout() {
  await endSession()
  redirect("/admin/login")
}

export async function changePassword(_: FormState, data: FormData): Promise<FormState> {
  const session = await requireAdmin()
  const current = String(data.get("current") ?? "")
  const next = String(data.get("next") ?? "")
  const confirm = String(data.get("confirm") ?? "")
  const admin = await findAdminByEmail(session.email)
  if (!admin || !(await verifyPassword(current, admin.password_hash))) return { error: "Current password is wrong." }
  if (next.length < 12) return { error: "New password must be at least 12 characters." }
  if (next !== confirm) return { error: "New passwords don't match." }
  await setAdminPassword(admin.id, next)
  return { ok: "Password updated." }
}

// ---- Posts ----

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

/** Only allow http(s) and site-relative URLs into src attributes. */
function safeUrl(v: string): string | null {
  const s = v.trim()
  if (!s) return ""
  if (s.startsWith("/") && !s.startsWith("//")) return s
  try {
    const u = new URL(s)
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null
  } catch {
    return null
  }
}

function parseDuration(v: string): number {
  const s = v.trim()
  if (!s) return 0
  const parts = s.split(":").map((n) => Number(n))
  if (parts.some((n) => !Number.isFinite(n) || n < 0)) return NaN
  return parts.reduce((acc, n) => acc * 60 + n, 0)
}

function text(data: FormData, key: string, max = 500) {
  return String(data.get(key) ?? "").trim().slice(0, max)
}

export async function savePost(_: FormState, data: FormData): Promise<FormState> {
  await requireAdmin()
  const id = Number(data.get("id")) || undefined

  const title = text(data, "title", 200)
  const form = String(data.get("form"))
  if (!title) return { error: "Title is required." }
  if (!isFormId(form)) return { error: "Choose a story form." }

  const pattern = String(data.get("pattern")) as Pattern
  const coverUrl = safeUrl(text(data, "coverUrl", 1000))
  const audioUrl = safeUrl(text(data, "audioUrl", 1000))
  if (coverUrl === null) return { error: "Cover image must be an http(s) URL." }
  if (audioUrl === null) return { error: "Audio must be an http(s) URL." }

  const durationSec = parseDuration(text(data, "duration", 20))
  if (Number.isNaN(durationSec)) return { error: "Duration should look like 28:44 or 1724." }

  const images: PostImage[] = []
  for (const line of text(data, "images", 20000).split("\n")) {
    if (!line.trim()) continue
    const [rawUrl, ...cap] = line.split("|")
    const url = safeUrl(rawUrl)
    if (!url) return { error: `Image URL isn't valid: ${rawUrl.trim().slice(0, 60)}` }
    images.push({ url, caption: cap.join("|").trim() })
  }

  let slug = slugify(text(data, "slug", 120) || title) || `story-${Date.now()}`
  if (await slugTaken(slug, id)) {
    let n = 2
    while (await slugTaken(`${slug}-${n}`, id)) n++
    slug = `${slug}-${n}`
  }

  const input: PostInput = {
    slug,
    title,
    form,
    excerpt: text(data, "excerpt", 600),
    body: String(data.get("body") ?? "").slice(0, 200_000),
    author: text(data, "author", 200),
    region: text(data, "region", 100),
    era: text(data, "era", 100),
    location: text(data, "location", 200),
    language: text(data, "language", 100),
    coverUrl,
    pattern: PATTERNS.includes(pattern) ? pattern : "mudcloth",
    audioUrl,
    durationSec,
    transcribed: data.get("transcribed") === "on",
    images,
    featured: data.get("featured") === "on",
    status: data.get("status") === "published" ? "published" : "draft",
  }

  if (id) {
    if (!(await getById(id))) return { error: "That post no longer exists." }
    await updatePost(id, input)
  } else {
    await createPost(input)
  }

  revalidatePath("/", "layout")
  redirect(`/admin?saved=${encodeURIComponent(title)}`)
}

export async function removePost(data: FormData) {
  await requireAdmin()
  const id = Number(data.get("id"))
  if (id) await deletePost(id)
  revalidatePath("/", "layout")
  redirect("/admin?deleted=1")
}

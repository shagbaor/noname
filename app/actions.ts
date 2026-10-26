"use server"

import { headers } from "next/headers"
import { checkFormToken, ipHash, linkCount } from "@/lib/anti-spam"
import { addComment, isDuplicate, recentCount } from "@/lib/comments"
import { getPublishedById } from "@/lib/posts"
import { addSubscriber } from "@/lib/subscribers"

export type SubscribeState = { ok?: string; error?: string } | undefined

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function subscribe(_: SubscribeState, data: FormData): Promise<SubscribeState> {
  // Honeypot: real people never fill this hidden field
  if (String(data.get("website") ?? "")) return { ok: "Thank you for subscribing." }
  const email = String(data.get("email") ?? "").trim().toLowerCase().slice(0, 254)
  if (!EMAIL.test(email)) return { error: "Please enter a valid email address." }
  const source = String(data.get("source") ?? "").slice(0, 200)
  const added = await addSubscriber(email, source)
  return { ok: added ? "Thank you. You're on the list." : "You're already on the list. Thank you." }
}

// ---- Comments ----


export type CommentState = { ok?: string; error?: string } | undefined

const LIMITS = { name: 60, body: 2000, perTenMinutes: 3, perDay: 15 }

export async function postComment(_: CommentState, data: FormData): Promise<CommentState> {
  const postId = Number(data.get("postId"))
  // 1. Honeypot: pretend success so bots learn nothing
  if (String(data.get("website") ?? "")) return { ok: "Thank you. Your comment will appear once an editor approves it." }

  // 2. Signed, timed token from the page this form came from
  const token = checkFormToken(String(data.get("token") ?? ""), postId)
  if (token === "too-fast") return { error: "That was quick! Please take a moment and try again." }
  if (token === "expired") return { error: "This page has been open a long time. Please refresh and try again." }
  if (token !== "ok") return { error: "Something went wrong. Please refresh the page and try again." }

  // 3. The story must exist and be public
  if (!postId || !(await getPublishedById(postId))) return { error: "This story isn't accepting comments." }

  // 4. Per-visitor rate limits (hashed IP)
  const hash = ipHash(await headers())
  const [tenMin, day] = await Promise.all([recentCount(hash, 10), recentCount(hash, 24 * 60)])
  if (tenMin >= LIMITS.perTenMinutes || day >= LIMITS.perDay)
    return { error: "You've left several comments recently. Please try again later." }

  // 5. Content rules
  const name = String(data.get("name") ?? "").replace(/\s+/g, " ").trim().slice(0, LIMITS.name)
  const body = String(data.get("body") ?? "").replace(/\r\n/g, "\n").trim()
  if (body.length > LIMITS.body) return { error: `Please keep comments under ${LIMITS.body} characters.` }
  if (linkCount(body) > 1 || linkCount(name) > 0) return { error: "Comments can include at most one link." }
  if (await isDuplicate(hash, body)) return { error: "It looks like this comment has already been sent." }

  // Voice notes are not accepted here: they're emailed in and uploaded by editors
  if (body.length < 2) return { error: "Please write a little more." }

  await addComment({ postId, name, body, audio: null, audioType: "", ipHash: hash })
  return { ok: "Thank you. Your comment will appear once an editor approves it." }
}

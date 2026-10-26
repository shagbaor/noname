"use server"

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

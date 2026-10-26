import "server-only"
import { createHmac, timingSafeEqual } from "node:crypto"

/*
 * Server-side defences for anonymous submissions (comments).
 * Nothing here trusts the browser: tokens are signed, timings are checked on the
 * server, IPs are hashed, and uploaded audio is identified by its bytes.
 */

function key(purpose: string) {
  const s = process.env.SESSION_SECRET
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (32+ chars)")
  return createHmac("sha256", s).update(purpose).digest()
}

function hmac(purpose: string, data: string) {
  return createHmac("sha256", key(purpose)).update(data).digest("base64url")
}

// ---- Form tokens: prove the form was loaded from our page, for this story, recently ----

const MIN_AGE_MS = 3_000 // faster than this is a script
const MAX_AGE_MS = 6 * 60 * 60 * 1000 // stale forms must be reloaded

export function formToken(postId: number, now = Date.now()) {
  const payload = `${postId}.${now}`
  return `${payload}.${hmac("comment-form", payload)}`
}

export function checkFormToken(token: string, postId: number, now = Date.now()): "ok" | "invalid" | "too-fast" | "expired" {
  const [pid, ts, sig] = token.split(".")
  if (!pid || !ts || !sig || Number(pid) !== postId) return "invalid"
  const expected = Buffer.from(hmac("comment-form", `${pid}.${ts}`))
  const given = Buffer.from(sig)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid"
  const age = now - Number(ts)
  if (!Number.isFinite(age) || age < MIN_AGE_MS) return "too-fast"
  if (age > MAX_AGE_MS) return "expired"
  return "ok"
}

// ---- IPs: only a keyed hash is stored, never the address itself ----

export function clientIp(h: Headers) {
  return (
    h.get("x-real-ip") ??
    h.get("x-vercel-forwarded-for")?.split(",")[0] ??
    h.get("x-forwarded-for")?.split(",")[0] ??
    "unknown"
  ).trim()
}

export function ipHash(h: Headers) {
  return hmac("ip", clientIp(h)).slice(0, 32)
}

// ---- Content rules ----

const URL_RE = /(https?:\/\/|www\.)\S+/gi

export function linkCount(text: string) {
  return (text.match(URL_RE) ?? []).length
}

// ---- Audio: identify by magic bytes, ignore what the browser claims ----

export const MAX_AUDIO_BYTES = 3 * 1024 * 1024

export function sniffAudio(b: Uint8Array): string | null {
  const ascii = (from: number, to: number) => String.fromCharCode(...b.subarray(from, to))
  if (b.length < 12) return null
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return "audio/webm" // WebM / Matroska
  if (ascii(0, 4) === "OggS") return "audio/ogg"
  if (ascii(4, 8) === "ftyp") return "audio/mp4" // MP4 / M4A (Safari recordings)
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WAVE") return "audio/wav"
  if (ascii(0, 3) === "ID3" || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0)) return "audio/mpeg"
  return null
}

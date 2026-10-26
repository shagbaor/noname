import "server-only"
import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { query } from "./db"

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>

const COOKIE = "kin_admin"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// ---- Passwords: "scrypt$<salt hex>$<hash hex>" ----

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const hash = await scrypt(password, salt, 64)
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, saltHex, hashHex] = stored.split("$")
  if (algo !== "scrypt" || !saltHex || !hashHex) return false
  const expected = Buffer.from(hashHex, "hex")
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length)
  return timingSafeEqual(actual, expected)
}

// ---- Sessions: signed cookie "<payload b64url>.<hmac b64url>" ----

type Session = { sub: number; email: string; exp: number }

function secret() {
  const s = process.env.SESSION_SECRET
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (32+ chars)")
  return s
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url")
}

export async function startSession(admin: { id: number; email: string }) {
  const session: Session = {
    sub: admin.id,
    email: admin.email,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE,
  }
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url")
  const jar = await cookies()
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
}

export async function endSession() {
  const jar = await cookies()
  jar.delete(COOKIE)
}

export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(COOKIE)?.value
  if (!raw) return null
  const [payload, sig] = raw.split(".")
  if (!payload || !sig) return null
  const expected = Buffer.from(sign(payload))
  const given = Buffer.from(sig)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session
    if (session.exp < Date.now() / 1000) return null
    return session
  } catch {
    return null
  }
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin(): Promise<Session> {
  const session = await getSession()
  if (!session) redirect("/admin/login")
  return session
}

export async function findAdminByEmail(email: string) {
  const rows = await query<{ id: number; email: string; password_hash: string }>(
    `SELECT id, email, password_hash FROM admins WHERE lower(email) = lower($1)`,
    [email],
  )
  return rows[0] ?? null
}

export async function setAdminPassword(id: number, password: string) {
  await query(`UPDATE admins SET password_hash = $1 WHERE id = $2`, [await hashPassword(password), id])
}

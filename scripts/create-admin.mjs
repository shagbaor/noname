// Usage: node scripts/create-admin.mjs <email> [password]
// Prints the SQL to create (or reset) an editor account. Generates a strong
// password if none is given. Run the printed SQL against your database.
import { randomBytes, scryptSync } from "node:crypto"

const [email, given] = process.argv.slice(2)
if (!email) {
  console.error("Usage: node scripts/create-admin.mjs <email> [password]")
  process.exit(1)
}
const password = given ?? randomBytes(12).toString("base64url")
const salt = randomBytes(16)
const hash = `scrypt$${salt.toString("hex")}$${scryptSync(password, salt, 64).toString("hex")}`
const q = (s) => `'${s.replace(/'/g, "''")}'`

console.error(`Email:    ${email}\nPassword: ${password}\n`)
console.log(
  `INSERT INTO admins (email, password_hash) VALUES (${q(email)}, ${q(hash)})\n` +
    `ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;`,
)

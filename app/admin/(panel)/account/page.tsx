import { requireAdmin } from "@/lib/auth"
import { PasswordForm } from "./password-form"

export default async function AccountPage() {
  const session = await requireAdmin()
  return (
    <div className="max-w-[28rem]">
      <h1 className="text-display-lg uppercase">Account</h1>
      <p className="mt-1 text-body-sm text-on-surface-variant">Signed in as {session.email}</p>
      <PasswordForm />
    </div>
  )
}

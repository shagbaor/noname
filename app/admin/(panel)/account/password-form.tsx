"use client"

import { useActionState } from "react"
import { changePassword } from "@/app/admin/actions"
import { Field, inputClass } from "@/components/admin/field"
import { ButtonEl } from "@/components/ui/button"

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined)
  return (
    <form action={action} className="mt-8 space-y-5 rounded-md border border-outline-variant/60 bg-surface-container-low p-6">
      <h2 className="text-headline-md uppercase">Change password</h2>
      <Field label="Current password">
        <input name="current" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <Field label="New password" hint="At least 12 characters.">
        <input name="next" type="password" autoComplete="new-password" minLength={12} required className={inputClass} />
      </Field>
      <Field label="Confirm new password">
        <input name="confirm" type="password" autoComplete="new-password" minLength={12} required className={inputClass} />
      </Field>
      {state?.error && <p role="alert" className="text-body-sm text-error">{state.error}</p>}
      {state?.ok && <p role="status" className="text-body-sm text-tertiary">{state.ok}</p>}
      <ButtonEl type="submit" disabled={pending}>
        {pending ? "Saving…" : "Update password"}
      </ButtonEl>
    </form>
  )
}

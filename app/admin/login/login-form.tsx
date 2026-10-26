"use client"

import { useActionState } from "react"
import { Field, inputClass } from "@/components/admin/field"
import { ButtonEl } from "@/components/ui/button"
import { login } from "../actions"

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
  return (
    <form action={action} className="mt-6 space-y-5">
      <Field label="Email">
        <input name="email" type="email" autoComplete="username" required defaultValue={state?.email} key={state?.email} className={inputClass} />
      </Field>
      <Field label="Password">
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      {state?.error && (
        <p role="alert" className="rounded-sm bg-error-container/40 px-4 py-3 text-body-sm text-on-error-container">
          {state.error}
        </p>
      )}
      <ButtonEl type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </ButtonEl>
    </form>
  )
}

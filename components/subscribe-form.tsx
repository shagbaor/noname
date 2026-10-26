"use client"

import { usePathname } from "next/navigation"
import { startTransition, useActionState } from "react"
import { subscribe } from "@/app/actions"

export function SubscribeForm() {
  const [state, action, pending] = useActionState(subscribe, undefined)
  const pathname = usePathname()

  if (state?.ok) {
    return (
      <p role="status" className="animate-rise flex items-center gap-2 rounded-full bg-tertiary-container/30 px-5 py-3 text-body-sm text-on-tertiary-container">
        <span className="size-2 rotate-45 bg-tertiary" aria-hidden />
        {state.ok}
      </p>
    )
  }

  return (
    <form
      action={action}
      // Submit manually so a validation error doesn't clear what was typed
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => action(data))
      }}
      className="w-full"
    >
      <input type="hidden" name="source" value={pathname} />
      {/* Honeypot for bots; hidden from people and screen readers */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <div className="flex gap-2">
        <label htmlFor="subscribe-email" className="sr-only">
          Email address
        </label>
        <input
          id="subscribe-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? "subscribe-error" : undefined}
          className="h-11 min-w-0 flex-1 rounded-full border border-outline-variant bg-surface-container px-5 text-body-sm text-on-surface transition-[border-color,box-shadow] placeholder:text-outline focus:border-[1.5px] focus:border-terracotta focus:ring-4 focus:ring-terracotta/25 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-11 shrink-0 rounded-full bg-terracotta px-5 text-label-md uppercase text-on-primary-container transition-[background-color,transform] hover:bg-sienna active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? "Joining…" : "Subscribe"}
        </button>
      </div>
      {state?.error && (
        <p id="subscribe-error" role="alert" className="mt-2 px-2 text-body-sm text-error">
          {state.error}
        </p>
      )}
    </form>
  )
}

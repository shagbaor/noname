"use client"

import clsx from "clsx"

export function ModerateButton({
  action,
  id,
  op,
  label,
  tone = "neutral",
  confirm: message,
}: {
  action: (data: FormData) => Promise<void>
  id: number
  op: string
  label: string
  tone?: "primary" | "neutral" | "danger"
  confirm?: string
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (message && !confirm(message)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="op" value={op} />
      <button
        type="submit"
        className={clsx(
          "rounded-full px-4 py-1.5 text-label-md uppercase transition-colors",
          tone === "primary" && "bg-terracotta text-on-primary-container hover:bg-sienna",
          tone === "neutral" && "border border-outline-variant hover:border-outline",
          tone === "danger" && "border border-error/40 text-error hover:bg-error-container/40",
        )}
      >
        {label}
      </button>
    </form>
  )
}

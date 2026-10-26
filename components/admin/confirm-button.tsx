"use client"

/** Small form button that asks for confirmation before running a server action. */
export function ConfirmButton({
  action,
  id,
  message,
  label,
}: {
  action: (data: FormData) => Promise<void>
  id: number
  message: string
  label: string
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="rounded-full border border-error/40 px-3 py-1.5 text-label-md uppercase text-error transition-colors hover:bg-error-container/40">
        {label}
      </button>
    </form>
  )
}

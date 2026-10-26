"use client"

import { removePost } from "@/app/admin/actions"

export function DeleteButton({ id, title, label = "Delete" }: { id: number; title: string; label?: string }) {
  return (
    <form
      action={removePost}
      onSubmit={(e) => {
        if (!confirm(`Delete “${title}”? This can't be undone.`)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-full border border-error/40 px-3 py-1.5 text-label-md uppercase text-error transition-colors hover:bg-error-container/40"
      >
        {label}
      </button>
    </form>
  )
}

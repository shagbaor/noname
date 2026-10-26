export const inputClass =
  "w-full rounded-sm border border-outline-variant bg-surface-container px-4 py-3 text-body-md text-on-surface transition-[border-color,box-shadow] placeholder:text-outline focus:border-terracotta focus:ring-4 focus:ring-terracotta/25 focus:outline-none"

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-2 block text-label-md uppercase text-on-surface-variant">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-body-sm text-outline">{hint}</span>}
    </label>
  )
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  action,
}: {
  index: string
  eyebrow: string
  title: string
  action?: React.ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-6 border-b border-outline-variant/60 pb-6">
      <div>
        <p className="mb-3 flex items-center gap-3 text-label-md uppercase text-primary">
          <span className="tabular-nums text-marigold">{index}</span>
          <span className="h-px w-8 bg-outline-variant" aria-hidden />
          {eyebrow}
        </p>
        <h2 className="text-display-lg uppercase">{title}</h2>
      </div>
      {action}
    </header>
  )
}

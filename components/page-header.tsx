export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  intro?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <header className="shell pt-[clamp(2.5rem,6vw,5rem)] pb-[clamp(2rem,4vw,3.5rem)]">
      <p className="animate-rise mb-4 flex items-center gap-3 text-label-md uppercase text-primary">
        <span className="size-2 rotate-45 bg-marigold" aria-hidden />
        {eyebrow}
      </p>
      <h1 className="animate-rise max-w-[18ch] text-display-xl uppercase" style={{ "--delay": "80ms" } as React.CSSProperties}>
        {title}
      </h1>
      {intro && (
        <p
          className="animate-rise mt-6 max-w-[40rem] text-body-lg text-on-surface-variant"
          style={{ "--delay": "160ms" } as React.CSSProperties}
        >
          {intro}
        </p>
      )}
      {children && (
        <div className="animate-rise mt-8" style={{ "--delay": "240ms" } as React.CSSProperties}>
          {children}
        </div>
      )}
    </header>
  )
}

import clsx from "clsx"

type Tone = "violet" | "acacia" | "terracotta" | "marigold" | "neutral"

const tones: Record<Tone, string> = {
  violet: "bg-violet/20 text-secondary",
  acacia: "bg-acacia/20 text-tertiary",
  terracotta: "bg-terracotta/20 text-primary",
  marigold: "bg-marigold/15 text-marigold",
  neutral: "bg-surface-container-highest text-on-surface-variant",
}

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-sm uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function categoryTone(category: string): Tone {
  if (category === "Queer History") return "violet"
  if (category === "Photo Essay") return "marigold"
  if (category === "Archive Notes") return "terracotta"
  return "neutral"
}

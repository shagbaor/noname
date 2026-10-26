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

const FORM_TONES: Record<string, Tone> = {
  essay: "terracotta",
  "oral-history": "acacia",
  letter: "marigold",
  poem: "violet",
  "photo-essay": "marigold",
  interview: "terracotta",
  fiction: "violet",
}

export function formTone(form: string): Tone {
  return FORM_TONES[form] ?? "neutral"
}

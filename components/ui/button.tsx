import clsx from "clsx"
import type { ComponentProps } from "react"

type Variant = "primary" | "secondary" | "secondary-violet" | "ghost"

const variants: Record<Variant, string> = {
  primary:
    "bg-terracotta text-on-primary-container hover:bg-sienna hover:-translate-y-px shadow-card",
  secondary:
    "border-[1.5px] border-terracotta text-on-surface hover:bg-terracotta/15",
  "secondary-violet":
    "border-[1.5px] border-violet text-on-surface hover:bg-violet/15",
  ghost: "link-ghost px-0! text-on-surface hover:text-primary",
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-label-lg uppercase transition-[background-color,transform,color] duration-200"

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"a"> & { variant?: Variant }) {
  return <a className={clsx(base, variants[variant], className)} {...props} />
}

export function ButtonEl({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={clsx(base, variants[variant], className)} {...props} />
}

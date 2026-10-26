import clsx from "clsx"
import Link from "next/link"
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
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-label-lg uppercase transition-[background-color,transform,color] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"

export function Button({
  variant = "primary",
  className,
  href,
  ...props
}: Omit<ComponentProps<"a">, "href"> & { href: string; variant?: Variant }) {
  return <Link href={href} className={clsx(base, variants[variant], className)} {...props} />
}

export function ButtonEl({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={clsx(base, variants[variant], className)} {...props} />
}

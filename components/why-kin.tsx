import clsx from "clsx"
import Link from "next/link"

/** Why the archive is called Kin: full telling for About, a short note for the home page. */
export function WhyKin({ compact = false, className }: { compact?: boolean; className?: string }) {
  if (compact) {
    return (
      <p className={clsx("text-body-md text-on-surface-variant", className)}>
        <span className="font-display text-[1.35rem] leading-none tracking-wide text-on-surface uppercase">Why Kin?</span>{" "}
        Because this archive is a family record: of the families we were born into, and the families we found in each
        other.{" "}
        <Link href="/about#why-kin" className="whitespace-nowrap text-primary underline decoration-terracotta/60 underline-offset-4 hover:text-on-surface">
          Read why
        </Link>
      </p>
    )
  }

  return (
    <div className={clsx("space-y-5 font-serif text-[clamp(1.15rem,1.05rem+0.45vw,1.4rem)] leading-[1.75] text-on-surface", className)}>
      <p>
        Kin is one of the oldest words we have for belonging. It names the people we come from. But for many of us,
        the families we were born into could not always hold all of who we are.
      </p>
      <p>
        So we found each other. In chosen families and kitchen-table communities, in letters passed hand to hand, on
        dance floors and in the quiet company of elders, we made kin of one another.
      </p>
      <p>
        That is what this archive is: a family record. Not of a single bloodline, but of everyone who has loved,
        survived and celebrated across the continent and the diaspora. Every story kept here is a relative&apos;s
        story, and reading it is how we stay related.
      </p>
      <p className="text-primary">Kin is also a promise: no one who tells their story here is a stranger.</p>
    </div>
  )
}

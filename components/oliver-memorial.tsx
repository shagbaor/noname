import Link from "next/link"
import { Reveal } from "./reveal"
import { TextileArt } from "./textile"

/** Standing memorial tile for Oliver, shown at the top of In memoriam. */
export function OliverMemorial() {
  return (
    <Reveal className="mb-8">
      <Link
        href="/about#for-oliver"
        className="group relative grid overflow-hidden rounded-lg border border-marigold/40 bg-surface-container-low transition-[border-color,transform] duration-500 hover:-translate-y-0.5 hover:border-marigold md:grid-cols-[14rem_1fr]"
      >
        <div className="relative h-24 md:h-auto">
          <TextileArt pattern="kente" className="opacity-70 transition-opacity duration-700 group-hover:opacity-90" />
          <span className="absolute inset-0 grid place-items-center" aria-hidden>
            <span className="size-5 rotate-45 bg-marigold shadow-[0_0_0_6px_rgba(19,19,22,0.7)]" />
          </span>
        </div>
        <div className="p-[clamp(1.25rem,3vw,2rem)]">
          <p className="text-label-md uppercase tracking-[0.25em] text-marigold">In loving memory</p>
          <h2 className="mt-1 text-display-sm uppercase">Oliver</h2>
          <p className="mt-2 max-w-[38rem] font-serif text-[1.15rem] leading-relaxed text-on-surface-variant italic">
            Who always believed that stories are meant to be told, and that every story deserves someone who listens.
            This archive is dedicated to Oliver.
          </p>
          <span className="mt-4 inline-block text-label-md uppercase text-on-surface-variant transition-colors group-hover:text-marigold">
            Read the dedication →
          </span>
        </div>
      </Link>
    </Reveal>
  )
}

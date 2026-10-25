export function QuoteBand() {
  return (
    <section className="page-x mx-auto max-w-[1440px] py-space-2xl lg:py-space-3xl">
      <figure className="relative mx-auto max-w-[56rem] overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container px-6 py-14 md:px-16 md:py-20">
        <span
          className="pointer-events-none absolute -top-10 left-2 font-serif text-[16rem] leading-none text-terracotta/20 select-none md:left-8 md:text-[20rem]"
          aria-hidden
        >
          “
        </span>
        <blockquote className="relative font-serif text-[26px] leading-[1.35] font-medium italic md:text-[36px]">
          We were never a footnote. We were in the songs, in the kitchens, in the way the elders
          looked away and then looked back again. The archive is just us, remembering out loud.
        </blockquote>
        <figcaption className="relative mt-8 flex items-center gap-3 text-label-lg uppercase text-on-surface-variant">
          <span className="h-px w-10 bg-terracotta" aria-hidden />
          Sample narrator, oral history no. 002
        </figcaption>
      </figure>
    </section>
  )
}

import { site } from "@/lib/site"

const groups = [
  { title: "Read", links: ["Essays", "Photo essays", "Archive notes", "Reading lists"] },
  { title: "Listen", links: ["Oral history index", "Transcripts", "Languages", "Recording guide"] },
  { title: "About", links: ["Our mission", "Ethics & consent", "Partners", "Contact"] },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant/60 bg-surface-container-lowest pb-28">
      <div className="page-x mx-auto grid max-w-[1440px] gap-10 py-space-2xl md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-display text-[56px] leading-none uppercase">{site.name}</p>
          <p className="mt-4 max-w-[28rem] text-body-md text-on-surface-variant">{site.description}</p>

          <form action="#" className="mt-6 flex max-w-[28rem] gap-2">
            <label htmlFor="newsletter" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter"
              type="email"
              placeholder="Your email"
              className="h-12 min-w-0 flex-1 rounded-full border border-outline-variant bg-surface-container px-5 text-body-sm placeholder:text-outline focus:border-[1.5px] focus:border-terracotta focus:ring-4 focus:ring-terracotta/25 focus:outline-none"
            />
            <button
              type="submit"
              className="h-12 rounded-full border-[1.5px] border-terracotta px-5 text-label-lg uppercase transition-colors hover:bg-terracotta/15"
            >
              Subscribe
            </button>
          </form>
        </div>

        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title} className="lg:col-span-2">
            <p className="text-label-md uppercase text-primary">{g.title}</p>
            <ul className="mt-4 space-y-3">
              {g.links.map((l) => (
                <li key={l}>
                  <a href="#" className="link-ghost text-body-sm text-on-surface-variant hover:text-on-surface">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="page-x mx-auto flex max-w-[1440px] flex-wrap justify-between gap-4 border-t border-outline-variant/60 pt-6 text-label-sm uppercase text-outline">
        <span>© {new Date().getFullYear()} {site.name}. Held in community.</span>
        <span>Memory is a practice</span>
      </div>
    </footer>
  )
}

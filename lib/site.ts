import { GROUPS, typesInGroup } from "./forms"

export type NavLink = { label: string; href: string; blurb?: string }
export type NavItem = NavLink & { columns?: { title: string; href: string; links: NavLink[] }[] }

// Working name — change it here and it updates across the site.
export const site = {
  name: "Kin Archive",
  tagline: "Queer African histories, kept alive",
  description:
    "An archive and journal of queer African history: stories in every form, recorded testimonies, and a living timeline of memory and joy.",
  // Payment link from your donation provider (Paystack, Flutterwave, Stripe…).
  // Leave empty until one is set up; the Donate page will say so.
  donateUrl: process.env.NEXT_PUBLIC_DONATE_URL ?? "",
}

export const nav: NavItem[] = [
  {
    label: "Stories",
    href: "/stories",
    columns: GROUPS.map((g) => ({
      title: g.label,
      href: `/stories/${g.id}`,
      links: typesInGroup(g.id).map((t) => ({ label: t.plural, href: `/stories/${t.section}` })),
    })),
  },
  {
    label: "Archive",
    href: "/archive",
    columns: [
      {
        title: "Archive",
        href: "/archive",
        links: [
          { label: "Search the archive", href: "/archive", blurb: "Every story, by name, place or decade." },
          { label: "Timeline", href: "/archive/timeline", blurb: "Milestones across the continent." },
        ],
      },
    ],
  },
  { label: "About", href: "/about" },
]

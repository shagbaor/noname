// Working name — change it here and it updates across the site.
export const site = {
  name: "Kin Archive",
  tagline: "Queer African histories, kept alive",
  description:
    "An archive and journal of queer African history: stories in every form, recorded testimonies, and a living timeline of memory and joy.",
  nav: [
    { label: "Stories", href: "/stories" },
    { label: "Essays", href: "/essays" },
    { label: "Testimonies", href: "/testimonies" },
    { label: "Timeline", href: "/timeline" },
    { label: "Archive", href: "/archive" },
  ],
  // Payment link from your donation provider (Paystack, Flutterwave, Stripe…).
  // Leave empty until one is set up; the Donate page will say so.
  donateUrl: process.env.NEXT_PUBLIC_DONATE_URL ?? "",
}

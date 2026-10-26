import type { Metadata, Viewport } from "next"
import { Anybody, Archivo_Narrow, Bebas_Neue, Newsreader } from "next/font/google"
import { site } from "@/lib/site"
import "./globals.css"

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" })
const anybody = Anybody({ subsets: ["latin"], variable: "--font-anybody" })
const archivoNarrow = Archivo_Narrow({ subsets: ["latin"], variable: "--font-archivo-narrow" })
const newsreader = Newsreader({ subsets: ["latin"], style: ["italic"], variable: "--font-newsreader" })

export const metadata: Metadata = {
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  appleWebApp: { title: site.name, statusBarStyle: "black-translucent" },
}

export const viewport: Viewport = {
  themeColor: "#131316",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bebas.variable} ${anybody.variable} ${archivoNarrow.variable} ${newsreader.variable}`}
    >
      <head>
        {/* Enables scroll-reveal styles only when JS runs, so content never hides without it */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}

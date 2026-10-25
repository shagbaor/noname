import type { Metadata, Viewport } from "next"
import { Anybody, Archivo_Narrow, Bebas_Neue, Newsreader } from "next/font/google"
import { site } from "@/lib/site"
import "./globals.css"

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" })
const anybody = Anybody({ subsets: ["latin"], variable: "--font-anybody" })
const archivoNarrow = Archivo_Narrow({ subsets: ["latin"], variable: "--font-archivo-narrow" })
const newsreader = Newsreader({ subsets: ["latin"], style: ["italic"], variable: "--font-newsreader" })

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
}

export const viewport: Viewport = {
  themeColor: "#131316",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${anybody.variable} ${archivoNarrow.variable} ${newsreader.variable}`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}

import { Archive } from "@/components/archive"
import { Contribute } from "@/components/contribute"
import { Essays } from "@/components/essays"
import { Hero } from "@/components/hero"
import { PlayerProvider } from "@/components/player"
import { QuoteBand } from "@/components/quote"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Testimonies } from "@/components/testimonies"
import { TextileDivider } from "@/components/textile"
import { Timeline } from "@/components/timeline"

export default function Home() {
  return (
    <PlayerProvider>
      <SiteHeader />
      <main>
        <Hero />
        <TextileDivider />
        <Essays />
        <Testimonies />
        <QuoteBand />
        <TextileDivider />
        <Timeline />
        <Archive />
        <Contribute />
      </main>
      <SiteFooter />
    </PlayerProvider>
  )
}

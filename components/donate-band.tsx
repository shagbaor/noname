import { Reveal } from "./reveal"
import { TextileArt } from "./textile"
import { Button } from "./ui/button"

export function DonateBand() {
  return (
    <section className="shell section-y">
      <Reveal>
        <div className="relative overflow-hidden rounded-xl bg-terracotta">
          <div className="absolute inset-y-0 right-0 hidden w-2/5 opacity-50 md:block">
            <TextileArt pattern="mudcloth" />
          </div>
          <div className="relative max-w-[44rem] px-[clamp(1.5rem,5vw,3.5rem)] py-[clamp(3rem,6vw,5rem)]">
            <h2 className="text-display-lg uppercase text-on-primary-container">Keep these histories alive</h2>
            <p className="mt-4 text-body-lg text-on-primary-container/90">
              Every recording, transcription and translation is funded by people like you. Give once or
              monthly to keep the archive free and open.
            </p>
            <Button href="/donate" className="mt-8 bg-obsidian! text-on-surface hover:bg-surface-container-highest!">
              Donate
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

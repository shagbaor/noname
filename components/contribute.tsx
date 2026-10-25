import { TextileArt } from "./textile"
import { Button } from "./ui/button"

export function Contribute() {
  return (
    <section id="contribute" className="page-x mx-auto max-w-[1440px] py-space-2xl lg:py-space-3xl">
      <div className="relative overflow-hidden rounded-xl bg-terracotta">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 opacity-60 md:block">
          <TextileArt pattern="mudcloth" />
        </div>
        <div className="relative max-w-[44rem] px-6 py-12 md:px-14 md:py-20">
          <p className="text-label-lg uppercase text-on-primary-container/80">Contribute</p>
          <h2 className="mt-3 text-display-lg uppercase text-on-primary-container">
            Your story belongs here
          </h2>
          <p className="mt-5 text-body-lg text-on-primary-container/90">
            Share a memory, a photograph, a letter, or sit with us to record your oral history. You
            choose what is public, what is anonymous, and what stays with family. Consent leads
            everything we keep.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              href="#contribute"
              className="bg-obsidian! text-on-surface hover:bg-surface-container-highest!"
            >
              Share your story
            </Button>
            <Button href="#contribute" variant="ghost" className="text-on-primary-container! hover:text-white!">
              How we protect contributors →
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

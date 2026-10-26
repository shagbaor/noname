import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="shell section-y">
      <p className="text-label-md uppercase text-primary">404</p>
      <h1 className="mt-3 text-display-lg uppercase">Not in the archive (yet)</h1>
      <p className="mt-4 max-w-[36rem] text-body-lg text-on-surface-variant">
        This page may have moved, or the story hasn&apos;t been published.
      </p>
      <Button href="/stories" className="mt-8">
        Browse stories
      </Button>
    </div>
  )
}

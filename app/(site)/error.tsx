"use client"

import { ButtonEl } from "@/components/ui/button"

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="shell section-y">
      <p className="text-label-md uppercase text-primary">Something went wrong</p>
      <h1 className="mt-3 text-display-lg uppercase">The archive is resting</h1>
      <p className="mt-4 max-w-[36rem] text-body-lg text-on-surface-variant">
        We couldn&apos;t load this page just now. Please try again in a moment.
      </p>
      <ButtonEl className="mt-8" onClick={reset}>
        Try again
      </ButtonEl>
    </div>
  )
}

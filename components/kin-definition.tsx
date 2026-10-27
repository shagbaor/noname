"use client"

import clsx from "clsx"
import { useState } from "react"

/** Speaks "kin" with the browser's built-in voice, if it has one. */
function SayIt({ className }: { className?: string }) {
  const [speaking, setSpeaking] = useState(false)
  return (
    <button
      type="button"
      aria-label="Hear how “kin” is pronounced"
      onClick={() => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return
        const u = new SpeechSynthesisUtterance("kin")
        u.lang = "en-GB"
        u.rate = 0.85
        u.onend = () => setSpeaking(false)
        setSpeaking(true)
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(u)
      }}
      className={clsx(
        "grid shrink-0 place-items-center rounded-full bg-terracotta text-on-primary-container transition-[background-color,transform] hover:bg-sienna active:scale-95",
        speaking && "animate-pulse",
        className,
      )}
    >
      <svg width="45%" height="45%" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M4 9v6h4l5 4V5L8 9H4z" />
        <path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  )
}

/** Dictionary-style entry for the word that names the archive. */
export function KinDefinition({ compact = false, className }: { compact?: boolean; className?: string }) {
  if (compact) {
    return (
      <div className={clsx("flex items-start gap-3", className)}>
        <SayIt className="mt-0.5 size-9" />
        <p className="text-body-md text-on-surface-variant">
          <span className="font-display text-[1.5rem] leading-none tracking-wide text-on-surface uppercase">Kin</span>{" "}
          <span className="font-serif italic text-outline">/kɪn/ · noun</span>
          <br />
          A person&apos;s relatives: the people we are bound to by blood, marriage or shared ancestry.{" "}
          <span className="text-on-surface">And the family we find.</span>
        </p>
      </div>
    )
  }

  return (
    <div className={clsx("relative overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-low p-[clamp(1.25rem,4vw,2.5rem)]", className)}>
      <div className="flex items-center gap-4">
        <SayIt className="size-12" />
        <div>
          <p className="font-display text-[clamp(2.75rem,2rem+2.5vw,3.75rem)] leading-none tracking-wide uppercase">Kin</p>
          <p className="font-serif text-[1.1rem] text-outline italic">/kɪn/</p>
        </div>
      </div>

      <ol className="mt-6 space-y-4">
        <li className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-6">
          <span className="text-label-md uppercase text-primary">noun</span>
          <span className="text-body-lg text-on-surface">
            A person&apos;s relatives: family members, or people related to someone by blood, marriage or shared
            ancestry.
          </span>
        </li>
        <li className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-6">
          <span className="text-label-md uppercase text-primary">noun</span>
          <span className="text-body-lg text-on-surface-variant">A group of people or things sharing a similar nature or origin.</span>
        </li>
        <li className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-6">
          <span className="text-label-md uppercase text-primary">adjective</span>
          <span className="text-body-lg text-on-surface-variant">Related; of the same kind.</span>
        </li>
      </ol>

      <div className="mt-6 border-t border-outline-variant/60 pt-5 sm:grid sm:grid-cols-[7rem_1fr] sm:gap-6">
        <span className="text-label-md uppercase text-marigold">for us</span>
        <p className="mt-1 font-serif text-[clamp(1.15rem,1.05rem+0.4vw,1.35rem)] leading-relaxed italic sm:mt-0">
          All of that, and the family we find: the elders who kept the stories, the friends who became home, and
          everyone who reads, listens and adds their own. Kin is who we belong to.
        </p>
      </div>
    </div>
  )
}

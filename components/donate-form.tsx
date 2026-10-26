"use client"

import clsx from "clsx"
import { useState } from "react"

const AMOUNTS = [10, 25, 50, 100]

export function DonateForm({ donateUrl }: { donateUrl: string }) {
  const [frequency, setFrequency] = useState<"once" | "monthly">("monthly")
  const [amount, setAmount] = useState<number | "custom">(25)
  const [custom, setCustom] = useState("")
  const value = amount === "custom" ? Number(custom) || 0 : amount

  return (
    <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-[clamp(1.5rem,4vw,2.5rem)] shadow-sheet">
      <fieldset>
        <legend className="text-label-md uppercase text-on-surface-variant">Frequency</legend>
        <div className="relative mt-3 grid grid-cols-2 rounded-full bg-surface-container-high p-1">
          <span
            className={clsx(
              "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-terracotta transition-transform duration-400 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
              frequency === "monthly" && "translate-x-full",
            )}
            aria-hidden
          />
          {(["once", "monthly"] as const).map((f) => (
            <label key={f} className="relative z-10 cursor-pointer">
              <input
                type="radio"
                name="frequency"
                value={f}
                checked={frequency === f}
                onChange={() => setFrequency(f)}
                className="peer sr-only"
              />
              <span
                className={clsx(
                  "block rounded-full py-2.5 text-center text-label-lg uppercase transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-secondary",
                  frequency === f ? "text-on-primary-container" : "text-on-surface-variant",
                )}
              >
                {f === "once" ? "One time" : "Monthly"}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-label-md uppercase text-on-surface-variant">Amount (USD)</legend>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={amount === a}
              onClick={() => setAmount(a)}
              className={clsx(
                "rounded-md border-[1.5px] py-4 font-display text-[1.75rem] leading-none transition-[background-color,border-color,transform] duration-300 active:scale-95",
                amount === a
                  ? "border-terracotta bg-terracotta/15 text-on-surface"
                  : "border-outline-variant text-on-surface-variant hover:border-outline",
              )}
            >
              ${a}
            </button>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="sr-only">Custom amount</span>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-outline">$</span>
            <input
              inputMode="decimal"
              placeholder="Other amount"
              value={custom}
              onFocus={() => setAmount("custom")}
              onChange={(e) => {
                setCustom(e.target.value.replace(/[^\d.]/g, ""))
                setAmount("custom")
              }}
              className={clsx(
                "h-13 w-full rounded-full border bg-surface-container pl-9 text-body-md transition-[border-color,box-shadow] placeholder:text-outline focus:ring-4 focus:ring-terracotta/25 focus:outline-none",
                amount === "custom" ? "border-[1.5px] border-terracotta" : "border-outline-variant",
              )}
            />
          </div>
        </label>
      </fieldset>

      {donateUrl ? (
        <a
          href={donateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex w-full items-center justify-center rounded-full bg-terracotta py-4 text-label-lg uppercase text-on-primary-container shadow-card transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-sienna active:scale-[0.98]"
        >
          Give ${value || "—"} {frequency === "monthly" ? "monthly" : "now"}
        </a>
      ) : (
        <>
          <button
            type="button"
            disabled
            className="mt-8 w-full cursor-not-allowed rounded-full bg-terracotta/40 py-4 text-label-lg uppercase text-on-primary-container/70"
          >
            Give ${value || "—"} {frequency === "monthly" ? "monthly" : "now"}
          </button>
          <p className="mt-3 text-center text-body-sm text-outline">Online giving is being set up. Check back soon.</p>
        </>
      )}
    </div>
  )
}

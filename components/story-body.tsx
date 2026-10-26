import clsx from "clsx"
import type { FormId } from "@/lib/forms"

/*
 * Renders a story body from lightweight plain-text markup, styled per form.
 *   blank line   → new paragraph (or stanza, for poems)
 *   ## Heading   → section heading
 *   > quote      → pull quote
 *   **bold**, *italic* inline
 * Output is React elements only (no raw HTML), so it's safe by construction.
 */

function inline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
      return <strong key={i} className="font-semibold text-on-surface">{part.slice(2, -2)}</strong>
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

function lines(text: string) {
  return text.split("\n").flatMap((l, i) => (i === 0 ? inline(l) : [<br key={`br${i}`} />, ...inline(l)]))
}

export function StoryBody({ body, form }: { body: string; form: FormId }) {
  const blocks = body.replace(/\r\n/g, "\n").trim().split(/\n{2,}/)
  const keepLines = form === "poem" || form === "letter"

  if (form === "poem") {
    return (
      <div className="space-y-8 font-serif text-[clamp(1.25rem,1.1rem+0.6vw,1.6rem)] leading-[1.7] italic">
        {blocks.map((b, i) => (
          <p key={i}>{lines(b)}</p>
        ))}
      </div>
    )
  }

  const content = blocks.map((b, i) => {
    if (b.startsWith("## "))
      return (
        <h2 key={i} className="pt-6 text-headline-lg uppercase text-on-surface">
          {b.slice(3)}
        </h2>
      )
    if (b.startsWith("> "))
      return (
        <blockquote key={i} className="relative my-4 border-l-2 border-terracotta pl-6 font-serif text-[clamp(1.35rem,1.2rem+0.6vw,1.75rem)] leading-snug text-on-surface italic">
          {inline(b.replace(/^> ?/gm, ""))}
        </blockquote>
      )
    // Interview / transcript turns: "**Q:** …" or "**Narrator:** …"
    const turn = /^\*\*([^*]{1,30}):\*\*\s*/.exec(b)
    if (turn && (form === "interview" || form === "oral-history"))
      return (
        <div key={i} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-6">
          <span className="pt-1 text-label-lg uppercase text-primary">{turn[1]}</span>
          <p>{inline(b.slice(turn[0].length))}</p>
        </div>
      )
    return <p key={i}>{keepLines ? lines(b) : inline(b)}</p>
  })

  if (form === "letter") {
    return (
      <div className="relative rounded-md border border-outline-variant/60 bg-surface-container px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2rem,5vw,4rem)] shadow-card">
        <span className="absolute top-6 right-6 size-10 rotate-45 border border-marigold/50" aria-hidden />
        <div className="space-y-5 font-serif text-[1.2rem] leading-[1.8] text-on-surface">{content}</div>
      </div>
    )
  }

  return (
    <div className={clsx("space-y-6 text-body-lg text-on-surface-variant", form === "essay" && "first-letter-drop")}>
      {content}
    </div>
  )
}

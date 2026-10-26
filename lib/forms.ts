/*
 * Story taxonomy, shared by the public site and the admin editor.
 *
 *   Group  →  Type (stored as posts.form)  →  Post
 *   Themes cut across every type (posts.themes).
 *
 * Each type has a URL `section` used for /stories/<section> listings and
 * /stories/<section>/<slug> story pages. Groups list at /stories/<group id>.
 */

export const TYPES = [
  // Written
  { id: "essay", group: "written", section: "essays", label: "Essay", plural: "Essays", blurb: "Long-form history, criticism and reflection." },
  { id: "memoir", group: "written", section: "memoirs", label: "Memoir", plural: "Memoirs", blurb: "First-person life writing." },
  { id: "letter", group: "written", section: "letters", label: "Letter", plural: "Letters", blurb: "Correspondence kept, found and shared." },
  { id: "diary", group: "written", section: "diaries", label: "Diary", plural: "Diaries & journals", blurb: "Private pages, made public with consent." },
  { id: "poem", group: "written", section: "poetry", label: "Poem", plural: "Poetry", blurb: "Verse, praise poetry and spoken word." },
  { id: "fiction", group: "written", section: "fiction", label: "Fiction", plural: "Fiction", blurb: "Imagined lives that tell the truth." },
  // Spoken
  { id: "oral-history", group: "spoken", section: "testimonies", label: "Testimony", plural: "Testimonies", blurb: "Recorded oral histories in narrators' own voices." },
  { id: "interview", group: "spoken", section: "interviews", label: "Interview", plural: "Interviews", blurb: "Conversations with elders, artists and organisers." },
  { id: "song", group: "spoken", section: "songs", label: "Song", plural: "Songs & chants", blurb: "Music, lyrics and the stories behind them." },
  // Visual
  { id: "photo-essay", group: "visual", section: "photo-essays", label: "Photo Essay", plural: "Photo essays", blurb: "Images and the stories around them." },
  { id: "artwork", group: "visual", section: "art", label: "Artwork", plural: "Art & illustration", blurb: "Paintings, textiles, drawings and design." },
  { id: "film", group: "visual", section: "film", label: "Film", plural: "Film & video", blurb: "Documentary, short film and video." },
  // From the archive
  { id: "document", group: "archive", section: "documents", label: "Document", plural: "Documents & zines", blurb: "Clippings, flyers, zines and records." },
  { id: "tribute", group: "archive", section: "tributes", label: "Tribute", plural: "In memoriam", blurb: "Honouring those we have lost." },
] as const

export const GROUPS = [
  { id: "written", label: "Written", blurb: "Words on the page: essays, memoir, letters, diaries, poetry and fiction." },
  { id: "spoken", label: "Spoken", blurb: "Voices first: recorded testimonies, conversations and song." },
  { id: "visual", label: "Visual", blurb: "Photographs, art and moving image." },
  { id: "archive", label: "From the archive", blurb: "Documents and remembrance, preserved as they were." },
] as const

export const THEMES = [
  { id: "love-family", label: "Love & family" },
  { id: "faith", label: "Faith & spirituality" },
  { id: "activism", label: "Activism & law" },
  { id: "nightlife", label: "Nightlife & culture" },
  { id: "tradition", label: "Tradition & language" },
  { id: "health", label: "Health & care" },
  { id: "migration", label: "Migration & diaspora" },
  { id: "joy", label: "Joy & celebration" },
] as const

export type FormId = (typeof TYPES)[number]["id"]
export type GroupId = (typeof GROUPS)[number]["id"]
export type ThemeId = (typeof THEMES)[number]["id"]
export type StoryType = (typeof TYPES)[number]

export const FORM_IDS = TYPES.map((t) => t.id) as FormId[]

export function formMeta(id: string): StoryType {
  return TYPES.find((t) => t.id === id) ?? TYPES[0]
}

export function isFormId(v: unknown): v is FormId {
  return typeof v === "string" && (FORM_IDS as string[]).includes(v)
}

export function typeBySection(section: string): StoryType | undefined {
  return TYPES.find((t) => t.section === section)
}

export function groupById(id: string) {
  return GROUPS.find((g) => g.id === id)
}

export function typesInGroup(id: GroupId): StoryType[] {
  return TYPES.filter((t) => t.group === id)
}

export function themeLabel(id: string) {
  return THEMES.find((t) => t.id === id)?.label ?? id
}

export function isThemeId(v: unknown): v is ThemeId {
  return typeof v === "string" && THEMES.some((t) => t.id === v)
}

/** Canonical public URL for a post. */
export function storyHref(p: { form: string; slug: string }) {
  return `/stories/${formMeta(p.form).section}/${p.slug}`
}

/** Which media fields a type uses, for the editor and story page. */
export const USES_AUDIO: FormId[] = ["oral-history", "song", "interview"]
export const USES_IMAGES: FormId[] = ["photo-essay", "artwork", "document"]
export const USES_VIDEO: FormId[] = ["film"]

export const PATTERNS = ["mudcloth", "kente", "adire", "chevron"] as const
export type Pattern = (typeof PATTERNS)[number]

export const REGIONS = [
  "Pan-African",
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
  "North Africa",
  "Diaspora",
] as const

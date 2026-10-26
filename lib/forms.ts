// The forms a story can take. Shared by the public site and the admin editor.

export const FORMS = [
  {
    id: "essay",
    label: "Essay",
    plural: "Essays",
    blurb: "Long-form history, criticism and reflection.",
  },
  {
    id: "oral-history",
    label: "Oral History",
    plural: "Oral Histories",
    blurb: "Recorded testimonies in narrators' own voices.",
  },
  {
    id: "letter",
    label: "Letter",
    plural: "Letters",
    blurb: "Correspondence kept, found and shared.",
  },
  {
    id: "poem",
    label: "Poem",
    plural: "Poetry",
    blurb: "Verse, song lyrics and praise poetry.",
  },
  {
    id: "photo-essay",
    label: "Photo Essay",
    plural: "Photo Essays",
    blurb: "Images and the stories around them.",
  },
  {
    id: "interview",
    label: "Interview",
    plural: "Interviews",
    blurb: "Conversations with elders, artists and organisers.",
  },
  {
    id: "fiction",
    label: "Fiction",
    plural: "Fiction",
    blurb: "Imagined lives that tell the truth.",
  },
] as const

export type FormId = (typeof FORMS)[number]["id"]

export const FORM_IDS = FORMS.map((f) => f.id) as FormId[]

export function formMeta(id: string) {
  return FORMS.find((f) => f.id === id) ?? FORMS[0]
}

export function isFormId(v: unknown): v is FormId {
  return typeof v === "string" && (FORM_IDS as string[]).includes(v)
}

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

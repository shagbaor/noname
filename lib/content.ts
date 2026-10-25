/*
 * Placeholder content for the home page.
 * Essays and testimonies are SAMPLE entries written to show the layout. Replace
 * them with real, consented archive material before launch. Timeline entries
 * are real milestones but should still be fact-checked by the editorial team.
 */

export type Pattern = "mudcloth" | "kente" | "adire" | "chevron"

export type Essay = {
  slug: string
  title: string
  dek: string
  author: string
  region: string
  era: string
  readMinutes: number
  category: "Queer History" | "Essay" | "Photo Essay" | "Archive Notes"
  pattern: Pattern
}

export const featuredEssay: Essay = {
  slug: "the-names-we-were-given",
  title: "The names we were given, and the names we kept",
  dek: "Before colonial penal codes, many African languages already held words for us. A long read on vocabulary, memory, and what survives translation.",
  author: "Editorial Collective",
  region: "Pan-African",
  era: "Pre-1900 – Present",
  readMinutes: 18,
  category: "Queer History",
  pattern: "mudcloth",
}

export const essays: Essay[] = [
  {
    slug: "letters-from-hillbrow",
    title: "Letters from Hillbrow",
    dek: "Reading a decade of correspondence between friends in 1980s Johannesburg.",
    author: "Sample Author",
    region: "Southern Africa",
    era: "1980s",
    readMinutes: 12,
    category: "Archive Notes",
    pattern: "kente",
  },
  {
    slug: "dance-floors-as-archives",
    title: "Dance floors as archives",
    dek: "How nightlife in Lagos, Nairobi and Dakar kept community records no library would.",
    author: "Sample Author",
    region: "West & East Africa",
    era: "1990s – 2010s",
    readMinutes: 9,
    category: "Photo Essay",
    pattern: "adire",
  },
  {
    slug: "after-the-ruling",
    title: "After the ruling",
    dek: "What changed, and what didn't, in the first five years after decriminalisation.",
    author: "Sample Author",
    region: "Southern Africa",
    era: "2019 – 2024",
    readMinutes: 14,
    category: "Essay",
    pattern: "chevron",
  },
]

export type Testimony = {
  id: string
  title: string
  narrator: string
  initials: string
  location: string
  recorded: string
  durationSec: number
  language: string
  transcribed: boolean
  /** 0–1 amplitudes for the waveform preview */
  wave: number[]
}

function wave(seed: number, n = 56): number[] {
  // Deterministic pseudo-waveform so server and client render identically.
  const out: number[] = []
  let x = seed
  for (let i = 0; i < n; i++) {
    x = (x * 9301 + 49297) % 233280
    const r = x / 233280
    const envelope = 0.45 + 0.55 * Math.sin((i / n) * Math.PI)
    out.push(Math.max(0.12, Math.min(1, r * envelope + 0.1)))
  }
  return out
}

export const testimonies: Testimony[] = [
  {
    id: "t-001",
    title: "My grandmother called it a gift",
    narrator: "Anonymous narrator",
    initials: "AN",
    location: "Kampala, Uganda",
    recorded: "2024",
    durationSec: 1724,
    language: "Luganda",
    transcribed: true,
    wave: wave(7),
  },
  {
    id: "t-002",
    title: "The first march, 1990",
    narrator: "Sample narrator",
    initials: "SN",
    location: "Johannesburg, South Africa",
    recorded: "2023",
    durationSec: 2410,
    language: "isiZulu",
    transcribed: true,
    wave: wave(19),
  },
  {
    id: "t-003",
    title: "A kitchen full of aunties",
    narrator: "Anonymous narrator",
    initials: "AN",
    location: "Accra, Ghana",
    recorded: "2025",
    durationSec: 1188,
    language: "Twi",
    transcribed: false,
    wave: wave(42),
  },
  {
    id: "t-004",
    title: "Songs we sang in secret",
    narrator: "Sample narrator",
    initials: "SN",
    location: "Dakar, Senegal",
    recorded: "2024",
    durationSec: 1532,
    language: "Wolof",
    transcribed: true,
    wave: wave(88),
  },
]

export type Region = "Southern Africa" | "East Africa" | "West Africa" | "Central Africa" | "North Africa"

export type TimelineEntry = {
  year: string
  title: string
  body: string
  region: Region
  place: string
}

export const timeline: TimelineEntry[] = [
  {
    year: "1988",
    title: "GLOW is founded",
    body: "Simon Nkoli and others form the Gay and Lesbian Organisation of the Witwatersrand, linking queer liberation to the anti-apartheid struggle.",
    region: "Southern Africa",
    place: "Johannesburg",
  },
  {
    year: "1990",
    title: "First Pride march on the continent",
    body: "Several hundred people march through Johannesburg in what is widely recorded as Africa's first Pride.",
    region: "Southern Africa",
    place: "Johannesburg",
  },
  {
    year: "1996",
    title: "Equality, written down",
    body: "South Africa's constitution protects against discrimination on the basis of sexual orientation.",
    region: "Southern Africa",
    place: "South Africa",
  },
  {
    year: "2015",
    title: "Mozambique's new penal code",
    body: "A revised penal code takes effect without the colonial-era provisions used against same-sex relations.",
    region: "Southern Africa",
    place: "Mozambique",
  },
  {
    year: "2019",
    title: "Botswana High Court ruling",
    body: "The court strikes down colonial-era laws criminalising consensual same-sex relations.",
    region: "Southern Africa",
    place: "Gaborone",
  },
  {
    year: "2020",
    title: "Gabon decriminalises",
    body: "Parliament reverses a 2019 law that had criminalised same-sex relations.",
    region: "Central Africa",
    place: "Libreville",
  },
]

export const archiveCollections = [
  { label: "Photographs", count: 1240 },
  { label: "Oral histories", count: 318 },
  { label: "Letters & zines", count: 562 },
  { label: "Press clippings", count: 2087 },
]

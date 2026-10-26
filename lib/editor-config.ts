import { NEWS_CATEGORIES, type FormId } from "./forms"

/*
 * How the admin editor adapts to each type: what's asked for, in what words,
 * in what order, and how the writing area looks. Nothing here touches the
 * database; every type still saves into the same post fields.
 */

type Text = { label: string; placeholder?: string; hint?: string }
export type MediaKind = "audio" | "video" | "images"
export type BodyStyle = "prose" | "verse" | "letter" | "transcript"

export type EditorConfig = {
  /** One line shown under the type banner */
  tip: string
  title: Text
  excerpt: Text
  author: Text | null
  body: Text & { style: BodyStyle; rows: number; template?: string; turns?: [string, string] }
  /** Which detail fields to ask for, and what to call them */
  era: Text | null
  location: Text | null
  language: Text | null
  region: boolean
  category?: readonly string[]
  media: (Text & { kind: MediaKind; accept: string }) | null
  /** Put media above the writing area (spoken & visual types) */
  mediaFirst: boolean
  transcribed: boolean
  cover: Text
}

const audio = (label: string, hint: string) => ({ kind: "audio" as const, label, hint, accept: "audio/*,.m4a,.mp3,.wav,.ogg,.webm" })
const images = (label: string, hint: string) => ({ kind: "images" as const, label, hint, accept: "image/*" })

const BASE = {
  era: { label: "Era", placeholder: "1990s" },
  location: { label: "Place", placeholder: "Accra, Ghana" },
  language: { label: "Language", placeholder: "English" },
  cover: { label: "Cover image", hint: "Shown at the top of the story and on cards. Without one, a textile pattern is used." },
}

export const EDITOR: Record<FormId, EditorConfig> = {
  essay: {
    tip: "Long-form writing. Use headings to give readers places to rest, and a pull quote for the line that should stay with them.",
    title: { label: "Headline", placeholder: "The names we were given, and the names we kept" },
    excerpt: { label: "Standfirst", placeholder: "One or two sentences that make someone want to read on." },
    author: { label: "Writer", placeholder: "Full name, initials or Anonymous" },
    body: { label: "Essay", style: "prose", rows: 22, placeholder: "Start writing…", hint: "Blank line = new paragraph. ## Heading, > pull quote, **bold**, *italic*." },
    ...BASE, region: true, media: null, mediaFirst: false, transcribed: false,
  },
  memoir: {
    tip: "First-person life writing. Let it breathe. Readers will meet the first paragraph with a large drop cap.",
    title: { label: "Title", placeholder: "The summer I learned to say it out loud" },
    excerpt: { label: "In a sentence", placeholder: "What is this memory about?" },
    author: { label: "Written by", placeholder: "Name, initials or Anonymous" },
    body: { label: "Memoir", style: "prose", rows: 22, placeholder: "I remember…", hint: "Blank line = new paragraph. ## for chapter breaks." },
    ...BASE, era: { label: "When it happened", placeholder: "Late 1980s" }, region: true, media: null, mediaFirst: false, transcribed: false,
  },
  letter: {
    tip: "Letters are shown on a paper card in a serif face, with every line break kept, exactly as written.",
    title: { label: "Title", placeholder: "Letters from Hillbrow" },
    excerpt: { label: "About this letter", placeholder: "Who wrote it, to whom, and how it reached the archive." },
    author: { label: "Letter writer", placeholder: "Initials are fine, e.g. M." },
    body: {
      label: "The letter", style: "letter", rows: 18, placeholder: "Dear …",
      hint: "Line breaks are kept. Transcribe spelling as written.",
      template: "Dear ,\n\n\n\nYours,\n",
    },
    ...BASE, era: { label: "Date written", placeholder: "March 1986" }, location: { label: "Sent from", placeholder: "Johannesburg" }, region: true,
    media: images("Scans of the letter", "Optional photos or scans of the original pages."), mediaFirst: false, transcribed: false,
    cover: { label: "Card image", hint: "Shown on cards only; letters display as text on the page." },
  },
  diary: {
    tip: "Diary entries keep their line breaks. Put each entry's date on its own line in bold.",
    title: { label: "Title", placeholder: "A notebook from 1994" },
    excerpt: { label: "About this diary", placeholder: "Whose pages are these, and why share them now?" },
    author: { label: "Diarist", placeholder: "Name, initials or Anonymous" },
    body: {
      label: "Entries", style: "letter", rows: 20, placeholder: "**12 June**\n…",
      hint: "Start each entry with its date in **bold**, then a new line.",
      template: "**Date**\n\n\n\n**Date**\n\n",
    },
    ...BASE, era: { label: "Years covered", placeholder: "1993 – 1995" }, region: true,
    media: images("Page scans", "Optional photos of the original pages."), mediaFirst: false, transcribed: false,
    cover: { label: "Card image", hint: "Shown on cards only." },
  },
  poem: {
    tip: "Poems are set in large italic serif. Each line stays on its own line; a blank line starts a new stanza.",
    title: { label: "Poem title", placeholder: "Praise song for the unnamed" },
    excerpt: { label: "Epigraph or note", placeholder: "A line about the poem, or a dedication." },
    author: { label: "Poet", placeholder: "Name or pen name" },
    body: { label: "The poem", style: "verse", rows: 18, placeholder: "First line\nsecond line\n\nNew stanza…", hint: "One line per line. Blank line between stanzas." },
    era: { label: "Written", placeholder: "2024" }, location: null, language: BASE.language, region: true,
    media: audio("Reading (optional)", "Upload a recording of the poet reading, if there is one."), mediaFirst: false, transcribed: false,
    cover: { label: "Card image", hint: "Shown on cards only; poems display as text on the page." },
  },
  fiction: {
    tip: "Short fiction. Mark it clearly so readers know these lives are imagined.",
    title: { label: "Story title", placeholder: "The tailor of Ouagadougou" },
    excerpt: { label: "Teaser", placeholder: "A line or two to draw readers in." },
    author: { label: "Author", placeholder: "Name or pen name" },
    body: { label: "Story", style: "prose", rows: 22, placeholder: "Once…", hint: "Blank line = new paragraph. ## for section breaks." },
    ...BASE, era: { label: "Set in", placeholder: "1970s" }, location: { label: "Setting", placeholder: "Ouagadougou" }, region: true,
    media: null, mediaFirst: false, transcribed: false,
  },
  "oral-history": {
    tip: "A recorded testimony. Upload the recording first; the transcript appears beneath the player. Make sure the narrator has consented to publication.",
    title: { label: "Testimony title", placeholder: "My grandmother called it a gift" },
    excerpt: { label: "Summary", placeholder: "What the narrator talks about, in a sentence." },
    author: { label: "Narrator", placeholder: "Name, initials or Anonymous narrator" },
    body: {
      label: "Transcript", style: "transcript", rows: 18, turns: ["Narrator", "Interviewer"],
      placeholder: "**Interviewer:** …\n\n**Narrator:** …", hint: "Start each turn with the speaker in bold, using the buttons above.",
    },
    era: { label: "Recorded", placeholder: "2024" }, location: { label: "Recorded in", placeholder: "Kampala, Uganda" },
    language: { label: "Language spoken", placeholder: "Luganda" }, region: true,
    media: audio("Recording", "MP3, M4A, WAV, OGG or WebM, any length. Recordings sent to the submissions email can be uploaded here."),
    mediaFirst: true, transcribed: true, cover: BASE.cover,
  },
  interview: {
    tip: "A conversation. Use the Q/A buttons to mark each turn; add the audio if it was recorded.",
    title: { label: "Interview title", placeholder: "In conversation with an elder organiser" },
    excerpt: { label: "Introduction", placeholder: "Who is being interviewed, and why now?" },
    author: { label: "Interviewer", placeholder: "Name" },
    body: {
      label: "Conversation", style: "transcript", rows: 20, turns: ["Q", "A"],
      placeholder: "**Q:** …\n\n**A:** …", hint: "Start each turn with **Q:** or **A:** (or names).",
      template: "**Q:** \n\n**A:** \n\n**Q:** \n\n**A:** ",
    },
    ...BASE, era: { label: "Conducted", placeholder: "October 2026" }, region: true,
    media: audio("Recording (optional)", "If the interview was recorded, upload it here."), mediaFirst: false, transcribed: true,
  },
  song: {
    tip: "A song or chant. Upload the recording, then add the lyrics and the story behind them.",
    title: { label: "Song title", placeholder: "A song for the wedding we never had" },
    excerpt: { label: "About the song", placeholder: "Where it was sung, and by whom." },
    author: { label: "Performer", placeholder: "Artist, choir or Anonymous" },
    body: {
      label: "Lyrics & story", style: "verse", rows: 16, placeholder: "Lyrics, one line per line…",
      hint: "Lyrics keep their line breaks. Add the story behind the song after a blank line.",
    },
    era: { label: "Recorded", placeholder: "2000s" }, location: { label: "Where it's sung", placeholder: "Lagos" },
    language: { label: "Language sung", placeholder: "Yoruba" }, region: true,
    media: audio("Recording", "MP3, M4A, WAV, OGG or WebM."), mediaFirst: true, transcribed: false, cover: BASE.cover,
  },
  "photo-essay": {
    tip: "A visual story. Add photographs first. The first appears full width, then they alternate. Captions matter.",
    title: { label: "Title", placeholder: "Dance floors as archives" },
    excerpt: { label: "Introduction", placeholder: "What these images show, in a sentence." },
    author: { label: "Photographer", placeholder: "Name or collective" },
    body: { label: "Accompanying text", style: "prose", rows: 10, placeholder: "Context for the images…", hint: "Optional. Appears after the photographs." },
    ...BASE, era: { label: "Photographed", placeholder: "1990s – 2010s" }, region: true,
    media: images("Photographs", "Upload in the order they should appear. Add a caption to each."), mediaFirst: true, transcribed: false,
  },
  artwork: {
    tip: "Art and illustration. Upload images of the work; use captions for medium, size and year.",
    title: { label: "Title of the work or series", placeholder: "Threads of the unnamed" },
    excerpt: { label: "About the work", placeholder: "A short description." },
    author: { label: "Artist", placeholder: "Name" },
    body: { label: "Artist statement", style: "prose", rows: 10, placeholder: "In the artist's words…", hint: "Optional." },
    ...BASE, era: { label: "Year", placeholder: "2025" }, region: true,
    media: images("Artworks", "One image per work or detail. Caption: medium, size, year."), mediaFirst: true, transcribed: false,
  },
  film: {
    tip: "A film or video. Upload an MP4 or paste a YouTube or Vimeo link. The player appears at the top of the page.",
    title: { label: "Film title", placeholder: "Title" },
    excerpt: { label: "Logline", placeholder: "The film in one sentence." },
    author: { label: "Director", placeholder: "Name" },
    body: { label: "Synopsis & credits", style: "prose", rows: 12, placeholder: "Synopsis…\n\n## Credits\n…", hint: "## Credits for a credits section." },
    ...BASE, era: { label: "Year", placeholder: "2023" }, region: true,
    media: { kind: "video", label: "Film", hint: "MP4 upload, or a YouTube / Vimeo link.", accept: "video/mp4,video/webm,video/quicktime" },
    mediaFirst: true, transcribed: false, cover: { label: "Poster image", hint: "Shown on cards. The film itself plays on the page." },
  },
  document: {
    tip: "An archival document such as a flyer, clipping, zine or record. Upload scans first, then transcribe or describe it.",
    title: { label: "Document title", placeholder: "A flyer for a house party, 1994" },
    excerpt: { label: "What it is", placeholder: "One line: what, when, where." },
    author: { label: "Contributed by", placeholder: "Archivist or donor" },
    body: { label: "Transcription & provenance", style: "prose", rows: 12, placeholder: "Transcription…\n\n## Provenance\nHow it came to the archive…", hint: "Transcribe the text, then explain where it came from." },
    ...BASE, era: { label: "Date of document", placeholder: "1994" }, region: true,
    media: images("Scans", "Front, back and details. Caption each page."), mediaFirst: true, transcribed: false,
  },
  tribute: {
    tip: "Honouring someone we have lost. Their years appear beside the story; the first paragraph opens with a drop cap.",
    title: { label: "Title", placeholder: "Remembering a friend who held the door open" },
    excerpt: { label: "In a sentence", placeholder: "Who they were to the people who loved them." },
    author: { label: "Written by", placeholder: "Name" },
    body: { label: "Tribute", style: "prose", rows: 18, placeholder: "They…", hint: "Use > for a remembered saying." },
    ...BASE, era: { label: "Years", placeholder: "1956 – 2021" }, location: { label: "Home", placeholder: "Nairobi" }, region: true,
    media: images("Photographs (optional)", "With the family's permission."), mediaFirst: false, transcribed: false,
    cover: { label: "Portrait", hint: "A photograph of the person, with permission." },
  },
  news: {
    tip: "News for the community: announcements, events, calls for submissions and press. News appears in its own section, not among the stories.",
    title: { label: "Headline", placeholder: "Submissions open for our winter collection" },
    excerpt: { label: "Summary", placeholder: "The news in one or two sentences." },
    author: { label: "Posted by", placeholder: "Kin Archive team" },
    body: { label: "Article", style: "prose", rows: 14, placeholder: "Details…", hint: "Blank line = new paragraph. ## Heading for sections." },
    era: { label: "Event date (optional)", placeholder: "Saturday 14 March, 6pm" }, location: { label: "Venue (optional)", placeholder: "Online / Nairobi" },
    language: null, region: false, category: NEWS_CATEGORIES,
    media: null, mediaFirst: false, transcribed: false, cover: { label: "Header image", hint: "Optional." },
  },
}

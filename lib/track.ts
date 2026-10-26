import type { Track } from "@/components/player"
import type { Post } from "./posts"

export function toTrack(p: Post): Track {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    narrator: p.author,
    language: p.language,
    transcribed: p.transcribed,
    durationSec: p.durationSec,
    audioUrl: p.audioUrl,
  }
}

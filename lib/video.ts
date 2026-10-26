/** YouTube / Vimeo links become embed URLs; anything else is treated as a video file. */
export function videoEmbed(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\.|^m\./, "")
    if (host === "youtube.com" && u.searchParams.get("v")) return `https://www.youtube-nocookie.com/embed/${u.searchParams.get("v")}`
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed${u.pathname}`
    if (host === "vimeo.com" && /^\/\d+/.test(u.pathname)) return `https://player.vimeo.com/video${u.pathname}`
  } catch {}
  return null
}

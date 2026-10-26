import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

/*
 * Issues short-lived upload tokens so editors' browsers can send files straight
 * to Vercel Blob (no 4.5 MB function limit). Only signed-in editors get a token,
 * and each token is restricted by file type and size.
 */

const LIMITS = {
  audio: { types: ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/wav", "audio/x-wav", "audio/ogg", "audio/webm", "audio/flac"], max: 300 * 1024 * 1024 },
  video: { types: ["video/mp4", "video/webm", "video/quicktime"], max: 500 * 1024 * 1024 },
  image: { types: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"], max: 25 * 1024 * 1024 },
} as const

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!(await getSession())) throw new Error("Not signed in")
        const kind = (clientPayload ?? "") as keyof typeof LIMITS
        const limit = LIMITS[kind]
        if (!limit) throw new Error("Unknown upload kind")
        if (!pathname.startsWith(`${kind}/`)) throw new Error("Bad path")
        return {
          allowedContentTypes: [...limit.types],
          maximumSizeInBytes: limit.max,
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed" }, { status: 400 })
  }
}

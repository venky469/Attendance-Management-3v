import type { NextRequest } from "next/server"
import crypto from "crypto"

export async function POST(_req: NextRequest) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    return new Response("Missing Cloudinary env vars", { status: 500 })
  }
  const timestamp = Math.floor(Date.now() / 1000)
  // Include folder for deterministic signature; keep minimal params
  const folder = "faces"
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  const signature = crypto.createHash("sha1").update(toSign).digest("hex")
  return Response.json({ timestamp, signature, folder, apiKey, cloudName })
}

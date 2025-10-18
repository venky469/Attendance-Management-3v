import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

export async function GET() {
  try {
    const db = await getDb()

    // MongoDB stats
    // dbStats returns fields like dataSize, storageSize, indexSize, collections, objects
    const mongoStats = await db.command({ dbStats: 1, scale: 1 }).catch((e) => {
      console.error("[admin/system] dbStats error:", e)
      return null
    })

    // Maintenance flag from global settings
    let maintenance: { enabled?: boolean; message?: string } = {}
    try {
      const doc = await db.collection("app_settings").findOne<{ data?: any }>({ _id: "global" } as any)
      maintenance = doc?.data?.maintenance || { enabled: false }
    } catch (e) {
      console.error("[admin/system] maintenance read error:", e)
    }

    // Cloudinary usage via Admin API
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    const cloudinary: any = {
      ok: false,
      error: undefined as string | undefined,
      bytesUsed: null as number | null,
      limitBytes: null as number | null,
      breakdown: {
        imageUsedBytes: null as number | null,
        videoUsedBytes: null as number | null,
        rawUsedBytes: null as number | null,
      },
      raw: null as any,
    }

    if (cloudName && apiKey && apiSecret) {
      try {
        const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
          headers: { Authorization: `Basic ${auth}` },
          // Prevent any caching of these stats
          cache: "no-store",
        })
        const usage = await res.json().catch(() => ({}) as any)
        cloudinary.raw = usage

        // Best-effort parsing across plan types/shapes
        const s = (usage && usage.storage) || {}
        const imageUsed =
          (s.image && (s.image.used || s.image.bytes_used)) ??
          (usage.image && (usage.image.usage || usage.image.bytes)) ??
          null
        const videoUsed =
          (s.video && (s.video.used || s.video.bytes_used)) ??
          (usage.video && (usage.video.usage || usage.video.bytes)) ??
          null
        const rawUsed =
          (s.raw && (s.raw.used || s.raw.bytes_used)) ?? (usage.raw && (usage.raw.usage || usage.raw.bytes)) ?? null

        const limit =
          s.limit ??
          (usage.plan && usage.plan.storage && usage.plan.storage.quota && usage.plan.storage.quota.bytes) ??
          null

        const usedSum =
          [imageUsed, videoUsed, rawUsed].filter((v) => typeof v === "number").reduce((a, b) => a + (b as number), 0) ||
          null

        cloudinary.ok = res.ok
        cloudinary.breakdown.imageUsedBytes = typeof imageUsed === "number" ? imageUsed : null
        cloudinary.breakdown.videoUsedBytes = typeof videoUsed === "number" ? videoUsed : null
        cloudinary.breakdown.rawUsedBytes = typeof rawUsed === "number" ? rawUsed : null
        cloudinary.bytesUsed = usedSum
        cloudinary.limitBytes = typeof limit === "number" ? limit : null

        if (!res.ok) {
          cloudinary.error = (usage && (usage.error?.message || usage.message)) || "Cloudinary usage fetch failed"
        }
      } catch (e: any) {
        console.error("[admin/system] Cloudinary usage error:", e)
        cloudinary.error = e?.message || "Cloudinary usage error"
      }
    } else {
      cloudinary.error = "Missing Cloudinary server env vars"
    }

    const mongo = mongoStats
      ? {
          ok: true,
          dataSize: mongoStats.dataSize ?? null,
          storageSize: mongoStats.storageSize ?? null,
          indexSize: mongoStats.indexSize ?? null,
          collections: mongoStats.collections ?? null,
          objects: mongoStats.objects ?? null,
          // free/limit are not available from dbStats; can be provided via hosting dashboards.
          // If you want a quota bar, set MONGODB_MAX_STORAGE_BYTES in Vars.
          limitBytes: process.env.MONGODB_MAX_STORAGE_BYTES
            ? Number.parseInt(process.env.MONGODB_MAX_STORAGE_BYTES)
            : null,
        }
      : { ok: false }

    return NextResponse.json({
      mongo,
      cloudinary,
      maintenance,
      ts: Date.now(),
    })
  } catch (e) {
    console.error("[admin/system] fatal error:", e)
    return NextResponse.json({ error: "Failed to load system stats" }, { status: 500 })
  }
}

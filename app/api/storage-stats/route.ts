import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

export async function GET() {
  try {
    const db = await getDb()

    console.log("[v0] Fetching MongoDB storage statistics...")

    // Get database stats
    const dbStats = await db.command({ dbStats: 1, scale: 1 }).catch((e) => {
      console.error("[storage-stats] dbStats error:", e)
      return null
    })

    if (!dbStats) {
      return NextResponse.json({ error: "Failed to fetch database stats" }, { status: 500 })
    }

    // Get collection stats for detailed breakdown
    const collections = ["staff", "students", "attendance", "leave_requests", "notifications", "face_templates"]
    const collectionStats = []

    for (const collName of collections) {
      try {
        const stats = await db.command({ collStats: collName, scale: 1 })
        collectionStats.push({
          name: collName,
          count: stats.count || 0,
          size: stats.size || 0,
          storageSize: stats.storageSize || 0,
          avgObjSize: stats.avgObjSize || 0,
        })
      } catch (e) {
        console.error(`[storage-stats] Error fetching stats for ${collName}:`, e)
        collectionStats.push({
          name: collName,
          count: 0,
          size: 0,
          storageSize: 0,
          avgObjSize: 0,
        })
      }
    }

    // MongoDB Atlas Free Tier limit is 512 MB
    const FREE_TIER_LIMIT = 512 * 1024 * 1024 // 512 MB in bytes
    const limitBytes = process.env.MONGODB_MAX_STORAGE_BYTES
      ? Number.parseInt(process.env.MONGODB_MAX_STORAGE_BYTES)
      : FREE_TIER_LIMIT

    const usedBytes = dbStats.dataSize || 0
    const storageBytes = dbStats.storageSize || 0
    const indexBytes = dbStats.indexSize || 0
    const totalUsed = usedBytes + indexBytes
    const percentUsed = (totalUsed / limitBytes) * 100

    // Calculate estimated days until full (based on last 30 days growth)
    // This is a simple estimation - in production you'd track historical data
    const estimatedDaysUntilFull = percentUsed < 80 ? Math.floor((100 - percentUsed) / (percentUsed / 30)) : null

    console.log("[v0] Storage stats fetched successfully")
    console.log(
      `[v0] Used: ${(totalUsed / 1024 / 1024).toFixed(2)} MB / ${(limitBytes / 1024 / 1024).toFixed(2)} MB (${percentUsed.toFixed(1)}%)`,
    )

    return NextResponse.json({
      success: true,
      storage: {
        usedBytes: totalUsed,
        limitBytes,
        percentUsed: Math.round(percentUsed * 10) / 10,
        dataSize: usedBytes,
        storageSize: storageBytes,
        indexSize: indexBytes,
        collections: dbStats.collections || 0,
        objects: dbStats.objects || 0,
        avgObjSize: dbStats.avgObjSize || 0,
        estimatedDaysUntilFull,
      },
      collections: collectionStats,
      timestamp: new Date().toISOString(),
    })
  } catch (e) {
    console.error("[storage-stats] Fatal error:", e)
    return NextResponse.json({ error: "Failed to fetch storage statistics" }, { status: 500 })
  }
}

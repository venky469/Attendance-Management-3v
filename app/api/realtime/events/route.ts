
import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongo"

export async function GET(req: NextRequest) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(req.url)
    const since = searchParams.get("since")
    const sinceTime = since ? new Date(since) : new Date(Date.now() - 30000) // Last 30 seconds

    // Get recent events from MongoDB
    const events = await db
      .collection("realtime_events")
      .find({
        timestamp: { $gt: sinceTime.toISOString() },
      })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray()

    return Response.json({
      events: events.map(({ _id, ...event }) => event),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Real-time] GET events error:", error)
    return Response.json({
      events: [],
      timestamp: new Date().toISOString(),
      error: "Failed to fetch events",
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb()
    const event = await req.json()

    // Add timestamp if not present
    if (!event.timestamp) {
      event.timestamp = new Date().toISOString()
    }

    // Store event in MongoDB
    await db.collection("realtime_events").insertOne({
      ...event,
      createdAt: new Date(),
    })

    // Clean up old events (keep only last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    await db.collection("realtime_events").deleteMany({
      createdAt: { $lt: oneDayAgo },
    })

    console.log("[Real-time] Event stored:", event.type)
    return Response.json({ success: true })
  } catch (error) {
    console.error("[Real-time] POST event error:", error)
    return Response.json({ success: false, error: "Failed to store event" }, { status: 500 })
  }
}

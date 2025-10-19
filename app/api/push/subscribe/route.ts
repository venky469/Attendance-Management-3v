import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

export async function POST(req: Request) {
  try {
    const subscription = await req.json()
    const db = await getDb()

    // Get user from session/auth (you'll need to implement this based on your auth)
    // For now, we'll store the subscription with a timestamp
    await db.collection("push_subscriptions").insertOne({
      subscription,
      createdAt: new Date(),
      // Add userId when you have auth context
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving push subscription:", error)
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

export async function POST(req: Request) {
  try {
    const subscription = await req.json()
    const db = await getDb()

    await db.collection("push_subscriptions").deleteOne({
      "subscription.endpoint": subscription.endpoint,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing push subscription:", error)
    return NextResponse.json({ error: "Failed to remove subscription" }, { status: 500 })
  }
}



import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import { getUserFromRequest } from "@/lib/server-auth"

export async function POST(req: Request) {
  try {
    const subscription = await req.json()
    const db = await getDb()

    const user = await getUserFromRequest()
    const userId = user?.id || null

    // Check if subscription already exists
    const existing = await db.collection("push_subscriptions").findOne({
      "subscription.endpoint": subscription.endpoint,
    })

    if (existing) {
      // Update existing subscription with userId
      await db.collection("push_subscriptions").updateOne(
        { "subscription.endpoint": subscription.endpoint },
        {
          $set: {
            subscription,
            userId,
            updatedAt: new Date(),
          },
        },
      )
    } else {
      // Create new subscription
      await db.collection("push_subscriptions").insertOne({
        subscription,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving push subscription:", error)
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
  }
}

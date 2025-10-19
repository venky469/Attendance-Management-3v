import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import webpush from "web-push"

// Configure web-push with VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails("mailto:venkythota469@gmail.com", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)
}

export async function POST(req: Request) {
  try {
    const { title, body, data, userId } = await req.json()
    const db = await getDb()

    // Get subscriptions (filter by userId if provided)
    const query = userId ? { userId } : {}
    const subscriptions = await db.collection("push_subscriptions").find(query).toArray()

    const payload = JSON.stringify({
      title,
      body,
      data,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
    })

    // Send notifications to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map((sub) => webpush.sendNotification(sub.subscription, payload)),
    )

    // Remove failed subscriptions (expired/invalid)
    const failedIndexes = results
      .map((result, index) => (result.status === "rejected" ? index : -1))
      .filter((index) => index !== -1)

    if (failedIndexes.length > 0) {
      await db.collection("push_subscriptions").deleteMany({
        _id: { $in: failedIndexes.map((i) => subscriptions[i]._id) },
      })
    }

    return NextResponse.json({
      success: true,
      sent: results.filter((r) => r.status === "fulfilled").length,
      failed: failedIndexes.length,
    })
  } catch (error) {
    console.error("Error sending push notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}

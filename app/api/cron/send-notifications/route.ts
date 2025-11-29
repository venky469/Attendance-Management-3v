import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const VAPID_PUBLIC_KEY = "BNdVyZH9EWmbKQ7H9NFU2AKlLWSKS8Basd6Jhr6mP8ZJUMbw6ve0o_2Yw5MtJsii8iEx7un2jUgvUiTNvSh0MTA"
const VAPID_PRIVATE_KEY = "M0MGV7GnRqfejqNYdYP3bmgkRP9iALXBlTjddYSnFvU"
const PRODUCTION_URL = "https://faceattendv1.netlify.app"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Cron job started - send-notifications")

    const searchParams = request.nextUrl.searchParams
    const apiKey = searchParams.get("api_key")

    if (!apiKey || apiKey !== "venkythota") {
      console.log("[v0] Unauthorized cron job attempt")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()
    if (!db) {
      console.log("[v0] Database connection failed")
      return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
    }

    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000)

    console.log("[v0] Searching for notifications created after:", sixtySecondsAgo.toISOString())

    const pendingNotifications = await db
      .collection("notifications")
      .find({
        createdAt: { $gte: sixtySecondsAgo.toISOString() },
        sent: { $ne: true },
      })
      .toArray()

    console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

    if (pendingNotifications.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending notifications",
        count: 0,
        searchedAfter: sixtySecondsAgo.toISOString(),
      })
    }

    const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
    console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

    if (subscriptions.length === 0) {
      console.log("[v0] No push subscriptions found")
      for (const notification of pendingNotifications) {
        await db.collection("notifications").updateOne(
          { _id: notification._id },
          {
            $set: {
              sent: true,
              sentAt: new Date().toISOString(),
              recipientCount: 0,
            },
          },
        )
      }
      return NextResponse.json({
        success: true,
        message: "No push subscriptions available",
        processed: pendingNotifications.length,
        sent: 0,
        failed: 0,
        totalSubscriptions: 0,
      })
    }

    let sentCount = 0
    let failedCount = 0
    const errorDetails: any[] = []

    const webpush = require("web-push")
    webpush.setVapidDetails("mailto:venkythota469@gmail.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

    for (const notification of pendingNotifications) {
      const { title, message } = notification

      console.log(`[v0] Processing notification: ${title}`)
      console.log(`[v0] Sending to all ${subscriptions.length} subscriptions`)

      if (subscriptions.length > 0) {
        console.log("[v0] Sample subscription object:", JSON.stringify(subscriptions[0].subscription, null, 2))
      }

      for (const subscription of subscriptions) {
        try {
          const payload = JSON.stringify({
            title: title || "Employee Management System",
            body: message,
            icon: `${PRODUCTION_URL}/logo3.png`,
            badge: `${PRODUCTION_URL}/logo3.png`,
            sound: `${PRODUCTION_URL}/notification-sound.mp3`,
            vibrate: [200, 100, 200, 100, 200],
            requireInteraction: false,
            silent: false,
            renotify: true,
            tag: `notification-${notification._id.toString()}`,
            data: {
              url: `${PRODUCTION_URL}/notifications`,
              notificationId: notification._id.toString(),
              timestamp: Date.now(),
              sound: `${PRODUCTION_URL}/notification-sound.mp3`,
              notificationType: "general",
            },
          })

          await webpush.sendNotification(subscription.subscription, payload)
          sentCount++
        } catch (error: any) {
          console.error(`[v0] Failed to send push:`, {
            statusCode: error.statusCode,
            message: error.message,
            body: error.body,
            endpoint: subscription.subscription?.endpoint?.substring(0, 50) + "...",
          })

          errorDetails.push({
            statusCode: error.statusCode,
            message: error.message,
            body: error.body,
          })

          failedCount++

          if (error.statusCode === 410 || error.statusCode === 404) {
            await db.collection("push_subscriptions").deleteOne({ _id: subscription._id })
          }
        }
      }

      await db.collection("notifications").updateOne(
        { _id: notification._id },
        {
          $set: {
            sent: true,
            sentAt: new Date().toISOString(),
            recipientCount: sentCount,
          },
        },
      )
    }

    console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

    return NextResponse.json({
      success: true,
      message: sentCount > 0 ? "Notifications sent successfully" : "Failed to send notifications",
      processed: pendingNotifications.length,
      sent: sentCount,
      failed: failedCount,
      totalSubscriptions: subscriptions.length,
      errors: errorDetails.slice(0, 5),
    })
  } catch (error: any) {
    console.error("[v0] Cron job error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}

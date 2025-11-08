
// import { type NextRequest, NextResponse } from "next/server"
// import { getDb } from "@/lib/mongo"

// export const dynamic = "force-dynamic"
// export const maxDuration = 60

// export async function GET(request: NextRequest) {
//   try {
//     console.log("[v0] Cron job started - send-notifications")

//     const searchParams = request.nextUrl.searchParams
//     const apiKey = searchParams.get("api_key")

//     // Verify API key
//     if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
//       console.log("[v0] Unauthorized cron job attempt")
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
//     }

//     const db = await getDb()
//     if (!db) {
//       console.log("[v0] Database connection failed")
//       return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
//     }

//     const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
//     const pendingNotifications = await db
//       .collection("notifications")
//       .find({
//         createdAt: { $gte: fiveMinutesAgo },
//         sent: { $ne: true },
//       })
//       .toArray()

//     console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

//     if (pendingNotifications.length === 0) {
//       return NextResponse.json({
//         success: true,
//         message: "No pending notifications",
//         count: 0,
//       })
//     }

//     const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
//     console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

//     let sentCount = 0
//     let failedCount = 0

//     for (const notification of pendingNotifications) {
//       const { title, message, audience, institutionName, targetUserId } = notification
//       console.log(`[v0] Processing notification: ${title}, audience: ${audience}`)

//       // Filter subscriptions based on audience
//       let targetSubscriptions = subscriptions

//       if (audience === "institution" && institutionName) {
//         targetSubscriptions = subscriptions.filter((sub) => sub.institutionName === institutionName)
//       } else if (audience === "admins") {
//         targetSubscriptions = subscriptions.filter((sub) => ["Admin", "SuperAdmin"].includes(sub.role))
//       } else if (audience === "target" && targetUserId) {
//         targetSubscriptions = subscriptions.filter((sub) => sub.userId === targetUserId)
//       }

//       console.log(`[v0] Sending to ${targetSubscriptions.length} subscriptions`)

//       // Send push notification to each subscription
//       for (const subscription of targetSubscriptions) {
//         try {
//           const webpush = require("web-push")

//           // Configure web-push if not already configured
//           if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
//             webpush.setVapidDetails(
//               "mailto:admin@faceattendance.com",
//               process.env.VAPID_PUBLIC_KEY,
//               process.env.VAPID_PRIVATE_KEY,
//             )

//             await webpush.sendNotification(
//               subscription.subscription,
//               JSON.stringify({
//                 title: title || "Face Attendance",
//                 body: message,
//                 icon: "/logo3.jpg",
//                 badge: "/logo3.jpg",
//                 data: {
//                   url: "/notifications",
//                   notificationId: notification._id.toString(),
//                 },
//               }),
//             )
//             sentCount++
//             console.log(`[v0] Push notification sent successfully`)
//           } else {
//             console.log("[v0] VAPID keys not configured")
//           }
//         } catch (error) {
//           console.error("[v0] Failed to send push notification:", error)
//           failedCount++
//         }
//       }

//       await db.collection("notifications").updateOne(
//         { _id: notification._id },
//         {
//           $set: {
//             sent: true,
//             sentAt: new Date(),
//             recipientCount: targetSubscriptions.length,
//           },
//         },
//       )
//     }

//     console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

//     return NextResponse.json({
//       success: true,
//       message: "Notifications processed",
//       processed: pendingNotifications.length,
//       sent: sentCount,
//       failed: failedCount,
//     })
//   } catch (error) {
//     console.error("[v0] Cron job error:", error)
//     return NextResponse.json(
//       {
//         success: false,
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }



import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Cron job started - send-notifications")

    const searchParams = request.nextUrl.searchParams
    const apiKey = searchParams.get("api_key")

    // Verify API key
    if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
      console.log("[v0] Unauthorized cron job attempt")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()
    if (!db) {
      console.log("[v0] Database connection failed")
      return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
    }

    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
    const pendingNotifications = await db
      .collection("notifications")
      .find({
        createdAt: { $gte: twoMinutesAgo },
        sent: { $ne: true },
      })
      .toArray()

    console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

    if (pendingNotifications.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending notifications",
        count: 0,
      })
    }

    const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
    console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

    let sentCount = 0
    let failedCount = 0

    for (const notification of pendingNotifications) {
      const { title, message, audience, institutionName, targetUserId } = notification
      console.log(`[v0] Processing notification: ${title}, audience: ${audience}`)

      // Filter subscriptions based on audience
      let targetSubscriptions = subscriptions

      if (audience === "institution" && institutionName) {
        targetSubscriptions = subscriptions.filter((sub) => sub.institutionName === institutionName)
      } else if (audience === "admins") {
        targetSubscriptions = subscriptions.filter((sub) => ["Admin", "SuperAdmin"].includes(sub.role))
      } else if (audience === "target" && targetUserId) {
        targetSubscriptions = subscriptions.filter((sub) => sub.userId === targetUserId)
      }

      console.log(`[v0] Sending to ${targetSubscriptions.length} subscriptions`)

      // Send push notification to each subscription
      for (const subscription of targetSubscriptions) {
        try {
          const webpush = require("web-push")

          // Configure web-push if not already configured
          if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
            webpush.setVapidDetails(
              "mailto:admin@faceattendance.com",
              process.env.VAPID_PUBLIC_KEY,
              process.env.VAPID_PRIVATE_KEY,
            )

            await webpush.sendNotification(
              subscription.subscription,
              JSON.stringify({
                title: title || "Face Attendance",
                body: message,
                icon: "/logo3.jpg",
                badge: "/logo3.jpg",
                sound: "/notification-sound.mp3",
                vibrate: [200, 100, 200],
                requireInteraction: true,
                silent: false,
                renotify: true,
                tag: `notification-${notification._id.toString()}`,
                data: {
                  url: "/notifications",
                  notificationId: notification._id.toString(),
                  timestamp: Date.now(),
                },
              }),
            )
            sentCount++
            console.log(`[v0] Push notification sent successfully to ${subscription.userId}`)
          } else {
            console.log("[v0] VAPID keys not configured")
          }
        } catch (error) {
          console.error("[v0] Failed to send push notification:", error)
          failedCount++
        }
      }

      await db.collection("notifications").updateOne(
        { _id: notification._id },
        {
          $set: {
            sent: true,
            sentAt: new Date(),
            recipientCount: targetSubscriptions.length,
          },
        },
      )
    }

    console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

    return NextResponse.json({
      success: true,
      message: "Notifications processed",
      processed: pendingNotifications.length,
      sent: sentCount,
      failed: failedCount,
    })
  } catch (error) {
    console.error("[v0] Cron job error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

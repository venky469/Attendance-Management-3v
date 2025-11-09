
// // // // // // // // // // // import { type NextRequest, NextResponse } from "next/server"
// // // // // // // // // // // import { getDb } from "@/lib/mongo"

// // // // // // // // // // // export const dynamic = "force-dynamic"
// // // // // // // // // // // export const maxDuration = 60

// // // // // // // // // // // export async function GET(request: NextRequest) {
// // // // // // // // // // //   try {
// // // // // // // // // // //     console.log("[v0] Cron job started - send-notifications")

// // // // // // // // // // //     const searchParams = request.nextUrl.searchParams
// // // // // // // // // // //     const apiKey = searchParams.get("api_key")

// // // // // // // // // // //     // Verify API key
// // // // // // // // // // //     if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
// // // // // // // // // // //       console.log("[v0] Unauthorized cron job attempt")
// // // // // // // // // // //       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
// // // // // // // // // // //     }

// // // // // // // // // // //     const db = await getDb()
// // // // // // // // // // //     if (!db) {
// // // // // // // // // // //       console.log("[v0] Database connection failed")
// // // // // // // // // // //       return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
// // // // // // // // // // //     }

// // // // // // // // // // //     const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
// // // // // // // // // // //     const pendingNotifications = await db
// // // // // // // // // // //       .collection("notifications")
// // // // // // // // // // //       .find({
// // // // // // // // // // //         createdAt: { $gte: fiveMinutesAgo },
// // // // // // // // // // //         sent: { $ne: true },
// // // // // // // // // // //       })
// // // // // // // // // // //       .toArray()

// // // // // // // // // // //     console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

// // // // // // // // // // //     if (pendingNotifications.length === 0) {
// // // // // // // // // // //       return NextResponse.json({
// // // // // // // // // // //         success: true,
// // // // // // // // // // //         message: "No pending notifications",
// // // // // // // // // // //         count: 0,
// // // // // // // // // // //       })
// // // // // // // // // // //     }

// // // // // // // // // // //     const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
// // // // // // // // // // //     console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

// // // // // // // // // // //     let sentCount = 0
// // // // // // // // // // //     let failedCount = 0

// // // // // // // // // // //     for (const notification of pendingNotifications) {
// // // // // // // // // // //       const { title, message, audience, institutionName, targetUserId } = notification
// // // // // // // // // // //       console.log(`[v0] Processing notification: ${title}, audience: ${audience}`)

// // // // // // // // // // //       // Filter subscriptions based on audience
// // // // // // // // // // //       let targetSubscriptions = subscriptions

// // // // // // // // // // //       if (audience === "institution" && institutionName) {
// // // // // // // // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.institutionName === institutionName)
// // // // // // // // // // //       } else if (audience === "admins") {
// // // // // // // // // // //         targetSubscriptions = subscriptions.filter((sub) => ["Admin", "SuperAdmin"].includes(sub.role))
// // // // // // // // // // //       } else if (audience === "target" && targetUserId) {
// // // // // // // // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.userId === targetUserId)
// // // // // // // // // // //       }

// // // // // // // // // // //       console.log(`[v0] Sending to ${targetSubscriptions.length} subscriptions`)

// // // // // // // // // // //       // Send push notification to each subscription
// // // // // // // // // // //       for (const subscription of targetSubscriptions) {
// // // // // // // // // // //         try {
// // // // // // // // // // //           const webpush = require("web-push")

// // // // // // // // // // //           // Configure web-push if not already configured
// // // // // // // // // // //           if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
// // // // // // // // // // //             webpush.setVapidDetails(
// // // // // // // // // // //               "mailto:admin@faceattendance.com",
// // // // // // // // // // //               process.env.VAPID_PUBLIC_KEY,
// // // // // // // // // // //               process.env.VAPID_PRIVATE_KEY,
// // // // // // // // // // //             )

// // // // // // // // // // //             await webpush.sendNotification(
// // // // // // // // // // //               subscription.subscription,
// // // // // // // // // // //               JSON.stringify({
// // // // // // // // // // //                 title: title || "Face Attendance",
// // // // // // // // // // //                 body: message,
// // // // // // // // // // //                 icon: "/logo3.png",
// // // // // // // // // // //                 badge: "/logo3.png",
// // // // // // // // // // //                 data: {
// // // // // // // // // // //                   url: "/notifications",
// // // // // // // // // // //                   notificationId: notification._id.toString(),
// // // // // // // // // // //                 },
// // // // // // // // // // //               }),
// // // // // // // // // // //             )
// // // // // // // // // // //             sentCount++
// // // // // // // // // // //             console.log(`[v0] Push notification sent successfully`)
// // // // // // // // // // //           } else {
// // // // // // // // // // //             console.log("[v0] VAPID keys not configured")
// // // // // // // // // // //           }
// // // // // // // // // // //         } catch (error) {
// // // // // // // // // // //           console.error("[v0] Failed to send push notification:", error)
// // // // // // // // // // //           failedCount++
// // // // // // // // // // //         }
// // // // // // // // // // //       }

// // // // // // // // // // //       await db.collection("notifications").updateOne(
// // // // // // // // // // //         { _id: notification._id },
// // // // // // // // // // //         {
// // // // // // // // // // //           $set: {
// // // // // // // // // // //             sent: true,
// // // // // // // // // // //             sentAt: new Date(),
// // // // // // // // // // //             recipientCount: targetSubscriptions.length,
// // // // // // // // // // //           },
// // // // // // // // // // //         },
// // // // // // // // // // //       )
// // // // // // // // // // //     }

// // // // // // // // // // //     console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

// // // // // // // // // // //     return NextResponse.json({
// // // // // // // // // // //       success: true,
// // // // // // // // // // //       message: "Notifications processed",
// // // // // // // // // // //       processed: pendingNotifications.length,
// // // // // // // // // // //       sent: sentCount,
// // // // // // // // // // //       failed: failedCount,
// // // // // // // // // // //     })
// // // // // // // // // // //   } catch (error) {
// // // // // // // // // // //     console.error("[v0] Cron job error:", error)
// // // // // // // // // // //     return NextResponse.json(
// // // // // // // // // // //       {
// // // // // // // // // // //         success: false,
// // // // // // // // // // //         error: error instanceof Error ? error.message : "Unknown error",
// // // // // // // // // // //       },
// // // // // // // // // // //       { status: 500 },
// // // // // // // // // // //     )
// // // // // // // // // // //   }
// // // // // // // // // // // }



// // // // // // // // // // import { type NextRequest, NextResponse } from "next/server"
// // // // // // // // // // import { getDb } from "@/lib/mongo"

// // // // // // // // // // export const dynamic = "force-dynamic"
// // // // // // // // // // export const maxDuration = 60

// // // // // // // // // // export async function GET(request: NextRequest) {
// // // // // // // // // //   try {
// // // // // // // // // //     console.log("[v0] Cron job started - send-notifications")

// // // // // // // // // //     const searchParams = request.nextUrl.searchParams
// // // // // // // // // //     const apiKey = searchParams.get("api_key")

// // // // // // // // // //     // Verify API key
// // // // // // // // // //     if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
// // // // // // // // // //       console.log("[v0] Unauthorized cron job attempt")
// // // // // // // // // //       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
// // // // // // // // // //     }

// // // // // // // // // //     const db = await getDb()
// // // // // // // // // //     if (!db) {
// // // // // // // // // //       console.log("[v0] Database connection failed")
// // // // // // // // // //       return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
// // // // // // // // // //     }

// // // // // // // // // //     const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
// // // // // // // // // //     const pendingNotifications = await db
// // // // // // // // // //       .collection("notifications")
// // // // // // // // // //       .find({
// // // // // // // // // //         createdAt: { $gte: twoMinutesAgo },
// // // // // // // // // //         sent: { $ne: true },
// // // // // // // // // //       })
// // // // // // // // // //       .toArray()

// // // // // // // // // //     console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

// // // // // // // // // //     if (pendingNotifications.length === 0) {
// // // // // // // // // //       return NextResponse.json({
// // // // // // // // // //         success: true,
// // // // // // // // // //         message: "No pending notifications",
// // // // // // // // // //         count: 0,
// // // // // // // // // //       })
// // // // // // // // // //     }

// // // // // // // // // //     const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
// // // // // // // // // //     console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

// // // // // // // // // //     let sentCount = 0
// // // // // // // // // //     let failedCount = 0

// // // // // // // // // //     for (const notification of pendingNotifications) {
// // // // // // // // // //       const { title, message, audience, institutionName, targetUserId } = notification
// // // // // // // // // //       console.log(`[v0] Processing notification: ${title}, audience: ${audience}`)

// // // // // // // // // //       // Filter subscriptions based on audience
// // // // // // // // // //       let targetSubscriptions = subscriptions

// // // // // // // // // //       if (audience === "institution" && institutionName) {
// // // // // // // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.institutionName === institutionName)
// // // // // // // // // //       } else if (audience === "admins") {
// // // // // // // // // //         targetSubscriptions = subscriptions.filter((sub) => ["Admin", "SuperAdmin"].includes(sub.role))
// // // // // // // // // //       } else if (audience === "target" && targetUserId) {
// // // // // // // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.userId === targetUserId)
// // // // // // // // // //       }

// // // // // // // // // //       console.log(`[v0] Sending to ${targetSubscriptions.length} subscriptions`)

// // // // // // // // // //       // Send push notification to each subscription
// // // // // // // // // //       for (const subscription of targetSubscriptions) {
// // // // // // // // // //         try {
// // // // // // // // // //           const webpush = require("web-push")

// // // // // // // // // //           // Configure web-push if not already configured
// // // // // // // // // //           if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
// // // // // // // // // //             webpush.setVapidDetails(
// // // // // // // // // //               "mailto:admin@faceattendance.com",
// // // // // // // // // //               process.env.VAPID_PUBLIC_KEY,
// // // // // // // // // //               process.env.VAPID_PRIVATE_KEY,
// // // // // // // // // //             )

// // // // // // // // // //             await webpush.sendNotification(
// // // // // // // // // //               subscription.subscription,
// // // // // // // // // //               JSON.stringify({
// // // // // // // // // //                 title: title || "Face Attendance",
// // // // // // // // // //                 body: message,
// // // // // // // // // //                 icon: "/logo3.png",
// // // // // // // // // //                 badge: "/logo3.png",
// // // // // // // // // //                 sound: "/notification-sound.mp3",
// // // // // // // // // //                 vibrate: [200, 100, 200],
// // // // // // // // // //                 requireInteraction: true,
// // // // // // // // // //                 silent: false,
// // // // // // // // // //                 renotify: true,
// // // // // // // // // //                 tag: `notification-${notification._id.toString()}`,
// // // // // // // // // //                 data: {
// // // // // // // // // //                   url: "/notifications",
// // // // // // // // // //                   notificationId: notification._id.toString(),
// // // // // // // // // //                   timestamp: Date.now(),
// // // // // // // // // //                 },
// // // // // // // // // //               }),
// // // // // // // // // //             )
// // // // // // // // // //             sentCount++
// // // // // // // // // //             console.log(`[v0] Push notification sent successfully to ${subscription.userId}`)
// // // // // // // // // //           } else {
// // // // // // // // // //             console.log("[v0] VAPID keys not configured")
// // // // // // // // // //           }
// // // // // // // // // //         } catch (error) {
// // // // // // // // // //           console.error("[v0] Failed to send push notification:", error)
// // // // // // // // // //           failedCount++
// // // // // // // // // //         }
// // // // // // // // // //       }

// // // // // // // // // //       await db.collection("notifications").updateOne(
// // // // // // // // // //         { _id: notification._id },
// // // // // // // // // //         {
// // // // // // // // // //           $set: {
// // // // // // // // // //             sent: true,
// // // // // // // // // //             sentAt: new Date(),
// // // // // // // // // //             recipientCount: targetSubscriptions.length,
// // // // // // // // // //           },
// // // // // // // // // //         },
// // // // // // // // // //       )
// // // // // // // // // //     }

// // // // // // // // // //     console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

// // // // // // // // // //     return NextResponse.json({
// // // // // // // // // //       success: true,
// // // // // // // // // //       message: "Notifications processed",
// // // // // // // // // //       processed: pendingNotifications.length,
// // // // // // // // // //       sent: sentCount,
// // // // // // // // // //       failed: failedCount,
// // // // // // // // // //     })
// // // // // // // // // //   } catch (error) {
// // // // // // // // // //     console.error("[v0] Cron job error:", error)
// // // // // // // // // //     return NextResponse.json(
// // // // // // // // // //       {
// // // // // // // // // //         success: false,
// // // // // // // // // //         error: error instanceof Error ? error.message : "Unknown error",
// // // // // // // // // //       },
// // // // // // // // // //       { status: 500 },
// // // // // // // // // //     )
// // // // // // // // // //   }
// // // // // // // // // // }






// // // // // // // // // import { type NextRequest, NextResponse } from "next/server"
// // // // // // // // // import { getDb } from "@/lib/mongo"

// // // // // // // // // export const dynamic = "force-dynamic"
// // // // // // // // // export const maxDuration = 60

// // // // // // // // // export async function GET(request: NextRequest) {
// // // // // // // // //   try {
// // // // // // // // //     console.log("[v0] Cron job started - send-notifications")

// // // // // // // // //     const searchParams = request.nextUrl.searchParams
// // // // // // // // //     const apiKey = searchParams.get("api_key")

// // // // // // // // //     // Verify API key
// // // // // // // // //     if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
// // // // // // // // //       console.log("[v0] Unauthorized cron job attempt")
// // // // // // // // //       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
// // // // // // // // //     }

// // // // // // // // //     const db = await getDb()
// // // // // // // // //     if (!db) {
// // // // // // // // //       console.log("[v0] Database connection failed")
// // // // // // // // //       return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
// // // // // // // // //     }

// // // // // // // // //     const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

// // // // // // // // //     console.log("[v0] Searching for notifications created after:", fiveMinutesAgo.toISOString())

// // // // // // // // //     const pendingNotifications = await db
// // // // // // // // //       .collection("notifications")
// // // // // // // // //       .find({
// // // // // // // // //         createdAt: { $gte: fiveMinutesAgo.toISOString() },
// // // // // // // // //         sent: { $ne: true },
// // // // // // // // //       })
// // // // // // // // //       .toArray()

// // // // // // // // //     console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

// // // // // // // // //     if (pendingNotifications.length === 0) {
// // // // // // // // //       return NextResponse.json({
// // // // // // // // //         success: true,
// // // // // // // // //         message: "No pending notifications",
// // // // // // // // //         count: 0,
// // // // // // // // //         searchedAfter: fiveMinutesAgo.toISOString(),
// // // // // // // // //       })
// // // // // // // // //     }

// // // // // // // // //     const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
// // // // // // // // //     console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

// // // // // // // // //     let sentCount = 0
// // // // // // // // //     let failedCount = 0

// // // // // // // // //     for (const notification of pendingNotifications) {
// // // // // // // // //       const { title, message, audience, institutionName, targetUserId } = notification
// // // // // // // // //       console.log(`[v0] Processing notification: ${title}, audience: ${audience}`)

// // // // // // // // //       // Filter subscriptions based on audience
// // // // // // // // //       let targetSubscriptions = subscriptions

// // // // // // // // //       if (audience === "institution" && institutionName) {
// // // // // // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.institutionName === institutionName)
// // // // // // // // //       } else if (audience === "admins") {
// // // // // // // // //         targetSubscriptions = subscriptions.filter((sub) => ["Admin", "SuperAdmin"].includes(sub.role))
// // // // // // // // //       } else if (audience === "target" && targetUserId) {
// // // // // // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.userId === targetUserId)
// // // // // // // // //       }

// // // // // // // // //       console.log(`[v0] Sending to ${targetSubscriptions.length} subscriptions`)

// // // // // // // // //       // Send push notification to each subscription
// // // // // // // // //       for (const subscription of targetSubscriptions) {
// // // // // // // // //         try {
// // // // // // // // //           const webpush = require("web-push")

// // // // // // // // //           // Configure web-push if not already configured
// // // // // // // // //           if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
// // // // // // // // //             webpush.setVapidDetails(
// // // // // // // // //               "mailto:admin@faceattendance.com",
// // // // // // // // //               process.env.VAPID_PUBLIC_KEY,
// // // // // // // // //               process.env.VAPID_PRIVATE_KEY,
// // // // // // // // //             )

// // // // // // // // //             await webpush.sendNotification(
// // // // // // // // //               subscription.subscription,
// // // // // // // // //               JSON.stringify({
// // // // // // // // //                 title: title || "Employee Management System",
// // // // // // // // //                 body: message,
// // // // // // // // //                 icon: "/logo3.png",
// // // // // // // // //                 badge: "/logo3.png",
// // // // // // // // //                 sound: "/notification.mp3",
// // // // // // // // //                 vibrate: [200, 100, 200, 100, 200],
// // // // // // // // //                 requireInteraction: true,
// // // // // // // // //                 silent: false,
// // // // // // // // //                 renotify: true,
// // // // // // // // //                 tag: `notification-${notification._id.toString()}`,
// // // // // // // // //                 data: {
// // // // // // // // //                   url: "/notifications",
// // // // // // // // //                   notificationId: notification._id.toString(),
// // // // // // // // //                   timestamp: Date.now(),
// // // // // // // // //                 },
// // // // // // // // //               }),
// // // // // // // // //             )
// // // // // // // // //             sentCount++
// // // // // // // // //             console.log(`[v0] Push notification sent successfully to ${subscription.userId}`)
// // // // // // // // //           } else {
// // // // // // // // //             console.log("[v0] VAPID keys not configured")
// // // // // // // // //           }
// // // // // // // // //         } catch (error) {
// // // // // // // // //           console.error("[v0] Failed to send push notification:", error)
// // // // // // // // //           failedCount++
// // // // // // // // //         }
// // // // // // // // //       }

// // // // // // // // //       await db.collection("notifications").updateOne(
// // // // // // // // //         { _id: notification._id },
// // // // // // // // //         {
// // // // // // // // //           $set: {
// // // // // // // // //             sent: true,
// // // // // // // // //             sentAt: new Date().toISOString(),
// // // // // // // // //             recipientCount: targetSubscriptions.length,
// // // // // // // // //           },
// // // // // // // // //         },
// // // // // // // // //       )
// // // // // // // // //     }

// // // // // // // // //     console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

// // // // // // // // //     return NextResponse.json({
// // // // // // // // //       success: true,
// // // // // // // // //       message: "Notifications processed",
// // // // // // // // //       processed: pendingNotifications.length,
// // // // // // // // //       sent: sentCount,
// // // // // // // // //       failed: failedCount,
// // // // // // // // //     })
// // // // // // // // //   } catch (error) {
// // // // // // // // //     console.error("[v0] Cron job error:", error)
// // // // // // // // //     return NextResponse.json(
// // // // // // // // //       {
// // // // // // // // //         success: false,
// // // // // // // // //         error: error instanceof Error ? error.message : "Unknown error",
// // // // // // // // //       },
// // // // // // // // //       { status: 500 },
// // // // // // // // //     )
// // // // // // // // //   }
// // // // // // // // // }



// // // // // // // // import { type NextRequest, NextResponse } from "next/server"
// // // // // // // // import { getDb } from "@/lib/mongo"

// // // // // // // // export const dynamic = "force-dynamic"
// // // // // // // // export const maxDuration = 60

// // // // // // // // export async function GET(request: NextRequest) {
// // // // // // // //   try {
// // // // // // // //     console.log("[v0] Cron job started - send-notifications")

// // // // // // // //     const searchParams = request.nextUrl.searchParams
// // // // // // // //     const apiKey = searchParams.get("api_key")

// // // // // // // //     // Verify API key
// // // // // // // //     if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
// // // // // // // //       console.log("[v0] Unauthorized cron job attempt")
// // // // // // // //       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
// // // // // // // //     }

// // // // // // // //     const db = await getDb()
// // // // // // // //     if (!db) {
// // // // // // // //       console.log("[v0] Database connection failed")
// // // // // // // //       return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
// // // // // // // //     }

// // // // // // // //     const sixtySecondsAgo = new Date(Date.now() - 60 * 1000)

// // // // // // // //     console.log("[v0] Searching for notifications created after:", sixtySecondsAgo.toISOString())

// // // // // // // //     const pendingNotifications = await db
// // // // // // // //       .collection("notifications")
// // // // // // // //       .find({
// // // // // // // //         createdAt: { $gte: sixtySecondsAgo.toISOString() },
// // // // // // // //         sent: { $ne: true },
// // // // // // // //       })
// // // // // // // //       .toArray()

// // // // // // // //     console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

// // // // // // // //     if (pendingNotifications.length === 0) {
// // // // // // // //       return NextResponse.json({
// // // // // // // //         success: true,
// // // // // // // //         message: "No pending notifications",
// // // // // // // //         count: 0,
// // // // // // // //         searchedAfter: sixtySecondsAgo.toISOString(),
// // // // // // // //       })
// // // // // // // //     }

// // // // // // // //     const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
// // // // // // // //     console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

// // // // // // // //     let sentCount = 0
// // // // // // // //     let failedCount = 0

// // // // // // // //     for (const notification of pendingNotifications) {
// // // // // // // //       const { title, message, audience, institutionName, targetUserId } = notification
// // // // // // // //       console.log(`[v0] Processing notification: ${title}, audience: ${audience}`)

// // // // // // // //       // Filter subscriptions based on audience
// // // // // // // //       let targetSubscriptions = subscriptions

// // // // // // // //       if (audience === "institution" && institutionName) {
// // // // // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.institutionName === institutionName)
// // // // // // // //       } else if (audience === "admins") {
// // // // // // // //         targetSubscriptions = subscriptions.filter((sub) => ["Admin", "SuperAdmin"].includes(sub.role))
// // // // // // // //       } else if (audience === "target" && targetUserId) {
// // // // // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.userId === targetUserId)
// // // // // // // //       }

// // // // // // // //       console.log(`[v0] Sending to ${targetSubscriptions.length} subscriptions`)

// // // // // // // //       // Send push notification to each subscription
// // // // // // // //       for (const subscription of targetSubscriptions) {
// // // // // // // //         try {
// // // // // // // //           const webpush = require("web-push")

// // // // // // // //           // Configure web-push if not already configured
// // // // // // // //           if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
// // // // // // // //             webpush.setVapidDetails(
// // // // // // // //               "mailto:admin@faceattendance.com",
// // // // // // // //               process.env.VAPID_PUBLIC_KEY,
// // // // // // // //               process.env.VAPID_PRIVATE_KEY,
// // // // // // // //             )

// // // // // // // //             await webpush.sendNotification(
// // // // // // // //               subscription.subscription,
// // // // // // // //               JSON.stringify({
// // // // // // // //                 title: title || "Employee Management System",
// // // // // // // //                 body: message,
// // // // // // // //                 icon: "/logo3.png",
// // // // // // // //                 badge: "/logo3.png",
// // // // // // // //                 sound: "/notification.mp3",
// // // // // // // //                 vibrate: [200, 100, 200, 100, 200],
// // // // // // // //                 requireInteraction: true,
// // // // // // // //                 silent: false,
// // // // // // // //                 renotify: true,
// // // // // // // //                 tag: `notification-${notification._id.toString()}`,
// // // // // // // //                 data: {
// // // // // // // //                   url: "/notifications",
// // // // // // // //                   notificationId: notification._id.toString(),
// // // // // // // //                   timestamp: Date.now(),
// // // // // // // //                 },
// // // // // // // //               }),
// // // // // // // //             )
// // // // // // // //             sentCount++
// // // // // // // //             console.log(`[v0] Push notification sent successfully to ${subscription.userId}`)
// // // // // // // //           } else {
// // // // // // // //             console.log("[v0] VAPID keys not configured")
// // // // // // // //           }
// // // // // // // //         } catch (error) {
// // // // // // // //           console.error("[v0] Failed to send push notification:", error)
// // // // // // // //           failedCount++
// // // // // // // //         }
// // // // // // // //       }

// // // // // // // //       await db.collection("notifications").updateOne(
// // // // // // // //         { _id: notification._id },
// // // // // // // //         {
// // // // // // // //           $set: {
// // // // // // // //             sent: true,
// // // // // // // //             sentAt: new Date().toISOString(),
// // // // // // // //             recipientCount: targetSubscriptions.length,
// // // // // // // //           },
// // // // // // // //         },
// // // // // // // //       )
// // // // // // // //     }

// // // // // // // //     console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

// // // // // // // //     return NextResponse.json({
// // // // // // // //       success: true,
// // // // // // // //       message: "Notifications processed",
// // // // // // // //       processed: pendingNotifications.length,
// // // // // // // //       sent: sentCount,
// // // // // // // //       failed: failedCount,
// // // // // // // //     })
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("[v0] Cron job error:", error)
// // // // // // // //     return NextResponse.json(
// // // // // // // //       {
// // // // // // // //         success: false,
// // // // // // // //         error: error instanceof Error ? error.message : "Unknown error",
// // // // // // // //       },
// // // // // // // //       { status: 500 },
// // // // // // // //     )
// // // // // // // //   }
// // // // // // // // }



// // // // // // // import { type NextRequest, NextResponse } from "next/server"
// // // // // // // import { getDb } from "@/lib/mongo"

// // // // // // // export const dynamic = "force-dynamic"
// // // // // // // export const maxDuration = 60

// // // // // // // export async function GET(request: NextRequest) {
// // // // // // //   try {
// // // // // // //     console.log("[v0] Cron job started - send-notifications")

// // // // // // //     const searchParams = request.nextUrl.searchParams
// // // // // // //     const apiKey = searchParams.get("api_key")

// // // // // // //     // Verify API key
// // // // // // //     if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
// // // // // // //       console.log("[v0] Unauthorized cron job attempt")
// // // // // // //       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
// // // // // // //     }

// // // // // // //     if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
// // // // // // //       console.error("[v0] VAPID keys not configured!")
// // // // // // //       return NextResponse.json(
// // // // // // //         {
// // // // // // //           success: false,
// // // // // // //           error: "VAPID keys not configured. Please set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables.",
// // // // // // //         },
// // // // // // //         { status: 500 },
// // // // // // //       )
// // // // // // //     }

// // // // // // //     const db = await getDb()
// // // // // // //     if (!db) {
// // // // // // //       console.log("[v0] Database connection failed")
// // // // // // //       return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
// // // // // // //     }

// // // // // // //     const sixtySecondsAgo = new Date(Date.now() - 60 * 1000)

// // // // // // //     console.log("[v0] Searching for notifications created after:", sixtySecondsAgo.toISOString())

// // // // // // //     const pendingNotifications = await db
// // // // // // //       .collection("notifications")
// // // // // // //       .find({
// // // // // // //         createdAt: { $gte: sixtySecondsAgo.toISOString() },
// // // // // // //         sent: { $ne: true },
// // // // // // //       })
// // // // // // //       .toArray()

// // // // // // //     console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

// // // // // // //     if (pendingNotifications.length === 0) {
// // // // // // //       return NextResponse.json({
// // // // // // //         success: true,
// // // // // // //         message: "No pending notifications",
// // // // // // //         count: 0,
// // // // // // //         searchedAfter: sixtySecondsAgo.toISOString(),
// // // // // // //       })
// // // // // // //     }

// // // // // // //     const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
// // // // // // //     console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

// // // // // // //     if (subscriptions.length === 0) {
// // // // // // //       console.log("[v0] No push subscriptions found in database")
// // // // // // //       // Mark notifications as sent anyway
// // // // // // //       for (const notification of pendingNotifications) {
// // // // // // //         await db.collection("notifications").updateOne(
// // // // // // //           { _id: notification._id },
// // // // // // //           {
// // // // // // //             $set: {
// // // // // // //               sent: true,
// // // // // // //               sentAt: new Date().toISOString(),
// // // // // // //               recipientCount: 0,
// // // // // // //             },
// // // // // // //           },
// // // // // // //         )
// // // // // // //       }
// // // // // // //       return NextResponse.json({
// // // // // // //         success: true,
// // // // // // //         message: "No push subscriptions available",
// // // // // // //         processed: pendingNotifications.length,
// // // // // // //         sent: 0,
// // // // // // //         failed: 0,
// // // // // // //       })
// // // // // // //     }

// // // // // // //     let sentCount = 0
// // // // // // //     let failedCount = 0

// // // // // // //     const webpush = require("web-push")
// // // // // // //     webpush.setVapidDetails(
// // // // // // //       "mailto:admin@faceattendance.com",
// // // // // // //       process.env.VAPID_PUBLIC_KEY,
// // // // // // //       process.env.VAPID_PRIVATE_KEY,
// // // // // // //     )

// // // // // // //     for (const notification of pendingNotifications) {
// // // // // // //       const { title, message, audience, institutionName, targetUserId } = notification
// // // // // // //       console.log(`[v0] Processing notification: ${title}, audience: ${audience}`)

// // // // // // //       // Filter subscriptions based on audience
// // // // // // //       let targetSubscriptions = subscriptions

// // // // // // //       if (audience === "institution" && institutionName) {
// // // // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.institutionName === institutionName)
// // // // // // //       } else if (audience === "admins") {
// // // // // // //         targetSubscriptions = subscriptions.filter((sub) => ["Admin", "SuperAdmin"].includes(sub.role))
// // // // // // //       } else if (audience === "target" && targetUserId) {
// // // // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.userId === targetUserId)
// // // // // // //       }

// // // // // // //       console.log(`[v0] Sending to ${targetSubscriptions.length} subscriptions`)

// // // // // // //       // Send push notification to each subscription
// // // // // // //       for (const subscription of targetSubscriptions) {
// // // // // // //         try {
// // // // // // //           console.log(`[v0] Attempting to send push to user: ${subscription.userId}`)

// // // // // // //           await webpush.sendNotification(
// // // // // // //             subscription.subscription,
// // // // // // //             JSON.stringify({
// // // // // // //               title: title || "Employee Management System",
// // // // // // //               body: message,
// // // // // // //               icon: "/logo3.png",
// // // // // // //               badge: "/logo3.png",
// // // // // // //               sound: "/notification-sound.mp3",
// // // // // // //               vibrate: [200, 100, 200, 100, 200],
// // // // // // //               requireInteraction: true,
// // // // // // //               silent: false,
// // // // // // //               renotify: true,
// // // // // // //               tag: `notification-${notification._id.toString()}`,
// // // // // // //               data: {
// // // // // // //                 url: "/notifications",
// // // // // // //                 notificationId: notification._id.toString(),
// // // // // // //                 timestamp: Date.now(),
// // // // // // //               },
// // // // // // //             }),
// // // // // // //           )
// // // // // // //           sentCount++
// // // // // // //           console.log(`[v0] ✓ Push notification sent successfully to ${subscription.userId}`)
// // // // // // //         } catch (error) {
// // // // // // //           console.error(`[v0] ✗ Failed to send push notification to ${subscription.userId}:`, error)
// // // // // // //           failedCount++
// // // // // // //         }
// // // // // // //       }

// // // // // // //       await db.collection("notifications").updateOne(
// // // // // // //         { _id: notification._id },
// // // // // // //         {
// // // // // // //           $set: {
// // // // // // //             sent: true,
// // // // // // //             sentAt: new Date().toISOString(),
// // // // // // //             recipientCount: targetSubscriptions.length,
// // // // // // //           },
// // // // // // //         },
// // // // // // //       )
// // // // // // //     }

// // // // // // //     console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

// // // // // // //     return NextResponse.json({
// // // // // // //       success: true,
// // // // // // //       message: "Notifications processed",
// // // // // // //       processed: pendingNotifications.length,
// // // // // // //       sent: sentCount,
// // // // // // //       failed: failedCount,
// // // // // // //       totalSubscriptions: subscriptions.length,
// // // // // // //     })
// // // // // // //   } catch (error) {
// // // // // // //     console.error("[v0] Cron job error:", error)
// // // // // // //     return NextResponse.json(
// // // // // // //       {
// // // // // // //         success: false,
// // // // // // //         error: error instanceof Error ? error.message : "Unknown error",
// // // // // // //       },
// // // // // // //       { status: 500 },
// // // // // // //     )
// // // // // // //   }
// // // // // // // }



// // // // // // import { type NextRequest, NextResponse } from "next/server"
// // // // // // import { getDb } from "@/lib/mongo"

// // // // // // export const dynamic = "force-dynamic"
// // // // // // export const maxDuration = 60

// // // // // // export async function GET(request: NextRequest) {
// // // // // //   try {
// // // // // //     console.log("[v0] Cron job started - send-notifications")

// // // // // //     const searchParams = request.nextUrl.searchParams
// // // // // //     const apiKey = searchParams.get("api_key")

// // // // // //     // Verify API key
// // // // // //     if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
// // // // // //       console.log("[v0] Unauthorized cron job attempt")
// // // // // //       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
// // // // // //     }

// // // // // //     if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
// // // // // //       console.error("[v0] VAPID keys not configured!")
// // // // // //       console.error("[v0] Please run: npx web-push generate-vapid-keys")
// // // // // //       console.error("[v0] Then add VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to environment variables")
// // // // // //       return NextResponse.json(
// // // // // //         {
// // // // // //           success: false,
// // // // // //           error: "VAPID keys not configured",
// // // // // //           message: "Run 'npx web-push generate-vapid-keys' and add keys to environment variables",
// // // // // //           docs: "See VAPID_KEYS_SETUP.md for detailed instructions",
// // // // // //         },
// // // // // //         { status: 500 },
// // // // // //       )
// // // // // //     }

// // // // // //     const db = await getDb()
// // // // // //     if (!db) {
// // // // // //       console.log("[v0] Database connection failed")
// // // // // //       return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
// // // // // //     }

// // // // // //     const sixtySecondsAgo = new Date(Date.now() - 60 * 1000)

// // // // // //     console.log("[v0] Searching for notifications created after:", sixtySecondsAgo.toISOString())

// // // // // //     const pendingNotifications = await db
// // // // // //       .collection("notifications")
// // // // // //       .find({
// // // // // //         createdAt: { $gte: sixtySecondsAgo.toISOString() },
// // // // // //         sent: { $ne: true },
// // // // // //       })
// // // // // //       .toArray()

// // // // // //     console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

// // // // // //     if (pendingNotifications.length === 0) {
// // // // // //       return NextResponse.json({
// // // // // //         success: true,
// // // // // //         message: "No pending notifications",
// // // // // //         count: 0,
// // // // // //         searchedAfter: sixtySecondsAgo.toISOString(),
// // // // // //       })
// // // // // //     }

// // // // // //     const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
// // // // // //     console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

// // // // // //     if (subscriptions.length === 0) {
// // // // // //       console.log("[v0] No push subscriptions found - users haven't enabled notifications")
// // // // // //       // Mark notifications as sent anyway
// // // // // //       for (const notification of pendingNotifications) {
// // // // // //         await db.collection("notifications").updateOne(
// // // // // //           { _id: notification._id },
// // // // // //           {
// // // // // //             $set: {
// // // // // //               sent: true,
// // // // // //               sentAt: new Date().toISOString(),
// // // // // //               recipientCount: 0,
// // // // // //             },
// // // // // //           },
// // // // // //         )
// // // // // //       }
// // // // // //       return NextResponse.json({
// // // // // //         success: true,
// // // // // //         message: "No push subscriptions available - users need to enable notifications in Settings",
// // // // // //         processed: pendingNotifications.length,
// // // // // //         sent: 0,
// // // // // //         failed: 0,
// // // // // //         totalSubscriptions: 0,
// // // // // //       })
// // // // // //     }

// // // // // //     let sentCount = 0
// // // // // //     let failedCount = 0

// // // // // //     const webpush = require("web-push")
// // // // // //     webpush.setVapidDetails(
// // // // // //       "mailto:venkythota469@gmail.com",
// // // // // //       process.env.VAPID_PUBLIC_KEY,
// // // // // //       process.env.VAPID_PRIVATE_KEY,
// // // // // //     )

// // // // // //     for (const notification of pendingNotifications) {
// // // // // //       const { title, message, audience, institutionName, targetUserId } = notification
// // // // // //       console.log(`[v0] Processing notification: ${title}, audience: ${audience}`)

// // // // // //       // Filter subscriptions based on audience
// // // // // //       let targetSubscriptions = subscriptions

// // // // // //       if (audience === "institution" && institutionName) {
// // // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.institutionName === institutionName)
// // // // // //       } else if (audience === "admins") {
// // // // // //         targetSubscriptions = subscriptions.filter((sub) => ["Admin", "SuperAdmin"].includes(sub.role))
// // // // // //       } else if (audience === "target" && targetUserId) {
// // // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.userId === targetUserId)
// // // // // //       }

// // // // // //       console.log(`[v0] Sending to ${targetSubscriptions.length} subscriptions`)

// // // // // //       // Send push notification to each subscription
// // // // // //       for (const subscription of targetSubscriptions) {
// // // // // //         try {
// // // // // //           console.log(`[v0] Attempting to send push to user: ${subscription.userId}`)

// // // // // //           await webpush.sendNotification(
// // // // // //             subscription.subscription,
// // // // // //             JSON.stringify({
// // // // // //               title: title || "Employee Management System",
// // // // // //               body: message,
// // // // // //               icon: "/logo3.png",
// // // // // //               badge: "/logo3.png",
// // // // // //               vibrate: [200, 100, 200, 100, 200],
// // // // // //               requireInteraction: false,
// // // // // //               silent: false, // Browser will play system notification sound
// // // // // //               renotify: true, // Allow repeated notifications
// // // // // //               tag: `notification-${notification._id.toString()}`,
// // // // // //               data: {
// // // // // //                 url: "/notifications",
// // // // // //                 notificationId: notification._id.toString(),
// // // // // //                 timestamp: Date.now(),
// // // // // //                 notificationType: "general",
// // // // // //               },
// // // // // //             }),
// // // // // //           )
// // // // // //           sentCount++
// // // // // //           console.log(`[v0] ✓ Push notification sent successfully to ${subscription.userId}`)
// // // // // //         } catch (error: any) {
// // // // // //           console.error(`[v0] ✗ Failed to send push to ${subscription.userId}:`, error.message)
// // // // // //           failedCount++

// // // // // //           if (error.statusCode === 410 || error.statusCode === 404) {
// // // // // //             console.log(`[v0] Removing expired subscription for user: ${subscription.userId}`)
// // // // // //             await db.collection("push_subscriptions").deleteOne({ _id: subscription._id })
// // // // // //           }
// // // // // //         }
// // // // // //       }

// // // // // //       await db.collection("notifications").updateOne(
// // // // // //         { _id: notification._id },
// // // // // //         {
// // // // // //           $set: {
// // // // // //             sent: true,
// // // // // //             sentAt: new Date().toISOString(),
// // // // // //             recipientCount: targetSubscriptions.length,
// // // // // //           },
// // // // // //         },
// // // // // //       )
// // // // // //     }

// // // // // //     console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

// // // // // //     return NextResponse.json({
// // // // // //       success: true,
// // // // // //       message: sentCount > 0 ? "Notifications sent successfully" : "No notifications were sent (check subscriptions)",
// // // // // //       processed: pendingNotifications.length,
// // // // // //       sent: sentCount,
// // // // // //       failed: failedCount,
// // // // // //       totalSubscriptions: subscriptions.length,
// // // // // //     })
// // // // // //   } catch (error: any) {
// // // // // //     console.error("[v0] Cron job error:", error)
// // // // // //     return NextResponse.json(
// // // // // //       {
// // // // // //         success: false,
// // // // // //         error: error.message || "Unknown error",
// // // // // //         stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
// // // // // //       },
// // // // // //       { status: 500 },
// // // // // //     )
// // // // // //   }
// // // // // // }



// // // // // import { type NextRequest, NextResponse } from "next/server"
// // // // // import { getDb } from "@/lib/mongo"

// // // // // export const dynamic = "force-dynamic"
// // // // // export const maxDuration = 60

// // // // // const VAPID_PUBLIC_KEY = "BNdVyZH9EWmbKQ7H9NFU2AKlLWSKS8Basd6Jhr6mP8ZJUMbw6ve0o_2Yw5MtJsii8iEx7un2jUgvUiTNvSh0MTA"
// // // // // const VAPID_PRIVATE_KEY = "M0MGV7GnRqfejqNYdYP3bmgkRP9iALXBlTjddYSnFvU"

// // // // // export async function GET(request: NextRequest) {
// // // // //   try {
// // // // //     console.log("[v0] Cron job started - send-notifications")

// // // // //     const searchParams = request.nextUrl.searchParams
// // // // //     const apiKey = searchParams.get("api_key")

// // // // //     // Verify API key
// // // // //     if (!apiKey || apiKey !== "venkythota") {
// // // // //       console.log("[v0] Unauthorized cron job attempt")
// // // // //       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
// // // // //     }

// // // // //     const db = await getDb()
// // // // //     if (!db) {
// // // // //       console.log("[v0] Database connection failed")
// // // // //       return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
// // // // //     }

// // // // //     const sixtySecondsAgo = new Date(Date.now() - 60 * 1000)

// // // // //     console.log("[v0] Searching for notifications created after:", sixtySecondsAgo.toISOString())

// // // // //     const pendingNotifications = await db
// // // // //       .collection("notifications")
// // // // //       .find({
// // // // //         createdAt: { $gte: sixtySecondsAgo.toISOString() },
// // // // //         sent: { $ne: true },
// // // // //       })
// // // // //       .toArray()

// // // // //     console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

// // // // //     if (pendingNotifications.length === 0) {
// // // // //       return NextResponse.json({
// // // // //         success: true,
// // // // //         message: "No pending notifications",
// // // // //         count: 0,
// // // // //         searchedAfter: sixtySecondsAgo.toISOString(),
// // // // //       })
// // // // //     }

// // // // //     const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
// // // // //     console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

// // // // //     if (subscriptions.length === 0) {
// // // // //       console.log("[v0] No push subscriptions found - users haven't enabled notifications")
// // // // //       // Mark notifications as sent anyway
// // // // //       for (const notification of pendingNotifications) {
// // // // //         await db.collection("notifications").updateOne(
// // // // //           { _id: notification._id },
// // // // //           {
// // // // //             $set: {
// // // // //               sent: true,
// // // // //               sentAt: new Date().toISOString(),
// // // // //               recipientCount: 0,
// // // // //             },
// // // // //           },
// // // // //         )
// // // // //       }
// // // // //       return NextResponse.json({
// // // // //         success: true,
// // // // //         message: "No push subscriptions available - users need to enable notifications in Settings",
// // // // //         processed: pendingNotifications.length,
// // // // //         sent: 0,
// // // // //         failed: 0,
// // // // //         totalSubscriptions: 0,
// // // // //       })
// // // // //     }

// // // // //     let sentCount = 0
// // // // //     let failedCount = 0

// // // // //     const webpush = require("web-push")
// // // // //     webpush.setVapidDetails("mailto:venkythota469@gmail.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

// // // // //     for (const notification of pendingNotifications) {
// // // // //       const { title, message, audience, institutionName, targetUserId } = notification
// // // // //       console.log(`[v0] Processing notification: ${title}, audience: ${audience}`)

// // // // //       // Filter subscriptions based on audience
// // // // //       let targetSubscriptions = subscriptions

// // // // //       if (audience === "institution" && institutionName) {
// // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.institutionName === institutionName)
// // // // //       } else if (audience === "admins") {
// // // // //         targetSubscriptions = subscriptions.filter((sub) => ["Admin", "SuperAdmin"].includes(sub.role))
// // // // //       } else if (audience === "target" && targetUserId) {
// // // // //         targetSubscriptions = subscriptions.filter((sub) => sub.userId === targetUserId)
// // // // //       }

// // // // //       console.log(`[v0] Sending to ${targetSubscriptions.length} subscriptions`)

// // // // //       // Send push notification to each subscription
// // // // //       for (const subscription of targetSubscriptions) {
// // // // //         try {
// // // // //           console.log(`[v0] Attempting to send push to user: ${subscription.userId}`)

// // // // //           await webpush.sendNotification(
// // // // //             subscription.subscription,
// // // // //             JSON.stringify({
// // // // //               title: title || "Employee Management System",
// // // // //               body: message,
// // // // //               icon: "/logo3.png",
// // // // //               badge: "/logo3.png",
// // // // //               vibrate: [200, 100, 200, 100, 200],
// // // // //               requireInteraction: false,
// // // // //               silent: false, // Browser will play system notification sound
// // // // //               renotify: true, // Allow repeated notifications
// // // // //               tag: `notification-${notification._id.toString()}`,
// // // // //               data: {
// // // // //                 url: "/notifications",
// // // // //                 notificationId: notification._id.toString(),
// // // // //                 timestamp: Date.now(),
// // // // //                 notificationType: "general",
// // // // //               },
// // // // //             }),
// // // // //           )
// // // // //           sentCount++
// // // // //           console.log(`[v0] ✓ Push notification sent successfully to ${subscription.userId}`)
// // // // //         } catch (error: any) {
// // // // //           console.error(`[v0] ✗ Failed to send push to ${subscription.userId}:`, error.message)
// // // // //           failedCount++

// // // // //           if (error.statusCode === 410 || error.statusCode === 404) {
// // // // //             console.log(`[v0] Removing expired subscription for user: ${subscription.userId}`)
// // // // //             await db.collection("push_subscriptions").deleteOne({ _id: subscription._id })
// // // // //           }
// // // // //         }
// // // // //       }

// // // // //       await db.collection("notifications").updateOne(
// // // // //         { _id: notification._id },
// // // // //         {
// // // // //           $set: {
// // // // //             sent: true,
// // // // //             sentAt: new Date().toISOString(),
// // // // //             recipientCount: targetSubscriptions.length,
// // // // //           },
// // // // //         },
// // // // //       )
// // // // //     }

// // // // //     console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

// // // // //     return NextResponse.json({
// // // // //       success: true,
// // // // //       message: sentCount > 0 ? "Notifications sent successfully" : "No notifications were sent (check subscriptions)",
// // // // //       processed: pendingNotifications.length,
// // // // //       sent: sentCount,
// // // // //       failed: failedCount,
// // // // //       totalSubscriptions: subscriptions.length,
// // // // //     })
// // // // //   } catch (error: any) {
// // // // //     console.error("[v0] Cron job error:", error)
// // // // //     return NextResponse.json(
// // // // //       {
// // // // //         success: false,
// // // // //         error: error.message || "Unknown error",
// // // // //         stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
// // // // //       },
// // // // //       { status: 500 },
// // // // //     )
// // // // //   }
// // // // // }



// // // // import { type NextRequest, NextResponse } from "next/server"
// // // // import { getDb } from "@/lib/mongo"

// // // // export const dynamic = "force-dynamic"
// // // // export const maxDuration = 60

// // // // const VAPID_PUBLIC_KEY = "BNdVyZH9EWmbKQ7H9NFU2AKlLWSKS8Basd6Jhr6mP8ZJUMbw6ve0o_2Yw5MtJsii8iEx7un2jUgvUiTNvSh0MTA"
// // // // const VAPID_PRIVATE_KEY = "M0MGV7GnRqfejqNYdYP3bmgkRP9iALXBlTjddYSnFvU"

// // // // export async function GET(request: NextRequest) {
// // // //   try {
// // // //     console.log("[v0] Cron job started - send-notifications")

// // // //     const searchParams = request.nextUrl.searchParams
// // // //     const apiKey = searchParams.get("api_key")

// // // //     // Verify API key
// // // //     if (!apiKey || apiKey !== "venkythota") {
// // // //       console.log("[v0] Unauthorized cron job attempt")
// // // //       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
// // // //     }

// // // //     const db = await getDb()
// // // //     if (!db) {
// // // //       console.log("[v0] Database connection failed")
// // // //       return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
// // // //     }

// // // //     const sixtySecondsAgo = new Date(Date.now() - 60 * 1000)

// // // //     console.log("[v0] Searching for notifications created after:", sixtySecondsAgo.toISOString())

// // // //     const pendingNotifications = await db
// // // //       .collection("notifications")
// // // //       .find({
// // // //         createdAt: { $gte: sixtySecondsAgo.toISOString() },
// // // //         sent: { $ne: true },
// // // //       })
// // // //       .toArray()

// // // //     console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

// // // //     if (pendingNotifications.length === 0) {
// // // //       return NextResponse.json({
// // // //         success: true,
// // // //         message: "No pending notifications",
// // // //         count: 0,
// // // //         searchedAfter: sixtySecondsAgo.toISOString(),
// // // //       })
// // // //     }

// // // //     const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
// // // //     console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

// // // //     if (subscriptions.length === 0) {
// // // //       console.log("[v0] No push subscriptions found - users haven't enabled notifications")
// // // //       for (const notification of pendingNotifications) {
// // // //         await db.collection("notifications").updateOne(
// // // //           { _id: notification._id },
// // // //           {
// // // //             $set: {
// // // //               sent: true,
// // // //               sentAt: new Date().toISOString(),
// // // //               recipientCount: 0,
// // // //             },
// // // //           },
// // // //         )
// // // //       }
// // // //       return NextResponse.json({
// // // //         success: true,
// // // //         message: "No push subscriptions available - users need to enable notifications in Settings",
// // // //         processed: pendingNotifications.length,
// // // //         sent: 0,
// // // //         failed: 0,
// // // //         totalSubscriptions: 0,
// // // //       })
// // // //     }

// // // //     let sentCount = 0
// // // //     let failedCount = 0

// // // //     const webpush = require("web-push")
// // // //     webpush.setVapidDetails("mailto:venkythota469@gmail.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

// // // //     for (const notification of pendingNotifications) {
// // // //       const { title, message, audience, institutionName, targetUserId } = notification

// // // //       console.log(`[v0] ====== Processing notification ======`)
// // // //       console.log(`[v0] Title: ${title}`)
// // // //       console.log(`[v0] Audience: ${audience}`)
// // // //       console.log(`[v0] Institution: ${institutionName}`)
// // // //       console.log(`[v0] TargetUserId: ${targetUserId}`)
// // // //       console.log(`[v0] Total subscriptions available: ${subscriptions.length}`)

// // // //       // Filter subscriptions based on audience
// // // //       let targetSubscriptions = subscriptions

// // // //       if (audience === "all" || !audience) {
// // // //         console.log(`[v0] Audience is 'all' - sending to all ${subscriptions.length} subscriptions`)
// // // //         targetSubscriptions = subscriptions
// // // //       } else if (audience === "institution" && institutionName) {
// // // //         targetSubscriptions = subscriptions.filter((sub) => sub.institutionName === institutionName)
// // // //         console.log(`[v0] Filtered by institution '${institutionName}': ${targetSubscriptions.length} subscriptions`)
// // // //       } else if (audience === "admins") {
// // // //         targetSubscriptions = subscriptions.filter((sub) => ["Admin", "SuperAdmin"].includes(sub.role))
// // // //         console.log(`[v0] Filtered by admins: ${targetSubscriptions.length} subscriptions`)
// // // //       } else if (audience === "target" && targetUserId) {
// // // //         targetSubscriptions = subscriptions.filter((sub) => sub.userId === targetUserId)
// // // //         console.log(`[v0] Filtered by targetUserId '${targetUserId}': ${targetSubscriptions.length} subscriptions`)
// // // //       }

// // // //       console.log(`[v0] Final target: ${targetSubscriptions.length} subscriptions`)

// // // //       if (targetSubscriptions.length > 0) {
// // // //         console.log(`[v0] Sample subscription data:`, {
// // // //           userId: targetSubscriptions[0].userId,
// // // //           role: targetSubscriptions[0].role,
// // // //           institutionName: targetSubscriptions[0].institutionName,
// // // //         })
// // // //       } else {
// // // //         console.log(`[v0] ⚠️ No matching subscriptions found! Notification will not be sent.`)
// // // //       }

// // // //       // Send push notification to each subscription
// // // //       for (const subscription of targetSubscriptions) {
// // // //         try {
// // // //           console.log(`[v0] Attempting to send push to user: ${subscription.userId}`)

// // // //           await webpush.sendNotification(
// // // //             subscription.subscription,
// // // //             JSON.stringify({
// // // //               title: title || "Employee Management System",
// // // //               body: message,
// // // //               icon: "/logo3.png",
// // // //               badge: "/logo3.png",
// // // //               vibrate: [200, 100, 200, 100, 200],
// // // //               requireInteraction: false,
// // // //               silent: false, // Browser will play system notification sound
// // // //               renotify: true, // Allow repeated notifications
// // // //               tag: `notification-${notification._id.toString()}`,
// // // //               data: {
// // // //                 url: "/notifications",
// // // //                 notificationId: notification._id.toString(),
// // // //                 timestamp: Date.now(),
// // // //                 notificationType: "general",
// // // //               },
// // // //             }),
// // // //           )
// // // //           sentCount++
// // // //           console.log(`[v0] ✓ Push notification sent successfully to ${subscription.userId}`)
// // // //         } catch (error: any) {
// // // //           console.error(`[v0] ✗ Failed to send push to ${subscription.userId}:`, error.message)
// // // //           failedCount++

// // // //           if (error.statusCode === 410 || error.statusCode === 404) {
// // // //             console.log(`[v0] Removing expired subscription for user: ${subscription.userId}`)
// // // //             await db.collection("push_subscriptions").deleteOne({ _id: subscription._id })
// // // //           }
// // // //         }
// // // //       }

// // // //       await db.collection("notifications").updateOne(
// // // //         { _id: notification._id },
// // // //         {
// // // //           $set: {
// // // //             sent: true,
// // // //             sentAt: new Date().toISOString(),
// // // //             recipientCount: targetSubscriptions.length,
// // // //           },
// // // //         },
// // // //       )
// // // //     }

// // // //     console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

// // // //     return NextResponse.json({
// // // //       success: true,
// // // //       message: sentCount > 0 ? "Notifications sent successfully" : "No notifications were sent (check subscriptions)",
// // // //       processed: pendingNotifications.length,
// // // //       sent: sentCount,
// // // //       failed: failedCount,
// // // //       totalSubscriptions: subscriptions.length,
// // // //     })
// // // //   } catch (error: any) {
// // // //     console.error("[v0] Cron job error:", error)
// // // //     return NextResponse.json(
// // // //       {
// // // //         success: false,
// // // //         error: error.message || "Unknown error",
// // // //         stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
// // // //       },
// // // //       { status: 500 },
// // // //     )
// // // //   }
// // // // }



// // // import { type NextRequest, NextResponse } from "next/server"
// // // import { getDb } from "@/lib/mongo"

// // // export const dynamic = "force-dynamic"
// // // export const maxDuration = 60

// // // const VAPID_PUBLIC_KEY = "BNdVyZH9EWmbKQ7H9NFU2AKlLWSKS8Basd6Jhr6mP8ZJUMbw6ve0o_2Yw5MtJsii8iEx7un2jUgvUiTNvSh0MTA"
// // // const VAPID_PRIVATE_KEY = "M0MGV7GnRqfejqNYdYP3bmgkRP9iALXBlTjddYSnFvU"

// // // export async function GET(request: NextRequest) {
// // //   try {
// // //     console.log("[v0] Cron job started - send-notifications")

// // //     const searchParams = request.nextUrl.searchParams
// // //     const apiKey = searchParams.get("api_key")

// // //     if (!apiKey || apiKey !== "venkythota") {
// // //       console.log("[v0] Unauthorized cron job attempt")
// // //       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
// // //     }

// // //     const db = await getDb()
// // //     if (!db) {
// // //       console.log("[v0] Database connection failed")
// // //       return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
// // //     }

// // //     const sixtySecondsAgo = new Date(Date.now() - 60 * 1000)

// // //     console.log("[v0] Searching for notifications created after:", sixtySecondsAgo.toISOString())

// // //     const pendingNotifications = await db
// // //       .collection("notifications")
// // //       .find({
// // //         createdAt: { $gte: sixtySecondsAgo.toISOString() },
// // //         sent: { $ne: true },
// // //       })
// // //       .toArray()

// // //     console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

// // //     if (pendingNotifications.length === 0) {
// // //       return NextResponse.json({
// // //         success: true,
// // //         message: "No pending notifications",
// // //         count: 0,
// // //         searchedAfter: sixtySecondsAgo.toISOString(),
// // //       })
// // //     }

// // //     const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
// // //     console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

// // //     if (subscriptions.length === 0) {
// // //       console.log("[v0] No push subscriptions found")
// // //       for (const notification of pendingNotifications) {
// // //         await db.collection("notifications").updateOne(
// // //           { _id: notification._id },
// // //           {
// // //             $set: {
// // //               sent: true,
// // //               sentAt: new Date().toISOString(),
// // //               recipientCount: 0,
// // //             },
// // //           },
// // //         )
// // //       }
// // //       return NextResponse.json({
// // //         success: true,
// // //         message: "No push subscriptions available",
// // //         processed: pendingNotifications.length,
// // //         sent: 0,
// // //         failed: 0,
// // //         totalSubscriptions: 0,
// // //       })
// // //     }

// // //     let sentCount = 0
// // //     let failedCount = 0

// // //     const webpush = require("web-push")
// // //     webpush.setVapidDetails("mailto:venkythota469@gmail.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

// // //     for (const notification of pendingNotifications) {
// // //       const { title, message } = notification

// // //       console.log(`[v0] Processing notification: ${title}`)
// // //       console.log(`[v0] Sending to all ${subscriptions.length} subscriptions`)

// // //       // Send push notification to ALL subscriptions
// // //       for (const subscription of subscriptions) {
// // //         try {
// // //           await webpush.sendNotification(
// // //             subscription.subscription,
// // //             JSON.stringify({
// // //               title: title || "Employee Management System",
// // //               body: message,
// // //               icon: "/logo3.png",
// // //               badge: "/logo3.png",
// // //               vibrate: [200, 100, 200, 100, 200],
// // //               requireInteraction: false,
// // //               silent: false,
// // //               renotify: true,
// // //               tag: `notification-${notification._id.toString()}`,
// // //               data: {
// // //                 url: "/notifications",
// // //                 notificationId: notification._id.toString(),
// // //                 timestamp: Date.now(),
// // //               },
// // //             }),
// // //           )
// // //           sentCount++
// // //         } catch (error: any) {
// // //           console.error(`[v0] Failed to send push:`, error.message)
// // //           failedCount++

// // //           // Remove expired subscriptions
// // //           if (error.statusCode === 410 || error.statusCode === 404) {
// // //             await db.collection("push_subscriptions").deleteOne({ _id: subscription._id })
// // //           }
// // //         }
// // //       }

// // //       // Mark notification as sent
// // //       await db.collection("notifications").updateOne(
// // //         { _id: notification._id },
// // //         {
// // //           $set: {
// // //             sent: true,
// // //             sentAt: new Date().toISOString(),
// // //             recipientCount: subscriptions.length,
// // //           },
// // //         },
// // //       )
// // //     }

// // //     console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

// // //     return NextResponse.json({
// // //       success: true,
// // //       message: sentCount > 0 ? "Notifications sent successfully" : "Failed to send notifications",
// // //       processed: pendingNotifications.length,
// // //       sent: sentCount,
// // //       failed: failedCount,
// // //       totalSubscriptions: subscriptions.length,
// // //     })
// // //   } catch (error: any) {
// // //     console.error("[v0] Cron job error:", error)
// // //     return NextResponse.json(
// // //       {
// // //         success: false,
// // //         error: error.message || "Unknown error",
// // //       },
// // //       { status: 500 },
// // //     )
// // //   }
// // // }



// // import { type NextRequest, NextResponse } from "next/server"
// // import { getDb } from "@/lib/mongo"

// // export const dynamic = "force-dynamic"
// // export const maxDuration = 60

// // const VAPID_PUBLIC_KEY = "BNdVyZH9EWmbKQ7H9NFU2AKlLWSKS8Basd6Jhr6mP8ZJUMbw6ve0o_2Yw5MtJsii8iEx7un2jUgvUiTNvSh0MTA"
// // const VAPID_PRIVATE_KEY = "M0MGV7GnRqfejqNYdYP3bmgkRP9iALXBlTjddYSnFvU"

// // export async function GET(request: NextRequest) {
// //   try {
// //     console.log("[v0] Cron job started - send-notifications")

// //     const searchParams = request.nextUrl.searchParams
// //     const apiKey = searchParams.get("api_key")

// //     if (!apiKey || apiKey !== "venkythota") {
// //       console.log("[v0] Unauthorized cron job attempt")
// //       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
// //     }

// //     const db = await getDb()
// //     if (!db) {
// //       console.log("[v0] Database connection failed")
// //       return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
// //     }

// //     const sixtySecondsAgo = new Date(Date.now() - 60 * 1000)

// //     console.log("[v0] Searching for notifications created after:", sixtySecondsAgo.toISOString())

// //     const pendingNotifications = await db
// //       .collection("notifications")
// //       .find({
// //         createdAt: { $gte: sixtySecondsAgo.toISOString() },
// //         sent: { $ne: true },
// //       })
// //       .toArray()

// //     console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

// //     if (pendingNotifications.length === 0) {
// //       return NextResponse.json({
// //         success: true,
// //         message: "No pending notifications",
// //         count: 0,
// //         searchedAfter: sixtySecondsAgo.toISOString(),
// //       })
// //     }

// //     const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
// //     console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

// //     if (subscriptions.length === 0) {
// //       console.log("[v0] No push subscriptions found")
// //       for (const notification of pendingNotifications) {
// //         await db.collection("notifications").updateOne(
// //           { _id: notification._id },
// //           {
// //             $set: {
// //               sent: true,
// //               sentAt: new Date().toISOString(),
// //               recipientCount: 0,
// //             },
// //           },
// //         )
// //       }
// //       return NextResponse.json({
// //         success: true,
// //         message: "No push subscriptions available",
// //         processed: pendingNotifications.length,
// //         sent: 0,
// //         failed: 0,
// //         totalSubscriptions: 0,
// //       })
// //     }

// //     let sentCount = 0
// //     let failedCount = 0
// //     const errorDetails: any[] = []

// //     const webpush = require("web-push")
// //     webpush.setVapidDetails("mailto:venkythota469@gmail.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

// //     for (const notification of pendingNotifications) {
// //       const { title, message } = notification

// //       console.log(`[v0] Processing notification: ${title}`)
// //       console.log(`[v0] Sending to all ${subscriptions.length} subscriptions`)

// //       if (subscriptions.length > 0) {
// //         console.log("[v0] Sample subscription object:", JSON.stringify(subscriptions[0].subscription, null, 2))
// //       }

// //       // Send push notification to ALL subscriptions
// //       for (const subscription of subscriptions) {
// //         try {
// //           const payload = JSON.stringify({
// //             title: title || "Employee Management System",
// //             body: message,
// //             icon: "/logo3.png",
// //             badge: "/logo3.png",
// //             vibrate: [200, 100, 200, 100, 200],
// //             requireInteraction: false,
// //             silent: false,
// //             renotify: true,
// //             tag: `notification-${notification._id.toString()}`,
// //             data: {
// //               url: "/notifications",
// //               notificationId: notification._id.toString(),
// //               timestamp: Date.now(),
// //             },
// //           })

// //           await webpush.sendNotification(subscription.subscription, payload)
// //           sentCount++
// //         } catch (error: any) {
// //           console.error(`[v0] Failed to send push:`, {
// //             statusCode: error.statusCode,
// //             message: error.message,
// //             body: error.body,
// //             endpoint: subscription.subscription?.endpoint?.substring(0, 50) + "...",
// //           })

// //           errorDetails.push({
// //             statusCode: error.statusCode,
// //             message: error.message,
// //             body: error.body,
// //           })

// //           failedCount++

// //           // Remove expired subscriptions
// //           if (error.statusCode === 410 || error.statusCode === 404) {
// //             await db.collection("push_subscriptions").deleteOne({ _id: subscription._id })
// //           }
// //         }
// //       }

// //       // Mark notification as sent
// //       await db.collection("notifications").updateOne(
// //         { _id: notification._id },
// //         {
// //           $set: {
// //             sent: true,
// //             sentAt: new Date().toISOString(),
// //             recipientCount: sentCount,
// //           },
// //         },
// //       )
// //     }

// //     console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

// //     return NextResponse.json({
// //       success: true,
// //       message: sentCount > 0 ? "Notifications sent successfully" : "Failed to send notifications",
// //       processed: pendingNotifications.length,
// //       sent: sentCount,
// //       failed: failedCount,
// //       totalSubscriptions: subscriptions.length,
// //       errors: errorDetails.slice(0, 5), // Return first 5 errors for debugging
// //     })
// //   } catch (error: any) {
// //     console.error("[v0] Cron job error:", error)
// //     return NextResponse.json(
// //       {
// //         success: false,
// //         error: error.message || "Unknown error",
// //         stack: error.stack,
// //       },
// //       { status: 500 },
// //     )
// //   }
// // }




// import { type NextRequest, NextResponse } from "next/server"
// import { getDb } from "@/lib/mongo"

// export const dynamic = "force-dynamic"
// export const maxDuration = 60

// const VAPID_PUBLIC_KEY = "BNdVyZH9EWmbKQ7H9NFU2AKlLWSKS8Basd6Jhr6mP8ZJUMbw6ve0o_2Yw5MtJsii8iEx7un2jUgvUiTNvSh0MTA"
// const VAPID_PRIVATE_KEY = "M0MGV7GnRqfejqNYdYP3bmgkRP9iALXBlTjddYSnFvU"
// const PRODUCTION_URL = "https://faceattendv1.netlify.app"

// export async function GET(request: NextRequest) {
//   try {
//     console.log("[v0] Cron job started - send-notifications")

//     const searchParams = request.nextUrl.searchParams
//     const apiKey = searchParams.get("api_key")

//     if (!apiKey || apiKey !== "venkythota") {
//       console.log("[v0] Unauthorized cron job attempt")
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
//     }

//     const db = await getDb()
//     if (!db) {
//       console.log("[v0] Database connection failed")
//       return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 503 })
//     }

//     const sixtySecondsAgo = new Date(Date.now() - 60 * 1000)

//     console.log("[v0] Searching for notifications created after:", sixtySecondsAgo.toISOString())

//     const pendingNotifications = await db
//       .collection("notifications")
//       .find({
//         createdAt: { $gte: sixtySecondsAgo.toISOString() },
//         sent: { $ne: true },
//       })
//       .toArray()

//     console.log(`[v0] Found ${pendingNotifications.length} pending notifications`)

//     if (pendingNotifications.length === 0) {
//       return NextResponse.json({
//         success: true,
//         message: "No pending notifications",
//         count: 0,
//         searchedAfter: sixtySecondsAgo.toISOString(),
//       })
//     }

//     const subscriptions = await db.collection("push_subscriptions").find({}).toArray()
//     console.log(`[v0] Found ${subscriptions.length} push subscriptions`)

//     if (subscriptions.length === 0) {
//       console.log("[v0] No push subscriptions found")
//       for (const notification of pendingNotifications) {
//         await db.collection("notifications").updateOne(
//           { _id: notification._id },
//           {
//             $set: {
//               sent: true,
//               sentAt: new Date().toISOString(),
//               recipientCount: 0,
//             },
//           },
//         )
//       }
//       return NextResponse.json({
//         success: true,
//         message: "No push subscriptions available",
//         processed: pendingNotifications.length,
//         sent: 0,
//         failed: 0,
//         totalSubscriptions: 0,
//       })
//     }

//     let sentCount = 0
//     let failedCount = 0
//     const errorDetails: any[] = []

//     const webpush = require("web-push")
//     webpush.setVapidDetails("mailto:venkythota469@gmail.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

//     for (const notification of pendingNotifications) {
//       const { title, message } = notification

//       console.log(`[v0] Processing notification: ${title}`)
//       console.log(`[v0] Sending to all ${subscriptions.length} subscriptions`)

//       if (subscriptions.length > 0) {
//         console.log("[v0] Sample subscription object:", JSON.stringify(subscriptions[0].subscription, null, 2))
//       }

//       // Send push notification to ALL subscriptions
//       for (const subscription of subscriptions) {
//         try {
//           const payload = JSON.stringify({
//             title: title || "Employee Management System",
//             body: message,
//             icon: "/logo3.png",
//             badge: "/logo3.png",
//             vibrate: [200, 100, 200, 100, 200],
//             requireInteraction: false,
//             silent: false,
//             renotify: true,
//             tag: `notification-${notification._id.toString()}`,
//             data: {
//               url: `${PRODUCTION_URL}/notifications`,
//               notificationId: notification._id.toString(),
//               timestamp: Date.now(),
//             },
//           })

//           await webpush.sendNotification(subscription.subscription, payload)
//           sentCount++
//         } catch (error: any) {
//           console.error(`[v0] Failed to send push:`, {
//             statusCode: error.statusCode,
//             message: error.message,
//             body: error.body,
//             endpoint: subscription.subscription?.endpoint?.substring(0, 50) + "...",
//           })

//           errorDetails.push({
//             statusCode: error.statusCode,
//             message: error.message,
//             body: error.body,
//           })

//           failedCount++

//           // Remove expired subscriptions
//           if (error.statusCode === 410 || error.statusCode === 404) {
//             await db.collection("push_subscriptions").deleteOne({ _id: subscription._id })
//           }
//         }
//       }

//       // Mark notification as sent
//       await db.collection("notifications").updateOne(
//         { _id: notification._id },
//         {
//           $set: {
//             sent: true,
//             sentAt: new Date().toISOString(),
//             recipientCount: sentCount,
//           },
//         },
//       )
//     }

//     console.log(`[v0] Cron job completed - sent: ${sentCount}, failed: ${failedCount}`)

//     return NextResponse.json({
//       success: true,
//       message: sentCount > 0 ? "Notifications sent successfully" : "Failed to send notifications",
//       processed: pendingNotifications.length,
//       sent: sentCount,
//       failed: failedCount,
//       totalSubscriptions: subscriptions.length,
//       errors: errorDetails.slice(0, 5), // Return first 5 errors for debugging
//     })
//   } catch (error: any) {
//     console.error("[v0] Cron job error:", error)
//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message || "Unknown error",
//         stack: error.stack,
//       },
//       { status: 500 },
//     )
//   }
// }





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

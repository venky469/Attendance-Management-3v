


// import { NextResponse } from "next/server"
// import { getDb } from "@/lib/mongo"
// import webpush from "web-push"

// // Configure web-push with VAPID keys
// if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
//   webpush.setVapidDetails("mailto:venkythota469@gmail.com", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)
// }

// export async function POST(req: Request) {
//   try {
//     const { title, body, data, userId, audience, institutionName, target, url } = await req.json()
//     const db = await getDb()

//     // Build query based on audience
//     let query: any = {}

//     if (userId) {
//       // Send to specific user
//       query = { userId }
//     } else if (audience === "admins") {
//       // Send to all admins
//       const admins = await db
//         .collection("staff")
//         .find({
//           $or: [{ role: "Admin" }, { "role.name": "Admin" }, { role: "SuperAdmin" }],
//         })
//         .project({ _id: 1 })
//         .toArray()

//       const adminIds = admins.map((a) => a._id.toString())
//       query = { userId: { $in: adminIds } }
//     } else if (audience === "institution" && institutionName) {
//       // Send to institution members based on target
//       const collections = []
//       if (target === "both" || target === "staff") {
//         collections.push("staff")
//       }
//       if (target === "both" || target === "students") {
//         collections.push("students")
//       }

//       const userIds: string[] = []
//       for (const collectionName of collections) {
//         const users = await db.collection(collectionName).find({ institutionName }).project({ _id: 1 }).toArray()
//         userIds.push(...users.map((u) => u._id.toString()))
//       }

//       query = { userId: { $in: userIds } }
//     }

//     // Get subscriptions
//     const subscriptions = await db.collection("push_subscriptions").find(query).toArray()

//     const payload = JSON.stringify({
//       title,
//       body,
//       data: {
//         ...data,
//         url: url || "/notifications",
//       },
//       icon: "/logo3.jpg",
//       badge: "/logo3.jpg",
//       requireInteraction: false,
//       tag: "notification",
//     })

//     // Send notifications to all subscriptions
//     const results = await Promise.allSettled(
//       subscriptions.map((sub) => webpush.sendNotification(sub.subscription, payload)),
//     )

//     // Remove failed subscriptions (expired/invalid)
//     const failedIndexes = results
//       .map((result, index) => (result.status === "rejected" ? index : -1))
//       .filter((index) => index !== -1)

//     if (failedIndexes.length > 0) {
//       await db.collection("push_subscriptions").deleteMany({
//         _id: { $in: failedIndexes.map((i) => subscriptions[i]._id) },
//       })
//     }

//     return NextResponse.json({
//       success: true,
//       sent: results.filter((r) => r.status === "fulfilled").length,
//       failed: failedIndexes.length,
//     })
//   } catch (error) {
//     console.error("Error sending push notification:", error)
//     return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
//   }
// }



import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import webpush from "web-push"

// Configure web-push with VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails("mailto:venkythota469@gmail.com", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)
}

export async function POST(req: Request) {
  try {
    const { title, body, data, userId, audience, institutionName, target, url } = await req.json()
    const db = await getDb()

    // Build query based on audience
    let query: any = {}

    if (userId) {
      // Send to specific user
      query = { userId }
    } else if (audience === "admins") {
      // Send to all admins
      const admins = await db
        .collection("staff")
        .find({
          $or: [{ role: "Admin" }, { "role.name": "Admin" }, { role: "SuperAdmin" }],
        })
        .project({ _id: 1 })
        .toArray()

      const adminIds = admins.map((a) => a._id.toString())
      query = { userId: { $in: adminIds } }
    } else if (audience === "institution" && institutionName) {
      // Send to institution members based on target
      const collections = []
      if (target === "both" || target === "staff") {
        collections.push("staff")
      }
      if (target === "both" || target === "students") {
        collections.push("students")
      }

      const userIds: string[] = []
      for (const collectionName of collections) {
        const users = await db.collection(collectionName).find({ institutionName }).project({ _id: 1 }).toArray()
        userIds.push(...users.map((u) => u._id.toString()))
      }

      query = { userId: { $in: userIds } }
    }

    // Get subscriptions
    const subscriptions = await db.collection("push_subscriptions").find(query).toArray()

    const payload = JSON.stringify({
      title,
      body,
      data: {
        ...data,
        url: url || "/notifications",
        notificationType: data?.notificationType || "general",
      },
      icon: "/logo3.jpg",
      badge: "/logo3.jpg",
      requireInteraction: false,
      silent: false,
      tag: "notification",
      renotify: true,
      timestamp: Date.now(),
      vibrate: [200, 100, 200, 100, 200],
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

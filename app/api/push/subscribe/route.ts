

// import { NextResponse } from "next/server"
// import { getDb } from "@/lib/mongo"
// import { getUserFromRequest } from "@/lib/server-auth"

// export async function POST(req: Request) {
//   try {
//     const subscription = await req.json()
//     const db = await getDb()

//     const user = await getUserFromRequest()
//     const userId = user?.id || null

//     // Check if subscription already exists
//     const existing = await db.collection("push_subscriptions").findOne({
//       "subscription.endpoint": subscription.endpoint,
//     })

//     if (existing) {
//       // Update existing subscription with userId
//       await db.collection("push_subscriptions").updateOne(
//         { "subscription.endpoint": subscription.endpoint },
//         {
//           $set: {
//             subscription,
//             userId,
//             updatedAt: new Date(),
//           },
//         },
//       )
//     } else {
//       // Create new subscription
//       await db.collection("push_subscriptions").insertOne({
//         subscription,
//         userId,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error saving push subscription:", error)
//     return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
//   }
// }



import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import { getUserFromRequest } from "@/lib/server-auth"

export async function POST(req: Request) {
  try {
    const subscription = await req.json()
    const db = await getDb()

    const user = await getUserFromRequest()
    const userId = user?.id || null

    console.log("[v0] Push subscription request - userId:", userId)

    let userRole = null
    let institutionName = null

    if (userId) {
      // Try to find user in staff collection
      const staffUser = await db.collection("staff").findOne({ _id: userId })
      if (staffUser) {
        userRole = typeof staffUser.role === "string" ? staffUser.role : staffUser.role?.name
        institutionName = staffUser.institutionName
      } else {
        // Try to find user in students collection
        const studentUser = await db.collection("students").findOne({ _id: userId })
        if (studentUser) {
          userRole = "Student"
          institutionName = studentUser.institutionName
        }
      }
    }

    console.log("[v0] User details - role:", userRole, "institution:", institutionName)

    // Check if subscription already exists
    const existing = await db.collection("push_subscriptions").findOne({
      "subscription.endpoint": subscription.endpoint,
    })

    if (existing) {
      await db.collection("push_subscriptions").updateOne(
        { "subscription.endpoint": subscription.endpoint },
        {
          $set: {
            subscription,
            userId,
            role: userRole,
            institutionName,
            updatedAt: new Date(),
          },
        },
      )
      console.log("[v0] Updated existing push subscription")
    } else {
      await db.collection("push_subscriptions").insertOne({
        subscription,
        userId,
        role: userRole,
        institutionName,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log("[v0] Created new push subscription")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error saving push subscription:", error)
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
  }
}

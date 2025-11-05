import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import { getUserFromRequest } from "@/lib/server-auth"

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ count: 0 })
    }

    const db = await getDb()

    // Count unread notifications for this user
    const count = await db.collection("leave_notifications").countDocuments({
      recipientId: user.id,
      read: { $ne: true },
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error counting notifications:", error)
    return NextResponse.json({ count: 0 })
  }
}

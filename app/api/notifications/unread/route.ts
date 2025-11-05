import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import { getUserFromRequest } from "@/lib/server-auth"

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()

    // Get unread notifications for this user (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

    const notifications = await db
      .collection("leave_notifications")
      .find({
        recipientId: user.id,
        sentAt: { $gte: fiveMinutesAgo },
        read: { $ne: true },
      })
      .sort({ sentAt: -1 })
      .limit(5)
      .toArray()

    // Mark as read
    if (notifications.length > 0) {
      await db
        .collection("leave_notifications")
        .updateMany({ _id: { $in: notifications.map((n) => n._id) } }, { $set: { read: true } })
    }

    return NextResponse.json({
      notifications: notifications.map((n) => ({
        id: n.id || n._id.toString(),
        title: n.subject,
        message: n.message,
        body: n.message,
        url: `/leave-requests`,
        sentAt: n.sentAt,
      })),
    })
  } catch (error) {
    console.error("Error fetching unread notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

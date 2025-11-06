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

    // Get pending leave requests where this user is the approver
    const pendingRequests = await db
      .collection("leave_requests")
      .find({
        approverEmail: user.email,
        status: "pending",
      })
      .sort({ appliedDate: -1 })
      .toArray()

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
      .toArray()

    // Mark notifications as read
    if (notifications.length > 0) {
      await db
        .collection("leave_notifications")
        .updateMany({ _id: { $in: notifications.map((n) => n._id) } }, { $set: { read: true } })
    }

    return NextResponse.json({
      pendingRequests: pendingRequests.map((r) => ({
        id: r.id || r._id.toString(),
        personName: r.personName,
        leaveType: r.leaveType,
        startDate: r.startDate,
        endDate: r.endDate,
        totalDays: r.totalDays,
        appliedDate: r.appliedDate,
      })),
      notifications: notifications.map((n) => ({
        id: n.id || n._id.toString(),
        title: n.subject,
        message: n.message,
        body: n.message,
        url: n.notificationType === "request" ? "/leave-approval" : "/leave-requests",
        sentAt: n.sentAt,
        type: n.notificationType,
      })),
      pendingCount: pendingRequests.length,
      notificationCount: notifications.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching pending notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

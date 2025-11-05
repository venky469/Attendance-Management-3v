import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

export async function PATCH(request: NextRequest) {
  try {
    const { userId, email, isOnline, lastActiveTime } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: "User ID and email are required" }, { status: 400 })
    }

    const db = await getDb()

    // Find the most recent active login record for this user
    const loginRecord = await db
      .collection("login_history")
      .findOne({ userId, email, success: true, logoutTime: null }, { sort: { timestamp: -1 } })

    if (loginRecord) {
      const updateData: any = {
        lastActiveTime: new Date(lastActiveTime),
        statusUpdatedAt: new Date(),
      }

      if (typeof isOnline === "boolean") {
        updateData.isOnline = isOnline
      }

      await db.collection("login_history").updateOne({ _id: loginRecord._id }, { $set: updateData })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "No active session found" }, { status: 404 })
  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

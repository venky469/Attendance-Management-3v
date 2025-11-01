import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

export async function POST(request: NextRequest) {
  try {
    const { userId, email, sessionDuration, logoutTime } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: "User ID and email are required" }, { status: 400 })
    }

    const db = await getDb()

    // Find the most recent login record for this user
    const loginRecord = await db
      .collection("login_history")
      .findOne({ userId, email, success: true, logoutTime: null }, { sort: { timestamp: -1 } })

    if (loginRecord) {
      // Update the login record with logout information
      await db.collection("login_history").updateOne(
        { _id: loginRecord._id },
        {
          $set: {
            logoutTime: new Date(logoutTime),
            sessionDuration: sessionDuration,
            lastActivityTime: new Date(),
          },
        },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

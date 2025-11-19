import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getStoredUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = getStoredUser()

    if (!user || user.role !== "SuperAdmin") {
      return NextResponse.json({ error: "Unauthorized. SuperAdmin access required." }, { status: 403 })
    }

    const db = await getDb()

    // Get counts for all collections
    const [
      notificationsCount,
      attendanceCount,
      staffCount,
      studentsCount,
      institutionsCount,
      leaveRequestsCount,
      loginHistoryCount,
      shiftSettingsCount,
    ] = await Promise.all([
      db.collection("push_subscriptions").countDocuments(),
      db.collection("attendance").countDocuments(),
      db.collection("staff").countDocuments(),
      db.collection("students").countDocuments(),
      db.collection("institutions").countDocuments(),
      db.collection("leave_requests").countDocuments(),
      db.collection("login_history").countDocuments(),
      db.collection("shift_settings").countDocuments(),
    ])

    // Get additional statistics
    const attendanceStats = await db
      .collection("attendance")
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    const attendanceBreakdown = {
      present: attendanceStats.find((s) => s._id === "present")?.count || 0,
      absent: attendanceStats.find((s) => s._id === "absent")?.count || 0,
      late: attendanceStats.find((s) => s._id === "late")?.count || 0,
    }

    return NextResponse.json({
      success: true,
      counts: {
        notifications: notificationsCount,
        attendance: attendanceCount,
        staff: staffCount,
        students: studentsCount,
        institutions: institutionsCount,
        leaveRequests: leaveRequestsCount,
        loginHistory: loginHistoryCount,
        shiftSettings: shiftSettingsCount,
      },
      attendanceBreakdown,
      totalRecords:
        notificationsCount +
        attendanceCount +
        staffCount +
        studentsCount +
        institutionsCount +
        leaveRequestsCount +
        loginHistoryCount +
        shiftSettingsCount,
    })
  } catch (error) {
    console.error("[admin/database-counts] Error:", error)
    return NextResponse.json({ error: "Failed to fetch database counts" }, { status: 500 })
  }
}

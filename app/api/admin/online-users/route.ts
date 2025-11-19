import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userRole = searchParams.get("userRole")

    // Only Super Admin can access online users data
    if (userRole !== "SuperAdmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const db = await getDb()

    // Get all currently online users (active in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    const onlineUsers = await db
      .collection("login_history")
      .find({
        isOnline: true,
        lastActivityTime: { $gte: fiveMinutesAgo.toISOString() },
      })
      .toArray()

    // Count by user type
    const counts = {
      total: onlineUsers.length,
      byRole: {} as Record<string, number>,
      byInstitution: {} as Record<string, number>,
      users: onlineUsers.map((u) => ({
        name: u.name,
        email: u.email,
        role: u.role || u.userType,
        institution: u.institutionName,
        lastActive: u.lastActivityTime,
      })),
    }

    // Count by role
    onlineUsers.forEach((user) => {
      const role = user.role || user.userType || "Unknown"
      counts.byRole[role] = (counts.byRole[role] || 0) + 1

      const institution = user.institutionName || "No Institution"
      counts.byInstitution[institution] = (counts.byInstitution[institution] || 0) + 1
    })

    return NextResponse.json({
      success: true,
      onlineCount: counts.total,
      byRole: counts.byRole,
      byInstitution: counts.byInstitution,
      users: counts.users,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Online users fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

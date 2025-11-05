import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// This cron job runs every minute to check for inactive sessions
// and automatically mark them as offline
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tokenFromQuery = searchParams.get("token")
    const authHeader = request.headers.get("authorization")
    const tokenFromHeader = authHeader?.replace("Bearer ", "")

    const providedToken = tokenFromQuery || tokenFromHeader

    if (!providedToken || providedToken !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const loginHistoryPath = path.join(process.cwd(), "backend", "login-history.json")

    // Read current login history
    let loginHistory = []
    if (fs.existsSync(loginHistoryPath)) {
      const data = fs.readFileSync(loginHistoryPath, "utf-8")
      loginHistory = JSON.parse(data)
    }

    // Current time
    const now = Date.now()
    // Consider offline if no activity for 2 minutes
    const offlineThreshold = 2 * 60 * 1000 // 2 minutes in milliseconds

    let updatedCount = 0

    // Check each session and mark as offline if inactive
    loginHistory = loginHistory.map((entry: any) => {
      // Only check currently online sessions
      if (entry.isOnline && entry.lastActivityTime) {
        const lastActive = new Date(entry.lastActivityTime).getTime()
        const timeSinceActive = now - lastActive

        // If inactive for more than threshold, mark as offline
        if (timeSinceActive > offlineThreshold) {
          updatedCount++
          return {
            ...entry,
            isOnline: false,
            lastActivityTime: entry.lastActivityTime, // Keep the last known activity time
          }
        }
      }
      return entry
    })

    // Save updated login history
    fs.writeFileSync(loginHistoryPath, JSON.stringify(loginHistory, null, 2))

    console.log(`[Cron] Checked sessions: ${updatedCount} marked as offline`)

    return NextResponse.json({
      success: true,
      message: `Checked ${loginHistory.length} sessions, marked ${updatedCount} as offline`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Cron] Error checking sessions:", error)
    return NextResponse.json({ error: "Failed to check sessions" }, { status: 500 })
  }
}

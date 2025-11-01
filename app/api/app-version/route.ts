import { NextResponse } from "next/server"
import { APP_VERSION, getLatestUpdate } from "@/lib/app-version"

// API endpoint to check app version and get latest features
export async function GET() {
  try {
    const latestUpdate = getLatestUpdate()

    return NextResponse.json({
      success: true,
      version: APP_VERSION,
      latestUpdate,
    })
  } catch (error) {
    console.error("Error fetching app version:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch app version" }, { status: 500 })
  }
}

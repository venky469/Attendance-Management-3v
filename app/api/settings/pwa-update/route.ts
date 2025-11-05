import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

// GET - Get PWA update settings
export async function GET() {
  try {
    const db = await connectDB()
    const settings = await db.collection("app_settings").findOne({ _id: "pwa_update_settings" })

    return NextResponse.json({
      success: true,
      skipWaiting: settings?.skipWaiting ?? false,
    })
  } catch (error) {
    console.error("Error fetching PWA update settings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 })
  }
}

// PUT - Update PWA update settings (SuperAdmin only)
export async function PUT(request: Request) {
  try {
    const { skipWaiting } = await request.json()

    const db = await connectDB()
    await db.collection("app_settings").updateOne(
      { _id: "pwa_update_settings" },
      {
        $set: {
          skipWaiting: Boolean(skipWaiting),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({
      success: true,
      message: "PWA update settings updated successfully",
    })
  } catch (error) {
    console.error("Error updating PWA update settings:", error)
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 })
  }
}

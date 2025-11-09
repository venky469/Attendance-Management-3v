import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { api_key } = await request.json()

    // Security check
    if (api_key !== "venkythota") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("biometric_attendance")

    // Delete all subscriptions
    const result = await db.collection("push_subscriptions").deleteMany({})

    return NextResponse.json({
      success: true,
      message: "All subscriptions cleared",
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error("[v0] Error clearing subscriptions:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear subscriptions",
      },
      { status: 500 },
    )
  }
}

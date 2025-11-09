import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const apiKey = searchParams.get("api_key")

    if (apiKey !== "venkythota") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("attendance_system")

    // Delete ALL push subscriptions
    const result = await db.collection("push_subscriptions").deleteMany({})

    return NextResponse.json({
      success: true,
      message: "All subscriptions cleared",
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error("Error clearing subscriptions:", error)
    return NextResponse.json({ error: "Failed to clear subscriptions" }, { status: 500 })
  }
}

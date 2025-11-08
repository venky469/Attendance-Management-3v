import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const institutionName = searchParams.get("institutionName")

    const db = await getDb()

    const query: any = { status: "pending" }

    if (institutionName) {
      query.institutionName = institutionName
    }

    const count = await db.collection("leave_requests").countDocuments(query)

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching pending leave count:", error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const body = await req.json().catch(() => ({}))
    const { userId } = body as { userId?: string }

    if (!id) {
      return NextResponse.json({ error: "Missing notification id" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 })
    }

    const db = await getDb()

    // Add user deletion record to track which users have deleted which notifications
    const deletionRecord = {
      notificationId: id,
      userId,
      deletedAt: new Date().toISOString(),
    }

    await db.collection("user_notification_deletions").insertOne(deletionRecord)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("[notifications][user-delete] error:", err?.message || err)
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 })
  }
}

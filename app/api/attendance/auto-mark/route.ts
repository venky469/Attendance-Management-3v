
import { type NextRequest, NextResponse } from "next/server"

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      disabled: true,
      message:
        "Auto-absent is now scheduled-only. Use /api/cron/auto-mark-absent with a scheduler (e.g., Vercel Cron or Upstash QStash) after shift window closes.",
    },
    { status: 410 },
  )
}

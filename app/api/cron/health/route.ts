import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const token = req.headers.get("x-cron-token") ?? url.searchParams.get("token") ?? ""
  const secret = process.env.CRON_SECRET
  if (secret && token !== secret) {
    return new Response("Unauthorized", { status: 401 })
  }
  return Response.json({ ok: true, service: "cron-health", ts: new Date().toISOString() })
}

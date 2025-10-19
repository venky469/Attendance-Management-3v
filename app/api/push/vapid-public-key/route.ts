import { NextResponse } from "next/server"

// Generate VAPID keys using: npx web-push generate-vapid-keys
// Store them in environment variables
export async function GET() {
  const publicKey = process.env.VAPID_PUBLIC_KEY || ""

  if (!publicKey) {
    return NextResponse.json({ error: "VAPID public key not configured" }, { status: 500 })
  }

  return NextResponse.json({ publicKey })
}

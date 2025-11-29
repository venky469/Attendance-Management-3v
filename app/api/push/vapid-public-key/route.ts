

import { NextResponse } from "next/server"

// Generate VAPID keys using: npx web-push generate-vapid-keys
// Store them in environment variables
export async function GET() {
  const publicKey = "BNdVyZH9EWmbKQ7H9NFU2AKlLWSKS8Basd6Jhr6mP8ZJUMbw6ve0o_2Yw5MtJsii8iEx7un2jUgvUiTNvSh0MTA"

  return NextResponse.json({ publicKey })
}

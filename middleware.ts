import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next()

    // Set a custom header to track request start time
    response.headers.set("X-Request-Start", Date.now().toString())

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}

import { cookies } from "next/headers"
import type { User } from "./auth"

/**
 * Server-side only function to get authenticated user from cookies
 * Can only be used in Server Components, Server Actions, and API Routes
 */
export async function getUserFromRequest(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user")

    if (userCookie?.value) {
      return JSON.parse(userCookie.value)
    }

    return null
  } catch (error) {
    console.error("[v0] Error getting user from request:", error)
    return null
  }
}

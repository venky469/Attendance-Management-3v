import { useEffect } from "react"
import { getStoredUser } from "@/lib/auth"

/**
 * Hook to send periodic heartbeat to keep user session active
 * This helps track online users accurately
 */
export function useHeartbeat(intervalMs: number = 60000) {
  useEffect(() => {
    const sendHeartbeat = async () => {
      const user = getStoredUser()
      if (!user) return

      try {
        await fetch("/api/login-history/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.userId,
            email: user.email,
            isOnline: true,
            lastActiveTime: new Date().toISOString(),
          }),
        })
      } catch (error) {
        console.error("Heartbeat failed:", error)
      }
    }

    // Send initial heartbeat
    sendHeartbeat()

    // Send periodic heartbeats
    const interval = setInterval(sendHeartbeat, intervalMs)

    // Cleanup on unmount
    return () => clearInterval(interval)
  }, [intervalMs])
}

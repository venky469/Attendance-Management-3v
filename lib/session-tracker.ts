export interface SessionData {
  loginTime: number
  lastActivityTime: number
  userId: string
  email: string
}

const SESSION_KEY = "session_tracker"

export function startSessionTracking(userId: string, email: string): void {
  if (typeof window === "undefined") return

  const sessionData: SessionData = {
    loginTime: Date.now(),
    lastActivityTime: Date.now(),
    userId,
    email,
  }

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))

  // Update last activity on user interactions
  const updateActivity = () => {
    const stored = sessionStorage.getItem(SESSION_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      data.lastActivityTime = Date.now()
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
    }
  }

  // Track user activity
  window.addEventListener("mousemove", updateActivity)
  window.addEventListener("keydown", updateActivity)
  window.addEventListener("click", updateActivity)
  window.addEventListener("scroll", updateActivity)
}

export function getSessionDuration(): number {
  if (typeof window === "undefined") return 0

  const stored = sessionStorage.getItem(SESSION_KEY)
  if (!stored) return 0

  const data: SessionData = JSON.parse(stored)
  return Date.now() - data.loginTime
}

export function getSessionData(): SessionData | null {
  if (typeof window === "undefined") return null

  const stored = sessionStorage.getItem(SESSION_KEY)
  if (!stored) return null

  return JSON.parse(stored)
}

export async function endSessionTracking(): Promise<void> {
  if (typeof window === "undefined") return

  const sessionData = getSessionData()
  if (!sessionData) return

  const duration = Date.now() - sessionData.loginTime

  // Send logout data to server
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: sessionData.userId,
        email: sessionData.email,
        sessionDuration: duration,
        logoutTime: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error("Failed to log session end:", error)
  }

  sessionStorage.removeItem(SESSION_KEY)
}

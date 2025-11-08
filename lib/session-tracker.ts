
export interface SessionData {
  loginTime: number
  lastActivityTime: number
  userId: string
  email: string
  isOnline?: boolean
}

const SESSION_KEY = "session_tracker"
const SYNC_INTERVAL = 30000 // Sync every 30 seconds
let syncIntervalId: NodeJS.Timeout | null = null

export function startSessionTracking(userId: string, email: string): void {
  if (typeof window === "undefined") return

  const sessionData: SessionData = {
    loginTime: Date.now(),
    lastActivityTime: Date.now(),
    userId,
    email,
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))

  startPeriodicSync()

  const handleVisibilityChange = () => {
    const isOnline = !document.hidden
    updateOnlineStatus(isOnline)
  }

  const handleOnlineStatus = () => {
    updateOnlineStatus(navigator.onLine)
  }

  // Update last activity on user interactions
  const updateActivity = () => {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      data.lastActivityTime = Date.now()
      localStorage.setItem(SESSION_KEY, JSON.stringify(data))
    }
  }

  // Track user activity
  window.addEventListener("mousemove", updateActivity)
  window.addEventListener("keydown", updateActivity)
  window.addEventListener("click", updateActivity)
  window.addEventListener("scroll", updateActivity)
  window.addEventListener("touchstart", updateActivity)
  window.addEventListener("touchmove", updateActivity)

  document.addEventListener("visibilitychange", handleVisibilityChange)

  window.addEventListener("online", handleOnlineStatus)
  window.addEventListener("offline", handleOnlineStatus)

  updateOnlineStatus(true)
}

export function resumeSessionTracking(): void {
  if (typeof window === "undefined") return

  const sessionData = getSessionData()
  if (!sessionData) return

  // Restart tracking with existing session data
  startPeriodicSync()

  const handleVisibilityChange = () => {
    const isOnline = !document.hidden
    updateOnlineStatus(isOnline)
  }

  const handleOnlineStatus = () => {
    updateOnlineStatus(navigator.onLine)
  }

  const updateActivity = () => {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      data.lastActivityTime = Date.now()
      localStorage.setItem(SESSION_KEY, JSON.stringify(data))
    }
  }

  // Track user activity
  window.addEventListener("mousemove", updateActivity)
  window.addEventListener("keydown", updateActivity)
  window.addEventListener("click", updateActivity)
  window.addEventListener("scroll", updateActivity)
  window.addEventListener("touchstart", updateActivity)
  window.addEventListener("touchmove", updateActivity)

  document.addEventListener("visibilitychange", handleVisibilityChange)

  window.addEventListener("online", handleOnlineStatus)
  window.addEventListener("offline", handleOnlineStatus)

  updateOnlineStatus(true)
}

function startPeriodicSync(): void {
  if (syncIntervalId) {
    clearInterval(syncIntervalId)
  }

  syncIntervalId = setInterval(() => {
    syncStatusToServer()
  }, SYNC_INTERVAL)

  // Initial sync
  syncStatusToServer()
}

async function syncStatusToServer(): Promise<void> {
  if (typeof window === "undefined") return

  const sessionData = getSessionData()
  if (!sessionData) return

  try {
    await fetch("/api/login-history/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: sessionData.userId,
        email: sessionData.email,
        lastActiveTime: new Date(sessionData.lastActivityTime).toISOString(),
      }),
    })
  } catch (error) {
    console.error("Failed to sync status:", error)
  }
}

async function updateOnlineStatus(isOnline: boolean): Promise<void> {
  if (typeof window === "undefined") return

  const sessionData = getSessionData()
  if (!sessionData) return

  try {
    await fetch("/api/login-history/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: sessionData.userId,
        email: sessionData.email,
        isOnline,
        lastActiveTime: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error("Failed to update online status:", error)
  }
}

export function getSessionDuration(): number {
  if (typeof window === "undefined") return 0

  const stored = localStorage.getItem(SESSION_KEY)
  if (!stored) return 0

  const data: SessionData = JSON.parse(stored)
  return Date.now() - data.loginTime
}

export function getSessionData(): SessionData | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(SESSION_KEY)
  if (!stored) return null

  return JSON.parse(stored)
}

export async function endSessionTracking(): Promise<void> {
  if (typeof window === "undefined") return

  if (syncIntervalId) {
    clearInterval(syncIntervalId)
    syncIntervalId = null
  }

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

  localStorage.removeItem(SESSION_KEY)
}

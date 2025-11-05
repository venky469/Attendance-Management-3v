"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { AlertTriangle } from "lucide-react"
import { getStoredUser } from "@/lib/auth"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function MaintenanceAlert() {
  const [user, setUser] = useState<any>(null)

  // Get current user
  useEffect(() => {
    const currentUser = getStoredUser()
    setUser(currentUser)
  }, [])

  // Poll maintenance status every 30 seconds
  const { data } = useSWR("/api/settings?scope=global", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  })

  const maintenanceEnabled = data?.data?.maintenance?.enabled || false
  const maintenanceMessage =
    data?.data?.maintenance?.message || "System is under maintenance. Please contact your administrator."

  // Don't show alert if:
  // - User is not logged in
  // - User is SuperAdmin
  // - Maintenance is not enabled
  if (!user || user.role === "SuperAdmin" || !maintenanceEnabled) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-28 z-[100] animate-in slide-in-from-top duration-500">
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-4 py-4 shadow-2xl h-full">
        <div className="mx-auto max-w-6xl h-full flex items-center">
          <div className="flex items-start gap-4 w-full">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-1 text-balance">⚠️ System Maintenance in Progress</h3>
              <p className="text-white/95 text-base leading-relaxed text-pretty">{maintenanceMessage}</p>
              <p className="text-white/80 text-sm mt-1">
                Some features may be temporarily unavailable. Please save your work frequently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

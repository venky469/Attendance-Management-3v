"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { getStoredUser } from "@/lib/auth"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function MaintenanceSpacer() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getStoredUser()
    setUser(currentUser)
  }, [])

  const { data } = useSWR("/api/settings?scope=global", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  })

  const maintenanceEnabled = data?.data?.maintenance?.enabled || false

  // Add spacer if maintenance is enabled and user is not SuperAdmin
  if (!user || user.role === "SuperAdmin" || !maintenanceEnabled) {
    return null
  }

  return <div className="h-28" />
}

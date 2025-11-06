"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function LeaveApprovalAutoRefresh() {
  const router = useRouter()

  useEffect(() => {
    // Refresh the page data every 20 seconds to show new requests
    const refreshInterval = setInterval(() => {
      router.refresh()
    }, 20000)

    return () => clearInterval(refreshInterval)
  }, [router])

  return null
}

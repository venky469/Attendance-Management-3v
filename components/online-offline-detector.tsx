
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { WifiOff, Wifi } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function OnlineOfflineDetector() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineAlert, setShowOfflineAlert] = useState(false)
  const [showOnlineAlert, setShowOnlineAlert] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)

    // Only run if window/navigator is available
    if (typeof window === "undefined" || !navigator) return

    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      console.log("[v0] Network connection restored")
      setIsOnline(true)
      setShowOfflineAlert(false)
      setShowOnlineAlert(true)

      setTimeout(() => {
        router.refresh()
      }, 100)

      // Hide online alert after 3 seconds
      setTimeout(() => {
        setShowOnlineAlert(false)
      }, 3000)
    }

    const handleOffline = () => {
      console.log("[v0] Network connection lost")
      setIsOnline(false)
      setShowOfflineAlert(true)
      setShowOnlineAlert(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    const interval = setInterval(() => {
      const currentOnlineStatus = navigator.onLine
      if (currentOnlineStatus !== isOnline) {
        if (currentOnlineStatus) {
          handleOnline()
        } else {
          handleOffline()
        }
      }
    }, 5000)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
    }
  }, [isOnline, router])

  if (!isMounted) return null

  if (!isOnline && showOfflineAlert) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <WifiOff className="w-10 h-10 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">No Internet Connection</h1>
            <p className="text-muted-foreground">Please check your mobile data or WiFi connection and try again.</p>
          </div>
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              Make sure your mobile data is turned on or you're connected to a WiFi network.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (showOnlineAlert) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top">
        <Alert className="bg-green-50 border-green-200">
          <Wifi className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Back online! Refreshing data...</AlertDescription>
        </Alert>
      </div>
    )
  }

  return null
}

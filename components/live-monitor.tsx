"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"

type OnlineUsersData = {
  onlineCount: number
  byRole: Record<string, number>
  byInstitution: Record<string, number>
  timestamp: string
}

type NetworkSpeed = {
  downloadSpeed: number // in Mbps
  quality: "excellent" | "good" | "fair" | "poor"
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function LiveMonitor() {
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>({ downloadSpeed: 0, quality: "poor" })
  const [measuring, setMeasuring] = useState(false)

  // Fetch online users every 10 seconds
  const { data } = useSWR<OnlineUsersData>("/api/admin/online-users?userRole=SuperAdmin", fetcher, {
    refreshInterval: 10000, // 10 seconds
    revalidateOnFocus: false,
  })

  // Measure network speed
  useEffect(() => {
    measureNetworkSpeed()
    const interval = setInterval(measureNetworkSpeed, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function measureNetworkSpeed() {
    setMeasuring(true)
    try {
      // Use a small image for speed test (you can replace with your own URL)
      const testImageUrl = `/placeholder.svg?height=100&width=100&t=${Date.now()}`
      const startTime = performance.now()

      const response = await fetch(testImageUrl, { cache: "no-store" })
      const blob = await response.blob()

      const endTime = performance.now()
      const durationInSeconds = (endTime - startTime) / 1000
      const fileSizeInBytes = blob.size
      const fileSizeInMegabits = (fileSizeInBytes * 8) / (1024 * 1024)
      const speedMbps = fileSizeInMegabits / durationInSeconds

      let quality: "excellent" | "good" | "fair" | "poor"
      if (speedMbps > 10) quality = "excellent"
      else if (speedMbps > 5) quality = "good"
      else if (speedMbps > 2) quality = "fair"
      else quality = "poor"

      setNetworkSpeed({
        downloadSpeed: speedMbps,
        quality,
      })
    } catch (error) {
      console.error("Network speed test failed:", error)
      setNetworkSpeed({ downloadSpeed: 0, quality: "poor" })
    } finally {
      setMeasuring(false)
    }
  }

  const getSpeedDisplay = () => {
    const speed = networkSpeed.downloadSpeed
    if (speed >= 1) {
      return `${speed.toFixed(2)} Mbps`
    } else {
      return `${(speed * 1024).toFixed(0)} Kbps`
    }
  }

  const getQualityColor = () => {
    switch (networkSpeed.quality) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "fair":
        return "bg-yellow-500"
      case "poor":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Online Users Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Online Users</h3>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {data?.onlineCount ?? 0}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Active</span>
            <span className="font-medium">{data?.onlineCount ?? 0} users</span>
          </div>

          {data?.byRole && Object.keys(data.byRole).length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground">By Role</p>
              {Object.entries(data.byRole).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{role}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 text-xs text-muted-foreground">
            Last updated: {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : "Never"}
          </div>
        </div>
      </Card>

      {/* Network Speed Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Network Speed</h3>
          <div className={`h-3 w-3 rounded-full ${getQualityColor()} animate-pulse`} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Download Speed</span>
            <span className="text-2xl font-bold">{getSpeedDisplay()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Connection Quality</span>
            <Badge
              variant={
                networkSpeed.quality === "excellent" || networkSpeed.quality === "good" ? "default" : "destructive"
              }
              className="capitalize"
            >
              {networkSpeed.quality}
            </Badge>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Status</span>
              <span>{measuring ? "Measuring..." : "Active"}</span>
            </div>
          </div>

          <button
            onClick={measureNetworkSpeed}
            disabled={measuring}
            className="w-full mt-2 text-sm py-2 px-4 bg-muted hover:bg-muted/80 rounded-md transition-colors disabled:opacity-50"
          >
            {measuring ? "Testing..." : "Test Speed Now"}
          </button>
        </div>
      </Card>
    </div>
  )
}

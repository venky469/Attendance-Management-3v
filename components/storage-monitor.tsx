"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Database, HardDrive, AlertTriangle, TrendingUp, Clock } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

export function StorageMonitor() {
  const { data, error, isLoading } = useSWR("/api/storage-stats", fetcher, {
    refreshInterval: 60000, // Refresh every minute
  })

  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    if (data?.storage?.percentUsed >= 80) {
      setShowAlert(true)
    }
  }, [data])

  if (isLoading) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Database Storage Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Loading storage statistics...</p>
        </CardContent>
      </Card>
    )
  }

  if (error || !data?.success) {
    return (
      <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Database className="h-5 w-5" />
            Database Storage Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">Failed to load storage statistics</p>
        </CardContent>
      </Card>
    )
  }

  const { storage, collections } = data
  const percentUsed = storage.percentUsed || 0
  const isWarning = percentUsed >= 80
  const isCritical = percentUsed >= 90

  const getProgressColor = () => {
    if (isCritical) return "bg-red-500"
    if (isWarning) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStatusColor = () => {
    if (isCritical) return "text-red-600"
    if (isWarning) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="space-y-4">
      {showAlert && isWarning && (
        <Alert variant={isCritical ? "destructive" : "default"} className="border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Storage Warning</AlertTitle>
          <AlertDescription>
            Your database storage is at {percentUsed.toFixed(1)}% capacity.
            {isCritical
              ? " Critical: Consider upgrading to a paid tier immediately."
              : " Consider upgrading to a paid tier or archiving old data."}
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Database className="h-5 w-5 text-blue-600" />
            MongoDB Atlas Storage Monitor
          </CardTitle>
          <CardDescription>Real-time database storage usage and capacity tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Storage Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Storage Usage</span>
              <span className={`text-sm font-bold ${getStatusColor()}`}>{percentUsed.toFixed(1)}%</span>
            </div>
            <Progress value={percentUsed} className="h-3" indicatorClassName={getProgressColor()} />
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{formatBytes(storage.usedBytes)} used</span>
              <span>{formatBytes(storage.limitBytes)} total</span>
            </div>
          </div>

          {/* Storage Details Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-1 rounded-lg bg-white p-3 shadow-sm border">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <HardDrive className="h-3 w-3" />
                Data Size
              </div>
              <p className="text-sm font-semibold text-gray-900">{formatBytes(storage.dataSize)}</p>
            </div>

            <div className="space-y-1 rounded-lg bg-white p-3 shadow-sm border">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Database className="h-3 w-3" />
                Collections
              </div>
              <p className="text-sm font-semibold text-gray-900">{storage.collections}</p>
            </div>

            <div className="space-y-1 rounded-lg bg-white p-3 shadow-sm border">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <TrendingUp className="h-3 w-3" />
                Total Records
              </div>
              <p className="text-sm font-semibold text-gray-900">{storage.objects.toLocaleString()}</p>
            </div>

            <div className="space-y-1 rounded-lg bg-white p-3 shadow-sm border">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="h-3 w-3" />
                Index Size
              </div>
              <p className="text-sm font-semibold text-gray-900">{formatBytes(storage.indexSize)}</p>
            </div>
          </div>

          {/* Estimated Time Until Full */}
          {storage.estimatedDaysUntilFull && (
            <div className="rounded-lg bg-blue-100 p-3 border border-blue-200">
              <p className="text-xs text-blue-700 font-medium">
                Estimated time until full: ~{storage.estimatedDaysUntilFull} days
              </p>
              <p className="text-xs text-blue-600 mt-1">Based on current growth rate</p>
            </div>
          )}

          {/* Collection Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Collection Breakdown</h4>
            <div className="space-y-2">
              {collections?.map((col: any) => (
                <div
                  key={col.name}
                  className="flex items-center justify-between rounded-lg bg-white p-2 shadow-sm border"
                >
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700 capitalize">{col.name.replace(/_/g, " ")}</p>
                    <p className="text-xs text-gray-500">{col.count.toLocaleString()} records</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-900">{formatBytes(col.storageSize)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Recommendation */}
          {percentUsed >= 70 && (
            <div className="rounded-lg bg-gradient-to-r from-blue-100 to-teal-100 p-4 border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Upgrade Recommendation</h4>
              <p className="text-xs text-blue-800 mb-2">
                Consider upgrading to MongoDB Atlas M10 tier for better performance and capacity:
              </p>
              <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                <li>10 GB storage (20x more capacity)</li>
                <li>2-3 years of data retention</li>
                <li>Better performance and reliability</li>
                <li>Cost: ~₹1,500-2,000/month</li>
              </ul>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">Last updated: {new Date(data.timestamp).toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Database, RefreshCw } from "lucide-react"
import { getCacheSize, clearCache } from "@/lib/swr-cache-provider"
import { useToast } from "@/hooks/use-toast"

export function CacheManager() {
  const [cacheSize, setCacheSize] = useState(0)
  const [isClearing, setIsClearing] = useState(false)
  const { toast } = useToast()

  const updateCacheSize = () => {
    setCacheSize(getCacheSize())
  }

  useEffect(() => {
    updateCacheSize()
  }, [])

  const handleClearCache = async () => {
    setIsClearing(true)
    try {
      clearCache()
      updateCacheSize()
      toast({
        title: "Cache Cleared",
        description: "All cached data has been removed. The page will reload.",
      })
      // Reload page to fetch fresh data
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cache",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Cache Management</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Cache Size</p>
            <p className="text-xs text-muted-foreground">Cached data for instant loading</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{cacheSize.toFixed(2)} MB</span>
            <Button variant="ghost" size="icon" onClick={updateCacheSize} title="Refresh cache size">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button variant="destructive" onClick={handleClearCache} disabled={isClearing} className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            {isClearing ? "Clearing..." : "Clear All Cache"}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This will remove all cached data and reload the page
          </p>
        </div>
      </div>
    </Card>
  )
}

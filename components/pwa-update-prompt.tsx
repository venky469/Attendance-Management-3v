"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCw, X } from "lucide-react"

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    // Listen for service worker updates
    navigator.serviceWorker.ready.then((reg) => {
      setRegistration(reg)

      // Check if there's a waiting service worker
      if (reg.waiting) {
        setShowPrompt(true)
      }

      // Listen for new service worker installing
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing
        if (!newWorker) return

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New service worker is installed and waiting
            setShowPrompt(true)
          }
        })
      })
    })

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("[PWA] New service worker activated, reloading page...")
      window.location.reload()
    })
  }, [])

  const handleUpdate = () => {
    if (!registration?.waiting) return

    setIsUpdating(true)

    // Send message to waiting service worker to skip waiting
    registration.waiting.postMessage({ type: "SKIP_WAITING" })

    // The page will reload automatically when controllerchange event fires
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <Card className="border-primary bg-card p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <RefreshCw className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-sm">Update Available</h3>
            <p className="text-sm text-muted-foreground">
              A new version of Genamplify is available. Update now to get the latest features and improvements.
            </p>
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={handleUpdate} disabled={isUpdating} className="flex-1">
                {isUpdating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Now"
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={handleDismiss} disabled={isUpdating}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PWAUpdatePrompt

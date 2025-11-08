
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCw, X, Sparkles } from "lucide-react"
import { getLatestUpdate } from "@/lib/app-version"

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [skipWaiting, setSkipWaiting] = useState<boolean | null>(null)
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const latestUpdate = getLatestUpdate()

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    fetch("/api/settings/pwa-update")
      .then((res) => res.json())
      .then((data) => {
        const autoUpdate = data.skipWaiting || false
        setSkipWaiting(autoUpdate)
        setSettingsLoaded(true)
        console.log("[PWA] Auto-update setting loaded:", autoUpdate ? "ENABLED" : "DISABLED")
      })
      .catch(() => {
        setSkipWaiting(false)
        setSettingsLoaded(true)
        console.log("[PWA] Failed to load settings, defaulting to manual update")
      })
  }, [])

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !settingsLoaded || skipWaiting === null) return

    console.log("[PWA] Checking for service worker updates...")

    navigator.serviceWorker.ready.then((reg) => {
      setRegistration(reg)

      // Check if there's a waiting service worker
      if (reg.waiting) {
        console.log("[PWA] Update available, auto-update:", skipWaiting)
        if (skipWaiting) {
          console.log("[PWA] Auto-updating in background...")
          handleUpdate(reg)
        } else {
          console.log("[PWA] Showing update prompt to user...")
          setShowPrompt(true)
        }
      }

      // Listen for new service worker installing
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing
        if (!newWorker) return

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            console.log("[PWA] New update installed, auto-update:", skipWaiting)
            if (skipWaiting) {
              console.log("[PWA] Auto-updating in background...")
              handleUpdate(reg)
            } else {
              console.log("[PWA] Showing update prompt to user...")
              setShowPrompt(true)
            }
          }
        })
      })
    })

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("[PWA] New service worker activated, reloading page...")
      window.location.reload()
    })
  }, [settingsLoaded, skipWaiting])

  const handleUpdate = (reg?: ServiceWorkerRegistration) => {
    const targetReg = reg || registration
    if (!targetReg?.waiting) return

    setIsUpdating(true)
    console.log("[PWA] Activating new service worker...")

    // Send message to waiting service worker to skip waiting
    targetReg.waiting.postMessage({ type: "SKIP_WAITING" })

    // The page will reload automatically when controllerchange event fires
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-update-dismissed", Date.now().toString())
    console.log("[PWA] Update prompt dismissed by user")
  }

  if (!showPrompt || skipWaiting === true) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5">
      <Card className="border-primary bg-card p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="rounded-full bg-primary/10 p-2">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-base">New Update Available!</h3>
              <p className="text-xs text-muted-foreground">Version {latestUpdate.version}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">What's New:</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {latestUpdate.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
                {latestUpdate.features.length > 4 && (
                  <li className="text-xs italic">+ {latestUpdate.features.length - 4} more improvements</li>
                )}
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={() => handleUpdate()} disabled={isUpdating} className="flex-1 font-medium">
                {isUpdating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Update Now
                  </>
                )}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismiss} disabled={isUpdating} className="px-3">
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

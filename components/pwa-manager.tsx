"use client"

import { useEffect, useState } from "react"
import { PWAInstallPrompt } from "./pwa-install-prompt"

export function PWAManager() {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      setIsSupported(true)

      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration)

          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60000) // Check every minute
        })
        .catch((error) => {
          console.error("[PWA] Service Worker registration failed:", error)
        })
    }

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      // Don't request immediately, wait for user interaction
      console.log("[PWA] Notification permission not yet requested")
    }
  }, [])

  if (!isSupported) return null

  return <PWAInstallPrompt />
}

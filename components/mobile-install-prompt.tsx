

"use client"

import { useEffect, useState } from "react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice?: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function MobileInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  const [isInstalled, setIsInstalled] = useState(false)
  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia?.("(display-mode: standalone)")?.matches ||
        // iOS Safari fallback
        (window.navigator as any).standalone === true
      setIsInstalled(isStandalone)
    }
    checkInstalled()
    window.addEventListener("visibilitychange", checkInstalled)
    return () => window.removeEventListener("visibilitychange", checkInstalled)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener("beforeinstallprompt", handler as EventListener)
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener)
  }, [])

  if (!deferred || !visible || isInstalled) return null

  const onInstall = async () => {
    try {
      await deferred.prompt()
      setVisible(false)
      setDeferred(null)
    } catch {
      // user dismissed
      setVisible(false)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[70] sm:left-auto sm:right-4 sm:w-80">
      <div className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-lg p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <img src="/images/logo.jpg" alt="Face Attendance" width={28} height={28} className="h-7 w-7 rounded-md" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Install Face Attendance</p>
            <p className="text-xs text-gray-600">Add the app to your home screen.</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={onInstall}
            className="px-3 py-1.5 text-sm rounded-lg bg-teal-600 text-white hover:bg-teal-700"
            aria-label="Install app"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}

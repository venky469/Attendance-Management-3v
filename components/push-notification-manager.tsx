

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, BellOff, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      setIsSupported(true)
      setPermission(Notification.permission)

      navigator.serviceWorker.ready
        .then((registration) => {
          return registration.pushManager.getSubscription()
        })
        .then((sub) => {
          if (sub) {
            setSubscription(sub)
            sendNotificationCountToSW()
          } else {
            // Auto-request permission on first visit
            const hasAskedBefore = localStorage.getItem("push-notification-asked")
            if (!hasAskedBefore && Notification.permission === "default") {
              localStorage.setItem("push-notification-asked", "true")
              // Auto-request after a short delay
              setTimeout(() => {
                requestPermission()
              }, 2000)
            }
          }
        })
        .catch((err) => {
          console.error("[v0] Error checking subscription:", err)
        })
    }
  }, [])

  const sendNotificationCountToSW = async () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      try {
        const response = await fetch("/api/notifications/count")
        if (response.ok) {
          const data = await response.json()
          navigator.serviceWorker.controller.postMessage({
            type: "SET_NOTIFICATION_COUNT",
            count: data.count || 0,
          })
        }
      } catch (error) {
        console.error("[v0] Error getting notification count:", error)
      }
    }
  }

  const requestPermission = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission === "granted") {
        await subscribeToPush()
      } else if (permission === "denied") {
        setErrorMessage("Notifications are blocked. Please enable them in your browser settings.")
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("[v0] Error requesting notification permission:", error)
      setErrorMessage(error?.message || "Failed to enable notifications")
      toast({
        title: "Error",
        description: "Failed to enable notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready

      const existingSubscription = await registration.pushManager.getSubscription()
      if (existingSubscription) {
        console.log("[v0] Removing old subscription with mismatched VAPID keys")
        await existingSubscription.unsubscribe()
      }

      // Try to get VAPID public key
      const response = await fetch("/api/push/vapid-public-key")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get VAPID key")
      }

      const { publicKey } = await response.json()

      if (!publicKey) {
        throw new Error("VAPID public key is not configured. Please add VAPID keys to environment variables.")
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      // Send subscription to server
      const subscribeResponse = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      })

      if (!subscribeResponse.ok) {
        throw new Error("Failed to save subscription on server")
      }

      setSubscription(subscription)
      setErrorMessage(null)
      sendNotificationCountToSW()

      toast({
        title: "Notifications Enabled",
        description: "You will now receive push notifications for leave requests and updates",
      })
    } catch (error: any) {
      console.error("[v0] Error subscribing to push:", error)
      const message = error?.message || "Registration failed - push service error"
      setErrorMessage(message)

      toast({
        title: "Registration Failed",
        description: message.includes("VAPID")
          ? "Push notifications require VAPID keys. Please contact your administrator."
          : "Failed to register for push notifications. Please try again.",
        variant: "destructive",
      })
    }
  }

  const unsubscribeFromPush = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      if (subscription) {
        await subscription.unsubscribe()

        // Remove subscription from server
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        })

        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: "CLEAR_BADGE" })
        }

        setSubscription(null)
        toast({
          title: "Notifications Disabled",
          description: "You will no longer receive push notifications",
        })
      }
    } catch (error: any) {
      console.error("[v0] Error unsubscribing from push:", error)
      setErrorMessage(error?.message || "Failed to disable notifications")
      toast({
        title: "Error",
        description: "Failed to disable notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      if (permission === "granted" && !subscription) {
        await subscribeToPush()
      } else if (permission !== "granted") {
        await requestPermission()
      }
    } else {
      await unsubscribeFromPush()
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Not supported in this browser</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Push notifications require a modern browser with service worker support.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>
          Receive real-time notifications with sound for leave requests, approvals, and important updates. Badge count
          shows on app icon when installed on mobile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {subscription ? (
                <Bell className="w-5 h-5 text-green-600" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <Label htmlFor="push-notifications" className="text-base font-medium cursor-pointer">
                  Enable Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Status: {subscription ? "Enabled" : "Disabled"}</p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={!!subscription}
              onCheckedChange={handleToggle}
              disabled={permission === "denied" || isLoading}
            />
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <p className="text-xs font-medium text-red-800">Error: {errorMessage}</p>
                {errorMessage.includes("VAPID") && (
                  <p className="text-xs text-red-700">
                    To enable push notifications, an administrator needs to configure VAPID keys. See
                    SETUP_NOTIFICATIONS.md for instructions.
                  </p>
                )}
              </div>
            </div>
          )}

          {permission === "denied" && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-xs text-amber-800">
                <strong>Notifications are blocked.</strong> Please enable them in your browser settings to receive
                updates.
              </p>
            </div>
          )}

          {subscription && !errorMessage && (
            <div className="text-xs text-muted-foreground space-y-1 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="font-medium text-green-800 mb-2">✓ Push notifications are active</p>
              <p>• Real-time alerts for leave requests</p>
              <p>• Sound notifications for approvals/rejections</p>
              <p>• Badge count on app icon (when installed)</p>
              <p>• Works even when app is closed</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default PushNotificationManager


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, BellOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      setIsSupported(true)
      setPermission(Notification.permission)

      // Check if already subscribed
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((sub) => {
          setSubscription(sub)
          if (sub) {
            sendNotificationCountToSW()
          }
        })
      })
    }
  }, [])

  const sendNotificationCountToSW = async () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      // Get unread count from API
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
    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission === "granted") {
        await subscribeToPush()
        toast({
          title: "Notifications Enabled",
          description: "You will now receive push notifications for leave requests and updates",
        })
      } else {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      toast({
        title: "Error",
        description: "Failed to enable notifications",
        variant: "destructive",
      })
    }
  }

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready

      // Generate VAPID keys on the server or use existing ones
      const response = await fetch("/api/push/vapid-public-key")
      const { publicKey } = await response.json()

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      // Send subscription to server
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      })

      setSubscription(subscription)
      sendNotificationCountToSW()
    } catch (error) {
      console.error("Error subscribing to push:", error)
    }
  }

  const unsubscribeFromPush = async () => {
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
    } catch (error) {
      console.error("Error unsubscribing from push:", error)
      toast({
        title: "Error",
        description: "Failed to disable notifications",
        variant: "destructive",
      })
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Not supported in this browser</CardDescription>
        </CardHeader>
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
            <div className="flex items-center gap-2">
              {subscription ? (
                <Bell className="w-5 h-5 text-green-600" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm font-medium">Status: {subscription ? "Enabled" : "Disabled"}</span>
            </div>
            {permission === "granted" && subscription ? (
              <Button variant="outline" size="sm" onClick={unsubscribeFromPush}>
                Disable
              </Button>
            ) : (
              <Button size="sm" onClick={requestPermission} disabled={permission === "denied"}>
                Enable Notifications
              </Button>
            )}
          </div>
          {permission === "denied" && (
            <p className="text-xs text-muted-foreground">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          )}
          {subscription && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>✓ Push notifications enabled</p>
              <p>✓ Sound alerts enabled</p>
              <p>✓ Badge count on app icon (when installed)</p>
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

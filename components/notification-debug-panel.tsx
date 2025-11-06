"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStoredUser } from "@/lib/auth"

export function NotificationDebugPanel() {
  const [status, setStatus] = useState<string>("Not tested")
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [vapidKey, setVapidKey] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)
    console.log("[v0] Current user loaded from localStorage:", storedUser)
  }, [])

  const checkStatus = async () => {
    // Check notification permission
    const perm = Notification.permission
    setPermission(perm)

    // Check service worker
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
    }

    // Check VAPID key
    try {
      const res = await fetch("/api/push/vapid-public-key")
      const data = await res.json()
      setVapidKey(data.publicKey || null)
    } catch (err) {
      setVapidKey(null)
    }

    setStatus("Status checked")
  }

  const testSound = () => {
    console.log("[v0] Testing notification sound manually")
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "PLAY_NOTIFICATION_SOUND",
      })
      setStatus("Sound play message sent!")
      console.log("[v0] Sound play message sent to service worker")
    } else {
      setStatus("No service worker controller found")
      console.error("[v0] No service worker controller")
    }
  }

  const testServiceWorkerMessage = () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      console.log("[v0] Sending test message to service worker")
      navigator.serviceWorker.controller.postMessage({
        type: "TEST_NOTIFICATION",
      })
      setStatus("Test message sent to service worker")
    } else {
      setStatus("No service worker controller found")
    }
  }

  const requestPermission = async () => {
    const perm = await Notification.requestPermission()
    setPermission(perm)
    setStatus(`Permission: ${perm}`)
  }

  const testPushNotification = async () => {
    if (!user) {
      setStatus("Failed: User not loaded")
      return
    }

    try {
      console.log("[v0] Creating test notification with user:", user)

      const payload: any = {
        title: "Test Notification",
        message: "This is a test notification with sound. If you can see this, the notification system is working!",
        creator: {
          id: user.id,
          name: user.name,
          role: user.role,
          institutionName: user.institutionName,
        },
      }

      if (user.role === "SuperAdmin") {
        payload.audience = "admins"
      } else if (user.role === "Admin") {
        payload.audience = "institution"
        payload.institutionName = user.institutionName
        payload.target = "both"
      } else {
        setStatus("Failed: Only SuperAdmin and Admin can create notifications")
        return
      }

      console.log("[v0] Sending test notification payload:", payload)

      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      console.log("[v0] Test notification response:", data)

      if (res.ok && data.ok) {
        setStatus(`Test notification created successfully! ID: ${data.id}`)
      } else {
        setStatus(`Failed: ${data.error || "Unknown error"}`)
      }
    } catch (err: any) {
      console.error("[v0] Failed to create test notification:", err)
      setStatus(`Failed to create notification: ${err.message}`)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notification Debug Panel</CardTitle>
        <CardDescription>Test and debug notification system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Permission:</span>
            <Badge variant={permission === "granted" ? "default" : "destructive"}>{permission}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Push Subscription:</span>
            <Badge variant={subscription ? "default" : "secondary"}>{subscription ? "Active" : "None"}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">VAPID Key:</span>
            <Badge variant={vapidKey ? "default" : "destructive"}>{vapidKey ? "Configured" : "Missing"}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">User:</span>
            <Badge variant={user ? "default" : "secondary"}>
              {user ? `${user.name} (${user.role})` : "Loading..."}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">Status: {status}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={checkStatus} variant="outline" size="sm">
            Check Status
          </Button>
          <Button onClick={requestPermission} variant="outline" size="sm">
            Request Permission
          </Button>
          <Button onClick={testSound} variant="outline" size="sm">
            Test Sound
          </Button>
          <Button onClick={testServiceWorkerMessage} variant="outline" size="sm">
            Test SW Message
          </Button>
          <Button onClick={testPushNotification} variant="default" size="sm" className="col-span-2" disabled={!user}>
            Send Test Notification
          </Button>
        </div>

        {vapidKey && (
          <div className="text-xs text-muted-foreground break-all">
            <strong>VAPID Key:</strong> {vapidKey.substring(0, 20)}...
          </div>
        )}
      </CardContent>
    </Card>
  )
}

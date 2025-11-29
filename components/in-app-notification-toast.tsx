
"use client"

import { useEffect, useState, useRef } from "react"
import { X, Bell } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Notification {
  id: string
  title: string
  body: string
  url?: string
  timestamp: number
}

export function InAppNotificationToast() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const lastCheckRef = useRef<number>(Date.now())
  const errorCountRef = useRef<number>(0)
  const lastErrorTimeRef = useRef<number>(0)
  const backoffDelayRef = useRef<number>(2000)

  useEffect(() => {
    let pollTimeout: NodeJS.Timeout

    const scheduleNextCheck = (delay: number) => {
      pollTimeout = setTimeout(() => {
        checkForNewNotifications()
      }, delay)
    }

    // Check immediately on mount
    checkForNewNotifications()

    return () => {
      clearTimeout(pollTimeout)
    }
  }, [])

  const checkForNewNotifications = async () => {
    try {
      const response = await fetch("/api/notifications/unread")

      if (!response.ok) {
        if (response.status === 401) {
          scheduleNextCheck(backoffDelayRef.current)
          return
        }

        const now = Date.now()
        errorCountRef.current++

        if (now - lastErrorTimeRef.current > 30000) {
          // Log once every 30 seconds max
          console.error(
            `[v0] Notification toast: ${errorCountRef.current} error(s) occurred, latest status: ${response.status}`,
          )
          errorCountRef.current = 0
          lastErrorTimeRef.current = now
        }

        backoffDelayRef.current = Math.min(backoffDelayRef.current * 1.5, 30000)
        scheduleNextCheck(backoffDelayRef.current)
        return
      }

      errorCountRef.current = 0
      backoffDelayRef.current = 2000

      const data = await response.json()
      if (data.notifications && data.notifications.length > 0) {
        const newNotifications = data.notifications.filter((notif: any) => {
          const notifTime = new Date(notif.createdAt || notif.sentAt).getTime()
          return notifTime > lastCheckRef.current
        })

        if (newNotifications.length > 0) {
          newNotifications.forEach((notif: any) => {
            showNotification({
              id: notif.id || notif._id,
              title: notif.title || notif.subject || "New Notification",
              body: notif.message || notif.body,
              url: notif.url || "/notifications",
              timestamp: Date.now(),
            })
          })
          lastCheckRef.current = Date.now()
        }
      }

      scheduleNextCheck(backoffDelayRef.current)
    } catch (error) {
      const now = Date.now()
      errorCountRef.current++

      if (now - lastErrorTimeRef.current > 30000) {
        console.error(`[v0] Notification toast: ${errorCountRef.current} network error(s) occurred`)
        errorCountRef.current = 0
        lastErrorTimeRef.current = now
      }

      backoffDelayRef.current = Math.min(backoffDelayRef.current * 1.5, 30000)
      scheduleNextCheck(backoffDelayRef.current)
    }
  }

  const scheduleNextCheck = (delay: number) => {
    setTimeout(() => {
      checkForNewNotifications()
    }, delay)
  }

  const showNotification = (notification: Notification) => {
    // Add to notifications list
    setNotifications((prev) => [notification, ...prev].slice(0, 3)) // Keep max 3

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id)
    }, 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleClick = (notification: Notification) => {
    if (notification.url) {
      window.location.href = notification.url
    }
    removeNotification(notification.id)
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-[200] space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className="p-4 shadow-lg border-l-4 border-l-blue-500 bg-background cursor-pointer hover:shadow-xl transition-shadow animate-in slide-in-from-right duration-300"
          onClick={() => handleClick(notification)}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Bell className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{notification.body}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeNotification(notification.id)
              }}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  )
}

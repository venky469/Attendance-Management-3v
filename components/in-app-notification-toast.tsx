"use client"

import { useEffect, useState } from "react"
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
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    const audio = new Audio("/sounds/notification.mp3")
    audio.volume = 0.7
    setAudioElement(audio)

    // Poll for new notifications every 30 seconds
    const pollInterval = setInterval(checkForNewNotifications, 30000)

    // Check immediately on mount
    checkForNewNotifications()

    return () => {
      clearInterval(pollInterval)
    }
  }, [])

  const checkForNewNotifications = async () => {
    try {
      const response = await fetch("/api/notifications/unread")
      if (response.ok) {
        const data = await response.json()
        if (data.notifications && data.notifications.length > 0) {
          // Show new notifications
          data.notifications.forEach((notif: any) => {
            showNotification({
              id: notif.id,
              title: notif.title || "New Notification",
              body: notif.message || notif.body,
              url: notif.url,
              timestamp: Date.now(),
            })
          })
        }
      }
    } catch (error) {
      console.error("[v0] Error checking notifications:", error)
    }
  }

  const showNotification = (notification: Notification) => {
    // Play sound
    if (audioElement) {
      audioElement.currentTime = 0
      audioElement.play().catch((err) => console.log("[v0] Could not play sound:", err))
    }

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

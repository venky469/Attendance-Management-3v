// "use client"

// import { useEffect, useRef } from "react"

// export function NotificationSoundPlayer() {
//   const audioRef = useRef<HTMLAudioElement | null>(null)

//   useEffect(() => {
//     // Create audio element for notification sound
//     audioRef.current = new Audio("/sounds/notification.mp3")
//     audioRef.current.volume = 0.9

//     // Listen for messages from service worker
//     const handleMessage = (event: MessageEvent) => {
//       if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
//         playNotificationSound()
//       }
//     }

//     navigator.serviceWorker?.addEventListener("message", handleMessage)

//     return () => {
//       navigator.serviceWorker?.removeEventListener("message", handleMessage)
//     }
//   }, [])

//   const playNotificationSound = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = 0
//       audioRef.current.play().catch((err) => {
//         console.log("[v0] Could not play notification sound:", err)
//       })
//     }
//   }

//   return null // This component doesn't render anything
// }



"use client"

import { useEffect, useRef } from "react"
import { realtimeClient } from "@/lib/realtime-client"

export function NotificationSoundPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element for notification sound
    audioRef.current = new Audio("/sounds/noti.mp3")
    audioRef.current.volume = 0.7

    const handleNotification = (event: any) => {
      console.log("[v0] New notification received:", event)
      playNotificationSound()
    }

    // Listen for messages from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
        playNotificationSound()
      }
    }

    realtimeClient.on("notification_created", handleNotification)

    navigator.serviceWorker?.addEventListener("message", handleMessage)

    return () => {
      realtimeClient.off("notification_created", handleNotification)
      navigator.serviceWorker?.removeEventListener("message", handleMessage)
    }
  }, [])

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((err) => {
        console.log("[v0] Could not play notification sound:", err)
      })
    }
  }

  return null // This component doesn't render anything
}

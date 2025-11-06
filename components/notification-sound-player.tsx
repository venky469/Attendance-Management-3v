"use client"

import { useEffect, useRef } from "react"

export function NotificationSoundPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    console.log("[v0] NotificationSoundPlayer mounted")

    audioRef.current = new Audio("/sounds/notification.mp3")
    audioRef.current.volume = 0.5
    audioRef.current.preload = "auto"

    // Load the audio file immediately
    audioRef.current.load()
    console.log("[v0] Audio element created and preloaded")

    const handleMessage = (event: MessageEvent) => {
      console.log("[v0] Service worker message received:", event.data)
      if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
        console.log("[v0] Playing notification sound for:", event.data.notification)
        playNotificationSound()
      }
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", handleMessage)
      console.log("[v0] Service worker message listener registered")
    } else {
      console.warn("[v0] Service worker not supported")
    }

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", handleMessage)
        console.log("[v0] Service worker message listener removed")
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const playNotificationSound = () => {
    if (!audioRef.current) {
      console.error("[v0] Audio element not initialized")
      return
    }

    try {
      // Reset to start and play
      audioRef.current.currentTime = 0
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("[v0] Notification sound played successfully")
          })
          .catch((error) => {
            console.error("[v0] Could not play notification sound:", error)
            console.error("[v0] Error details:", {
              name: error.name,
              message: error.message,
              code: error.code,
            })
          })
      }
    } catch (error) {
      console.error("[v0] Exception while playing sound:", error)
    }
  }

  return null
}

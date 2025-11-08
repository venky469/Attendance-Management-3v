
"use client"

import { useEffect, useRef, useState } from "react"

export function NotificationSoundPlayer() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)

  useEffect(() => {
    console.log("[v0] 🔊 NotificationSoundPlayer mounted")

    // Initialize Web Audio API for generating tones
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioContext()
      console.log("[v0] ✅ Web Audio API initialized")
      setIsAudioReady(true)
    } catch (error) {
      console.error("[v0] ❌ Web Audio API not supported:", error)
    }

    const enableAudio = () => {
      console.log("[v0] 👆 User interaction detected, enabling audio")
      setUserInteracted(true)

      // Resume audio context if suspended
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume().then(() => {
          console.log("[v0] ✅ Audio context resumed")
        })
      }
    }

    // Listen for any user interaction to enable audio
    document.addEventListener("click", enableAudio, { once: true })
    document.addEventListener("keydown", enableAudio, { once: true })
    document.addEventListener("touchstart", enableAudio, { once: true })

    const handleMessage = (event: MessageEvent) => {
      console.log("[v0] 📨 Service worker message received:", event.data)
      if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
        const notificationType = event.data.notificationType || "general"
        console.log("[v0] 🔔 Playing notification sound for type:", notificationType)
        playNotificationSound(notificationType)
      }
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", handleMessage)
      console.log("[v0] ✅ Service worker message listener registered")
    } else {
      console.warn("[v0] ⚠️ Service worker not supported")
    }

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", handleMessage)
      }
      document.removeEventListener("click", enableAudio)
      document.removeEventListener("keydown", enableAudio)
      document.removeEventListener("touchstart", enableAudio)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const playNotificationSound = (type = "general") => {
    console.log("[v0] 🎵 playNotificationSound called for type:", type)
    console.log("[v0] 🎵 Audio ready:", isAudioReady)
    console.log("[v0] 🎵 User interacted:", userInteracted)

    if (!audioContextRef.current) {
      console.error("[v0] ❌ Audio context not initialized")
      return
    }

    try {
      const ctx = audioContextRef.current

      // Resume context if suspended
      if (ctx.state === "suspended") {
        ctx.resume()
      }

      // Create oscillator for tone generation
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      let frequency1 = 600 // Default
      let frequency2 = 800
      let duration = 0.15

      if (type === "leave_request") {
        // Higher pitch double beep for leave requests
        frequency1 = 800
        frequency2 = 1000
        duration = 0.12
        console.log("[v0] 🔔 Playing LEAVE REQUEST tone (high pitch)")
      } else if (type === "leave_approval" || type === "leave_approved") {
        // Lower pitch single beep for approvals
        frequency1 = 400
        frequency2 = 500
        duration = 0.2
        console.log("[v0] ✅ Playing LEAVE APPROVAL tone (low pitch)")
      } else if (type === "leave_rejected") {
        // Medium pitch for rejections
        frequency1 = 300
        frequency2 = 250
        duration = 0.25
        console.log("[v0] ❌ Playing LEAVE REJECTION tone (descending)")
      } else {
        console.log("[v0] 🔔 Playing GENERAL notification tone")
      }

      // Set initial frequency
      oscillator.frequency.setValueAtTime(frequency1, ctx.currentTime)

      // Fade in
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)

      // Change frequency for second part (creates a pleasant two-tone effect)
      oscillator.frequency.setValueAtTime(frequency2, ctx.currentTime + duration / 2)

      // Fade out
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime + duration - 0.05)
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

      // Play the tone
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)

      console.log("[v0] ✅ Notification tone played successfully! 🔊")

      // Clean up
      oscillator.onended = () => {
        oscillator.disconnect()
        gainNode.disconnect()
      }
    } catch (error) {
      console.error("[v0] ❌ Exception while playing sound:", error)

      // Retry on next user interaction if autoplay blocked
      const retryPlay = () => {
        console.log("[v0] 🔄 Retrying sound after user interaction")
        playNotificationSound(type)
        document.removeEventListener("click", retryPlay)
      }
      document.addEventListener("click", retryPlay, { once: true })
    }
  }

  return null
}

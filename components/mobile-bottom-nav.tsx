
"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, ClipboardCheck, ScanFace, User, Bell, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef, useMemo } from "react"
import { getStoredUser } from "@/lib/auth"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const prevCountRef = useRef<number>(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [storageInitialized, setStorageInitialized] = useState(false)

  const storageKey = user?.id ? `notif_prefs_${user.id}` : null
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [cleared, setCleared] = useState<Set<string>>(new Set())
  const [seen, setSeen] = useState<Set<string>>(new Set())

  useEffect(() => {
    audioRef.current = new Audio("/notification-sound.mp3")
    audioRef.current.volume = 0.5
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === "PLAY_NOTIFICATION_SOUND") {
          const soundUrl = event.data.soundUrl || "/notification-sound.mp3"
          console.log("[v0] Playing push notification sound:", soundUrl)

          const audio = new Audio(soundUrl)
          audio.volume = 0.7
          audio.play().catch((err) => {
            console.error("[v0] Failed to play push notification sound:", err)
          })
        }
      }

      navigator.serviceWorker.addEventListener("message", handleMessage)
      return () => {
        navigator.serviceWorker.removeEventListener("message", handleMessage)
      }
    }
  }, [])

  useEffect(() => {
    if (!storageKey) return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as { saved?: string[]; cleared?: string[]; seen?: string[] }
        setSaved(new Set(parsed.saved || []))
        setCleared(new Set(parsed.cleared || []))
        setSeen(new Set(parsed.seen || []))
      }
      setStorageInitialized(true)
    } catch {
      setStorageInitialized(true)
    }
  }, [storageKey])

  const notifQuery = (() => {
    if (!user) return null
    const p = new URLSearchParams()
    if (user.role) p.set("role", user.role)
    if (user.institutionName) p.set("institution", user.institutionName)
    return `/api/notifications?${p.toString()}`
  })()

  const { data: notifData } = useSWR<{ items: Array<{ id: string; createdAt: string }> }>(notifQuery, fetcher, {
    refreshInterval: 30000,
    revalidateOnMount: true,
    dedupingInterval: 5000,
  })

  const unseenCount = useMemo(() => {
    if (!storageInitialized) return 0

    const items = notifData?.items || []
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000

    const newUnseen = items.filter((n) => {
      const isNotProcessed = !cleared.has(n.id) && !saved.has(n.id) && !seen.has(n.id)
      const isRecent = n.createdAt && new Date(n.createdAt).getTime() > oneDayAgo
      return isNotProcessed && isRecent
    }).length

    return newUnseen
  }, [notifData?.items, saved, cleared, seen, storageInitialized])

  useEffect(() => {
    if (prevCountRef.current === 0) {
      prevCountRef.current = unseenCount
      return
    }

    if (unseenCount > prevCountRef.current && unseenCount > 0) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch((err) => {
          console.error("[v0] Failed to play notification sound:", err)
        })
      }
    }

    prevCountRef.current = unseenCount
  }, [unseenCount])

  const handleNotificationClick = (e: React.MouseEvent) => {
    if (!storageKey || !notifData?.items) return

    const items = notifData.items || []
    const newSeenIds = items.map((n) => n.id)

    setSeen((prev) => {
      const next = new Set(prev)
      newSeenIds.forEach((id) => next.add(id))
      return next
    })

    try {
      const raw = localStorage.getItem(storageKey)
      const parsed = raw ? JSON.parse(raw) : {}
      const updated = {
        ...parsed,
        seen: Array.from(new Set([...(parsed.seen || []), ...newSeenIds])),
      }
      localStorage.setItem(storageKey, JSON.stringify(updated))
    } catch (err) {
      console.error("[v0] Failed to update localStorage on notification click:", err)
    }
  }

  const handleMenuClick = () => {
    window.dispatchEvent(new CustomEvent("openMobileMenu"))
  }

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)

    const handleUserLogin = () => {
      const updatedUser = getStoredUser()
      setUser(updatedUser)
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        const updatedUser = getStoredUser()
        setUser(updatedUser)
      }
    }

    window.addEventListener("userLogin", handleUserLogin)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("userLogin", handleUserLogin)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const isStudent = user?.role?.toLowerCase() === "student"

  const navItems = isStudent
    ? [
        {
          href: "/",
          label: "Dashboard",
          icon: Home,
        },
        {
          href: "/student-attendance",
          label: "Attendance",
          icon: ClipboardCheck,
        },
        {
          href: "/notifications",
          label: "Notifications",
          icon: Bell,
          hasNotifications: unseenCount > 0,
          notificationCount: unseenCount,
          onClick: handleNotificationClick,
        },
        {
          href: "/profile",
          label: "Profile",
          icon: User,
          isProfile: true,
        },
        {
          href: "#",
          label: "Menu",
          icon: Menu,
          isMenu: true,
          onClick: handleMenuClick,
        },
      ]
    : [
        {
          href: "/",
          label: "Dashboard",
          icon: Home,
        },
        {
          href: "/attendance",
          label: "Reports",
          icon: ClipboardCheck,
        },
        {
          href: "/faceid",
          label: "Live",
          icon: ScanFace,
        },
        {
          href: "/profile",
          label: "Profile",
          icon: User,
          isProfile: true,
        },
        {
          href: "#",
          label: "Menu",
          icon: Menu,
          isMenu: true,
          onClick: handleMenuClick,
        },
      ]

  if (pathname === "/login" || !user) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.isProfile || item.isMenu ? false : pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if ("isMenu" in item && item.isMenu) {
                  e.preventDefault()
                }
                if ("onClick" in item && item.onClick) {
                  item.onClick(e)
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 relative group",
                "active:scale-95",
                isActive ? "text-teal-600" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className={cn("relative transition-all duration-200", isActive && "scale-110")}>
                <Icon className={cn("h-6 w-6 transition-all duration-200", isActive && "stroke-[2.5]")} />
                {"notificationCount" in item && item.notificationCount > 0 && (
                  <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-background shadow-lg px-1">
                    <span className="text-[10px] font-bold text-white leading-none">
                      {item.notificationCount > 99 ? "99+" : item.notificationCount}
                    </span>
                  </div>
                )}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-600 animate-pulse" />
                )}
              </div>
              <span className={cn("text-[10px] font-medium transition-all duration-200", isActive && "font-semibold")}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

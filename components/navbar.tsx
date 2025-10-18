
"use client"

import type React from "react"
import { useMemo } from "react"
import useSWR from "swr"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon, LogOut, User, Lock, Mail, Phone, MapPin, Calendar, Badge, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from "react"
import { getStoredUser, logout } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const allLinks = [
  { href: "/", label: "Dashboard", roles: ["SuperAdmin", "Admin", "Manager", "Staff", "Teacher", "Student"] },
  {
    href: "/attendance",
    label: "Attendance",
    roles: ["SuperAdmin", "Admin", "Manager", "Staff", "Teacher", "Student"],
  },
  { href: "/student-attendance", label: "My Attendance", roles: [] },
  { href: "/faceid", label: "Face ID", roles: ["SuperAdmin", "Admin", "Manager", "Staff", "Teacher"] },
  { href: "/staff", label: "Staff", roles: ["SuperAdmin", "Admin", "Manager"] },
  { href: "/students", label: "Students", roles: ["SuperAdmin", "Admin", "Manager", "Teacher"] },
  {
    href: "/notifications",
    label: "Notifications",
    roles: ["SuperAdmin", "Admin", "Manager", "Staff", "Teacher", "Student"],
  },
  {
    href: "/leave-requests",
    label: "My Leave Requests",
    roles: ["SuperAdmin", "Admin", "Manager", "Staff", "Teacher", "Student"],
  },
  { href: "/leave-approval", label: "Leave Approval", roles: ["SuperAdmin", "Admin", "Manager", "Teacher"] },
  { href: "/reports", label: "Reports", roles: ["SuperAdmin", "Admin", "Manager"] },
  
  { href: "/settings", label: "Settings", roles: ["Admin" ,"SuperAdmin"] },
  { href: "/super-admin/institutions", label: "Institutions", roles: ["SuperAdmin"] },
  { href: "/super-admin", label: "Super Admin", roles: ["SuperAdmin"] },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [institutionBlocked, setInstitutionBlocked] = useState(false)
  const [showServicesMobile, setShowServicesMobile] = useState(false)

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    setScrolled(scrollY > 10)
    setShowScrollTop(scrollY > 300)

    const sections = document.querySelectorAll("[data-section]")
    let currentSection = ""

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = section.getAttribute("data-section") || ""
      }
    })

    setActiveSection(currentSection)
  }, [])



  useEffect(() => {
  // Disable right-click
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    // alert('Right-click is disabled for security reasons.');
  };

  // Disable inspect shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      e.key === 'F12'
    ) {
      e.preventDefault();
      // alert('Developer tools are disabled for this application.');
    }
  };

  // Detect if DevTools is open and close window
  const detectDevTools = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if (widthThreshold || heightThreshold) {
      // alert('Developer tools detected. The window will be closed for security reasons.');
      window.close();

      // As a fallback for browsers that block window.close()
      document.body.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;font-size:20px;color:red;">⚠️ Developer tools detected. Please ***  Close Inspect Page  *** and reopen the page.</div>';
    }
  };

  // Check every second
  const interval = setInterval(detectDevTools, 1000);
  

  // Add listeners
  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('keydown', handleKeyDown);

  // Cleanup
  return () => {
    document.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('keydown', handleKeyDown);
    clearInterval(interval);
  };
}, []);





  useEffect(() => {
    let ticking = false

    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", throttledHandleScroll, { passive: true })
    return () => window.removeEventListener("scroll", throttledHandleScroll)
  }, [handleScroll])

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)

    if (!storedUser && pathname !== "/login") {
      router.push("/login")
    }
  }, [pathname, router])

  useEffect(() => {
    async function checkInstitution() {
      try {
        if (user?.role !== "SuperAdmin" && user?.institutionName) {
          const res = await fetch(`/api/institutions/${encodeURIComponent(user.institutionName)}`)
          if (res.ok) {
            const data = await res.json()
            setInstitutionBlocked(Boolean(data?.blocked))
          } else {
            setInstitutionBlocked(false)
          }
        } else {
          setInstitutionBlocked(false)
        }
      } catch {
        setInstitutionBlocked(false)
      }
    }
    checkInstitution()
  }, [user?.role, user?.institutionName])

  const links = user ? allLinks.filter((link) => link.roles.includes(user.role)) : []

  const MAX_PRIMARY_DESKTOP = 6
  const MAX_PRIMARY_MOBILE = 6

  const primaryLinksDesktop = links.slice(0, MAX_PRIMARY_DESKTOP)
  const remainderLinksDesktop = links.slice(MAX_PRIMARY_DESKTOP)

  const primaryLinksMobile = links.slice(0, MAX_PRIMARY_MOBILE)
  const remainderLinksMobile = links.slice(MAX_PRIMARY_MOBILE)

  const operationsLabels = ["Attendance", "My Attendance", "Face ID", "My Leave Requests", "Leave Approval"]
  const peopleLabels = ["Staff", "Students"]
  const insightsLabels = ["Reports", "Notifications"]
  const adminLabels = ["Settings", "Institutions", "Super Admin"]

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  const handleNavLinkClick = (href: string, e?: React.MouseEvent) => {
    if (href.startsWith("#") && pathname === "/") {
      e?.preventDefault()
      const sectionId = href.substring(1)
      scrollToSection(sectionId)
      setIsOpen(false)
      return
    }

    setIsOpen(false)
  }

  const handleLogout = () => {
    logout()
  }

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long")
      return
    }

    setPasswordLoading(true)
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Password updated successfully!")
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setShowPasswordUpdate(false)
      } else {
        alert(result.error || "Failed to update password")
      }
    } catch (error) {
      console.error("Password update error:", error)
      alert("Failed to update password")
    } finally {
      setPasswordLoading(false)
    }
  }

  const fetcher = (url: string) => fetch(url).then((r) => r.json())

  const storageKey = user?.id ? `notif_prefs_${user.id}` : null
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [cleared, setCleared] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!storageKey) return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as { saved?: string[]; cleared?: string[] }
        setSaved(new Set(parsed.saved || []))
        setCleared(new Set(parsed.cleared || []))
      }
    } catch {
      // ignore
    }
  }, [storageKey])

  const notifQuery = (() => {
    if (!user) return null
    const p = new URLSearchParams()
    if (user.role) p.set("role", user.role)
    if (user.institutionName) p.set("institution", user.institutionName)
    return `/api/notifications?${p.toString()}`
  })()

  const { data: notifData } = useSWR<{ items: Array<{ id: string }> }>(notifQuery, fetcher)
  const unseenCount = useMemo(() => {
    const items = notifData?.items || []
    return items.filter((n) => !cleared.has(n.id) && !saved.has(n.id)).length
  }, [notifData?.items, saved, cleared])

  if (pathname === "/login") {
    return null
  }

  if (!user) {
    return null
  }

  const brandName = user?.institutionName?.trim() ? user.institutionName : "Genamplify"
  const brandInitial = brandName.charAt(0).toUpperCase()

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          scrolled
            ? "border-gray-200/30 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-lg"
            : "border-gray-200/20 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 shadow-sm",
        )}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-300",
              scrolled ? "h-12 sm:h-14" : "h-14 sm:h-16",
            )}
          >
            <Link
              href="/"
              className="flex items-center space-x-2 min-w-0 flex-shrink-0 hover:scale-105 transition-transform duration-200"
              onClick={() => scrollToTop()}
            >
              <div
                className={cn(
                  "rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg transition-all duration-300",
                  scrolled ? "h-6 w-6 sm:h-7 sm:w-7" : "h-7 w-7 sm:h-8 sm:w-8",
                )}
              >
                <span
                  className={cn(
                    "text-white font-bold transition-all duration-300",
                    scrolled ? "text-xs" : "text-xs sm:text-sm",
                  )}
                >
                  {brandInitial}
                </span>
              </div>
              <span
                className={cn(
                  "font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent truncate transition-all duration-300",
                  scrolled ? "text-base sm:text-lg" : "text-lg sm:text-xl",
                )}
              >
                {brandName}
              </span>
            </Link>

            <ul className="hidden lg:flex items-center space-x-1">
              {primaryLinksDesktop.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={(e) => handleNavLinkClick(l.href, e)}
                    className={cn(
                      "relative px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95",
                      pathname === l.href || (l.href.startsWith("#") && activeSection === l.href.substring(1))
                        ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/25"
                        : "text-gray-700 hover:text-teal-600 hover:bg-gray-50/80",
                    )}
                  >
                    <span className="inline-flex items-center gap-2">
                      {l.label}
                      {l.label === "Notifications" && unseenCount > 0 && (
                        <span className="ml-1 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] leading-none h-4 min-w-4 px-1">
                          {unseenCount}
                        </span>
                      )}
                    </span>
                    {(pathname === l.href || (l.href.startsWith("#") && activeSection === l.href.substring(1))) && (
                      <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white animate-pulse" />
                    )}
                  </Link>
                </li>
              ))}
              <li key="services-menu" className="ml-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105",
                        "text-gray-700 hover:text-teal-600 hover:bg-gray-50/80",
                      )}
                    >
                      Services
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    {remainderLinksDesktop.filter((l) => operationsLabels.includes(l.label)).length > 0 && (
                      <>
                        <DropdownMenuLabel>Operations</DropdownMenuLabel>
                        {remainderLinksDesktop
                          .filter((l) => operationsLabels.includes(l.label))
                          .map((l) => (
                            <DropdownMenuItem key={l.href} asChild>
                              <Link href={l.href} onClick={() => setIsOpen(false)}>
                                {l.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        <DropdownMenuSeparator />
                      </>
                    )}

                    {remainderLinksDesktop.filter((l) => peopleLabels.includes(l.label)).length > 0 && (
                      <>
                        <DropdownMenuLabel>People</DropdownMenuLabel>
                        {remainderLinksDesktop
                          .filter((l) => peopleLabels.includes(l.label))
                          .map((l) => (
                            <DropdownMenuItem key={l.href} asChild>
                              <Link href={l.href} onClick={() => setIsOpen(false)}>
                                {l.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        <DropdownMenuSeparator />
                      </>
                    )}

                    {remainderLinksDesktop.filter((l) => insightsLabels.includes(l.label)).length > 0 && (
                      <>
                        <DropdownMenuLabel>Insights</DropdownMenuLabel>
                        {remainderLinksDesktop
                          .filter((l) => insightsLabels.includes(l.label))
                          .map((l) => (
                            <DropdownMenuItem key={l.href} asChild>
                              <Link href={l.href} onClick={() => setIsOpen(false)}>
                                <span className="inline-flex items-center gap-2">
                                  {l.label}
                                  {l.label === "Notifications" && unseenCount > 0 && (
                                    <span className="ml-1 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] leading-none h-4 min-w-4 px-1">
                                      {unseenCount}
                                    </span>
                                  )}
                                </span>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                      </>
                    )}

                    {remainderLinksDesktop.filter((l) => adminLabels.includes(l.label)).length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Administration</DropdownMenuLabel>
                        {remainderLinksDesktop
                          .filter((l) => adminLabels.includes(l.label))
                          .map((l) => (
                            <DropdownMenuItem key={l.href} asChild>
                              <Link href={l.href} onClick={() => setIsOpen(false)}>
                                {l.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>

            <div className="hidden lg:flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProfileModal(true)}
                    className="relative h-9 w-9 rounded-full p-0 hover:scale-105 transition-transform duration-200"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-transparent hover:ring-teal-200 transition-all duration-200">
                      <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 mr-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">{user.role}</p>
                      {user.institutionName && (
                        <p
                          className={cn(
                            "text-xs leading-none",
                            institutionBlocked ? "text-red-600 font-medium" : "text-muted-foreground",
                          )}
                        >
                          {institutionBlocked ? "Blocked - " : ""}
                          {user.institutionName}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowProfileModal(true)} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="lg:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfileModal(true)}
                className="h-8 w-8 rounded-full p-0 hover:scale-105 transition-transform duration-200"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-9 w-9 rounded-xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <MenuIcon className="h-5 w-5 text-gray-700 transition-transform duration-200" />
                    <span className="sr-only">Open navigation menu</span>
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-full sm:w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 p-0"
                >
                  <SheetHeader className="border-b border-gray-100/80 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">{brandInitial}</span>
                        </div>
                        <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent font-bold text-lg">
                          Menu
                        </span>
                      </SheetTitle>
                    </div>
                  </SheetHeader>

                  <div className="flex flex-col h-full p-4 sm:p-6">
                    <div className="space-y-2 mb-6">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Links</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {primaryLinksMobile.map((l, index) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            onClick={(e) => handleNavLinkClick(l.href, e)}
                            className={cn(
                              "group relative flex items-center justify-center px-3 py-3 rounded-xl text-left text-sm font-medium transition-all duration-300",
                              "hover:scale-[1.02] active:scale-[0.98] border border-gray-200/50 bg-white/80 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50",
                              "animate-in slide-in-from-right-5 fade-in-0",
                            )}
                            style={{ animationDelay: `${index * 40}ms` }}
                          >
                            <span className="relative z-10">{l.label}</span>
                            {l.label === "Notifications" && unseenCount > 0 && (
                              <span className="absolute right-2 top-2 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] leading-none h-4 min-w-4 px-1">
                                {unseenCount}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Services</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowServicesMobile((v) => !v)}
                          className="h-8 px-2 text-xs"
                        >
                          {showServicesMobile ? "Hide" : "Show"}
                        </Button>
                      </div>
                      {showServicesMobile && (
                        <div className="grid grid-cols-2 gap-2">
                          {remainderLinksMobile.map((l, index) => (
                            <Link
                              key={l.href}
                              href={l.href}
                              onClick={(e) => handleNavLinkClick(l.href, e)}
                              className={cn(
                                "group relative flex items-center justify-center px-3 py-3 rounded-xl text-left text-sm font-medium transition-all duration-300",
                                "hover:scale-[1.02] active:scale-[0.98] border border-gray-200/50 bg-white/80 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50",
                                "animate-in slide-in-from-right-5 fade-in-0",
                              )}
                              style={{ animationDelay: `${index * 40}ms` }}
                            >
                              <span className="relative z-10">{l.label}</span>
                              {l.label === "Notifications" && unseenCount > 0 && (
                                <span className="absolute right-2 top-2 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] leading-none h-4 min-w-4 px-1">
                                  {unseenCount}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200/50">
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start px-4 py-3.5 h-auto text-red-600 hover:text-red-700 hover:bg-red-50 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.95]"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="font-medium">Log out</span>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {institutionBlocked && user?.institutionName && (
        <div className="w-full bg-red-600 text-white text-center py-2 px-4 text-sm">
          {'Your college "'}
          <span className="font-semibold">{user.institutionName}</span>
          {'" is currently blocked. Please contact the Super Admin.'}
        </div>
      )}

      <Button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95",
          showScrollTop ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none",
        )}
        size="icon"
      >
        <ChevronUp className="h-5 w-5" />
        <span className="sr-only">Scroll to top</span>
      </Button>

      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.photoUrl || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
            </DialogTitle>
            <DialogDescription>Complete profile information and account settings</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Badge className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{user.role === "Student" ? "Roll Number" : "Employee Code"}</p>
                    <p className="text-sm text-gray-600">{user.rollNumber || user.employeeCode || "N/A"}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user.department && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-gray-600">{user.department}</p>
                    </div>
                  </div>
                )}
                {user.joiningDate && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Joining Date</p>
                      <p className="text-sm text-gray-600">{new Date(user.joiningDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                {user.institutionName && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Institution</p>
                      <p className="text-sm text-gray-600">{user.institutionName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                  <Button variant="outline" onClick={() => setShowPasswordUpdate(true)} className="ml-4">
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPasswordUpdate} onOpenChange={setShowPasswordUpdate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </DialogTitle>
            <DialogDescription>Enter your current password and choose a new one</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordUpdate(false)
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordUpdate}
              disabled={
                passwordLoading ||
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword
              }
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

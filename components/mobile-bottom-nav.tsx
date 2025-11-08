// // // // "use client"

// // // // import Link from "next/link"
// // // // import { usePathname } from "next/navigation"
// // // // import { Home, ClipboardCheck, ScanFace, User } from "lucide-react"
// // // // import { cn } from "@/lib/utils"
// // // // import { useState, useEffect } from "react"
// // // // import { getStoredUser } from "@/lib/auth"

// // // // export function MobileBottomNav() {
// // // //   const pathname = usePathname()
// // // //   const [user, setUser] = useState<any>(null)

// // // //   useEffect(() => {
// // // //     const storedUser = getStoredUser()
// // // //     setUser(storedUser)
// // // //   }, [])

// // // //   // Don't show on login page or if no user
// // // //   if (pathname === "/login" || !user) {
// // // //     return null
// // // //   }

// // // //   const navItems = [
// // // //     {
// // // //       href: "/",
// // // //       label: "Dashboard",
// // // //       icon: Home,
// // // //     },
// // // //     {
// // // //       href: "/attendance",
// // // //       label: "Reports",
// // // //       icon: ClipboardCheck,
// // // //     },
// // // //     {
// // // //       href: "/faceid",
// // // //       label: "Live",
// // // //       icon: ScanFace,
// // // //       roles: ["SuperAdmin", "Admin", "Manager", "Staff", "Teacher"], // Not available for students
// // // //     },
// // // //     {
// // // //       href: "/profile",
// // // //       label: "Profile",
// // // //       icon: User,
// // // //       isProfile: true,
// // // //     },
// // // //   ]

// // // //   // Filter items based on user role
// // // //   const filteredItems = navItems.filter((item) => {
// // // //     if (!item.roles) return true
// // // //     return item.roles.includes(user?.role)
// // // //   })

// // // //   return (
// // // //     <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
// // // //       <div className="flex items-center justify-around h-16 px-2">
// // // //         {filteredItems.map((item) => {
// // // //           const Icon = item.icon
// // // //           const isActive = item.isProfile ? false : pathname === item.href

// // // //           return (
// // // //             <Link
// // // //               key={item.href}
// // // //               href={item.href}
// // // //               className={cn(
// // // //                 "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200",
// // // //                 "active:scale-95",
// // // //                 isActive ? "text-teal-600" : "text-muted-foreground hover:text-foreground",
// // // //               )}
// // // //             >
// // // //               <div className={cn("relative transition-all duration-200", isActive && "scale-110")}>
// // // //                 <Icon className={cn("h-6 w-6 transition-all duration-200", isActive && "stroke-[2.5]")} />
// // // //                 {isActive && (
// // // //                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-600 animate-pulse" />
// // // //                 )}
// // // //               </div>
// // // //               <span className={cn("text-[10px] font-medium transition-all duration-200", isActive && "font-semibold")}>
// // // //                 {item.label}
// // // //               </span>
// // // //             </Link>
// // // //           )
// // // //         })}
// // // //       </div>
// // // //     </nav>
// // // //   )
// // // // }



// // // "use client"

// // // import type React from "react"

// // // import Link from "next/link"
// // // import { usePathname, useRouter } from "next/navigation"
// // // import { Home, ClipboardCheck, ScanFace, User } from "lucide-react"
// // // import { cn } from "@/lib/utils"
// // // import { useState, useEffect, useRef } from "react"
// // // import { getStoredUser } from "@/lib/auth"

// // // export function MobileBottomNav() {
// // //   const pathname = usePathname()
// // //   const router = useRouter()
// // //   const [user, setUser] = useState<any>(null)
// // //   const touchStartX = useRef<number>(0)
// // //   const touchEndX = useRef<number>(0)

// // //   useEffect(() => {
// // //     const storedUser = getStoredUser()
// // //     setUser(storedUser)
// // //   }, [])

// // //   // Don't show on login page or if no user
// // //   if (pathname === "/login" || !user) {
// // //     return null
// // //   }

// // //   const navItems = [
// // //     {
// // //       href: "/",
// // //       label: "Dashboard",
// // //       icon: Home,
// // //     },
// // //     {
// // //       href: "/attendance",
// // //       label: "Reports",
// // //       icon: ClipboardCheck,
// // //     },
// // //     {
// // //       href: "/faceid",
// // //       label: "Live",
// // //       icon: ScanFace,
// // //       roles: ["SuperAdmin", "Admin", "Manager", "Staff", "Teacher"], // Not available for students
// // //     },
// // //     {
// // //       href: "/profile",
// // //       label: "Profile",
// // //       icon: User,
// // //       isProfile: true,
// // //     },
// // //   ]

// // //   // Filter items based on user role
// // //   const filteredItems = navItems.filter((item) => {
// // //     if (!item.roles) return true
// // //     return item.roles.includes(user?.role)
// // //   })

// // //   const handleTouchStart = (e: React.TouchEvent) => {
// // //     touchStartX.current = e.targetTouches[0].clientX
// // //   }

// // //   const handleTouchMove = (e: React.TouchEvent) => {
// // //     touchEndX.current = e.targetTouches[0].clientX
// // //   }

// // //   const handleTouchEnd = () => {
// // //     const swipeDistance = touchStartX.current - touchEndX.current
// // //     const minSwipeDistance = 50 // Minimum swipe distance to trigger navigation

// // //     if (Math.abs(swipeDistance) > minSwipeDistance) {
// // //       // Find current page index
// // //       const currentIndex = filteredItems.findIndex((item) => item.href === pathname)

// // //       if (swipeDistance > 0) {
// // //         // Swiped left (move to next page/right icon)
// // //         if (currentIndex < filteredItems.length - 1) {
// // //           router.push(filteredItems[currentIndex + 1].href)
// // //         }
// // //       } else {
// // //         // Swiped right (move to previous page/left icon)
// // //         if (currentIndex > 0) {
// // //           router.push(filteredItems[currentIndex - 1].href)
// // //         }
// // //       }
// // //     }

// // //     // Reset values
// // //     touchStartX.current = 0
// // //     touchEndX.current = 0
// // //   }

// // //   return (
// // //     <nav
// // //       className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
// // //       onTouchStart={handleTouchStart}
// // //       onTouchMove={handleTouchMove}
// // //       onTouchEnd={handleTouchEnd}
// // //     >
// // //       <div className="flex items-center justify-around h-16 px-2">
// // //         {filteredItems.map((item) => {
// // //           const Icon = item.icon
// // //           const isActive = item.isProfile ? false : pathname === item.href

// // //           return (
// // //             <Link
// // //               key={item.href}
// // //               href={item.href}
// // //               className={cn(
// // //                 "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200",
// // //                 "active:scale-95",
// // //                 isActive ? "text-teal-600" : "text-muted-foreground hover:text-foreground",
// // //               )}
// // //             >
// // //               <div className={cn("relative transition-all duration-200", isActive && "scale-110")}>
// // //                 <Icon className={cn("h-6 w-6 transition-all duration-200", isActive && "stroke-[2.5]")} />
// // //                 {isActive && (
// // //                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-600 animate-pulse" />
// // //                 )}
// // //               </div>
// // //               <span className={cn("text-[10px] font-medium transition-all duration-200", isActive && "font-semibold")}>
// // //                 {item.label}
// // //               </span>
// // //             </Link>
// // //           )
// // //         })}
// // //       </div>
// // //     </nav>
// // //   )
// // // }



// // "use client"

// // import type React from "react"

// // import Link from "next/link"
// // import { usePathname, useRouter } from "next/navigation"
// // import { Home, ClipboardCheck, ScanFace, User, Bell } from "lucide-react"
// // import { cn } from "@/lib/utils"
// // import { useState, useEffect, useRef } from "react"
// // import { getStoredUser } from "@/lib/auth"
// // import useSWR from "swr"

// // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // export function MobileBottomNav() {
// //   const pathname = usePathname()
// //   const router = useRouter()
// //   const [user, setUser] = useState<any>(null)
// //   const touchStartX = useRef<number>(0)
// //   const touchEndX = useRef<number>(0)

// //   const { data: notificationCount } = useSWR(
// //     user && user.role?.toLowerCase() === "student" ? "/api/notifications/count" : null,
// //     fetcher,
// //     { refreshInterval: 30000 },
// //   )

// //   useEffect(() => {
// //     const storedUser = getStoredUser()
// //     setUser(storedUser)
// //   }, [])

// //   // Don't show on login page or if no user
// //   if (pathname === "/login" || !user) {
// //     return null
// //   }

// //   const isStudent = user?.role?.toLowerCase() === "student"

// //   const navItems = isStudent
// //     ? [
// //         {
// //           href: "/",
// //           label: "Dashboard",
// //           icon: Home,
// //         },
// //         {
// //           href: "/student-attendance",
// //           label: "Attendance",
// //           icon: ClipboardCheck,
// //         },
// //         {
// //           href: "/notifications",
// //           label: "Notifications",
// //           icon: Bell,
// //           badge: notificationCount?.unreadCount || 0,
// //         },
// //         {
// //           href: "/profile",
// //           label: "Profile",
// //           icon: User,
// //           isProfile: true,
// //         },
// //       ]
// //     : [
// //         {
// //           href: "/",
// //           label: "Dashboard",
// //           icon: Home,
// //         },
// //         {
// //           href: "/attendance",
// //           label: "Reports",
// //           icon: ClipboardCheck,
// //         },
// //         {
// //           href: "/faceid",
// //           label: "Live",
// //           icon: ScanFace,
// //         },
// //         {
// //           href: "/profile",
// //           label: "Profile",
// //           icon: User,
// //           isProfile: true,
// //         },
// //       ]

// //   const handleTouchStart = (e: React.TouchEvent) => {
// //     touchStartX.current = e.targetTouches[0].clientX
// //   }

// //   const handleTouchMove = (e: React.TouchEvent) => {
// //     touchEndX.current = e.targetTouches[0].clientX
// //   }

// //   const handleTouchEnd = () => {
// //     const swipeDistance = touchStartX.current - touchEndX.current
// //     const minSwipeDistance = 50 // Minimum swipe distance to trigger navigation

// //     if (Math.abs(swipeDistance) > minSwipeDistance) {
// //       // Find current page index
// //       const currentIndex = navItems.findIndex((item) => item.href === pathname)

// //       if (swipeDistance > 0) {
// //         // Swiped left (move to next page/right icon)
// //         if (currentIndex < navItems.length - 1) {
// //           router.push(navItems[currentIndex + 1].href)
// //         }
// //       } else {
// //         // Swiped right (move to previous page/left icon)
// //         if (currentIndex > 0) {
// //           router.push(navItems[currentIndex - 1].href)
// //         }
// //       }
// //     }

// //     // Reset values
// //     touchStartX.current = 0
// //     touchEndX.current = 0
// //   }

// //   return (
// //     <nav
// //       className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
// //       onTouchStart={handleTouchStart}
// //       onTouchMove={handleTouchMove}
// //       onTouchEnd={handleTouchEnd}
// //     >
// //       <div className="flex items-center justify-around h-16 px-2">
// //         {navItems.map((item) => {
// //           const Icon = item.icon
// //           const isActive = item.isProfile ? false : pathname === item.href

// //           return (
// //             <Link
// //               key={item.href}
// //               href={item.href}
// //               className={cn(
// //                 "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 relative",
// //                 "active:scale-95",
// //                 isActive ? "text-teal-600" : "text-muted-foreground hover:text-foreground",
// //               )}
// //             >
// //               <div className={cn("relative transition-all duration-200", isActive && "scale-110")}>
// //                 <Icon className={cn("h-6 w-6 transition-all duration-200", isActive && "stroke-[2.5]")} />
// //                 {item.badge && item.badge > 0 && (
// //                   <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
// //                     {item.badge > 99 ? "99+" : item.badge}
// //                   </div>
// //                 )}
// //                 {isActive && (
// //                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-600 animate-pulse" />
// //                 )}
// //               </div>
// //               <span className={cn("text-[10px] font-medium transition-all duration-200", isActive && "font-semibold")}>
// //                 {item.label}
// //               </span>
// //             </Link>
// //           )
// //         })}
// //       </div>
// //     </nav>
// //   )
// // }


// "use client"

// import type React from "react"

// import Link from "next/link"
// import { usePathname, useRouter } from "next/navigation"
// import { Home, ClipboardCheck, ScanFace, User, Bell } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { useState, useEffect, useRef } from "react"
// import { getStoredUser } from "@/lib/auth"
// import useSWR from "swr"

// const fetcher = (url: string) => fetch(url).then((r) => r.json())

// export function MobileBottomNav() {
//   const pathname = usePathname()
//   const router = useRouter()
//   const [user, setUser] = useState<any>(null)
//   const touchStartX = useRef<number>(0)
//   const touchEndX = useRef<number>(0)

//   const { data: notificationCount } = useSWR(
//     user && user.role?.toLowerCase() === "student" ? "/api/notifications/count" : null,
//     fetcher,
//     { refreshInterval: 30000 },
//   )

//   useEffect(() => {
//     const storedUser = getStoredUser()
//     setUser(storedUser)
//   }, [])

//   // Don't show on login page or if no user
//   if (pathname === "/login" || !user) {
//     return null
//   }

//   const isStudent = user?.role?.toLowerCase() === "student"

//   const navItems = isStudent
//     ? [
//         {
//           href: "/",
//           label: "Dashboard",
//           icon: Home,
//         },
//         {
//           href: "/student-attendance",
//           label: "Attendance",
//           icon: ClipboardCheck,
//         },
//         {
//           href: "/notifications",
//           label: "Notifications",
//           icon: Bell,
//           badge: notificationCount?.unreadCount || 0,
//         },
//         {
//           href: "/profile",
//           label: "Profile",
//           icon: User,
//           isProfile: true,
//         },
//       ]
//     : [
//         {
//           href: "/",
//           label: "Dashboard",
//           icon: Home,
//         },
//         {
//           href: "/attendance",
//           label: "Reports",
//           icon: ClipboardCheck,
//         },
//         {
//           href: "/faceid",
//           label: "Live",
//           icon: ScanFace,
//         },
//         {
//           href: "/profile",
//           label: "Profile",
//           icon: User,
//           isProfile: true,
//         },
//       ]

//   const handleTouchStart = (e: React.TouchEvent) => {
//     touchStartX.current = e.targetTouches[0].clientX
//   }

//   const handleTouchMove = (e: React.TouchEvent) => {
//     touchEndX.current = e.targetTouches[0].clientX
//   }

//   const handleTouchEnd = () => {
//     const swipeDistance = touchStartX.current - touchEndX.current
//     const minSwipeDistance = 50 // Minimum swipe distance to trigger navigation

//     if (Math.abs(swipeDistance) > minSwipeDistance) {
//       // Find current page index
//       const currentIndex = navItems.findIndex((item) => item.href === pathname)

//       if (swipeDistance > 0) {
//         // Swiped left (move to next page/right icon)
//         if (currentIndex < navItems.length - 1) {
//           router.push(navItems[currentIndex + 1].href)
//         }
//       } else {
//         // Swiped right (move to previous page/left icon)
//         if (currentIndex > 0) {
//           router.push(navItems[currentIndex - 1].href)
//         }
//       }
//     }

//     // Reset values
//     touchStartX.current = 0
//     touchEndX.current = 0
//   }

//   return (
//     <nav
//       className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//     >
//       <div className="flex items-center justify-around h-16 px-2">
//         {navItems.map((item) => {
//           const Icon = item.icon
//           const isActive = item.isProfile ? false : pathname === item.href

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={cn(
//                 "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 relative",
//                 "active:scale-95",
//                 isActive ? "text-teal-600" : "text-muted-foreground hover:text-foreground",
//               )}
//             >
//               <div className={cn("relative transition-all duration-200", isActive && "scale-110")}>
//                 <Icon className={cn("h-6 w-6 transition-all duration-200", isActive && "stroke-[2.5]")} />
//                 {item.badge !== undefined && item.badge > 0 && (
//                   <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1 shadow-md">
//                     {item.badge > 99 ? "99+" : item.badge}
//                   </div>
//                 )}
//                 {isActive && (
//                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-600 animate-pulse" />
//                 )}
//               </div>
//               <span className={cn("text-[10px] font-medium transition-all duration-200", isActive && "font-semibold")}>
//                 {item.label}
//               </span>
//             </Link>
//           )
//         })}
//       </div>
//     </nav>
//   )
// }



"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, ClipboardCheck, ScanFace, User, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import { getStoredUser } from "@/lib/auth"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const { data: notificationCount } = useSWR(
    user && user.role?.toLowerCase() === "student" ? "/api/notifications/count" : null,
    fetcher,
    { refreshInterval: 30000 },
  )

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)
  }, [])

  // Don't show on login page or if no user
  if (pathname === "/login" || !user) {
    return null
  }

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
          badge: notificationCount?.count || 0,
        },
        {
          href: "/profile",
          label: "Profile",
          icon: User,
          isProfile: true,
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
      ]

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50 // Minimum swipe distance to trigger navigation

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      // Find current page index
      const currentIndex = navItems.findIndex((item) => item.href === pathname)

      if (swipeDistance > 0) {
        // Swiped left (move to next page/right icon)
        if (currentIndex < navItems.length - 1) {
          router.push(navItems[currentIndex + 1].href)
        }
      } else {
        // Swiped right (move to previous page/left icon)
        if (currentIndex > 0) {
          router.push(navItems[currentIndex - 1].href)
        }
      }
    }

    // Reset values
    touchStartX.current = 0
    touchEndX.current = 0
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.isProfile ? false : pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 relative",
                "active:scale-95",
                isActive ? "text-teal-600" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className={cn("relative transition-all duration-200", isActive && "scale-110")}>
                <Icon className={cn("h-6 w-6 transition-all duration-200", isActive && "stroke-[2.5]")} />
                {item.badge !== undefined && item.badge > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1 shadow-md">
                    {item.badge > 99 ? "99+" : item.badge}
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

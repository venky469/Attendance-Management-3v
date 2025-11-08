// "use client"

// import { useEffect, useState } from "react"
// import { Bell } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu"
// import { useRouter } from "next/navigation"
// import { formatDistanceToNow } from "date-fns"
// import { NOTIFICATION_UPDATE_EVENT } from "./real-time-notification-poller"

// interface Notification {
//   id: string
//   title: string
//   message: string
//   type: string
//   url: string
//   sentAt: string
//   read: boolean
//   readAt?: string
// }

// export function NotificationBell() {
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [unreadCount, setUnreadCount] = useState(0)
//   const [isOpen, setIsOpen] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     // Fetch initial notifications
//     fetchNotifications()

//     // Poll for new notifications every 15 seconds
//     const interval = setInterval(fetchNotifications, 15000)

//     // Listen for custom events from RealTimeNotificationPoller
//     const handleNotificationUpdate = () => {
//       fetchNotifications()
//     }
//     window.addEventListener(NOTIFICATION_UPDATE_EVENT, handleNotificationUpdate)

//     return () => {
//       clearInterval(interval)
//       window.removeEventListener(NOTIFICATION_UPDATE_EVENT, handleNotificationUpdate)
//     }
//   }, [])

//   const fetchNotifications = async () => {
//     try {
//       const response = await fetch("/api/notifications/list?limit=10")
//       if (response.ok) {
//         const data = await response.json()
//         setNotifications(data.notifications || [])
//         setUnreadCount(data.unreadCount || 0)
//       }
//     } catch (error) {
//       console.error("[v0] Error fetching notifications:", error)
//     }
//   }

//   const markAllAsRead = async () => {
//     try {
//       const response = await fetch("/api/notifications/mark-read", {
//         method: "PUT",
//       })
//       if (response.ok) {
//         setUnreadCount(0)
//         setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
//       }
//     } catch (error) {
//       console.error("[v0] Error marking all as read:", error)
//     }
//   }

//   const markAsRead = async (notificationId: string) => {
//     try {
//       await fetch("/api/notifications/mark-read", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ notificationId }),
//       })
//     } catch (error) {
//       console.error("[v0] Error marking notification as read:", error)
//     }
//   }

//   const handleNotificationClick = async (notification: Notification) => {
//     // Mark as read
//     if (!notification.read) {
//       await markAsRead(notification.id)
//       setUnreadCount((prev) => Math.max(0, prev - 1))
//       setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))
//     }

//     // Navigate to URL
//     setIsOpen(false)
//     router.push(notification.url)
//   }

//   const handleBellClick = () => {
//     if (!isOpen && unreadCount > 0) {
//       // Mark all as read when opening the dropdown
//       markAllAsRead()
//     }
//   }

//   return (
//     <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" className="relative" onClick={handleBellClick}>
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold">
//               {unreadCount > 9 ? "9+" : unreadCount}
//             </span>
//           )}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-80 max-h-[480px] overflow-y-auto">
//         <div className="flex items-center justify-between px-4 py-2 border-b">
//           <h3 className="font-semibold">Notifications</h3>
//           {unreadCount > 0 && (
//             <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-7 text-xs">
//               Mark all as read
//             </Button>
//           )}
//         </div>
//         {notifications.length === 0 ? (
//           <div className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications yet</div>
//         ) : (
//           <>
//             {notifications.map((notification) => (
//               <DropdownMenuItem
//                 key={notification.id}
//                 className={`px-4 py-3 cursor-pointer flex flex-col items-start gap-1 ${
//                   !notification.read ? "bg-blue-50/50" : ""
//                 }`}
//                 onClick={() => handleNotificationClick(notification)}
//               >
//                 <div className="flex items-start justify-between w-full gap-2">
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium line-clamp-1">{notification.title}</p>
//                     <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notification.message}</p>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {formatDistanceToNow(new Date(notification.sentAt), { addSuffix: true })}
//                     </p>
//                   </div>
//                   {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
//                 </div>
//               </DropdownMenuItem>
//             ))}
//             <DropdownMenuSeparator />
//             <DropdownMenuItem
//               className="px-4 py-2 cursor-pointer text-center justify-center text-sm text-blue-600 font-medium"
//               onClick={() => {
//                 setIsOpen(false)
//                 router.push("/notifications")
//               }}
//             >
//               View all notifications
//             </DropdownMenuItem>
//           </>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

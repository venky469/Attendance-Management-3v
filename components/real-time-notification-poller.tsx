
// // // "use client"

// // // import { useEffect, useState, useRef } from "react"
// // // import { X, Bell } from "lucide-react"
// // // import { Card } from "@/components/ui/card"

// // // interface Notification {
// // //   id: string
// // //   title: string
// // //   body: string
// // //   url?: string
// // //   timestamp: number
// // //   type?: string
// // // }

// // // export function RealTimeNotificationPoller() {
// // //   const [notifications, setNotifications] = useState<Notification[]>([])
// // //   const [pendingCount, setPendingCount] = useState(0)
// // //   const audioContextRef = useRef<AudioContext | null>(null)
// // //   const lastCheckRef = useRef<number>(Date.now())
// // //   const lastPendingCountRef = useRef<number>(0)

// // //   useEffect(() => {
// // //     try {
// // //       const AudioContext = window.AudioContext || (window as any).webkitAudioContext
// // //       audioContextRef.current = new AudioContext()
// // //       console.log("[v0] Real-time poller audio initialized")
// // //     } catch (error) {
// // //       console.error("[v0] Real-time poller audio error:", error)
// // //     }

// // //     // Enable audio on first user interaction
// // //     const enableAudio = () => {
// // //       if (audioContextRef.current && audioContextRef.current.state === "suspended") {
// // //         audioContextRef.current.resume().then(() => {
// // //           console.log("[v0] Real-time poller audio enabled")
// // //         })
// // //       }
// // //     }
// // //     document.addEventListener("click", enableAudio, { once: true })
// // //     document.addEventListener("keydown", enableAudio, { once: true })

// // //     // Poll every 15 seconds for real-time updates
// // //     const pollInterval = setInterval(checkForUpdates, 15000)

// // //     // Check immediately on mount
// // //     checkForUpdates()

// // //     return () => {
// // //       clearInterval(pollInterval)
// // //       document.removeEventListener("click", enableAudio)
// // //       document.removeEventListener("keydown", enableAudio)
// // //       if (audioContextRef.current) {
// // //         audioContextRef.current.close()
// // //       }
// // //     }
// // //   }, [])

// // //   const checkForUpdates = async () => {
// // //     try {
// // //       const response = await fetch("/api/leave-requests/pending-notifications")
// // //       if (response.ok) {
// // //         const data = await response.json()

// // //         // Update pending count
// // //         setPendingCount(data.pendingCount || 0)

// // //         // Check for new pending requests (increased count)
// // //         if (data.pendingCount > lastPendingCountRef.current) {
// // //           const newRequestsCount = data.pendingCount - lastPendingCountRef.current
// // //           console.log(`[v0] ${newRequestsCount} new leave request(s) detected`)

// // //           showNotification({
// // //             id: `pending-${Date.now()}`,
// // //             title: "New Leave Request",
// // //             body: `You have ${newRequestsCount} new leave request${newRequestsCount > 1 ? "s" : ""} to review`,
// // //             url: "/leave-approval",
// // //             timestamp: Date.now(),
// // //             type: "leave_request",
// // //           })

// // //           // Send push notification
// // //           sendPushNotification(
// // //             "New Leave Request",
// // //             `You have ${newRequestsCount} new leave request${newRequestsCount > 1 ? "s" : ""} to review`,
// // //             "/leave-approval",
// // //             "leave_request",
// // //           )
// // //         }

// // //         lastPendingCountRef.current = data.pendingCount

// // //         // Check for new notifications
// // //         if (data.notifications && data.notifications.length > 0) {
// // //           const newNotifications = data.notifications.filter((notif: any) => {
// // //             const notifTime = new Date(notif.sentAt).getTime()
// // //             return notifTime > lastCheckRef.current
// // //           })

// // //           if (newNotifications.length > 0) {
// // //             console.log(`[v0] ${newNotifications.length} new notification(s) detected`)
// // //             newNotifications.forEach((notif: any) => {
// // //               let notifType = "general"
// // //               if (notif.type === "leave_approved" || notif.title.includes("Approved")) {
// // //                 notifType = "leave_approval"
// // //               } else if (notif.type === "leave_rejected" || notif.title.includes("Rejected")) {
// // //                 notifType = "leave_rejected"
// // //               }

// // //               showNotification({
// // //                 id: notif.id,
// // //                 title: notif.title,
// // //                 body: notif.body,
// // //                 url: notif.url,
// // //                 timestamp: Date.now(),
// // //                 type: notifType,
// // //               })

// // //               // Send push notification
// // //               sendPushNotification(notif.title, notif.body, notif.url, notifType)
// // //             })
// // //           }
// // //         }

// // //         lastCheckRef.current = Date.now()

// // //         // Update badge count
// // //         updateBadgeCount(data.pendingCount + data.notificationCount)
// // //       }
// // //     } catch (error) {
// // //       console.error("[v0] Error checking for updates:", error)
// // //     }
// // //   }

// // //   const sendPushNotification = async (title: string, body: string, url: string, notificationType = "general") => {
// // //     try {
// // //       // Send to service worker for push notification
// // //       if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
// // //         navigator.serviceWorker.controller.postMessage({
// // //           type: "SHOW_NOTIFICATION",
// // //           title,
// // //           body,
// // //           url,
// // //           notificationType,
// // //         })
// // //       }

// // //       // Also send via API for subscribed devices
// // //       await fetch("/api/push/send", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({
// // //           title,
// // //           body,
// // //           data: { url, notificationType },
// // //         }),
// // //       })
// // //     } catch (error) {
// // //       console.error("[v0] Error sending push notification:", error)
// // //     }
// // //   }

// // //   const updateBadgeCount = (count: number) => {
// // //     if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
// // //       navigator.serviceWorker.controller.postMessage({
// // //         type: "SET_NOTIFICATION_COUNT",
// // //         count,
// // //       })
// // //     }
// // //   }

// // //   const playTone = (type = "general") => {
// // //     if (!audioContextRef.current) return

// // //     try {
// // //       const ctx = audioContextRef.current
// // //       if (ctx.state === "suspended") {
// // //         ctx.resume()
// // //       }

// // //       const oscillator = ctx.createOscillator()
// // //       const gainNode = ctx.createGain()

// // //       oscillator.connect(gainNode)
// // //       gainNode.connect(ctx.destination)

// // //       let frequency1 = 600
// // //       let frequency2 = 800
// // //       let duration = 0.15

// // //       if (type === "leave_request") {
// // //         frequency1 = 800
// // //         frequency2 = 1000
// // //         duration = 0.12
// // //       } else if (type === "leave_approval") {
// // //         frequency1 = 400
// // //         frequency2 = 500
// // //         duration = 0.2
// // //       } else if (type === "leave_rejected") {
// // //         frequency1 = 300
// // //         frequency2 = 250
// // //         duration = 0.25
// // //       }

// // //       oscillator.frequency.setValueAtTime(frequency1, ctx.currentTime)
// // //       gainNode.gain.setValueAtTime(0, ctx.currentTime)
// // //       gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)
// // //       oscillator.frequency.setValueAtTime(frequency2, ctx.currentTime + duration / 2)
// // //       gainNode.gain.setValueAtTime(0.3, ctx.currentTime + duration - 0.05)
// // //       gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

// // //       oscillator.start(ctx.currentTime)
// // //       oscillator.stop(ctx.currentTime + duration)

// // //       oscillator.onended = () => {
// // //         oscillator.disconnect()
// // //         gainNode.disconnect()
// // //       }
// // //     } catch (error) {
// // //       console.error("[v0] Error playing tone:", error)
// // //     }
// // //   }

// // //   const showNotification = (notification: Notification) => {
// // //     console.log("[v0] Showing notification:", notification.title, "Type:", notification.type)

// // //     playTone(notification.type || "general")

// // //     // Add to notifications list
// // //     setNotifications((prev) => [notification, ...prev].slice(0, 3)) // Keep max 3

// // //     // Auto-remove after 5 seconds
// // //     setTimeout(() => {
// // //       removeNotification(notification.id)
// // //     }, 5000)
// // //   }

// // //   const removeNotification = (id: string) => {
// // //     setNotifications((prev) => prev.filter((n) => n.id !== id))
// // //   }

// // //   const handleClick = (notification: Notification) => {
// // //     if (notification.url) {
// // //       window.location.href = notification.url
// // //     }
// // //     removeNotification(notification.id)
// // //   }

// // //   if (notifications.length === 0) return null

// // //   return (
// // //     <div className="fixed top-20 right-4 z-[200] space-y-2 max-w-sm">
// // //       {notifications.map((notification) => (
// // //         <Card
// // //           key={notification.id}
// // //           className="p-4 shadow-lg border-l-4 border-l-blue-500 bg-background cursor-pointer hover:shadow-xl transition-shadow animate-in slide-in-from-right duration-300"
// // //           onClick={() => handleClick(notification)}
// // //         >
// // //           <div className="flex items-start gap-3">
// // //             <div className="flex-shrink-0 mt-1">
// // //               <Bell className="w-5 h-5 text-blue-500" />
// // //             </div>
// // //             <div className="flex-1 min-w-0">
// // //               <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
// // //               <p className="text-sm text-muted-foreground line-clamp-2">{notification.body}</p>
// // //             </div>
// // //             <button
// // //               onClick={(e) => {
// // //                 e.stopPropagation()
// // //                 removeNotification(notification.id)
// // //               }}
// // //               className="flex-shrink-0 text-muted-foreground hover:text-foreground"
// // //             >
// // //               <X className="w-4 h-4" />
// // //             </button>
// // //           </div>
// // //         </Card>
// // //       ))}
// // //     </div>
// // //   )
// // // }




// // "use client"

// // import { useEffect, useState, useRef } from "react"
// // import { X, Bell } from "lucide-react"
// // import { Card } from "@/components/ui/card"

// // interface Notification {
// //   id: string
// //   title: string
// //   body: string
// //   url?: string
// //   timestamp: number
// //   type?: string
// // }

// // export function RealTimeNotificationPoller() {
// //   const [notifications, setNotifications] = useState<Notification[]>([])
// //   const [pendingCount, setPendingCount] = useState(0)
// //   const audioContextRef = useRef<AudioContext | null>(null)
// //   const lastCheckRef = useRef<number>(Date.now())
// //   const lastPendingCountRef = useRef<number>(0)

// //   useEffect(() => {
// //     try {
// //       const AudioContext = window.AudioContext || (window as any).webkitAudioContext
// //       audioContextRef.current = new AudioContext()
// //       console.log("[v0] Real-time poller audio initialized")
// //     } catch (error) {
// //       console.error("[v0] Real-time poller audio error:", error)
// //     }

// //     // Enable audio on first user interaction
// //     const enableAudio = () => {
// //       if (audioContextRef.current && audioContextRef.current.state === "suspended") {
// //         audioContextRef.current.resume().then(() => {
// //           console.log("[v0] Real-time poller audio enabled")
// //         })
// //       }
// //     }
// //     document.addEventListener("click", enableAudio, { once: true })
// //     document.addEventListener("keydown", enableAudio, { once: true })

// //     // Poll every 15 seconds for real-time updates
// //     const pollInterval = setInterval(checkForUpdates, 15000)

// //     // Check immediately on mount
// //     checkForUpdates()

// //     return () => {
// //       clearInterval(pollInterval)
// //       document.removeEventListener("click", enableAudio)
// //       document.removeEventListener("keydown", enableAudio)
// //       if (audioContextRef.current) {
// //         audioContextRef.current.close()
// //       }
// //     }
// //   }, [])

// //   const checkForUpdates = async () => {
// //     try {
// //       const response = await fetch("/api/leave-requests/pending-notifications")

// //       if (!response.ok) {
// //         if (response.status === 401) {
// //           console.log("[v0] Real-time poller: User not authenticated, skipping check")
// //           return
// //         }
// //         console.error("[v0] Real-time poller: HTTP error", response.status)
// //         return
// //       }

// //       const data = await response.json()

// //       // Update pending count
// //       setPendingCount(data.pendingCount || 0)

// //       // Check for new pending requests (increased count)
// //       if (data.pendingCount > lastPendingCountRef.current) {
// //         const newRequestsCount = data.pendingCount - lastPendingCountRef.current
// //         console.log(`[v0] ${newRequestsCount} new leave request(s) detected`)

// //         showNotification({
// //           id: `pending-${Date.now()}`,
// //           title: "New Leave Request",
// //           body: `You have ${newRequestsCount} new leave request${newRequestsCount > 1 ? "s" : ""} to review`,
// //           url: "/leave-approval",
// //           timestamp: Date.now(),
// //           type: "leave_request",
// //         })

// //         // Send push notification
// //         sendPushNotification(
// //           "New Leave Request",
// //           `You have ${newRequestsCount} new leave request${newRequestsCount > 1 ? "s" : ""} to review`,
// //           "/leave-approval",
// //           "leave_request",
// //         )
// //       }

// //       lastPendingCountRef.current = data.pendingCount

// //       // Check for new notifications
// //       if (data.notifications && data.notifications.length > 0) {
// //         const newNotifications = data.notifications.filter((notif: any) => {
// //           const notifTime = new Date(notif.sentAt).getTime()
// //           return notifTime > lastCheckRef.current
// //         })

// //         if (newNotifications.length > 0) {
// //           console.log(`[v0] ${newNotifications.length} new notification(s) detected`)
// //           newNotifications.forEach((notif: any) => {
// //             let notifType = "general"
// //             if (notif.type === "leave_approved" || notif.title.includes("Approved")) {
// //               notifType = "leave_approval"
// //             } else if (notif.type === "leave_rejected" || notif.title.includes("Rejected")) {
// //               notifType = "leave_rejected"
// //             }

// //             showNotification({
// //               id: notif.id,
// //               title: notif.title,
// //               body: notif.body,
// //               url: notif.url,
// //               timestamp: Date.now(),
// //               type: notifType,
// //             })

// //             // Send push notification
// //             sendPushNotification(notif.title, notif.body, notif.url, notifType)
// //           })
// //         }
// //       }

// //       lastCheckRef.current = Date.now()

// //       // Update badge count
// //       updateBadgeCount(data.pendingCount + data.notificationCount)
// //     } catch (error) {
// //       console.error("[v0] Error checking for updates:", error)
// //     }
// //   }

// //   const sendPushNotification = async (title: string, body: string, url: string, notificationType = "general") => {
// //     try {
// //       // Send to service worker for push notification
// //       if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
// //         navigator.serviceWorker.controller.postMessage({
// //           type: "SHOW_NOTIFICATION",
// //           title,
// //           body,
// //           url,
// //           notificationType,
// //         })
// //       }

// //       // Also send via API for subscribed devices
// //       await fetch("/api/push/send", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           title,
// //           body,
// //           data: { url, notificationType },
// //         }),
// //       })
// //     } catch (error) {
// //       console.error("[v0] Error sending push notification:", error)
// //     }
// //   }

// //   const updateBadgeCount = (count: number) => {
// //     if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
// //       navigator.serviceWorker.controller.postMessage({
// //         type: "SET_NOTIFICATION_COUNT",
// //         count,
// //       })
// //     }
// //   }

// //   const playTone = (type = "general") => {
// //     if (!audioContextRef.current) return

// //     try {
// //       const ctx = audioContextRef.current
// //       if (ctx.state === "suspended") {
// //         ctx.resume()
// //       }

// //       const oscillator = ctx.createOscillator()
// //       const gainNode = ctx.createGain()

// //       oscillator.connect(gainNode)
// //       gainNode.connect(ctx.destination)

// //       let frequency1 = 600
// //       let frequency2 = 800
// //       let duration = 0.15

// //       if (type === "leave_request") {
// //         frequency1 = 800
// //         frequency2 = 1000
// //         duration = 0.12
// //       } else if (type === "leave_approval") {
// //         frequency1 = 400
// //         frequency2 = 500
// //         duration = 0.2
// //       } else if (type === "leave_rejected") {
// //         frequency1 = 300
// //         frequency2 = 250
// //         duration = 0.25
// //       }

// //       oscillator.frequency.setValueAtTime(frequency1, ctx.currentTime)
// //       gainNode.gain.setValueAtTime(0, ctx.currentTime)
// //       gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)
// //       oscillator.frequency.setValueAtTime(frequency2, ctx.currentTime + duration / 2)
// //       gainNode.gain.setValueAtTime(0.3, ctx.currentTime + duration - 0.05)
// //       gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

// //       oscillator.start(ctx.currentTime)
// //       oscillator.stop(ctx.currentTime + duration)

// //       oscillator.onended = () => {
// //         oscillator.disconnect()
// //         gainNode.disconnect()
// //       }
// //     } catch (error) {
// //       console.error("[v0] Error playing tone:", error)
// //     }
// //   }

// //   const showNotification = (notification: Notification) => {
// //     console.log("[v0] Showing notification:", notification.title, "Type:", notification.type)

// //     playTone(notification.type || "general")

// //     // Add to notifications list
// //     setNotifications((prev) => [notification, ...prev].slice(0, 3)) // Keep max 3

// //     // Auto-remove after 5 seconds
// //     setTimeout(() => {
// //       removeNotification(notification.id)
// //     }, 5000)
// //   }

// //   const removeNotification = (id: string) => {
// //     setNotifications((prev) => prev.filter((n) => n.id !== id))
// //   }

// //   const handleClick = (notification: Notification) => {
// //     if (notification.url) {
// //       window.location.href = notification.url
// //     }
// //     removeNotification(notification.id)
// //   }

// //   if (notifications.length === 0) return null

// //   return (
// //     <div className="fixed top-20 right-4 z-[200] space-y-2 max-w-sm">
// //       {notifications.map((notification) => (
// //         <Card
// //           key={notification.id}
// //           className="p-4 shadow-lg border-l-4 border-l-blue-500 bg-background cursor-pointer hover:shadow-xl transition-shadow animate-in slide-in-from-right duration-300"
// //           onClick={() => handleClick(notification)}
// //         >
// //           <div className="flex items-start gap-3">
// //             <div className="flex-shrink-0 mt-1">
// //               <Bell className="w-5 h-5 text-blue-500" />
// //             </div>
// //             <div className="flex-1 min-w-0">
// //               <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
// //               <p className="text-sm text-muted-foreground line-clamp-2">{notification.body}</p>
// //             </div>
// //             <button
// //               onClick={(e) => {
// //                 e.stopPropagation()
// //                 removeNotification(notification.id)
// //               }}
// //               className="flex-shrink-0 text-muted-foreground hover:text-foreground"
// //             >
// //               <X className="w-4 h-4" />
// //             </button>
// //           </div>
// //         </Card>
// //       ))}
// //     </div>
// //   )
// // }



// "use client"

// import { useEffect, useState, useRef } from "react"
// import { X, Bell } from "lucide-react"
// import { Card } from "@/components/ui/card"

// interface Notification {
//   id: string
//   title: string
//   body: string
//   url?: string
//   timestamp: number
//   type?: string
// }

// export function RealTimeNotificationPoller() {
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [pendingCount, setPendingCount] = useState(0)
//   const audioContextRef = useRef<AudioContext | null>(null)
//   const lastCheckRef = useRef<number>(Date.now())
//   const lastPendingCountRef = useRef<number>(0)

//   useEffect(() => {
//     try {
//       const AudioContext = window.AudioContext || (window as any).webkitAudioContext
//       audioContextRef.current = new AudioContext()
//       console.log("[v0] Real-time poller audio initialized")
//     } catch (error) {
//       console.error("[v0] Real-time poller audio error:", error)
//     }

//     // Enable audio on first user interaction
//     const enableAudio = () => {
//       if (audioContextRef.current && audioContextRef.current.state === "suspended") {
//         audioContextRef.current.resume().then(() => {
//           console.log("[v0] Real-time poller audio enabled")
//         })
//       }
//     }
//     document.addEventListener("click", enableAudio, { once: true })
//     document.addEventListener("keydown", enableAudio, { once: true })

//     // Poll every 2 seconds for real-time updates
//     const pollInterval = setInterval(checkForUpdates, 2000)

//     // Check immediately on mount
//     checkForUpdates()

//     return () => {
//       clearInterval(pollInterval)
//       document.removeEventListener("click", enableAudio)
//       document.removeEventListener("keydown", enableAudio)
//       if (audioContextRef.current) {
//         audioContextRef.current.close()
//       }
//     }
//   }, [])

//   const checkForUpdates = async () => {
//     try {
//       const response = await fetch("/api/leave-requests/pending-notifications")

//       if (!response.ok) {
//         if (response.status === 401) {
//           console.log("[v0] Real-time poller: User not authenticated, skipping check")
//           return
//         }
//         console.error("[v0] Real-time poller: HTTP error", response.status)
//         return
//       }

//       const data = await response.json()

//       // Update pending count
//       setPendingCount(data.pendingCount || 0)

//       // Check for new pending requests (increased count)
//       if (data.pendingCount > lastPendingCountRef.current) {
//         const newRequestsCount = data.pendingCount - lastPendingCountRef.current
//         console.log(`[v0] ${newRequestsCount} new leave request(s) detected`)

//         showNotification({
//           id: `pending-${Date.now()}`,
//           title: "New Leave Request",
//           body: `You have ${newRequestsCount} new leave request${newRequestsCount > 1 ? "s" : ""} to review`,
//           url: "/leave-approval",
//           timestamp: Date.now(),
//           type: "leave_request",
//         })

//         // Send push notification
//         sendPushNotification(
//           "New Leave Request",
//           `You have ${newRequestsCount} new leave request${newRequestsCount > 1 ? "s" : ""} to review`,
//           "/leave-approval",
//           "leave_request",
//         )
//       }

//       lastPendingCountRef.current = data.pendingCount

//       // Check for new notifications
//       if (data.notifications && data.notifications.length > 0) {
//         const newNotifications = data.notifications.filter((notif: any) => {
//           const notifTime = new Date(notif.sentAt).getTime()
//           return notifTime > lastCheckRef.current
//         })

//         if (newNotifications.length > 0) {
//           console.log(`[v0] ${newNotifications.length} new notification(s) detected`)
//           newNotifications.forEach((notif: any) => {
//             let notifType = "general"
//             if (notif.type === "leave_approved" || notif.title.includes("Approved")) {
//               notifType = "leave_approval"
//             } else if (notif.type === "leave_rejected" || notif.title.includes("Rejected")) {
//               notifType = "leave_rejected"
//             }

//             showNotification({
//               id: notif.id,
//               title: notif.title,
//               body: notif.body,
//               url: notif.url,
//               timestamp: Date.now(),
//               type: notifType,
//             })

//             // Send push notification
//             sendPushNotification(notif.title, notif.body, notif.url, notifType)
//           })
//         }
//       }

//       lastCheckRef.current = Date.now()

//       // Update badge count
//       updateBadgeCount(data.pendingCount + data.notificationCount)
//     } catch (error) {
//       console.error("[v0] Error checking for updates:", error)
//     }
//   }

//   const sendPushNotification = async (title: string, body: string, url: string, notificationType = "general") => {
//     try {
//       // Send to service worker for push notification
//       if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
//         navigator.serviceWorker.controller.postMessage({
//           type: "SHOW_NOTIFICATION",
//           title,
//           body,
//           url,
//           notificationType,
//         })
//       }

//       // Also send via API for subscribed devices
//       await fetch("/api/push/send", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title,
//           body,
//           data: { url, notificationType },
//         }),
//       })
//     } catch (error) {
//       console.error("[v0] Error sending push notification:", error)
//     }
//   }

//   const updateBadgeCount = (count: number) => {
//     if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
//       navigator.serviceWorker.controller.postMessage({
//         type: "SET_NOTIFICATION_COUNT",
//         count,
//       })
//     }
//   }

//   const playTone = (type = "general") => {
//     if (!audioContextRef.current) return

//     try {
//       const ctx = audioContextRef.current
//       if (ctx.state === "suspended") {
//         ctx.resume()
//       }

//       const oscillator = ctx.createOscillator()
//       const gainNode = ctx.createGain()

//       oscillator.connect(gainNode)
//       gainNode.connect(ctx.destination)

//       let frequency1 = 600
//       let frequency2 = 800
//       let duration = 0.15

//       if (type === "leave_request") {
//         frequency1 = 800
//         frequency2 = 1000
//         duration = 0.12
//       } else if (type === "leave_approval") {
//         frequency1 = 400
//         frequency2 = 500
//         duration = 0.2
//       } else if (type === "leave_rejected") {
//         frequency1 = 300
//         frequency2 = 250
//         duration = 0.25
//       }

//       oscillator.frequency.setValueAtTime(frequency1, ctx.currentTime)
//       gainNode.gain.setValueAtTime(0, ctx.currentTime)
//       gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)
//       oscillator.frequency.setValueAtTime(frequency2, ctx.currentTime + duration / 2)
//       gainNode.gain.setValueAtTime(0.3, ctx.currentTime + duration - 0.05)
//       gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

//       oscillator.start(ctx.currentTime)
//       oscillator.stop(ctx.currentTime + duration)

//       oscillator.onended = () => {
//         oscillator.disconnect()
//         gainNode.disconnect()
//       }
//     } catch (error) {
//       console.error("[v0] Error playing tone:", error)
//     }
//   }

//   const showNotification = (notification: Notification) => {
//     console.log("[v0] Showing notification:", notification.title, "Type:", notification.type)

//     playTone(notification.type || "general")

//     // Add to notifications list
//     setNotifications((prev) => [notification, ...prev].slice(0, 3)) // Keep max 3

//     // Auto-remove after 5 seconds
//     setTimeout(() => {
//       removeNotification(notification.id)
//     }, 5000)
//   }

//   const removeNotification = (id: string) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id))
//   }

//   const handleClick = (notification: Notification) => {
//     if (notification.url) {
//       window.location.href = notification.url
//     }
//     removeNotification(notification.id)
//   }

//   if (notifications.length === 0) return null

//   return (
//     <div className="fixed top-20 right-4 z-[200] space-y-2 max-w-sm">
//       {notifications.map((notification) => (
//         <Card
//           key={notification.id}
//           className="p-4 shadow-lg border-l-4 border-l-blue-500 bg-background cursor-pointer hover:shadow-xl transition-shadow animate-in slide-in-from-right duration-300"
//           onClick={() => handleClick(notification)}
//         >
//           <div className="flex items-start gap-3">
//             <div className="flex-shrink-0 mt-1">
//               <Bell className="w-5 h-5 text-blue-500" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
//               <p className="text-sm text-muted-foreground line-clamp-2">{notification.body}</p>
//             </div>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation()
//                 removeNotification(notification.id)
//               }}
//               className="flex-shrink-0 text-muted-foreground hover:text-foreground"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </Card>
//       ))}
//     </div>
//   )
// }




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
  type?: string
}

export function RealTimeNotificationPoller() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const lastCheckRef = useRef<number>(Date.now())
  const lastPendingCountRef = useRef<number>(0)
  const errorCountRef = useRef<number>(0)
  const lastErrorTimeRef = useRef<number>(0)
  const backoffDelayRef = useRef<number>(2000)

  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioContext()
    } catch (error) {
      // Silent audio initialization error
    }

    // Enable audio on first user interaction
    const enableAudio = () => {
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume()
      }
    }
    document.addEventListener("click", enableAudio, { once: true })
    document.addEventListener("keydown", enableAudio, { once: true })

    let pollTimeout: NodeJS.Timeout

    const scheduleNextCheck = (delay: number) => {
      pollTimeout = setTimeout(() => {
        checkForUpdates()
      }, delay)
    }

    // Check immediately on mount
    checkForUpdates()

    return () => {
      clearTimeout(pollTimeout)
      document.removeEventListener("click", enableAudio)
      document.removeEventListener("keydown", enableAudio)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const checkForUpdates = async () => {
    try {
      const response = await fetch("/api/leave-requests/pending-notifications")

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
            `[v0] Real-time poller: ${errorCountRef.current} error(s) occurred, latest status: ${response.status}`,
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

      // Update pending count
      setPendingCount(data.pendingCount || 0)

      // Check for new pending requests (increased count)
      if (data.pendingCount > lastPendingCountRef.current) {
        const newRequestsCount = data.pendingCount - lastPendingCountRef.current

        showNotification({
          id: `pending-${Date.now()}`,
          title: "New Leave Request",
          body: `You have ${newRequestsCount} new leave request${newRequestsCount > 1 ? "s" : ""} to review`,
          url: "/leave-approval",
          timestamp: Date.now(),
          type: "leave_request",
        })

        // Send push notification
        sendPushNotification(
          "New Leave Request",
          `You have ${newRequestsCount} new leave request${newRequestsCount > 1 ? "s" : ""} to review`,
          "/leave-approval",
          "leave_request",
        )
      }

      lastPendingCountRef.current = data.pendingCount

      // Check for new notifications
      if (data.notifications && data.notifications.length > 0) {
        const newNotifications = data.notifications.filter((notif: any) => {
          const notifTime = new Date(notif.sentAt).getTime()
          return notifTime > lastCheckRef.current
        })

        if (newNotifications.length > 0) {
          newNotifications.forEach((notif: any) => {
            let notifType = "general"
            if (notif.type === "leave_approved" || notif.title.includes("Approved")) {
              notifType = "leave_approval"
            } else if (notif.type === "leave_rejected" || notif.title.includes("Rejected")) {
              notifType = "leave_rejected"
            }

            showNotification({
              id: notif.id,
              title: notif.title,
              body: notif.body,
              url: notif.url,
              timestamp: Date.now(),
              type: notifType,
            })

            // Send push notification
            sendPushNotification(notif.title, notif.body, notif.url, notifType)
          })
        }
      }

      lastCheckRef.current = Date.now()

      // Update badge count
      updateBadgeCount(data.pendingCount + data.notificationCount)

      scheduleNextCheck(backoffDelayRef.current)
    } catch (error) {
      const now = Date.now()
      errorCountRef.current++

      if (now - lastErrorTimeRef.current > 30000) {
        console.error(`[v0] Real-time poller: ${errorCountRef.current} network error(s) occurred`)
        errorCountRef.current = 0
        lastErrorTimeRef.current = now
      }

      backoffDelayRef.current = Math.min(backoffDelayRef.current * 1.5, 30000)
      scheduleNextCheck(backoffDelayRef.current)
    }
  }

  const scheduleNextCheck = (delay: number) => {
    setTimeout(() => {
      checkForUpdates()
    }, delay)
  }

  const sendPushNotification = async (title: string, body: string, url: string, notificationType = "general") => {
    try {
      // Send to service worker for push notification
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "SHOW_NOTIFICATION",
          title,
          body,
          url,
          notificationType,
        })
      }

      // Also send via API for subscribed devices
      await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          data: { url, notificationType },
        }),
      })
    } catch (error) {
      // Silent error for push notifications
    }
  }

  const updateBadgeCount = (count: number) => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SET_NOTIFICATION_COUNT",
        count,
      })
    }
  }

  const playTone = (type = "general") => {
    if (!audioContextRef.current) return

    try {
      const ctx = audioContextRef.current
      if (ctx.state === "suspended") {
        ctx.resume()
      }

      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      let frequency1 = 600
      let frequency2 = 800
      let duration = 0.15

      if (type === "leave_request") {
        frequency1 = 800
        frequency2 = 1000
        duration = 0.12
      } else if (type === "leave_approval") {
        frequency1 = 400
        frequency2 = 500
        duration = 0.2
      } else if (type === "leave_rejected") {
        frequency1 = 300
        frequency2 = 250
        duration = 0.25
      }

      oscillator.frequency.setValueAtTime(frequency1, ctx.currentTime)
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)
      oscillator.frequency.setValueAtTime(frequency2, ctx.currentTime + duration / 2)
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime + duration - 0.05)
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)

      oscillator.onended = () => {
        oscillator.disconnect()
        gainNode.disconnect()
      }
    } catch (error) {
      // Silent error for audio playback
    }
  }

  const showNotification = (notification: Notification) => {
    playTone(notification.type || "general")

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


// // // // // const CACHE_NAME = "face-attendance-v1.4.0"
// // // // // const OFFLINE_URL = "/offline"

// // // // // const STATIC_ASSETS = ["/", "/offline", "/login", "/manifest.json", "/logo3.jpg", "/images/logo.jpg"]

// // // // // const CACHE_BLACKLIST = ["/api/", "/models/", "cloudinary.com"]

// // // // // let notificationCount = 0

// // // // // async function updateBadgeCount(delta = 1) {
// // // // //   notificationCount += delta
// // // // //   if (notificationCount < 0) notificationCount = 0

// // // // //   if ("setAppBadge" in navigator) {
// // // // //     if (notificationCount > 0) {
// // // // //       await navigator.setAppBadge(notificationCount)
// // // // //     } else {
// // // // //       await navigator.clearAppBadge()
// // // // //     }
// // // // //   }
// // // // // }

// // // // // self.addEventListener("install", (event) => {
// // // // //   console.log("[SW] Installing service worker...")
// // // // //   event.waitUntil(
// // // // //     caches.open(CACHE_NAME).then((cache) => {
// // // // //       console.log("[SW] Caching static assets")
// // // // //       return cache.addAll(STATIC_ASSETS).catch((err) => {
// // // // //         console.error("[SW] Failed to cache assets:", err)
// // // // //       })
// // // // //     }),
// // // // //   )
// // // // //   self.skipWaiting()
// // // // // })

// // // // // self.addEventListener("activate", (event) => {
// // // // //   console.log("[SW] Activating service worker...")
// // // // //   event.waitUntil(
// // // // //     Promise.all([
// // // // //       caches.keys().then((cacheNames) => {
// // // // //         return Promise.all(
// // // // //           cacheNames.map((cacheName) => {
// // // // //             if (cacheName !== CACHE_NAME) {
// // // // //               console.log("[SW] Deleting old cache:", cacheName)
// // // // //               return caches.delete(cacheName)
// // // // //             }
// // // // //           }),
// // // // //         )
// // // // //       }),
// // // // //       self.clients.matchAll().then((clients) => {
// // // // //         clients.forEach((client) => {
// // // // //           client.postMessage({ type: "GET_NOTIFICATION_COUNT" })
// // // // //         })
// // // // //       }),
// // // // //     ]),
// // // // //   )
// // // // //   self.clients.claim()
// // // // // })

// // // // // self.addEventListener("message", (event) => {
// // // // //   if (event.data && event.data.type === "SKIP_WAITING") {
// // // // //     console.log("[SW] Skipping waiting and activating new service worker")
// // // // //     self.skipWaiting()
// // // // //   } else if (event.data && event.data.type === "SET_NOTIFICATION_COUNT") {
// // // // //     notificationCount = event.data.count || 0
// // // // //     updateBadgeCount(0)
// // // // //   } else if (event.data && event.data.type === "CLEAR_BADGE") {
// // // // //     notificationCount = 0
// // // // //     updateBadgeCount(0)
// // // // //   } else if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
// // // // //     console.log("[SW] Received PLAY_NOTIFICATION_SOUND message, broadcasting to all clients")
// // // // //     const notificationType = event.data.notificationType || "general"
// // // // //     self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
// // // // //       console.log("[SW] Broadcasting sound message to", clients.length, "client(s)")
// // // // //       clients.forEach((client) => {
// // // // //         client.postMessage({
// // // // //           type: "PLAY_NOTIFICATION_SOUND",
// // // // //           notificationType: notificationType,
// // // // //           notification: event.data.notification || { title: "Test", body: "Test notification" },
// // // // //         })
// // // // //       })
// // // // //     })
// // // // //   }
// // // // // })

// // // // // self.addEventListener("fetch", (event) => {
// // // // //   if (event.request.method !== "GET") return
// // // // //   if (!event.request.url.startsWith("http")) return

// // // // //   const shouldCache = !CACHE_BLACKLIST.some((pattern) => event.request.url.includes(pattern))
// // // // //   const isStaticAsset =
// // // // //     event.request.destination === "script" ||
// // // // //     event.request.destination === "style" ||
// // // // //     event.request.destination === "image" ||
// // // // //     event.request.url.includes("/_next/static/")

// // // // //   if (isStaticAsset && shouldCache) {
// // // // //     event.respondWith(
// // // // //       caches.match(event.request).then((cachedResponse) => {
// // // // //         if (cachedResponse) {
// // // // //           // Return cached version immediately, update cache in background
// // // // //           fetch(event.request)
// // // // //             .then((response) => {
// // // // //               if (response && response.status === 200) {
// // // // //                 caches.open(CACHE_NAME).then((cache) => {
// // // // //                   cache.put(event.request, response)
// // // // //                 })
// // // // //               }
// // // // //             })
// // // // //             .catch(() => {})
// // // // //           return cachedResponse
// // // // //         }

// // // // //         // Not in cache, fetch from network
// // // // //         return fetch(event.request)
// // // // //           .then((response) => {
// // // // //             if (response && response.status === 200) {
// // // // //               const responseToCache = response.clone()
// // // // //               caches.open(CACHE_NAME).then((cache) => {
// // // // //                 cache.put(event.request, responseToCache)
// // // // //               })
// // // // //             }
// // // // //             return response
// // // // //           })
// // // // //           .catch(() => {
// // // // //             return new Response("Offline", { status: 503 })
// // // // //           })
// // // // //       }),
// // // // //     )
// // // // //   } else {
// // // // //     event.respondWith(
// // // // //       Promise.race([
// // // // //         fetch(event.request).then((response) => {
// // // // //           if (!response || response.status !== 200 || response.type === "error") {
// // // // //             return response
// // // // //           }

// // // // //           if (shouldCache && event.request.destination === "document") {
// // // // //             const responseToCache = response.clone()
// // // // //             caches.open(CACHE_NAME).then((cache) => {
// // // // //               cache.put(event.request, responseToCache)
// // // // //             })
// // // // //           }

// // // // //           return response
// // // // //         }),
// // // // //         new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
// // // // //       ]).catch(() => {
// // // // //         return caches.match(event.request).then((cachedResponse) => {
// // // // //           if (cachedResponse) {
// // // // //             return cachedResponse
// // // // //           }
// // // // //           if (event.request.destination === "document") {
// // // // //             return caches.match(OFFLINE_URL)
// // // // //           }
// // // // //           return new Response("Offline", { status: 503 })
// // // // //         })
// // // // //       }),
// // // // //     )
// // // // //   }
// // // // // })

// // // // // self.addEventListener("push", (event) => {
// // // // //   console.log("[SW] Push notification received:", event.data?.text())

// // // // //   const data = event.data ? event.data.json() : {}
// // // // //   const title = data.title || "Face Attendance Notification"
// // // // //   const notificationType = data.data?.notificationType || "general"

// // // // //   const options = {
// // // // //     body: data.body || "You have a new notification",
// // // // //     icon: "/logo3.jpg",
// // // // //     badge: "/logo3.jpg",
// // // // //     vibrate: [200, 100, 200],
// // // // //     data: data.data || {},
// // // // //     actions: data.actions || [],
// // // // //     tag: data.tag || "notification",
// // // // //     requireInteraction: data.requireInteraction || false,
// // // // //     silent: false,
// // // // //     sound: "/sounds/notification.mp3",
// // // // //   }

// // // // //   console.log("[SW] Showing notification with title:", title)
// // // // //   console.log("[SW] Notification type:", notificationType)
// // // // //   console.log("[SW] Notification options:", options)

// // // // //   event.waitUntil(
// // // // //     Promise.all([
// // // // //       self.registration.showNotification(title, options),
// // // // //       updateBadgeCount(1),
// // // // //       self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
// // // // //         console.log("[SW] Found", clients.length, "client(s) to send sound message")
// // // // //         clients.forEach((client) => {
// // // // //           console.log("[SW] Sending PLAY_NOTIFICATION_SOUND to client:", client.id)
// // // // //           client.postMessage({
// // // // //             type: "PLAY_NOTIFICATION_SOUND",
// // // // //             notificationType: notificationType,
// // // // //             notification: { title, body: options.body },
// // // // //           })
// // // // //         })
// // // // //       }),
// // // // //     ]).then(() => {
// // // // //       console.log("[SW] Push notification processing complete")
// // // // //     }),
// // // // //   )
// // // // // })

// // // // // self.addEventListener("notificationclick", (event) => {
// // // // //   console.log("[SW] Notification clicked")
// // // // //   event.notification.close()

// // // // //   updateBadgeCount(-1)

// // // // //   const urlToOpen = event.notification.data?.url || "/"

// // // // //   event.waitUntil(
// // // // //     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
// // // // //       for (const client of clientList) {
// // // // //         if (client.url === urlToOpen && "focus" in client) {
// // // // //           return client.focus()
// // // // //         }
// // // // //       }
// // // // //       if (clients.openWindow) {
// // // // //         return clients.openWindow(urlToOpen)
// // // // //       }
// // // // //     }),
// // // // //   )
// // // // // })




// // // // const CACHE_NAME = "face-attendance-v1.4.0"
// // // // const OFFLINE_URL = "/offline"

// // // // const STATIC_ASSETS = ["/", "/offline", "/login", "/manifest.json", "/logo3.jpg", "/images/logo.jpg"]

// // // // const CACHE_BLACKLIST = ["/api/", "/models/", "cloudinary.com"]

// // // // let notificationCount = 0

// // // // async function updateBadgeCount(delta = 1) {
// // // //   notificationCount += delta
// // // //   if (notificationCount < 0) notificationCount = 0

// // // //   if ("setAppBadge" in navigator) {
// // // //     if (notificationCount > 0) {
// // // //       await navigator.setAppBadge(notificationCount)
// // // //     } else {
// // // //       await navigator.clearAppBadge()
// // // //     }
// // // //   }
// // // // }

// // // // self.addEventListener("install", (event) => {
// // // //   console.log("[SW] Installing service worker...")
// // // //   event.waitUntil(
// // // //     caches.open(CACHE_NAME).then((cache) => {
// // // //       console.log("[SW] Caching static assets")
// // // //       return cache.addAll(STATIC_ASSETS).catch((err) => {
// // // //         console.error("[SW] Failed to cache assets:", err)
// // // //       })
// // // //     }),
// // // //   )
// // // //   self.skipWaiting()
// // // // })

// // // // self.addEventListener("activate", (event) => {
// // // //   console.log("[SW] Activating service worker...")
// // // //   event.waitUntil(
// // // //     Promise.all([
// // // //       caches.keys().then((cacheNames) => {
// // // //         return Promise.all(
// // // //           cacheNames.map((cacheName) => {
// // // //             if (cacheName !== CACHE_NAME) {
// // // //               console.log("[SW] Deleting old cache:", cacheName)
// // // //               return caches.delete(cacheName)
// // // //             }
// // // //           }),
// // // //         )
// // // //       }),
// // // //       self.clients.matchAll().then((clients) => {
// // // //         clients.forEach((client) => {
// // // //           client.postMessage({ type: "GET_NOTIFICATION_COUNT" })
// // // //         })
// // // //       }),
// // // //     ]),
// // // //   )
// // // //   self.clients.claim()
// // // // })

// // // // self.addEventListener("message", (event) => {
// // // //   if (event.data && event.data.type === "SKIP_WAITING") {
// // // //     console.log("[SW] Skipping waiting and activating new service worker")
// // // //     self.skipWaiting()
// // // //   } else if (event.data && event.data.type === "SET_NOTIFICATION_COUNT") {
// // // //     notificationCount = event.data.count || 0
// // // //     updateBadgeCount(0)
// // // //   } else if (event.data && event.data.type === "CLEAR_BADGE") {
// // // //     notificationCount = 0
// // // //     updateBadgeCount(0)
// // // //   } else if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
// // // //     console.log("[SW] Received PLAY_NOTIFICATION_SOUND message, broadcasting to all clients")
// // // //     const notificationType = event.data.notificationType || "general"
// // // //     self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
// // // //       console.log("[SW] Broadcasting sound message to", clients.length, "client(s)")
// // // //       clients.forEach((client) => {
// // // //         client.postMessage({
// // // //           type: "PLAY_NOTIFICATION_SOUND",
// // // //           notificationType: notificationType,
// // // //           notification: event.data.notification || { title: "Test", body: "Test notification" },
// // // //         })
// // // //       })
// // // //     })
// // // //   }
// // // // })

// // // // self.addEventListener("fetch", (event) => {
// // // //   if (event.request.method !== "GET") return
// // // //   if (!event.request.url.startsWith("http")) return

// // // //   const shouldCache = !CACHE_BLACKLIST.some((pattern) => event.request.url.includes(pattern))
// // // //   const isStaticAsset =
// // // //     event.request.destination === "script" ||
// // // //     event.request.destination === "style" ||
// // // //     event.request.destination === "image" ||
// // // //     event.request.url.includes("/_next/static/")

// // // //   if (isStaticAsset && shouldCache) {
// // // //     event.respondWith(
// // // //       caches.match(event.request).then((cachedResponse) => {
// // // //         if (cachedResponse) {
// // // //           // Return cached version immediately, update cache in background
// // // //           fetch(event.request)
// // // //             .then((response) => {
// // // //               if (response && response.status === 200) {
// // // //                 caches.open(CACHE_NAME).then((cache) => {
// // // //                   cache.put(event.request, response)
// // // //                 })
// // // //               }
// // // //             })
// // // //             .catch(() => {})
// // // //           return cachedResponse
// // // //         }

// // // //         // Not in cache, fetch from network
// // // //         return fetch(event.request)
// // // //           .then((response) => {
// // // //             if (response && response.status === 200) {
// // // //               const responseToCache = response.clone()
// // // //               caches.open(CACHE_NAME).then((cache) => {
// // // //                 cache.put(event.request, responseToCache)
// // // //               })
// // // //             }
// // // //             return response
// // // //           })
// // // //           .catch(() => {
// // // //             return new Response(JSON.stringify({ error: "Offline", offline: true }), {
// // // //               status: 503,
// // // //               headers: { "Content-Type": "application/json" },
// // // //             })
// // // //           })
// // // //       }),
// // // //     )
// // // //   } else {
// // // //     event.respondWith(
// // // //       Promise.race([
// // // //         fetch(event.request).then((response) => {
// // // //           if (!response || response.status !== 200 || response.type === "error") {
// // // //             return response
// // // //           }

// // // //           if (shouldCache && event.request.destination === "document") {
// // // //             const responseToCache = response.clone()
// // // //             caches.open(CACHE_NAME).then((cache) => {
// // // //               cache.put(event.request, responseToCache)
// // // //             })
// // // //           }

// // // //           return response
// // // //         }),
// // // //         new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
// // // //       ]).catch(() => {
// // // //         return caches.match(event.request).then((cachedResponse) => {
// // // //           if (cachedResponse) {
// // // //             return cachedResponse
// // // //           }
// // // //           if (event.request.destination === "document") {
// // // //             return caches.match(OFFLINE_URL)
// // // //           }
// // // //           return new Response(JSON.stringify({ error: "Offline", offline: true }), {
// // // //             status: 503,
// // // //             headers: { "Content-Type": "application/json" },
// // // //           })
// // // //         })
// // // //       }),
// // // //     )
// // // //   }
// // // // })

// // // // self.addEventListener("push", (event) => {
// // // //   console.log("[SW] Push notification received:", event.data?.text())

// // // //   const data = event.data ? event.data.json() : {}
// // // //   const title = data.title || "Face Attendance Notification"
// // // //   const notificationType = data.data?.notificationType || "general"

// // // //   const options = {
// // // //     body: data.body || "You have a new notification",
// // // //     icon: "/logo3.jpg",
// // // //     badge: "/logo3.jpg",
// // // //     vibrate: [200, 100, 200],
// // // //     data: data.data || {},
// // // //     actions: data.actions || [],
// // // //     tag: data.tag || "notification",
// // // //     requireInteraction: data.requireInteraction || false,
// // // //     silent: false,
// // // //     sound: "/sounds/notification.mp3",
// // // //   }

// // // //   console.log("[SW] Showing notification with title:", title)
// // // //   console.log("[SW] Notification type:", notificationType)
// // // //   console.log("[SW] Notification options:", options)

// // // //   event.waitUntil(
// // // //     Promise.all([
// // // //       self.registration.showNotification(title, options),
// // // //       updateBadgeCount(1),
// // // //       self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
// // // //         console.log("[SW] Found", clients.length, "client(s) to send sound message")
// // // //         clients.forEach((client) => {
// // // //           console.log("[SW] Sending PLAY_NOTIFICATION_SOUND to client:", client.id)
// // // //           client.postMessage({
// // // //             type: "PLAY_NOTIFICATION_SOUND",
// // // //             notificationType: notificationType,
// // // //             notification: { title, body: options.body },
// // // //           })
// // // //         })
// // // //       }),
// // // //     ]).then(() => {
// // // //       console.log("[SW] Push notification processing complete")
// // // //     }),
// // // //   )
// // // // })

// // // // self.addEventListener("notificationclick", (event) => {
// // // //   console.log("[SW] Notification clicked")
// // // //   event.notification.close()

// // // //   updateBadgeCount(-1)

// // // //   const urlToOpen = event.notification.data?.url || "/"

// // // //   event.waitUntil(
// // // //     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
// // // //       for (const client of clientList) {
// // // //         if (client.url === urlToOpen && "focus" in client) {
// // // //           return client.focus()
// // // //         }
// // // //       }
// // // //       if (clients.openWindow) {
// // // //         return clients.openWindow(urlToOpen)
// // // //       }
// // // //     }),
// // // //   )
// // // // })




// // // const CACHE_NAME = "face-attendance-v1.4.0"
// // // const OFFLINE_URL = "/offline"

// // // const STATIC_ASSETS = ["/", "/offline", "/login", "/manifest.json", "/logo3.jpg", "/images/logo.jpg"]

// // // const CACHE_BLACKLIST = ["/api/", "/models/", "cloudinary.com"]

// // // let notificationCount = 0

// // // async function updateBadgeCount(delta = 1) {
// // //   notificationCount += delta
// // //   if (notificationCount < 0) notificationCount = 0

// // //   if ("setAppBadge" in navigator) {
// // //     if (notificationCount > 0) {
// // //       await navigator.setAppBadge(notificationCount)
// // //     } else {
// // //       await navigator.clearAppBadge()
// // //     }
// // //   }
// // // }

// // // self.addEventListener("install", (event) => {
// // //   console.log("[SW] Installing service worker...")
// // //   event.waitUntil(
// // //     caches.open(CACHE_NAME).then((cache) => {
// // //       console.log("[SW] Caching static assets")
// // //       return cache.addAll(STATIC_ASSETS).catch((err) => {
// // //         console.error("[SW] Failed to cache assets:", err)
// // //       })
// // //     }),
// // //   )
// // //   self.skipWaiting()
// // // })

// // // self.addEventListener("activate", (event) => {
// // //   console.log("[SW] Activating service worker...")
// // //   event.waitUntil(
// // //     Promise.all([
// // //       caches.keys().then((cacheNames) => {
// // //         return Promise.all(
// // //           cacheNames.map((cacheName) => {
// // //             if (cacheName !== CACHE_NAME) {
// // //               console.log("[SW] Deleting old cache:", cacheName)
// // //               return caches.delete(cacheName)
// // //             }
// // //           }),
// // //         )
// // //       }),
// // //       self.clients.matchAll().then((clients) => {
// // //         clients.forEach((client) => {
// // //           client.postMessage({ type: "GET_NOTIFICATION_COUNT" })
// // //         })
// // //       }),
// // //     ]),
// // //   )
// // //   self.clients.claim()
// // // })

// // // self.addEventListener("message", (event) => {
// // //   if (event.data && event.data.type === "SKIP_WAITING") {
// // //     console.log("[SW] Skipping waiting and activating new service worker")
// // //     self.skipWaiting()
// // //   } else if (event.data && event.data.type === "SET_NOTIFICATION_COUNT") {
// // //     notificationCount = event.data.count || 0
// // //     updateBadgeCount(0)
// // //   } else if (event.data && event.data.type === "CLEAR_BADGE") {
// // //     notificationCount = 0
// // //     updateBadgeCount(0)
// // //   } else if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
// // //     console.log("[SW] Received PLAY_NOTIFICATION_SOUND message, broadcasting to all clients")
// // //     const notificationType = event.data.notificationType || "general"
// // //     self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
// // //       console.log("[SW] Broadcasting sound message to", clients.length, "client(s)")
// // //       clients.forEach((client) => {
// // //         client.postMessage({
// // //           type: "PLAY_NOTIFICATION_SOUND",
// // //           notificationType: notificationType,
// // //           notification: event.data.notification || { title: "Test", body: "Test notification" },
// // //         })
// // //       })
// // //     })
// // //   }
// // // })

// // // self.addEventListener("fetch", (event) => {
// // //   if (event.request.method !== "GET") return
// // //   if (!event.request.url.startsWith("http")) return

// // //   const shouldCache = !CACHE_BLACKLIST.some((pattern) => event.request.url.includes(pattern))
// // //   const isStaticAsset =
// // //     event.request.destination === "script" ||
// // //     event.request.destination === "style" ||
// // //     event.request.destination === "image" ||
// // //     event.request.url.includes("/_next/static/")

// // //   if (isStaticAsset && shouldCache) {
// // //     event.respondWith(
// // //       caches.match(event.request).then((cachedResponse) => {
// // //         if (cachedResponse) {
// // //           // Return cached version immediately, update cache in background
// // //           fetch(event.request)
// // //             .then((response) => {
// // //               if (response && response.status === 200) {
// // //                 caches.open(CACHE_NAME).then((cache) => {
// // //                   cache.put(event.request, response)
// // //                 })
// // //               }
// // //             })
// // //             .catch(() => {})
// // //           return cachedResponse
// // //         }

// // //         // Not in cache, fetch from network
// // //         return fetch(event.request)
// // //           .then((response) => {
// // //             if (response && response.status === 200) {
// // //               const responseToCache = response.clone()
// // //               caches.open(CACHE_NAME).then((cache) => {
// // //                 cache.put(event.request, responseToCache)
// // //               })
// // //             }
// // //             return response
// // //           })
// // //           .catch(() => {
// // //             return new Response(JSON.stringify({ error: "Offline", offline: true }), {
// // //               status: 503,
// // //               headers: { "Content-Type": "application/json" },
// // //             })
// // //           })
// // //       }),
// // //     )
// // //   } else {
// // //     event.respondWith(
// // //       Promise.race([
// // //         fetch(event.request).then((response) => {
// // //           if (!response || response.status !== 200 || response.type === "error") {
// // //             return response
// // //           }

// // //           if (shouldCache && event.request.destination === "document") {
// // //             const responseToCache = response.clone()
// // //             caches.open(CACHE_NAME).then((cache) => {
// // //               cache.put(event.request, responseToCache)
// // //             })
// // //           }

// // //           return response
// // //         }),
// // //         new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
// // //       ]).catch(() => {
// // //         return caches.match(event.request).then((cachedResponse) => {
// // //           if (cachedResponse) {
// // //             return cachedResponse
// // //           }
// // //           if (event.request.destination === "document") {
// // //             return caches.match(OFFLINE_URL)
// // //           }
// // //           return new Response(JSON.stringify({ error: "Offline", offline: true }), {
// // //             status: 503,
// // //             headers: { "Content-Type": "application/json" },
// // //           })
// // //         })
// // //       }),
// // //     )
// // //   }
// // // })

// // // self.addEventListener("push", (event) => {
// // //   console.log("[SW] Push notification received:", event.data?.text())

// // //   const data = event.data ? event.data.json() : {}
// // //   const title = data.title || "Face Attendance Notification"
// // //   const notificationType = data.data?.notificationType || "general"

// // //   const options = {
// // //     body: data.body || "You have a new notification",
// // //     icon: "/logo3.jpg",
// // //     badge: "/logo3.jpg",
// // //     vibrate: [200, 100, 200, 100, 200],
// // //     data: data.data || {},
// // //     actions: data.actions || [],
// // //     tag: data.tag || "notification",
// // //     requireInteraction: false,
// // //     silent: false,
// // //     timestamp: Date.now(),
// // //     renotify: true,
// // //   }

// // //   console.log("[SW] Showing notification with title:", title)
// // //   console.log("[SW] Notification type:", notificationType)
// // //   console.log("[SW] Notification options:", options)

// // //   event.waitUntil(
// // //     Promise.all([
// // //       self.registration.showNotification(title, options),
// // //       updateBadgeCount(1),
// // //       self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
// // //         console.log("[SW] Found", clients.length, "client(s) to send sound message")
// // //         if (clients.length > 0) {
// // //           clients.forEach((client) => {
// // //             console.log("[SW] Sending PLAY_NOTIFICATION_SOUND to client:", client.id)
// // //             client.postMessage({
// // //               type: "PLAY_NOTIFICATION_SOUND",
// // //               notificationType: notificationType,
// // //               notification: { title, body: options.body },
// // //             })
// // //           })
// // //         } else {
// // //           console.log("[SW] No active clients - notification shown in background with system sound")
// // //         }
// // //       }),
// // //     ]).then(() => {
// // //       console.log("[SW] Push notification processing complete")
// // //     }),
// // //   )
// // // })

// // // self.addEventListener("notificationclick", (event) => {
// // //   console.log("[SW] Notification clicked")
// // //   event.notification.close()

// // //   updateBadgeCount(-1)

// // //   const urlToOpen = event.notification.data?.url || "/"

// // //   event.waitUntil(
// // //     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
// // //       for (const client of clientList) {
// // //         if (client.url === urlToOpen && "focus" in client) {
// // //           return client.focus()
// // //         }
// // //       }
// // //       if (clients.openWindow) {
// // //         return clients.openWindow(urlToOpen)
// // //       }
// // //     }),
// // //   )
// // // })



// // const CACHE_NAME = "face-attendance-v1.4.0"
// // const OFFLINE_URL = "/offline"

// // const STATIC_ASSETS = ["/", "/offline", "/login", "/manifest.json", "/logo3.jpg", "/images/logo.jpg"]

// // const CACHE_BLACKLIST = ["/api/", "/models/", "cloudinary.com"]

// // let notificationCount = 0

// // async function updateBadgeCount(delta = 1) {
// //   notificationCount += delta
// //   if (notificationCount < 0) notificationCount = 0

// //   if ("setAppBadge" in navigator) {
// //     if (notificationCount > 0) {
// //       await navigator.setAppBadge(notificationCount)
// //     } else {
// //       await navigator.clearAppBadge()
// //     }
// //   }
// // }

// // self.addEventListener("install", (event) => {
// //   console.log("[SW] Installing service worker...")
// //   event.waitUntil(
// //     caches.open(CACHE_NAME).then((cache) => {
// //       console.log("[SW] Caching static assets")
// //       return cache.addAll(STATIC_ASSETS).catch((err) => {
// //         console.error("[SW] Failed to cache assets:", err)
// //       })
// //     }),
// //   )
// //   self.skipWaiting()
// // })

// // self.addEventListener("activate", (event) => {
// //   console.log("[SW] Activating service worker...")
// //   event.waitUntil(
// //     Promise.all([
// //       caches.keys().then((cacheNames) => {
// //         return Promise.all(
// //           cacheNames.map((cacheName) => {
// //             if (cacheName !== CACHE_NAME) {
// //               console.log("[SW] Deleting old cache:", cacheName)
// //               return caches.delete(cacheName)
// //             }
// //           }),
// //         )
// //       }),
// //       self.clients.matchAll().then((clients) => {
// //         clients.forEach((client) => {
// //           client.postMessage({ type: "GET_NOTIFICATION_COUNT" })
// //         })
// //       }),
// //     ]),
// //   )
// //   self.clients.claim()
// // })

// // self.addEventListener("message", (event) => {
// //   if (event.data && event.data.type === "SKIP_WAITING") {
// //     console.log("[SW] Skipping waiting and activating new service worker")
// //     self.skipWaiting()
// //   } else if (event.data && event.data.type === "SET_NOTIFICATION_COUNT") {
// //     notificationCount = event.data.count || 0
// //     updateBadgeCount(0)
// //   } else if (event.data && event.data.type === "CLEAR_BADGE") {
// //     notificationCount = 0
// //     updateBadgeCount(0)
// //   } else if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
// //     console.log("[SW] Received PLAY_NOTIFICATION_SOUND message, broadcasting to all clients")
// //     const notificationType = event.data.notificationType || "general"
// //     self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
// //       console.log("[SW] Broadcasting sound message to", clients.length, "client(s)")
// //       clients.forEach((client) => {
// //         client.postMessage({
// //           type: "PLAY_NOTIFICATION_SOUND",
// //           notificationType: notificationType,
// //           notification: event.data.notification || { title: "Test", body: "Test notification" },
// //         })
// //       })
// //     })
// //   }
// // })

// // self.addEventListener("fetch", (event) => {
// //   if (event.request.method !== "GET") return
// //   if (!event.request.url.startsWith("http")) return

// //   const shouldCache = !CACHE_BLACKLIST.some((pattern) => event.request.url.includes(pattern))
// //   const isStaticAsset =
// //     event.request.destination === "script" ||
// //     event.request.destination === "style" ||
// //     event.request.destination === "image" ||
// //     event.request.url.includes("/_next/static/")

// //   if (isStaticAsset && shouldCache) {
// //     event.respondWith(
// //       caches.match(event.request).then((cachedResponse) => {
// //         if (cachedResponse) {
// //           // Return cached version immediately, update cache in background
// //           fetch(event.request)
// //             .then((response) => {
// //               if (response && response.status === 200) {
// //                 caches.open(CACHE_NAME).then((cache) => {
// //                   cache.put(event.request, response)
// //                 })
// //               }
// //             })
// //             .catch(() => {})
// //           return cachedResponse
// //         }

// //         // Not in cache, fetch from network
// //         return fetch(event.request)
// //           .then((response) => {
// //             if (response && response.status === 200) {
// //               const responseToCache = response.clone()
// //               caches.open(CACHE_NAME).then((cache) => {
// //                 cache.put(event.request, responseToCache)
// //               })
// //             }
// //             return response
// //           })
// //           .catch(() => {
// //             return new Response(JSON.stringify({ error: "Offline", offline: true }), {
// //               status: 503,
// //               headers: { "Content-Type": "application/json" },
// //             })
// //           })
// //       }),
// //     )
// //   } else {
// //     event.respondWith(
// //       Promise.race([
// //         fetch(event.request).then((response) => {
// //           if (!response || response.status !== 200 || response.type === "error") {
// //             return response
// //           }

// //           if (shouldCache && event.request.destination === "document") {
// //             const responseToCache = response.clone()
// //             caches.open(CACHE_NAME).then((cache) => {
// //               cache.put(event.request, responseToCache)
// //             })
// //           }

// //           return response
// //         }),
// //         new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
// //       ]).catch(() => {
// //         return caches.match(event.request).then((cachedResponse) => {
// //           if (cachedResponse) {
// //             return cachedResponse
// //           }
// //           if (event.request.destination === "document") {
// //             return caches.match(OFFLINE_URL)
// //           }
// //           return new Response(JSON.stringify({ error: "Offline", offline: true }), {
// //             status: 503,
// //             headers: { "Content-Type": "application/json" },
// //           })
// //         })
// //       }),
// //     )
// //   }
// // })

// // self.addEventListener("push", (event) => {
// //   console.log("[SW] Push notification received:", event.data?.text())

// //   const data = event.data ? event.data.json() : {}
// //   const title = data.title || "Face Attendance Notification"
// //   const notificationType = data.data?.notificationType || "general"

// //   const options = {
// //     body: data.body || "You have a new notification",
// //     icon: data.icon || "/logo3.jpg",
// //     badge: data.badge || "/logo3.jpg",
// //     vibrate: data.vibrate || [200, 100, 200, 100, 200],
// //     data: data.data || {},
// //     actions: data.actions || [],
// //     tag: data.tag || "notification",
// //     requireInteraction: data.requireInteraction || false,
// //     silent: false, // Ensure system plays notification sound in background
// //     timestamp: data.timestamp || Date.now(),
// //     renotify: true, // Allow same notification to play sound again
// //   }

// //   console.log("[SW] Showing notification with title:", title)
// //   console.log("[SW] Notification type:", notificationType)

// //   event.waitUntil(
// //     Promise.all([
// //       self.registration.showNotification(title, options),
// //       updateBadgeCount(1),
// //       self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
// //         console.log("[SW] Found", clients.length, "client(s) to send sound message")
// //         if (clients.length > 0) {
// //           clients.forEach((client) => {
// //             console.log("[SW] Sending PLAY_NOTIFICATION_SOUND to client:", client.id)
// //             client.postMessage({
// //               type: "PLAY_NOTIFICATION_SOUND",
// //               notificationType: notificationType,
// //               notification: { title, body: options.body },
// //             })
// //           })
// //         } else {
// //           console.log("[SW] No active clients - notification shown in background with system sound")
// //         }
// //       }),
// //     ]).then(() => {
// //       console.log("[SW] Push notification processing complete")
// //     }),
// //   )
// // })

// // self.addEventListener("notificationclick", (event) => {
// //   console.log("[SW] Notification clicked")
// //   event.notification.close()

// //   updateBadgeCount(-1)

// //   const urlToOpen = event.notification.data?.url || "/"

// //   event.waitUntil(
// //     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
// //       for (const client of clientList) {
// //         if (client.url === urlToOpen && "focus" in client) {
// //           return client.focus()
// //         }
// //       }
// //       if (clients.openWindow) {
// //         return clients.openWindow(urlToOpen)
// //       }
// //     }),
// //   )
// // })





// const CACHE_NAME = "face-attendance-v1.4.0"
// const OFFLINE_URL = "/offline"

// const STATIC_ASSETS = ["/", "/offline", "/login", "/manifest.json", "/logo3.jpg", "/images/logo.jpg"]

// const CACHE_BLACKLIST = ["/api/cron/", "/api/push/", "/api/", "/models/", "cloudinary.com"]

// let notificationCount = 0

// async function updateBadgeCount(delta = 1) {
//   notificationCount += delta
//   if (notificationCount < 0) notificationCount = 0

//   if ("setAppBadge" in navigator) {
//     if (notificationCount > 0) {
//       await navigator.setAppBadge(notificationCount)
//     } else {
//       await navigator.clearAppBadge()
//     }
//   }
// }

// self.addEventListener("install", (event) => {
//   console.log("[SW] Installing service worker...")
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("[SW] Caching static assets")
//       return cache.addAll(STATIC_ASSETS).catch((err) => {
//         console.error("[SW] Failed to cache assets:", err)
//       })
//     }),
//   )
//   self.skipWaiting()
// })

// self.addEventListener("activate", (event) => {
//   console.log("[SW] Activating service worker...")
//   event.waitUntil(
//     Promise.all([
//       caches.keys().then((cacheNames) => {
//         return Promise.all(
//           cacheNames.map((cacheName) => {
//             if (cacheName !== CACHE_NAME) {
//               console.log("[SW] Deleting old cache:", cacheName)
//               return caches.delete(cacheName)
//             }
//           }),
//         )
//       }),
//       self.clients.matchAll().then((clients) => {
//         clients.forEach((client) => {
//           client.postMessage({ type: "GET_NOTIFICATION_COUNT" })
//         })
//       }),
//     ]),
//   )
//   self.clients.claim()
// })

// self.addEventListener("message", (event) => {
//   if (event.data && event.data.type === "SKIP_WAITING") {
//     console.log("[SW] Skipping waiting and activating new service worker")
//     self.skipWaiting()
//   } else if (event.data && event.data.type === "SET_NOTIFICATION_COUNT") {
//     notificationCount = event.data.count || 0
//     updateBadgeCount(0)
//   } else if (event.data && event.data.type === "CLEAR_BADGE") {
//     notificationCount = 0
//     updateBadgeCount(0)
//   } else if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
//     console.log("[SW] Received PLAY_NOTIFICATION_SOUND message, broadcasting to all clients")
//     const notificationType = event.data.notificationType || "general"
//     self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
//       console.log("[SW] Broadcasting sound message to", clients.length, "client(s)")
//       clients.forEach((client) => {
//         client.postMessage({
//           type: "PLAY_NOTIFICATION_SOUND",
//           notificationType: notificationType,
//           notification: event.data.notification || { title: "Test", body: "Test notification" },
//         })
//       })
//     })
//   }
// })

// self.addEventListener("fetch", (event) => {
//   if (event.request.method !== "GET") return
//   if (!event.request.url.startsWith("http")) return

//   // Let cron and push API calls pass through without interception
//   if (event.request.url.includes("/api/cron/") || event.request.url.includes("/api/push/")) {
//     return
//   }

//   const shouldCache = !CACHE_BLACKLIST.some((pattern) => event.request.url.includes(pattern))
//   const isStaticAsset =
//     event.request.destination === "script" ||
//     event.request.destination === "style" ||
//     event.request.destination === "image" ||
//     event.request.url.includes("/_next/static/")

//   if (isStaticAsset && shouldCache) {
//     event.respondWith(
//       caches.match(event.request).then((cachedResponse) => {
//         if (cachedResponse) {
//           // Return cached version immediately, update cache in background
//           fetch(event.request)
//             .then((response) => {
//               if (response && response.status === 200) {
//                 caches.open(CACHE_NAME).then((cache) => {
//                   cache.put(event.request, response)
//                 })
//               }
//             })
//             .catch(() => {})
//           return cachedResponse
//         }

//         // Not in cache, fetch from network
//         return fetch(event.request)
//           .then((response) => {
//             if (response && response.status === 200) {
//               const responseToCache = response.clone()
//               caches.open(CACHE_NAME).then((cache) => {
//                 cache.put(event.request, responseToCache)
//               })
//             }
//             return response
//           })
//           .catch(() => {
//             return new Response(JSON.stringify({ error: "Offline", offline: true }), {
//               status: 503,
//               headers: { "Content-Type": "application/json" },
//             })
//           })
//       }),
//     )
//   } else {
//     event.respondWith(
//       Promise.race([
//         fetch(event.request).then((response) => {
//           if (!response || response.status !== 200 || response.type === "error") {
//             return response
//           }

//           if (shouldCache && event.request.destination === "document") {
//             const responseToCache = response.clone()
//             caches.open(CACHE_NAME).then((cache) => {
//               cache.put(event.request, responseToCache)
//             })
//           }

//           return response
//         }),
//         new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
//       ]).catch(() => {
//         return caches.match(event.request).then((cachedResponse) => {
//           if (cachedResponse) {
//             return cachedResponse
//           }
//           if (event.request.destination === "document") {
//             return caches.match(OFFLINE_URL)
//           }
//           return new Response(JSON.stringify({ error: "Offline", offline: true }), {
//             status: 503,
//             headers: { "Content-Type": "application/json" },
//           })
//         })
//       }),
//     )
//   }
// })

// self.addEventListener("push", (event) => {
//   console.log("[SW] Push notification received:", event.data?.text())

//   const data = event.data ? event.data.json() : {}
//   const title = data.title || "Face Attendance Notification"
//   const notificationType = data.data?.notificationType || "general"

//   const options = {
//     body: data.body || "You have a new notification",
//     icon: data.icon || "/logo3.jpg",
//     badge: data.badge || "/logo3.jpg",
//     vibrate: data.vibrate || [200, 100, 200, 100, 200],
//     data: data.data || {},
//     actions: data.actions || [],
//     tag: data.tag || "notification",
//     requireInteraction: data.requireInteraction || false,
//     silent: false, // Ensure system plays notification sound in background
//     timestamp: data.timestamp || Date.now(),
//     renotify: true, // Allow same notification to play sound again
//   }

//   console.log("[SW] Showing notification with title:", title)
//   console.log("[SW] Notification type:", notificationType)

//   event.waitUntil(
//     Promise.all([
//       self.registration.showNotification(title, options),
//       updateBadgeCount(1),
//       self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
//         console.log("[SW] Found", clients.length, "client(s) to send sound message")
//         if (clients.length > 0) {
//           clients.forEach((client) => {
//             console.log("[SW] Sending PLAY_NOTIFICATION_SOUND to client:", client.id)
//             client.postMessage({
//               type: "PLAY_NOTIFICATION_SOUND",
//               notificationType: notificationType,
//               notification: { title, body: options.body },
//             })
//           })
//         } else {
//           console.log("[SW] No active clients - notification shown in background with system sound")
//         }
//       }),
//     ]).then(() => {
//       console.log("[SW] Push notification processing complete")
//     }),
//   )
// })

// self.addEventListener("notificationclick", (event) => {
//   console.log("[SW] Notification clicked")
//   event.notification.close()

//   updateBadgeCount(-1)

//   const urlToOpen = event.notification.data?.url || "/"

//   event.waitUntil(
//     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
//       for (const client of clientList) {
//         if (client.url === urlToOpen && "focus" in client) {
//           return client.focus()
//         }
//       }
//       if (clients.openWindow) {
//         return clients.openWindow(urlToOpen)
//       }
//     }),
//   )
// })




const CACHE_NAME = "face-attendance-v1.4.0"
const OFFLINE_URL = "/offline"

const STATIC_ASSETS = ["/", "/offline", "/login", "/manifest.json", "/logo3.jpg", "/images/logo.jpg"]

const CACHE_BLACKLIST = ["/api/cron/", "/api/push/", "/api/", "/models/", "cloudinary.com"]

let notificationCount = 0

async function updateBadgeCount(delta = 1) {
  notificationCount += delta
  if (notificationCount < 0) notificationCount = 0

  if ("setAppBadge" in navigator) {
    if (notificationCount > 0) {
      await navigator.setAppBadge(notificationCount)
    } else {
      await navigator.clearAppBadge()
    }
  }
}

self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...")
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching static assets")
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.error("[SW] Failed to cache assets:", err)
      })
    }),
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...")
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[SW] Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      }),
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "GET_NOTIFICATION_COUNT" })
        })
      }),
    ]),
  )
  self.clients.claim()
})

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("[SW] Skipping waiting and activating new service worker")
    self.skipWaiting()
  } else if (event.data && event.data.type === "SET_NOTIFICATION_COUNT") {
    notificationCount = event.data.count || 0
    updateBadgeCount(0)
  } else if (event.data && event.data.type === "CLEAR_BADGE") {
    notificationCount = 0
    updateBadgeCount(0)
  } else if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
    console.log("[SW] Received PLAY_NOTIFICATION_SOUND message, broadcasting to all clients")
    const notificationType = event.data.notificationType || "general"
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      console.log("[SW] Broadcasting sound message to", clients.length, "client(s)")
      clients.forEach((client) => {
        client.postMessage({
          type: "PLAY_NOTIFICATION_SOUND",
          notificationType: notificationType,
          notification: event.data.notification || { title: "Test", body: "Test notification" },
        })
      })
    })
  }
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return
  if (!event.request.url.startsWith("http")) return

  // Let cron and push API calls pass through without interception
  if (event.request.url.includes("/api/cron/") || event.request.url.includes("/api/push/")) {
    return
  }

  const shouldCache = !CACHE_BLACKLIST.some((pattern) => event.request.url.includes(pattern))
  const isStaticAsset =
    event.request.destination === "script" ||
    event.request.destination === "style" ||
    event.request.destination === "image" ||
    event.request.url.includes("/_next/static/")

  if (isStaticAsset && shouldCache) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version immediately, update cache in background
          fetch(event.request)
            .then((response) => {
              if (response && response.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, response)
                })
              }
            })
            .catch(() => {})
          return cachedResponse
        }

        // Not in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache)
              })
            }
            return response
          })
          .catch(() => {
            return new Response(JSON.stringify({ error: "Offline", offline: true }), {
              status: 503,
              headers: { "Content-Type": "application/json" },
            })
          })
      }),
    )
  } else {
    event.respondWith(
      Promise.race([
        fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type === "error") {
            return response
          }

          if (shouldCache && event.request.destination === "document") {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }

          return response
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
      ]).catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          if (event.request.destination === "document") {
            return caches.match(OFFLINE_URL)
          }
          return new Response(JSON.stringify({ error: "Offline", offline: true }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          })
        })
      }),
    )
  }
})

self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received:", event.data?.text())

  const data = event.data ? event.data.json() : {}
  const title = data.title || "Face Attendance Notification"
  const notificationType = data.data?.notificationType || "general"
  const soundUrl = data.sound || data.data?.sound || "/notification-sound.mp3"

  const options = {
    body: data.body || "You have a new notification",
    icon: data.icon || "/logo3.jpg",
    badge: data.badge || "/logo3.jpg",
    vibrate: data.vibrate || [200, 100, 200, 100, 200],
    data: { ...data.data, soundUrl }, // Add soundUrl to notification data
    actions: data.actions || [],
    tag: data.tag || "notification",
    requireInteraction: data.requireInteraction || false,
    silent: false,
    timestamp: data.timestamp || Date.now(),
    renotify: true,
  }

  console.log("[SW] Showing notification with title:", title)
  console.log("[SW] Notification type:", notificationType)
  console.log("[SW] Sound URL:", soundUrl)

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      updateBadgeCount(1),
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
        console.log("[SW] Found", clients.length, "client(s) to send sound message")
        if (clients.length > 0) {
          clients.forEach((client) => {
            console.log("[SW] Sending PLAY_NOTIFICATION_SOUND to client:", client.id)
            client.postMessage({
              type: "PLAY_NOTIFICATION_SOUND",
              notificationType: notificationType,
              soundUrl: soundUrl,
              notification: { title, body: options.body },
            })
          })
        } else {
          console.log("[SW] No active clients - notification shown in background with system sound")
        }
      }),
    ]).then(() => {
      console.log("[SW] Push notification processing complete")
    }),
  )
})

self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked")
  event.notification.close()

  updateBadgeCount(-1)

  const urlToOpen = event.notification.data?.url || "/"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    }),
  )
})

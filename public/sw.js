// // // // // // // // // const CACHE_NAME = "faceattend-v1"
// // // // // // // // // const OFFLINE_URL = "/offline"

// // // // // // // // // // Assets to cache on install
// // // // // // // // // const STATIC_ASSETS = [
// // // // // // // // //   "/",
// // // // // // // // //   "/offline",
// // // // // // // // //   "/login",
// // // // // // // // //   "/manifest.json",
// // // // // // // // //   "/logo3.jpg",
// // // // // // // // //   "/logo3.jpg",
// // // // // // // // // ]

// // // // // // // // // // Install event - cache static assets
// // // // // // // // // self.addEventListener("install", (event) => {
// // // // // // // // //   console.log("[SW] Installing service worker...")
// // // // // // // // //   event.waitUntil(
// // // // // // // // //     caches.open(CACHE_NAME).then((cache) => {
// // // // // // // // //       console.log("[SW] Caching static assets")
// // // // // // // // //       return cache.addAll(STATIC_ASSETS)
// // // // // // // // //     }),
// // // // // // // // //   )
// // // // // // // // //   self.skipWaiting()
// // // // // // // // // })

// // // // // // // // // // Activate event - clean up old caches
// // // // // // // // // self.addEventListener("activate", (event) => {
// // // // // // // // //   console.log("[SW] Activating service worker...")
// // // // // // // // //   event.waitUntil(
// // // // // // // // //     caches.keys().then((cacheNames) => {
// // // // // // // // //       return Promise.all(
// // // // // // // // //         cacheNames.map((cacheName) => {
// // // // // // // // //           if (cacheName !== CACHE_NAME) {
// // // // // // // // //             console.log("[SW] Deleting old cache:", cacheName)
// // // // // // // // //             return caches.delete(cacheName)
// // // // // // // // //           }
// // // // // // // // //         }),
// // // // // // // // //       )
// // // // // // // // //     }),
// // // // // // // // //   )
// // // // // // // // //   self.clients.claim()
// // // // // // // // // })

// // // // // // // // // // Fetch event - serve from cache, fallback to network
// // // // // // // // // self.addEventListener("fetch", (event) => {
// // // // // // // // //   // Skip non-GET requests
// // // // // // // // //   if (event.request.method !== "GET") return

// // // // // // // // //   // Skip chrome extensions and other non-http requests
// // // // // // // // //   if (!event.request.url.startsWith("http")) return

// // // // // // // // //   event.respondWith(
// // // // // // // // //     caches.match(event.request).then((cachedResponse) => {
// // // // // // // // //       if (cachedResponse) {
// // // // // // // // //         return cachedResponse
// // // // // // // // //       }

// // // // // // // // //       return fetch(event.request)
// // // // // // // // //         .then((response) => {
// // // // // // // // //           // Don't cache non-successful responses
// // // // // // // // //           if (!response || response.status !== 200 || response.type === "error") {
// // // // // // // // //             return response
// // // // // // // // //           }

// // // // // // // // //           // Clone the response
// // // // // // // // //           const responseToCache = response.clone()

// // // // // // // // //           // Cache API responses and pages
// // // // // // // // //           if (event.request.url.includes("/api/") || event.request.destination === "document") {
// // // // // // // // //             caches.open(CACHE_NAME).then((cache) => {
// // // // // // // // //               cache.put(event.request, responseToCache)
// // // // // // // // //             })
// // // // // // // // //           }

// // // // // // // // //           return response
// // // // // // // // //         })
// // // // // // // // //         .catch(() => {
// // // // // // // // //           // Return offline page for navigation requests
// // // // // // // // //           if (event.request.destination === "document") {
// // // // // // // // //             return caches.match(OFFLINE_URL)
// // // // // // // // //           }
// // // // // // // // //         })
// // // // // // // // //     }),
// // // // // // // // //   )
// // // // // // // // // })

// // // // // // // // // // Push notification event
// // // // // // // // // self.addEventListener("push", (event) => {
// // // // // // // // //   console.log("[SW] Push notification received")

// // // // // // // // //   const data = event.data ? event.data.json() : {}
// // // // // // // // //   const title = data.title || "Face Attendece Notification"
// // // // // // // // //   const options = {
// // // // // // // // //     body: data.body || "You have a new notification",
// // // // // // // // //     icon: "/logo3.jpg",
// // // // // // // // //     badge: "/logo3.jpg",
// // // // // // // // //     vibrate: [200, 100, 200],
// // // // // // // // //     data: data.data || {},
// // // // // // // // //     actions: data.actions || [],
// // // // // // // // //   }

// // // // // // // // //   event.waitUntil(self.registration.showNotification(title, options))
// // // // // // // // // })

// // // // // // // // // // Notification click event
// // // // // // // // // self.addEventListener("notificationclick", (event) => {
// // // // // // // // //   console.log("[SW] Notification clicked")
// // // // // // // // //   event.notification.close()

// // // // // // // // //   const urlToOpen = event.notification.data?.url || "/"

// // // // // // // // //   event.waitUntil(
// // // // // // // // //     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
// // // // // // // // //       // Check if there's already a window open
// // // // // // // // //       for (const client of clientList) {
// // // // // // // // //         if (client.url === urlToOpen && "focus" in client) {
// // // // // // // // //           return client.focus()
// // // // // // // // //         }
// // // // // // // // //       }
// // // // // // // // //       // Open new window if none exists
// // // // // // // // //       if (clients.openWindow) {
// // // // // // // // //         return clients.openWindow(urlToOpen)
// // // // // // // // //       }
// // // // // // // // //     }),
// // // // // // // // //   )
// // // // // // // // // })



// // // // // // // // const CACHE_NAME = "faceattend-v1"
// // // // // // // // const OFFLINE_URL = "/offline"

// // // // // // // // // Assets to cache on install
// // // // // // // // const STATIC_ASSETS = [
// // // // // // // //   "/",
// // // // // // // //   "/offline",
// // // // // // // //   "/login",
// // // // // // // //   "/manifest.json",
// // // // // // // //   "/logo3.jpg",
// // // // // // // //   "/logo3.jpg",
// // // // // // // // ]

// // // // // // // // // Install event - cache static assets
// // // // // // // // self.addEventListener("install", (event) => {
// // // // // // // //   console.log("[SW] Installing service worker...")
// // // // // // // //   event.waitUntil(
// // // // // // // //     caches.open(CACHE_NAME).then((cache) => {
// // // // // // // //       console.log("[SW] Caching static assets")
// // // // // // // //       return cache.addAll(STATIC_ASSETS)
// // // // // // // //     }),
// // // // // // // //   )
// // // // // // // //   self.skipWaiting()
// // // // // // // // })

// // // // // // // // // Activate event - clean up old caches
// // // // // // // // self.addEventListener("activate", (event) => {
// // // // // // // //   console.log("[SW] Activating service worker...")
// // // // // // // //   event.waitUntil(
// // // // // // // //     caches.keys().then((cacheNames) => {
// // // // // // // //       return Promise.all(
// // // // // // // //         cacheNames.map((cacheName) => {
// // // // // // // //           if (cacheName !== CACHE_NAME) {
// // // // // // // //             console.log("[SW] Deleting old cache:", cacheName)
// // // // // // // //             return caches.delete(cacheName)
// // // // // // // //           }
// // // // // // // //         }),
// // // // // // // //       )
// // // // // // // //     }),
// // // // // // // //   )
// // // // // // // //   self.clients.claim()
// // // // // // // // })

// // // // // // // // self.addEventListener("message", (event) => {
// // // // // // // //   if (event.data && event.data.type === "SKIP_WAITING") {
// // // // // // // //     console.log("[SW] Skipping waiting and activating new service worker")
// // // // // // // //     self.skipWaiting()
// // // // // // // //   }
// // // // // // // // })

// // // // // // // // // Fetch event - serve from cache, fallback to network
// // // // // // // // self.addEventListener("fetch", (event) => {
// // // // // // // //   // Skip non-GET requests
// // // // // // // //   if (event.request.method !== "GET") return

// // // // // // // //   // Skip chrome extensions and other non-http requests
// // // // // // // //   if (!event.request.url.startsWith("http")) return

// // // // // // // //   event.respondWith(
// // // // // // // //     caches.match(event.request).then((cachedResponse) => {
// // // // // // // //       if (cachedResponse) {
// // // // // // // //         return cachedResponse
// // // // // // // //       }

// // // // // // // //       return fetch(event.request)
// // // // // // // //         .then((response) => {
// // // // // // // //           // Don't cache non-successful responses
// // // // // // // //           if (!response || response.status !== 200 || response.type === "error") {
// // // // // // // //             return response
// // // // // // // //           }

// // // // // // // //           // Clone the response
// // // // // // // //           const responseToCache = response.clone()

// // // // // // // //           // Cache API responses and pages
// // // // // // // //           if (event.request.url.includes("/api/") || event.request.destination === "document") {
// // // // // // // //             caches.open(CACHE_NAME).then((cache) => {
// // // // // // // //               cache.put(event.request, responseToCache)
// // // // // // // //             })
// // // // // // // //           }

// // // // // // // //           return response
// // // // // // // //         })
// // // // // // // //         .catch(() => {
// // // // // // // //           // Return offline page for navigation requests
// // // // // // // //           if (event.request.destination === "document") {
// // // // // // // //             return caches.match(OFFLINE_URL)
// // // // // // // //           }
// // // // // // // //         })
// // // // // // // //     }),
// // // // // // // //   )
// // // // // // // // })

// // // // // // // // // Push notification event
// // // // // // // // self.addEventListener("push", (event) => {
// // // // // // // //   console.log("[SW] Push notification received")

// // // // // // // //   const data = event.data ? event.data.json() : {}
// // // // // // // //   const title = data.title || "Face Attendence Notification"
// // // // // // // //   const options = {
// // // // // // // //     body: data.body || "You have a new notification",
// // // // // // // //     icon: "/logo3.jpg",
// // // // // // // //     badge: "/logo3.jpg",
// // // // // // // //     vibrate: [200, 100, 200],
// // // // // // // //     data: data.data || {},
// // // // // // // //     actions: data.actions || [],
// // // // // // // //   }

// // // // // // // //   event.waitUntil(self.registration.showNotification(title, options))
// // // // // // // // })

// // // // // // // // // Notification click event
// // // // // // // // self.addEventListener("notificationclick", (event) => {
// // // // // // // //   console.log("[SW] Notification clicked")
// // // // // // // //   event.notification.close()

// // // // // // // //   const urlToOpen = event.notification.data?.url || "/"

// // // // // // // //   event.waitUntil(
// // // // // // // //     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
// // // // // // // //       // Check if there's already a window open
// // // // // // // //       for (const client of clientList) {
// // // // // // // //         if (client.url === urlToOpen && "focus" in client) {
// // // // // // // //           return client.focus()
// // // // // // // //         }
// // // // // // // //       }
// // // // // // // //       // Open new window if none exists
// // // // // // // //       if (clients.openWindow) {
// // // // // // // //         return clients.openWindow(urlToOpen)
// // // // // // // //       }
// // // // // // // //     }),
// // // // // // // //   )
// // // // // // // // })




// // // // // // // const CACHE_NAME = "Face Attendece-v1.2.0"
// // // // // // // const OFFLINE_URL = "/offline"

// // // // // // // // Assets to cache on install
// // // // // // // const STATIC_ASSETS = [
// // // // // // //   "/",
// // // // // // //   "/offline",
// // // // // // //   "/login",
// // // // // // //   "/manifest.json",
// // // // // // //   "/logo3.jpg",
// // // // // // //   "/logo3.jpg",
// // // // // // // ]

// // // // // // // // Install event - cache static assets
// // // // // // // self.addEventListener("install", (event) => {
// // // // // // //   console.log("[SW] Installing service worker...")
// // // // // // //   event.waitUntil(
// // // // // // //     caches.open(CACHE_NAME).then((cache) => {
// // // // // // //       console.log("[SW] Caching static assets")
// // // // // // //       return cache.addAll(STATIC_ASSETS)
// // // // // // //     }),
// // // // // // //   )
// // // // // // //   self.skipWaiting()
// // // // // // // })

// // // // // // // // Activate event - clean up old caches
// // // // // // // self.addEventListener("activate", (event) => {
// // // // // // //   console.log("[SW] Activating service worker...")
// // // // // // //   event.waitUntil(
// // // // // // //     caches.keys().then((cacheNames) => {
// // // // // // //       return Promise.all(
// // // // // // //         cacheNames.map((cacheName) => {
// // // // // // //           if (cacheName !== CACHE_NAME) {
// // // // // // //             console.log("[SW] Deleting old cache:", cacheName)
// // // // // // //             return caches.delete(cacheName)
// // // // // // //           }
// // // // // // //         }),
// // // // // // //       )
// // // // // // //     }),
// // // // // // //   )
// // // // // // //   self.clients.claim()
// // // // // // // })

// // // // // // // self.addEventListener("message", (event) => {
// // // // // // //   if (event.data && event.data.type === "SKIP_WAITING") {
// // // // // // //     console.log("[SW] Skipping waiting and activating new service worker")
// // // // // // //     self.skipWaiting()
// // // // // // //   }
// // // // // // // })

// // // // // // // // Fetch event - serve from cache, fallback to network
// // // // // // // self.addEventListener("fetch", (event) => {
// // // // // // //   // Skip non-GET requests
// // // // // // //   if (event.request.method !== "GET") return

// // // // // // //   // Skip chrome extensions and other non-http requests
// // // // // // //   if (!event.request.url.startsWith("http")) return

// // // // // // //   event.respondWith(
// // // // // // //     caches.match(event.request).then((cachedResponse) => {
// // // // // // //       if (cachedResponse) {
// // // // // // //         return cachedResponse
// // // // // // //       }

// // // // // // //       return fetch(event.request)
// // // // // // //         .then((response) => {
// // // // // // //           // Don't cache non-successful responses
// // // // // // //           if (!response || response.status !== 200 || response.type === "error") {
// // // // // // //             return response
// // // // // // //           }

// // // // // // //           // Clone the response
// // // // // // //           const responseToCache = response.clone()

// // // // // // //           // Cache API responses and pages
// // // // // // //           if (event.request.url.includes("/api/") || event.request.destination === "document") {
// // // // // // //             caches.open(CACHE_NAME).then((cache) => {
// // // // // // //               cache.put(event.request, responseToCache)
// // // // // // //             })
// // // // // // //           }

// // // // // // //           return response
// // // // // // //         })
// // // // // // //         .catch(() => {
// // // // // // //           // Return offline page for navigation requests
// // // // // // //           if (event.request.destination === "document") {
// // // // // // //             return caches.match(OFFLINE_URL)
// // // // // // //           }
// // // // // // //         })
// // // // // // //     }),
// // // // // // //   )
// // // // // // // })

// // // // // // // // Push notification event
// // // // // // // self.addEventListener("push", (event) => {
// // // // // // //   console.log("[SW] Push notification received")

// // // // // // //   const data = event.data ? event.data.json() : {}
// // // // // // //   const title = data.title || "Face Attendece Notification"
// // // // // // //   const options = {
// // // // // // //     body: data.body || "You have a new notification",
// // // // // // //     icon: "/logo3.jpg",
// // // // // // //     badge: "/logo3.jpg",
// // // // // // //     vibrate: [200, 100, 200],
// // // // // // //     data: data.data || {},
// // // // // // //     actions: data.actions || [],
// // // // // // //   }

// // // // // // //   event.waitUntil(self.registration.showNotification(title, options))
// // // // // // // })

// // // // // // // // Notification click event
// // // // // // // self.addEventListener("notificationclick", (event) => {
// // // // // // //   console.log("[SW] Notification clicked")
// // // // // // //   event.notification.close()

// // // // // // //   const urlToOpen = event.notification.data?.url || "/"

// // // // // // //   event.waitUntil(
// // // // // // //     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
// // // // // // //       // Check if there's already a window open
// // // // // // //       for (const client of clientList) {
// // // // // // //         if (client.url === urlToOpen && "focus" in client) {
// // // // // // //           return client.focus()
// // // // // // //         }
// // // // // // //       }
// // // // // // //       // Open new window if none exists
// // // // // // //       if (clients.openWindow) {
// // // // // // //         return clients.openWindow(urlToOpen)
// // // // // // //       }
// // // // // // //     }),
// // // // // // //   )
// // // // // // // })





// // // // // // const CACHE_NAME = "Face Attendance-v1.2.1"
// // // // // // const OFFLINE_URL = "/offline"

// // // // // // // Assets to cache on install (only critical assets)
// // // // // // const STATIC_ASSETS = [
// // // // // //   "/",
// // // // // //   "/offline",
// // // // // //   "/login",
// // // // // //   "/manifest.json",
// // // // // //   "/logo3.jpg",
// // // // // //   "/logo3.jpg",
// // // // // // ]

// // // // // // const CACHE_BLACKLIST = ["/api/", "/models/", ".jpg", ".jpeg", ".png", ".gif", ".webp", "cloudinary.com", "blob.v0.app"]

// // // // // // self.addEventListener("install", (event) => {
// // // // // //   console.log("[SW] Installing service worker...")
// // // // // //   event.waitUntil(
// // // // // //     caches.open(CACHE_NAME).then((cache) => {
// // // // // //       console.log("[SW] Caching static assets")
// // // // // //       return cache.addAll(STATIC_ASSETS).catch((err) => {
// // // // // //         console.error("[SW] Failed to cache assets:", err)
// // // // // //       })
// // // // // //     }),
// // // // // //   )
// // // // // //   self.skipWaiting()
// // // // // // })

// // // // // // self.addEventListener("activate", (event) => {
// // // // // //   console.log("[SW] Activating service worker...")
// // // // // //   event.waitUntil(
// // // // // //     caches.keys().then((cacheNames) => {
// // // // // //       return Promise.all(
// // // // // //         cacheNames.map((cacheName) => {
// // // // // //           if (cacheName !== CACHE_NAME) {
// // // // // //             console.log("[SW] Deleting old cache:", cacheName)
// // // // // //             return caches.delete(cacheName)
// // // // // //           }
// // // // // //         }),
// // // // // //       )
// // // // // //     }),
// // // // // //   )
// // // // // //   self.clients.claim()
// // // // // // })

// // // // // // self.addEventListener("message", (event) => {
// // // // // //   if (event.data && event.data.type === "SKIP_WAITING") {
// // // // // //     console.log("[SW] Skipping waiting and activating new service worker")
// // // // // //     self.skipWaiting()
// // // // // //   }
// // // // // // })

// // // // // // self.addEventListener("fetch", (event) => {
// // // // // //   if (event.request.method !== "GET") return
// // // // // //   if (!event.request.url.startsWith("http")) return

// // // // // //   const shouldCache = !CACHE_BLACKLIST.some((pattern) => event.request.url.includes(pattern))

// // // // // //   event.respondWith(
// // // // // //     fetch(event.request)
// // // // // //       .then((response) => {
// // // // // //         // Don't cache non-successful responses
// // // // // //         if (!response || response.status !== 200 || response.type === "error") {
// // // // // //           return response
// // // // // //         }

// // // // // //         if (
// // // // // //           shouldCache &&
// // // // // //           (event.request.destination === "document" ||
// // // // // //             event.request.destination === "script" ||
// // // // // //             event.request.destination === "style")
// // // // // //         ) {
// // // // // //           const responseToCache = response.clone()
// // // // // //           caches.open(CACHE_NAME).then((cache) => {
// // // // // //             cache.put(event.request, responseToCache)
// // // // // //           })
// // // // // //         }

// // // // // //         return response
// // // // // //       })
// // // // // //       .catch(() => {
// // // // // //         // Fallback to cache on network failure
// // // // // //         return caches.match(event.request).then((cachedResponse) => {
// // // // // //           if (cachedResponse) {
// // // // // //             return cachedResponse
// // // // // //           }
// // // // // //           // Return offline page for navigation requests
// // // // // //           if (event.request.destination === "document") {
// // // // // //             return caches.match(OFFLINE_URL)
// // // // // //           }
// // // // // //         })
// // // // // //       }),
// // // // // //   )
// // // // // // })

// // // // // // self.addEventListener("push", (event) => {
// // // // // //   console.log("[SW] Push notification received")

// // // // // //   const data = event.data ? event.data.json() : {}
// // // // // //   const title = data.title || "Face Attendance Notification"
// // // // // //   const options = {
// // // // // //     body: data.body || "You have a new notification",
// // // // // //     icon: "/logo3.jpg",
// // // // // //     badge: "/logo3.jpg",
// // // // // //     vibrate: [200, 100, 200],
// // // // // //     data: data.data || {},
// // // // // //     actions: data.actions || [],
// // // // // //   }

// // // // // //   event.waitUntil(self.registration.showNotification(title, options))
// // // // // // })

// // // // // // self.addEventListener("notificationclick", (event) => {
// // // // // //   console.log("[SW] Notification clicked")
// // // // // //   event.notification.close()

// // // // // //   const urlToOpen = event.notification.data?.url || "/"

// // // // // //   event.waitUntil(
// // // // // //     clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
// // // // // //       for (const client of clientList) {
// // // // // //         if (client.url === urlToOpen && "focus" in client) {
// // // // // //           return client.focus()
// // // // // //         }
// // // // // //       }
// // // // // //       if (clients.openWindow) {
// // // // // //         return clients.openWindow(urlToOpen)
// // // // // //       }
// // // // // //     }),
// // // // // //   )
// // // // // // })





// // // // // const CACHE_NAME = "genamplify-v1.2.1"
// // // // // const OFFLINE_URL = "/offline"

// // // // // // Assets to cache on install (only critical assets)
// // // // // const STATIC_ASSETS = [
// // // // //   "/",
// // // // //   "/offline",
// // // // //   "/login",
// // // // //   "/manifest.json",
// // // // //   "/icons/icon-192x192.png",
// // // // //   "/icons/icon-512x512.png",
// // // // // ]

// // // // // const CACHE_BLACKLIST = ["/api/", "/models/", ".jpg", ".jpeg", ".png", ".gif", ".webp", "cloudinary.com", "blob.v0.app"]

// // // // // let notificationCount = 0

// // // // // // Helper to update badge count
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
// // // // //     updateBadgeCount(0) // Update badge without changing count
// // // // //   } else if (event.data && event.data.type === "CLEAR_BADGE") {
// // // // //     notificationCount = 0
// // // // //     updateBadgeCount(0)
// // // // //   }
// // // // // })

// // // // // self.addEventListener("fetch", (event) => {
// // // // //   if (event.request.method !== "GET") return
// // // // //   if (!event.request.url.startsWith("http")) return

// // // // //   const shouldCache = !CACHE_BLACKLIST.some((pattern) => event.request.url.includes(pattern))

// // // // //   event.respondWith(
// // // // //     fetch(event.request)
// // // // //       .then((response) => {
// // // // //         // Don't cache non-successful responses
// // // // //         if (!response || response.status !== 200 || response.type === "error") {
// // // // //           return response
// // // // //         }

// // // // //         if (
// // // // //           shouldCache &&
// // // // //           (event.request.destination === "document" ||
// // // // //             event.request.destination === "script" ||
// // // // //             event.request.destination === "style")
// // // // //         ) {
// // // // //           const responseToCache = response.clone()
// // // // //           caches.open(CACHE_NAME).then((cache) => {
// // // // //             cache.put(event.request, responseToCache)
// // // // //           })
// // // // //         }

// // // // //         return response
// // // // //       })
// // // // //       .catch(() => {
// // // // //         // Fallback to cache on network failure
// // // // //         return caches.match(event.request).then((cachedResponse) => {
// // // // //           if (cachedResponse) {
// // // // //             return cachedResponse
// // // // //           }
// // // // //           // Return offline page for navigation requests
// // // // //           if (event.request.destination === "document") {
// // // // //             return caches.match(OFFLINE_URL)
// // // // //           }
// // // // //         })
// // // // //       }),
// // // // //   )
// // // // // })

// // // // // self.addEventListener("push", (event) => {
// // // // //   console.log("[SW] Push notification received")

// // // // //   const data = event.data ? event.data.json() : {}
// // // // //   const title = data.title || "Genamplify Notification"
// // // // //   const options = {
// // // // //     body: data.body || "You have a new notification",
// // // // //     icon: "/icons/icon-192x192.png",
// // // // //     badge: "/icons/icon-72x72.png",
// // // // //     vibrate: [200, 100, 200],
// // // // //     data: data.data || {},
// // // // //     actions: data.actions || [],
// // // // //     tag: data.tag || "notification",
// // // // //     requireInteraction: data.requireInteraction || false,
// // // // //     silent: false, // Enable sound
// // // // //   }

// // // // //   event.waitUntil(
// // // // //     Promise.all([
// // // // //       self.registration.showNotification(title, options),
// // // // //       updateBadgeCount(1), // Increment badge count
// // // // //       // Play sound by sending message to clients
// // // // //       self.clients
// // // // //         .matchAll({ type: "window", includeUncontrolled: true })
// // // // //         .then((clients) => {
// // // // //           clients.forEach((client) => {
// // // // //             client.postMessage({
// // // // //               type: "PLAY_NOTIFICATION_SOUND",
// // // // //               notification: { title, body: options.body },
// // // // //             })
// // // // //           })
// // // // //         }),
// // // // //     ]),
// // // // //   )
// // // // // })

// // // // // self.addEventListener("notificationclick", (event) => {
// // // // //   console.log("[SW] Notification clicked")
// // // // //   event.notification.close()

// // // // //   // Decrement badge count
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



// // // // const CACHE_NAME = "face-attendance-v1.2.1"
// // // // const OFFLINE_URL = "/offline"

// // // // // Assets to cache on install (only critical assets)
// // // // const STATIC_ASSETS = ["/", "/offline", "/login", "/manifest.json", "/logo3.jpg"]

// // // // const CACHE_BLACKLIST = ["/api/", "/models/", ".jpg", ".jpeg", ".png", ".gif", ".webp", "cloudinary.com", "blob.v0.app"]

// // // // let notificationCount = 0

// // // // // Helper to update badge count
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
// // // //     updateBadgeCount(0) // Update badge without changing count
// // // //   } else if (event.data && event.data.type === "CLEAR_BADGE") {
// // // //     notificationCount = 0
// // // //     updateBadgeCount(0)
// // // //   }
// // // // })

// // // // self.addEventListener("fetch", (event) => {
// // // //   if (event.request.method !== "GET") return
// // // //   if (!event.request.url.startsWith("http")) return

// // // //   const shouldCache = !CACHE_BLACKLIST.some((pattern) => event.request.url.includes(pattern))

// // // //   event.respondWith(
// // // //     fetch(event.request)
// // // //       .then((response) => {
// // // //         // Don't cache non-successful responses
// // // //         if (!response || response.status !== 200 || response.type === "error") {
// // // //           return response
// // // //         }

// // // //         if (
// // // //           shouldCache &&
// // // //           (event.request.destination === "document" ||
// // // //             event.request.destination === "script" ||
// // // //             event.request.destination === "style")
// // // //         ) {
// // // //           const responseToCache = response.clone()
// // // //           caches.open(CACHE_NAME).then((cache) => {
// // // //             cache.put(event.request, responseToCache)
// // // //           })
// // // //         }

// // // //         return response
// // // //       })
// // // //       .catch(() => {
// // // //         // Fallback to cache on network failure
// // // //         return caches.match(event.request).then((cachedResponse) => {
// // // //           if (cachedResponse) {
// // // //             return cachedResponse
// // // //           }
// // // //           // Return offline page for navigation requests
// // // //           if (event.request.destination === "document") {
// // // //             return caches.match(OFFLINE_URL)
// // // //           }
// // // //         })
// // // //       }),
// // // //   )
// // // // })

// // // // self.addEventListener("push", (event) => {
// // // //   console.log("[SW] Push notification received")

// // // //   const data = event.data ? event.data.json() : {}
// // // //   const title = data.title || "Face Attendance Notification"
// // // //   const options = {
// // // //     body: data.body || "You have a new notification",
// // // //     icon: "/logo3.jpg",
// // // //     badge: "/logo3.jpg",
// // // //     vibrate: [200, 100, 200],
// // // //     data: data.data || {},
// // // //     actions: data.actions || [],
// // // //     tag: data.tag || "notification",
// // // //     requireInteraction: data.requireInteraction || false,
// // // //     silent: false, // Enable sound
// // // //   }

// // // //   event.waitUntil(
// // // //     Promise.all([
// // // //       self.registration.showNotification(title, options),
// // // //       updateBadgeCount(1), // Increment badge count
// // // //       // Play sound by sending message to clients
// // // //       self.clients
// // // //         .matchAll({ type: "window", includeUncontrolled: true })
// // // //         .then((clients) => {
// // // //           clients.forEach((client) => {
// // // //             client.postMessage({
// // // //               type: "PLAY_NOTIFICATION_SOUND",
// // // //               notification: { title, body: options.body },
// // // //             })
// // // //           })
// // // //         }),
// // // //     ]),
// // // //   )
// // // // })

// // // // self.addEventListener("notificationclick", (event) => {
// // // //   console.log("[SW] Notification clicked")
// // // //   event.notification.close()

// // // //   // Decrement badge count
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


// // // const CACHE_NAME = "face-attendance-v1.3.0"
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
// // //             return new Response("Offline", { status: 503 })
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
// // //           return new Response("Offline", { status: 503 })
// // //         })
// // //       }),
// // //     )
// // //   }
// // // })

// // // self.addEventListener("push", (event) => {
// // //   console.log("[SW] Push notification received")

// // //   const data = event.data ? event.data.json() : {}
// // //   const title = data.title || "Face Attendance Notification"
// // //   const options = {
// // //     body: data.body || "You have a new notification",
// // //     icon: "/logo3.jpg",
// // //     badge: "/logo3.jpg",
// // //     vibrate: [200, 100, 200],
// // //     data: data.data || {},
// // //     actions: data.actions || [],
// // //     tag: data.tag || "notification",
// // //     requireInteraction: data.requireInteraction || false,
// // //     silent: false,
// // //   }

// // //   event.waitUntil(
// // //     Promise.all([
// // //       self.registration.showNotification(title, options),
// // //       updateBadgeCount(1),
// // //       self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
// // //         clients.forEach((client) => {
// // //           client.postMessage({
// // //             type: "PLAY_NOTIFICATION_SOUND",
// // //             notification: { title, body: options.body },
// // //           })
// // //         })
// // //       }),
// // //     ]),
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
// //             return new Response("Offline", { status: 503 })
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
// //           return new Response("Offline", { status: 503 })
// //         })
// //       }),
// //     )
// //   }
// // })

// // self.addEventListener("push", (event) => {
// //   console.log("[SW] Push notification received:", event.data?.text())

// //   const data = event.data ? event.data.json() : {}
// //   const title = data.title || "Face Attendance Notification"
// //   const options = {
// //     body: data.body || "You have a new notification",
// //     icon: "/logo3.jpg",
// //     badge: "/logo3.jpg",
// //     vibrate: [200, 100, 200],
// //     data: data.data || {},
// //     actions: data.actions || [],
// //     tag: data.tag || "notification",
// //     requireInteraction: data.requireInteraction || false,
// //     silent: false,
// //     sound: "/sounds/notification.mp3",
// //   }

// //   event.waitUntil(
// //     Promise.all([
// //       self.registration.showNotification(title, options),
// //       updateBadgeCount(1),
// //       self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
// //         console.log("[SW] Sending PLAY_NOTIFICATION_SOUND to", clients.length, "clients")
// //         clients.forEach((client) => {
// //           client.postMessage({
// //             type: "PLAY_NOTIFICATION_SOUND",
// //             notification: { title, body: options.body },
// //           })
// //         })
// //       }),
// //     ]),
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

// const CACHE_BLACKLIST = ["/api/", "/models/", "cloudinary.com"]

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
//   }
// })

// self.addEventListener("fetch", (event) => {
//   if (event.request.method !== "GET") return
//   if (!event.request.url.startsWith("http")) return

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
//             return new Response("Offline", { status: 503 })
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
//           return new Response("Offline", { status: 503 })
//         })
//       }),
//     )
//   }
// })

// self.addEventListener("push", (event) => {
//   console.log("[SW] Push notification received:", event.data?.text())

//   const data = event.data ? event.data.json() : {}
//   const title = data.title || "Face Attendance Notification"
//   const options = {
//     body: data.body || "You have a new notification",
//     icon: "/logo3.jpg",
//     badge: "/logo3.jpg",
//     vibrate: [200, 100, 200],
//     data: data.data || {},
//     actions: data.actions || [],
//     tag: data.tag || "notification",
//     requireInteraction: data.requireInteraction || false,
//     silent: false,
//     sound: "/sounds/notification.mp3",
//   }

//   console.log("[SW] Showing notification with title:", title)
//   console.log("[SW] Notification options:", options)

//   event.waitUntil(
//     Promise.all([
//       self.registration.showNotification(title, options),
//       updateBadgeCount(1),
//       self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
//         console.log("[SW] Found", clients.length, "client(s) to send sound message")
//         clients.forEach((client) => {
//           console.log("[SW] Sending PLAY_NOTIFICATION_SOUND to client:", client.id)
//           client.postMessage({
//             type: "PLAY_NOTIFICATION_SOUND",
//             notification: { title, body: options.body },
//           })
//         })
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

const CACHE_BLACKLIST = ["/api/", "/models/", "cloudinary.com"]

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
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      console.log("[SW] Broadcasting sound message to", clients.length, "client(s)")
      clients.forEach((client) => {
        client.postMessage({
          type: "PLAY_NOTIFICATION_SOUND",
          notification: event.data.notification || { title: "Test", body: "Test notification" },
        })
      })
    })
  }
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return
  if (!event.request.url.startsWith("http")) return

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
            return new Response("Offline", { status: 503 })
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
          return new Response("Offline", { status: 503 })
        })
      }),
    )
  }
})

self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received:", event.data?.text())

  const data = event.data ? event.data.json() : {}
  const title = data.title || "Face Attendance Notification"
  const options = {
    body: data.body || "You have a new notification",
    icon: "/logo3.jpg",
    badge: "/logo3.jpg",
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || [],
    tag: data.tag || "notification",
    requireInteraction: data.requireInteraction || false,
    silent: false,
    sound: "/sounds/notification.mp3",
  }

  console.log("[SW] Showing notification with title:", title)
  console.log("[SW] Notification options:", options)

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      updateBadgeCount(1),
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
        console.log("[SW] Found", clients.length, "client(s) to send sound message")
        clients.forEach((client) => {
          console.log("[SW] Sending PLAY_NOTIFICATION_SOUND to client:", client.id)
          client.postMessage({
            type: "PLAY_NOTIFICATION_SOUND",
            notification: { title, body: options.body },
          })
        })
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

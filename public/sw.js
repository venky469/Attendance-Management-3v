const CACHE_NAME = "faceattend-v1"
const OFFLINE_URL = "/offline"

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/login",
  "/manifest.json",
  "/logo3.jpg",
  "/logo3.jpg",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...")
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching static assets")
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...")
  event.waitUntil(
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
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return

  // Skip chrome extensions and other non-http requests
  if (!event.request.url.startsWith("http")) return

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === "error") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache API responses and pages
          if (event.request.url.includes("/api/") || event.request.destination === "document") {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }

          return response
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === "document") {
            return caches.match(OFFLINE_URL)
          }
        })
    }),
  )
})

// Push notification event
self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received")

  const data = event.data ? event.data.json() : {}
  const title = data.title || "Face Attendece Notification"
  const options = {
    body: data.body || "You have a new notification",
    icon: "/logo3.jpg",
    badge: "/logo3.jpg",
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || [],
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked")
  event.notification.close()

  const urlToOpen = event.notification.data?.url || "/"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus()
        }
      }
      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    }),
  )
})

"use client"

/**
 * localStorage-based cache provider for SWR
 * Enables persistent caching across page reloads (Instagram-like instant loading)
 */

interface CacheItem {
  data: any
  timestamp: number
}

const CACHE_PREFIX = "swr-cache-"
const MAX_CACHE_AGE = 24 * 60 * 60 * 1000 // 24 hours

export function localStorageProvider() {
  // Create a map to store cache in memory during runtime
  const map = new Map<string, any>(
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("app-cache") || "[]") : [],
  )

  // Cleanup old cache entries on initialization
  if (typeof window !== "undefined") {
    cleanupOldCache()
  }

  // Save cache to localStorage before page unload
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      const appCache = JSON.stringify(Array.from(map.entries()))
      localStorage.setItem("app-cache", appCache)
    })
  }

  return map
}

/**
 * Remove cache entries older than MAX_CACHE_AGE
 */
function cleanupOldCache() {
  try {
    const now = Date.now()
    const keys = Object.keys(localStorage)

    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const item: CacheItem = JSON.parse(localStorage.getItem(key) || "{}")
          if (now - item.timestamp > MAX_CACHE_AGE) {
            localStorage.removeItem(key)
          }
        } catch {
          // Invalid cache entry, remove it
          localStorage.removeItem(key)
        }
      }
    })
  } catch (error) {
    console.warn("[v0] Cache cleanup failed:", error)
  }
}

/**
 * Get cache size in MB
 */
export function getCacheSize(): number {
  try {
    let total = 0
    for (const key in localStorage) {
      if (key.startsWith(CACHE_PREFIX)) {
        total += (localStorage[key].length + key.length) * 2 // UTF-16 uses 2 bytes per char
      }
    }
    return total / (1024 * 1024) // Convert to MB
  } catch {
    return 0
  }
}

/**
 * Clear all SWR cache
 */
export function clearCache() {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX) || key === "app-cache") {
        localStorage.removeItem(key)
      }
    })
    console.log("[v0] Cache cleared successfully")
  } catch (error) {
    console.warn("[v0] Failed to clear cache:", error)
  }
}

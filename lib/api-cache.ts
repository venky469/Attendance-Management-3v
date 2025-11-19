type CacheEntry<T> = {
  data: T
  timestamp: number
  ttl: number
}

class APICache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private maxSize: number = 1000 // Maximum cache entries

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    // Check if cache has expired
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data as T
  }

  invalidate(key: string): void {
    this.cache.delete(key)
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern)
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

export const apiCache = new APICache()

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  // Check cache first
  const cached = apiCache.get<T>(key)
  if (cached !== null) {
    console.log(`[Cache] HIT: ${key}`)
    return cached
  }

  // Fetch fresh data
  console.log(`[Cache] MISS: ${key}`)
  const data = await fetcher()
  
  // Store in cache
  apiCache.set(key, data, ttlSeconds)
  
  return data
}

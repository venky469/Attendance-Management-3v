



"use client"

import type React from "react"

import { SWRConfig } from "swr"
import { localStorageProvider } from "@/lib/swr-cache-provider"

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url)

    // Handle offline or server errors gracefully
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()
    return data
  } catch (error: any) {
    // If offline, SWR will use cached data automatically
    if (error.message?.includes("Failed to fetch") || !navigator.onLine) {
      console.log("[v0] Offline - using cached data")
      throw error
    }
    throw error
  }
}

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: localStorageProvider,
        fetcher,
        revalidateOnFocus: false, // Don't reload when switching tabs
        revalidateOnReconnect: false, // Don't reload on reconnect
        dedupingInterval: 60000, // Dedupe requests for 60 seconds
        focusThrottleInterval: 300000, // Only revalidate on focus every 5 minutes
        loadingTimeout: 5000, // Show error after 5 seconds
        errorRetryCount: 2, // Retry failed requests 2 times
        errorRetryInterval: 10000, // Wait 10 seconds between retries
        // Keep previous data while revalidating (instant loading from cache)
        keepPreviousData: true,
        // Fallback to cache when offline
        onError: (error, key) => {
          if (error.message?.includes("Failed to fetch") || error.message?.includes("Offline")) {
            console.log("[v0] Using cached data for:", key)
          }
        },
        refreshInterval: 300000, // Background refresh every 5 minutes
        // Don't revalidate on mount if cache exists
        revalidateIfStale: false,
      }}
    >
      {children}
    </SWRConfig>
  )
}

"use client"

import type React from "react"

import { SWRConfig } from "swr"
import { localStorageProvider } from "@/lib/swr-cache-provider"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: localStorageProvider,
        fetcher,
        // Instagram-like instant loading configuration
        revalidateOnFocus: true, // Refresh when user returns to tab
        revalidateOnReconnect: true, // Refresh when internet reconnects
        dedupingInterval: 2000, // Dedupe requests within 2 seconds
        focusThrottleInterval: 5000, // Throttle focus revalidation to 5 seconds
        loadingTimeout: 3000, // Show error if loading takes more than 3 seconds
        errorRetryCount: 3, // Retry failed requests 3 times
        errorRetryInterval: 5000, // Wait 5 seconds between retries
        // Keep previous data while revalidating (instant loading)
        keepPreviousData: true,
        // Fallback to cache when offline
        onError: (error, key) => {
          if (error.message.includes("Failed to fetch")) {
            console.log("[v0] Using cached data for:", key)
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}

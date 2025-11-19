import type { SWRConfiguration } from 'swr'

export const swrConfig: SWRConfiguration = {
  // Cache data for 5 minutes by default
  dedupingInterval: 5 * 60 * 1000,
  
  // Revalidate on focus only for critical data
  revalidateOnFocus: false,
  
  // Revalidate on reconnect
  revalidateOnReconnect: true,
  
  // Don't revalidate on mount if data exists
  revalidateIfStale: false,
  
  // Retry on error (max 3 times)
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  
  // Keep data fresh for 5 minutes
  focusThrottleInterval: 5 * 60 * 1000,
  
  // Use stale data while revalidating
  keepPreviousData: true,
}

export const criticalDataConfig: SWRConfiguration = {
  ...swrConfig,
  revalidateOnFocus: true,
  dedupingInterval: 2 * 60 * 1000, // 2 minutes for critical data
}

export const staticDataConfig: SWRConfiguration = {
  ...swrConfig,
  dedupingInterval: 30 * 60 * 1000, // 30 minutes for static data
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
}

export const realtimeDataConfig: SWRConfiguration = {
  ...swrConfig,
  dedupingInterval: 30 * 1000, // 30 seconds for real-time data
  revalidateOnFocus: true,
  refreshInterval: 30 * 1000, // Auto refresh every 30 seconds
}

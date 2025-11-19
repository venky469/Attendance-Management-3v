"use client"

import { useHeartbeat } from "@/hooks/use-heartbeat"

/**
 * Component that tracks user online status via periodic heartbeats
 * Placed in root layout to track all authenticated users
 */
export function HeartbeatTracker() {
  // Send heartbeat every 60 seconds (1 minute)
  useHeartbeat(60000)
  
  // This component doesn't render anything
  return null
}

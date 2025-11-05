"use client"

import { useEffect } from "react"
import { resumeSessionTracking } from "@/lib/session-tracker"

export function SessionResume() {
  useEffect(() => {
    // Resume session tracking if a session exists
    resumeSessionTracking()
  }, [])

  return null
}

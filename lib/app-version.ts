
// App version and feature tracking
export const APP_VERSION = "1.5.0"
export const CACHE_VERSION = "face-attendance-v1.5.0"

export interface FeatureUpdate {
  version: string
  date: string
  features: string[]
}

// Feature changelog - update this when adding new features
export const FEATURE_UPDATES: FeatureUpdate[] = [
  {
    version: "1.5.0",
    date: "2025-01-17",
    features: [
      "Instagram-style mobile bottom navigation with swipe gestures",
      "Swipe left/right to navigate between pages on mobile",
      "Different notification sounds for leave requests, approvals, and rejections",
      "Real-time polling for instant push notifications (no cron job needed)",
      "Moved analytics graphs from Dashboard to Reports & Analytics page",
      "Added three-dots menu for notification actions",
      "Removed role names from notification display (shows only names)",
      "Fixed push notification toggle with better error handling",
      "Added loading skeleton for Settings page",
      "Updated notification branding with institution name",
      "Enhanced mobile UI with dedicated Profile page",
      "Improved notification sound reliability with user interaction detection",
    ],
  },
  {
    version: "1.4.0",
    date: "2025-01-16",
    features: [
      "Real-time notification system with sound alerts",
      "Instant notification count updates across all devices",
      "Notification badge clearing when viewing notifications",
      "Push notifications for mobile (works even when app is closed)",
      "Improved notification sound playback",
      "Fixed notification count synchronization",
      "Enhanced update detection system",
    ],
  },
  {
    version: "1.3.0",
    date: "2025-01-15",
    features: [
      "Rebranded to Face Attendance with new logo",
      "Custom date range export for attendance reports",
      "Role-based export restrictions (SuperAdmin can export all institutions)",
      "Advanced attendance filters (person type, status, date presets)",
      "Improved mobile menu with scrolling and version display",
      "Updated navigation labels (Live Attendance, Attendance Reports)",
      "SuperAdmin access to Settings",
      "Optimized app loading speed with lazy loading",
      "Enhanced PWA caching for faster performance",
    ],
  },
  {
    version: "1.2.0",
    date: "2024-01-15",
    features: [
      "Login History with Device Name tracking",
      "Location tracking for login attempts",
      "Session Duration monitoring",
      "Enhanced security with device fingerprinting",
      "Real-time activity tracking",
    ],
  },
  {
    version: "1.1.0",
    date: "2024-01-10",
    features: [
      "Face recognition improvements",
      "PWA offline support",
      "Push notifications",
      "Performance optimizations",
    ],
  },
  {
    version: "1.0.0",
    date: "2024-01-01",
    features: ["Initial release", "Employee management", "Attendance tracking", "Face ID recognition"],
  },
]

// Get the latest feature update
export function getLatestUpdate(): FeatureUpdate {
  return FEATURE_UPDATES[0]
}

// Get features since a specific version
export function getFeaturesSince(version: string): string[] {
  const features: string[] = []
  for (const update of FEATURE_UPDATES) {
    if (update.version === version) break
    features.push(...update.features)
  }
  return features
}

// Check if update is available
export function isUpdateAvailable(currentVersion: string): boolean {
  return currentVersion !== APP_VERSION
}

// // App version and feature tracking
// export const APP_VERSION = "1.3.0"
// export const CACHE_VERSION = "face-attendance-v1.3.0"

// export interface FeatureUpdate {
//   version: string
//   date: string
//   features: string[]
// }

// // Feature changelog - update this when adding new features
// export const FEATURE_UPDATES: FeatureUpdate[] = [
//   {
//     version: "1.3.1",
//     date: "2025-11-06",
//     features: [
      
//       "Optimized app loading speed with lazy loading"
     
//     ],
//   },
//   {
//     version: "1.3.0",
//     date: "2025-01-15",
//     features: [
//       "Rebranded to Face Attendance with new logo",
//       "Custom date range export for attendance reports",
//       "Role-based export restrictions (SuperAdmin can export all institutions)",
//       "Advanced attendance filters (person type, status, date presets)",
//       "Improved mobile menu with scrolling and version display",
//       "Updated navigation labels (Live Attendance, Attendance Reports)",
//       "SuperAdmin access to Settings",
//       "Optimized app loading speed with lazy loading",
//       "Enhanced PWA caching for faster performance",
//     ],
//   },
//   {
//     version: "1.2.0",
//     date: "2024-01-15",
//     features: [
//       "Login History with Device Name tracking",
//       "Location tracking for login attempts",
//       "Session Duration monitoring",
//       "Enhanced security with device fingerprinting",
//       "Real-time activity tracking",
//     ],
//   },
//   {
//     version: "1.1.0",
//     date: "2024-01-10",
//     features: [
//       "Face recognition improvements",
//       "PWA offline support",
//       "Push notifications",
//       "Performance optimizations",
//     ],
//   },
//   {
//     version: "1.0.0",
//     date: "2024-01-01",
//     features: ["Initial release", "Employee management", "Attendance tracking", "Face ID recognition"],
//   },
// ]

// // Get the latest feature update
// export function getLatestUpdate(): FeatureUpdate {
//   return FEATURE_UPDATES[0]
// }

// // Get features since a specific version
// export function getFeaturesSince(version: string): string[] {
//   const features: string[] = []
//   for (const update of FEATURE_UPDATES) {
//     if (update.version === version) break
//     features.push(...update.features)
//   }
//   return features
// }

// // Check if update is available
// export function isUpdateAvailable(currentVersion: string): boolean {
//   return currentVersion !== APP_VERSION
// }



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

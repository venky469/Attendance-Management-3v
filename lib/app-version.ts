// App version and feature tracking
export const APP_VERSION = "1.2.0"
export const CACHE_VERSION = "genamplify-v1.2.0"

export interface FeatureUpdate {
  version: string
  date: string
  features: string[]
}

// Feature changelog - update this when adding new features
export const FEATURE_UPDATES: FeatureUpdate[] = [
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

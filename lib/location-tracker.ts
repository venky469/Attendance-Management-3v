export interface LocationData {
  latitude: number
  longitude: number
  city?: string
  country?: string
  accuracy?: number
}

export async function getCurrentLocation(): Promise<LocationData | null> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return null
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }

        // Try to get city and country from reverse geocoding
        try {
          const response = await fetch("/api/geocode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: locationData.latitude,
              longitude: locationData.longitude,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            locationData.city = data.city
            locationData.country = data.country
          }
        } catch (error) {
          console.error("Failed to reverse geocode:", error)
        }

        resolve(locationData)
      },
      (error) => {
        console.error("Geolocation error:", error)
        resolve(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  })
}

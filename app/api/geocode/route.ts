import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address")
    if (!address) {
      return NextResponse.json({ error: "Address parameter is required" }, { status: 400 })
    }

    // Try Google Maps Geocoding API first if API key is available
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY
    if (googleApiKey) {
      const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}`
      const googleRes = await fetch(googleUrl)
      const googleData = await googleRes.json()

      if (googleData.status === "OK" && googleData.results?.[0]) {
        const result = googleData.results[0]
        return NextResponse.json({
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          formattedAddress: result.formatted_address,
          source: "google",
        })
      }
    }

    // Fallback to Nominatim (OpenStreetMap) - free, no API key required
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    const nominatimRes = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "GenAmplify-Attendance-System/1.0",
      },
    })
    const nominatimData = await nominatimRes.json()

    if (nominatimData && nominatimData.length > 0) {
      const result = nominatimData[0]
      return NextResponse.json({
        latitude: Number.parseFloat(result.lat),
        longitude: Number.parseFloat(result.lon),
        formattedAddress: result.display_name,
        source: "nominatim",
      })
    }

    return NextResponse.json({ error: "Location not found for the given address" }, { status: 404 })
  } catch (error) {
    console.error("[geocode] Error:", error)
    return NextResponse.json({ error: "Failed to geocode address" }, { status: 500 })
  }
}

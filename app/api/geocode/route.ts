// import { type NextRequest, NextResponse } from "next/server"

// export async function GET(req: NextRequest) {
//   try {
//     const address = req.nextUrl.searchParams.get("address")
//     if (!address) {
//       return NextResponse.json({ error: "Address parameter is required" }, { status: 400 })
//     }

//     // Try Google Maps Geocoding API first if API key is available
//     const googleApiKey = process.env.GOOGLE_MAPS_API_KEY
//     if (googleApiKey) {
//       const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}`
//       const googleRes = await fetch(googleUrl)
//       const googleData = await googleRes.json()

//       if (googleData.status === "OK" && googleData.results?.[0]) {
//         const result = googleData.results[0]
//         return NextResponse.json({
//           latitude: result.geometry.location.lat,
//           longitude: result.geometry.location.lng,
//           formattedAddress: result.formatted_address,
//           source: "google",
//         })
//       }
//     }

//     // Fallback to Nominatim (OpenStreetMap) - free, no API key required
//     const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
//     const nominatimRes = await fetch(nominatimUrl, {
//       headers: {
//         "User-Agent": "GenAmplify-Attendance-System/1.0",
//       },
//     })
//     const nominatimData = await nominatimRes.json()

//     if (nominatimData && nominatimData.length > 0) {
//       const result = nominatimData[0]
//       return NextResponse.json({
//         latitude: Number.parseFloat(result.lat),
//         longitude: Number.parseFloat(result.lon),
//         formattedAddress: result.display_name,
//         source: "nominatim",
//       })
//     }

//     return NextResponse.json({ error: "Location not found for the given address" }, { status: 404 })
//   } catch (error) {
//     console.error("[geocode] Error:", error)
//     return NextResponse.json({ error: "Failed to geocode address" }, { status: 500 })
//   }
// }



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

export async function POST(req: NextRequest) {
  try {
    const { latitude, longitude } = await req.json()

    if (!latitude || !longitude) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
    }

    console.log("[v0] Reverse geocoding:", { latitude, longitude })

    // Try Google Maps Reverse Geocoding API first if API key is available
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY
    if (googleApiKey) {
      const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`
      const googleRes = await fetch(googleUrl)
      const googleData = await googleRes.json()

      if (googleData.status === "OK" && googleData.results?.[0]) {
        const result = googleData.results[0]
        const addressComponents = result.address_components

        let city = ""
        let country = ""

        for (const component of addressComponents) {
          if (component.types.includes("locality")) {
            city = component.long_name
          } else if (component.types.includes("administrative_area_level_1") && !city) {
            city = component.long_name
          }
          if (component.types.includes("country")) {
            country = component.long_name
          }
        }

        console.log("[v0] Google reverse geocode result:", { city, country })

        return NextResponse.json({
          city: city || "Unknown",
          country: country || "Unknown",
          formattedAddress: result.formatted_address,
          source: "google",
        })
      }
    }

    // Fallback to Nominatim (OpenStreetMap) - free, no API key required
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    const nominatimRes = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "GenAmplify-Attendance-System/1.0",
      },
    })
    const nominatimData = await nominatimRes.json()

    if (nominatimData && nominatimData.address) {
      const address = nominatimData.address
      const city = address.city || address.town || address.village || address.county || "Unknown"
      const country = address.country || "Unknown"

      console.log("[v0] Nominatim reverse geocode result:", { city, country })

      return NextResponse.json({
        city,
        country,
        formattedAddress: nominatimData.display_name,
        source: "nominatim",
      })
    }

    console.log("[v0] No reverse geocode results found")
    return NextResponse.json(
      {
        city: "Unknown",
        country: "Unknown",
        error: "Location details not found",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Reverse geocode error:", error)
    return NextResponse.json(
      {
        city: "Unknown",
        country: "Unknown",
        error: "Failed to reverse geocode location",
      },
      { status: 200 },
    )
  }
}

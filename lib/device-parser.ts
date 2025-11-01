export interface DeviceInfo {
  name: string
  browser: string
  os: string
  isMobile: boolean
  deviceType: string
}

export function parseUserAgent(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase()

  // Detect browser
  let browser = "Unknown"
  if (ua.includes("edg/")) browser = "Edge"
  else if (ua.includes("chrome/")) browser = "Chrome"
  else if (ua.includes("safari/") && !ua.includes("chrome")) browser = "Safari"
  else if (ua.includes("firefox/")) browser = "Firefox"
  else if (ua.includes("opera/") || ua.includes("opr/")) browser = "Opera"

  // Detect OS
  let os = "Unknown"
  if (ua.includes("windows nt 10.0")) os = "Windows 10/11"
  else if (ua.includes("windows nt 6.3")) os = "Windows 8.1"
  else if (ua.includes("windows nt 6.2")) os = "Windows 8"
  else if (ua.includes("windows nt 6.1")) os = "Windows 7"
  else if (ua.includes("windows")) os = "Windows"
  else if (ua.includes("mac os x")) {
    const match = ua.match(/mac os x (\d+)[._](\d+)/)
    os = match ? `macOS ${match[1]}.${match[2]}` : "macOS"
  } else if (ua.includes("android")) {
    const match = ua.match(/android (\d+\.?\d*)/)
    os = match ? `Android ${match[1]}` : "Android"
  } else if (ua.includes("iphone") || ua.includes("ipad")) {
    const match = ua.match(/os (\d+)[._](\d+)/)
    os = match ? `iOS ${match[1]}.${match[2]}` : "iOS"
  } else if (ua.includes("linux")) os = "Linux"

  // Detect device type
  const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(ua)

  let deviceType = "Desktop"
  if (isTablet) deviceType = "Tablet"
  else if (isMobile) deviceType = "Mobile"

  const name = `${browser} on ${os}`

  return {
    name,
    browser,
    os,
    isMobile,
    deviceType,
  }
}

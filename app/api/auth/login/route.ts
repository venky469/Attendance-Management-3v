
import { type NextRequest, NextResponse } from "next/server"
import { getDb, verifyPassword } from "@/lib/mongo"
import { sendLoginOTPEmail } from "@/lib/email"
import { parseUserAgent } from "@/lib/device-parser"

function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

async function logLoginAttempt(
  db: any,
  user: any,
  userType: string,
  success: boolean,
  request: NextRequest,
  reason?: string,
  location?: { latitude: number; longitude: number; city?: string; country?: string },
) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown"
  const userAgent = request.headers.get("user-agent") || "Unknown"

  const deviceInfo = parseUserAgent(userAgent)

  await db.collection("login_history").insertOne({
    userId: user._id?.toString() || null,
    email: user.email,
    name: user.name || "Unknown",
    userType,
    role: user.role || "Unknown",
    institutionName: user.institutionName || "N/A",
    department: user.department || "N/A",
    success,
    reason: reason || (success ? "Login successful" : "Login failed"),
    ipAddress: ip,
    userAgent,
    deviceInfo: {
      name: deviceInfo.name,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      isMobile: deviceInfo.isMobile,
      deviceType: deviceInfo.deviceType,
    },
    location: location || null,
    timestamp: new Date(),
    otpRequired: userType !== "student",
    loginTime: new Date(),
    logoutTime: null,
    sessionDuration: null,
    lastActivityTime: new Date(),
    isOnline: success,
    statusUpdatedAt: new Date(),
  })
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, location } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const db = await getDb()

    let maintenanceEnabled = false
    let maintenanceMessage = ""
    try {
      const settingsDoc = await db.collection("app_settings").findOne({ _id: "global" })
      maintenanceEnabled = settingsDoc?.data?.maintenance?.enabled || false
      maintenanceMessage =
        settingsDoc?.data?.maintenance?.message || "System is under maintenance. Please try again later."
    } catch (e) {
      console.error("[login] Failed to check maintenance status:", e)
    }

    const staff = await db.collection("staff").findOne({ email })
    const student = await db.collection("students").findOne({ email })

    let user = null
    let userType = null

    if (staff) {
      user = staff
      userType = "staff"
    } else if (student) {
      user = student
      userType = "student"
    }

    if (!user || !user.password) {
      if (user) {
        await logLoginAttempt(db, user, userType || "unknown", false, request, "Invalid password", location)
      }
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      await logLoginAttempt(db, user, userType || "unknown", false, request, "Invalid password", location)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (maintenanceEnabled) {
      const userRole = (user.role || "").toString().toLowerCase()
      if (userRole !== "superadmin") {
        await logLoginAttempt(
          db,
          user,
          userType || "unknown",
          false,
          request,
          "Login blocked - maintenance mode",
          location,
        )
        return NextResponse.json(
          {
            error: maintenanceMessage,
            maintenanceMode: true,
          },
          { status: 503 },
        )
      }
    }

    // Check institution status after validating credentials
    if (user.institutionName) {
      const inst = await db.collection("institutions").findOne({ name: user.institutionName })
      if (inst?.blocked) {
        await logLoginAttempt(db, user, userType || "unknown", false, request, "Institution blocked", location)
        return NextResponse.json(
          {
            error:
              "Your college is blocked due to administrative reasons. Please contact the Super Admin for assistance.",
          },
          { status: 403 },
        )
      }
    }

    let otpLoginEnabled = true
    try {
      const settingsDoc = await db.collection("app_settings").findOne({ _id: "global" })
      otpLoginEnabled = settingsDoc?.data?.authentication?.otpLoginEnabled ?? true
    } catch (e) {
      console.error("[login] Failed to check OTP settings:", e)
    }

    if (userType === "student") {
      await logLoginAttempt(db, user, userType, true, request, "Student login successful (no OTP)", location)

      const { password: _, _id, ...userWithoutPassword } = user
      const rawRole = (user.role || "").toString()
      const roleNormalizedMap: Record<string, "SuperAdmin" | "Admin" | "Manager" | "Staff" | "Teacher" | "Student"> = {
        superadmin: "SuperAdmin",
        admin: "Admin",
        manager: "Manager",
        staff: "Staff",
        teacher: "Teacher",
        student: "Student",
      }
      const normalizedRole =
        roleNormalizedMap[rawRole.toLowerCase()] ||
        (user.role as "SuperAdmin" | "Admin" | "Manager" | "Staff" | "Teacher" | "Student")

      const formattedUser = {
        ...userWithoutPassword,
        id: _id.toString(),
        role: normalizedRole,
      }

      const response = NextResponse.json({
        success: true,
        user: formattedUser,
      })

      response.cookies.set("user", JSON.stringify(formattedUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return response
    }

    if (!otpLoginEnabled) {
      await logLoginAttempt(
        db,
        user,
        userType || "unknown",
        true,
        request,
        "Staff login successful (OTP disabled)",
        location,
      )

      const { password: _, _id, ...userWithoutPassword } = user
      const rawRole = (user.role || "").toString()
      const roleNormalizedMap: Record<string, "SuperAdmin" | "Admin" | "Manager" | "Staff" | "Teacher" | "Student"> = {
        superadmin: "SuperAdmin",
        admin: "Admin",
        manager: "Manager",
        staff: "Staff",
        teacher: "Teacher",
        student: "Student",
      }
      const normalizedRole =
        roleNormalizedMap[rawRole.toLowerCase()] ||
        (user.role as "SuperAdmin" | "Admin" | "Manager" | "Staff" | "Teacher" | "Student")

      const formattedUser = {
        ...userWithoutPassword,
        id: _id.toString(),
        role: normalizedRole,
      }

      const response = NextResponse.json({
        success: true,
        user: formattedUser,
      })

      response.cookies.set("user", JSON.stringify(formattedUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return response
    }

    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)

    await db.collection("otp_verifications").insertOne({
      email,
      otp,
      expiresAt: otpExpiry,
      createdAt: new Date(),
      verified: false,
    })

    await db.collection("otp_verifications").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

    const emailSent = await sendLoginOTPEmail({
      to: email,
      name: user.name || "User",
      otp,
      userType: userType || "staff",
    })

    if (!emailSent) {
      await logLoginAttempt(db, user, userType || "unknown", false, request, "Failed to send OTP email", location)
      return NextResponse.json({ error: "Failed to send OTP email. Please try again." }, { status: 500 })
    }

    await logLoginAttempt(db, user, userType || "unknown", false, request, "OTP sent, awaiting verification", location)

    return NextResponse.json({
      success: true,
      requiresOTP: true,
      message: "OTP sent to your email. Please check your inbox.",
      email,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

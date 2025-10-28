// import { type NextRequest, NextResponse } from "next/server"
// import { getDb } from "@/lib/mongo"

// export async function POST(request: NextRequest) {
//   try {
//     const { email, otp } = await request.json()

//     if (!email || !otp) {
//       return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
//     }

//     const db = await getDb()

//     // Find the OTP record
//     const otpRecord = await db.collection("otp_verifications").findOne({
//       email,
//       otp,
//       verified: false,
//       expiresAt: { $gt: new Date() },
//     })

//     if (!otpRecord) {
//       return NextResponse.json({ error: "Invalid or expired OTP. Please try again." }, { status: 401 })
//     }

//     // Mark OTP as verified
//     await db.collection("otp_verifications").updateOne({ _id: otpRecord._id }, { $set: { verified: true } })

//     // Get user data
//     const staff = await db.collection("staff").findOne({ email })
//     const student = await db.collection("students").findOne({ email })

//     const user = staff || student

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     const { password: _, _id, ...userWithoutPassword } = user
//     const rawRole = (user.role || "").toString()
//     const roleNormalizedMap: Record<string, "SuperAdmin" | "Admin" | "Manager" | "Staff" | "Teacher" | "Student"> = {
//       superadmin: "SuperAdmin",
//       admin: "Admin",
//       manager: "Manager",
//       staff: "Staff",
//       teacher: "Teacher",
//       student: "Student",
//     }
//     const normalizedRole =
//       roleNormalizedMap[rawRole.toLowerCase()] ||
//       (user.role as "SuperAdmin" | "Admin" | "Manager" | "Staff" | "Teacher" | "Student")

//     const formattedUser = {
//       ...userWithoutPassword,
//       id: _id.toString(),
//       role: normalizedRole,
//     }

//     return NextResponse.json({
//       success: true,
//       user: formattedUser,
//     })
//   } catch (error) {
//     console.error("OTP verification error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }




import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

async function logLoginSuccess(db: any, user: any, userType: string, request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown"
  const userAgent = request.headers.get("user-agent") || "Unknown"

  await db.collection("login_history").insertOne({
    userId: user._id?.toString() || null,
    email: user.email,
    name: user.name || "Unknown",
    userType,
    role: user.role || "Unknown",
    institutionName: user.institutionName || "N/A",
    department: user.department || "N/A",
    success: true,
    reason: "OTP verified successfully",
    ipAddress: ip,
    userAgent,
    timestamp: new Date(),
    otpRequired: true,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    const db = await getDb()

    // Find the OTP record
    const otpRecord = await db.collection("otp_verifications").findOne({
      email,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() },
    })

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired OTP. Please try again." }, { status: 401 })
    }

    // Mark OTP as verified
    await db.collection("otp_verifications").updateOne({ _id: otpRecord._id }, { $set: { verified: true } })

    // Get user data
    const staff = await db.collection("staff").findOne({ email })
    const student = await db.collection("students").findOne({ email })

    const user = staff || student
    const userType = staff ? "staff" : "student"

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await logLoginSuccess(db, user, userType, request)

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

    return NextResponse.json({
      success: true,
      user: formattedUser,
    })
  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

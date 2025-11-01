

// // // import { type NextRequest, NextResponse } from "next/server"
// // // import { getDb, verifyPassword } from "@/lib/mongo"

// // // export async function POST(request: NextRequest) {
// // //   try {
// // //     const { email, password } = await request.json()

// // //     if (!email || !password) {
// // //       return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
// // //     }

// // //     const db = await getDb()

// // //     const staff = await db.collection("staff").findOne({ email })
// // //     const student = await db.collection("students").findOne({ email })

// // //     let user = null
// // //     let userType = null

// // //     if (staff) {
// // //       user = staff
// // //       userType = "staff"
// // //     } else if (student) {
// // //       user = student
// // //       userType = "student"
// // //     }

// // //     if (!user || !user.password) {
// // //       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
// // //     }

// // //     const isPasswordValid = await verifyPassword(password, user.password)

// // //     if (!isPasswordValid) {
// // //       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
// // //     }

// // //     // Check institution status after validating credentials
// // //     if (user.institutionName) {
// // //       const inst = await db.collection("institutions").findOne({ name: user.institutionName })
// // //       if (inst?.blocked) {
// // //         return NextResponse.json(
// // //           {
// // //             error:
// // //               "Your college is blocked due to administrative reasons. Please contact the Super Admin for assistance.",
// // //           },
// // //           { status: 403 },
// // //         )
// // //       }
// // //     }

// // //     const { password: _, _id, ...userWithoutPassword } = user
// // //     const rawRole = (user.role || "").toString()
// // //     const roleNormalizedMap: Record<string, "SuperAdmin" | "Admin" | "Manager" | "Staff" | "Teacher" | "Student"> = {
// // //       superadmin: "SuperAdmin",
// // //       admin: "Admin",
// // //       manager: "Manager",
// // //       staff: "Staff",
// // //       teacher: "Teacher",
// // //       student: "Student",
// // //     }
// // //     const normalizedRole =
// // //       roleNormalizedMap[rawRole.toLowerCase()] ||
// // //       (user.role as "SuperAdmin" | "Admin" | "Manager" | "Staff" | "Teacher" | "Student")

// // //     const formattedUser = {
// // //       ...userWithoutPassword,
// // //       id: _id.toString(),
// // //       role: normalizedRole, // ensure role is canonical (e.g., "Student")
// // //     }

// // //     return NextResponse.json({
// // //       success: true,
// // //       user: formattedUser,
// // //     })
// // //   } catch (error) {
// // //     console.error("Login error:", error)
// // //     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
// // //   }
// // // }




// // import { type NextRequest, NextResponse } from "next/server"
// // import { getDb, verifyPassword } from "@/lib/mongo"
// // import { sendLoginOTPEmail } from "@/lib/email"

// // function generateOTP(): string {
// //   return Math.floor(1000 + Math.random() * 9000).toString()
// // }

// // export async function POST(request: NextRequest) {
// //   try {
// //     const { email, password } = await request.json()

// //     if (!email || !password) {
// //       return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
// //     }

// //     const db = await getDb()

// //     const staff = await db.collection("staff").findOne({ email })
// //     const student = await db.collection("students").findOne({ email })

// //     let user = null
// //     let userType = null

// //     if (staff) {
// //       user = staff
// //       userType = "staff"
// //     } else if (student) {
// //       user = student
// //       userType = "student"
// //     }

// //     if (!user || !user.password) {
// //       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
// //     }

// //     const isPasswordValid = await verifyPassword(password, user.password)

// //     if (!isPasswordValid) {
// //       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
// //     }

// //     // Check institution status after validating credentials
// //     if (user.institutionName) {
// //       const inst = await db.collection("institutions").findOne({ name: user.institutionName })
// //       if (inst?.blocked) {
// //         return NextResponse.json(
// //           {
// //             error:
// //               "Your college is blocked due to administrative reasons. Please contact the Super Admin for assistance.",
// //           },
// //           { status: 403 },
// //         )
// //       }
// //     }

// //     if (userType === "student") {
// //       const { password: _, _id, ...userWithoutPassword } = user
// //       const rawRole = (user.role || "").toString()
// //       const roleNormalizedMap: Record<string, "SuperAdmin" | "Admin" | "Manager" | "Staff" | "Teacher" | "Student"> = {
// //         superadmin: "SuperAdmin",
// //         admin: "Admin",
// //         manager: "Manager",
// //         staff: "Staff",
// //         teacher: "Teacher",
// //         student: "Student",
// //       }
// //       const normalizedRole =
// //         roleNormalizedMap[rawRole.toLowerCase()] ||
// //         (user.role as "SuperAdmin" | "Admin" | "Manager" | "Staff" | "Teacher" | "Student")

// //       const formattedUser = {
// //         ...userWithoutPassword,
// //         id: _id.toString(),
// //         role: normalizedRole,
// //       }

// //       return NextResponse.json({
// //         success: true,
// //         user: formattedUser,
// //       })
// //     }

// //     const otp = generateOTP()
// //     const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now

// //     // Store OTP in database
// //     await db.collection("otp_verifications").insertOne({
// //       email,
// //       otp,
// //       expiresAt: otpExpiry,
// //       createdAt: new Date(),
// //       verified: false,
// //     })

// //     // Create TTL index for automatic deletion of expired OTPs
// //     await db.collection("otp_verifications").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// //     // Send OTP email
// //     const emailSent = await sendLoginOTPEmail({
// //       to: email,
// //       name: user.name || "User",
// //       otp,
// //       userType: userType || "staff",
// //     })

// //     if (!emailSent) {
// //       return NextResponse.json({ error: "Failed to send OTP email. Please try again." }, { status: 500 })
// //     }

// //     return NextResponse.json({
// //       success: true,
// //       requiresOTP: true,
// //       message: "OTP sent to your email. Please check your inbox.",
// //       email,
// //     })
// //   } catch (error) {
// //     console.error("Login error:", error)
// //     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
// //   }
// // }




// import { type NextRequest, NextResponse } from "next/server"
// import { getDb, verifyPassword } from "@/lib/mongo"
// import { sendLoginOTPEmail } from "@/lib/email"

// function generateOTP(): string {
//   return Math.floor(1000 + Math.random() * 9000).toString()
// }

// async function logLoginAttempt(
//   db: any,
//   user: any,
//   userType: string,
//   success: boolean,
//   request: NextRequest,
//   reason?: string,
// ) {
//   const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown"
//   const userAgent = request.headers.get("user-agent") || "Unknown"

//   await db.collection("login_history").insertOne({
//     userId: user._id?.toString() || null,
//     email: user.email,
//     name: user.name || "Unknown",
//     userType,
//     role: user.role || "Unknown",
//     institutionName: user.institutionName || "N/A",
//     department: user.department || "N/A",
//     success,
//     reason: reason || (success ? "Login successful" : "Login failed"),
//     ipAddress: ip,
//     userAgent,
//     timestamp: new Date(),
//     otpRequired: userType !== "student",
//   })
// }

// export async function POST(request: NextRequest) {
//   try {
//     const { email, password } = await request.json()

//     if (!email || !password) {
//       return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
//     }

//     const db = await getDb()

//     const staff = await db.collection("staff").findOne({ email })
//     const student = await db.collection("students").findOne({ email })

//     let user = null
//     let userType = null

//     if (staff) {
//       user = staff
//       userType = "staff"
//     } else if (student) {
//       user = student
//       userType = "student"
//     }

//     if (!user || !user.password) {
//       if (user) {
//         await logLoginAttempt(db, user, userType || "unknown", false, request, "Invalid password")
//       }
//       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
//     }

//     const isPasswordValid = await verifyPassword(password, user.password)

//     if (!isPasswordValid) {
//       await logLoginAttempt(db, user, userType || "unknown", false, request, "Invalid password")
//       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
//     }

//     // Check institution status after validating credentials
//     if (user.institutionName) {
//       const inst = await db.collection("institutions").findOne({ name: user.institutionName })
//       if (inst?.blocked) {
//         await logLoginAttempt(db, user, userType || "unknown", false, request, "Institution blocked")
//         return NextResponse.json(
//           {
//             error:
//               "Your college is blocked due to administrative reasons. Please contact the Super Admin for assistance.",
//           },
//           { status: 403 },
//         )
//       }
//     }

//     if (userType === "student") {
//       await logLoginAttempt(db, user, userType, true, request, "Student login successful (no OTP)")

//       const { password: _, _id, ...userWithoutPassword } = user
//       const rawRole = (user.role || "").toString()
//       const roleNormalizedMap: Record<string, "SuperAdmin" | "Admin" | "Manager" | "Staff" | "Teacher" | "Student"> = {
//         superadmin: "SuperAdmin",
//         admin: "Admin",
//         manager: "Manager",
//         staff: "Staff",
//         teacher: "Teacher",
//         student: "Student",
//       }
//       const normalizedRole =
//         roleNormalizedMap[rawRole.toLowerCase()] ||
//         (user.role as "SuperAdmin" | "Admin" | "Manager" | "Staff" | "Teacher" | "Student")

//       const formattedUser = {
//         ...userWithoutPassword,
//         id: _id.toString(),
//         role: normalizedRole,
//       }

//       return NextResponse.json({
//         success: true,
//         user: formattedUser,
//       })
//     }

//     const otp = generateOTP()
//     const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now

//     // Store OTP in database
//     await db.collection("otp_verifications").insertOne({
//       email,
//       otp,
//       expiresAt: otpExpiry,
//       createdAt: new Date(),
//       verified: false,
//     })

//     // Create TTL index for automatic deletion of expired OTPs
//     await db.collection("otp_verifications").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

//     // Send OTP email
//     const emailSent = await sendLoginOTPEmail({
//       to: email,
//       name: user.name || "User",
//       otp,
//       userType: userType || "staff",
//     })

//     if (!emailSent) {
//       await logLoginAttempt(db, user, userType || "unknown", false, request, "Failed to send OTP email")
//       return NextResponse.json({ error: "Failed to send OTP email. Please try again." }, { status: 500 })
//     }

//     await logLoginAttempt(db, user, userType || "unknown", false, request, "OTP sent, awaiting verification")

//     return NextResponse.json({
//       success: true,
//       requiresOTP: true,
//       message: "OTP sent to your email. Please check your inbox.",
//       email,
//     })
//   } catch (error) {
//     console.error("Login error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }




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
    lastActivityTime: null,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, location } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const db = await getDb()

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

      return NextResponse.json({
        success: true,
        user: formattedUser,
      })
    }

    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now

    // Store OTP in database
    await db.collection("otp_verifications").insertOne({
      email,
      otp,
      expiresAt: otpExpiry,
      createdAt: new Date(),
      verified: false,
    })

    // Create TTL index for automatic deletion of expired OTPs
    await db.collection("otp_verifications").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

    // Send OTP email
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

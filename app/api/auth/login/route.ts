
// import { type NextRequest, NextResponse } from "next/server"
// import { getDb, verifyPassword } from "@/lib/mongo"

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
//       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
//     }

//     const isPasswordValid = await verifyPassword(password, user.password)

//     if (!isPasswordValid) {
//       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
//     }

//     // Check institution status after validating credentials
//     if (user.institutionName) {
//       const inst = await db.collection("institutions").findOne({ name: user.institutionName })
//       if (inst?.blocked) {
//         return NextResponse.json(
//           {
//             error:
//               "Your college is blocked due to administrative reasons. Please contact the Super Admin for assistance.",
//           },
//           { status: 403 },
//         )
//       }
//     }

//     const { password: _, _id, ...userWithoutPassword } = user
//     const formattedUser = {
//       ...userWithoutPassword,
//       id: _id.toString(),
//     }

//     return NextResponse.json({
//       success: true,
//       user: formattedUser,
//     })
//   } catch (error) {
//     console.error("Login error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }



import { type NextRequest, NextResponse } from "next/server"
import { getDb, verifyPassword } from "@/lib/mongo"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

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
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check institution status after validating credentials
    if (user.institutionName) {
      const inst = await db.collection("institutions").findOne({ name: user.institutionName })
      if (inst?.blocked) {
        return NextResponse.json(
          {
            error:
              "Your college is blocked due to administrative reasons. Please contact the Super Admin for assistance.",
          },
          { status: 403 },
        )
      }
    }

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
      role: normalizedRole, // ensure role is canonical (e.g., "Student")
    }

    return NextResponse.json({
      success: true,
      user: formattedUser,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

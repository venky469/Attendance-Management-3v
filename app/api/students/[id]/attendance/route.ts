// import { type NextRequest, NextResponse } from "next/server"
// import { getDb } from "@/lib/mongo"
// import { ObjectId } from "mongodb"

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params
//     const db = await getDb()

//     const student = await db.collection("students").findOne({ _id: new ObjectId(id) })
//     if (!student) {
//       return NextResponse.json({ error: "Student not found" }, { status: 404 })
//     }

//     const currentDate = new Date()
//     const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
//     const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

//     const records = await db
//       .collection("attendance")
//       .find({
//         personId: id,
//         personType: "student",
//         date: {
//           $gte: startOfMonth.toISOString().split("T")[0],
//           $lte: endOfMonth.toISOString().split("T")[0],
//         },
//       })
//       .sort({ date: -1 })
//       .toArray()

//     const totalDays = records.length
//     const presentDays = records.filter((r) => r.status === "present").length
//     const absentDays = records.filter((r) => r.status === "absent").length
//     const lateDays = records.filter((r) => r.status === "late").length
//     const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

//     const formattedRecords = records.map((record) => ({
//       ...record,
//       id: record._id.toString(),
//       shift: student.shift,
//     }))

//     return NextResponse.json({
//       records: formattedRecords,
//       stats: {
//         totalDays,
//         presentDays,
//         absentDays,
//         lateDays,
//         attendancePercentage,
//       },
//     })
//   } catch (error) {
//     console.error("Error fetching student attendance:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }



import type { NextRequest } from "next/server"
import { getDb, hashPassword, generateStudentRollNumber } from "@/lib/mongo"
import { sendWelcomeEmail, sendUpdateNotificationEmail } from "@/lib/email"
import { DEPARTMENTS, ROLES, SHIFTS, CLASS_LEVELS } from "@/lib/constants"
import { ObjectId } from "mongodb"
import { deleteCloudinaryImage } from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  const db = await getDb()
  const body = await req.json()
  const now = new Date().toISOString()

  if (body.email) {
    const existingStudent = await db.collection("students").findOne({
      institutionName: body.institutionName,
      email: body.email,
    })
    const existingStaff = await db.collection("staff").findOne({
      institutionName: body.institutionName,
      email: body.email,
    })
    if (existingStudent || existingStaff) {
      return Response.json(
        { field: "email", message: "Email is already in use for this institution." },
        { status: 409 },
      )
    }
  }
  if (body.phone && String(body.phone).trim()) {
    const phoneValue = String(body.phone).trim()
    const existingStudentPhone = await db.collection("students").findOne({
      institutionName: body.institutionName,
      phone: phoneValue,
    })
    const existingStaffPhone = await db.collection("staff").findOne({
      institutionName: body.institutionName,
      phone: phoneValue,
    })
    if (existingStudentPhone || existingStaffPhone) {
      return Response.json(
        { field: "phone", message: "Mobile number is already in use for this institution." },
        { status: 409 },
      )
    }
  }

  const branchClassStr: string = (body.branchClass || "").toString()
  const extractedBranchFromClass =
    branchClassStr
      .split(/[-\s]/)[0]
      ?.replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase() || ""
  const branchDropdown = (body.branch || "")
    .toString()
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
  const branchCode = extractedBranchFromClass || branchDropdown || "STD"

  const rollNumber = await generateStudentRollNumber(db, body.institutionName, branchCode)
  const hashedPassword = body.password ? await hashPassword(body.password) : undefined

  const doc = {
    name: body.name,
    email: body.email,
    ...(hashedPassword && { password: hashedPassword }),
    phone: body.phone,
    department: body.department,
    role: body.role ?? "Student",
    shift: body.shift,
    photoUrl: body.photoUrl,
    faceDescriptor: Array.isArray(body.faceDescriptor) ? body.faceDescriptor : undefined,
    parentName: body.parentName,
    address: body.address,
    dateOfBirth: body.dateOfBirth,
    dateOfJoining: body.dateOfJoining,
    academicYear: body.academicYear,
    rollNumber,
    classLevel: body.classLevel,
    branch: body.branch,
    branchClass: body.branchClass,
    semester: body.semester,
    cgpa: body.cgpa,
    institutionName: body.institutionName,
    createdAt: now,
    updatedAt: now,
  }

  try {
    const result = await db.collection("students").insertOne(doc)

    if (body.password && body.email) {
      const emailSent = await sendWelcomeEmail({
        to: body.email,
        subject: `Welcome to GenAmplify - Your Student Account Details`,
        name: body.name,
        code: rollNumber,
        shift: body.shift,
        password: body.password,
        type: "student",
        institutionName: body.institutionName, // include institutionName in welcome email
      })

      if (!emailSent) {
        console.warn(`[students] Failed to send welcome email to ${body.email}`)
      }
    }

    return Response.json({
      id: result.insertedId.toString(),
      rollNumber,
      success: true,
      message: "Student created successfully",
    })
  } catch (error) {
    console.error("[students] Failed to create student:", error)
    return new Response("Failed to create student", { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const db = await getDb()
  const { searchParams } = new URL(req.url)
  const institutionName = searchParams.get("institutionName")
  const filter: any = {}
  if (institutionName) filter.institutionName = institutionName

  const items = await db.collection("students").find(filter).toArray()
  const normalized = items.map((s) => ({ ...s, id: s._id?.toString() })).map(({ _id, ...rest }) => rest)
  return Response.json({
    items: normalized,
    departments: DEPARTMENTS,
    roles: ROLES,
    shifts: SHIFTS,
    classLevels: CLASS_LEVELS,
  })
}

export async function PUT(req: NextRequest) {
  const db = await getDb()
  const body = await req.json()
  if (!body.id) return new Response("Missing id", { status: 400 })
  const id = new ObjectId(body.id)
  const { id: _omit, password, photoUrl, ...rest } = body

  try {
    const currentStudent = await db.collection("students").findOne({ _id: id })
    if (!currentStudent) return new Response("Student not found", { status: 404 })

    if (body.email) {
      const existingStudent = await db.collection("students").findOne({
        _id: { $ne: id },
        institutionName: body.institutionName || currentStudent.institutionName,
        email: body.email,
      })
      const existingStaff = await db.collection("staff").findOne({
        institutionName: body.institutionName || currentStudent.institutionName,
        email: body.email,
      })
      if (existingStudent || existingStaff) {
        return Response.json(
          { field: "email", message: "Email is already in use for this institution." },
          { status: 409 },
        )
      }
    }
    if (body.phone && String(body.phone).trim()) {
      const phoneValue = String(body.phone).trim()
      const existingStudentPhone = await db.collection("students").findOne({
        _id: { $ne: id },
        institutionName: body.institutionName || currentStudent.institutionName,
        phone: phoneValue,
      })
      const existingStaffPhone = await db.collection("staff").findOne({
        institutionName: body.institutionName || currentStudent.institutionName,
        phone: phoneValue,
      })
      if (existingStudentPhone || existingStaffPhone) {
        return Response.json(
          { field: "phone", message: "Mobile number is already in use for this institution." },
          { status: 409 },
        )
      }
    }

    const changes: Record<string, { old: any; new: any }> = {}
    const fieldsToTrack = [
      "name",
      "email",
      "phone",
      "department",
      "role",
      "shift",
      "parentName",
      "address",
      "dateOfBirth",
      "dateOfJoining",
      "academicYear",
      "classLevel",
      "institutionName",
      "branch",
      "branchClass",
      "semester",
      "cgpa",
    ]

    fieldsToTrack.forEach((field) => {
      if (body[field] !== undefined && body[field] !== currentStudent[field]) {
        changes[field] = {
          old: currentStudent[field],
          new: body[field],
        }
      }
    })

    if (password) {
      changes.password = {
        old: "••••••••",
        new: "Updated",
      }
    }

    if (photoUrl && currentStudent.photoUrl && photoUrl !== currentStudent.photoUrl) {
      const imageDeleted = await deleteCloudinaryImage(currentStudent.photoUrl)
      if (!imageDeleted) {
        console.warn(`[students] Failed to delete old profile image for student ${currentStudent.rollNumber}`)
      }
    }

    const update: any = {
      ...rest,
      updatedAt: new Date().toISOString(),
      branch: body.branch ?? currentStudent.branch,
      branchClass: body.branchClass ?? currentStudent.branchClass,
      semester: body.semester ?? currentStudent.semester,
      cgpa: body.cgpa ?? currentStudent.cgpa,
    }

    if (password) {
      update.password = await hashPassword(password)
    }
    if (photoUrl) {
      update.photoUrl = photoUrl
    }

    if (rest.faceDescriptor && !Array.isArray(rest.faceDescriptor)) delete update.faceDescriptor
    const result = await db.collection("students").updateOne({ _id: id }, { $set: update })
    if (result.matchedCount === 0) return new Response("Not found", { status: 404 })

    if (body.email && Object.keys(changes).length > 0) {
      const emailSent = await sendUpdateNotificationEmail({
        to: body.email,
        subject: `Account Updated - GenAmplify Student Portal`,
        name: body.name || currentStudent.name,
        code: currentStudent.rollNumber,
        shift: body.shift || currentStudent.shift,
        password: password || undefined,
        type: "student",
        department: body.department || currentStudent.department,
        role: body.role || currentStudent.role,
        classLevel: body.classLevel || currentStudent.classLevel,
        institutionName: body.institutionName || currentStudent.institutionName,
        changes,
        previousData: currentStudent,
      })

      if (!emailSent) {
        console.warn(`[students] Failed to send update notification email to ${body.email}`)
      }
    }

    return Response.json({ ok: true, message: "Student updated successfully" })
  } catch (error) {
    console.error("[students] Failed to update student:", error)
    return new Response("Failed to update student", { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const db = await getDb()
  const idStr = new URL(req.url).searchParams.get("id")
  if (!idStr) return new Response("Missing id", { status: 400 })

  const objectId = new ObjectId(idStr)

  try {
    const student = await db.collection("students").findOne({ _id: objectId })
    if (!student) {
      return new Response("Student not found", { status: 404 })
    }

    const attendanceResult = await db.collection("attendance").deleteMany({
      personId: idStr,
      personType: "student",
    })

    await db.collection("face-templates").deleteMany({
      personId: idStr,
      personType: "student",
    })

    if (student.photoUrl) {
      const imageDeleted = await deleteCloudinaryImage(student.photoUrl)
      if (!imageDeleted) {
        console.warn(`[students] Failed to delete profile image for student ${student.rollNumber}`)
      }
    }

    const result = await db.collection("students").deleteOne({ _id: objectId })

    if (result.deletedCount === 0) {
      return new Response("Student not found", { status: 404 })
    }

    return Response.json({
      ok: true,
      message: `Student deleted successfully. Removed ${attendanceResult.deletedCount} attendance records.`,
      deletedAttendanceRecords: attendanceResult.deletedCount,
    })
  } catch (error) {
    console.error("[students] Failed to delete student:", error)
    return new Response("Failed to delete student", { status: 500 })
  }
}

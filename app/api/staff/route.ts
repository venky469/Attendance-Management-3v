
// import type { NextRequest } from "next/server"
// import { getDb, hashPassword, generateEmployeeCode } from "@/lib/mongo"
// import { sendWelcomeEmail, sendUpdateNotificationEmail } from "@/lib/email"
// import { DEPARTMENTS, ROLES, SHIFTS } from "@/lib/constants"
// import { ObjectId } from "mongodb"
// import { deleteCloudinaryImage } from "@/lib/cloudinary"

// export async function GET(req: NextRequest) {
//   const db = await getDb()
//   const { searchParams } = new URL(req.url)
//   const role = searchParams.get("role")
//   const institutionName = searchParams.get("institutionName")
//   const filter: any = {}
//   if (role) filter.role = role
//   if (institutionName) filter.institutionName = institutionName

//   const items = await db.collection("staff").find(filter).toArray()
//   const normalized = items.map((s) => ({ ...s, id: s._id?.toString() })).map(({ _id, ...rest }) => rest)
//   return Response.json({ items: normalized, departments: DEPARTMENTS, roles: ROLES, shifts: SHIFTS })
// }

// export async function POST(req: NextRequest) {
//   const db = await getDb()
//   const body = await req.json()
//   const now = new Date().toISOString()

//   const employeeCode = await generateEmployeeCode(db, body.institutionName)
//   const hashedPassword = body.password ? await hashPassword(body.password) : undefined

//   // Duplicate check for email/phone across staff and students (scoped by institution)
//   if (body.email) {
//     const existingStaff = await db.collection("staff").findOne({
//       institutionName: body.institutionName,
//       email: body.email,
//     })
//     const existingStudent = await db.collection("students").findOne({
//       institutionName: body.institutionName,
//       email: body.email,
//     })
//     if (existingStaff || existingStudent) {
//       return Response.json(
//         { field: "email", message: "Email is already in use for this institution." },
//         { status: 409 },
//       )
//     }
//   }
//   if (body.phone && String(body.phone).trim()) {
//     const phoneValue = String(body.phone).trim()
//     const existingStaffPhone = await db.collection("staff").findOne({
//       institutionName: body.institutionName,
//       phone: phoneValue,
//     })
//     const existingStudentPhone = await db.collection("students").findOne({
//       institutionName: body.institutionName,
//       phone: phoneValue,
//     })
//     if (existingStaffPhone || existingStudentPhone) {
//       return Response.json(
//         { field: "phone", message: "Mobile number is already in use for this institution." },
//         { status: 409 },
//       )
//     }
//   }

//   const professionStr: string = (body.profession || "").toString()
//   const professionCode =
//     professionStr
//       .split(/\s+/)
//       .filter(Boolean)
//       .map((w: string) => w[0])
//       .join("")
//       .toUpperCase() || "STF"

//   const doc = {
//     name: body.name,
//     email: body.email,
//     ...(hashedPassword && { password: hashedPassword }),
//     phone: body.phone,
//     department: body.department,
//     role: body.role ?? "Staff",
//     shift: body.shift,
//     photoUrl: body.photoUrl,
//     faceDescriptor: Array.isArray(body.faceDescriptor) ? body.faceDescriptor : undefined,
//     parentName: body.parentName,
//     address: body.address,
//     dateOfBirth: body.dateOfBirth,
//     dateOfJoining: body.dateOfJoining,
//     institutionName: body.institutionName,
//     profession: body.profession,
//     qualification: body.qualification,
//     experience: body.experience,
//     specialization: body.specialization,
//     branchClass: body.branchClass,
//     employeeCode,
//     createdAt: now,
//     updatedAt: now,
//   }

//   try {
//     const result = await db.collection("staff").insertOne(doc)

//     const created = await db.collection("staff").findOne({ _id: result.insertedId })
//     const normalized = created ? { ...created, id: created._id?.toString() } : null
//     if (normalized) {
//       // remove Mongo _id
//       // @ts-ignore
//       delete normalized._id
//     }

//     if (body.password && body.email) {
//       const emailSent = await sendWelcomeEmail({
//         to: body.email,
//         subject: `Welcome to ${body.institutionName} - Your Employee Account Details`,
//         name: body.name,
//         code: employeeCode,
//         shift: body.shift,
//         password: body.password,
//         type: "staff",
//         institutionName: body.institutionName,
//       })

//       if (!emailSent) {
//         console.warn(`[staff] Failed to send welcome email to ${body.email}`)
//       }
//     }

//     return Response.json({
//       success: true,
//       message: "Staff member created successfully",
//       employeeCode,
//       item: normalized, // include full created item (profession, branchClass, dates, etc.)
//     })
//   } catch (error) {
//     console.error("[staff] Failed to create staff member:", error)
//     return new Response("Failed to create staff member", { status: 500 })
//   }
// }

// export async function PUT(req: NextRequest) {
//   const db = await getDb()
//   const body = await req.json()
//   if (!body.id) return new Response("Missing id", { status: 400 })
//   const id = new ObjectId(body.id)
//   const { id: _omit, password, photoUrl, ...rest } = body

//   try {
//     const currentStaff = await db.collection("staff").findOne({ _id: id })
//     if (!currentStaff) return new Response("Staff member not found", { status: 404 })

//     // Duplicate check for email/phone on edit (exclude current record, check students too)
//     if (body.email) {
//       const existingStaff = await db.collection("staff").findOne({
//         _id: { $ne: id },
//         institutionName: body.institutionName || currentStaff.institutionName,
//         email: body.email,
//       })
//       const existingStudent = await db.collection("students").findOne({
//         institutionName: body.institutionName || currentStaff.institutionName,
//         email: body.email,
//       })
//       if (existingStaff || existingStudent) {
//         return Response.json(
//           { field: "email", message: "Email is already in use for this institution." },
//           { status: 409 },
//         )
//       }
//     }
//     if (body.phone && String(body.phone).trim()) {
//       const phoneValue = String(body.phone).trim()
//       const existingStaffPhone = await db.collection("staff").findOne({
//         _id: { $ne: id },
//         institutionName: body.institutionName || currentStaff.institutionName,
//         phone: phoneValue,
//       })
//       const existingStudentPhone = await db.collection("students").findOne({
//         institutionName: body.institutionName || currentStaff.institutionName,
//         phone: phoneValue,
//       })
//       if (existingStaffPhone || existingStudentPhone) {
//         return Response.json(
//           { field: "phone", message: "Mobile number is already in use for this institution." },
//           { status: 409 },
//         )
//       }
//     }

//     const changes: Record<string, { old: any; new: any }> = {}
//     const fieldsToTrack = [
//       "name",
//       "email",
//       "phone",
//       "department",
//       "role",
//       "shift",
//       "parentName",
//       "address",
//       "dateOfBirth",
//       "dateOfJoining",
//       "institutionName",
//       "profession",
//       "qualification",
//       "experience",
//       "specialization",
//       "branchClass",
//     ]

//     fieldsToTrack.forEach((field) => {
//       if (body[field] !== undefined && body[field] !== currentStaff[field]) {
//         changes[field] = {
//           old: currentStaff[field],
//           new: body[field],
//         }
//       }
//     })

//     if (password) {
//       changes.password = {
//         old: "••••••••",
//         new: "Updated",
//       }
//     }

//     if (photoUrl && currentStaff.photoUrl && photoUrl !== currentStaff.photoUrl) {
//       const imageDeleted = await deleteCloudinaryImage(currentStaff.photoUrl)
//       if (!imageDeleted) {
//         console.warn(`[staff] Failed to delete old profile image for staff ${currentStaff.employeeCode}`)
//       }
//     }

//     const update: any = {
//       ...rest,
//       updatedAt: new Date().toISOString(),
//       profession: body.profession ?? currentStaff.profession,
//       qualification: body.qualification ?? currentStaff.qualification,
//       experience: body.experience ?? currentStaff.experience,
//       specialization: body.specialization ?? currentStaff.specialization,
//       branchClass: body.branchClass ?? currentStaff.branchClass,
//     }
//     if (password) {
//       update.password = await hashPassword(password)
//     }
//     if (photoUrl) {
//       update.photoUrl = photoUrl
//     }

//     if (rest.faceDescriptor && !Array.isArray(rest.faceDescriptor)) delete update.faceDescriptor
//     const result = await db.collection("staff").updateOne({ _id: id }, { $set: update })
//     if (result.matchedCount === 0) return new Response("Not found", { status: 404 })

//     if (body.email && Object.keys(changes).length > 0) {
//       const emailSent = await sendUpdateNotificationEmail({
//         to: body.email,
//         subject: `Account Updated - ${body.institutionName} Staff Portal`,
//         name: body.name || currentStaff.name,
//         code: currentStaff.employeeCode,
//         shift: body.shift || currentStaff.shift,
//         password: password || undefined,
//         type: "staff",
//         department: body.department || currentStaff.department,
//         role: body.role || currentStaff.role,
//         changes,
//         previousData: currentStaff,
//         institutionName: body.institutionName || currentStaff.institutionName,
//       })

//       if (!emailSent) {
//         console.warn(`[staff] Failed to send update notification email to ${body.email}`)
//       }
//     }

//     return Response.json({ ok: true, message: "Staff member updated successfully" })
//   } catch (error) {
//     console.error("[staff] Failed to update staff member:", error)
//     return new Response("Failed to update staff member", { status: 500 })
//   }
// }

// export async function DELETE(req: NextRequest) {
//   const db = await getDb()
//   const idStr = new URL(req.url).searchParams.get("id")
//   if (!idStr) return new Response("Missing id", { status: 400 })

//   const objectId = new ObjectId(idStr)

//   try {
//     const staffMember = await db.collection("staff").findOne({ _id: objectId })
//     if (!staffMember) {
//       return new Response("Staff member not found", { status: 404 })
//     }

//     // 1. Delete attendance records
//     const attendanceResult = await db.collection("attendance").deleteMany({
//       personId: idStr,
//       personType: "staff",
//     })

//     // 2. Delete face templates if they exist
//     await db.collection("face-templates").deleteMany({
//       personId: idStr,
//       personType: "staff",
//     })

//     // 3. Delete profile image from Cloudinary if exists
//     if (staffMember.photoUrl) {
//       const imageDeleted = await deleteCloudinaryImage(staffMember.photoUrl)
//       if (!imageDeleted) {
//         console.warn(`[staff] Failed to delete profile image for staff ${staffMember.employeeCode}`)
//       }
//     }

//     // 4. Finally delete the staff member record
//     const result = await db.collection("staff").deleteOne({ _id: objectId })

//     if (result.deletedCount === 0) {
//       return new Response("Staff member not found", { status: 404 })
//     }

//     return Response.json({
//       ok: true,
//       message: `Staff member deleted successfully. Removed ${attendanceResult.deletedCount} attendance records.`,
//       deletedAttendanceRecords: attendanceResult.deletedCount,
//     })
//   } catch (error) {
//     console.error("[staff] Failed to delete staff member:", error)
//     return new Response("Failed to delete staff member", { status: 500 })
//   }
// }



import type { NextRequest } from "next/server"
import { getDb, hashPassword, generateEmployeeCode } from "@/lib/mongo"
import { sendWelcomeEmail, sendUpdateNotificationEmail } from "@/lib/email"
import { DEPARTMENTS, ROLES, SHIFTS } from "@/lib/constants"
import { ObjectId } from "mongodb"
import { deleteCloudinaryImage } from "@/lib/cloudinary"
import { withCache, apiCache } from "@/lib/api-cache"
import { perfMonitor } from "@/lib/performance-monitor"

export async function GET(req: NextRequest) {
  const endTimer = perfMonitor.start('api-staff-get')
  
  try {
    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role")
    const institutionName = searchParams.get("institutionName")
    
    const cacheKey = `staff:${role || 'all'}:${institutionName || 'all'}`
    
    const result = await withCache(cacheKey, async () => {
      const db = await getDb()
      const filter: any = {}
      if (role) filter.role = role
      if (institutionName) filter.institutionName = institutionName

      const items = await db.collection("staff").find(filter).toArray()
      const normalized = items.map((s) => ({ ...s, id: s._id?.toString() })).map(({ _id, ...rest }) => rest)
      
      return { items: normalized, departments: DEPARTMENTS, roles: ROLES, shifts: SHIFTS }
    }, 300) // 5 minutes cache
    
    endTimer()
    return Response.json(result)
  } catch (error) {
    endTimer()
    console.error('[staff] GET error:', error)
    return new Response("Failed to fetch staff", { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const endTimer = perfMonitor.start('api-staff-post')
  
  try {
    const db = await getDb()
    const body = await req.json()
    const now = new Date().toISOString()

    const employeeCode = await generateEmployeeCode(db, body.institutionName)
    const hashedPassword = body.password ? await hashPassword(body.password) : undefined

    if (body.email) {
      const existingStaff = await db.collection("staff").findOne({
        institutionName: body.institutionName,
        email: body.email,
      })
      const existingStudent = await db.collection("students").findOne({
        institutionName: body.institutionName,
        email: body.email,
      })
      if (existingStaff || existingStudent) {
        return Response.json(
          { field: "email", message: "Email is already in use for this institution." },
          { status: 409 },
        )
      }
    }
    if (body.phone && String(body.phone).trim()) {
      const phoneValue = String(body.phone).trim()
      const existingStaffPhone = await db.collection("staff").findOne({
        institutionName: body.institutionName,
        phone: phoneValue,
      })
      const existingStudentPhone = await db.collection("students").findOne({
        institutionName: body.institutionName,
        phone: phoneValue,
      })
      if (existingStaffPhone || existingStudentPhone) {
        return Response.json(
          { field: "phone", message: "Mobile number is already in use for this institution." },
          { status: 409 },
        )
      }
    }

    const professionStr: string = (body.profession || "").toString()
    const professionCode =
      professionStr
        .split(/\s+/)
        .filter(Boolean)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase() || "STF"

    const doc = {
      name: body.name,
      email: body.email,
      ...(hashedPassword && { password: hashedPassword }),
      phone: body.phone,
      department: body.department,
      role: body.role ?? "Staff",
      shift: body.shift,
      photoUrl: body.photoUrl,
      faceDescriptor: Array.isArray(body.faceDescriptor) ? body.faceDescriptor : undefined,
      parentName: body.parentName,
      address: body.address,
      dateOfBirth: body.dateOfBirth,
      dateOfJoining: body.dateOfJoining,
      institutionName: body.institutionName,
      profession: body.profession,
      qualification: body.qualification,
      experience: body.experience,
      specialization: body.specialization,
      branchClass: body.branchClass,
      employeeCode,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("staff").insertOne(doc)

    const created = await db.collection("staff").findOne({ _id: result.insertedId })
    const normalized = created ? { ...created, id: created._id?.toString() } : null
    if (normalized) {
      // @ts-ignore
      delete normalized._id
    }

    if (body.password && body.email) {
      const emailSent = await sendWelcomeEmail({
        to: body.email,
        subject: `Welcome to GenAmplify - Your Employee Account Details`,
        name: body.name,
        code: employeeCode,
        shift: body.shift,
        password: body.password,
        type: "staff",
        institutionName: body.institutionName,
      })

      if (!emailSent) {
        console.warn(`[staff] Failed to send welcome email to ${body.email}`)
      }
    }

    apiCache.invalidatePattern('^staff:')
    
    endTimer()
    return Response.json({
      success: true,
      message: "Staff member created successfully",
      employeeCode,
      item: normalized,
    })
  } catch (error) {
    endTimer()
    console.error("[staff] Failed to create staff member:", error)
    return new Response("Failed to create staff member", { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const endTimer = perfMonitor.start('api-staff-put')
  
  try {
    const db = await getDb()
    const body = await req.json()
    if (!body.id) return new Response("Missing id", { status: 400 })
    const id = new ObjectId(body.id)
    const { id: _omit, password, photoUrl, ...rest } = body

    const currentStaff = await db.collection("staff").findOne({ _id: id })
    if (!currentStaff) return new Response("Staff member not found", { status: 404 })

    if (body.email) {
      const existingStaff = await db.collection("staff").findOne({
        _id: { $ne: id },
        institutionName: body.institutionName || currentStaff.institutionName,
        email: body.email,
      })
      const existingStudent = await db.collection("students").findOne({
        institutionName: body.institutionName || currentStaff.institutionName,
        email: body.email,
      })
      if (existingStaff || existingStudent) {
        return Response.json(
          { field: "email", message: "Email is already in use for this institution." },
          { status: 409 },
        )
      }
    }
    if (body.phone && String(body.phone).trim()) {
      const phoneValue = String(body.phone).trim()
      const existingStaffPhone = await db.collection("staff").findOne({
        _id: { $ne: id },
        institutionName: body.institutionName || currentStaff.institutionName,
        phone: phoneValue,
      })
      const existingStudentPhone = await db.collection("students").findOne({
        institutionName: body.institutionName || currentStaff.institutionName,
        phone: phoneValue,
      })
      if (existingStaffPhone || existingStudentPhone) {
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
      "institutionName",
      "profession",
      "qualification",
      "experience",
      "specialization",
      "branchClass",
    ]

    fieldsToTrack.forEach((field) => {
      if (body[field] !== undefined && body[field] !== currentStaff[field]) {
        changes[field] = {
          old: currentStaff[field],
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

    if (photoUrl && currentStaff.photoUrl && photoUrl !== currentStaff.photoUrl) {
      const imageDeleted = await deleteCloudinaryImage(currentStaff.photoUrl)
      if (!imageDeleted) {
        console.warn(`[staff] Failed to delete old profile image for staff ${currentStaff.employeeCode}`)
      }
    }

    const update: any = {
      ...rest,
      updatedAt: new Date().toISOString(),
      profession: body.profession ?? currentStaff.profession,
      qualification: body.qualification ?? currentStaff.qualification,
      experience: body.experience ?? currentStaff.experience,
      specialization: body.specialization ?? currentStaff.specialization,
      branchClass: body.branchClass ?? currentStaff.branchClass,
    }
    if (password) {
      update.password = await hashPassword(password)
    }
    if (photoUrl) {
      update.photoUrl = photoUrl
    }

    if (rest.faceDescriptor && !Array.isArray(rest.faceDescriptor)) delete update.faceDescriptor
    const result = await db.collection("staff").updateOne({ _id: id }, { $set: update })
    if (result.matchedCount === 0) return new Response("Not found", { status: 404 })

    if (body.email && Object.keys(changes).length > 0) {
      const emailSent = await sendUpdateNotificationEmail({
        to: body.email,
        subject: `Account Updated - GenAmplify Staff Portal`,
        name: body.name || currentStaff.name,
        code: currentStaff.employeeCode,
        shift: body.shift || currentStaff.shift,
        password: password || undefined,
        type: "staff",
        department: body.department || currentStaff.department,
        role: body.role || currentStaff.role,
        changes,
        previousData: currentStaff,
        institutionName: body.institutionName || currentStaff.institutionName,
      })

      if (!emailSent) {
        console.warn(`[staff] Failed to send update notification email to ${body.email}`)
      }
    }

    apiCache.invalidatePattern('^staff:')
    
    endTimer()
    return Response.json({ ok: true, message: "Staff member updated successfully" })
  } catch (error) {
    endTimer()
    console.error("[staff] Failed to update staff member:", error)
    return new Response("Failed to update staff member", { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const endTimer = perfMonitor.start('api-staff-delete')
  
  try {
    const db = await getDb()
    const idStr = new URL(req.url).searchParams.get("id")
    if (!idStr) return new Response("Missing id", { status: 400 })

    const objectId = new ObjectId(idStr)

    const staffMember = await db.collection("staff").findOne({ _id: objectId })
    if (!staffMember) {
      return new Response("Staff member not found", { status: 404 })
    }

    const attendanceResult = await db.collection("attendance").deleteMany({
      personId: idStr,
      personType: "staff",
    })

    await db.collection("face-templates").deleteMany({
      personId: idStr,
      personType: "staff",
    })

    if (staffMember.photoUrl) {
      const imageDeleted = await deleteCloudinaryImage(staffMember.photoUrl)
      if (!imageDeleted) {
        console.warn(`[staff] Failed to delete profile image for staff ${staffMember.employeeCode}`)
      }
    }

    const result = await db.collection("staff").deleteOne({ _id: objectId })

    if (result.deletedCount === 0) {
      return new Response("Staff member not found", { status: 404 })
    }

    apiCache.invalidatePattern('^staff:')
    
    endTimer()
    return Response.json({
      ok: true,
      message: `Staff member deleted successfully. Removed ${attendanceResult.deletedCount} attendance records.`,
      deletedAttendanceRecords: attendanceResult.deletedCount,
    })
  } catch (error) {
    endTimer()
    console.error("[staff] Failed to delete staff member:", error)
    return new Response("Failed to delete staff member", { status: 500 })
  }
}

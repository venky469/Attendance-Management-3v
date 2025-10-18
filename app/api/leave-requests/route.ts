

// import type { NextRequest } from "next/server"
// import { getDb } from "@/lib/mongo"
// import { calculateWorkingDays, validateLeaveDates } from "@/lib/leave-helpers"
// import { sendLeaveRequestNotifications } from "@/lib/leave-notifications"
// import type { LeaveRequest } from "@/lib/types"
// import { ObjectId } from "mongodb"

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
//     const {
//       personId,
//       personType,
//       leaveType,
//       startDate,
//       endDate,
//       reason,
//       approverEmail,
//       attachments = [],
//       department,
//       role,
//     } = body

//     // Validate required fields
//     if (!personId || !personType || !leaveType || !startDate || !endDate || !reason || !approverEmail) {
//       return Response.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     // Validate email
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(approverEmail)) {
//       return Response.json({ error: "Invalid approver email address" }, { status: 400 })
//     }

//     // Validate dates
//     const dateValidation = validateLeaveDates(startDate, endDate)
//     if (!dateValidation.valid) {
//       return Response.json({ error: dateValidation.error }, { status: 400 })
//     }

//     // Calculate working days
//     const totalDays = calculateWorkingDays(startDate, endDate)

//     const db = await getDb()

//     // Get person details
//     const personCol = personType === "staff" ? "staff" : "students"
//     const person = await db.collection(personCol).findOne({ _id: new ObjectId(personId) })

//     if (!person) {
//       return Response.json({ error: "Person not found" }, { status: 404 })
//     }

//     // Create leave request
//     const leaveRequest: Omit<LeaveRequest, "id"> = {
//       personId,
//       personType,
//       leaveType,
//       startDate,
//       endDate,
//       totalDays,
//       reason: reason.trim(),
//       status: "pending",
//       appliedDate: new Date().toISOString(),
//       attachments,
//       approverEmail: approverEmail.trim(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       department: department || person.department,
//       role: role || person.role,
//       shift: person.shift,
//       personName: person.name,
//       personEmail: person.email,
//       ...(person as any).institutionName ? { institutionName: (person as any).institutionName } : {} // add institution conditionally
//     }

//     const result = await db.collection("leave_requests").insertOne({
//       ...leaveRequest,
//       id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
//     })

//     const savedRequest: LeaveRequest = {
//       ...leaveRequest,
//       id: result.insertedId.toString(),
//     }

//     // Send notifications to approvers
//     await sendLeaveRequestNotifications(savedRequest)

//     return Response.json({
//       success: true,
//       leaveRequest: savedRequest,
//       message: "Leave request submitted successfully",
//     })
//   } catch (error) {
//     console.error("Error creating leave request:", error)
//     return Response.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const personId = searchParams.get("personId")
//     const personType = searchParams.get("personType") as "staff" | "student" | null
//     const status = searchParams.get("status")
//     const limit = Number.parseInt(searchParams.get("limit") || "50")
//     const institutionName = searchParams.get("institutionName") || undefined // read institutionName filter

//     const db = await getDb()

//     const query: any = {}
//     if (personId) query.personId = personId
//     if (personType) query.personType = personType
//     if (institutionName) query.institutionName = institutionName // if provided, filter by institutionName

//     if (status && status !== "all") {
//       if (status.includes(",")) {
//         // Handle comma-separated status values like "approved,rejected"
//         const statusArray = status.split(",").map((s) => s.trim())
//         query.status = { $in: statusArray }
//       } else {
//         query.status = status
//       }
//     }

//     const leaveRequests = await db
//       .collection("leave_requests")
//       .find(query)
//       .sort({ appliedDate: -1 })
//       .limit(limit)
//       .toArray()

//     const normalizedRequests = leaveRequests.map(({ _id, ...request }) => ({
//       ...request,
//       id: request.id || _id?.toString(),
//     }))

//     return Response.json({
//       leaveRequests: normalizedRequests,
//     })
//   } catch (error) {
//     console.error("Error fetching leave requests:", error)
//     return Response.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongo"
import { calculateWorkingDays, validateLeaveDates } from "@/lib/leave-helpers"
import { sendLeaveRequestNotifications } from "@/lib/leave-notifications"
import type { LeaveRequest } from "@/lib/types"
import { ObjectId } from "mongodb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      personId,
      personType,
      leaveType,
      startDate,
      endDate,
      reason,
      approverEmail,
      attachments = [],
      department,
      role,
    } = body

    // Validate required fields
    if (!personId || !personType || !leaveType || !startDate || !endDate || !reason || !approverEmail) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(approverEmail)) {
      return Response.json({ error: "Invalid approver email address" }, { status: 400 })
    }

    // Validate dates
    const dateValidation = validateLeaveDates(startDate, endDate)
    if (!dateValidation.valid) {
      return Response.json({ error: dateValidation.error }, { status: 400 })
    }

    // Calculate working days
    const totalDays = calculateWorkingDays(startDate, endDate)

    const db = await getDb()

    // Get person details
    const personCol = personType === "staff" ? "staff" : "students"
    const person = await db.collection(personCol).findOne({ _id: new ObjectId(personId) })

    if (!person) {
      return Response.json({ error: "Person not found" }, { status: 404 })
    }

    // Create leave request
    const leaveRequest: Omit<LeaveRequest, "id"> = {
      personId,
      personType,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason: reason.trim(),
      status: "pending",
      appliedDate: new Date().toISOString(),
      attachments,
      approverEmail: approverEmail.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      department: department || person.department,
      role: role || person.role,
      shift: person.shift,
      personName: person.name,
      personEmail: person.email,
      ...(person.institutionName ? { institutionName: person.institutionName } : {}),
    }

    const result = await db.collection("leave_requests").insertOne({
      ...leaveRequest,
      id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
    })

    const savedRequest: LeaveRequest = {
      ...leaveRequest,
      id: result.insertedId.toString(),
    }

    // Send notifications to approvers
    await sendLeaveRequestNotifications(savedRequest)

    return Response.json({
      success: true,
      leaveRequest: savedRequest,
      message: "Leave request submitted successfully",
    })
  } catch (error) {
    console.error("Error creating leave request:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const personId = searchParams.get("personId")
    const personType = searchParams.get("personType") as "staff" | "student" | null
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const institutionName = searchParams.get("institutionName") || undefined // read institutionName filter

    const db = await getDb()

    const query: any = {}
    if (personId) query.personId = personId
    if (personType) query.personType = personType
    if (institutionName) query.institutionName = institutionName // if provided, filter by institutionName

    if (status && status !== "all") {
      if (status.includes(",")) {
        // Handle comma-separated status values like "approved,rejected"
        const statusArray = status.split(",").map((s) => s.trim())
        query.status = { $in: statusArray }
      } else {
        query.status = status
      }
    }

    const leaveRequests = await db
      .collection("leave_requests")
      .find(query)
      .sort({ appliedDate: -1 })
      .limit(limit)
      .toArray()

    const normalizedRequests = leaveRequests.map(({ _id, ...request }) => ({
      ...request,
      id: request.id || _id?.toString(),
    }))

    return Response.json({
      leaveRequests: normalizedRequests,
    })
  } catch (error) {
    console.error("Error fetching leave requests:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Body can include { id, personId? }
    const body = await req.json().catch(() => ({}) as any)
    const { id, personId } = body || {}

    if (!id) {
      return Response.json({ error: "Missing id" }, { status: 400 })
    }

    const db = await getDb()

    let objectId: ObjectId | null = null
    try {
      objectId = new ObjectId(id)
    } catch {
      objectId = null
    }

    const existing = await db
      .collection("leave_requests")
      .findOne(objectId ? { $or: [{ id }, { _id: objectId }] } : { id })

    if (!existing) {
      return Response.json({ error: "Leave request not found" }, { status: 404 })
    }

    // If a personId is provided, ensure it matches the owner of the request.
    if (personId && existing.personId !== personId) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.collection("leave_requests").deleteOne({ _id: existing._id })
    return Response.json({ ok: true, id })
  } catch (error) {
    console.error("[leave-requests][DELETE] error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

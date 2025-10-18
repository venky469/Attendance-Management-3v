
// import type { NextRequest } from "next/server"
// import { getDb } from "@/lib/mongo"
// import { sendLeaveStatusNotifications } from "@/lib/leave-notifications"
// import { ObjectId } from "mongodb"

// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params
//     const { status, reviewComments, reviewerId, reviewerName } = await req.json()

//     if (!status || !["approved", "rejected"].includes(status)) {
//       return Response.json({ error: "Invalid status" }, { status: 400 })
//     }

//     const db = await getDb()

//     // Get the leave request
//     const leaveRequest = await db.collection("leave_requests").findOne({ id })

//     if (!leaveRequest) {
//       return Response.json({ error: "Leave request not found" }, { status: 404 })
//     }

//     if (leaveRequest.status !== "pending") {
//       return Response.json({ error: "Leave request already reviewed" }, { status: 400 })
//     }

//     // Update the leave request
//     const updateData = {
//       status,
//       reviewedBy: reviewerId,
//       reviewedDate: new Date().toISOString(),
//       reviewComments: reviewComments || undefined,
//       updatedAt: new Date().toISOString(),
//       approverName: reviewerName,
//     }

//     await db.collection("leave_requests").updateOne({ id }, { $set: updateData })

//     if (status === "approved") {
//       const startDate = new Date(leaveRequest.startDate)
//       const endDate = new Date(leaveRequest.endDate)

//       // Get person details for attendance record
//       const personCol = leaveRequest.personType === "staff" ? "staff" : "students"
//       const person = await db.collection(personCol).findOne({ _id: new ObjectId(leaveRequest.personId) })

//       if (person) {
//         // Create attendance records for each day in the leave period
//         const attendanceRecords = []
//         for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
//           // Skip weekends (Saturday = 6, Sunday = 0)
//           if (date.getDay() === 0 || date.getDay() === 6) continue

//           const dateStr = date.toISOString().split("T")[0]
//           attendanceRecords.push({
//             personId: leaveRequest.personId,
//             personType: leaveRequest.personType,
//             date: dateStr,
//             status: "absent", // Mark as absent for leave days
//             timestamp: new Date().toISOString(),
//             department: person.department,
//             role: person.role,
//             shift: person.shift,
//             leaveRequestId: leaveRequest.id,
//             markedByLeave: true, // Flag to indicate this was marked due to approved leave
//           })
//         }

//         // Insert attendance records (upsert to avoid duplicates)
//         for (const record of attendanceRecords) {
//           await db
//             .collection("attendance")
//             .updateOne({ personId: record.personId, date: record.date }, { $set: record }, { upsert: true })
//         }

//         console.log(`Marked ${attendanceRecords.length} attendance records for approved leave: ${leaveRequest.id}`)
//       }
//     }

//     // Get updated request for notifications
//     const updatedRequest = await db.collection("leave_requests").findOne({ id })

//     // Send notification to requester
//     if (updatedRequest) {
//       await sendLeaveStatusNotifications(updatedRequest as any, status, reviewerName || "Admin", reviewComments)
//     }

//     return Response.json({
//       success: true,
//       message: `Leave request ${status} successfully${status === "approved" ? " and attendance marked" : ""}`,
//     })
//   } catch (error) {
//     console.error("Error reviewing leave request:", error)
//     return Response.json({ error: "Internal server error" }, { status: 500 })
//   }
// }



import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongo"
import { sendLeaveStatusNotifications } from "@/lib/leave-notifications"
import { ObjectId } from "mongodb"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status, reviewComments, reviewerId, reviewerName } = await req.json()

    if (!status || !["approved", "rejected"].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 })
    }

    const db = await getDb()

    // Get the leave request
    const leaveRequest = await db.collection("leave_requests").findOne({ id })

    if (!leaveRequest) {
      return Response.json({ error: "Leave request not found" }, { status: 404 })
    }

    if (leaveRequest.status !== "pending") {
      return Response.json({ error: "Leave request already reviewed" }, { status: 400 })
    }

    // Update the leave request
    const updateData = {
      status,
      reviewedBy: reviewerId,
      reviewedDate: new Date().toISOString(),
      reviewComments: reviewComments || undefined,
      updatedAt: new Date().toISOString(),
      approverName: reviewerName,
    }

    await db.collection("leave_requests").updateOne({ id }, { $set: updateData })

    if (status === "approved") {
      const startDate = new Date(leaveRequest.startDate)
      const endDate = new Date(leaveRequest.endDate)

      // Get person details for attendance record
      const personCol = leaveRequest.personType === "staff" ? "staff" : "students"
      const person = await db.collection(personCol).findOne({ _id: new ObjectId(leaveRequest.personId) })

      if (person) {
        // Create attendance records for each day in the leave period
        const attendanceRecords = []
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
          // Skip weekends (Saturday = 6, Sunday = 0)
          if (date.getDay() === 0 || date.getDay() === 6) continue

          const dateStr = date.toISOString().split("T")[0]
          attendanceRecords.push({
            personId: leaveRequest.personId,
            personType: leaveRequest.personType,
            date: dateStr,
            status: "absent", // Mark as absent for leave days
            timestamp: new Date().toISOString(),
            department: person.department,
            role: person.role,
            shift: person.shift,
            leaveRequestId: leaveRequest.id,
            markedByLeave: true, // Flag to indicate this was marked due to approved leave
          })
        }

        // Insert attendance records (upsert to avoid duplicates)
        for (const record of attendanceRecords) {
          await db
            .collection("attendance")
            .updateOne({ personId: record.personId, date: record.date }, { $set: record }, { upsert: true })
        }

        console.log(`Marked ${attendanceRecords.length} attendance records for approved leave: ${leaveRequest.id}`)
      }
    }

    // Get updated request for notifications
    const updatedRequest = await db.collection("leave_requests").findOne({ id })

    // Send notification to requester
    if (updatedRequest) {
      await sendLeaveStatusNotifications(updatedRequest, status, reviewerName || "Admin", reviewComments)
    }

    return Response.json({
      success: true,
      message: `Leave request ${status} successfully${status === "approved" ? " and attendance marked" : ""}`,
    })
  } catch (error) {
    console.error("Error reviewing leave request:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

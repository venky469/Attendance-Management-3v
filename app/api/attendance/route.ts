// // // // import type { NextRequest } from "next/server"
// // // // import { getDb } from "@/lib/mongo"
// // // // import {
// // // //   DEPARTMENTS,
// // // //   ROLES,
// // // //   SHIFTS,
// // // //   todayStr,
// // // //   SHIFT_TIMINGS,
// // // //   canMarkAttendanceDuringShiftWithTimezone,
// // // //   getTimeUntilShiftStartsWithTimezone,
// // // //   getAttendanceStatusWithTimezone,
// // // // } from "@/lib/constants"
// // // // import { ObjectId } from "mongodb"
// // // // import type { AttendanceUpdateEvent, StatsUpdateEvent } from "@/lib/socket"
// // // // import {
// // // //   buildRuntimeTimings,
// // // //   canMarkAttendanceDuringShiftWithTimezoneRuntime,
// // // //   getAttendanceStatusWithTimezoneRuntime,
// // // //   type RuntimeTimings,
// // // // } from "@/lib/shift-settings"
// // // // import { isWithinRadius } from "@/lib/location-utils"

// // // // async function emitAttendanceUpdate(event: AttendanceUpdateEvent) {
// // // //   try {
// // // //     const baseUrl =
// // // //       process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
// // // //         ? `https://${process.env.VERCEL_URL}`
// // // //         : "http://localhost:3000"

// // // //     console.log("[v0] Emitting attendance update to:", `${baseUrl}/api/realtime/events`)

// // // //     const response = await fetch(`${baseUrl}/api/realtime/events`, {
// // // //       method: "POST",
// // // //       headers: { "Content-Type": "application/json" },
// // // //       body: JSON.stringify({
// // // //         type: "attendance_update",
// // // //         ...event,
// // // //       }),
// // // //     })

// // // //     if (!response.ok) {
// // // //       console.error("[v0] Real-time event failed:", response.status, response.statusText)
// // // //     } else {
// // // //       console.log("[v0] Real-time event sent successfully")
// // // //     }
// // // //   } catch (error) {
// // // //     console.error("[v0] Failed to emit attendance update:", error)
// // // //     // Don't fail the main request if real-time update fails
// // // //   }
// // // // }

// // // // async function emitStatsUpdate(event: StatsUpdateEvent) {
// // // //   try {
// // // //     const baseUrl =
// // // //       process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
// // // //         ? `https://${process.env.VERCEL_URL}`
// // // //         : "http://localhost:3000"

// // // //     await fetch(`${baseUrl}/api/realtime/events`, {
// // // //       method: "POST",
// // // //       headers: { "Content-Type": "application/json" },
// // // //       body: JSON.stringify({
// // // //         type: "stats_update",
// // // //         ...event,
// // // //       }),
// // // //     })
// // // //   } catch (error) {
// // // //     console.error("[v0] Failed to emit stats update:", error)
// // // //     // Don't fail the main request if real-time update fails
// // // //   }
// // // // }

// // // // export async function GET(req: NextRequest) {
// // // //   try {
// // // //     console.log("[v0] GET /api/attendance - Starting request")
// // // //     const db = await getDb()
// // // //     console.log("[v0] Database connection successful")

// // // //     const { searchParams } = new URL(req.url)
// // // //     const department = searchParams.get("department") || undefined
// // // //     const role = searchParams.get("role") || undefined
// // // //     const shift = searchParams.get("shift") || undefined
// // // //     const status = searchParams.get("status") || undefined
// // // //     const date = searchParams.get("date") || todayStr() // Default to today
// // // //     const personType = (searchParams.get("personType") as "staff" | "student" | null) || undefined
// // // //     const institutionName = searchParams.get("institutionName") || undefined
// // // //     const personIdParam = searchParams.get("personId") || undefined

// // // //     const query: any = { date }
// // // //     if (department && department !== "all") query.department = department
// // // //     if (role && role !== "all") query.role = role
// // // //     if (shift && shift !== "all") query.shift = shift
// // // //     if (status && status !== "all") query.status = status
// // // //     if (personType) query.personType = personType

// // // //     let personIdFilter: string[] | null = null
// // // //     if (personIdParam) {
// // // //       query.personId = personIdParam
// // // //     } else if (institutionName) {
// // // //       const [instStaff, instStudents] = await Promise.all([
// // // //         db.collection("staff").find({ institutionName }).project({ _id: 1 }).toArray(),
// // // //         db.collection("students").find({ institutionName }).project({ _id: 1 }).toArray(),
// // // //       ])
// // // //       personIdFilter = [...instStaff, ...instStudents].map((d) => d._id.toString())
// // // //       query.personId = { $in: personIdFilter }
// // // //     }

// // // //     const records = await db.collection("attendance").find(query).toArray()

// // // //     const allAttendanceForDateQuery: any = { date }
// // // //     if (personIdParam) {
// // // //       allAttendanceForDateQuery.personId = personIdParam
// // // //     } else if (personIdFilter) {
// // // //       allAttendanceForDateQuery.personId = { $in: personIdFilter }
// // // //     }
// // // //     const allAttendanceForDate = await db.collection("attendance").find(allAttendanceForDateQuery).toArray()

// // // //     let totalPeople: number
// // // //     if (personIdParam) {
// // // //       totalPeople = 1
// // // //     } else {
// // // //       const staffCountFilter: any = institutionName ? { institutionName } : {}
// // // //       const studentCountFilter: any = institutionName ? { institutionName } : {}
// // // //       const [totalStaff, totalStudents] = await Promise.all([
// // // //         db.collection("staff").countDocuments(staffCountFilter),
// // // //         db.collection("students").countDocuments(studentCountFilter),
// // // //       ])
// // // //       totalPeople = totalStaff + totalStudents
// // // //     }

// // // //     const enrichedRecords = await Promise.all(
// // // //       records.map(async (r: any) => {
// // // //         const personCol = r.personType === "staff" ? "staff" : "students"
// // // //         const person = await db.collection(personCol).findOne({ _id: new ObjectId(r.personId) })
// // // //         return {
// // // //           ...r,
// // // //           id: r._id?.toString(),
// // // //           personName: person?.name || person?.fullName || person?.firstName || "Unknown",
// // // //           imageUrl: person?.photoUrl || person?.imageUrl || null,
// // // //           employeeCode: r.personType === "staff" ? person?.employeeCode : undefined,
// // // //           rollNumber: r.personType === "student" ? person?.rollNumber : undefined,
// // // //           classLevel: r.personType === "student" ? person?.classLevel : undefined,
// // // //         }
// // // //       }),
// // // //     )

// // // //     const normalized = enrichedRecords.map(({ _id, ...rest }) => rest)

// // // //     return Response.json({
// // // //       records: normalized,
// // // //       departments: DEPARTMENTS,
// // // //       roles: ROLES,
// // // //       shifts: SHIFTS,
// // // //       totalCounts: {
// // // //         totalPeople,
// // // //         present: allAttendanceForDate.filter((r) => r.status === "present").length,
// // // //         absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
// // // //         late: allAttendanceForDate.filter((r) => r.status === "late").length,
// // // //       },
// // // //     })
// // // //   } catch (error) {
// // // //     console.error("[v0] GET /api/attendance error:", error)
// // // //     return Response.json(
// // // //       {
// // // //         error: "Internal server error",
// // // //         message: error instanceof Error ? error.message : "Unknown error",
// // // //         details: process.env.NODE_ENV === "development" ? error : undefined,
// // // //       },
// // // //       { status: 500 },
// // // //     )
// // // //   }
// // // // }

// // // // export async function POST(req: NextRequest) {
// // // //   try {
// // // //     console.log("[v0] POST /api/attendance - Starting request")
// // // //     console.log("[v0] Environment check:", {
// // // //       NODE_ENV: process.env.NODE_ENV,
// // // //       MONGODB_URI: !!process.env.MONGODB_URI,
// // // //       MONGODB_DB: !!process.env.MONGODB_DB,
// // // //       NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
// // // //       VERCEL_URL: process.env.VERCEL_URL,
// // // //     })

// // // //     let body
// // // //     try {
// // // //       body = await req.json()
// // // //       console.log("[v0] Request body parsed successfully:", {
// // // //         personId: body.personId,
// // // //         personType: body.personType,
// // // //         status: body.status,
// // // //         hasBody: !!body,
// // // //         hasLocation: !!body.currentLocation,
// // // //       })
// // // //     } catch (parseError) {
// // // //       console.error("[v0] Failed to parse request body:", parseError)
// // // //       return Response.json(
// // // //         {
// // // //           error: "INVALID_JSON",
// // // //           message: "Request body must be valid JSON",
// // // //           details: parseError instanceof Error ? parseError.message : "Unknown parse error",
// // // //         },
// // // //         { status: 400 },
// // // //       )
// // // //     }

// // // //     const personId = body.personId as string
// // // //     const personType = body.personType as "staff" | "student"
// // // //     let status = body.status as "present" | "absent" | "late"
// // // //     const date = (body.date as string) || todayStr()
// // // //     const timezone = body.timezone || "Asia/Kolkata"
// // // //     const currentLocation = body.currentLocation as { latitude: number; longitude: number } | undefined

// // // //     const operatorRole: string | undefined = body.operator?.role
// // // //     const operatorBranchRaw: string = (body.operator?.branch || body.operator?.branchClass || "").toUpperCase().trim()

// // // //     console.log("[v0] Extracted fields:", {
// // // //       personId,
// // // //       personType,
// // // //       status,
// // // //       date,
// // // //       timezone,
// // // //       hasCurrentLocation: !!currentLocation,
// // // //     })

// // // //     if (!personId || !personType) {
// // // //       console.error("[v0] Missing required fields:", {
// // // //         personId: !!personId,
// // // //         personType: !!personType,
// // // //         bodyKeys: Object.keys(body || {}),
// // // //       })
// // // //       return Response.json(
// // // //         {
// // // //           error: "MISSING_FIELDS",
// // // //           message: "personId and personType are required",
// // // //           received: {
// // // //             personId: !!personId,
// // // //             personType: !!personType,
// // // //             bodyKeys: Object.keys(body || {}),
// // // //           },
// // // //         },
// // // //         { status: 400 },
// // // //       )
// // // //     }

// // // //     if (!ObjectId.isValid(personId)) {
// // // //       console.error("[v0] Invalid ObjectId format:", personId)
// // // //       return Response.json(
// // // //         {
// // // //           error: "INVALID_OBJECT_ID",
// // // //           message: "personId must be a valid MongoDB ObjectId",
// // // //           received: personId,
// // // //         },
// // // //         { status: 400 },
// // // //       )
// // // //     }

// // // //     console.log("[v0] Connecting to database...")
// // // //     let db
// // // //     try {
// // // //       db = await getDb()
// // // //       console.log("[v0] Database connection successful")
// // // //     } catch (dbError) {
// // // //       console.error("[v0] Database connection failed:", dbError)
// // // //       return Response.json(
// // // //         {
// // // //           error: "DATABASE_CONNECTION_FAILED",
// // // //           message: "Failed to connect to database",
// // // //           details: dbError instanceof Error ? dbError.message : "Unknown database error",
// // // //         },
// // // //         { status: 500 },
// // // //       )
// // // //     }

// // // //     console.log("[v0] Checking for existing attendance...")
// // // //     const existingAttendance = await db.collection("attendance").findOne({ personId, date })

// // // //     if (existingAttendance) {
// // // //       console.log("[v0] Attendance already exists:", existingAttendance.status)
// // // //       return Response.json(
// // // //         {
// // // //           id: existingAttendance._id?.toString(),
// // // //           updated: false,
// // // //           alreadyMarked: true,
// // // //           status: existingAttendance.status,
// // // //           message: `Attendance already marked as ${existingAttendance.status.toUpperCase()} today. Cannot be changed.`,
// // // //           error: "ALREADY_MARKED",
// // // //         },
// // // //         { status: 409 },
// // // //       )
// // // //     }

// // // //     console.log("[v0] Finding person in database...")
// // // //     const personCol = personType === "staff" ? "staff" : "students"
// // // //     const person = await db.collection(personCol).findOne({ _id: new ObjectId(personId) })

// // // //     if (!person) {
// // // //       console.error("[v0] Person not found:", { personId, personType, collection: personCol })
// // // //       return Response.json(
// // // //         {
// // // //           error: "Person not found",
// // // //           message: `No ${personType} found with ID ${personId}`,
// // // //         },
// // // //         { status: 404 },
// // // //       )
// // // //     }

// // // //     console.log("[v0] Person found:", { name: person.name || person.fullName, shift: person.shift })

// // // //     const assignedLocation = (person as any).location as
// // // //       | { latitude: number; longitude: number; address?: string }
// // // //       | undefined

// // // //     if (assignedLocation?.latitude && assignedLocation?.longitude) {
// // // //       if (!currentLocation?.latitude || !currentLocation?.longitude) {
// // // //         console.log("[v0] Location required but not provided")
// // // //         return Response.json(
// // // //           {
// // // //             error: "LOCATION_REQUIRED",
// // // //             message: "Your location is required to mark attendance. Please enable location access.",
// // // //           },
// // // //           { status: 400 },
// // // //         )
// // // //       }

// // // //       const withinRadius = isWithinRadius(
// // // //         currentLocation.latitude,
// // // //         currentLocation.longitude,
// // // //         assignedLocation.latitude,
// // // //         assignedLocation.longitude,
// // // //         100, // 100 meters radius
// // // //       )

// // // //       if (!withinRadius) {
// // // //         console.log("[v0] Location verification failed:", {
// // // //           current: currentLocation,
// // // //           assigned: assignedLocation,
// // // //         })
// // // //         return Response.json(
// // // //           {
// // // //             error: "LOCATION_MISMATCH",
// // // //             message: `You must be at ${assignedLocation.address || "your assigned location"} to mark attendance.`,
// // // //             details: {
// // // //               assignedLocation: assignedLocation.address || "Assigned location",
// // // //             },
// // // //           },
// // // //           { status: 403 },
// // // //         )
// // // //       }

// // // //       console.log("[v0] Location verified successfully")
// // // //     }

// // // //     const institutionName = (person as any)?.institutionName
// // // //     let runtimeTimings: RuntimeTimings | null = null
// // // //     if (institutionName) {
// // // //       const doc = await db.collection("shift_settings").findOne({ institutionName })
// // // //       if (doc?.shifts?.length) {
// // // //         runtimeTimings = buildRuntimeTimings(doc.shifts as any)
// // // //       }
// // // //     }

// // // //     const personShift = person.shift as keyof typeof SHIFT_TIMINGS

// // // //     const withinShift = runtimeTimings
// // // //       ? canMarkAttendanceDuringShiftWithTimezoneRuntime(personShift, runtimeTimings, timezone)
// // // //       : canMarkAttendanceDuringShiftWithTimezone(personShift, timezone)
// // // //     if (!withinShift) {
// // // //       const shiftMessage = getTimeUntilShiftStartsWithTimezone(personShift, timezone)
// // // //       console.log("[v0] Outside shift hours:", { shift: personShift, message: shiftMessage, timezone })
// // // //       return Response.json(
// // // //         {
// // // //           id: null,
// // // //           updated: false,
// // // //           alreadyMarked: false,
// // // //           status: null,
// // // //           message: shiftMessage || "Cannot mark attendance outside shift hours",
// // // //           error: "OUTSIDE_SHIFT_HOURS",
// // // //         },
// // // //         { status: 400 },
// // // //       )
// // // //     }

// // // //     const shiftKey = person.shift as keyof typeof SHIFT_TIMINGS
// // // //     const computedStatus = shiftKey
// // // //       ? runtimeTimings
// // // //         ? getAttendanceStatusWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
// // // //         : getAttendanceStatusWithTimezone(shiftKey, timezone)
// // // //       : null

// // // //     if (computedStatus === "window_closed") {
// // // //       const windowClose = runtimeTimings
// // // //         ? runtimeTimings[shiftKey].attendanceWindow
// // // //         : SHIFT_TIMINGS[shiftKey].attendanceWindow
// // // //       return Response.json(
// // // //         {
// // // //           id: null,
// // // //           updated: false,
// // // //           alreadyMarked: false,
// // // //           status: null,
// // // //           message: `Attendance window closed for ${
// // // //             (runtimeTimings ? runtimeTimings[shiftKey].name : SHIFT_TIMINGS[shiftKey].name) || "shift"
// // // //           } at ${windowClose}`,
// // // //           error: "OUTSIDE_SHIFT_HOURS",
// // // //         },
// // // //         { status: 400 },
// // // //       )
// // // //     }

// // // //     if (!body.status && person.shift) {
// // // //       if (computedStatus === "window_closed") {
// // // //         status = "absent"
// // // //       } else {
// // // //         status = (computedStatus as "present" | "late" | "absent") ?? "absent"
// // // //       }
// // // //       console.log("[v0] Auto-determined status (runtime-aware):", status)
// // // //     } else if (body.status && computedStatus) {
// // // //       if (body.status === "present" && computedStatus === "late") {
// // // //         status = "late"
// // // //         console.log("[v0] Normalized requested status from PRESENT to LATE based on shift timing (runtime-aware)")
// // // //       }
// // // //     }

// // // //     if (personType === "student" && operatorRole === "Teacher") {
// // // //       const stBranchClass = ((person as any)?.branchClass || "").toUpperCase().trim()
// // // //       const stBranch = ((person as any)?.branch || "").toUpperCase().trim()

// // // //       if (!operatorBranchRaw) {
// // // //         return Response.json(
// // // //           {
// // // //             error: "UNASSIGNED_TEACHER",
// // // //             message: "Teacher has no assigned branch/class. Cannot mark student attendance.",
// // // //           },
// // // //           { status: 403 },
// // // //         )
// // // //       }

// // // //       const matches = operatorBranchRaw.includes("-")
// // // //         ? stBranchClass === operatorBranchRaw
// // // //         : stBranch === operatorBranchRaw ||
// // // //           stBranchClass === operatorBranchRaw ||
// // // //           stBranchClass.startsWith(operatorBranchRaw + "-")

// // // //       if (!matches) {
// // // //         return Response.json(
// // // //           {
// // // //             error: "FORBIDDEN_BRANCH",
// // // //             message: `Student not in your assigned branch/class (${operatorBranchRaw}).`,
// // // //             details: { studentBranch: stBranch, studentBranchClass: stBranchClass },
// // // //           },
// // // //           { status: 403 },
// // // //         )
// // // //       }
// // // //     }

// // // //     const nowIso = new Date().toISOString()
// // // //     const filter = { personId, date }
// // // //     const update = {
// // // //       $set: {
// // // //         personId,
// // // //         personType,
// // // //         date,
// // // //         status,
// // // //         timestamp: nowIso,
// // // //         department: (person as any).department,
// // // //         role: (person as any).role,
// // // //         shift: (person as any).shift,
// // // //       },
// // // //     }

// // // //     console.log("[v0] Updating attendance record...")
// // // //     const result = await db.collection("attendance").updateOne(filter, update, { upsert: true })
// // // //     const updated = result.matchedCount > 0
// // // //     const id = result.upsertedId
// // // //       ? result.upsertedId.toString()
// // // //       : (await db.collection("attendance").findOne(filter))?._id?.toString()

// // // //     console.log("[v0] Attendance record updated:", { id, updated })

// // // //     const attendanceEvent: AttendanceUpdateEvent = {
// // // //       type: updated ? "attendance_updated" : "attendance_marked",
// // // //       personId,
// // // //       personType,
// // // //       personName: person.name || person.fullName || person.firstName || "Unknown",
// // // //       status,
// // // //       timestamp: nowIso,
// // // //       shift: person.shift,
// // // //       department: person.department,
// // // //       delayInfo: body.delayInfo,
// // // //       message: updated ? "Attendance updated successfully" : "Attendance marked successfully",
// // // //     }

// // // //     await emitAttendanceUpdate(attendanceEvent)

// // // //     console.log("[v0] Calculating stats...")
// // // //     const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
// // // //     const totalStaff = await db.collection("staff").countDocuments({})
// // // //     const totalStudents = await db.collection("students").countDocuments({})

// // // //     const statsEvent: StatsUpdateEvent = {
// // // //       type: "stats_update",
// // // //       totalCounts: {
// // // //         totalPeople: totalStaff + totalStudents,
// // // //         present: allAttendanceForDate.filter((r) => r.status === "present").length,
// // // //         absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
// // // //         late: allAttendanceForDate.filter((r) => r.status === "late").length,
// // // //       },
// // // //       date,
// // // //     }

// // // //     await emitStatsUpdate(statsEvent)

// // // //     console.log("[v0] POST /api/attendance completed successfully")
// // // //     return Response.json({
// // // //       id,
// // // //       updated: !!updated,
// // // //       alreadyMarked: false,
// // // //       status,
// // // //       message: updated ? "Attendance updated successfully" : "Attendance marked successfully",
// // // //     })
// // // //   } catch (error) {
// // // //     console.error("[v0] POST /api/attendance error:", error)
// // // //     return Response.json(
// // // //       {
// // // //         error: "INTERNAL_SERVER_ERROR",
// // // //         message: error instanceof Error ? error.message : "Unknown error",
// // // //         stack: process.env.NODE_ENV === "development" ? (error as Error).stack : undefined,
// // // //       },
// // // //       { status: 500 },
// // // //     )
// // // //   }
// // // // }

// // // // export async function PUT(req: NextRequest) {
// // // //   try {
// // // //     console.log("[v0] PUT /api/attendance - Starting request")

// // // //     let body
// // // //     try {
// // // //       body = await req.json()
// // // //     } catch (parseError) {
// // // //       console.error("[v0] Failed to parse request body:", parseError)
// // // //       return Response.json(
// // // //         {
// // // //           error: "Invalid JSON in request body",
// // // //           message: "Request body must be valid JSON",
// // // //         },
// // // //         { status: 400 },
// // // //       )
// // // //     }

// // // //     const recordId = body.recordId as string
// // // //     const personId = body.personId as string
// // // //     const personType = body.personType as "staff" | "student"
// // // //     let status = body.status as "present" | "absent" | "late"
// // // //     const date = (body.date as string) || todayStr()
// // // //     const timezone = body.timezone || "Asia/Kolkata"

// // // //     if (!recordId || !personId || !personType || !status) {
// // // //       console.error("[v0] Missing required fields for PUT:", { recordId, personId, personType, status })
// // // //       return Response.json(
// // // //         {
// // // //           error: "Missing required fields",
// // // //           message: "recordId, personId, personType, and status are required",
// // // //         },
// // // //         { status: 400 },
// // // //       )
// // // //     }

// // // //     if (!ObjectId.isValid(recordId) || !ObjectId.isValid(personId)) {
// // // //       console.error("[v0] Invalid ObjectId format:", { recordId, personId })
// // // //       return Response.json(
// // // //         {
// // // //           error: "Invalid ID format",
// // // //           message: "recordId and personId must be valid MongoDB ObjectIds",
// // // //         },
// // // //         { status: 400 },
// // // //       )
// // // //     }

// // // //     const db = await getDb()

// // // //     console.log("[v0] Verifying attendance record exists...")
// // // //     const existingRecord = await db.collection("attendance").findOne({
// // // //       _id: new ObjectId(recordId),
// // // //       personId,
// // // //       date,
// // // //     })

// // // //     if (!existingRecord) {
// // // //       console.log("[v0] Attendance record not found:", { recordId, personId, date })
// // // //       return Response.json({ message: "Attendance record not found" }, { status: 404 })
// // // //     }

// // // //     console.log("[v0] Finding person in database...")
// // // //     const personCol = personType === "staff" ? "staff" : "students"
// // // //     const person = await db.collection(personCol).findOne({ _id: new ObjectId(personId) })

// // // //     if (person?.shift) {
// // // //       const institutionName = (person as any)?.institutionName
// // // //       let runtimeTimings: RuntimeTimings | null = null
// // // //       if (institutionName) {
// // // //         const doc = await db.collection("shift_settings").findOne({ institutionName })
// // // //         if (doc?.shifts?.length) {
// // // //           runtimeTimings = buildRuntimeTimings(doc.shifts as any)
// // // //         }
// // // //       }

// // // //       const shiftKey = person.shift as keyof typeof SHIFT_TIMINGS

// // // //       const withinShift = runtimeTimings
// // // //         ? canMarkAttendanceDuringShiftWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
// // // //         : canMarkAttendanceDuringShiftWithTimezone(shiftKey, timezone)
// // // //       if (!withinShift) {
// // // //         const msg = getTimeUntilShiftStartsWithTimezone(shiftKey, timezone) || "Cannot update outside shift hours"
// // // //         return Response.json({ error: "OUTSIDE_SHIFT_HOURS", message: msg }, { status: 400 })
// // // //       }

// // // //       const computedStatus = runtimeTimings
// // // //         ? getAttendanceStatusWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
// // // //         : getAttendanceStatusWithTimezone(shiftKey, timezone)
// // // //       if (computedStatus === "window_closed") {
// // // //         const windowClose = runtimeTimings
// // // //           ? runtimeTimings[shiftKey].attendanceWindow
// // // //           : SHIFT_TIMINGS[shiftKey].attendanceWindow
// // // //         return Response.json(
// // // //           {
// // // //             error: "OUTSIDE_SHIFT_HOURS",
// // // //             message: `Attendance window closed for ${
// // // //               (runtimeTimings ? runtimeTimings[shiftKey].name : SHIFT_TIMINGS[shiftKey].name) || "shift"
// // // //             } at ${windowClose}`,
// // // //           },
// // // //           { status: 400 },
// // // //         )
// // // //       }

// // // //       if (status === "present" && computedStatus === "late") {
// // // //         status = "late"
// // // //         console.log("[v0] Normalized PUT status from PRESENT to LATE based on shift timing (runtime-aware)")
// // // //       }
// // // //     }

// // // //     console.log("[v0] Updating attendance status...")
// // // //     const nowIso = new Date().toISOString()
// // // //     const result = await db.collection("attendance").updateOne(
// // // //       { _id: new ObjectId(recordId) },
// // // //       {
// // // //         $set: {
// // // //           status,
// // // //           timestamp: nowIso,
// // // //           lastModified: nowIso,
// // // //           modifiedManually: true,
// // // //         },
// // // //       },
// // // //     )

// // // //     if (result.matchedCount === 0) {
// // // //       console.error("[v0] Failed to update attendance status:", { recordId, personId, status })
// // // //       return Response.json({ message: "Failed to update attendance status" }, { status: 400 })
// // // //     }

// // // //     if (person) {
// // // //       const attendanceEvent: AttendanceUpdateEvent = {
// // // //         type: "attendance_updated",
// // // //         personId,
// // // //         personType,
// // // //         personName: person.name || person.fullName || person.firstName || "Unknown",
// // // //         status,
// // // //         timestamp: nowIso,
// // // //         shift: person.shift,
// // // //         department: person.department,
// // // //         message: `Attendance status updated to ${status.toUpperCase()} successfully`,
// // // //       }

// // // //       await emitAttendanceUpdate(attendanceEvent)

// // // //       console.log("[v0] Calculating stats...")
// // // //       const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
// // // //       const totalStaff = await db.collection("staff").countDocuments({})
// // // //       const totalStudents = await db.collection("students").countDocuments({})

// // // //       const statsEvent: StatsUpdateEvent = {
// // // //         type: "stats_update",
// // // //         totalCounts: {
// // // //           totalPeople: totalStaff + totalStudents,
// // // //           present: allAttendanceForDate.filter((r) => r.status === "present").length,
// // // //           absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
// // // //           late: allAttendanceForDate.filter((r) => r.status === "late").length,
// // // //         },
// // // //         date,
// // // //       }

// // // //       await emitStatsUpdate(statsEvent)
// // // //     }

// // // //     console.log("[v0] PUT /api/attendance completed successfully")
// // // //     return Response.json({
// // // //       id: recordId,
// // // //       updated: true,
// // // //       status,
// // // //       message: `Attendance status updated to ${status.toUpperCase()} successfully`,
// // // //     })
// // // //   } catch (error) {
// // // //     console.error("[v0] PUT /api/attendance error:", error)
// // // //     return Response.json(
// // // //       {
// // // //         error: "Internal server error",
// // // //         message: error instanceof Error ? error.message : "Unknown error",
// // // //         details: process.env.NODE_ENV === "development" ? error : undefined,
// // // //       },
// // // //       { status: 500 },
// // // //     )
// // // //   }
// // // // }

// // // // export async function DELETE(req: NextRequest) {
// // // //   try {
// // // //     let body: any
// // // //     try {
// // // //       body = await req.json()
// // // //     } catch (parseError) {
// // // //       console.error("[v0] Failed to parse DELETE body:", parseError)
// // // //       return Response.json({ error: "INVALID_JSON", message: "Request body must be valid JSON" }, { status: 400 })
// // // //     }

// // // //     const recordId = body.recordId as string
// // // //     const personId = body.personId as string
// // // //     const date = (body.date as string) || todayStr()

// // // //     if (!recordId || !personId) {
// // // //       console.error("[v0] Missing required fields for DELETE:", { recordId, personId })
// // // //       return Response.json({ error: "MISSING_FIELDS", message: "recordId and personId are required" }, { status: 400 })
// // // //     }

// // // //     if (!ObjectId.isValid(recordId) || !ObjectId.isValid(personId)) {
// // // //       console.error("[v0] Invalid ObjectId for DELETE:", { recordId, personId })
// // // //       return Response.json(
// // // //         { error: "INVALID_OBJECT_ID", message: "recordId and personId must be valid MongoDB ObjectIds" },
// // // //         { status: 400 },
// // // //       )
// // // //     }

// // // //     const db = await getDb()

// // // //     const existing = await db.collection("attendance").findOne({
// // // //       _id: new ObjectId(recordId),
// // // //       personId,
// // // //       date,
// // // //     })

// // // //     if (!existing) {
// // // //       console.log("[v0] DELETE /api/attendance - record not found", { recordId, personId, date })
// // // //       return Response.json({ message: "Attendance record not found" }, { status: 404 })
// // // //     }

// // // //     const deleteRes = await db.collection("attendance").deleteOne({ _id: new ObjectId(recordId) })
// // // //     if (deleteRes.deletedCount !== 1) {
// // // //       console.error("[v0] DELETE /api/attendance - failed to delete", { recordId })
// // // //       return Response.json({ message: "Failed to delete attendance record" }, { status: 400 })
// // // //     }

// // // //     const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
// // // //     const totalStaff = await db.collection("staff").countDocuments({})
// // // //     const totalStudents = await db.collection("students").countDocuments({})

// // // //     const statsEvent: StatsUpdateEvent = {
// // // //       type: "stats_update",
// // // //       totalCounts: {
// // // //         totalPeople: totalStaff + totalStudents,
// // // //         present: allAttendanceForDate.filter((r) => r.status === "present").length,
// // // //         absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
// // // //         late: allAttendanceForDate.filter((r) => r.status === "late").length,
// // // //       },
// // // //       date,
// // // //     }

// // // //     await (async function emitStatsUpdateLocal(event: StatsUpdateEvent) {
// // // //       try {
// // // //         const baseUrl =
// // // //           process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
// // // //             ? `https://${process.env.VERCEL_URL}`
// // // //             : "http://localhost:3000"

// // // //         await fetch(`${baseUrl}/api/realtime/events`, {
// // // //           method: "POST",
// // // //           headers: { "Content-Type": "application/json" },
// // // //           body: JSON.stringify({
// // // //             type: "stats_update",
// // // //             ...event,
// // // //           }),
// // // //         })
// // // //       } catch (error) {
// // // //         console.error("[v0] Failed to emit stats update (DELETE):", error)
// // // //       }
// // // //     })(statsEvent)

// // // //     return Response.json({ id: recordId, deleted: true, message: "Attendance record deleted" })
// // // //   } catch (error) {
// // // //     console.error("[v0] DELETE /api/attendance error:", error)
// // // //     return Response.json(
// // // //       {
// // // //         error: "INTERNAL_SERVER_ERROR",
// // // //         message: error instanceof Error ? error.message : "Unknown error",
// // // //       },
// // // //       { status: 500 },
// // // //     )
// // // //   }
// // // // }



// // // import type { NextRequest } from "next/server"
// // // import { getDb } from "@/lib/mongo"
// // // import {
// // //   DEPARTMENTS,
// // //   ROLES,
// // //   SHIFTS,
// // //   todayStr,
// // //   SHIFT_TIMINGS,
// // //   canMarkAttendanceDuringShiftWithTimezone,
// // //   getTimeUntilShiftStartsWithTimezone,
// // //   getAttendanceStatusWithTimezone,
// // // } from "@/lib/constants"
// // // import { ObjectId } from "mongodb"
// // // import type { AttendanceUpdateEvent, StatsUpdateEvent } from "@/lib/socket"
// // // import {
// // //   buildRuntimeTimings,
// // //   canMarkAttendanceDuringShiftWithTimezoneRuntime,
// // //   getAttendanceStatusWithTimezoneRuntime,
// // //   type RuntimeTimings,
// // // } from "@/lib/shift-settings"
// // // import { isWithinRadius } from "@/lib/location-utils"

// // // async function emitAttendanceUpdate(event: AttendanceUpdateEvent) {
// // //   try {
// // //     const baseUrl =
// // //       process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
// // //         ? `https://${process.env.VERCEL_URL}`
// // //         : "http://localhost:3000"

// // //     console.log("[v0] Emitting attendance update to:", `${baseUrl}/api/realtime/events`)

// // //     const response = await fetch(`${baseUrl}/api/realtime/events`, {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({
// // //         type: "attendance_update",
// // //         ...event,
// // //       }),
// // //     })

// // //     if (!response.ok) {
// // //       console.error("[v0] Real-time event failed:", response.status, response.statusText)
// // //     } else {
// // //       console.log("[v0] Real-time event sent successfully")
// // //     }
// // //   } catch (error) {
// // //     console.error("[v0] Failed to emit attendance update:", error)
// // //     // Don't fail the main request if real-time update fails
// // //   }
// // // }

// // // async function emitStatsUpdate(event: StatsUpdateEvent) {
// // //   try {
// // //     const baseUrl =
// // //       process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
// // //         ? `https://${process.env.VERCEL_URL}`
// // //         : "http://localhost:3000"

// // //     await fetch(`${baseUrl}/api/realtime/events`, {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({
// // //         type: "stats_update",
// // //         ...event,
// // //       }),
// // //     })
// // //   } catch (error) {
// // //     console.error("[v0] Failed to emit stats update:", error)
// // //     // Don't fail the main request if real-time update fails
// // //   }
// // // }

// // // export async function GET(req: NextRequest) {
// // //   try {
// // //     console.log("[v0] GET /api/attendance - Starting request")
// // //     const db = await getDb()
// // //     console.log("[v0] Database connection successful")

// // //     const { searchParams } = new URL(req.url)
// // //     const department = searchParams.get("department") || undefined
// // //     const role = searchParams.get("role") || undefined
// // //     const shift = searchParams.get("shift") || undefined
// // //     const status = searchParams.get("status") || undefined
// // //     const date = searchParams.get("date") || todayStr() // Default to today
// // //     const personType = (searchParams.get("personType") as "staff" | "student" | null) || undefined
// // //     const institutionName = searchParams.get("institutionName") || undefined
// // //     const personIdParam = searchParams.get("personId") || undefined

// // //     const query: any = { date }
// // //     if (department && department !== "all") query.department = department
// // //     if (role && role !== "all") query.role = role
// // //     if (shift && shift !== "all") query.shift = shift
// // //     if (status && status !== "all") query.status = status
// // //     if (personType) query.personType = personType

// // //     let personIdFilter: string[] | null = null
// // //     if (personIdParam) {
// // //       query.personId = personIdParam
// // //     } else if (institutionName) {
// // //       const [instStaff, instStudents] = await Promise.all([
// // //         db.collection("staff").find({ institutionName }).project({ _id: 1 }).toArray(),
// // //         db.collection("students").find({ institutionName }).project({ _id: 1 }).toArray(),
// // //       ])
// // //       personIdFilter = [...instStaff, ...instStudents].map((d) => d._id.toString())
// // //       query.personId = { $in: personIdFilter }
// // //     }

// // //     const records = await db.collection("attendance").find(query).toArray()

// // //     const allAttendanceForDateQuery: any = { date }
// // //     if (personIdParam) {
// // //       allAttendanceForDateQuery.personId = personIdParam
// // //     } else if (personIdFilter) {
// // //       allAttendanceForDateQuery.personId = { $in: personIdFilter }
// // //     }
// // //     const allAttendanceForDate = await db.collection("attendance").find(allAttendanceForDateQuery).toArray()

// // //     let totalPeople: number
// // //     if (personIdParam) {
// // //       totalPeople = 1
// // //     } else {
// // //       const staffCountFilter: any = institutionName ? { institutionName } : {}
// // //       const studentCountFilter: any = institutionName ? { institutionName } : {}
// // //       const [totalStaff, totalStudents] = await Promise.all([
// // //         db.collection("staff").countDocuments(staffCountFilter),
// // //         db.collection("students").countDocuments(studentCountFilter),
// // //       ])
// // //       totalPeople = totalStaff + totalStudents
// // //     }

// // //     const enrichedRecords = await Promise.all(
// // //       records.map(async (r: any) => {
// // //         const personCol = r.personType === "staff" ? "staff" : "students"
// // //         const person = await db.collection(personCol).findOne({ _id: new ObjectId(r.personId) })
// // //         return {
// // //           ...r,
// // //           id: r._id?.toString(),
// // //           personName: person?.name || person?.fullName || person?.firstName || "Unknown",
// // //           imageUrl: person?.photoUrl || person?.imageUrl || null,
// // //           employeeCode: r.personType === "staff" ? person?.employeeCode : undefined,
// // //           rollNumber: r.personType === "student" ? person?.rollNumber : undefined,
// // //           classLevel: r.personType === "student" ? person?.classLevel : undefined,
// // //         }
// // //       }),
// // //     )

// // //     const normalized = enrichedRecords.map(({ _id, ...rest }) => rest)

// // //     return Response.json({
// // //       records: normalized,
// // //       departments: DEPARTMENTS,
// // //       roles: ROLES,
// // //       shifts: SHIFTS,
// // //       totalCounts: {
// // //         totalPeople,
// // //         present: allAttendanceForDate.filter((r) => r.status === "present").length,
// // //         absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
// // //         late: allAttendanceForDate.filter((r) => r.status === "late").length,
// // //       },
// // //     })
// // //   } catch (error) {
// // //     console.error("[v0] GET /api/attendance error:", error)
// // //     return Response.json(
// // //       {
// // //         error: "Internal server error",
// // //         message: error instanceof Error ? error.message : "Unknown error",
// // //         details: process.env.NODE_ENV === "development" ? error : undefined,
// // //       },
// // //       { status: 500 },
// // //     )
// // //   }
// // // }

// // // export async function POST(req: NextRequest) {
// // //   try {
// // //     console.log("[v0] POST /api/attendance - Starting request")
// // //     console.log("[v0] Environment check:", {
// // //       NODE_ENV: process.env.NODE_ENV,
// // //       MONGODB_URI: !!process.env.MONGODB_URI,
// // //       MONGODB_DB: !!process.env.MONGODB_DB,
// // //       NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
// // //       VERCEL_URL: process.env.VERCEL_URL,
// // //     })

// // //     let body
// // //     try {
// // //       body = await req.json()
// // //       console.log("[v0] Request body parsed successfully:", {
// // //         personId: body.personId,
// // //         personType: body.personType,
// // //         status: body.status,
// // //         hasBody: !!body,
// // //         hasLocation: !!body.currentLocation,
// // //       })
// // //     } catch (parseError) {
// // //       console.error("[v0] Failed to parse request body:", parseError)
// // //       return Response.json(
// // //         {
// // //           error: "INVALID_JSON",
// // //           message: "Request body must be valid JSON",
// // //           details: parseError instanceof Error ? parseError.message : "Unknown parse error",
// // //         },
// // //         { status: 400 },
// // //       )
// // //     }

// // //     const personId = body.personId as string
// // //     const personType = body.personType as "staff" | "student"
// // //     let status = body.status as "present" | "absent" | "late"
// // //     const date = (body.date as string) || todayStr()
// // //     const timezone = body.timezone || "Asia/Kolkata"
// // //     const currentLocation = body.currentLocation as { latitude: number; longitude: number } | undefined

// // //     const operatorRole: string | undefined = body.operator?.role
// // //     const operatorBranchRaw: string = (body.operator?.branch || body.operator?.branchClass || "").toUpperCase().trim()

// // //     console.log("[v0] Extracted fields:", {
// // //       personId,
// // //       personType,
// // //       status,
// // //       date,
// // //       timezone,
// // //       hasCurrentLocation: !!currentLocation,
// // //     })

// // //     if (!personId || !personType) {
// // //       console.error("[v0] Missing required fields:", {
// // //         personId: !!personId,
// // //         personType: !!personType,
// // //         bodyKeys: Object.keys(body || {}),
// // //       })
// // //       return Response.json(
// // //         {
// // //           error: "MISSING_FIELDS",
// // //           message: "personId and personType are required",
// // //           received: {
// // //             personId: !!personId,
// // //             personType: !!personType,
// // //             bodyKeys: Object.keys(body || {}),
// // //           },
// // //         },
// // //         { status: 400 },
// // //       )
// // //     }

// // //     if (!ObjectId.isValid(personId)) {
// // //       console.error("[v0] Invalid ObjectId format:", personId)
// // //       return Response.json(
// // //         {
// // //           error: "INVALID_OBJECT_ID",
// // //           message: "personId must be a valid MongoDB ObjectId",
// // //           received: personId,
// // //         },
// // //         { status: 400 },
// // //       )
// // //     }

// // //     console.log("[v0] Connecting to database...")
// // //     let db
// // //     try {
// // //       db = await getDb()
// // //       console.log("[v0] Database connection successful")
// // //     } catch (dbError) {
// // //       console.error("[v0] Database connection failed:", dbError)
// // //       return Response.json(
// // //         {
// // //           error: "DATABASE_CONNECTION_FAILED",
// // //           message: "Failed to connect to database",
// // //           details: dbError instanceof Error ? dbError.message : "Unknown database error",
// // //         },
// // //         { status: 500 },
// // //       )
// // //     }

// // //     console.log("[v0] Checking for existing attendance...")
// // //     const existingAttendance = await db.collection("attendance").findOne({ personId, date })

// // //     if (existingAttendance) {
// // //       console.log("[v0] Attendance already exists:", existingAttendance.status)
// // //       return Response.json(
// // //         {
// // //           id: existingAttendance._id?.toString(),
// // //           updated: false,
// // //           alreadyMarked: true,
// // //           status: existingAttendance.status,
// // //           message: `Attendance already marked as ${existingAttendance.status.toUpperCase()} today. Cannot be changed.`,
// // //           error: "ALREADY_MARKED",
// // //         },
// // //         { status: 409 },
// // //       )
// // //     }

// // //     console.log("[v0] Finding person in database...")
// // //     const personCol = personType === "staff" ? "staff" : "students"
// // //     const person = await db.collection(personCol).findOne({ _id: new ObjectId(personId) })

// // //     if (!person) {
// // //       console.error("[v0] Person not found:", { personId, personType, collection: personCol })
// // //       return Response.json(
// // //         {
// // //           error: "Person not found",
// // //           message: `No ${personType} found with ID ${personId}`,
// // //         },
// // //         { status: 404 },
// // //       )
// // //     }

// // //     console.log("[v0] Person found:", { name: person.name || person.fullName, shift: person.shift })

// // //     const settingsDoc = await db.collection("app_settings").findOne({ _id: "global" })
// // //     const locationVerificationEnabled = settingsDoc?.data?.attendance?.locationVerificationEnabled ?? true
// // //     const locationRadiusMeters = settingsDoc?.data?.attendance?.locationRadiusMeters ?? 100

// // //     console.log("[v0] Location verification settings:", {
// // //       enabled: locationVerificationEnabled,
// // //       radius: locationRadiusMeters,
// // //     })

// // //     // Only check location if verification is enabled
// // //     if (locationVerificationEnabled) {
// // //       const assignedLocation = (person as any).location as
// // //         | { latitude: number; longitude: number; address?: string }
// // //         | undefined

// // //       if (assignedLocation?.latitude && assignedLocation?.longitude) {
// // //         if (!currentLocation?.latitude || !currentLocation?.longitude) {
// // //           console.log("[v0] Location required but not provided")
// // //           return Response.json(
// // //             {
// // //               error: "LOCATION_REQUIRED",
// // //               message: "Your location is required to mark attendance. Please enable location access.",
// // //             },
// // //             { status: 400 },
// // //           )
// // //         }

// // //         const withinRadius = isWithinRadius(
// // //           currentLocation.latitude,
// // //           currentLocation.longitude,
// // //           assignedLocation.latitude,
// // //           assignedLocation.longitude,
// // //           locationRadiusMeters,
// // //         )

// // //         if (!withinRadius) {
// // //           console.log("[v0] Location verification failed:", {
// // //             current: currentLocation,
// // //             assigned: assignedLocation,
// // //           })
// // //           return Response.json(
// // //             {
// // //               error: "LOCATION_MISMATCH",
// // //               message: `You must be within ${locationRadiusMeters}m of ${assignedLocation.address || "your assigned location"} to mark attendance.`,
// // //               details: {
// // //                 assignedLocation: assignedLocation.address || "Assigned location",
// // //                 radiusMeters: locationRadiusMeters,
// // //               },
// // //             },
// // //             { status: 403 },
// // //           )
// // //         }

// // //         console.log("[v0] Location verified successfully")
// // //       }
// // //     } else {
// // //       console.log("[v0] Location verification is disabled, skipping location check")
// // //     }

// // //     const institutionName = (person as any)?.institutionName
// // //     let runtimeTimings: RuntimeTimings | null = null
// // //     if (institutionName) {
// // //       const doc = await db.collection("shift_settings").findOne({ institutionName })
// // //       if (doc?.shifts?.length) {
// // //         runtimeTimings = buildRuntimeTimings(doc.shifts as any)
// // //       }
// // //     }

// // //     const personShift = person.shift as keyof typeof SHIFT_TIMINGS

// // //     const withinShift = runtimeTimings
// // //       ? canMarkAttendanceDuringShiftWithTimezoneRuntime(personShift, runtimeTimings, timezone)
// // //       : canMarkAttendanceDuringShiftWithTimezone(personShift, timezone)
// // //     if (!withinShift) {
// // //       const shiftMessage = getTimeUntilShiftStartsWithTimezone(personShift, timezone)
// // //       console.log("[v0] Outside shift hours:", { shift: personShift, message: shiftMessage, timezone })
// // //       return Response.json(
// // //         {
// // //           id: null,
// // //           updated: false,
// // //           alreadyMarked: false,
// // //           status: null,
// // //           message: shiftMessage || "Cannot mark attendance outside shift hours",
// // //           error: "OUTSIDE_SHIFT_HOURS",
// // //         },
// // //         { status: 400 },
// // //       )
// // //     }

// // //     const shiftKey = person.shift as keyof typeof SHIFT_TIMINGS
// // //     const computedStatus = shiftKey
// // //       ? runtimeTimings
// // //         ? getAttendanceStatusWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
// // //         : getAttendanceStatusWithTimezone(shiftKey, timezone)
// // //       : null

// // //     if (computedStatus === "window_closed") {
// // //       const windowClose = runtimeTimings
// // //         ? runtimeTimings[shiftKey].attendanceWindow
// // //         : SHIFT_TIMINGS[shiftKey].attendanceWindow
// // //       return Response.json(
// // //         {
// // //           id: null,
// // //           updated: false,
// // //           alreadyMarked: false,
// // //           status: null,
// // //           message: `Attendance window closed for ${
// // //             (runtimeTimings ? runtimeTimings[shiftKey].name : SHIFT_TIMINGS[shiftKey].name) || "shift"
// // //           } at ${windowClose}`,
// // //           error: "OUTSIDE_SHIFT_HOURS",
// // //         },
// // //         { status: 400 },
// // //       )
// // //     }

// // //     if (!body.status && person.shift) {
// // //       if (computedStatus === "window_closed") {
// // //         status = "absent"
// // //       } else {
// // //         status = (computedStatus as "present" | "late" | "absent") ?? "absent"
// // //       }
// // //       console.log("[v0] Auto-determined status (runtime-aware):", status)
// // //     } else if (body.status && computedStatus) {
// // //       if (body.status === "present" && computedStatus === "late") {
// // //         status = "late"
// // //         console.log("[v0] Normalized requested status from PRESENT to LATE based on shift timing (runtime-aware)")
// // //       }
// // //     }

// // //     if (personType === "student" && operatorRole === "Teacher") {
// // //       const stBranchClass = ((person as any)?.branchClass || "").toUpperCase().trim()
// // //       const stBranch = ((person as any)?.branch || "").toUpperCase().trim()

// // //       if (!operatorBranchRaw) {
// // //         return Response.json(
// // //           {
// // //             error: "UNASSIGNED_TEACHER",
// // //             message: "Teacher has no assigned branch/class. Cannot mark student attendance.",
// // //           },
// // //           { status: 403 },
// // //         )
// // //       }

// // //       const matches = operatorBranchRaw.includes("-")
// // //         ? stBranchClass === operatorBranchRaw
// // //         : stBranch === operatorBranchRaw ||
// // //           stBranchClass === operatorBranchRaw ||
// // //           stBranchClass.startsWith(operatorBranchRaw + "-")

// // //       if (!matches) {
// // //         return Response.json(
// // //           {
// // //             error: "FORBIDDEN_BRANCH",
// // //             message: `Student not in your assigned branch/class (${operatorBranchRaw}).`,
// // //             details: { studentBranch: stBranch, studentBranchClass: stBranchClass },
// // //           },
// // //           { status: 403 },
// // //         )
// // //       }
// // //     }

// // //     const nowIso = new Date().toISOString()
// // //     const filter = { personId, date }
// // //     const update = {
// // //       $set: {
// // //         personId,
// // //         personType,
// // //         date,
// // //         status,
// // //         timestamp: nowIso,
// // //         department: (person as any).department,
// // //         role: (person as any).role,
// // //         shift: (person as any).shift,
// // //       },
// // //     }

// // //     console.log("[v0] Updating attendance record...")
// // //     const result = await db.collection("attendance").updateOne(filter, update, { upsert: true })
// // //     const updated = result.matchedCount > 0
// // //     const id = result.upsertedId
// // //       ? result.upsertedId.toString()
// // //       : (await db.collection("attendance").findOne(filter))?._id?.toString()

// // //     console.log("[v0] Attendance record updated:", { id, updated })

// // //     const attendanceEvent: AttendanceUpdateEvent = {
// // //       type: updated ? "attendance_updated" : "attendance_marked",
// // //       personId,
// // //       personType,
// // //       personName: person.name || person.fullName || person.firstName || "Unknown",
// // //       status,
// // //       timestamp: nowIso,
// // //       shift: person.shift,
// // //       department: person.department,
// // //       delayInfo: body.delayInfo,
// // //       message: updated ? "Attendance updated successfully" : "Attendance marked successfully",
// // //     }

// // //     await emitAttendanceUpdate(attendanceEvent)

// // //     console.log("[v0] Calculating stats...")
// // //     const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
// // //     const totalStaff = await db.collection("staff").countDocuments({})
// // //     const totalStudents = await db.collection("students").countDocuments({})

// // //     const statsEvent: StatsUpdateEvent = {
// // //       type: "stats_update",
// // //       totalCounts: {
// // //         totalPeople: totalStaff + totalStudents,
// // //         present: allAttendanceForDate.filter((r) => r.status === "present").length,
// // //         absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
// // //         late: allAttendanceForDate.filter((r) => r.status === "late").length,
// // //       },
// // //       date,
// // //     }

// // //     await emitStatsUpdate(statsEvent)

// // //     console.log("[v0] POST /api/attendance completed successfully")
// // //     return Response.json({
// // //       id,
// // //       updated: !!updated,
// // //       alreadyMarked: false,
// // //       status,
// // //       message: updated ? "Attendance updated successfully" : "Attendance marked successfully",
// // //     })
// // //   } catch (error) {
// // //     console.error("[v0] POST /api/attendance error:", error)
// // //     return Response.json(
// // //       {
// // //         error: "INTERNAL_SERVER_ERROR",
// // //         message: error instanceof Error ? error.message : "Unknown error",
// // //         stack: process.env.NODE_ENV === "development" ? (error as Error).stack : undefined,
// // //       },
// // //       { status: 500 },
// // //     )
// // //   }
// // // }

// // // export async function PUT(req: NextRequest) {
// // //   try {
// // //     console.log("[v0] PUT /api/attendance - Starting request")

// // //     let body
// // //     try {
// // //       body = await req.json()
// // //     } catch (parseError) {
// // //       console.error("[v0] Failed to parse request body:", parseError)
// // //       return Response.json(
// // //         {
// // //           error: "Invalid JSON in request body",
// // //           message: "Request body must be valid JSON",
// // //         },
// // //         { status: 400 },
// // //       )
// // //     }

// // //     const recordId = body.recordId as string
// // //     const personId = body.personId as string
// // //     const personType = body.personType as "staff" | "student"
// // //     let status = body.status as "present" | "absent" | "late"
// // //     const date = (body.date as string) || todayStr()
// // //     const timezone = body.timezone || "Asia/Kolkata"

// // //     if (!recordId || !personId || !personType || !status) {
// // //       console.error("[v0] Missing required fields for PUT:", { recordId, personId, personType, status })
// // //       return Response.json(
// // //         {
// // //           error: "Missing required fields",
// // //           message: "recordId, personId, personType, and status are required",
// // //         },
// // //         { status: 400 },
// // //       )
// // //     }

// // //     if (!ObjectId.isValid(recordId) || !ObjectId.isValid(personId)) {
// // //       console.error("[v0] Invalid ObjectId format:", { recordId, personId })
// // //       return Response.json(
// // //         {
// // //           error: "Invalid ID format",
// // //           message: "recordId and personId must be valid MongoDB ObjectIds",
// // //         },
// // //         { status: 400 },
// // //       )
// // //     }

// // //     const db = await getDb()

// // //     console.log("[v0] Verifying attendance record exists...")
// // //     const existingRecord = await db.collection("attendance").findOne({
// // //       _id: new ObjectId(recordId),
// // //       personId,
// // //       date,
// // //     })

// // //     if (!existingRecord) {
// // //       console.log("[v0] Attendance record not found:", { recordId, personId, date })
// // //       return Response.json({ message: "Attendance record not found" }, { status: 404 })
// // //     }

// // //     console.log("[v0] Finding person in database...")
// // //     const personCol = personType === "staff" ? "staff" : "students"
// // //     const person = await db.collection(personCol).findOne({ _id: new ObjectId(personId) })

// // //     if (person?.shift) {
// // //       const institutionName = (person as any)?.institutionName
// // //       let runtimeTimings: RuntimeTimings | null = null
// // //       if (institutionName) {
// // //         const doc = await db.collection("shift_settings").findOne({ institutionName })
// // //         if (doc?.shifts?.length) {
// // //           runtimeTimings = buildRuntimeTimings(doc.shifts as any)
// // //         }
// // //       }

// // //       const shiftKey = person.shift as keyof typeof SHIFT_TIMINGS

// // //       const withinShift = runtimeTimings
// // //         ? canMarkAttendanceDuringShiftWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
// // //         : canMarkAttendanceDuringShiftWithTimezone(shiftKey, timezone)
// // //       if (!withinShift) {
// // //         const msg = getTimeUntilShiftStartsWithTimezone(shiftKey, timezone) || "Cannot update outside shift hours"
// // //         return Response.json({ error: "OUTSIDE_SHIFT_HOURS", message: msg }, { status: 400 })
// // //       }

// // //       const computedStatus = runtimeTimings
// // //         ? getAttendanceStatusWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
// // //         : getAttendanceStatusWithTimezone(shiftKey, timezone)
// // //       if (computedStatus === "window_closed") {
// // //         const windowClose = runtimeTimings
// // //           ? runtimeTimings[shiftKey].attendanceWindow
// // //           : SHIFT_TIMINGS[shiftKey].attendanceWindow
// // //         return Response.json(
// // //           {
// // //             error: "OUTSIDE_SHIFT_HOURS",
// // //             message: `Attendance window closed for ${
// // //               (runtimeTimings ? runtimeTimings[shiftKey].name : SHIFT_TIMINGS[shiftKey].name) || "shift"
// // //             } at ${windowClose}`,
// // //           },
// // //           { status: 400 },
// // //         )
// // //       }

// // //       if (status === "present" && computedStatus === "late") {
// // //         status = "late"
// // //         console.log("[v0] Normalized PUT status from PRESENT to LATE based on shift timing (runtime-aware)")
// // //       }
// // //     }

// // //     console.log("[v0] Updating attendance status...")
// // //     const nowIso = new Date().toISOString()
// // //     const result = await db.collection("attendance").updateOne(
// // //       { _id: new ObjectId(recordId) },
// // //       {
// // //         $set: {
// // //           status,
// // //           timestamp: nowIso,
// // //           lastModified: nowIso,
// // //           modifiedManually: true,
// // //         },
// // //       },
// // //     )

// // //     if (result.matchedCount === 0) {
// // //       console.error("[v0] Failed to update attendance status:", { recordId, personId, status })
// // //       return Response.json({ message: "Failed to update attendance status" }, { status: 400 })
// // //     }

// // //     if (person) {
// // //       const attendanceEvent: AttendanceUpdateEvent = {
// // //         type: "attendance_updated",
// // //         personId,
// // //         personType,
// // //         personName: person.name || person.fullName || person.firstName || "Unknown",
// // //         status,
// // //         timestamp: nowIso,
// // //         shift: person.shift,
// // //         department: person.department,
// // //         message: `Attendance status updated to ${status.toUpperCase()} successfully`,
// // //       }

// // //       await emitAttendanceUpdate(attendanceEvent)

// // //       console.log("[v0] Calculating stats...")
// // //       const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
// // //       const totalStaff = await db.collection("staff").countDocuments({})
// // //       const totalStudents = await db.collection("students").countDocuments({})

// // //       const statsEvent: StatsUpdateEvent = {
// // //         type: "stats_update",
// // //         totalCounts: {
// // //           totalPeople: totalStaff + totalStudents,
// // //           present: allAttendanceForDate.filter((r) => r.status === "present").length,
// // //           absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
// // //           late: allAttendanceForDate.filter((r) => r.status === "late").length,
// // //         },
// // //         date,
// // //       }

// // //       await emitStatsUpdate(statsEvent)
// // //     }

// // //     console.log("[v0] PUT /api/attendance completed successfully")
// // //     return Response.json({
// // //       id: recordId,
// // //       updated: true,
// // //       status,
// // //       message: `Attendance status updated to ${status.toUpperCase()} successfully`,
// // //     })
// // //   } catch (error) {
// // //     console.error("[v0] PUT /api/attendance error:", error)
// // //     return Response.json(
// // //       {
// // //         error: "Internal server error",
// // //         message: error instanceof Error ? error.message : "Unknown error",
// // //         details: process.env.NODE_ENV === "development" ? error : undefined,
// // //       },
// // //       { status: 500 },
// // //     )
// // //   }
// // // }

// // // export async function DELETE(req: NextRequest) {
// // //   try {
// // //     let body: any
// // //     try {
// // //       body = await req.json()
// // //     } catch (parseError) {
// // //       console.error("[v0] Failed to parse DELETE body:", parseError)
// // //       return Response.json({ error: "INVALID_JSON", message: "Request body must be valid JSON" }, { status: 400 })
// // //     }

// // //     const recordId = body.recordId as string
// // //     const personId = body.personId as string
// // //     const date = (body.date as string) || todayStr()

// // //     if (!recordId || !personId) {
// // //       console.error("[v0] Missing required fields for DELETE:", { recordId, personId })
// // //       return Response.json({ error: "MISSING_FIELDS", message: "recordId and personId are required" }, { status: 400 })
// // //     }

// // //     if (!ObjectId.isValid(recordId) || !ObjectId.isValid(personId)) {
// // //       console.error("[v0] Invalid ObjectId for DELETE:", { recordId, personId })
// // //       return Response.json(
// // //         { error: "INVALID_OBJECT_ID", message: "recordId and personId must be valid MongoDB ObjectIds" },
// // //         { status: 400 },
// // //       )
// // //     }

// // //     const db = await getDb()

// // //     const existing = await db.collection("attendance").findOne({
// // //       _id: new ObjectId(recordId),
// // //       personId,
// // //       date,
// // //     })

// // //     if (!existing) {
// // //       console.log("[v0] DELETE /api/attendance - record not found", { recordId, personId, date })
// // //       return Response.json({ message: "Attendance record not found" }, { status: 404 })
// // //     }

// // //     const deleteRes = await db.collection("attendance").deleteOne({ _id: new ObjectId(recordId) })
// // //     if (deleteRes.deletedCount !== 1) {
// // //       console.error("[v0] DELETE /api/attendance - failed to delete", { recordId })
// // //       return Response.json({ message: "Failed to delete attendance record" }, { status: 400 })
// // //     }

// // //     const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
// // //     const totalStaff = await db.collection("staff").countDocuments({})
// // //     const totalStudents = await db.collection("students").countDocuments({})

// // //     const statsEvent: StatsUpdateEvent = {
// // //       type: "stats_update",
// // //       totalCounts: {
// // //         totalPeople: totalStaff + totalStudents,
// // //         present: allAttendanceForDate.filter((r) => r.status === "present").length,
// // //         absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
// // //         late: allAttendanceForDate.filter((r) => r.status === "late").length,
// // //       },
// // //       date,
// // //     }

// // //     await (async function emitStatsUpdateLocal(event: StatsUpdateEvent) {
// // //       try {
// // //         const baseUrl =
// // //           process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
// // //             ? `https://${process.env.VERCEL_URL}`
// // //             : "http://localhost:3000"

// // //         await fetch(`${baseUrl}/api/realtime/events`, {
// // //           method: "POST",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify({
// // //             type: "stats_update",
// // //             ...event,
// // //           }),
// // //         })
// // //       } catch (error) {
// // //         console.error("[v0] Failed to emit stats update (DELETE):", error)
// // //       }
// // //     })(statsEvent)

// // //     return Response.json({ id: recordId, deleted: true, message: "Attendance record deleted" })
// // //   } catch (error) {
// // //     console.error("[v0] DELETE /api/attendance error:", error)
// // //     return Response.json(
// // //       {
// // //         error: "INTERNAL_SERVER_ERROR",
// // //         message: error instanceof Error ? error.message : "Unknown error",
// // //       },
// // //       { status: 500 },
// // //     )
// // //   }
// // // }



// // import type { NextRequest } from "next/server"
// // import { getDb } from "@/lib/mongo"
// // import {
// //   DEPARTMENTS,
// //   ROLES,
// //   SHIFTS,
// //   todayStr,
// //   SHIFT_TIMINGS,
// //   canMarkAttendanceDuringShiftWithTimezone,
// //   getTimeUntilShiftStartsWithTimezone,
// //   getAttendanceStatusWithTimezone,
// // } from "@/lib/constants"
// // import { ObjectId } from "mongodb"
// // import type { AttendanceUpdateEvent, StatsUpdateEvent } from "@/lib/socket"
// // import {
// //   buildRuntimeTimings,
// //   canMarkAttendanceDuringShiftWithTimezoneRuntime,
// //   getAttendanceStatusWithTimezoneRuntime,
// //   type RuntimeTimings,
// // } from "@/lib/shift-settings"
// // import { isWithinRadius } from "@/lib/location-utils"

// // async function emitAttendanceUpdate(event: AttendanceUpdateEvent) {
// //   try {
// //     const baseUrl =
// //       process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
// //         ? `https://${process.env.VERCEL_URL}`
// //         : "http://localhost:3000"

// //     console.log("[v0] Emitting attendance update to:", `${baseUrl}/api/realtime/events`)

// //     const response = await fetch(`${baseUrl}/api/realtime/events`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         type: "attendance_update",
// //         ...event,
// //       }),
// //     })

// //     if (!response.ok) {
// //       console.error("[v0] Real-time event failed:", response.status, response.statusText)
// //     } else {
// //       console.log("[v0] Real-time event sent successfully")
// //     }
// //   } catch (error) {
// //     console.error("[v0] Failed to emit attendance update:", error)
// //     // Don't fail the main request if real-time update fails
// //   }
// // }

// // async function emitStatsUpdate(event: StatsUpdateEvent) {
// //   try {
// //     const baseUrl =
// //       process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
// //         ? `https://${process.env.VERCEL_URL}`
// //         : "http://localhost:3000"

// //     await fetch(`${baseUrl}/api/realtime/events`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         type: "stats_update",
// //         ...event,
// //       }),
// //     })
// //   } catch (error) {
// //     console.error("[v0] Failed to emit stats update:", error)
// //     // Don't fail the main request if real-time update fails
// //   }
// // }

// // export async function GET(req: NextRequest) {
// //   try {
// //     console.log("[v0] GET /api/attendance - Starting request")
// //     const db = await getDb()
// //     console.log("[v0] Database connection successful")

// //     const { searchParams } = new URL(req.url)
// //     const department = searchParams.get("department") || undefined
// //     const role = searchParams.get("role") || undefined
// //     const shift = searchParams.get("shift") || undefined
// //     const status = searchParams.get("status") || undefined
// //     const date = searchParams.get("date") || todayStr() // Default to today
// //     const personType = (searchParams.get("personType") as "staff" | "student" | null) || undefined
// //     const institutionName = searchParams.get("institutionName") || undefined
// //     const personIdParam = searchParams.get("personId") || undefined

// //     const query: any = { date }
// //     if (department && department !== "all") query.department = department
// //     if (role && role !== "all") query.role = role
// //     if (shift && shift !== "all") query.shift = shift
// //     if (status && status !== "all") query.status = status
// //     if (personType) query.personType = personType

// //     let personIdFilter: string[] | null = null
// //     if (personIdParam) {
// //       query.personId = personIdParam
// //     } else if (institutionName) {
// //       const [instStaff, instStudents] = await Promise.all([
// //         db.collection("staff").find({ institutionName }).project({ _id: 1 }).toArray(),
// //         db.collection("students").find({ institutionName }).project({ _id: 1 }).toArray(),
// //       ])
// //       personIdFilter = [...instStaff, ...instStudents].map((d) => d._id.toString())
// //       query.personId = { $in: personIdFilter }
// //     }

// //     const records = await db.collection("attendance").find(query).toArray()

// //     const allAttendanceForDateQuery: any = { date }
// //     if (personIdParam) {
// //       allAttendanceForDateQuery.personId = personIdParam
// //     } else if (personIdFilter) {
// //       allAttendanceForDateQuery.personId = { $in: personIdFilter }
// //     }
// //     const allAttendanceForDate = await db.collection("attendance").find(allAttendanceForDateQuery).toArray()

// //     let totalPeople: number
// //     if (personIdParam) {
// //       totalPeople = 1
// //     } else {
// //       const staffCountFilter: any = institutionName ? { institutionName } : {}
// //       const studentCountFilter: any = institutionName ? { institutionName } : {}
// //       const [totalStaff, totalStudents] = await Promise.all([
// //         db.collection("staff").countDocuments(staffCountFilter),
// //         db.collection("students").countDocuments(studentCountFilter),
// //       ])
// //       totalPeople = totalStaff + totalStudents
// //     }

// //     const enrichedRecords = await Promise.all(
// //       records.map(async (r: any) => {
// //         const personCol = r.personType === "staff" ? "staff" : "students"
// //         const person = await db.collection(personCol).findOne({ _id: new ObjectId(r.personId) })
// //         return {
// //           ...r,
// //           id: r._id?.toString(),
// //           personName: person?.name || person?.fullName || person?.firstName || "Unknown",
// //           imageUrl: person?.photoUrl || person?.imageUrl || null,
// //           employeeCode: r.personType === "staff" ? person?.employeeCode : undefined,
// //           rollNumber: r.personType === "student" ? person?.rollNumber : undefined,
// //           classLevel: r.personType === "student" ? person?.classLevel : undefined,
// //         }
// //       }),
// //     )

// //     const normalized = enrichedRecords.map(({ _id, ...rest }) => rest)

// //     return Response.json({
// //       records: normalized,
// //       departments: DEPARTMENTS,
// //       roles: ROLES,
// //       shifts: SHIFTS,
// //       totalCounts: {
// //         totalPeople,
// //         present: allAttendanceForDate.filter((r) => r.status === "present").length,
// //         absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
// //         late: allAttendanceForDate.filter((r) => r.status === "late").length,
// //       },
// //     })
// //   } catch (error) {
// //     console.error("[v0] GET /api/attendance error:", error)
// //     return Response.json(
// //       {
// //         error: "Internal server error",
// //         message: error instanceof Error ? error.message : "Unknown error",
// //         details: process.env.NODE_ENV === "development" ? error : undefined,
// //       },
// //       { status: 500 },
// //     )
// //   }
// // }

// // export async function POST(req: NextRequest) {
// //   try {
// //     console.log("[v0] POST /api/attendance - Starting request")
// //     console.log("[v0] Environment check:", {
// //       NODE_ENV: process.env.NODE_ENV,
// //       MONGODB_URI: !!process.env.MONGODB_URI,
// //       MONGODB_DB: !!process.env.MONGODB_DB,
// //       NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
// //       VERCEL_URL: process.env.VERCEL_URL,
// //     })

// //     let body
// //     try {
// //       body = await req.json()
// //       console.log("[v0] Request body parsed successfully:", {
// //         personId: body.personId,
// //         personType: body.personType,
// //         status: body.status,
// //         hasBody: !!body,
// //         hasLocation: !!body.currentLocation,
// //       })
// //     } catch (parseError) {
// //       console.error("[v0] Failed to parse request body:", parseError)
// //       return Response.json(
// //         {
// //           error: "INVALID_JSON",
// //           message: "Request body must be valid JSON",
// //           details: parseError instanceof Error ? parseError.message : "Unknown parse error",
// //         },
// //         { status: 400 },
// //       )
// //     }

// //     const personId = body.personId as string
// //     const personType = body.personType as "staff" | "student"
// //     let status = body.status as "present" | "absent" | "late"
// //     const date = (body.date as string) || todayStr()
// //     const timezone = body.timezone || "Asia/Kolkata"
// //     const currentLocation = body.currentLocation as { latitude: number; longitude: number } | undefined

// //     const operatorRole: string | undefined = body.operator?.role
// //     const operatorBranchRaw: string = (body.operator?.branch || body.operator?.branchClass || "").toUpperCase().trim()

// //     console.log("[v0] Extracted fields:", {
// //       personId,
// //       personType,
// //       status,
// //       date,
// //       timezone,
// //       hasCurrentLocation: !!currentLocation,
// //     })

// //     if (!personId || !personType) {
// //       console.error("[v0] Missing required fields:", {
// //         personId: !!personId,
// //         personType: !!personType,
// //         bodyKeys: Object.keys(body || {}),
// //       })
// //       return Response.json(
// //         {
// //           error: "MISSING_FIELDS",
// //           message: "personId and personType are required",
// //           received: {
// //             personId: !!personId,
// //             personType: !!personType,
// //             bodyKeys: Object.keys(body || {}),
// //           },
// //         },
// //         { status: 400 },
// //       )
// //     }

// //     if (!ObjectId.isValid(personId)) {
// //       console.error("[v0] Invalid ObjectId format:", personId)
// //       return Response.json(
// //         {
// //           error: "INVALID_OBJECT_ID",
// //           message: "personId must be a valid MongoDB ObjectId",
// //           received: personId,
// //         },
// //         { status: 400 },
// //       )
// //     }

// //     console.log("[v0] Connecting to database...")
// //     let db
// //     try {
// //       db = await getDb()
// //       console.log("[v0] Database connection successful")
// //     } catch (dbError) {
// //       console.error("[v0] Database connection failed:", dbError)
// //       return Response.json(
// //         {
// //           error: "DATABASE_CONNECTION_FAILED",
// //           message: "Failed to connect to database",
// //           details: dbError instanceof Error ? dbError.message : "Unknown database error",
// //         },
// //         { status: 500 },
// //       )
// //     }

// //     console.log("[v0] Checking for existing attendance...")
// //     const existingAttendance = await db.collection("attendance").findOne({ personId, date })

// //     if (existingAttendance) {
// //       console.log("[v0] Attendance already exists:", existingAttendance.status)
// //       return Response.json(
// //         {
// //           id: existingAttendance._id?.toString(),
// //           updated: false,
// //           alreadyMarked: true,
// //           status: existingAttendance.status,
// //           message: `Attendance already marked as ${existingAttendance.status.toUpperCase()} today. Cannot be changed.`,
// //           error: "ALREADY_MARKED",
// //         },
// //         { status: 409 },
// //       )
// //     }

// //     console.log("[v0] Finding person in database...")
// //     const personCol = personType === "staff" ? "staff" : "students"
// //     const person = await db.collection(personCol).findOne({ _id: new ObjectId(personId) })

// //     if (!person) {
// //       console.error("[v0] Person not found:", { personId, personType, collection: personCol })
// //       return Response.json(
// //         {
// //           error: "Person not found",
// //           message: `No ${personType} found with ID ${personId}`,
// //         },
// //         { status: 404 },
// //       )
// //     }

// //     console.log("[v0] Person found:", { name: person.name || person.fullName, shift: person.shift })

// //     const settingsDoc = await db.collection("app_settings").findOne({ _id: "global" })
// //     const globalLocationVerificationEnabled = settingsDoc?.data?.attendance?.locationVerificationEnabled ?? true
// //     const locationRadiusMeters = settingsDoc?.data?.attendance?.locationRadiusMeters ?? 100
// //     const personLocationVerificationEnabled = (person as any).locationVerificationEnabled ?? false

// //     console.log("[v0] Location verification settings:", {
// //       globalEnabled: globalLocationVerificationEnabled,
// //       personEnabled: personLocationVerificationEnabled,
// //       radius: locationRadiusMeters,
// //     })

// //     if (globalLocationVerificationEnabled && personLocationVerificationEnabled) {
// //       const assignedLocation = (person as any).location as
// //         | { latitude: number; longitude: number; address?: string }
// //         | undefined

// //       if (assignedLocation?.latitude && assignedLocation?.longitude) {
// //         if (!currentLocation?.latitude || !currentLocation?.longitude) {
// //           console.log("[v0] Location required but not provided")
// //           return Response.json(
// //             {
// //               error: "LOCATION_REQUIRED",
// //               message: "Your location is required to mark attendance. Please enable location access.",
// //             },
// //             { status: 400 },
// //           )
// //         }

// //         const withinRadius = isWithinRadius(
// //           currentLocation.latitude,
// //           currentLocation.longitude,
// //           assignedLocation.latitude,
// //           assignedLocation.longitude,
// //           locationRadiusMeters,
// //         )

// //         if (!withinRadius) {
// //           console.log("[v0] Location verification failed:", {
// //             current: currentLocation,
// //             assigned: assignedLocation,
// //           })
// //           return Response.json(
// //             {
// //               error: "LOCATION_MISMATCH",
// //               message: `You must be within ${locationRadiusMeters}m of ${assignedLocation.address || "your assigned location"} to mark attendance.`,
// //               details: {
// //                 assignedLocation: assignedLocation.address || "Assigned location",
// //                 radiusMeters: locationRadiusMeters,
// //               },
// //             },
// //             { status: 403 },
// //           )
// //         }

// //         console.log("[v0] Location verified successfully")
// //       }
// //     } else {
// //       console.log("[v0] Location verification is disabled (global or individual), skipping location check")
// //     }

// //     const institutionName = (person as any)?.institutionName
// //     let runtimeTimings: RuntimeTimings | null = null
// //     if (institutionName) {
// //       const doc = await db.collection("shift_settings").findOne({ institutionName })
// //       if (doc?.shifts?.length) {
// //         runtimeTimings = buildRuntimeTimings(doc.shifts as any)
// //       }
// //     }

// //     const personShift = person.shift as keyof typeof SHIFT_TIMINGS

// //     const withinShift = runtimeTimings
// //       ? canMarkAttendanceDuringShiftWithTimezoneRuntime(personShift, runtimeTimings, timezone)
// //       : canMarkAttendanceDuringShiftWithTimezone(personShift, timezone)
// //     if (!withinShift) {
// //       const shiftMessage = getTimeUntilShiftStartsWithTimezone(personShift, timezone)
// //       console.log("[v0] Outside shift hours:", { shift: personShift, message: shiftMessage, timezone })
// //       return Response.json(
// //         {
// //           id: null,
// //           updated: false,
// //           alreadyMarked: false,
// //           status: null,
// //           message: shiftMessage || "Cannot mark attendance outside shift hours",
// //           error: "OUTSIDE_SHIFT_HOURS",
// //         },
// //         { status: 400 },
// //       )
// //     }

// //     const shiftKey = person.shift as keyof typeof SHIFT_TIMINGS
// //     const computedStatus = shiftKey
// //       ? runtimeTimings
// //         ? getAttendanceStatusWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
// //         : getAttendanceStatusWithTimezone(shiftKey, timezone)
// //       : null

// //     if (computedStatus === "window_closed") {
// //       const windowClose = runtimeTimings
// //         ? runtimeTimings[shiftKey].attendanceWindow
// //         : SHIFT_TIMINGS[shiftKey].attendanceWindow
// //       return Response.json(
// //         {
// //           id: null,
// //           updated: false,
// //           alreadyMarked: false,
// //           status: null,
// //           message: `Attendance window closed for ${
// //             (runtimeTimings ? runtimeTimings[shiftKey].name : SHIFT_TIMINGS[shiftKey].name) || "shift"
// //           } at ${windowClose}`,
// //           error: "OUTSIDE_SHIFT_HOURS",
// //         },
// //         { status: 400 },
// //       )
// //     }

// //     if (!body.status && person.shift) {
// //       if (computedStatus === "window_closed") {
// //         status = "absent"
// //       } else {
// //         status = (computedStatus as "present" | "late" | "absent") ?? "absent"
// //       }
// //       console.log("[v0] Auto-determined status (runtime-aware):", status)
// //     } else if (body.status && computedStatus) {
// //       if (body.status === "present" && computedStatus === "late") {
// //         status = "late"
// //         console.log("[v0] Normalized requested status from PRESENT to LATE based on shift timing (runtime-aware)")
// //       }
// //     }

// //     if (personType === "student" && operatorRole === "Teacher") {
// //       const stBranchClass = ((person as any)?.branchClass || "").toUpperCase().trim()
// //       const stBranch = ((person as any)?.branch || "").toUpperCase().trim()

// //       if (!operatorBranchRaw) {
// //         return Response.json(
// //           {
// //             error: "UNASSIGNED_TEACHER",
// //             message: "Teacher has no assigned branch/class. Cannot mark student attendance.",
// //           },
// //           { status: 403 },
// //         )
// //       }

// //       const matches = operatorBranchRaw.includes("-")
// //         ? stBranchClass === operatorBranchRaw
// //         : stBranch === operatorBranchRaw ||
// //           stBranchClass === operatorBranchRaw ||
// //           stBranchClass.startsWith(operatorBranchRaw + "-")

// //       if (!matches) {
// //         return Response.json(
// //           {
// //             error: "FORBIDDEN_BRANCH",
// //             message: `Student not in your assigned branch/class (${operatorBranchRaw}).`,
// //             details: { studentBranch: stBranch, studentBranchClass: stBranchClass },
// //           },
// //           { status: 403 },
// //         )
// //       }
// //     }

// //     const nowIso = new Date().toISOString()
// //     const filter = { personId, date }
// //     const update = {
// //       $set: {
// //         personId,
// //         personType,
// //         date,
// //         status,
// //         timestamp: nowIso,
// //         department: (person as any).department,
// //         role: (person as any).role,
// //         shift: (person as any).shift,
// //       },
// //     }

// //     console.log("[v0] Updating attendance record...")
// //     const result = await db.collection("attendance").updateOne(filter, update, { upsert: true })
// //     const updated = result.matchedCount > 0
// //     const id = result.upsertedId
// //       ? result.upsertedId.toString()
// //       : (await db.collection("attendance").findOne(filter))?._id?.toString()

// //     console.log("[v0] Attendance record updated:", { id, updated })

// //     const attendanceEvent: AttendanceUpdateEvent = {
// //       type: updated ? "attendance_updated" : "attendance_marked",
// //       personId,
// //       personType,
// //       personName: person.name || person.fullName || person.firstName || "Unknown",
// //       status,
// //       timestamp: nowIso,
// //       shift: person.shift,
// //       department: person.department,
// //       delayInfo: body.delayInfo,
// //       message: updated ? "Attendance updated successfully" : "Attendance marked successfully",
// //     }

// //     await emitAttendanceUpdate(attendanceEvent)

// //     console.log("[v0] Calculating stats...")
// //     const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
// //     const totalStaff = await db.collection("staff").countDocuments({})
// //     const totalStudents = await db.collection("students").countDocuments({})

// //     const statsEvent: StatsUpdateEvent = {
// //       type: "stats_update",
// //       totalCounts: {
// //         totalPeople: totalStaff + totalStudents,
// //         present: allAttendanceForDate.filter((r) => r.status === "present").length,
// //         absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
// //         late: allAttendanceForDate.filter((r) => r.status === "late").length,
// //       },
// //       date,
// //     }

// //     await emitStatsUpdate(statsEvent)

// //     console.log("[v0] POST /api/attendance completed successfully")
// //     return Response.json({
// //       id,
// //       updated: !!updated,
// //       alreadyMarked: false,
// //       status,
// //       message: updated ? "Attendance updated successfully" : "Attendance marked successfully",
// //     })
// //   } catch (error) {
// //     console.error("[v0] POST /api/attendance error:", error)
// //     return Response.json(
// //       {
// //         error: "INTERNAL_SERVER_ERROR",
// //         message: error instanceof Error ? error.message : "Unknown error",
// //         stack: process.env.NODE_ENV === "development" ? (error as Error).stack : undefined,
// //       },
// //       { status: 500 },
// //     )
// //   }
// // }

// // export async function PUT(req: NextRequest) {
// //   try {
// //     console.log("[v0] PUT /api/attendance - Starting request")

// //     let body
// //     try {
// //       body = await req.json()
// //     } catch (parseError) {
// //       console.error("[v0] Failed to parse request body:", parseError)
// //       return Response.json(
// //         {
// //           error: "Invalid JSON in request body",
// //           message: "Request body must be valid JSON",
// //         },
// //         { status: 400 },
// //       )
// //     }

// //     const recordId = body.recordId as string
// //     const personId = body.personId as string
// //     const personType = body.personType as "staff" | "student"
// //     let status = body.status as "present" | "absent" | "late"
// //     const date = (body.date as string) || todayStr()
// //     const timezone = body.timezone || "Asia/Kolkata"

// //     if (!recordId || !personId || !personType || !status) {
// //       console.error("[v0] Missing required fields for PUT:", { recordId, personId, personType, status })
// //       return Response.json(
// //         {
// //           error: "Missing required fields",
// //           message: "recordId, personId, personType, and status are required",
// //         },
// //         { status: 400 },
// //       )
// //     }

// //     if (!ObjectId.isValid(recordId) || !ObjectId.isValid(personId)) {
// //       console.error("[v0] Invalid ObjectId format:", { recordId, personId })
// //       return Response.json(
// //         {
// //           error: "Invalid ID format",
// //           message: "recordId and personId must be valid MongoDB ObjectIds",
// //         },
// //         { status: 400 },
// //       )
// //     }

// //     const db = await getDb()

// //     console.log("[v0] Verifying attendance record exists...")
// //     const existingRecord = await db.collection("attendance").findOne({
// //       _id: new ObjectId(recordId),
// //       personId,
// //       date,
// //     })

// //     if (!existingRecord) {
// //       console.log("[v0] Attendance record not found:", { recordId, personId, date })
// //       return Response.json({ message: "Attendance record not found" }, { status: 404 })
// //     }

// //     console.log("[v0] Finding person in database...")
// //     const personCol = personType === "staff" ? "staff" : "students"
// //     const person = await db.collection(personCol).findOne({ _id: new ObjectId(personId) })

// //     if (person?.shift) {
// //       const institutionName = (person as any)?.institutionName
// //       let runtimeTimings: RuntimeTimings | null = null
// //       if (institutionName) {
// //         const doc = await db.collection("shift_settings").findOne({ institutionName })
// //         if (doc?.shifts?.length) {
// //           runtimeTimings = buildRuntimeTimings(doc.shifts as any)
// //         }
// //       }

// //       const shiftKey = person.shift as keyof typeof SHIFT_TIMINGS

// //       const withinShift = runtimeTimings
// //         ? canMarkAttendanceDuringShiftWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
// //         : canMarkAttendanceDuringShiftWithTimezone(shiftKey, timezone)
// //       if (!withinShift) {
// //         const msg = getTimeUntilShiftStartsWithTimezone(shiftKey, timezone) || "Cannot update outside shift hours"
// //         return Response.json({ error: "OUTSIDE_SHIFT_HOURS", message: msg }, { status: 400 })
// //       }

// //       const computedStatus = runtimeTimings
// //         ? getAttendanceStatusWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
// //         : getAttendanceStatusWithTimezone(shiftKey, timezone)
// //       if (computedStatus === "window_closed") {
// //         const windowClose = runtimeTimings
// //           ? runtimeTimings[shiftKey].attendanceWindow
// //           : SHIFT_TIMINGS[shiftKey].attendanceWindow
// //         return Response.json(
// //           {
// //             error: "OUTSIDE_SHIFT_HOURS",
// //             message: `Attendance window closed for ${
// //               (runtimeTimings ? runtimeTimings[shiftKey].name : SHIFT_TIMINGS[shiftKey].name) || "shift"
// //             } at ${windowClose}`,
// //           },
// //           { status: 400 },
// //         )
// //       }

// //       if (status === "present" && computedStatus === "late") {
// //         status = "late"
// //         console.log("[v0] Normalized PUT status from PRESENT to LATE based on shift timing (runtime-aware)")
// //       }
// //     }

// //     console.log("[v0] Updating attendance status...")
// //     const nowIso = new Date().toISOString()
// //     const result = await db.collection("attendance").updateOne(
// //       { _id: new ObjectId(recordId) },
// //       {
// //         $set: {
// //           status,
// //           timestamp: nowIso,
// //           lastModified: nowIso,
// //           modifiedManually: true,
// //         },
// //       },
// //     )

// //     if (result.matchedCount === 0) {
// //       console.error("[v0] Failed to update attendance status:", { recordId, personId, status })
// //       return Response.json({ message: "Failed to update attendance status" }, { status: 400 })
// //     }

// //     if (person) {
// //       const attendanceEvent: AttendanceUpdateEvent = {
// //         type: "attendance_updated",
// //         personId,
// //         personType,
// //         personName: person.name || person.fullName || person.firstName || "Unknown",
// //         status,
// //         timestamp: nowIso,
// //         shift: person.shift,
// //         department: person.department,
// //         message: `Attendance status updated to ${status.toUpperCase()} successfully`,
// //       }

// //       await emitAttendanceUpdate(attendanceEvent)

// //       console.log("[v0] Calculating stats...")
// //       const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
// //       const totalStaff = await db.collection("staff").countDocuments({})
// //       const totalStudents = await db.collection("students").countDocuments({})

// //       const statsEvent: StatsUpdateEvent = {
// //         type: "stats_update",
// //         totalCounts: {
// //           totalPeople: totalStaff + totalStudents,
// //           present: allAttendanceForDate.filter((r) => r.status === "present").length,
// //           absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
// //           late: allAttendanceForDate.filter((r) => r.status === "late").length,
// //         },
// //         date,
// //       }

// //       await emitStatsUpdate(statsEvent)
// //     }

// //     console.log("[v0] PUT /api/attendance completed successfully")
// //     return Response.json({
// //       id: recordId,
// //       updated: true,
// //       status,
// //       message: `Attendance status updated to ${status.toUpperCase()} successfully`,
// //     })
// //   } catch (error) {
// //     console.error("[v0] PUT /api/attendance error:", error)
// //     return Response.json(
// //       {
// //         error: "Internal server error",
// //         message: error instanceof Error ? error.message : "Unknown error",
// //         details: process.env.NODE_ENV === "development" ? error : undefined,
// //       },
// //       { status: 500 },
// //     )
// //   }
// // }

// // export async function DELETE(req: NextRequest) {
// //   try {
// //     let body: any
// //     try {
// //       body = await req.json()
// //     } catch (parseError) {
// //       console.error("[v0] Failed to parse DELETE body:", parseError)
// //       return Response.json({ error: "INVALID_JSON", message: "Request body must be valid JSON" }, { status: 400 })
// //     }

// //     const recordId = body.recordId as string
// //     const personId = body.personId as string
// //     const date = (body.date as string) || todayStr()

// //     if (!recordId || !personId) {
// //       console.error("[v0] Missing required fields for DELETE:", { recordId, personId })
// //       return Response.json({ error: "MISSING_FIELDS", message: "recordId and personId are required" }, { status: 400 })
// //     }

// //     if (!ObjectId.isValid(recordId) || !ObjectId.isValid(personId)) {
// //       console.error("[v0] Invalid ObjectId for DELETE:", { recordId, personId })
// //       return Response.json(
// //         { error: "INVALID_OBJECT_ID", message: "recordId and personId must be valid MongoDB ObjectIds" },
// //         { status: 400 },
// //       )
// //     }

// //     const db = await getDb()

// //     const existing = await db.collection("attendance").findOne({
// //       _id: new ObjectId(recordId),
// //       personId,
// //       date,
// //     })

// //     if (!existing) {
// //       console.log("[v0] DELETE /api/attendance - record not found", { recordId, personId, date })
// //       return Response.json({ message: "Attendance record not found" }, { status: 404 })
// //     }

// //     const deleteRes = await db.collection("attendance").deleteOne({ _id: new ObjectId(recordId) })
// //     if (deleteRes.deletedCount !== 1) {
// //       console.error("[v0] DELETE /api/attendance - failed to delete", { recordId })
// //       return Response.json({ message: "Failed to delete attendance record" }, { status: 400 })
// //     }

// //     const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
// //     const totalStaff = await db.collection("staff").countDocuments({})
// //     const totalStudents = await db.collection("students").countDocuments({})

// //     const statsEvent: StatsUpdateEvent = {
// //       type: "stats_update",
// //       totalCounts: {
// //         totalPeople: totalStaff + totalStudents,
// //         present: allAttendanceForDate.filter((r) => r.status === "present").length,
// //         absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
// //         late: allAttendanceForDate.filter((r) => r.status === "late").length,
// //       },
// //       date,
// //     }

// //     await (async function emitStatsUpdateLocal(event: StatsUpdateEvent) {
// //       try {
// //         const baseUrl =
// //           process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
// //             ? `https://${process.env.VERCEL_URL}`
// //             : "http://localhost:3000"

// //         await fetch(`${baseUrl}/api/realtime/events`, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             type: "stats_update",
// //             ...event,
// //           }),
// //         })
// //       } catch (error) {
// //         console.error("[v0] Failed to emit stats update (DELETE):", error)
// //       }
// //     })(statsEvent)

// //     return Response.json({ id: recordId, deleted: true, message: "Attendance record deleted" })
// //   } catch (error) {
// //     console.error("[v0] DELETE /api/attendance error:", error)
// //     return Response.json(
// //       {
// //         error: "INTERNAL_SERVER_ERROR",
// //         message: error instanceof Error ? error.message : "Unknown error",
// //       },
// //       { status: 500 },
// //     )
// //   }
// // }



// import type { NextRequest } from "next/server"
// import { getDb } from "@/lib/mongo"
// import {
//   DEPARTMENTS,
//   ROLES,
//   SHIFTS,
//   todayStr,
//   SHIFT_TIMINGS,
//   canMarkAttendanceDuringShiftWithTimezone,
//   getTimeUntilShiftStartsWithTimezone,
//   getAttendanceStatusWithTimezone,
// } from "@/lib/constants"
// import { ObjectId } from "mongodb"
// import type { AttendanceUpdateEvent, StatsUpdateEvent } from "@/lib/socket"
// import {
//   buildRuntimeTimings,
//   canMarkAttendanceDuringShiftWithTimezoneRuntime,
//   getAttendanceStatusWithTimezoneRuntime,
//   type RuntimeTimings,
// } from "@/lib/shift-settings"
// import { isWithinRadius } from "@/lib/location-utils"

// async function emitAttendanceUpdate(event: AttendanceUpdateEvent) {
//   try {
//     const baseUrl =
//       process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
//         ? `https://${process.env.VERCEL_URL}`
//         : "http://localhost:3000"

//     console.log("[v0] Emitting attendance update to:", `${baseUrl}/api/realtime/events`)

//     const response = await fetch(`${baseUrl}/api/realtime/events`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         type: "attendance_update",
//         ...event,
//       }),
//     })

//     if (!response.ok) {
//       console.error("[v0] Real-time event failed:", response.status, response.statusText)
//     } else {
//       console.log("[v0] Real-time event sent successfully")
//     }
//   } catch (error) {
//     console.error("[v0] Failed to emit attendance update:", error)
//     // Don't fail the main request if real-time update fails
//   }
// }

// async function emitStatsUpdate(event: StatsUpdateEvent) {
//   try {
//     const baseUrl =
//       process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
//         ? `https://${process.env.VERCEL_URL}`
//         : "http://localhost:3000"

//     await fetch(`${baseUrl}/api/realtime/events`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         type: "stats_update",
//         ...event,
//       }),
//     })
//   } catch (error) {
//     console.error("[v0] Failed to emit stats update:", error)
//     // Don't fail the main request if real-time update fails
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     console.log("[v0] GET /api/attendance - Starting request")
//     const db = await getDb()
//     console.log("[v0] Database connection successful")

//     const { searchParams } = new URL(req.url)
//     const department = searchParams.get("department") || undefined
//     const role = searchParams.get("role") || undefined
//     const shift = searchParams.get("shift") || undefined
//     const status = searchParams.get("status") || undefined
//     const date = searchParams.get("date") || todayStr() // Default to today
//     const personType = (searchParams.get("personType") as "staff" | "student" | null) || undefined
//     const institutionName = searchParams.get("institutionName") || undefined
//     const personIdParam = searchParams.get("personId") || undefined

//     const query: any = { date }
//     if (department && department !== "all") query.department = department
//     if (role && role !== "all") query.role = role
//     if (shift && shift !== "all") query.shift = shift
//     if (status && status !== "all") query.status = status
//     if (personType) query.personType = personType

//     let personIdFilter: string[] | null = null
//     if (personIdParam) {
//       query.personId = personIdParam
//     } else if (institutionName) {
//       const [instStaff, instStudents] = await Promise.all([
//         db.collection("staff").find({ institutionName }).project({ _id: 1 }).toArray(),
//         db.collection("students").find({ institutionName }).project({ _id: 1 }).toArray(),
//       ])
//       personIdFilter = [...instStaff, ...instStudents].map((d) => d._id.toString())
//       query.personId = { $in: personIdFilter }
//     }

//     const records = await db.collection("attendance").find(query).toArray()

//     const allAttendanceForDateQuery: any = { date }
//     if (personIdParam) {
//       allAttendanceForDateQuery.personId = personIdParam
//     } else if (personIdFilter) {
//       allAttendanceForDateQuery.personId = { $in: personIdFilter }
//     }
//     const allAttendanceForDate = await db.collection("attendance").find(allAttendanceForDateQuery).toArray()

//     let totalPeople: number
//     if (personIdParam) {
//       totalPeople = 1
//     } else {
//       const staffCountFilter: any = institutionName ? { institutionName } : {}
//       const studentCountFilter: any = institutionName ? { institutionName } : {}
//       const [totalStaff, totalStudents] = await Promise.all([
//         db.collection("staff").countDocuments(staffCountFilter),
//         db.collection("students").countDocuments(studentCountFilter),
//       ])
//       totalPeople = totalStaff + totalStudents
//     }

//     const enrichedRecords = await Promise.all(
//       records.map(async (r: any) => {
//         const personCol = r.personType === "staff" ? "staff" : "students"
//         const person = await db.collection(personCol).findOne({ _id: new ObjectId(r.personId) })
//         return {
//           ...r,
//           id: r._id?.toString(),
//           personName: person?.name || person?.fullName || person?.firstName || "Unknown",
//           imageUrl: person?.photoUrl || person?.imageUrl || null,
//           employeeCode: r.personType === "staff" ? person?.employeeCode : undefined,
//           rollNumber: r.personType === "student" ? person?.rollNumber : undefined,
//           classLevel: r.personType === "student" ? person?.classLevel : undefined,
//         }
//       }),
//     )

//     const normalized = enrichedRecords.map(({ _id, ...rest }) => rest)

//     return Response.json({
//       records: normalized,
//       departments: DEPARTMENTS,
//       roles: ROLES,
//       shifts: SHIFTS,
//       totalCounts: {
//         totalPeople,
//         present: allAttendanceForDate.filter((r) => r.status === "present").length,
//         absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
//         late: allAttendanceForDate.filter((r) => r.status === "late").length,
//       },
//     })
//   } catch (error) {
//     console.error("[v0] GET /api/attendance error:", error)
//     return Response.json(
//       {
//         error: "Internal server error",
//         message: error instanceof Error ? error.message : "Unknown error",
//         details: process.env.NODE_ENV === "development" ? error : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     console.log("[v0] POST /api/attendance - Starting request")
//     console.log("[v0] Environment check:", {
//       NODE_ENV: process.env.NODE_ENV,
//       MONGODB_URI: !!process.env.MONGODB_URI,
//       MONGODB_DB: !!process.env.MONGODB_DB,
//       NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
//       VERCEL_URL: process.env.VERCEL_URL,
//     })

//     let body
//     try {
//       body = await req.json()
//       console.log("[v0] Request body parsed successfully:", {
//         personId: body.personId,
//         personType: body.personType,
//         status: body.status,
//         hasBody: !!body,
//         hasLocation: !!body.currentLocation,
//       })
//     } catch (parseError) {
//       console.error("[v0] Failed to parse request body:", parseError)
//       return Response.json(
//         {
//           error: "INVALID_JSON",
//           message: "Request body must be valid JSON",
//           details: parseError instanceof Error ? parseError.message : "Unknown parse error",
//         },
//         { status: 400 },
//       )
//     }

//     const personId = body.personId as string
//     const personType = body.personType as "staff" | "student"
//     let status = body.status as "present" | "absent" | "late"
//     const date = (body.date as string) || todayStr()
//     const timezone = body.timezone || "Asia/Kolkata"
//     const currentLocation = body.currentLocation as { latitude: number; longitude: number } | undefined

//     const operatorRole: string | undefined = body.operator?.role
//     const operatorBranchRaw: string = (body.operator?.branch || body.operator?.branchClass || "").toUpperCase().trim()

//     console.log("[v0] Extracted fields:", {
//       personId,
//       personType,
//       status,
//       date,
//       timezone,
//       hasCurrentLocation: !!currentLocation,
//     })

//     if (!personId || !personType) {
//       console.error("[v0] Missing required fields:", {
//         personId: !!personId,
//         personType: !!personType,
//         bodyKeys: Object.keys(body || {}),
//       })
//       return Response.json(
//         {
//           error: "MISSING_FIELDS",
//           message: "personId and personType are required",
//           received: {
//             personId: !!personId,
//             personType: !!personType,
//             bodyKeys: Object.keys(body || {}),
//           },
//         },
//         { status: 400 },
//       )
//     }

//     if (!ObjectId.isValid(personId)) {
//       console.error("[v0] Invalid ObjectId format:", personId)
//       return Response.json(
//         {
//           error: "INVALID_OBJECT_ID",
//           message: "personId must be a valid MongoDB ObjectId",
//           received: personId,
//         },
//         { status: 400 },
//       )
//     }

//     console.log("[v0] Connecting to database...")
//     let db
//     try {
//       db = await getDb()
//       console.log("[v0] Database connection successful")
//     } catch (dbError) {
//       console.error("[v0] Database connection failed:", dbError)
//       return Response.json(
//         {
//           error: "DATABASE_CONNECTION_FAILED",
//           message: "Failed to connect to database",
//           details: dbError instanceof Error ? dbError.message : "Unknown database error",
//         },
//         { status: 500 },
//       )
//     }

//     console.log("[v0] Checking for existing attendance...")
//     const existingAttendance = await db.collection("attendance").findOne({ personId, date })

//     if (existingAttendance) {
//       console.log("[v0] Attendance already exists:", existingAttendance.status)
//       return Response.json(
//         {
//           id: existingAttendance._id?.toString(),
//           updated: false,
//           alreadyMarked: true,
//           status: existingAttendance.status,
//           message: `Attendance already marked as ${existingAttendance.status.toUpperCase()} today. Cannot be changed.`,
//           error: "ALREADY_MARKED",
//         },
//         { status: 409 },
//       )
//     }

//     console.log("[v0] Finding person in database...")
//     const personCol = personType === "staff" ? "staff" : "students"
//     const person = await db.collection(personCol).findOne({ _id: new ObjectId(personId) })

//     if (!person) {
//       console.error("[v0] Person not found:", { personId, personType, collection: personCol })
//       return Response.json(
//         {
//           error: "Person not found",
//           message: `No ${personType} found with ID ${personId}`,
//         },
//         { status: 404 },
//       )
//     }

//     console.log("[v0] Person found:", { name: person.name || person.fullName, shift: person.shift })

//     const institutionName = (person as any)?.institutionName
//     let institutionLocationEnabled = false

//     if (institutionName) {
//       const institutionDoc = await db.collection("institutions").findOne({ name: institutionName })
//       institutionLocationEnabled = institutionDoc?.locationVerificationEnabled ?? false
//       console.log("[v0] Institution location verification:", {
//         institution: institutionName,
//         enabled: institutionLocationEnabled,
//       })
//     }

//     const personLocationVerificationEnabled = (person as any).locationVerificationEnabled ?? false

//     console.log("[v0] Location verification settings:", {
//       institutionEnabled: institutionLocationEnabled,
//       personEnabled: personLocationVerificationEnabled,
//       willCheck: institutionLocationEnabled && personLocationVerificationEnabled,
//     })

//     if (institutionLocationEnabled && personLocationVerificationEnabled) {
//       const assignedLocation = (person as any).location as
//         | { latitude: number; longitude: number; address?: string }
//         | undefined

//       if (assignedLocation?.latitude && assignedLocation?.longitude) {
//         if (!currentLocation?.latitude || !currentLocation?.longitude) {
//           console.log("[v0] Location required but not provided")
//           return Response.json(
//             {
//               error: "LOCATION_REQUIRED",
//               message: "Your location is required to mark attendance. Please enable location access.",
//             },
//             { status: 400 },
//           )
//         }

//         const settingsDoc = await db.collection("app_settings").findOne({ _id: "global" })
//         const locationRadiusMeters = settingsDoc?.data?.attendance?.locationRadiusMeters ?? 100

//         const withinRadius = isWithinRadius(
//           currentLocation.latitude,
//           currentLocation.longitude,
//           assignedLocation.latitude,
//           assignedLocation.longitude,
//           locationRadiusMeters,
//         )

//         if (!withinRadius) {
//           console.log("[v0] Location verification failed:", {
//             current: currentLocation,
//             assigned: assignedLocation,
//           })
//           return Response.json(
//             {
//               error: "LOCATION_MISMATCH",
//               message: `You must be within ${locationRadiusMeters}m of ${assignedLocation.address || "your assigned location"} to mark attendance.`,
//               details: {
//                 assignedLocation: assignedLocation.address || "Assigned location",
//                 radiusMeters: locationRadiusMeters,
//               },
//             },
//             { status: 403 },
//           )
//         }

//         console.log("[v0] Location verified successfully")
//       }
//     } else {
//       console.log(
//         "[v0] Location verification skipped:",
//         institutionLocationEnabled
//           ? "Person has location verification disabled"
//           : "Institution has location verification disabled",
//       )
//     }

//     const settingsDoc = await db.collection("app_settings").findOne({ _id: "global" })
//     const globalLocationVerificationEnabled = settingsDoc?.data?.attendance?.locationVerificationEnabled ?? true

//     if (globalLocationVerificationEnabled && personLocationVerificationEnabled) {
//       const assignedLocation = (person as any).location as
//         | { latitude: number; longitude: number; address?: string }
//         | undefined

//       if (assignedLocation?.latitude && assignedLocation?.longitude) {
//         if (!currentLocation?.latitude || !currentLocation?.longitude) {
//           console.log("[v0] Location required but not provided")
//           return Response.json(
//             {
//               error: "LOCATION_REQUIRED",
//               message: "Your location is required to mark attendance. Please enable location access.",
//             },
//             { status: 400 },
//           )
//         }

//         const locationRadiusMeters = settingsDoc?.data?.attendance?.locationRadiusMeters ?? 100

//         const withinRadius = isWithinRadius(
//           currentLocation.latitude,
//           currentLocation.longitude,
//           assignedLocation.latitude,
//           assignedLocation.longitude,
//           locationRadiusMeters,
//         )

//         if (!withinRadius) {
//           console.log("[v0] Location verification failed:", {
//             current: currentLocation,
//             assigned: assignedLocation,
//           })
//           return Response.json(
//             {
//               error: "LOCATION_MISMATCH",
//               message: `You must be within ${locationRadiusMeters}m of ${assignedLocation.address || "your assigned location"} to mark attendance.`,
//               details: {
//                 assignedLocation: assignedLocation.address || "Assigned location",
//                 radiusMeters: locationRadiusMeters,
//               },
//             },
//             { status: 403 },
//           )
//         }

//         console.log("[v0] Location verified successfully")
//       }
//     } else {
//       console.log("[v0] Location verification is disabled (global or individual), skipping location check")
//     }

//     let runtimeTimings: RuntimeTimings | null = null
//     if (institutionName) {
//       const doc = await db.collection("shift_settings").findOne({ institutionName })
//       if (doc?.shifts?.length) {
//         runtimeTimings = buildRuntimeTimings(doc.shifts as any)
//       }
//     }

//     const personShift = person.shift as keyof typeof SHIFT_TIMINGS

//     const withinShift = runtimeTimings
//       ? canMarkAttendanceDuringShiftWithTimezoneRuntime(personShift, runtimeTimings, timezone)
//       : canMarkAttendanceDuringShiftWithTimezone(personShift, timezone)
//     if (!withinShift) {
//       const shiftMessage = getTimeUntilShiftStartsWithTimezone(personShift, timezone)
//       console.log("[v0] Outside shift hours:", { shift: personShift, message: shiftMessage, timezone })
//       return Response.json(
//         {
//           id: null,
//           updated: false,
//           alreadyMarked: false,
//           status: null,
//           message: shiftMessage || "Cannot mark attendance outside shift hours",
//           error: "OUTSIDE_SHIFT_HOURS",
//         },
//         { status: 400 },
//       )
//     }

//     const shiftKey = person.shift as keyof typeof SHIFT_TIMINGS
//     const computedStatus = shiftKey
//       ? runtimeTimings
//         ? getAttendanceStatusWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
//         : getAttendanceStatusWithTimezone(shiftKey, timezone)
//       : null

//     if (computedStatus === "window_closed") {
//       const windowClose = runtimeTimings
//         ? runtimeTimings[shiftKey].attendanceWindow
//         : SHIFT_TIMINGS[shiftKey].attendanceWindow
//       return Response.json(
//         {
//           id: null,
//           updated: false,
//           alreadyMarked: false,
//           status: null,
//           message: `Attendance window closed for ${
//             (runtimeTimings ? runtimeTimings[shiftKey].name : SHIFT_TIMINGS[shiftKey].name) || "shift"
//           } at ${windowClose}`,
//           error: "OUTSIDE_SHIFT_HOURS",
//         },
//         { status: 400 },
//       )
//     }

//     if (!body.status && person.shift) {
//       if (computedStatus === "window_closed") {
//         status = "absent"
//       } else {
//         status = (computedStatus as "present" | "late" | "absent") ?? "absent"
//       }
//       console.log("[v0] Auto-determined status (runtime-aware):", status)
//     } else if (body.status && computedStatus) {
//       if (body.status === "present" && computedStatus === "late") {
//         status = "late"
//         console.log("[v0] Normalized requested status from PRESENT to LATE based on shift timing (runtime-aware)")
//       }
//     }

//     if (personType === "student" && operatorRole === "Teacher") {
//       const stBranchClass = ((person as any)?.branchClass || "").toUpperCase().trim()
//       const stBranch = ((person as any)?.branch || "").toUpperCase().trim()

//       if (!operatorBranchRaw) {
//         return Response.json(
//           {
//             error: "UNASSIGNED_TEACHER",
//             message: "Teacher has no assigned branch/class. Cannot mark student attendance.",
//           },
//           { status: 403 },
//         )
//       }

//       const matches = operatorBranchRaw.includes("-")
//         ? stBranchClass === operatorBranchRaw
//         : stBranch === operatorBranchRaw ||
//           stBranchClass === operatorBranchRaw ||
//           stBranchClass.startsWith(operatorBranchRaw + "-")

//       if (!matches) {
//         return Response.json(
//           {
//             error: "FORBIDDEN_BRANCH",
//             message: `Student not in your assigned branch/class (${operatorBranchRaw}).`,
//             details: { studentBranch: stBranch, studentBranchClass: stBranchClass },
//           },
//           { status: 403 },
//         )
//       }
//     }

//     const nowIso = new Date().toISOString()
//     const filter = { personId, date }
//     const update = {
//       $set: {
//         personId,
//         personType,
//         date,
//         status,
//         timestamp: nowIso,
//         department: (person as any).department,
//         role: (person as any).role,
//         shift: (person as any).shift,
//       },
//     }

//     console.log("[v0] Updating attendance record...")
//     const result = await db.collection("attendance").updateOne(filter, update, { upsert: true })
//     const updated = result.matchedCount > 0
//     const id = result.upsertedId
//       ? result.upsertedId.toString()
//       : (await db.collection("attendance").findOne(filter))?._id?.toString()

//     console.log("[v0] Attendance record updated:", { id, updated })

//     const attendanceEvent: AttendanceUpdateEvent = {
//       type: updated ? "attendance_updated" : "attendance_marked",
//       personId,
//       personType,
//       personName: person.name || person.fullName || person.firstName || "Unknown",
//       status,
//       timestamp: nowIso,
//       shift: person.shift,
//       department: person.department,
//       delayInfo: body.delayInfo,
//       message: updated ? "Attendance updated successfully" : "Attendance marked successfully",
//     }

//     await emitAttendanceUpdate(attendanceEvent)

//     console.log("[v0] Calculating stats...")
//     const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
//     const totalStaff = await db.collection("staff").countDocuments({})
//     const totalStudents = await db.collection("students").countDocuments({})

//     const statsEvent: StatsUpdateEvent = {
//       type: "stats_update",
//       totalCounts: {
//         totalPeople: totalStaff + totalStudents,
//         present: allAttendanceForDate.filter((r) => r.status === "present").length,
//         absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
//         late: allAttendanceForDate.filter((r) => r.status === "late").length,
//       },
//       date,
//     }

//     await emitStatsUpdate(statsEvent)

//     console.log("[v0] POST /api/attendance completed successfully")
//     return Response.json({
//       id,
//       updated: !!updated,
//       alreadyMarked: false,
//       status,
//       message: updated ? "Attendance updated successfully" : "Attendance marked successfully",
//     })
//   } catch (error) {
//     console.error("[v0] POST /api/attendance error:", error)
//     return Response.json(
//       {
//         error: "INTERNAL_SERVER_ERROR",
//         message: error instanceof Error ? error.message : "Unknown error",
//         stack: process.env.NODE_ENV === "development" ? (error as Error).stack : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     console.log("[v0] PUT /api/attendance - Starting request")

//     let body
//     try {
//       body = await req.json()
//     } catch (parseError) {
//       console.error("[v0] Failed to parse request body:", parseError)
//       return Response.json(
//         {
//           error: "Invalid JSON in request body",
//           message: "Request body must be valid JSON",
//         },
//         { status: 400 },
//       )
//     }

//     const recordId = body.recordId as string
//     const personId = body.personId as string
//     const personType = body.personType as "staff" | "student"
//     let status = body.status as "present" | "absent" | "late"
//     const date = (body.date as string) || todayStr()
//     const timezone = body.timezone || "Asia/Kolkata"

//     if (!recordId || !personId || !personType || !status) {
//       console.error("[v0] Missing required fields for PUT:", { recordId, personId, personType, status })
//       return Response.json(
//         {
//           error: "Missing required fields",
//           message: "recordId, personId, personType, and status are required",
//         },
//         { status: 400 },
//       )
//     }

//     if (!ObjectId.isValid(recordId) || !ObjectId.isValid(personId)) {
//       console.error("[v0] Invalid ObjectId format:", { recordId, personId })
//       return Response.json(
//         {
//           error: "Invalid ID format",
//           message: "recordId and personId must be valid MongoDB ObjectIds",
//         },
//         { status: 400 },
//       )
//     }

//     const db = await getDb()

//     console.log("[v0] Verifying attendance record exists...")
//     const existingRecord = await db.collection("attendance").findOne({
//       _id: new ObjectId(recordId),
//       personId,
//       date,
//     })

//     if (!existingRecord) {
//       console.log("[v0] Attendance record not found:", { recordId, personId, date })
//       return Response.json({ message: "Attendance record not found" }, { status: 404 })
//     }

//     console.log("[v0] Finding person in database...")
//     const personCol = personType === "staff" ? "staff" : "students"
//     const person = await db.collection(personCol).findOne({ _id: new ObjectId(personId) })

//     if (person?.shift) {
//       const institutionName = (person as any)?.institutionName
//       let runtimeTimings: RuntimeTimings | null = null
//       if (institutionName) {
//         const doc = await db.collection("shift_settings").findOne({ institutionName })
//         if (doc?.shifts?.length) {
//           runtimeTimings = buildRuntimeTimings(doc.shifts as any)
//         }
//       }

//       const shiftKey = person.shift as keyof typeof SHIFT_TIMINGS

//       const withinShift = runtimeTimings
//         ? canMarkAttendanceDuringShiftWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
//         : canMarkAttendanceDuringShiftWithTimezone(shiftKey, timezone)
//       if (!withinShift) {
//         const msg = getTimeUntilShiftStartsWithTimezone(shiftKey, timezone) || "Cannot update outside shift hours"
//         return Response.json({ error: "OUTSIDE_SHIFT_HOURS", message: msg }, { status: 400 })
//       }

//       const computedStatus = runtimeTimings
//         ? getAttendanceStatusWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
//         : getAttendanceStatusWithTimezone(shiftKey, timezone)
//       if (computedStatus === "window_closed") {
//         const windowClose = runtimeTimings
//           ? runtimeTimings[shiftKey].attendanceWindow
//           : SHIFT_TIMINGS[shiftKey].attendanceWindow
//         return Response.json(
//           {
//             error: "OUTSIDE_SHIFT_HOURS",
//             message: `Attendance window closed for ${
//               (runtimeTimings ? runtimeTimings[shiftKey].name : SHIFT_TIMINGS[shiftKey].name) || "shift"
//             } at ${windowClose}`,
//           },
//           { status: 400 },
//         )
//       }

//       if (status === "present" && computedStatus === "late") {
//         status = "late"
//         console.log("[v0] Normalized PUT status from PRESENT to LATE based on shift timing (runtime-aware)")
//       }
//     }

//     console.log("[v0] Updating attendance status...")
//     const nowIso = new Date().toISOString()
//     const result = await db.collection("attendance").updateOne(
//       { _id: new ObjectId(recordId) },
//       {
//         $set: {
//           status,
//           timestamp: nowIso,
//           lastModified: nowIso,
//           modifiedManually: true,
//         },
//       },
//     )

//     if (result.matchedCount === 0) {
//       console.error("[v0] Failed to update attendance status:", { recordId, personId, status })
//       return Response.json({ message: "Failed to update attendance status" }, { status: 400 })
//     }

//     if (person) {
//       const attendanceEvent: AttendanceUpdateEvent = {
//         type: "attendance_updated",
//         personId,
//         personType,
//         personName: person.name || person.fullName || person.firstName || "Unknown",
//         status,
//         timestamp: nowIso,
//         shift: person.shift,
//         department: person.department,
//         message: `Attendance status updated to ${status.toUpperCase()} successfully`,
//       }

//       await emitAttendanceUpdate(attendanceEvent)

//       console.log("[v0] Calculating stats...")
//       const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
//       const totalStaff = await db.collection("staff").countDocuments({})
//       const totalStudents = await db.collection("students").countDocuments({})

//       const statsEvent: StatsUpdateEvent = {
//         type: "stats_update",
//         totalCounts: {
//           totalPeople: totalStaff + totalStudents,
//           present: allAttendanceForDate.filter((r) => r.status === "present").length,
//           absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
//           late: allAttendanceForDate.filter((r) => r.status === "late").length,
//         },
//         date,
//       }

//       await emitStatsUpdate(statsEvent)
//     }

//     console.log("[v0] PUT /api/attendance completed successfully")
//     return Response.json({
//       id: recordId,
//       updated: true,
//       status,
//       message: `Attendance status updated to ${status.toUpperCase()} successfully`,
//     })
//   } catch (error) {
//     console.error("[v0] PUT /api/attendance error:", error)
//     return Response.json(
//       {
//         error: "Internal server error",
//         message: error instanceof Error ? error.message : "Unknown error",
//         details: process.env.NODE_ENV === "development" ? error : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     let body: any
//     try {
//       body = await req.json()
//     } catch (parseError) {
//       console.error("[v0] Failed to parse DELETE body:", parseError)
//       return Response.json({ error: "INVALID_JSON", message: "Request body must be valid JSON" }, { status: 400 })
//     }

//     const recordId = body.recordId as string
//     const personId = body.personId as string
//     const date = (body.date as string) || todayStr()

//     if (!recordId || !personId) {
//       console.error("[v0] Missing required fields for DELETE:", { recordId, personId })
//       return Response.json({ error: "MISSING_FIELDS", message: "recordId and personId are required" }, { status: 400 })
//     }

//     if (!ObjectId.isValid(recordId) || !ObjectId.isValid(personId)) {
//       console.error("[v0] Invalid ObjectId for DELETE:", { recordId, personId })
//       return Response.json(
//         { error: "INVALID_OBJECT_ID", message: "recordId and personId must be valid MongoDB ObjectIds" },
//         { status: 400 },
//       )
//     }

//     const db = await getDb()

//     const existing = await db.collection("attendance").findOne({
//       _id: new ObjectId(recordId),
//       personId,
//       date,
//     })

//     if (!existing) {
//       console.log("[v0] DELETE /api/attendance - record not found", { recordId, personId, date })
//       return Response.json({ message: "Attendance record not found" }, { status: 404 })
//     }

//     const deleteRes = await db.collection("attendance").deleteOne({ _id: new ObjectId(recordId) })
//     if (deleteRes.deletedCount !== 1) {
//       console.error("[v0] DELETE /api/attendance - failed to delete", { recordId })
//       return Response.json({ message: "Failed to delete attendance record" }, { status: 400 })
//     }

//     const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
//     const totalStaff = await db.collection("staff").countDocuments({})
//     const totalStudents = await db.collection("students").countDocuments({})

//     const statsEvent: StatsUpdateEvent = {
//       type: "stats_update",
//       totalCounts: {
//         totalPeople: totalStaff + totalStudents,
//         present: allAttendanceForDate.filter((r) => r.status === "present").length,
//         absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
//         late: allAttendanceForDate.filter((r) => r.status === "late").length,
//       },
//       date,
//     }

//     await (async function emitStatsUpdateLocal(event: StatsUpdateEvent) {
//       try {
//         const baseUrl =
//           process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
//             ? `https://${process.env.VERCEL_URL}`
//             : "http://localhost:3000"

//         await fetch(`${baseUrl}/api/realtime/events`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             type: "stats_update",
//             ...event,
//           }),
//         })
//       } catch (error) {
//         console.error("[v0] Failed to emit stats update (DELETE):", error)
//       }
//     })(statsEvent)

//     return Response.json({ id: recordId, deleted: true, message: "Attendance record deleted" })
//   } catch (error) {
//     console.error("[v0] DELETE /api/attendance error:", error)
//     return Response.json(
//       {
//         error: "INTERNAL_SERVER_ERROR",
//         message: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }





import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongo"
import {
  DEPARTMENTS,
  ROLES,
  SHIFTS,
  todayStr,
  SHIFT_TIMINGS,
  canMarkAttendanceDuringShiftWithTimezone,
  getTimeUntilShiftStartsWithTimezone,
  getAttendanceStatusWithTimezone,
} from "@/lib/constants"
import { ObjectId } from "mongodb"
import type { AttendanceUpdateEvent, StatsUpdateEvent } from "@/lib/socket"
import {
  buildRuntimeTimings,
  canMarkAttendanceDuringShiftWithTimezoneRuntime,
  getAttendanceStatusWithTimezoneRuntime,
  type RuntimeTimings,
} from "@/lib/shift-settings"
import { isWithinRadius } from "@/lib/location-utils"

async function emitAttendanceUpdate(event: AttendanceUpdateEvent) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"

    console.log("[v0] Emitting attendance update to:", `${baseUrl}/api/realtime/events`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const response = await fetch(`${baseUrl}/api/realtime/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "attendance_update",
          ...event,
        }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        console.error("[v0] Real-time event failed:", response.status, response.statusText)
      } else {
        console.log("[v0] Real-time event sent successfully")
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error("[v0] Real-time event timeout after 5s")
      } else {
        throw fetchError
      }
    }
  } catch (error) {
    console.error("[v0] Failed to emit attendance update:", error)
    // Don't fail the main request if real-time update fails
  }
}

async function emitStatsUpdate(event: StatsUpdateEvent) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      await fetch(`${baseUrl}/api/realtime/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "stats_update",
          ...event,
        }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error("[v0] Stats update timeout after 5s")
      }
    }
  } catch (error) {
    console.error("[v0] Failed to emit stats update:", error)
    // Don't fail the main request if real-time update fails
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log("[v0] GET /api/attendance - Starting request")
    const db = await getDb()
    console.log("[v0] Database connection successful")

    const { searchParams } = new URL(req.url)
    const department = searchParams.get("department") || undefined
    const role = searchParams.get("role") || undefined
    const shift = searchParams.get("shift") || undefined
    const status = searchParams.get("status") || undefined
    const date = searchParams.get("date") || todayStr() // Default to today
    const personType = (searchParams.get("personType") as "staff" | "student" | null) || undefined
    const institutionName = searchParams.get("institutionName") || undefined
    const personIdParam = searchParams.get("personId") || undefined

    const query: any = { date }
    if (department && department !== "all") query.department = department
    if (role && role !== "all") query.role = role
    if (shift && shift !== "all") query.shift = shift
    if (status && status !== "all") query.status = status
    if (personType) query.personType = personType

    let personIdFilter: string[] | null = null
    if (personIdParam) {
      query.personId = personIdParam
    } else if (institutionName) {
      const [instStaff, instStudents] = await Promise.all([
        db.collection("staff").find({ institutionName }).project({ _id: 1 }).toArray(),
        db.collection("students").find({ institutionName }).project({ _id: 1 }).toArray(),
      ])
      personIdFilter = [...instStaff, ...instStudents].map((d) => d._id.toString())
      query.personId = { $in: personIdFilter }
    }

    const records = await db.collection("attendance").find(query).toArray()

    const allAttendanceForDateQuery: any = { date }
    if (personIdParam) {
      allAttendanceForDateQuery.personId = personIdParam
    } else if (personIdFilter) {
      allAttendanceForDateQuery.personId = { $in: personIdFilter }
    }
    const allAttendanceForDate = await db.collection("attendance").find(allAttendanceForDateQuery).toArray()

    let totalPeople: number
    if (personIdParam) {
      totalPeople = 1
    } else {
      const staffCountFilter: any = institutionName ? { institutionName } : {}
      const studentCountFilter: any = institutionName ? { institutionName } : {}
      const [totalStaff, totalStudents] = await Promise.all([
        db.collection("staff").countDocuments(staffCountFilter),
        db.collection("students").countDocuments(studentCountFilter),
      ])
      totalPeople = totalStaff + totalStudents
    }

    const enrichedRecords = await Promise.all(
      records.map(async (r: any) => {
        const personCol = r.personType === "staff" ? "staff" : "students"
        const person = await db.collection(personCol).findOne({ _id: new ObjectId(r.personId) })
        return {
          ...r,
          id: r._id?.toString(),
          personName: person?.name || person?.fullName || person?.firstName || "Unknown",
          imageUrl: person?.photoUrl || person?.imageUrl || null,
          employeeCode: r.personType === "staff" ? person?.employeeCode : undefined,
          rollNumber: r.personType === "student" ? person?.rollNumber : undefined,
          classLevel: r.personType === "student" ? person?.classLevel : undefined,
        }
      }),
    )

    const normalized = enrichedRecords.map(({ _id, ...rest }) => rest)

    return Response.json({
      records: normalized,
      departments: DEPARTMENTS,
      roles: ROLES,
      shifts: SHIFTS,
      totalCounts: {
        totalPeople,
        present: allAttendanceForDate.filter((r) => r.status === "present").length,
        absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
        late: allAttendanceForDate.filter((r) => r.status === "late").length,
      },
    })
  } catch (error) {
    console.error("[v0] GET /api/attendance error:", error)
    return Response.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("[v0] POST /api/attendance - Starting request")
    console.log("[v0] Environment check:", {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: !!process.env.MONGODB_URI,
      MONGODB_DB: !!process.env.MONGODB_DB,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      VERCEL_URL: process.env.VERCEL_URL,
    })

    let body
    try {
      body = await req.json()
      console.log("[v0] Request body parsed successfully:", {
        personId: body.personId,
        personType: body.personType,
        status: body.status,
        hasBody: !!body,
        hasLocation: !!body.currentLocation,
      })
    } catch (parseError) {
      console.error("[v0] Failed to parse request body:", parseError)
      return Response.json(
        {
          error: "INVALID_JSON",
          message: "Request body must be valid JSON",
          details: parseError instanceof Error ? parseError.message : "Unknown parse error",
        },
        { status: 400 },
      )
    }

    const personId = body.personId as string
    const personType = body.personType as "staff" | "student"
    let status = body.status as "present" | "absent" | "late"
    const date = (body.date as string) || todayStr()
    const timezone = body.timezone || "Asia/Kolkata"
    const currentLocation = body.currentLocation as { latitude: number; longitude: number } | undefined

    const operatorRole: string | undefined = body.operator?.role
    const operatorBranchRaw: string = (body.operator?.branch || body.operator?.branchClass || "").toUpperCase().trim()

    console.log("[v0] Extracted fields:", {
      personId,
      personType,
      status,
      date,
      timezone,
      hasCurrentLocation: !!currentLocation,
    })

    if (!personId || !personType) {
      console.error("[v0] Missing required fields:", {
        personId: !!personId,
        personType: !!personType,
        bodyKeys: Object.keys(body || {}),
      })
      return Response.json(
        {
          error: "MISSING_FIELDS",
          message: "personId and personType are required",
          received: {
            personId: !!personId,
            personType: !!personType,
            bodyKeys: Object.keys(body || {}),
          },
        },
        { status: 400 },
      )
    }

    if (!ObjectId.isValid(personId)) {
      console.error("[v0] Invalid ObjectId format:", personId)
      return Response.json(
        {
          error: "INVALID_OBJECT_ID",
          message: "personId must be a valid MongoDB ObjectId",
          received: personId,
        },
        { status: 400 },
      )
    }

    console.log("[v0] Connecting to database...")
    let db
    try {
      db = await getDb()
      console.log("[v0] Database connection successful")
    } catch (dbError) {
      console.error("[v0] Database connection failed:", dbError)
      return Response.json(
        {
          error: "DATABASE_CONNECTION_FAILED",
          message: "Failed to connect to database",
          details: dbError instanceof Error ? dbError.message : "Unknown database error",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Checking for existing attendance...")
    const existingAttendance = await db.collection("attendance").findOne({ personId, date })

    if (existingAttendance) {
      console.log("[v0] Attendance already exists:", existingAttendance.status)
      return Response.json(
        {
          id: existingAttendance._id?.toString(),
          updated: false,
          alreadyMarked: true,
          status: existingAttendance.status,
          message: `Attendance already marked as ${existingAttendance.status.toUpperCase()} today. Cannot be changed.`,
          error: "ALREADY_MARKED",
        },
        { status: 409 },
      )
    }

    console.log("[v0] Finding person in database...")
    const personCol = personType === "staff" ? "staff" : "students"
    const person = await db.collection(personCol).findOne({ _id: new ObjectId(personId) })

    if (!person) {
      console.error("[v0] Person not found:", { personId, personType, collection: personCol })
      return Response.json(
        {
          error: "Person not found",
          message: `No ${personType} found with ID ${personId}`,
        },
        { status: 404 },
      )
    }

    console.log("[v0] Person found:", { name: person.name || person.fullName, shift: person.shift })

    const institutionName = (person as any)?.institutionName
    let institutionLocationEnabled = false

    if (institutionName) {
      const institutionDoc = await db.collection("institutions").findOne({ name: institutionName })
      institutionLocationEnabled = institutionDoc?.locationVerificationEnabled ?? false
      console.log("[v0] Institution location verification:", {
        institution: institutionName,
        enabled: institutionLocationEnabled,
      })
    }

    const personLocationVerificationEnabled = (person as any).locationVerificationEnabled ?? false

    console.log("[v0] Location verification settings:", {
      institutionEnabled: institutionLocationEnabled,
      personEnabled: personLocationVerificationEnabled,
      willCheck: institutionLocationEnabled && personLocationVerificationEnabled,
    })

    if (institutionLocationEnabled && personLocationVerificationEnabled) {
      const assignedLocation = (person as any).location as
        | { latitude: number; longitude: number; address?: string }
        | undefined

      if (assignedLocation?.latitude && assignedLocation?.longitude) {
        if (!currentLocation?.latitude || !currentLocation?.longitude) {
          console.log("[v0] Location required but not provided")
          return Response.json(
            {
              error: "LOCATION_REQUIRED",
              message: "Your location is required to mark attendance. Please enable location access.",
            },
            { status: 400 },
          )
        }

        const settingsDoc = await db.collection("app_settings").findOne({ _id: "global" })
        const locationRadiusMeters = settingsDoc?.data?.attendance?.locationRadiusMeters ?? 100

        const withinRadius = isWithinRadius(
          currentLocation.latitude,
          currentLocation.longitude,
          assignedLocation.latitude,
          assignedLocation.longitude,
          locationRadiusMeters,
        )

        if (!withinRadius) {
          console.log("[v0] Location verification failed:", {
            current: currentLocation,
            assigned: assignedLocation,
          })
          return Response.json(
            {
              error: "LOCATION_MISMATCH",
              message: `You must be within ${locationRadiusMeters}m of ${assignedLocation.address || "your assigned location"} to mark attendance.`,
              details: {
                assignedLocation: assignedLocation.address || "Assigned location",
                radiusMeters: locationRadiusMeters,
              },
            },
            { status: 403 },
          )
        }

        console.log("[v0] Location verified successfully")
      }
    } else {
      console.log(
        "[v0] Location verification skipped:",
        institutionLocationEnabled
          ? "Person has location verification disabled"
          : "Institution has location verification disabled",
      )
    }

    const settingsDoc = await db.collection("app_settings").findOne({ _id: "global" })
    const globalLocationVerificationEnabled = settingsDoc?.data?.attendance?.locationVerificationEnabled ?? true

    if (globalLocationVerificationEnabled && personLocationVerificationEnabled) {
      const assignedLocation = (person as any).location as
        | { latitude: number; longitude: number; address?: string }
        | undefined

      if (assignedLocation?.latitude && assignedLocation?.longitude) {
        if (!currentLocation?.latitude || !currentLocation?.longitude) {
          console.log("[v0] Location required but not provided")
          return Response.json(
            {
              error: "LOCATION_REQUIRED",
              message: "Your location is required to mark attendance. Please enable location access.",
            },
            { status: 400 },
          )
        }

        const locationRadiusMeters = settingsDoc?.data?.attendance?.locationRadiusMeters ?? 100

        const withinRadius = isWithinRadius(
          currentLocation.latitude,
          currentLocation.longitude,
          assignedLocation.latitude,
          assignedLocation.longitude,
          locationRadiusMeters,
        )

        if (!withinRadius) {
          console.log("[v0] Location verification failed:", {
            current: currentLocation,
            assigned: assignedLocation,
          })
          return Response.json(
            {
              error: "LOCATION_MISMATCH",
              message: `You must be within ${locationRadiusMeters}m of ${assignedLocation.address || "your assigned location"} to mark attendance.`,
              details: {
                assignedLocation: assignedLocation.address || "Assigned location",
                radiusMeters: locationRadiusMeters,
              },
            },
            { status: 403 },
          )
        }

        console.log("[v0] Location verified successfully")
      }
    } else {
      console.log("[v0] Location verification is disabled (global or individual), skipping location check")
    }

    let runtimeTimings: RuntimeTimings | null = null
    if (institutionName) {
      const doc = await db.collection("shift_settings").findOne({ institutionName })
      if (doc?.shifts?.length) {
        runtimeTimings = buildRuntimeTimings(doc.shifts as any)
      }
    }

    const personShift = person.shift as keyof typeof SHIFT_TIMINGS

    const withinShift = runtimeTimings
      ? canMarkAttendanceDuringShiftWithTimezoneRuntime(personShift, runtimeTimings, timezone)
      : canMarkAttendanceDuringShiftWithTimezone(personShift, timezone)
    if (!withinShift) {
      const shiftMessage = getTimeUntilShiftStartsWithTimezone(personShift, timezone)
      console.log("[v0] Outside shift hours:", { shift: personShift, message: shiftMessage, timezone })
      return Response.json(
        {
          id: null,
          updated: false,
          alreadyMarked: false,
          status: null,
          message: shiftMessage || "Cannot mark attendance outside shift hours",
          error: "OUTSIDE_SHIFT_HOURS",
        },
        { status: 400 },
      )
    }

    const shiftKey = person.shift as keyof typeof SHIFT_TIMINGS
    const computedStatus = shiftKey
      ? runtimeTimings
        ? getAttendanceStatusWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
        : getAttendanceStatusWithTimezone(shiftKey, timezone)
      : null

    if (computedStatus === "window_closed") {
      const windowClose = runtimeTimings
        ? runtimeTimings[shiftKey].attendanceWindow
        : SHIFT_TIMINGS[shiftKey].attendanceWindow
      return Response.json(
        {
          id: null,
          updated: false,
          alreadyMarked: false,
          status: null,
          message: `Attendance window closed for ${
            (runtimeTimings ? runtimeTimings[shiftKey].name : SHIFT_TIMINGS[shiftKey].name) || "shift"
          } at ${windowClose}`,
          error: "OUTSIDE_SHIFT_HOURS",
        },
        { status: 400 },
      )
    }

    if (!body.status && person.shift) {
      if (computedStatus === "window_closed") {
        status = "absent"
      } else {
        status = (computedStatus as "present" | "late" | "absent") ?? "absent"
      }
      console.log("[v0] Auto-determined status (runtime-aware):", status)
    } else if (body.status && computedStatus) {
      if (body.status === "present" && computedStatus === "late") {
        status = "late"
        console.log("[v0] Normalized requested status from PRESENT to LATE based on shift timing (runtime-aware)")
      }
    }

    if (personType === "student" && operatorRole === "Teacher") {
      const stBranchClass = ((person as any)?.branchClass || "").toUpperCase().trim()
      const stBranch = ((person as any)?.branch || "").toUpperCase().trim()

      if (!operatorBranchRaw) {
        return Response.json(
          {
            error: "UNASSIGNED_TEACHER",
            message: "Teacher has no assigned branch/class. Cannot mark student attendance.",
          },
          { status: 403 },
        )
      }

      const matches = operatorBranchRaw.includes("-")
        ? stBranchClass === operatorBranchRaw
        : stBranch === operatorBranchRaw ||
          stBranchClass === operatorBranchRaw ||
          stBranchClass.startsWith(operatorBranchRaw + "-")

      if (!matches) {
        return Response.json(
          {
            error: "FORBIDDEN_BRANCH",
            message: `Student not in your assigned branch/class (${operatorBranchRaw}).`,
            details: { studentBranch: stBranch, studentBranchClass: stBranchClass },
          },
          { status: 403 },
        )
      }
    }

    const nowIso = new Date().toISOString()
    const filter = { personId, date }
    const update = {
      $set: {
        personId,
        personType,
        date,
        status,
        timestamp: nowIso,
        department: (person as any).department,
        role: (person as any).role,
        shift: (person as any).shift,
      },
    }

    console.log("[v0] Updating attendance record...")
    const result = await db.collection("attendance").updateOne(filter, update, { upsert: true })
    const updated = result.matchedCount > 0
    const id = result.upsertedId
      ? result.upsertedId.toString()
      : (await db.collection("attendance").findOne(filter))?._id?.toString()

    console.log("[v0] Attendance record updated:", { id, updated })

    const attendanceEvent: AttendanceUpdateEvent = {
      type: updated ? "attendance_updated" : "attendance_marked",
      personId,
      personType,
      personName: person.name || person.fullName || person.firstName || "Unknown",
      status,
      timestamp: nowIso,
      shift: person.shift,
      department: person.department,
      delayInfo: body.delayInfo,
      message: updated ? "Attendance updated successfully" : "Attendance marked successfully",
    }

    await emitAttendanceUpdate(attendanceEvent)

    console.log("[v0] Calculating stats...")
    const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
    const totalStaff = await db.collection("staff").countDocuments({})
    const totalStudents = await db.collection("students").countDocuments({})

    const statsEvent: StatsUpdateEvent = {
      type: "stats_update",
      totalCounts: {
        totalPeople: totalStaff + totalStudents,
        present: allAttendanceForDate.filter((r) => r.status === "present").length,
        absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
        late: allAttendanceForDate.filter((r) => r.status === "late").length,
      },
      date,
    }

    await emitStatsUpdate(statsEvent)

    console.log("[v0] POST /api/attendance completed successfully")
    return Response.json({
      id,
      updated: !!updated,
      alreadyMarked: false,
      status,
      message: updated ? "Attendance updated successfully" : "Attendance marked successfully",
    })
  } catch (error) {
    console.error("[v0] POST /api/attendance error:", error)
    return Response.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === "development" ? (error as Error).stack : undefined,
      },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    console.log("[v0] PUT /api/attendance - Starting request")

    let body
    try {
      body = await req.json()
    } catch (parseError) {
      console.error("[v0] Failed to parse request body:", parseError)
      return Response.json(
        {
          error: "Invalid JSON in request body",
          message: "Request body must be valid JSON",
        },
        { status: 400 },
      )
    }

    const recordId = body.recordId as string
    const personId = body.personId as string
    const personType = body.personType as "staff" | "student"
    let status = body.status as "present" | "absent" | "late"
    const date = (body.date as string) || todayStr()
    const timezone = body.timezone || "Asia/Kolkata"

    if (!recordId || !personId || !personType || !status) {
      console.error("[v0] Missing required fields for PUT:", { recordId, personId, personType, status })
      return Response.json(
        {
          error: "Missing required fields",
          message: "recordId, personId, personType, and status are required",
        },
        { status: 400 },
      )
    }

    if (!ObjectId.isValid(recordId) || !ObjectId.isValid(personId)) {
      console.error("[v0] Invalid ObjectId format:", { recordId, personId })
      return Response.json(
        {
          error: "Invalid ID format",
          message: "recordId and personId must be valid MongoDB ObjectIds",
        },
        { status: 400 },
      )
    }

    const db = await getDb()

    console.log("[v0] Verifying attendance record exists...")
    const existingRecord = await db.collection("attendance").findOne({
      _id: new ObjectId(recordId),
      personId,
      date,
    })

    if (!existingRecord) {
      console.log("[v0] Attendance record not found:", { recordId, personId, date })
      return Response.json({ message: "Attendance record not found" }, { status: 404 })
    }

    console.log("[v0] Finding person in database...")
    const personCol = personType === "staff" ? "staff" : "students"
    const person = await db.collection(personCol).findOne({ _id: new ObjectId(personId) })

    if (person?.shift) {
      const institutionName = (person as any)?.institutionName
      let runtimeTimings: RuntimeTimings | null = null
      if (institutionName) {
        const doc = await db.collection("shift_settings").findOne({ institutionName })
        if (doc?.shifts?.length) {
          runtimeTimings = buildRuntimeTimings(doc.shifts as any)
        }
      }

      const shiftKey = person.shift as keyof typeof SHIFT_TIMINGS

      const withinShift = runtimeTimings
        ? canMarkAttendanceDuringShiftWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
        : canMarkAttendanceDuringShiftWithTimezone(shiftKey, timezone)
      if (!withinShift) {
        const msg = getTimeUntilShiftStartsWithTimezone(shiftKey, timezone) || "Cannot update outside shift hours"
        return Response.json({ error: "OUTSIDE_SHIFT_HOURS", message: msg }, { status: 400 })
      }

      const computedStatus = runtimeTimings
        ? getAttendanceStatusWithTimezoneRuntime(shiftKey, runtimeTimings, timezone)
        : getAttendanceStatusWithTimezone(shiftKey, timezone)
      if (computedStatus === "window_closed") {
        const windowClose = runtimeTimings
          ? runtimeTimings[shiftKey].attendanceWindow
          : SHIFT_TIMINGS[shiftKey].attendanceWindow
        return Response.json(
          {
            error: "OUTSIDE_SHIFT_HOURS",
            message: `Attendance window closed for ${
              (runtimeTimings ? runtimeTimings[shiftKey].name : SHIFT_TIMINGS[shiftKey].name) || "shift"
            } at ${windowClose}`,
          },
          { status: 400 },
        )
      }

      if (status === "present" && computedStatus === "late") {
        status = "late"
        console.log("[v0] Normalized PUT status from PRESENT to LATE based on shift timing (runtime-aware)")
      }
    }

    console.log("[v0] Updating attendance status...")
    const nowIso = new Date().toISOString()
    const result = await db.collection("attendance").updateOne(
      { _id: new ObjectId(recordId) },
      {
        $set: {
          status,
          timestamp: nowIso,
          lastModified: nowIso,
          modifiedManually: true,
        },
      },
    )

    if (result.matchedCount === 0) {
      console.error("[v0] Failed to update attendance status:", { recordId, personId, status })
      return Response.json({ message: "Failed to update attendance status" }, { status: 400 })
    }

    if (person) {
      const attendanceEvent: AttendanceUpdateEvent = {
        type: "attendance_updated",
        personId,
        personType,
        personName: person.name || person.fullName || person.firstName || "Unknown",
        status,
        timestamp: nowIso,
        shift: person.shift,
        department: person.department,
        message: `Attendance status updated to ${status.toUpperCase()} successfully`,
      }

      await emitAttendanceUpdate(attendanceEvent)

      console.log("[v0] Calculating stats...")
      const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
      const totalStaff = await db.collection("staff").countDocuments({})
      const totalStudents = await db.collection("students").countDocuments({})

      const statsEvent: StatsUpdateEvent = {
        type: "stats_update",
        totalCounts: {
          totalPeople: totalStaff + totalStudents,
          present: allAttendanceForDate.filter((r) => r.status === "present").length,
          absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
          late: allAttendanceForDate.filter((r) => r.status === "late").length,
        },
        date,
      }

      await emitStatsUpdate(statsEvent)
    }

    console.log("[v0] PUT /api/attendance completed successfully")
    return Response.json({
      id: recordId,
      updated: true,
      status,
      message: `Attendance status updated to ${status.toUpperCase()} successfully`,
    })
  } catch (error) {
    console.error("[v0] PUT /api/attendance error:", error)
    return Response.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    let body: any
    try {
      body = await req.json()
    } catch (parseError) {
      console.error("[v0] Failed to parse DELETE body:", parseError)
      return Response.json({ error: "INVALID_JSON", message: "Request body must be valid JSON" }, { status: 400 })
    }

    const recordId = body.recordId as string
    const personId = body.personId as string
    const date = (body.date as string) || todayStr()

    if (!recordId || !personId) {
      console.error("[v0] Missing required fields for DELETE:", { recordId, personId })
      return Response.json({ error: "MISSING_FIELDS", message: "recordId and personId are required" }, { status: 400 })
    }

    if (!ObjectId.isValid(recordId) || !ObjectId.isValid(personId)) {
      console.error("[v0] Invalid ObjectId for DELETE:", { recordId, personId })
      return Response.json(
        { error: "INVALID_OBJECT_ID", message: "recordId and personId must be valid MongoDB ObjectIds" },
        { status: 400 },
      )
    }

    const db = await getDb()

    const existing = await db.collection("attendance").findOne({
      _id: new ObjectId(recordId),
      personId,
      date,
    })

    if (!existing) {
      console.log("[v0] DELETE /api/attendance - record not found", { recordId, personId, date })
      return Response.json({ message: "Attendance record not found" }, { status: 404 })
    }

    const deleteRes = await db.collection("attendance").deleteOne({ _id: new ObjectId(recordId) })
    if (deleteRes.deletedCount !== 1) {
      console.error("[v0] DELETE /api/attendance - failed to delete", { recordId })
      return Response.json({ message: "Failed to delete attendance record" }, { status: 400 })
    }

    const allAttendanceForDate = await db.collection("attendance").find({ date }).toArray()
    const totalStaff = await db.collection("staff").countDocuments({})
    const totalStudents = await db.collection("students").countDocuments({})

    const statsEvent: StatsUpdateEvent = {
      type: "stats_update",
      totalCounts: {
        totalPeople: totalStaff + totalStudents,
        present: allAttendanceForDate.filter((r) => r.status === "present").length,
        absent: allAttendanceForDate.filter((r) => r.status === "absent").length,
        late: allAttendanceForDate.filter((r) => r.status === "late").length,
      },
      date,
    }

    await emitStatsUpdate(statsEvent)

    return Response.json({ id: recordId, deleted: true, message: "Attendance record deleted" })
  } catch (error) {
    console.error("[v0] DELETE /api/attendance error:", error)
    return Response.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

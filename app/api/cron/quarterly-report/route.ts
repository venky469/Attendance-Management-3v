// // // // import { type NextRequest, NextResponse } from "next/server"
// // // // import { getDb } from "@/lib/mongo"
// // // // import { generateQuarterlyPDF, generateQuarterlyExcel } from "@/lib/report-generator"
// // // // import { sendQuarterlyReportEmail } from "@/lib/email"

// // // // export async function POST(req: NextRequest) {
// // // //   try {
// // // //     // Verify cron secret for security
// // // //     const authHeader = req.headers.get("authorization")
// // // //     const cronSecret = process.env.CRON_SECRET || "your-secret-key-here"

// // // //     if (authHeader !== `Bearer ${cronSecret}`) {
// // // //       return NextResponse.json(
// // // //         { error: "Unauthorized", message: "Invalid or missing authorization token" },
// // // //         { status: 401 },
// // // //       )
// // // //     }

// // // //     console.log("[v0] Starting quarterly report generation...")
// // // //     const db = await getDb()

// // // //     // Calculate date range (last 3 months)
// // // //     const endDate = new Date()
// // // //     const startDate = new Date()
// // // //     startDate.setMonth(startDate.getMonth() - 3)

// // // //     const startDateStr = startDate.toISOString().split("T")[0]
// // // //     const endDateStr = endDate.toISOString().split("T")[0]

// // // //     console.log("[v0] Fetching attendance data from", startDateStr, "to", endDateStr)

// // // //     // Fetch attendance data for the last 3 months
// // // //     const attendanceRecords = await db
// // // //       .collection("attendance")
// // // //       .find({
// // // //         date: {
// // // //           $gte: startDateStr,
// // // //           $lte: endDateStr,
// // // //         },
// // // //       })
// // // //       .toArray()

// // // //     console.log("[v0] Found", attendanceRecords.length, "attendance records")

// // // //     // Enrich records with person details
// // // //     const enrichedRecords = await Promise.all(
// // // //       attendanceRecords.map(async (record: any) => {
// // // //         const personCol = record.personType === "staff" ? "staff" : "students"
// // // //         const person = await db.collection(personCol).findOne({ _id: record.personId })

// // // //         return {
// // // //           ...record,
// // // //           personName: person?.name || person?.fullName || "Unknown",
// // // //           employeeCode: record.personType === "staff" ? person?.employeeCode : undefined,
// // // //           rollNumber: record.personType === "student" ? person?.rollNumber : undefined,
// // // //           department: person?.department,
// // // //           role: person?.role,
// // // //           classLevel: record.personType === "student" ? person?.classLevel : undefined,
// // // //         }
// // // //       }),
// // // //     )

// // // //     // Generate statistics
// // // //     const stats = {
// // // //       totalRecords: enrichedRecords.length,
// // // //       present: enrichedRecords.filter((r) => r.status === "present").length,
// // // //       absent: enrichedRecords.filter((r) => r.status === "absent").length,
// // // //       late: enrichedRecords.filter((r) => r.status === "late").length,
// // // //       totalStaff: await db.collection("staff").countDocuments({}),
// // // //       totalStudents: await db.collection("students").countDocuments({}),
// // // //       dateRange: { start: startDateStr, end: endDateStr },
// // // //     }

// // // //     console.log("[v0] Generating PDF report...")
// // // //     const pdfBuffer = await generateQuarterlyPDF(enrichedRecords, stats)

// // // //     console.log("[v0] Generating Excel report...")
// // // //     const excelBuffer = await generateQuarterlyExcel(enrichedRecords, stats)

// // // //     // Get all admins and managers to send reports
// // // //     const admins = await db
// // // //       .collection("staff")
// // // //       .find({
// // // //         role: { $in: ["SuperAdmin", "Admin", "Manager"] },
// // // //         email: { $exists: true, $ne: "" },
// // // //       })
// // // //       .toArray()

// // // //     console.log("[v0] Sending reports to", admins.length, "admins/managers")

// // // //     // Send emails to all admins/managers
// // // //     const emailPromises = admins.map((admin) =>
// // // //       sendQuarterlyReportEmail({
// // // //         to: admin.email,
// // // //         name: admin.name,
// // // //         pdfBuffer,
// // // //         excelBuffer,
// // // //         stats,
// // // //         startDate: startDateStr,
// // // //         endDate: endDateStr,
// // // //       }),
// // // //     )

// // // //     await Promise.all(emailPromises)

// // // //     console.log("[v0] Deleting attendance records older than 3 months...")

// // // //     // Delete attendance records older than 3 months
// // // //     const deleteResult = await db.collection("attendance").deleteMany({
// // // //       date: { $lt: startDateStr },
// // // //     })

// // // //     console.log("[v0] Deleted", deleteResult.deletedCount, "old attendance records")

// // // //     return NextResponse.json({
// // // //       success: true,
// // // //       message: "Quarterly report generated and sent successfully",
// // // //       stats: {
// // // //         recordsProcessed: enrichedRecords.length,
// // // //         emailsSent: admins.length,
// // // //         recordsDeleted: deleteResult.deletedCount,
// // // //         dateRange: { start: startDateStr, end: endDateStr },
// // // //       },
// // // //     })
// // // //   } catch (error) {
// // // //     console.error("[v0] Quarterly report generation failed:", error)
// // // //     return NextResponse.json(
// // // //       {
// // // //         error: "Internal server error",
// // // //         message: error instanceof Error ? error.message : "Unknown error",
// // // //       },
// // // //       { status: 500 },
// // // //     )
// // // //   }
// // // // }

// // // // // GET endpoint to test the cron job manually (only for super admin)
// // // // export async function GET(req: NextRequest) {
// // // //   try {
// // // //     const { searchParams } = new URL(req.url)
// // // //     const testMode = searchParams.get("test") === "true"

// // // //     if (!testMode) {
// // // //       return NextResponse.json({
// // // //         message: "Quarterly Report Cron Job",
// // // //         endpoint: "/api/cron/quarterly-report",
// // // //         method: "POST",
// // // //         authentication: "Bearer token required",
// // // //         schedule: "Every 3 months",
// // // //         description: "Generates quarterly attendance reports, emails to admins, and deletes old data",
// // // //       })
// // // //     }

// // // //     // Test mode - just return stats without sending emails or deleting data
// // // //     const db = await getDb()
// // // //     const endDate = new Date()
// // // //     const startDate = new Date()
// // // //     startDate.setMonth(startDate.getMonth() - 3)

// // // //     const startDateStr = startDate.toISOString().split("T")[0]
// // // //     const endDateStr = endDate.toISOString().split("T")[0]

// // // //     const recordCount = await db.collection("attendance").countDocuments({
// // // //       date: { $gte: startDateStr, $lte: endDateStr },
// // // //     })

// // // //     const oldRecordCount = await db.collection("attendance").countDocuments({
// // // //       date: { $lt: startDateStr },
// // // //     })

// // // //     const adminCount = await db.collection("staff").countDocuments({
// // // //       role: { $in: ["SuperAdmin", "Admin", "Manager"] },
// // // //       email: { $exists: true, $ne: "" },
// // // //     })

// // // //     return NextResponse.json({
// // // //       testMode: true,
// // // //       stats: {
// // // //         recordsToProcess: recordCount,
// // // //         recordsToDelete: oldRecordCount,
// // // //         emailsToSend: adminCount,
// // // //         dateRange: { start: startDateStr, end: endDateStr },
// // // //       },
// // // //       note: "This is test mode. No emails sent or data deleted.",
// // // //     })
// // // //   } catch (error) {
// // // //     console.error("[v0] Test mode failed:", error)
// // // //     return NextResponse.json(
// // // //       {
// // // //         error: "Internal server error",
// // // //         message: error instanceof Error ? error.message : "Unknown error",
// // // //       },
// // // //       { status: 500 },
// // // //     )
// // // //   }
// // // // }



// // // import { type NextRequest, NextResponse } from "next/server"
// // // import { getDb } from "@/lib/mongo"
// // // import { generateQuarterlyPDF, generateQuarterlyExcel } from "@/lib/report-generator"
// // // import { sendQuarterlyReportEmail } from "@/lib/email"

// // // export async function POST(req: NextRequest) {
// // //   try {
// // //     // Verify cron secret for security
// // //     const authHeader = req.headers.get("authorization")
// // //     const cronSecret = process.env.CRON_SECRET || "your-secret-key-here"

// // //     if (authHeader !== `Bearer ${cronSecret}`) {
// // //       return NextResponse.json(
// // //         { error: "Unauthorized", message: "Invalid or missing authorization token" },
// // //         { status: 401 },
// // //       )
// // //     }

// // //     console.log("[v0] Starting quarterly report generation...")
// // //     const db = await getDb()

// // //     const enabledInstitutions = await db.collection("institutions").find({ quarterlyReportsEnabled: true }).toArray()

// // //     console.log("[v0] Found", enabledInstitutions.length, "institutions with quarterly reports enabled")

// // //     if (enabledInstitutions.length === 0) {
// // //       return NextResponse.json({
// // //         success: true,
// // //         message: "No institutions have quarterly reports enabled",
// // //         stats: { institutionsProcessed: 0 },
// // //       })
// // //     }

// // //     const institutionNames = enabledInstitutions.map((inst) => inst.name)

// // //     // Calculate date range (last 3 months)
// // //     const endDate = new Date()
// // //     const startDate = new Date()
// // //     startDate.setMonth(startDate.getMonth() - 3)

// // //     const startDateStr = startDate.toISOString().split("T")[0]
// // //     const endDateStr = endDate.toISOString().split("T")[0]

// // //     console.log("[v0] Fetching attendance data from", startDateStr, "to", endDateStr)

// // //     const attendanceRecords = await db
// // //       .collection("attendance")
// // //       .find({
// // //         date: {
// // //           $gte: startDateStr,
// // //           $lte: endDateStr,
// // //         },
// // //       })
// // //       .toArray()

// // //     console.log("[v0] Found", attendanceRecords.length, "attendance records")

// // //     // Enrich records with person details and filter by institution
// // //     const enrichedRecords = await Promise.all(
// // //       attendanceRecords.map(async (record: any) => {
// // //         const personCol = record.personType === "staff" ? "staff" : "students"
// // //         const person = await db.collection(personCol).findOne({ _id: record.personId })

// // //         return {
// // //           ...record,
// // //           personName: person?.name || person?.fullName || "Unknown",
// // //           employeeCode: record.personType === "staff" ? person?.employeeCode : undefined,
// // //           rollNumber: record.personType === "student" ? person?.rollNumber : undefined,
// // //           department: person?.department,
// // //           role: person?.role,
// // //           classLevel: record.personType === "student" ? person?.classLevel : undefined,
// // //           institutionName: person?.institutionName,
// // //         }
// // //       }),
// // //     )

// // //     const filteredRecords = enrichedRecords.filter(
// // //       (record) => !record.institutionName || institutionNames.includes(record.institutionName),
// // //     )

// // //     console.log("[v0] Processing", filteredRecords.length, "records for enabled institutions")

// // //     // Generate statistics
// // //     const stats = {
// // //       totalRecords: filteredRecords.length,
// // //       present: filteredRecords.filter((r) => r.status === "present").length,
// // //       absent: filteredRecords.filter((r) => r.status === "absent").length,
// // //       late: filteredRecords.filter((r) => r.status === "late").length,
// // //       totalStaff: await db.collection("staff").countDocuments({ institutionName: { $in: institutionNames } }),
// // //       totalStudents: await db.collection("students").countDocuments({ institutionName: { $in: institutionNames } }),
// // //       dateRange: { start: startDateStr, end: endDateStr },
// // //       institutionsProcessed: institutionNames.length,
// // //     }

// // //     console.log("[v0] Generating PDF report...")
// // //     const pdfBuffer = await generateQuarterlyPDF(filteredRecords, stats)

// // //     console.log("[v0] Generating Excel report...")
// // //     const excelBuffer = await generateQuarterlyExcel(filteredRecords, stats)

// // //     const admins = await db
// // //       .collection("staff")
// // //       .find({
// // //         role: { $in: ["SuperAdmin", "Admin", "Manager"] },
// // //         email: { $exists: true, $ne: "" },
// // //         $or: [{ institutionName: { $in: institutionNames } }, { role: "SuperAdmin" }],
// // //       })
// // //       .toArray()

// // //     console.log("[v0] Sending reports to", admins.length, "admins/managers")

// // //     // Send emails to all admins/managers
// // //     const emailPromises = admins.map((admin) =>
// // //       sendQuarterlyReportEmail({
// // //         to: admin.email,
// // //         name: admin.name,
// // //         pdfBuffer,
// // //         excelBuffer,
// // //         stats,
// // //         startDate: startDateStr,
// // //         endDate: endDateStr,
// // //       }),
// // //     )

// // //     await Promise.all(emailPromises)

// // //     console.log("[v0] Deleting attendance records older than 3 months for enabled institutions...")

// // //     const recordIdsToDelete = filteredRecords.filter((r) => new Date(r.date) < startDate).map((r) => r._id)

// // //     const deleteResult = await db.collection("attendance").deleteMany({
// // //       _id: { $in: recordIdsToDelete },
// // //     })

// // //     console.log("[v0] Deleted", deleteResult.deletedCount, "old attendance records")

// // //     return NextResponse.json({
// // //       success: true,
// // //       message: "Quarterly report generated and sent successfully",
// // //       stats: {
// // //         institutionsProcessed: institutionNames.length,
// // //         recordsProcessed: filteredRecords.length,
// // //         emailsSent: admins.length,
// // //         recordsDeleted: deleteResult.deletedCount,
// // //         dateRange: { start: startDateStr, end: endDateStr },
// // //       },
// // //     })
// // //   } catch (error) {
// // //     console.error("[v0] Quarterly report generation failed:", error)
// // //     return NextResponse.json(
// // //       {
// // //         error: "Internal server error",
// // //         message: error instanceof Error ? error.message : "Unknown error",
// // //       },
// // //       { status: 500 },
// // //     )
// // //   }
// // // }

// // // // GET endpoint to test the cron job manually (only for super admin)
// // // export async function GET(req: NextRequest) {
// // //   try {
// // //     const { searchParams } = new URL(req.url)
// // //     const testMode = searchParams.get("test") === "true"

// // //     if (!testMode) {
// // //       return NextResponse.json({
// // //         message: "Quarterly Report Cron Job",
// // //         endpoint: "/api/cron/quarterly-report",
// // //         method: "POST",
// // //         authentication: "Bearer token required",
// // //         schedule: "Every 3 months",
// // //         description:
// // //           "Generates quarterly attendance reports for enabled institutions, emails to admins, and deletes old data",
// // //       })
// // //     }

// // //     // Test mode - just return stats without sending emails or deleting data
// // //     const db = await getDb()

// // //     const enabledInstitutions = await db.collection("institutions").find({ quarterlyReportsEnabled: true }).toArray()

// // //     const institutionNames = enabledInstitutions.map((inst) => inst.name)

// // //     const endDate = new Date()
// // //     const startDate = new Date()
// // //     startDate.setMonth(startDate.getMonth() - 3)

// // //     const startDateStr = startDate.toISOString().split("T")[0]
// // //     const endDateStr = endDate.toISOString().split("T")[0]

// // //     const recordCount = await db.collection("attendance").countDocuments({
// // //       date: { $gte: startDateStr, $lte: endDateStr },
// // //     })

// // //     const oldRecordCount = await db.collection("attendance").countDocuments({
// // //       date: { $lt: startDateStr },
// // //     })

// // //     const adminCount = await db.collection("staff").countDocuments({
// // //       role: { $in: ["SuperAdmin", "Admin", "Manager"] },
// // //       email: { $exists: true, $ne: "" },
// // //       $or: [{ institutionName: { $in: institutionNames } }, { role: "SuperAdmin" }],
// // //     })

// // //     return NextResponse.json({
// // //       testMode: true,
// // //       stats: {
// // //         institutionsEnabled: enabledInstitutions.length,
// // //         institutionNames,
// // //         recordsToProcess: recordCount,
// // //         recordsToDelete: oldRecordCount,
// // //         emailsToSend: adminCount,
// // //         dateRange: { start: startDateStr, end: endDateStr },
// // //       },
// // //       note: "This is test mode. No emails sent or data deleted.",
// // //     })
// // //   } catch (error) {
// // //     console.error("[v0] Test mode failed:", error)
// // //     return NextResponse.json(
// // //       {
// // //         error: "Internal server error",
// // //         message: error instanceof Error ? error.message : "Unknown error",
// // //       },
// // //       { status: 500 },
// // //     )
// // //   }
// // // }


// // import { type NextRequest, NextResponse } from "next/server"
// // import { getDb } from "@/lib/mongo"
// // import { generateQuarterlyPDF, generateQuarterlyExcel } from "@/lib/report-generator"
// // import { sendQuarterlyReportEmail } from "@/lib/email"

// // export async function POST(req: NextRequest) {
// //   try {
// //     // Verify cron secret for security
// //     const authHeader = req.headers.get("authorization")
// //     const cronSecret = process.env.CRON_SECRET || "your-secret-key-here"

// //     if (authHeader !== `Bearer ${cronSecret}`) {
// //       return NextResponse.json(
// //         { error: "Unauthorized", message: "Invalid or missing authorization token" },
// //         { status: 401 },
// //       )
// //     }

// //     console.log("[v0] Starting quarterly report generation...")
// //     const db = await getDb()

// //     const enabledInstitutions = await db.collection("institutions").find({ quarterlyReportsEnabled: true }).toArray()

// //     console.log("[v0] Found", enabledInstitutions.length, "institutions with quarterly reports enabled")

// //     if (enabledInstitutions.length === 0) {
// //       return NextResponse.json({
// //         success: true,
// //         message: "No institutions have quarterly reports enabled",
// //         stats: { institutionsProcessed: 0 },
// //       })
// //     }

// //     const institutionNames = enabledInstitutions.map((inst) => inst.name)

// //     // Calculate date range (last 3 months)
// //     const endDate = new Date()
// //     const startDate = new Date()
// //     startDate.setMonth(startDate.getMonth() - 3)

// //     const startDateStr = startDate.toISOString().split("T")[0]
// //     const endDateStr = endDate.toISOString().split("T")[0]

// //     console.log("[v0] Fetching attendance data from", startDateStr, "to", endDateStr)

// //     const attendanceRecords = await db
// //       .collection("attendance")
// //       .find({
// //         date: {
// //           $gte: startDateStr,
// //           $lte: endDateStr,
// //         },
// //       })
// //       .toArray()

// //     console.log("[v0] Found", attendanceRecords.length, "attendance records")

// //     // Enrich records with person details and filter by institution
// //     const enrichedRecords = await Promise.all(
// //       attendanceRecords.map(async (record: any) => {
// //         const personCol = record.personType === "staff" ? "staff" : "students"
// //         const person = await db.collection(personCol).findOne({ _id: record.personId })

// //         return {
// //           ...record,
// //           personName: person?.name || person?.fullName || "Unknown",
// //           employeeCode: record.personType === "staff" ? person?.employeeCode : undefined,
// //           rollNumber: record.personType === "student" ? person?.rollNumber : undefined,
// //           department: person?.department,
// //           role: person?.role,
// //           classLevel: record.personType === "student" ? person?.classLevel : undefined,
// //           institutionName: person?.institutionName,
// //         }
// //       }),
// //     )

// //     const filteredRecords = enrichedRecords.filter(
// //       (record) => !record.institutionName || institutionNames.includes(record.institutionName),
// //     )

// //     console.log("[v0] Processing", filteredRecords.length, "records for enabled institutions")

// //     // Generate statistics
// //     const stats = {
// //       totalRecords: filteredRecords.length,
// //       present: filteredRecords.filter((r) => r.status === "present").length,
// //       absent: filteredRecords.filter((r) => r.status === "absent").length,
// //       late: filteredRecords.filter((r) => r.status === "late").length,
// //       totalStaff: await db.collection("staff").countDocuments({ institutionName: { $in: institutionNames } }),
// //       totalStudents: await db.collection("students").countDocuments({ institutionName: { $in: institutionNames } }),
// //       dateRange: { start: startDateStr, end: endDateStr },
// //       institutionsProcessed: institutionNames.length,
// //     }

// //     console.log("[v0] Generating PDF report...")
// //     const pdfBuffer = await generateQuarterlyPDF(filteredRecords, stats)

// //     console.log("[v0] Generating Excel report...")
// //     const excelBuffer = await generateQuarterlyExcel(filteredRecords, stats)

// //     const emailRecipients = []
// //     for (const institution of enabledInstitutions) {
// //       const institutionAdmins = await db
// //         .collection("staff")
// //         .find({
// //           role: { $in: ["Admin", "Manager"] },
// //           email: { $exists: true, $ne: "" },
// //           institutionName: institution.name,
// //         })
// //         .toArray()

// //       emailRecipients.push(...institutionAdmins)
// //     }

// //     // Also include SuperAdmins (they get all reports)
// //     const superAdmins = await db
// //       .collection("staff")
// //       .find({
// //         role: "SuperAdmin",
// //         email: { $exists: true, $ne: "" },
// //       })
// //       .toArray()

// //     emailRecipients.push(...superAdmins)

// //     console.log("[v0] Sending reports to", emailRecipients.length, "admins/managers")

// //     const emailPromises = emailRecipients.map((admin) =>
// //       sendQuarterlyReportEmail({
// //         to: admin.email,
// //         name: admin.name,
// //         pdfBuffer,
// //         excelBuffer,
// //         stats,
// //         startDate: startDateStr,
// //         endDate: endDateStr,
// //       }),
// //     )

// //     await Promise.all(emailPromises)

// //     console.log("[v0] Deleting attendance records older than 3 months for enabled institutions...")

// //     const recordIdsToDelete = filteredRecords.filter((r) => new Date(r.date) < startDate).map((r) => r._id)

// //     const deleteResult = await db.collection("attendance").deleteMany({
// //       _id: { $in: recordIdsToDelete },
// //     })

// //     console.log("[v0] Deleted", deleteResult.deletedCount, "old attendance records")

// //     return NextResponse.json({
// //       success: true,
// //       message: "Quarterly report generated and sent successfully",
// //       stats: {
// //         institutionsProcessed: institutionNames.length,
// //         recordsProcessed: filteredRecords.length,
// //         emailsSent: emailRecipients.length,
// //         recordsDeleted: deleteResult.deletedCount,
// //         dateRange: { start: startDateStr, end: endDateStr },
// //       },
// //     })
// //   } catch (error) {
// //     console.error("[v0] Quarterly report generation failed:", error)
// //     return NextResponse.json(
// //       {
// //         error: "Internal server error",
// //         message: error instanceof Error ? error.message : "Unknown error",
// //       },
// //       { status: 500 },
// //     )
// //   }
// // }

// // // GET endpoint to test the cron job manually (only for super admin)
// // export async function GET(req: NextRequest) {
// //   try {
// //     const { searchParams } = new URL(req.url)
// //     const testMode = searchParams.get("test") === "true"

// //     if (!testMode) {
// //       return NextResponse.json({
// //         message: "Quarterly Report Cron Job",
// //         endpoint: "/api/cron/quarterly-report",
// //         method: "POST",
// //         authentication: "Bearer token required",
// //         schedule: "Every 3 months",
// //         description:
// //           "Generates quarterly attendance reports for enabled institutions, emails to admins, and deletes old data",
// //       })
// //     }

// //     // Test mode - just return stats without sending emails or deleting data
// //     const db = await getDb()

// //     const enabledInstitutions = await db.collection("institutions").find({ quarterlyReportsEnabled: true }).toArray()

// //     const institutionNames = enabledInstitutions.map((inst) => inst.name)

// //     const endDate = new Date()
// //     const startDate = new Date()
// //     startDate.setMonth(startDate.getMonth() - 3)

// //     const startDateStr = startDate.toISOString().split("T")[0]
// //     const endDateStr = endDate.toISOString().split("T")[0]

// //     const recordCount = await db.collection("attendance").countDocuments({
// //       date: { $gte: startDateStr, $lte: endDateStr },
// //     })

// //     const oldRecordCount = await db.collection("attendance").countDocuments({
// //       date: { $lt: startDateStr },
// //     })

// //     const adminCount = await db.collection("staff").countDocuments({
// //       role: { $in: ["SuperAdmin", "Admin", "Manager"] },
// //       email: { $exists: true, $ne: "" },
// //       $or: [{ institutionName: { $in: institutionNames } }, { role: "SuperAdmin" }],
// //     })

// //     return NextResponse.json({
// //       testMode: true,
// //       stats: {
// //         institutionsEnabled: enabledInstitutions.length,
// //         institutionNames,
// //         recordsToProcess: recordCount,
// //         recordsToDelete: oldRecordCount,
// //         emailsToSend: adminCount,
// //         dateRange: { start: startDateStr, end: endDateStr },
// //       },
// //       note: "This is test mode. No emails sent or data deleted.",
// //     })
// //   } catch (error) {
// //     console.error("[v0] Test mode failed:", error)
// //     return NextResponse.json(
// //       {
// //         error: "Internal server error",
// //         message: error instanceof Error ? error.message : "Unknown error",
// //       },
// //       { status: 500 },
// //     )
// //   }
// // }



// import { type NextRequest, NextResponse } from "next/server"
// import { getDb } from "@/lib/mongo"
// import { generateQuarterlyPDF, generateQuarterlyExcel } from "@/lib/report-generator"
// import { sendQuarterlyReportEmail } from "@/lib/email"
// import { ObjectId } from "mongodb"

// export async function POST(req: NextRequest) {
//   try {
//     // Verify cron secret for security
//     const authHeader = req.headers.get("authorization")
//     const cronSecret = process.env.CRON_SECRET || "your-secret-key-here"

//     if (authHeader !== `Bearer ${cronSecret}`) {
//       return NextResponse.json(
//         { error: "Unauthorized", message: "Invalid or missing authorization token" },
//         { status: 401 },
//       )
//     }

//     console.log("[v0] Starting quarterly report generation...")
//     const db = await getDb()

//     const enabledInstitutions = await db.collection("institutions").find({ quarterlyReportsEnabled: true }).toArray()

//     console.log("[v0] Found", enabledInstitutions.length, "institutions with quarterly reports enabled")

//     if (enabledInstitutions.length === 0) {
//       return NextResponse.json({
//         success: true,
//         message: "No institutions have quarterly reports enabled",
//         stats: { institutionsProcessed: 0 },
//       })
//     }

//     const institutionNames = enabledInstitutions.map((inst) => inst.name)

//     // Calculate date range (last 3 months)
//     const endDate = new Date()
//     const startDate = new Date()
//     startDate.setMonth(startDate.getMonth() - 3)

//     const startDateStr = startDate.toISOString().split("T")[0]
//     const endDateStr = endDate.toISOString().split("T")[0]

//     console.log("[v0] Fetching attendance data from", startDateStr, "to", endDateStr)

//     const attendanceRecords = await db
//       .collection("attendance")
//       .find({
//         date: {
//           $gte: startDateStr,
//           $lte: endDateStr,
//         },
//       })
//       .toArray()

//     console.log("[v0] Found", attendanceRecords.length, "attendance records")

//     // Enrich records with person details and filter by institution
//     const enrichedRecords = await Promise.all(
//       attendanceRecords.map(async (record: any) => {
//         const personCol = record.personType === "staff" ? "staff" : "students"
//         // Convert personId string to ObjectId for proper MongoDB query
//         const personObjectId = typeof record.personId === "string" ? new ObjectId(record.personId) : record.personId
//         const person = await db.collection(personCol).findOne({ _id: personObjectId })

//         return {
//           ...record,
//           personName: person?.name || person?.fullName || person?.firstName || "Unknown",
//           employeeCode: record.personType === "staff" ? person?.employeeCode : undefined,
//           rollNumber: record.personType === "student" ? person?.rollNumber : undefined,
//           department: person?.department || "N/A",
//           role: person?.role || "N/A",
//           classLevel: record.personType === "student" ? person?.classLevel : undefined,
//           shift: person?.shift || "N/A",
//           institutionName: person?.institutionName,
//         }
//       }),
//     )

//     const filteredRecords = enrichedRecords.filter(
//       (record) => !record.institutionName || institutionNames.includes(record.institutionName),
//     )

//     console.log("[v0] Processing", filteredRecords.length, "records for enabled institutions")

//     // Generate statistics
//     const stats = {
//       totalRecords: filteredRecords.length,
//       present: filteredRecords.filter((r) => r.status === "present").length,
//       absent: filteredRecords.filter((r) => r.status === "absent").length,
//       late: filteredRecords.filter((r) => r.status === "late").length,
//       totalStaff: await db.collection("staff").countDocuments({ institutionName: { $in: institutionNames } }),
//       totalStudents: await db.collection("students").countDocuments({ institutionName: { $in: institutionNames } }),
//       dateRange: { start: startDateStr, end: endDateStr },
//       institutionsProcessed: institutionNames.length,
//     }

//     console.log("[v0] Generating PDF report...")
//     const pdfBuffer = await generateQuarterlyPDF(filteredRecords, stats)

//     console.log("[v0] Generating Excel report...")
//     const excelBuffer = await generateQuarterlyExcel(filteredRecords, stats)

//     const emailRecipients = []
//     for (const institution of enabledInstitutions) {
//       const institutionAdmins = await db
//         .collection("staff")
//         .find({
//           role: { $in: ["Admin", "Manager"] },
//           email: { $exists: true, $ne: "" },
//           institutionName: institution.name,
//         })
//         .toArray()

//       emailRecipients.push(...institutionAdmins)
//     }

//     // Also include SuperAdmins (they get all reports)
//     const superAdmins = await db
//       .collection("staff")
//       .find({
//         role: "SuperAdmin",
//         email: { $exists: true, $ne: "" },
//       })
//       .toArray()

//     emailRecipients.push(...superAdmins)

//     console.log("[v0] Sending reports to", emailRecipients.length, "admins/managers")

//     const emailPromises = emailRecipients.map((admin) =>
//       sendQuarterlyReportEmail({
//         to: admin.email,
//         name: admin.name,
//         pdfBuffer,
//         excelBuffer,
//         stats,
//         startDate: startDateStr,
//         endDate: endDateStr,
//       }),
//     )

//     await Promise.all(emailPromises)

//     console.log("[v0] Deleting attendance records older than 3 months for enabled institutions...")

//     const recordIdsToDelete = filteredRecords.filter((r) => new Date(r.date) < startDate).map((r) => r._id)

//     const deleteResult = await db.collection("attendance").deleteMany({
//       _id: { $in: recordIdsToDelete },
//     })

//     console.log("[v0] Deleted", deleteResult.deletedCount, "old attendance records")

//     return NextResponse.json({
//       success: true,
//       message: "Quarterly report generated and sent successfully",
//       stats: {
//         institutionsProcessed: institutionNames.length,
//         recordsProcessed: filteredRecords.length,
//         emailsSent: emailRecipients.length,
//         recordsDeleted: deleteResult.deletedCount,
//         dateRange: { start: startDateStr, end: endDateStr },
//       },
//     })
//   } catch (error) {
//     console.error("[v0] Quarterly report generation failed:", error)
//     return NextResponse.json(
//       {
//         error: "Internal server error",
//         message: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }

// // GET endpoint to test the cron job manually (only for super admin)
// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const testMode = searchParams.get("test") === "true"

//     if (!testMode) {
//       return NextResponse.json({
//         message: "Quarterly Report Cron Job",
//         endpoint: "/api/cron/quarterly-report",
//         method: "POST",
//         authentication: "Bearer token required",
//         schedule: "Every 3 months",
//         description:
//           "Generates quarterly attendance reports for enabled institutions, emails to admins, and deletes old data",
//       })
//     }

//     // Test mode - just return stats without sending emails or deleting data
//     const db = await getDb()

//     const enabledInstitutions = await db.collection("institutions").find({ quarterlyReportsEnabled: true }).toArray()

//     const institutionNames = enabledInstitutions.map((inst) => inst.name)

//     const endDate = new Date()
//     const startDate = new Date()
//     startDate.setMonth(startDate.getMonth() - 3)

//     const startDateStr = startDate.toISOString().split("T")[0]
//     const endDateStr = endDate.toISOString().split("T")[0]

//     const recordCount = await db.collection("attendance").countDocuments({
//       date: { $gte: startDateStr, $lte: endDateStr },
//     })

//     const oldRecordCount = await db.collection("attendance").countDocuments({
//       date: { $lt: startDateStr },
//     })

//     const adminCount = await db.collection("staff").countDocuments({
//       role: { $in: ["SuperAdmin", "Admin", "Manager"] },
//       email: { $exists: true, $ne: "" },
//       $or: [{ institutionName: { $in: institutionNames } }, { role: "SuperAdmin" }],
//     })

//     return NextResponse.json({
//       testMode: true,
//       stats: {
//         institutionsEnabled: enabledInstitutions.length,
//         institutionNames,
//         recordsToProcess: recordCount,
//         recordsToDelete: oldRecordCount,
//         emailsToSend: adminCount,
//         dateRange: { start: startDateStr, end: endDateStr },
//       },
//       note: "This is test mode. No emails sent or data deleted.",
//     })
//   } catch (error) {
//     console.error("[v0] Test mode failed:", error)
//     return NextResponse.json(
//       {
//         error: "Internal server error",
//         message: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }




import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import { generateQuarterlyPDF, generateQuarterlyExcel } from "@/lib/report-generator"
import { sendQuarterlyReportEmail } from "@/lib/email"
import { ObjectId } from "mongodb"

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tokenFromQuery = searchParams.get("token")
    const authHeader = req.headers.get("authorization")
    const tokenFromHeader = authHeader?.replace("Bearer ", "")

    const providedToken = tokenFromQuery || tokenFromHeader
    const cronSecret = process.env.CRON_SECRET || "your-secret-key-here"

    if (!providedToken || providedToken !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized", message: "Invalid or missing token" }, { status: 401 })
    }

    console.log("[v0] Starting quarterly report generation...")
    const db = await getDb()

    const enabledInstitutions = await db.collection("institutions").find({ quarterlyReportsEnabled: true }).toArray()

    console.log("[v0] Found", enabledInstitutions.length, "institutions with quarterly reports enabled")

    if (enabledInstitutions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No institutions have quarterly reports enabled",
        stats: { institutionsProcessed: 0 },
      })
    }

    const institutionNames = enabledInstitutions.map((inst) => inst.name)

    // Calculate date range (last 3 months)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 3)

    const startDateStr = startDate.toISOString().split("T")[0]
    const endDateStr = endDate.toISOString().split("T")[0]

    console.log("[v0] Fetching attendance data from", startDateStr, "to", endDateStr)

    const attendanceRecords = await db
      .collection("attendance")
      .find({
        date: {
          $gte: startDateStr,
          $lte: endDateStr,
        },
      })
      .toArray()

    console.log("[v0] Found", attendanceRecords.length, "attendance records")

    // Enrich records with person details and filter by institution
    const enrichedRecords = await Promise.all(
      attendanceRecords.map(async (record: any) => {
        const personCol = record.personType === "staff" ? "staff" : "students"
        // Convert personId string to ObjectId for proper MongoDB query
        const personObjectId = typeof record.personId === "string" ? new ObjectId(record.personId) : record.personId
        const person = await db.collection(personCol).findOne({ _id: personObjectId })

        return {
          ...record,
          personName: person?.name || person?.fullName || person?.firstName || "Unknown",
          employeeCode: record.personType === "staff" ? person?.employeeCode : undefined,
          rollNumber: record.personType === "student" ? person?.rollNumber : undefined,
          department: person?.department || "N/A",
          role: person?.role || "N/A",
          classLevel: record.personType === "student" ? person?.classLevel : undefined,
          shift: person?.shift || "N/A",
          institutionName: person?.institutionName,
        }
      }),
    )

    const filteredRecords = enrichedRecords.filter(
      (record) => !record.institutionName || institutionNames.includes(record.institutionName),
    )

    console.log("[v0] Processing", filteredRecords.length, "records for enabled institutions")

    // Generate statistics
    const stats = {
      totalRecords: filteredRecords.length,
      present: filteredRecords.filter((r) => r.status === "present").length,
      absent: filteredRecords.filter((r) => r.status === "absent").length,
      late: filteredRecords.filter((r) => r.status === "late").length,
      totalStaff: await db.collection("staff").countDocuments({ institutionName: { $in: institutionNames } }),
      totalStudents: await db.collection("students").countDocuments({ institutionName: { $in: institutionNames } }),
      dateRange: { start: startDateStr, end: endDateStr },
      institutionsProcessed: institutionNames.length,
    }

    console.log("[v0] Generating PDF report...")
    const pdfBuffer = await generateQuarterlyPDF(filteredRecords, stats)

    console.log("[v0] Generating Excel report...")
    const excelBuffer = await generateQuarterlyExcel(filteredRecords, stats)

    const emailRecipients = []
    for (const institution of enabledInstitutions) {
      const institutionAdmins = await db
        .collection("staff")
        .find({
          role: { $in: ["Admin", "Manager"] },
          email: { $exists: true, $ne: "" },
          institutionName: institution.name,
        })
        .toArray()

      emailRecipients.push(...institutionAdmins)
    }

    // Also include SuperAdmins (they get all reports)
    const superAdmins = await db
      .collection("staff")
      .find({
        role: "SuperAdmin",
        email: { $exists: true, $ne: "" },
      })
      .toArray()

    emailRecipients.push(...superAdmins)

    console.log("[v0] Sending reports to", emailRecipients.length, "admins/managers")

    const emailPromises = emailRecipients.map((admin) =>
      sendQuarterlyReportEmail({
        to: admin.email,
        name: admin.name,
        pdfBuffer,
        excelBuffer,
        stats,
        startDate: startDateStr,
        endDate: endDateStr,
      }),
    )

    await Promise.all(emailPromises)

    console.log("[v0] Deleting attendance records older than 3 months for enabled institutions...")

    const recordIdsToDelete = filteredRecords.filter((r) => new Date(r.date) < startDate).map((r) => r._id)

    const deleteResult = await db.collection("attendance").deleteMany({
      _id: { $in: recordIdsToDelete },
    })

    console.log("[v0] Deleted", deleteResult.deletedCount, "old attendance records")

    return NextResponse.json({
      success: true,
      message: "Quarterly report generated and sent successfully",
      stats: {
        institutionsProcessed: institutionNames.length,
        recordsProcessed: filteredRecords.length,
        emailsSent: emailRecipients.length,
        recordsDeleted: deleteResult.deletedCount,
        dateRange: { start: startDateStr, end: endDateStr },
      },
    })
  } catch (error) {
    console.error("[v0] Quarterly report generation failed:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// GET endpoint to test the cron job manually (only for super admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const testMode = searchParams.get("test") === "true"

    if (!testMode) {
      return NextResponse.json({
        message: "Quarterly Report Cron Job",
        endpoint: "/api/cron/quarterly-report",
        method: "POST",
        authentication: "Token via query parameter (?token=YOUR_SECRET) or Bearer header",
        schedule: "Every 3 months",
        description:
          "Generates quarterly attendance reports for enabled institutions, emails to admins, and deletes old data",
        example: "POST /api/cron/quarterly-report?token=YOUR_SECRET",
      })
    }

    const db = await getDb()

    const enabledInstitutions = await db.collection("institutions").find({ quarterlyReportsEnabled: true }).toArray()

    const institutionNames = enabledInstitutions.map((inst) => inst.name)

    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 3)

    const startDateStr = startDate.toISOString().split("T")[0]
    const endDateStr = endDate.toISOString().split("T")[0]

    const recordCount = await db.collection("attendance").countDocuments({
      date: { $gte: startDateStr, $lte: endDateStr },
    })

    const oldRecordCount = await db.collection("attendance").countDocuments({
      date: { $lt: startDateStr },
    })

    const adminCount = await db.collection("staff").countDocuments({
      role: { $in: ["SuperAdmin", "Admin", "Manager"] },
      email: { $exists: true, $ne: "" },
      $or: [{ institutionName: { $in: institutionNames } }, { role: "SuperAdmin" }],
    })

    return NextResponse.json({
      testMode: true,
      stats: {
        institutionsEnabled: enabledInstitutions.length,
        institutionNames,
        recordsToProcess: recordCount,
        recordsToDelete: oldRecordCount,
        emailsToSend: adminCount,
        dateRange: { start: startDateStr, end: endDateStr },
      },
      note: "This is test mode. No emails sent or data deleted.",
    })
  } catch (error) {
    console.error("[v0] Test mode failed:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

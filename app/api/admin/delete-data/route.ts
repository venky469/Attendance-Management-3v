import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { generateQuarterlyPDF, generateQuarterlyExcel } from "@/lib/report-generator"
import { sendDataDeletionEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dataType, userId, userEmail, userRole } = body

    if (userRole !== "SuperAdmin") {
      return NextResponse.json({ error: "Unauthorized. SuperAdmin access required." }, { status: 403 })
    }

    const validDataTypes = [
      "notifications",
      "attendance",
      "staff",
      "students",
      "institutions",
      "leaveRequests",
      "loginHistory",
      "shiftSettings",
      "all",
    ]

    if (!dataType || !validDataTypes.includes(dataType)) {
      return NextResponse.json({ error: "Invalid data type specified" }, { status: 400 })
    }

    const db = await getDb()

    let deletedData: any = {}
    let collectionData: any = {}

    // Helper function to get data from collection
    const fetchCollectionData = async (collectionName: string, shouldFetch: boolean) => {
      if (shouldFetch) {
        collectionData[collectionName] = await db.collection(collectionName).find({}).toArray()
        return collectionData[collectionName]
      }
      return []
    }

    // Determine which collections to delete
    const shouldDelete = {
      notifications: dataType === "notifications" || dataType === "all",
      attendance: dataType === "attendance" || dataType === "all",
      staff: dataType === "staff" || dataType === "all",
      students: dataType === "students" || dataType === "all",
      institutions: dataType === "institutions" || dataType === "all",
      leaveRequests: dataType === "leaveRequests" || dataType === "all",
      loginHistory: dataType === "loginHistory" || dataType === "all",
      shiftSettings: dataType === "shiftSettings" || dataType === "all",
    }

    // Fetch data for selected collections
    await Promise.all([
      fetchCollectionData("push_subscriptions", shouldDelete.notifications),
      fetchCollectionData("attendance", shouldDelete.attendance),
      fetchCollectionData("staff", shouldDelete.staff),
      fetchCollectionData("students", shouldDelete.students),
      fetchCollectionData("institutions", shouldDelete.institutions),
      fetchCollectionData("leave_requests", shouldDelete.leaveRequests),
      fetchCollectionData("login_history", shouldDelete.loginHistory),
      fetchCollectionData("shift_settings", shouldDelete.shiftSettings),
    ])

    // Calculate statistics for attendance if being deleted
    let stats: any = {}
    if (shouldDelete.attendance && collectionData.attendance?.length > 0) {
      const attendanceData = collectionData.attendance
      stats = {
        totalRecords: attendanceData.length,
        present: attendanceData.filter((r: any) => r.status === "present").length,
        absent: attendanceData.filter((r: any) => r.status === "absent").length,
        late: attendanceData.filter((r: any) => r.status === "late").length,
        totalStaff: await db.collection("staff").countDocuments(),
        totalStudents: await db.collection("students").countDocuments(),
        dateRange: {
          start: attendanceData[0]?.date || new Date().toISOString().split("T")[0],
          end: new Date().toISOString().split("T")[0],
        },
      }
    }

    // Generate PDF and Excel reports (primarily for attendance, but can be extended)
    let pdfBuffer: Buffer | null = null
    let excelBuffer: Buffer | null = null

    if (shouldDelete.attendance && collectionData.attendance?.length > 0) {
      pdfBuffer = await generateQuarterlyPDF(collectionData.attendance, stats)
      excelBuffer = await generateQuarterlyExcel(collectionData.attendance, stats)
    }

    // Get all admin emails (Admin, Manager, SuperAdmin)
    const admins = await db
      .collection("staff")
      .find({
        role: { $in: ["Admin", "Manager", "SuperAdmin"] },
        email: { $exists: true, $ne: "" },
      })
      .toArray()

    const emailPromises = admins.map((admin: any) =>
      sendDataDeletionEmail({
        to: admin.email,
        adminName: admin.name,
        dataType,
        deletedBy: userEmail,
        pdfBuffer,
        excelBuffer,
        notificationsCount: collectionData.push_subscriptions?.length || 0,
        attendanceCount: collectionData.attendance?.length || 0,
        staffCount: collectionData.staff?.length || 0,
        studentsCount: collectionData.students?.length || 0,
        institutionsCount: collectionData.institutions?.length || 0,
        leaveRequestsCount: collectionData.leave_requests?.length || 0,
        loginHistoryCount: collectionData.login_history?.length || 0,
        shiftSettingsCount: collectionData.shift_settings?.length || 0,
        institutionName: admin.institutionName,
      }),
    )

    await Promise.all(emailPromises)

    const deletionResults: any = {}

    if (shouldDelete.notifications) {
      const result = await db.collection("push_subscriptions").deleteMany({})
      deletionResults.notifications = result.deletedCount || 0
    }

    if (shouldDelete.attendance) {
      const result = await db.collection("attendance").deleteMany({})
      deletionResults.attendance = result.deletedCount || 0
    }

    if (shouldDelete.staff) {
      const result = await db.collection("staff").deleteMany({})
      deletionResults.staff = result.deletedCount || 0
    }

    if (shouldDelete.students) {
      const result = await db.collection("students").deleteMany({})
      deletionResults.students = result.deletedCount || 0
    }

    if (shouldDelete.institutions) {
      const result = await db.collection("institutions").deleteMany({})
      deletionResults.institutions = result.deletedCount || 0
    }

    if (shouldDelete.leaveRequests) {
      const result = await db.collection("leave_requests").deleteMany({})
      deletionResults.leaveRequests = result.deletedCount || 0
    }

    if (shouldDelete.loginHistory) {
      const result = await db.collection("login_history").deleteMany({})
      deletionResults.loginHistory = result.deletedCount || 0
    }

    if (shouldDelete.shiftSettings) {
      const result = await db.collection("shift_settings").deleteMany({})
      deletionResults.shiftSettings = result.deletedCount || 0
    }

    return NextResponse.json({
      success: true,
      message: "Data deleted successfully and emails sent to all admins",
      deletedCounts: deletionResults,
      emailsSent: admins.length,
    })
  } catch (error) {
    console.error("[admin/delete-data] Error:", error)
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 })
  }
}

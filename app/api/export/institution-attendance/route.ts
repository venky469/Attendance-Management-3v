import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { getDb } from "@/lib/mongo"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { dateRange, filters, options } = await request.json()
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "excel"

    const db = await getDb()

    // Build query for institution filtering
    const institutionFilter = filters?.institutionName ? { institutionName: filters.institutionName } : {}

    // Build attendance query with date range and institution filter
    const attendanceQuery: any = { ...institutionFilter }
    if (dateRange?.startDate && dateRange?.endDate) {
      attendanceQuery.date = { $gte: dateRange.startDate, $lte: dateRange.endDate }
    }
    if (filters?.department && filters.department !== "all") {
      attendanceQuery.department = filters.department
    }
    if (filters?.status && filters.status !== "all") {
      attendanceQuery.status = filters.status
    }

    console.log("[v0] Fetching institution and attendance data with query:", attendanceQuery)

    // Fetch institution data and attendance records
    const [institutionRecords, attendanceRecords] = await Promise.all([
      db
        .collection("institutions")
        .find(filters?.institutionName ? { name: filters.institutionName } : {})
        .toArray(),
      db.collection("attendance").find(attendanceQuery).sort({ date: -1, timestamp: -1 }).toArray(),
    ])

    console.log(
      "[v0] Found records - Institutions:",
      institutionRecords.length,
      "Attendance:",
      attendanceRecords.length,
    )

    // Format institution data
    const institutions = await Promise.all(
      institutionRecords.map(async (inst: any) => {
        const [staffCount, studentCount] = await Promise.all([
          db.collection("staff").countDocuments({ institutionName: inst.name }),
          db.collection("students").countDocuments({ institutionName: inst.name }),
        ])

        return {
          "Institution Name": inst.name || "Unknown",
          Status: inst.blocked ? "Blocked" : "Active",
          "Location Verification": inst.locationVerificationEnabled ? "Enabled" : "Disabled",
          "Quarterly Reports": inst.quarterlyReportsEnabled ? "Enabled" : "Disabled",
          "Total Staff": staffCount,
          "Total Students": studentCount,
          "Created Date": inst.createdAt ? new Date(inst.createdAt).toLocaleDateString() : "N/A",
          "Last Updated": inst.updatedAt ? new Date(inst.updatedAt).toLocaleDateString() : "N/A",
        }
      }),
    )

    // Enrich attendance data with minimal person details (just name and ID)
    const attendance = await Promise.all(
      attendanceRecords.map(async (record: any) => {
        const personCol = record.personType === "staff" ? "staff" : "students"
        const person = await db.collection(personCol).findOne({ _id: new ObjectId(record.personId) })

        return {
          Institution: record.institutionName || "N/A",
          "Person Name": person?.name || person?.fullName || person?.firstName || "Unknown",
          "Person Type": record.personType || "N/A",
          "Employee/Roll Number": person?.employeeCode || person?.rollNumber || "N/A",
          Date: record.date || "N/A",
          "Check In Time": record.checkInTime || record.timestamp || "N/A",
          "Check Out Time": record.checkOutTime || "N/A",
          Status: record.status || "N/A",
          Department: record.department || "N/A",
          Shift: record.shift || "N/A",
          Location: record.location || "N/A",
        }
      }),
    )

    console.log("[v0] Formatted data - Institutions:", institutions.length, "Attendance:", attendance.length)

    switch (format) {
      case "excel": {
        const workbook = XLSX.utils.book_new()

        // Summary sheet
        if (options?.includeSummary) {
          const summaryData = [
            { Metric: "Report Type", Value: "Institution & Attendance Report" },
            { Metric: "Date Range", Value: `${dateRange?.startDate || "All"} to ${dateRange?.endDate || "All"}` },
            { Metric: "Total Institutions", Value: institutions.length },
            { Metric: "Total Attendance Records", Value: attendance.length },
            { Metric: "Present", Value: attendance.filter((r) => r.Status === "present").length },
            { Metric: "Absent", Value: attendance.filter((r) => r.Status === "absent").length },
            { Metric: "Late", Value: attendance.filter((r) => r.Status === "late").length },
            { Metric: "Generated On", Value: new Date().toLocaleString() },
          ]
          const summarySheet = XLSX.utils.json_to_sheet(summaryData)
          XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")
        }

        // Institutions sheet
        if (institutions.length > 0) {
          const institutionSheet = XLSX.utils.json_to_sheet(institutions)
          XLSX.utils.book_append_sheet(workbook, institutionSheet, "Institutions")
        }

        // Attendance sheet
        if (attendance.length > 0) {
          const attendanceSheet = XLSX.utils.json_to_sheet(attendance)
          XLSX.utils.book_append_sheet(workbook, attendanceSheet, "Attendance Records")
        }

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename=institution_attendance_${dateRange?.startDate || "all"}_to_${dateRange?.endDate || "all"}.xlsx`,
          },
        })
      }

      case "csv": {
        const csvSections = []

        csvSections.push(
          `Institution & Attendance Report - ${dateRange?.startDate || "All"} to ${dateRange?.endDate || "All"}`,
        )
        csvSections.push(`Generated: ${new Date().toLocaleString()}`)
        csvSections.push("")

        // Summary
        if (options?.includeSummary) {
          csvSections.push("SUMMARY")
          csvSections.push(`Total Institutions,${institutions.length}`)
          csvSections.push(`Total Attendance Records,${attendance.length}`)
          csvSections.push(`Present,${attendance.filter((r) => r.Status === "present").length}`)
          csvSections.push(`Absent,${attendance.filter((r) => r.Status === "absent").length}`)
          csvSections.push(`Late,${attendance.filter((r) => r.Status === "late").length}`)
          csvSections.push("")
        }

        // Institutions section
        if (institutions.length > 0) {
          csvSections.push("INSTITUTIONS")
          csvSections.push(
            "Institution Name,Status,Location Verification,Quarterly Reports,Total Staff,Total Students,Created Date,Last Updated",
          )
          institutions.forEach((inst) => {
            csvSections.push(
              `"${inst["Institution Name"]}","${inst.Status}","${inst["Location Verification"]}","${inst["Quarterly Reports"]}","${inst["Total Staff"]}","${inst["Total Students"]}","${inst["Created Date"]}","${inst["Last Updated"]}"`,
            )
          })
          csvSections.push("")
        }

        // Attendance section
        if (attendance.length > 0) {
          csvSections.push("ATTENDANCE RECORDS")
          csvSections.push(
            "Institution,Person Name,Person Type,Employee/Roll Number,Date,Check In Time,Check Out Time,Status,Department,Shift,Location",
          )
          attendance.forEach((a) => {
            csvSections.push(
              `"${a.Institution}","${a["Person Name"]}","${a["Person Type"]}","${a["Employee/Roll Number"]}","${a.Date}","${a["Check In Time"]}","${a["Check Out Time"]}","${a.Status}","${a.Department}","${a.Shift}","${a.Location}"`,
            )
          })
        }

        const csvContent = csvSections.join("\n")

        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename=institution_attendance_${dateRange?.startDate || "all"}_to_${dateRange?.endDate || "all"}.csv`,
          },
        })
      }

      case "pdf": {
        return NextResponse.json(
          {
            error: "PDF export is currently unavailable. Please use Excel or CSV format instead.",
            suggestion: "Excel format provides the best experience with multiple sheets and comprehensive data.",
          },
          { status: 400 },
        )
      }

      default:
        return NextResponse.json({ error: "Invalid format" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Institution & Attendance export error:", error)
    return NextResponse.json({ error: "Export failed: " + (error as Error).message }, { status: 500 })
  }
}

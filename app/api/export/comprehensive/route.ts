import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { getDb } from "@/lib/mongo"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { data, dateRange, filters, options } = await request.json()
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "excel"

    const db = await getDb()

    // Build attendance query with date range
    const attendanceQuery: any = {}
    if (dateRange?.startDate && dateRange?.endDate) {
      attendanceQuery.date = { $gte: dateRange.startDate, $lte: dateRange.endDate }
    }
    if (filters?.department && filters.department !== "all") {
      attendanceQuery.department = filters.department
    }
    if (filters?.institutionName) {
      attendanceQuery.institutionName = filters.institutionName
    }

    console.log("[v0] Fetching comprehensive data with query:", attendanceQuery)

    // Fetch all data from database
    const [staffRecords, studentRecords, attendanceRecords] = await Promise.all([
      db
        .collection("staff")
        .find(filters?.institutionName ? { institutionName: filters.institutionName } : {})
        .toArray(),
      db
        .collection("students")
        .find(filters?.institutionName ? { institutionName: filters.institutionName } : {})
        .toArray(),
      db.collection("attendance").find(attendanceQuery).sort({ date: -1 }).toArray(),
    ])

    console.log(
      "[v0] Found records - Staff:",
      staffRecords.length,
      "Students:",
      studentRecords.length,
      "Attendance:",
      attendanceRecords.length,
    )

    // Format staff data
    const staff = staffRecords.map((s: any) => ({
      name: s.name || "Unknown",
      email: s.email || "N/A",
      employeeCode: s.employeeCode || "N/A",
      department: s.department || "N/A",
      role: s.role || "N/A",
      shift: s.shift || "N/A",
      phone: s.phone || "N/A",
    }))

    // Format student data
    const students = studentRecords.map((s: any) => ({
      name: s.fullName || s.firstName || "Unknown",
      email: s.email || "N/A",
      rollNumber: s.rollNumber || "N/A",
      branchClass: s.branchClass || "N/A",
      department: s.department || "N/A",
      phone: s.phone || "N/A",
    }))

    // Enrich attendance data with person details
    const attendance = await Promise.all(
      attendanceRecords.map(async (record: any) => {
        const personCol = record.personType === "staff" ? "staff" : "students"
        const person = await db.collection(personCol).findOne({ _id: new ObjectId(record.personId) })

        return {
          name: person?.name || person?.fullName || person?.firstName || "Unknown",
          personType: record.personType || "N/A",
          date: record.date || "N/A",
          checkInTime: record.checkInTime || record.timestamp || "N/A",
          checkOutTime: record.checkOutTime || "N/A",
          status: record.status || "N/A",
          department: record.department || "N/A",
        }
      }),
    )

    console.log(
      "[v0] Formatted data - Staff:",
      staff.length,
      "Students:",
      students.length,
      "Attendance:",
      attendance.length,
    )

    switch (format) {
      case "excel": {
        const workbook = XLSX.utils.book_new()

        if (options?.includeSummary) {
          const summaryData = [
            { Metric: "Report Type", Value: "Comprehensive Report" },
            { Metric: "Date Range", Value: `${dateRange?.startDate} to ${dateRange?.endDate}` },
            { Metric: "Total Staff", Value: staff.length },
            { Metric: "Total Students", Value: students.length },
            { Metric: "Total Attendance Records", Value: attendance.length },
            { Metric: "Generated On", Value: new Date().toLocaleString() },
          ]
          const summarySheet = XLSX.utils.json_to_sheet(summaryData)
          XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")
        }

        if (staff.length > 0) {
          const staffSheet = XLSX.utils.json_to_sheet(staff)
          XLSX.utils.book_append_sheet(workbook, staffSheet, "Staff")
        }

        if (students.length > 0) {
          const studentSheet = XLSX.utils.json_to_sheet(students)
          XLSX.utils.book_append_sheet(workbook, studentSheet, "Students")
        }

        if (attendance.length > 0) {
          const attendanceSheet = XLSX.utils.json_to_sheet(attendance)
          XLSX.utils.book_append_sheet(workbook, attendanceSheet, "Attendance")
        }

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename=comprehensive_report_${dateRange?.startDate}_to_${dateRange?.endDate}.xlsx`,
          },
        })
      }

      case "csv": {
        const csvSections = []

        csvSections.push(`Comprehensive Report - ${dateRange?.startDate} to ${dateRange?.endDate}`)
        csvSections.push(`Generated: ${new Date().toLocaleString()}`)
        csvSections.push("")

        if (options?.includeSummary) {
          csvSections.push("SUMMARY")
          csvSections.push(`Total Staff,${staff.length}`)
          csvSections.push(`Total Students,${students.length}`)
          csvSections.push(`Total Attendance Records,${attendance.length}`)
          csvSections.push("")
        }

        if (staff.length > 0) {
          csvSections.push("STAFF MEMBERS")
          csvSections.push("Name,Email,Code,Department,Role,Shift,Phone")
          staff.forEach((s) => {
            csvSections.push(
              `"${s.name}","${s.email || "N/A"}","${s.employeeCode || "N/A"}","${s.department || "N/A"}","${s.role || "N/A"}","${s.shift || "N/A"}","${s.phone || "N/A"}"`,
            )
          })
          csvSections.push("")
        }

        if (students.length > 0) {
          csvSections.push("STUDENTS")
          csvSections.push("Name,Email,Roll Number,Class,Department,Phone")
          students.forEach((s) => {
            csvSections.push(
              `"${s.name}","${s.email || "N/A"}","${s.rollNumber || "N/A"}","${s.branchClass || "N/A"}","${s.department || "N/A"}","${s.phone || "N/A"}"`,
            )
          })
          csvSections.push("")
        }

        if (attendance.length > 0) {
          csvSections.push("ATTENDANCE RECORDS")
          csvSections.push("Name,Type,Date,Check In,Check Out,Status,Department")
          attendance.forEach((a) => {
            csvSections.push(
              `"${a.name || "N/A"}","${a.personType || "N/A"}","${a.date ? new Date(a.date).toLocaleDateString() : "N/A"}","${a.checkInTime || "N/A"}","${a.checkOutTime || "N/A"}","${a.status || "N/A"}","${a.department || "N/A"}"`,
            )
          })
        }

        const csvContent = csvSections.join("\n")

        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename=comprehensive_report_${dateRange?.startDate}_to_${dateRange?.endDate}.csv`,
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
    console.error("[v0] Comprehensive export error:", error)
    return NextResponse.json({ error: "Export failed: " + error.message }, { status: 500 })
  }
}

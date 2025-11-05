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

    const query: any = {}

    if (dateRange?.startDate && dateRange?.endDate) {
      query.date = { $gte: dateRange.startDate, $lte: dateRange.endDate }
    } else if (dateRange?.startDate) {
      query.date = dateRange.startDate
    }

    if (filters?.department && filters.department !== "all") {
      query.department = filters.department
    }
    if (filters?.role && filters.role !== "all") {
      query.role = filters.role
    }
    if (filters?.shift && filters.shift !== "all") {
      query.shift = filters.shift
    }
    if (filters?.status && filters.status !== "all") {
      query.status = filters.status
    }
    if (filters?.personType) {
      query.personType = filters.personType
    }

    console.log("[v0] Fetching attendance with query:", query)

    const attendanceRecords = await db.collection("attendance").find(query).sort({ date: -1, timestamp: -1 }).toArray()

    console.log("[v0] Found attendance records:", attendanceRecords.length)

    const exportData = await Promise.all(
      attendanceRecords.map(async (record: any) => {
        const personCol = record.personType === "staff" ? "staff" : "students"
        const person = await db.collection(personCol).findOne({ _id: new ObjectId(record.personId) })

        return {
          Name: person?.name || person?.fullName || person?.firstName || "Unknown",
          Type: record.personType || "N/A",
          Date: record.date || "N/A",
          "Check In": record.checkInTime || record.timestamp || "N/A",
          "Check Out": record.checkOutTime || "N/A",
          Status: record.status || "N/A",
          Department: record.department || "N/A",
          Shift: record.shift || "N/A",
          Location: record.location || "N/A",
        }
      }),
    )

    console.log("[v0] Enriched data count:", exportData.length)

    switch (format) {
      case "excel": {
        const workbook = XLSX.utils.book_new()

        if (options?.includeSummary) {
          const summaryData = [
            { Metric: "Total Records", Value: exportData.length },
            { Metric: "Date Range", Value: `${dateRange?.startDate} to ${dateRange?.endDate}` },
            { Metric: "Present", Value: exportData.filter((r) => r.Status === "present").length },
            { Metric: "Absent", Value: exportData.filter((r) => r.Status === "absent").length },
            { Metric: "Late", Value: exportData.filter((r) => r.Status === "late").length },
          ]
          const summarySheet = XLSX.utils.json_to_sheet(summaryData)
          XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")
        }

        const worksheet = XLSX.utils.json_to_sheet(exportData)
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance")

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename=attendance_${dateRange?.startDate}_to_${dateRange?.endDate}.xlsx`,
          },
        })
      }

      case "csv": {
        const headers = Object.keys(exportData[0] || {})
        const csvRows = [
          `Attendance Report - ${dateRange?.startDate} to ${dateRange?.endDate}`,
          "",
          headers.join(","),
          ...exportData.map((row) => headers.map((header) => `"${row[header]}"`).join(",")),
        ]

        if (options?.includeSummary) {
          csvRows.push("")
          csvRows.push("SUMMARY")
          csvRows.push(`Total Records,${exportData.length}`)
          csvRows.push(`Present,${exportData.filter((r) => r.Status === "present").length}`)
          csvRows.push(`Absent,${exportData.filter((r) => r.Status === "absent").length}`)
          csvRows.push(`Late,${exportData.filter((r) => r.Status === "late").length}`)
        }

        const csvContent = csvRows.join("\n")

        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename=attendance_${dateRange?.startDate}_to_${dateRange?.endDate}.csv`,
          },
        })
      }

      case "pdf": {
        return NextResponse.json(
          {
            error: "PDF export is currently unavailable. Please use Excel or CSV format instead.",
            suggestion: "Excel format provides the best experience with multiple sheets and formatting.",
          },
          { status: 400 },
        )
      }

      default:
        return NextResponse.json({ error: "Invalid format" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Attendance export error:", error)
    return NextResponse.json({ error: "Export failed: " + error.message }, { status: 500 })
  }
}



"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet, File } from "lucide-react"
import type { AttendanceRecord } from "@/lib/types"

interface ExportAttendanceProps {
  records: (AttendanceRecord & {
    personName?: string
    employeeCode?: string
    rollNumber?: string
    classLevel?: string
  })[]
  filters: {
    department?: string
    role?: string
    shift?: string
    status?: string
    date?: string
  }
}

export function ExportAttendance({ records, filters }: ExportAttendanceProps) {
  const exportToPDF = async () => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text("Attendance Report", 20, 20)

    // Filters info
    doc.setFontSize(12)
    let yPos = 40
    doc.text(`Date: ${filters.date || "All dates"}`, 20, yPos)
    yPos += 10
    if (filters.department && filters.department !== "all") {
      doc.text(`Department: ${filters.department}`, 20, yPos)
      yPos += 10
    }
    if (filters.role && filters.role !== "all") {
      doc.text(`Role: ${filters.role}`, 20, yPos)
      yPos += 10
    }
    if (filters.shift && filters.shift !== "all") {
      doc.text(`Shift: ${filters.shift}`, 20, yPos)
      yPos += 10
    }
    if (filters.status && filters.status !== "all") {
      doc.text(`Status: ${filters.status}`, 20, yPos)
      yPos += 10
    }

    yPos += 10

    // Summary
    const present = records.filter((r) => r.status === "present").length
    const absent = records.filter((r) => r.status === "absent").length
    const late = records.filter((r) => r.status === "late").length

    doc.text(`Summary: Present: ${present}, Absent: ${absent}, Late: ${late}, Total: ${records.length}`, 20, yPos)
    yPos += 20

    // Table headers
    doc.setFontSize(10)
    doc.text("Name", 20, yPos)
    doc.text("Code/Roll", 60, yPos)
    doc.text("Class", 90, yPos)
    doc.text("Type", 110, yPos)
    doc.text("Department", 130, yPos)
    doc.text("Shift", 160, yPos)
    doc.text("Status", 180, yPos)
    yPos += 10

    // Table data
    records.forEach((record) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.text(record.personName || "Unknown", 20, yPos)
      doc.text(record.employeeCode || record.rollNumber || "N/A", 60, yPos)
      doc.text(record.classLevel || "N/A", 90, yPos)
      doc.text(record.personType, 110, yPos)
      doc.text(record.department || '', 130, yPos)
      doc.text(record.shift || '', 160, yPos)
      doc.text(record.status.toUpperCase(), 180, yPos)
      yPos += 8
    })

    doc.save(`attendance-report-${filters.date || "all"}.pdf`)
  }

  const exportToExcel = () => {
    const headers = [
      "Name",
      "Employee Code/Roll Number",
      "Class Level",
      "Type",
      "Department",
      "Role",
      "Shift",
      "Status",
      "Timestamp",
    ]
    const csvContent = [
      headers.join(","),
      ...records.map((record) =>
        [
          record.personName || "Unknown",
          record.employeeCode || record.rollNumber || "N/A",
          record.classLevel || "N/A",
          record.personType,
          record.department,
          record.role,
          record.shift,
          record.status.toUpperCase(),
          record.timestamp ? new Date(record.timestamp).toLocaleString() : "Not marked",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `attendance-report-${filters.date || "all"}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToDoc = () => {
    const present = records.filter((r) => r.status === "present").length
    const absent = records.filter((r) => r.status === "absent").length
    const late = records.filter((r) => r.status === "late").length

    const htmlContent = `
      <html>
        <head>
          <title>Attendance Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            .summary { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .present { color: #059669; font-weight: bold; }
            .absent { color: #dc2626; font-weight: bold; }
            .late { color: #d97706; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Attendance Report</h1>
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Date:</strong> ${filters.date || "All dates"}</p>
            ${filters.department && filters.department !== "all" ? `<p><strong>Department:</strong> ${filters.department}</p>` : ""}
            ${filters.role && filters.role !== "all" ? `<p><strong>Role:</strong> ${filters.role}</p>` : ""}
            ${filters.shift && filters.shift !== "all" ? `<p><strong>Shift:</strong> ${filters.shift}</p>` : ""}
            ${filters.status && filters.status !== "all" ? `<p><strong>Status:</strong> ${filters.status}</p>` : ""}
            <p><strong>Present:</strong> ${present} | <strong>Absent:</strong> ${absent} | <strong>Late:</strong> ${late} | <strong>Total:</strong> ${records.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee Code/Roll Number</th>
                <th>Class Level</th>
                <th>Type</th>
                <th>Department</th>
                <th>Role</th>
                <th>Shift</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${records
                .map(
                  (record) => `
                <tr>
                  <td>${record.personName || "Unknown"}</td>
                  <td>${record.employeeCode || record.rollNumber || "N/A"}</td>
                  <td>${record.classLevel || "N/A"}</td>
                  <td>${record.personType}</td>
                  <td>${record.department}</td>
                  <td>${record.role}</td>
                  <td>${record.shift}</td>
                  <td class="${record.status}">${record.status.toUpperCase()}</td>
                  <td>${record.timestamp ? new Date(record.timestamp).toLocaleString() : "Not marked"}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: "application/msword" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `attendance-report-${filters.date || "all"}.doc`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary">
          <Download className="h-4 w-4" />
          Export Attendance
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={exportToPDF} className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4 text-red-500" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4 text-green-500" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToDoc} className="gap-2 cursor-pointer">
          <File className="h-4 w-4 text-blue-500" />
          Export as DOC
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


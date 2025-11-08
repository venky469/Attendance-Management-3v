
"use client"

import { Button } from "@/components/ui/button"
import { Download, FileText, FileSpreadsheet, Calendar, Filter, Building2 } from "lucide-react"
import type { AttendanceRecord } from "@/lib/types"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

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
    personType?: string
  }
  currentUser?: {
    role?: string
    institutionName?: string
  } | null
}

export function ExportAttendance({ records, filters, currentUser }: ExportAttendanceProps) {
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel" | "csv">("excel")
  const [dateRangeType, setDateRangeType] = useState<"single" | "range">("single")
  const [startDate, setStartDate] = useState(filters.date || new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(filters.date || new Date().toISOString().slice(0, 10))
  const [exportPersonType, setExportPersonType] = useState<string>("all")
  const [exportStatus, setExportStatus] = useState<string>("all")
  const [isExporting, setIsExporting] = useState(false)
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all")
  const { toast } = useToast()

  const isSuperAdmin = currentUser?.role === "SuperAdmin"

  const { data: institutionsData } = useSWR(isSuperAdmin ? "/api/institutions" : null, fetcher)
  const institutions = institutionsData?.institutions || []

  useEffect(() => {
    if (!isSuperAdmin && currentUser?.institutionName) {
      setSelectedInstitution(currentUser.institutionName)
    }
  }, [isSuperAdmin, currentUser?.institutionName])

  const setDatePreset = (preset: string) => {
    const today = new Date()
    const formatDate = (date: Date) => date.toISOString().slice(0, 10)

    switch (preset) {
      case "today":
        setStartDate(formatDate(today))
        setEndDate(formatDate(today))
        setDateRangeType("single")
        break
      case "yesterday":
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        setStartDate(formatDate(yesterday))
        setEndDate(formatDate(yesterday))
        setDateRangeType("single")
        break
      case "this-week":
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        setStartDate(formatDate(weekStart))
        setEndDate(formatDate(today))
        setDateRangeType("range")
        break
      case "last-week":
        const lastWeekEnd = new Date(today)
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1)
        const lastWeekStart = new Date(lastWeekEnd)
        lastWeekStart.setDate(lastWeekEnd.getDate() - 6)
        setStartDate(formatDate(lastWeekStart))
        setEndDate(formatDate(lastWeekEnd))
        setDateRangeType("range")
        break
      case "this-month":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        setStartDate(formatDate(monthStart))
        setEndDate(formatDate(today))
        setDateRangeType("range")
        break
      case "last-month":
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
        setStartDate(formatDate(lastMonthStart))
        setEndDate(formatDate(lastMonthEnd))
        setDateRangeType("range")
        break
    }
  }

  const fetchAttendanceForRange = async () => {
    try {
      const params = new URLSearchParams()

      if (dateRangeType === "single") {
        params.set("date", startDate)
      } else {
        params.set("startDate", startDate)
        params.set("endDate", endDate)
      }

      if (exportPersonType !== "all") params.set("personType", exportPersonType)
      if (exportStatus !== "all") params.set("status", exportStatus)
      if (filters.department && filters.department !== "all") params.set("department", filters.department)
      if (filters.role && filters.role !== "all") params.set("role", filters.role)
      if (filters.shift && filters.shift !== "all") params.set("shift", filters.shift)

      if (isSuperAdmin) {
        // SuperAdmin can export all institutions or specific one
        if (selectedInstitution !== "all") {
          params.set("institutionName", selectedInstitution)
        }
      } else {
        // Non-SuperAdmin can only export their own institution
        if (currentUser?.institutionName) {
          params.set("institutionName", currentUser.institutionName)
        }
      }

      const response = await fetch(`/api/attendance?${params.toString()}`)
      const data = await response.json()
      return data.records || []
    } catch (error) {
      console.error("Error fetching attendance:", error)
      toast({
        title: "Error",
        description: "Failed to fetch attendance data",
        variant: "destructive",
      })
      return []
    }
  }

  const handleExport = async () => {
    if (!isSuperAdmin && !currentUser?.institutionName) {
      toast({
        title: "Error",
        description: "No institution assigned to your account",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    const exportRecords = await fetchAttendanceForRange()

    if (exportRecords.length === 0) {
      toast({
        title: "No data",
        description: "No attendance records found for the selected criteria",
        variant: "destructive",
      })
      setIsExporting(false)
      return
    }

    switch (exportFormat) {
      case "pdf":
        await exportToPDF(exportRecords)
        break
      case "excel":
        exportToExcel(exportRecords)
        break
      case "csv":
        exportToExcel(exportRecords)
        break
    }

    toast({
      title: "Export successful",
      description: `Exported ${exportRecords.length} attendance records`,
    })

    setIsExporting(false)
    setShowExportModal(false)
  }

  const exportToPDF = async (exportRecords: any[]) => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text("Attendance Report", 20, 20)

    doc.setFontSize(12)
    let yPos = 40

    if (isSuperAdmin && selectedInstitution !== "all") {
      doc.text(`Institution: ${selectedInstitution}`, 20, yPos)
      yPos += 10
    } else if (!isSuperAdmin && currentUser?.institutionName) {
      doc.text(`Institution: ${currentUser.institutionName}`, 20, yPos)
      yPos += 10
    } else if (isSuperAdmin && selectedInstitution === "all") {
      doc.text(`Institution: All Institutions`, 20, yPos)
      yPos += 10
    }

    if (dateRangeType === "single") {
      doc.text(`Date: ${startDate}`, 20, yPos)
    } else {
      doc.text(`Date Range: ${startDate} to ${endDate}`, 20, yPos)
    }
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
    if (exportPersonType !== "all") {
      doc.text(`Person Type: ${exportPersonType}`, 20, yPos)
      yPos += 10
    }
    if (exportStatus !== "all") {
      doc.text(`Status: ${exportStatus}`, 20, yPos)
      yPos += 10
    }

    yPos += 10

    const present = exportRecords.filter((r) => r.status === "present").length
    const absent = exportRecords.filter((r) => r.status === "absent").length
    const late = exportRecords.filter((r) => r.status === "late").length
    const total = exportRecords.length
    const presentPercentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0"

    doc.text(
      `Summary: Present: ${present} (${presentPercentage}%), Absent: ${absent}, Late: ${late}, Total: ${total}`,
      20,
      yPos,
    )
    yPos += 20

    doc.setFontSize(10)
    doc.text("Name", 20, yPos)
    doc.text("Code/Roll", 60, yPos)
    doc.text("Type", 90, yPos)
    doc.text("Dept", 110, yPos)
    doc.text("Shift", 140, yPos)
    doc.text("Status", 165, yPos)
    doc.text("Date", 185, yPos)
    yPos += 10

    exportRecords.forEach((record) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.text(record.personName || "Unknown", 20, yPos)
      doc.text(record.employeeCode || record.rollNumber || "N/A", 60, yPos)
      doc.text(record.personType, 90, yPos)
      doc.text(record.department?.substring(0, 8) || "N/A", 110, yPos)
      doc.text(record.shift?.substring(0, 6) || "N/A", 140, yPos)
      doc.text(record.status.toUpperCase(), 165, yPos)
      doc.text(record.date || "N/A", 185, yPos)
      yPos += 8
    })

    const filename =
      dateRangeType === "single" ? `attendance-${startDate}.pdf` : `attendance-${startDate}-to-${endDate}.pdf`
    doc.save(filename)
  }

  const exportToExcel = (exportRecords: any[]) => {
    const headers = [
      "Name",
      "Employee Code/Roll Number",
      "Class Level",
      "Type",
      "Department",
      "Role",
      "Shift",
      "Status",
      "Date",
      "Timestamp",
    ]

    const present = exportRecords.filter((r) => r.status === "present").length
    const absent = exportRecords.filter((r) => r.status === "absent").length
    const late = exportRecords.filter((r) => r.status === "late").length
    const total = exportRecords.length
    const presentPercentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0"

    const institutionRow =
      isSuperAdmin && selectedInstitution !== "all"
        ? ["Institution:", selectedInstitution]
        : !isSuperAdmin && currentUser?.institutionName
          ? ["Institution:", currentUser.institutionName]
          : isSuperAdmin && selectedInstitution === "all"
            ? ["Institution:", "All Institutions"]
            : []

    const summaryRows = [
      ["Attendance Report"],
      ...(institutionRow.length > 0 ? [institutionRow] : []),
      dateRangeType === "single" ? ["Date:", startDate] : ["Date Range:", `${startDate} to ${endDate}`],
      [""],
      ["Summary"],
      ["Present", present, `${presentPercentage}%`],
      ["Absent", absent],
      ["Late", late],
      ["Total", total],
      [""],
    ]

    const csvContent = [
      ...summaryRows.map((row) => row.join(",")),
      headers.join(","),
      ...exportRecords.map((record) =>
        [
          record.personName || "Unknown",
          record.employeeCode || record.rollNumber || "N/A",
          record.classLevel || "N/A",
          record.personType,
          record.department,
          record.role,
          record.shift,
          record.status.toUpperCase(),
          record.date || "N/A",
          record.timestamp ? new Date(record.timestamp).toLocaleString() : "Not marked",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)

    const filename =
      dateRangeType === "single" ? `attendance-${startDate}.csv` : `attendance-${startDate}-to-${endDate}.csv`
    link.setAttribute("download", filename)
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
    <>
      <Button
        variant="outline"
        className="gap-2 bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary"
        onClick={() => setShowExportModal(true)}
      >
        <Download className="h-4 w-4" />
        Export Attendance
      </Button>

      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Attendance Report
            </DialogTitle>
            <DialogDescription>
              Customize your attendance export with date ranges, filters, and format options
              {!isSuperAdmin && currentUser?.institutionName && (
                <span className="block mt-2 text-sm font-medium text-primary">
                  Exporting data for: {currentUser.institutionName}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {isSuperAdmin && (
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Institution
                </Label>
                <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select institution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Institutions</SelectItem>
                    {institutions.map((inst: any) => (
                      <SelectItem key={inst.name} value={inst.name}>
                        {inst.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date Range Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Label>

              {/* Quick Presets */}
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={() => setDatePreset("today")}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDatePreset("yesterday")}>
                  Yesterday
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDatePreset("this-week")}>
                  This Week
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDatePreset("last-week")}>
                  Last Week
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDatePreset("this-month")}>
                  This Month
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDatePreset("last-month")}>
                  Last Month
                </Button>
              </div>

              {/* Date Range Type */}
              <RadioGroup value={dateRangeType} onValueChange={(v) => setDateRangeType(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single" className="font-normal cursor-pointer">
                    Single Date
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="range" id="range" />
                  <Label htmlFor="range" className="font-normal cursor-pointer">
                    Date Range
                  </Label>
                </div>
              </RadioGroup>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{dateRangeType === "single" ? "Date" : "Start Date"}</Label>
                  <input
                    id="startDate"
                    type="date"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                {dateRangeType === "range" && (
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <input
                      id="endDate"
                      type="date"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Label>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="personType">Person Type</Label>
                  <Select value={exportPersonType} onValueChange={setExportPersonType}>
                    <SelectTrigger id="personType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="staff">Staff Only</SelectItem>
                      <SelectItem value="student">Students Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={exportStatus} onValueChange={setExportStatus}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="present">Present Only</SelectItem>
                      <SelectItem value="absent">Absent Only</SelectItem>
                      <SelectItem value="late">Late Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Export Format */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Export Format</Label>
              <RadioGroup value={exportFormat} onValueChange={(v) => setExportFormat(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel" className="font-normal cursor-pointer flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-500" />
                    Excel/CSV (Recommended)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="font-normal cursor-pointer flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    PDF Document
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting} className="gap-2">
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export Report"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

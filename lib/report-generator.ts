
import jsPDF from "jspdf"
import * as XLSX from "xlsx"

// Helper function to group attendance by person
function groupAttendanceByPerson(records: any[]) {
  const personMap = new Map()

  records.forEach((record) => {
    const key = record.personId || record.personName
    if (!personMap.has(key)) {
      personMap.set(key, {
        name: record.personName,
        type: record.personType,
        employeeCode: record.employeeCode || record.rollNumber || "N/A",
        department: record.department || "N/A",
        role: record.role || record.classLevel || "N/A",
        shift: record.shift || "N/A",
        institution: record.institution || "N/A",
        attendance: [],
      })
    }
    personMap.get(key).attendance.push({
      date: record.date,
      status: record.status,
      timestamp: record.timestamp,
    })
  })

  return Array.from(personMap.values())
}

// Helper function to calculate person statistics
function calculatePersonStats(attendance: any[]) {
  const present = attendance.filter((a) => a.status === "present").length
  const absent = attendance.filter((a) => a.status === "absent").length
  const late = attendance.filter((a) => a.status === "late").length
  const total = attendance.length
  const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : "0.0"

  return { present, absent, late, total, attendanceRate }
}

export async function generateQuarterlyPDF(records: any[], stats: any) {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.setTextColor(59, 130, 246)
  doc.text("Quarterly Attendance Report", 105, 20, { align: "center" })

  // Date range
  doc.setFontSize(12)
  doc.setTextColor(100, 116, 139)
  doc.text(
    `Period: ${new Date(stats.dateRange.start).toLocaleDateString()} - ${new Date(stats.dateRange.end).toLocaleDateString()}`,
    105,
    30,
    { align: "center" },
  )

  // Summary statistics
  doc.setFontSize(14)
  doc.setTextColor(30, 41, 59)
  doc.text("Summary Statistics", 20, 45)

  doc.setFontSize(11)
  doc.setTextColor(71, 85, 105)
  let yPos = 55

  const summaryData = [
    ["Total Records:", stats.totalRecords.toString()],
    ["Present:", `${stats.present} (${((stats.present / stats.totalRecords) * 100).toFixed(1)}%)`],
    ["Absent:", `${stats.absent} (${((stats.absent / stats.totalRecords) * 100).toFixed(1)}%)`],
    ["Late:", `${stats.late} (${((stats.late / stats.totalRecords) * 100).toFixed(1)}%)`],
    ["Total Staff:", stats.totalStaff.toString()],
    ["Total Students:", stats.totalStudents.toString()],
  ]

  summaryData.forEach(([label, value]) => {
    doc.text(label, 20, yPos)
    doc.text(value, 100, yPos)
    yPos += 8
  })

  // Department-wise breakdown
  yPos += 10
  doc.setFontSize(14)
  doc.setTextColor(30, 41, 59)
  doc.text("Department-wise Breakdown", 20, yPos)

  const departmentStats: Record<string, any> = {}
  records.forEach((record) => {
    const dept = record.department || "Unknown"
    if (!departmentStats[dept]) {
      departmentStats[dept] = { present: 0, absent: 0, late: 0, total: 0 }
    }
    departmentStats[dept][record.status]++
    departmentStats[dept].total++
  })

  yPos += 10
  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105)

  Object.entries(departmentStats).forEach(([dept, data]: [string, any]) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    doc.text(`${dept}:`, 20, yPos)
    doc.text(`Present: ${data.present}, Absent: ${data.absent}, Late: ${data.late} (Total: ${data.total})`, 60, yPos)
    yPos += 7
  })

  // Person-wise attendance details
  const personData = groupAttendanceByPerson(records)
  const students = personData.filter((p) => p.type === "student")
  const staff = personData.filter((p) => p.type === "staff")

  // Staff Attendance Details
  if (staff.length > 0) {
    doc.addPage()
    yPos = 20
    doc.setFontSize(16)
    doc.setTextColor(59, 130, 246)
    doc.text("Staff Attendance Details", 105, yPos, { align: "center" })
    yPos += 15

    doc.setFontSize(9)
    doc.setTextColor(71, 85, 105)

    staff.forEach((person) => {
      const personStats = calculatePersonStats(person.attendance)

      if (yPos > 260) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(11)
      doc.setTextColor(30, 41, 59)
      doc.text(`${person.name} (${person.employeeCode})`, 20, yPos)
      yPos += 6

      doc.setFontSize(9)
      doc.setTextColor(71, 85, 105)
      doc.text(`Dept: ${person.department} | Role: ${person.role} | Shift: ${person.shift}`, 20, yPos)
      yPos += 5
      doc.text(
        `Present: ${personStats.present} | Absent: ${personStats.absent} | Late: ${personStats.late} | Rate: ${personStats.attendanceRate}%`,
        20,
        yPos,
      )
      yPos += 5

      // Show attendance dates
      const presentDates = person.attendance.filter((a: any) => a.status === "present").map((a: any) => a.date)
      const absentDates = person.attendance.filter((a: any) => a.status === "absent").map((a: any) => a.date)

      if (presentDates.length > 0) {
        doc.text(
          `Present Dates: ${presentDates.slice(0, 10).join(", ")}${presentDates.length > 10 ? "..." : ""}`,
          20,
          yPos,
        )
        yPos += 5
      }
      if (absentDates.length > 0) {
        doc.text(
          `Absent Dates: ${absentDates.slice(0, 10).join(", ")}${absentDates.length > 10 ? "..." : ""}`,
          20,
          yPos,
        )
        yPos += 5
      }

      yPos += 5
    })
  }

  // Student Attendance Details
  if (students.length > 0) {
    doc.addPage()
    yPos = 20
    doc.setFontSize(16)
    doc.setTextColor(59, 130, 246)
    doc.text("Student Attendance Details", 105, yPos, { align: "center" })
    yPos += 15

    doc.setFontSize(9)
    doc.setTextColor(71, 85, 105)

    students.forEach((person) => {
      const personStats = calculatePersonStats(person.attendance)

      if (yPos > 260) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(11)
      doc.setTextColor(30, 41, 59)
      doc.text(`${person.name} (${person.employeeCode})`, 20, yPos)
      yPos += 6

      doc.setFontSize(9)
      doc.setTextColor(71, 85, 105)
      doc.text(`Dept: ${person.department} | Class: ${person.role}`, 20, yPos)
      yPos += 5
      doc.text(
        `Present: ${personStats.present} | Absent: ${personStats.absent} | Late: ${personStats.late} | Rate: ${personStats.attendanceRate}%`,
        20,
        yPos,
      )
      yPos += 5

      // Show attendance dates
      const presentDates = person.attendance.filter((a: any) => a.status === "present").map((a: any) => a.date)
      const absentDates = person.attendance.filter((a: any) => a.status === "absent").map((a: any) => a.date)

      if (presentDates.length > 0) {
        doc.text(
          `Present Dates: ${presentDates.slice(0, 10).join(", ")}${presentDates.length > 10 ? "..." : ""}`,
          20,
          yPos,
        )
        yPos += 5
      }
      if (absentDates.length > 0) {
        doc.text(
          `Absent Dates: ${absentDates.slice(0, 10).join(", ")}${absentDates.length > 10 ? "..." : ""}`,
          20,
          yPos,
        )
        yPos += 5
      }

      yPos += 5
    })
  }

  // Footer
  doc.setFontSize(9)
  doc.setTextColor(148, 163, 184)
  doc.text(`Generated on ${new Date().toLocaleString()} | Face Attendence Attendance System`, 105, 285, { align: "center" })

  return Buffer.from(doc.output("arraybuffer"))
}

export async function generateQuarterlyExcel(records: any[], stats: any) {
  // Create workbook
  const workbook = XLSX.utils.book_new()

  // Summary sheet
  const summaryData = [
    ["Quarterly Attendance Report"],
    [""],
    ["Period", `${stats.dateRange.start} to ${stats.dateRange.end}`],
    ["Generated On", new Date().toLocaleString()],
    [""],
    ["Summary Statistics"],
    ["Total Records", stats.totalRecords],
    ["Present", stats.present, `${((stats.present / stats.totalRecords) * 100).toFixed(1)}%`],
    ["Absent", stats.absent, `${((stats.absent / stats.totalRecords) * 100).toFixed(1)}%`],
    ["Late", stats.late, `${((stats.late / stats.totalRecords) * 100).toFixed(1)}%`],
    [""],
    ["Total Staff", stats.totalStaff],
    ["Total Students", stats.totalStudents],
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")

  // Detailed records sheet
  const detailedData = records.map((record) => ({
    Date: record.date,
    Name: record.personName,
    Type: record.personType,
    "Employee Code / Roll Number": record.employeeCode || record.rollNumber || "N/A",
    Department: record.department || "N/A",
    Role: record.role || record.classLevel || "N/A",
    Shift: record.shift || "N/A",
    Status: record.status,
    Timestamp: record.timestamp,
  }))

  const detailedSheet = XLSX.utils.json_to_sheet(detailedData)
  XLSX.utils.book_append_sheet(workbook, detailedSheet, "Detailed Records")

  // Department-wise sheet
  const departmentStats: Record<string, any> = {}
  records.forEach((record) => {
    const dept = record.department || "Unknown"
    if (!departmentStats[dept]) {
      departmentStats[dept] = { present: 0, absent: 0, late: 0, total: 0 }
    }
    departmentStats[dept][record.status]++
    departmentStats[dept].total++
  })

  const departmentData = Object.entries(departmentStats).map(([dept, data]: [string, any]) => ({
    Department: dept,
    Present: data.present,
    Absent: data.absent,
    Late: data.late,
    Total: data.total,
    "Attendance Rate": `${((data.present / data.total) * 100).toFixed(1)}%`,
  }))

  const departmentSheet = XLSX.utils.json_to_sheet(departmentData)
  XLSX.utils.book_append_sheet(workbook, departmentSheet, "Department Breakdown")

  // Person-wise attendance details
  const personData = groupAttendanceByPerson(records)
  const students = personData.filter((p) => p.type === "student")
  const staff = personData.filter((p) => p.type === "staff")

  // Staff Attendance Details sheet
  if (staff.length > 0) {
    const staffDetailData = staff.map((person) => {
      const personStats = calculatePersonStats(person.attendance)
      const presentDates = person.attendance
        .filter((a: any) => a.status === "present")
        .map((a: any) => a.date)
        .join(", ")
      const absentDates = person.attendance
        .filter((a: any) => a.status === "absent")
        .map((a: any) => a.date)
        .join(", ")
      const lateDates = person.attendance
        .filter((a: any) => a.status === "late")
        .map((a: any) => a.date)
        .join(", ")

      return {
        Name: person.name,
        "Employee Code": person.employeeCode,
        Department: person.department,
        Role: person.role,
        Shift: person.shift,
        Institution: person.institution,
        "Total Days": personStats.total,
        "Present Days": personStats.present,
        "Absent Days": personStats.absent,
        "Late Days": personStats.late,
        "Attendance Rate": `${personStats.attendanceRate}%`,
        "Present Dates": presentDates || "None",
        "Absent Dates": absentDates || "None",
        "Late Dates": lateDates || "None",
      }
    })

    const staffSheet = XLSX.utils.json_to_sheet(staffDetailData)
    XLSX.utils.book_append_sheet(workbook, staffSheet, "Staff Details")
  }

  // Student Attendance Details sheet
  if (students.length > 0) {
    const studentDetailData = students.map((person) => {
      const personStats = calculatePersonStats(person.attendance)
      const presentDates = person.attendance
        .filter((a: any) => a.status === "present")
        .map((a: any) => a.date)
        .join(", ")
      const absentDates = person.attendance
        .filter((a: any) => a.status === "absent")
        .map((a: any) => a.date)
        .join(", ")
      const lateDates = person.attendance
        .filter((a: any) => a.status === "late")
        .map((a: any) => a.date)
        .join(", ")

      return {
        Name: person.name,
        "Roll Number": person.employeeCode,
        Department: person.department,
        Class: person.role,
        Institution: person.institution,
        "Total Days": personStats.total,
        "Present Days": personStats.present,
        "Absent Days": personStats.absent,
        "Late Days": personStats.late,
        "Attendance Rate": `${personStats.attendanceRate}%`,
        "Present Dates": presentDates || "None",
        "Absent Dates": absentDates || "None",
        "Late Dates": lateDates || "None",
      }
    })

    const studentSheet = XLSX.utils.json_to_sheet(studentDetailData)
    XLSX.utils.book_append_sheet(workbook, studentSheet, "Student Details")
  }

  // Convert to buffer
  const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
  return excelBuffer
}

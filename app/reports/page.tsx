
// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Calendar, Filter, TrendingUp, Users, GraduationCap, Clock, BarChart3 } from "lucide-react"
// import { getStoredUser, hasMinimumRole, User } from "@/lib/auth"
// import { useRouter } from "next/navigation"

// export default function ReportsPage() {
//   const [user, setUser] = useState<User | null>(null)
//   type ReportData = {
//     summary: any
//     attendance: any[]
//     staff: any[]
//     students: any[]
//     totalCounts: {
//       present?: number
//       absent?: number
//       late?: number
//       totalPeople?: number
//       [key: string]: any
//     }
//   } | null

//   const [reportData, setReportData] = useState<ReportData>(null)
//   const [loading, setLoading] = useState(true)
//   const [filters, setFilters] = useState({
//     department: "all",
//     role: "all",
//     shift: "all",
//     personType: "all",
//     dateRange: "today",
//   })
//   const router = useRouter()

//   useEffect(() => {
//     const storedUser = getStoredUser()
//     setUser(storedUser)

//     if (!storedUser || !hasMinimumRole("Manager")) {
//       router.push("/")
//     } else {
//       fetchReportData()
//     }
//   }, [router])

//   const fetchReportData = async () => {
//     try {
//       setLoading(true)
//       const u = getStoredUser()
//       const inst = u?.role !== "SuperAdmin" ? u?.institutionName : undefined
//       const q = inst ? `?institutionName=${encodeURIComponent(inst)}` : ""
//       const [summaryRes, attendanceRes, staffRes, studentsRes] = await Promise.all([
//         fetch(`/api/reports/summary${q}`),
//         fetch(`/api/attendance${q}`),
//         fetch(`/api/staff${q}`),
//         fetch(`/api/students${q}`),
//       ])

//       const [summary, attendance, staff, students] = await Promise.all([
//         summaryRes.json(),
//         attendanceRes.json(),
//         staffRes.json(),
//         studentsRes.json(),
//       ])

//       setReportData({
//         summary,
//         attendance: attendance.records || [],
//         staff: staff.items || [],
//         students: students.items || [],
//         totalCounts: attendance.totalCounts || {},
//       })
//     } catch (error) {
//       console.error("Failed to fetch report data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleExport = async (type: "staff" | "students" | "attendance", format: "excel" | "word" | "pdf") => {
//     try {
//       let data = []
//       let endpoint = ""

//       switch (type) {
//         case "staff":
//           data = reportData?.staff || []
//           endpoint = "/api/export/staff"
//           break
//         case "students":
//           data = reportData?.students || []
//           endpoint = "/api/export/students"
//           break
//         case "attendance":
//           data = reportData?.attendance || []
//           endpoint = "/api/export/attendance"
//           break
//       }

//       const response = await fetch(`${endpoint}?format=${format}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ data }),
//       })

//       if (response.ok) {
//         if (format === "pdf") {
//           const result = await response.json()
//           console.log("LaTeX content:", result.latex)
//           alert("LaTeX content generated. Check console for details.")
//         } else {
//           const blob = await response.blob()
//           const url = window.URL.createObjectURL(blob)
//           const a = document.createElement("a")
//           a.href = url
//           a.download = `${type}_export.${format === "excel" ? "xlsx" : "docx"}`
//           document.body.appendChild(a)
//           a.click()
//           window.URL.revokeObjectURL(url)
//           document.body.removeChild(a)
//         }
//       }
//     } catch (error) {
//       console.error("Export failed:", error)
//     }
//   }

//   if (!user || !hasMinimumRole("Manager")) {
//     return null
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading reports...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           {user?.institutionName && (
//             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded mb-1">
//               {user.institutionName}
//             </div>
//           )}
//           <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
//           <p className="text-sm text-gray-600">Comprehensive attendance and management reports</p>
//         </div>
//         <div className="flex gap-2">
//           <Select onValueChange={(value) => handleExport("staff", value as any)}>
//             <SelectTrigger className="w-40">
//               <SelectValue placeholder="Export Staff" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="excel">Excel Format</SelectItem>
//               <SelectItem value="word">Word Format</SelectItem>
//               <SelectItem value="pdf">PDF Format</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select onValueChange={(value) => handleExport("students", value as any)}>
//             <SelectTrigger className="w-40">
//               <SelectValue placeholder="Export Students" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="excel">Excel Format</SelectItem>
//               <SelectItem value="word">Word Format</SelectItem>
//               <SelectItem value="pdf">PDF Format</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </header>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
//               <BarChart3 className="h-4 w-4" />
//               Total People
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-600">
//               {(reportData?.staff?.length || 0) + (reportData?.students?.length || 0)}
//             </div>
//             <p className="text-xs text-gray-500 mt-1">
//               {reportData?.staff?.length || 0} Staff • {reportData?.students?.length || 0} Students
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
//               <Users className="h-4 w-4" />
//               Present Today
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">{reportData?.totalCounts?.present || 0}</div>
//             <p className="text-xs text-gray-500 mt-1">
//               {reportData?.totalCounts?.totalPeople
//                 ? Math.round(((reportData.totalCounts.present ?? 0) / (reportData.totalCounts.totalPeople ?? 1)) * 100)
//                 : 0}
//               % attendance rate
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
//               <Clock className="h-4 w-4" />
//               Late Arrivals
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-amber-600">{reportData?.totalCounts?.late || 0}</div>
//             <p className="text-xs text-gray-500 mt-1">Today's late arrivals</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
//               <GraduationCap className="h-4 w-4" />
//               Absent Today
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-red-600">{reportData?.totalCounts?.absent || 0}</div>
//             <p className="text-xs text-gray-500 mt-1">Absent members</p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Filter className="h-5 w-5" />
//               Report Filters
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-2 block">Department</label>
//                 <Select
//                   value={filters.department}
//                   onValueChange={(value) => setFilters({ ...filters, department: value })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Departments" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Departments</SelectItem>
//                     <SelectItem value="Engineering">Engineering</SelectItem>
//                     <SelectItem value="HR">HR</SelectItem>
//                     <SelectItem value="Finance">Finance</SelectItem>
//                     <SelectItem value="Operations">Operations</SelectItem>
//                     <SelectItem value="Academics">Academics</SelectItem>
//                     <SelectItem value="Administration">Administration</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-2 block">Person Type</label>
//                 <Select
//                   value={filters.personType}
//                   onValueChange={(value) => setFilters({ ...filters, personType: value })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Types" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Types</SelectItem>
//                     <SelectItem value="staff">Staff Only</SelectItem>
//                     <SelectItem value="student">Students Only</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-2 block">Role</label>
//                 <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Roles" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Roles</SelectItem>
//                     <SelectItem value="Admin">Admin</SelectItem>
//                     <SelectItem value="Manager">Manager</SelectItem>
//                     <SelectItem value="Staff">Staff</SelectItem>
//                     <SelectItem value="Teacher">Teacher</SelectItem>
//                     <SelectItem value="Student">Student</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-2 block">Shift</label>
//                 <Select value={filters.shift} onValueChange={(value) => setFilters({ ...filters, shift: value })}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Shifts" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Shifts</SelectItem>
//                     <SelectItem value="Morning">Morning</SelectItem>
//                     <SelectItem value="Afternoon">Afternoon</SelectItem>
//                     <SelectItem value="Evening">Evening</SelectItem>
//                     <SelectItem value="Night">Night</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
//               <div className="flex gap-2">
//                 <Button variant="outline" className="flex-1 bg-transparent">
//                   <Calendar className="mr-2 h-4 w-4" />
//                   Start Date
//                 </Button>
//                 <Button variant="outline" className="flex-1 bg-transparent">
//                   <Calendar className="mr-2 h-4 w-4" />
//                   End Date
//                 </Button>
//               </div>
//             </div>

//             <Button className="w-full" onClick={fetchReportData}>
//               Generate Report
//             </Button>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5" />
//               Quick Insights
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {reportData?.summary?.byDepartment && (
//               <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
//                 <h4 className="font-medium text-teal-800">Best Performing Department</h4>
//                 <p className="text-sm text-teal-600 mt-1">
//                   {reportData.summary.byDepartment.sort(
//                     (a: { present: number; absent: any }, b: { present: number; absent: any }) => b.present / (b.present + b.absent) - a.present / (a.present + a.absent),
//                   )[0]?.name || "N/A"}{" "}
//                   -
//                   {reportData.summary.byDepartment.length > 0
//                     ? Math.round(
//                         (reportData.summary.byDepartment[0].present /
//                           (reportData.summary.byDepartment[0].present + reportData.summary.byDepartment[0].absent)) *
//                           100,
//                       )
//                     : 0}
//                   % attendance
//                 </p>
//               </div>
//             )}

//             <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
//               <h4 className="font-medium text-blue-800">Staff vs Students</h4>
//               <p className="text-sm text-blue-600 mt-1">
//                 {reportData?.staff?.length || 0} staff members, {reportData?.students?.length || 0} students enrolled
//               </p>
//             </div>

//             <div className="p-3 bg-green-50 rounded-lg border border-green-200">
//               <h4 className="font-medium text-green-800">Today's Summary</h4>
//               <p className="text-sm text-green-600 mt-1">
//                 {reportData?.totalCounts?.present || 0} present, {reportData?.totalCounts?.absent || 0} absent,{" "}
//                 {reportData?.totalCounts?.late || 0} late
//               </p>
//             </div>

//             {reportData?.summary?.last7Days && (
//               <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
//                 <h4 className="font-medium text-purple-800">7-Day Trend</h4>
//                 <p className="text-sm text-purple-600 mt-1">
//                   Average attendance:{" "}
//                   {Math.round(
//                     (reportData.summary.last7Days.reduce(
//                       (acc: number, day: { present: number; absent: any }) => acc + day.present / (day.present + day.absent || 1),
//                       0,
//                     ) /
//                       reportData.summary.last7Days.length) *
//                       100,
//                   )}
//                   % over last week
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, TrendingUp, Users, GraduationCap, Clock, BarChart3 } from "lucide-react"
import { getStoredUser, hasMinimumRole } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { ExportAttendance } from "@/components/export-attendance"

export default function ReportsPage() {
  const [user, setUser] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    department: "all",
    role: "all",
    shift: "all",
    personType: "all",
    status: "all",
    date: new Date().toISOString().slice(0, 10),
  })
  const router = useRouter()

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)

    if (!storedUser || !hasMinimumRole("Manager")) {
      router.push("/")
    } else {
      fetchReportData()
    }
  }, [router])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const u = getStoredUser()
      const inst = u?.role !== "SuperAdmin" ? u?.institutionName : undefined

      const params = new URLSearchParams()
      if (inst) params.set("institutionName", inst)
      if (filters.department !== "all") params.set("department", filters.department)
      if (filters.role !== "all") params.set("role", filters.role)
      if (filters.shift !== "all") params.set("shift", filters.shift)
      if (filters.status !== "all") params.set("status", filters.status)
      if (filters.personType !== "all") params.set("personType", filters.personType)
      if (filters.date) params.set("date", filters.date)

      const summaryQ = inst ? `?institutionName=${encodeURIComponent(inst)}` : ""

      const [summaryRes, attendanceRes, staffRes, studentsRes] = await Promise.all([
        fetch(`/api/reports/summary${summaryQ}`),
        fetch(`/api/attendance?${params.toString()}`),
        fetch(`/api/staff${inst ? `?institutionName=${encodeURIComponent(inst)}` : ""}`),
        fetch(`/api/students${inst ? `?institutionName=${encodeURIComponent(inst)}` : ""}`),
      ])

      const [summary, attendance, staff, students] = await Promise.all([
        summaryRes.json(),
        attendanceRes.json(),
        staffRes.json(),
        studentsRes.json(),
      ])

      setReportData({
        summary,
        attendance: attendance.records || [],
        staff: staff.items || [],
        students: students.items || [],
        totalCounts: attendance.totalCounts || {},
      })
    } catch (error) {
      console.error("Failed to fetch report data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type: "staff" | "students" | "attendance", format: "excel" | "word") => {
    try {
      let data = []
      let endpoint = ""

      switch (type) {
        case "staff":
          data = reportData?.staff || []
          endpoint = "/api/export/staff"
          break
        case "students":
          data = reportData?.students || []
          endpoint = "/api/export/students"
          break
        case "attendance":
          data = reportData?.attendance || []
          endpoint = "/api/export/attendance"
          break
      }

      const response = await fetch(`${endpoint}?format=${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${type}_export.${format === "excel" ? "xlsx" : "docx"}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  if (!user || !hasMinimumRole("Manager")) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {user?.institutionName && (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded mb-1">
              {user.institutionName}
            </div>
          )}
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-600">Comprehensive attendance and management reports</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <ExportAttendance
            records={reportData?.attendance || []}
            filters={{
              department: filters.department,
              role: filters.role,
              shift: filters.shift,
              status: filters.status,
              date: filters.date,
            }}
          />
          <Select onValueChange={(value) => handleExport("staff", value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Export Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel Format</SelectItem>
              <SelectItem value="word">Word Format</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleExport("students", value as any)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Export Students" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel Format</SelectItem>
              <SelectItem value="word">Word Format</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Total People
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(reportData?.staff?.length || 0) + (reportData?.students?.length || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {reportData?.staff?.length || 0} Staff • {reportData?.students?.length || 0} Students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Present Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reportData?.totalCounts?.present || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              {reportData?.totalCounts?.totalPeople
                ? Math.round((reportData.totalCounts.present / reportData.totalCounts.totalPeople) * 100)
                : 0}
              % attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Late Arrivals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{reportData?.totalCounts?.late || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Today's late arrivals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Absent Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{reportData?.totalCounts?.absent || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Absent members</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Department</label>
                <Select
                  value={filters.department}
                  onValueChange={(value) => setFilters({ ...filters, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Academics">Academics</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Person Type</label>
                <Select
                  value={filters.personType}
                  onValueChange={(value) => setFilters({ ...filters, personType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="staff">Staff Only</SelectItem>
                    <SelectItem value="student">Students Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Role</label>
                <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Shift</label>
                <Select value={filters.shift} onValueChange={(value) => setFilters({ ...filters, shift: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Shifts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Shifts</SelectItem>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  className="w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() =>
                  setFilters({
                    department: "all",
                    role: "all",
                    shift: "all",
                    personType: "all",
                    status: "all",
                    date: new Date().toISOString().slice(0, 10),
                  })
                }
              >
                Reset Filters
              </Button>
              <Button className="flex-1" onClick={fetchReportData}>
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reportData?.summary?.byDepartment && (
              <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                <h4 className="font-medium text-teal-800">Best Performing Department</h4>
                <p className="text-sm text-teal-600 mt-1">
                  {reportData.summary.byDepartment.sort(
                    (a, b) => b.present / (b.present + b.absent) - a.present / (a.present + a.absent),
                  )[0]?.name || "N/A"}{" "}
                  -
                  {reportData.summary.byDepartment.length > 0
                    ? Math.round(
                        (reportData.summary.byDepartment[0].present /
                          (reportData.summary.byDepartment[0].present + reportData.summary.byDepartment[0].absent)) *
                          100,
                      )
                    : 0}
                  % attendance
                </p>
              </div>
            )}

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800">Staff vs Students</h4>
              <p className="text-sm text-blue-600 mt-1">
                {reportData?.staff?.length || 0} staff members, {reportData?.students?.length || 0} students enrolled
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800">Today's Summary</h4>
              <p className="text-sm text-green-600 mt-1">
                {reportData?.totalCounts?.present || 0} present, {reportData?.totalCounts?.absent || 0} absent,{" "}
                {reportData?.totalCounts?.late || 0} late
              </p>
            </div>

            {reportData?.summary?.last7Days && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-800">7-Day Trend</h4>
                <p className="text-sm text-purple-600 mt-1">
                  Average attendance:{" "}
                  {Math.round(
                    (reportData.summary.last7Days.reduce(
                      (acc, day) => acc + day.present / (day.present + day.absent || 1),
                      0,
                    ) /
                      reportData.summary.last7Days.length) *
                      100,
                  )}
                  % over last week
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



// // // "use client"

// // // import { useEffect, useState } from "react"
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // // import { Button } from "@/components/ui/button"
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // // import { Calendar, Filter, TrendingUp, Users, GraduationCap, Clock, BarChart3 } from "lucide-react"
// // // import { getStoredUser, hasMinimumRole, User } from "@/lib/auth"
// // // import { useRouter } from "next/navigation"

// // // export default function ReportsPage() {
// // //   const [user, setUser] = useState<User | null>(null)
// // //   type ReportData = {
// // //     summary: any
// // //     attendance: any[]
// // //     staff: any[]
// // //     students: any[]
// // //     totalCounts: {
// // //       present?: number
// // //       absent?: number
// // //       late?: number
// // //       totalPeople?: number
// // //       [key: string]: any
// // //     }
// // //   } | null

// // //   const [reportData, setReportData] = useState<ReportData>(null)
// // //   const [loading, setLoading] = useState(true)
// // //   const [filters, setFilters] = useState({
// // //     department: "all",
// // //     role: "all",
// // //     shift: "all",
// // //     personType: "all",
// // //     dateRange: "today",
// // //   })
// // //   const router = useRouter()

// // //   useEffect(() => {
// // //     const storedUser = getStoredUser()
// // //     setUser(storedUser)

// // //     if (!storedUser || !hasMinimumRole("Manager")) {
// // //       router.push("/")
// // //     } else {
// // //       fetchReportData()
// // //     }
// // //   }, [router])

// // //   const fetchReportData = async () => {
// // //     try {
// // //       setLoading(true)
// // //       const u = getStoredUser()
// // //       const inst = u?.role !== "SuperAdmin" ? u?.institutionName : undefined
// // //       const q = inst ? `?institutionName=${encodeURIComponent(inst)}` : ""
// // //       const [summaryRes, attendanceRes, staffRes, studentsRes] = await Promise.all([
// // //         fetch(`/api/reports/summary${q}`),
// // //         fetch(`/api/attendance${q}`),
// // //         fetch(`/api/staff${q}`),
// // //         fetch(`/api/students${q}`),
// // //       ])

// // //       const [summary, attendance, staff, students] = await Promise.all([
// // //         summaryRes.json(),
// // //         attendanceRes.json(),
// // //         staffRes.json(),
// // //         studentsRes.json(),
// // //       ])

// // //       setReportData({
// // //         summary,
// // //         attendance: attendance.records || [],
// // //         staff: staff.items || [],
// // //         students: students.items || [],
// // //         totalCounts: attendance.totalCounts || {},
// // //       })
// // //     } catch (error) {
// // //       console.error("Failed to fetch report data:", error)
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   const handleExport = async (type: "staff" | "students" | "attendance", format: "excel" | "word" | "pdf") => {
// // //     try {
// // //       let data = []
// // //       let endpoint = ""

// // //       switch (type) {
// // //         case "staff":
// // //           data = reportData?.staff || []
// // //           endpoint = "/api/export/staff"
// // //           break
// // //         case "students":
// // //           data = reportData?.students || []
// // //           endpoint = "/api/export/students"
// // //           break
// // //         case "attendance":
// // //           data = reportData?.attendance || []
// // //           endpoint = "/api/export/attendance"
// // //           break
// // //       }

// // //       const response = await fetch(`${endpoint}?format=${format}`, {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ data }),
// // //       })

// // //       if (response.ok) {
// // //         if (format === "pdf") {
// // //           const result = await response.json()
// // //           console.log("LaTeX content:", result.latex)
// // //           alert("LaTeX content generated. Check console for details.")
// // //         } else {
// // //           const blob = await response.blob()
// // //           const url = window.URL.createObjectURL(blob)
// // //           const a = document.createElement("a")
// // //           a.href = url
// // //           a.download = `${type}_export.${format === "excel" ? "xlsx" : "docx"}`
// // //           document.body.appendChild(a)
// // //           a.click()
// // //           window.URL.revokeObjectURL(url)
// // //           document.body.removeChild(a)
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.error("Export failed:", error)
// // //     }
// // //   }

// // //   if (!user || !hasMinimumRole("Manager")) {
// // //     return null
// // //   }

// // //   if (loading) {
// // //     return (
// // //       <div className="flex items-center justify-center min-h-screen">
// // //         <div className="text-center">
// // //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
// // //           <p className="text-gray-600">Loading reports...</p>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div className="space-y-6">
// // //       <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //         <div>
// // //           {user?.institutionName && (
// // //             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded mb-1">
// // //               {user.institutionName}
// // //             </div>
// // //           )}
// // //           <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
// // //           <p className="text-sm text-gray-600">Comprehensive attendance and management reports</p>
// // //         </div>
// // //         <div className="flex gap-2">
// // //           <Select onValueChange={(value) => handleExport("staff", value as any)}>
// // //             <SelectTrigger className="w-40">
// // //               <SelectValue placeholder="Export Staff" />
// // //             </SelectTrigger>
// // //             <SelectContent>
// // //               <SelectItem value="excel">Excel Format</SelectItem>
// // //               <SelectItem value="word">Word Format</SelectItem>
// // //               <SelectItem value="pdf">PDF Format</SelectItem>
// // //             </SelectContent>
// // //           </Select>
// // //           <Select onValueChange={(value) => handleExport("students", value as any)}>
// // //             <SelectTrigger className="w-40">
// // //               <SelectValue placeholder="Export Students" />
// // //             </SelectTrigger>
// // //             <SelectContent>
// // //               <SelectItem value="excel">Excel Format</SelectItem>
// // //               <SelectItem value="word">Word Format</SelectItem>
// // //               <SelectItem value="pdf">PDF Format</SelectItem>
// // //             </SelectContent>
// // //           </Select>
// // //         </div>
// // //       </header>

// // //       <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
// // //         <Card>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
// // //               <BarChart3 className="h-4 w-4" />
// // //               Total People
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-bold text-blue-600">
// // //               {(reportData?.staff?.length || 0) + (reportData?.students?.length || 0)}
// // //             </div>
// // //             <p className="text-xs text-gray-500 mt-1">
// // //               {reportData?.staff?.length || 0} Staff • {reportData?.students?.length || 0} Students
// // //             </p>
// // //           </CardContent>
// // //         </Card>

// // //         <Card>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
// // //               <Users className="h-4 w-4" />
// // //               Present Today
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-bold text-green-600">{reportData?.totalCounts?.present || 0}</div>
// // //             <p className="text-xs text-gray-500 mt-1">
// // //               {reportData?.totalCounts?.totalPeople
// // //                 ? Math.round(((reportData.totalCounts.present ?? 0) / (reportData.totalCounts.totalPeople ?? 1)) * 100)
// // //                 : 0}
// // //               % attendance rate
// // //             </p>
// // //           </CardContent>
// // //         </Card>

// // //         <Card>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
// // //               <Clock className="h-4 w-4" />
// // //               Late Arrivals
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-bold text-amber-600">{reportData?.totalCounts?.late || 0}</div>
// // //             <p className="text-xs text-gray-500 mt-1">Today's late arrivals</p>
// // //           </CardContent>
// // //         </Card>

// // //         <Card>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
// // //               <GraduationCap className="h-4 w-4" />
// // //               Absent Today
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-bold text-red-600">{reportData?.totalCounts?.absent || 0}</div>
// // //             <p className="text-xs text-gray-500 mt-1">Absent members</p>
// // //           </CardContent>
// // //         </Card>
// // //       </div>

// // //       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="flex items-center gap-2">
// // //               <Filter className="h-5 w-5" />
// // //               Report Filters
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent className="space-y-4">
// // //             <div className="grid grid-cols-2 gap-4">
// // //               <div>
// // //                 <label className="text-sm font-medium text-gray-700 mb-2 block">Department</label>
// // //                 <Select
// // //                   value={filters.department}
// // //                   onValueChange={(value) => setFilters({ ...filters, department: value })}
// // //                 >
// // //                   <SelectTrigger>
// // //                     <SelectValue placeholder="All Departments" />
// // //                   </SelectTrigger>
// // //                   <SelectContent>
// // //                     <SelectItem value="all">All Departments</SelectItem>
// // //                     <SelectItem value="Engineering">Engineering</SelectItem>
// // //                     <SelectItem value="HR">HR</SelectItem>
// // //                     <SelectItem value="Finance">Finance</SelectItem>
// // //                     <SelectItem value="Operations">Operations</SelectItem>
// // //                     <SelectItem value="Academics">Academics</SelectItem>
// // //                     <SelectItem value="Administration">Administration</SelectItem>
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>

// // //               <div>
// // //                 <label className="text-sm font-medium text-gray-700 mb-2 block">Person Type</label>
// // //                 <Select
// // //                   value={filters.personType}
// // //                   onValueChange={(value) => setFilters({ ...filters, personType: value })}
// // //                 >
// // //                   <SelectTrigger>
// // //                     <SelectValue placeholder="All Types" />
// // //                   </SelectTrigger>
// // //                   <SelectContent>
// // //                     <SelectItem value="all">All Types</SelectItem>
// // //                     <SelectItem value="staff">Staff Only</SelectItem>
// // //                     <SelectItem value="student">Students Only</SelectItem>
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>
// // //             </div>

// // //             <div className="grid grid-cols-2 gap-4">
// // //               <div>
// // //                 <label className="text-sm font-medium text-gray-700 mb-2 block">Role</label>
// // //                 <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
// // //                   <SelectTrigger>
// // //                     <SelectValue placeholder="All Roles" />
// // //                   </SelectTrigger>
// // //                   <SelectContent>
// // //                     <SelectItem value="all">All Roles</SelectItem>
// // //                     <SelectItem value="Admin">Admin</SelectItem>
// // //                     <SelectItem value="Manager">Manager</SelectItem>
// // //                     <SelectItem value="Staff">Staff</SelectItem>
// // //                     <SelectItem value="Teacher">Teacher</SelectItem>
// // //                     <SelectItem value="Student">Student</SelectItem>
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>

// // //               <div>
// // //                 <label className="text-sm font-medium text-gray-700 mb-2 block">Shift</label>
// // //                 <Select value={filters.shift} onValueChange={(value) => setFilters({ ...filters, shift: value })}>
// // //                   <SelectTrigger>
// // //                     <SelectValue placeholder="All Shifts" />
// // //                   </SelectTrigger>
// // //                   <SelectContent>
// // //                     <SelectItem value="all">All Shifts</SelectItem>
// // //                     <SelectItem value="Morning">Morning</SelectItem>
// // //                     <SelectItem value="Afternoon">Afternoon</SelectItem>
// // //                     <SelectItem value="Evening">Evening</SelectItem>
// // //                     <SelectItem value="Night">Night</SelectItem>
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>
// // //             </div>

// // //             <div>
// // //               <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
// // //               <div className="flex gap-2">
// // //                 <Button variant="outline" className="flex-1 bg-transparent">
// // //                   <Calendar className="mr-2 h-4 w-4" />
// // //                   Start Date
// // //                 </Button>
// // //                 <Button variant="outline" className="flex-1 bg-transparent">
// // //                   <Calendar className="mr-2 h-4 w-4" />
// // //                   End Date
// // //                 </Button>
// // //               </div>
// // //             </div>

// // //             <Button className="w-full" onClick={fetchReportData}>
// // //               Generate Report
// // //             </Button>
// // //           </CardContent>
// // //         </Card>

// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="flex items-center gap-2">
// // //               <TrendingUp className="h-5 w-5" />
// // //               Quick Insights
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent className="space-y-4">
// // //             {reportData?.summary?.byDepartment && (
// // //               <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
// // //                 <h4 className="font-medium text-teal-800">Best Performing Department</h4>
// // //                 <p className="text-sm text-teal-600 mt-1">
// // //                   {reportData.summary.byDepartment.sort(
// // //                     (a: { present: number; absent: any }, b: { present: number; absent: any }) => b.present / (b.present + b.absent) - a.present / (a.present + a.absent),
// // //                   )[0]?.name || "N/A"}{" "}
// // //                   -
// // //                   {reportData.summary.byDepartment.length > 0
// // //                     ? Math.round(
// // //                         (reportData.summary.byDepartment[0].present /
// // //                           (reportData.summary.byDepartment[0].present + reportData.summary.byDepartment[0].absent)) *
// // //                           100,
// // //                       )
// // //                     : 0}
// // //                   % attendance
// // //                 </p>
// // //               </div>
// // //             )}

// // //             <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
// // //               <h4 className="font-medium text-blue-800">Staff vs Students</h4>
// // //               <p className="text-sm text-blue-600 mt-1">
// // //                 {reportData?.staff?.length || 0} staff members, {reportData?.students?.length || 0} students enrolled
// // //               </p>
// // //             </div>

// // //             <div className="p-3 bg-green-50 rounded-lg border border-green-200">
// // //               <h4 className="font-medium text-green-800">Today's Summary</h4>
// // //               <p className="text-sm text-green-600 mt-1">
// // //                 {reportData?.totalCounts?.present || 0} present, {reportData?.totalCounts?.absent || 0} absent,{" "}
// // //                 {reportData?.totalCounts?.late || 0} late
// // //               </p>
// // //             </div>

// // //             {reportData?.summary?.last7Days && (
// // //               <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
// // //                 <h4 className="font-medium text-purple-800">7-Day Trend</h4>
// // //                 <p className="text-sm text-purple-600 mt-1">
// // //                   Average attendance:{" "}
// // //                   {Math.round(
// // //                     (reportData.summary.last7Days.reduce(
// // //                       (acc: number, day: { present: number; absent: any }) => acc + day.present / (day.present + day.absent || 1),
// // //                       0,
// // //                     ) /
// // //                       reportData.summary.last7Days.length) *
// // //                       100,
// // //                   )}
// // //                   % over last week
// // //                 </p>
// // //               </div>
// // //             )}
// // //           </CardContent>
// // //         </Card>
// // //       </div>
// // //     </div>
// // //   )
// // // }


// // "use client"

// // import { useEffect, useState } from "react"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { Filter, TrendingUp, Users, GraduationCap, Clock, BarChart3 } from "lucide-react"
// // import { getStoredUser, hasMinimumRole } from "@/lib/auth"
// // import { useRouter } from "next/navigation"
// // import { ExportAttendance } from "@/components/export-attendance"

// // export default function ReportsPage() {
// //   const [user, setUser] = useState(null)
// //   const [reportData, setReportData] = useState(null)
// //   const [loading, setLoading] = useState(true)
// //   const [filters, setFilters] = useState({
// //     department: "all",
// //     role: "all",
// //     shift: "all",
// //     personType: "all",
// //     status: "all",
// //     date: new Date().toISOString().slice(0, 10),
// //   })
// //   const router = useRouter()

// //   useEffect(() => {
// //     const storedUser = getStoredUser()
// //     setUser(storedUser)

// //     if (!storedUser || !hasMinimumRole("Manager")) {
// //       router.push("/")
// //     } else {
// //       fetchReportData()
// //     }
// //   }, [router])

// //   const fetchReportData = async () => {
// //     try {
// //       setLoading(true)
// //       const u = getStoredUser()
// //       const inst = u?.role !== "SuperAdmin" ? u?.institutionName : undefined

// //       const params = new URLSearchParams()
// //       if (inst) params.set("institutionName", inst)
// //       if (filters.department !== "all") params.set("department", filters.department)
// //       if (filters.role !== "all") params.set("role", filters.role)
// //       if (filters.shift !== "all") params.set("shift", filters.shift)
// //       if (filters.status !== "all") params.set("status", filters.status)
// //       if (filters.personType !== "all") params.set("personType", filters.personType)
// //       if (filters.date) params.set("date", filters.date)

// //       const summaryQ = inst ? `?institutionName=${encodeURIComponent(inst)}` : ""

// //       const [summaryRes, attendanceRes, staffRes, studentsRes] = await Promise.all([
// //         fetch(`/api/reports/summary${summaryQ}`),
// //         fetch(`/api/attendance?${params.toString()}`),
// //         fetch(`/api/staff${inst ? `?institutionName=${encodeURIComponent(inst)}` : ""}`),
// //         fetch(`/api/students${inst ? `?institutionName=${encodeURIComponent(inst)}` : ""}`),
// //       ])

// //       const [summary, attendance, staff, students] = await Promise.all([
// //         summaryRes.json(),
// //         attendanceRes.json(),
// //         staffRes.json(),
// //         studentsRes.json(),
// //       ])

// //       setReportData({
// //         summary,
// //         attendance: attendance.records || [],
// //         staff: staff.items || [],
// //         students: students.items || [],
// //         totalCounts: attendance.totalCounts || {},
// //       })
// //     } catch (error) {
// //       console.error("Failed to fetch report data:", error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handleExport = async (type: "staff" | "students" | "attendance", format: "excel" | "word") => {
// //     try {
// //       let data = []
// //       let endpoint = ""

// //       switch (type) {
// //         case "staff":
// //           data = reportData?.staff || []
// //           endpoint = "/api/export/staff"
// //           break
// //         case "students":
// //           data = reportData?.students || []
// //           endpoint = "/api/export/students"
// //           break
// //         case "attendance":
// //           data = reportData?.attendance || []
// //           endpoint = "/api/export/attendance"
// //           break
// //       }

// //       const response = await fetch(`${endpoint}?format=${format}`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ data }),
// //       })

// //       if (response.ok) {
// //         const blob = await response.blob()
// //         const url = window.URL.createObjectURL(blob)
// //         const a = document.createElement("a")
// //         a.href = url
// //         a.download = `${type}_export.${format === "excel" ? "xlsx" : "docx"}`
// //         document.body.appendChild(a)
// //         a.click()
// //         window.URL.revokeObjectURL(url)
// //         document.body.removeChild(a)
// //       }
// //     } catch (error) {
// //       console.error("Export failed:", error)
// //     }
// //   }

// //   if (!user || !hasMinimumRole("Manager")) {
// //     return null
// //   }

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
// //           <p className="text-gray-600">Loading reports...</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //         <div>
// //           {user?.institutionName && (
// //             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded mb-1">
// //               {user.institutionName}
// //             </div>
// //           )}
// //           <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
// //           <p className="text-sm text-gray-600">Comprehensive attendance and management reports</p>
// //         </div>
// //         <div className="flex gap-2 flex-wrap justify-end">
// //           <ExportAttendance
// //             records={reportData?.attendance || []}
// //             filters={{
// //               department: filters.department,
// //               role: filters.role,
// //               shift: filters.shift,
// //               status: filters.status,
// //               date: filters.date,
// //             }}
// //           />
// //           <Select onValueChange={(value) => handleExport("staff", value as any)}>
// //             <SelectTrigger className="w-40">
// //               <SelectValue placeholder="Export Staff" />
// //             </SelectTrigger>
// //             <SelectContent>
// //               <SelectItem value="excel">Excel Format</SelectItem>
// //               <SelectItem value="word">Word Format</SelectItem>
// //             </SelectContent>
// //           </Select>
// //           <Select onValueChange={(value) => handleExport("students", value as any)}>
// //             <SelectTrigger className="w-44">
// //               <SelectValue placeholder="Export Students" />
// //             </SelectTrigger>
// //             <SelectContent>
// //               <SelectItem value="excel">Excel Format</SelectItem>
// //               <SelectItem value="word">Word Format</SelectItem>
// //             </SelectContent>
// //           </Select>
// //         </div>
// //       </header>

// //       <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
// //         <Card>
// //           <CardHeader className="pb-2">
// //             <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
// //               <BarChart3 className="h-4 w-4" />
// //               Total People
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-blue-600">
// //               {(reportData?.staff?.length || 0) + (reportData?.students?.length || 0)}
// //             </div>
// //             <p className="text-xs text-gray-500 mt-1">
// //               {reportData?.staff?.length || 0} Staff • {reportData?.students?.length || 0} Students
// //             </p>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader className="pb-2">
// //             <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
// //               <Users className="h-4 w-4" />
// //               Present Today
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-green-600">{reportData?.totalCounts?.present || 0}</div>
// //             <p className="text-xs text-gray-500 mt-1">
// //               {reportData?.totalCounts?.totalPeople
// //                 ? Math.round((reportData.totalCounts.present / reportData.totalCounts.totalPeople) * 100)
// //                 : 0}
// //               % attendance rate
// //             </p>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader className="pb-2">
// //             <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
// //               <Clock className="h-4 w-4" />
// //               Late Arrivals
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-amber-600">{reportData?.totalCounts?.late || 0}</div>
// //             <p className="text-xs text-gray-500 mt-1">Today's late arrivals</p>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader className="pb-2">
// //             <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
// //               <GraduationCap className="h-4 w-4" />
// //               Absent Today
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-red-600">{reportData?.totalCounts?.absent || 0}</div>
// //             <p className="text-xs text-gray-500 mt-1">Absent members</p>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <Filter className="h-5 w-5" />
// //               Report Filters
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-4">
// //             <div className="grid grid-cols-2 gap-4">
// //               <div>
// //                 <label className="text-sm font-medium text-gray-700 mb-2 block">Department</label>
// //                 <Select
// //                   value={filters.department}
// //                   onValueChange={(value) => setFilters({ ...filters, department: value })}
// //                 >
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="All Departments" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="all">All Departments</SelectItem>
// //                     <SelectItem value="Engineering">Engineering</SelectItem>
// //                     <SelectItem value="HR">HR</SelectItem>
// //                     <SelectItem value="Finance">Finance</SelectItem>
// //                     <SelectItem value="Operations">Operations</SelectItem>
// //                     <SelectItem value="Academics">Academics</SelectItem>
// //                     <SelectItem value="Administration">Administration</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>

// //               <div>
// //                 <label className="text-sm font-medium text-gray-700 mb-2 block">Person Type</label>
// //                 <Select
// //                   value={filters.personType}
// //                   onValueChange={(value) => setFilters({ ...filters, personType: value })}
// //                 >
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="All Types" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="all">All Types</SelectItem>
// //                     <SelectItem value="staff">Staff Only</SelectItem>
// //                     <SelectItem value="student">Students Only</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-2 gap-4">
// //               <div>
// //                 <label className="text-sm font-medium text-gray-700 mb-2 block">Role</label>
// //                 <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="All Roles" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="all">All Roles</SelectItem>
// //                     <SelectItem value="Admin">Admin</SelectItem>
// //                     <SelectItem value="Manager">Manager</SelectItem>
// //                     <SelectItem value="Staff">Staff</SelectItem>
// //                     <SelectItem value="Teacher">Teacher</SelectItem>
// //                     <SelectItem value="Student">Student</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>

// //               <div>
// //                 <label className="text-sm font-medium text-gray-700 mb-2 block">Shift</label>
// //                 <Select value={filters.shift} onValueChange={(value) => setFilters({ ...filters, shift: value })}>
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="All Shifts" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="all">All Shifts</SelectItem>
// //                     <SelectItem value="Morning">Morning</SelectItem>
// //                     <SelectItem value="Afternoon">Afternoon</SelectItem>
// //                     <SelectItem value="Evening">Evening</SelectItem>
// //                     <SelectItem value="Night">Night</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-2 gap-4">
// //               <div>
// //                 <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
// //                 <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
// //                   <SelectTrigger>
// //                     <SelectValue placeholder="All Statuses" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="all">All Statuses</SelectItem>
// //                     <SelectItem value="present">Present</SelectItem>
// //                     <SelectItem value="absent">Absent</SelectItem>
// //                     <SelectItem value="late">Late</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>

// //               <div>
// //                 <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
// //                 <input
// //                   type="date"
// //                   value={filters.date}
// //                   onChange={(e) => setFilters({ ...filters, date: e.target.value })}
// //                   className="w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
// //                 />
// //               </div>
// //             </div>

// //             <div className="flex gap-2">
// //               <Button
// //                 variant="outline"
// //                 className="flex-1 bg-transparent"
// //                 onClick={() =>
// //                   setFilters({
// //                     department: "all",
// //                     role: "all",
// //                     shift: "all",
// //                     personType: "all",
// //                     status: "all",
// //                     date: new Date().toISOString().slice(0, 10),
// //                   })
// //                 }
// //               >
// //                 Reset Filters
// //               </Button>
// //               <Button className="flex-1" onClick={fetchReportData}>
// //                 Apply Filters
// //               </Button>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <TrendingUp className="h-5 w-5" />
// //               Quick Insights
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-4">
// //             {reportData?.summary?.byDepartment && (
// //               <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
// //                 <h4 className="font-medium text-teal-800">Best Performing Department</h4>
// //                 <p className="text-sm text-teal-600 mt-1">
// //                   {reportData.summary.byDepartment.sort(
// //                     (a, b) => b.present / (b.present + b.absent) - a.present / (a.present + a.absent),
// //                   )[0]?.name || "N/A"}{" "}
// //                   -
// //                   {reportData.summary.byDepartment.length > 0
// //                     ? Math.round(
// //                         (reportData.summary.byDepartment[0].present /
// //                           (reportData.summary.byDepartment[0].present + reportData.summary.byDepartment[0].absent)) *
// //                           100,
// //                       )
// //                     : 0}
// //                   % attendance
// //                 </p>
// //               </div>
// //             )}

// //             <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
// //               <h4 className="font-medium text-blue-800">Staff vs Students</h4>
// //               <p className="text-sm text-blue-600 mt-1">
// //                 {reportData?.staff?.length || 0} staff members, {reportData?.students?.length || 0} students enrolled
// //               </p>
// //             </div>

// //             <div className="p-3 bg-green-50 rounded-lg border border-green-200">
// //               <h4 className="font-medium text-green-800">Today's Summary</h4>
// //               <p className="text-sm text-green-600 mt-1">
// //                 {reportData?.totalCounts?.present || 0} present, {reportData?.totalCounts?.absent || 0} absent,{" "}
// //                 {reportData?.totalCounts?.late || 0} late
// //               </p>
// //             </div>

// //             {reportData?.summary?.last7Days && (
// //               <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
// //                 <h4 className="font-medium text-purple-800">7-Day Trend</h4>
// //                 <p className="text-sm text-purple-600 mt-1">
// //                   Average attendance:{" "}
// //                   {Math.round(
// //                     (reportData.summary.last7Days.reduce(
// //                       (acc, day) => acc + day.present / (day.present + day.absent || 1),
// //                       0,
// //                     ) /
// //                       reportData.summary.last7Days.length) *
// //                       100,
// //                   )}
// //                   % over last week
// //                 </p>
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   )
// // }





// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Filter, TrendingUp, Users, GraduationCap, Clock, BarChart3 } from "lucide-react"
// import { getStoredUser, hasMinimumRole } from "@/lib/auth"
// import { useRouter } from "next/navigation"
// import { ExportAttendance } from "@/components/export-attendance"

// export default function ReportsPage() {
//   const [user, setUser] = useState(null)
//   const [reportData, setReportData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [filters, setFilters] = useState({
//     department: "all",
//     role: "all",
//     shift: "all",
//     personType: "all",
//     status: "all",
//     date: new Date().toISOString().slice(0, 10),
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

//       const params = new URLSearchParams()
//       if (inst) params.set("institutionName", inst)
//       if (filters.department !== "all") params.set("department", filters.department)
//       if (filters.role !== "all") params.set("role", filters.role)
//       if (filters.shift !== "all") params.set("shift", filters.shift)
//       if (filters.status !== "all") params.set("status", filters.status)
//       if (filters.personType !== "all") params.set("personType", filters.personType)
//       if (filters.date) params.set("date", filters.date)

//       const summaryQ = inst ? `?institutionName=${encodeURIComponent(inst)}` : ""

//       const [summaryRes, attendanceRes, staffRes, studentsRes] = await Promise.all([
//         fetch(`/api/reports/summary${summaryQ}`),
//         fetch(`/api/attendance?${params.toString()}`),
//         fetch(`/api/staff${inst ? `?institutionName=${encodeURIComponent(inst)}` : ""}`),
//         fetch(`/api/students${inst ? `?institutionName=${encodeURIComponent(inst)}` : ""}`),
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

//   const handleExport = async (type: "staff" | "students" | "attendance", format: "excel" | "word") => {
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
//         const blob = await response.blob()
//         const url = window.URL.createObjectURL(blob)
//         const a = document.createElement("a")
//         a.href = url
//         a.download = `${type}_export.${format === "excel" ? "xlsx" : "docx"}`
//         document.body.appendChild(a)
//         a.click()
//         window.URL.revokeObjectURL(url)
//         document.body.removeChild(a)
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
//           <p className="text-muted-foreground">Loading reports...</p>
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
//           <h1 className="text-2xl font-semibold text-foreground">Reports & Analytics</h1>
//           <p className="text-sm text-muted-foreground">Comprehensive attendance and management reports</p>
//         </div>
//         <div className="flex gap-2 flex-wrap justify-end">
//           <ExportAttendance
//             records={reportData?.attendance || []}
//             filters={{
//               department: filters.department,
//               role: filters.role,
//               shift: filters.shift,
//               status: filters.status,
//               date: filters.date,
//             }}
//           />
//           <Select onValueChange={(value) => handleExport("staff", value as any)}>
//             <SelectTrigger className="w-40">
//               <SelectValue placeholder="Export Staff" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="excel">Excel Format</SelectItem>
//               <SelectItem value="word">Word Format</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select onValueChange={(value) => handleExport("students", value as any)}>
//             <SelectTrigger className="w-44">
//               <SelectValue placeholder="Export Students" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="excel">Excel Format</SelectItem>
//               <SelectItem value="word">Word Format</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </header>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//               <BarChart3 className="h-4 w-4" />
//               Total People
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-600">
//               {(reportData?.staff?.length || 0) + (reportData?.students?.length || 0)}
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">
//               {reportData?.staff?.length || 0} Staff • {reportData?.students?.length || 0} Students
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//               <Users className="h-4 w-4" />
//               Present Today
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">{reportData?.totalCounts?.present || 0}</div>
//             <p className="text-xs text-muted-foreground mt-1">
//               {reportData?.totalCounts?.totalPeople
//                 ? Math.round((reportData.totalCounts.present / reportData.totalCounts.totalPeople) * 100)
//                 : 0}
//               % attendance rate
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//               <Clock className="h-4 w-4" />
//               Late Arrivals
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-amber-600">{reportData?.totalCounts?.late || 0}</div>
//             <p className="text-xs text-muted-foreground mt-1">Today's late arrivals</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//               <GraduationCap className="h-4 w-4" />
//               Absent Today
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-red-600">{reportData?.totalCounts?.absent || 0}</div>
//             <p className="text-xs text-muted-foreground mt-1">Absent members</p>
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
//                 <label className="text-sm font-medium text-foreground mb-2 block">Department</label>
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
//                 <label className="text-sm font-medium text-foreground mb-2 block">Person Type</label>
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
//                 <label className="text-sm font-medium text-foreground mb-2 block">Role</label>
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
//                 <label className="text-sm font-medium text-foreground mb-2 block">Shift</label>
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

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
//                 <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Statuses" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Statuses</SelectItem>
//                     <SelectItem value="present">Present</SelectItem>
//                     <SelectItem value="absent">Absent</SelectItem>
//                     <SelectItem value="late">Late</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
//                 <input
//                   type="date"
//                   value={filters.date}
//                   onChange={(e) => setFilters({ ...filters, date: e.target.value })}
//                   className="w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 className="flex-1 bg-transparent"
//                 onClick={() =>
//                   setFilters({
//                     department: "all",
//                     role: "all",
//                     shift: "all",
//                     personType: "all",
//                     status: "all",
//                     date: new Date().toISOString().slice(0, 10),
//                   })
//                 }
//               >
//                 Reset Filters
//               </Button>
//               <Button className="flex-1" onClick={fetchReportData}>
//                 Apply Filters
//               </Button>
//             </div>
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
//                     (a, b) => b.present / (b.present + b.absent) - a.present / (a.present + a.absent),
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
//                       (acc, day) => acc + day.present / (day.present + day.absent || 1),
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
import {
  Filter,
  TrendingUp,
  Users,
  GraduationCap,
  Clock,
  BarChart3,
  Download,
  Calendar,
  FileSpreadsheet,
  FileText,
  FileDown,
  Loader2,
  X,
} from "lucide-react"
import { getStoredUser, hasMinimumRole } from "@/lib/auth"
import { useRouter } from "next/navigation"

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
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 7 days ago
    endDate: new Date().toISOString().slice(0, 10), // today
  })
  const [exportOptions, setExportOptions] = useState({
    format: "excel" as "excel" | "pdf" | "csv",
    includeCharts: true,
    includeSummary: true,
  })
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportType, setExportType] = useState<"staff" | "students">("staff")
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

  const handleExportWithRange = async () => {
    try {
      setLoading(true)

      // Fetch fresh data for the selected date range
      const u = getStoredUser()
      const inst = u?.role !== "SuperAdmin" ? u?.institutionName : undefined

      const params = new URLSearchParams()
      if (inst) params.set("institutionName", inst)
      if (filters.department !== "all") params.set("department", filters.department)
      if (filters.role !== "all") params.set("role", filters.role)
      if (filters.shift !== "all") params.set("shift", filters.shift)
      if (filters.status !== "all") params.set("status", filters.status)
      if (filters.personType !== "all") params.set("personType", filters.personType)

      // Add date range to params
      params.set("startDate", filters.startDate)
      params.set("endDate", filters.endDate)

      let endpoint = ""
      let data: any = {}

      // Fetch data based on export type
      switch (exportType) {
        case "staff":
          const staffRes = await fetch(`/api/staff${inst ? `?institutionName=${encodeURIComponent(inst)}` : ""}`)
          const staffData = await staffRes.json()
          data = staffData.items || []
          endpoint = "/api/export/staff"
          break

        case "students":
          const studentsRes = await fetch(`/api/students${inst ? `?institutionName=${encodeURIComponent(inst)}` : ""}`)
          const studentsData = await studentsRes.json()
          data = studentsData.items || []
          endpoint = "/api/export/students"
          break
      }

      // Check if we have data to export
      const hasData = Array.isArray(data) && data.length > 0

      if (!hasData) {
        alert("No data available for the selected date range and filters. Please adjust your selection.")
        setLoading(false)
        return
      }

      const response = await fetch(`${endpoint}?format=${exportOptions.format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          dateRange: {
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
          filters: {
            department: filters.department,
            role: filters.role,
            shift: filters.shift,
            status: filters.status,
            personType: filters.personType,
            institutionName: inst, // Added institutionName to filters
          },
          options: exportOptions,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.error && errorData.suggestion) {
          alert(`${errorData.error}\n\n${errorData.suggestion}`)
        } else {
          alert("Export failed. Please try again.")
        }
        setLoading(false)
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const extension = exportOptions.format === "excel" ? "xlsx" : exportOptions.format === "pdf" ? "pdf" : "csv"
      a.download = `${exportType}_report_${filters.startDate}_to_${filters.endDate}.${extension}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setShowExportModal(false)
    } catch (error) {
      console.error("[v0] Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setLoading(false)
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
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {user?.institutionName && (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 px-2 py-1 rounded mb-1">
              {user.institutionName}
            </div>
          )}
          <h1 className="text-2xl font-semibold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Comprehensive attendance and management reports</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Button
            onClick={() => {
              setExportType("staff")
              setShowExportModal(true)
            }}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Total People
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(reportData?.staff?.length || 0) + (reportData?.students?.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {reportData?.staff?.length || 0} Staff • {reportData?.students?.length || 0} Students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Present Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reportData?.totalCounts?.present || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {reportData?.totalCounts?.totalPeople
                ? Math.round((reportData.totalCounts.present / reportData.totalCounts.totalPeople) * 100)
                : 0}
              % attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Late Arrivals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{reportData?.totalCounts?.late || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Today's late arrivals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Absent Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{reportData?.totalCounts?.absent || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Absent members</p>
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
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range Selection
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1 block">From Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full rounded-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1 block">To Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full rounded-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const today = new Date().toISOString().slice(0, 10)
                    setFilters({ ...filters, startDate: today, endDate: today })
                  }}
                  className="text-xs"
                >
                  Today
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const endDate = new Date().toISOString().slice(0, 10)
                    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
                    setFilters({ ...filters, startDate, endDate })
                  }}
                  className="text-xs"
                >
                  Last 7 Days
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const endDate = new Date().toISOString().slice(0, 10)
                    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
                    setFilters({ ...filters, startDate, endDate })
                  }}
                  className="text-xs"
                >
                  Last 30 Days
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Department</label>
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
                <label className="text-sm font-medium text-foreground mb-2 block">Person Type</label>
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
                <label className="text-sm font-medium text-foreground mb-2 block">Role</label>
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
                <label className="text-sm font-medium text-foreground mb-2 block">Shift</label>
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
                <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
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
                <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
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
                    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                    endDate: new Date().toISOString().slice(0, 10),
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

      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileDown className="h-5 w-5" />
                  Export Report
                </span>
                <Button variant="ghost" size="sm" onClick={() => setShowExportModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Export Type Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Report Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "staff", label: "Staff Report", icon: Users },
                    { value: "students", label: "Students Report", icon: GraduationCap },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setExportType(type.value as any)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        exportType === type.value
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800"
                      }`}
                    >
                      <type.icon className="h-5 w-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                      <p className="text-xs font-medium text-foreground">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "excel", label: "Excel", icon: FileSpreadsheet },
                    { value: "pdf", label: "PDF", icon: FileText },
                    { value: "csv", label: "CSV", icon: FileDown },
                  ].map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setExportOptions({ ...exportOptions, format: format.value as any })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        exportOptions.format === format.value
                          ? "border-green-600 bg-green-50 dark:bg-green-950"
                          : "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-800"
                      }`}
                    >
                      <format.icon className="h-5 w-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
                      <p className="text-xs font-medium text-foreground">{format.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range Display */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Selected Date Range
                </h4>
                <p className="text-sm text-muted-foreground">
                  From <span className="font-medium text-foreground">{filters.startDate}</span> to{" "}
                  <span className="font-medium text-foreground">{filters.endDate}</span>
                </p>
              </div>

              {/* Export Options */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground block">Include in Export</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeSummary}
                      onChange={(e) => setExportOptions({ ...exportOptions, includeSummary: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-sm text-foreground">Summary Statistics</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeCharts}
                      onChange={(e) => setExportOptions({ ...exportOptions, includeCharts: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-sm text-foreground">Visual Charts & Graphs</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={() => setShowExportModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleExportWithRange} className="flex-1 gap-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// // // // // "use client"

// // // // // import { useEffect, useState } from "react"
// // // // // import { useRouter } from "next/navigation"
// // // // // import useSWR from "swr"
// // // // // import { getStoredUser } from "@/lib/auth"
// // // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // // // // import { Calendar, Clock, TrendingUp, User, CheckCircle, XCircle, AlertCircle } from "lucide-react"
// // // // // import { Alert, AlertDescription } from "@/components/ui/alert"
// // // // // import type { AttendanceRecord } from "@/lib/types"

// // // // // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // // // // export default function StudentAttendancePage() {
// // // // //   const [user, setUser] = useState(null)
// // // // //   const router = useRouter()


// // // // //   useEffect(() => {
// // // // //   // Disable right-click
// // // // //   const handleContextMenu = (e: MouseEvent) => {
// // // // //     e.preventDefault();
// // // // //     alert('Right-click is disabled for security reasons.');
// // // // //   };

// // // // //   // Disable common developer tools shortcuts
// // // // //   const handleKeyDown = (e: KeyboardEvent) => {
// // // // //     // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, F12
// // // // //     if (
// // // // //       (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
// // // // //       e.key === 'F12'
// // // // //     ) {
// // // // //       e.preventDefault();
// // // // //       alert('Developer tools are disabled for this application.');
// // // // //     }
// // // // //   };

// // // // //   // Add event listeners
// // // // //   document.addEventListener('contextmenu', handleContextMenu);
// // // // //   document.addEventListener('keydown', handleKeyDown);

// // // // //   // Cleanup event listeners on component unmount
// // // // //   return () => {
// // // // //     document.removeEventListener('contextmenu', handleContextMenu);
// // // // //     document.removeEventListener('keydown', handleKeyDown);
// // // // //   };
// // // // // }, []);

// // // // //   useEffect(() => {
// // // // //     const storedUser = getStoredUser()
// // // // //     if (!storedUser) {
// // // // //       router.push("/login")
// // // // //       return
// // // // //     }
// // // // //     if (storedUser.role !== "Student") {
// // // // //       router.push("/")
// // // // //       return
// // // // //     }
// // // // //     setUser(storedUser as any)
// // // // //   }, [router])

// // // // //   const { data: attendanceData, error } = useSWR(user ? `/api/students/${(user as any).id}/attendance` : null, fetcher)

// // // // //   if (!user) {
// // // // //     return <div>Loading...</div>
// // // // //   }

// // // // //   if (error) {
// // // // //     return (
// // // // //       <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
// // // // //         <Alert className="border-red-200 bg-red-50">
// // // // //           <AlertCircle className="h-4 w-4 text-red-600" />
// // // // //           <AlertDescription className="text-red-800">
// // // // //             Failed to load attendance data. Please try again later.
// // // // //           </AlertDescription>
// // // // //         </Alert>
// // // // //       </div>
// // // // //     )
// // // // //   }

// // // // //   const records = attendanceData?.records || []
// // // // //   const stats = attendanceData?.stats || {
// // // // //     totalDays: 0,
// // // // //     presentDays: 0,
// // // // //     absentDays: 0,
// // // // //     lateDays: 0,
// // // // //     attendancePercentage: 0,
// // // // //   }

// // // // //   const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })

// // // // //   return (
// // // // //     <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8">
// // // // //       <header className="p-6 bg-card rounded-xl border shadow-sm">
// // // // //         <div className="space-y-2">
// // // // //           <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
// // // // //             My Attendance
// // // // //           </h1>
// // // // //           <p className="text-muted-foreground leading-relaxed">
// // // // //             Welcome {(user as any).name}! Here's your attendance overview for {currentMonth}.
// // // // //           </p>
// // // // //         </div>
// // // // //       </header>

// // // // //       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
// // // // //         <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
// // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // //             <CardTitle className="text-sm font-semibold text-blue-700">Attendance Rate</CardTitle>
// // // // //             <TrendingUp className="h-5 w-5 text-blue-600" />
// // // // //           </CardHeader>
// // // // //           <CardContent>
// // // // //             <div className="text-3xl font-bold text-blue-700">{stats.attendancePercentage}%</div>
// // // // //             <p className="text-xs text-blue-600 mt-1">This month</p>
// // // // //           </CardContent>
// // // // //         </Card>

// // // // //         <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm">
// // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // //             <CardTitle className="text-sm font-semibold text-green-700">Present Days</CardTitle>
// // // // //             <CheckCircle className="h-5 w-5 text-green-600" />
// // // // //           </CardHeader>
// // // // //           <CardContent>
// // // // //             <div className="text-3xl font-bold text-green-700">{stats.presentDays}</div>
// // // // //             <p className="text-xs text-green-600 mt-1">Out of {stats.totalDays} days</p>
// // // // //           </CardContent>
// // // // //         </Card>

// // // // //         <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-sm">
// // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // //             <CardTitle className="text-sm font-semibold text-red-700">Absent Days</CardTitle>
// // // // //             <XCircle className="h-5 w-5 text-red-600" />
// // // // //           </CardHeader>
// // // // //           <CardContent>
// // // // //             <div className="text-3xl font-bold text-red-700">{stats.absentDays}</div>
// // // // //             <p className="text-xs text-red-600 mt-1">This month</p>
// // // // //           </CardContent>
// // // // //         </Card>

// // // // //         <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm">
// // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // //             <CardTitle className="text-sm font-semibold text-amber-700">Late Days</CardTitle>
// // // // //             <Clock className="h-5 w-5 text-amber-600" />
// // // // //           </CardHeader>
// // // // //           <CardContent>
// // // // //             <div className="text-3xl font-bold text-amber-700">{stats.lateDays}</div>
// // // // //             <p className="text-xs text-amber-600 mt-1">This month</p>
// // // // //           </CardContent>
// // // // //         </Card>
// // // // //       </div>

// // // // //       <Card className="shadow-sm border-0 overflow-hidden">
// // // // //         <CardHeader>
// // // // //           <CardTitle className="flex items-center gap-2">
// // // // //             <Calendar className="h-5 w-5" />
// // // // //             Attendance History
// // // // //           </CardTitle>
// // // // //         </CardHeader>
// // // // //         <CardContent>
// // // // //           <div className="overflow-x-auto">
// // // // //             <table className="min-w-full">
// // // // //               <thead className="bg-gradient-to-r from-muted/50 to-muted/30">
// // // // //                 <tr>
// // // // //                   <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
// // // // //                   <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
// // // // //                   <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Time</th>
// // // // //                   <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Shift</th>
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody className="divide-y divide-border/50">
// // // // //                 {records.map((record: AttendanceRecord & { shift?: string }) => (
// // // // //                   <tr key={record.id} className="hover:bg-muted/30 transition-colors">
// // // // //                     <td className="px-6 py-4">
// // // // //                       <div className="text-sm font-medium text-foreground">
// // // // //                         {new Date(record.date).toLocaleDateString("en-US", {
// // // // //                           weekday: "short",
// // // // //                           year: "numeric",
// // // // //                           month: "short",
// // // // //                           day: "numeric",
// // // // //                         })}
// // // // //                       </div>
// // // // //                     </td>
// // // // //                     <td className="px-6 py-4">
// // // // //                       <div
// // // // //                         className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
// // // // //                           record.status === "present"
// // // // //                             ? "bg-green-100 text-green-800 border border-green-200"
// // // // //                             : record.status === "absent"
// // // // //                               ? "bg-red-100 text-red-800 border border-red-200"
// // // // //                               : "bg-amber-100 text-amber-800 border border-amber-200"
// // // // //                         }`}
// // // // //                       >
// // // // //                         {record.status === "present" && <CheckCircle className="h-4 w-4" />}
// // // // //                         {record.status === "absent" && <XCircle className="h-4 w-4" />}
// // // // //                         {record.status === "late" && <Clock className="h-4 w-4" />}
// // // // //                         {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
// // // // //                       </div>
// // // // //                     </td>
// // // // //                     <td className="px-6 py-4">
// // // // //                       <div className="text-sm text-muted-foreground">
// // // // //                         {record.timestamp
// // // // //                           ? new Date(record.timestamp).toLocaleTimeString("en-US", {
// // // // //                               hour: "2-digit",
// // // // //                               minute: "2-digit",
// // // // //                             })
// // // // //                           : "N/A"}
// // // // //                       </div>
// // // // //                     </td>
// // // // //                     <td className="px-6 py-4">
// // // // //                       <div className="text-sm text-muted-foreground capitalize">{record.shift || "N/A"}</div>
// // // // //                     </td>
// // // // //                   </tr>
// // // // //                 ))}
// // // // //                 {records.length === 0 && (
// // // // //                   <tr>
// // // // //                     <td className="px-6 py-12 text-center text-muted-foreground" colSpan={4}>
// // // // //                       <div className="flex flex-col items-center gap-2">
// // // // //                         <User className="h-8 w-8 text-muted-foreground/50" />
// // // // //                         <span>No attendance records found.</span>
// // // // //                       </div>
// // // // //                     </td>
// // // // //                   </tr>
// // // // //                 )}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           </div>
// // // // //         </CardContent>
// // // // //       </Card>
// // // // //     </div>
// // // // //   )
// // // // // }



// // // // "use client"

// // // // import { useEffect, useState } from "react"
// // // // import { useRouter } from "next/navigation"
// // // // import useSWR from "swr"
// // // // import { getStoredUser } from "@/lib/auth"
// // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // // // import { Calendar, Clock, TrendingUp, User, CheckCircle, XCircle, AlertCircle } from "lucide-react"
// // // // import { Alert, AlertDescription } from "@/components/ui/alert"
// // // // import type { AttendanceRecord } from "@/lib/types"
// // // // import StudentDashboardWidgets from "@/components/student-dashboard-widgets"

// // // // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // // // export default function StudentAttendancePage() {
// // // //   const [user, setUser] = useState(null)
// // // //   const router = useRouter()

// // // //   useEffect(() => {
// // // //     const storedUser = getStoredUser()
// // // //     if (!storedUser) {
// // // //       router.push("/login")
// // // //       return
// // // //     }
// // // //     if (storedUser.role !== "Student") {
// // // //       router.push("/")
// // // //       return
// // // //     }
// // // //     setUser(storedUser)
// // // //   }, [router])

// // // //   const { data: attendanceData, error } = useSWR(user ? `/api/students/${user.id}/attendance` : null, fetcher)

// // // //   if (!user) {
// // // //     return <div>Loading...</div>
// // // //   }

// // // //   if (error) {
// // // //     return (
// // // //       <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
// // // //         <Alert className="border-red-200 bg-red-50">
// // // //           <AlertCircle className="h-4 w-4 text-red-600" />
// // // //           <AlertDescription className="text-red-800">
// // // //             Failed to load attendance data. Please try again later.
// // // //           </AlertDescription>
// // // //         </Alert>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   const records = attendanceData?.records || []
// // // //   const stats = attendanceData?.stats || {
// // // //     totalDays: 0,
// // // //     presentDays: 0,
// // // //     absentDays: 0,
// // // //     lateDays: 0,
// // // //     attendancePercentage: 0,
// // // //   }

// // // //   const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })

// // // //   return (
// // // //     <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8">
// // // //       <header className="p-6 bg-card rounded-xl border shadow-sm">
// // // //         <div className="space-y-2">
// // // //           <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
// // // //             My Attendance
// // // //           </h1>
// // // //           <p className="text-muted-foreground leading-relaxed">
// // // //             Welcome {user.name}! Here's your attendance overview for {currentMonth}.
// // // //           </p>
// // // //         </div>
// // // //       </header>

// // // //       <StudentDashboardWidgets studentId={user.id} />

// // // //       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
// // // //         <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
// // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // //             <CardTitle className="text-sm font-semibold text-blue-700">Attendance Rate</CardTitle>
// // // //             <TrendingUp className="h-5 w-5 text-blue-600" />
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-3xl font-bold text-blue-700">{stats.attendancePercentage}%</div>
// // // //             <p className="text-xs text-blue-600 mt-1">This month</p>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm">
// // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // //             <CardTitle className="text-sm font-semibold text-green-700">Present Days</CardTitle>
// // // //             <CheckCircle className="h-5 w-5 text-green-600" />
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-3xl font-bold text-green-700">{stats.presentDays}</div>
// // // //             <p className="text-xs text-green-600 mt-1">Out of {stats.totalDays} days</p>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-sm">
// // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // //             <CardTitle className="text-sm font-semibold text-red-700">Absent Days</CardTitle>
// // // //             <XCircle className="h-5 w-5 text-red-600" />
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-3xl font-bold text-red-700">{stats.absentDays}</div>
// // // //             <p className="text-xs text-red-600 mt-1">This month</p>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm">
// // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // //             <CardTitle className="text-sm font-semibold text-amber-700">Late Days</CardTitle>
// // // //             <Clock className="h-5 w-5 text-amber-600" />
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-3xl font-bold text-amber-700">{stats.lateDays}</div>
// // // //             <p className="text-xs text-amber-600 mt-1">This month</p>
// // // //           </CardContent>
// // // //         </Card>
// // // //       </div>

// // // //       <Card className="shadow-sm border-0 overflow-hidden">
// // // //         <CardHeader>
// // // //           <CardTitle className="flex items-center gap-2">
// // // //             <Calendar className="h-5 w-5" />
// // // //             Attendance History
// // // //           </CardTitle>
// // // //         </CardHeader>
// // // //         <CardContent>
// // // //           <div className="overflow-x-auto">
// // // //             <table className="min-w-full">
// // // //               <thead className="bg-gradient-to-r from-muted/50 to-muted/30">
// // // //                 <tr>
// // // //                   <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
// // // //                   <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
// // // //                   <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Time</th>
// // // //                   <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Shift</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody className="divide-y divide-border/50">
// // // //                 {records.map((record: AttendanceRecord & { shift?: string }) => (
// // // //                   <tr key={record.id} className="hover:bg-muted/30 transition-colors">
// // // //                     <td className="px-6 py-4">
// // // //                       <div className="text-sm font-medium text-foreground">
// // // //                         {new Date(record.date).toLocaleDateString("en-US", {
// // // //                           weekday: "short",
// // // //                           year: "numeric",
// // // //                           month: "short",
// // // //                           day: "numeric",
// // // //                         })}
// // // //                       </div>
// // // //                     </td>
// // // //                     <td className="px-6 py-4">
// // // //                       <div
// // // //                         className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
// // // //                           record.status === "present"
// // // //                             ? "bg-green-100 text-green-800 border border-green-200"
// // // //                             : record.status === "absent"
// // // //                               ? "bg-red-100 text-red-800 border border-red-200"
// // // //                               : "bg-amber-100 text-amber-800 border border-amber-200"
// // // //                         }`}
// // // //                       >
// // // //                         {record.status === "present" && <CheckCircle className="h-4 w-4" />}
// // // //                         {record.status === "absent" && <XCircle className="h-4 w-4" />}
// // // //                         {record.status === "late" && <Clock className="h-4 w-4" />}
// // // //                         {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
// // // //                       </div>
// // // //                     </td>
// // // //                     <td className="px-6 py-4">
// // // //                       <div className="text-sm text-muted-foreground">
// // // //                         {record.timestamp
// // // //                           ? new Date(record.timestamp).toLocaleTimeString("en-US", {
// // // //                               hour: "2-digit",
// // // //                               minute: "2-digit",
// // // //                             })
// // // //                           : "N/A"}
// // // //                       </div>
// // // //                     </td>
// // // //                     <td className="px-6 py-4">
// // // //                       <div className="text-sm text-muted-foreground capitalize">{record.shift || "N/A"}</div>
// // // //                     </td>
// // // //                   </tr>
// // // //                 ))}
// // // //                 {records.length === 0 && (
// // // //                   <tr>
// // // //                     <td className="px-6 py-12 text-center text-muted-foreground" colSpan={4}>
// // // //                       <div className="flex flex-col items-center gap-2">
// // // //                         <User className="h-8 w-8 text-muted-foreground/50" />
// // // //                         <span>No attendance records found.</span>
// // // //                       </div>
// // // //                     </td>
// // // //                   </tr>
// // // //                 )}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //         </CardContent>
// // // //       </Card>
// // // //     </div>
// // // //   )
// // // // }



// // // "use client"

// // // import { useEffect, useState } from "react"
// // // import { useRouter } from "next/navigation"
// // // import useSWR from "swr"
// // // import { getStoredUser } from "@/lib/auth"
// // // import { Alert, AlertDescription } from "@/components/ui/alert"
// // // import StudentDashboardWidgets from "@/components/student-dashboard-widgets"
// // // import { AlertCircle } from "lucide-react"
// // // import { AttendanceCalendar } from "@/components/attendance-calendar"

// // // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // // export default function StudentAttendancePage() {
// // //   const [user, setUser] = useState(null)
// // //   const router = useRouter()

// // //   useEffect(() => {
// // //     const storedUser = getStoredUser()
// // //     if (!storedUser) {
// // //       router.push("/login")
// // //       return
// // //     }
// // //     if (storedUser.role !== "Student") {
// // //       router.push("/")
// // //       return
// // //     }
// // //     setUser(storedUser)
// // //   }, [router])

// // //   const { data: attendanceData, error } = useSWR(user ? `/api/students/${user.id}/attendance` : null, fetcher)

// // //   if (!user) {
// // //     return <div>Loading...</div>
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
// // //         <Alert className="border-red-200 bg-red-50">
// // //           <AlertCircle className="h-4 w-4 text-red-600" />
// // //           <AlertDescription className="text-red-800">
// // //             Failed to load attendance data. Please try again later.
// // //           </AlertDescription>
// // //         </Alert>
// // //       </div>
// // //     )
// // //   }

// // //   const records = attendanceData?.records || []
// // //   const attendanceDataForCalendar = {
// // //     present: records.filter((r: any) => r.status === "present"),
// // //     absent: records.filter((r: any) => r.status === "absent"),
// // //     late: records.filter((r: any) => r.status === "late"),
// // //     leave: records.filter((r: any) => r.status === "leave"),
// // //   }

// // //   const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8">
// // //       <header className="p-6 bg-card rounded-xl border shadow-sm">
// // //         <div className="space-y-2">
// // //           <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
// // //             My Attendance
// // //           </h1>
// // //           <p className="text-muted-foreground leading-relaxed">
// // //             Welcome {user.name}! Here's your attendance overview for {currentMonth}.
// // //           </p>
// // //         </div>
// // //       </header>

// // //       <StudentDashboardWidgets studentId={user.id} />

// // //       <AttendanceCalendar attendanceData={attendanceDataForCalendar} />
// // //     </div>
// // //   )
// // // }



// // "use client"

// // import { useEffect, useState } from "react"
// // import { useRouter } from "next/navigation"
// // import useSWR from "swr"
// // import { getStoredUser } from "@/lib/auth"
// // import { Alert, AlertDescription } from "@/components/ui/alert"
// // import StudentDashboardWidgets from "@/components/student-dashboard-widgets"
// // import { AlertCircle } from "lucide-react"
// // import { AttendanceCalendar } from "@/components/attendance-calendar"
// // import { realtimeClient } from "@/lib/realtime-client"

// // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // export default function StudentAttendancePage() {
// //   const [user, setUser] = useState(null)
// //   const router = useRouter()

// //   useEffect(() => {
// //     const storedUser = getStoredUser()
// //     if (!storedUser) {
// //       router.push("/login")
// //       return
// //     }
// //     if (storedUser.role !== "Student") {
// //       router.push("/")
// //       return
// //     }
// //     setUser(storedUser)
// //   }, [router])

// //   const { data: attendanceData, error, mutate } = useSWR(user ? `/api/students/${user.id}/attendance` : null, fetcher)

// //   useEffect(() => {
// //     if (!user) return

// //     const onAttendanceUpdate = (evt: any) => {
// //       if (evt?.personType === "student" && evt?.personId === user.id) {
// //         mutate()
// //       }
// //     }
// //     const onConnRestore = () => mutate()

// //     realtimeClient.on("attendance_update", onAttendanceUpdate)
// //     realtimeClient.on("connection_restored", onConnRestore)
// //     realtimeClient.connect()

// //     return () => {
// //       realtimeClient.off("attendance_update", onAttendanceUpdate)
// //       realtimeClient.off("connection_restored", onConnRestore)
// //       realtimeClient.disconnect()
// //     }
// //   }, [user, mutate])

// //   if (!user) {
// //     return <div>Loading...</div>
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
// //         <Alert className="border-red-200 bg-red-50">
// //           <AlertCircle className="h-4 w-4 text-red-600" />
// //           <AlertDescription className="text-red-800">
// //             Failed to load attendance data. Please try again later.
// //           </AlertDescription>
// //         </Alert>
// //       </div>
// //     )
// //   }

// //   const records = attendanceData?.records || []
// //   const attendanceDataForCalendar = {
// //     present: records.filter((r: any) => r.status === "present"),
// //     absent: records.filter((r: any) => r.status === "absent"),
// //     late: records.filter((r: any) => r.status === "late"),
// //     leave: records.filter((r: any) => r.status === "leave"),
// //   }

// //   const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8">
// //       <header className="p-6 bg-card rounded-xl border shadow-sm">
// //         <div className="space-y-2">
// //           <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
// //             My Attendance
// //           </h1>
// //           <p className="text-muted-foreground leading-relaxed">
// //             Welcome {user.name}! Here's your attendance overview for {currentMonth}.
// //           </p>
// //         </div>
// //       </header>

// //       <StudentDashboardWidgets studentId={user.id} />

// //       <AttendanceCalendar attendanceData={attendanceDataForCalendar} />
// //     </div>
// //   )
// // }



// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import useSWR from "swr"
// import { getStoredUser } from "@/lib/auth"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import StudentDashboardWidgets from "@/components/student-dashboard-widgets"
// import { AlertCircle } from "lucide-react"
// import { AttendanceCalendar } from "@/components/attendance-calendar"
// import { realtimeClient } from "@/lib/realtime-client"

// const fetcher = (url: string) => fetch(url).then((r) => r.json())

// export default function StudentAttendancePage() {
//   const [user, setUser] = useState(null)
//   const router = useRouter()

//   useEffect(() => {
//     const storedUser = getStoredUser()
//     if (!storedUser) {
//       router.push("/login")
//       return
//     }
//     if (storedUser.role !== "Student") {
//       router.push("/")
//       return
//     }
//     setUser(storedUser)
//   }, [router])

//   const { data: attendanceData, error, mutate } = useSWR(user ? `/api/students/${user.id}/attendance` : null, fetcher)

//   useEffect(() => {
//     if (!user) return

//     const onAttendanceUpdate = (evt: any) => {
//       if (evt?.personType === "student" && evt?.personId === user.id) {
//         mutate()
//       }
//     }
//     const onConnRestore = () => mutate()

//     realtimeClient.on("attendance_update", onAttendanceUpdate)
//     realtimeClient.on("connection_restored", onConnRestore)
//     realtimeClient.connect()

//     return () => {
//       realtimeClient.off("attendance_update", onAttendanceUpdate)
//       realtimeClient.off("connection_restored", onConnRestore)
//       realtimeClient.disconnect()
//     }
//   }, [user, mutate])

//   if (!user) {
//     return <div>Loading...</div>
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
//         <Alert className="border-red-200 bg-red-50">
//           <AlertCircle className="h-4 w-4 text-red-600" />
//           <AlertDescription className="text-red-800">
//             Failed to load attendance data. Please try again later.
//           </AlertDescription>
//         </Alert>
//       </div>
//     )
//   }

//   const normalize = (s: any) => (typeof s === "string" ? s.toLowerCase() : "")
//   const records = attendanceData?.records || []
//   const attendanceDataForCalendar = {
//     present: records.filter((r: any) => {
//       const s = normalize(r.status)
//       return s === "present" || s === "on-time"
//     }),
//     absent: records.filter((r: any) => normalize(r.status) === "absent"),
//     late: records.filter((r: any) => normalize(r.status) === "late"),
//     leave: records.filter((r: any) => normalize(r.status) === "leave"),
//   }

//   const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8">
//       <header className="p-6 bg-card rounded-xl border shadow-sm">
//         <div className="space-y-2">
//           <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//             My Attendance
//           </h1>
//           <p className="text-muted-foreground leading-relaxed">
//             Welcome {user.name}! Here's your attendance overview for {currentMonth}.
//           </p>
//         </div>
//       </header>

//       <StudentDashboardWidgets studentId={user.id} />

//       <AttendanceCalendar attendanceData={attendanceDataForCalendar} />
//     </div>
//   )
// }


// // // // // // "use client"

// // // // // // import useSWR from "swr"
// // // // // // import { AttendanceFilters, type AttendanceFiltersState } from "@/components/attendance-filters"
// // // // // // import { ExportAttendance } from "@/components/export-attendance"
// // // // // // import type { Department, Role, Shift, AttendanceRecord } from "@/lib/types"
// // // // // // import { Button } from "@/components/ui/button"
// // // // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // // // // // import { PersonDetailsModal } from "@/components/person-details-modal"
// // // // // // import { User, Users, UserCheck, UserX, Clock, RefreshCw, AlertCircle, CheckCircle, Wifi, WifiOff } from "lucide-react"
// // // // // // import { useMemo, useState, useEffect } from "react"
// // // // // // import { Alert, AlertDescription } from "@/components/ui/alert"
// // // // // // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// // // // // // import { realtimeClient } from "@/lib/realtime-client"
// // // // // // import { getStoredUser } from "@/lib/auth" // import user helper

// // // // // // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // // // // // export default function AttendancePage() {
// // // // // //   const [filters, setFilters] = useState<AttendanceFiltersState>({
// // // // // //     date: new Date().toISOString().slice(0, 10), // Default to today
// // // // // //     status: "all", // Added default status filter
// // // // // //   })
// // // // // //   const [selectedPerson, setSelectedPerson] = useState<{
// // // // // //     personId: string
// // // // // //     personType: "staff" | "student"
// // // // // //   } | null>(null)
// // // // // //   const [isAutoMarking, setIsAutoMarking] = useState(false)
// // // // // //   const [attendanceMessage, setAttendanceMessage] = useState<{
// // // // // //     type: "success" | "error" | "warning"
// // // // // //     message: string
// // // // // //   } | null>(null)
// // // // // //   const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
// // // // // //   const [showNotMarkedModal, setShowNotMarkedModal] = useState(false)
// // // // // //   const [isConnected, setIsConnected] = useState(false)
// // // // // //   const [realtimeUpdates, setRealtimeUpdates] = useState(0)
// // // // // //   const [currentUser, setCurrentUser] = useState<any>(null) // track current user

// // // // // //   useEffect(() => {
// // // // // //     function onAttendanceUpdate(data: any) {
// // // // // //       console.log("[v0] Real-time attendance update received:", data)
// // // // // //       setRealtimeUpdates((prev) => prev + 1)

// // // // // //       setAttendanceMessage({
// // // // // //         type: "success",
// // // // // //         message: `${data.personName} marked as ${data.status.toUpperCase()} via Face Recognition`,
// // // // // //       })

// // // // // //       mutate()
// // // // // //       mutateNotMarked()

// // // // // //       setTimeout(() => setAttendanceMessage(null), 4000)
// // // // // //     }

// // // // // //     function onStatsUpdate(stats: any) {
// // // // // //       console.log("[v0] Real-time attendance stats:", stats)
// // // // // //       // Refresh data when stats update
// // // // // //       mutate()
// // // // // //       mutateNotMarked()
// // // // // //     }

// // // // // //     function onAutoMarkComplete(data: any) {
// // // // // //       console.log("[v0] Auto-mark complete:", data)
// // // // // //       if (data.markedAbsent > 0) {
// // // // // //         setAttendanceMessage({
// // // // // //           type: "warning",
// // // // // //           message: `Auto-marked ${data.markedAbsent} people as absent (shift time closed)`,
// // // // // //         })
// // // // // //         mutate()
// // // // // //         mutateNotMarked()
// // // // // //         setTimeout(() => setAttendanceMessage(null), 6000)
// // // // // //       }
// // // // // //     }

// // // // // //     // Set up event listeners
// // // // // //     realtimeClient.on("attendance_update", onAttendanceUpdate)
// // // // // //     realtimeClient.on("stats_update", onStatsUpdate)
// // // // // //     realtimeClient.on("auto_mark_complete", onAutoMarkComplete)

// // // // // //     // Connect to real-time updates
// // // // // //     realtimeClient.connect()
// // // // // //     setIsConnected(true)
// // // // // //     console.log("[v0] Real-time client connected to attendance page")

// // // // // //     return () => {
// // // // // //       realtimeClient.off("attendance_update", onAttendanceUpdate)
// // // // // //       realtimeClient.off("stats_update", onStatsUpdate)
// // // // // //       realtimeClient.off("auto_mark_complete", onAutoMarkComplete)
// // // // // //       realtimeClient.disconnect()
// // // // // //       setIsConnected(false)
// // // // // //     }
// // // // // //   }, [])

// // // // // //   useEffect(() => {
// // // // // //     const checkAndAutoMarkAbsent = async () => {
// // // // // //       try {
// // // // // //         const res = await fetch("/api/attendance/auto-mark", {
// // // // // //           method: "POST",
// // // // // //           headers: { "Content-Type": "application/json" },
// // // // // //         })
// // // // // //         const result = await res.json()

// // // // // //         if (res.ok && result.markedAbsent > 0) {
// // // // // //           setAttendanceMessage({
// // // // // //             type: "warning",
// // // // // //             message: `Automatically marked ${result.markedAbsent} people as absent due to shift time closure`,
// // // // // //           })
// // // // // //           mutate()

// // // // // //           setTimeout(() => setAttendanceMessage(null), 8000)
// // // // // //         }
// // // // // //       } catch (error) {
// // // // // //         console.error("Auto-mark check failed:", error)
// // // // // //       }
// // // // // //     }

// // // // // //     checkAndAutoMarkAbsent()

// // // // // //     const interval = setInterval(checkAndAutoMarkAbsent, 300000)

// // // // // //     return () => clearInterval(interval)
// // // // // //   }, [])

// // // // // //   useEffect(() => {
// // // // // //     setCurrentUser(getStoredUser())
// // // // // //   }, [])

// // // // // //   const params = new URLSearchParams()
// // // // // //   if (filters.department && String(filters.department).toLowerCase() !== "all") params.set("department", String(filters.department).toLowerCase())
// // // // // //   if (filters.role && String(filters.role).toLowerCase() !== "all") params.set("role", String(filters.role).toLowerCase())
// // // // // //   if (filters.shift && String(filters.shift).toLowerCase() !== "all") params.set("shift", String(filters.shift).toLowerCase())
// // // // // //   if (filters.status && String(filters.status).toLowerCase() !== "all") params.set("status", String(filters.status).toLowerCase())
// // // // // //   if (filters.date) params.set("date", filters.date)
// // // // // //   if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
// // // // // //     params.set("institutionName", currentUser.institutionName)
// // // // // //   }

// // // // // //   const { data, mutate } = useSWR<{
// // // // // //     records: (AttendanceRecord & {
// // // // // //       personName?: string
// // // // // //       imageUrl?: string
// // // // // //       employeeCode?: string
// // // // // //       rollNumber?: string
// // // // // //       classLevel?: string
// // // // // //     })[]
// // // // // //     departments: Department[]
// // // // // //     roles: Role[]
// // // // // //     shifts: Shift[]
// // // // // //     totalCounts: {
// // // // // //       totalPeople: number
// // // // // //       present: number
// // // // // //       absent: number
// // // // // //       late: number
// // // // // //     }
// // // // // //   }>(`/api/attendance?${params.toString()}`, fetcher)

// // // // // //   const notMarkedUrlParams = new URLSearchParams()
// // // // // //   if (filters.date) notMarkedUrlParams.set("date", filters.date)
// // // // // //   if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
// // // // // //     notMarkedUrlParams.set("institutionName", currentUser.institutionName)
// // // // // //   }
// // // // // //   const { data: notMarkedData, mutate: mutateNotMarked } = useSWR(
// // // // // //     `/api/attendance/not-marked?${notMarkedUrlParams.toString()}`,
// // // // // //     fetcher,
// // // // // //   )

// // // // // //   const records = data?.records ?? []
// // // // // //   const departments = data?.departments ?? []
// // // // // //   const roles = data?.roles ?? []
// // // // // //   const shifts = data?.shifts ?? []
// // // // // //   const totalCounts = data?.totalCounts ?? { totalPeople: 0, present: 0, absent: 0, late: 0 }

// // // // // //   const notMarkedPeople = notMarkedData?.notMarkedPeople ?? []

// // // // // //   const counts = useMemo(
// // // // // //     () => ({
// // // // // //       present: records.filter((r) => r.status === "present").length,
// // // // // //       absent: records.filter((r) => r.status === "absent").length,
// // // // // //       late: records.filter((r) => r.status === "late").length,
// // // // // //     }),
// // // // // //     [records],
// // // // // //   )

// // // // // //   async function mark(personId: string, personType: "staff" | "student", status: "present" | "absent" | "late") {
// // // // // //     const body = { personId, personType, status, date: filters.date }
// // // // // //     const res = await fetch("/api/attendance", {
// // // // // //       method: "POST",
// // // // // //       headers: { "Content-Type": "application/json" },
// // // // // //       body: JSON.stringify(body),
// // // // // //     })

// // // // // //     const result = await res.json()

// // // // // //     if (res.status === 409) {
// // // // // //       setAttendanceMessage({
// // // // // //         type: "warning",
// // // // // //         message: result.message,
// // // // // //       })
// // // // // //     } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
// // // // // //       setAttendanceMessage({
// // // // // //         type: "error",
// // // // // //         message: result.message,
// // // // // //       })
// // // // // //     } else if (!res.ok) {
// // // // // //       setAttendanceMessage({
// // // // // //         type: "error",
// // // // // //         message: "Failed to mark attendance",
// // // // // //       })
// // // // // //     } else {
// // // // // //       setAttendanceMessage({
// // // // // //         type: "success",
// // // // // //         message: result.message,
// // // // // //       })
// // // // // //       mutate()
// // // // // //     }

// // // // // //     setTimeout(() => setAttendanceMessage(null), 5000)
// // // // // //   }

// // // // // //   async function autoMarkAbsent() {
// // // // // //     setIsAutoMarking(true)
// // // // // //     try {
// // // // // //       const res = await fetch("/api/attendance/auto-mark", {
// // // // // //         method: "POST",
// // // // // //         headers: { "Content-Type": "application/json" },
// // // // // //       })
// // // // // //       const result = await res.json()
// // // // // //       if (res.ok) {
// // // // // //         setAttendanceMessage({
// // // // // //           type: "success",
// // // // // //           message: result.message,
// // // // // //         })
// // // // // //         mutate()
// // // // // //       } else {
// // // // // //         setAttendanceMessage({
// // // // // //           type: "error",
// // // // // //           message: "Failed to auto-mark attendance",
// // // // // //         })
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       setAttendanceMessage({
// // // // // //         type: "error",
// // // // // //         message: "Error auto-marking attendance",
// // // // // //       })
// // // // // //     } finally {
// // // // // //       setIsAutoMarking(false)
// // // // // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // // // // //     }
// // // // // //   }

// // // // // //   async function updateAttendanceStatus(
// // // // // //     recordId: string,
// // // // // //     personId: string,
// // // // // //     personType: "staff" | "student",
// // // // // //     newStatus: "present" | "absent" | "late",
// // // // // //   ) {
// // // // // //     setUpdatingStatus(recordId)
// // // // // //     try {
// // // // // //       const res = await fetch("/api/attendance", {
// // // // // //         method: "PUT",
// // // // // //         headers: { "Content-Type": "application/json" },
// // // // // //         body: JSON.stringify({
// // // // // //           recordId,
// // // // // //           personId,
// // // // // //           personType,
// // // // // //           status: newStatus,
// // // // // //           date: filters.date,
// // // // // //         }),
// // // // // //       })

// // // // // //       const result = await res.json()
// // // // // //       console.log("[v0] Manual mark response:", result)

// // // // // //       if (res.ok) {
// // // // // //         setAttendanceMessage({
// // // // // //           type: "success",
// // // // // //           message: `Attendance status updated to ${newStatus.toUpperCase()} successfully`,
// // // // // //         })
// // // // // //         mutate()
// // // // // //       } else {
// // // // // //         setAttendanceMessage({
// // // // // //           type: "error",
// // // // // //           message: result.message || "Failed to update attendance status",
// // // // // //         })
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       setAttendanceMessage({
// // // // // //         type: "error",
// // // // // //         message: "Error updating attendance status",
// // // // // //       })
// // // // // //     } finally {
// // // // // //       setUpdatingStatus(null)
// // // // // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // // // // //     }
// // // // // //   }

// // // // // //   const isAttendanceMarked = (record: any) => {
// // // // // //     return record.status && record.timestamp
// // // // // //   }

// // // // // //   async function handleManualMark(
// // // // // //     personId: string,
// // // // // //     personType: "staff" | "student",
// // // // // //     status: "present" | "absent" | "late",
// // // // // //   ) {
// // // // // //     console.log("[v0] Manual marking:", { personId, personType, status })

// // // // // //     try {
// // // // // //       const body = { personId, personType, status, date: filters.date }
// // // // // //       const res = await fetch("/api/attendance", {
// // // // // //         method: "POST",
// // // // // //         headers: { "Content-Type": "application/json" },
// // // // // //         body: JSON.stringify(body),
// // // // // //       })

// // // // // //       const result = await res.json()
// // // // // //       console.log("[v0] Manual mark response:", result)

// // // // // //       if (res.status === 409) {
// // // // // //         setAttendanceMessage({
// // // // // //           type: "warning",
// // // // // //           message: result.message,
// // // // // //         })
// // // // // //       } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
// // // // // //         setAttendanceMessage({
// // // // // //           type: "error",
// // // // // //           message: result.message,
// // // // // //         })
// // // // // //       } else if (!res.ok) {
// // // // // //         setAttendanceMessage({
// // // // // //           type: "error",
// // // // // //           message: "Failed to mark attendance",
// // // // // //         })
// // // // // //       } else {
// // // // // //         setAttendanceMessage({
// // // // // //           type: "success",
// // // // // //           message: result.message,
// // // // // //         })
// // // // // //         mutate()
// // // // // //         mutateNotMarked()
// // // // // //       }

// // // // // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // // // // //     } catch (error) {
// // // // // //       console.error("[v0] Manual mark error:", error)
// // // // // //       setAttendanceMessage({
// // // // // //         type: "error",
// // // // // //         message: "Error marking attendance",
// // // // // //       })
// // // // // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // // // // //     }
// // // // // //   }

// // // // // //   function exportNotMarkedCsv() {
// // // // // //     if (!notMarkedPeople.length) {
// // // // // //       alert("No data to export")
// // // // // //       return
// // // // // //     }
// // // // // //     const headers = ["Name", "Type", "Employee Code/Roll", "Department", "Role", "Shift", "Class Level"]
// // // // // //     const rows = notMarkedPeople.map((p: {
// // // // // //       personName?: string
// // // // // //       personType: "staff" | "student"
// // // // // //       employeeCode?: string
// // // // // //       rollNumber?: string
// // // // // //       department?: string
// // // // // //       role?: string
// // // // // //       shift?: string
// // // // // //       classLevel?: string
// // // // // //     }) => [
// // // // // //       p.personName || "Unknown",
// // // // // //       p.personType,
// // // // // //       p.personType === "staff" ? p.employeeCode || "N/A" : p.rollNumber || "N/A",
// // // // // //       p.department || "N/A",
// // // // // //       p.role || "N/A",
// // // // // //       p.shift || "N/A",
// // // // // //       p.personType === "student" ? p.classLevel || "N/A" : "N/A",
// // // // // //     ])

// // // // // //     const csv = [headers, ...rows]
// // // // // //       .map((r) =>
// // // // // //         r
// // // // // //           .map((field: string | number | null | undefined) => {
// // // // // //             const s = String(field ?? "")
// // // // // //             // escape quotes and commas
// // // // // //             if (s.includes(",") || s.includes('"') || s.includes("\n")) {
// // // // // //               return `"${s.replace(/"/g, '""')}"`
// // // // // //             }
// // // // // //             return s
// // // // // //           })
// // // // // //           .join(","),
// // // // // //       )
// // // // // //       .join("\n")

// // // // // //     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
// // // // // //     const url = URL.createObjectURL(blob)
// // // // // //     const a = document.createElement("a")
// // // // // //     a.href = url
// // // // // //     const datePart = notMarkedData?.date || new Date().toISOString().slice(0, 10)
// // // // // //     a.download = `not-marked-${datePart}.csv`
// // // // // //     document.body.appendChild(a)
// // // // // //     a.click()
// // // // // //     document.body.removeChild(a)
// // // // // //     URL.revokeObjectURL(url)
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8">
// // // // // //       <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-card rounded-xl border shadow-sm">
// // // // // //         <div className="space-y-2">
// // // // // //           {currentUser?.institutionName && (
// // // // // //             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
// // // // // //               {currentUser.institutionName}
// // // // // //             </div>
// // // // // //           )}
// // // // // //           <div className="flex items-center gap-3">
// // // // // //             <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
// // // // // //               Attendance Management
// // // // // //             </h1>
// // // // // //             <div className="flex items-center gap-2">
// // // // // //               {isConnected ? (
// // // // // //                 <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
// // // // // //                   <Wifi className="h-3 w-3" />
// // // // // //                   Live
// // // // // //                 </div>
// // // // // //               ) : (
// // // // // //                 <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
// // // // // //                   <WifiOff className="h-3 w-3" />
// // // // // //                   Offline
// // // // // //                 </div>
// // // // // //               )}
// // // // // //               {realtimeUpdates > 0 && (
// // // // // //                 <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
// // // // // //                   {realtimeUpdates} updates
// // // // // //                 </div>
// // // // // //               )}
// // // // // //             </div>
// // // // // //           </div>
// // // // // //           <p className="text-muted-foreground leading-relaxed max-w-2xl">
// // // // // //             View and manage attendance with automatic absent marking when shift times close. Auto-absent thresholds:
// // // // // //             Morning after 11:30AM, Evening after 4:30PM, Night after 12:30AM. System checks every 5 minutes.
// // // // // //             {isConnected && " Real-time updates enabled via Face Recognition."}
// // // // // //           </p>
// // // // // //         </div>
// // // // // //         <div className="flex flex-col sm:flex-row gap-3">
// // // // // //           <Button
// // // // // //             onClick={autoMarkAbsent}
// // // // // //             disabled={isAutoMarking}
// // // // // //             variant="outline"
// // // // // //             className="flex items-center gap-2 bg-accent/10 border-accent/20 hover:bg-accent/20 text-accent font-medium"
// // // // // //           >
// // // // // //             <RefreshCw className={`h-4 w-4 ${isAutoMarking ? "animate-spin" : ""}`} />
// // // // // //             {isAutoMarking ? "Auto Marking..." : "Manual Auto Mark"}
// // // // // //           </Button>
// // // // // //           <ExportAttendance
// // // // // //             records={records}
// // // // // //             filters={{
// // // // // //               department: filters.department,
// // // // // //               role: filters.role,
// // // // // //               shift: filters.shift,
// // // // // //               status: filters.status,
// // // // // //               date: filters.date,
// // // // // //             }}
// // // // // //           />
// // // // // //         </div>
// // // // // //       </header>

// // // // // //       {attendanceMessage && (
// // // // // //         <Alert
// // // // // //           className={`${
// // // // // //             attendanceMessage.type === "success"
// // // // // //               ? "border-green-200 bg-green-50"
// // // // // //               : attendanceMessage.type === "warning"
// // // // // //                 ? "border-amber-200 bg-amber-50"
// // // // // //                 : "border-red-200 bg-red-50"
// // // // // //           }`}
// // // // // //         >
// // // // // //           {attendanceMessage.type === "success" ? (
// // // // // //             <CheckCircle className="h-4 w-4 text-green-600" />
// // // // // //           ) : (
// // // // // //             <AlertCircle className="h-4 w-4 text-amber-600" />
// // // // // //           )}
// // // // // //           <AlertDescription
// // // // // //             className={`${
// // // // // //               attendanceMessage.type === "success"
// // // // // //                 ? "text-green-800"
// // // // // //                 : attendanceMessage.type === "warning"
// // // // // //                   ? "text-amber-800"
// // // // // //                   : "text-red-800"
// // // // // //             }`}
// // // // // //           >
// // // // // //             {attendanceMessage.message}
// // // // // //             {attendanceMessage.message.includes("Face Recognition") && (
// // // // // //               <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
// // // // // //                 <Wifi className="h-3 w-3" />
// // // // // //                 Real-time
// // // // // //               </span>
// // // // // //             )}
// // // // // //           </AlertDescription>
// // // // // //         </Alert>
// // // // // //       )}

// // // // // //       <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
// // // // // //         <CardContent className="pt-6">
// // // // // //           <AttendanceFilters
// // // // // //             departments={departments}
// // // // // //             roles={roles}
// // // // // //             shifts={shifts}
// // // // // //             value={filters}
// // // // // //             onChange={setFilters}
// // // // // //           />
// // // // // //         </CardContent>
// // // // // //       </Card>

// // // // // //       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
// // // // // //         <Card className="bg-gradient-to-br from-card to-muted/20 border-0 shadow-sm hover:shadow-md transition-shadow">
// // // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // // //             <CardTitle className="text-sm font-semibold text-muted-foreground">Total People</CardTitle>
// // // // // //             <Users className="h-5 w-5 text-primary" />
// // // // // //           </CardHeader>
// // // // // //           <CardContent>
// // // // // //             <div className="text-3xl font-bold text-foreground">{totalCounts.totalPeople}</div>
// // // // // //             <p className="text-xs text-muted-foreground mt-1">All registered people</p>
// // // // // //           </CardContent>
// // // // // //         </Card>

// // // // // //         <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
// // // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // // //             <CardTitle className="text-sm font-semibold text-green-700">Present</CardTitle>
// // // // // //             <UserCheck className="h-5 w-5 text-green-600" />
// // // // // //           </CardHeader>
// // // // // //           <CardContent>
// // // // // //             <div className="text-3xl font-bold text-green-700">{totalCounts.present}</div>
// // // // // //             <p className="text-xs text-green-600 mt-1">Filtered: {counts.present}</p>
// // // // // //           </CardContent>
// // // // // //         </Card>

// // // // // //         <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-sm hover:shadow-md transition-shadow">
// // // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // // //             <CardTitle className="text-sm font-semibold text-red-700">Absent</CardTitle>
// // // // // //             <UserX className="h-5 w-5 text-red-600" />
// // // // // //           </CardHeader>
// // // // // //           <CardContent>
// // // // // //             <div className="text-3xl font-bold text-red-700">{totalCounts.absent}</div>
// // // // // //             <p className="text-xs text-red-600 mt-1">Filtered: {counts.absent}</p>
// // // // // //           </CardContent>
// // // // // //         </Card>

// // // // // //         <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
// // // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // // //             <CardTitle className="text-sm font-semibold text-amber-700">Late</CardTitle>
// // // // // //             <Clock className="h-5 w-5 text-amber-600" />
// // // // // //           </CardHeader>
// // // // // //           <CardContent>
// // // // // //             <div className="text-3xl font-bold text-amber-700">{totalCounts.late}</div>
// // // // // //             <p className="text-xs text-amber-600 mt-1">Filtered: {counts.late}</p>
// // // // // //           </CardContent>
// // // // // //         </Card>

// // // // // //         <Card
// // // // // //           className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
// // // // // //           onClick={() => setShowNotMarkedModal(true)}
// // // // // //         >
// // // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // // //             <CardTitle className="text-sm font-semibold text-slate-700">Not Marked</CardTitle>
// // // // // //             <User className="h-5 w-5 text-slate-600" />
// // // // // //           </CardHeader>
// // // // // //           <CardContent>
// // // // // //             <div className="text-3xl font-bold text-slate-700">{notMarkedData?.count ?? 0}</div>
// // // // // //             <p className="text-xs text-slate-600 mt-1">Click to view & mark</p>
// // // // // //           </CardContent>
// // // // // //         </Card>
// // // // // //       </div>

// // // // // //       <Card className="shadow-sm border-0 overflow-hidden">
// // // // // //         <div className="overflow-x-auto">
// // // // // //           <table className="min-w-full">
// // // // // //             <thead className="bg-gradient-to-r from-muted/50 to-muted/30">
// // // // // //               <tr>
// // // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
// // // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name & Code/Roll</th>
// // // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type & Class Level</th>
// // // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department & Role</th>
// // // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Shift & Timing</th>
// // // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status & Time</th>
// // // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
// // // // // //               </tr>
// // // // // //             </thead>
// // // // // //             <tbody className="divide-y divide-border/50">
// // // // // //               {records.map((r) => (
// // // // // //                 <tr key={r.id} className="hover:bg-muted/30 transition-colors">
// // // // // //                   <td className="px-6 py-4">
// // // // // //                     <div
// // // // // //                       className="cursor-pointer"
// // // // // //                       onClick={() => setSelectedPerson({ personId: r.personId, personType: r.personType })}
// // // // // //                     >
// // // // // //                       {r.imageUrl ? (
// // // // // //                         <img
// // // // // //                           src={r.imageUrl || "/placeholder.svg"}
// // // // // //                           alt={r.personName || "Person"}
// // // // // //                           className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors shadow-sm"
// // // // // //                         />
// // // // // //                       ) : (
// // // // // //                         <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors shadow-sm">
// // // // // //                           <User className="h-6 w-6 text-muted-foreground" />
// // // // // //                         </div>
// // // // // //                       )}
// // // // // //                     </div>
// // // // // //                   </td>

// // // // // //                   <td className="px-6 py-4">
// // // // // //                     <div className="space-y-1">
// // // // // //                       <div className="text-base font-semibold text-foreground">{r.personName || "Unknown"}</div>
// // // // // //                       <div className="text-sm text-muted-foreground font-medium">
// // // // // //                         {r.personType === "staff"
// // // // // //                           ? `Code: ${r.employeeCode || "N/A"}`
// // // // // //                           : `Roll: ${r.rollNumber || "N/A"}`}
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                   </td>

// // // // // //                   <td className="px-6 py-4">
// // // // // //                     <div className="space-y-1">
// // // // // //                       <div className="text-sm font-medium capitalize text-foreground">{r.personType}</div>
// // // // // //                       {r.personType === "student" && (
// // // // // //                         <div className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md inline-block">
// // // // // //                           {r.classLevel || "N/A"}
// // // // // //                         </div>
// // // // // //                       )}
// // // // // //                       {r.personType === "staff" && (
// // // // // //                         <div className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md inline-block">
// // // // // //                           Staff Member
// // // // // //                         </div>
// // // // // //                       )}
// // // // // //                     </div>
// // // // // //                   </td>

// // // // // //                   <td className="px-6 py-4">
// // // // // //                     <div className="space-y-1">
// // // // // //                       <div className="text-sm font-medium text-foreground">{r.department}</div>
// // // // // //                       <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md inline-block">
// // // // // //                         {r.role}
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                   </td>

// // // // // //                   <td className="px-6 py-4">
// // // // // //                     <div className="space-y-2">
// // // // // //                       <div className="text-sm font-medium text-foreground">{r.shift} Shift</div>
// // // // // //                       <div className="text-xs text-muted-foreground">
// // // // // //                         {String(r.shift).toLowerCase() === "morning" && "9:00 AM - 6:00 PM"}
// // // // // //                         {String(r.shift).toLowerCase() === "evening" && "2:00 PM - 10:00 PM"}
// // // // // //                         {String(r.shift).toLowerCase() === "night" && "10:00 PM - 6:00 AM"}
// // // // // //                       </div>
// // // // // //                       <div className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-md inline-block">
// // // // // //                         Auto-absent: {String(r.shift).toLowerCase() === "morning" && "11:30 AM"}
// // // // // //                         {String(r.shift).toLowerCase() === "evening" && "4:30 PM"}
// // // // // //                         {String(r.shift).toLowerCase() === "night" && "12:30 AM"}
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                   </td>

// // // // // //                   <td className="px-6 py-4">
// // // // // //                     {isAttendanceMarked(r) ? (
// // // // // //                       <div className="space-y-2">
// // // // // //                         <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
// // // // // //                           <CheckCircle className="h-4 w-4 text-green-600" />
// // // // // //                           <span className="font-medium">Marked as {r.status?.toUpperCase()}</span>
// // // // // //                         </div>
// // // // // //                         <div className="text-xs text-muted-foreground">
// // // // // //                           {r.timestamp && new Date(r.timestamp).toLocaleString()}
// // // // // //                         </div>
// // // // // //                       </div>
// // // // // //                     ) : (
// // // // // //                       <div className="text-sm text-muted-foreground italic">Not marked yet</div>
// // // // // //                     )}
// // // // // //                   </td>

// // // // // //                   <td className="px-6 py-4">
// // // // // //                     {isAttendanceMarked(r) ? (
// // // // // //                       <div className="space-y-2">
// // // // // //                         <div
// // // // // //                           className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
// // // // // //                             r.status === "present"
// // // // // //                               ? "bg-green-100 text-green-800"
// // // // // //                               : r.status === "absent"
// // // // // //                                 ? "bg-red-100 text-red-800"
// // // // // //                                 : "bg-amber-100 text-amber-800"
// // // // // //                           }`}
// // // // // //                         >
// // // // // //                           <CheckCircle className="h-4 w-4" />
// // // // // //                           {r.status?.toUpperCase()}
// // // // // //                         </div>
// // // // // //                         <div className="text-xs text-muted-foreground">
// // // // // //                           {r.timestamp && new Date(r.timestamp).toLocaleString()}
// // // // // //                         </div>
// // // // // //                       </div>
// // // // // //                     ) : (
// // // // // //                       <div className="flex flex-col gap-2">
// // // // // //                         <Button
// // // // // //                           size="sm"
// // // // // //                           className="bg-green-600 text-white hover:bg-green-700 shadow-sm font-medium"
// // // // // //                           onClick={() => mark(r.personId, r.personType, "present")}
// // // // // //                         >
// // // // // //                           Present
// // // // // //                         </Button>
// // // // // //                         <div className="flex gap-2">
// // // // // //                           <Button
// // // // // //                             size="sm"
// // // // // //                             variant="outline"
// // // // // //                             className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-medium bg-transparent"
// // // // // //                             onClick={() => mark(r.personId, r.personType, "absent")}
// // // // // //                           >
// // // // // //                             Absent
// // // // // //                           </Button>
// // // // // //                           <Button
// // // // // //                             size="sm"
// // // // // //                             variant="outline"
// // // // // //                             className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 font-medium bg-transparent"
// // // // // //                             onClick={() => mark(r.personId, r.personType, "late")}
// // // // // //                           >
// // // // // //                             Late
// // // // // //                           </Button>
// // // // // //                         </div>
// // // // // //                       </div>
// // // // // //                     )}
// // // // // //                   </td>
// // // // // //                 </tr>
// // // // // //               ))}
// // // // // //               {records.length === 0 && (
// // // // // //                 <tr>
// // // // // //                   <td className="px-6 py-12 text-center text-muted-foreground" colSpan={7}>
// // // // // //                     <div className="flex flex-col items-center gap-2">
// // // // // //                       <Users className="h-8 w-8 text-muted-foreground/50" />
// // // // // //                       <span>No attendance records found for the selected filters.</span>
// // // // // //                     </div>
// // // // // //                   </td>
// // // // // //                 </tr>
// // // // // //               )}
// // // // // //             </tbody>
// // // // // //           </table>
// // // // // //         </div>
// // // // // //       </Card>

// // // // // //       <Dialog open={showNotMarkedModal} onOpenChange={setShowNotMarkedModal}>
// // // // // //         <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
// // // // // //           <DialogHeader>
// // // // // //             <DialogTitle className="flex items-center gap-2">
// // // // // //               <User className="h-5 w-5" />
// // // // // //               Not Marked Attendance ({notMarkedData?.count ?? 0})
// // // // // //             </DialogTitle>
// // // // // //             <DialogDescription>
// // // // // //               People who haven't marked their attendance yet. You can mark their attendance manually.
// // // // // //             </DialogDescription>
// // // // // //             <div className="mt-3">
// // // // // //               <Button
// // // // // //                 variant="outline"
// // // // // //                 className="h-8 px-3 text-sm bg-transparent"
// // // // // //                 onClick={exportNotMarkedCsv}
// // // // // //                 disabled={!notMarkedPeople.length}
// // // // // //               >
// // // // // //                 Export Not Marked (CSV)
// // // // // //               </Button>
// // // // // //             </div>
// // // // // //           </DialogHeader>

// // // // // //           <div className="overflow-y-auto max-h-[60vh]">
// // // // // //             {!notMarkedData ? (
// // // // // //               <div className="text-center py-8">
// // // // // //                 <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
// // // // // //                 <p className="text-lg font-medium">Loading...</p>
// // // // // //                 <p className="text-muted-foreground">Fetching people who haven't marked attendance.</p>
// // // // // //               </div>
// // // // // //             ) : notMarkedPeople.length === 0 ? (
// // // // // //               <div className="text-center py-8">
// // // // // //                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
// // // // // //                 <p className="text-lg font-medium">All attendance marked!</p>
// // // // // //                 <p className="text-muted-foreground">Everyone has marked their attendance for today.</p>
// // // // // //               </div>
// // // // // //             ) : (
// // // // // //               <div className="space-y-4">
// // // // // //                 {notMarkedPeople.map((person: {
// // // // // //                   personId: string
// // // // // //                   personType: "staff" | "student"
// // // // // //                   personName: string
// // // // // //                   imageUrl?: string
// // // // // //                   employeeCode?: string
// // // // // //                   rollNumber?: string
// // // // // //                   classLevel?: string
// // // // // //                   department: string
// // // // // //                   role: string
// // // // // //                   shift: string
// // // // // //                 }) => (
// // // // // //                   <div
// // // // // //                     key={person.personId}
// // // // // //                     className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
// // // // // //                   >
// // // // // //                     <div className="flex items-center gap-4">
// // // // // //                       <div
// // // // // //                         className="cursor-pointer"
// // // // // //                         onClick={() => setSelectedPerson({ personId: person.personId, personType: person.personType })}
// // // // // //                       >
// // // // // //                         {person.imageUrl ? (
// // // // // //                           <img
// // // // // //                             src={person.imageUrl || "/placeholder.svg"}
// // // // // //                             alt={person.personName}
// // // // // //                             className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors"
// // // // // //                             onError={(e) => {
// // // // // //                               e.currentTarget.style.display = "none"
// // // // // //                               const next = e.currentTarget.nextElementSibling;
// // // // // //                               if (next) (next as HTMLElement).style.display = "flex";
// // // // // //                             }}
// // // // // //                           />
// // // // // //                         ) : null}
// // // // // //                         <div
// // // // // //                           className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors ${person.imageUrl ? "hidden" : "flex"}`}
// // // // // //                         >
// // // // // //                           <User className="h-6 w-6 text-muted-foreground" />
// // // // // //                         </div>
// // // // // //                       </div>

// // // // // //                       <div className="space-y-1">
// // // // // //                         <div className="font-semibold">{person.personName}</div>
// // // // // //                         <div className="text-sm text-muted-foreground">
// // // // // //                           {person.personType === "staff"
// // // // // //                             ? `Employee Code: ${person.employeeCode || "N/A"}`
// // // // // //                             : `Roll Number: ${person.rollNumber || "N/A"}`}
// // // // // //                         </div>
// // // // // //                         <div className="text-xs text-muted-foreground">
// // // // // //                           {person.department} • {person.role} • {person.shift} Shift
// // // // // //                           {person.personType === "student" && person.classLevel && ` • ${person.classLevel}`}
// // // // // //                         </div>
// // // // // //                       </div>
// // // // // //                     </div>

// // // // // //                     <div className="flex gap-2">
// // // // // //                       <Button
// // // // // //                         size="sm"
// // // // // //                         className="bg-green-600 text-white hover:bg-green-700 shadow-sm"
// // // // // //                         onClick={() => handleManualMark(person.personId, person.personType, "present")}
// // // // // //                       >
// // // // // //                         Present
// // // // // //                       </Button>
// // // // // //                       <Button
// // // // // //                         size="sm"
// // // // // //                         variant="outline"
// // // // // //                         className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
// // // // // //                         onClick={() => handleManualMark(person.personId, person.personType, "absent")}
// // // // // //                       >
// // // // // //                         Absent
// // // // // //                       </Button>
// // // // // //                       <Button
// // // // // //                         size="sm"
// // // // // //                         variant="outline"
// // // // // //                         className="border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
// // // // // //                         onClick={() => handleManualMark(person.personId, person.personType, "late")}
// // // // // //                       >
// // // // // //                         Late
// // // // // //                       </Button>
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 ))}
// // // // // //               </div>
// // // // // //             )}
// // // // // //           </div>
// // // // // //         </DialogContent>
// // // // // //       </Dialog>

// // // // // //       <PersonDetailsModal
// // // // // //         isOpen={!!selectedPerson}
// // // // // //         onClose={() => setSelectedPerson(null)}
// // // // // //         personId={selectedPerson?.personId || ""}
// // // // // //         personType={selectedPerson?.personType || "staff"}
// // // // // //       />
// // // // // //     </div>
// // // // // //   )
// // // // // // }



// // // // // "use client"

// // // // // import useSWR from "swr"
// // // // // import { AttendanceFilters, type AttendanceFiltersState } from "@/components/attendance-filters"
// // // // // import { ExportAttendance } from "@/components/export-attendance"
// // // // // import type { Department, Role, Shift, AttendanceRecord } from "@/lib/types"
// // // // // import { Button } from "@/components/ui/button"
// // // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // // // // import { PersonDetailsModal } from "@/components/person-details-modal"
// // // // // import { User, Users, UserCheck, UserX, Clock, RefreshCw, AlertCircle, CheckCircle, Wifi, WifiOff } from "lucide-react"
// // // // // import { useMemo, useState, useEffect } from "react"
// // // // // import { Alert, AlertDescription } from "@/components/ui/alert"
// // // // // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// // // // // import { realtimeClient } from "@/lib/realtime-client"
// // // // // import { getStoredUser } from "@/lib/auth" // import user helper
// // // // // import { useToast } from "@/hooks/use-toast"
// // // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // // // // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // // // // export default function AttendancePage() {
// // // // //   const [filters, setFilters] = useState<AttendanceFiltersState>({
// // // // //     date: new Date().toISOString().slice(0, 10), // Default to today
// // // // //     status: "all", // Added default status filter
// // // // //     personType: "all", // Added default personType filter
// // // // //   })
// // // // //   const [selectedPerson, setSelectedPerson] = useState<{
// // // // //     personId: string
// // // // //     personType: "staff" | "student"
// // // // //   } | null>(null)
// // // // //   const [isAutoMarking, setIsAutoMarking] = useState(false)
// // // // //   const [attendanceMessage, setAttendanceMessage] = useState<{
// // // // //     type: "success" | "error" | "warning"
// // // // //     message: string
// // // // //   } | null>(null)
// // // // //   const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
// // // // //   const [showNotMarkedModal, setShowNotMarkedModal] = useState(false)
// // // // //   const [isConnected, setIsConnected] = useState(false)
// // // // //   const [realtimeUpdates, setRealtimeUpdates] = useState(0)
// // // // //   const [currentUser, setCurrentUser] = useState<any>(null) // track current user
// // // // //   const { toast } = useToast()

// // // // //   useEffect(() => {
// // // // //     function onAttendanceUpdate(data: any) {
// // // // //       console.log("[v0] Real-time attendance update received:", data)
// // // // //       setRealtimeUpdates((prev) => prev + 1)

// // // // //       toast({
// // // // //         title: "Attendance updated",
// // // // //         description: `${data.personName} marked as ${String(data.status || "").toUpperCase()}`,
// // // // //       })

// // // // //       mutate()
// // // // //       mutateNotMarked()
// // // // //     }

// // // // //     function onStatsUpdate(stats: any) {
// // // // //       console.log("[v0] Real-time attendance stats:", stats)
// // // // //       // Refresh data when stats update
// // // // //       mutate()
// // // // //       mutateNotMarked()
// // // // //     }

// // // // //     function onAutoMarkComplete(data: any) {
// // // // //       console.log("[v0] Auto-mark complete:", data)
// // // // //       if (data.markedAbsent > 0) {
// // // // //         toast({
// // // // //           title: "Auto-mark finished",
// // // // //           description: `Auto-marked ${data.markedAbsent} people as absent`,
// // // // //           variant: "default",
// // // // //         })
// // // // //         mutate()
// // // // //         mutateNotMarked()
// // // // //       }
// // // // //     }

// // // // //     // Set up event listeners
// // // // //     realtimeClient.on("attendance_update", onAttendanceUpdate)
// // // // //     realtimeClient.on("stats_update", onStatsUpdate)
// // // // //     realtimeClient.on("auto_mark_complete", onAutoMarkComplete)

// // // // //     // Connect to real-time updates
// // // // //     realtimeClient.connect()
// // // // //     setIsConnected(true)
// // // // //     console.log("[v0] Real-time client connected to attendance page")

// // // // //     return () => {
// // // // //       realtimeClient.off("attendance_update", onAttendanceUpdate)
// // // // //       realtimeClient.off("stats_update", onStatsUpdate)
// // // // //       realtimeClient.off("auto_mark_complete", onAutoMarkComplete)
// // // // //       realtimeClient.disconnect()
// // // // //       setIsConnected(false)
// // // // //     }
// // // // //   }, [toast])

// // // // //   useEffect(() => {
// // // // //     const checkAndAutoMarkAbsent = async () => {
// // // // //       try {
// // // // //         const res = await fetch("/api/attendance/auto-mark", {
// // // // //           method: "POST",
// // // // //           headers: { "Content-Type": "application/json" },
// // // // //         })
// // // // //         const result = await res.json()

// // // // //         if (res.ok && result.markedAbsent > 0) {
// // // // //           setAttendanceMessage({
// // // // //             type: "warning",
// // // // //             message: `Automatically marked ${result.markedAbsent} people as absent due to shift time closure`,
// // // // //           })
// // // // //           mutate()

// // // // //           setTimeout(() => setAttendanceMessage(null), 8000)
// // // // //         }
// // // // //       } catch (error) {
// // // // //         console.error("Auto-mark check failed:", error)
// // // // //       }
// // // // //     }

// // // // //     checkAndAutoMarkAbsent()

// // // // //     const interval = setInterval(checkAndAutoMarkAbsent, 300000)

// // // // //     return () => clearInterval(interval)
// // // // //   }, [])

// // // // //   useEffect(() => {
// // // // //     setCurrentUser(getStoredUser())
// // // // //   }, [])

// // // // //   const { data: shiftSettingsData } = useSWR(
// // // // //     currentUser?.institutionName
// // // // //       ? `/api/shifts?institutionName=${encodeURIComponent(currentUser.institutionName)}`
// // // // //       : null,
// // // // //     fetcher,
// // // // //   )
// // // // //   const shiftSettings: Array<{ name: string; start: string; end: string }> = shiftSettingsData?.shifts || []

// // // // //   const normShift = (s?: string | null) => {
// // // // //     if (!s) return null
// // // // //     const lower = s.toLowerCase()
// // // // //     if (lower.startsWith("morn")) return "Morning"
// // // // //     if (lower.startsWith("even")) return "Evening"
// // // // //     if (lower.startsWith("nig")) return "Night"
// // // // //     return s
// // // // //   }
// // // // //   const formatShiftWindow = (s?: string | null) => {
// // // // //     const key = normShift(s)
// // // // //     if (!key) return "N/A"
// // // // //     const fromSettings = shiftSettings.find((x) => (x.name?.toLowerCase?.() || "").includes(key.toLowerCase()))
// // // // //     if (fromSettings) return `${fromSettings.start} - ${fromSettings.end}`
// // // // //     try {
// // // // //       const { SHIFT_TIMINGS } = require("@/lib/constants")
// // // // //       const t = SHIFT_TIMINGS[key as keyof typeof SHIFT_TIMINGS]
// // // // //       return t ? `${t.start} - ${t.end}` : "N/A"
// // // // //     } catch {
// // // // //       return "N/A"
// // // // //     }
// // // // //   }
// // // // //   const formatAutoAbsent = (s?: string | null) => {
// // // // //     const key = normShift(s)
// // // // //     if (!key) return "N/A"
// // // // //     try {
// // // // //       const { ABSENT_THRESHOLDS } = require("@/lib/constants")
// // // // //       const t = ABSENT_THRESHOLDS[key as keyof typeof ABSENT_THRESHOLDS]
// // // // //       return t || "N/A"
// // // // //     } catch {
// // // // //       return "N/A"
// // // // //     }
// // // // //   }

// // // // //   const params = new URLSearchParams()
// // // // //   if (filters.department && filters.department !== "all") params.set("department", filters.department)
// // // // //   if (filters.role && filters.role !== "all") params.set("role", filters.role)
// // // // //   if (filters.shift && filters.shift !== "all") params.set("shift", filters.shift)
// // // // //   if (filters.status && filters.status !== "all") params.set("status", filters.status)
// // // // //   if (filters.date) params.set("date", filters.date)
// // // // //   if (filters.personType && filters.personType !== "all") params.set("personType", filters.personType)
// // // // //   if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
// // // // //     params.set("institutionName", currentUser.institutionName)
// // // // //   }

// // // // //   const { data, mutate } = useSWR<{
// // // // //     records: (AttendanceRecord & {
// // // // //       personName?: string
// // // // //       imageUrl?: string
// // // // //       employeeCode?: string
// // // // //       rollNumber?: string
// // // // //       classLevel?: string
// // // // //     })[]
// // // // //     departments: Department[]
// // // // //     roles: Role[]
// // // // //     shifts: Shift[]
// // // // //     totalCounts: {
// // // // //       totalPeople: number
// // // // //       present: number
// // // // //       absent: number
// // // // //       late: number
// // // // //     }
// // // // //   }>(`/api/attendance?${params.toString()}`, fetcher)

// // // // //   const notMarkedUrlParams = new URLSearchParams()
// // // // //   if (filters.date) notMarkedUrlParams.set("date", filters.date)
// // // // //   if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
// // // // //     notMarkedUrlParams.set("institutionName", currentUser.institutionName)
// // // // //   }
// // // // //   const { data: notMarkedData, mutate: mutateNotMarked } = useSWR(
// // // // //     `/api/attendance/not-marked?${notMarkedUrlParams.toString()}`,
// // // // //     fetcher,
// // // // //   )

// // // // //   const records = data?.records ?? []
// // // // //   const departments = data?.departments ?? []
// // // // //   const roles = data?.roles ?? []
// // // // //   const shifts = data?.shifts ?? []
// // // // //   const totalCounts = data?.totalCounts ?? { totalPeople: 0, present: 0, absent: 0, late: 0 }

// // // // //   const notMarkedPeople = notMarkedData?.notMarkedPeople ?? []

// // // // //   const counts = useMemo(
// // // // //     () => ({
// // // // //       present: records.filter((r) => r.status === "present").length,
// // // // //       absent: records.filter((r) => r.status === "absent").length,
// // // // //       late: records.filter((r) => r.status === "late").length,
// // // // //     }),
// // // // //     [records],
// // // // //   )

// // // // //   async function mark(personId: string, personType: "staff" | "student", status: "present" | "absent" | "late") {
// // // // //     const body = { personId, personType, status, date: filters.date }
// // // // //     const res = await fetch("/api/attendance", {
// // // // //       method: "POST",
// // // // //       headers: { "Content-Type": "application/json" },
// // // // //       body: JSON.stringify(body),
// // // // //     })

// // // // //     const result = await res.json()

// // // // //     if (res.status === 409) {
// // // // //       setAttendanceMessage({
// // // // //         type: "warning",
// // // // //         message: result.message,
// // // // //       })
// // // // //       toast({ title: "Already marked", description: result.message })
// // // // //     } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
// // // // //       setAttendanceMessage({
// // // // //         type: "error",
// // // // //         message: result.message,
// // // // //       })
// // // // //       toast({ title: "Outside shift hours", description: result.message, variant: "destructive" })
// // // // //     } else if (!res.ok) {
// // // // //       setAttendanceMessage({
// // // // //         type: "error",
// // // // //         message: "Failed to mark attendance",
// // // // //       })
// // // // //       toast({ title: "Failed to mark", description: "Please try again.", variant: "destructive" })
// // // // //     } else {
// // // // //       setAttendanceMessage({
// // // // //         type: "success",
// // // // //         message: result.message,
// // // // //       })
// // // // //       toast({ title: "Success", description: result.message })
// // // // //       mutate()
// // // // //     }

// // // // //     setTimeout(() => setAttendanceMessage(null), 5000)
// // // // //   }

// // // // //   async function autoMarkAbsent() {
// // // // //     setIsAutoMarking(true)
// // // // //     try {
// // // // //       const res = await fetch("/api/attendance/auto-mark", {
// // // // //         method: "POST",
// // // // //         headers: { "Content-Type": "application/json" },
// // // // //       })
// // // // //       const result = await res.json()
// // // // //       if (res.ok) {
// // // // //         setAttendanceMessage({
// // // // //           type: "success",
// // // // //           message: result.message,
// // // // //         })
// // // // //         toast({ title: "Auto-mark requested", description: result.message })
// // // // //         mutate()
// // // // //       } else {
// // // // //         setAttendanceMessage({
// // // // //           type: "error",
// // // // //           message: "Failed to auto-mark attendance",
// // // // //         })
// // // // //         toast({ title: "Auto-mark failed", description: "Please try again.", variant: "destructive" })
// // // // //       }
// // // // //     } catch (error) {
// // // // //       setAttendanceMessage({
// // // // //         type: "error",
// // // // //         message: "Error auto-marking attendance",
// // // // //       })
// // // // //       toast({ title: "Error auto-marking", description: "Please try again.", variant: "destructive" })
// // // // //     } finally {
// // // // //       setIsAutoMarking(false)
// // // // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // // // //     }
// // // // //   }

// // // // //   async function updateAttendanceStatus(
// // // // //     recordId: string,
// // // // //     personId: string,
// // // // //     personType: "staff" | "student",
// // // // //     newStatus: "present" | "absent" | "late",
// // // // //   ) {
// // // // //     setUpdatingStatus(recordId)
// // // // //     try {
// // // // //       const res = await fetch("/api/attendance", {
// // // // //         method: "PUT",
// // // // //         headers: { "Content-Type": "application/json" },
// // // // //         body: JSON.stringify({
// // // // //           recordId,
// // // // //           personId,
// // // // //           personType,
// // // // //           status: newStatus,
// // // // //           date: filters.date,
// // // // //         }),
// // // // //       })

// // // // //       const result = await res.json()
// // // // //       console.log("[v0] Manual mark response:", result)

// // // // //       if (res.ok) {
// // // // //         setAttendanceMessage({
// // // // //           type: "success",
// // // // //           message: `Attendance status updated to ${newStatus.toUpperCase()} successfully`,
// // // // //         })
// // // // //         toast({ title: "Status updated", description: `Set to ${newStatus.toUpperCase()}` })
// // // // //         mutate()
// // // // //       } else {
// // // // //         setAttendanceMessage({
// // // // //           type: "error",
// // // // //           message: result.message || "Failed to update attendance status",
// // // // //         })
// // // // //         toast({ title: "Update failed", description: result.message || "Please try again.", variant: "destructive" })
// // // // //       }
// // // // //     } catch (error) {
// // // // //       setAttendanceMessage({
// // // // //         type: "error",
// // // // //         message: "Error updating attendance status",
// // // // //       })
// // // // //       toast({ title: "Error updating", description: "Please try again.", variant: "destructive" })
// // // // //     } finally {
// // // // //       setUpdatingStatus(null)
// // // // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // // // //     }
// // // // //   }

// // // // //   const isAttendanceMarked = (record: any) => {
// // // // //     return record.status && record.timestamp
// // // // //   }

// // // // //   async function handleManualMark(
// // // // //     personId: string,
// // // // //     personType: "staff" | "student",
// // // // //     status: "present" | "absent" | "late",
// // // // //   ) {
// // // // //     console.log("[v0] Manual marking:", { personId, personType, status })

// // // // //     try {
// // // // //       const body = { personId, personType, status, date: filters.date }
// // // // //       const res = await fetch("/api/attendance", {
// // // // //         method: "POST",
// // // // //         headers: { "Content-Type": "application/json" },
// // // // //         body: JSON.stringify(body),
// // // // //       })

// // // // //       const result = await res.json()
// // // // //       console.log("[v0] Manual mark response:", result)

// // // // //       if (res.status === 409) {
// // // // //         setAttendanceMessage({
// // // // //           type: "warning",
// // // // //           message: result.message,
// // // // //         })
// // // // //         toast({ title: "Already marked", description: result.message })
// // // // //       } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
// // // // //         setAttendanceMessage({
// // // // //           type: "error",
// // // // //           message: result.message,
// // // // //         })
// // // // //         toast({ title: "Outside shift hours", description: result.message, variant: "destructive" })
// // // // //       } else if (!res.ok) {
// // // // //         setAttendanceMessage({
// // // // //           type: "error",
// // // // //           message: "Failed to mark attendance",
// // // // //         })
// // // // //         toast({ title: "Failed to mark", description: "Please try again.", variant: "destructive" })
// // // // //       } else {
// // // // //         setAttendanceMessage({
// // // // //           type: "success",
// // // // //           message: result.message,
// // // // //         })
// // // // //         toast({ title: "Success", description: result.message })
// // // // //         mutate()
// // // // //         mutateNotMarked()
// // // // //       }

// // // // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // // // //     } catch (error) {
// // // // //       console.error("[v0] Manual mark error:", error)
// // // // //       setAttendanceMessage({
// // // // //         type: "error",
// // // // //         message: "Error marking attendance",
// // // // //       })
// // // // //       toast({ title: "Error marking", description: "Please try again.", variant: "destructive" })
// // // // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // // // //     }
// // // // //   }

// // // // //   function exportNotMarkedCsv() {
// // // // //     if (!notMarkedPeople.length) {
// // // // //       alert("No data to export")
// // // // //       return
// // // // //     }
// // // // //     const headers = ["Name", "Type", "Employee Code/Roll", "Department", "Role", "Shift", "Class Level"]
// // // // //     const rows = notMarkedPeople.map((p) => [
// // // // //       p.personName || "Unknown",
// // // // //       p.personType,
// // // // //       p.personType === "staff" ? p.employeeCode || "N/A" : p.rollNumber || "N/A",
// // // // //       p.department || "N/A",
// // // // //       p.role || "N/A",
// // // // //       p.shift || "N/A",
// // // // //       p.personType === "student" ? p.classLevel || "N/A" : "N/A",
// // // // //     ])

// // // // //     const csv = [headers, ...rows]
// // // // //       .map((r) =>
// // // // //         r
// // // // //           .map((field) => {
// // // // //             const s = String(field ?? "")
// // // // //             if (s.includes(",") || s.includes('"') || s.includes("\n")) {
// // // // //               return `"${s.replace(/"/g, '""')}"`
// // // // //             }
// // // // //             return s
// // // // //           })
// // // // //           .join(","),
// // // // //       )
// // // // //       .join("\n")

// // // // //     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
// // // // //     const url = URL.createObjectURL(blob)
// // // // //     const a = document.createElement("a")
// // // // //     a.href = url
// // // // //     const datePart = notMarkedData?.date || new Date().toISOString().slice(0, 10)
// // // // //     a.download = `not-marked-${datePart}.csv`
// // // // //     document.body.appendChild(a)
// // // // //     a.click()
// // // // //     document.body.removeChild(a)
// // // // //     URL.revokeObjectURL(url)
// // // // //   }

// // // // //   return (
// // // // //     <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8">
// // // // //       <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-card rounded-xl border shadow-sm">
// // // // //         <div className="space-y-2">
// // // // //           {currentUser?.institutionName && (
// // // // //             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
// // // // //               {currentUser.institutionName}
// // // // //             </div>
// // // // //           )}
// // // // //           <div className="flex items-center gap-3">
// // // // //             <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
// // // // //               Attendance Management
// // // // //             </h1>
// // // // //             <div className="flex items-center gap-2">
// // // // //               {isConnected ? (
// // // // //                 <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
// // // // //                   <Wifi className="h-3 w-3" />
// // // // //                   Live
// // // // //                 </div>
// // // // //               ) : (
// // // // //                 <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
// // // // //                   <WifiOff className="h-3 w-3" />
// // // // //                   Offline
// // // // //                 </div>
// // // // //               )}
// // // // //               {realtimeUpdates > 0 && (
// // // // //                 <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
// // // // //                   {realtimeUpdates} updates
// // // // //                 </div>
// // // // //               )}
// // // // //             </div>
// // // // //           </div>
// // // // //           <p className="text-muted-foreground leading-relaxed max-w-2xl">
// // // // //             View and manage attendance. Auto-absent thresholds and shift windows follow your institution’s shift
// // // // //             settings.
// // // // //             {isConnected && " Real-time updates enabled via Face Recognition."}
// // // // //           </p>
// // // // //         </div>
// // // // //         <div className="flex flex-col sm:flex-row gap-3">
// // // // //           <Button
// // // // //             onClick={autoMarkAbsent}
// // // // //             disabled={isAutoMarking}
// // // // //             variant="outline"
// // // // //             className="flex items-center gap-2 bg-accent/10 border-accent/20 hover:bg-accent/20 text-accent font-medium"
// // // // //           >
// // // // //             <RefreshCw className={`h-4 w-4 ${isAutoMarking ? "animate-spin" : ""}`} />
// // // // //             {isAutoMarking ? "Auto Marking..." : "Manual Auto Mark"}
// // // // //           </Button>
// // // // //           <ExportAttendance
// // // // //             records={records}
// // // // //             filters={{
// // // // //               department: filters.department,
// // // // //               role: filters.role,
// // // // //               shift: filters.shift,
// // // // //               status: filters.status,
// // // // //               date: filters.date,
// // // // //               personType: filters.personType,
// // // // //             }}
// // // // //           />
// // // // //         </div>
// // // // //       </header>

// // // // //       {attendanceMessage && (
// // // // //         <Alert
// // // // //           className={`${
// // // // //             attendanceMessage.type === "success"
// // // // //               ? "border-green-200 bg-green-50"
// // // // //               : attendanceMessage.type === "warning"
// // // // //                 ? "border-amber-200 bg-amber-50"
// // // // //                 : "border-red-200 bg-red-50"
// // // // //           }`}
// // // // //         >
// // // // //           {attendanceMessage.type === "success" ? (
// // // // //             <CheckCircle className="h-4 w-4 text-green-600" />
// // // // //           ) : (
// // // // //             <AlertCircle className="h-4 w-4 text-amber-600" />
// // // // //           )}
// // // // //           <AlertDescription
// // // // //             className={`${
// // // // //               attendanceMessage.type === "success"
// // // // //                 ? "text-green-800"
// // // // //                 : attendanceMessage.type === "warning"
// // // // //                   ? "text-amber-800"
// // // // //                   : "text-red-800"
// // // // //             }`}
// // // // //           >
// // // // //             {attendanceMessage.message}
// // // // //             {attendanceMessage.message.includes("Face Recognition") && (
// // // // //               <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
// // // // //                 <Wifi className="h-3 w-3" />
// // // // //                 Real-time
// // // // //               </span>
// // // // //             )}
// // // // //           </AlertDescription>
// // // // //         </Alert>
// // // // //       )}

// // // // //       <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
// // // // //         <CardContent className="pt-6">
// // // // //           <AttendanceFilters
// // // // //             departments={departments}
// // // // //             roles={roles}
// // // // //             shifts={shifts}
// // // // //             value={filters}
// // // // //             onChange={setFilters}
// // // // //           />
// // // // //         </CardContent>
// // // // //       </Card>

// // // // //       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
// // // // //         <Card className="bg-gradient-to-br from-card to-muted/20 border-0 shadow-sm hover:shadow-md transition-shadow">
// // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // //             <CardTitle className="text-sm font-semibold text-muted-foreground">Total People</CardTitle>
// // // // //             <Users className="h-5 w-5 text-primary" />
// // // // //           </CardHeader>
// // // // //           <CardContent>
// // // // //             <div className="text-3xl font-bold text-foreground">{totalCounts.totalPeople}</div>
// // // // //             <p className="text-xs text-muted-foreground mt-1">All registered people</p>
// // // // //           </CardContent>
// // // // //         </Card>

// // // // //         <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
// // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // //             <CardTitle className="text-sm font-semibold text-green-700">Present</CardTitle>
// // // // //             <UserCheck className="h-5 w-5 text-green-600" />
// // // // //           </CardHeader>
// // // // //           <CardContent>
// // // // //             <div className="text-3xl font-bold text-green-700">{totalCounts.present}</div>
// // // // //             <p className="text-xs text-green-600 mt-1">Filtered: {counts.present}</p>
// // // // //           </CardContent>
// // // // //         </Card>

// // // // //         <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-sm hover:shadow-md transition-shadow">
// // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // //             <CardTitle className="text-sm font-semibold text-red-700">Absent</CardTitle>
// // // // //             <UserX className="h-5 w-5 text-red-600" />
// // // // //           </CardHeader>
// // // // //           <CardContent>
// // // // //             <div className="text-3xl font-bold text-red-700">{totalCounts.absent}</div>
// // // // //             <p className="text-xs text-red-600 mt-1">Filtered: {counts.absent}</p>
// // // // //           </CardContent>
// // // // //         </Card>

// // // // //         <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
// // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // //             <CardTitle className="text-sm font-semibold text-amber-700">Late</CardTitle>
// // // // //             <Clock className="h-5 w-5 text-amber-600" />
// // // // //           </CardHeader>
// // // // //           <CardContent>
// // // // //             <div className="text-3xl font-bold text-amber-700">{totalCounts.late}</div>
// // // // //             <p className="text-xs text-amber-600 mt-1">Filtered: {counts.late}</p>
// // // // //           </CardContent>
// // // // //         </Card>

// // // // //         <Card
// // // // //           className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
// // // // //           onClick={() => setShowNotMarkedModal(true)}
// // // // //         >
// // // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // // //             <CardTitle className="text-sm font-semibold text-slate-700">Not Marked</CardTitle>
// // // // //             <User className="h-5 w-5 text-slate-600" />
// // // // //           </CardHeader>
// // // // //           <CardContent>
// // // // //             <div className="text-3xl font-bold text-slate-700">{notMarkedData?.count ?? 0}</div>
// // // // //             <p className="text-xs text-slate-600 mt-1">Click to view & mark</p>
// // // // //           </CardContent>
// // // // //         </Card>
// // // // //       </div>

// // // // //       <Card className="shadow-sm border-0 overflow-hidden">
// // // // //         <div className="overflow-x-auto">
// // // // //           <table className="min-w-full">
// // // // //             <thead className="bg-gradient-to-r from-muted/50 to-muted/30">
// // // // //               <tr>
// // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
// // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name & Code/Roll</th>
// // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type & Class Level</th>
// // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department & Role</th>
// // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Shift & Timing</th>
// // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status & Time</th>
// // // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
// // // // //               </tr>
// // // // //             </thead>
// // // // //             <tbody className="divide-y divide-border/50">
// // // // //               {records.map((r) => {
// // // // //                 const shiftWindow = formatShiftWindow(r.shift)
// // // // //                 const autoAbsentAt = formatAutoAbsent(r.shift)
// // // // //                 const canManage = currentUser?.role === "Admin" || currentUser?.role === "SuperAdmin"
// // // // //                 return (
// // // // //                   <tr key={r.id} className="hover:bg-muted/30 transition-colors">
// // // // //                     <td className="px-6 py-4">
// // // // //                       <div
// // // // //                         className="cursor-pointer"
// // // // //                         onClick={() => setSelectedPerson({ personId: r.personId, personType: r.personType })}
// // // // //                       >
// // // // //                         {r.imageUrl ? (
// // // // //                           <img
// // // // //                             src={r.imageUrl || "/placeholder.svg"}
// // // // //                             alt={r.personName || "Person"}
// // // // //                             className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors shadow-sm"
// // // // //                           />
// // // // //                         ) : (
// // // // //                           <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors shadow-sm">
// // // // //                             <User className="h-6 w-6 text-muted-foreground" />
// // // // //                           </div>
// // // // //                         )}
// // // // //                       </div>
// // // // //                     </td>

// // // // //                     <td className="px-6 py-4">
// // // // //                       <div className="space-y-1">
// // // // //                         <div className="text-base font-semibold text-foreground">{r.personName || "Unknown"}</div>
// // // // //                         <div className="text-sm text-muted-foreground font-medium">
// // // // //                           {r.personType === "staff"
// // // // //                             ? `Code: ${r.employeeCode || "N/A"}`
// // // // //                             : `Roll: ${r.rollNumber || "N/A"}`}
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     </td>

// // // // //                     <td className="px-6 py-4">
// // // // //                       <div className="space-y-1">
// // // // //                         <div className="text-sm font-medium capitalize text-foreground">{r.personType}</div>
// // // // //                         {r.personType === "student" && (
// // // // //                           <div className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md inline-block">
// // // // //                             {r.classLevel || "N/A"}
// // // // //                           </div>
// // // // //                         )}
// // // // //                         {r.personType === "staff" && (
// // // // //                           <div className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md inline-block">
// // // // //                             Staff Member
// // // // //                           </div>
// // // // //                         )}
// // // // //                       </div>
// // // // //                     </td>

// // // // //                     <td className="px-6 py-4">
// // // // //                       <div className="space-y-1">
// // // // //                         <div className="text-sm font-medium text-foreground">{r.department}</div>
// // // // //                         <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md inline-block">
// // // // //                           {r.role}
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     </td>

// // // // //                     <td className="px-6 py-4">
// // // // //                       <div className="space-y-2">
// // // // //                         <div className="text-sm font-medium text-foreground">{`${normShift(r.shift) || r.shift} Shift`}</div>
// // // // //                         <div className="text-xs text-muted-foreground">{shiftWindow}</div>
// // // // //                         <div className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-md inline-block">
// // // // //                           Auto-absent: {autoAbsentAt}
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     </td>

// // // // //                     <td className="px-6 py-4">
// // // // //                       {isAttendanceMarked(r) ? (
// // // // //                         <div className="space-y-2">
// // // // //                           <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
// // // // //                             <CheckCircle className="h-4 w-4 text-green-600" />
// // // // //                             <span className="font-medium">Marked as {r.status?.toUpperCase()}</span>
// // // // //                           </div>
// // // // //                           <div className="text-xs text-muted-foreground">
// // // // //                             {r.timestamp && new Date(r.timestamp).toLocaleString()}
// // // // //                           </div>
// // // // //                         </div>
// // // // //                       ) : (
// // // // //                         <div className="text-sm text-muted-foreground italic">Not marked yet</div>
// // // // //                       )}
// // // // //                     </td>

// // // // //                     <td className="px-6 py-4">
// // // // //                       {isAttendanceMarked(r) ? (
// // // // //                         canManage ? (
// // // // //                           <div className="w-40">
// // // // //                             <Select
// // // // //                               onValueChange={(v) =>
// // // // //                                 updateAttendanceStatus(r.id as string, r.personId, r.personType, v as any)
// // // // //                               }
// // // // //                             >
// // // // //                               <SelectTrigger>
// // // // //                                 <SelectValue placeholder={`Change: ${r.status?.toUpperCase()}`} />
// // // // //                               </SelectTrigger>
// // // // //                               <SelectContent>
// // // // //                                 <SelectItem value="present">Present</SelectItem>
// // // // //                                 <SelectItem value="absent">Absent</SelectItem>
// // // // //                                 <SelectItem value="late">Late</SelectItem>
// // // // //                               </SelectContent>
// // // // //                             </Select>
// // // // //                             {updatingStatus === r.id && (
// // // // //                               <div className="text-xs text-muted-foreground mt-1">Updating...</div>
// // // // //                             )}
// // // // //                           </div>
// // // // //                         ) : (
// // // // //                           <div className="text-xs text-muted-foreground">No actions</div>
// // // // //                         )
// // // // //                       ) : (
// // // // //                         <div className="flex flex-col gap-2">
// // // // //                           <Button
// // // // //                             size="sm"
// // // // //                             className="bg-green-600 text-white hover:bg-green-700 shadow-sm font-medium"
// // // // //                             onClick={() => mark(r.personId, r.personType, "present")}
// // // // //                           >
// // // // //                             Present
// // // // //                           </Button>
// // // // //                           <div className="flex gap-2">
// // // // //                             <Button
// // // // //                               size="sm"
// // // // //                               variant="outline"
// // // // //                               className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-medium bg-transparent"
// // // // //                               onClick={() => mark(r.personId, r.personType, "absent")}
// // // // //                             >
// // // // //                               Absent
// // // // //                             </Button>
// // // // //                             <Button
// // // // //                               size="sm"
// // // // //                               variant="outline"
// // // // //                               className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 font-medium bg-transparent"
// // // // //                               onClick={() => mark(r.personId, r.personType, "late")}
// // // // //                             >
// // // // //                               Late
// // // // //                             </Button>
// // // // //                           </div>
// // // // //                         </div>
// // // // //                       )}
// // // // //                     </td>
// // // // //                   </tr>
// // // // //                 )
// // // // //               })}
// // // // //               {records.length === 0 && (
// // // // //                 <tr>
// // // // //                   <td className="px-6 py-12 text-center text-muted-foreground" colSpan={7}>
// // // // //                     <div className="flex flex-col items-center gap-2">
// // // // //                       <Users className="h-8 w-8 text-muted-foreground/50" />
// // // // //                       <span>No attendance records found for the selected filters.</span>
// // // // //                     </div>
// // // // //                   </td>
// // // // //                 </tr>
// // // // //               )}
// // // // //             </tbody>
// // // // //           </table>
// // // // //         </div>
// // // // //       </Card>

// // // // //       <Dialog open={showNotMarkedModal} onOpenChange={setShowNotMarkedModal}>
// // // // //         <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
// // // // //           <DialogHeader>
// // // // //             <DialogTitle className="flex items-center gap-2">
// // // // //               <User className="h-5 w-5" />
// // // // //               Not Marked Attendance ({notMarkedData?.count ?? 0})
// // // // //             </DialogTitle>
// // // // //             <DialogDescription>
// // // // //               People who haven't marked their attendance yet. You can mark their attendance manually.
// // // // //             </DialogDescription>
// // // // //             <div className="mt-3">
// // // // //               <Button
// // // // //                 variant="outline"
// // // // //                 className="h-8 px-3 text-sm bg-transparent"
// // // // //                 onClick={exportNotMarkedCsv}
// // // // //                 disabled={!notMarkedPeople.length}
// // // // //               >
// // // // //                 Export Not Marked (CSV)
// // // // //               </Button>
// // // // //             </div>
// // // // //           </DialogHeader>

// // // // //           <div className="overflow-y-auto max-h-[60vh]">
// // // // //             {!notMarkedData ? (
// // // // //               <div className="text-center py-8">
// // // // //                 <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
// // // // //                 <p className="text-lg font-medium">Loading...</p>
// // // // //                 <p className="text-muted-foreground">Fetching people who haven't marked attendance.</p>
// // // // //               </div>
// // // // //             ) : notMarkedPeople.length === 0 ? (
// // // // //               <div className="text-center py-8">
// // // // //                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
// // // // //                 <p className="text-lg font-medium">All attendance marked!</p>
// // // // //                 <p className="text-muted-foreground">Everyone has marked their attendance for today.</p>
// // // // //               </div>
// // // // //             ) : (
// // // // //               <div className="space-y-4">
// // // // //                 {notMarkedPeople.map((person) => (
// // // // //                   <div
// // // // //                     key={person.personId}
// // // // //                     className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
// // // // //                   >
// // // // //                     <div className="flex items-center gap-4">
// // // // //                       <div
// // // // //                         className="cursor-pointer"
// // // // //                         onClick={() => setSelectedPerson({ personId: person.personId, personType: person.personType })}
// // // // //                       >
// // // // //                         {person.imageUrl ? (
// // // // //                           <img
// // // // //                             src={person.imageUrl || "/placeholder.svg"}
// // // // //                             alt={person.personName}
// // // // //                             className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors"
// // // // //                             onError={(e) => {
// // // // //                               e.currentTarget.style.display = "none"
// // // // //                               e.currentTarget.nextElementSibling.style.display = "flex"
// // // // //                             }}
// // // // //                           />
// // // // //                         ) : null}
// // // // //                         <div
// // // // //                           className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors ${person.imageUrl ? "hidden" : "flex"}`}
// // // // //                         >
// // // // //                           <User className="h-6 w-6 text-muted-foreground" />
// // // // //                         </div>
// // // // //                       </div>

// // // // //                       <div className="space-y-1">
// // // // //                         <div className="font-semibold">{person.personName}</div>
// // // // //                         <div className="text-sm text-muted-foreground">
// // // // //                           {person.personType === "staff"
// // // // //                             ? `Employee Code: ${person.employeeCode || "N/A"}`
// // // // //                             : `Roll Number: ${person.rollNumber || "N/A"}`}
// // // // //                         </div>
// // // // //                         <div className="text-xs text-muted-foreground">
// // // // //                           {person.department} • {person.role} • {person.shift} Shift
// // // // //                           {person.personType === "student" && person.classLevel && ` • ${person.classLevel}`}
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     </div>

// // // // //                     <div className="flex gap-2">
// // // // //                       <Button
// // // // //                         size="sm"
// // // // //                         className="bg-green-600 text-white hover:bg-green-700 shadow-sm"
// // // // //                         onClick={() => handleManualMark(person.personId, person.personType, "present")}
// // // // //                       >
// // // // //                         Present
// // // // //                       </Button>
// // // // //                       <Button
// // // // //                         size="sm"
// // // // //                         variant="outline"
// // // // //                         className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
// // // // //                         onClick={() => handleManualMark(person.personId, person.personType, "absent")}
// // // // //                       >
// // // // //                         Absent
// // // // //                       </Button>
// // // // //                       <Button
// // // // //                         size="sm"
// // // // //                         variant="outline"
// // // // //                         className="border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
// // // // //                         onClick={() => handleManualMark(person.personId, person.personType, "late")}
// // // // //                       >
// // // // //                         Late
// // // // //                       </Button>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 ))}
// // // // //               </div>
// // // // //             )}
// // // // //           </div>
// // // // //         </DialogContent>
// // // // //       </Dialog>

// // // // //       <PersonDetailsModal
// // // // //         isOpen={!!selectedPerson}
// // // // //         onClose={() => setSelectedPerson(null)}
// // // // //         personId={selectedPerson?.personId || ""}
// // // // //         personType={selectedPerson?.personType || "staff"}
// // // // //       />
// // // // //     </div>
// // // // //   )
// // // // // }



// // // // "use client"

// // // // import useSWR from "swr"
// // // // import { AttendanceFilters, type AttendanceFiltersState } from "@/components/attendance-filters"
// // // // import { ExportAttendance } from "@/components/export-attendance"
// // // // import type { Department, Role, Shift, AttendanceRecord } from "@/lib/types"
// // // // import { Button } from "@/components/ui/button"
// // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // // // import { PersonDetailsModal } from "@/components/person-details-modal"
// // // // import {
// // // //   User,
// // // //   Users,
// // // //   UserCheck,
// // // //   UserX,
// // // //   Clock,
// // // //   RefreshCw,
// // // //   AlertCircle,
// // // //   CheckCircle,
// // // //   Wifi,
// // // //   WifiOff,
// // // //   Trash2,
// // // // } from "lucide-react"
// // // // import { useMemo, useState, useEffect } from "react"
// // // // import { Alert, AlertDescription } from "@/components/ui/alert"
// // // // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// // // // import { realtimeClient } from "@/lib/realtime-client"
// // // // import { getStoredUser } from "@/lib/auth" // import user helper
// // // // import { useToast } from "@/hooks/use-toast"
// // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // // // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // // // export default function AttendancePage() {
// // // //   const [filters, setFilters] = useState<AttendanceFiltersState>({
// // // //     date: new Date().toISOString().slice(0, 10), // Default to today
// // // //     status: "all", // Added default status filter
// // // //     personType: "all", // Added default personType filter
// // // //   })
// // // //   const [selectedPerson, setSelectedPerson] = useState<{
// // // //     personId: string
// // // //     personType: "staff" | "student"
// // // //   } | null>(null)
// // // //   const [isAutoMarking, setIsAutoMarking] = useState(false)
// // // //   const [attendanceMessage, setAttendanceMessage] = useState<{
// // // //     type: "success" | "error" | "warning"
// // // //     message: string
// // // //   } | null>(null)
// // // //   const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
// // // //   const [showNotMarkedModal, setShowNotMarkedModal] = useState(false)
// // // //   const [isConnected, setIsConnected] = useState(false)
// // // //   const [realtimeUpdates, setRealtimeUpdates] = useState(0)
// // // //   const [currentUser, setCurrentUser] = useState<any>(null) // track current user
// // // //   const [deletingId, setDeletingId] = useState<string | null>(null) // track deleting state
// // // //   const { toast } = useToast()

// // // //   useEffect(() => {
// // // //     function onAttendanceUpdate(data: any) {
// // // //       console.log("[v0] Real-time attendance update received:", data)
// // // //       setRealtimeUpdates((prev) => prev + 1)

// // // //       toast({
// // // //         title: "Attendance updated",
// // // //         description: `${data.personName} marked as ${String(data.status || "").toUpperCase()}`,
// // // //       })

// // // //       mutate()
// // // //       mutateNotMarked()
// // // //     }

// // // //     function onStatsUpdate(stats: any) {
// // // //       console.log("[v0] Real-time attendance stats:", stats)
// // // //       // Refresh data when stats update
// // // //       mutate()
// // // //       mutateNotMarked()
// // // //     }

// // // //     function onAutoMarkComplete(data: any) {
// // // //       console.log("[v0] Auto-mark complete:", data)
// // // //       if (data.markedAbsent > 0) {
// // // //         toast({
// // // //           title: "Auto-mark finished",
// // // //           description: `Auto-marked ${data.markedAbsent} people as absent`,
// // // //           variant: "default",
// // // //         })
// // // //         mutate()
// // // //         mutateNotMarked()
// // // //       }
// // // //     }

// // // //     // Set up event listeners
// // // //     realtimeClient.on("attendance_update", onAttendanceUpdate)
// // // //     realtimeClient.on("stats_update", onStatsUpdate)
// // // //     realtimeClient.on("auto_mark_complete", onAutoMarkComplete)

// // // //     // Connect to real-time updates
// // // //     realtimeClient.connect()
// // // //     setIsConnected(true)
// // // //     console.log("[v0] Real-time client connected to attendance page")

// // // //     return () => {
// // // //       realtimeClient.off("attendance_update", onAttendanceUpdate)
// // // //       realtimeClient.off("stats_update", onStatsUpdate)
// // // //       realtimeClient.off("auto_mark_complete", onAutoMarkComplete)
// // // //       realtimeClient.disconnect()
// // // //       setIsConnected(false)
// // // //     }
// // // //   }, [toast])

// // // //   useEffect(() => {
// // // //     const checkAndAutoMarkAbsent = async () => {
// // // //       try {
// // // //         const res = await fetch("/api/attendance/auto-mark", {
// // // //           method: "POST",
// // // //           headers: { "Content-Type": "application/json" },
// // // //         })
// // // //         const result = await res.json()

// // // //         if (res.ok && result.markedAbsent > 0) {
// // // //           setAttendanceMessage({
// // // //             type: "warning",
// // // //             message: `Automatically marked ${result.markedAbsent} people as absent due to shift time closure`,
// // // //           })
// // // //           mutate()

// // // //           setTimeout(() => setAttendanceMessage(null), 8000)
// // // //         }
// // // //       } catch (error) {
// // // //         console.error("Auto-mark check failed:", error)
// // // //       }
// // // //     }

// // // //     checkAndAutoMarkAbsent()

// // // //     const interval = setInterval(checkAndAutoMarkAbsent, 300000)

// // // //     return () => clearInterval(interval)
// // // //   }, [])

// // // //   useEffect(() => {
// // // //     setCurrentUser(getStoredUser())
// // // //   }, [])

// // // //   const { data: shiftSettingsData } = useSWR(
// // // //     currentUser?.institutionName
// // // //       ? `/api/shifts?institutionName=${encodeURIComponent(currentUser.institutionName)}`
// // // //       : null,
// // // //     fetcher,
// // // //   )
// // // //   const shiftSettings: Array<{ name: string; start: string; end: string }> = shiftSettingsData?.shifts || []

// // // //   const normShift = (s?: string | null) => {
// // // //     if (!s) return null
// // // //     const lower = s.toLowerCase()
// // // //     if (lower.startsWith("morn")) return "Morning"
// // // //     if (lower.startsWith("even")) return "Evening"
// // // //     if (lower.startsWith("nig")) return "Night"
// // // //     return s
// // // //   }
// // // //   const formatShiftWindow = (s?: string | null) => {
// // // //     const key = normShift(s)
// // // //     if (!key) return "N/A"
// // // //     const fromSettings = shiftSettings.find((x) => (x.name?.toLowerCase?.() || "").includes(key.toLowerCase()))
// // // //     if (fromSettings) return `${fromSettings.start} - ${fromSettings.end}`
// // // //     try {
// // // //       const { SHIFT_TIMINGS } = require("@/lib/constants")
// // // //       const t = SHIFT_TIMINGS[key as keyof typeof SHIFT_TIMINGS]
// // // //       return t ? `${t.start} - ${t.end}` : "N/A"
// // // //     } catch {
// // // //       return "N/A"
// // // //     }
// // // //   }
// // // //   const formatAutoAbsent = (s?: string | null) => {
// // // //     const key = normShift(s)
// // // //     if (!key) return "N/A"
// // // //     try {
// // // //       const { ABSENT_THRESHOLDS } = require("@/lib/constants")
// // // //       const t = ABSENT_THRESHOLDS[key as keyof typeof ABSENT_THRESHOLDS]
// // // //       return t || "N/A"
// // // //     } catch {
// // // //       return "N/A"
// // // //     }
// // // //   }

// // // //   const params = new URLSearchParams()
// // // //   if (filters.department && filters.department !== "all") params.set("department", filters.department)
// // // //   if (filters.role && filters.role !== "all") params.set("role", filters.role)
// // // //   if (filters.shift && filters.shift !== "all") params.set("shift", filters.shift)
// // // //   if (filters.status && filters.status !== "all") params.set("status", filters.status)
// // // //   if (filters.date) params.set("date", filters.date)
// // // //   if (filters.personType && filters.personType !== "all") params.set("personType", filters.personType)
// // // //   if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
// // // //     params.set("institutionName", currentUser.institutionName)
// // // //   }

// // // //   const { data, mutate } = useSWR<{
// // // //     records: (AttendanceRecord & {
// // // //       personName?: string
// // // //       imageUrl?: string
// // // //       employeeCode?: string
// // // //       rollNumber?: string
// // // //       classLevel?: string
// // // //     })[]
// // // //     departments: Department[]
// // // //     roles: Role[]
// // // //     shifts: Shift[]
// // // //     totalCounts: {
// // // //       totalPeople: number
// // // //       present: number
// // // //       absent: number
// // // //       late: number
// // // //     }
// // // //   }>(`/api/attendance?${params.toString()}`, fetcher)

// // // //   const notMarkedUrlParams = new URLSearchParams()
// // // //   if (filters.date) notMarkedUrlParams.set("date", filters.date)
// // // //   if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
// // // //     notMarkedUrlParams.set("institutionName", currentUser.institutionName)
// // // //   }
// // // //   const { data: notMarkedData, mutate: mutateNotMarked } = useSWR(
// // // //     `/api/attendance/not-marked?${notMarkedUrlParams.toString()}`,
// // // //     fetcher,
// // // //   )

// // // //   const records = data?.records ?? []
// // // //   const departments = data?.departments ?? []
// // // //   const roles = data?.roles ?? []
// // // //   const shifts = data?.shifts ?? []
// // // //   const totalCounts = data?.totalCounts ?? { totalPeople: 0, present: 0, absent: 0, late: 0 }

// // // //   const notMarkedPeople = notMarkedData?.notMarkedPeople ?? []

// // // //   const counts = useMemo(
// // // //     () => ({
// // // //       present: records.filter((r) => r.status === "present").length,
// // // //       absent: records.filter((r) => r.status === "absent").length,
// // // //       late: records.filter((r) => r.status === "late").length,
// // // //     }),
// // // //     [records],
// // // //   )

// // // //   async function mark(personId: string, personType: "staff" | "student", status: "present" | "absent" | "late") {
// // // //     const body = { personId, personType, status, date: filters.date }
// // // //     const res = await fetch("/api/attendance", {
// // // //       method: "POST",
// // // //       headers: { "Content-Type": "application/json" },
// // // //       body: JSON.stringify(body),
// // // //     })

// // // //     const result = await res.json()

// // // //     if (res.status === 409) {
// // // //       setAttendanceMessage({
// // // //         type: "warning",
// // // //         message: result.message,
// // // //       })
// // // //       toast({ title: "Already marked", description: result.message })
// // // //     } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
// // // //       setAttendanceMessage({
// // // //         type: "error",
// // // //         message: result.message,
// // // //       })
// // // //       toast({ title: "Outside shift hours", description: result.message, variant: "destructive" })
// // // //     } else if (!res.ok) {
// // // //       setAttendanceMessage({
// // // //         type: "error",
// // // //         message: "Failed to mark attendance",
// // // //       })
// // // //       toast({ title: "Failed to mark", description: "Please try again.", variant: "destructive" })
// // // //     } else {
// // // //       setAttendanceMessage({
// // // //         type: "success",
// // // //         message: result.message,
// // // //       })
// // // //       toast({ title: "Success", description: result.message })
// // // //       mutate()
// // // //     }

// // // //     setTimeout(() => setAttendanceMessage(null), 5000)
// // // //   }

// // // //   async function autoMarkAbsent() {
// // // //     setIsAutoMarking(true)
// // // //     try {
// // // //       const res = await fetch("/api/attendance/auto-mark", {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //       })
// // // //       const result = await res.json()
// // // //       if (res.ok) {
// // // //         setAttendanceMessage({
// // // //           type: "success",
// // // //           message: result.message,
// // // //         })
// // // //         toast({ title: "Auto-mark requested", description: result.message })
// // // //         mutate()
// // // //       } else {
// // // //         setAttendanceMessage({
// // // //           type: "error",
// // // //           message: "Failed to auto-mark attendance",
// // // //         })
// // // //         toast({ title: "Auto-mark failed", description: "Please try again.", variant: "destructive" })
// // // //       }
// // // //     } catch (error) {
// // // //       setAttendanceMessage({
// // // //         type: "error",
// // // //         message: "Error auto-marking attendance",
// // // //       })
// // // //       toast({ title: "Error auto-marking", description: "Please try again.", variant: "destructive" })
// // // //     } finally {
// // // //       setIsAutoMarking(false)
// // // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // // //     }
// // // //   }

// // // //   async function updateAttendanceStatus(
// // // //     recordId: string,
// // // //     personId: string,
// // // //     personType: "staff" | "student",
// // // //     newStatus: "present" | "absent" | "late",
// // // //   ) {
// // // //     setUpdatingStatus(recordId)
// // // //     try {
// // // //       const res = await fetch("/api/attendance", {
// // // //         method: "PUT",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify({
// // // //           recordId,
// // // //           personId,
// // // //           personType,
// // // //           status: newStatus,
// // // //           date: filters.date,
// // // //         }),
// // // //       })

// // // //       const result = await res.json()
// // // //       console.log("[v0] Manual mark response:", result)

// // // //       if (res.ok) {
// // // //         setAttendanceMessage({
// // // //           type: "success",
// // // //           message: `Attendance status updated to ${newStatus.toUpperCase()} successfully`,
// // // //         })
// // // //         toast({ title: "Status updated", description: `Set to ${newStatus.toUpperCase()}` })
// // // //         mutate()
// // // //       } else {
// // // //         setAttendanceMessage({
// // // //           type: "error",
// // // //           message: result.message || "Failed to update attendance status",
// // // //         })
// // // //         toast({ title: "Update failed", description: result.message || "Please try again.", variant: "destructive" })
// // // //       }
// // // //     } catch (error) {
// // // //       setAttendanceMessage({
// // // //         type: "error",
// // // //         message: "Error updating attendance status",
// // // //       })
// // // //       toast({ title: "Error updating", description: "Please try again.", variant: "destructive" })
// // // //     } finally {
// // // //       setUpdatingStatus(null)
// // // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // // //     }
// // // //   }

// // // //   const isAttendanceMarked = (record: any) => {
// // // //     return record.status && record.timestamp
// // // //   }

// // // //   async function handleManualMark(
// // // //     personId: string,
// // // //     personType: "staff" | "student",
// // // //     status: "present" | "absent" | "late",
// // // //   ) {
// // // //     console.log("[v0] Manual marking:", { personId, personType, status })

// // // //     try {
// // // //       const body = { personId, personType, status, date: filters.date }
// // // //       const res = await fetch("/api/attendance", {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify(body),
// // // //       })

// // // //       const result = await res.json()
// // // //       console.log("[v0] Manual mark response:", result)

// // // //       if (res.status === 409) {
// // // //         setAttendanceMessage({
// // // //           type: "warning",
// // // //           message: result.message,
// // // //         })
// // // //         toast({ title: "Already marked", description: result.message })
// // // //       } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
// // // //         setAttendanceMessage({
// // // //           type: "error",
// // // //           message: result.message,
// // // //         })
// // // //         toast({ title: "Outside shift hours", description: result.message, variant: "destructive" })
// // // //       } else if (!res.ok) {
// // // //         setAttendanceMessage({
// // // //           type: "error",
// // // //           message: "Failed to mark attendance",
// // // //         })
// // // //         toast({ title: "Failed to mark", description: "Please try again.", variant: "destructive" })
// // // //       } else {
// // // //         setAttendanceMessage({
// // // //           type: "success",
// // // //           message: result.message,
// // // //         })
// // // //         toast({ title: "Success", description: result.message })
// // // //         mutate()
// // // //         mutateNotMarked()
// // // //       }

// // // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // // //     } catch (error) {
// // // //       console.error("[v0] Manual mark error:", error)
// // // //       setAttendanceMessage({
// // // //         type: "error",
// // // //         message: "Error marking attendance",
// // // //       })
// // // //       toast({ title: "Error marking", description: "Please try again.", variant: "destructive" })
// // // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // // //     }
// // // //   }

// // // //   function exportNotMarkedCsv() {
// // // //     if (!notMarkedPeople.length) {
// // // //       alert("No data to export")
// // // //       return
// // // //     }
// // // //     const headers = ["Name", "Type", "Employee Code/Roll", "Department", "Role", "Shift", "Class Level"]
// // // //     const rows = notMarkedPeople.map((p) => [
// // // //       p.personName || "Unknown",
// // // //       p.personType,
// // // //       p.personType === "staff" ? p.employeeCode || "N/A" : p.rollNumber || "N/A",
// // // //       p.department || "N/A",
// // // //       p.role || "N/A",
// // // //       p.shift || "N/A",
// // // //       p.personType === "student" ? p.classLevel || "N/A" : "N/A",
// // // //     ])

// // // //     const csv = [headers, ...rows]
// // // //       .map((r) =>
// // // //         r
// // // //           .map((field) => {
// // // //             const s = String(field ?? "")
// // // //             if (s.includes(",") || s.includes('"') || s.includes("\n")) {
// // // //               return `"${s.replace(/"/g, '""')}"`
// // // //             }
// // // //             return s
// // // //           })
// // // //           .join(","),
// // // //       )
// // // //       .join("\n")

// // // //     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
// // // //     const url = URL.createObjectURL(blob)
// // // //     const a = document.createElement("a")
// // // //     a.href = url
// // // //     const datePart = notMarkedData?.date || new Date().toISOString().slice(0, 10)
// // // //     a.download = `not-marked-${datePart}.csv`
// // // //     document.body.appendChild(a)
// // // //     a.click()
// // // //     document.body.removeChild(a)
// // // //     URL.revokeObjectURL(url)
// // // //   }

// // // //   async function deleteAttendance(recordId: string, personId: string) {
// // // //     const confirmed = window.confirm("Delete this attendance record? This will mark them as 'Not Marked' for the day.")
// // // //     if (!confirmed) return

// // // //     setDeletingId(recordId)
// // // //     try {
// // // //       const res = await fetch("/api/attendance", {
// // // //         method: "DELETE",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify({ recordId, personId, date: filters.date }),
// // // //       })
// // // //       const result = await res.json()

// // // //       if (res.ok) {
// // // //         toast({ title: "Deleted", description: "Attendance record deleted" })
// // // //         await Promise.all([mutate(), mutateNotMarked()])
// // // //       } else {
// // // //         toast({ title: "Delete failed", description: result?.message || "Please try again.", variant: "destructive" })
// // // //       }
// // // //     } catch (err) {
// // // //       toast({ title: "Error", description: "Failed to delete record. Please try again.", variant: "destructive" })
// // // //     } finally {
// // // //       setDeletingId(null)
// // // //     }
// // // //   }

// // // //   return (
// // // //     <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8">
// // // //       <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-card rounded-xl border shadow-sm">
// // // //         <div className="space-y-2">
// // // //           {currentUser?.institutionName && (
// // // //             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
// // // //               {currentUser.institutionName}
// // // //             </div>
// // // //           )}
// // // //           <div className="flex items-center gap-3">
// // // //             <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
// // // //               Attendance Management
// // // //             </h1>
// // // //             <div className="flex items-center gap-2">
// // // //               {isConnected ? (
// // // //                 <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
// // // //                   <Wifi className="h-3 w-3" />
// // // //                   Live
// // // //                 </div>
// // // //               ) : (
// // // //                 <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
// // // //                   <WifiOff className="h-3 w-3" />
// // // //                   Offline
// // // //                 </div>
// // // //               )}
// // // //               {realtimeUpdates > 0 && (
// // // //                 <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
// // // //                   {realtimeUpdates} updates
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           </div>
// // // //           <p className="text-muted-foreground leading-relaxed max-w-2xl">
// // // //             View and manage attendance. Auto-absent thresholds and shift windows follow your institution’s shift
// // // //             settings.
// // // //             {isConnected && " Real-time updates enabled via Face Recognition."}
// // // //           </p>
// // // //         </div>
// // // //         <div className="flex flex-col sm:flex-row gap-3">
// // // //           <Button
// // // //             onClick={autoMarkAbsent}
// // // //             disabled={isAutoMarking}
// // // //             variant="outline"
// // // //             className="flex items-center gap-2 bg-accent/10 border-accent/20 hover:bg-accent/20 text-accent font-medium"
// // // //           >
// // // //             <RefreshCw className={`h-4 w-4 ${isAutoMarking ? "animate-spin" : ""}`} />
// // // //             {isAutoMarking ? "Auto Marking..." : "Manual Auto Mark"}
// // // //           </Button>
// // // //           <ExportAttendance
// // // //             records={records}
// // // //             filters={{
// // // //               department: filters.department,
// // // //               role: filters.role,
// // // //               shift: filters.shift,
// // // //               status: filters.status,
// // // //               date: filters.date,
// // // //               personType: filters.personType,
// // // //             }}
// // // //           />
// // // //         </div>
// // // //       </header>

// // // //       {attendanceMessage && (
// // // //         <Alert
// // // //           className={`${
// // // //             attendanceMessage.type === "success"
// // // //               ? "border-green-200 bg-green-50"
// // // //               : attendanceMessage.type === "warning"
// // // //                 ? "border-amber-200 bg-amber-50"
// // // //                 : "border-red-200 bg-red-50"
// // // //           }`}
// // // //         >
// // // //           {attendanceMessage.type === "success" ? (
// // // //             <CheckCircle className="h-4 w-4 text-green-600" />
// // // //           ) : (
// // // //             <AlertCircle className="h-4 w-4 text-amber-600" />
// // // //           )}
// // // //           <AlertDescription
// // // //             className={`${
// // // //               attendanceMessage.type === "success"
// // // //                 ? "text-green-800"
// // // //                 : attendanceMessage.type === "warning"
// // // //                   ? "text-amber-800"
// // // //                   : "text-red-800"
// // // //             }`}
// // // //           >
// // // //             {attendanceMessage.message}
// // // //             {attendanceMessage.message.includes("Face Recognition") && (
// // // //               <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
// // // //                 <Wifi className="h-3 w-3" />
// // // //                 Real-time
// // // //               </span>
// // // //             )}
// // // //           </AlertDescription>
// // // //         </Alert>
// // // //       )}

// // // //       <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
// // // //         <CardContent className="pt-6">
// // // //           <AttendanceFilters
// // // //             departments={departments}
// // // //             roles={roles}
// // // //             shifts={shifts}
// // // //             value={filters}
// // // //             onChange={setFilters}
// // // //           />
// // // //         </CardContent>
// // // //       </Card>

// // // //       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
// // // //         <Card className="bg-gradient-to-br from-card to-muted/20 border-0 shadow-sm hover:shadow-md transition-shadow">
// // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // //             <CardTitle className="text-sm font-semibold text-muted-foreground">Total People</CardTitle>
// // // //             <Users className="h-5 w-5 text-primary" />
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-3xl font-bold text-foreground">{totalCounts.totalPeople}</div>
// // // //             <p className="text-xs text-muted-foreground mt-1">All registered people</p>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
// // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // //             <CardTitle className="text-sm font-semibold text-green-700">Present</CardTitle>
// // // //             <UserCheck className="h-5 w-5 text-green-600" />
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-3xl font-bold text-green-700">{totalCounts.present}</div>
// // // //             <p className="text-xs text-green-600 mt-1">Filtered: {counts.present}</p>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-sm hover:shadow-md transition-shadow">
// // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // //             <CardTitle className="text-sm font-semibold text-red-700">Absent</CardTitle>
// // // //             <UserX className="h-5 w-5 text-red-600" />
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-3xl font-bold text-red-700">{totalCounts.absent}</div>
// // // //             <p className="text-xs text-red-600 mt-1">Filtered: {counts.absent}</p>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
// // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // //             <CardTitle className="text-sm font-semibold text-amber-700">Late</CardTitle>
// // // //             <Clock className="h-5 w-5 text-amber-600" />
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-3xl font-bold text-amber-700">{totalCounts.late}</div>
// // // //             <p className="text-xs text-amber-600 mt-1">Filtered: {counts.late}</p>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card
// // // //           className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
// // // //           onClick={() => setShowNotMarkedModal(true)}
// // // //         >
// // // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // // //             <CardTitle className="text-sm font-semibold text-slate-700">Not Marked</CardTitle>
// // // //             <User className="h-5 w-5 text-slate-600" />
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-3xl font-bold text-slate-700">{notMarkedData?.count ?? 0}</div>
// // // //             <p className="text-xs text-slate-600 mt-1">Click to view & mark</p>
// // // //           </CardContent>
// // // //         </Card>
// // // //       </div>

// // // //       <Card className="shadow-sm border-0 overflow-hidden">
// // // //         <div className="overflow-x-auto">
// // // //           <table className="min-w-full">
// // // //             <thead className="bg-gradient-to-r from-muted/50 to-muted/30">
// // // //               <tr>
// // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
// // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name & Code/Roll</th>
// // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type & Class Level</th>
// // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department & Role</th>
// // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Shift & Timing</th>
// // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status & Time</th>
// // // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody className="divide-y divide-border/50">
// // // //               {records.map((r) => {
// // // //                 const shiftWindow = formatShiftWindow(r.shift)
// // // //                 const autoAbsentAt = formatAutoAbsent(r.shift)
// // // //                 const canManage = currentUser?.role === "Admin" || currentUser?.role === "SuperAdmin"
// // // //                 return (
// // // //                   <tr key={r.id} className="hover:bg-muted/30 transition-colors">
// // // //                     <td className="px-6 py-4">
// // // //                       <div
// // // //                         className="cursor-pointer"
// // // //                         onClick={() => setSelectedPerson({ personId: r.personId, personType: r.personType })}
// // // //                       >
// // // //                         {r.imageUrl ? (
// // // //                           <img
// // // //                             src={r.imageUrl || "/placeholder.svg"}
// // // //                             alt={r.personName || "Person"}
// // // //                             className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors shadow-sm"
// // // //                           />
// // // //                         ) : (
// // // //                           <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors shadow-sm">
// // // //                             <User className="h-6 w-6 text-muted-foreground" />
// // // //                           </div>
// // // //                         )}
// // // //                       </div>
// // // //                     </td>

// // // //                     <td className="px-6 py-4">
// // // //                       <div className="space-y-1">
// // // //                         <div className="text-base font-semibold text-foreground">{r.personName || "Unknown"}</div>
// // // //                         <div className="text-sm text-muted-foreground font-medium">
// // // //                           {r.personType === "staff"
// // // //                             ? `Code: ${r.employeeCode || "N/A"}`
// // // //                             : `Roll: ${r.rollNumber || "N/A"}`}
// // // //                         </div>
// // // //                       </div>
// // // //                     </td>

// // // //                     <td className="px-6 py-4">
// // // //                       <div className="space-y-1">
// // // //                         <div className="text-sm font-medium capitalize text-foreground">{r.personType}</div>
// // // //                         {r.personType === "student" && (
// // // //                           <div className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md inline-block">
// // // //                             {r.classLevel || "N/A"}
// // // //                           </div>
// // // //                         )}
// // // //                         {r.personType === "staff" && (
// // // //                           <div className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md inline-block">
// // // //                             Staff Member
// // // //                           </div>
// // // //                         )}
// // // //                       </div>
// // // //                     </td>

// // // //                     <td className="px-6 py-4">
// // // //                       <div className="space-y-1">
// // // //                         <div className="text-sm font-medium text-foreground">{r.department}</div>
// // // //                         <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md inline-block">
// // // //                           {r.role}
// // // //                         </div>
// // // //                       </div>
// // // //                     </td>

// // // //                     <td className="px-6 py-4">
// // // //                       <div className="space-y-2">
// // // //                         <div className="text-sm font-medium text-foreground">{`${normShift(r.shift) || r.shift} Shift`}</div>
// // // //                         <div className="text-xs text-muted-foreground">{shiftWindow}</div>
// // // //                         <div className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-md inline-block">
// // // //                           Auto-absent: {autoAbsentAt}
// // // //                         </div>
// // // //                       </div>
// // // //                     </td>

// // // //                     <td className="px-6 py-4">
// // // //                       {isAttendanceMarked(r) ? (
// // // //                         <div className="space-y-2">
// // // //                           <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
// // // //                             <CheckCircle className="h-4 w-4 text-green-600" />
// // // //                             <span className="font-medium">Marked as {r.status?.toUpperCase()}</span>
// // // //                           </div>
// // // //                           <div className="text-xs text-muted-foreground">
// // // //                             {r.timestamp && new Date(r.timestamp).toLocaleString()}
// // // //                           </div>
// // // //                         </div>
// // // //                       ) : (
// // // //                         <div className="text-sm text-muted-foreground italic">Not marked yet</div>
// // // //                       )}
// // // //                     </td>

// // // //                     <td className="px-6 py-4">
// // // //                       {isAttendanceMarked(r) ? (
// // // //                         canManage ? (
// // // //                           <div className="flex flex-col gap-2 w-40">
// // // //                             <Select
// // // //                               onValueChange={(v) =>
// // // //                                 updateAttendanceStatus(r.id as string, r.personId, r.personType, v as any)
// // // //                               }
// // // //                             >
// // // //                               <SelectTrigger>
// // // //                                 <SelectValue placeholder={`Change: ${r.status?.toUpperCase()}`} />
// // // //                               </SelectTrigger>
// // // //                               <SelectContent>
// // // //                                 <SelectItem value="present">Present</SelectItem>
// // // //                                 <SelectItem value="absent">Absent</SelectItem>
// // // //                                 <SelectItem value="late">Late</SelectItem>
// // // //                               </SelectContent>
// // // //                             </Select>
// // // //                             {updatingStatus === r.id && (
// // // //                               <div className="text-xs text-muted-foreground">Updating...</div>
// // // //                             )}

// // // //                             <Button
// // // //                               variant="destructive"
// // // //                               size="sm"
// // // //                               className="flex items-center gap-2"
// // // //                               onClick={() => deleteAttendance(r.id as string, r.personId)}
// // // //                               disabled={deletingId === r.id}
// // // //                             >
// // // //                               <Trash2 className="h-4 w-4" />
// // // //                               {deletingId === r.id ? "Deleting..." : "Delete"}
// // // //                             </Button>
// // // //                           </div>
// // // //                         ) : (
// // // //                           <div className="text-xs text-muted-foreground">No actions</div>
// // // //                         )
// // // //                       ) : (
// // // //                         <div className="flex flex-col gap-2">
// // // //                           <Button
// // // //                             size="sm"
// // // //                             className="bg-green-600 text-white hover:bg-green-700 shadow-sm font-medium"
// // // //                             onClick={() => mark(r.personId, r.personType, "present")}
// // // //                           >
// // // //                             Present
// // // //                           </Button>
// // // //                           <div className="flex gap-2">
// // // //                             <Button
// // // //                               size="sm"
// // // //                               variant="outline"
// // // //                               className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-medium bg-transparent"
// // // //                               onClick={() => mark(r.personId, r.personType, "absent")}
// // // //                             >
// // // //                               Absent
// // // //                             </Button>
// // // //                             <Button
// // // //                               size="sm"
// // // //                               variant="outline"
// // // //                               className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 font-medium bg-transparent"
// // // //                               onClick={() => mark(r.personId, r.personType, "late")}
// // // //                             >
// // // //                               Late
// // // //                             </Button>
// // // //                           </div>
// // // //                         </div>
// // // //                       )}
// // // //                     </td>
// // // //                   </tr>
// // // //                 )
// // // //               })}
// // // //               {records.length === 0 && (
// // // //                 <tr>
// // // //                   <td className="px-6 py-12 text-center text-muted-foreground" colSpan={7}>
// // // //                     <div className="flex flex-col items-center gap-2">
// // // //                       <Users className="h-8 w-8 text-muted-foreground/50" />
// // // //                       <span>No attendance records found for the selected filters.</span>
// // // //                     </div>
// // // //                   </td>
// // // //                 </tr>
// // // //               )}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>
// // // //       </Card>

// // // //       <Dialog open={showNotMarkedModal} onOpenChange={setShowNotMarkedModal}>
// // // //         <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
// // // //           <DialogHeader>
// // // //             <DialogTitle className="flex items-center gap-2">
// // // //               <User className="h-5 w-5" />
// // // //               Not Marked Attendance ({notMarkedData?.count ?? 0})
// // // //             </DialogTitle>
// // // //             <DialogDescription>
// // // //               People who haven't marked their attendance yet. You can mark their attendance manually.
// // // //             </DialogDescription>
// // // //             <div className="mt-3">
// // // //               <Button
// // // //                 variant="outline"
// // // //                 className="h-8 px-3 text-sm bg-transparent"
// // // //                 onClick={exportNotMarkedCsv}
// // // //                 disabled={!notMarkedPeople.length}
// // // //               >
// // // //                 Export Not Marked (CSV)
// // // //               </Button>
// // // //             </div>
// // // //           </DialogHeader>

// // // //           <div className="overflow-y-auto max-h-[60vh]">
// // // //             {!notMarkedData ? (
// // // //               <div className="text-center py-8">
// // // //                 <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
// // // //                 <p className="text-lg font-medium">Loading...</p>
// // // //                 <p className="text-muted-foreground">Fetching people who haven't marked attendance.</p>
// // // //               </div>
// // // //             ) : notMarkedPeople.length === 0 ? (
// // // //               <div className="text-center py-8">
// // // //                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
// // // //                 <p className="text-lg font-medium">All attendance marked!</p>
// // // //                 <p className="text-muted-foreground">Everyone has marked their attendance for today.</p>
// // // //               </div>
// // // //             ) : (
// // // //               <div className="space-y-4">
// // // //                 {notMarkedPeople.map((person) => (
// // // //                   <div
// // // //                     key={person.personId}
// // // //                     className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
// // // //                   >
// // // //                     <div className="flex items-center gap-4">
// // // //                       <div
// // // //                         className="cursor-pointer"
// // // //                         onClick={() => setSelectedPerson({ personId: person.personId, personType: person.personType })}
// // // //                       >
// // // //                         {person.imageUrl ? (
// // // //                           <img
// // // //                             src={person.imageUrl || "/placeholder.svg"}
// // // //                             alt={person.personName}
// // // //                             className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors"
// // // //                             onError={(e) => {
// // // //                               e.currentTarget.style.display = "none"
// // // //                               e.currentTarget.nextElementSibling.style.display = "flex"
// // // //                             }}
// // // //                           />
// // // //                         ) : null}
// // // //                         <div
// // // //                           className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors ${person.imageUrl ? "hidden" : "flex"}`}
// // // //                         >
// // // //                           <User className="h-6 w-6 text-muted-foreground" />
// // // //                         </div>
// // // //                       </div>

// // // //                       <div className="space-y-1">
// // // //                         <div className="font-semibold">{person.personName}</div>
// // // //                         <div className="text-sm text-muted-foreground">
// // // //                           {person.personType === "staff"
// // // //                             ? `Employee Code: ${person.employeeCode || "N/A"}`
// // // //                             : `Roll Number: ${person.rollNumber || "N/A"}`}
// // // //                         </div>
// // // //                         <div className="text-xs text-muted-foreground">
// // // //                           {person.department} • {person.role} • {person.shift} Shift
// // // //                           {person.personType === "student" && person.classLevel && ` • ${person.classLevel}`}
// // // //                         </div>
// // // //                       </div>
// // // //                     </div>

// // // //                     <div className="flex gap-2">
// // // //                       <Button
// // // //                         size="sm"
// // // //                         className="bg-green-600 text-white hover:bg-green-700 shadow-sm"
// // // //                         onClick={() => handleManualMark(person.personId, person.personType, "present")}
// // // //                       >
// // // //                         Present
// // // //                       </Button>
// // // //                       <Button
// // // //                         size="sm"
// // // //                         variant="outline"
// // // //                         className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
// // // //                         onClick={() => handleManualMark(person.personId, person.personType, "absent")}
// // // //                       >
// // // //                         Absent
// // // //                       </Button>
// // // //                       <Button
// // // //                         size="sm"
// // // //                         variant="outline"
// // // //                         className="border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
// // // //                         onClick={() => handleManualMark(person.personId, person.personType, "late")}
// // // //                       >
// // // //                         Late
// // // //                       </Button>
// // // //                     </div>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </DialogContent>
// // // //       </Dialog>

// // // //       <PersonDetailsModal
// // // //         isOpen={!!selectedPerson}
// // // //         onClose={() => setSelectedPerson(null)}
// // // //         personId={selectedPerson?.personId || ""}
// // // //         personType={selectedPerson?.personType || "staff"}
// // // //       />
// // // //     </div>
// // // //   )
// // // // }


// // // "use client"

// // // import useSWR from "swr"
// // // import { AttendanceFilters, type AttendanceFiltersState } from "@/components/attendance-filters"
// // // import { ExportAttendance } from "@/components/export-attendance"
// // // import type { Department, Role, Shift, AttendanceRecord } from "@/lib/types"
// // // import { Button } from "@/components/ui/button"
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // // import { PersonDetailsModal } from "@/components/person-details-modal"
// // // import {
// // //   User,
// // //   Users,
// // //   UserCheck,
// // //   UserX,
// // //   Clock,
// // //   RefreshCw,
// // //   AlertCircle,
// // //   CheckCircle,
// // //   Wifi,
// // //   WifiOff,
// // //   Trash2,
// // // } from "lucide-react"
// // // import { useMemo, useState, useEffect } from "react"
// // // import { Alert, AlertDescription } from "@/components/ui/alert"
// // // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// // // import { realtimeClient } from "@/lib/realtime-client"
// // // import { getStoredUser } from "@/lib/auth" // import user helper
// // // import { useToast } from "@/hooks/use-toast"
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // // export default function AttendancePage() {
// // //   const [filters, setFilters] = useState<AttendanceFiltersState>({
// // //     date: new Date().toISOString().slice(0, 10), // Default to today
// // //     status: "all", // Added default status filter
// // //     personType: "all", // Added default personType filter
// // //   })
// // //   const [selectedPerson, setSelectedPerson] = useState<{
// // //     personId: string
// // //     personType: "staff" | "student"
// // //   } | null>(null)
// // //   const [isAutoMarking, setIsAutoMarking] = useState(false)
// // //   const [attendanceMessage, setAttendanceMessage] = useState<{
// // //     type: "success" | "error" | "warning"
// // //     message: string
// // //   } | null>(null)
// // //   const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
// // //   const [showNotMarkedModal, setShowNotMarkedModal] = useState(false)
// // //   const [isConnected, setIsConnected] = useState(false)
// // //   const [realtimeUpdates, setRealtimeUpdates] = useState(0)
// // //   const [currentUser, setCurrentUser] = useState<any>(null) // track current user
// // //   const [deletingId, setDeletingId] = useState<string | null>(null) // track deleting state
// // //   const { toast } = useToast()

// // //   useEffect(() => {
// // //     function onAttendanceUpdate(data: any) {
// // //       console.log("[v0] Real-time attendance update received:", data)
// // //       setRealtimeUpdates((prev) => prev + 1)

// // //       toast({
// // //         title: "Attendance updated",
// // //         description: `${data.personName} marked as ${String(data.status || "").toUpperCase()}`,
// // //       })

// // //       mutate()
// // //       mutateNotMarked()
// // //     }

// // //     function onStatsUpdate(stats: any) {
// // //       console.log("[v0] Real-time attendance stats:", stats)
// // //       // Refresh data when stats update
// // //       mutate()
// // //       mutateNotMarked()
// // //     }

// // //     function onAutoMarkComplete(data: any) {
// // //       console.log("[v0] Auto-mark complete:", data)
// // //       if (data.markedAbsent > 0) {
// // //         toast({
// // //           title: "Auto-mark finished",
// // //           description: `Auto-marked ${data.markedAbsent} people as absent`,
// // //           variant: "default",
// // //         })
// // //         mutate()
// // //         mutateNotMarked()
// // //       }
// // //     }

// // //     // Set up event listeners
// // //     realtimeClient.on("attendance_update", onAttendanceUpdate)
// // //     realtimeClient.on("stats_update", onStatsUpdate)
// // //     realtimeClient.on("auto_mark_complete", onAutoMarkComplete)

// // //     // Connect to real-time updates
// // //     realtimeClient.connect()
// // //     setIsConnected(true)
// // //     console.log("[v0] Real-time client connected to attendance page")

// // //     return () => {
// // //       realtimeClient.off("attendance_update", onAttendanceUpdate)
// // //       realtimeClient.off("stats_update", onStatsUpdate)
// // //       realtimeClient.off("auto_mark_complete", onAutoMarkComplete)
// // //       realtimeClient.disconnect()
// // //       setIsConnected(false)
// // //     }
// // //   }, [toast])

// // //   useEffect(() => {
// // //     const checkAndAutoMarkAbsent = async () => {
// // //       try {
// // //         const res = await fetch("/api/attendance/auto-mark", {
// // //           method: "POST",
// // //           headers: { "Content-Type": "application/json" },
// // //         })
// // //         const result = await res.json()

// // //         if (res.ok && result.markedAbsent > 0) {
// // //           setAttendanceMessage({
// // //             type: "warning",
// // //             message: `Automatically marked ${result.markedAbsent} people as absent due to shift time closure`,
// // //           })
// // //           mutate()

// // //           setTimeout(() => setAttendanceMessage(null), 8000)
// // //         }
// // //       } catch (error) {
// // //         console.error("Auto-mark check failed:", error)
// // //       }
// // //     }

// // //     checkAndAutoMarkAbsent()

// // //     const interval = setInterval(checkAndAutoMarkAbsent, 300000)

// // //     return () => clearInterval(interval)
// // //   }, [])

// // //   useEffect(() => {
// // //     setCurrentUser(getStoredUser())
// // //   }, [])

// // //   const { data: shiftSettingsData } = useSWR(
// // //     currentUser?.institutionName
// // //       ? `/api/shifts?institutionName=${encodeURIComponent(currentUser.institutionName)}`
// // //       : null,
// // //     fetcher,
// // //   )
// // //   const shiftSettings: Array<{ name: string; start: string; end: string }> = shiftSettingsData?.shifts || []

// // //   const normShift = (s?: string | null) => {
// // //     if (!s) return null
// // //     const lower = s.toLowerCase()
// // //     if (lower.startsWith("morn")) return "Morning"
// // //     if (lower.startsWith("even")) return "Evening"
// // //     if (lower.startsWith("nig")) return "Night"
// // //     return s
// // //   }
// // //   const formatShiftWindow = (s?: string | null) => {
// // //     const key = normShift(s)
// // //     if (!key) return "N/A"
// // //     const fromSettings = shiftSettings.find((x) => (x.name?.toLowerCase?.() || "").includes(key.toLowerCase()))
// // //     if (fromSettings) return `${fromSettings.start} - ${fromSettings.end}`
// // //     try {
// // //       const { SHIFT_TIMINGS } = require("@/lib/constants")
// // //       const t = SHIFT_TIMINGS[key as keyof typeof SHIFT_TIMINGS]
// // //       return t ? `${t.start} - ${t.end}` : "N/A"
// // //     } catch {
// // //       return "N/A"
// // //     }
// // //   }
// // //   const formatAutoAbsent = (s?: string | null) => {
// // //     const key = normShift(s)
// // //     if (!key) return "N/A"
// // //     try {
// // //       const { ABSENT_THRESHOLDS } = require("@/lib/constants")
// // //       const t = ABSENT_THRESHOLDS[key as keyof typeof ABSENT_THRESHOLDS]
// // //       return t || "N/A"
// // //     } catch {
// // //       return "N/A"
// // //     }
// // //   }

// // //   const params = new URLSearchParams()
// // //   if (filters.department && filters.department !== "all") params.set("department", filters.department)
// // //   if (filters.role && filters.role !== "all") params.set("role", filters.role)
// // //   if (filters.shift && filters.shift !== "all") params.set("shift", filters.shift)
// // //   if (filters.status && filters.status !== "all") params.set("status", filters.status)
// // //   if (filters.date) params.set("date", filters.date)
// // //   if (filters.personType && filters.personType !== "all") params.set("personType", filters.personType)
// // //   if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
// // //     params.set("institutionName", currentUser.institutionName)
// // //   }

// // //   const { data, mutate } = useSWR<{
// // //     records: (AttendanceRecord & {
// // //       personName?: string
// // //       imageUrl?: string
// // //       employeeCode?: string
// // //       rollNumber?: string
// // //       classLevel?: string
// // //     })[]
// // //     departments: Department[]
// // //     roles: Role[]
// // //     shifts: Shift[]
// // //     totalCounts: {
// // //       totalPeople: number
// // //       present: number
// // //       absent: number
// // //       late: number
// // //     }
// // //   }>(`/api/attendance?${params.toString()}`, fetcher)

// // //   const notMarkedUrlParams = new URLSearchParams()
// // //   if (filters.date) notMarkedUrlParams.set("date", filters.date)
// // //   if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
// // //     notMarkedUrlParams.set("institutionName", currentUser.institutionName)
// // //   }
// // //   const { data: notMarkedData, mutate: mutateNotMarked } = useSWR(
// // //     `/api/attendance/not-marked?${notMarkedUrlParams.toString()}`,
// // //     fetcher,
// // //   )

// // //   const records = data?.records ?? []
// // //   const departments = data?.departments ?? []
// // //   const roles = data?.roles ?? []
// // //   const shifts = data?.shifts ?? []
// // //   const totalCounts = data?.totalCounts ?? { totalPeople: 0, present: 0, absent: 0, late: 0 }

// // //   const notMarkedPeople = notMarkedData?.notMarkedPeople ?? []

// // //   const counts = useMemo(
// // //     () => ({
// // //       present: records.filter((r) => r.status === "present").length,
// // //       absent: records.filter((r) => r.status === "absent").length,
// // //       late: records.filter((r) => r.status === "late").length,
// // //     }),
// // //     [records],
// // //   )

// // //   async function mark(personId: string, personType: "staff" | "student", status: "present" | "absent" | "late") {
// // //     const body = { personId, personType, status, date: filters.date }
// // //     const res = await fetch("/api/attendance", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify(body),
// // //     })

// // //     const result = await res.json()

// // //     if (res.status === 409) {
// // //       setAttendanceMessage({
// // //         type: "warning",
// // //         message: result.message,
// // //       })
// // //       toast({ title: "Already marked", description: result.message })
// // //     } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
// // //       setAttendanceMessage({
// // //         type: "error",
// // //         message: result.message,
// // //       })
// // //       toast({ title: "Outside shift hours", description: result.message, variant: "destructive" })
// // //     } else if (!res.ok) {
// // //       setAttendanceMessage({
// // //         type: "error",
// // //         message: "Failed to mark attendance",
// // //       })
// // //       toast({ title: "Failed to mark", description: "Please try again.", variant: "destructive" })
// // //     } else {
// // //       setAttendanceMessage({
// // //         type: "success",
// // //         message: result.message,
// // //       })
// // //       toast({ title: "Success", description: result.message })
// // //       mutate()
// // //     }

// // //     setTimeout(() => setAttendanceMessage(null), 5000)
// // //   }

// // //   async function autoMarkAbsent() {
// // //     setIsAutoMarking(true)
// // //     try {
// // //       const res = await fetch("/api/attendance/auto-mark", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //       })
// // //       const result = await res.json()
// // //       if (res.ok) {
// // //         setAttendanceMessage({
// // //           type: "success",
// // //           message: result.message,
// // //         })
// // //         toast({ title: "Auto-mark requested", description: result.message })
// // //         mutate()
// // //       } else {
// // //         setAttendanceMessage({
// // //           type: "error",
// // //           message: "Failed to auto-mark attendance",
// // //         })
// // //         toast({ title: "Auto-mark failed", description: "Please try again.", variant: "destructive" })
// // //       }
// // //     } catch (error) {
// // //       setAttendanceMessage({
// // //         type: "error",
// // //         message: "Error auto-marking attendance",
// // //       })
// // //       toast({ title: "Error auto-marking", description: "Please try again.", variant: "destructive" })
// // //     } finally {
// // //       setIsAutoMarking(false)
// // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // //     }
// // //   }

// // //   async function updateAttendanceStatus(
// // //     recordId: string,
// // //     personId: string,
// // //     personType: "staff" | "student",
// // //     newStatus: "present" | "absent" | "late",
// // //   ) {
// // //     setUpdatingStatus(recordId)
// // //     try {
// // //       const res = await fetch("/api/attendance", {
// // //         method: "PUT",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({
// // //           recordId,
// // //           personId,
// // //           personType,
// // //           status: newStatus,
// // //           date: filters.date,
// // //         }),
// // //       })

// // //       const result = await res.json()
// // //       console.log("[v0] Manual mark response:", result)

// // //       if (res.ok) {
// // //         setAttendanceMessage({
// // //           type: "success",
// // //           message: `Attendance status updated to ${newStatus.toUpperCase()} successfully`,
// // //         })
// // //         toast({ title: "Status updated", description: `Set to ${newStatus.toUpperCase()}` })
// // //         mutate()
// // //       } else {
// // //         setAttendanceMessage({
// // //           type: "error",
// // //           message: result.message || "Failed to update attendance status",
// // //         })
// // //         toast({ title: "Update failed", description: result.message || "Please try again.", variant: "destructive" })
// // //       }
// // //     } catch (error) {
// // //       setAttendanceMessage({
// // //         type: "error",
// // //         message: "Error updating attendance status",
// // //       })
// // //       toast({ title: "Error updating", description: "Please try again.", variant: "destructive" })
// // //     } finally {
// // //       setUpdatingStatus(null)
// // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // //     }
// // //   }

// // //   const isAttendanceMarked = (record: any) => {
// // //     return record.status && record.timestamp
// // //   }

// // //   async function handleManualMark(
// // //     personId: string,
// // //     personType: "staff" | "student",
// // //     status: "present" | "absent" | "late",
// // //   ) {
// // //     console.log("[v0] Manual marking:", { personId, personType, status })

// // //     try {
// // //       const body = { personId, personType, status, date: filters.date }
// // //       const res = await fetch("/api/attendance", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(body),
// // //       })

// // //       const result = await res.json()
// // //       console.log("[v0] Manual mark response:", result)

// // //       if (res.status === 409) {
// // //         setAttendanceMessage({
// // //           type: "warning",
// // //           message: result.message,
// // //         })
// // //         toast({ title: "Already marked", description: result.message })
// // //       } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
// // //         setAttendanceMessage({
// // //           type: "error",
// // //           message: result.message,
// // //         })
// // //         toast({ title: "Outside shift hours", description: result.message, variant: "destructive" })
// // //       } else if (!res.ok) {
// // //         setAttendanceMessage({
// // //           type: "error",
// // //           message: "Failed to mark attendance",
// // //         })
// // //         toast({ title: "Failed to mark", description: "Please try again.", variant: "destructive" })
// // //       } else {
// // //         setAttendanceMessage({
// // //           type: "success",
// // //           message: result.message,
// // //         })
// // //         toast({ title: "Success", description: result.message })
// // //         mutate()
// // //         mutateNotMarked()
// // //       }

// // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // //     } catch (error) {
// // //       console.error("[v0] Manual mark error:", error)
// // //       setAttendanceMessage({
// // //         type: "error",
// // //         message: "Error marking attendance",
// // //       })
// // //       toast({ title: "Error marking", description: "Please try again.", variant: "destructive" })
// // //       setTimeout(() => setAttendanceMessage(null), 5000)
// // //     }
// // //   }

// // //   function exportNotMarkedCsv() {
// // //     if (!notMarkedPeople.length) {
// // //       alert("No data to export")
// // //       return
// // //     }
// // //     const headers = ["Name", "Type", "Employee Code/Roll", "Department", "Role", "Shift", "Class Level"]
// // //     const rows = notMarkedPeople.map((p) => [
// // //       p.personName || "Unknown",
// // //       p.personType,
// // //       p.personType === "staff" ? p.employeeCode || "N/A" : p.rollNumber || "N/A",
// // //       p.department || "N/A",
// // //       p.role || "N/A",
// // //       p.shift || "N/A",
// // //       p.personType === "student" ? p.classLevel || "N/A" : "N/A",
// // //     ])

// // //     const csv = [headers, ...rows]
// // //       .map((r) =>
// // //         r
// // //           .map((field) => {
// // //             const s = String(field ?? "")
// // //             if (s.includes(",") || s.includes('"') || s.includes("\n")) {
// // //               return `"${s.replace(/"/g, '""')}"`
// // //             }
// // //             return s
// // //           })
// // //           .join(","),
// // //       )
// // //       .join("\n")

// // //     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
// // //     const url = URL.createObjectURL(blob)
// // //     const a = document.createElement("a")
// // //     a.href = url
// // //     const datePart = notMarkedData?.date || new Date().toISOString().slice(0, 10)
// // //     a.download = `not-marked-${datePart}.csv`
// // //     document.body.appendChild(a)
// // //     a.click()
// // //     document.body.removeChild(a)
// // //     URL.revokeObjectURL(url)
// // //   }

// // //   async function deleteAttendance(recordId: string, personId: string) {
// // //     const confirmed = window.confirm("Delete this attendance record? This will mark them as 'Not Marked' for the day.")
// // //     if (!confirmed) return

// // //     setDeletingId(recordId)
// // //     try {
// // //       const res = await fetch("/api/attendance", {
// // //         method: "DELETE",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ recordId, personId, date: filters.date }),
// // //       })
// // //       const result = await res.json()

// // //       if (res.ok) {
// // //         toast({ title: "Deleted", description: "Attendance record deleted" })
// // //         await Promise.all([mutate(), mutateNotMarked()])
// // //       } else {
// // //         toast({ title: "Delete failed", description: result?.message || "Please try again.", variant: "destructive" })
// // //       }
// // //     } catch (err) {
// // //       toast({ title: "Error", description: "Failed to delete record. Please try again.", variant: "destructive" })
// // //     } finally {
// // //       setDeletingId(null)
// // //     }
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8">
// // //       <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-card rounded-xl border shadow-sm">
// // //         <div className="space-y-2">
// // //           {currentUser?.institutionName && (
// // //             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
// // //               {currentUser.institutionName}
// // //             </div>
// // //           )}
// // //           <div className="flex items-center gap-3">
// // //             <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
// // //               Attendance Management
// // //             </h1>
// // //             <div className="flex items-center gap-2">
// // //               {isConnected ? (
// // //                 <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
// // //                   <Wifi className="h-3 w-3" />
// // //                   Live
// // //                 </div>
// // //               ) : (
// // //                 <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
// // //                   <WifiOff className="h-3 w-3" />
// // //                   Offline
// // //                 </div>
// // //               )}
// // //               {realtimeUpdates > 0 && (
// // //                 <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
// // //                   {realtimeUpdates} updates
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //           <p className="text-muted-foreground leading-relaxed max-w-2xl">
// // //             View and manage attendance. Auto-absent thresholds and shift windows follow your institution’s shift
// // //             settings.
// // //             {isConnected && " Real-time updates enabled via Face Recognition."}
// // //           </p>
// // //         </div>
// // //         <div className="flex flex-col sm:flex-row gap-3">
// // //           <Button
// // //             onClick={autoMarkAbsent}
// // //             disabled={isAutoMarking}
// // //             variant="outline"
// // //             className="flex items-center gap-2 bg-accent/10 border-accent/20 hover:bg-accent/20 text-accent font-medium"
// // //           >
// // //             <RefreshCw className={`h-4 w-4 ${isAutoMarking ? "animate-spin" : ""}`} />
// // //             {isAutoMarking ? "Auto Marking..." : "Manual Auto Mark"}
// // //           </Button>
// // //           <ExportAttendance
// // //             records={records}
// // //             filters={{
// // //               department: filters.department,
// // //               role: filters.role,
// // //               shift: filters.shift,
// // //               status: filters.status,
// // //               date: filters.date,
// // //               personType: filters.personType,
// // //             }}
// // //           />
// // //         </div>
// // //       </header>

// // //       {attendanceMessage && (
// // //         <Alert
// // //           className={`${
// // //             attendanceMessage.type === "success"
// // //               ? "border-green-200 bg-green-50"
// // //               : attendanceMessage.type === "warning"
// // //                 ? "border-amber-200 bg-amber-50"
// // //                 : "border-red-200 bg-red-50"
// // //           }`}
// // //         >
// // //           {attendanceMessage.type === "success" ? (
// // //             <CheckCircle className="h-4 w-4 text-green-600" />
// // //           ) : (
// // //             <AlertCircle className="h-4 w-4 text-amber-600" />
// // //           )}
// // //           <AlertDescription
// // //             className={`${
// // //               attendanceMessage.type === "success"
// // //                 ? "text-green-800"
// // //                 : attendanceMessage.type === "warning"
// // //                   ? "text-amber-800"
// // //                   : "text-red-800"
// // //             }`}
// // //           >
// // //             {attendanceMessage.message}
// // //             {attendanceMessage.message.includes("Face Recognition") && (
// // //               <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
// // //                 <Wifi className="h-3 w-3" />
// // //                 Real-time
// // //               </span>
// // //             )}
// // //           </AlertDescription>
// // //         </Alert>
// // //       )}

// // //       <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
// // //         <CardContent className="pt-6">
// // //           <AttendanceFilters
// // //             departments={departments}
// // //             roles={roles}
// // //             shifts={shifts}
// // //             value={filters}
// // //             onChange={setFilters}
// // //           />
// // //         </CardContent>
// // //       </Card>

// // //       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
// // //         <Card className="bg-gradient-to-br from-card to-muted/20 border-0 shadow-sm hover:shadow-md transition-shadow">
// // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //             <CardTitle className="text-sm font-semibold text-muted-foreground">Total People</CardTitle>
// // //             <Users className="h-5 w-5 text-primary" />
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-3xl font-bold text-foreground">{totalCounts.totalPeople}</div>
// // //             <p className="text-xs text-muted-foreground mt-1">All registered people</p>
// // //           </CardContent>
// // //         </Card>

// // //         <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
// // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //             <CardTitle className="text-sm font-semibold text-green-700">Present</CardTitle>
// // //             <UserCheck className="h-5 w-5 text-green-600" />
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-3xl font-bold text-green-700">{totalCounts.present}</div>
// // //             <p className="text-xs text-green-600 mt-1">Filtered: {counts.present}</p>
// // //           </CardContent>
// // //         </Card>

// // //         <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-sm hover:shadow-md transition-shadow">
// // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //             <CardTitle className="text-sm font-semibold text-red-700">Absent</CardTitle>
// // //             <UserX className="h-5 w-5 text-red-600" />
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-3xl font-bold text-red-700">{totalCounts.absent}</div>
// // //             <p className="text-xs text-red-600 mt-1">Filtered: {counts.absent}</p>
// // //           </CardContent>
// // //         </Card>

// // //         <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
// // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //             <CardTitle className="text-sm font-semibold text-amber-700">Late</CardTitle>
// // //             <Clock className="h-5 w-5 text-amber-600" />
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-3xl font-bold text-amber-700">{totalCounts.late}</div>
// // //             <p className="text-xs text-amber-600 mt-1">Filtered: {counts.late}</p>
// // //           </CardContent>
// // //         </Card>

// // //         <Card
// // //           className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
// // //           onClick={() => setShowNotMarkedModal(true)}
// // //         >
// // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //             <CardTitle className="text-sm font-semibold text-slate-700">Not Marked</CardTitle>
// // //             <User className="h-5 w-5 text-slate-600" />
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-3xl font-bold text-slate-700">{notMarkedData?.count ?? 0}</div>
// // //             <p className="text-xs text-slate-600 mt-1">Click to view & mark</p>
// // //           </CardContent>
// // //         </Card>
// // //       </div>

// // //       <Card className="shadow-sm border-0 overflow-hidden">
// // //         <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
// // //           <table className="min-w-full">
// // //             <thead className="sticky top-0 z-10 bg-card shadow-sm">
// // //               <tr>
// // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
// // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name & Code/Roll</th>
// // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
// // //                   Type & Class Level
// // //                 </th>
// // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
// // //                   Department & Role
// // //                 </th>
// // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
// // //                   Shift & Timing
// // //                 </th>
// // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status & Time</th>
// // //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="divide-y divide-border/50">
// // //               {records.map((r) => {
// // //                 const shiftWindow = formatShiftWindow(r.shift)
// // //                 const autoAbsentAt = formatAutoAbsent(r.shift)
// // //                 const canManage = currentUser?.role === "Admin" || currentUser?.role === "SuperAdmin"
// // //                 return (
// // //                   <tr key={r.id} className="hover:bg-muted/30 transition-colors">
// // //                     <td className="px-6 py-4">
// // //                       <div
// // //                         className="cursor-pointer"
// // //                         onClick={() => setSelectedPerson({ personId: r.personId, personType: r.personType })}
// // //                       >
// // //                         {r.imageUrl ? (
// // //                           <img
// // //                             src={r.imageUrl || "/placeholder.svg"}
// // //                             alt={r.personName || "Person"}
// // //                             className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors shadow-sm"
// // //                           />
// // //                         ) : (
// // //                           <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors shadow-sm">
// // //                             <User className="h-6 w-6 text-muted-foreground" />
// // //                           </div>
// // //                         )}
// // //                       </div>
// // //                     </td>

// // //                     <td className="px-6 py-4">
// // //                       <div className="space-y-1">
// // //                         <div className="text-base font-semibold text-foreground">{r.personName || "Unknown"}</div>
// // //                         <div className="text-sm text-muted-foreground font-medium">
// // //                           {r.personType === "staff"
// // //                             ? `Code: ${r.employeeCode || "N/A"}`
// // //                             : `Roll: ${r.rollNumber || "N/A"}`}
// // //                         </div>
// // //                       </div>
// // //                     </td>

// // //                     <td className="px-6 py-4 hidden md:table-cell">
// // //                       <div className="space-y-1">
// // //                         <div className="text-sm font-medium capitalize text-foreground">{r.personType}</div>
// // //                         {r.personType === "student" && (
// // //                           <div className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md inline-block">
// // //                             {r.classLevel || "N/A"}
// // //                           </div>
// // //                         )}
// // //                         {r.personType === "staff" && (
// // //                           <div className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md inline-block">
// // //                             Staff Member
// // //                           </div>
// // //                         )}
// // //                       </div>
// // //                     </td>

// // //                     <td className="px-6 py-4 hidden md:table-cell">
// // //                       <div className="space-y-1">
// // //                         <div className="text-sm font-medium text-foreground">{r.department}</div>
// // //                         <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md inline-block">
// // //                           {r.role}
// // //                         </div>
// // //                       </div>
// // //                     </td>

// // //                     <td className="px-6 py-4 hidden md:table-cell">
// // //                       <div className="space-y-2">
// // //                         <div className="text-sm font-medium text-foreground">{`${normShift(r.shift) || r.shift} Shift`}</div>
// // //                         <div className="text-xs text-muted-foreground">{shiftWindow}</div>
// // //                         <div className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-md inline-block">
// // //                           Auto-absent: {autoAbsentAt}
// // //                         </div>
// // //                       </div>
// // //                     </td>

// // //                     <td className="px-6 py-4">
// // //                       {isAttendanceMarked(r) ? (
// // //                         <div className="space-y-2">
// // //                           <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
// // //                             <CheckCircle className="h-4 w-4 text-green-600" />
// // //                             <span className="font-medium">Marked as {r.status?.toUpperCase()}</span>
// // //                           </div>
// // //                           <div className="text-xs text-muted-foreground">
// // //                             {r.timestamp && new Date(r.timestamp).toLocaleString()}
// // //                           </div>
// // //                         </div>
// // //                       ) : (
// // //                         <div className="text-sm text-muted-foreground italic">Not marked yet</div>
// // //                       )}
// // //                     </td>

// // //                     <td className="px-6 py-4">
// // //                       {isAttendanceMarked(r) ? (
// // //                         canManage ? (
// // //                           <div className="flex flex-col gap-2 w-40">
// // //                             <Select
// // //                               onValueChange={(v) =>
// // //                                 updateAttendanceStatus(r.id as string, r.personId, r.personType, v as any)
// // //                               }
// // //                             >
// // //                               <SelectTrigger>
// // //                                 <SelectValue placeholder={`Change: ${r.status?.toUpperCase()}`} />
// // //                               </SelectTrigger>
// // //                               <SelectContent>
// // //                                 <SelectItem value="present">Present</SelectItem>
// // //                                 <SelectItem value="absent">Absent</SelectItem>
// // //                                 <SelectItem value="late">Late</SelectItem>
// // //                               </SelectContent>
// // //                             </Select>
// // //                             {updatingStatus === r.id && (
// // //                               <div className="text-xs text-muted-foreground">Updating...</div>
// // //                             )}

// // //                             <Button
// // //                               variant="destructive"
// // //                               size="sm"
// // //                               className="flex items-center gap-2"
// // //                               onClick={() => deleteAttendance(r.id as string, r.personId)}
// // //                               disabled={deletingId === r.id}
// // //                             >
// // //                               <Trash2 className="h-4 w-4" />
// // //                               {deletingId === r.id ? "Deleting..." : "Delete"}
// // //                             </Button>
// // //                           </div>
// // //                         ) : (
// // //                           <div className="text-xs text-muted-foreground">No actions</div>
// // //                         )
// // //                       ) : (
// // //                         <div className="flex flex-col gap-2">
// // //                           <Button
// // //                             size="sm"
// // //                             className="bg-green-600 text-white hover:bg-green-700 shadow-sm font-medium"
// // //                             onClick={() => mark(r.personId, r.personType, "present")}
// // //                           >
// // //                             Present
// // //                           </Button>
// // //                           <div className="flex gap-2">
// // //                             <Button
// // //                               size="sm"
// // //                               variant="outline"
// // //                               className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-medium bg-transparent"
// // //                               onClick={() => mark(r.personId, r.personType, "absent")}
// // //                             >
// // //                               Absent
// // //                             </Button>
// // //                             <Button
// // //                               size="sm"
// // //                               variant="outline"
// // //                               className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 font-medium bg-transparent"
// // //                               onClick={() => mark(r.personId, r.personType, "late")}
// // //                             >
// // //                               Late
// // //                             </Button>
// // //                           </div>
// // //                         </div>
// // //                       )}
// // //                     </td>
// // //                   </tr>
// // //                 )
// // //               })}
// // //               {records.length === 0 && (
// // //                 <tr>
// // //                   <td className="px-6 py-12 text-center text-muted-foreground" colSpan={7}>
// // //                     <div className="flex flex-col items-center gap-2">
// // //                       <Users className="h-8 w-8 text-muted-foreground/50" />
// // //                       <span>No attendance records found for the selected filters.</span>
// // //                     </div>
// // //                   </td>
// // //                 </tr>
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       </Card>

// // //       <Dialog open={showNotMarkedModal} onOpenChange={setShowNotMarkedModal}>
// // //         <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
// // //           <DialogHeader>
// // //             <DialogTitle className="flex items-center gap-2">
// // //               <User className="h-5 w-5" />
// // //               Not Marked Attendance ({notMarkedData?.count ?? 0})
// // //             </DialogTitle>
// // //             <DialogDescription>
// // //               People who haven't marked their attendance yet. You can mark their attendance manually.
// // //             </DialogDescription>
// // //             <div className="mt-3">
// // //               <Button
// // //                 variant="outline"
// // //                 className="h-8 px-3 text-sm bg-transparent"
// // //                 onClick={exportNotMarkedCsv}
// // //                 disabled={!notMarkedPeople.length}
// // //               >
// // //                 Export Not Marked (CSV)
// // //               </Button>
// // //             </div>
// // //           </DialogHeader>

// // //           <div className="overflow-y-auto max-h-[60vh]">
// // //             {!notMarkedData ? (
// // //               <div className="text-center py-8">
// // //                 <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
// // //                 <p className="text-lg font-medium">Loading...</p>
// // //                 <p className="text-muted-foreground">Fetching people who haven't marked attendance.</p>
// // //               </div>
// // //             ) : notMarkedPeople.length === 0 ? (
// // //               <div className="text-center py-8">
// // //                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
// // //                 <p className="text-lg font-medium">All attendance marked!</p>
// // //                 <p className="text-muted-foreground">Everyone has marked their attendance for today.</p>
// // //               </div>
// // //             ) : (
// // //               <div className="space-y-4">
// // //                 {notMarkedPeople.map((person) => (
// // //                   <div
// // //                     key={person.personId}
// // //                     className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
// // //                   >
// // //                     <div className="flex items-center gap-4">
// // //                       <div
// // //                         className="cursor-pointer"
// // //                         onClick={() => setSelectedPerson({ personId: person.personId, personType: person.personType })}
// // //                       >
// // //                         {person.imageUrl ? (
// // //                           <img
// // //                             src={person.imageUrl || "/placeholder.svg"}
// // //                             alt={person.personName}
// // //                             className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors"
// // //                             onError={(e) => {
// // //                               e.currentTarget.style.display = "none"
// // //                               e.currentTarget.nextElementSibling.style.display = "flex"
// // //                             }}
// // //                           />
// // //                         ) : null}
// // //                         <div
// // //                           className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors ${person.imageUrl ? "hidden" : "flex"}`}
// // //                         >
// // //                           <User className="h-6 w-6 text-muted-foreground" />
// // //                         </div>
// // //                       </div>

// // //                       <div className="space-y-1">
// // //                         <div className="font-semibold">{person.personName}</div>
// // //                         <div className="text-sm text-muted-foreground">
// // //                           {person.personType === "staff"
// // //                             ? `Employee Code: ${person.employeeCode || "N/A"}`
// // //                             : `Roll Number: ${person.rollNumber || "N/A"}`}
// // //                         </div>
// // //                         <div className="text-xs text-muted-foreground">
// // //                           {person.department} • {person.role} • {person.shift} Shift
// // //                           {person.personType === "student" && person.classLevel && ` • ${person.classLevel}`}
// // //                         </div>
// // //                       </div>
// // //                     </div>

// // //                     <div className="flex gap-2">
// // //                       <Button
// // //                         size="sm"
// // //                         className="bg-green-600 text-white hover:bg-green-700 shadow-sm"
// // //                         onClick={() => handleManualMark(person.personId, person.personType, "present")}
// // //                       >
// // //                         Present
// // //                       </Button>
// // //                       <Button
// // //                         size="sm"
// // //                         variant="outline"
// // //                         className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
// // //                         onClick={() => handleManualMark(person.personId, person.personType, "absent")}
// // //                       >
// // //                         Absent
// // //                       </Button>
// // //                       <Button
// // //                         size="sm"
// // //                         variant="outline"
// // //                         className="border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
// // //                         onClick={() => handleManualMark(person.personId, person.personType, "late")}
// // //                       >
// // //                         Late
// // //                       </Button>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>
// // //         </DialogContent>
// // //       </Dialog>

// // //       <PersonDetailsModal
// // //         isOpen={!!selectedPerson}
// // //         onClose={() => setSelectedPerson(null)}
// // //         personId={selectedPerson?.personId || ""}
// // //         personType={selectedPerson?.personType || "staff"}
// // //       />
// // //     </div>
// // //   )
// // // }


// // "use client"

// // import useSWR from "swr"
// // import { AttendanceFilters, type AttendanceFiltersState } from "@/components/attendance-filters"
// // import { ExportAttendance } from "@/components/export-attendance"
// // import type { Department, Role, Shift, AttendanceRecord } from "@/lib/types"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { PersonDetailsModal } from "@/components/person-details-modal"
// // import {
// //   User,
// //   Users,
// //   UserCheck,
// //   UserX,
// //   Clock,
// //   RefreshCw,
// //   AlertCircle,
// //   CheckCircle,
// //   Wifi,
// //   WifiOff,
// //   Trash2,
// // } from "lucide-react"
// // import { useMemo, useState, useEffect } from "react"
// // import { Alert, AlertDescription } from "@/components/ui/alert"
// // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// // import { realtimeClient } from "@/lib/realtime-client"
// // import { getStoredUser } from "@/lib/auth" // import user helper
// // import { useToast } from "@/hooks/use-toast"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // export default function AttendancePage() {
// //   const [filters, setFilters] = useState<AttendanceFiltersState>({
// //     date: new Date().toISOString().slice(0, 10), // Default to today
// //     status: "all", // Added default status filter
// //     personType: "all", // Added default personType filter
// //   })
// //   const [selectedPerson, setSelectedPerson] = useState<{
// //     personId: string
// //     personType: "staff" | "student"
// //   } | null>(null)
// //   const [isAutoMarking, setIsAutoMarking] = useState(false)
// //   const [attendanceMessage, setAttendanceMessage] = useState<{
// //     type: "success" | "error" | "warning"
// //     message: string
// //   } | null>(null)
// //   const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
// //   const [showNotMarkedModal, setShowNotMarkedModal] = useState(false)
// //   const [isConnected, setIsConnected] = useState(false)
// //   const [realtimeUpdates, setRealtimeUpdates] = useState(0)
// //   const [currentUser, setCurrentUser] = useState<any>(null) // track current user
// //   const [deletingId, setDeletingId] = useState<string | null>(null) // track deleting state
// //   const { toast } = useToast()

// //   useEffect(() => {
// //     function onAttendanceUpdate(data: any) {
// //       console.log("[v0] Real-time attendance update received:", data)
// //       setRealtimeUpdates((prev) => prev + 1)

// //       toast({
// //         title: "Attendance updated",
// //         description: `${data.personName} marked as ${String(data.status || "").toUpperCase()}`,
// //       })

// //       mutate()
// //       mutateNotMarked()
// //     }

// //     function onStatsUpdate(stats: any) {
// //       console.log("[v0] Real-time attendance stats:", stats)
// //       // Refresh data when stats update
// //       mutate()
// //       mutateNotMarked()
// //     }

// //     function onAutoMarkComplete(data: any) {
// //       console.log("[v0] Auto-mark complete:", data)
// //       if (data.markedAbsent > 0) {
// //         toast({
// //           title: "Auto-mark finished",
// //           description: `Auto-marked ${data.markedAbsent} people as absent`,
// //           variant: "default",
// //         })
// //         mutate()
// //         mutateNotMarked()
// //       }
// //     }

// //     // Set up event listeners
// //     realtimeClient.on("attendance_update", onAttendanceUpdate)
// //     realtimeClient.on("stats_update", onStatsUpdate)
// //     realtimeClient.on("auto_mark_complete", onAutoMarkComplete)

// //     // Connect to real-time updates
// //     realtimeClient.connect()
// //     setIsConnected(true)
// //     console.log("[v0] Real-time client connected to attendance page")

// //     return () => {
// //       realtimeClient.off("attendance_update", onAttendanceUpdate)
// //       realtimeClient.off("stats_update", onStatsUpdate)
// //       realtimeClient.off("auto_mark_complete", onAutoMarkComplete)
// //       realtimeClient.disconnect()
// //       setIsConnected(false)
// //     }
// //   }, [toast])

// //   useEffect(() => {
// //     const checkAndAutoMarkAbsent = async () => {
// //       try {
// //         const res = await fetch("/api/attendance/auto-mark", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //         })
// //         const result = await res.json()

// //         if (res.ok && result.markedAbsent > 0) {
// //           setAttendanceMessage({
// //             type: "warning",
// //             message: `Automatically marked ${result.markedAbsent} people as absent due to shift time closure`,
// //           })
// //           mutate()

// //           setTimeout(() => setAttendanceMessage(null), 8000)
// //         }
// //       } catch (error) {
// //         console.error("Auto-mark check failed:", error)
// //       }
// //     }

// //     checkAndAutoMarkAbsent()

// //     const interval = setInterval(checkAndAutoMarkAbsent, 300000)

// //     return () => clearInterval(interval)
// //   }, [])

// //   useEffect(() => {
// //     setCurrentUser(getStoredUser())
// //   }, [])

// //   const { data: shiftSettingsData } = useSWR(
// //     currentUser?.institutionName
// //       ? `/api/shifts?institutionName=${encodeURIComponent(currentUser.institutionName)}`
// //       : null,
// //     fetcher,
// //   )
// //   const shiftSettings: Array<{ name: string; start: string; end: string }> = shiftSettingsData?.shifts || []

// //   const normShift = (s?: string | null) => {
// //     if (!s) return null
// //     const lower = s.toLowerCase()
// //     if (lower.startsWith("morn")) return "Morning"
// //     if (lower.startsWith("even")) return "Evening"
// //     if (lower.startsWith("nig")) return "Night"
// //     return s
// //   }
// //   const formatShiftWindow = (s?: string | null) => {
// //     const key = normShift(s)
// //     if (!key) return "N/A"
// //     const fromSettings = shiftSettings.find((x) => (x.name?.toLowerCase?.() || "").includes(key.toLowerCase()))
// //     if (fromSettings) return `${fromSettings.start} - ${fromSettings.end}`
// //     try {
// //       const { SHIFT_TIMINGS } = require("@/lib/constants")
// //       const t = SHIFT_TIMINGS[key as keyof typeof SHIFT_TIMINGS]
// //       return t ? `${t.start} - ${t.end}` : "N/A"
// //     } catch {
// //       return "N/A"
// //     }
// //   }
// //   const formatAutoAbsent = (s?: string | null) => {
// //     const key = normShift(s)
// //     if (!key) return "N/A"
// //     try {
// //       const { ABSENT_THRESHOLDS } = require("@/lib/constants")
// //       const t = ABSENT_THRESHOLDS[key as keyof typeof ABSENT_THRESHOLDS]
// //       return t || "N/A"
// //     } catch {
// //       return "N/A"
// //     }
// //   }

// //   const params = new URLSearchParams()
// //   if (filters.department && filters.department !== "all") params.set("department", filters.department)
// //   if (filters.role && filters.role !== "all") params.set("role", filters.role)
// //   if (filters.shift && filters.shift !== "all") params.set("shift", filters.shift)
// //   if (filters.status && filters.status !== "all") params.set("status", filters.status)
// //   if (filters.date) params.set("date", filters.date)
// //   if (filters.personType && filters.personType !== "all") params.set("personType", filters.personType)
// //   if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
// //     params.set("institutionName", currentUser.institutionName)
// //   }

// //   const { data, mutate } = useSWR<{
// //     records: (AttendanceRecord & {
// //       personName?: string
// //       imageUrl?: string
// //       employeeCode?: string
// //       rollNumber?: string
// //       classLevel?: string
// //     })[]
// //     departments: Department[]
// //     roles: Role[]
// //     shifts: Shift[]
// //     totalCounts: {
// //       totalPeople: number
// //       present: number
// //       absent: number
// //       late: number
// //     }
// //   }>(`/api/attendance?${params.toString()}`, fetcher)

// //   const notMarkedUrlParams = new URLSearchParams()
// //   if (filters.date) notMarkedUrlParams.set("date", filters.date)
// //   if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
// //     notMarkedUrlParams.set("institutionName", currentUser.institutionName)
// //   }
// //   const { data: notMarkedData, mutate: mutateNotMarked } = useSWR(
// //     `/api/attendance/not-marked?${notMarkedUrlParams.toString()}`,
// //     fetcher,
// //   )

// //   const records = data?.records ?? []
// //   const departments = data?.departments ?? []
// //   const roles = data?.roles ?? []
// //   const shifts = data?.shifts ?? []
// //   const totalCounts = data?.totalCounts ?? { totalPeople: 0, present: 0, absent: 0, late: 0 }

// //   const notMarkedPeople = notMarkedData?.notMarkedPeople ?? []

// //   const counts = useMemo(
// //     () => ({
// //       present: records.filter((r) => r.status === "present").length,
// //       absent: records.filter((r) => r.status === "absent").length,
// //       late: records.filter((r) => r.status === "late").length,
// //     }),
// //     [records],
// //   )

// //   async function mark(personId: string, personType: "staff" | "student", status: "present" | "absent" | "late") {
// //     const body = { personId, personType, status, date: filters.date }
// //     const res = await fetch("/api/attendance", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(body),
// //     })

// //     const result = await res.json()

// //     if (res.status === 409) {
// //       setAttendanceMessage({
// //         type: "warning",
// //         message: result.message,
// //       })
// //       toast({ title: "Already marked", description: result.message })
// //     } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
// //       setAttendanceMessage({
// //         type: "error",
// //         message: result.message,
// //       })
// //       toast({ title: "Outside shift hours", description: result.message, variant: "destructive" })
// //     } else if (!res.ok) {
// //       setAttendanceMessage({
// //         type: "error",
// //         message: "Failed to mark attendance",
// //       })
// //       toast({ title: "Failed to mark", description: "Please try again.", variant: "destructive" })
// //     } else {
// //       setAttendanceMessage({
// //         type: "success",
// //         message: result.message,
// //       })
// //       toast({ title: "Success", description: result.message })
// //       mutate()
// //     }

// //     setTimeout(() => setAttendanceMessage(null), 5000)
// //   }

// //   async function autoMarkAbsent() {
// //     setIsAutoMarking(true)
// //     try {
// //       const res = await fetch("/api/attendance/auto-mark", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //       })
// //       const result = await res.json()
// //       if (res.ok) {
// //         setAttendanceMessage({
// //           type: "success",
// //           message: result.message,
// //         })
// //         toast({ title: "Auto-mark requested", description: result.message })
// //         mutate()
// //       } else {
// //         setAttendanceMessage({
// //           type: "error",
// //           message: "Failed to auto-mark attendance",
// //         })
// //         toast({ title: "Auto-mark failed", description: "Please try again.", variant: "destructive" })
// //       }
// //     } catch (error) {
// //       setAttendanceMessage({
// //         type: "error",
// //         message: "Error auto-marking attendance",
// //       })
// //       toast({ title: "Error auto-marking", description: "Please try again.", variant: "destructive" })
// //     } finally {
// //       setIsAutoMarking(false)
// //       setTimeout(() => setAttendanceMessage(null), 5000)
// //     }
// //   }

// //   async function updateAttendanceStatus(
// //     recordId: string,
// //     personId: string,
// //     personType: "staff" | "student",
// //     newStatus: "present" | "absent" | "late",
// //   ) {
// //     setUpdatingStatus(recordId)
// //     try {
// //       const res = await fetch("/api/attendance", {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           recordId,
// //           personId,
// //           personType,
// //           status: newStatus,
// //           date: filters.date,
// //         }),
// //       })

// //       const result = await res.json()
// //       console.log("[v0] Manual mark response:", result)

// //       if (res.ok) {
// //         setAttendanceMessage({
// //           type: "success",
// //           message: `Attendance status updated to ${newStatus.toUpperCase()} successfully`,
// //         })
// //         toast({ title: "Status updated", description: `Set to ${newStatus.toUpperCase()}` })
// //         mutate()
// //       } else {
// //         setAttendanceMessage({
// //           type: "error",
// //           message: result.message || "Failed to update attendance status",
// //         })
// //         toast({ title: "Update failed", description: result.message || "Please try again.", variant: "destructive" })
// //       }
// //     } catch (error) {
// //       setAttendanceMessage({
// //         type: "error",
// //         message: "Error updating attendance status",
// //       })
// //       toast({ title: "Error updating", description: "Please try again.", variant: "destructive" })
// //     } finally {
// //       setUpdatingStatus(null)
// //       setTimeout(() => setAttendanceMessage(null), 5000)
// //     }
// //   }

// //   const isAttendanceMarked = (record: any) => {
// //     return record.status && record.timestamp
// //   }

// //   async function handleManualMark(
// //     personId: string,
// //     personType: "staff" | "student",
// //     status: "present" | "absent" | "late",
// //   ) {
// //     console.log("[v0] Manual marking:", { personId, personType, status })

// //     try {
// //       const body = { personId, personType, status, date: filters.date }
// //       const res = await fetch("/api/attendance", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(body),
// //       })

// //       const result = await res.json()
// //       console.log("[v0] Manual mark response:", result)

// //       if (res.status === 409) {
// //         setAttendanceMessage({
// //           type: "warning",
// //           message: result.message,
// //         })
// //         toast({ title: "Already marked", description: result.message })
// //       } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
// //         setAttendanceMessage({
// //           type: "error",
// //           message: result.message,
// //         })
// //         toast({ title: "Outside shift hours", description: result.message, variant: "destructive" })
// //       } else if (!res.ok) {
// //         setAttendanceMessage({
// //           type: "error",
// //           message: "Failed to mark attendance",
// //         })
// //         toast({ title: "Failed to mark", description: "Please try again.", variant: "destructive" })
// //       } else {
// //         setAttendanceMessage({
// //           type: "success",
// //           message: result.message,
// //         })
// //         toast({ title: "Success", description: result.message })
// //         mutate()
// //         mutateNotMarked()
// //       }

// //       setTimeout(() => setAttendanceMessage(null), 5000)
// //     } catch (error) {
// //       console.error("[v0] Manual mark error:", error)
// //       setAttendanceMessage({
// //         type: "error",
// //         message: "Error marking attendance",
// //       })
// //       toast({ title: "Error marking", description: "Please try again.", variant: "destructive" })
// //       setTimeout(() => setAttendanceMessage(null), 5000)
// //     }
// //   }

// //   function exportNotMarkedCsv() {
// //     if (!notMarkedPeople.length) {
// //       alert("No data to export")
// //       return
// //     }
// //     const headers = ["Name", "Type", "Employee Code/Roll", "Department", "Role", "Shift", "Class Level"]
// //     const rows = notMarkedPeople.map((p) => [
// //       p.personName || "Unknown",
// //       p.personType,
// //       p.personType === "staff" ? p.employeeCode || "N/A" : p.rollNumber || "N/A",
// //       p.department || "N/A",
// //       p.role || "N/A",
// //       p.shift || "N/A",
// //       p.personType === "student" ? p.classLevel || "N/A" : "N/A",
// //     ])

// //     const csv = [headers, ...rows]
// //       .map((r) =>
// //         r
// //           .map((field) => {
// //             const s = String(field ?? "")
// //             if (s.includes(",") || s.includes('"') || s.includes("\n")) {
// //               return `"${s.replace(/"/g, '""')}"`
// //             }
// //             return s
// //           })
// //           .join(","),
// //       )
// //       .join("\n")

// //     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
// //     const url = URL.createObjectURL(blob)
// //     const a = document.createElement("a")
// //     a.href = url
// //     const datePart = notMarkedData?.date || new Date().toISOString().slice(0, 10)
// //     a.download = `not-marked-${datePart}.csv`
// //     document.body.appendChild(a)
// //     a.click()
// //     document.body.removeChild(a)
// //     URL.revokeObjectURL(url)
// //   }

// //   async function deleteAttendance(recordId: string, personId: string) {
// //     const confirmed = window.confirm("Delete this attendance record? This will mark them as 'Not Marked' for the day.")
// //     if (!confirmed) return

// //     setDeletingId(recordId)
// //     try {
// //       const res = await fetch("/api/attendance", {
// //         method: "DELETE",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ recordId, personId, date: filters.date }),
// //       })
// //       const result = await res.json()

// //       if (res.ok) {
// //         toast({ title: "Deleted", description: "Attendance record deleted" })
// //         await Promise.all([mutate(), mutateNotMarked()])
// //       } else {
// //         toast({ title: "Delete failed", description: result?.message || "Please try again.", variant: "destructive" })
// //       }
// //     } catch (err) {
// //       toast({ title: "Error", description: "Failed to delete record. Please try again.", variant: "destructive" })
// //     } finally {
// //       setDeletingId(null)
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8">
// //       <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-card rounded-xl border shadow-sm">
// //         <div className="space-y-2">
// //           {currentUser?.institutionName && (
// //             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
// //               {currentUser.institutionName}
// //             </div>
// //           )}
// //           <div className="flex items-center gap-3">
// //             <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
// //               Attendance Management
// //             </h1>
// //             <div className="flex items-center gap-2">
// //               {isConnected ? (
// //                 <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
// //                   <Wifi className="h-3 w-3" />
// //                   Live
// //                 </div>
// //               ) : (
// //                 <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
// //                   <WifiOff className="h-3 w-3" />
// //                   Offline
// //                 </div>
// //               )}
// //               {realtimeUpdates > 0 && (
// //                 <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
// //                   {realtimeUpdates} updates
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //           <p className="text-muted-foreground leading-relaxed max-w-2xl">
// //             View and manage attendance. Auto-absent thresholds and shift windows follow your institution’s shift
// //             settings.
// //             {isConnected && " Real-time updates enabled via Face Recognition."}
// //           </p>
// //         </div>
// //         <div className="flex flex-col sm:flex-row gap-3">
// //           <Button
// //             onClick={autoMarkAbsent}
// //             disabled={isAutoMarking}
// //             variant="outline"
// //             className="flex items-center gap-2 bg-accent/10 border-accent/20 hover:bg-accent/20 text-accent font-medium"
// //           >
// //             <RefreshCw className={`h-4 w-4 ${isAutoMarking ? "animate-spin" : ""}`} />
// //             {isAutoMarking ? "Auto Marking..." : "Manual Auto Mark"}
// //           </Button>
// //           <ExportAttendance
// //             records={records}
// //             filters={{
// //               department: filters.department,
// //               role: filters.role,
// //               shift: filters.shift,
// //               status: filters.status,
// //               date: filters.date,
// //               personType: filters.personType,
// //             }}
// //           />
// //         </div>
// //       </header>

// //       {attendanceMessage && (
// //         <Alert
// //           className={`${
// //             attendanceMessage.type === "success"
// //               ? "border-green-200 bg-green-50"
// //               : attendanceMessage.type === "warning"
// //                 ? "border-amber-200 bg-amber-50"
// //                 : "border-red-200 bg-red-50"
// //           }`}
// //         >
// //           {attendanceMessage.type === "success" ? (
// //             <CheckCircle className="h-4 w-4 text-green-600" />
// //           ) : (
// //             <AlertCircle className="h-4 w-4 text-amber-600" />
// //           )}
// //           <AlertDescription
// //             className={`${
// //               attendanceMessage.type === "success"
// //                 ? "text-green-800"
// //                 : attendanceMessage.type === "warning"
// //                   ? "text-amber-800"
// //                   : "text-red-800"
// //             }`}
// //           >
// //             {attendanceMessage.message}
// //             {attendanceMessage.message.includes("Face Recognition") && (
// //               <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
// //                 <Wifi className="h-3 w-3" />
// //                 Real-time
// //               </span>
// //             )}
// //           </AlertDescription>
// //         </Alert>
// //       )}

// //       <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
// //         <CardContent className="pt-6">
// //           <AttendanceFilters
// //             departments={departments}
// //             roles={roles}
// //             shifts={shifts}
// //             value={filters}
// //             onChange={setFilters}
// //           />
// //         </CardContent>
// //       </Card>

// //       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
// //         <Card className="bg-gradient-to-br from-card to-muted/20 border-0 shadow-sm hover:shadow-md transition-shadow">
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-semibold text-muted-foreground">Total People</CardTitle>
// //             <Users className="h-5 w-5 text-primary" />
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-3xl font-bold text-foreground">{totalCounts.totalPeople}</div>
// //             <p className="text-xs text-muted-foreground mt-1">All registered people</p>
// //           </CardContent>
// //         </Card>

// //         <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-semibold text-green-700">Present</CardTitle>
// //             <UserCheck className="h-5 w-5 text-green-600" />
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-3xl font-bold text-green-700">{totalCounts.present}</div>
// //             <p className="text-xs text-green-600 mt-1">Filtered: {counts.present}</p>
// //           </CardContent>
// //         </Card>

// //         <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-sm hover:shadow-md transition-shadow">
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-semibold text-red-700">Absent</CardTitle>
// //             <UserX className="h-5 w-5 text-red-600" />
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-3xl font-bold text-red-700">{totalCounts.absent}</div>
// //             <p className="text-xs text-red-600 mt-1">Filtered: {counts.absent}</p>
// //           </CardContent>
// //         </Card>

// //         <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-semibold text-amber-700">Late</CardTitle>
// //             <Clock className="h-5 w-5 text-amber-600" />
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-3xl font-bold text-amber-700">{totalCounts.late}</div>
// //             <p className="text-xs text-amber-600 mt-1">Filtered: {counts.late}</p>
// //           </CardContent>
// //         </Card>

// //         <Card
// //           className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
// //           onClick={() => setShowNotMarkedModal(true)}
// //         >
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-semibold text-slate-700">Not Marked</CardTitle>
// //             <User className="h-5 w-5 text-slate-600" />
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-3xl font-bold text-slate-700">{notMarkedData?.count ?? 0}</div>
// //             <p className="text-xs text-slate-600 mt-1">Click to view & mark</p>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       <Card className="shadow-sm border-0 overflow-hidden">
// //         <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
// //           <table className="min-w-full">
// //             <thead className="sticky top-0 z-10 bg-card shadow-sm">
// //               <tr>
// //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
// //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name & Code/Roll</th>
// //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
// //                   Type & Class Level
// //                 </th>
// //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
// //                   Department & Role
// //                 </th>
// //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
// //                   Shift & Timing
// //                 </th>
// //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status & Time</th>
// //                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-border/50">
// //               {records.map((r) => {
// //                 const shiftWindow = formatShiftWindow(r.shift)
// //                 const autoAbsentAt = formatAutoAbsent(r.shift)
// //                 const canUpdate =
// //                   currentUser?.role === "Admin" || currentUser?.role === "SuperAdmin" || currentUser?.role === "Teacher"
// //                 const canDelete = currentUser?.role === "Admin" || currentUser?.role === "SuperAdmin"
// //                 return (
// //                   <tr key={r.id} className="hover:bg-muted/30 transition-colors">
// //                     <td className="px-6 py-4">
// //                       <div
// //                         className="cursor-pointer"
// //                         onClick={() => setSelectedPerson({ personId: r.personId, personType: r.personType })}
// //                       >
// //                         {r.imageUrl ? (
// //                           <img
// //                             src={r.imageUrl || "/placeholder.svg"}
// //                             alt={r.personName || "Person"}
// //                             className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors shadow-sm"
// //                           />
// //                         ) : (
// //                           <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors shadow-sm">
// //                             <User className="h-6 w-6 text-muted-foreground" />
// //                           </div>
// //                         )}
// //                       </div>
// //                     </td>

// //                     <td className="px-6 py-4">
// //                       <div className="space-y-1">
// //                         <div className="text-base font-semibold text-foreground">{r.personName || "Unknown"}</div>
// //                         <div className="text-sm text-muted-foreground font-medium">
// //                           {r.personType === "staff"
// //                             ? `Code: ${r.employeeCode || "N/A"}`
// //                             : `Roll: ${r.rollNumber || "N/A"}`}
// //                         </div>
// //                       </div>
// //                     </td>

// //                     <td className="px-6 py-4 hidden md:table-cell">
// //                       <div className="space-y-1">
// //                         <div className="text-sm font-medium capitalize text-foreground">{r.personType}</div>
// //                         {r.personType === "student" && (
// //                           <div className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md inline-block">
// //                             {r.classLevel || "N/A"}
// //                           </div>
// //                         )}
// //                         {r.personType === "staff" && (
// //                           <div className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md inline-block">
// //                             Staff Member
// //                           </div>
// //                         )}
// //                       </div>
// //                     </td>

// //                     <td className="px-6 py-4 hidden md:table-cell">
// //                       <div className="space-y-1">
// //                         <div className="text-sm font-medium text-foreground">{r.department}</div>
// //                         <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md inline-block">
// //                           {r.role}
// //                         </div>
// //                       </div>
// //                     </td>

// //                     <td className="px-6 py-4 hidden md:table-cell">
// //                       <div className="space-y-2">
// //                         <div className="text-sm font-medium text-foreground">{`${normShift(r.shift) || r.shift} Shift`}</div>
// //                         <div className="text-xs text-muted-foreground">{shiftWindow}</div>
// //                         <div className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-md inline-block">
// //                           Auto-absent: {autoAbsentAt}
// //                         </div>
// //                       </div>
// //                     </td>

// //                     <td className="px-6 py-4">
// //                       {isAttendanceMarked(r) ? (
// //                         <div className="space-y-2">
// //                           <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
// //                             <CheckCircle className="h-4 w-4 text-green-600" />
// //                             <span className="font-medium">Marked as {r.status?.toUpperCase()}</span>
// //                           </div>
// //                           <div className="text-xs text-muted-foreground">
// //                             {r.timestamp && new Date(r.timestamp).toLocaleString()}
// //                           </div>
// //                         </div>
// //                       ) : (
// //                         <div className="text-sm text-muted-foreground italic">Not marked yet</div>
// //                       )}
// //                     </td>

// //                     <td className="px-6 py-4">
// //                       {isAttendanceMarked(r) ? (
// //                         canUpdate ? (
// //                           <div className="flex flex-col gap-2 w-40">
// //                             <Select
// //                               onValueChange={(v) =>
// //                                 updateAttendanceStatus(r.id as string, r.personId, r.personType, v as any)
// //                               }
// //                             >
// //                               <SelectTrigger>
// //                                 <SelectValue placeholder={`Change: ${r.status?.toUpperCase()}`} />
// //                               </SelectTrigger>
// //                               <SelectContent>
// //                                 <SelectItem value="present">Present</SelectItem>
// //                                 <SelectItem value="absent">Absent</SelectItem>
// //                                 <SelectItem value="late">Late</SelectItem>
// //                               </SelectContent>
// //                             </Select>
// //                             {updatingStatus === r.id && (
// //                               <div className="text-xs text-muted-foreground">Updating...</div>
// //                             )}

// //                             {canDelete && (
// //                               <Button
// //                                 variant="destructive"
// //                                 size="sm"
// //                                 className="flex items-center gap-2"
// //                                 onClick={() => deleteAttendance(r.id as string, r.personId)}
// //                                 disabled={deletingId === r.id}
// //                               >
// //                                 <Trash2 className="h-4 w-4" />
// //                                 {deletingId === r.id ? "Deleting..." : "Delete"}
// //                               </Button>
// //                             )}
// //                           </div>
// //                         ) : (
// //                           <div className="text-xs text-muted-foreground">No actions</div>
// //                         )
// //                       ) : (
// //                         <div className="flex flex-col gap-2">
// //                           <Button
// //                             size="sm"
// //                             className="bg-green-600 text-white hover:bg-green-700 shadow-sm font-medium"
// //                             onClick={() => mark(r.personId, r.personType, "present")}
// //                           >
// //                             Present
// //                           </Button>
// //                           <div className="flex gap-2">
// //                             <Button
// //                               size="sm"
// //                               variant="outline"
// //                               className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-medium bg-transparent"
// //                               onClick={() => mark(r.personId, r.personType, "absent")}
// //                             >
// //                               Absent
// //                             </Button>
// //                             <Button
// //                               size="sm"
// //                               variant="outline"
// //                               className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 font-medium bg-transparent"
// //                               onClick={() => mark(r.personId, r.personType, "late")}
// //                             >
// //                               Late
// //                             </Button>
// //                           </div>
// //                         </div>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 )
// //               })}
// //               {records.length === 0 && (
// //                 <tr>
// //                   <td className="px-6 py-12 text-center text-muted-foreground" colSpan={7}>
// //                     <div className="flex flex-col items-center gap-2">
// //                       <Users className="h-8 w-8 text-muted-foreground/50" />
// //                       <span>No attendance records found for the selected filters.</span>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </Card>

// //       <Dialog open={showNotMarkedModal} onOpenChange={setShowNotMarkedModal}>
// //         <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
// //           <DialogHeader>
// //             <DialogTitle className="flex items-center gap-2">
// //               <User className="h-5 w-5" />
// //               Not Marked Attendance ({notMarkedData?.count ?? 0})
// //             </DialogTitle>
// //             <DialogDescription>
// //               People who haven't marked their attendance yet. You can mark their attendance manually.
// //             </DialogDescription>
// //             <div className="mt-3">
// //               <Button
// //                 variant="outline"
// //                 className="h-8 px-3 text-sm bg-transparent"
// //                 onClick={exportNotMarkedCsv}
// //                 disabled={!notMarkedPeople.length}
// //               >
// //                 Export Not Marked (CSV)
// //               </Button>
// //             </div>
// //           </DialogHeader>

// //           <div className="overflow-y-auto max-h-[60vh]">
// //             {!notMarkedData ? (
// //               <div className="text-center py-8">
// //                 <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
// //                 <p className="text-lg font-medium">Loading...</p>
// //                 <p className="text-muted-foreground">Fetching people who haven't marked attendance.</p>
// //               </div>
// //             ) : notMarkedPeople.length === 0 ? (
// //               <div className="text-center py-8">
// //                 <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
// //                 <p className="text-lg font-medium">All attendance marked!</p>
// //                 <p className="text-muted-foreground">Everyone has marked their attendance for today.</p>
// //               </div>
// //             ) : (
// //               <div className="space-y-4">
// //                 {notMarkedPeople.map((person) => (
// //                   <div
// //                     key={person.personId}
// //                     className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
// //                   >
// //                     <div className="flex items-center gap-4">
// //                       <div
// //                         className="cursor-pointer"
// //                         onClick={() => setSelectedPerson({ personId: person.personId, personType: person.personType })}
// //                       >
// //                         {person.imageUrl ? (
// //                           <img
// //                             src={person.imageUrl || "/placeholder.svg"}
// //                             alt={person.personName}
// //                             className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors"
// //                             onError={(e) => {
// //                               e.currentTarget.style.display = "none"
// //                               e.currentTarget.nextElementSibling.style.display = "flex"
// //                             }}
// //                           />
// //                         ) : null}
// //                         <div
// //                           className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors ${person.imageUrl ? "hidden" : "flex"}`}
// //                         >
// //                           <User className="h-6 w-6 text-muted-foreground" />
// //                         </div>
// //                       </div>

// //                       <div className="space-y-1">
// //                         <div className="font-semibold">{person.personName}</div>
// //                         <div className="text-sm text-muted-foreground">
// //                           {person.personType === "staff"
// //                             ? `Employee Code: ${person.employeeCode || "N/A"}`
// //                             : `Roll Number: ${person.rollNumber || "N/A"}`}
// //                         </div>
// //                         <div className="text-xs text-muted-foreground">
// //                           {person.department} • {person.role} • {person.shift} Shift
// //                           {person.personType === "student" && person.classLevel && ` • ${person.classLevel}`}
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <div className="flex gap-2">
// //                       <Button
// //                         size="sm"
// //                         className="bg-green-600 text-white hover:bg-green-700 shadow-sm"
// //                         onClick={() => handleManualMark(person.personId, person.personType, "present")}
// //                       >
// //                         Present
// //                       </Button>
// //                       <Button
// //                         size="sm"
// //                         variant="outline"
// //                         className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
// //                         onClick={() => handleManualMark(person.personId, person.personType, "absent")}
// //                       >
// //                         Absent
// //                       </Button>
// //                       <Button
// //                         size="sm"
// //                         variant="outline"
// //                         className="border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
// //                         onClick={() => handleManualMark(person.personId, person.personType, "late")}
// //                       >
// //                         Late
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </DialogContent>
// //       </Dialog>

// //       <PersonDetailsModal
// //         isOpen={!!selectedPerson}
// //         onClose={() => setSelectedPerson(null)}
// //         personId={selectedPerson?.personId || ""}
// //         personType={selectedPerson?.personType || "staff"}
// //       />
// //     </div>
// //   )
// // }





// "use client"

// import useSWR from "swr"
// import { AttendanceFilters, type AttendanceFiltersState } from "@/components/attendance-filters"
// import { ExportAttendance } from "@/components/export-attendance"
// import type { Department, Role, Shift, AttendanceRecord } from "@/lib/types"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { PersonDetailsModal } from "@/components/person-details-modal"
// import {
//   User,
//   Users,
//   UserCheck,
//   UserX,
//   Clock,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle,
//   Wifi,
//   WifiOff,
//   Trash2,
// } from "lucide-react"
// import { useMemo, useState, useEffect } from "react"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { realtimeClient } from "@/lib/realtime-client"
// import { getStoredUser } from "@/lib/auth" // import user helper
// import { useToast } from "@/hooks/use-toast"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// const fetcher = (url: string) => fetch(url).then((r) => r.json())

// export default function AttendancePage() {
//   const [filters, setFilters] = useState<AttendanceFiltersState>({
//     date: new Date().toISOString().slice(0, 10), // Default to today
//     status: "all", // Added default status filter
//     personType: "all", // Added default personType filter
//   })
//   const [selectedPerson, setSelectedPerson] = useState<{
//     personId: string
//     personType: "staff" | "student"
//   } | null>(null)
//   const [isAutoMarking, setIsAutoMarking] = useState(false)
//   const [attendanceMessage, setAttendanceMessage] = useState<{
//     type: "success" | "error" | "warning"
//     message: string
//   } | null>(null)
//   const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
//   const [showNotMarkedModal, setShowNotMarkedModal] = useState(false)
//   const [isConnected, setIsConnected] = useState(false)
//   const [realtimeUpdates, setRealtimeUpdates] = useState(0)
//   const [currentUser, setCurrentUser] = useState<any>(null) // track current user
//   const isStudent = currentUser?.role === "Student"
//   const [deletingId, setDeletingId] = useState<string | null>(null) // track deleting state
//   const { toast } = useToast()

//   useEffect(() => {
//     function onAttendanceUpdate(data: any) {
//       console.log("[v0] Real-time attendance update received:", data)
//       setRealtimeUpdates((prev) => prev + 1)

//       toast({
//         title: "Attendance updated",
//         description: `${data.personName} marked as ${String(data.status || "").toUpperCase()}`,
//       })

//       mutate()
//       mutateNotMarked()
//     }

//     function onStatsUpdate(stats: any) {
//       console.log("[v0] Real-time attendance stats:", stats)
//       // Refresh data when stats update
//       mutate()
//       mutateNotMarked()
//     }

//     function onAutoMarkComplete(data: any) {
//       console.log("[v0] Auto-mark complete:", data)
//       if (data.markedAbsent > 0) {
//         toast({
//           title: "Auto-mark finished",
//           description: `Auto-marked ${data.markedAbsent} people as absent`,
//           variant: "default",
//         })
//         mutate()
//         mutateNotMarked()
//       }
//     }

//     // Set up event listeners
//     realtimeClient.on("attendance_update", onAttendanceUpdate)
//     realtimeClient.on("stats_update", onStatsUpdate)
//     realtimeClient.on("auto_mark_complete", onAutoMarkComplete)

//     // Connect to real-time updates
//     realtimeClient.connect()
//     setIsConnected(true)
//     console.log("[v0] Real-time client connected to attendance page")

//     return () => {
//       realtimeClient.off("attendance_update", onAttendanceUpdate)
//       realtimeClient.off("stats_update", onStatsUpdate)
//       realtimeClient.off("auto_mark_complete", onAutoMarkComplete)
//       realtimeClient.disconnect()
//       setIsConnected(false)
//     }
//   }, [toast])

//   useEffect(() => {
//     const checkAndAutoMarkAbsent = async () => {
//       try {
//         const res = await fetch("/api/attendance/auto-mark", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//         })
//         const result = await res.json()

//         if (res.ok && result.markedAbsent > 0) {
//           setAttendanceMessage({
//             type: "warning",
//             message: `Automatically marked ${result.markedAbsent} people as absent due to shift time closure`,
//           })
//           mutate()

//           setTimeout(() => setAttendanceMessage(null), 8000)
//         }
//       } catch (error) {
//         console.error("Auto-mark check failed:", error)
//       }
//     }

//     checkAndAutoMarkAbsent()

//     const interval = setInterval(checkAndAutoMarkAbsent, 300000)

//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     setCurrentUser(getStoredUser())
//   }, [])

//   const { data: shiftSettingsData } = useSWR(
//     currentUser?.institutionName
//       ? `/api/shifts?institutionName=${encodeURIComponent(currentUser.institutionName)}`
//       : null,
//     fetcher,
//   )
//   const shiftSettings: Array<{ name: string; start: string; end: string }> = shiftSettingsData?.shifts || []

//   const normShift = (s?: string | null) => {
//     if (!s) return null
//     const lower = s.toLowerCase()
//     if (lower.startsWith("morn")) return "Morning"
//     if (lower.startsWith("even")) return "Evening"
//     if (lower.startsWith("nig")) return "Night"
//     return s
//   }
//   const formatShiftWindow = (s?: string | null) => {
//     const key = normShift(s)
//     if (!key) return "N/A"
//     const fromSettings = shiftSettings.find((x) => (x.name?.toLowerCase?.() || "").includes(key.toLowerCase()))
//     if (fromSettings) return `${fromSettings.start} - ${fromSettings.end}`
//     try {
//       const { SHIFT_TIMINGS } = require("@/lib/constants")
//       const t = SHIFT_TIMINGS[key as keyof typeof SHIFT_TIMINGS]
//       return t ? `${t.start} - ${t.end}` : "N/A"
//     } catch {
//       return "N/A"
//     }
//   }
//   const formatAutoAbsent = (s?: string | null) => {
//     const key = normShift(s)
//     if (!key) return "N/A"
//     try {
//       const { ABSENT_THRESHOLDS } = require("@/lib/constants")
//       const t = ABSENT_THRESHOLDS[key as keyof typeof ABSENT_THRESHOLDS]
//       return t || "N/A"
//     } catch {
//       return "N/A"
//     }
//   }

//   const params = new URLSearchParams()
//   if (isStudent) {
//     if (filters.date) params.set("date", filters.date)
//     params.set("personType", "student")
//     if (currentUser?.id) params.set("personId", currentUser.id)
//     if (currentUser?.institutionName) params.set("institutionName", currentUser.institutionName)
//   } else {
//     if (filters.department && filters.department !== "all") params.set("department", filters.department)
//     if (filters.role && filters.role !== "all") params.set("role", filters.role)
//     if (filters.shift && filters.shift !== "all") params.set("shift", filters.shift)
//     if (filters.status && filters.status !== "all") params.set("status", filters.status)
//     if (filters.date) params.set("date", filters.date)
//     if (filters.personType && filters.personType !== "all") params.set("personType", filters.personType)
//     if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
//       params.set("institutionName", currentUser.institutionName)
//     }
//   }

//   const { data, mutate } = useSWR<{
//     records: (AttendanceRecord & {
//       personName?: string
//       imageUrl?: string
//       employeeCode?: string
//       rollNumber?: string
//       classLevel?: string
//     })[]
//     departments: Department[]
//     roles: Role[]
//     shifts: Shift[]
//     totalCounts: {
//       totalPeople: number
//       present: number
//       absent: number
//       late: number
//     }
//   }>(`/api/attendance?${params.toString()}`, fetcher)

//   const notMarkedUrlParams = new URLSearchParams()
//   if (!isStudent) {
//     if (filters.date) notMarkedUrlParams.set("date", filters.date)
//     if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
//       notMarkedUrlParams.set("institutionName", currentUser.institutionName)
//     }
//   }
//   const { data: notMarkedData, mutate: mutateNotMarked } = useSWR(
//     !isStudent ? `/api/attendance/not-marked?${notMarkedUrlParams.toString()}` : null,
//     fetcher,
//   )

//   const records = data?.records ?? []
//   const departments = data?.departments ?? []
//   const roles = data?.roles ?? []
//   const shifts = data?.shifts ?? []
//   const totalCounts = data?.totalCounts ?? { totalPeople: 0, present: 0, absent: 0, late: 0 }

//   const notMarkedPeople = notMarkedData?.notMarkedPeople ?? []

//   const counts = useMemo(
//     () => ({
//       present: records.filter((r) => r.status === "present").length,
//       absent: records.filter((r) => r.status === "absent").length,
//       late: records.filter((r) => r.status === "late").length,
//     }),
//     [records],
//   )

//   async function mark(personId: string, personType: "staff" | "student", status: "present" | "absent" | "late") {
//     const body = { personId, personType, status, date: filters.date }
//     const res = await fetch("/api/attendance", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     })

//     const result = await res.json()

//     if (res.status === 409) {
//       setAttendanceMessage({
//         type: "warning",
//         message: result.message,
//       })
//       toast({ title: "Already marked", description: result.message })
//     } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
//       setAttendanceMessage({
//         type: "error",
//         message: result.message,
//       })
//       toast({ title: "Outside shift hours", description: result.message, variant: "destructive" })
//     } else if (!res.ok) {
//       setAttendanceMessage({
//         type: "error",
//         message: "Failed to mark attendance",
//       })
//       toast({ title: "Failed to mark", description: "Please try again.", variant: "destructive" })
//     } else {
//       setAttendanceMessage({
//         type: "success",
//         message: result.message,
//       })
//       toast({ title: "Success", description: result.message })
//       mutate()
//     }

//     setTimeout(() => setAttendanceMessage(null), 5000)
//   }

//   async function autoMarkAbsent() {
//     setIsAutoMarking(true)
//     try {
//       const res = await fetch("/api/attendance/auto-mark", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       })
//       const result = await res.json()
//       if (res.ok) {
//         setAttendanceMessage({
//           type: "success",
//           message: result.message,
//         })
//         toast({ title: "Auto-mark requested", description: result.message })
//         mutate()
//       } else {
//         setAttendanceMessage({
//           type: "error",
//           message: "Failed to auto-mark attendance",
//         })
//         toast({ title: "Auto-mark failed", description: "Please try again.", variant: "destructive" })
//       }
//     } catch (error) {
//       setAttendanceMessage({
//         type: "error",
//         message: "Error auto-marking attendance",
//       })
//       toast({ title: "Error auto-marking", description: "Please try again.", variant: "destructive" })
//     } finally {
//       setIsAutoMarking(false)
//       setTimeout(() => setAttendanceMessage(null), 5000)
//     }
//   }

//   async function updateAttendanceStatus(
//     recordId: string,
//     personId: string,
//     personType: "staff" | "student",
//     newStatus: "present" | "absent" | "late",
//   ) {
//     setUpdatingStatus(recordId)
//     try {
//       const res = await fetch("/api/attendance", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           recordId,
//           personId,
//           personType,
//           status: newStatus,
//           date: filters.date,
//         }),
//       })

//       const result = await res.json()
//       console.log("[v0] Manual mark response:", result)

//       if (res.ok) {
//         setAttendanceMessage({
//           type: "success",
//           message: `Attendance status updated to ${newStatus.toUpperCase()} successfully`,
//         })
//         toast({ title: "Status updated", description: `Set to ${newStatus.toUpperCase()}` })
//         mutate()
//       } else {
//         setAttendanceMessage({
//           type: "error",
//           message: result.message || "Failed to update attendance status",
//         })
//         toast({ title: "Update failed", description: result.message || "Please try again.", variant: "destructive" })
//       }
//     } catch (error) {
//       setAttendanceMessage({
//         type: "error",
//         message: "Error updating attendance status",
//       })
//       toast({ title: "Error updating", description: "Please try again.", variant: "destructive" })
//     } finally {
//       setUpdatingStatus(null)
//       setTimeout(() => setAttendanceMessage(null), 5000)
//     }
//   }

//   const isAttendanceMarked = (record: any) => {
//     return record.status && record.timestamp
//   }

//   async function handleManualMark(
//     personId: string,
//     personType: "staff" | "student",
//     status: "present" | "absent" | "late",
//   ) {
//     console.log("[v0] Manual marking:", { personId, personType, status })

//     try {
//       const body = { personId, personType, status, date: filters.date }
//       const res = await fetch("/api/attendance", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       })

//       const result = await res.json()
//       console.log("[v0] Manual mark response:", result)

//       if (res.status === 409) {
//         setAttendanceMessage({
//           type: "warning",
//           message: result.message,
//         })
//         toast({ title: "Already marked", description: result.message })
//       } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
//         setAttendanceMessage({
//           type: "error",
//           message: result.message,
//         })
//         toast({ title: "Outside shift hours", description: result.message, variant: "destructive" })
//       } else if (!res.ok) {
//         setAttendanceMessage({
//           type: "error",
//           message: "Failed to mark attendance",
//         })
//         toast({ title: "Failed to mark", description: "Please try again.", variant: "destructive" })
//       } else {
//         setAttendanceMessage({
//           type: "success",
//           message: result.message,
//         })
//         toast({ title: "Success", description: result.message })
//         mutate()
//         mutateNotMarked()
//       }

//       setTimeout(() => setAttendanceMessage(null), 5000)
//     } catch (error) {
//       console.error("[v0] Manual mark error:", error)
//       setAttendanceMessage({
//         type: "error",
//         message: "Error marking attendance",
//       })
//       toast({ title: "Error marking", description: "Please try again.", variant: "destructive" })
//       setTimeout(() => setAttendanceMessage(null), 5000)
//     }
//   }

//   function exportNotMarkedCsv() {
//     if (!notMarkedPeople.length) {
//       alert("No data to export")
//       return
//     }
//     const headers = ["Name", "Type", "Employee Code/Roll", "Department", "Role", "Shift", "Class Level"]
//     const rows = notMarkedPeople.map((p) => [
//       p.personName || "Unknown",
//       p.personType,
//       p.personType === "staff" ? p.employeeCode || "N/A" : p.rollNumber || "N/A",
//       p.department || "N/A",
//       p.role || "N/A",
//       p.shift || "N/A",
//       p.personType === "student" ? p.classLevel || "N/A" : "N/A",
//     ])

//     const csv = [headers, ...rows]
//       .map((r) =>
//         r
//           .map((field) => {
//             const s = String(field ?? "")
//             if (s.includes(",") || s.includes('"') || s.includes("\n")) {
//               return `"${s.replace(/"/g, '""')}"`
//             }
//             return s
//           })
//           .join(","),
//       )
//       .join("\n")

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     const datePart = notMarkedData?.date || new Date().toISOString().slice(0, 10)
//     a.download = `not-marked-${datePart}.csv`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//   }

//   async function deleteAttendance(recordId: string, personId: string) {
//     const confirmed = window.confirm("Delete this attendance record? This will mark them as 'Not Marked' for the day.")
//     if (!confirmed) return

//     setDeletingId(recordId)
//     try {
//       const res = await fetch("/api/attendance", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ recordId, personId, date: filters.date }),
//       })
//       const result = await res.json()

//       if (res.ok) {
//         toast({ title: "Deleted", description: "Attendance record deleted" })
//         await Promise.all([mutate(), mutateNotMarked()])
//       } else {
//         toast({ title: "Delete failed", description: result?.message || "Please try again.", variant: "destructive" })
//       }
//     } catch (err) {
//       toast({ title: "Error", description: "Failed to delete record. Please try again.", variant: "destructive" })
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8">
//       <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-card rounded-xl border shadow-sm">
//         <div className="space-y-2">
//           {currentUser?.institutionName && (
//             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
//               {currentUser.institutionName}
//             </div>
//           )}
//           <div className="flex items-center gap-3">
//             <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//               Attendance Management
//             </h1>
//             <div className="flex items-center gap-2">
//               {isConnected ? (
//                 <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
//                   <Wifi className="h-3 w-3" />
//                   Live
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
//                   <WifiOff className="h-3 w-3" />
//                   Offline
//                 </div>
//               )}
//               {realtimeUpdates > 0 && (
//                 <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                   {realtimeUpdates} updates
//                 </div>
//               )}
//             </div>
//           </div>
//           <p className="text-muted-foreground leading-relaxed max-w-2xl">
//             {isStudent
//               ? "View your attendance details."
//               : "View and manage attendance. Auto-absent thresholds and shift windows follow your institution’s shift settings."}
//             {!isStudent && isConnected && " Real-time updates enabled via Face Recognition."}
//           </p>
//         </div>
//         {!isStudent && (
//           <div className="flex flex-col sm:flex-row gap-3">
//             <Button
//               onClick={autoMarkAbsent}
//               disabled={isAutoMarking}
//               variant="outline"
//               className="flex items-center gap-2 bg-accent/10 border-accent/20 hover:bg-accent/20 text-accent font-medium"
//             >
//               <RefreshCw className={`h-4 w-4 ${isAutoMarking ? "animate-spin" : ""}`} />
//               {isAutoMarking ? "Auto Marking..." : "Manual Auto Mark"}
//             </Button>
//             <ExportAttendance
//               records={records}
//               filters={{
//                 department: filters.department,
//                 role: filters.role,
//                 shift: filters.shift,
//                 status: filters.status,
//                 date: filters.date,
//                 personType: filters.personType,
//               }}
//             />
//           </div>
//         )}
//       </header>

//       {attendanceMessage && (
//         <Alert
//           className={`${
//             attendanceMessage.type === "success"
//               ? "border-green-200 bg-green-50"
//               : attendanceMessage.type === "warning"
//                 ? "border-amber-200 bg-amber-50"
//                 : "border-red-200 bg-red-50"
//           }`}
//         >
//           {attendanceMessage.type === "success" ? (
//             <CheckCircle className="h-4 w-4 text-green-600" />
//           ) : (
//             <AlertCircle className="h-4 w-4 text-amber-600" />
//           )}
//           <AlertDescription
//             className={`${
//               attendanceMessage.type === "success"
//                 ? "text-green-800"
//                 : attendanceMessage.type === "warning"
//                   ? "text-amber-800"
//                   : "text-red-800"
//             }`}
//           >
//             {attendanceMessage.message}
//             {attendanceMessage.message.includes("Face Recognition") && (
//               <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                 <Wifi className="h-3 w-3" />
//                 Real-time
//               </span>
//             )}
//           </AlertDescription>
//         </Alert>
//       )}

//       {!isStudent && (
//         <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
//           <CardContent className="pt-6">
//             <AttendanceFilters
//               departments={departments}
//               roles={roles}
//               shifts={shifts}
//               value={filters}
//               onChange={setFilters}
//             />
//           </CardContent>
//         </Card>
//       )}
//       {isStudent && (
//         <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-3">
//               <label className="text-sm font-medium">Date</label>
//               <input
//                 type="date"
//                 className="border rounded-md px-3 py-2 text-sm"
//                 value={filters.date}
//                 onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
//         <Card className="bg-gradient-to-br from-card to-muted/20 border-0 shadow-sm hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-semibold text-muted-foreground">Total People</CardTitle>
//             <Users className="h-5 w-5 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-foreground">{totalCounts.totalPeople}</div>
//             <p className="text-xs text-muted-foreground mt-1">All registered people</p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-semibold text-green-700">Present</CardTitle>
//             <UserCheck className="h-5 w-5 text-green-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-green-700">{totalCounts.present}</div>
//             <p className="text-xs text-green-600 mt-1">Filtered: {counts.present}</p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-sm hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-semibold text-red-700">Absent</CardTitle>
//             <UserX className="h-5 w-5 text-red-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-red-700">{totalCounts.absent}</div>
//             <p className="text-xs text-red-600 mt-1">Filtered: {counts.absent}</p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-semibold text-amber-700">Late</CardTitle>
//             <Clock className="h-5 w-5 text-amber-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-amber-700">{totalCounts.late}</div>
//             <p className="text-xs text-amber-600 mt-1">Filtered: {counts.late}</p>
//           </CardContent>
//         </Card>

//         {!isStudent && (
//           <Card
//             className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//             onClick={() => setShowNotMarkedModal(true)}
//           >
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-semibold text-slate-700">Not Marked</CardTitle>
//               <User className="h-5 w-5 text-slate-600" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-slate-700">{notMarkedData?.count ?? 0}</div>
//               <p className="text-xs text-slate-600 mt-1">Click to view & mark</p>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       <Card className="shadow-sm border-0 overflow-hidden">
//         <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
//           <table className="min-w-full">
//             <thead className="sticky top-0 z-10 bg-card shadow-sm">
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name & Code/Roll</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
//                   Type & Class Level
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
//                   Department & Role
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
//                   Shift & Timing
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status & Time</th>
//                 {!isStudent && <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border/50">
//               {records.map((r) => {
//                 const shiftWindow = formatShiftWindow(r.shift)
//                 const autoAbsentAt = formatAutoAbsent(r.shift)
//                 const canUpdate =
//                   currentUser?.role === "Admin" || currentUser?.role === "SuperAdmin" || currentUser?.role === "Teacher"
//                 const canDelete = currentUser?.role === "Admin" || currentUser?.role === "SuperAdmin"
//                 return (
//                   <tr key={r.id} className="hover:bg-muted/30 transition-colors">
//                     <td className="px-6 py-4">
//                       <div
//                         className="cursor-pointer"
//                         onClick={() => setSelectedPerson({ personId: r.personId, personType: r.personType })}
//                       >
//                         {r.imageUrl ? (
//                           <img
//                             src={r.imageUrl || "/placeholder.svg"}
//                             alt={r.personName || "Person"}
//                             className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors shadow-sm"
//                           />
//                         ) : (
//                           <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors shadow-sm">
//                             <User className="h-6 w-6 text-muted-foreground" />
//                           </div>
//                         )}
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <div className="space-y-1">
//                         <div className="text-base font-semibold text-foreground">{r.personName || "Unknown"}</div>
//                         <div className="text-sm text-muted-foreground font-medium">
//                           {r.personType === "staff"
//                             ? `Code: ${r.employeeCode || "N/A"}`
//                             : `Roll: ${r.rollNumber || "N/A"}`}
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 hidden md:table-cell">
//                       <div className="space-y-1">
//                         <div className="text-sm font-medium capitalize text-foreground">{r.personType}</div>
//                         {r.personType === "student" && (
//                           <div className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md inline-block">
//                             {r.classLevel || "N/A"}
//                           </div>
//                         )}
//                         {r.personType === "staff" && (
//                           <div className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md inline-block">
//                             Staff Member
//                           </div>
//                         )}
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 hidden md:table-cell">
//                       <div className="space-y-1">
//                         <div className="text-sm font-medium text-foreground">{r.department}</div>
//                         <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md inline-block">
//                           {r.role}
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 hidden md:table-cell">
//                       <div className="space-y-2">
//                         <div className="text-sm font-medium text-foreground">{`${normShift(r.shift) || r.shift} Shift`}</div>
//                         <div className="text-xs text-muted-foreground">{shiftWindow}</div>
//                         <div className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-md inline-block">
//                           Auto-absent: {autoAbsentAt}
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       {isAttendanceMarked(r) ? (
//                         <div className="space-y-2">
//                           <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
//                             <CheckCircle className="h-4 w-4 text-green-600" />
//                             <span className="font-medium">Marked as {r.status?.toUpperCase()}</span>
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             {r.timestamp && new Date(r.timestamp).toLocaleString()}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="text-sm text-muted-foreground italic">Not marked yet</div>
//                       )}
//                     </td>

//                     {!isStudent && (
//                       <td className="px-6 py-4">
//                         {isAttendanceMarked(r) ? (
//                           canUpdate ? (
//                             <div className="flex flex-col gap-2 w-40">
//                               <Select
//                                 onValueChange={(v) =>
//                                   updateAttendanceStatus(r.id as string, r.personId, r.personType, v as any)
//                                 }
//                               >
//                                 <SelectTrigger>
//                                   <SelectValue placeholder={`Change: ${r.status?.toUpperCase()}`} />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="present">Present</SelectItem>
//                                   <SelectItem value="absent">Absent</SelectItem>
//                                   <SelectItem value="late">Late</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                               {updatingStatus === r.id && (
//                                 <div className="text-xs text-muted-foreground">Updating...</div>
//                               )}

//                               {canDelete && (
//                                 <Button
//                                   variant="destructive"
//                                   size="sm"
//                                   className="flex items-center gap-2"
//                                   onClick={() => deleteAttendance(r.id as string, r.personId)}
//                                   disabled={deletingId === r.id}
//                                 >
//                                   <Trash2 className="h-4 w-4" />
//                                   {deletingId === r.id ? "Deleting..." : "Delete"}
//                                 </Button>
//                               )}
//                             </div>
//                           ) : (
//                             <div className="text-xs text-muted-foreground">No actions</div>
//                           )
//                         ) : (
//                           <div className="flex flex-col gap-2">
//                             <Button
//                               size="sm"
//                               className="bg-green-600 text-white hover:bg-green-700 shadow-sm font-medium"
//                               onClick={() => mark(r.personId, r.personType, "present")}
//                             >
//                               Present
//                             </Button>
//                             <div className="flex gap-2">
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-medium bg-transparent"
//                                 onClick={() => mark(r.personId, r.personType, "absent")}
//                               >
//                                 Absent
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 font-medium bg-transparent"
//                                 onClick={() => mark(r.personId, r.personType, "late")}
//                               >
//                                 Late
//                               </Button>
//                             </div>
//                           </div>
//                         )}
//                       </td>
//                     )}
//                   </tr>
//                 )
//               })}
//               {records.length === 0 && (
//                 <tr>
//                   <td className="px-6 py-12 text-center text-muted-foreground" colSpan={7}>
//                     <div className="flex flex-col items-center gap-2">
//                       <Users className="h-8 w-8 text-muted-foreground/50" />
//                       <span>No attendance records found for the selected filters.</span>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {!isStudent && (
//         <Dialog open={showNotMarkedModal} onOpenChange={setShowNotMarkedModal}>
//           <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Not Marked Attendance ({notMarkedData?.count ?? 0})
//               </DialogTitle>
//               <DialogDescription>
//                 People who haven't marked their attendance yet. You can mark their attendance manually.
//               </DialogDescription>
//               <div className="mt-3">
//                 <Button
//                   variant="outline"
//                   className="h-8 px-3 text-sm bg-transparent"
//                   onClick={exportNotMarkedCsv}
//                   disabled={!notMarkedPeople.length}
//                 >
//                   Export Not Marked (CSV)
//                 </Button>
//               </div>
//             </DialogHeader>

//             <div className="overflow-y-auto max-h-[60vh]">
//               {!notMarkedData ? (
//                 <div className="text-center py-8">
//                   <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
//                   <p className="text-lg font-medium">Loading...</p>
//                   <p className="text-muted-foreground">Fetching people who haven't marked attendance.</p>
//                 </div>
//               ) : notMarkedPeople.length === 0 ? (
//                 <div className="text-center py-8">
//                   <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
//                   <p className="text-lg font-medium">All attendance marked!</p>
//                   <p className="text-muted-foreground">Everyone has marked their attendance for today.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {notMarkedPeople.map((person) => (
//                     <div
//                       key={person.personId}
//                       className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className="cursor-pointer"
//                           onClick={() =>
//                             setSelectedPerson({ personId: person.personId, personType: person.personType })
//                           }
//                         >
//                           {person.imageUrl ? (
//                             <img
//                               src={person.imageUrl || "/placeholder.svg"}
//                               alt={person.personName}
//                               className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors"
//                               onError={(e) => {
//                                 e.currentTarget.style.display = "none"
//                                 e.currentTarget.nextElementSibling.style.display = "flex"
//                               }}
//                             />
//                           ) : null}
//                           <div
//                             className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors ${person.imageUrl ? "hidden" : "flex"}`}
//                           >
//                             <User className="h-6 w-6 text-muted-foreground" />
//                           </div>
//                         </div>

//                         <div className="space-y-1">
//                           <div className="font-semibold">{person.personName}</div>
//                           <div className="text-sm text-muted-foreground">
//                             {person.personType === "staff"
//                               ? `Employee Code: ${person.employeeCode || "N/A"}`
//                               : `Roll Number: ${person.rollNumber || "N/A"}`}
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             {person.department} • {person.role} • {person.shift} Shift
//                             {person.personType === "student" && person.classLevel && ` • ${person.classLevel}`}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex gap-2">
//                         <Button
//                           size="sm"
//                           className="bg-green-600 text-white hover:bg-green-700 shadow-sm"
//                           onClick={() => handleManualMark(person.personId, person.personType, "present")}
//                         >
//                           Present
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
//                           onClick={() => handleManualMark(person.personId, person.personType, "absent")}
//                         >
//                           Absent
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
//                           onClick={() => handleManualMark(person.personId, person.personType, "late")}
//                         >
//                           Late
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}

//       <PersonDetailsModal
//         isOpen={!!selectedPerson}
//         onClose={() => setSelectedPerson(null)}
//         personId={selectedPerson?.personId || ""}
//         personType={selectedPerson?.personType || "staff"}
//       />
//     </div>
//   )
// }





"use client"

import useSWR from "swr"
import { AttendanceFilters } from "@/components/attendance-filters"

type AttendanceFiltersState = {
  date: string
  status?: string
  personType?: string
  department?: Department | "all"
  role?: Role | "all"
  shift?: Shift | "all"
}
import { ExportAttendance } from "@/components/export-attendance"
import type { Department, Role, Shift, AttendanceRecord } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PersonDetailsModal } from "@/components/person-details-modal"
import { User, Users, UserCheck, UserX, Clock, AlertCircle, CheckCircle, Wifi, WifiOff, Trash2 } from "lucide-react"
import { useMemo, useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { realtimeClient } from "@/lib/realtime-client"
import { getStoredUser } from "@/lib/auth" // import user helper
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AttendancePage() {
  const [filters, setFilters] = useState<AttendanceFiltersState>({
    date: new Date().toISOString().slice(0, 10), // Default to today
    status: "all", // Added default status filter
    personType: "all", // Added default personType filter
  })
  const [selectedPerson, setSelectedPerson] = useState<{
    personId: string
    personType: "staff" | "student"
  } | null>(null)
  const [attendanceMessage, setAttendanceMessage] = useState<{
    type: "success" | "error" | "warning"
    message: string
  } | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [showNotMarkedModal, setShowNotMarkedModal] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [realtimeUpdates, setRealtimeUpdates] = useState(0)
  const [currentUser, setCurrentUser] = useState<any>(null) // track current user
  const isStudent = currentUser?.role === "Student"
  const [deletingId, setDeletingId] = useState<string | null>(null) // track deleting state
  const { toast } = useToast()

  useEffect(() => {
    function onAttendanceUpdate(data: any) {
      console.log("[v0] Real-time attendance update received:", data)
      setRealtimeUpdates((prev) => prev + 1)

      toast({
        title: "Attendance updated",
        description: `${data.personName} marked as ${String(data.status || "").toUpperCase()}`,
      })

      mutate()
      mutateNotMarked()
    }

    function onStatsUpdate(stats: any) {
      console.log("[v0] Real-time attendance stats:", stats)
      // Refresh data when stats update
      mutate()
      mutateNotMarked()
    }

    function onAutoMarkComplete(data: any) {
      console.log("[v0] Auto-mark complete:", data)
      if (data.markedAbsent > 0) {
        toast({
          title: "Auto-mark finished",
          description: `Auto-marked ${data.markedAbsent} people as absent`,
          variant: "default",
        })
        mutate()
        mutateNotMarked()
      }
    }

    // Set up event listeners
    realtimeClient.on("attendance_update", onAttendanceUpdate)
    realtimeClient.on("stats_update", onStatsUpdate)
    realtimeClient.on("auto_mark_complete", onAutoMarkComplete)

    // Connect to real-time updates
    realtimeClient.connect()
    setIsConnected(true)
    console.log("[v0] Real-time client connected to attendance page")

    return () => {
      realtimeClient.off("attendance_update", onAttendanceUpdate)
      realtimeClient.off("stats_update", onStatsUpdate)
      realtimeClient.off("auto_mark_complete", onAutoMarkComplete)
      realtimeClient.disconnect()
      setIsConnected(false)
    }
  }, [toast])

  useEffect(() => {
    setCurrentUser(getStoredUser())
  }, [])

  const { data: shiftSettingsData } = useSWR(
    currentUser?.institutionName
      ? `/api/shifts?institutionName=${encodeURIComponent(currentUser.institutionName)}`
      : null,
    fetcher,
  )
  const shiftSettings: Array<{ name: string; start: string; end: string }> = shiftSettingsData?.shifts || []

  const normShift = (s?: string | null) => {
    if (!s) return null
    const lower = s.toLowerCase()
    if (lower.startsWith("morn")) return "Morning"
    if (lower.startsWith("even")) return "Evening"
    if (lower.startsWith("nig")) return "Night"
    return s
  }
  const formatShiftWindow = (s?: string | null) => {
    const key = normShift(s)
    if (!key) return "N/A"
    const fromSettings = shiftSettings.find((x) => (x.name?.toLowerCase?.() || "").includes(key.toLowerCase()))
    if (fromSettings) return `${fromSettings.start} - ${fromSettings.end}`
    try {
      const { SHIFT_TIMINGS } = require("@/lib/constants")
      const t = SHIFT_TIMINGS[key as keyof typeof SHIFT_TIMINGS]
      return t ? `${t.start} - ${t.end}` : "N/A"
    } catch {
      return "N/A"
    }
  }
  const formatAutoAbsent = (s?: string | null) => {
    const key = normShift(s)
    if (!key) return "N/A"
    try {
      const { ABSENT_THRESHOLDS } = require("@/lib/constants")
      const t = ABSENT_THRESHOLDS[key as keyof typeof ABSENT_THRESHOLDS]
      return t || "N/A"
    } catch {
      return "N/A"
    }
  }

  const params = new URLSearchParams()
  if (isStudent) {
    if (filters.date) params.set("date", filters.date)
    params.set("personType", "student")
    if (currentUser?.id) params.set("personId", currentUser.id)
    if (currentUser?.institutionName) params.set("institutionName", currentUser.institutionName)
  } else {
    if (filters.department && filters.department !== "all") params.set("department", filters.department)
    if (filters.role && filters.role !== "all") params.set("role", filters.role)
    if (filters.shift && filters.shift !== "all") params.set("shift", filters.shift)
    if (filters.status && filters.status !== "all") params.set("status", filters.status)
    if (filters.date) params.set("date", filters.date)
    if (filters.personType && filters.personType !== "all") params.set("personType", filters.personType)
    if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
      params.set("institutionName", currentUser.institutionName)
    }
  }

  const { data, mutate } = useSWR<{
    records: (AttendanceRecord & {
      personName?: string
      imageUrl?: string
      employeeCode?: string
      rollNumber?: string
      classLevel?: string
    })[]
    departments: Department[]
    roles: Role[]
    shifts: Shift[]
    totalCounts: {
      totalPeople: number
      present: number
      absent: number
      late: number
    }
  }>(`/api/attendance?${params.toString()}`, fetcher)

  const notMarkedUrlParams = new URLSearchParams()
  if (!isStudent) {
    if (filters.date) notMarkedUrlParams.set("date", filters.date)
    if (currentUser?.institutionName && currentUser?.role !== "SuperAdmin") {
      notMarkedUrlParams.set("institutionName", currentUser.institutionName)
    }
  }
  const { data: notMarkedData, mutate: mutateNotMarked } = useSWR(
    !isStudent ? `/api/attendance/not-marked?${notMarkedUrlParams.toString()}` : null,
    fetcher,
  )

  const records = data?.records ?? []
  const departments = data?.departments ?? []
  const roles = data?.roles ?? []
  const shifts = data?.shifts ?? []
  const totalCounts = data?.totalCounts ?? { totalPeople: 0, present: 0, absent: 0, late: 0 }

  const notMarkedPeople = notMarkedData?.notMarkedPeople ?? []

  const counts = useMemo(
    () => ({
      present: records.filter((r) => r.status === "present").length,
      absent: records.filter((r) => r.status === "absent").length,
      late: records.filter((r) => r.status === "late").length,
    }),
    [records],
  )

  async function mark(personId: string, personType: "staff" | "student", status: "present" | "absent" | "late") {
    const body = { personId, personType, status, date: filters.date }
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const result = await res.json()

    if (res.status === 409) {
      setAttendanceMessage({
        type: "warning",
        message: result.message,
      })
      toast({ title: "Already marked", description: result.message })
    } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
      setAttendanceMessage({
        type: "error",
        message: result.message,
      })
      toast({ title: "Outside shift hours", description: result.message, variant: "destructive" })
    } else if (!res.ok) {
      setAttendanceMessage({
        type: "error",
        message: "Failed to mark attendance",
      })
      toast({ title: "Failed to mark", description: "Please try again.", variant: "destructive" })
    } else {
      setAttendanceMessage({
        type: "success",
        message: result.message,
      })
      toast({ title: "Success", description: result.message })
      mutate()
    }

    setTimeout(() => setAttendanceMessage(null), 5000)
  }

  async function updateAttendanceStatus(
    recordId: string,
    personId: string,
    personType: "staff" | "student",
    newStatus: "present" | "absent" | "late",
  ) {
    setUpdatingStatus(recordId)
    try {
      const res = await fetch("/api/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordId,
          personId,
          personType,
          status: newStatus,
          date: filters.date,
        }),
      })

      const result = await res.json()
      console.log("[v0] Manual mark response:", result)

      if (res.ok) {
        setAttendanceMessage({
          type: "success",
          message: `Attendance status updated to ${newStatus.toUpperCase()} successfully`,
        })
        toast({ title: "Status updated", description: `Set to ${newStatus.toUpperCase()}` })
        mutate()
      } else {
        setAttendanceMessage({
          type: "error",
          message: result.message || "Failed to update attendance status",
        })
        toast({ title: "Update failed", description: result.message || "Please try again.", variant: "destructive" })
      }
    } catch (error) {
      setAttendanceMessage({
        type: "error",
        message: "Error updating attendance status",
      })
      toast({ title: "Error updating", description: "Please try again.", variant: "destructive" })
    } finally {
      setUpdatingStatus(null)
      setTimeout(() => setAttendanceMessage(null), 5000)
    }
  }

  const isAttendanceMarked = (record: any) => {
    return record.status && record.timestamp
  }

  async function handleManualMark(
    personId: string,
    personType: "staff" | "student",
    status: "present" | "absent" | "late",
  ) {
    console.log("[v0] Manual marking:", { personId, personType, status })

    try {
      const body = { personId, personType, status, date: filters.date }
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await res.json()
      console.log("[v0] Manual mark response:", result)

      if (res.status === 409) {
        setAttendanceMessage({
          type: "warning",
          message: result.message,
        })
        toast({ title: "Already marked", description: result.message })
      } else if (res.status === 400 && result.error === "OUTSIDE_SHIFT_HOURS") {
        setAttendanceMessage({
          type: "error",
          message: result.message,
        })
        toast({ title: "Outside shift hours", description: result.message, variant: "destructive" })
      } else if (!res.ok) {
        setAttendanceMessage({
          type: "error",
          message: "Failed to mark attendance",
        })
        toast({ title: "Failed to mark", description: "Please try again.", variant: "destructive" })
      } else {
        setAttendanceMessage({
          type: "success",
          message: result.message,
        })
        toast({ title: "Success", description: result.message })
        mutate()
        mutateNotMarked()
      }

      setTimeout(() => setAttendanceMessage(null), 5000)
    } catch (error) {
      console.error("[v0] Manual mark error:", error)
      setAttendanceMessage({
        type: "error",
        message: "Error marking attendance",
      })
      toast({ title: "Error marking", description: "Please try again.", variant: "destructive" })
      setTimeout(() => setAttendanceMessage(null), 5000)
    }
  }

  function exportNotMarkedCsv() {
    if (!notMarkedPeople.length) {
      alert("No data to export")
      return
    }
    const headers = ["Name", "Type", "Employee Code/Roll", "Department", "Role", "Shift", "Class Level"]
    const rows = notMarkedPeople.map((p: { personName: any; personType: string; employeeCode: any; rollNumber: any; department: any; role: any; shift: any; classLevel: any }) => [
      p.personName || "Unknown",
      p.personType,
      p.personType === "staff" ? p.employeeCode || "N/A" : p.rollNumber || "N/A",
      p.department || "N/A",
      p.role || "N/A",
      p.shift || "N/A",
      p.personType === "student" ? p.classLevel || "N/A" : "N/A",
    ])

    const csv = [headers, ...rows]
      .map((r) =>
        r
          .map((field: any) => {
            const s = String(field ?? "")
            if (s.includes(",") || s.includes('"') || s.includes("\n")) {
              return `"${s.replace(/"/g, '""')}"`
            }
            return s
          })
          .join(","),
      )
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const datePart = notMarkedData?.date || new Date().toISOString().slice(0, 10)
    a.download = `not-marked-${datePart}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function deleteAttendance(recordId: string, personId: string) {
    const confirmed = window.confirm("Delete this attendance record? This will mark them as 'Not Marked' for the day.")
    if (!confirmed) return

    setDeletingId(recordId)
    try {
      const res = await fetch("/api/attendance", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId, personId, date: filters.date }),
      })
      const result = await res.json()

      if (res.ok) {
        toast({ title: "Deleted", description: "Attendance record deleted" })
        await Promise.all([mutate(), mutateNotMarked()])
      } else {
        toast({ title: "Delete failed", description: result?.message || "Please try again.", variant: "destructive" })
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete record. Please try again.", variant: "destructive" })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-card rounded-xl border shadow-sm">
        <div className="space-y-2">
          {currentUser?.institutionName && (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
              {currentUser.institutionName}
            </div>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Attendance Management
            </h1>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  <Wifi className="h-3 w-3" />
                  Live
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  <WifiOff className="h-3 w-3" />
                  Offline
                </div>
              )}
              {realtimeUpdates > 0 && (
                <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {realtimeUpdates} updates
                </div>
              )}
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            {isStudent
              ? "View your attendance details."
              : "View and manage attendance. Auto-absent thresholds and shift windows follow your institution’s shift settings."}
            {!isStudent && isConnected && " Real-time updates enabled via Face Recognition."}
          </p>
        </div>
        {!isStudent && (
          <div className="flex flex-col sm:flex-row gap-3">
            {/* <Button
              onClick={autoMarkAbsent}
              disabled={isAutoMarking}
              variant="outline"
              className="flex items-center gap-2 bg-accent/10 border-accent/20 hover:bg-accent/20 text-accent font-medium"
            >
              <RefreshCw className={`h-4 w-4 ${isAutoMarking ? "animate-spin" : ""}`} />
              {isAutoMarking ? "Auto Marking..." : "Manual Auto Mark"}
            </Button> */}
            <ExportAttendance
              records={records}
              filters={{
                department: filters.department,
                role: filters.role,
                shift: filters.shift,
                status: filters.status,
                date: filters.date,
                personType: filters.personType,
              }}
            />
          </div>
        )}
      </header>

      {attendanceMessage && (
        <Alert
          className={`${
            attendanceMessage.type === "success"
              ? "border-green-200 bg-green-50"
              : attendanceMessage.type === "warning"
                ? "border-amber-200 bg-amber-50"
                : "border-red-200 bg-red-50"
          }`}
        >
          {attendanceMessage.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-600" />
          )}
          <AlertDescription
            className={`${
              attendanceMessage.type === "success"
                ? "text-green-800"
                : attendanceMessage.type === "warning"
                  ? "text-amber-800"
                  : "text-red-800"
            }`}
          >
            {attendanceMessage.message}
            {attendanceMessage.message.includes("Face Recognition") && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                <Wifi className="h-3 w-3" />
                Real-time
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {!isStudent && (
        <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <AttendanceFilters
              departments={departments}
              roles={roles}
              shifts={shifts}
              value={filters}
              onChange={setFilters}
            />
          </CardContent>
        </Card>
      )}
      {isStudent && (
        <Card className="shadow-sm border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                className="border rounded-md px-3 py-2 text-sm"
                value={filters.date}
                onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-gradient-to-br from-card to-muted/20 border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total People</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalCounts.totalPeople}</div>
            <p className="text-xs text-muted-foreground mt-1">All registered people</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-700">Present</CardTitle>
            <UserCheck className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{totalCounts.present}</div>
            <p className="text-xs text-green-600 mt-1">Filtered: {counts.present}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-red-700">Absent</CardTitle>
            <UserX className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{totalCounts.absent}</div>
            <p className="text-xs text-red-600 mt-1">Filtered: {counts.absent}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-amber-700">Late</CardTitle>
            <Clock className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">{totalCounts.late}</div>
            <p className="text-xs text-amber-600 mt-1">Filtered: {counts.late}</p>
          </CardContent>
        </Card>

        {!isStudent && (
          <Card
            className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setShowNotMarkedModal(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">Not Marked</CardTitle>
              <User className="h-5 w-5 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-700">{notMarkedData?.count ?? 0}</div>
              <p className="text-xs text-slate-600 mt-1">Click to view & mark</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="shadow-sm border-0 overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
          <table className="min-w-full">
            <thead className="sticky top-0 z-10 bg-card shadow-sm">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name & Code/Roll</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
                  Type & Class Level
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
                  Department & Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
                  Shift & Timing
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status & Time</th>
                {!isStudent && <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {records.map((r) => {
                const shiftWindow = formatShiftWindow(r.shift)
                const autoAbsentAt = formatAutoAbsent(r.shift)
                const canUpdate =
                  currentUser?.role === "Admin" || currentUser?.role === "SuperAdmin" || currentUser?.role === "Teacher"
                const canDelete = currentUser?.role === "Admin" || currentUser?.role === "SuperAdmin"
                return (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div
                        className="cursor-pointer"
                        onClick={() => setSelectedPerson({ personId: r.personId, personType: r.personType })}
                      >
                        {r.imageUrl ? (
                          <img
                            src={r.imageUrl || "/placeholder.svg"}
                            alt={r.personName || "Person"}
                            className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors shadow-sm">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-base font-semibold text-foreground">{r.personName || "Unknown"}</div>
                        <div className="text-sm text-muted-foreground font-medium">
                          {r.personType === "staff"
                            ? `Code: ${r.employeeCode || "N/A"}`
                            : `Roll: ${r.rollNumber || "N/A"}`}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="text-sm font-medium capitalize text-foreground">{r.personType}</div>
                        {r.personType === "student" && (
                          <div className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md inline-block">
                            {r.classLevel || "N/A"}
                          </div>
                        )}
                        {r.personType === "staff" && (
                          <div className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md inline-block">
                            Staff Member
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-foreground">{r.department}</div>
                        <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md inline-block">
                          {r.role}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground">{`${normShift(r.shift) || r.shift} Shift`}</div>
                        <div className="text-xs text-muted-foreground">{shiftWindow}</div>
                        <div className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-md inline-block">
                          Auto-absent: {autoAbsentAt}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {isAttendanceMarked(r) ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-md">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Marked as {r.status?.toUpperCase()}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {r.timestamp && new Date(r.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground italic">Not marked yet</div>
                      )}
                    </td>

                    {!isStudent && (
                      <td className="px-6 py-4">
                        {isAttendanceMarked(r) ? (
                          canUpdate ? (
                            <div className="flex flex-col gap-2 w-40">
                              <Select
                                onValueChange={(v) =>
                                  updateAttendanceStatus(r.id as string, r.personId, r.personType, v as any)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={`Change: ${r.status?.toUpperCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="present">Present</SelectItem>
                                  <SelectItem value="absent">Absent</SelectItem>
                                  <SelectItem value="late">Late</SelectItem>
                                </SelectContent>
                              </Select>
                              {updatingStatus === r.id && (
                                <div className="text-xs text-muted-foreground">Updating...</div>
                              )}

                              {canDelete && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="flex items-center gap-2"
                                  onClick={() => deleteAttendance(r.id as string, r.personId)}
                                  disabled={deletingId === r.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  {deletingId === r.id ? "Deleting..." : "Delete"}
                                </Button>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">No actions</div>
                          )
                        ) : (
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 text-white hover:bg-green-700 shadow-sm font-medium"
                              onClick={() => mark(r.personId, r.personType, "present")}
                            >
                              Present
                            </Button>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-medium bg-transparent"
                                onClick={() => mark(r.personId, r.personType, "absent")}
                              >
                                Absent
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 font-medium bg-transparent"
                                onClick={() => mark(r.personId, r.personType, "late")}
                              >
                                Late
                              </Button>
                            </div>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })}
              {records.length === 0 && (
                <tr>
                  <td className="px-6 py-12 text-center text-muted-foreground" colSpan={7}>
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground/50" />
                      <span>No attendance records found for the selected filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {!isStudent && (
        <Dialog open={showNotMarkedModal} onOpenChange={setShowNotMarkedModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Not Marked Attendance ({notMarkedData?.count ?? 0})
              </DialogTitle>
              <DialogDescription>
                People who haven't marked their attendance yet. You can mark their attendance manually.
              </DialogDescription>
              <div className="mt-3">
                <Button
                  variant="outline"
                  className="h-8 px-3 text-sm bg-transparent"
                  onClick={exportNotMarkedCsv}
                  disabled={!notMarkedPeople.length}
                >
                  Export Not Marked (CSV)
                </Button>
              </div>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[60vh]">
              {!notMarkedData ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">Loading...</p>
                  <p className="text-muted-foreground">Fetching people who haven't marked attendance.</p>
                </div>
              ) : notMarkedPeople.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">All attendance marked!</p>
                  <p className="text-muted-foreground">Everyone has marked their attendance for today.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notMarkedPeople.map((person) => (
                    <div
                      key={person.personId}
                      className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            setSelectedPerson({ personId: person.personId, personType: person.personType })
                          }
                        >
                          {person.imageUrl ? (
                            <img
                              src={person.imageUrl || "/placeholder.svg"}
                              alt={person.personName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-border hover:border-primary transition-colors"
                              onError={(e) => {
                                e.currentTarget.style.display = "none"
                                e.currentTarget.nextElementSibling.style.display = "flex"
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors ${person.imageUrl ? "hidden" : "flex"}`}
                          >
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="font-semibold">{person.personName}</div>
                          <div className="text-sm text-muted-foreground">
                            {person.personType === "staff"
                              ? `Employee Code: ${person.employeeCode || "N/A"}`
                              : `Roll Number: ${person.rollNumber || "N/A"}`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {person.department} • {person.role} • {person.shift} Shift
                            {person.personType === "student" && person.classLevel && ` • ${person.classLevel}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 text-white hover:bg-green-700 shadow-sm"
                          onClick={() => handleManualMark(person.personId, person.personType, "present")}
                        >
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                          onClick={() => handleManualMark(person.personId, person.personType, "absent")}
                        >
                          Absent
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
                          onClick={() => handleManualMark(person.personId, person.personType, "late")}
                        >
                          Late
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <PersonDetailsModal
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
        personId={selectedPerson?.personId || ""}
        personType={selectedPerson?.personType || "staff"}
      />
    </div>
  )
}

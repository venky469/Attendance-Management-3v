// // // // "use client"

// // // // import useSWR from "swr"
// // // // import { useMemo } from "react"
// // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // // // import { Progress } from "@/components/ui/progress"
// // // // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // // // import { Badge } from "@/components/ui/badge"
// // // // import { Skeleton } from "@/components/ui/skeleton"

// // // // type AttendanceRecord = {
// // // //   id?: string
// // // //   date?: string
// // // //   createdAt?: string
// // // //   status?: string
// // // //   subject?: string
// // // //   course?: string
// // // //   [key: string]: any
// // // // }

// // // // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // // // function formatDate(d?: string) {
// // // //   if (!d) return "-"
// // // //   const dt = new Date(d)
// // // //   if (isNaN(dt.getTime())) return "-"
// // // //   return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
// // // // }

// // // // function getRecordDate(r: AttendanceRecord) {
// // // //   // Prefer `date`, fallback to `createdAt`
// // // //   return r.date ?? r.createdAt
// // // // }

// // // // function isPresent(status?: string) {
// // // //   if (!status) return false
// // // //   const s = status.toLowerCase()
// // // //   return s === "present" || s === "p" || s === "on-time"
// // // // }

// // // // function isLeave(status?: string) {
// // // //   if (!status) return false
// // // //   const s = status.toLowerCase()
// // // //   return s === "leave" || s === "l" || s === "approved-leave"
// // // // }

// // // // export function StudentDashboardWidgets({ studentId }: { studentId: string }) {
// // // //   const { data, error, isLoading } = useSWR<AttendanceRecord[]>(
// // // //     studentId ? `/api/students/${studentId}/attendance` : null,
// // // //     fetcher,
// // // //   )

// // // //   const { total, presentCount, leaveCount, attendanceRate, recent } = useMemo(() => {
// // // //     const rows = Array.isArray(data) ? data : []
// // // //     const total = rows.length
// // // //     const presentCount = rows.filter((r) => isPresent(r?.status)).length
// // // //     const leaveCount = rows.filter((r) => isLeave(r?.status)).length
// // // //     const attendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 0

// // // //     const sorted = rows
// // // //       .slice()
// // // //       .sort((a, b) => {
// // // //         const da = new Date(getRecordDate(a) ?? 0).getTime()
// // // //         const db = new Date(getRecordDate(b) ?? 0).getTime()
// // // //         return db - da
// // // //       })
// // // //       .slice(0, 5)

// // // //     return { total, presentCount, leaveCount, attendanceRate, recent: sorted }
// // // //   }, [data])

// // // //   if (error) {
// // // //     return <div className="text-destructive">Failed to load attendance. Please try again.</div>
// // // //   }

// // // //   if (isLoading) {
// // // //     return (
// // // //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// // // //         <Skeleton className="h-[120px] w-full" />
// // // //         <Skeleton className="h-[120px] w-full" />
// // // //         <Skeleton className="h-[120px] w-full" />
// // // //         <Skeleton className="h-[120px] w-full" />
// // // //         <Skeleton className="h-[240px] w-full md:col-span-4" />
// // // //       </div>
// // // //     )
// // // //   }

// // // //   return (
// // // //     <div className="space-y-6">
// // // //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// // // //         <Card>
// // // //           <CardHeader>
// // // //             <CardTitle className="text-pretty">My Attendance Rate</CardTitle>
// // // //           </CardHeader>
// // // //           <CardContent className="space-y-3">
// // // //             <div className="text-2xl font-semibold">{attendanceRate}%</div>
// // // //             <Progress value={attendanceRate} aria-label="Attendance rate progress" />
// // // //             <div className="text-sm text-muted-foreground">
// // // //               {presentCount} of {total} days present
// // // //             </div>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card>
// // // //           <CardHeader>
// // // //             <CardTitle className="text-pretty">Present Days</CardTitle>
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-2xl font-semibold">{presentCount}</div>
// // // //             <div className="text-sm text-muted-foreground">All-time recorded</div>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card>
// // // //           <CardHeader>
// // // //             <CardTitle className="text-pretty">Leave Requests</CardTitle>
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-2xl font-semibold">{leaveCount}</div>
// // // //             <div className="text-sm text-muted-foreground">Marked as leave</div>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card>
// // // //           <CardHeader>
// // // //             <CardTitle className="text-pretty">Total Records</CardTitle>
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-2xl font-semibold">{total}</div>
// // // //             <div className="text-sm text-muted-foreground">Attendance entries</div>
// // // //           </CardContent>
// // // //         </Card>
// // // //       </div>

// // // //       <Card>
// // // //         <CardHeader>
// // // //           <CardTitle className="text-pretty">Recent Attendance</CardTitle>
// // // //         </CardHeader>
// // // //         <CardContent>
// // // //           <Table>
// // // //             <TableHeader>
// // // //               <TableRow>
// // // //                 <TableHead>Date</TableHead>
// // // //                 <TableHead>Status</TableHead>
// // // //                 <TableHead>Subject</TableHead>
// // // //               </TableRow>
// // // //             </TableHeader>
// // // //             <TableBody>
// // // //               {recent.length === 0 ? (
// // // //                 <TableRow>
// // // //                   <TableCell colSpan={3} className="text-muted-foreground">
// // // //                     No recent attendance found.
// // // //                   </TableCell>
// // // //                 </TableRow>
// // // //               ) : (
// // // //                 recent.map((r, idx) => {
// // // //                   const status = r?.status ?? "-"
// // // //                   const displayDate = formatDate(getRecordDate(r))
// // // //                   return (
// // // //                     <TableRow key={r.id ?? idx}>
// // // //                       <TableCell>{displayDate}</TableCell>
// // // //                       <TableCell>
// // // //                         <Badge variant={isPresent(status) ? "default" : isLeave(status) ? "secondary" : "outline"}>
// // // //                           {status}
// // // //                         </Badge>
// // // //                       </TableCell>
// // // //                       <TableCell>{r?.subject || r?.course || "-"}</TableCell>
// // // //                     </TableRow>
// // // //                   )
// // // //                 })
// // // //               )}
// // // //             </TableBody>
// // // //           </Table>
// // // //         </CardContent>
// // // //       </Card>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default StudentDashboardWidgets



// // // "use client"

// // // import useSWR from "swr"
// // // import { useMemo } from "react"
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // // import { Progress } from "@/components/ui/progress"
// // // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // // import { Badge } from "@/components/ui/badge"
// // // import { Skeleton } from "@/components/ui/skeleton"

// // // type AttendanceRecord = {
// // //   id?: string
// // //   date?: string
// // //   createdAt?: string
// // //   status?: string
// // //   subject?: string
// // //   course?: string
// // //   [key: string]: any
// // // }

// // // type AttendanceStats = {
// // //   totalDays: number
// // //   presentDays: number
// // //   absentDays: number
// // //   lateDays: number
// // //   attendancePercentage: number
// // // }

// // // type AttendanceApiResponse = {
// // //   records: AttendanceRecord[]
// // //   stats: AttendanceStats
// // // }

// // // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // // function formatDate(d?: string) {
// // //   if (!d) return "-"
// // //   const dt = new Date(d)
// // //   if (isNaN(dt.getTime())) return "-"
// // //   return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
// // // }

// // // function getRecordDate(r: AttendanceRecord) {
// // //   return r.date ?? r.createdAt
// // // }

// // // function isPresent(status?: string) {
// // //   if (!status) return false
// // //   const s = status.toLowerCase()
// // //   return s === "present" || s === "p" || s === "on-time"
// // // }

// // // function isLeave(status?: string) {
// // //   if (!status) return false
// // //   const s = status.toLowerCase()
// // //   return s === "leave" || s === "l" || s === "approved-leave"
// // // }

// // // function getPresentStreak(records: AttendanceRecord[]) {
// // //   const sorted = records.slice().sort((a, b) => {
// // //     const da = new Date(getRecordDate(a) ?? 0).getTime()
// // //     const db = new Date(getRecordDate(b) ?? 0).getTime()
// // //     return db - da
// // //   })
// // //   let streak = 0
// // //   for (const r of sorted) {
// // //     if (isPresent(r?.status)) streak++
// // //     else break
// // //   }
// // //   return streak
// // // }

// // // export function StudentDashboardWidgets({ studentId }: { studentId: string }) {
// // //   const { data, error, isLoading } = useSWR<AttendanceApiResponse>(
// // //     studentId ? `/api/students/${studentId}/attendance` : null,
// // //     fetcher,
// // //   )

// // //   const { totalDays, presentDays, absentDays, attendanceRate, recent, streak } = useMemo(() => {
// // //     const api = data
// // //     const rows = Array.isArray(api?.records) ? api!.records : Array.isArray(api) ? (api as any) : []
// // //     const stats = (api as any)?.stats as AttendanceStats | undefined

// // //     const totalDays = stats?.totalDays ?? rows.length
// // //     const presentDays = stats?.presentDays ?? rows.filter((r) => isPresent(r?.status)).length
// // //     const absentDays = stats?.absentDays ?? rows.filter((r) => (r?.status ?? "").toLowerCase() === "absent").length
// // //     const attendanceRate =
// // //       stats?.attendancePercentage ?? (totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0)

// // //     const recent = rows
// // //       .slice()
// // //       .sort((a, b) => {
// // //         const da = new Date(getRecordDate(a) ?? 0).getTime()
// // //         const db = new Date(getRecordDate(b) ?? 0).getTime()
// // //         return db - da
// // //       })
// // //       .slice(0, 5)

// // //     const streak = getPresentStreak(rows)

// // //     return { totalDays, presentDays, absentDays, attendanceRate, recent, streak }
// // //   }, [data])

// // //   if (error) {
// // //     return <div className="text-destructive">Failed to load attendance. Please try again.</div>
// // //   }

// // //   if (isLoading) {
// // //     return (
// // //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// // //         <Skeleton className="h-[120px] w-full" />
// // //         <Skeleton className="h-[120px] w-full" />
// // //         <Skeleton className="h-[120px] w-full" />
// // //         <Skeleton className="h-[120px] w-full" />
// // //         <Skeleton className="h-[240px] w-full md:col-span-4" />
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div className="space-y-6">
// // //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="text-pretty">My Attendance Rate</CardTitle>
// // //           </CardHeader>
// // //           <CardContent className="space-y-3">
// // //             <div className="text-2xl font-semibold">{attendanceRate}%</div>
// // //             <Progress value={attendanceRate} aria-label="Attendance rate progress" />
// // //             <div className="text-sm text-muted-foreground">
// // //               {presentDays} of {totalDays} days present
// // //             </div>
// // //             <div className="text-xs text-muted-foreground">
// // //               Current present streak: {streak} day{streak === 1 ? "" : "s"}
// // //             </div>
// // //           </CardContent>
// // //         </Card>

// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="text-pretty">Present Days</CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-semibold">{presentDays}</div>
// // //             <div className="text-sm text-muted-foreground">Counted this month</div>
// // //           </CardContent>
// // //         </Card>

// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="text-pretty">Absent Days</CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-semibold">{absentDays}</div>
// // //             <div className="text-sm text-muted-foreground">Counted this month</div>
// // //           </CardContent>
// // //         </Card>

// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="text-pretty">Total Days</CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-semibold">{totalDays}</div>
// // //             <div className="text-sm text-muted-foreground">Attendance entries</div>
// // //           </CardContent>
// // //         </Card>
// // //       </div>

// // //       <Card>
// // //         <CardHeader>
// // //           <CardTitle className="text-pretty">Recent Attendance</CardTitle>
// // //         </CardHeader>
// // //         <CardContent>
// // //           <Table>
// // //             <TableHeader>
// // //               <TableRow>
// // //                 <TableHead>Date</TableHead>
// // //                 <TableHead>Status</TableHead>
// // //                 <TableHead>Subject</TableHead>
// // //               </TableRow>
// // //             </TableHeader>
// // //             <TableBody>
// // //               {recent.length === 0 ? (
// // //                 <TableRow>
// // //                   <TableCell colSpan={3} className="text-muted-foreground">
// // //                     No recent attendance found.
// // //                   </TableCell>
// // //                 </TableRow>
// // //               ) : (
// // //                 recent.map((r, idx) => {
// // //                   const status = r?.status ?? "-"
// // //                   const displayDate = formatDate(getRecordDate(r))
// // //                   return (
// // //                     <TableRow key={r.id ?? idx}>
// // //                       <TableCell>{displayDate}</TableCell>
// // //                       <TableCell>
// // //                         <Badge variant={isPresent(status) ? "default" : isLeave(status) ? "secondary" : "outline"}>
// // //                           {status}
// // //                         </Badge>
// // //                       </TableCell>
// // //                       <TableCell>{r?.subject || r?.course || "-"}</TableCell>
// // //                     </TableRow>
// // //                   )
// // //                 })
// // //               )}
// // //             </TableBody>
// // //           </Table>
// // //         </CardContent>
// // //       </Card>
// // //     </div>
// // //   )
// // // }

// // // export default StudentDashboardWidgets



// // "use client"

// // import useSWR from "swr"
// // import { useEffect, useMemo } from "react"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Progress } from "@/components/ui/progress"
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // import { Badge } from "@/components/ui/badge"
// // import { Skeleton } from "@/components/ui/skeleton"
// // import { realtimeClient } from "@/lib/realtime-client"

// // type AttendanceRecord = {
// //   id?: string
// //   date?: string
// //   createdAt?: string
// //   status?: string
// //   subject?: string
// //   course?: string
// //   [key: string]: any
// // }

// // type AttendanceStats = {
// //   totalDays: number
// //   presentDays: number
// //   absentDays: number
// //   lateDays: number
// //   attendancePercentage: number
// // }

// // type AttendanceApiResponse = {
// //   records: AttendanceRecord[]
// //   stats: AttendanceStats
// // }

// // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // function formatDate(d?: string) {
// //   if (!d) return "-"
// //   const dt = new Date(d)
// //   if (isNaN(dt.getTime())) return "-"
// //   return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
// // }

// // function getRecordDate(r: AttendanceRecord) {
// //   return r.date ?? r.createdAt
// // }

// // function isPresent(status?: string) {
// //   if (!status) return false
// //   const s = status.toLowerCase()
// //   return s === "present" || s === "p" || s === "on-time"
// // }

// // function isLeave(status?: string) {
// //   if (!status) return false
// //   const s = status.toLowerCase()
// //   return s === "leave" || s === "l" || s === "approved-leave"
// // }

// // function getPresentStreak(records: AttendanceRecord[]) {
// //   const sorted = records.slice().sort((a, b) => {
// //     const da = new Date(getRecordDate(a) ?? 0).getTime()
// //     const db = new Date(getRecordDate(b) ?? 0).getTime()
// //     return db - da
// //   })
// //   let streak = 0
// //   for (const r of sorted) {
// //     if (isPresent(r?.status)) streak++
// //     else break
// //   }
// //   return streak
// // }

// // export function StudentDashboardWidgets({ studentId }: { studentId: string }) {
// //   const { data, error, isLoading, mutate } = useSWR<AttendanceApiResponse>(
// //     studentId ? `/api/students/${studentId}/attendance` : null,
// //     fetcher,
// //   )

// //   useEffect(() => {
// //     if (!studentId) return

// //     const onAttendanceUpdate = (evt: any) => {
// //       if (evt?.personType === "student" && evt?.personId === studentId) {
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
// //   }, [studentId, mutate])

// //   const { totalDays, presentDays, absentDays, attendanceRate, recent, streak } = useMemo(() => {
// //     const api = data
// //     const rows = Array.isArray(api?.records) ? api!.records : Array.isArray(api) ? (api as any) : []
// //     const stats = (api as any)?.stats as AttendanceStats | undefined

// //     const totalDays = stats?.totalDays ?? rows.length
// //     const presentDays = stats?.presentDays ?? rows.filter((r) => isPresent(r?.status)).length
// //     const absentDays = stats?.absentDays ?? rows.filter((r) => (r?.status ?? "").toLowerCase() === "absent").length
// //     const attendanceRate =
// //       stats?.attendancePercentage ?? (totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0)

// //     const recent = rows
// //       .slice()
// //       .sort((a, b) => {
// //         const da = new Date(getRecordDate(a) ?? 0).getTime()
// //         const db = new Date(getRecordDate(b) ?? 0).getTime()
// //         return db - da
// //       })
// //       .slice(0, 5)

// //     const streak = getPresentStreak(rows)

// //     return { totalDays, presentDays, absentDays, attendanceRate, recent, streak }
// //   }, [data])

// //   if (error) {
// //     return <div className="text-destructive">Failed to load attendance. Please try again.</div>
// //   }

// //   if (isLoading) {
// //     return (
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //         <Skeleton className="h-[120px] w-full" />
// //         <Skeleton className="h-[120px] w-full" />
// //         <Skeleton className="h-[120px] w-full" />
// //         <Skeleton className="h-[120px] w-full" />
// //         <Skeleton className="h-[240px] w-full md:col-span-4" />
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="text-pretty">My Attendance Rate</CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-3">
// //             <div className="text-2xl font-semibold">{attendanceRate}%</div>
// //             <Progress value={attendanceRate} aria-label="Attendance rate progress" />
// //             <div className="text-sm text-muted-foreground">
// //               {presentDays} of {totalDays} days present
// //             </div>
// //             <div className="text-xs text-muted-foreground">
// //               Current present streak: {streak} day{streak === 1 ? "" : "s"}
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="text-pretty">Present Days</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-semibold">{presentDays}</div>
// //             <div className="text-sm text-muted-foreground">Counted this month</div>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="text-pretty">Absent Days</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-semibold">{absentDays}</div>
// //             <div className="text-sm text-muted-foreground">Counted this month</div>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="text-pretty">Total Days</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-semibold">{totalDays}</div>
// //             <div className="text-sm text-muted-foreground">Attendance entries</div>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       <Card>
// //         <CardHeader>
// //           <CardTitle className="text-pretty">Recent Attendance</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <Table>
// //             <TableHeader>
// //               <TableRow>
// //                 <TableHead>Date</TableHead>
// //                 <TableHead>Status</TableHead>
// //                 <TableHead>Subject</TableHead>
// //               </TableRow>
// //             </TableHeader>
// //             <TableBody>
// //               {recent.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={3} className="text-muted-foreground">
// //                     No recent attendance found.
// //                   </TableCell>
// //                 </TableRow>
// //               ) : (
// //                 recent.map((r, idx) => {
// //                   const status = r?.status ?? "-"
// //                   const displayDate = formatDate(getRecordDate(r))
// //                   return (
// //                     <TableRow key={r.id ?? idx}>
// //                       <TableCell>{displayDate}</TableCell>
// //                       <TableCell>
// //                         <Badge variant={isPresent(status) ? "default" : isLeave(status) ? "secondary" : "outline"}>
// //                           {status}
// //                         </Badge>
// //                       </TableCell>
// //                       <TableCell>{r?.subject || r?.course || "-"}</TableCell>
// //                     </TableRow>
// //                   )
// //                 })
// //               )}
// //             </TableBody>
// //           </Table>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   )
// // }

// // export default StudentDashboardWidgets




// "use client"

// import useSWR from "swr"
// import { useEffect, useMemo } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import { realtimeClient } from "@/lib/realtime-client"

// type AttendanceRecord = {
//   id?: string
//   date?: string
//   createdAt?: string
//   status?: string
//   subject?: string
//   course?: string
//   [key: string]: any
// }

// type AttendanceStats = {
//   totalDays: number
//   presentDays: number
//   absentDays: number
//   lateDays: number
//   attendancePercentage: number
// }

// type AttendanceApiResponse = {
//   records: AttendanceRecord[]
//   stats: AttendanceStats
// }

// const fetcher = (url: string) => fetch(url).then((r) => r.json())

// function formatDate(d?: string) {
//   if (!d) return "-"
//   // If it's a YYYY-MM-DD, parse as local date
//   const ymdMatch = typeof d === "string" && d.match(/^(\d{4})-(\d{2})-(\d{2})$/)
//   let dt: Date
//   if (ymdMatch) {
//     const y = Number(ymdMatch[1])
//     const m = Number(ymdMatch[2])
//     const day = Number(ymdMatch[3])
//     dt = new Date(y, m - 1, day)
//   } else {
//     dt = new Date(d)
//   }
//   if (isNaN(dt.getTime())) return "-"
//   return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
// }

// function getRecordDate(r: AttendanceRecord) {
//   return r.date ?? r.createdAt
// }

// function isPresent(status?: string) {
//   if (!status) return false
//   const s = status.toLowerCase()
//   return s === "present" || s === "p" || s === "on-time"
// }

// function isLeave(status?: string) {
//   if (!status) return false
//   const s = status.toLowerCase()
//   return s === "leave" || s === "l" || s === "approved-leave"
// }

// function getPresentStreak(records: AttendanceRecord[]) {
//   const sorted = records.slice().sort((a, b) => {
//     const da = new Date(getRecordDate(a) ?? 0).getTime()
//     const db = new Date(getRecordDate(b) ?? 0).getTime()
//     return db - da
//   })
//   let streak = 0
//   for (const r of sorted) {
//     if (isPresent(r?.status)) streak++
//     else break
//   }
//   return streak
// }

// export function StudentDashboardWidgets({ studentId }: { studentId: string }) {
//   const { data, error, isLoading, mutate } = useSWR<AttendanceApiResponse>(
//     studentId ? `/api/students/${studentId}/attendance` : null,
//     fetcher,
//   )

//   useEffect(() => {
//     if (!studentId) return

//     const onAttendanceUpdate = (evt: any) => {
//       if (evt?.personType === "student" && evt?.personId === studentId) {
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
//   }, [studentId, mutate])

//   const { totalDays, presentDays, absentDays, attendanceRate, recent, streak } = useMemo(() => {
//     const api = data
//     const rows = Array.isArray(api?.records) ? api!.records : Array.isArray(api) ? (api as any) : []
//     const stats = (api as any)?.stats as AttendanceStats | undefined

//     const totalDays = stats?.totalDays ?? rows.length
//     const presentDays = stats?.presentDays ?? rows.filter((r) => isPresent(r?.status)).length
//     const absentDays = stats?.absentDays ?? rows.filter((r) => (r?.status ?? "").toLowerCase() === "absent").length
//     const attendanceRate =
//       stats?.attendancePercentage ?? (totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0)

//     const recent = rows
//       .slice()
//       .sort((a, b) => {
//         const da = new Date(getRecordDate(a) ?? 0).getTime()
//         const db = new Date(getRecordDate(b) ?? 0).getTime()
//         return db - da
//       })
//       .slice(0, 5)

//     const streak = getPresentStreak(rows)

//     return { totalDays, presentDays, absentDays, attendanceRate, recent, streak }
//   }, [data])

//   if (error) {
//     return <div className="text-destructive">Failed to load attendance. Please try again.</div>
//   }

//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Skeleton className="h-[120px] w-full" />
//         <Skeleton className="h-[120px] w-full" />
//         <Skeleton className="h-[120px] w-full" />
//         <Skeleton className="h-[120px] w-full" />
//         <Skeleton className="h-[240px] w-full md:col-span-4" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-pretty">My Attendance Rate</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="text-2xl font-semibold">{attendanceRate}%</div>
//             <Progress value={attendanceRate} aria-label="Attendance rate progress" />
//             <div className="text-sm text-muted-foreground">
//               {presentDays} of {totalDays} days present
//             </div>
//             <div className="text-xs text-muted-foreground">
//               Current present streak: {streak} day{streak === 1 ? "" : "s"}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-pretty">Present Days</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-semibold">{presentDays}</div>
//             <div className="text-sm text-muted-foreground">Counted this month</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-pretty">Absent Days</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-semibold">{absentDays}</div>
//             <div className="text-sm text-muted-foreground">Counted this month</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-pretty">Total Days</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-semibold">{totalDays}</div>
//             <div className="text-sm text-muted-foreground">Attendance entries</div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="text-pretty">Recent Attendance</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Subject</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {recent.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={3} className="text-muted-foreground">
//                     No recent attendance found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 recent.map((r, idx) => {
//                   const status = r?.status ?? "-"
//                   const displayDate = formatDate(getRecordDate(r))
//                   return (
//                     <TableRow key={r.id ?? idx}>
//                       <TableCell>{displayDate}</TableCell>
//                       <TableCell>
//                         <Badge variant={isPresent(status) ? "default" : isLeave(status) ? "secondary" : "outline"}>
//                           {status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>{r?.subject || r?.course || "-"}</TableCell>
//                     </TableRow>
//                   )
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default StudentDashboardWidgets

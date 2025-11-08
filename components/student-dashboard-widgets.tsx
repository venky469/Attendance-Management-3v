"use client"

import useSWR from "swr"
import { useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { realtimeClient } from "@/lib/realtime-client"

type AttendanceRecord = {
  id?: string
  date?: string
  createdAt?: string
  status?: string
  subject?: string
  course?: string
  [key: string]: any
}

type AttendanceStats = {
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  attendancePercentage: number
}

type AttendanceApiResponse = {
  records: AttendanceRecord[]
  stats: AttendanceStats
}

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => {
      if (r.status === 503) {
        return r.json().then((data) => {
          if (data.offline) {
            throw new Error("You are currently offline")
          }
          return data
        })
      }
      return r.json()
    })
    .catch((err) => {
      if (err.message.includes("offline") || err.message.includes("Failed to fetch")) {
        throw new Error("Network unavailable. Please check your connection.")
      }
      throw err
    })

function formatDate(d?: string) {
  if (!d) return "-"
  // If it's a YYYY-MM-DD, parse as local date
  const ymdMatch = typeof d === "string" && d.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  let dt: Date
  if (ymdMatch) {
    const y = Number(ymdMatch[1])
    const m = Number(ymdMatch[2])
    const day = Number(ymdMatch[3])
    dt = new Date(y, m - 1, day)
  } else {
    dt = new Date(d)
  }
  if (isNaN(dt.getTime())) return "-"
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

function getRecordDate(r: AttendanceRecord) {
  return r.date ?? r.createdAt
}

function isPresent(status?: string) {
  if (!status) return false
  const s = status.toLowerCase()
  return s === "present" || s === "p" || s === "on-time"
}

function isLeave(status?: string) {
  if (!status) return false
  const s = status.toLowerCase()
  return s === "leave" || s === "l" || s === "approved-leave"
}

function getPresentStreak(records: AttendanceRecord[]) {
  const sorted = records.slice().sort((a, b) => {
    const da = new Date(getRecordDate(a) ?? 0).getTime()
    const db = new Date(getRecordDate(b) ?? 0).getTime()
    return db - da
  })
  let streak = 0
  for (const r of sorted) {
    if (isPresent(r?.status)) streak++
    else break
  }
  return streak
}

export function StudentDashboardWidgets({ studentId }: { studentId: string }) {
  const { data, error, isLoading, mutate } = useSWR<AttendanceApiResponse>(
    studentId ? `/api/students/${studentId}/attendance` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 600000, // Background refresh every 10 minutes
    },
  )

  useEffect(() => {
    if (!studentId) return

    let reconnectTimeout: NodeJS.Timeout | null = null

    const onAttendanceUpdate = (evt: any) => {
      if (evt?.personType === "student" && evt?.personId === studentId) {
        mutate()
      }
    }

    const onConnRestore = () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      reconnectTimeout = setTimeout(() => {
        console.log("[v0] Connection restored - refreshing in background")
        mutate()
      }, 2000) // Wait 2 seconds before refreshing
    }

    realtimeClient.on("attendance_update", onAttendanceUpdate)
    realtimeClient.on("connection_restored", onConnRestore)
    realtimeClient.connect()

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      realtimeClient.off("attendance_update", onAttendanceUpdate)
      realtimeClient.off("connection_restored", onConnRestore)
      realtimeClient.disconnect()
    }
  }, [studentId, mutate])

  const { totalDays, presentDays, absentDays, attendanceRate, recent, streak } = useMemo(() => {
    const api = data
    const rows = Array.isArray(api?.records) ? api!.records : Array.isArray(api) ? (api as any) : []
    const stats = (api as any)?.stats as AttendanceStats | undefined

    const totalDays = stats?.totalDays ?? rows.length
    const presentDays = stats?.presentDays ?? rows.filter((r) => isPresent(r?.status)).length
    const absentDays = stats?.absentDays ?? rows.filter((r) => (r?.status ?? "").toLowerCase() === "absent").length
    const attendanceRate =
      stats?.attendancePercentage ?? (totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0)

    const recent = rows
      .slice()
      .sort((a, b) => {
        const da = new Date(getRecordDate(a) ?? 0).getTime()
        const db = new Date(getRecordDate(b) ?? 0).getTime()
        return db - da
      })
      .slice(0, 5)

    const streak = getPresentStreak(rows)

    return { totalDays, presentDays, absentDays, attendanceRate, recent, streak }
  }, [data])

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-destructive font-medium">Unable to load attendance</p>
        <p className="text-sm text-muted-foreground mt-1">
          {error.message || "Please check your internet connection and try again."}
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[240px] w-full md:col-span-4" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">My Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-semibold">{attendanceRate}%</div>
            <Progress value={attendanceRate} aria-label="Attendance rate progress" />
            <div className="text-sm text-muted-foreground">
              {presentDays} of {totalDays} days present
            </div>
            <div className="text-xs text-muted-foreground">
              Current present streak: {streak} day{streak === 1 ? "" : "s"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">Present Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{presentDays}</div>
            <div className="text-sm text-muted-foreground">Counted this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">Absent Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{absentDays}</div>
            <div className="text-sm text-muted-foreground">Counted this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">Total Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{totalDays}</div>
            <div className="text-sm text-muted-foreground">Attendance entries</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subject</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    No recent attendance found.
                  </TableCell>
                </TableRow>
              ) : (
                recent.map((r, idx) => {
                  const status = r?.status ?? "-"
                  const displayDate = formatDate(getRecordDate(r))
                  return (
                    <TableRow key={r.id ?? idx}>
                      <TableCell>{displayDate}</TableCell>
                      <TableCell>
                        <Badge variant={isPresent(status) ? "default" : isLeave(status) ? "secondary" : "outline"}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>{r?.subject || r?.course || "-"}</TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentDashboardWidgets

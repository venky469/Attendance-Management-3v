
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, CheckCircle, XCircle, Clock } from "lucide-react"
import { useState } from "react"

interface AttendanceRecord {
  date: string
  status: "present" | "absent" | "late" | "leave"
  timestamp?: string
}

interface AttendanceCalendarProps {
  attendanceData: {
    present: AttendanceRecord[]
    absent: AttendanceRecord[]
    late: AttendanceRecord[]
    leave: AttendanceRecord[]
  }
}

function parseLocalYMD(ymd?: string): Date | null {
  if (!ymd || typeof ymd !== "string") return null
  const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  return new Date(y, mo - 1, d)
}

function AttendanceCalendarComponent({ attendanceData }: AttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const safeAttendanceData = {
    present: attendanceData?.present || [],
    absent: attendanceData?.absent || [],
    late: attendanceData?.late || [],
    leave: attendanceData?.leave || [],
  }

  // Combine all attendance records
  const allRecords = [
    ...safeAttendanceData.present.map((r) => ({ ...r, status: "present" as const })),
    ...safeAttendanceData.absent.map((r) => ({ ...r, status: "absent" as const })),
    ...safeAttendanceData.late.map((r) => ({ ...r, status: "late" as const })),
    ...safeAttendanceData.leave.map((r) => ({ ...r, status: "leave" as const })),
  ]

  // Create a map for quick lookup
  const recordMap = new Map()
  allRecords.forEach((record) => {
    const parsed = parseLocalYMD(record.date) || (record.date ? new Date(record.date) : null)
    const dateKey = (parsed || new Date()).toDateString()
    recordMap.set(dateKey, record)
  })

  // Generate calendar days
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days = []
  const current = new Date(startDate)

  for (let i = 0; i < 42; i++) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
      return newDate
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "absent":
        return <XCircle className="h-3 w-3 text-red-600" />
      case "late":
        return <Clock className="h-3 w-3 text-amber-600" />
      case "leave":
        return <CalendarIcon className="h-3 w-3 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 border-green-300 text-green-800"
      case "absent":
        return "bg-red-100 border-red-300 text-red-800"
      case "late":
        return "bg-amber-100 border-amber-300 text-amber-800"
      case "leave":
        return "bg-blue-100 border-blue-300 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Attendance Calendar
        </CardTitle>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigateMonth("prev")}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              ← Prev
            </button>
            <h3 className="text-base sm:text-lg font-semibold whitespace-nowrap">
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={() => navigateMonth("next")}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Next →
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 text-xs overflow-x-auto w-full sm:w-auto">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <XCircle className="h-3 w-3 text-red-600" />
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <Clock className="h-3 w-3 text-amber-600" />
              <span>Late</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <CalendarIcon className="h-3 w-3 text-blue-600" />
              <span>Leave</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === month
            const dateKey = day.toDateString()
            const record = recordMap.get(dateKey)
            const isToday = day.toDateString() === new Date().toDateString()

            return (
              <div
                key={index}
                className={`
                  relative p-1 sm:p-2 h-10 sm:h-12 border rounded-md text-sm transition-all duration-200
                  ${isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"}
                  ${isToday ? "ring-2 ring-teal-500 ring-opacity-50" : ""}
                  ${record ? getStatusColor(record.status) : "border-gray-200"}
                  hover:shadow-sm
                `}
              >
                <div className="flex items-center justify-between h-full">
                  <span className={`text-xs ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}`}>
                    {day.getDate()}
                  </span>
                  {record && <div className="flex items-center">{getStatusIcon(record.status)}</div>}
                </div>
                {record && record.timestamp && (
                  <div className="hidden sm:block absolute bottom-0 left-0 right-0 text-xs text-center opacity-75">
                    {new Date(record.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function AttendanceCalendar({ attendanceData }: AttendanceCalendarProps) {
  return AttendanceCalendarComponent({ attendanceData })
}

export default AttendanceCalendarComponent

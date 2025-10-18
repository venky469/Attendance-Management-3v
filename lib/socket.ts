import type { Server as NetServer } from "http"
import type { NextApiResponse } from "next"
import type { Server as ServerIO } from "socket.io"

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

export interface AttendanceUpdateEvent {
  type: "attendance_marked" | "attendance_updated" | "auto_marked"
  personId: string
  personType: "staff" | "student"
  personName: string
  status: "present" | "late" | "absent"
  timestamp: string
  shift?: string
  department?: string
  delayInfo?: { hours: number; minutes: number }
  message: string
}

export interface StatsUpdateEvent {
  type: "stats_update"
  totalCounts: {
    totalPeople: number
    present: number
    absent: number
    late: number
  }
  date: string
}

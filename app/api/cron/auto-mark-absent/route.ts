
import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongo"
import { todayStr } from "@/lib/constants"
import { DEFAULT_SHIFTS, type ShiftSetting, DEFAULT_ABSENT_MIN } from "@/lib/shift-settings"
import type { AttendanceUpdateEvent, StatsUpdateEvent } from "@/lib/socket"

// Add global type augmentation for io
declare global {
  // Replace 'any' with your actual Socket.IO Server type if available
  var io: import("socket.io").Server | undefined
}

function getCronToken(req: NextRequest) {
  const url = new URL(req.url)
  return req.headers.get("x-cron-token") ?? url.searchParams.get("token") ?? ""
}

async function runAutoMarkAbsent(options?: {
  institutionName?: string
  shiftName?: ShiftSetting["name"]
  now?: Date
}) {
  const db = await getDb()
  const today = todayStr()
  const now = options?.now ?? new Date()
  let totalMarkedAbsent = 0

  const settingsCache = new Map<string, ShiftSetting[]>()

  const staffQuery = options?.institutionName ? { institutionName: options.institutionName } : {}
  const studentsQuery = options?.institutionName ? { institutionName: options.institutionName } : {}

  const [staff, students] = await Promise.all([
    db.collection("staff").find(staffQuery).toArray(),
    db.collection("students").find(studentsQuery).toArray(),
  ])

  const allPeople = [
    ...staff.map((s: any) => ({ ...s, personType: "staff" as const })),
    ...students.map((s: any) => ({ ...s, personType: "student" as const })),
  ]

  const mkTodayTime = (hhmm: string) => {
    const [hh, mm] = hhmm.split(":").map((v) => Number.parseInt(v, 10))
    const d = new Date()
    d.setHours(hh || 0, mm || 0, 0, 0)
    return d
  }

  for (const person of allPeople) {
    // skip if already marked
    const existingAttendance = await db.collection("attendance").findOne({
      personId: person._id.toString(),
      date: today,
    })
    if (existingAttendance) continue

    if (options?.shiftName && String(person.shift) !== options.shiftName) continue

    const inst = person.institutionName || "__default__"
    if (!settingsCache.has(inst)) {
      const doc =
        (await db.collection("shift_settings").findOne<{ shifts?: ShiftSetting[] }>({
          institutionName: person.institutionName,
        })) || null
      const shifts =
        (doc?.shifts || DEFAULT_SHIFTS).map((s) => ({
          ...s,
          absentThresholdMinutes: s.absentThresholdMinutes ?? DEFAULT_ABSENT_MIN,
        })) || DEFAULT_SHIFTS
      settingsCache.set(inst, shifts)
    }
    const instShifts = settingsCache.get(inst) || DEFAULT_SHIFTS

    const shiftName = (person.shift || "").toString() as ShiftSetting["name"]
    const setting = instShifts.find((s) => s.name === shiftName)
    if (!setting) continue

    const start = mkTodayTime(setting.start)
    const absentCutoff = new Date(start.getTime() + (setting.absentThresholdMinutes ?? DEFAULT_ABSENT_MIN) * 60_000)

    if (now >= absentCutoff) {
      const nowIso = new Date().toISOString()

      await db.collection("attendance").insertOne({
        personId: person._id.toString(),
        personType: person.personType,
        date: today,
        status: "absent",
        timestamp: nowIso,
        department: person.department,
        role: person.role,
        shift: person.shift,
        autoMarked: true,
      })

      totalMarkedAbsent++

      const attendanceEvent: AttendanceUpdateEvent = {
        type: "auto_marked",
        personId: person._id.toString(),
        personType: person.personType,
        personName: person.name || person.fullName || person.firstName || "Unknown",
        status: "absent",
        timestamp: nowIso,
        shift: person.shift,
        department: person.department,
        message: `Auto-marked absent after threshold for ${shiftName} shift`,
      }

      if (global.io) {
        global.io.to("attendance_updates").emit("attendance_update", attendanceEvent)
      }
    }
  }

  if (totalMarkedAbsent > 0) {
    const allAttendanceForDate = await db.collection("attendance").find({ date: today }).toArray()
    const totalStaff = await db.collection("staff").countDocuments(staffQuery)
    const totalStudents = await db.collection("students").countDocuments(studentsQuery)

    const statsEvent: StatsUpdateEvent = {
      type: "stats_update",
      totalCounts: {
        totalPeople: totalStaff + totalStudents,
        present: allAttendanceForDate.filter((r: any) => r.status === "present").length,
        absent: allAttendanceForDate.filter((r: any) => r.status === "absent").length,
        late: allAttendanceForDate.filter((r: any) => r.status === "late").length,
      },
      date: today,
    }

    if (global.io) {
      global.io.to("attendance_updates").emit("stats_update", statsEvent)
    }
  }

  return {
    success: true,
    markedAbsent: totalMarkedAbsent,
    message: `Auto-marked ${totalMarkedAbsent} people as absent`,
  }
}

export async function GET(req: NextRequest) {
  const token = getCronToken(req)
  const secret = process.env.CRON_SECRET
  if (secret && token !== secret) {
    return new Response("Unauthorized", { status: 401 })
  }
  const url = new URL(req.url)
  const institutionName = url.searchParams.get("institution") ?? undefined
  const shiftName = (url.searchParams.get("shift") as ShiftSetting["name"] | null) ?? undefined

  try {
    const result = await runAutoMarkAbsent({ institutionName, shiftName })
    return Response.json(result)
  } catch (error) {
    console.error("[Cron][GET] Auto-mark absent error:", error)
    return Response.json({ success: false, error: "Failed to auto-mark absent" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getCronToken(req)
    const secret = process.env.CRON_SECRET
    if (secret && token !== secret) {
      return new Response("Unauthorized", { status: 401 })
    }
    const url = new URL(req.url)
    const institutionName = url.searchParams.get("institution") ?? undefined
    const shiftName = (url.searchParams.get("shift") as ShiftSetting["name"] | null) ?? undefined

    const result = await runAutoMarkAbsent({ institutionName, shiftName })
    return Response.json(result)
  } catch (error) {
    console.error("[Cron][POST] Auto-mark absent error:", error)
    return Response.json({ success: false, error: "Failed to auto-mark absent" }, { status: 500 })
  }
}


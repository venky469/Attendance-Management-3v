// // import { SHIFT_TIMINGS } from "@/lib/constants"

// // export type ShiftName = keyof typeof SHIFT_TIMINGS
// // export type ShiftSetting = { name: ShiftName; start: string; end: string }

// // // Defaults mapped from existing SHIFT_TIMINGS
// // export const DEFAULT_SHIFTS: ShiftSetting[] = (Object.keys(SHIFT_TIMINGS) as ShiftName[]).map((k) => ({
// //   name: k,
// //   start: SHIFT_TIMINGS[k].start,
// //   end: SHIFT_TIMINGS[k].end,
// // }))

// // const TIME_24H = /^([01]\d|2[0-3]):([0-5]\d)$/

// // export function validateShiftSettings(shifts: ShiftSetting[]): string[] {
// //   const errors: string[] = []
// //   const names = new Set<ShiftName>()
// //   for (const s of shifts) {
// //     if (!s?.name) errors.push("Shift name missing")
// //     if (!TIME_24H.test(s.start)) errors.push(`${s.name}: invalid start time`)
// //     if (!TIME_24H.test(s.end)) errors.push(`${s.name}: invalid end time`)
// //     names.add(s.name)
// //   }
// //   // Must include exactly Morning, Evening, Night (as defined in constants)
// //   const expected = new Set(Object.keys(SHIFT_TIMINGS) as ShiftName[])
// //   if (names.size !== expected.size || [...names].some((n) => !expected.has(n))) {
// //     errors.push("Shifts must include exactly Morning, Evening, and Night")
// //   }
// //   return errors
// // }


// import { SHIFT_TIMINGS } from "@/lib/constants"

// export type ShiftName = keyof typeof SHIFT_TIMINGS
// export type ShiftSetting = {
//   name: ShiftName
//   start: string
//   end: string
//   lateThresholdMinutes?: number
//   absentThresholdMinutes?: number
// }

// // Defaults mapped from existing SHIFT_TIMINGS with threshold defaults
// export const DEFAULT_LATE_MIN = 15
// export const DEFAULT_ABSENT_MIN = 60

// export const DEFAULT_SHIFTS: ShiftSetting[] = (Object.keys(SHIFT_TIMINGS) as ShiftName[]).map((k) => ({
//   name: k,
//   start: SHIFT_TIMINGS[k].start,
//   end: SHIFT_TIMINGS[k].end,
//   lateThresholdMinutes: DEFAULT_LATE_MIN,
//   absentThresholdMinutes: DEFAULT_ABSENT_MIN,
// }))

// const TIME_24H = /^([01]\d|2[0-3]):([0-5]\d)$/

// export function validateShiftSettings(shifts: ShiftSetting[]): string[] {
//   const errors: string[] = []
//   const names = new Set<ShiftName>()
//   for (const s of shifts) {
//     if (!s?.name) errors.push("Shift name missing")
//     if (!TIME_24H.test(s.start)) errors.push(`${s.name}: invalid start time`)
//     if (!TIME_24H.test(s.end)) errors.push(`${s.name}: invalid end time`)
//     const late = Number(s.lateThresholdMinutes ?? DEFAULT_LATE_MIN)
//     const absent = Number(s.absentThresholdMinutes ?? DEFAULT_ABSENT_MIN)
//     if (!Number.isFinite(late) || late < 0 || late > 480) errors.push(`${s.name}: invalid late threshold`)
//     if (!Number.isFinite(absent) || absent < 0 || absent > 720) errors.push(`${s.name}: invalid absent threshold`)
//     names.add(s.name)
//   }
//   const expected = new Set(Object.keys(SHIFT_TIMINGS) as ShiftName[])
//   if (names.size !== expected.size || [...names].some((n) => !expected.has(n))) {
//     errors.push("Shifts must include exactly Morning, Evening, and Night")
//   }
//   return errors
// }




import { SHIFT_TIMINGS } from "@/lib/constants"

export type ShiftName = keyof typeof SHIFT_TIMINGS
export type ShiftSetting = {
  name: ShiftName
  start: string
  end: string
  lateThresholdMinutes?: number
  absentThresholdMinutes?: number
}

// Defaults mapped from existing SHIFT_TIMINGS with threshold defaults
export const DEFAULT_LATE_MIN = 15
export const DEFAULT_ABSENT_MIN = 60

export const DEFAULT_SHIFTS: ShiftSetting[] = (Object.keys(SHIFT_TIMINGS) as ShiftName[]).map((k) => ({
  name: k,
  start: SHIFT_TIMINGS[k].start,
  end: SHIFT_TIMINGS[k].end,
  lateThresholdMinutes: DEFAULT_LATE_MIN,
  absentThresholdMinutes: DEFAULT_ABSENT_MIN,
}))

const TIME_24H = /^([01]\d|2[0-3]):([0-5]\d)$/

export function validateShiftSettings(shifts: ShiftSetting[]): string[] {
  const errors: string[] = []
  const names = new Set<ShiftName>()
  for (const s of shifts) {
    if (!s?.name) errors.push("Shift name missing")
    if (!TIME_24H.test(s.start)) errors.push(`${s.name}: invalid start time`)
    if (!TIME_24H.test(s.end)) errors.push(`${s.name}: invalid end time`)
    const late = Number(s.lateThresholdMinutes ?? DEFAULT_LATE_MIN)
    const absent = Number(s.absentThresholdMinutes ?? DEFAULT_ABSENT_MIN)
    if (!Number.isFinite(late) || late < 0 || late > 480) errors.push(`${s.name}: invalid late threshold`)
    if (!Number.isFinite(absent) || absent < 0 || absent > 720) errors.push(`${s.name}: invalid absent threshold`)
    names.add(s.name)
  }
  const expected = new Set(Object.keys(SHIFT_TIMINGS) as ShiftName[])
  if (names.size !== expected.size || [...names].some((n) => !expected.has(n))) {
    errors.push("Shifts must include exactly Morning, Evening, and Night")
  }
  return errors
}

export type RuntimeShiftTiming = {
  start: string
  end: string
  lateAfter: string
  attendanceWindow: string
  name: string
}
export type RuntimeTimings = Record<ShiftName, RuntimeShiftTiming>

function addMinutesToHHMM(hhmm: string, minutesToAdd: number): string {
  const [h, m] = hhmm.split(":").map(Number)
  const total = (((h * 60 + m + minutesToAdd) % (24 * 60)) + 24 * 60) % (24 * 60)
  const nh = Math.floor(total / 60)
  const nm = total % 60
  return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`
}

export function buildRuntimeTimings(shifts: ShiftSetting[]): RuntimeTimings {
  const byName = new Map<ShiftName, ShiftSetting>()
  for (const s of shifts) byName.set(s.name, s)

  const ensure = (name: ShiftName): ShiftSetting => {
    const s = byName.get(name)
    return {
      name,
      start: s?.start ?? DEFAULT_SHIFTS.find((d) => d.name === name)!.start,
      end: s?.end ?? DEFAULT_SHIFTS.find((d) => d.name === name)!.end,
      lateThresholdMinutes: s?.lateThresholdMinutes ?? DEFAULT_LATE_MIN,
      absentThresholdMinutes: s?.absentThresholdMinutes ?? DEFAULT_ABSENT_MIN,
    }
  }

  const toRuntime = (s: ShiftSetting): RuntimeShiftTiming => ({
    start: s.start,
    end: s.end,
    lateAfter: addMinutesToHHMM(s.start, s.lateThresholdMinutes ?? DEFAULT_LATE_MIN),
    // We treat absent threshold as the attendance window close (auto-absent when window closes)
    attendanceWindow: addMinutesToHHMM(s.start, s.absentThresholdMinutes ?? DEFAULT_ABSENT_MIN),
    name: `${s.name} Shift`,
  })

  return {
    Morning: toRuntime(ensure("Morning")),
    Evening: toRuntime(ensure("Evening")),
    Night: toRuntime(ensure("Night")),
  }
}

function getCurrentTimeInTimezoneTZ(timezone = "Asia/Kolkata"): string {
  const now = new Date()
  return now.toLocaleTimeString("en-GB", { timeZone: timezone, hour12: false, hour: "2-digit", minute: "2-digit" })
}

export function canMarkAttendanceDuringShiftWithTimezoneRuntime(
  personShift: ShiftName,
  timings: RuntimeTimings,
  timezone = "Asia/Kolkata",
): boolean {
  const currentTime = getCurrentTimeInTimezoneTZ(timezone)
  const t = timings[personShift]
  if (personShift === "Night") {
    // Night spans midnight (22:00..06:00)
    return currentTime >= t.start || currentTime <= t.end
  }
  return currentTime >= t.start && currentTime <= t.end
}

export function getAttendanceStatusWithTimezoneRuntime(
  shift: ShiftName,
  timings: RuntimeTimings,
  timezone = "Asia/Kolkata",
): "present" | "late" | "absent" | "early" | "window_closed" {
  const currentTime = getCurrentTimeInTimezoneTZ(timezone)
  const t = timings[shift]

  // Window closed
  if (shift === "Night") {
    // Close when hour >= 05 and < 22 in local TZ
    const now = new Date()
    const hour = Number(now.toLocaleTimeString("en-GB", { timeZone: timezone, hour12: false, hour: "2-digit" }))
    if (hour >= 5 && hour < 22) return "window_closed"
  } else if (currentTime >= t.attendanceWindow) {
    return "window_closed"
  }

  // Early (before start)
  if (shift === "Night") {
    const now = new Date()
    const hour = Number(now.toLocaleTimeString("en-GB", { timeZone: timezone, hour12: false, hour: "2-digit" }))
    if (hour < 22 && hour >= 6) return "early"
  } else if (currentTime < t.start) {
    return "early"
  }

  // Present/Late window
  if (shift === "Night") {
    if (currentTime >= t.start || currentTime <= t.lateAfter) return "present"
    if (currentTime <= t.end) return "late"
  } else {
    if (currentTime >= t.start && currentTime <= t.lateAfter) return "present"
    if (currentTime > t.lateAfter && currentTime <= t.end) return "late"
  }

  return "absent"
}

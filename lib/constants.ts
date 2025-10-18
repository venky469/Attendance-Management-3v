
// export const DEPARTMENTS = ["Engineering", "HR", "Finance", "Operations", "Academics"] as const
// export const ROLES = ["SuperAdmin", "Admin", "Manager", "Staff", "Teacher", "Student"] as const
// export const SHIFTS = ["Morning", "Evening", "Night"] as const
// export const CLASS_LEVELS = [
//   "LKG",
//   "UKG",
//   "Class 1",
//   "Class 2",
//   "Class 3",
//   "Class 4",
//   "Class 5",
//   "Class 6",
//   "Class 7",
//   "Class 8",
//   "Class 9",
//   "Class 10",
//   "Class 11",
//   "Class 12",
//   "UG",
//   "PG",
// ] as const

// export const SHIFT_TIMINGS = {
//   Morning: {
//     start: "09:00",
//     end: "18:00",
//     lateAfter: "10:20",
//     attendanceWindow: "13:00", // Can mark attendance until 1 PM
//     name: "Morning Shift",
//   },
//   Evening: {
//     start: "14:00",
//     end: "22:00",
//     lateAfter: "15:20",
//     attendanceWindow: "21:00", // Can mark attendance until 9 PM
//     name: "Evening Shift",
//   },
//   Night: {
//     start: "22:00",
//     end: "06:00",
//     lateAfter: "23:20",
//     attendanceWindow: "05:00", // Can mark attendance until 5 AM
//     name: "Night Shift",
//   },
// } as const

// export const ABSENT_THRESHOLDS = {
//   Morning: "13:30", // Auto-absent after 1:30 PM
//   Evening: "21:30", // Auto-absent after 9:30 PM
//   Night: "05:30", // Auto-absent after 5:30 AM
// } as const

// export function todayStr() {
//   return new Date().toISOString().slice(0, 10)
// }

// export function getCurrentShift(): keyof typeof SHIFT_TIMINGS | null {
//   const now = new Date()
//   const currentTime = now.toTimeString().slice(0, 5) // HH:MM format

//   // Check each shift timing
//   for (const [shiftName, timing] of Object.entries(SHIFT_TIMINGS)) {
//     if (shiftName === "Night") {
//       // Night shift spans midnight
//       if (currentTime >= timing.start || currentTime <= timing.end) {
//         return shiftName as keyof typeof SHIFT_TIMINGS
//       }
//     } else {
//       if (currentTime >= timing.start && currentTime <= timing.end) {
//         return shiftName as keyof typeof SHIFT_TIMINGS
//       }
//     }
//   }
//   return null
// }

// export function getAttendanceStatus(
//   shift: keyof typeof SHIFT_TIMINGS,
// ): "present" | "late" | "absent" | "early" | "window_closed" {
//   const now = new Date()
//   const currentTime = now.toTimeString().slice(0, 5)
//   const timing = SHIFT_TIMINGS[shift]

//   // Check if attendance window is closed
//   if (shift === "Night") {
//     // Night shift window closes at 5 AM
//     const currentHour = now.getHours()
//     if (currentHour >= 5 && currentHour < 22) {
//       return "window_closed"
//     }
//   } else {
//     // Day/Evening shifts
//     if (currentTime >= timing.attendanceWindow) {
//       return "window_closed"
//     }
//   }

//   // Check if it's before shift start time (early arrival)
//   if (shift === "Night") {
//     // Night shift starts at 22:00
//     const currentHour = now.getHours()
//     if (currentHour < 22 && currentHour >= 6) {
//       return "early"
//     }
//   } else {
//     if (currentTime < timing.start) {
//       return "early"
//     }
//   }

//   // Normal attendance logic
//   if (shift === "Night") {
//     // Night shift logic
//     if (currentTime >= timing.start || currentTime <= timing.lateAfter) {
//       return "present"
//     } else if (currentTime <= timing.end) {
//       return "late"
//     }
//   } else {
//     // Day/Evening shift logic
//     if (currentTime >= timing.start && currentTime <= timing.lateAfter) {
//       return "present"
//     } else if (currentTime > timing.lateAfter && currentTime <= timing.end) {
//       return "late"
//     }
//   }
//   return "absent"
// }

// export function shouldMarkAbsent(shift: keyof typeof SHIFT_TIMINGS): boolean {
//   const now = new Date()
//   const currentTime = now.toTimeString().slice(0, 5)
//   const absentThreshold = ABSENT_THRESHOLDS[shift]

//   if (shift === "Night") {
//     // Night shift spans midnight - check if past 5:30 AM
//     const currentHour = now.getHours()
//     const currentMinute = now.getMinutes()
//     if (currentHour === 5 && currentMinute >= 30) {
//       return true
//     }
//   } else {
//     // Day/Evening shifts
//     if (currentTime >= absentThreshold) {
//       return true
//     }
//   }
//   return false
// }

// export function getAutoAttendanceStatus(shift: keyof typeof SHIFT_TIMINGS): "present" | "late" | "absent" {
//   // First check if should be marked absent
//   if (shouldMarkAbsent(shift)) {
//     return "absent"
//   }

//   // Otherwise use existing logic
//   const status = getAttendanceStatus(shift)
//   if (status === "present" || status === "late") {
//     return status
//   }
//   return "absent"
// }

// export function canMarkAttendanceDuringShift(personShift: keyof typeof SHIFT_TIMINGS): boolean {
//   const now = new Date()
//   const currentTime = now.toTimeString().slice(0, 5) // HH:MM format
//   const timing = SHIFT_TIMINGS[personShift]

//   if (personShift === "Night") {
//     // Night shift spans midnight (22:00 to 06:00)
//     return currentTime >= timing.start || currentTime <= timing.end
//   } else {
//     // Day/Evening shifts
//     return currentTime >= timing.start && currentTime <= timing.end
//   }
// }

// export function getTimeUntilShiftStarts(personShift: keyof typeof SHIFT_TIMINGS): string | null {
//   const now = new Date()
//   const currentTime = now.toTimeString().slice(0, 5)
//   const timing = SHIFT_TIMINGS[personShift]

//   // Parse times
//   const [currentHour, currentMinute] = currentTime.split(":").map(Number)
//   const [shiftHour, shiftMinute] = timing.start.split(":").map(Number)

//   const currentTotalMinutes = currentHour * 60 + currentMinute
//   let shiftTotalMinutes = shiftHour * 60 + shiftMinute

//   // Handle night shift crossing midnight
//   if (personShift === "Night" && currentHour < 22) {
//     shiftTotalMinutes = 22 * 60 // 22:00 in minutes
//   }

//   if (currentTotalMinutes < shiftTotalMinutes) {
//     const waitMinutes = shiftTotalMinutes - currentTotalMinutes
//     const hours = Math.floor(waitMinutes / 60)
//     const minutes = waitMinutes % 60

//     if (hours > 0) {
//       return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`
//     } else {
//       return `${minutes} minute${minutes !== 1 ? "s" : ""}`
//     }
//   }

//   return null
// }

// export function getDelayTime(shift: keyof typeof SHIFT_TIMINGS): { hours: number; minutes: number } | null {
//   const now = new Date()
//   const currentTime = now.toTimeString().slice(0, 5)
//   const timing = SHIFT_TIMINGS[shift]

//   // Parse current time and late threshold
//   const [currentHour, currentMinute] = currentTime.split(":").map(Number)
//   const [lateHour, lateMinute] = timing.lateAfter.split(":").map(Number)

//   const currentTotalMinutes = currentHour * 60 + currentMinute
//   const lateTotalMinutes = lateHour * 60 + lateMinute

//   if (currentTotalMinutes > lateTotalMinutes) {
//     const delayMinutes = currentTotalMinutes - lateTotalMinutes
//     return {
//       hours: Math.floor(delayMinutes / 60),
//       minutes: delayMinutes % 60,
//     }
//   }

//   return null
// }

// export function getCountdownToShift(personShift: keyof typeof SHIFT_TIMINGS): string | null {
//   const now = new Date()
//   const currentTime = now.toTimeString().slice(0, 5)
//   const timing = SHIFT_TIMINGS[personShift]

//   // Parse times
//   const [currentHour, currentMinute] = currentTime.split(":").map(Number)
//   const [shiftHour, shiftMinute] = timing.start.split(":").map(Number)

//   const currentTotalMinutes = currentHour * 60 + currentMinute
//   let shiftTotalMinutes = shiftHour * 60 + shiftMinute

//   // Handle night shift crossing midnight
//   if (personShift === "Night" && currentHour < 22) {
//     shiftTotalMinutes = 22 * 60 // 22:00 in minutes
//   }

//   if (currentTotalMinutes < shiftTotalMinutes) {
//     const waitMinutes = shiftTotalMinutes - currentTotalMinutes
//     const hours = Math.floor(waitMinutes / 60)
//     const minutes = waitMinutes % 60

//     if (hours > 0) {
//       return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`
//     } else {
//       return `${minutes} minute${minutes !== 1 ? "s" : ""}`
//     }
//   }

//   return null
// }

// export function getCurrentTimeInTimezone(timezone = "Asia/Kolkata"): string {
//   const now = new Date()
//   return now.toLocaleTimeString("en-GB", {
//     timeZone: timezone,
//     hour12: false,
//     hour: "2-digit",
//     minute: "2-digit",
//   })
// }

// export function getCurrentShiftWithTimezone(timezone = "Asia/Kolkata"): keyof typeof SHIFT_TIMINGS | null {
//   const currentTime = getCurrentTimeInTimezone(timezone)

//   // Check each shift timing
//   for (const [shiftName, timing] of Object.entries(SHIFT_TIMINGS)) {
//     if (shiftName === "Night") {
//       // Night shift spans midnight
//       if (currentTime >= timing.start || currentTime <= timing.end) {
//         return shiftName as keyof typeof SHIFT_TIMINGS
//       }
//     } else {
//       if (currentTime >= timing.start && currentTime <= timing.end) {
//         return shiftName as keyof typeof SHIFT_TIMINGS
//       }
//     }
//   }
//   return null
// }

// export function getAttendanceStatusWithTimezone(
//   shift: keyof typeof SHIFT_TIMINGS,
//   timezone = "Asia/Kolkata",
// ): "present" | "late" | "absent" | "early" | "window_closed" {
//   const currentTime = getCurrentTimeInTimezone(timezone)
//   const timing = SHIFT_TIMINGS[shift]

//   // Check if attendance window is closed
//   if (shift === "Night") {
//     // Night shift window closes at 5 AM
//     const now = new Date()
//     const currentHour = Number.parseInt(
//       now.toLocaleTimeString("en-GB", {
//         timeZone: timezone,
//         hour12: false,
//         hour: "2-digit",
//       }),
//     )
//     if (currentHour >= 5 && currentHour < 22) {
//       return "window_closed"
//     }
//   } else {
//     // Day/Evening shifts
//     if (currentTime >= timing.attendanceWindow) {
//       return "window_closed"
//     }
//   }

//   // Check if it's before shift start time (early arrival)
//   if (shift === "Night") {
//     // Night shift starts at 22:00
//     const now = new Date()
//     const currentHour = Number.parseInt(
//       now.toLocaleTimeString("en-GB", {
//         timeZone: timezone,
//         hour12: false,
//         hour: "2-digit",
//       }),
//     )
//     if (currentHour < 22 && currentHour >= 6) {
//       return "early"
//     }
//   } else {
//     if (currentTime < timing.start) {
//       return "early"
//     }
//   }

//   // Normal attendance logic
//   if (shift === "Night") {
//     // Night shift logic
//     if (currentTime >= timing.start || currentTime <= timing.lateAfter) {
//       return "present"
//     } else if (currentTime <= timing.end) {
//       return "late"
//     }
//   } else {
//     // Day/Evening shift logic
//     if (currentTime >= timing.start && currentTime <= timing.lateAfter) {
//       return "present"
//     } else if (currentTime > timing.lateAfter && currentTime <= timing.end) {
//       return "late"
//     }
//   }
//   return "absent"
// }

// export function canMarkAttendanceDuringShiftWithTimezone(
//   personShift: keyof typeof SHIFT_TIMINGS,
//   timezone = "Asia/Kolkata",
// ): boolean {
//   const currentTime = getCurrentTimeInTimezone(timezone)
//   const timing = SHIFT_TIMINGS[personShift]

//   if (personShift === "Night") {
//     // Night shift spans midnight (22:00 to 06:00)
//     return currentTime >= timing.start || currentTime <= timing.end
//   } else {
//     // Day/Evening shifts
//     return currentTime >= timing.start && currentTime <= timing.end
//   }
// }

// export function getTimeUntilShiftStartsWithTimezone(
//   personShift: keyof typeof SHIFT_TIMINGS,
//   timezone = "Asia/Kolkata",
// ): string | null {
//   const timing = SHIFT_TIMINGS[personShift]

//   if (canMarkAttendanceDuringShiftWithTimezone(personShift, timezone)) {
//     return null // Already in shift time
//   }

//   return `Attendance can be marked from ${timing.start} (${timing.name})`
// }




export const DEPARTMENTS = ["Engineering", "HR", "Finance", "Operations", "Academics"] as const
export const ROLES = ["SuperAdmin", "Admin", "Manager", "Staff", "Teacher", "Student"] as const
export const SHIFTS = ["Morning", "Evening", "Night"] as const
export const CLASS_LEVELS = [
  "LKG",
  "UKG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "UG",
  "PG",
] as const

export const SHIFT_TIMINGS = {
  Morning: {
    start: "09:00",
    end: "23:00",
    lateAfter: "23:00",
    attendanceWindow: "23:30", // Can mark attendance until 1:30 PM
    name: "Morning Shift",
  },
  Evening: {
    start: "14:00",
    end: "22:00",
    lateAfter: "21:20",
    attendanceWindow: "22:00", // Can mark attendance until 9 PM
    name: "Evening Shift",
  },
  Night: {
    start: "22:00",
    end: "06:00",
    lateAfter: "23:20",
    attendanceWindow: "05:00", // Can mark attendance until 5 AM
    name: "Night Shift",
  },
} as const

export const ABSENT_THRESHOLDS = {
  Morning: "22:30", // Auto-absent after 1:30 PM
  Evening: "22:30", // Auto-absent after 9:30 PM
  Night: "09:30", // Auto-absent after 5:30 AM
} as const

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function getCurrentShift(): keyof typeof SHIFT_TIMINGS | null {
  const now = new Date()
  const currentTime = now.toTimeString().slice(0, 5) // HH:MM format

  // Check each shift timing
  for (const [shiftName, timing] of Object.entries(SHIFT_TIMINGS)) {
    if (shiftName === "Night") {
      // Night shift spans midnight
      if (currentTime >= timing.start || currentTime <= timing.end) {
        return shiftName as keyof typeof SHIFT_TIMINGS
      }
    } else {
      if (currentTime >= timing.start && currentTime <= timing.end) {
        return shiftName as keyof typeof SHIFT_TIMINGS
      }
    }
  }
  return null
}

export function getAttendanceStatus(
  shift: keyof typeof SHIFT_TIMINGS,
): "present" | "late" | "absent" | "early" | "window_closed" {
  const now = new Date()
  const currentTime = now.toTimeString().slice(0, 5)
  const timing = SHIFT_TIMINGS[shift]

  // Check if attendance window is closed
  if (shift === "Night") {
    // Night shift window closes at 5 AM
    const currentHour = now.getHours()
    if (currentHour >= 5 && currentHour < 22) {
      return "window_closed"
    }
  } else {
    // Day/Evening shifts
    if (currentTime >= timing.attendanceWindow) {
      return "window_closed"
    }
  }

  // Check if it's before shift start time (early arrival)
  if (shift === "Night") {
    // Night shift starts at 22:00
    const currentHour = now.getHours()
    if (currentHour < 22 && currentHour >= 6) {
      return "early"
    }
  } else {
    if (currentTime < timing.start) {
      return "early"
    }
  }

  // Normal attendance logic
  if (shift === "Night") {
    // Night shift logic
    if (currentTime >= timing.start || currentTime <= timing.lateAfter) {
      return "present"
    } else if (currentTime <= timing.end) {
      return "late"
    }
  } else {
    // Day/Evening shift logic
    if (currentTime >= timing.start && currentTime <= timing.lateAfter) {
      return "present"
    } else if (currentTime > timing.lateAfter && currentTime <= timing.end) {
      return "late"
    }
  }
  return "absent"
}

export function shouldMarkAbsent(shift: keyof typeof SHIFT_TIMINGS): boolean {
  const now = new Date()
  const currentTime = now.toTimeString().slice(0, 5)
  const absentThreshold = ABSENT_THRESHOLDS[shift]

  if (shift === "Night") {
    // Night shift spans midnight - check if past 5:30 AM
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    if (currentHour === 5 && currentMinute >= 30) {
      return true
    }
  } else {
    // Day/Evening shifts
    if (currentTime >= absentThreshold) {
      return true
    }
  }
  return false
}

export function getAutoAttendanceStatus(shift: keyof typeof SHIFT_TIMINGS): "present" | "late" | "absent" {
  // First check if should be marked absent
  if (shouldMarkAbsent(shift)) {
    return "absent"
  }

  // Otherwise use existing logic
  return getAttendanceStatus(shift)
}

export function canMarkAttendanceDuringShift(personShift: keyof typeof SHIFT_TIMINGS): boolean {
  const now = new Date()
  const currentTime = now.toTimeString().slice(0, 5) // HH:MM format
  const timing = SHIFT_TIMINGS[personShift]

  if (personShift === "Night") {
    // Night shift spans midnight (22:00 to 06:00)
    return currentTime >= timing.start || currentTime <= timing.end
  } else {
    // Day/Evening shifts
    return currentTime >= timing.start && currentTime <= timing.end
  }
}

export function getTimeUntilShiftStarts(personShift: keyof typeof SHIFT_TIMINGS): string | null {
  const now = new Date()
  const currentTime = now.toTimeString().slice(0, 5)
  const timing = SHIFT_TIMINGS[personShift]

  // Parse times
  const [currentHour, currentMinute] = currentTime.split(":").map(Number)
  const [shiftHour, shiftMinute] = timing.start.split(":").map(Number)

  const currentTotalMinutes = currentHour * 60 + currentMinute
  let shiftTotalMinutes = shiftHour * 60 + shiftMinute

  // Handle night shift crossing midnight
  if (personShift === "Night" && currentHour < 22) {
    shiftTotalMinutes = 22 * 60 // 22:00 in minutes
  }

  if (currentTotalMinutes < shiftTotalMinutes) {
    const waitMinutes = shiftTotalMinutes - currentTotalMinutes
    const hours = Math.floor(waitMinutes / 60)
    const minutes = waitMinutes % 60

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`
    } else {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`
    }
  }

  return null
}

export function getDelayTime(shift: keyof typeof SHIFT_TIMINGS): { hours: number; minutes: number } | null {
  const now = new Date()
  const currentTime = now.toTimeString().slice(0, 5)
  const timing = SHIFT_TIMINGS[shift]

  // Parse current time and late threshold
  const [currentHour, currentMinute] = currentTime.split(":").map(Number)
  const [lateHour, lateMinute] = timing.lateAfter.split(":").map(Number)

  const currentTotalMinutes = currentHour * 60 + currentMinute
  const lateTotalMinutes = lateHour * 60 + lateMinute

  if (currentTotalMinutes > lateTotalMinutes) {
    const delayMinutes = currentTotalMinutes - lateTotalMinutes
    return {
      hours: Math.floor(delayMinutes / 60),
      minutes: delayMinutes % 60,
    }
  }

  return null
}

export function getCountdownToShift(personShift: keyof typeof SHIFT_TIMINGS): string | null {
  const now = new Date()
  const currentTime = now.toTimeString().slice(0, 5)
  const timing = SHIFT_TIMINGS[personShift]

  // Parse times
  const [currentHour, currentMinute] = currentTime.split(":").map(Number)
  const [shiftHour, shiftMinute] = timing.start.split(":").map(Number)

  const currentTotalMinutes = currentHour * 60 + currentMinute
  let shiftTotalMinutes = shiftHour * 60 + shiftMinute

  // Handle night shift crossing midnight
  if (personShift === "Night" && currentHour < 22) {
    shiftTotalMinutes = 22 * 60 // 22:00 in minutes
  }

  if (currentTotalMinutes < shiftTotalMinutes) {
    const waitMinutes = shiftTotalMinutes - currentTotalMinutes
    const hours = Math.floor(waitMinutes / 60)
    const minutes = waitMinutes % 60

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`
    } else {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`
    }
  }

  return null
}

export function getCurrentTimeInTimezone(timezone = "Asia/Kolkata"): string {
  const now = new Date()
  return now.toLocaleTimeString("en-GB", {
    timeZone: timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getCurrentShiftWithTimezone(timezone = "Asia/Kolkata"): keyof typeof SHIFT_TIMINGS | null {
  const currentTime = getCurrentTimeInTimezone(timezone)

  // Check each shift timing
  for (const [shiftName, timing] of Object.entries(SHIFT_TIMINGS)) {
    if (shiftName === "Night") {
      // Night shift spans midnight
      if (currentTime >= timing.start || currentTime <= timing.end) {
        return shiftName as keyof typeof SHIFT_TIMINGS
      }
    } else {
      if (currentTime >= timing.start && currentTime <= timing.end) {
        return shiftName as keyof typeof SHIFT_TIMINGS
      }
    }
  }
  return null
}

export function getAttendanceStatusWithTimezone(
  shift: keyof typeof SHIFT_TIMINGS,
  timezone = "Asia/Kolkata",
): "present" | "late" | "absent" | "early" | "window_closed" {
  const currentTime = getCurrentTimeInTimezone(timezone)
  const timing = SHIFT_TIMINGS[shift]

  // Check if attendance window is closed
  if (shift === "Night") {
    // Night shift window closes at 5 AM
    const now = new Date()
    const currentHour = Number.parseInt(
      now.toLocaleTimeString("en-GB", {
        timeZone: timezone,
        hour12: false,
        hour: "2-digit",
      }),
    )
    if (currentHour >= 5 && currentHour < 22) {
      return "window_closed"
    }
  } else {
    // Day/Evening shifts
    if (currentTime >= timing.attendanceWindow) {
      return "window_closed"
    }
  }

  // Check if it's before shift start time (early arrival)
  if (shift === "Night") {
    // Night shift starts at 22:00
    const now = new Date()
    const currentHour = Number.parseInt(
      now.toLocaleTimeString("en-GB", {
        timeZone: timezone,
        hour12: false,
        hour: "2-digit",
      }),
    )
    if (currentHour < 22 && currentHour >= 6) {
      return "early"
    }
  } else {
    if (currentTime < timing.start) {
      return "early"
    }
  }

  // Normal attendance logic
  if (shift === "Night") {
    // Night shift logic
    if (currentTime >= timing.start || currentTime <= timing.lateAfter) {
      return "present"
    } else if (currentTime <= timing.end) {
      return "late"
    }
  } else {
    // Day/Evening shift logic
    if (currentTime >= timing.start && currentTime <= timing.lateAfter) {
      return "present"
    } else if (currentTime > timing.lateAfter && currentTime <= timing.end) {
      return "late"
    }
  }
  return "absent"
}

export function canMarkAttendanceDuringShiftWithTimezone(
  personShift: keyof typeof SHIFT_TIMINGS,
  timezone = "Asia/Kolkata",
): boolean {
  const currentTime = getCurrentTimeInTimezone(timezone)
  const timing = SHIFT_TIMINGS[personShift]

  if (personShift === "Night") {
    // Night shift spans midnight (22:00 to 06:00)
    return currentTime >= timing.start || currentTime <= timing.end
  } else {
    // Day/Evening shifts
    return currentTime >= timing.start && currentTime <= timing.end
  }
}

export function getTimeUntilShiftStartsWithTimezone(
  personShift: keyof typeof SHIFT_TIMINGS,
  timezone = "Asia/Kolkata",
): string | null {
  const timing = SHIFT_TIMINGS[personShift]

  if (canMarkAttendanceDuringShiftWithTimezone(personShift, timezone)) {
    return null // Already in shift time
  }

  return `Attendance can be marked from ${timing.start} (${timing.name})`
}

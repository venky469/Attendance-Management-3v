// Helper function to calculate working days between dates
export function calculateWorkingDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  let workingDays = 0

  const currentDate = new Date(start)
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay()
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return workingDays
}

// Helper function to validate leave request dates
export function validateLeaveDates(startDate: string, endDate: string): { valid: boolean; error?: string } {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (start < today) {
    return { valid: false, error: "Start date cannot be in the past" }
  }

  if (end < start) {
    return { valid: false, error: "End date cannot be before start date" }
  }

  return { valid: true }
}

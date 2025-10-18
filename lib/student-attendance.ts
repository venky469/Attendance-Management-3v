// export type StudentAttendanceStats = {
//   totalDays: number
//   presentDays: number
//   absentDays: number
//   lateDays: number
//   attendancePercentage: number
// }

// export type StudentAttendanceResponse = {
//   records: any[]
//   stats: StudentAttendanceStats
// }

// export async function getStudentAttendance(studentId: string): Promise<StudentAttendanceResponse> {
//   if (!studentId) {
//     throw new Error("Missing studentId")
//   }

//   const res = await fetch(`/api/students/${encodeURIComponent(studentId)}/attendance`, {
//     cache: "no-store",
//   })

//   if (!res.ok) {
//     // If the API returns an error payload, surface it; otherwise throw generic
//     try {
//       const err = await res.json()
//       throw new Error(err?.error || `Failed to fetch attendance (${res.status})`)
//     } catch {
//       throw new Error(`Failed to fetch attendance (${res.status})`)
//     }
//   }

//   const data = (await res.json()) as StudentAttendanceResponse
//   // Basic shape validation
//   if (!data || typeof data !== "object" || !("records" in data) || !("stats" in data)) {
//     throw new Error("Invalid attendance response")
//   }
//   return data
// }

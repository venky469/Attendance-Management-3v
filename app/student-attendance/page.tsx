// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import useSWR from "swr"
// import { getStoredUser } from "@/lib/auth"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import StudentDashboardWidgets from "@/components/student-dashboard-widgets"
// import { AlertCircle } from "lucide-react"
// import { AttendanceCalendar } from "@/components/attendance-calendar"
// import { realtimeClient } from "@/lib/realtime-client"

// const fetcher = (url: string) =>
//   fetch(url)
//     .then((r) => {
//       if (r.status === 503) {
//         return r.json().then((data) => {
//           if (data.offline) {
//             throw new Error("You are currently offline")
//           }
//           return data
//         })
//       }
//       return r.json()
//     })
//     .catch((err) => {
//       if (err.message.includes("offline") || err.message.includes("Failed to fetch")) {
//         throw new Error("Network unavailable. Please check your connection.")
//       }
//       throw err
//     })

// export default function StudentAttendancePage() {
//   const [user, setUser] = useState(null)
//   const router = useRouter()

//   useEffect(() => {
//     const storedUser = getStoredUser()
//     if (!storedUser) {
//       router.push("/login")
//       return
//     }
//     if (storedUser.role !== "Student") {
//       router.push("/")
//       return
//     }
//     setUser(storedUser)
//   }, [router])

//   const {
//     data: attendanceData,
//     error,
//     mutate,
//   } = useSWR(user ? `/api/students/${user.id}/attendance` : null, fetcher, {
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//     refreshInterval: 600000, // Background refresh every 10 minutes
//   })

//   useEffect(() => {
//     if (!user) return

//     let reconnectTimeout: NodeJS.Timeout | null = null

//     const onAttendanceUpdate = (evt: any) => {
//       if (evt?.personType === "student" && evt?.personId === user.id) {
//         mutate()
//       }
//     }

//     const onConnRestore = () => {
//       if (reconnectTimeout) clearTimeout(reconnectTimeout)
//       reconnectTimeout = setTimeout(() => {
//         console.log("[v0] Connection restored - data will refresh in background")
//         mutate()
//       }, 2000) // Wait 2 seconds
//     }

//     realtimeClient.on("attendance_update", onAttendanceUpdate)
//     realtimeClient.on("connection_restored", onConnRestore)
//     realtimeClient.connect()

//     return () => {
//       if (reconnectTimeout) clearTimeout(reconnectTimeout)
//       realtimeClient.off("attendance_update", onAttendanceUpdate)
//       realtimeClient.off("connection_restored", onConnRestore)
//       realtimeClient.disconnect()
//     }
//   }, [user, mutate])

//   if (!user) {
//     return <div>Loading...</div>
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
//         <Alert className="border-red-200 bg-red-50">
//           <AlertCircle className="h-4 w-4 text-red-600" />
//           <AlertDescription className="text-red-800">
//             {error.message || "Failed to load attendance data. Please check your connection and try again."}
//           </AlertDescription>
//         </Alert>
//       </div>
//     )
//   }

//   const normalize = (s: any) => (typeof s === "string" ? s.toLowerCase() : "")
//   const records = attendanceData?.records || []
//   const attendanceDataForCalendar = {
//     present: records.filter((r: any) => {
//       const s = normalize(r.status)
//       return s === "present" || s === "on-time"
//     }),
//     absent: records.filter((r: any) => normalize(r.status) === "absent"),
//     late: records.filter((r: any) => normalize(r.status) === "late"),
//     leave: records.filter((r: any) => normalize(r.status) === "leave"),
//   }

//   const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8 pb-20">
//       <header className="p-6 bg-card rounded-xl border shadow-sm">
//         <div className="space-y-2">
//           <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//             My Attendance
//           </h1>
//           <p className="text-muted-foreground leading-relaxed">
//             Welcome {user.name}! Here's your attendance overview for {currentMonth}.
//           </p>
//         </div>
//       </header>

//       <StudentDashboardWidgets studentId={user.id} />

//       <AttendanceCalendar attendanceData={attendanceDataForCalendar} />
//     </div>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import useSWR from "swr"
import { getStoredUser } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import StudentDashboardWidgets from "@/components/student-dashboard-widgets"
import { AlertCircle } from 'lucide-react'
import { AttendanceCalendar } from "@/components/attendance-calendar"
import { realtimeClient } from "@/lib/realtime-client"
import { ModernLoader } from "@/components/modern-loader"

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

export default function StudentAttendancePage() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = getStoredUser()
    if (!storedUser) {
      router.push("/login")
      return
    }
    if (storedUser.role !== "Student") {
      router.push("/")
      return
    }
    setUser(storedUser)
  }, [router])

  const {
    data: attendanceData,
    error,
    mutate,
    isLoading
  } = useSWR(user ? `/api/students/${user.id}/attendance` : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 600000, // Background refresh every 10 minutes
  })

  useEffect(() => {
    if (!user) return

    let reconnectTimeout: NodeJS.Timeout | null = null

    const onAttendanceUpdate = (evt: any) => {
      if (evt?.personType === "student" && evt?.personId === user.id) {
        mutate()
      }
    }

    const onConnRestore = () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      reconnectTimeout = setTimeout(() => {
        console.log("[v0] Connection restored - data will refresh in background")
        mutate()
      }, 2000) // Wait 2 seconds
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
  }, [user, mutate])

  if (!user) {
    return <ModernLoader message="Loading student profile" fullPage />
  }

  if (isLoading) {
    return <ModernLoader message="Loading your attendance records" fullPage />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error.message || "Failed to load attendance data. Please check your connection and try again."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const normalize = (s: any) => (typeof s === "string" ? s.toLowerCase() : "")
  const records = attendanceData?.records || []
  const attendanceDataForCalendar = {
    present: records.filter((r: any) => {
      const s = normalize(r.status)
      return s === "present" || s === "on-time"
    }),
    absent: records.filter((r: any) => normalize(r.status) === "absent"),
    late: records.filter((r: any) => normalize(r.status) === "late"),
    leave: records.filter((r: any) => normalize(r.status) === "leave"),
  }

  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6 space-y-8 pb-20">
      <header className="p-6 bg-card rounded-xl border shadow-sm">
        <div className="space-y-2">
          <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Attendance
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Welcome {user.name}! Here's your attendance overview for {currentMonth}.
          </p>
        </div>
      </header>

      <StudentDashboardWidgets studentId={user.id} />

      <AttendanceCalendar attendanceData={attendanceDataForCalendar} />
    </div>
  )
}

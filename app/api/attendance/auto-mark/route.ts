// import { type NextRequest, NextResponse } from "next/server"
// import { getDb } from "@/lib/mongo"
// import { shouldMarkAbsent, type SHIFT_TIMINGS, todayStr } from "@/lib/constants"

// export async function POST(request: NextRequest) {
//   try {
//     const db = await getDb()
//     const today = todayStr()
//     const currentTime = new Date()

//     // Get all people (staff and students) who haven't been marked today
//     const existingRecords = await db.collection("attendance").find({ date: today }).toArray()
//     const markedPersonIds = new Set(existingRecords.map((r) => `${r.personId}-${r.personType}`))

//     let markedCount = 0

//     // Check staff
//     const staff = await db.collection("staff").find({}).toArray()
//     for (const person of staff) {
//       const personKey = `${person._id.toString()}-staff`
//       if (markedPersonIds.has(personKey)) continue

//       if (shouldMarkAbsent(person.shift as keyof typeof SHIFT_TIMINGS)) {
//         await db.collection("attendance").insertOne({
//           personId: person._id.toString(),
//           personType: "staff",
//           date: today,
//           status: "absent",
//           timestamp: currentTime.toISOString(),
//           shift: person.shift,
//           department: person.department,
//           role: person.role,
//         })
//         markedCount++
//       }
//     }

//     // Check students
//     const students = await db.collection("students").find({}).toArray()
//     for (const person of students) {
//       const personKey = `${person._id.toString()}-student`
//       if (markedPersonIds.has(personKey)) continue

//       if (shouldMarkAbsent(person.shift as keyof typeof SHIFT_TIMINGS)) {
//         await db.collection("attendance").insertOne({
//           personId: person._id.toString(),
//           personType: "student",
//           date: today,
//           status: "absent",
//           timestamp: currentTime.toISOString(),
//           shift: person.shift,
//           department: person.department,
//           role: person.role,
//         })
//         markedCount++
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       markedAbsent: markedCount,
//       message: `Automatically marked ${markedCount} people as absent`,
//     })
//   } catch (error) {
//     console.error("Auto-mark attendance error:", error)
//     return NextResponse.json({ error: "Failed to auto-mark attendance" }, { status: 500 })
//   }
// }



import { type NextRequest, NextResponse } from "next/server"

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      disabled: true,
      message:
        "Auto-absent is now scheduled-only. Use /api/cron/auto-mark-absent with a scheduler (e.g., Vercel Cron or Upstash QStash) after shift window closes.",
    },
    { status: 410 },
  )
}


import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongo"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {
  try {
    const db = await getDb()
    const { searchParams } = new URL(req.url)
    const personId = searchParams.get("personId")
    const personType = searchParams.get("personType") as "staff" | "student"

    if (!personId || !personType) {
      return new Response("Missing personId or personType", { status: 400 })
    }

    // Get person details
    const personCol = personType === "staff" ? "staff" : "students"
    const person = await db.collection(personCol).findOne({ _id: new ObjectId(personId) })

    if (!person) {
      return new Response("Person not found", { status: 404 })
    }

    // Get attendance history
    const attendanceRecords = await db
      .collection("attendance")
      .find({ personId })
      .sort({ date: -1 })
      .limit(30) // Last 30 days
      .toArray()

    const presentDates = attendanceRecords
      .filter((r) => r.status === "present")
      .map((r) => ({ date: r.date, timestamp: r.timestamp }))

    const absentDates = attendanceRecords
      .filter((r) => r.status === "absent")
      .map((r) => ({ date: r.date, timestamp: r.timestamp }))

    const lateDates = attendanceRecords
      .filter((r) => r.status === "late")
      .map((r) => ({ date: r.date, timestamp: r.timestamp }))

    const leaveDates = attendanceRecords
      .filter((r) => r.status === "leave")
      .map((r) => ({ date: r.date, timestamp: r.timestamp }))

    return Response.json({
      person: {
        ...person,
        id: person._id.toString(),
        name: person.name || person.fullName || person.firstName || "Unknown",
      },
      attendance: {
        present: presentDates,
        absent: absentDates,
        late: lateDates,
        leave: leaveDates, // Include leave dates in response
        total: attendanceRecords.length,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching person details:", error)
    return new Response("Internal server error", { status: 500 })
  }
}


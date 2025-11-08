
import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const student = await db.collection("students").findOne({ _id: new ObjectId(id) })
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const records = await db
      .collection("attendance")
      .find({
        personId: id,
        personType: "student",
        date: {
          $gte: startOfMonth.toISOString().split("T")[0],
          $lte: endOfMonth.toISOString().split("T")[0],
        },
      })
      .sort({ date: -1 })
      .toArray()

    const totalDays = records.length
    const presentDays = records.filter((r) => r.status === "present").length
    const absentDays = records.filter((r) => r.status === "absent").length
    const lateDays = records.filter((r) => r.status === "late").length
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

    const formattedRecords = records.map((record) => ({
      ...record,
      id: record._id.toString(),
      shift: student.shift,
    }))

    return NextResponse.json({
      records: formattedRecords,
      stats: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        attendancePercentage,
      },
    })
  } catch (error) {
    console.error("Error fetching student attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

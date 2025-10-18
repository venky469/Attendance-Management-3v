import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongo"
import { todayStr } from "@/lib/constants"

export async function GET(req: NextRequest) {
  const db = await getDb()
  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date") || todayStr()
  const institutionName = searchParams.get("institutionName") || undefined

  const staffFilter: any = {}
  const studentFilter: any = {}
  if (institutionName) {
    staffFilter.institutionName = institutionName
    studentFilter.institutionName = institutionName
  }

  const [allStaff, allStudents] = await Promise.all([
    db.collection("staff").find(staffFilter).toArray(),
    db.collection("students").find(studentFilter).toArray(),
  ])

  const attendanceRecords = await db.collection("attendance").find({ date }).toArray()
  const attendedPersonIds = new Set(attendanceRecords.map((record) => record.personId))

  const notMarkedStaff = allStaff.filter((person) => !attendedPersonIds.has(person._id.toString()))
  const notMarkedStudents = allStudents.filter((person) => !attendedPersonIds.has(person._id.toString()))

  const notMarkedPeople = [
    ...notMarkedStaff.map((person) => ({
      personId: person._id.toString(),
      personType: "staff" as const,
      personName: person.name || person.fullName || "Unknown",
      imageUrl: person.photoUrl || person.imageUrl || null,
      employeeCode: person.employeeCode,
      department: person.department,
      role: person.role,
      shift: person.shift,
    })),
    ...notMarkedStudents.map((person) => ({
      personId: person._id.toString(),
      personType: "student" as const,
      personName: person.name || person.fullName || person.firstName || "Unknown",
      imageUrl: person.photoUrl || person.imageUrl || null,
      rollNumber: person.rollNumber,
      classLevel: person.classLevel,
      department: person.department,
      role: person.role,
      shift: person.shift,
    })),
  ]

  return Response.json({
    notMarkedPeople,
    count: notMarkedPeople.length,
    date,
  })
}


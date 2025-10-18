import type { NextRequest } from "next/server"
import { getDb, hashPassword, generateEmployeeCode, generateStudentRollNumber } from "@/lib/mongo"

export async function POST(req: NextRequest) {
  try {
    const db = await getDb()
    const body = await req.json()
    const { staff = [], students = [] } = body

    const results = {
      staff: [],
      students: [],
      errors: [],
    }

    for (const staffData of staff) {
      try {
        const employeeCode = await generateEmployeeCode(db)
        const hashedPassword = staffData.password ? await hashPassword(staffData.password) : undefined

        const doc = {
          ...staffData,
          ...(hashedPassword && { password: hashedPassword }),
          employeeCode,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const result = await db.collection("staff").insertOne(doc)
        results.staff.push({
          id: result.insertedId.toString(),
          employeeCode,
          name: staffData.name,
        })
      } catch (error) {
        results.errors.push(`Staff ${staffData.name}: ${error.message}`)
      }
    }

    for (const studentData of students) {
      try {
        const rollNumber = await generateStudentRollNumber(db)
        const hashedPassword = studentData.password ? await hashPassword(studentData.password) : undefined

        const doc = {
          ...studentData,
          ...(hashedPassword && { password: hashedPassword }),
          rollNumber,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const result = await db.collection("students").insertOne(doc)
        results.students.push({
          id: result.insertedId.toString(),
          rollNumber,
          name: studentData.name,
        })
      } catch (error) {
        results.errors.push(`Student ${studentData.name}: ${error.message}`)
      }
    }

    return Response.json({
      success: true,
      message: `Seeded ${results.staff.length} staff and ${results.students.length} students`,
      results,
    })
  } catch (error) {
    console.error("[seed] Failed to seed data:", error)
    return new Response("Failed to seed data", { status: 500 })
  }
}

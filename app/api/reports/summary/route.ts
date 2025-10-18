
import { getDb } from "@/lib/mongo"
import { DEPARTMENTS, ROLES, SHIFTS, todayStr } from "@/lib/constants"
import { NextRequest } from "next/server"

export async function GET(request: Request) {
  const db = await getDb()
  const url = new URL(request.url)
  const institutionName = url.searchParams.get("institutionName") || undefined

  const date = todayStr()

  let personIdFilter: string[] | null = null
  if (institutionName) {
    const [instStaff, instStudents] = await Promise.all([
      db.collection("staff").find({ institutionName }).project({ _id: 1 }).toArray(),
      db.collection("students").find({ institutionName }).project({ _id: 1 }).toArray(),
    ])
    personIdFilter = [...instStaff, ...instStudents].map((d) => d._id.toString())
  }

  const todayQuery: any = { date }
  if (personIdFilter) todayQuery.personId = { $in: personIdFilter }
  const todayRecords = await db.collection("attendance").find(todayQuery).toArray()

  const todayPresent = todayRecords.filter((r: any) => r.status === "present").length
  const todayAbsent = todayRecords.filter((r: any) => r.status === "absent").length
  const todayLeave = todayRecords.filter((r: any) => r.status === "leave").length

  function countBy(items: any[], key: "department" | "role" | "shift") {
    const map: Record<string, { present: number; absent: number; leave: number }> = {}
    items.forEach((r) => {
      const k = r[key] || "Unknown"
      map[k] ||= { present: 0, absent: 0, leave: 0 }
      if (r.status === "present") map[k].present++
      else if (r.status === "absent") map[k].absent++
      else if (r.status === "leave") map[k].leave++
    })
    return map
  }

  const depMap = countBy(todayRecords, "department")
  const roleMap = countBy(todayRecords, "role")
  const shiftMap = countBy(todayRecords, "shift")

  const byDepartment = DEPARTMENTS.map((d) => ({ name: d, ...(depMap[d] || { present: 0, absent: 0, leave: 0 }) }))
  const byRole = ROLES.map((r) => ({ name: r, ...(roleMap[r] || { present: 0, absent: 0, leave: 0 }) }))
  const byShift = SHIFTS.map((s) => ({ name: s, ...(shiftMap[s] || { present: 0, absent: 0, leave: 0 }) }))

  // last 7 days scoped
  const last7Days: Array<{ date: string; present: number; absent: number; leave: number }> = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().slice(0, 10)
    const q: any = { date: ds }
    if (personIdFilter) q.personId = { $in: personIdFilter }
    const day = await db.collection("attendance").find(q).toArray()
    last7Days.push({
      date: ds,
      present: day.filter((r: any) => r.status === "present").length,
      absent: day.filter((r: any) => r.status === "absent").length,
      leave: day.filter((r: any) => r.status === "leave").length,
    })
  }

  const staffFilter: any = institutionName ? { institutionName } : {}
  const studentFilter: any = institutionName ? { institutionName } : {}
  const [staffCount, studentCount] = await Promise.all([
    db.collection("staff").countDocuments(staffFilter),
    db.collection("students").countDocuments(studentFilter),
  ])

  return Response.json({
    todayPresent,
    todayAbsent,
    todayLeave,
    byDepartment,
    byRole,
    byShift,
    last7Days,
    totalPeople: staffCount + studentCount,
  })
}

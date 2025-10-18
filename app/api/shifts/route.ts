// import { type NextRequest, NextResponse } from "next/server"
// import { getDb } from "@/lib/mongo"
// import { DEFAULT_SHIFTS, validateShiftSettings, type ShiftSetting } from "@/lib/shift-settings"

// type ShiftDoc = {
//   institutionName: string
//   shifts: ShiftSetting[]
//   updatedAt: string
//   updatedByRole?: string
// }

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const institutionName = searchParams.get("institutionName")
//     if (!institutionName) {
//       return NextResponse.json({ shifts: DEFAULT_SHIFTS }, { status: 200 })
//     }
//     const db = await getDb()
//     const doc = (await db.collection<ShiftDoc>("shift_settings").findOne({ institutionName })) || null
//     if (!doc) {
//       return NextResponse.json({ shifts: DEFAULT_SHIFTS }, { status: 200 })
//     }
//     return NextResponse.json({ shifts: doc.shifts }, { status: 200 })
//   } catch {
//     return NextResponse.json({ error: "Failed to load shifts" }, { status: 500 })
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const body = (await req.json()) as {
//       institutionName: string
//       shifts: ShiftSetting[]
//       userRole?: string
//     }
//     if (!body?.institutionName) {
//       return NextResponse.json({ error: "institutionName required" }, { status: 400 })
//     }
//     // Only Admin or SuperAdmin may update
//     const role = (body.userRole || "").toLowerCase()
//     if (!(role === "admin" || role === "superadmin" || role === "super-admin")) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 })
//     }
//     const errors = validateShiftSettings(body.shifts || [])
//     if (errors.length) {
//       return NextResponse.json({ error: errors.join(", ") }, { status: 400 })
//     }
//     const db = await getDb()
//     await db.collection<ShiftDoc>("shift_settings").updateOne(
//       { institutionName: body.institutionName },
//       {
//         $set: {
//           institutionName: body.institutionName,
//           shifts: body.shifts,
//           updatedAt: new Date().toISOString(),
//           updatedByRole: role,
//         },
//       },
//       { upsert: true },
//     )
//     return NextResponse.json({ ok: true }, { status: 200 })
//   } catch {
//     return NextResponse.json({ error: "Failed to save shifts" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import {
  DEFAULT_SHIFTS,
  validateShiftSettings,
  type ShiftSetting,
  DEFAULT_ABSENT_MIN,
  DEFAULT_LATE_MIN,
} from "@/lib/shift-settings"

type ShiftDoc = {
  institutionName: string
  shifts: ShiftSetting[]
  updatedAt: string
  updatedByRole?: string
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const institutionName = searchParams.get("institutionName")
    if (!institutionName) {
      return NextResponse.json({ shifts: DEFAULT_SHIFTS }, { status: 200 })
    }
    const db = await getDb()
    const doc = (await db.collection<ShiftDoc>("shift_settings").findOne({ institutionName })) || null
    if (!doc) {
      return NextResponse.json({ shifts: DEFAULT_SHIFTS }, { status: 200 })
    }
    const normalized: ShiftSetting[] = (doc.shifts || []).map((s) => ({
      ...s,
      lateThresholdMinutes: s.lateThresholdMinutes ?? DEFAULT_LATE_MIN,
      absentThresholdMinutes: s.absentThresholdMinutes ?? DEFAULT_ABSENT_MIN,
    }))
    return NextResponse.json({ shifts: normalized }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to load shifts" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      institutionName: string
      shifts: ShiftSetting[]
      userRole?: string
    }
    if (!body?.institutionName) {
      return NextResponse.json({ error: "institutionName required" }, { status: 400 })
    }
    // Only Admin or SuperAdmin may update
    const role = (body.userRole || "").toLowerCase()
    if (!(role === "admin" || role === "superadmin" || role === "super-admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    const errors = validateShiftSettings(body.shifts || [])
    if (errors.length) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 })
    }
    const db = await getDb()
    await db.collection<ShiftDoc>("shift_settings").updateOne(
      { institutionName: body.institutionName },
      {
        $set: {
          institutionName: body.institutionName,
          shifts: body.shifts,
          updatedAt: new Date().toISOString(),
          updatedByRole: role,
        },
      },
      { upsert: true },
    )
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to save shifts" }, { status: 500 })
  }
}

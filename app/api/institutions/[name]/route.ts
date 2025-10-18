// // import { NextResponse } from "next/server"
// // import { getDb } from "@/lib/mongo"

// // type Institution = {
// //   _id?: string
// //   name: string
// //   blocked?: boolean
// //   createdAt?: Date
// //   updatedAt?: Date
// // }

// // // GET /api/institutions/[name]
// // export async function GET(_req: Request, { params }: { params: { name: string } }) {
// //   const db = await getDb()
// //   const doc = await db.collection<Institution>("institutions").findOne({ name: params.name })
// //   if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })
// //   return NextResponse.json(doc)
// // }

// // // PUT /api/institutions/[name]
// // export async function PUT(req: Request, { params }: { params: { name: string } }) {
// //   const body = await req.json()
// //   const allowed = ["blocked"]
// //   const update: any = {}
// //   for (const k of allowed) {
// //     if (k in body) update[k] = body[k]
// //   }
// //   if (Object.keys(update).length === 0) {
// //     return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
// //   }
// //   update.updatedAt = new Date()

// //   const db = await getDb()
// //   const res = await db
// //     .collection<Institution>("institutions")
// //     .findOneAndUpdate({ name: params.name }, { $set: update }, { upsert: true, returnDocument: "after" })

// //   if (!res) {
// //     return NextResponse.json({ error: "Update failed" }, { status: 500 })
// //   }
// //   return NextResponse.json({ ok: true, doc: res })
// // }




// import { NextResponse } from "next/server"
// import { getDb } from "@/lib/mongo"

// type Institution = {
//   _id?: string
//   name: string
//   blocked?: boolean
//   createdAt?: Date
//   updatedAt?: Date
// }

// // GET /api/institutions/[name]
// export async function GET(_req: Request, { params }: { params: { name: string } }) {
//   const db = await getDb()
//   const doc = await db.collection<Institution>("institutions").findOne({ name: params.name })
//   if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })
//   return NextResponse.json(doc)
// }

// // PUT /api/institutions/[name]
// export async function PUT(req: Request, { params }: { params: { name: string } }) {
//   const body = await req.json()
//   const db = await getDb()
//   const coll = db.collection<Institution>("institutions")

//   // Allowed fields: blocked toggle and rename via newName
//   const update: any = {}
//   if (typeof body.blocked === "boolean") update.blocked = body.blocked

//   // Handle rename: { newName: string }
//   const newNameRaw = typeof body.newName === "string" ? body.newName : undefined
//   const newName = newNameRaw?.trim()

//   if (!Object.keys(update).length && !newName) {
//     return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
//   }

//   // If renaming, ensure target not in use and cascade to staff/students
//   if (newName && newName !== params.name) {
//     const existing = await coll.findOne({ name: newName })
//     if (existing) {
//       return NextResponse.json({ error: "Target name already exists" }, { status: 409 })
//     }

//     // Update institution doc name
//     update.name = newName
//     update.updatedAt = new Date()

//     const res = await coll.findOneAndUpdate(
//       { name: params.name },
//       { $set: update },
//       { upsert: true, returnDocument: "after" },
//     )

//     // Cascade rename to related collections
//     await Promise.all([
//       db.collection("staff").updateMany({ institutionName: params.name }, { $set: { institutionName: newName } }),
//       db.collection("students").updateMany({ institutionName: params.name }, { $set: { institutionName: newName } }),
//     ])

//     return NextResponse.json({ ok: true, doc: res || null })
//   }

//   // Regular update (blocked only)
//   update.updatedAt = new Date()
//   const res = await coll.findOneAndUpdate(
//     { name: params.name },
//     { $set: update },
//     { upsert: true, returnDocument: "after" },
//   )
//   return NextResponse.json({ ok: true, doc: res ?? null })
// }

// // DELETE /api/institutions/[name]
// export async function DELETE(_req: Request, { params }: { params: { name: string } }) {
//   const db = await getDb()
//   const [staffCount, studentCount] = await Promise.all([
//     db.collection("staff").countDocuments({ institutionName: params.name }),
//     db.collection("students").countDocuments({ institutionName: params.name }),
//   ])

//   if (staffCount > 0 || studentCount > 0) {
//     return NextResponse.json(
//       {
//         error: "Cannot delete institution with associated staff/students. Please move or remove them before deleting.",
//       },
//       { status: 400 },
//     )
//   }

//   const res = await db.collection<Institution>("institutions").deleteOne({ name: params.name })
//   return NextResponse.json({ ok: res.deletedCount === 1 })
// }



import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

type Institution = {
  _id?: string
  name: string
  blocked?: boolean
  locationVerificationEnabled?: boolean
  createdAt?: Date
  updatedAt?: Date
}

// GET /api/institutions/[name]
export async function GET(_req: Request, { params }: { params: { name: string } }) {
  const db = await getDb()
  const doc = await db.collection<Institution>("institutions").findOne({ name: params.name })
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(doc)
}

// PUT /api/institutions/[name]
export async function PUT(req: Request, { params }: { params: { name: string } }) {
  const body = await req.json()
  const db = await getDb()
  const coll = db.collection<Institution>("institutions")

  // Allowed fields: blocked toggle, rename via newName, and locationVerificationEnabled toggle
  const update: any = {}
  if (typeof body.blocked === "boolean") update.blocked = body.blocked
  if (typeof body.locationVerificationEnabled === "boolean") {
    update.locationVerificationEnabled = body.locationVerificationEnabled
  }

  // Handle rename: { newName: string }
  const newNameRaw = typeof body.newName === "string" ? body.newName : undefined
  const newName = newNameRaw?.trim()

  if (!Object.keys(update).length && !newName) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
  }

  // If renaming, ensure target not in use and cascade to staff/students
  if (newName && newName !== params.name) {
    const existing = await coll.findOne({ name: newName })
    if (existing) {
      return NextResponse.json({ error: "Target name already exists" }, { status: 409 })
    }

    // Update institution doc name
    update.name = newName
    update.updatedAt = new Date()

    const res = await coll.findOneAndUpdate(
      { name: params.name },
      { $set: update },
      { upsert: true, returnDocument: "after" },
    )

    // Cascade rename to related collections
    await Promise.all([
      db.collection("staff").updateMany({ institutionName: params.name }, { $set: { institutionName: newName } }),
      db.collection("students").updateMany({ institutionName: params.name }, { $set: { institutionName: newName } }),
    ])

    return NextResponse.json({ ok: true, doc: res.value })
  }

  // Regular update (blocked and locationVerificationEnabled only)
  update.updatedAt = new Date()
  const res = await coll.findOneAndUpdate(
    { name: params.name },
    { $set: update },
    { upsert: true, returnDocument: "after" },
  )
  return NextResponse.json({ ok: true, doc: res.value })
}

// DELETE /api/institutions/[name]
export async function DELETE(_req: Request, { params }: { params: { name: string } }) {
  const db = await getDb()
  const [staffCount, studentCount] = await Promise.all([
    db.collection("staff").countDocuments({ institutionName: params.name }),
    db.collection("students").countDocuments({ institutionName: params.name }),
  ])

  if (staffCount > 0 || studentCount > 0) {
    return NextResponse.json(
      {
        error: "Cannot delete institution with associated staff/students. Please move or remove them before deleting.",
      },
      { status: 400 },
    )
  }

  const res = await db.collection<Institution>("institutions").deleteOne({ name: params.name })
  return NextResponse.json({ ok: res.deletedCount === 1 })
}

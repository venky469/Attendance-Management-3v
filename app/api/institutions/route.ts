
import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

type Institution = {
  _id?: string
  name: string
  blocked?: boolean
  locationVerificationEnabled?: boolean
  quarterlyReportsEnabled?: boolean
  createdAt?: Date
  updatedAt?: Date
}

// GET /api/institutions
export async function GET() {
  const db = await getDb()
  const coll = db.collection<Institution>("institutions")

  // fetch both sources in parallel
  const [docs, staffInsts, studentInsts] = await Promise.all([
    coll.find({}).toArray(),
    db.collection("staff").distinct("institutionName"),
    db.collection("students").distinct("institutionName"),
  ])

  // Normalize helper
  const norm = (v: unknown) => String(v ?? "").trim()
  const map = new Map<string, Institution>()

  // 1) Seed from explicit docs, preserving blocked and timestamps
  for (const d of docs) {
    const key = norm(d.name).toLowerCase()
    if (!key) continue
    map.set(key, {
      name: norm(d.name),
      blocked: !!d.blocked,
      locationVerificationEnabled: d.locationVerificationEnabled,
      quarterlyReportsEnabled: d.quarterlyReportsEnabled,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    })
  }

  // 2) Add inferred names from staff/students if not already present
  const inferred = [...new Set([...staffInsts, ...studentInsts].map(norm).filter(Boolean))]
  for (const name of inferred) {
    const key = name.toLowerCase()
    if (!map.has(key)) {
      map.set(key, { name, blocked: false, locationVerificationEnabled: false, quarterlyReportsEnabled: false })
    }
  }

  // Sorted array by display name
  const institutions = [...map.values()].sort((a, b) => a.name.localeCompare(b.name))

  // include counts for UI convenience
  const withCounts = await Promise.all(
    institutions.map(async (inst) => {
      const [staffCount, studentCount] = await Promise.all([
        db.collection("staff").countDocuments({ institutionName: inst.name }),
        db.collection("students").countDocuments({ institutionName: inst.name }),
      ])
      return { ...inst, staffCount, studentCount }
    }),
  )

  return NextResponse.json({ items: withCounts })
}

// POST /api/institutions
export async function POST(req: Request) {
  const {
    name,
    blocked = false,
    locationVerificationEnabled = false,
    quarterlyReportsEnabled = false,
  } = await req.json()
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 })
  }

  const db = await getDb()
  const coll = db.collection<Institution>("institutions")

  const existing = await coll.findOne({ name })
  if (existing) {
    return NextResponse.json({ error: "Institution already exists" }, { status: 409 })
  }

  const now = new Date()
  await coll.insertOne({
    name,
    blocked,
    locationVerificationEnabled,
    quarterlyReportsEnabled,
    createdAt: now,
    updatedAt: now,
  })

  return NextResponse.json({ ok: true })
}

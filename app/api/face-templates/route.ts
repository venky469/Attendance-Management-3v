import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongo"

export async function GET() {
  const db = await getDb()
  const items = await db.collection("face_templates").find({}).project({ vector: 0 }).toArray()
  // For privacy, vectors omitted here; fetch by person on-demand if needed.
  const normalized = items.map((t: any) => ({ ...t, id: t._id?.toString() })).map(({ _id, ...rest }) => rest)
  return Response.json({ items: normalized })
}

export async function POST(req: NextRequest) {
  const db = await getDb()
  const body = await req.json()
  // Expect: { personId, personType, photoUrl, vector: number[] }
  const now = new Date().toISOString()
  await db
    .collection("face_templates")
    .updateOne(
      { personId: body.personId, personType: body.personType },
      { $set: { photoUrl: body.photoUrl, vector: body.vector, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true },
    )
  return Response.json({ ok: true })
}

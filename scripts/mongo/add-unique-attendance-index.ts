// Run this script from the v0 Scripts panel after setting MONGODB_URI and MONGODB_DB in Vars.

import { MongoClient } from "mongodb"

async function main() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB
  if (!uri || !dbName) {
    console.error("[v0] Missing MONGODB_URI or MONGODB_DB environment variables.")
    process.exit(1)
  }

  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(dbName)
    const coll = db.collection("attendance")

    console.log("[v0] Creating unique index on attendance(personId, date)...")
    await coll.createIndex({ personId: 1, date: 1 }, { unique: true, name: "uniq_person_date" })

    console.log("[v0] Creating helpful query indexes...")
    await coll.createIndex({ date: 1 }, { name: "by_date" })
    await coll.createIndex({ status: 1, date: 1 }, { name: "by_status_date" })

    console.log("[v0] Done.")
  } catch (err) {
    console.error("[v0] Index creation failed:", err)
    process.exit(1)
  } finally {
    await client.close()
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

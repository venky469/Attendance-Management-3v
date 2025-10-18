// // NOTE: Requires TENANT_ENCRYPTION_KEY and CRON_SECRET to be configured in Vars.
// import { NextResponse } from "next/server"
// import { getDb } from "@/lib/mongo"
// import { encryptSecret } from "@/lib/crypto"

// export async function PUT(req: Request, { params }: { params: { name: string } }) {
//   const adminToken = req.headers.get("x-admin-token")
//   if (!process.env.CRON_SECRET || adminToken !== process.env.CRON_SECRET) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const body = await req.json().catch(() => ({}))
//   const { mongodbUri, dbName, cloudName, apiKey, apiSecret, folder } = body || {}
//   if (!mongodbUri && !dbName && !cloudName && !apiKey && !apiSecret && !folder) {
//     return NextResponse.json({ error: "No fields to update" }, { status: 400 })
//   }

//   const update: any = { updatedAt: new Date() }
//   update.secrets = {}
//   if (mongodbUri) update.secrets.mongoUriEnc = encryptSecret(mongodbUri)
//   if (dbName) update.secrets.dbName = dbName
//   if (cloudName) update.secrets.cloudNameEnc = encryptSecret(cloudName)
//   if (apiKey) update.secrets.apiKeyEnc = encryptSecret(apiKey)
//   if (apiSecret) update.secrets.apiSecretEnc = encryptSecret(apiSecret)
//   if (folder) update.secrets.folder = folder

//   const db = await getDb()
//   await db.collection("institutions").updateOne({ name: params.name }, { $set: update }, { upsert: true })

//   return NextResponse.json({ ok: true })
// }

// import { MongoClient, type Db } from "mongodb"
// import { getDb as getAdminDb } from "@/lib/mongo"
// import { decryptSecret } from "@/lib/crypto"

// type InstitutionDoc = {
//   name: string
//   blocked?: boolean
//   secrets?: {
//     mongoUriEnc?: string
//     dbName?: string
//     cloudNameEnc?: string
//     apiKeyEnc?: string
//     apiSecretEnc?: string
//     folder?: string
//   }
// }

// type CloudinaryConfig = {
//   cloudName: string
//   apiKey: string
//   apiSecret: string
//   folder: string
// }

// const dbCache = new Map<string, { client: MongoClient; db: Db }>()
// const cloudCache = new Map<string, CloudinaryConfig>()

// function slugify(input: string) {
//   return input
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)/g, "")
// }

// async function getInstitution(name: string): Promise<InstitutionDoc | null> {
//   const adminDb = await getAdminDb()
//   const doc = await adminDb.collection<InstitutionDoc>("institutions").findOne({ name })
//   return doc
// }

// export async function getTenantDbByInstitutionName(name: string): Promise<Db> {
//   const key = `db:${name}`
//   const cached = dbCache.get(key)
//   if (cached) return cached.db

//   const doc = await getInstitution(name)
//   const secrets = doc?.secrets

//   // Fallback to admin DB if secrets not set (for transitional state)
//   if (!secrets?.mongoUriEnc || !secrets?.dbName) {
//     const adminDb = await getAdminDb()
//     return adminDb
//   }

//   const uri = decryptSecret(secrets.mongoUriEnc)
//   const dbName = secrets.dbName

//   const client = new MongoClient(uri, {})
//   const connected = await client.connect()
//   const db = connected.db(dbName)
//   dbCache.set(key, { client: connected, db })
//   return db
// }

// export async function getTenantCloudinaryConfig(institutionName: string): Promise<CloudinaryConfig | null> {
//   const key = `cld:${institutionName}`
//   const cached = cloudCache.get(key)
//   if (cached) return cached

//   const doc = await getInstitution(institutionName)
//   const secrets = doc?.secrets
//   if (!secrets?.cloudNameEnc || !secrets?.apiKeyEnc || !secrets?.apiSecretEnc) {
//     return null
//   }
//   const cfg: CloudinaryConfig = {
//     cloudName: decryptSecret(secrets.cloudNameEnc),
//     apiKey: decryptSecret(secrets.apiKeyEnc),
//     apiSecret: decryptSecret(secrets.apiSecretEnc),
//     folder: secrets.folder || `${slugify(institutionName)}/faces`,
//   }
//   cloudCache.set(key, cfg)
//   return cfg
// }

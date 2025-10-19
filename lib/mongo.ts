
// // import { MongoClient, type Db } from "mongodb"
// // import bcrypt from "bcryptjs"

// // let client: MongoClient | null = null
// // let db: Db | null = null

// // const uri = process.env.MONGODB_URI
// // const dbName = process.env.MONGODB_DB

// // if (!uri) {
// //   console.warn("[mongo] MONGODB_URI is not set. Please add it to your environment variables.")
// // }
// // if (!dbName) {
// //   console.warn("[mongo] MONGODB_DB is not set. Please add it to your environment variables.")
// // }

// // // Use a global cache to avoid creating multiple connections in dev/hot-reload.
// // declare global {
// //   // eslint-disable-next-line no-var
// //   var __mongoClientPromise: Promise<MongoClient> | undefined
// //   // eslint-disable-next-line no-var
// //   var __mongoDb: Db | undefined
// // }

// // export async function getDb(): Promise<Db> {
// //   if (db) return db

// //   if (!global.__mongoClientPromise) {
// //     if (!uri) throw new Error("Missing MONGODB_URI")
// //     const c = new MongoClient(uri)
// //     global.__mongoClientPromise = c.connect()
// //   }

// //   client = await global.__mongoClientPromise
// //   db = global.__mongoDb ?? client.db(dbName)
// //   global.__mongoDb = db
// //   return db
// // }

// // // Utility functions for password hashing and auto-increment
// // export async function hashPassword(password: string): Promise<string> {
// //   const saltRounds = 12
// //   return await bcrypt.hash(password, saltRounds)
// // }

// // export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
// //   return await bcrypt.compare(password, hashedPassword)
// // }

// // export async function getNextSequence(db: Db, sequenceName: string): Promise<number> {
// //   const result = await db
// //     .collection<{ _id: string; sequence: number }>("counters")
// //     .findOneAndUpdate({ _id: sequenceName }, { $inc: { sequence: 1 } }, { upsert: true, returnDocument: "after" })
// //   return result?.sequence || 1
// // }

// // function deriveShortCode(institutionName?: string): string {
// //   if (!institutionName) return "COL"
// //   const words = institutionName
// //     .split(/\s+/)
// //     .filter(Boolean)
// //     .map((w) => w.replace(/[^A-Za-z]/g, ""))
// //     .filter(Boolean)

// //   const acronym = words
// //     .map((w) => w[0])
// //     .join("")
// //     .toUpperCase()
// //   let code = (acronym || institutionName.replace(/[^A-Za-z]/g, "").toUpperCase()).slice(0, 3)
// //   if (code.length < 2) code = (institutionName.replace(/[^A-Za-z]/g, "").toUpperCase() || "COL").slice(0, 3)
// //   return code
// // }

// // async function generateCodeWithPrefix(
// //   db: Db,
// //   sequenceKey: string,
// //   institutionName?: string,
// //   totalLength = 7,
// // ): Promise<string> {
// //   const prefix = deriveShortCode(institutionName)
// //   const counterId = `${sequenceKey}:${prefix}`
// //   const sequence = await getNextSequence(db, counterId)
// //   const numericLen = Math.max(totalLength - prefix.length, 1)
// //   const numberPart = sequence.toString().padStart(numericLen, "0")
// //   return `${prefix}${numberPart}`
// // }

// // export async function generateEmployeeCode(db: Db, institutionName?: string): Promise<string> {
// //   if (institutionName) {
// //     return generateCodeWithPrefix(db, "employeeCode", institutionName, 7)
// //   }
// //   // fallback for legacy usage (seeding, etc.)
// //   const sequence = await getNextSequence(db, "employeeCode")
// //   return `EMP${sequence.toString().padStart(3, "0")}`
// // }

// // export async function generateStudentRollNumber(db: Db, institutionName?: string): Promise<string> {
// //   if (institutionName) {
// //     return generateCodeWithPrefix(db, "rollNumber", institutionName, 7)
// //   }
// //   // fallback for legacy usage (seeding, etc.)
// //   const sequence = await getNextSequence(db, "rollNumber")
// //   return `STU${sequence.toString().padStart(3, "0")}`
// // }



// import { MongoClient, type Db } from "mongodb"
// import bcrypt from "bcryptjs"

// let client: MongoClient | null = null
// let db: Db | null = null

// const uri = process.env.MONGODB_URI
// const dbName = process.env.MONGODB_DB

// if (!uri) {
//   console.warn("[mongo] MONGODB_URI is not set. Please add it to your environment variables.")
// }
// if (!dbName) {
//   console.warn("[mongo] MONGODB_DB is not set. Please add it to your environment variables.")
// }

// // Use a global cache to avoid creating multiple connections in dev/hot-reload.
// declare global {
//   // eslint-disable-next-line no-var
//   var __mongoClientPromise: Promise<MongoClient> | undefined
//   // eslint-disable-next-line no-var
//   var __mongoDb: Db | undefined
// }

// export async function getDb(): Promise<Db> {
//   if (db) return db

//   if (!global.__mongoClientPromise) {
//     if (!uri) throw new Error("Missing MONGODB_URI")
//     const c = new MongoClient(uri)
//     global.__mongoClientPromise = c.connect()
//   }

//   client = await global.__mongoClientPromise
//   db = global.__mongoDb ?? client.db(dbName)
//   global.__mongoDb = db
//   return db
// }

// // Utility functions for password hashing and auto-increment
// export async function hashPassword(password: string): Promise<string> {
//   const saltRounds = 12
//   return await bcrypt.hash(password, saltRounds)
// }

// export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
//   return await bcrypt.compare(password, hashedPassword)
// }

// export async function getNextSequence(db: Db, sequenceName: string): Promise<number> {
//   const result = await db
//     .collection("counters")
//     .findOneAndUpdate({ _id: sequenceName }, { $inc: { sequence: 1 } }, { upsert: true, returnDocument: "after" })
//   return result?.sequence || 1
// }

// function deriveShortCode(institutionName?: string): string {
//   if (!institutionName) return "COL"
//   const words = institutionName
//     .split(/\s+/)
//     .filter(Boolean)
//     .map((w) => w.replace(/[^A-Za-z]/g, ""))
//     .filter(Boolean)

//   const acronym = words
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase()
//   let code = (acronym || institutionName.replace(/[^A-Za-z]/g, "").toUpperCase()).slice(0, 3)
//   if (code.length < 2) code = (institutionName.replace(/[^A-Za-z]/g, "").toUpperCase() || "COL").slice(0, 3)
//   return code
// }

// async function generateCodeWithPrefix(
//   db: Db,
//   sequenceKey: string,
//   institutionName?: string,
//   totalLength = 7,
//   extraPrefix?: string, // NEW: optional extra prefix like 'ECE' or 'AP'
// ): Promise<string> {
//   const base = deriveShortCode(institutionName)
//   const extra = (extraPrefix || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase()
//   const fullPrefix = `${base}${extra}`

//   // Counter is per sequence key + institution + extra to ensure unique series
//   const counterId = `${sequenceKey}:${fullPrefix || base}`
//   const sequence = await getNextSequence(db, counterId)

//   // If extra prefix is present, keep 4-digit numeric suffix for readability
//   const numericLen = extra ? 4 : Math.max(totalLength - base.length, 1)
//   const numberPart = sequence.toString().padStart(numericLen, "0")
//   return `${fullPrefix || base}${numberPart}`
// }

// export async function generateEmployeeCode(db: Db, institutionName?: string, extraPrefix?: string): Promise<string> {
//   if (institutionName) {
//     return generateCodeWithPrefix(db, "employeeCode", institutionName, 7, extraPrefix)
//   }
//   // fallback for legacy usage (seeding, etc.)
//   const sequence = await getNextSequence(db, "employeeCode")
//   return `EMP${sequence.toString().padStart(3, "0")}`
// }

// export async function generateStudentRollNumber(
//   db: Db,
//   institutionName?: string,
//   extraPrefix?: string,
// ): Promise<string> {
//   if (institutionName) {
//     return generateCodeWithPrefix(db, "rollNumber", institutionName, 7, extraPrefix)
//   }
//   // fallback for legacy usage (seeding, etc.)
//   const sequence = await getNextSequence(db, "rollNumber")
//   return `STU${sequence.toString().padStart(3, "0")}`
// }



import { MongoClient, type Db } from "mongodb"
import bcrypt from "bcryptjs"

let client: MongoClient | null = null
let db: Db | null = null

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

if (!uri) {
  console.warn("[MongoDB] ⚠️  MONGODB_URI is not set. Please add it to your environment variables.")
  console.warn("[MongoDB] Example: MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net")
}
if (!dbName) {
  console.warn("[MongoDB] ⚠️  MONGODB_DB is not set. Please add it to your environment variables.")
  console.warn("[MongoDB] Example: MONGODB_DB=genamplify_attendance")
}

if (uri) {
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")
  console.log(`[MongoDB] Configuration loaded: ${maskedUri}`)
}

// Use a global cache to avoid creating multiple connections in dev/hot-reload.
declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined
  // eslint-disable-next-line no-var
  var __mongoDb: Db | undefined
}

export async function getDb(): Promise<Db> {
  if (db) return db

  if (!global.__mongoClientPromise) {
    if (!uri) throw new Error("Missing MONGODB_URI")
    const c = new MongoClient(uri)
    console.log("[MongoDB] Attempting to connect...")
    global.__mongoClientPromise = c
      .connect()
      .then((client) => {
        console.log("[MongoDB] ✓ Connection established successfully")
        return client
      })
      .catch((error) => {
        console.error("[MongoDB] ✗ Connection failed:", error.message)
        console.error("[MongoDB] Please check your MONGODB_URI in environment variables")
        throw error
      })
  }

  client = await global.__mongoClientPromise
  db = global.__mongoDb ?? client.db(dbName)
  global.__mongoDb = db

  console.log(`[MongoDB] ✓ Using database: ${dbName || "default"}`)

  return db
}

// Utility functions for password hashing and auto-increment
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export async function getNextSequence(db: Db, sequenceName: string): Promise<number> {
  const result = await db
    .collection("counters")
    .findOneAndUpdate({ _id: sequenceName }, { $inc: { sequence: 1 } }, { upsert: true, returnDocument: "after" })
  return result?.sequence || 1
}

function deriveShortCode(institutionName?: string): string {
  if (!institutionName) return "COL"
  const words = institutionName
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/[^A-Za-z]/g, ""))
    .filter(Boolean)

  const acronym = words
    .map((w) => w[0])
    .join("")
    .toUpperCase()
  let code = (acronym || institutionName.replace(/[^A-Za-z]/g, "").toUpperCase()).slice(0, 3)
  if (code.length < 2) code = (institutionName.replace(/[^A-Za-z]/g, "").toUpperCase() || "COL").slice(0, 3)
  return code
}

async function generateCodeWithPrefix(
  db: Db,
  sequenceKey: string,
  institutionName?: string,
  totalLength = 7,
  extraPrefix?: string, // NEW: optional extra prefix like 'ECE' or 'AP'
): Promise<string> {
  const base = deriveShortCode(institutionName)
  const extra = (extraPrefix || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase()
  const fullPrefix = `${base}${extra}`

  // Counter is per sequence key + institution + extra to ensure unique series
  const counterId = `${sequenceKey}:${fullPrefix || base}`
  const sequence = await getNextSequence(db, counterId)

  // If extra prefix is present, keep 4-digit numeric suffix for readability
  const numericLen = extra ? 4 : Math.max(totalLength - base.length, 1)
  const numberPart = sequence.toString().padStart(numericLen, "0")
  return `${fullPrefix || base}${numberPart}`
}

export async function generateEmployeeCode(db: Db, institutionName?: string, extraPrefix?: string): Promise<string> {
  if (institutionName) {
    return generateCodeWithPrefix(db, "employeeCode", institutionName, 7, extraPrefix)
  }
  // fallback for legacy usage (seeding, etc.)
  const sequence = await getNextSequence(db, "employeeCode")
  return `EMP${sequence.toString().padStart(3, "0")}`
}

export async function generateStudentRollNumber(
  db: Db,
  institutionName?: string,
  extraPrefix?: string,
): Promise<string> {
  if (institutionName) {
    return generateCodeWithPrefix(db, "rollNumber", institutionName, 7, extraPrefix)
  }
  // fallback for legacy usage (seeding, etc.)
  const sequence = await getNextSequence(db, "rollNumber")
  return `STU${sequence.toString().padStart(3, "0")}`
}

// import { MongoClient, type Db } from "mongodb"

// if (!process.env.MONGODB_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
// }

// const uri = process.env.MONGODB_URI
// const options = {}

// let client: MongoClient
// let clientPromise: Promise<MongoClient>

// if (process.env.NODE_ENV === "development") {
//   // In development mode, use a global variable so that the value
//   // is preserved across module reloads caused by HMR (Hot Module Replacement).
//   const globalWithMongo = global as typeof globalThis & {
//     _mongoClientPromise?: Promise<MongoClient>
//   }

//   if (!globalWithMongo._mongoClientPromise) {
//     client = new MongoClient(uri, options)
//     globalWithMongo._mongoClientPromise = client.connect()
//   }
//   clientPromise = globalWithMongo._mongoClientPromise
// } else {
//   // In production mode, it's best to not use a global variable.
//   client = new MongoClient(uri, options)
//   clientPromise = client.connect()
// }

// export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
//   const client = await clientPromise
//   const db = client.db(process.env.MONGODB_DB || "attendance_system")
//   return { client, db }
// }

// // Export a module-scoped MongoClient promise. By doing this in a
// // separate module, the client can be shared across functions.
// export default clientPromise




import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")
console.log(`[MongoDB] Connecting to: ${maskedUri}`)

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client
      .connect()
      .then((client) => {
        console.log("[MongoDB] ✓ Connected successfully to database")
        return client
      })
      .catch((error) => {
        console.error("[MongoDB] ✗ Connection failed:", error.message)
        throw error
      })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client
    .connect()
    .then((client) => {
      console.log("[MongoDB] ✓ Connected successfully to database")
      return client
    })
    .catch((error) => {
      console.error("[MongoDB] ✗ Connection failed:", error.message)
      throw error
    })
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB || "attendance_system")
  console.log(`[MongoDB] Using database: ${process.env.MONGODB_DB || "attendance_system"}`)
  return { client, db }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

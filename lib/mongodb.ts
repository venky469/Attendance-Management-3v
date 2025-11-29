

import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI

const options = {
  maxPoolSize: 100, // Maximum 100 connections in the pool for high traffic
  minPoolSize: 10, // Keep 10 connections alive for faster responses
  maxIdleTimeMS: 60000, // Close idle connections after 60 seconds
  serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds if can't connect
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 10000, // Timeout connection attempts after 10 seconds
  retryWrites: true, // Retry write operations on failure
  retryReads: true, // Retry read operations on failure
}

const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")
console.log(`[MongoDB] Connecting to: ${maskedUri}`)
console.log(`[MongoDB] Pool settings: max=${options.maxPoolSize}, min=${options.minPoolSize}`)

let client: MongoClient
let clientPromise: Promise<MongoClient>

let isConnecting = false
let connectionAttempts = 0
const MAX_CONNECTION_ATTEMPTS = 3

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
  try {
    if (isConnecting) {
      console.log("[MongoDB] Connection in progress, waiting...")
      // Wait for existing connection attempt
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    isConnecting = true
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB || "attendance_system")

    console.log(`[MongoDB] ✓ Using database: ${process.env.MONGODB_DB || "attendance_system"}`)
    console.log(`[MongoDB] ✓ Active connections in pool: ${client.topology?.s?.pool?.totalConnectionCount || "N/A"}`)

    connectionAttempts = 0 // Reset on success
    isConnecting = false

    return { client, db }
  } catch (error) {
    isConnecting = false
    connectionAttempts++

    console.error(`[MongoDB] ✗ Connection attempt ${connectionAttempts} failed:`, error)

    if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
      console.error("[MongoDB] ✗ Max connection attempts reached. Please check your MongoDB connection.")
      connectionAttempts = 0
    }

    throw error
  }
}

export async function connectDB(): Promise<Db> {
  const { db } = await connectToDatabase()
  return db
}

export const getDb = connectDB

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

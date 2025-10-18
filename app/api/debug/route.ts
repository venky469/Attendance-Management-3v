import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongo"

export async function GET(req: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {},
  }

  // Check environment variables
  results.checks.envVars = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    MONGODB_DB: !!process.env.MONGODB_DB,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "not set",
    VERCEL_URL: process.env.VERCEL_URL || "not set",
    NODE_ENV: process.env.NODE_ENV,
  }

  // Test MongoDB connection
  try {
    console.log("[v0] Testing MongoDB connection...")
    const db = await getDb()
    const collections = await db.listCollections().toArray()
    results.checks.mongodb = {
      connected: true,
      collections: collections.map((c) => c.name),
      dbName: db.databaseName,
    }
    console.log("[v0] MongoDB connection successful")
  } catch (error) {
    console.error("[v0] MongoDB connection failed:", error)
    results.checks.mongodb = {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }

  // Test basic collections
  try {
    const db = await getDb()
    const staffCount = await db.collection("staff").countDocuments({})
    const studentCount = await db.collection("students").countDocuments({})
    const attendanceCount = await db.collection("attendance").countDocuments({})

    results.checks.collections = {
      staff: staffCount,
      students: studentCount,
      attendance: attendanceCount,
    }
  } catch (error) {
    results.checks.collections = {
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }

  return Response.json(results)
}

export async function POST(req: NextRequest) {
  try {
    console.log("[v0] Debug POST - Testing request parsing...")

    let body
    try {
      body = await req.json()
      console.log("[v0] Request body parsed:", body)
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      return Response.json(
        {
          error: "JSON_PARSE_ERROR",
          message: parseError instanceof Error ? parseError.message : "Unknown parse error",
        },
        { status: 400 },
      )
    }

    // Test MongoDB connection with the parsed data
    try {
      const db = await getDb()
      console.log("[v0] Database connected successfully")

      // Test a simple query
      const testQuery = await db.collection("staff").findOne({})
      console.log("[v0] Test query successful:", !!testQuery)

      return Response.json({
        success: true,
        receivedBody: body,
        dbConnected: true,
        testQueryResult: !!testQuery,
        message: "Debug POST successful",
      })
    } catch (dbError) {
      console.error("[v0] Database error:", dbError)
      return Response.json(
        {
          error: "DATABASE_ERROR",
          message: dbError instanceof Error ? dbError.message : "Unknown database error",
          receivedBody: body,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Debug POST error:", error)
    return Response.json(
      {
        error: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

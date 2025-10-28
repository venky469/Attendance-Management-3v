// import { type NextRequest, NextResponse } from "next/server"
// import { getDb } from "@/lib/mongo"

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const userRole = searchParams.get("userRole")
//     const limit = Number.parseInt(searchParams.get("limit") || "100")
//     const skip = Number.parseInt(searchParams.get("skip") || "0")
//     const search = searchParams.get("search") || ""
//     const filterSuccess = searchParams.get("success")
//     const filterUserType = searchParams.get("userType")

//     // Only Super Admin can access login history
//     if (userRole !== "SuperAdmin") {
//       return NextResponse.json({ error: "Unauthorized. Only Super Admin can access login history." }, { status: 403 })
//     }

//     const db = await getDb()

//     // Build query filter
//     const query: any = {}

//     if (search) {
//       query.$or = [
//         { email: { $regex: search, $options: "i" } },
//         { name: { $regex: search, $options: "i" } },
//         { institutionName: { $regex: search, $options: "i" } },
//       ]
//     }

//     if (filterSuccess !== null && filterSuccess !== "") {
//       query.success = filterSuccess === "true"
//     }

//     if (filterUserType) {
//       query.userType = filterUserType
//     }

//     // Get total count
//     const total = await db.collection("login_history").countDocuments(query)

//     // Get login history with pagination
//     const history = await db
//       .collection("login_history")
//       .find(query)
//       .sort({ timestamp: -1 })
//       .skip(skip)
//       .limit(limit)
//       .toArray()

//     // Get statistics
//     const stats = await db
//       .collection("login_history")
//       .aggregate([
//         {
//           $group: {
//             _id: null,
//             totalLogins: { $sum: 1 },
//             successfulLogins: { $sum: { $cond: ["$success", 1, 0] } },
//             failedLogins: { $sum: { $cond: ["$success", 0, 1] } },
//           },
//         },
//       ])
//       .toArray()

//     const statistics = stats[0] || { totalLogins: 0, successfulLogins: 0, failedLogins: 0 }

//     return NextResponse.json({
//       success: true,
//       history: history.map((h) => ({
//         ...h,
//         _id: h._id.toString(),
//       })),
//       total,
//       statistics,
//     })
//   } catch (error) {
//     console.error("Login history fetch error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }




import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userRole = searchParams.get("userRole")
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const skip = Number.parseInt(searchParams.get("skip") || "0")
    const search = searchParams.get("search") || ""
    const filterSuccess = searchParams.get("success")
    const filterUserType = searchParams.get("userType")

    // Only Super Admin can access login history
    if (userRole !== "SuperAdmin") {
      return NextResponse.json({ error: "Unauthorized. Only Super Admin can access login history." }, { status: 403 })
    }

    const db = await getDb()

    // Build query filter
    const query: any = {}

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { institutionName: { $regex: search, $options: "i" } },
      ]
    }

    if (filterSuccess !== null && filterSuccess !== "") {
      query.success = filterSuccess === "true"
    }

    if (filterUserType) {
      query.userType = filterUserType
    }

    // Get total count
    const total = await db.collection("login_history").countDocuments(query)

    // Get login history with pagination
    const history = await db
      .collection("login_history")
      .find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get statistics
    const stats = await db
      .collection("login_history")
      .aggregate([
        {
          $group: {
            _id: null,
            totalLogins: { $sum: 1 },
            successfulLogins: { $sum: { $cond: ["$success", 1, 0] } },
            failedLogins: { $sum: { $cond: ["$success", 0, 1] } },
          },
        },
      ])
      .toArray()

    const statistics = stats[0] || { totalLogins: 0, successfulLogins: 0, failedLogins: 0 }

    return NextResponse.json({
      success: true,
      history: history.map((h) => ({
        ...h,
        _id: h._id.toString(),
      })),
      total,
      statistics,
    })
  } catch (error) {
    console.error("Login history fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userRole = searchParams.get("userRole")

    // Only Super Admin can delete login history
    if (userRole !== "SuperAdmin") {
      return NextResponse.json({ error: "Unauthorized. Only Super Admin can delete login history." }, { status: 403 })
    }

    const body = await request.json()
    const { ids } = body // Array of record IDs to delete

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No records specified for deletion" }, { status: 400 })
    }

    const db = await getDb()

    // Convert string IDs to ObjectIds
    const objectIds = ids.map((id) => new ObjectId(id))

    // Delete the records
    const result = await db.collection("login_history").deleteMany({
      _id: { $in: objectIds },
    })

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Successfully deleted ${result.deletedCount} record(s)`,
    })
  } catch (error) {
    console.error("Login history deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { userId, currentPassword, newPassword } = await request.json()

    console.log("[v0] Password change request:", {
      userId: !!userId,
      currentPassword: !!currentPassword,
      newPassword: !!newPassword,
      userIdValue: userId,
    })

    if (!userId || !currentPassword || !newPassword) {
      console.log("[v0] Missing fields error:", {
        userId,
        currentPassword: !!currentPassword,
        newPassword: !!newPassword,
      })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const objectId = new ObjectId(userId)

    // Find user in both staff and students collections
    let user = await db.collection("staff").findOne({ _id: objectId })
    let collection = "staff"

    if (!user) {
      user = await db.collection("students").findOne({ _id: objectId })
      collection = "students"
    }

    if (!user) {
      console.log("[v0] User not found with ID:", userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update password in database
    await db.collection(collection).updateOne(
      { _id: objectId },
      {
        $set: {
          password: hashedNewPassword,
          passwordUpdatedAt: new Date(),
        },
      },
    )

    console.log("[v0] Password updated successfully for user:", userId)
    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

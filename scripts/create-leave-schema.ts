import { getDb } from "../lib/mongo"

async function createLeaveSchema() {
  try {
    console.log("[v0] Creating leave request database schema...")

    const db = await getDb()

    // Create leave_requests collection with indexes
    const leaveRequestsCollection = db.collection("leave_requests")

    // Create indexes for better query performance
    await leaveRequestsCollection.createIndex({ personId: 1, status: 1 })
    await leaveRequestsCollection.createIndex({ personType: 1, status: 1 })
    await leaveRequestsCollection.createIndex({ department: 1, status: 1 })
    await leaveRequestsCollection.createIndex({ appliedDate: -1 })
    await leaveRequestsCollection.createIndex({ startDate: 1, endDate: 1 })
    await leaveRequestsCollection.createIndex({ reviewedBy: 1 })

    // Create leave_notifications collection with indexes
    const leaveNotificationsCollection = db.collection("leave_notifications")

    await leaveNotificationsCollection.createIndex({ leaveRequestId: 1 })
    await leaveNotificationsCollection.createIndex({ recipientId: 1, status: 1 })
    await leaveNotificationsCollection.createIndex({ sentAt: -1 })

    console.log("[v0] Leave request schema created successfully!")
    console.log("[v0] Collections created:")
    console.log("  - leave_requests (with indexes)")
    console.log("  - leave_notifications (with indexes)")
  } catch (error) {
    console.error("[v0] Error creating leave schema:", error)
    throw error
  }
}

// Run the schema creation
createLeaveSchema()
  .then(() => {
    console.log("[v0] Leave schema creation completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("[v0] Leave schema creation failed:", error)
    process.exit(1)
  })

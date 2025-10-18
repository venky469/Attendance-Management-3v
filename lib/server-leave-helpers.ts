import type { Department, Role } from "./types"
import { getDb } from "./mongo"

// Helper function to get approvers for leave requests (server-side only)
export async function getApproversForLeaveRequest(
  personType: "staff" | "student",
  department?: Department,
  role?: Role,
): Promise<{ id: string; name: string; email: string }[]> {
  const db = await getDb()

  if (personType === "student") {
    // Students' leave requests go to teachers and managers in Academics department
    const approvers = await db
      .collection("staff")
      .find({
        department: "Academics",
        role: { $in: ["Teacher", "Manager", "Admin"] },
      })
      .toArray()

    return approvers.map((approver) => ({
      id: approver._id.toString(),
      name: approver.name,
      email: approver.email,
    }))
  } else {
    // Staff leave requests go to managers and admins in their department or higher
    const approvers = await db
      .collection("staff")
      .find({
        $or: [{ role: "Admin" }, { department, role: "Manager" }],
      })
      .toArray()

    return approvers.map((approver) => ({
      id: approver._id.toString(),
      name: approver.name,
      email: approver.email,
    }))
  }
}

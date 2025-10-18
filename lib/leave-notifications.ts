import { getDb } from "./mongo"
import { sendLeaveRequestNotificationEmail, sendLeaveStatusNotificationEmail } from "./email"
import type { LeaveRequest, LeaveNotification } from "./types"
import { ObjectId } from "mongodb"

export async function sendLeaveRequestNotifications(leaveRequest: LeaveRequest): Promise<boolean> {
  try {
    const db = await getDb()

    if (!leaveRequest.approverEmail) {
      console.error("No approver email specified for leave request:", leaveRequest.id)
      return false
    }

    // Get requester details
    const personCol = leaveRequest.personType === "staff" ? "staff" : "students"
    const requester = await db.collection(personCol).findOne({ _id: new ObjectId(leaveRequest.personId) })

    if (!requester) {
      console.error("Requester not found:", leaveRequest.personId)
      return false
    }

    const requesterCode = leaveRequest.personType === "staff" ? requester.employeeCode : requester.rollNumber

    try {
      const emailSent = await sendLeaveRequestNotificationEmail({
        to: leaveRequest.approverEmail,
        toName: "Approver", // We don't have the approver's name, just email
        requesterName: leaveRequest.personName || requester.name,
        requesterType: leaveRequest.personType,
        requesterCode,
        leaveType: leaveRequest.leaveType,
        startDate: leaveRequest.startDate,
        endDate: leaveRequest.endDate,
        totalDays: leaveRequest.totalDays,
        reason: leaveRequest.reason,
        appliedDate: leaveRequest.appliedDate,
        leaveRequestId: leaveRequest.id,
      })

      // Store notification record
      const notification: Omit<LeaveNotification, "id"> = {
        leaveRequestId: leaveRequest.id,
        recipientId: "unknown", // We don't have the approver's ID, just email
        recipientEmail: leaveRequest.approverEmail,
        recipientType: "staff", // Approvers are assumed to be staff
        notificationType: "request",
        subject: `Leave Request Approval Required - ${leaveRequest.personName || requester.name} (${requesterCode})`,
        message: `A ${leaveRequest.personType} has submitted a ${leaveRequest.leaveType} leave request that requires your approval.`,
        sentAt: new Date().toISOString(),
        status: emailSent ? "sent" : "failed",
      }

      await db.collection("leave_notifications").insertOne({
        ...notification,
        id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
      })

      console.log(`Sent leave request notification to ${leaveRequest.approverEmail}`)
      return emailSent
    } catch (error) {
      console.error(`Failed to send notification to ${leaveRequest.approverEmail}:`, error)
      return false
    }
  } catch (error) {
    console.error("Error sending leave request notifications:", error)
    return false
  }
}

export async function sendLeaveStatusNotifications(
  leaveRequest: LeaveRequest,
  status: "approved" | "rejected",
  reviewerName: string,
  reviewComments?: string,
): Promise<boolean> {
  try {
    const db = await getDb()

    // Get requester details
    const personCol = leaveRequest.personType === "staff" ? "staff" : "students"
    const requester = await db.collection(personCol).findOne({ _id: new ObjectId(leaveRequest.personId) })

    if (!requester) {
      console.error("Requester not found:", leaveRequest.personId)
      return false
    }

    const requesterCode = leaveRequest.personType === "staff" ? requester.employeeCode : requester.rollNumber

    try {
      // Send email to requester
      const emailSent = await sendLeaveStatusNotificationEmail({
        to: requester.email,
        requesterName: leaveRequest.personName || requester.name,
        requesterType: leaveRequest.personType,
        requesterCode,
        leaveType: leaveRequest.leaveType,
        startDate: leaveRequest.startDate,
        endDate: leaveRequest.endDate,
        totalDays: leaveRequest.totalDays,
        reason: leaveRequest.reason,
        status,
        reviewerName,
        reviewComments,
        reviewedDate: new Date().toISOString(),
        leaveRequestId: leaveRequest.id,
      })

      // Store notification record
      const notification: Omit<LeaveNotification, "id"> = {
        leaveRequestId: leaveRequest.id,
        recipientId: leaveRequest.personId,
        recipientEmail: requester.email,
        recipientType: leaveRequest.personType,
        notificationType: status === "approved" ? "approval" : "rejection",
        subject: `Leave Request ${status === "approved" ? "Approved" : "Rejected"}`,
        message: `Your ${leaveRequest.leaveType} leave request has been ${status} by ${reviewerName}.`,
        sentAt: new Date().toISOString(),
        status: emailSent ? "sent" : "failed",
      }

      await db.collection("leave_notifications").insertOne({
        ...notification,
        id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
      })

      console.log(`Sent leave ${status} notification to ${requester.email}`)
      return emailSent
    } catch (error) {
      console.error(`Failed to send ${status} notification:`, error)
      return false
    }
  } catch (error) {
    console.error("Error sending leave status notifications:", error)
    return false
  }
}

export async function getLeaveNotifications(
  leaveRequestId?: string,
  recipientId?: string,
  limit = 50,
): Promise<LeaveNotification[]> {
  try {
    const db = await getDb()

    const query: any = {}
    if (leaveRequestId) query.leaveRequestId = leaveRequestId
    if (recipientId) query.recipientId = recipientId

    const notifications = await db
      .collection("leave_notifications")
      .find(query)
      .sort({ sentAt: -1 })
      .limit(limit)
      .toArray()

    return notifications.map(({ _id, ...notification }) => ({
      ...notification,
      id: notification.id || _id?.toString(),
    })) as LeaveNotification[]
  } catch (error) {
    console.error("Error fetching leave notifications:", error)
    return []
  }
}

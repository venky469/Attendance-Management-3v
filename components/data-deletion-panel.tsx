"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Database, Mail, Trash2, Loader2, FileText, FileSpreadsheet, Users, Building, Clock, FileCheck } from 'lucide-react'
import { getStoredUser } from "@/lib/auth"

interface DatabaseCounts {
  notifications: number
  attendance: number
  staff: number
  students: number
  institutions: number
  leaveRequests: number
  loginHistory: number
  shiftSettings: number
}

interface AttendanceBreakdown {
  present: number
  absent: number
  late: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DataDeletionPanel() {
  const [loading, setLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedDataType, setSelectedDataType] = useState<
    "notifications" | "attendance" | "staff" | "students" | "institutions" | "leaveRequests" | "loginHistory" | "shiftSettings" | "all" | null
  >(null)
  const user = getStoredUser()

  const { data: notificationsData, isLoading: loadingNotifications } = useSWR("/api/notifications", fetcher, { refreshInterval: 30000 })
  const { data: studentsData, isLoading: loadingStudents } = useSWR("/api/students", fetcher, { refreshInterval: 30000 })
  const { data: staffData, isLoading: loadingStaff } = useSWR("/api/staff", fetcher, { refreshInterval: 30000 })
  const { data: attendanceData, isLoading: loadingAttendance } = useSWR("/api/attendance", fetcher, { refreshInterval: 30000 })
  const { data: institutionsData, isLoading: loadingInstitutions } = useSWR("/api/institutions", fetcher, { refreshInterval: 30000 })
  const { data: leaveRequestsData, isLoading: loadingLeave } = useSWR("/api/leave-requests", fetcher, { refreshInterval: 30000 })
  const { data: loginHistoryData, isLoading: loadingHistory } = useSWR("/api/login-history", fetcher, { refreshInterval: 30000 })
  const { data: shiftsData, isLoading: loadingShifts } = useSWR("/api/shift-settings", fetcher, { refreshInterval: 30000 })

  const counts = {
    notifications: notificationsData?.items?.length || 0,
    attendance: attendanceData?.records?.length || 0,
    staff: staffData?.items?.length || 0,
    students: studentsData?.items?.length || 0,
    institutions: institutionsData?.items?.length || 0,
    leaveRequests: leaveRequestsData?.items?.length || 0,
    loginHistory: loginHistoryData?.items?.length || 0,
    shiftSettings: shiftsData?.items?.length || 0,
  }

  useEffect(() => {
    console.log("[v0] DataDeletionPanel - API Responses:", {
      notificationsData,
      studentsData,
      staffData,
      attendanceData,
      institutionsData,
      leaveRequestsData,
      loginHistoryData,
      shiftsData
    })
    console.log("[v0] DataDeletionPanel - Calculated counts:", counts)
  }, [notificationsData, studentsData, staffData, attendanceData, institutionsData, leaveRequestsData, loginHistoryData, shiftsData])

  const attendanceBreakdown = attendanceData?.records ? {
    present: attendanceData.records.filter((r: any) => r.status === "present").length,
    absent: attendanceData.records.filter((r: any) => r.status === "absent").length,
    late: attendanceData.records.filter((r: any) => r.status === "late").length,
  } : null

  const fetchingCounts = loadingNotifications || loadingStudents || loadingStaff || loadingAttendance || 
                         loadingInstitutions || loadingLeave || loadingHistory || loadingShifts

  const handleDeleteRequest = (dataType: "notifications" | "attendance" | "staff" | "students" | "institutions" | "leaveRequests" | "loginHistory" | "shiftSettings" | "all") => {
    console.log("[v0] Delete button clicked, dataType:", dataType)
    setSelectedDataType(dataType)
    setShowConfirmModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedDataType) return

    try {
      setLoading(true)

      const response = await fetch("/api/admin/delete-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataType: selectedDataType,
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        const deletedSummary = Object.entries(result.deletedCounts)
          .map(([key, value]) => `- ${key}: ${value}`)
          .join('\n')
        
        alert(
          `✅ Success!\n\n${result.message}\n\nDeleted:\n${deletedSummary}\n\nEmails sent to ${result.emailsSent} admins with backup data.`,
        )
        setShowConfirmModal(false)
        setSelectedDataType(null)
        // refreshCounts()
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      console.error("[DataDeletionPanel] Error:", error)
      alert("❌ Failed to delete data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getDataTypeLabel = () => {
    switch (selectedDataType) {
      case "all": return "All Database Data"
      case "notifications": return "Notifications Data"
      case "attendance": return "Attendance Data"
      case "staff": return "Staff Data"
      case "students": return "Students Data"
      case "institutions": return "Institutions Data"
      case "leaveRequests": return "Leave Requests Data"
      case "loginHistory": return "Login History Data"
      case "shiftSettings": return "Shift Settings Data"
      default: return "Unknown Data"
    }
  }

  const getRecordsToDelete = () => {
    if (!counts) return 0
    
    switch (selectedDataType) {
      case "all":
        return Object.values(counts).reduce((sum: number, count: any) => sum + (count || 0), 0)
      case "notifications": return counts.notifications
      case "attendance": return counts.attendance
      case "staff": return counts.staff
      case "students": return counts.students
      case "institutions": return counts.institutions
      case "leaveRequests": return counts.leaveRequests
      case "loginHistory": return counts.loginHistory
      case "shiftSettings": return counts.shiftSettings
      default: return 0
    }
  }

  // Only show for SuperAdmin
  if (!user || user.role !== "SuperAdmin") {
    return null
  }

  return (
    <>
      <Card className="border-2 border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <AlertTriangle className="h-6 w-6" />
            SuperAdmin: Data Management & Deletion
          </CardTitle>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            Permanently delete database data with automatic email backup to all admins
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {fetchingCounts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading database statistics...</span>
            </div>
          ) : counts ? (
            <div className="bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Current Database Records
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300 text-xs font-medium mb-1">
                    <Mail className="h-3 w-3" />
                    Notifications
                  </div>
                  <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">{counts.notifications.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-lg p-3 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300 text-xs font-medium mb-1">
                    <Clock className="h-3 w-3" />
                    Attendance
                  </div>
                  <div className="text-2xl font-bold text-red-800 dark:text-red-200">{counts.attendance.toLocaleString()}</div>
                  {attendanceBreakdown && (
                    <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                      P:{attendanceBreakdown.present} A:{attendanceBreakdown.absent} L:{attendanceBreakdown.late}
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-xs font-medium mb-1">
                    <Users className="h-3 w-3" />
                    Staff
                  </div>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{counts.staff.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg p-3 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-xs font-medium mb-1">
                    <Users className="h-3 w-3" />
                    Students
                  </div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200">{counts.students.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-xs font-medium mb-1">
                    <Building className="h-3 w-3" />
                    Institutions
                  </div>
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">{counts.institutions.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300 text-xs font-medium mb-1">
                    <FileCheck className="h-3 w-3" />
                    Leave Requests
                  </div>
                  <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{counts.leaveRequests.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-1">
                    <Clock className="h-3 w-3" />
                    Login History
                  </div>
                  <div className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">{counts.loginHistory.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 rounded-lg p-3 border border-pink-200 dark:border-pink-800">
                  <div className="flex items-center gap-2 text-pink-700 dark:text-pink-300 text-xs font-medium mb-1">
                    <Clock className="h-3 w-3" />
                    Shift Settings
                  </div>
                  <div className="text-2xl font-bold text-pink-800 dark:text-pink-200">{counts.shiftSettings.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Unable to load database statistics. Please refresh the page.
              </p>
            </div>
          )}

          {/* Feature Description */}
          <div className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              How It Works
            </h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-5 list-disc">
              <li>Exports selected data to PDF and XLSX formats</li>
              <li>Sends backup files via email to all Admin, Manager, and SuperAdmin users</li>
              <li>Permanently deletes data from active database after backup</li>
              <li>Provides detailed deletion statistics and confirmation</li>
            </ul>
          </div>

          {/* Deletion Options */}
          <div className="space-y-3">
            <h4 className="font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Select Data to Delete
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-auto py-4 px-4 justify-start text-left border-2 border-orange-300 hover:border-orange-500 hover:bg-orange-50 dark:border-orange-700 dark:hover:border-orange-500 dark:hover:bg-orange-950"
                onClick={() => handleDeleteRequest("notifications")}
                disabled={loading || fetchingCounts || !counts}
              >
                <div className="flex items-start gap-3 w-full">
                  <Mail className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-orange-800 dark:text-orange-200">
                      Notifications
                      {counts && <span className="ml-2 text-sm font-normal">({counts.notifications.toLocaleString()})</span>}
                    </div>
                  </div>
                  <Trash2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-auto py-4 px-4 justify-start text-left border-2 border-red-300 hover:border-red-500 hover:bg-red-50 dark:border-red-700 dark:hover:border-red-500 dark:hover:bg-red-950"
                onClick={() => handleDeleteRequest("attendance")}
                disabled={loading || fetchingCounts || !counts}
              >
                <div className="flex items-start gap-3 w-full">
                  <Clock className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-red-800 dark:text-red-200">
                      Attendance
                      {counts && <span className="ml-2 text-sm font-normal">({counts.attendance.toLocaleString()})</span>}
                    </div>
                  </div>
                  <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-auto py-4 px-4 justify-start text-left border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 dark:border-blue-700 dark:hover:border-blue-500 dark:hover:bg-blue-950"
                onClick={() => handleDeleteRequest("staff")}
                disabled={loading || fetchingCounts || !counts}
              >
                <div className="flex items-start gap-3 w-full">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-blue-800 dark:text-blue-200">
                      Staff
                      {counts && <span className="ml-2 text-sm font-normal">({counts.staff.toLocaleString()})</span>}
                    </div>
                  </div>
                  <Trash2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-auto py-4 px-4 justify-start text-left border-2 border-green-300 hover:border-green-500 hover:bg-green-50 dark:border-green-700 dark:hover:border-green-500 dark:hover:bg-green-950"
                onClick={() => handleDeleteRequest("students")}
                disabled={loading || fetchingCounts || !counts}
              >
                <div className="flex items-start gap-3 w-full">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-green-800 dark:text-green-200">
                      Students
                      {counts && <span className="ml-2 text-sm font-normal">({counts.students.toLocaleString()})</span>}
                    </div>
                  </div>
                  <Trash2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-auto py-4 px-4 justify-start text-left border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 dark:border-purple-700 dark:hover:border-purple-500 dark:hover:bg-purple-950"
                onClick={() => handleDeleteRequest("institutions")}
                disabled={loading || fetchingCounts || !counts}
              >
                <div className="flex items-start gap-3 w-full">
                  <Building className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-purple-800 dark:text-purple-200">
                      Institutions
                      {counts && <span className="ml-2 text-sm font-normal">({counts.institutions.toLocaleString()})</span>}
                    </div>
                  </div>
                  <Trash2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-auto py-4 px-4 justify-start text-left border-2 border-yellow-300 hover:border-yellow-500 hover:bg-yellow-50 dark:border-yellow-700 dark:hover:border-yellow-500 dark:hover:bg-yellow-950"
                onClick={() => handleDeleteRequest("leaveRequests")}
                disabled={loading || fetchingCounts || !counts}
              >
                <div className="flex items-start gap-3 w-full">
                  <FileCheck className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Leave Requests
                      {counts && <span className="ml-2 text-sm font-normal">({counts.leaveRequests.toLocaleString()})</span>}
                    </div>
                  </div>
                  <Trash2 className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-auto py-4 px-4 justify-start text-left border-2 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 dark:border-indigo-700 dark:hover:border-indigo-500 dark:hover:bg-indigo-950 md:col-span-2"
                onClick={() => handleDeleteRequest("loginHistory")}
                disabled={loading || fetchingCounts || !counts}
              >
                <div className="flex items-start gap-3 w-full">
                  <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-indigo-800 dark:text-indigo-200">
                      Login History
                      {counts && <span className="ml-2 text-sm font-normal">({counts.loginHistory.toLocaleString()})</span>}
                    </div>
                  </div>
                  <Trash2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-auto py-4 px-4 justify-start text-left border-2 border-pink-300 hover:border-pink-500 hover:bg-pink-50 dark:border-pink-700 dark:hover:border-pink-500 dark:hover:bg-pink-950 md:col-span-2"
                onClick={() => handleDeleteRequest("shiftSettings")}
                disabled={loading || fetchingCounts || !counts}
              >
                <div className="flex items-start gap-3 w-full">
                  <Clock className="h-5 w-5 text-pink-600 dark:text-pink-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-pink-800 dark:text-pink-200">
                      Shift Settings
                      {counts && <span className="ml-2 text-sm font-normal">({counts.shiftSettings.toLocaleString()})</span>}
                    </div>
                  </div>
                  <Trash2 className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-auto py-4 px-4 justify-start text-left border-2 border-red-500 hover:border-red-700 hover:bg-red-100 dark:border-red-600 dark:hover:border-red-700 dark:hover:bg-red-950 md:col-span-2"
                onClick={() => handleDeleteRequest("all")}
                disabled={loading || fetchingCounts || !counts}
              >
                <div className="flex items-start gap-3 w-full">
                  <AlertTriangle className="h-5 w-5 text-red-700 dark:text-red-300 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-red-900 dark:text-red-100">
                      Delete ALL Data
                      {counts && <span className="ml-2 text-sm font-normal">({Object.values(counts).reduce((sum: number, count: any) => sum + (count || 0), 0).toLocaleString()} total records)</span>}
                    </div>
                  </div>
                  <Trash2 className="h-4 w-4 text-red-700 dark:text-red-300" />
                </div>
              </Button>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-700 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200 font-semibold">⚠️ Warning:</p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              This action is <strong>permanent and cannot be undone</strong>. All admins will receive backup files via
              email before deletion.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedDataType && counts && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-red-50 dark:bg-red-950 border-b border-red-200 dark:border-red-800">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="h-6 w-6" />
                Confirm Permanent Data Deletion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">You are about to delete:</h4>
                <div className="text-3xl font-bold text-red-700 dark:text-red-300 text-center py-2">
                  {getRecordsToDelete().toLocaleString()} Records
                </div>
                <div className="text-center text-sm text-red-600 dark:text-red-400 mt-2">{getDataTypeLabel()}</div>
                
                <div className="mt-4 space-y-2 border-t border-red-200 dark:border-red-800 pt-4">
                  {selectedDataType === "all" ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 dark:text-red-300">Notifications:</span>
                        <span className="font-bold text-red-800 dark:text-red-200">{counts.notifications.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 dark:text-red-300">Attendance:</span>
                        <span className="font-bold text-red-800 dark:text-red-200">{counts.attendance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 dark:text-red-300">Staff:</span>
                        <span className="font-bold text-red-800 dark:text-red-200">{counts.staff.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 dark:text-red-300">Students:</span>
                        <span className="font-bold text-red-800 dark:text-red-200">{counts.students.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 dark:text-red-300">Institutions:</span>
                        <span className="font-bold text-red-800 dark:text-red-200">{counts.institutions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 dark:text-red-300">Leave Requests:</span>
                        <span className="font-bold text-red-800 dark:text-red-200">{counts.leaveRequests.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 dark:text-red-300">Login History:</span>
                        <span className="font-bold text-red-800 dark:text-red-200">{counts.loginHistory.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 dark:text-red-300">Shift Settings:</span>
                        <span className="font-bold text-red-800 dark:text-red-200">{counts.shiftSettings.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-red-700 dark:text-red-300">{getDataTypeLabel()}:</span>
                      <span className="font-bold text-red-800 dark:text-red-200">{getRecordsToDelete().toLocaleString()}</span>
                    </div>
                  )}
                  
                  {selectedDataType === "attendance" && attendanceBreakdown && (
                    <div className="ml-4 space-y-1 text-xs border-t border-red-200 dark:border-red-800 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-red-600 dark:text-red-400">Present:</span>
                        <span className="text-red-700 dark:text-red-300">{attendanceBreakdown.present.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600 dark:text-red-400">Absent:</span>
                        <span className="text-red-700 dark:text-red-300">{attendanceBreakdown.absent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600 dark:text-red-400">Late:</span>
                        <span className="text-red-700 dark:text-red-300">{attendanceBreakdown.late.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* What Will Happen */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">What will happen:</h4>
                <div className="space-y-2 ml-5">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Data will be exported to <strong>PDF</strong> format
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Data will be exported to <strong>XLSX</strong> format
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Backup files will be <strong>emailed to all admins</strong> (Admin, Manager, SuperAdmin roles)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>{getRecordsToDelete().toLocaleString()} records</strong> will be permanently deleted from the database
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning Box */}
              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  This action cannot be undone!
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                  Once confirmed, <strong>{getRecordsToDelete().toLocaleString()} records</strong> will be permanently removed from the active database. Only the backup files
                  sent via email will remain.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirmModal(false)
                    setSelectedDataType(null)
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  className="flex-1 gap-2 bg-red-600 hover:bg-red-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting & Emailing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Confirm Deletion
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, FileText, Check, X, Eye, Mail, History, Download, ExternalLink, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getStoredUser, hasMinimumRole } from "@/lib/auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export default function LeaveApprovalPage() {
  const [user, setUser] = useState(null)
  const [leaveRequests, setLeaveRequests] = useState([])
  const [approvalHistory, setApprovalHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [reviewComments, setReviewComments] = useState("")
  const [processing, setProcessing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)

    if (storedUser && (hasMinimumRole("Teacher") || hasMinimumRole("Manager"))) {
      fetchPendingLeaveRequests()
    }
  }, [])

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      router.refresh()
      if (user && (hasMinimumRole("Teacher") || hasMinimumRole("Manager"))) {
        fetchPendingLeaveRequests()
      }
    }, 20000)

    return () => clearInterval(refreshInterval)
  }, [router, user])

  const fetchPendingLeaveRequests = async () => {
    try {
      const u = getStoredUser()
      const inst = u?.role !== "SuperAdmin" ? u?.institutionName : undefined
      const url = `/api/leave-requests?status=pending${inst ? `&institutionName=${encodeURIComponent(inst)}` : ""}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        let filteredRequests = data.leaveRequests
        if (user?.role === "Teacher") {
          filteredRequests = data.leaveRequests.filter((req) => req.personType === "student")
        }
        setLeaveRequests(filteredRequests)
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchApprovalHistory = async () => {
    setHistoryLoading(true)
    try {
      const u = getStoredUser()
      const inst = u?.role !== "SuperAdmin" ? u?.institutionName : undefined
      const url = `/api/leave-requests?status=approved,rejected${inst ? `&institutionName=${encodeURIComponent(inst)}` : ""}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        let filteredHistory = data.leaveRequests.filter((req) => req.status === "approved" || req.status === "rejected")
        if (user?.role === "Teacher") {
          filteredHistory = filteredHistory.filter((req) => req.personType === "student")
        }
        // Sort by review date, most recent first
        filteredHistory.sort(
          (a, b) => new Date(b.reviewedDate || b.updatedAt) - new Date(a.reviewedDate || a.updatedAt),
        )
        setApprovalHistory(filteredHistory)
      }
    } catch (error) {
      console.error("Error fetching approval history:", error)
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleApproval = async (requestId, status) => {
    if (!selectedRequest) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/leave-requests/${requestId}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          reviewComments: reviewComments.trim(),
          reviewerId: user?.id,
          reviewerName: user?.name,
        }),
      })

      if (response.ok) {
        await fetchPendingLeaveRequests()
        setSelectedRequest(null)
        setReviewComments("")
        alert(`Leave request ${status} successfully!`)
      } else {
        throw new Error("Failed to process request")
      }
    } catch (error) {
      console.error("Error processing leave request:", error)
      alert("Failed to process leave request")
    } finally {
      setProcessing(false)
    }
  }

  const deleteRequest = async (id: string, from: "pending" | "history") => {
    if (!confirm("Delete this leave request?")) return
    try {
      setDeletingId(id)
      const res = await fetch("/api/leave-requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        console.error("[v0] Delete failed:", json)
        alert(json?.error || "Failed to delete leave request")
        return
      }
      if (from === "pending") {
        setLeaveRequests((prev) => prev.filter((r) => r.id !== id))
      } else {
        setApprovalHistory((prev) => prev.filter((r) => r.id !== id))
      }
      if (selectedRequest?.id === id) {
        setSelectedRequest(null)
        setReviewComments("")
      }
    } catch (error) {
      console.error("[v0] Error deleting leave request:", error)
      alert("Error deleting leave request. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getLeaveTypeLabel = (type) => {
    const labels = {
      sick: "Sick Leave",
      casual: "Casual Leave",
      annual: "Annual Leave",
      maternity: "Maternity Leave",
      emergency: "Emergency Leave",
      other: "Other Leave",
    }
    return labels[type] || type
  }

  const getFileTypeIcon = (fileName) => {
    if (!fileName || typeof fileName !== "string") {
      return "📎" // Default icon for invalid/missing filenames
    }

    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return "📄"
      case "doc":
      case "docx":
        return "📝"
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️"
      default:
        return "📎"
    }
  }

  const handleDocumentView = async (attachment) => {
    let url, fileName

    if (typeof attachment === "string") {
      // Legacy format: just URL string
      url = attachment
      fileName = attachment.split("/").pop() || "document"
    } else {
      // New format: object with url and fileName
      url = attachment.url
      fileName = attachment.fileName
    }

    if (!url) {
      console.error("No URL found for attachment:", attachment)
      alert("Unable to open document - invalid URL")
      return
    }

    try {
      // Check if it's a PDF file
      const isPDF = fileName.toLowerCase().endsWith(".pdf") || url.toLowerCase().includes(".pdf")

      if (isPDF) {
        // For PDFs, try to open in new tab with fallback
        const newWindow = window.open("", "_blank")

        if (!newWindow) {
          // Popup blocked - show alert and provide download option
          const shouldDownload = confirm(
            "Popup blocked! PDF cannot be opened in a new tab.\n\nWould you like to download the document instead?",
          )
          if (shouldDownload) {
            const link = document.createElement("a")
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
          return
        }

        // Set up the new window with loading message
        newWindow.document.write(`
          <html>
            <head>
              <title>Loading ${fileName}...</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  height: 100vh; 
                  margin: 0; 
                  background: #f5f5f5;
                }
                .loading { 
                  text-align: center; 
                  padding: 20px;
                  background: white;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .spinner {
                  border: 4px solid #f3f3f3;
                  border-top: 4px solid #3498db;
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                  animation: spin 2s linear infinite;
                  margin: 0 auto 20px;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                .error {
                  color: #e74c3c;
                  margin-top: 20px;
                }
                .download-btn {
                  background: #3498db;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 4px;
                  cursor: pointer;
                  margin-top: 15px;
                }
                .download-btn:hover {
                  background: #2980b9;
                }
              </style>
            </head>
            <body>
              <div class="loading">
                <div class="spinner"></div>
                <h3>Loading PDF Document...</h3>
                <p>Please wait while we load ${fileName}</p>
                <div id="error-message" class="error" style="display: none;">
                  <p>Failed to load PDF document.</p>
                  <p>This might be due to browser compatibility or network issues.</p>
                  <button class="download-btn" onclick="downloadFile()">Download Instead</button>
                </div>
              </div>
              <script>
                function downloadFile() {
                  const link = document.createElement('a');
                  link.href = '${url}';
                  link.download = '${fileName}';
                  link.click();
                }
                
                // Try to load the PDF
                setTimeout(() => {
                  try {
                    window.location.href = '${url}';
                  } catch (error) {
                    document.getElementById('error-message').style.display = 'block';
                    document.querySelector('.spinner').style.display = 'none';
                    document.querySelector('h3').textContent = 'Error Loading PDF';
                  }
                }, 1000);
                
                // Fallback timeout - if PDF doesn't load in 10 seconds, show error
                setTimeout(() => {
                  if (window.location.href === 'about:blank' || window.location.href.includes('blob:')) {
                    document.getElementById('error-message').style.display = 'block';
                    document.querySelector('.spinner').style.display = 'none';
                    document.querySelector('h3').textContent = 'PDF Loading Timeout';
                  }
                }, 10000);
              </script>
            </body>
          </html>
        `)
      } else {
        // For non-PDF files, open directly
        const newWindow = window.open(url, "_blank")
        if (!newWindow) {
          alert("Popup blocked! Please allow popups for this site to view documents.")
        }
      }
    } catch (error) {
      console.error("Error opening document:", error)
      const shouldDownload = confirm(`Failed to open ${fileName}.\n\nWould you like to download the document instead?`)
      if (shouldDownload) {
        try {
          const link = document.createElement("a")
          link.href = url
          link.download = fileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } catch (downloadError) {
          console.error("Download failed:", downloadError)
          alert("Unable to download the document. Please check the URL and try again.")
        }
      }
    }
  }

  const getAttachmentInfo = (attachment) => {
    if (typeof attachment === "string") {
      // Legacy format: extract filename from URL
      const fileName = attachment.split("/").pop()?.split("?")[0] || "document"
      return { url: attachment, fileName }
    } else {
      // New format: use provided fileName and url
      return { url: attachment.url, fileName: attachment.fileName }
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leave requests...</p>
        </div>
      </div>
    )
  }

  if (!hasMinimumRole("Teacher")) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access leave approvals.</p>
          <p className="text-sm text-gray-500 mt-2">Required role: Teacher or higher</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {user?.institutionName && (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded mb-1">
              {user.institutionName}
            </div>
          )}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Leave Approval Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === "Teacher"
              ? "Review and approve student leave requests"
              : "Review and approve pending leave requests"}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">{leaveRequests.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-700">Staff Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              {leaveRequests.filter((req) => req.personType === "staff").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-purple-700">Student Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">
              {leaveRequests.filter((req) => req.personType === "student").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Pending Requests ({leaveRequests.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2" onClick={fetchApprovalHistory}>
            <History className="h-4 w-4" />
            Approval History ({approvalHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {/* Pending Leave Requests */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Pending Leave Requests
                {user?.role === "Teacher" && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Student Requests Only
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaveRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-500">
                    {user?.role === "Teacher"
                      ? "No pending student leave requests to review"
                      : "No pending leave requests to review"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="font-semibold text-gray-900">{request.personName}</span>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              {request.personType === "staff" ? "Staff" : "Student"}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span>{request.personEmail}</span>
                            </div>
                          </div>

                          <div className="mb-3">
                            <h3 className="font-medium text-gray-900 mb-1">{getLeaveTypeLabel(request.leaveType)}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {format(new Date(request.startDate), "MMM dd")} -{" "}
                                  {format(new Date(request.endDate), "MMM dd, yyyy")}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{request.totalDays} working days</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>Applied {format(new Date(request.appliedDate), "MMM dd, yyyy")}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md mb-3">{request.reason}</p>

                          {/* Supporting Documents Display */}
                          {request.attachments && request.attachments.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Supporting Documents ({request.attachments.length})
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {request.attachments.map((attachment, index) => {
                                  const { url, fileName } = getAttachmentInfo(attachment)
                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-sm"
                                    >
                                      <span className="text-lg">{getFileTypeIcon(fileName)}</span>
                                      <span className="text-blue-800 font-medium truncate max-w-[150px]">
                                        {fileName}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                                        onClick={() => handleDocumentView(attachment)}
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedRequest(request)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteRequest(request.id, "pending")}
                            disabled={deletingId === request.id}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {deletingId === request.id ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Leave Approval History
                {user?.role === "Teacher" && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Student Requests Only
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading approval history...</p>
                  </div>
                </div>
              ) : approvalHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No approval history</h3>
                  <p className="text-gray-500">
                    {user?.role === "Teacher"
                      ? "No student leave requests have been reviewed yet"
                      : "No leave requests have been reviewed yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvalHistory.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="font-semibold text-gray-900">{request.personName}</span>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              {request.personType === "staff" ? "Staff" : "Student"}
                            </Badge>
                            <Badge className={`${getStatusColor(request.status)} font-medium`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span>{request.personEmail}</span>
                            </div>
                          </div>

                          <div className="mb-3">
                            <h3 className="font-medium text-gray-900 mb-1">{getLeaveTypeLabel(request.leaveType)}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {format(new Date(request.startDate), "MMM dd")} -{" "}
                                  {format(new Date(request.endDate), "MMM dd, yyyy")}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{request.totalDays} working days</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>Applied {format(new Date(request.appliedDate), "MMM dd, yyyy")}</span>
                              </div>
                              {request.reviewedDate && (
                                <div className="flex items-center gap-2">
                                  <Check className="h-4 w-4" />
                                  <span>Reviewed {format(new Date(request.reviewedDate), "MMM dd, yyyy")}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md mb-3">{request.reason}</p>

                          {/* Supporting Documents Display */}
                          {request.attachments && request.attachments.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Supporting Documents ({request.attachments.length})
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {request.attachments.map((attachment, index) => {
                                  const { url, fileName } = getAttachmentInfo(attachment)
                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-sm"
                                    >
                                      <span className="text-lg">{getFileTypeIcon(fileName)}</span>
                                      <span className="text-blue-800 font-medium truncate max-w-[150px]">
                                        {fileName}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                                        onClick={() => handleDocumentView(attachment)}
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {request.reviewComments && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                              <p className="text-sm font-medium text-blue-800 mb-1">Review Comments:</p>
                              <p className="text-sm text-blue-700">{request.reviewComments}</p>
                              {request.approverName && (
                                <p className="text-xs text-blue-600 mt-1">Reviewed by {request.approverName}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteRequest(request.id, "history")}
                            disabled={deletingId === request.id}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {deletingId === request.id ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Leave Request</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Request Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Requester:</span>
                    <p className="text-gray-900">{selectedRequest.personName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <p className="text-gray-900">{selectedRequest.personType === "staff" ? "Staff" : "Student"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Leave Type:</span>
                    <p className="text-gray-900">{getLeaveTypeLabel(selectedRequest.leaveType)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <p className="text-gray-900">{selectedRequest.totalDays} working days</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Period:</span>
                    <p className="text-gray-900">
                      {format(new Date(selectedRequest.startDate), "MMMM dd, yyyy")} -{" "}
                      {format(new Date(selectedRequest.endDate), "MMMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Reason for Leave</h3>
                <p className="text-gray-700 bg-white p-3 border rounded-md">{selectedRequest.reason}</p>
              </div>

              {/* Supporting Documents Section */}
              {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Supporting Documents ({selectedRequest.attachments.length})
                  </h3>
                  <div className="bg-white border rounded-md p-3">
                    <div className="grid grid-cols-1 gap-3">
                      {selectedRequest.attachments.map((attachment, index) => {
                        const { url, fileName } = getAttachmentInfo(attachment)
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getFileTypeIcon(fileName)}</span>
                              <div>
                                <p className="font-medium text-gray-900">{fileName}</p>
                                <p className="text-sm text-gray-500">Medical certificate, official document, etc.</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDocumentView(attachment)}
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (!url) {
                                    alert("Unable to download - invalid URL")
                                    return
                                  }
                                  const link = document.createElement("a")
                                  link.href = url
                                  link.download = fileName
                                  link.click()
                                }}
                                className="flex items-center gap-2"
                              >
                                <Download className="h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Review Comments */}
              <div className="space-y-2">
                <Label htmlFor="review-comments">Review Comments (Optional)</Label>
                <Textarea
                  id="review-comments"
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Add any comments about your decision..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleApproval(selectedRequest.id, "approved")}
                  disabled={processing}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="mr-2 h-4 w-4" />
                  {processing ? "Processing..." : "Approve"}
                </Button>
                <Button
                  onClick={() => handleApproval(selectedRequest.id, "rejected")}
                  disabled={processing}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="mr-2 h-4 w-4" />
                  {processing ? "Processing..." : "Reject"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRequest(null)
                    setReviewComments("")
                  }}
                  disabled={processing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

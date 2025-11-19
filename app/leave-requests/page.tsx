
// // "use client"

// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Badge } from "@/components/ui/badge"
// // import { Calendar, Clock, FileText, Plus, Trash2 } from "lucide-react"
// // import { useEffect, useState } from "react"
// // import { getStoredUser, type User } from "@/lib/auth"
// // import { LeaveRequestModal } from "@/components/leave-request-modal"
// // import type { LeaveRequest } from "@/lib/types"
// // import { format } from "date-fns"

// // export default function LeaveRequestsPage() {
// //   const [user, setUser] = useState<User | null>(null)
// //   const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [showRequestModal, setShowRequestModal] = useState(false)
// //   const [deletingId, setDeletingId] = useState<string | null>(null)

// //   useEffect(() => {
// //     const storedUser = getStoredUser()
// //     setUser(storedUser)

// //     if (storedUser) {
// //       fetchLeaveRequests(storedUser.id)
// //     }
// //   }, [])

// //   const fetchLeaveRequests = async (personId: string) => {
// //     try {
// //       const response = await fetch(`/api/leave-requests?personId=${personId}`)
// //       if (response.ok) {
// //         const data = await response.json()
// //         setLeaveRequests(data.leaveRequests)
// //       }
// //     } catch (error) {
// //       console.error("Error fetching leave requests:", error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const getStatusColor = (status: string) => {
// //     switch (status) {
// //       case "approved":
// //         return "bg-green-100 text-green-800 border-green-200"
// //       case "rejected":
// //         return "bg-red-100 text-red-800 border-red-200"
// //       case "pending":
// //         return "bg-yellow-100 text-yellow-800 border-yellow-200"
// //       default:
// //         return "bg-gray-100 text-gray-800 border-gray-200"
// //     }
// //   }

// //   const getLeaveTypeLabel = (type: string) => {
// //     const labels: Record<string, string> = {
// //       sick: "Sick Leave",
// //       casual: "Casual Leave",
// //       annual: "Annual Leave",
// //       maternity: "Maternity Leave",
// //       emergency: "Emergency Leave",
// //       other: "Other Leave",
// //     }
// //     return labels[type] || type
// //   }

// //   const exportLeaveRequestsCsv = () => {
// //     try {
// //       const headers = [
// //         "Type",
// //         "Start Date",
// //         "End Date",
// //         "Total Days",
// //         "Status",
// //         "Reason",
// //         "Applied Date",
// //         "Reviewed By",
// //         "Reviewed Date",
// //         "Review Comments",
// //       ]

// //       const rows = leaveRequests.map((req) => [
// //         req.leaveType,
// //         req.startDate,
// //         req.endDate,
// //         req.totalDays,
// //         req.status,
// //         req.reason,
// //         req.appliedDate,
// //         req.reviewedBy || "",
// //         req.reviewedDate || "",
// //         req.reviewComments || "",
// //       ])

// //       const escapeCsv = (val: unknown) => `"${String(val ?? "").replace(/"/g, '""')}"`

// //       const csv = [headers, ...rows].map((r) => r.map(escapeCsv).join(",")).join("\n")

// //       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
// //       const url = window.URL.createObjectURL(blob)
// //       const a = document.createElement("a")
// //       const datePart = new Date().toISOString().slice(0, 10)
// //       a.href = url
// //       a.download = `leave-requests-${datePart}.csv`
// //       document.body.appendChild(a)
// //       a.click()
// //       window.URL.revokeObjectURL(url)
// //       document.body.removeChild(a)
// //     } catch (err) {
// //       console.error("[v0] Failed to export leave requests CSV:", err)
// //     }
// //   }

// //   const deleteLeaveRequest = async (id: string) => {
// //     if (!confirm("Delete this leave request?")) return
// //     try {
// //       setDeletingId(id)
// //       const res = await fetch("/api/leave-requests", {
// //         method: "DELETE",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ id, personId: user?.id }),
// //       })
// //       const json = await res.json().catch(() => ({}))
// //       if (!res.ok) {
// //         console.error("[v0] Delete failed:", json)
// //         alert(json?.error || "Failed to delete leave request")
// //         return
// //       }
// //       setLeaveRequests((prev) => prev.filter((r) => r.id !== id))
// //     } catch (error) {
// //       console.error("[v0] Error deleting leave request:", error)
// //       alert("Error deleting leave request. Please try again.")
// //     } finally {
// //       setDeletingId(null)
// //     }
// //   }

// //   if (loading || !user) {
// //     return (
// //       <div className="flex items-center justify-center min-h-[400px]">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
// //           <p className="text-gray-600">Loading leave requests...</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
// //             My Leave Requests <span className="text-sm text-gray-600">({leaveRequests.length})</span>
// //           </h1>
// //           <p className="text-gray-600 mt-1">Manage and track your leave applications</p>
// //         </div>
// //         <div className="flex items-center gap-2">
// //           <Button
// //             variant="outline"
// //             onClick={exportLeaveRequestsCsv}
// //             className="border-teal-200 text-teal-700 hover:bg-teal-50 bg-transparent"
// //           >
// //             Export CSV
// //           </Button>
// //           <Button
// //             onClick={() => setShowRequestModal(true)}
// //             className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
// //           >
// //             <Plus className="mr-2 h-4 w-4" />
// //             Request Leave
// //           </Button>
// //         </div>
// //       </div>

// //       {/* Statistics Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //         <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
// //           <CardHeader className="pb-2">
// //             <CardTitle className="text-sm font-medium text-blue-700">Total Requests</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-blue-800">{leaveRequests.length}</div>
// //           </CardContent>
// //         </Card>

// //         <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200">
// //           <CardHeader className="pb-2">
// //             <CardTitle className="text-sm font-medium text-yellow-700">Pending</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-yellow-800">
// //               {leaveRequests.filter((req) => req.status === "pending").length}
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
// //           <CardHeader className="pb-2">
// //             <CardTitle className="text-sm font-medium text-green-700">Approved</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-green-800">
// //               {leaveRequests.filter((req) => req.status === "approved").length}
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200">
// //           <CardHeader className="pb-2">
// //             <CardTitle className="text-sm font-medium text-red-700">Rejected</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-red-800">
// //               {leaveRequests.filter((req) => req.status === "rejected").length}
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Leave Requests List */}
// //       <Card className="shadow-lg">
// //         <CardHeader>
// //           <CardTitle className="flex items-center gap-2">
// //             <FileText className="h-5 w-5" />
// //             Leave Requests History
// //           </CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           {leaveRequests.length === 0 ? (
// //             <div className="text-center py-12">
// //               <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
// //               <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests yet</h3>
// //               <p className="text-gray-500 mb-4">Start by creating your first leave request</p>
// //               <Button
// //                 onClick={() => setShowRequestModal(true)}
// //                 className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
// //               >
// //                 <Plus className="mr-2 h-4 w-4" />
// //                 Request Leave
// //               </Button>
// //             </div>
// //           ) : (
// //             <div className="space-y-4">
// //               {leaveRequests.map((request) => (
// //                 <div
// //                   key={request.id}
// //                   className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
// //                 >
// //                   <div className="flex items-start justify-between">
// //                     <div className="flex-1">
// //                       <div className="flex items-center gap-3 mb-2">
// //                         <h3 className="font-semibold text-gray-900">{getLeaveTypeLabel(request.leaveType)}</h3>
// //                         <Badge className={`${getStatusColor(request.status)} font-medium`}>
// //                           {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
// //                         </Badge>
// //                       </div>

// //                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
// //                         <div className="flex items-center gap-2">
// //                           <Calendar className="h-4 w-4" />
// //                           <span>
// //                             {format(new Date(request.startDate), "MMM dd")} -{" "}
// //                             {format(new Date(request.endDate), "MMM dd, yyyy")}
// //                           </span>
// //                         </div>
// //                         <div className="flex items-center gap-2">
// //                           <Clock className="h-4 w-4" />
// //                           <span>{request.totalDays} working days</span>
// //                         </div>
// //                         <div className="flex items-center gap-2">
// //                           <FileText className="h-4 w-4" />
// //                           <span>Applied {format(new Date(request.appliedDate), "MMM dd, yyyy")}</span>
// //                         </div>
// //                       </div>

// //                       <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{request.reason}</p>

// //                       {request.reviewComments && (
// //                         <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
// //                           <p className="text-sm font-medium text-blue-800 mb-1">Review Comments:</p>
// //                           <p className="text-sm text-blue-700">{request.reviewComments}</p>
// //                           {request.reviewedDate && (
// //                             <p className="text-xs text-blue-600 mt-1">
// //                               Reviewed on {format(new Date(request.reviewedDate), "MMM dd, yyyy")}
// //                             </p>
// //                           )}
// //                         </div>
// //                       )}
// //                     </div>
// //                     <div className="ml-4">
// //                       <Button
// //                         variant="destructive"
// //                         size="sm"
// //                         onClick={() => deleteLeaveRequest(request.id)}
// //                         disabled={deletingId === request.id}
// //                       >
// //                         <Trash2 className="h-4 w-4 mr-1" />
// //                         {deletingId === request.id ? "Deleting..." : "Delete"}
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </CardContent>
// //       </Card>

// //       <LeaveRequestModal
// //         isOpen={showRequestModal}
// //         onClose={() => setShowRequestModal(false)}
// //         personId={user.id}
// //         personType={user.role === "Student" ? "student" : "staff"}
// //         personName={user.name}
// //         department={user.department}
// //         role={user.role}
// //       />
// //     </div>
// //   )
// // }




// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Calendar, Clock, FileText, Plus, Trash2 } from "lucide-react"
// import { useEffect, useState } from "react"
// import { getStoredUser, type User } from "@/lib/auth"
// import { LeaveRequestModal } from "@/components/leave-request-modal"
// import type { LeaveRequest } from "@/lib/types"
// import { format } from "date-fns"

// export default function LeaveRequestsPage() {
//   const [user, setUser] = useState<User | null>(null)
//   const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
//   const [loading, setLoading] = useState(true)
//   const [showRequestModal, setShowRequestModal] = useState(false)
//   const [deletingId, setDeletingId] = useState<string | null>(null)

//   useEffect(() => {
//     const storedUser = getStoredUser()
//     setUser(storedUser)

//     if (storedUser) {
//       fetchLeaveRequests(storedUser.id)
//     }
//   }, [])

//   const fetchLeaveRequests = async (personId: string) => {
//     try {
//       const response = await fetch(`/api/leave-requests?personId=${personId}`)
//       if (response.ok) {
//         const data = await response.json()
//         setLeaveRequests(data.leaveRequests)
//       }
//     } catch (error) {
//       console.error("Error fetching leave requests:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "approved":
//         return "bg-green-100 text-green-800 border-green-200"
//       case "rejected":
//         return "bg-red-100 text-red-800 border-red-200"
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200"
//     }
//   }

//   const getLeaveTypeLabel = (type: string) => {
//     const labels: Record<string, string> = {
//       sick: "Sick Leave",
//       casual: "Casual Leave",
//       annual: "Annual Leave",
//       maternity: "Maternity Leave",
//       emergency: "Emergency Leave",
//       other: "Other Leave",
//     }
//     return labels[type] || type
//   }

//   const exportLeaveRequestsCsv = () => {
//     try {
//       const headers = [
//         "Type",
//         "Start Date",
//         "End Date",
//         "Total Days",
//         "Status",
//         "Reason",
//         "Applied Date",
//         "Reviewed By",
//         "Reviewed Date",
//         "Review Comments",
//       ]

//       const rows = leaveRequests.map((req) => [
//         req.leaveType,
//         req.startDate,
//         req.endDate,
//         req.totalDays,
//         req.status,
//         req.reason,
//         req.appliedDate,
//         req.reviewedBy || "",
//         req.reviewedDate || "",
//         req.reviewComments || "",
//       ])

//       const escapeCsv = (val: unknown) => `"${String(val ?? "").replace(/"/g, '""')}"`

//       const csv = [headers, ...rows].map((r) => r.map(escapeCsv).join(",")).join("\n")

//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       const datePart = new Date().toISOString().slice(0, 10)
//       a.href = url
//       a.download = `leave-requests-${datePart}.csv`
//       document.body.appendChild(a)
//       a.click()
//       window.URL.revokeObjectURL(url)
//       document.body.removeChild(a)
//     } catch (err) {
//       console.error("[v0] Failed to export leave requests CSV:", err)
//     }
//   }

//   const deleteLeaveRequest = async (id: string) => {
//     if (!confirm("Delete this leave request?")) return
//     try {
//       setDeletingId(id)
//       const res = await fetch("/api/leave-requests", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id, personId: user?.id }),
//       })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok) {
//         console.error("[v0] Delete failed:", json)
//         alert(json?.error || "Failed to delete leave request")
//         return
//       }
//       setLeaveRequests((prev) => prev.filter((r) => r.id !== id))
//     } catch (error) {
//       console.error("[v0] Error deleting leave request:", error)
//       alert("Error deleting leave request. Please try again.")
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   if (loading || !user) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading leave requests...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4 md:space-y-6 pb-20 md:pb-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
//             My Leave Requests <span className="text-xs md:text-sm text-gray-600">({leaveRequests.length})</span>
//           </h1>
//           <p className="text-sm md:text-base text-gray-600 mt-1">Manage and track your leave applications</p>
//         </div>
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
//           <Button
//             variant="outline"
//             onClick={exportLeaveRequestsCsv}
//             className="border-teal-200 text-teal-700 hover:bg-teal-50 bg-transparent text-sm"
//           >
//             Export CSV
//           </Button>
//           <Button
//             onClick={() => setShowRequestModal(true)}
//             className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Request Leave
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
//         <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
//           <CardHeader className="pb-2 px-3 pt-3 md:px-6 md:pt-6">
//             <CardTitle className="text-xs md:text-sm font-medium text-blue-700">Total Requests</CardTitle>
//           </CardHeader>
//           <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
//             <div className="text-xl md:text-2xl font-bold text-blue-800">{leaveRequests.length}</div>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200">
//           <CardHeader className="pb-2 px-3 pt-3 md:px-6 md:pt-6">
//             <CardTitle className="text-xs md:text-sm font-medium text-yellow-700">Pending</CardTitle>
//           </CardHeader>
//           <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
//             <div className="text-xl md:text-2xl font-bold text-yellow-800">
//               {leaveRequests.filter((req) => req.status === "pending").length}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
//           <CardHeader className="pb-2 px-3 pt-3 md:px-6 md:pt-6">
//             <CardTitle className="text-xs md:text-sm font-medium text-green-700">Approved</CardTitle>
//           </CardHeader>
//           <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
//             <div className="text-xl md:text-2xl font-bold text-green-800">
//               {leaveRequests.filter((req) => req.status === "approved").length}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200">
//           <CardHeader className="pb-2 px-3 pt-3 md:px-6 md:pt-6">
//             <CardTitle className="text-xs md:text-sm font-medium text-red-700">Rejected</CardTitle>
//           </CardHeader>
//           <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
//             <div className="text-xl md:text-2xl font-bold text-red-800">
//               {leaveRequests.filter((req) => req.status === "rejected").length}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="shadow-lg">
//         <CardHeader className="px-4 py-4 md:px-6 md:py-6">
//           <CardTitle className="flex items-center gap-2 text-base md:text-lg">
//             <FileText className="h-4 w-4 md:h-5 md:w-5" />
//             Leave Requests History
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="px-4 md:px-6">
//           {leaveRequests.length === 0 ? (
//             <div className="text-center py-8 md:py-12">
//               <FileText className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No leave requests yet</h3>
//               <p className="text-sm md:text-base text-gray-500 mb-4">Start by creating your first leave request</p>
//               <Button
//                 onClick={() => setShowRequestModal(true)}
//                 className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-sm"
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Request Leave
//               </Button>
//             </div>
//           ) : (
//             <div className="space-y-3 md:space-y-4">
//               {leaveRequests.map((request) => (
//                 <div
//                   key={request.id}
//                   className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow duration-200"
//                 >
//                   <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
//                         <h3 className="font-semibold text-sm md:text-base text-gray-900">
//                           {getLeaveTypeLabel(request.leaveType)}
//                         </h3>
//                         <Badge className={`${getStatusColor(request.status)} font-medium text-xs`}>
//                           {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//                         </Badge>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-3">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
//                           <span className="truncate">
//                             {format(new Date(request.startDate), "MMM dd")} -{" "}
//                             {format(new Date(request.endDate), "MMM dd, yyyy")}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Clock className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
//                           <span>{request.totalDays} working days</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <FileText className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
//                           <span>Applied {format(new Date(request.appliedDate), "MMM dd, yyyy")}</span>
//                         </div>
//                       </div>

//                       <p className="text-xs md:text-sm text-gray-700 bg-gray-50 p-2 md:p-3 rounded-md break-words">
//                         {request.reason}
//                       </p>

//                       {request.reviewComments && (
//                         <div className="mt-2 md:mt-3 p-2 md:p-3 bg-blue-50 border border-blue-200 rounded-md">
//                           <p className="text-xs md:text-sm font-medium text-blue-800 mb-1">Review Comments:</p>
//                           <p className="text-xs md:text-sm text-blue-700 break-words">{request.reviewComments}</p>
//                           {request.reviewedDate && (
//                             <p className="text-xs text-blue-600 mt-1">
//                               Reviewed on {format(new Date(request.reviewedDate), "MMM dd, yyyy")}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                     <div className="md:ml-4 w-full md:w-auto">
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => deleteLeaveRequest(request.id)}
//                         disabled={deletingId === request.id}
//                         className="w-full md:w-auto text-xs md:text-sm"
//                       >
//                         <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
//                         {deletingId === request.id ? "Deleting..." : "Delete"}
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <LeaveRequestModal
//         isOpen={showRequestModal}
//         onClose={() => setShowRequestModal(false)}
//         personId={user.id}
//         personType={user.role === "Student" ? "student" : "staff"}
//         personName={user.name}
//         department={user.department}
//         role={user.role}
//       />
//     </div>
//   )
// }



"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from "react"
import { getStoredUser, type User } from "@/lib/auth"
import { LeaveRequestModal } from "@/components/leave-request-modal"
import type { LeaveRequest } from "@/lib/types"
import { format } from "date-fns"
import { ModernLoader } from "@/components/modern-loader"

export default function LeaveRequestsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)

    if (storedUser) {
      fetchLeaveRequests(storedUser.id)
    }
  }, [])

  const fetchLeaveRequests = async (personId: string) => {
    try {
      const response = await fetch(`/api/leave-requests?personId=${personId}`)
      if (response.ok) {
        const data = await response.json()
        setLeaveRequests(data.leaveRequests)
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getLeaveTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sick: "Sick Leave",
      casual: "Casual Leave",
      annual: "Annual Leave",
      maternity: "Maternity Leave",
      emergency: "Emergency Leave",
      other: "Other Leave",
    }
    return labels[type] || type
  }

  const exportLeaveRequestsCsv = () => {
    try {
      const headers = [
        "Type",
        "Start Date",
        "End Date",
        "Total Days",
        "Status",
        "Reason",
        "Applied Date",
        "Reviewed By",
        "Reviewed Date",
        "Review Comments",
      ]

      const rows = leaveRequests.map((req) => [
        req.leaveType,
        req.startDate,
        req.endDate,
        req.totalDays,
        req.status,
        req.reason,
        req.appliedDate,
        req.reviewedBy || "",
        req.reviewedDate || "",
        req.reviewComments || "",
      ])

      const escapeCsv = (val: unknown) => `"${String(val ?? "").replace(/"/g, '""')}"`

      const csv = [headers, ...rows].map((r) => r.map(escapeCsv).join(",")).join("\n")

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      const datePart = new Date().toISOString().slice(0, 10)
      a.href = url
      a.download = `leave-requests-${datePart}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("[v0] Failed to export leave requests CSV:", err)
    }
  }

  const deleteLeaveRequest = async (id: string) => {
    if (!confirm("Delete this leave request?")) return
    try {
      setDeletingId(id)
      const res = await fetch("/api/leave-requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, personId: user?.id }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        console.error("[v0] Delete failed:", json)
        alert(json?.error || "Failed to delete leave request")
        return
      }
      setLeaveRequests((prev) => prev.filter((r) => r.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting leave request:", error)
      alert("Error deleting leave request. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading || !user) {
    return <ModernLoader message="Loading leave requests" fullPage />
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            My Leave Requests <span className="text-xs md:text-sm text-gray-600">({leaveRequests.length})</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Manage and track your leave applications</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button
            variant="outline"
            onClick={exportLeaveRequestsCsv}
            className="border-teal-200 text-teal-700 hover:bg-teal-50 bg-transparent text-sm"
          >
            Export CSV
          </Button>
          <Button
            onClick={() => setShowRequestModal(true)}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Request Leave
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardHeader className="pb-2 px-3 pt-3 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-blue-700">Total Requests</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
            <div className="text-xl md:text-2xl font-bold text-blue-800">{leaveRequests.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200">
          <CardHeader className="pb-2 px-3 pt-3 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-yellow-700">Pending</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
            <div className="text-xl md:text-2xl font-bold text-yellow-800">
              {leaveRequests.filter((req) => req.status === "pending").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardHeader className="pb-2 px-3 pt-3 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-green-700">Approved</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
            <div className="text-xl md:text-2xl font-bold text-green-800">
              {leaveRequests.filter((req) => req.status === "approved").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200">
          <CardHeader className="pb-2 px-3 pt-3 md:px-6 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-red-700">Rejected</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
            <div className="text-xl md:text-2xl font-bold text-red-800">
              {leaveRequests.filter((req) => req.status === "rejected").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="px-4 py-4 md:px-6 md:py-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <FileText className="h-4 w-4 md:h-5 md:w-5" />
            Leave Requests History
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {leaveRequests.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <FileText className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No leave requests yet</h3>
              <p className="text-sm md:text-base text-gray-500 mb-4">Start by creating your first leave request</p>
              <Button
                onClick={() => setShowRequestModal(true)}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Request Leave
              </Button>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {leaveRequests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-sm md:text-base text-gray-900">
                          {getLeaveTypeLabel(request.leaveType)}
                        </h3>
                        <Badge className={`${getStatusColor(request.status)} font-medium text-xs`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                          <span className="truncate">
                            {format(new Date(request.startDate), "MMM dd")} -{" "}
                            {format(new Date(request.endDate), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                          <span>{request.totalDays} working days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                          <span>Applied {format(new Date(request.appliedDate), "MMM dd, yyyy")}</span>
                        </div>
                      </div>

                      <p className="text-xs md:text-sm text-gray-700 bg-gray-50 p-2 md:p-3 rounded-md break-words">
                        {request.reason}
                      </p>

                      {request.reviewComments && (
                        <div className="mt-2 md:mt-3 p-2 md:p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-xs md:text-sm font-medium text-blue-800 mb-1">Review Comments:</p>
                          <p className="text-xs md:text-sm text-blue-700 break-words">{request.reviewComments}</p>
                          {request.reviewedDate && (
                            <p className="text-xs text-blue-600 mt-1">
                              Reviewed on {format(new Date(request.reviewedDate), "MMM dd, yyyy")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="md:ml-4 w-full md:w-auto">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteLeaveRequest(request.id)}
                        disabled={deletingId === request.id}
                        className="w-full md:w-auto text-xs md:text-sm"
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
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

      <LeaveRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        personId={user.id}
        personType={user.role === "Student" ? "student" : "staff"}
        personName={user.name}
        department={user.department}
        role={user.role}
      />
    </div>
  )
}


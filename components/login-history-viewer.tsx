// // // "use client"

// // // import { useEffect, useState } from "react"
// // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // // import { Badge } from "@/components/ui/badge"
// // // import { Input } from "@/components/ui/input"
// // // import { Button } from "@/components/ui/button"
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // // import { CheckCircle2, XCircle, Search, RefreshCw, Download } from "lucide-react"

// // // interface LoginHistoryRecord {
// // //   _id: string
// // //   email: string
// // //   name: string
// // //   userType: string
// // //   role: string
// // //   institutionName: string
// // //   department: string
// // //   success: boolean
// // //   reason: string
// // //   ipAddress: string
// // //   userAgent: string
// // //   timestamp: string
// // //   otpRequired: boolean
// // // }

// // // interface LoginHistoryViewerProps {
// // //   userRole: string
// // // }

// // // export default function LoginHistoryViewer({ userRole }: LoginHistoryViewerProps) {
// // //   const [history, setHistory] = useState<LoginHistoryRecord[]>([])
// // //   const [loading, setLoading] = useState(true)
// // //   const [search, setSearch] = useState("")
// // //   const [filterSuccess, setFilterSuccess] = useState<string>("all")
// // //   const [filterUserType, setFilterUserType] = useState<string>("all")
// // //   const [statistics, setStatistics] = useState({ totalLogins: 0, successfulLogins: 0, failedLogins: 0 })

// // //   const fetchHistory = async () => {
// // //     setLoading(true)
// // //     try {
// // //       const params = new URLSearchParams({
// // //         userRole,
// // //         limit: "100",
// // //         skip: "0",
// // //       })

// // //       if (search) params.append("search", search)
// // //       if (filterSuccess !== "all") params.append("success", filterSuccess)
// // //       if (filterUserType !== "all") params.append("userType", filterUserType)

// // //       const response = await fetch(`/api/login-history?${params}`)
// // //       const data = await response.json()

// // //       if (data.success) {
// // //         setHistory(data.history)
// // //         setStatistics(data.statistics)
// // //       }
// // //     } catch (error) {
// // //       console.error("Failed to fetch login history:", error)
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     fetchHistory()
// // //   }, [search, filterSuccess, filterUserType])

// // //   const exportToCSV = () => {
// // //     const headers = ["Timestamp", "Name", "Email", "Role", "Institution", "Status", "Reason", "IP Address"]
// // //     const rows = history.map((h) => [
// // //       new Date(h.timestamp).toLocaleString(),
// // //       h.name,
// // //       h.email,
// // //       h.role,
// // //       h.institutionName,
// // //       h.success ? "Success" : "Failed",
// // //       h.reason,
// // //       h.ipAddress,
// // //     ])

// // //     const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
// // //     const blob = new Blob([csv], { type: "text/csv" })
// // //     const url = window.URL.createObjectURL(blob)
// // //     const a = document.createElement("a")
// // //     a.href = url
// // //     a.download = `login-history-${new Date().toISOString()}.csv`
// // //     a.click()
// // //   }

// // //   if (userRole !== "SuperAdmin") {
// // //     return null
// // //   }

// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Statistics Cards */}
// // //       <div className="grid gap-4 md:grid-cols-3">
// // //         <Card>
// // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //             <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-bold">{statistics.totalLogins}</div>
// // //           </CardContent>
// // //         </Card>
// // //         <Card>
// // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //             <CardTitle className="text-sm font-medium">Successful Logins</CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-bold text-green-600">{statistics.successfulLogins}</div>
// // //           </CardContent>
// // //         </Card>
// // //         <Card>
// // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //             <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-bold text-red-600">{statistics.failedLogins}</div>
// // //           </CardContent>
// // //         </Card>
// // //       </div>

// // //       {/* Filters and Search */}
// // //       <Card>
// // //         <CardHeader>
// // //           <CardTitle>Login History</CardTitle>
// // //           <CardDescription>View all login attempts and user activity across the system</CardDescription>
// // //         </CardHeader>
// // //         <CardContent>
// // //           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
// // //             <div className="flex flex-1 gap-2">
// // //               <div className="relative flex-1">
// // //                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
// // //                 <Input
// // //                   placeholder="Search by name, email, or institution..."
// // //                   value={search}
// // //                   onChange={(e) => setSearch(e.target.value)}
// // //                   className="pl-8"
// // //                 />
// // //               </div>
// // //               <Select value={filterSuccess} onValueChange={setFilterSuccess}>
// // //                 <SelectTrigger className="w-[140px]">
// // //                   <SelectValue placeholder="Status" />
// // //                 </SelectTrigger>
// // //                 <SelectContent>
// // //                   <SelectItem value="all">All Status</SelectItem>
// // //                   <SelectItem value="true">Success</SelectItem>
// // //                   <SelectItem value="false">Failed</SelectItem>
// // //                 </SelectContent>
// // //               </Select>
// // //               <Select value={filterUserType} onValueChange={setFilterUserType}>
// // //                 <SelectTrigger className="w-[140px]">
// // //                   <SelectValue placeholder="User Type" />
// // //                 </SelectTrigger>
// // //                 <SelectContent>
// // //                   <SelectItem value="all">All Types</SelectItem>
// // //                   <SelectItem value="staff">Staff</SelectItem>
// // //                   <SelectItem value="student">Student</SelectItem>
// // //                 </SelectContent>
// // //               </Select>
// // //             </div>
// // //             <div className="flex gap-2">
// // //               <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loading}>
// // //                 <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
// // //                 Refresh
// // //               </Button>
// // //               <Button variant="outline" size="sm" onClick={exportToCSV}>
// // //                 <Download className="h-4 w-4 mr-2" />
// // //                 Export CSV
// // //               </Button>
// // //             </div>
// // //           </div>

// // //           {/* History Table */}
// // //           <div className="rounded-md border">
// // //             <Table>
// // //               <TableHeader>
// // //                 <TableRow>
// // //                   <TableHead>Status</TableHead>
// // //                   <TableHead>Timestamp</TableHead>
// // //                   <TableHead>Name</TableHead>
// // //                   <TableHead>Email</TableHead>
// // //                   <TableHead>Role</TableHead>
// // //                   <TableHead>Institution</TableHead>
// // //                   <TableHead>Reason</TableHead>
// // //                   <TableHead>IP Address</TableHead>
// // //                 </TableRow>
// // //               </TableHeader>
// // //               <TableBody>
// // //                 {loading ? (
// // //                   <TableRow>
// // //                     <TableCell colSpan={8} className="text-center py-8">
// // //                       Loading login history...
// // //                     </TableCell>
// // //                   </TableRow>
// // //                 ) : history.length === 0 ? (
// // //                   <TableRow>
// // //                     <TableCell colSpan={8} className="text-center py-8">
// // //                       No login history found
// // //                     </TableCell>
// // //                   </TableRow>
// // //                 ) : (
// // //                   history.map((record) => (
// // //                     <TableRow key={record._id}>
// // //                       <TableCell>
// // //                         {record.success ? (
// // //                           <CheckCircle2 className="h-5 w-5 text-green-600" />
// // //                         ) : (
// // //                           <XCircle className="h-5 w-5 text-red-600" />
// // //                         )}
// // //                       </TableCell>
// // //                       <TableCell className="text-sm">{new Date(record.timestamp).toLocaleString()}</TableCell>
// // //                       <TableCell className="font-medium">{record.name}</TableCell>
// // //                       <TableCell>{record.email}</TableCell>
// // //                       <TableCell>
// // //                         <Badge variant="outline">{record.role}</Badge>
// // //                       </TableCell>
// // //                       <TableCell className="text-sm">{record.institutionName}</TableCell>
// // //                       <TableCell className="text-sm text-muted-foreground">{record.reason}</TableCell>
// // //                       <TableCell className="text-sm font-mono">{record.ipAddress}</TableCell>
// // //                     </TableRow>
// // //                   ))
// // //                 )}
// // //               </TableBody>
// // //             </Table>
// // //           </div>
// // //         </CardContent>
// // //       </Card>
// // //     </div>
// // //   )
// // // }




// // "use client"

// // import { useEffect, useState } from "react"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Input } from "@/components/ui/input"
// // import { Button } from "@/components/ui/button"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // import { Checkbox } from "@/components/ui/checkbox"
// // import { CheckCircle2, XCircle, Search, RefreshCw, Download, Trash2 } from "lucide-react"
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// // } from "@/components/ui/alert-dialog"

// // interface LoginHistoryRecord {
// //   _id: string
// //   email: string
// //   name: string
// //   userType: string
// //   role: string
// //   institutionName: string
// //   department: string
// //   success: boolean
// //   reason: string
// //   ipAddress: string
// //   userAgent: string
// //   timestamp: string
// //   otpRequired: boolean
// // }

// // interface LoginHistoryViewerProps {
// //   userRole: string
// // }

// // export default function LoginHistoryViewer({ userRole }: LoginHistoryViewerProps) {
// //   const [history, setHistory] = useState<LoginHistoryRecord[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [search, setSearch] = useState("")
// //   const [filterSuccess, setFilterSuccess] = useState<string>("all")
// //   const [filterUserType, setFilterUserType] = useState<string>("all")
// //   const [statistics, setStatistics] = useState({ totalLogins: 0, successfulLogins: 0, failedLogins: 0 })
// //   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
// //   const [showDeleteDialog, setShowDeleteDialog] = useState(false)
// //   const [deleteTarget, setDeleteTarget] = useState<"single" | "multiple">("multiple")
// //   const [singleDeleteId, setSingleDeleteId] = useState<string>("")
// //   const [deleting, setDeleting] = useState(false)

// //   const fetchHistory = async () => {
// //     setLoading(true)
// //     try {
// //       const params = new URLSearchParams({
// //         userRole,
// //         limit: "100",
// //         skip: "0",
// //       })

// //       if (search) params.append("search", search)
// //       if (filterSuccess !== "all") params.append("success", filterSuccess)
// //       if (filterUserType !== "all") params.append("userType", filterUserType)

// //       const response = await fetch(`/api/login-history?${params}`)
// //       const data = await response.json()

// //       if (data.success) {
// //         setHistory(data.history)
// //         setStatistics(data.statistics)
// //       }
// //     } catch (error) {
// //       console.error("Failed to fetch login history:", error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     fetchHistory()
// //   }, [search, filterSuccess, filterUserType])

// //   const exportToCSV = () => {
// //     const headers = ["Timestamp", "Name", "Email", "Role", "Institution", "Status", "Reason", "IP Address"]
// //     const rows = history.map((h) => [
// //       new Date(h.timestamp).toLocaleString(),
// //       h.name,
// //       h.email,
// //       h.role,
// //       h.institutionName,
// //       h.success ? "Success" : "Failed",
// //       h.reason,
// //       h.ipAddress,
// //     ])

// //     const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
// //     const blob = new Blob([csv], { type: "text/csv" })
// //     const url = window.URL.createObjectURL(blob)
// //     const a = document.createElement("a")
// //     a.href = url
// //     a.download = `login-history-${new Date().toISOString()}.csv`
// //     a.click()
// //   }

// //   const toggleSelection = (id: string) => {
// //     const newSelected = new Set(selectedIds)
// //     if (newSelected.has(id)) {
// //       newSelected.delete(id)
// //     } else {
// //       newSelected.add(id)
// //     }
// //     setSelectedIds(newSelected)
// //   }

// //   const toggleSelectAll = () => {
// //     if (selectedIds.size === history.length) {
// //       setSelectedIds(new Set())
// //     } else {
// //       setSelectedIds(new Set(history.map((h) => h._id)))
// //     }
// //   }

// //   const handleDeleteClick = (id?: string) => {
// //     if (id) {
// //       setDeleteTarget("single")
// //       setSingleDeleteId(id)
// //     } else {
// //       setDeleteTarget("multiple")
// //     }
// //     setShowDeleteDialog(true)
// //   }

// //   const performDelete = async () => {
// //     setDeleting(true)
// //     try {
// //       const idsToDelete = deleteTarget === "single" ? [singleDeleteId] : Array.from(selectedIds)

// //       const response = await fetch(`/api/login-history?userRole=${userRole}`, {
// //         method: "DELETE",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ ids: idsToDelete }),
// //       })

// //       const data = await response.json()

// //       if (data.success) {
// //         await fetchHistory()
// //         setSelectedIds(new Set())
// //         setShowDeleteDialog(false)
// //       } else {
// //         alert("Failed to delete records: " + data.error)
// //       }
// //     } catch (error) {
// //       console.error("Delete error:", error)
// //       alert("Failed to delete records")
// //     } finally {
// //       setDeleting(false)
// //     }
// //   }

// //   if (userRole !== "SuperAdmin") {
// //     return null
// //   }

// //   return (
// //     <div className="space-y-6">
// //       {/* Statistics Cards */}
// //       <div className="grid gap-4 md:grid-cols-3">
// //         <Card>
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold">{statistics.totalLogins}</div>
// //           </CardContent>
// //         </Card>
// //         <Card>
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-medium">Successful Logins</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-green-600">{statistics.successfulLogins}</div>
// //           </CardContent>
// //         </Card>
// //         <Card>
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-red-600">{statistics.failedLogins}</div>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Filters and Search */}
// //       <Card>
// //         <CardHeader>
// //           <CardTitle>Login History</CardTitle>
// //           <CardDescription>View all login attempts and user activity across the system</CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
// //             <div className="flex flex-1 gap-2">
// //               <div className="relative flex-1">
// //                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
// //                 <Input
// //                   placeholder="Search by name, email, or institution..."
// //                   value={search}
// //                   onChange={(e) => setSearch(e.target.value)}
// //                   className="pl-8"
// //                 />
// //               </div>
// //               <Select value={filterSuccess} onValueChange={setFilterSuccess}>
// //                 <SelectTrigger className="w-[140px]">
// //                   <SelectValue placeholder="Status" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="all">All Status</SelectItem>
// //                   <SelectItem value="true">Success</SelectItem>
// //                   <SelectItem value="false">Failed</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //               <Select value={filterUserType} onValueChange={setFilterUserType}>
// //                 <SelectTrigger className="w-[140px]">
// //                   <SelectValue placeholder="User Type" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="all">All Types</SelectItem>
// //                   <SelectItem value="staff">Staff</SelectItem>
// //                   <SelectItem value="student">Student</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div className="flex gap-2">
// //               {selectedIds.size > 0 && (
// //                 <Button variant="destructive" size="sm" onClick={() => handleDeleteClick()} disabled={deleting}>
// //                   <Trash2 className="h-4 w-4 mr-2" />
// //                   Delete ({selectedIds.size})
// //                 </Button>
// //               )}
// //               <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loading}>
// //                 <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
// //                 Refresh
// //               </Button>
// //               <Button variant="outline" size="sm" onClick={exportToCSV}>
// //                 <Download className="h-4 w-4 mr-2" />
// //                 Export CSV
// //               </Button>
// //             </div>
// //           </div>

// //           {/* History Table */}
// //           <div className="rounded-md border">
// //             <Table>
// //               <TableHeader>
// //                 <TableRow>
// //                   <TableHead className="w-[50px]">
// //                     <Checkbox
// //                       checked={history.length > 0 && selectedIds.size === history.length}
// //                       onCheckedChange={toggleSelectAll}
// //                       aria-label="Select all"
// //                     />
// //                   </TableHead>
// //                   <TableHead>Status</TableHead>
// //                   <TableHead>Timestamp</TableHead>
// //                   <TableHead>Name</TableHead>
// //                   <TableHead>Email</TableHead>
// //                   <TableHead>Role</TableHead>
// //                   <TableHead>Institution</TableHead>
// //                   <TableHead>Reason</TableHead>
// //                   <TableHead>IP Address</TableHead>
// //                   <TableHead className="w-[80px]">Actions</TableHead>
// //                 </TableRow>
// //               </TableHeader>
// //               <TableBody>
// //                 {loading ? (
// //                   <TableRow>
// //                     <TableCell colSpan={10} className="text-center py-8">
// //                       Loading login history...
// //                     </TableCell>
// //                   </TableRow>
// //                 ) : history.length === 0 ? (
// //                   <TableRow>
// //                     <TableCell colSpan={10} className="text-center py-8">
// //                       No login history found
// //                     </TableCell>
// //                   </TableRow>
// //                 ) : (
// //                   history.map((record) => (
// //                     <TableRow key={record._id}>
// //                       <TableCell>
// //                         <Checkbox
// //                           checked={selectedIds.has(record._id)}
// //                           onCheckedChange={() => toggleSelection(record._id)}
// //                           aria-label={`Select ${record.name}`}
// //                         />
// //                       </TableCell>
// //                       <TableCell>
// //                         {record.success ? (
// //                           <CheckCircle2 className="h-5 w-5 text-green-600" />
// //                         ) : (
// //                           <XCircle className="h-5 w-5 text-red-600" />
// //                         )}
// //                       </TableCell>
// //                       <TableCell className="text-sm">{new Date(record.timestamp).toLocaleString()}</TableCell>
// //                       <TableCell className="font-medium">{record.name}</TableCell>
// //                       <TableCell>{record.email}</TableCell>
// //                       <TableCell>
// //                         <Badge variant="outline">{record.role}</Badge>
// //                       </TableCell>
// //                       <TableCell className="text-sm">{record.institutionName}</TableCell>
// //                       <TableCell className="text-sm text-muted-foreground">{record.reason}</TableCell>
// //                       <TableCell className="text-sm font-mono">{record.ipAddress}</TableCell>
// //                       <TableCell>
// //                         <Button
// //                           variant="ghost"
// //                           size="sm"
// //                           onClick={() => handleDeleteClick(record._id)}
// //                           disabled={deleting}
// //                         >
// //                           <Trash2 className="h-4 w-4 text-red-600" />
// //                         </Button>
// //                       </TableCell>
// //                     </TableRow>
// //                   ))
// //                 )}
// //               </TableBody>
// //             </Table>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Confirmation dialog for deletion */}
// //       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
// //         <AlertDialogContent>
// //           <AlertDialogHeader>
// //             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
// //             <AlertDialogDescription>
// //               {deleteTarget === "single"
// //                 ? "This will permanently delete this login history record. This action cannot be undone."
// //                 : `This will permanently delete ${selectedIds.size} login history record(s). This action cannot be undone.`}
// //             </AlertDialogDescription>
// //           </AlertDialogHeader>
// //           <AlertDialogFooter>
// //             <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
// //             <AlertDialogAction onClick={performDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
// //               {deleting ? "Deleting..." : "Delete"}
// //             </AlertDialogAction>
// //           </AlertDialogFooter>
// //         </AlertDialogContent>
// //       </AlertDialog>
// //     </div>
// //   )
// // }




// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Checkbox } from "@/components/ui/checkbox"
// import { CheckCircle2, XCircle, Search, RefreshCw, Download, Trash2, Monitor, MapPin, Clock } from "lucide-react"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"

// interface LoginHistoryRecord {
//   _id: string
//   email: string
//   name: string
//   userType: string
//   role: string
//   institutionName: string
//   department: string
//   success: boolean
//   reason: string
//   ipAddress: string
//   userAgent: string
//   timestamp: string
//   otpRequired: boolean
//   deviceName?: string
//   deviceType?: string
//   browser?: string
//   os?: string
//   location?: {
//     city?: string
//     country?: string
//     latitude?: number
//     longitude?: number
//   }
//   sessionDuration?: number
//   loginTime?: string
//   logoutTime?: string
// }

// interface LoginHistoryViewerProps {
//   userRole: string
// }

// export default function LoginHistoryViewer({ userRole }: LoginHistoryViewerProps) {
//   const [history, setHistory] = useState<LoginHistoryRecord[]>([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState("")
//   const [filterSuccess, setFilterSuccess] = useState<string>("all")
//   const [filterUserType, setFilterUserType] = useState<string>("all")
//   const [statistics, setStatistics] = useState({ totalLogins: 0, successfulLogins: 0, failedLogins: 0 })
//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false)
//   const [deleteTarget, setDeleteTarget] = useState<"single" | "multiple">("multiple")
//   const [singleDeleteId, setSingleDeleteId] = useState<string>("")
//   const [deleting, setDeleting] = useState(false)

//   const fetchHistory = async () => {
//     setLoading(true)
//     try {
//       const params = new URLSearchParams({
//         userRole,
//         limit: "100",
//         skip: "0",
//       })

//       if (search) params.append("search", search)
//       if (filterSuccess !== "all") params.append("success", filterSuccess)
//       if (filterUserType !== "all") params.append("userType", filterUserType)

//       const response = await fetch(`/api/login-history?${params}`)
//       const data = await response.json()

//       if (data.success) {
//         setHistory(data.history)
//         setStatistics(data.statistics)
//       }
//     } catch (error) {
//       console.error("Failed to fetch login history:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchHistory()
//   }, [search, filterSuccess, filterUserType])

//   const exportToCSV = () => {
//     const headers = [
//       "Timestamp",
//       "Name",
//       "Email",
//       "Role",
//       "Institution",
//       "Status",
//       "Reason",
//       "IP Address",
//       "Device",
//       "Location",
//       "Session Duration (min)",
//     ]
//     const rows = history.map((h) => [
//       new Date(h.timestamp).toLocaleString(),
//       h.name,
//       h.email,
//       h.role,
//       h.institutionName,
//       h.success ? "Success" : "Failed",
//       h.reason,
//       h.ipAddress,
//       h.deviceName || "Unknown",
//       h.location ? `${h.location.city || ""}, ${h.location.country || ""}` : "Unknown",
//       h.sessionDuration ? (h.sessionDuration / 60000).toFixed(2) : "N/A",
//     ])

//     const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
//     const blob = new Blob([csv], { type: "text/csv" })
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = `login-history-${new Date().toISOString()}.csv`
//     a.click()
//   }

//   const toggleSelection = (id: string) => {
//     const newSelected = new Set(selectedIds)
//     if (newSelected.has(id)) {
//       newSelected.delete(id)
//     } else {
//       newSelected.add(id)
//     }
//     setSelectedIds(newSelected)
//   }

//   const toggleSelectAll = () => {
//     if (selectedIds.size === history.length) {
//       setSelectedIds(new Set())
//     } else {
//       setSelectedIds(new Set(history.map((h) => h._id)))
//     }
//   }

//   const handleDeleteClick = (id?: string) => {
//     if (id) {
//       setDeleteTarget("single")
//       setSingleDeleteId(id)
//     } else {
//       setDeleteTarget("multiple")
//     }
//     setShowDeleteDialog(true)
//   }

//   const performDelete = async () => {
//     setDeleting(true)
//     try {
//       const idsToDelete = deleteTarget === "single" ? [singleDeleteId] : Array.from(selectedIds)

//       const response = await fetch(`/api/login-history?userRole=${userRole}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ids: idsToDelete }),
//       })

//       const data = await response.json()

//       if (data.success) {
//         await fetchHistory()
//         setSelectedIds(new Set())
//         setShowDeleteDialog(false)
//       } else {
//         alert("Failed to delete records: " + data.error)
//       }
//     } catch (error) {
//       console.error("Delete error:", error)
//       alert("Failed to delete records")
//     } finally {
//       setDeleting(false)
//     }
//   }

//   const formatDuration = (ms?: number) => {
//     if (!ms) return "Active"
//     const minutes = Math.floor(ms / 60000)
//     const hours = Math.floor(minutes / 60)
//     const days = Math.floor(hours / 24)

//     if (days > 0) return `${days}d ${hours % 24}h`
//     if (hours > 0) return `${hours}h ${minutes % 60}m`
//     return `${minutes}m`
//   }

//   if (userRole !== "SuperAdmin") {
//     return null
//   }

//   return (
//     <div className="space-y-6">
//       {/* Statistics Cards */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{statistics.totalLogins}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Successful Logins</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">{statistics.successfulLogins}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-red-600">{statistics.failedLogins}</div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters and Search */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Login History</CardTitle>
//           <CardDescription>
//             View all login attempts with device info, location, and session duration tracking
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
//             <div className="flex flex-1 gap-2">
//               <div className="relative flex-1">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search by name, email, or institution..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="pl-8"
//                 />
//               </div>
//               <Select value={filterSuccess} onValueChange={setFilterSuccess}>
//                 <SelectTrigger className="w-[140px]">
//                   <SelectValue placeholder="Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="true">Success</SelectItem>
//                   <SelectItem value="false">Failed</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Select value={filterUserType} onValueChange={setFilterUserType}>
//                 <SelectTrigger className="w-[140px]">
//                   <SelectValue placeholder="User Type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Types</SelectItem>
//                   <SelectItem value="staff">Staff</SelectItem>
//                   <SelectItem value="student">Student</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex gap-2">
//               {selectedIds.size > 0 && (
//                 <Button variant="destructive" size="sm" onClick={() => handleDeleteClick()} disabled={deleting}>
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Delete ({selectedIds.size})
//                 </Button>
//               )}
//               <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loading}>
//                 <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
//                 Refresh
//               </Button>
//               <Button variant="outline" size="sm" onClick={exportToCSV}>
//                 <Download className="h-4 w-4 mr-2" />
//                 Export CSV
//               </Button>
//             </div>
//           </div>

//           {/* History Table */}
//           <div className="rounded-md border overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[50px]">
//                     <Checkbox
//                       checked={history.length > 0 && selectedIds.size === history.length}
//                       onCheckedChange={toggleSelectAll}
//                       aria-label="Select all"
//                     />
//                   </TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Timestamp</TableHead>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Role</TableHead>
//                   <TableHead>Device</TableHead>
//                   <TableHead>Location</TableHead>
//                   <TableHead>Session Duration</TableHead>
//                   <TableHead>IP Address</TableHead>
//                   <TableHead className="w-[80px]">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={11} className="text-center py-8">
//                       Loading login history...
//                     </TableCell>
//                   </TableRow>
//                 ) : history.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={11} className="text-center py-8">
//                       No login history found
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   history.map((record) => (
//                     <TableRow key={record._id}>
//                       <TableCell>
//                         <Checkbox
//                           checked={selectedIds.has(record._id)}
//                           onCheckedChange={() => toggleSelection(record._id)}
//                           aria-label={`Select ${record.name}`}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         {record.success ? (
//                           <CheckCircle2 className="h-5 w-5 text-green-600" />
//                         ) : (
//                           <XCircle className="h-5 w-5 text-red-600" />
//                         )}
//                       </TableCell>
//                       <TableCell className="text-sm">{new Date(record.timestamp).toLocaleString()}</TableCell>
//                       <TableCell className="font-medium">{record.name}</TableCell>
//                       <TableCell>{record.email}</TableCell>
//                       <TableCell>
//                         <Badge variant="outline">{record.role}</Badge>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2 text-sm">
//                           <Monitor className="h-4 w-4 text-muted-foreground" />
//                           <div>
//                             <div className="font-medium">{record.deviceName || "Unknown Device"}</div>
//                             {record.deviceType && (
//                               <div className="text-xs text-muted-foreground">{record.deviceType}</div>
//                             )}
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2 text-sm">
//                           <MapPin className="h-4 w-4 text-muted-foreground" />
//                           <div>
//                             {record.location ? (
//                               <>
//                                 <div className="font-medium">{record.location.city || "Unknown"}</div>
//                                 <div className="text-xs text-muted-foreground">{record.location.country || ""}</div>
//                               </>
//                             ) : (
//                               <span className="text-muted-foreground">Unknown</span>
//                             )}
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2 text-sm">
//                           <Clock className="h-4 w-4 text-muted-foreground" />
//                           <div>
//                             <div className="font-medium">{formatDuration(record.sessionDuration)}</div>
//                             {record.logoutTime && (
//                               <div className="text-xs text-muted-foreground">
//                                 Logged out: {new Date(record.logoutTime).toLocaleTimeString()}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-sm font-mono">{record.ipAddress}</TableCell>
//                       <TableCell>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleDeleteClick(record._id)}
//                           disabled={deleting}
//                         >
//                           <Trash2 className="h-4 w-4 text-red-600" />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Confirmation dialog for deletion */}
//       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               {deleteTarget === "single"
//                 ? "This will permanently delete this login history record. This action cannot be undone."
//                 : `This will permanently delete ${selectedIds.size} login history record(s). This action cannot be undone.`}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={performDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
//               {deleting ? "Deleting..." : "Delete"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }






"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, XCircle, Search, RefreshCw, Download, Trash2, Monitor, MapPin, Clock } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface LoginHistoryRecord {
  _id: string
  email: string
  name: string
  userType: string
  role: string
  institutionName: string
  department: string
  success: boolean
  reason: string
  ipAddress: string
  userAgent: string
  timestamp: string
  otpRequired: boolean
  deviceInfo?: {
    name: string
    browser: string
    os: string
    isMobile: boolean
    deviceType: string
  }
  location?: {
    city?: string
    country?: string
    latitude?: number
    longitude?: number
  }
  sessionDuration?: number
  loginTime?: string
  logoutTime?: string
}

interface LoginHistoryViewerProps {
  userRole: string
}

export default function LoginHistoryViewer({ userRole }: LoginHistoryViewerProps) {
  const [history, setHistory] = useState<LoginHistoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterSuccess, setFilterSuccess] = useState<string>("all")
  const [filterUserType, setFilterUserType] = useState<string>("all")
  const [statistics, setStatistics] = useState({ totalLogins: 0, successfulLogins: 0, failedLogins: 0 })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<"single" | "multiple">("multiple")
  const [singleDeleteId, setSingleDeleteId] = useState<string>("")
  const [deleting, setDeleting] = useState(false)

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        userRole,
        limit: "100",
        skip: "0",
      })

      if (search) params.append("search", search)
      if (filterSuccess !== "all") params.append("success", filterSuccess)
      if (filterUserType !== "all") params.append("userType", filterUserType)

      const response = await fetch(`/api/login-history?${params}`)
      const data = await response.json()

      if (data.success) {
        setHistory(data.history)
        setStatistics(data.statistics)
      }
    } catch (error) {
      console.error("Failed to fetch login history:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [search, filterSuccess, filterUserType])

  const exportToCSV = () => {
    const headers = [
      "Timestamp",
      "Name",
      "Email",
      "Role",
      "Institution",
      "Status",
      "Reason",
      "IP Address",
      "Device",
      "Location",
      "Session Duration (min)",
    ]
    const rows = history.map((h) => [
      new Date(h.timestamp).toLocaleString(),
      h.name,
      h.email,
      h.role,
      h.institutionName,
      h.success ? "Success" : "Failed",
      h.reason,
      h.ipAddress,
      h.deviceInfo?.name || "Unknown",
      h.location ? `${h.location.city || ""}, ${h.location.country || ""}` : "Unknown",
      h.sessionDuration ? (h.sessionDuration / 60000).toFixed(2) : "N/A",
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `login-history-${new Date().toISOString()}.csv`
    a.click()
  }

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === history.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(history.map((h) => h._id)))
    }
  }

  const handleDeleteClick = (id?: string) => {
    if (id) {
      setDeleteTarget("single")
      setSingleDeleteId(id)
    } else {
      setDeleteTarget("multiple")
    }
    setShowDeleteDialog(true)
  }

  const performDelete = async () => {
    setDeleting(true)
    try {
      const idsToDelete = deleteTarget === "single" ? [singleDeleteId] : Array.from(selectedIds)

      const response = await fetch(`/api/login-history?userRole=${userRole}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchHistory()
        setSelectedIds(new Set())
        setShowDeleteDialog(false)
      } else {
        alert("Failed to delete records: " + data.error)
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete records")
    } finally {
      setDeleting(false)
    }
  }

  const formatDuration = (ms?: number) => {
    if (!ms) return "Active"
    const minutes = Math.floor(ms / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m`
  }

  if (userRole !== "SuperAdmin") {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalLogins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistics.successfulLogins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statistics.failedLogins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
          <CardDescription>
            View all login attempts with device info, location, and session duration tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or institution..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterSuccess} onValueChange={setFilterSuccess}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Success</SelectItem>
                  <SelectItem value="false">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterUserType} onValueChange={setFilterUserType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {selectedIds.size > 0 && (
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick()} disabled={deleting}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedIds.size})
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* History Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={history.length > 0 && selectedIds.size === history.length}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Session Duration</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      Loading login history...
                    </TableCell>
                  </TableRow>
                ) : history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      No login history found
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(record._id)}
                          onCheckedChange={() => toggleSelection(record._id)}
                          aria-label={`Select ${record.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        {record.success ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{new Date(record.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{record.deviceInfo?.name || "Unknown Device"}</div>
                            {record.deviceInfo?.deviceType && (
                              <div className="text-xs text-muted-foreground">{record.deviceInfo.deviceType}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            {record.location ? (
                              <>
                                <div className="font-medium">{record.location.city || "Unknown"}</div>
                                <div className="text-xs text-muted-foreground">{record.location.country || ""}</div>
                              </>
                            ) : (
                              <span className="text-muted-foreground">Unknown</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{formatDuration(record.sessionDuration)}</div>
                            {record.logoutTime && (
                              <div className="text-xs text-muted-foreground">
                                Logged out: {new Date(record.logoutTime).toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono">{record.ipAddress}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(record._id)}
                          disabled={deleting}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation dialog for deletion */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget === "single"
                ? "This will permanently delete this login history record. This action cannot be undone."
                : `This will permanently delete ${selectedIds.size} login history record(s). This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={performDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

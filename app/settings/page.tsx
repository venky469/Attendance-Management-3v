
// // // // "use client"

// // // // import { useEffect, useState } from "react"
// // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // // // import { Button } from "@/components/ui/button"
// // // // import { Input } from "@/components/ui/input"
// // // // import { Label } from "@/components/ui/label"
// // // // import { Switch } from "@/components/ui/switch"
// // // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // // // import { toast } from "@/hooks/use-toast"
// // // // import useSWR from "swr"
// // // // import InstitutionQuarterlyReports from "@/components/institution-quarterly-reports"
// // // // import PushNotificationManager from "@/components/push-notification-manager"
// // // // import LoginHistoryViewer from "@/components/login-history-viewer"
// // // // import { StorageMonitor } from "@/components/storage-monitor"
// // // // import { QuarterlyReportsManager } from "@/components/quarterly-reports-manager"
// // // // import { NotificationDebugPanel } from "@/components/notification-debug-panel"
// // // // import {
// // // //   Bell,
// // // //   Shield,
// // // //   Database,
// // // //   Mail,
// // // //   Users,
// // // //   GraduationCap,
// // // //   Clock,
// // // //   Settings2,
// // // //   Lock,
// // // //   LogOut,
// // // //   User,
// // // //   BarChart3,
// // // // } from "lucide-react"
// // // // import { getStoredUser } from "@/lib/auth"
// // // // import { useRouter } from "next/navigation"
// // // // import Link from "next/link"
// // // // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// // // // import { logout } from "@/lib/auth"

// // // // export default function SettingsPage() {
// // // //   const [user, setUser] = useState(null)
// // // //   const [systemStats, setSystemStats] = useState(null)
// // // //   const [loading, setLoading] = useState(true)
// // // //   const [settings, setSettings] = useState({
// // // //     notifications: {
// // // //       emailNotifications: true,
// // // //       lateAlerts: true,
// // // //       absenceAlerts: false,
// // // //       updateNotifications: true,
// // // //     },
// // // //     security: {
// // // //       sessionTimeout: 30,
// // // //       passwordPolicy: "medium",
// // // //       twoFactor: false,
// // // //       autoLogout: true,
// // // //     },
// // // //     dataManagement: {
// // // //       backupFrequency: "daily",
// // // //       retentionPeriod: 12,
// // // //       autoExport: false,
// // // //     },
// // // //     email: {
// // // //       smtpServer: "",
// // // //       smtpPort: 587,
// // // //       smtpSecurity: "tls",
// // // //       fromEmail: "",
// // // //     },
// // // //     maintenance: {
// // // //       enabled: false,
// // // //       message: "",
// // // //     },
// // // //     attendance: {
// // // //       locationVerificationEnabled: true,
// // // //       locationRadiusMeters: 100,
// // // //     },
// // // //     pwaUpdate: {
// // // //       skipWaiting: false,
// // // //     },
// // // //   })
// // // //   const router = useRouter()
// // // //   const [showProfileModal, setShowProfileModal] = useState(false)
// // // //   const [showPasswordUpdate, setShowPasswordUpdate] = useState(false)
// // // //   const [passwordData, setPasswordData] = useState({
// // // //     currentPassword: "",
// // // //     newPassword: "",
// // // //     confirmPassword: "",
// // // //   })
// // // //   const [passwordLoading, setPasswordLoading] = useState(false)
// // // //   const [saving, setSaving] = useState(false)
// // // //   const isSuperAdmin = (user as any)?.role === "SuperAdmin"

// // // //   const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json())
// // // //   const {
// // // //     data: infra,
// // // //     isLoading: infraLoading,
// // // //     mutate: refreshInfra,
// // // //   } = useSWR(isSuperAdmin ? "/api/admin/system" : null, fetcher)

// // // //   const formatBytes = (bytes?: number | null) => {
// // // //     if (typeof bytes !== "number" || !isFinite(bytes)) return "N/A"
// // // //     if (bytes === 0) return "0 B"
// // // //     const k = 1024
// // // //     const sizes = ["B", "KB", "MB", "GB", "TB"]
// // // //     const i = Math.floor(Math.log(bytes) / Math.log(k))
// // // //     return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
// // // //   }

// // // //   useEffect(() => {
// // // //     const storedUser = getStoredUser()
// // // //     setUser(storedUser)

// // // //     if (!storedUser || (storedUser.role !== "Admin" && storedUser.role !== "SuperAdmin")) {
// // // //       router.push("/")
// // // //     } else {
// // // //       fetchSystemStats()
// // // //       if (storedUser.role === "SuperAdmin") {
// // // //         void loadSavedSettings()
// // // //       }
// // // //     }
// // // //   }, [router])

// // // //   const fetchSystemStats = async () => {
// // // //     try {
// // // //       setLoading(true)
// // // //       const u = getStoredUser()
// // // //       const inst = u?.role !== "SuperAdmin" ? u?.institutionName : undefined
// // // //       const q = inst ? `?institutionName=${encodeURIComponent(inst)}` : ""

// // // //       const [staffRes, studentsRes, attendanceRes, summaryRes] = await Promise.all([
// // // //         fetch(`/api/staff${q}`),
// // // //         fetch(`/api/students${q}`),
// // // //         fetch(`/api/attendance${q}`),
// // // //         fetch(`/api/reports/summary${q}`),
// // // //       ])

// // // //       const [staff, students, attendance, summary] = await Promise.all([
// // // //         staffRes.ok ? staffRes.json() : { items: [], departments: [], roles: [], shifts: [] },
// // // //         studentsRes.ok ? studentsRes.json() : { items: [] },
// // // //         attendanceRes.ok ? attendanceRes.json() : { totalCounts: {} },
// // // //         summaryRes.ok ? summaryRes.json() : {},
// // // //       ])

// // // //       setSystemStats({
// // // //         totalStaff: staff.items?.length || 0,
// // // //         totalStudents: students.items?.length || 0,
// // // //         todayAttendance: attendance.totalCounts || {},
// // // //         departments: staff.departments || [],
// // // //         roles: staff.roles || [],
// // // //         shifts: staff.shifts || [],
// // // //         summary,
// // // //       })
// // // //     } catch (error) {
// // // //       console.error("Failed to fetch system stats:", error)
// // // //       setSystemStats({
// // // //         totalStaff: 0,
// // // //         totalStudents: 0,
// // // //         todayAttendance: {},
// // // //         departments: [],
// // // //         roles: [],
// // // //         shifts: [],
// // // //         summary: {},
// // // //       })

// // // //       if (!navigator.onLine) {
// // // //         toast({
// // // //           title: "Offline Mode",
// // // //           description: "Some data may not be available. Please check your connection.",
// // // //           variant: "destructive",
// // // //         })
// // // //       }
// // // //     } finally {
// // // //       setLoading(false)
// // // //     }
// // // //   }

// // // //   const loadSavedSettings = async () => {
// // // //     try {
// // // //       const [globalRes, pwaRes] = await Promise.all([
// // // //         fetch("/api/settings?scope=global", { cache: "no-store" }),
// // // //         fetch("/api/settings/pwa-update", { cache: "no-store" }),
// // // //       ])

// // // //       if (globalRes.ok) {
// // // //         const json = await globalRes.json()
// // // //         if (json?.data && typeof json.data === "object") {
// // // //           setSettings((prev) => ({ ...prev, ...json.data }))
// // // //         }
// // // //       }

// // // //       if (pwaRes.ok) {
// // // //         const pwaJson = await pwaRes.json()
// // // //         if (pwaJson?.success) {
// // // //           setSettings((prev) => ({
// // // //             ...prev,
// // // //             pwaUpdate: {
// // // //               skipWaiting: pwaJson.skipWaiting || false,
// // // //             },
// // // //           }))
// // // //         }
// // // //       }
// // // //     } catch (e) {
// // // //       console.error("[settings] load failed", e)
// // // //     }
// // // //   }

// // // //   const saveAllSettings = async () => {
// // // //     try {
// // // //       setSaving(true)

// // // //       // Save global settings
// // // //       const globalRes = await fetch("/api/settings", {
// // // //         method: "PUT",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify({ scope: "global", data: settings }),
// // // //       })

// // // //       const pwaRes = await fetch("/api/settings/pwa-update", {
// // // //         method: "PUT",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify({ skipWaiting: settings.pwaUpdate.skipWaiting }),
// // // //       })

// // // //       if (!globalRes.ok || !pwaRes.ok) {
// // // //         throw new Error("Failed to save settings")
// // // //       }

// // // //       toast({ title: "Settings saved", description: "Your configuration has been updated." })
// // // //     } catch (e: any) {
// // // //       toast({ title: "Save failed", description: e?.message || "Unable to save settings", variant: "destructive" })
// // // //     } finally {
// // // //       setSaving(false)
// // // //     }
// // // //   }

// // // //   const updateSettings = async (category: string, key: string, value: any) => {
// // // //     setSettings((prev) => ({
// // // //       ...prev,
// // // //       [category]: {
// // // //         ...prev[category],
// // // //         [key]: value,
// // // //       },
// // // //     }))
// // // //     // Here you would typically save to backend
// // // //     console.log(`Updated ${category}.${key} to:`, value)
// // // //   }

// // // //   const downloadBlob = (blob: Blob, filename: string) => {
// // // //     const url = URL.createObjectURL(blob)
// // // //     const a = document.createElement("a")
// // // //     a.href = url
// // // //     a.download = filename
// // // //     document.body.appendChild(a)
// // // //     a.click()
// // // //     a.remove()
// // // //     URL.revokeObjectURL(url)
// // // //   }

// // // //   const exportStaffData = async () => {
// // // //     try {
// // // //       const resList = await fetch("/api/staff")
// // // //       const list = await resList.json()
// // // //       const data = Array.isArray(list?.items) ? list.items : []
// // // //       const res = await fetch("/api/export/staff?format=excel", {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify({ data }),
// // // //       })
// // // //       if (!res.ok) throw new Error("Export failed")
// // // //       const blob = await res.blob()
// // // //       downloadBlob(blob, "staff_export.xlsx")
// // // //     } catch (e) {
// // // //       toast({ title: "Export failed", description: "Could not export staff data", variant: "destructive" })
// // // //     }
// // // //   }

// // // //   const exportStudentData = async () => {
// // // //     try {
// // // //       const resList = await fetch("/api/students")
// // // //       const list = await resList.json()
// // // //       const data = Array.isArray(list?.items) ? list.items : []
// // // //       const res = await fetch("/api/export/students?format=excel", {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify({ data }),
// // // //       })
// // // //       if (!res.ok) throw new Error("Export failed")
// // // //       const blob = await res.blob()
// // // //       downloadBlob(blob, "students_export.xlsx")
// // // //     } catch (e) {
// // // //       toast({ title: "Export failed", description: "Could not export student data", variant: "destructive" })
// // // //     }
// // // //   }

// // // //   const testEmailConfiguration = async () => {
// // // //     try {
// // // //       const to = (user as any)?.email
// // // //       const res = await fetch("/api/email/test", {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify({
// // // //           to,
// // // //           from: settings.email.fromEmail || undefined,
// // // //           subject: "Test Email Configuration",
// // // //           text: "This is a test email from Settings.",
// // // //         }),
// // // //       })
// // // //       const result = await res.json()
// // // //       if (res.ok) {
// // // //         toast({ title: "Email sent", description: `Message ID: ${result?.messageId || "N/A"}` })
// // // //       } else {
// // // //         toast({ title: "Email test failed", description: result?.error || "Unknown error", variant: "destructive" })
// // // //       }
// // // //     } catch (error) {
// // // //       toast({ title: "Email test failed", description: "Unable to send test email", variant: "destructive" })
// // // //     }
// // // //   }

// // // //   const handleLogout = () => {
// // // //     logout()
// // // //     router.push("/login")
// // // //   }

// // // //   const handlePasswordUpdate = async () => {
// // // //     if (passwordData.newPassword !== passwordData.confirmPassword) {
// // // //       toast({ title: "Error", description: "New passwords do not match", variant: "destructive" })
// // // //       return
// // // //     }
// // // //     if (passwordData.newPassword.length < 6) {
// // // //       toast({ title: "Error", description: "Password must be at least 6 characters long", variant: "destructive" })
// // // //       return
// // // //     }

// // // //     try {
// // // //       setPasswordLoading(true)
// // // //       const res = await fetch("/api/auth/change-password", {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify({
// // // //           userId: (user as any)?.id,
// // // //           currentPassword: passwordData.currentPassword,
// // // //           newPassword: passwordData.newPassword,
// // // //         }),
// // // //       })
// // // //       const result = await res.json()
// // // //       if (res.ok) {
// // // //         toast({ title: "Success", description: "Password updated successfully!" })
// // // //         setShowPasswordUpdate(false)
// // // //         setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
// // // //       } else {
// // // //         toast({ title: "Error", description: result.error || "Failed to update password", variant: "destructive" })
// // // //       }
// // // //     } catch (e) {
// // // //       toast({ title: "Error", description: "Failed to update password", variant: "destructive" })
// // // //     } finally {
// // // //       setPasswordLoading(false)
// // // //     }
// // // //   }

// // // //   if (!user || (user.role !== "Admin" && user.role !== "SuperAdmin")) {
// // // //     return null
// // // //   }

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="flex items-center justify-center min-h-screen">
// // // //         <div className="text-center">
// // // //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
// // // //           <p className="text-muted-foreground">Loading system settings...</p>
// // // //         </div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   return (
// // // //     <div className="space-y-6">
// // // //       <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // // //         <div>
// // // //           {user?.institutionName && (
// // // //             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded mb-1">
// // // //               {user.institutionName}
// // // //             </div>
// // // //           )}
// // // //           {!user?.institutionName && user?.role === "SuperAdmin" && (
// // // //             <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded mb-1">
// // // //               SuperAdmin
// // // //             </div>
// // // //           )}
// // // //           <h1 className="text-2xl font-semibold text-foreground">System Settings</h1>
// // // //           <p className="text-sm text-muted-foreground">Configure system preferences and manage all modules</p>
// // // //         </div>
// // // //         <Button
// // // //           className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:opacity-60"
// // // //           onClick={saveAllSettings}
// // // //           disabled={!isSuperAdmin || saving}
// // // //           aria-disabled={!isSuperAdmin || saving}
// // // //           title={!isSuperAdmin ? "Only SuperAdmin can save global settings" : "Save all settings"}
// // // //         >
// // // //           <Settings2 className="mr-2 h-4 w-4" />
// // // //           {saving ? "Saving..." : "Save All Settings"}
// // // //         </Button>
// // // //       </header>

// // // //       <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
// // // //         <Card>
// // // //           <CardHeader className="pb-2">
// // // //             <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
// // // //               <Users className="h-4 w-4" />
// // // //               Total Staff
// // // //             </CardTitle>
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-2xl font-bold text-blue-600">{systemStats?.totalStaff || 0}</div>
// // // //             <p className="text-xs text-muted-foreground mt-1">Active staff members</p>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card>
// // // //           <CardHeader className="pb-2">
// // // //             <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
// // // //               <GraduationCap className="h-4 w-4" />
// // // //               Total Students
// // // //             </CardTitle>
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-2xl font-bold text-green-600">{systemStats?.totalStudents || 0}</div>
// // // //             <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card>
// // // //           <CardHeader>
// // // //             <CardTitle className="flex items-center gap-2">
// // // //               <Clock className="h-5 w-5" />
// // // //               Today Present
// // // //             </CardTitle>
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-2xl font-bold text-teal-600">{systemStats?.todayAttendance?.present || 0}</div>
// // // //             <p className="text-xs text-muted-foreground mt-1">Present today</p>
// // // //           </CardContent>
// // // //         </Card>

// // // //         <Card>
// // // //           <CardHeader>
// // // //             <CardTitle className="flex items-center gap-2">
// // // //               <Database className="h-5 w-5" />
// // // //               System Health
// // // //             </CardTitle>
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="text-2xl font-bold text-green-600">100%</div>
// // // //             <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
// // // //           </CardContent>
// // // //         </Card>
// // // //       </div>

// // // //       {isSuperAdmin && (
// // // //         <div className="space-y-6">
// // // //           <StorageMonitor />
// // // //           <QuarterlyReportsManager />
// // // //         </div>
// // // //       )}

// // // //       {isSuperAdmin && (
// // // //         <Card>
// // // //           <CardHeader>
// // // //             <CardTitle className="flex items-center gap-2">
// // // //               <Shield className="h-5 w-5" />
// // // //               Operations & Maintenance
// // // //             </CardTitle>
// // // //           </CardHeader>
// // // //           <CardContent className="space-y-4">
// // // //             <div className="flex items-center justify-between">
// // // //               <div>
// // // //                 <Label htmlFor="maintenance-enabled">Maintenance Mode</Label>
// // // //                 <p className="text-sm text-muted-foreground">
// // // //                   Temporarily restrict non-admin access during maintenance
// // // //                 </p>
// // // //               </div>
// // // //               <Switch
// // // //                 id="maintenance-enabled"
// // // //                 checked={!!settings.maintenance?.enabled}
// // // //                 onCheckedChange={(checked) => updateSettings("maintenance", "enabled", checked)}
// // // //               />
// // // //             </div>
// // // //             <div>
// // // //               <Label htmlFor="maintenance-message">Maintenance Message</Label>
// // // //               <Input
// // // //                 id="maintenance-message"
// // // //                 placeholder="We'll be back shortly..."
// // // //                 value={settings.maintenance?.message || ""}
// // // //                 onChange={(e) => updateSettings("maintenance", "message", e.target.value)}
// // // //                 className="mt-1"
// // // //               />
// // // //             </div>
// // // //             <div className="text-xs text-muted-foreground">
// // // //               Note: Click "Save All Settings" at the top to apply changes.
// // // //             </div>
// // // //           </CardContent>
// // // //         </Card>
// // // //       )}

// // // //       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
// // // //         {!isSuperAdmin && user?.role === "Admin" && <InstitutionQuarterlyReports />}

// // // //         <PushNotificationManager />

// // // //         <Card>
// // // //           <CardHeader>
// // // //             <CardTitle className="flex items-center gap-2">
// // // //               <Shield className="h-5 w-5" />
// // // //               Location Verification
// // // //             </CardTitle>
// // // //           </CardHeader>
// // // //           <CardContent className="space-y-4">
// // // //             <div className="flex items-center justify-between">
// // // //               <div>
// // // //                 <Label htmlFor="location-verification">Enable Location Verification</Label>
// // // //                 <p className="text-sm text-muted-foreground">Verify user location before marking attendance</p>
// // // //               </div>
// // // //               <Switch
// // // //                 id="location-verification"
// // // //                 checked={!!settings.attendance?.locationVerificationEnabled}
// // // //                 onCheckedChange={(checked) => updateSettings("attendance", "locationVerificationEnabled", checked)}
// // // //               />
// // // //             </div>

// // // //             <div>
// // // //               <Label htmlFor="location-radius">Location Radius (meters)</Label>
// // // //               <Input
// // // //                 id="location-radius"
// // // //                 type="number"
// // // //                 min="10"
// // // //                 max="1000"
// // // //                 value={settings.attendance?.locationRadiusMeters || 100}
// // // //                 onChange={(e) => updateSettings("attendance", "locationRadiusMeters", Number.parseInt(e.target.value))}
// // // //                 className="mt-1"
// // // //                 disabled={!settings.attendance?.locationVerificationEnabled}
// // // //               />
// // // //               <p className="text-xs text-muted-foreground mt-1">
// // // //                 Allowed distance from assigned location (default: 100m)
// // // //               </p>
// // // //             </div>

// // // //             <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
// // // //               <p className="text-xs text-blue-800">
// // // //                 <strong>Note:</strong> When enabled, users must be within the specified radius of their assigned
// // // //                 location to mark attendance. Individual locations can be set in Staff/Student profiles.
// // // //               </p>
// // // //             </div>
// // // //           </CardContent>
// // // //         </Card>

// // // //         {isSuperAdmin && (
// // // //           <Card>
// // // //             <CardHeader>
// // // //               <CardTitle className="flex items-center gap-2">
// // // //                 <Bell className="h-5 w-5" />
// // // //                 Notification Settings
// // // //               </CardTitle>
// // // //             </CardHeader>
// // // //             <CardContent className="space-y-4">
// // // //               <div className="flex items-center justify-between">
// // // //                 <div>
// // // //                   <Label htmlFor="email-notifications">Email Notifications</Label>
// // // //                   <p className="text-sm text-muted-foreground">Receive attendance alerts via email</p>
// // // //                 </div>
// // // //                 <Switch
// // // //                   id="email-notifications"
// // // //                   checked={settings.notifications.emailNotifications}
// // // //                   onCheckedChange={(checked) => updateSettings("notifications", "emailNotifications", checked)}
// // // //                 />
// // // //               </div>

// // // //               <div className="flex items-center justify-between">
// // // //                 <div>
// // // //                   <Label htmlFor="late-alerts">Late Arrival Alerts</Label>
// // // //                   <p className="text-sm text-muted-foreground">Alert when someone is late</p>
// // // //                 </div>
// // // //                 <Switch
// // // //                   id="late-alerts"
// // // //                   checked={settings.notifications.lateAlerts}
// // // //                   onCheckedChange={(checked) => updateSettings("notifications", "lateAlerts", checked)}
// // // //                 />
// // // //               </div>

// // // //               <div className="flex items-center justify-between">
// // // //                 <div>
// // // //                   <Label htmlFor="absence-alerts">Absence Alerts</Label>
// // // //                   <p className="text-sm text-muted-foreground">Alert for unexpected absences</p>
// // // //                 </div>
// // // //                 <Switch
// // // //                   id="absence-alerts"
// // // //                   checked={settings.notifications.absenceAlerts}
// // // //                   onCheckedChange={(checked) => updateSettings("notifications", "absenceAlerts", checked)}
// // // //                 />
// // // //               </div>

// // // //               <div className="flex items-center justify-between">
// // // //                 <div>
// // // //                   <Label htmlFor="update-notifications">Profile Update Notifications</Label>
// // // //                   <p className="text-sm text-muted-foreground">Email when staff/student data is updated</p>
// // // //                 </div>
// // // //                 <Switch
// // // //                   id="update-notifications"
// // // //                   checked={settings.notifications.updateNotifications}
// // // //                   onCheckedChange={(checked) => updateSettings("notifications", "updateNotifications", checked)}
// // // //                 />
// // // //               </div>
// // // //             </CardContent>
// // // //           </Card>
// // // //         )}

// // // //         {isSuperAdmin && (
// // // //           <Card>
// // // //             <CardHeader>
// // // //               <CardTitle className="flex items-center gap-2">
// // // //                 <Shield className="h-5 w-5" />
// // // //                 Security Settings
// // // //               </CardTitle>
// // // //             </CardHeader>
// // // //             <CardContent className="space-y-4">
// // // //               <div>
// // // //                 <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
// // // //                 <Input
// // // //                   id="session-timeout"
// // // //                   type="number"
// // // //                   value={settings.security.sessionTimeout}
// // // //                   onChange={(e) => updateSettings("security", "sessionTimeout", Number.parseInt(e.target.value))}
// // // //                   className="mt-1"
// // // //                 />
// // // //               </div>

// // // //               <div>
// // // //                 <Label htmlFor="password-policy">Password Policy</Label>
// // // //                 <Select
// // // //                   value={settings.security.passwordPolicy}
// // // //                   onValueChange={(value) => updateSettings("security", "passwordPolicy", value)}
// // // //                 >
// // // //                   <SelectTrigger className="mt-1">
// // // //                     <SelectValue />
// // // //                   </SelectTrigger>
// // // //                   <SelectContent>
// // // //                     <SelectItem value="low">Low Security (6+ chars)</SelectItem>
// // // //                     <SelectItem value="medium">Medium Security (8+ chars, mixed case)</SelectItem>
// // // //                     <SelectItem value="high">High Security (12+ chars, symbols)</SelectItem>
// // // //                   </SelectContent>
// // // //                 </Select>
// // // //               </div>

// // // //               <div className="flex items-center justify-between">
// // // //                 <div>
// // // //                   <Label htmlFor="two-factor">Two-Factor Authentication</Label>
// // // //                   <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
// // // //                 </div>
// // // //                 <Switch
// // // //                   id="two-factor"
// // // //                   checked={settings.security.twoFactor}
// // // //                   onCheckedChange={(checked) => updateSettings("security", "twoFactor", checked)}
// // // //                 />
// // // //               </div>

// // // //               <div className="flex items-center justify-between">
// // // //                 <div>
// // // //                   <Label htmlFor="auto-logout">Auto Logout</Label>
// // // //                   <p className="text-sm text-muted-foreground">Automatically logout inactive users</p>
// // // //                 </div>
// // // //                 <Switch
// // // //                   id="auto-logout"
// // // //                   checked={settings.security.autoLogout}
// // // //                   onCheckedChange={(checked) => updateSettings("security", "autoLogout", checked)}
// // // //                 />
// // // //               </div>
// // // //             </CardContent>
// // // //           </Card>
// // // //         )}

// // // //         {isSuperAdmin && (
// // // //           <Card>
// // // //             <CardHeader>
// // // //               <CardTitle className="flex items-center gap-2">
// // // //                 <Database className="h-5 w-5" />
// // // //                 Data Management
// // // //               </CardTitle>
// // // //             </CardHeader>
// // // //             <CardContent className="space-y-4">
// // // //               <div>
// // // //                 <Label htmlFor="backup-frequency">Backup Frequency</Label>
// // // //                 <Select
// // // //                   value={settings.dataManagement.backupFrequency}
// // // //                   onValueChange={(value) => updateSettings("dataManagement", "backupFrequency", value)}
// // // //                 >
// // // //                   <SelectTrigger className="mt-1">
// // // //                     <SelectValue />
// // // //                   </SelectTrigger>
// // // //                   <SelectContent>
// // // //                     <SelectItem value="hourly">Hourly</SelectItem>
// // // //                     <SelectItem value="daily">Daily</SelectItem>
// // // //                     <SelectItem value="weekly">Weekly</SelectItem>
// // // //                     <SelectItem value="monthly">Monthly</SelectItem>
// // // //                   </SelectContent>
// // // //                 </Select>
// // // //               </div>

// // // //               <div>
// // // //                 <Label htmlFor="retention-period">Data Retention (months)</Label>
// // // //                 <Input
// // // //                   id="retention-period"
// // // //                   type="number"
// // // //                   value={settings.dataManagement.retentionPeriod}
// // // //                   onChange={(e) => updateSettings("dataManagement", "retentionPeriod", Number.parseInt(e.target.value))}
// // // //                   className="mt-1"
// // // //                 />
// // // //               </div>

// // // //               <div className="space-y-2">
// // // //                 <Button variant="outline" className="w-full bg-transparent" onClick={exportStaffData}>
// // // //                   <Database className="mr-2 h-4 w-4" />
// // // //                   Export Staff Data ({systemStats?.totalStaff || 0} records)
// // // //                 </Button>
// // // //                 <Button variant="outline" className="w-full bg-transparent" onClick={exportStudentData}>
// // // //                   <Database className="mr-2 h-4 w-4" />
// // // //                   Export Student Data ({systemStats?.totalStudents || 0} records)
// // // //                 </Button>
// // // //                 <Link href="/reports" className="w-full">
// // // //                   <Button variant="outline" className="w-full justify-center bg-transparent">
// // // //                     <Database className="mr-2 h-4 w-4" />
// // // //                     Export Attendance Records (via Reports)
// // // //                   </Button>
// // // //                 </Link>
// // // //               </div>

// // // //               <div className="flex items-center justify-between">
// // // //                 <div>
// // // //                   <Label htmlFor="auto-export">Auto Export Reports</Label>
// // // //                   <p className="text-sm text-muted-foreground">Automatically export monthly reports</p>
// // // //                 </div>
// // // //                 <Switch
// // // //                   id="auto-export"
// // // //                   checked={settings.dataManagement.autoExport}
// // // //                   onCheckedChange={(checked) => updateSettings("dataManagement", "autoExport", checked)}
// // // //                 />
// // // //               </div>
// // // //             </CardContent>
// // // //           </Card>
// // // //         )}

// // // //         {isSuperAdmin && (
// // // //           <Card>
// // // //             <CardHeader>
// // // //               <CardTitle className="flex items-center gap-2">
// // // //                 <Mail className="h-5 w-5" />
// // // //                 Email Configuration
// // // //               </CardTitle>
// // // //             </CardHeader>
// // // //             <CardContent className="space-y-4">
// // // //               <div>
// // // //                 <Label htmlFor="smtp-server">SMTP Server</Label>
// // // //                 <Input
// // // //                   id="smtp-server"
// // // //                   placeholder="smtp.gmail.com"
// // // //                   value={settings.email.smtpServer}
// // // //                   onChange={(e) => updateSettings("email", "smtpServer", e.target.value)}
// // // //                   className="mt-1"
// // // //                 />
// // // //               </div>

// // // //               <div className="grid grid-cols-2 gap-4">
// // // //                 <div>
// // // //                   <Label htmlFor="smtp-port">Port</Label>
// // // //                   <Input
// // // //                     id="smtp-port"
// // // //                     type="number"
// // // //                     value={settings.email.smtpPort}
// // // //                     onChange={(e) => updateSettings("email", "smtpPort", Number.parseInt(e.target.value))}
// // // //                     className="mt-1"
// // // //                   />
// // // //                 </div>
// // // //                 <div>
// // // //                   <Label htmlFor="smtp-security">Security</Label>
// // // //                   <Select
// // // //                     value={settings.email.smtpSecurity}
// // // //                     onValueChange={(value) => updateSettings("email", "smtpSecurity", value)}
// // // //                   >
// // // //                     <SelectTrigger className="mt-1">
// // // //                       <SelectValue />
// // // //                     </SelectTrigger>
// // // //                     <SelectContent>
// // // //                       <SelectItem value="none">None</SelectItem>
// // // //                       <SelectItem value="tls">TLS</SelectItem>
// // // //                       <SelectItem value="ssl">SSL</SelectItem>
// // // //                     </SelectContent>
// // // //                   </Select>
// // // //                 </div>
// // // //               </div>

// // // //               <div>
// // // //                 <Label htmlFor="from-email">From Email</Label>
// // // //                 <Input
// // // //                   id="from-email"
// // // //                   type="email"
// // // //                   placeholder="noreply@genamplify.com"
// // // //                   value={settings.email.fromEmail}
// // // //                   onChange={(e) => updateSettings("email", "fromEmail", e.target.value)}
// // // //                   className="mt-1"
// // // //                 />
// // // //               </div>

// // // //               <Button className="w-full" onClick={testEmailConfiguration}>
// // // //                 <Mail className="mr-2 h-4 w-4" />
// // // //                 Test Email Configuration
// // // //               </Button>
// // // //             </CardContent>
// // // //           </Card>
// // // //         )}

// // // //         {isSuperAdmin && (
// // // //           <Card>
// // // //             <CardHeader>
// // // //               <CardTitle className="flex items-center gap-2">
// // // //                 <Shield className="h-5 w-5" />
// // // //                 PWA Update Settings
// // // //               </CardTitle>
// // // //             </CardHeader>
// // // //             <CardContent className="space-y-4">
// // // //               <div className="flex items-center justify-between">
// // // //                 <div>
// // // //                   <Label htmlFor="skip-waiting">Auto-Update (Skip Waiting)</Label>
// // // //                   <p className="text-sm text-muted-foreground">
// // // //                     Automatically update the app without showing update prompt to users
// // // //                   </p>
// // // //                 </div>
// // // //                 <Switch
// // // //                   id="skip-waiting"
// // // //                   checked={!!settings.pwaUpdate?.skipWaiting}
// // // //                   onCheckedChange={(checked) => updateSettings("pwaUpdate", "skipWaiting", checked)}
// // // //                 />
// // // //               </div>
// // // //               <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
// // // //                 <p className="text-xs text-blue-800">
// // // //                   <strong>Enabled:</strong> App updates automatically in the background without user interaction.
// // // //                   <br />
// // // //                   <strong>Disabled:</strong> Users see an update prompt and can choose when to update.
// // // //                 </p>
// // // //               </div>
// // // //             </CardContent>
// // // //           </Card>
// // // //         )}
// // // //       </div>

// // // //       {isSuperAdmin && <LoginHistoryViewer userRole={(user as any)?.role || ""} />}

// // // //       {isSuperAdmin && <NotificationDebugPanel />}

// // // //       <Card>
// // // //         <CardHeader className="pb-2">
// // // //           <CardTitle className="text-sm font-medium text-foreground">Quick Actions</CardTitle>
// // // //         </CardHeader>
// // // //         <CardContent>
// // // //           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
// // // //             <Link href="/settings/shifts" className="w-full">
// // // //               <Button variant="outline" className="w-full justify-center bg-transparent">
// // // //                 <Clock className="mr-2 h-4 w-4" />
// // // //                 Shift Timings
// // // //               </Button>
// // // //             </Link>
// // // //             <Button
// // // //               variant="outline"
// // // //               className="w-full justify-center bg-transparent"
// // // //               onClick={() => setShowProfileModal(true)}
// // // //             >
// // // //               <User className="mr-2 h-4 w-4" />
// // // //               View Profile
// // // //             </Button>
// // // //             <Link href="/reports" className="w-full">
// // // //               <Button variant="outline" className="w-full justify-center bg-transparent">
// // // //                 <BarChart3 className="mr-2 h-4 w-4" />
// // // //                 Reports
// // // //               </Button>
// // // //             </Link>
// // // //             <Button
// // // //               variant="outline"
// // // //               className="w-full justify-center bg-transparent"
// // // //               onClick={() => setShowPasswordUpdate(true)}
// // // //             >
// // // //               <Lock className="mr-2 h-4 w-4" />
// // // //               Change Password
// // // //             </Button>
// // // //             <Button variant="destructive" className="w-full justify-center" onClick={handleLogout}>
// // // //               <LogOut className="mr-2 h-4 w-4" />
// // // //               Logout
// // // //             </Button>
// // // //           </div>
// // // //         </CardContent>
// // // //       </Card>

// // // //       <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
// // // //         <DialogContent className="max-w-md">
// // // //           <DialogHeader>
// // // //             <DialogTitle>Profile</DialogTitle>
// // // //             <DialogDescription>Your account details</DialogDescription>
// // // //           </DialogHeader>
// // // //           <div className="space-y-2">
// // // //             <div>
// // // //               <Label>Name</Label>
// // // //               <p className="text-sm text-foreground mt-1">{(user as any)?.name || "N/A"}</p>
// // // //             </div>
// // // //             <div>
// // // //               <Label>Email</Label>
// // // //               <p className="text-sm text-foreground mt-1">{(user as any)?.email || "N/A"}</p>
// // // //             </div>
// // // //             <div>
// // // //               <Label>Role</Label>
// // // //               <p className="text-sm text-foreground mt-1">{(user as any)?.role || "N/A"}</p>
// // // //             </div>
// // // //             {(user as any)?.institutionName && (
// // // //               <div>
// // // //                 <Label>Institution</Label>
// // // //                 <p className="text-sm text-foreground mt-1">{(user as any)?.institutionName}</p>
// // // //               </div>
// // // //             )}
// // // //             <div className="pt-2">
// // // //               <Button variant="outline" onClick={() => setShowProfileModal(false)} className="w-full">
// // // //                 Close
// // // //               </Button>
// // // //             </div>
// // // //           </div>
// // // //         </DialogContent>
// // // //       </Dialog>

// // // //       <Dialog open={showPasswordUpdate} onOpenChange={setShowPasswordUpdate}>
// // // //         <DialogContent className="max-w-md">
// // // //           <DialogHeader>
// // // //             <DialogTitle>Change Password</DialogTitle>
// // // //             <DialogDescription>Enter your current and new password</DialogDescription>
// // // //           </DialogHeader>
// // // //           <div className="space-y-3">
// // // //             <div className="space-y-1.5">
// // // //               <Label htmlFor="current-password">Current Password</Label>
// // // //               <Input
// // // //                 id="current-password"
// // // //                 type="password"
// // // //                 value={passwordData.currentPassword}
// // // //                 onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
// // // //                 placeholder="Enter current password"
// // // //               />
// // // //             </div>
// // // //             <div className="space-y-1.5">
// // // //               <Label htmlFor="new-password">New Password</Label>
// // // //               <Input
// // // //                 id="new-password"
// // // //                 type="password"
// // // //                 value={passwordData.newPassword}
// // // //                 onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
// // // //                 placeholder="Enter new password (min 6 characters)"
// // // //               />
// // // //             </div>
// // // //             <div className="space-y-1.5">
// // // //               <Label htmlFor="confirm-password">Confirm New Password</Label>
// // // //               <Input
// // // //                 id="confirm-password"
// // // //                 type="password"
// // // //                 value={passwordData.confirmPassword}
// // // //                 onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
// // // //                 placeholder="Confirm new password"
// // // //               />
// // // //             </div>
// // // //             <div className="flex gap-2 pt-1 justify-end">
// // // //               <Button
// // // //                 variant="outline"
// // // //                 onClick={() => {
// // // //                   setShowPasswordUpdate(false)
// // // //                   setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
// // // //                 }}
// // // //               >
// // // //                 Cancel
// // // //               </Button>
// // // //               <Button
// // // //                 onClick={handlePasswordUpdate}
// // // //                 disabled={
// // // //                   passwordLoading ||
// // // //                   !passwordData.currentPassword ||
// // // //                   !passwordData.newPassword ||
// // // //                   !passwordData.confirmPassword
// // // //                 }
// // // //               >
// // // //                 {passwordLoading ? "Updating..." : "Update Password"}
// // // //               </Button>
// // // //             </div>
// // // //           </div>
// // // //         </DialogContent>
// // // //       </Dialog>
// // // //     </div>
// // // //   )
// // // // }




// // // "use client"

// // // import { useEffect, useState } from "react"
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // // import { Button } from "@/components/ui/button"
// // // import { Input } from "@/components/ui/input"
// // // import { Label } from "@/components/ui/label"
// // // import { Switch } from "@/components/ui/switch"
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // // import { toast } from "@/hooks/use-toast"
// // // import useSWR from "swr"
// // // import InstitutionQuarterlyReports from "@/components/institution-quarterly-reports"
// // // import PushNotificationManager from "@/components/push-notification-manager"
// // // import LoginHistoryViewer from "@/components/login-history-viewer"
// // // import { StorageMonitor } from "@/components/storage-monitor"
// // // import { QuarterlyReportsManager } from "@/components/quarterly-reports-manager"
// // // import {
// // //   Bell,
// // //   Shield,
// // //   Database,
// // //   Mail,
// // //   Users,
// // //   GraduationCap,
// // //   Clock,
// // //   Settings2,
// // //   Lock,
// // //   LogOut,
// // //   User,
// // //   BarChart3,
// // // } from "lucide-react"
// // // import { getStoredUser } from "@/lib/auth"
// // // import { useRouter } from "next/navigation"
// // // import Link from "next/link"
// // // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// // // import { logout } from "@/lib/auth"

// // // export default function SettingsPage() {
// // //   const [user, setUser] = useState(null)
// // //   const [systemStats, setSystemStats] = useState(null)
// // //   const [loading, setLoading] = useState(true)
// // //   const [settings, setSettings] = useState({
// // //     notifications: {
// // //       emailNotifications: true,
// // //       lateAlerts: true,
// // //       absenceAlerts: false,
// // //       updateNotifications: true,
// // //     },
// // //     security: {
// // //       sessionTimeout: 30,
// // //       passwordPolicy: "medium",
// // //       twoFactor: false,
// // //       autoLogout: true,
// // //     },
// // //     dataManagement: {
// // //       backupFrequency: "daily",
// // //       retentionPeriod: 12,
// // //       autoExport: false,
// // //     },
// // //     email: {
// // //       smtpServer: "",
// // //       smtpPort: 587,
// // //       smtpSecurity: "tls",
// // //       fromEmail: "",
// // //     },
// // //     maintenance: {
// // //       enabled: false,
// // //       message: "",
// // //     },
// // //     attendance: {
// // //       locationVerificationEnabled: true,
// // //       locationRadiusMeters: 100,
// // //     },
// // //     pwaUpdate: {
// // //       skipWaiting: false,
// // //     },
// // //   })
// // //   const router = useRouter()
// // //   const [showProfileModal, setShowProfileModal] = useState(false)
// // //   const [showPasswordUpdate, setShowPasswordUpdate] = useState(false)
// // //   const [passwordData, setPasswordData] = useState({
// // //     currentPassword: "",
// // //     newPassword: "",
// // //     confirmPassword: "",
// // //   })
// // //   const [passwordLoading, setPasswordLoading] = useState(false)
// // //   const [saving, setSaving] = useState(false)
// // //   const isSuperAdmin = (user as any)?.role === "SuperAdmin"

// // //   const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json())
// // //   const {
// // //     data: infra,
// // //     isLoading: infraLoading,
// // //     mutate: refreshInfra,
// // //   } = useSWR(isSuperAdmin ? "/api/admin/system" : null, fetcher)

// // //   const formatBytes = (bytes?: number | null) => {
// // //     if (typeof bytes !== "number" || !isFinite(bytes)) return "N/A"
// // //     if (bytes === 0) return "0 B"
// // //     const k = 1024
// // //     const sizes = ["B", "KB", "MB", "GB", "TB"]
// // //     const i = Math.floor(Math.log(bytes) / Math.log(k))
// // //     return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
// // //   }

// // //   useEffect(() => {
// // //     const storedUser = getStoredUser()
// // //     setUser(storedUser)

// // //     if (!storedUser || (storedUser.role !== "Admin" && storedUser.role !== "SuperAdmin")) {
// // //       router.push("/")
// // //     } else {
// // //       fetchSystemStats()
// // //       if (storedUser.role === "SuperAdmin") {
// // //         void loadSavedSettings()
// // //       }
// // //     }
// // //   }, [router])

// // //   const fetchSystemStats = async () => {
// // //     try {
// // //       setLoading(true)
// // //       const u = getStoredUser()
// // //       const inst = u?.role !== "SuperAdmin" ? u?.institutionName : undefined
// // //       const q = inst ? `?institutionName=${encodeURIComponent(inst)}` : ""

// // //       const [staffRes, studentsRes, attendanceRes, summaryRes] = await Promise.all([
// // //         fetch(`/api/staff${q}`),
// // //         fetch(`/api/students${q}`),
// // //         fetch(`/api/attendance${q}`),
// // //         fetch(`/api/reports/summary${q}`),
// // //       ])

// // //       const [staff, students, attendance, summary] = await Promise.all([
// // //         staffRes.ok ? staffRes.json() : { items: [], departments: [], roles: [], shifts: [] },
// // //         studentsRes.ok ? studentsRes.json() : { items: [] },
// // //         attendanceRes.ok ? attendanceRes.json() : { totalCounts: {} },
// // //         summaryRes.ok ? summaryRes.json() : {},
// // //       ])

// // //       setSystemStats({
// // //         totalStaff: staff.items?.length || 0,
// // //         totalStudents: students.items?.length || 0,
// // //         todayAttendance: attendance.totalCounts || {},
// // //         departments: staff.departments || [],
// // //         roles: staff.roles || [],
// // //         shifts: staff.shifts || [],
// // //         summary,
// // //       })
// // //     } catch (error) {
// // //       console.error("Failed to fetch system stats:", error)
// // //       setSystemStats({
// // //         totalStaff: 0,
// // //         totalStudents: 0,
// // //         todayAttendance: {},
// // //         departments: [],
// // //         roles: [],
// // //         shifts: [],
// // //         summary: {},
// // //       })

// // //       if (!navigator.onLine) {
// // //         toast({
// // //           title: "Offline Mode",
// // //           description: "Some data may not be available. Please check your connection.",
// // //           variant: "destructive",
// // //         })
// // //       }
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   const loadSavedSettings = async () => {
// // //     try {
// // //       const [globalRes, pwaRes] = await Promise.all([
// // //         fetch("/api/settings?scope=global", { cache: "no-store" }),
// // //         fetch("/api/settings/pwa-update", { cache: "no-store" }),
// // //       ])

// // //       if (globalRes.ok) {
// // //         const json = await globalRes.json()
// // //         if (json?.data && typeof json.data === "object") {
// // //           setSettings((prev) => ({ ...prev, ...json.data }))
// // //         }
// // //       }

// // //       if (pwaRes.ok) {
// // //         const pwaJson = await pwaRes.json()
// // //         if (pwaJson?.success) {
// // //           setSettings((prev) => ({
// // //             ...prev,
// // //             pwaUpdate: {
// // //               skipWaiting: pwaJson.skipWaiting || false,
// // //             },
// // //           }))
// // //         }
// // //       }
// // //     } catch (e) {
// // //       console.error("[settings] load failed", e)
// // //     }
// // //   }

// // //   const saveAllSettings = async () => {
// // //     try {
// // //       setSaving(true)

// // //       // Save global settings
// // //       const globalRes = await fetch("/api/settings", {
// // //         method: "PUT",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ scope: "global", data: settings }),
// // //       })

// // //       const pwaRes = await fetch("/api/settings/pwa-update", {
// // //         method: "PUT",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ skipWaiting: settings.pwaUpdate.skipWaiting }),
// // //       })

// // //       if (!globalRes.ok || !pwaRes.ok) {
// // //         throw new Error("Failed to save settings")
// // //       }

// // //       toast({ title: "Settings saved", description: "Your configuration has been updated." })
// // //     } catch (e: any) {
// // //       toast({ title: "Save failed", description: e?.message || "Unable to save settings", variant: "destructive" })
// // //     } finally {
// // //       setSaving(false)
// // //     }
// // //   }

// // //   const updateSettings = async (category: string, key: string, value: any) => {
// // //     setSettings((prev) => ({
// // //       ...prev,
// // //       [category]: {
// // //         ...prev[category],
// // //         [key]: value,
// // //       },
// // //     }))
// // //     // Here you would typically save to backend
// // //     console.log(`Updated ${category}.${key} to:`, value)
// // //   }

// // //   const downloadBlob = (blob: Blob, filename: string) => {
// // //     const url = URL.createObjectURL(blob)
// // //     const a = document.createElement("a")
// // //     a.href = url
// // //     a.download = filename
// // //     document.body.appendChild(a)
// // //     a.click()
// // //     a.remove()
// // //     URL.revokeObjectURL(url)
// // //   }

// // //   const exportStaffData = async () => {
// // //     try {
// // //       const resList = await fetch("/api/staff")
// // //       const list = await resList.json()
// // //       const data = Array.isArray(list?.items) ? list.items : []
// // //       const res = await fetch("/api/export/staff?format=excel", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ data }),
// // //       })
// // //       if (!res.ok) throw new Error("Export failed")
// // //       const blob = await res.blob()
// // //       downloadBlob(blob, "staff_export.xlsx")
// // //     } catch (e) {
// // //       toast({ title: "Export failed", description: "Could not export staff data", variant: "destructive" })
// // //     }
// // //   }

// // //   const exportStudentData = async () => {
// // //     try {
// // //       const resList = await fetch("/api/students")
// // //       const list = await resList.json()
// // //       const data = Array.isArray(list?.items) ? list.items : []
// // //       const res = await fetch("/api/export/students?format=excel", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ data }),
// // //       })
// // //       if (!res.ok) throw new Error("Export failed")
// // //       const blob = await res.blob()
// // //       downloadBlob(blob, "students_export.xlsx")
// // //     } catch (e) {
// // //       toast({ title: "Export failed", description: "Could not export student data", variant: "destructive" })
// // //     }
// // //   }

// // //   const testEmailConfiguration = async () => {
// // //     try {
// // //       const to = (user as any)?.email
// // //       const res = await fetch("/api/email/test", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({
// // //           to,
// // //           from: settings.email.fromEmail || undefined,
// // //           subject: "Test Email Configuration",
// // //           text: "This is a test email from Settings.",
// // //         }),
// // //       })
// // //       const result = await res.json()
// // //       if (res.ok) {
// // //         toast({ title: "Email sent", description: `Message ID: ${result?.messageId || "N/A"}` })
// // //       } else {
// // //         toast({ title: "Email test failed", description: result?.error || "Unknown error", variant: "destructive" })
// // //       }
// // //     } catch (error) {
// // //       toast({ title: "Email test failed", description: "Unable to send test email", variant: "destructive" })
// // //     }
// // //   }

// // //   const handleLogout = () => {
// // //     logout()
// // //     router.push("/login")
// // //   }

// // //   const handlePasswordUpdate = async () => {
// // //     if (passwordData.newPassword !== passwordData.confirmPassword) {
// // //       toast({ title: "Error", description: "New passwords do not match", variant: "destructive" })
// // //       return
// // //     }
// // //     if (passwordData.newPassword.length < 6) {
// // //       toast({ title: "Error", description: "Password must be at least 6 characters long", variant: "destructive" })
// // //       return
// // //     }

// // //     try {
// // //       setPasswordLoading(true)
// // //       const res = await fetch("/api/auth/change-password", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({
// // //           userId: (user as any)?.id,
// // //           currentPassword: passwordData.currentPassword,
// // //           newPassword: passwordData.newPassword,
// // //         }),
// // //       })
// // //       const result = await res.json()
// // //       if (res.ok) {
// // //         toast({ title: "Success", description: "Password updated successfully!" })
// // //         setShowPasswordUpdate(false)
// // //         setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
// // //       } else {
// // //         toast({ title: "Error", description: result.error || "Failed to update password", variant: "destructive" })
// // //       }
// // //     } catch (e) {
// // //       toast({ title: "Error", description: "Failed to update password", variant: "destructive" })
// // //     } finally {
// // //       setPasswordLoading(false)
// // //     }
// // //   }

// // //   if (!user || (user.role !== "Admin" && user.role !== "SuperAdmin")) {
// // //     return null
// // //   }

// // //   if (loading) {
// // //     return (
// // //       <div className="flex items-center justify-center min-h-screen">
// // //         <div className="text-center">
// // //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
// // //           <p className="text-muted-foreground">Loading system settings...</p>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div className="space-y-6">
// // //       <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //         <div>
// // //           {user?.institutionName && (
// // //             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded mb-1">
// // //               {user.institutionName}
// // //             </div>
// // //           )}
// // //           {!user?.institutionName && user?.role === "SuperAdmin" && (
// // //             <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded mb-1">
// // //               SuperAdmin
// // //             </div>
// // //           )}
// // //           <h1 className="text-2xl font-semibold text-foreground">System Settings</h1>
// // //           <p className="text-sm text-muted-foreground">Configure system preferences and manage all modules</p>
// // //         </div>
// // //         <Button
// // //           className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:opacity-60"
// // //           onClick={saveAllSettings}
// // //           disabled={!isSuperAdmin || saving}
// // //           aria-disabled={!isSuperAdmin || saving}
// // //           title={!isSuperAdmin ? "Only SuperAdmin can save global settings" : "Save all settings"}
// // //         >
// // //           <Settings2 className="mr-2 h-4 w-4" />
// // //           {saving ? "Saving..." : "Save All Settings"}
// // //         </Button>
// // //       </header>

// // //       <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
// // //         <Card>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
// // //               <Users className="h-4 w-4" />
// // //               Total Staff
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-bold text-blue-600">{systemStats?.totalStaff || 0}</div>
// // //             <p className="text-xs text-muted-foreground mt-1">Active staff members</p>
// // //           </CardContent>
// // //         </Card>

// // //         <Card>
// // //           <CardHeader className="pb-2">
// // //             <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
// // //               <GraduationCap className="h-4 w-4" />
// // //               Total Students
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-bold text-green-600">{systemStats?.totalStudents || 0}</div>
// // //             <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
// // //           </CardContent>
// // //         </Card>

// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="flex items-center gap-2">
// // //               <Clock className="h-5 w-5" />
// // //               Today Present
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-bold text-teal-600">{systemStats?.todayAttendance?.present || 0}</div>
// // //             <p className="text-xs text-muted-foreground mt-1">Present today</p>
// // //           </CardContent>
// // //         </Card>

// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="flex items-center gap-2">
// // //               <Database className="h-5 w-5" />
// // //               System Health
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <div className="text-2xl font-bold text-green-600">100%</div>
// // //             <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
// // //           </CardContent>
// // //         </Card>
// // //       </div>

// // //       {isSuperAdmin && (
// // //         <div className="space-y-6">
// // //           <StorageMonitor />
// // //           <QuarterlyReportsManager />
// // //         </div>
// // //       )}

// // //       {isSuperAdmin && (
// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="flex items-center gap-2">
// // //               <Shield className="h-5 w-5" />
// // //               Operations & Maintenance
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent className="space-y-4">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <Label htmlFor="maintenance-enabled">Maintenance Mode</Label>
// // //                 <p className="text-sm text-muted-foreground">
// // //                   Temporarily restrict non-admin access during maintenance
// // //                 </p>
// // //               </div>
// // //               <Switch
// // //                 id="maintenance-enabled"
// // //                 checked={!!settings.maintenance?.enabled}
// // //                 onCheckedChange={(checked) => updateSettings("maintenance", "enabled", checked)}
// // //               />
// // //             </div>
// // //             <div>
// // //               <Label htmlFor="maintenance-message">Maintenance Message</Label>
// // //               <Input
// // //                 id="maintenance-message"
// // //                 placeholder="We'll be back shortly..."
// // //                 value={settings.maintenance?.message || ""}
// // //                 onChange={(e) => updateSettings("maintenance", "message", e.target.value)}
// // //                 className="mt-1"
// // //               />
// // //             </div>
// // //             <div className="text-xs text-muted-foreground">
// // //               Note: Click "Save All Settings" at the top to apply changes.
// // //             </div>
// // //           </CardContent>
// // //         </Card>
// // //       )}

// // //       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
// // //         {!isSuperAdmin && user?.role === "Admin" && <InstitutionQuarterlyReports />}

// // //         <PushNotificationManager />

// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle className="flex items-center gap-2">
// // //               <Shield className="h-5 w-5" />
// // //               Location Verification
// // //             </CardTitle>
// // //           </CardHeader>
// // //           <CardContent className="space-y-4">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <Label htmlFor="location-verification">Enable Location Verification</Label>
// // //                 <p className="text-sm text-muted-foreground">Verify user location before marking attendance</p>
// // //               </div>
// // //               <Switch
// // //                 id="location-verification"
// // //                 checked={!!settings.attendance?.locationVerificationEnabled}
// // //                 onCheckedChange={(checked) => updateSettings("attendance", "locationVerificationEnabled", checked)}
// // //               />
// // //             </div>

// // //             <div>
// // //               <Label htmlFor="location-radius">Location Radius (meters)</Label>
// // //               <Input
// // //                 id="location-radius"
// // //                 type="number"
// // //                 min="10"
// // //                 max="1000"
// // //                 value={settings.attendance?.locationRadiusMeters || 100}
// // //                 onChange={(e) => updateSettings("attendance", "locationRadiusMeters", Number.parseInt(e.target.value))}
// // //                 className="mt-1"
// // //                 disabled={!settings.attendance?.locationVerificationEnabled}
// // //               />
// // //               <p className="text-xs text-muted-foreground mt-1">
// // //                 Allowed distance from assigned location (default: 100m)
// // //               </p>
// // //             </div>

// // //             <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
// // //               <p className="text-xs text-blue-800">
// // //                 <strong>Note:</strong> When enabled, users must be within the specified radius of their assigned
// // //                 location to mark attendance. Individual locations can be set in Staff/Student profiles.
// // //               </p>
// // //             </div>
// // //           </CardContent>
// // //         </Card>

// // //         {isSuperAdmin && (
// // //           <Card>
// // //             <CardHeader>
// // //               <CardTitle className="flex items-center gap-2">
// // //                 <Bell className="h-5 w-5" />
// // //                 Notification Settings
// // //               </CardTitle>
// // //             </CardHeader>
// // //             <CardContent className="space-y-4">
// // //               <div className="flex items-center justify-between">
// // //                 <div>
// // //                   <Label htmlFor="email-notifications">Email Notifications</Label>
// // //                   <p className="text-sm text-muted-foreground">Receive attendance alerts via email</p>
// // //                 </div>
// // //                 <Switch
// // //                   id="email-notifications"
// // //                   checked={settings.notifications.emailNotifications}
// // //                   onCheckedChange={(checked) => updateSettings("notifications", "emailNotifications", checked)}
// // //                 />
// // //               </div>

// // //               <div className="flex items-center justify-between">
// // //                 <div>
// // //                   <Label htmlFor="late-alerts">Late Arrival Alerts</Label>
// // //                   <p className="text-sm text-muted-foreground">Alert when someone is late</p>
// // //                 </div>
// // //                 <Switch
// // //                   id="late-alerts"
// // //                   checked={settings.notifications.lateAlerts}
// // //                   onCheckedChange={(checked) => updateSettings("notifications", "lateAlerts", checked)}
// // //                 />
// // //               </div>

// // //               <div className="flex items-center justify-between">
// // //                 <div>
// // //                   <Label htmlFor="absence-alerts">Absence Alerts</Label>
// // //                   <p className="text-sm text-muted-foreground">Alert for unexpected absences</p>
// // //                 </div>
// // //                 <Switch
// // //                   id="absence-alerts"
// // //                   checked={settings.notifications.absenceAlerts}
// // //                   onCheckedChange={(checked) => updateSettings("notifications", "absenceAlerts", checked)}
// // //                 />
// // //               </div>

// // //               <div className="flex items-center justify-between">
// // //                 <div>
// // //                   <Label htmlFor="update-notifications">Profile Update Notifications</Label>
// // //                   <p className="text-sm text-muted-foreground">Email when staff/student data is updated</p>
// // //                 </div>
// // //                 <Switch
// // //                   id="update-notifications"
// // //                   checked={settings.notifications.updateNotifications}
// // //                   onCheckedChange={(checked) => updateSettings("notifications", "updateNotifications", checked)}
// // //                 />
// // //               </div>
// // //             </CardContent>
// // //           </Card>
// // //         )}

// // //         {isSuperAdmin && (
// // //           <Card>
// // //             <CardHeader>
// // //               <CardTitle className="flex items-center gap-2">
// // //                 <Shield className="h-5 w-5" />
// // //                 Security Settings
// // //               </CardTitle>
// // //             </CardHeader>
// // //             <CardContent className="space-y-4">
// // //               <div>
// // //                 <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
// // //                 <Input
// // //                   id="session-timeout"
// // //                   type="number"
// // //                   value={settings.security.sessionTimeout}
// // //                   onChange={(e) => updateSettings("security", "sessionTimeout", Number.parseInt(e.target.value))}
// // //                   className="mt-1"
// // //                 />
// // //               </div>

// // //               <div>
// // //                 <Label htmlFor="password-policy">Password Policy</Label>
// // //                 <Select
// // //                   value={settings.security.passwordPolicy}
// // //                   onValueChange={(value) => updateSettings("security", "passwordPolicy", value)}
// // //                 >
// // //                   <SelectTrigger className="mt-1">
// // //                     <SelectValue />
// // //                   </SelectTrigger>
// // //                   <SelectContent>
// // //                     <SelectItem value="low">Low Security (6+ chars)</SelectItem>
// // //                     <SelectItem value="medium">Medium Security (8+ chars, mixed case)</SelectItem>
// // //                     <SelectItem value="high">High Security (12+ chars, symbols)</SelectItem>
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>

// // //               <div className="flex items-center justify-between">
// // //                 <div>
// // //                   <Label htmlFor="two-factor">Two-Factor Authentication</Label>
// // //                   <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
// // //                 </div>
// // //                 <Switch
// // //                   id="two-factor"
// // //                   checked={settings.security.twoFactor}
// // //                   onCheckedChange={(checked) => updateSettings("security", "twoFactor", checked)}
// // //                 />
// // //               </div>

// // //               <div className="flex items-center justify-between">
// // //                 <div>
// // //                   <Label htmlFor="auto-logout">Auto Logout</Label>
// // //                   <p className="text-sm text-muted-foreground">Automatically logout inactive users</p>
// // //                 </div>
// // //                 <Switch
// // //                   id="auto-logout"
// // //                   checked={settings.security.autoLogout}
// // //                   onCheckedChange={(checked) => updateSettings("security", "autoLogout", checked)}
// // //                 />
// // //               </div>
// // //             </CardContent>
// // //           </Card>
// // //         )}

// // //         {isSuperAdmin && (
// // //           <Card>
// // //             <CardHeader>
// // //               <CardTitle className="flex items-center gap-2">
// // //                 <Database className="h-5 w-5" />
// // //                 Data Management
// // //               </CardTitle>
// // //             </CardHeader>
// // //             <CardContent className="space-y-4">
// // //               <div>
// // //                 <Label htmlFor="backup-frequency">Backup Frequency</Label>
// // //                 <Select
// // //                   value={settings.dataManagement.backupFrequency}
// // //                   onValueChange={(value) => updateSettings("dataManagement", "backupFrequency", value)}
// // //                 >
// // //                   <SelectTrigger className="mt-1">
// // //                     <SelectValue />
// // //                   </SelectTrigger>
// // //                   <SelectContent>
// // //                     <SelectItem value="hourly">Hourly</SelectItem>
// // //                     <SelectItem value="daily">Daily</SelectItem>
// // //                     <SelectItem value="weekly">Weekly</SelectItem>
// // //                     <SelectItem value="monthly">Monthly</SelectItem>
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>

// // //               <div>
// // //                 <Label htmlFor="retention-period">Data Retention (months)</Label>
// // //                 <Input
// // //                   id="retention-period"
// // //                   type="number"
// // //                   value={settings.dataManagement.retentionPeriod}
// // //                   onChange={(e) => updateSettings("dataManagement", "retentionPeriod", Number.parseInt(e.target.value))}
// // //                   className="mt-1"
// // //                 />
// // //               </div>

// // //               <div className="space-y-2">
// // //                 <Button variant="outline" className="w-full bg-transparent" onClick={exportStaffData}>
// // //                   <Database className="mr-2 h-4 w-4" />
// // //                   Export Staff Data ({systemStats?.totalStaff || 0} records)
// // //                 </Button>
// // //                 <Button variant="outline" className="w-full bg-transparent" onClick={exportStudentData}>
// // //                   <Database className="mr-2 h-4 w-4" />
// // //                   Export Student Data ({systemStats?.totalStudents || 0} records)
// // //                 </Button>
// // //                 <Link href="/reports" className="w-full">
// // //                   <Button variant="outline" className="w-full justify-center bg-transparent">
// // //                     <Database className="mr-2 h-4 w-4" />
// // //                     Export Attendance Records (via Reports)
// // //                   </Button>
// // //                 </Link>
// // //               </div>

// // //               <div className="flex items-center justify-between">
// // //                 <div>
// // //                   <Label htmlFor="auto-export">Auto Export Reports</Label>
// // //                   <p className="text-sm text-muted-foreground">Automatically export monthly reports</p>
// // //                 </div>
// // //                 <Switch
// // //                   id="auto-export"
// // //                   checked={settings.dataManagement.autoExport}
// // //                   onCheckedChange={(checked) => updateSettings("dataManagement", "autoExport", checked)}
// // //                 />
// // //               </div>
// // //             </CardContent>
// // //           </Card>
// // //         )}

// // //         {isSuperAdmin && (
// // //           <Card>
// // //             <CardHeader>
// // //               <CardTitle className="flex items-center gap-2">
// // //                 <Mail className="h-5 w-5" />
// // //                 Email Configuration
// // //               </CardTitle>
// // //             </CardHeader>
// // //             <CardContent className="space-y-4">
// // //               <div>
// // //                 <Label htmlFor="smtp-server">SMTP Server</Label>
// // //                 <Input
// // //                   id="smtp-server"
// // //                   placeholder="smtp.gmail.com"
// // //                   value={settings.email.smtpServer}
// // //                   onChange={(e) => updateSettings("email", "smtpServer", e.target.value)}
// // //                   className="mt-1"
// // //                 />
// // //               </div>

// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <div>
// // //                   <Label htmlFor="smtp-port">Port</Label>
// // //                   <Input
// // //                     id="smtp-port"
// // //                     type="number"
// // //                     value={settings.email.smtpPort}
// // //                     onChange={(e) => updateSettings("email", "smtpPort", Number.parseInt(e.target.value))}
// // //                     className="mt-1"
// // //                   />
// // //                 </div>
// // //                 <div>
// // //                   <Label htmlFor="smtp-security">Security</Label>
// // //                   <Select
// // //                     value={settings.email.smtpSecurity}
// // //                     onValueChange={(value) => updateSettings("email", "smtpSecurity", value)}
// // //                   >
// // //                     <SelectTrigger className="mt-1">
// // //                       <SelectValue />
// // //                     </SelectTrigger>
// // //                     <SelectContent>
// // //                       <SelectItem value="none">None</SelectItem>
// // //                       <SelectItem value="tls">TLS</SelectItem>
// // //                       <SelectItem value="ssl">SSL</SelectItem>
// // //                     </SelectContent>
// // //                   </Select>
// // //                 </div>
// // //               </div>

// // //               <div>
// // //                 <Label htmlFor="from-email">From Email</Label>
// // //                 <Input
// // //                   id="from-email"
// // //                   type="email"
// // //                   placeholder="noreply@genamplify.com"
// // //                   value={settings.email.fromEmail}
// // //                   onChange={(e) => updateSettings("email", "fromEmail", e.target.value)}
// // //                   className="mt-1"
// // //                 />
// // //               </div>

// // //               <Button className="w-full" onClick={testEmailConfiguration}>
// // //                 <Mail className="mr-2 h-4 w-4" />
// // //                 Test Email Configuration
// // //               </Button>
// // //             </CardContent>
// // //           </Card>
// // //         )}

// // //         {isSuperAdmin && (
// // //           <Card>
// // //             <CardHeader>
// // //               <CardTitle className="flex items-center gap-2">
// // //                 <Shield className="h-5 w-5" />
// // //                 PWA Update Settings
// // //               </CardTitle>
// // //             </CardHeader>
// // //             <CardContent className="space-y-4">
// // //               <div className="flex items-center justify-between">
// // //                 <div>
// // //                   <Label htmlFor="skip-waiting">Auto-Update (Skip Waiting)</Label>
// // //                   <p className="text-sm text-muted-foreground">
// // //                     Automatically update the app without showing update prompt to users
// // //                   </p>
// // //                 </div>
// // //                 <Switch
// // //                   id="skip-waiting"
// // //                   checked={!!settings.pwaUpdate?.skipWaiting}
// // //                   onCheckedChange={(checked) => updateSettings("pwaUpdate", "skipWaiting", checked)}
// // //                 />
// // //               </div>
// // //               <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
// // //                 <p className="text-xs text-blue-800">
// // //                   <strong>Enabled:</strong> App updates automatically in the background without user interaction.
// // //                   <br />
// // //                   <strong>Disabled:</strong> Users see an update prompt and can choose when to update.
// // //                 </p>
// // //               </div>
// // //             </CardContent>
// // //           </Card>
// // //         )}
// // //       </div>

// // //       {isSuperAdmin && <LoginHistoryViewer userRole={(user as any)?.role || ""} />}

// // //       <Card>
// // //         <CardHeader className="pb-2">
// // //           <CardTitle className="text-sm font-medium text-foreground">Quick Actions</CardTitle>
// // //         </CardHeader>
// // //         <CardContent>
// // //           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
// // //             <Link href="/settings/shifts" className="w-full">
// // //               <Button variant="outline" className="w-full justify-center bg-transparent">
// // //                 <Clock className="mr-2 h-4 w-4" />
// // //                 Shift Timings
// // //               </Button>
// // //             </Link>
// // //             <Button
// // //               variant="outline"
// // //               className="w-full justify-center bg-transparent"
// // //               onClick={() => setShowProfileModal(true)}
// // //             >
// // //               <User className="mr-2 h-4 w-4" />
// // //               View Profile
// // //             </Button>
// // //             <Link href="/reports" className="w-full">
// // //               <Button variant="outline" className="w-full justify-center bg-transparent">
// // //                 <BarChart3 className="mr-2 h-4 w-4" />
// // //                 Reports
// // //               </Button>
// // //             </Link>
// // //             <Button
// // //               variant="outline"
// // //               className="w-full justify-center bg-transparent"
// // //               onClick={() => setShowPasswordUpdate(true)}
// // //             >
// // //               <Lock className="mr-2 h-4 w-4" />
// // //               Change Password
// // //             </Button>
// // //             <Button variant="destructive" className="w-full justify-center" onClick={handleLogout}>
// // //               <LogOut className="mr-2 h-4 w-4" />
// // //               Logout
// // //             </Button>
// // //           </div>
// // //         </CardContent>
// // //       </Card>

// // //       <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
// // //         <DialogContent className="max-w-md">
// // //           <DialogHeader>
// // //             <DialogTitle>Profile</DialogTitle>
// // //             <DialogDescription>Your account details</DialogDescription>
// // //           </DialogHeader>
// // //           <div className="space-y-2">
// // //             <div>
// // //               <Label>Name</Label>
// // //               <p className="text-sm text-foreground mt-1">{(user as any)?.name || "N/A"}</p>
// // //             </div>
// // //             <div>
// // //               <Label>Email</Label>
// // //               <p className="text-sm text-foreground mt-1">{(user as any)?.email || "N/A"}</p>
// // //             </div>
// // //             <div>
// // //               <Label>Role</Label>
// // //               <p className="text-sm text-foreground mt-1">{(user as any)?.role || "N/A"}</p>
// // //             </div>
// // //             {(user as any)?.institutionName && (
// // //               <div>
// // //                 <Label>Institution</Label>
// // //                 <p className="text-sm text-foreground mt-1">{(user as any)?.institutionName}</p>
// // //               </div>
// // //             )}
// // //             <div className="pt-2">
// // //               <Button variant="outline" onClick={() => setShowProfileModal(false)} className="w-full">
// // //                 Close
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         </DialogContent>
// // //       </Dialog>

// // //       <Dialog open={showPasswordUpdate} onOpenChange={setShowPasswordUpdate}>
// // //         <DialogContent className="max-w-md">
// // //           <DialogHeader>
// // //             <DialogTitle>Change Password</DialogTitle>
// // //             <DialogDescription>Enter your current and new password</DialogDescription>
// // //           </DialogHeader>
// // //           <div className="space-y-3">
// // //             <div className="space-y-1.5">
// // //               <Label htmlFor="current-password">Current Password</Label>
// // //               <Input
// // //                 id="current-password"
// // //                 type="password"
// // //                 value={passwordData.currentPassword}
// // //                 onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
// // //                 placeholder="Enter current password"
// // //               />
// // //             </div>
// // //             <div className="space-y-1.5">
// // //               <Label htmlFor="new-password">New Password</Label>
// // //               <Input
// // //                 id="new-password"
// // //                 type="password"
// // //                 value={passwordData.newPassword}
// // //                 onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
// // //                 placeholder="Enter new password (min 6 characters)"
// // //               />
// // //             </div>
// // //             <div className="space-y-1.5">
// // //               <Label htmlFor="confirm-password">Confirm New Password</Label>
// // //               <Input
// // //                 id="confirm-password"
// // //                 type="password"
// // //                 value={passwordData.confirmPassword}
// // //                 onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
// // //                 placeholder="Confirm new password"
// // //               />
// // //             </div>
// // //             <div className="flex gap-2 pt-1 justify-end">
// // //               <Button
// // //                 variant="outline"
// // //                 onClick={() => {
// // //                   setShowPasswordUpdate(false)
// // //                   setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
// // //                 }}
// // //               >
// // //                 Cancel
// // //               </Button>
// // //               <Button
// // //                 onClick={handlePasswordUpdate}
// // //                 disabled={
// // //                   passwordLoading ||
// // //                   !passwordData.currentPassword ||
// // //                   !passwordData.newPassword ||
// // //                   !passwordData.confirmPassword
// // //                 }
// // //               >
// // //                 {passwordLoading ? "Updating..." : "Update Password"}
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         </DialogContent>
// // //       </Dialog>
// // //     </div>
// // //   )
// // // }



// // "use client"

// // import { useEffect, useState } from "react"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Switch } from "@/components/ui/switch"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { toast } from "@/hooks/use-toast"
// // import useSWR from "swr"
// // import LoginHistoryViewer from "@/components/login-history-viewer"
// // import { StorageMonitor } from "@/components/storage-monitor"
// // import { QuarterlyReportsManager } from "@/components/quarterly-reports-manager"
// // import {
// //   Shield,
// //   Database,
// //   Mail,
// //   Users,
// //   GraduationCap,
// //   Clock,
// //   Settings2,
// //   Lock,
// //   LogOut,
// //   User,
// //   BarChart3,
// // } from "lucide-react"
// // import { getStoredUser } from "@/lib/auth"
// // import { useRouter } from "next/navigation"
// // import Link from "next/link"
// // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// // import { logout } from "@/lib/auth"

// // export default function SettingsPage() {
// //   const [user, setUser] = useState(null)
// //   const [systemStats, setSystemStats] = useState(null)
// //   const [loading, setLoading] = useState(true)
// //   const [settings, setSettings] = useState({
// //     notifications: {
// //       emailNotifications: true,
// //       lateAlerts: true,
// //       absenceAlerts: false,
// //       updateNotifications: true,
// //     },
// //     security: {
// //       sessionTimeout: 30,
// //       passwordPolicy: "medium",
// //       twoFactor: false,
// //       autoLogout: true,
// //     },
// //     authentication: {
// //       otpLoginEnabled: true,
// //     },
// //     dataManagement: {
// //       backupFrequency: "daily",
// //       retentionPeriod: 12,
// //       autoExport: false,
// //     },
// //     email: {
// //       smtpServer: "",
// //       smtpPort: 587,
// //       smtpSecurity: "tls",
// //       fromEmail: "",
// //     },
// //     maintenance: {
// //       enabled: false,
// //       message: "",
// //     },
// //     attendance: {
// //       locationVerificationEnabled: true,
// //       locationRadiusMeters: 100,
// //     },
// //     pwaUpdate: {
// //       skipWaiting: false,
// //     },
// //   })
// //   const router = useRouter()
// //   const [showProfileModal, setShowProfileModal] = useState(false)
// //   const [showPasswordUpdate, setShowPasswordUpdate] = useState(false)
// //   const [passwordData, setPasswordData] = useState({
// //     currentPassword: "",
// //     newPassword: "",
// //     confirmPassword: "",
// //   })
// //   const [passwordLoading, setPasswordLoading] = useState(false)
// //   const [saving, setSaving] = useState(false)
// //   const isSuperAdmin = (user as any)?.role === "SuperAdmin"

// //   const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json())
// //   const {
// //     data: infra,
// //     isLoading: infraLoading,
// //     mutate: refreshInfra,
// //   } = useSWR(isSuperAdmin ? "/api/admin/system" : null, fetcher)

// //   const formatBytes = (bytes?: number | null) => {
// //     if (typeof bytes !== "number" || !isFinite(bytes)) return "N/A"
// //     if (bytes === 0) return "0 B"
// //     const k = 1024
// //     const sizes = ["B", "KB", "MB", "GB", "TB"]
// //     const i = Math.floor(Math.log(bytes) / Math.log(k))
// //     return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
// //   }

// //   useEffect(() => {
// //     const storedUser = getStoredUser()
// //     setUser(storedUser)

// //     if (!storedUser || (storedUser.role !== "Admin" && storedUser.role !== "SuperAdmin")) {
// //       router.push("/")
// //     } else {
// //       fetchSystemStats()
// //       if (storedUser.role === "SuperAdmin") {
// //         void loadSavedSettings()
// //       }
// //     }
// //   }, [router])

// //   const fetchSystemStats = async () => {
// //     try {
// //       setLoading(true)
// //       const u = getStoredUser()
// //       const inst = u?.role !== "SuperAdmin" ? u?.institutionName : undefined
// //       const q = inst ? `?institutionName=${encodeURIComponent(inst)}` : ""

// //       const [staffRes, studentsRes, attendanceRes, summaryRes] = await Promise.all([
// //         fetch(`/api/staff${q}`),
// //         fetch(`/api/students${q}`),
// //         fetch(`/api/attendance${q}`),
// //         fetch(`/api/reports/summary${q}`),
// //       ])

// //       const [staff, students, attendance, summary] = await Promise.all([
// //         staffRes.ok ? staffRes.json() : { items: [], departments: [], roles: [], shifts: [] },
// //         studentsRes.ok ? studentsRes.json() : { items: [] },
// //         attendanceRes.ok ? attendanceRes.json() : { totalCounts: {} },
// //         summaryRes.ok ? summaryRes.json() : {},
// //       ])

// //       setSystemStats({
// //         totalStaff: staff.items?.length || 0,
// //         totalStudents: students.items?.length || 0,
// //         todayAttendance: attendance.totalCounts || {},
// //         departments: staff.departments || [],
// //         roles: staff.roles || [],
// //         shifts: staff.shifts || [],
// //         summary,
// //       })
// //     } catch (error) {
// //       console.error("Failed to fetch system stats:", error)
// //       setSystemStats({
// //         totalStaff: 0,
// //         totalStudents: 0,
// //         todayAttendance: {},
// //         departments: [],
// //         roles: [],
// //         shifts: [],
// //         summary: {},
// //       })

// //       if (!navigator.onLine) {
// //         toast({
// //           title: "Offline Mode",
// //           description: "Some data may not be available. Please check your connection.",
// //           variant: "destructive",
// //         })
// //       }
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const loadSavedSettings = async () => {
// //     try {
// //       const [globalRes, pwaRes] = await Promise.all([
// //         fetch("/api/settings?scope=global", { cache: "no-store" }),
// //         fetch("/api/settings/pwa-update", { cache: "no-store" }),
// //       ])

// //       if (globalRes.ok) {
// //         const json = await globalRes.json()
// //         if (json?.data && typeof json.data === "object") {
// //           setSettings((prev) => ({ ...prev, ...json.data }))
// //         }
// //       }

// //       if (pwaRes.ok) {
// //         const pwaJson = await pwaRes.json()
// //         if (pwaJson?.success) {
// //           setSettings((prev) => ({
// //             ...prev,
// //             pwaUpdate: {
// //               skipWaiting: pwaJson.skipWaiting || false,
// //             },
// //           }))
// //         }
// //       }
// //     } catch (e) {
// //       console.error("[settings] load failed", e)
// //     }
// //   }

// //   const saveAllSettings = async () => {
// //     try {
// //       setSaving(true)

// //       // Save global settings
// //       const globalRes = await fetch("/api/settings", {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ scope: "global", data: settings }),
// //       })

// //       const pwaRes = await fetch("/api/settings/pwa-update", {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ skipWaiting: settings.pwaUpdate.skipWaiting }),
// //       })

// //       if (!globalRes.ok || !pwaRes.ok) {
// //         throw new Error("Failed to save settings")
// //       }

// //       toast({ title: "Settings saved", description: "Your configuration has been updated." })
// //     } catch (e: any) {
// //       toast({ title: "Save failed", description: e?.message || "Unable to save settings", variant: "destructive" })
// //     } finally {
// //       setSaving(false)
// //     }
// //   }

// //   const updateSettings = async (category: string, key: string, value: any) => {
// //     setSettings((prev) => ({
// //       ...prev,
// //       [category]: {
// //         ...prev[category],
// //         [key]: value,
// //       },
// //     }))
// //     // Here you would typically save to backend
// //     console.log(`Updated ${category}.${key} to:`, value)
// //   }

// //   const downloadBlob = (blob: Blob, filename: string) => {
// //     const url = URL.createObjectURL(blob)
// //     const a = document.createElement("a")
// //     a.href = url
// //     a.download = filename
// //     document.body.appendChild(a)
// //     a.click()
// //     a.remove()
// //     URL.revokeObjectURL(url)
// //   }

// //   const exportStaffData = async () => {
// //     try {
// //       const resList = await fetch("/api/staff")
// //       const list = await resList.json()
// //       const data = Array.isArray(list?.items) ? list.items : []
// //       const res = await fetch("/api/export/staff?format=excel", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ data }),
// //       })
// //       if (!res.ok) throw new Error("Export failed")
// //       const blob = await res.blob()
// //       downloadBlob(blob, "staff_export.xlsx")
// //     } catch (e) {
// //       toast({ title: "Export failed", description: "Could not export staff data", variant: "destructive" })
// //     }
// //   }

// //   const exportStudentData = async () => {
// //     try {
// //       const resList = await fetch("/api/students")
// //       const list = await resList.json()
// //       const data = Array.isArray(list?.items) ? list.items : []
// //       const res = await fetch("/api/export/students?format=excel", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ data }),
// //       })
// //       if (!res.ok) throw new Error("Export failed")
// //       const blob = await res.blob()
// //       downloadBlob(blob, "students_export.xlsx")
// //     } catch (e) {
// //       toast({ title: "Export failed", description: "Could not export student data", variant: "destructive" })
// //     }
// //   }

// //   const testEmailConfiguration = async () => {
// //     try {
// //       const to = (user as any)?.email
// //       const res = await fetch("/api/email/test", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           to,
// //           from: settings.email.fromEmail || undefined,
// //           subject: "Test Email Configuration",
// //           text: "This is a test email from Settings.",
// //         }),
// //       })
// //       const result = await res.json()
// //       if (res.ok) {
// //         toast({ title: "Email sent", description: `Message ID: ${result?.messageId || "N/A"}` })
// //       } else {
// //         toast({ title: "Email test failed", description: result?.error || "Unknown error", variant: "destructive" })
// //       }
// //     } catch (error) {
// //       toast({ title: "Email test failed", description: "Unable to send test email", variant: "destructive" })
// //     }
// //   }

// //   const handleLogout = () => {
// //     logout()
// //     router.push("/login")
// //   }

// //   const handlePasswordUpdate = async () => {
// //     if (passwordData.newPassword !== passwordData.confirmPassword) {
// //       toast({ title: "Error", description: "New passwords do not match", variant: "destructive" })
// //       return
// //     }
// //     if (passwordData.newPassword.length < 6) {
// //       toast({ title: "Error", description: "Password must be at least 6 characters long", variant: "destructive" })
// //       return
// //     }

// //     try {
// //       setPasswordLoading(true)
// //       const res = await fetch("/api/auth/change-password", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           userId: (user as any)?.id,
// //           currentPassword: passwordData.currentPassword,
// //           newPassword: passwordData.newPassword,
// //         }),
// //       })
// //       const result = await res.json()
// //       if (res.ok) {
// //         toast({ title: "Success", description: "Password updated successfully!" })
// //         setShowPasswordUpdate(false)
// //         setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
// //       } else {
// //         toast({ title: "Error", description: result.error || "Failed to update password", variant: "destructive" })
// //       }
// //     } catch (e) {
// //       toast({ title: "Error", description: "Failed to update password", variant: "destructive" })
// //     } finally {
// //       setPasswordLoading(false)
// //     }
// //   }

// //   if (!user || (user.role !== "Admin" && user.role !== "SuperAdmin")) {
// //     return null
// //   }

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
// //           <p className="text-muted-foreground">Loading system settings...</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //         <div>
// //           {user?.institutionName && (
// //             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded mb-1">
// //               {user.institutionName}
// //             </div>
// //           )}
// //           {!user?.institutionName && user?.role === "SuperAdmin" && (
// //             <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded mb-1">
// //               SuperAdmin
// //             </div>
// //           )}
// //           <h1 className="text-2xl font-semibold text-foreground">System Settings</h1>
// //           <p className="text-sm text-muted-foreground">Configure system preferences and manage all modules</p>
// //         </div>
// //         <Button
// //           className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:opacity-60"
// //           onClick={saveAllSettings}
// //           disabled={!isSuperAdmin || saving}
// //           aria-disabled={!isSuperAdmin || saving}
// //           title={!isSuperAdmin ? "Only SuperAdmin can save global settings" : "Save all settings"}
// //         >
// //           <Settings2 className="mr-2 h-4 w-4" />
// //           {saving ? "Saving..." : "Save All Settings"}
// //         </Button>
// //       </header>

// //       <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
// //         <Card>
// //           <CardHeader className="pb-2">
// //             <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
// //               <Users className="h-4 w-4" />
// //               Total Staff
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-blue-600">{systemStats?.totalStaff || 0}</div>
// //             <p className="text-xs text-muted-foreground mt-1">Active staff members</p>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader className="pb-2">
// //             <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
// //               <GraduationCap className="h-4 w-4" />
// //               Total Students
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-green-600">{systemStats?.totalStudents || 0}</div>
// //             <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <Clock className="h-5 w-5" />
// //               Today Present
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-teal-600">{systemStats?.todayAttendance?.present || 0}</div>
// //             <p className="text-xs text-muted-foreground mt-1">Present today</p>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <Database className="h-5 w-5" />
// //               System Health
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold text-green-600">100%</div>
// //             <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {isSuperAdmin && (
// //         <div className="space-y-6">
// //           <StorageMonitor />
// //           <QuarterlyReportsManager />
// //         </div>
// //       )}

// //       {isSuperAdmin && (
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <Shield className="h-5 w-5" />
// //               Operations & Maintenance
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <Label htmlFor="maintenance-enabled">Maintenance Mode</Label>
// //                 <p className="text-sm text-muted-foreground">
// //                   Temporarily restrict non-admin access during maintenance
// //                 </p>
// //               </div>
// //               <Switch
// //                 id="maintenance-enabled"
// //                 checked={!!settings.maintenance?.enabled}
// //                 onCheckedChange={(checked) => updateSettings("maintenance", "enabled", checked)}
// //               />
// //             </div>
// //             <div>
// //               <Label htmlFor="maintenance-message">Maintenance Message</Label>
// //               <Input
// //                 id="maintenance-message"
// //                 placeholder="We'll be back shortly..."
// //                 value={settings.maintenance?.message || ""}
// //                 onChange={(e) => updateSettings("maintenance", "message", e.target.value)}
// //                 className="mt-1"
// //               />
// //             </div>
// //             <div className="text-xs text-muted-foreground">
// //               Note: Click "Save All Settings" at the top to apply changes.
// //             </div>
// //           </CardContent>
// //         </Card>
// //       )}

// //       {isSuperAdmin && (
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <Shield className="h-5 w-5" />
// //               Authentication Settings
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <Label htmlFor="otp-login">OTP Login (Staff/Admin)</Label>
// //                 <p className="text-sm text-muted-foreground">Require OTP verification for staff and admin login</p>
// //               </div>
// //               <Switch
// //                 id="otp-login"
// //                 checked={settings.authentication?.otpLoginEnabled ?? true}
// //                 onCheckedChange={(checked) => updateSettings("authentication", "otpLoginEnabled", checked)}
// //               />
// //             </div>

// //             <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
// //               <p className="text-xs text-blue-800">
// //                 <strong>Enabled:</strong> Staff and admins must verify OTP sent to their email during login.
// //                 <br />
// //                 <strong>Disabled:</strong> Direct login without OTP (less secure, not recommended for production).
// //               </p>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       )}

// //       {isSuperAdmin && (
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <Shield className="h-5 w-5" />
// //               Security Settings
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-4">
// //             <div>
// //               <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
// //               <Input
// //                 id="session-timeout"
// //                 type="number"
// //                 value={settings.security.sessionTimeout}
// //                 onChange={(e) => updateSettings("security", "sessionTimeout", Number.parseInt(e.target.value))}
// //                 className="mt-1"
// //               />
// //             </div>

// //             <div>
// //               <Label htmlFor="password-policy">Password Policy</Label>
// //               <Select
// //                 value={settings.security.passwordPolicy}
// //                 onValueChange={(value) => updateSettings("security", "passwordPolicy", value)}
// //               >
// //                 <SelectTrigger className="mt-1">
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="low">Low Security (6+ chars)</SelectItem>
// //                   <SelectItem value="medium">Medium Security (8+ chars, mixed case)</SelectItem>
// //                   <SelectItem value="high">High Security (12+ chars, symbols)</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>

// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <Label htmlFor="two-factor">Two-Factor Authentication</Label>
// //                 <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
// //               </div>
// //               <Switch
// //                 id="two-factor"
// //                 checked={settings.security.twoFactor}
// //                 onCheckedChange={(checked) => updateSettings("security", "twoFactor", checked)}
// //               />
// //             </div>

// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <Label htmlFor="auto-logout">Auto Logout</Label>
// //                 <p className="text-sm text-muted-foreground">Automatically logout inactive users</p>
// //               </div>
// //               <Switch
// //                 id="auto-logout"
// //                 checked={settings.security.autoLogout}
// //                 onCheckedChange={(checked) => updateSettings("security", "autoLogout", checked)}
// //               />
// //             </div>
// //           </CardContent>
// //         </Card>
// //       )}

// //       {isSuperAdmin && (
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <Database className="h-5 w-5" />
// //               Data Management
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-4">
// //             <div>
// //               <Label htmlFor="backup-frequency">Backup Frequency</Label>
// //               <Select
// //                 value={settings.dataManagement.backupFrequency}
// //                 onValueChange={(value) => updateSettings("dataManagement", "backupFrequency", value)}
// //               >
// //                 <SelectTrigger className="mt-1">
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="hourly">Hourly</SelectItem>
// //                   <SelectItem value="daily">Daily</SelectItem>
// //                   <SelectItem value="weekly">Weekly</SelectItem>
// //                   <SelectItem value="monthly">Monthly</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>

// //             <div>
// //               <Label htmlFor="retention-period">Data Retention (months)</Label>
// //               <Input
// //                 id="retention-period"
// //                 type="number"
// //                 value={settings.dataManagement.retentionPeriod}
// //                 onChange={(e) => updateSettings("dataManagement", "retentionPeriod", Number.parseInt(e.target.value))}
// //                 className="mt-1"
// //               />
// //             </div>

// //             <div className="space-y-2">
// //               <Button variant="outline" className="w-full bg-transparent" onClick={exportStaffData}>
// //                 <Database className="mr-2 h-4 w-4" />
// //                 Export Staff Data ({systemStats?.totalStaff || 0} records)
// //               </Button>
// //               <Button variant="outline" className="w-full bg-transparent" onClick={exportStudentData}>
// //                 <Database className="mr-2 h-4 w-4" />
// //                 Export Student Data ({systemStats?.totalStudents || 0} records)
// //               </Button>
// //               <Link href="/reports" className="w-full">
// //                 <Button variant="outline" className="w-full justify-center bg-transparent">
// //                   <Database className="mr-2 h-4 w-4" />
// //                   Export Attendance Records (via Reports)
// //                 </Button>
// //               </Link>
// //             </div>

// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <Label htmlFor="auto-export">Auto Export Reports</Label>
// //                 <p className="text-sm text-muted-foreground">Automatically export monthly reports</p>
// //               </div>
// //               <Switch
// //                 id="auto-export"
// //                 checked={settings.dataManagement.autoExport}
// //                 onCheckedChange={(checked) => updateSettings("dataManagement", "autoExport", checked)}
// //               />
// //             </div>
// //           </CardContent>
// //         </Card>
// //       )}

// //       {isSuperAdmin && (
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <Mail className="h-5 w-5" />
// //               Email Configuration
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-4">
// //             <div>
// //               <Label htmlFor="smtp-server">SMTP Server</Label>
// //               <Input
// //                 id="smtp-server"
// //                 placeholder="smtp.gmail.com"
// //                 value={settings.email.smtpServer}
// //                 onChange={(e) => updateSettings("email", "smtpServer", e.target.value)}
// //                 className="mt-1"
// //               />
// //             </div>

// //             <div className="grid grid-cols-2 gap-4">
// //               <div>
// //                 <Label htmlFor="smtp-port">Port</Label>
// //                 <Input
// //                   id="smtp-port"
// //                   type="number"
// //                   value={settings.email.smtpPort}
// //                   onChange={(e) => updateSettings("email", "smtpPort", Number.parseInt(e.target.value))}
// //                   className="mt-1"
// //                 />
// //               </div>
// //               <div>
// //                 <Label htmlFor="smtp-security">Security</Label>
// //                 <Select
// //                   value={settings.email.smtpSecurity}
// //                   onValueChange={(value) => updateSettings("email", "smtpSecurity", value)}
// //                 >
// //                   <SelectTrigger className="mt-1">
// //                     <SelectValue />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="none">None</SelectItem>
// //                     <SelectItem value="tls">TLS</SelectItem>
// //                     <SelectItem value="ssl">SSL</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             </div>

// //             <div>
// //               <Label htmlFor="from-email">From Email</Label>
// //               <Input
// //                 id="from-email"
// //                 type="email"
// //                 placeholder="noreply@genamplify.com"
// //                 value={settings.email.fromEmail}
// //                 onChange={(e) => updateSettings("email", "fromEmail", e.target.value)}
// //                 className="mt-1"
// //               />
// //             </div>

// //             <Button className="w-full" onClick={testEmailConfiguration}>
// //               <Mail className="mr-2 h-4 w-4" />
// //               Test Email Configuration
// //             </Button>
// //           </CardContent>
// //         </Card>
// //       )}

// //       {isSuperAdmin && (
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <Shield className="h-5 w-5" />
// //               PWA Update Settings
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-4">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <Label htmlFor="skip-waiting">Auto-Update (Skip Waiting)</Label>
// //                 <p className="text-sm text-muted-foreground">
// //                   Automatically update the app without showing update prompt to users
// //                 </p>
// //               </div>
// //               <Switch
// //                 id="skip-waiting"
// //                 checked={!!settings.pwaUpdate?.skipWaiting}
// //                 onCheckedChange={(checked) => updateSettings("pwaUpdate", "skipWaiting", checked)}
// //               />
// //             </div>
// //             <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
// //               <p className="text-xs text-blue-800">
// //                 <strong>Enabled:</strong> App updates automatically in the background without user interaction.
// //                 <br />
// //                 <strong>Disabled:</strong> Users see an update prompt and can choose when to update.
// //               </p>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       )}
// //       {isSuperAdmin && <LoginHistoryViewer userRole={(user as any)?.role || ""} />}

// //       <Card>
// //         <CardHeader className="pb-2">
// //           <CardTitle className="text-sm font-medium text-foreground">Quick Actions</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
// //             <Link href="/settings/shifts" className="w-full">
// //               <Button variant="outline" className="w-full justify-center bg-transparent">
// //                 <Clock className="mr-2 h-4 w-4" />
// //                 Shift Timings
// //               </Button>
// //             </Link>
// //             <Button
// //               variant="outline"
// //               className="w-full justify-center bg-transparent"
// //               onClick={() => setShowProfileModal(true)}
// //             >
// //               <User className="mr-2 h-4 w-4" />
// //               View Profile
// //             </Button>
// //             <Link href="/reports" className="w-full">
// //               <Button variant="outline" className="w-full justify-center bg-transparent">
// //                 <BarChart3 className="mr-2 h-4 w-4" />
// //                 Reports
// //               </Button>
// //             </Link>
// //             <Button
// //               variant="outline"
// //               className="w-full justify-center bg-transparent"
// //               onClick={() => setShowPasswordUpdate(true)}
// //             >
// //               <Lock className="mr-2 h-4 w-4" />
// //               Change Password
// //             </Button>
// //             <Button variant="destructive" className="w-full justify-center" onClick={handleLogout}>
// //               <LogOut className="mr-2 h-4 w-4" />
// //               Logout
// //             </Button>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
// //         <DialogContent className="max-w-md">
// //           <DialogHeader>
// //             <DialogTitle>Profile</DialogTitle>
// //             <DialogDescription>Your account details</DialogDescription>
// //           </DialogHeader>
// //           <div className="space-y-2">
// //             <div>
// //               <Label>Name</Label>
// //               <p className="text-sm text-foreground mt-1">{(user as any)?.name || "N/A"}</p>
// //             </div>
// //             <div>
// //               <Label>Email</Label>
// //               <p className="text-sm text-foreground mt-1">{(user as any)?.email || "N/A"}</p>
// //             </div>
// //             <div>
// //               <Label>Role</Label>
// //               <p className="text-sm text-foreground mt-1">{(user as any)?.role || "N/A"}</p>
// //             </div>
// //             {(user as any)?.institutionName && (
// //               <div>
// //                 <Label>Institution</Label>
// //                 <p className="text-sm text-foreground mt-1">{(user as any)?.institutionName}</p>
// //               </div>
// //             )}
// //             <div className="pt-2">
// //               <Button variant="outline" onClick={() => setShowProfileModal(false)} className="w-full">
// //                 Close
// //               </Button>
// //             </div>
// //           </div>
// //         </DialogContent>
// //       </Dialog>

// //       <Dialog open={showPasswordUpdate} onOpenChange={setShowPasswordUpdate}>
// //         <DialogContent className="max-w-md">
// //           <DialogHeader>
// //             <DialogTitle>Change Password</DialogTitle>
// //             <DialogDescription>Enter your current and new password</DialogDescription>
// //           </DialogHeader>
// //           <div className="space-y-3">
// //             <div className="space-y-1.5">
// //               <Label htmlFor="current-password">Current Password</Label>
// //               <Input
// //                 id="current-password"
// //                 type="password"
// //                 value={passwordData.currentPassword}
// //                 onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
// //                 placeholder="Enter current password"
// //               />
// //             </div>
// //             <div className="space-y-1.5">
// //               <Label htmlFor="new-password">New Password</Label>
// //               <Input
// //                 id="new-password"
// //                 type="password"
// //                 value={passwordData.newPassword}
// //                 onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
// //                 placeholder="Enter new password (min 6 characters)"
// //               />
// //             </div>
// //             <div className="space-y-1.5">
// //               <Label htmlFor="confirm-password">Confirm New Password</Label>
// //               <Input
// //                 id="confirm-password"
// //                 type="password"
// //                 value={passwordData.confirmPassword}
// //                 onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
// //                 placeholder="Confirm new password"
// //               />
// //             </div>
// //             <div className="flex gap-2 pt-1 justify-end">
// //               <Button
// //                 variant="outline"
// //                 onClick={() => {
// //                   setShowPasswordUpdate(false)
// //                   setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
// //                 }}
// //               >
// //                 Cancel
// //               </Button>
// //               <Button
// //                 onClick={handlePasswordUpdate}
// //                 disabled={
// //                   passwordLoading ||
// //                   !passwordData.currentPassword ||
// //                   !passwordData.newPassword ||
// //                   !passwordData.confirmPassword
// //                 }
// //               >
// //                 {passwordLoading ? "Updating..." : "Update Password"}
// //               </Button>
// //             </div>
// //           </div>
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   )
// // }





// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { toast } from "@/hooks/use-toast"
// import useSWR from "swr"
// import LoginHistoryViewer from "@/components/login-history-viewer"
// import { StorageMonitor } from "@/components/storage-monitor"
// import { QuarterlyReportsManager } from "@/components/quarterly-reports-manager"
// import { PushNotificationManager } from "@/components/push-notification-manager"
// import {
//   Shield,
//   Database,
//   Mail,
//   Users,
//   GraduationCap,
//   Clock,
//   Settings2,
//   Lock,
//   LogOut,
//   User,
//   BarChart3,
// } from "lucide-react"
// import { getStoredUser } from "@/lib/auth"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { logout } from "@/lib/auth"

// export default function SettingsPage() {
//   const [user, setUser] = useState(null)
//   const [systemStats, setSystemStats] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [settings, setSettings] = useState({
//     notifications: {
//       emailNotifications: true,
//       lateAlerts: true,
//       absenceAlerts: false,
//       updateNotifications: true,
//     },
//     security: {
//       sessionTimeout: 30,
//       passwordPolicy: "medium",
//       twoFactor: false,
//       autoLogout: true,
//     },
//     authentication: {
//       otpLoginEnabled: true,
//     },
//     dataManagement: {
//       backupFrequency: "daily",
//       retentionPeriod: 12,
//       autoExport: false,
//     },
//     email: {
//       smtpServer: "",
//       smtpPort: 587,
//       smtpSecurity: "tls",
//       fromEmail: "",
//     },
//     maintenance: {
//       enabled: false,
//       message: "",
//     },
//     attendance: {
//       locationVerificationEnabled: true,
//       locationRadiusMeters: 100,
//     },
//     pwaUpdate: {
//       skipWaiting: false,
//     },
//   })
//   const router = useRouter()
//   const [showProfileModal, setShowProfileModal] = useState(false)
//   const [showPasswordUpdate, setShowPasswordUpdate] = useState(false)
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   })
//   const [passwordLoading, setPasswordLoading] = useState(false)
//   const [saving, setSaving] = useState(false)
//   const isSuperAdmin = (user as any)?.role === "SuperAdmin"

//   const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json())
//   const {
//     data: infra,
//     isLoading: infraLoading,
//     mutate: refreshInfra,
//   } = useSWR(isSuperAdmin ? "/api/admin/system" : null, fetcher)

//   const formatBytes = (bytes?: number | null) => {
//     if (typeof bytes !== "number" || !isFinite(bytes)) return "N/A"
//     if (bytes === 0) return "0 B"
//     const k = 1024
//     const sizes = ["B", "KB", "MB", "GB", "TB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
//   }

//   useEffect(() => {
//     const storedUser = getStoredUser()
//     setUser(storedUser)

//     if (!storedUser) {
//       router.push("/")
//     } else {
//       fetchSystemStats()
//       if (storedUser.role === "SuperAdmin") {
//         void loadSavedSettings()
//       }
//     }
//   }, [router])

//   const fetchSystemStats = async () => {
//     try {
//       setLoading(true)
//       const u = getStoredUser()
//       const inst = u?.role !== "SuperAdmin" ? u?.institutionName : undefined
//       const q = inst ? `?institutionName=${encodeURIComponent(inst)}` : ""

//       const [staffRes, studentsRes, attendanceRes, summaryRes] = await Promise.all([
//         fetch(`/api/staff${q}`),
//         fetch(`/api/students${q}`),
//         fetch(`/api/attendance${q}`),
//         fetch(`/api/reports/summary${q}`),
//       ])

//       const [staff, students, attendance, summary] = await Promise.all([
//         staffRes.ok ? staffRes.json() : { items: [], departments: [], roles: [], shifts: [] },
//         studentsRes.ok ? studentsRes.json() : { items: [] },
//         attendanceRes.ok ? attendanceRes.json() : { totalCounts: {} },
//         summaryRes.ok ? summaryRes.json() : {},
//       ])

//       setSystemStats({
//         totalStaff: staff.items?.length || 0,
//         totalStudents: students.items?.length || 0,
//         todayAttendance: attendance.totalCounts || {},
//         departments: staff.departments || [],
//         roles: staff.roles || [],
//         shifts: staff.shifts || [],
//         summary,
//       })
//     } catch (error) {
//       console.error("Failed to fetch system stats:", error)
//       setSystemStats({
//         totalStaff: 0,
//         totalStudents: 0,
//         todayAttendance: {},
//         departments: [],
//         roles: [],
//         shifts: [],
//         summary: {},
//       })

//       if (!navigator.onLine) {
//         toast({
//           title: "Offline Mode",
//           description: "Some data may not be available. Please check your connection.",
//           variant: "destructive",
//         })
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadSavedSettings = async () => {
//     try {
//       const [globalRes, pwaRes] = await Promise.all([
//         fetch("/api/settings?scope=global", { cache: "no-store" }),
//         fetch("/api/settings/pwa-update", { cache: "no-store" }),
//       ])

//       if (globalRes.ok) {
//         const json = await globalRes.json()
//         if (json?.data && typeof json.data === "object") {
//           setSettings((prev) => ({ ...prev, ...json.data }))
//         }
//       }

//       if (pwaRes.ok) {
//         const pwaJson = await pwaRes.json()
//         if (pwaJson?.success) {
//           setSettings((prev) => ({
//             ...prev,
//             pwaUpdate: {
//               skipWaiting: pwaJson.skipWaiting || false,
//             },
//           }))
//         }
//       }
//     } catch (e) {
//       console.error("[settings] load failed", e)
//     }
//   }

//   const saveAllSettings = async () => {
//     try {
//       setSaving(true)

//       // Save global settings
//       const globalRes = await fetch("/api/settings", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ scope: "global", data: settings }),
//       })

//       const pwaRes = await fetch("/api/settings/pwa-update", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ skipWaiting: settings.pwaUpdate.skipWaiting }),
//       })

//       if (!globalRes.ok || !pwaRes.ok) {
//         throw new Error("Failed to save settings")
//       }

//       toast({ title: "Settings saved", description: "Your configuration has been updated." })
//     } catch (e: any) {
//       toast({ title: "Save failed", description: e?.message || "Unable to save settings", variant: "destructive" })
//     } finally {
//       setSaving(false)
//     }
//   }

//   const updateSettings = async (category: string, key: string, value: any) => {
//     setSettings((prev) => ({
//       ...prev,
//       [category]: {
//         ...prev[category],
//         [key]: value,
//       },
//     }))
//     // Here you would typically save to backend
//     console.log(`Updated ${category}.${key} to:`, value)
//   }

//   const downloadBlob = (blob: Blob, filename: string) => {
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = filename
//     document.body.appendChild(a)
//     a.click()
//     a.remove()
//     URL.revokeObjectURL(url)
//   }

//   const exportStaffData = async () => {
//     try {
//       const resList = await fetch("/api/staff")
//       const list = await resList.json()
//       const data = Array.isArray(list?.items) ? list.items : []
//       const res = await fetch("/api/export/staff?format=excel", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ data }),
//       })
//       if (!res.ok) throw new Error("Export failed")
//       const blob = await res.blob()
//       downloadBlob(blob, "staff_export.xlsx")
//     } catch (e) {
//       toast({ title: "Export failed", description: "Could not export staff data", variant: "destructive" })
//     }
//   }

//   const exportStudentData = async () => {
//     try {
//       const resList = await fetch("/api/students")
//       const list = await resList.json()
//       const data = Array.isArray(list?.items) ? list.items : []
//       const res = await fetch("/api/export/students?format=excel", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ data }),
//       })
//       if (!res.ok) throw new Error("Export failed")
//       const blob = await res.blob()
//       downloadBlob(blob, "students_export.xlsx")
//     } catch (e) {
//       toast({ title: "Export failed", description: "Could not export student data", variant: "destructive" })
//     }
//   }

//   const testEmailConfiguration = async () => {
//     try {
//       const to = (user as any)?.email
//       const res = await fetch("/api/email/test", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           to,
//           from: settings.email.fromEmail || undefined,
//           subject: "Test Email Configuration",
//           text: "This is a test email from Settings.",
//         }),
//       })
//       const result = await res.json()
//       if (res.ok) {
//         toast({ title: "Email sent", description: `Message ID: ${result?.messageId || "N/A"}` })
//       } else {
//         toast({ title: "Email test failed", description: result?.error || "Unknown error", variant: "destructive" })
//       }
//     } catch (error) {
//       toast({ title: "Email test failed", description: "Unable to send test email", variant: "destructive" })
//     }
//   }

//   const handleLogout = () => {
//     logout()
//     router.push("/login")
//   }

//   const handlePasswordUpdate = async () => {
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       toast({ title: "Error", description: "New passwords do not match", variant: "destructive" })
//       return
//     }
//     if (passwordData.newPassword.length < 6) {
//       toast({ title: "Error", description: "Password must be at least 6 characters long", variant: "destructive" })
//       return
//     }

//     try {
//       setPasswordLoading(true)
//       const res = await fetch("/api/auth/change-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: (user as any)?.id,
//           currentPassword: passwordData.currentPassword,
//           newPassword: passwordData.newPassword,
//         }),
//       })
//       const result = await res.json()
//       if (res.ok) {
//         toast({ title: "Success", description: "Password updated successfully!" })
//         setShowPasswordUpdate(false)
//         setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
//       } else {
//         toast({ title: "Error", description: result.error || "Failed to update password", variant: "destructive" })
//       }
//     } catch (e) {
//       toast({ title: "Error", description: "Failed to update password", variant: "destructive" })
//     } finally {
//       setPasswordLoading(false)
//     }
//   }

//   if (!user) {
//     return null
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading system settings...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           {user?.institutionName && (
//             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded mb-1">
//               {user.institutionName}
//             </div>
//           )}
//           {!user?.institutionName && user?.role === "SuperAdmin" && (
//             <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded mb-1">
//               SuperAdmin
//             </div>
//           )}
//           <h1 className="text-2xl font-semibold text-foreground">System Settings</h1>
//           <p className="text-sm text-muted-foreground">Configure system preferences and manage all modules</p>
//         </div>
//         <Button
//           className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:opacity-60"
//           onClick={saveAllSettings}
//           disabled={!isSuperAdmin || saving}
//           aria-disabled={!isSuperAdmin || saving}
//           title={!isSuperAdmin ? "Only SuperAdmin can save global settings" : "Save all settings"}
//         >
//           <Settings2 className="mr-2 h-4 w-4" />
//           {saving ? "Saving..." : "Save All Settings"}
//         </Button>
//       </header>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//               <Users className="h-4 w-4" />
//               Total Staff
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-600">{systemStats?.totalStaff || 0}</div>
//             <p className="text-xs text-muted-foreground mt-1">Active staff members</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//               <GraduationCap className="h-4 w-4" />
//               Total Students
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">{systemStats?.totalStudents || 0}</div>
//             <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Clock className="h-5 w-5" />
//               Today Present
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-teal-600">{systemStats?.todayAttendance?.present || 0}</div>
//             <p className="text-xs text-muted-foreground mt-1">Present today</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Database className="h-5 w-5" />
//               System Health
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">100%</div>
//             <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
//           </CardContent>
//         </Card>
//       </div>

//       <PushNotificationManager />

//       {isSuperAdmin && (
//         <div className="space-y-6">
//           <StorageMonitor />
//           <QuarterlyReportsManager />
//         </div>
//       )}

//       {isSuperAdmin && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5" />
//               Operations & Maintenance
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label htmlFor="maintenance-enabled">Maintenance Mode</Label>
//                 <p className="text-sm text-muted-foreground">
//                   Temporarily restrict non-admin access during maintenance
//                 </p>
//               </div>
//               <Switch
//                 id="maintenance-enabled"
//                 checked={!!settings.maintenance?.enabled}
//                 onCheckedChange={(checked) => updateSettings("maintenance", "enabled", checked)}
//               />
//             </div>
//             <div>
//               <Label htmlFor="maintenance-message">Maintenance Message</Label>
//               <Input
//                 id="maintenance-message"
//                 placeholder="We'll be back shortly..."
//                 value={settings.maintenance?.message || ""}
//                 onChange={(e) => updateSettings("maintenance", "message", e.target.value)}
//                 className="mt-1"
//               />
//             </div>
//             <div className="text-xs text-muted-foreground">
//               Note: Click "Save All Settings" at the top to apply changes.
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {isSuperAdmin && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5" />
//               Authentication Settings
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label htmlFor="otp-login">OTP Login (Staff/Admin)</Label>
//                 <p className="text-sm text-muted-foreground">Require OTP verification for staff and admin login</p>
//               </div>
//               <Switch
//                 id="otp-login"
//                 checked={settings.authentication?.otpLoginEnabled ?? true}
//                 onCheckedChange={(checked) => updateSettings("authentication", "otpLoginEnabled", checked)}
//               />
//             </div>

//             <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
//               <p className="text-xs text-blue-800">
//                 <strong>Enabled:</strong> Staff and admins must verify OTP sent to their email during login.
//                 <br />
//                 <strong>Disabled:</strong> Direct login without OTP (less secure, not recommended for production).
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {isSuperAdmin && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Database className="h-5 w-5" />
//               Data Management
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <Label htmlFor="backup-frequency">Backup Frequency</Label>
//               <Select
//                 value={settings.dataManagement.backupFrequency}
//                 onValueChange={(value) => updateSettings("dataManagement", "backupFrequency", value)}
//               >
//                 <SelectTrigger className="mt-1">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="hourly">Hourly</SelectItem>
//                   <SelectItem value="daily">Daily</SelectItem>
//                   <SelectItem value="weekly">Weekly</SelectItem>
//                   <SelectItem value="monthly">Monthly</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="retention-period">Data Retention (months)</Label>
//               <Input
//                 id="retention-period"
//                 type="number"
//                 value={settings.dataManagement.retentionPeriod}
//                 onChange={(e) => updateSettings("dataManagement", "retentionPeriod", Number.parseInt(e.target.value))}
//                 className="mt-1"
//               />
//             </div>

//             <div className="space-y-2">
//               <Button variant="outline" className="w-full bg-transparent" onClick={exportStaffData}>
//                 <Database className="mr-2 h-4 w-4" />
//                 Export Staff Data ({systemStats?.totalStaff || 0} records)
//               </Button>
//               <Button variant="outline" className="w-full bg-transparent" onClick={exportStudentData}>
//                 <Database className="mr-2 h-4 w-4" />
//                 Export Student Data ({systemStats?.totalStudents || 0} records)
//               </Button>
//               <Link href="/reports" className="w-full">
//                 <Button variant="outline" className="w-full justify-center bg-transparent">
//                   <Database className="mr-2 h-4 w-4" />
//                   Export Attendance Records (via Reports)
//                 </Button>
//               </Link>
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <Label htmlFor="auto-export">Auto Export Reports</Label>
//                 <p className="text-sm text-muted-foreground">Automatically export monthly reports</p>
//               </div>
//               <Switch
//                 id="auto-export"
//                 checked={settings.dataManagement.autoExport}
//                 onCheckedChange={(checked) => updateSettings("dataManagement", "autoExport", checked)}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {isSuperAdmin && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Mail className="h-5 w-5" />
//               Email Configuration
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <Label htmlFor="smtp-server">SMTP Server</Label>
//               <Input
//                 id="smtp-server"
//                 placeholder="smtp.gmail.com"
//                 value={settings.email.smtpServer}
//                 onChange={(e) => updateSettings("email", "smtpServer", e.target.value)}
//                 className="mt-1"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="smtp-port">Port</Label>
//                 <Input
//                   id="smtp-port"
//                   type="number"
//                   value={settings.email.smtpPort}
//                   onChange={(e) => updateSettings("email", "smtpPort", Number.parseInt(e.target.value))}
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="smtp-security">Security</Label>
//                 <Select
//                   value={settings.email.smtpSecurity}
//                   onValueChange={(value) => updateSettings("email", "smtpSecurity", value)}
//                 >
//                   <SelectTrigger className="mt-1">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="none">None</SelectItem>
//                     <SelectItem value="tls">TLS</SelectItem>
//                     <SelectItem value="ssl">SSL</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="from-email">From Email</Label>
//               <Input
//                 id="from-email"
//                 type="email"
//                 placeholder="noreply@genamplify.com"
//                 value={settings.email.fromEmail}
//                 onChange={(e) => updateSettings("email", "fromEmail", e.target.value)}
//                 className="mt-1"
//               />
//             </div>

//             <Button className="w-full" onClick={testEmailConfiguration}>
//               <Mail className="mr-2 h-4 w-4" />
//               Test Email Configuration
//             </Button>
//           </CardContent>
//         </Card>
//       )}

//       {isSuperAdmin && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5" />
//               PWA Update Settings
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label htmlFor="skip-waiting">Auto-Update (Skip Waiting)</Label>
//                 <p className="text-sm text-muted-foreground">
//                   Automatically update the app without showing update prompt to users
//                 </p>
//               </div>
//               <Switch
//                 id="skip-waiting"
//                 checked={!!settings.pwaUpdate?.skipWaiting}
//                 onCheckedChange={(checked) => updateSettings("pwaUpdate", "skipWaiting", checked)}
//               />
//             </div>
//             <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
//               <p className="text-xs text-blue-800">
//                 <strong>Enabled:</strong> App updates automatically in the background without user interaction.
//                 <br />
//                 <strong>Disabled:</strong> Users see an update prompt and can choose when to update.
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//       {isSuperAdmin && <LoginHistoryViewer userRole={(user as any)?.role || ""} />}

//       <Card>
//         <CardHeader className="pb-2">
//           <CardTitle className="text-sm font-medium text-foreground">Quick Actions</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
//             <Link href="/settings/shifts" className="w-full">
//               <Button variant="outline" className="w-full justify-center bg-transparent">
//                 <Clock className="mr-2 h-4 w-4" />
//                 Shift Timings
//               </Button>
//             </Link>
//             <Button
//               variant="outline"
//               className="w-full justify-center bg-transparent"
//               onClick={() => setShowProfileModal(true)}
//             >
//               <User className="mr-2 h-4 w-4" />
//               View Profile
//             </Button>
//             <Link href="/reports" className="w-full">
//               <Button variant="outline" className="w-full justify-center bg-transparent">
//                 <BarChart3 className="mr-2 h-4 w-4" />
//                 Reports
//               </Button>
//             </Link>
//             <Button
//               variant="outline"
//               className="w-full justify-center bg-transparent"
//               onClick={() => setShowPasswordUpdate(true)}
//             >
//               <Lock className="mr-2 h-4 w-4" />
//               Change Password
//             </Button>
//             <Button variant="destructive" className="w-full justify-center" onClick={handleLogout}>
//               <LogOut className="mr-2 h-4 w-4" />
//               Logout
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Profile</DialogTitle>
//             <DialogDescription>Your account details</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-2">
//             <div>
//               <Label>Name</Label>
//               <p className="text-sm text-foreground mt-1">{(user as any)?.name || "N/A"}</p>
//             </div>
//             <div>
//               <Label>Email</Label>
//               <p className="text-sm text-foreground mt-1">{(user as any)?.email || "N/A"}</p>
//             </div>
//             <div>
//               <Label>Role</Label>
//               <p className="text-sm text-foreground mt-1">{(user as any)?.role || "N/A"}</p>
//             </div>
//             {(user as any)?.institutionName && (
//               <div>
//                 <Label>Institution</Label>
//                 <p className="text-sm text-foreground mt-1">{(user as any)?.institutionName}</p>
//               </div>
//             )}
//             <div className="pt-2">
//               <Button variant="outline" onClick={() => setShowProfileModal(false)} className="w-full">
//                 Close
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={showPasswordUpdate} onOpenChange={setShowPasswordUpdate}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Change Password</DialogTitle>
//             <DialogDescription>Enter your current and new password</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-3">
//             <div className="space-y-1.5">
//               <Label htmlFor="current-password">Current Password</Label>
//               <Input
//                 id="current-password"
//                 type="password"
//                 value={passwordData.currentPassword}
//                 onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
//                 placeholder="Enter current password"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label htmlFor="new-password">New Password</Label>
//               <Input
//                 id="new-password"
//                 type="password"
//                 value={passwordData.newPassword}
//                 onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
//                 placeholder="Enter new password (min 6 characters)"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label htmlFor="confirm-password">Confirm New Password</Label>
//               <Input
//                 id="confirm-password"
//                 type="password"
//                 value={passwordData.confirmPassword}
//                 onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
//                 placeholder="Confirm new password"
//               />
//             </div>
//             <div className="flex gap-2 pt-1 justify-end">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setShowPasswordUpdate(false)
//                   setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handlePasswordUpdate}
//                 disabled={
//                   passwordLoading ||
//                   !passwordData.currentPassword ||
//                   !passwordData.newPassword ||
//                   !passwordData.confirmPassword
//                 }
//               >
//                 {passwordLoading ? "Updating..." : "Update Password"}
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import useSWR from "swr"
import LoginHistoryViewer from "@/components/login-history-viewer"
import { StorageMonitor } from "@/components/storage-monitor"
import { QuarterlyReportsManager } from "@/components/quarterly-reports-manager"
import { PushNotificationManager } from "@/components/push-notification-manager"
import { Shield, Database, Mail, Users, GraduationCap, Clock, Settings2, Lock, LogOut, User, BarChart3 } from 'lucide-react'
import { getStoredUser } from "@/lib/auth"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { logout } from "@/lib/auth"
import { ModernLoader } from "@/components/modern-loader"

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [systemStats, setSystemStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      lateAlerts: true,
      absenceAlerts: false,
      updateNotifications: true,
    },
    security: {
      sessionTimeout: 30,
      passwordPolicy: "medium",
      twoFactor: false,
      autoLogout: true,
    },
    authentication: {
      otpLoginEnabled: true,
    },
    dataManagement: {
      backupFrequency: "daily",
      retentionPeriod: 12,
      autoExport: false,
    },
    email: {
      smtpServer: "",
      smtpPort: 587,
      smtpSecurity: "tls",
      fromEmail: "",
    },
    maintenance: {
      enabled: false,
      message: "",
    },
    attendance: {
      locationVerificationEnabled: true,
      locationRadiusMeters: 100,
    },
    pwaUpdate: {
      skipWaiting: false,
    },
  })
  const router = useRouter()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const isSuperAdmin = (user as any)?.role === "SuperAdmin"

  const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json())
  const {
    data: infra,
    isLoading: infraLoading,
    mutate: refreshInfra,
  } = useSWR(isSuperAdmin ? "/api/admin/system" : null, fetcher)

  const formatBytes = (bytes?: number | null) => {
    if (typeof bytes !== "number" || !isFinite(bytes)) return "N/A"
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)

    if (!storedUser) {
      router.push("/")
    } else {
      fetchSystemStats()
      if (storedUser.role === "SuperAdmin") {
        void loadSavedSettings()
      }
    }
  }, [router])

  const fetchSystemStats = async () => {
    try {
      setLoading(true)
      const u = getStoredUser()
      const inst = u?.role !== "SuperAdmin" ? u?.institutionName : undefined
      const q = inst ? `?institutionName=${encodeURIComponent(inst)}` : ""

      const [staffRes, studentsRes, attendanceRes, summaryRes] = await Promise.all([
        fetch(`/api/staff${q}`),
        fetch(`/api/students${q}`),
        fetch(`/api/attendance${q}`),
        fetch(`/api/reports/summary${q}`),
      ])

      const [staff, students, attendance, summary] = await Promise.all([
        staffRes.ok ? staffRes.json() : { items: [], departments: [], roles: [], shifts: [] },
        studentsRes.ok ? studentsRes.json() : { items: [] },
        attendanceRes.ok ? attendanceRes.json() : { totalCounts: {} },
        summaryRes.ok ? summaryRes.json() : {},
      ])

      setSystemStats({
        totalStaff: staff.items?.length || 0,
        totalStudents: students.items?.length || 0,
        todayAttendance: attendance.totalCounts || {},
        departments: staff.departments || [],
        roles: staff.roles || [],
        shifts: staff.shifts || [],
        summary,
      })
    } catch (error) {
      console.error("Failed to fetch system stats:", error)
      setSystemStats({
        totalStaff: 0,
        totalStudents: 0,
        todayAttendance: {},
        departments: [],
        roles: [],
        shifts: [],
        summary: {},
      })

      if (!navigator.onLine) {
        toast({
          title: "Offline Mode",
          description: "Some data may not be available. Please check your connection.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const loadSavedSettings = async () => {
    try {
      const [globalRes, pwaRes] = await Promise.all([
        fetch("/api/settings?scope=global", { cache: "no-store" }),
        fetch("/api/settings/pwa-update", { cache: "no-store" }),
      ])

      if (globalRes.ok) {
        const json = await globalRes.json()
        if (json?.data && typeof json.data === "object") {
          setSettings((prev) => ({ ...prev, ...json.data }))
        }
      }

      if (pwaRes.ok) {
        const pwaJson = await pwaRes.json()
        if (pwaJson?.success) {
          setSettings((prev) => ({
            ...prev,
            pwaUpdate: {
              skipWaiting: pwaJson.skipWaiting || false,
            },
          }))
        }
      }
    } catch (e) {
      console.error("[settings] load failed", e)
    }
  }

  const saveAllSettings = async () => {
    try {
      setSaving(true)

      // Save global settings
      const globalRes = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: "global", data: settings }),
      })

      const pwaRes = await fetch("/api/settings/pwa-update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skipWaiting: settings.pwaUpdate.skipWaiting }),
      })

      if (!globalRes.ok || !pwaRes.ok) {
        throw new Error("Failed to save settings")
      }

      toast({ title: "Settings saved", description: "Your configuration has been updated." })
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message || "Unable to save settings", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const updateSettings = async (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
    // Here you would typically save to backend
    console.log(`Updated ${category}.${key} to:`, value)
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const exportStaffData = async () => {
    try {
      const resList = await fetch("/api/staff")
      const list = await resList.json()
      const data = Array.isArray(list?.items) ? list.items : []
      const res = await fetch("/api/export/staff?format=excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      downloadBlob(blob, "staff_export.xlsx")
    } catch (e) {
      toast({ title: "Export failed", description: "Could not export staff data", variant: "destructive" })
    }
  }

  const exportStudentData = async () => {
    try {
      const resList = await fetch("/api/students")
      const list = await resList.json()
      const data = Array.isArray(list?.items) ? list.items : []
      const res = await fetch("/api/export/students?format=excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      downloadBlob(blob, "students_export.xlsx")
    } catch (e) {
      toast({ title: "Export failed", description: "Could not export student data", variant: "destructive" })
    }
  }

  const testEmailConfiguration = async () => {
    try {
      const to = (user as any)?.email
      const res = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          from: settings.email.fromEmail || undefined,
          subject: "Test Email Configuration",
          text: "This is a test email from Settings.",
        }),
      })
      const result = await res.json()
      if (res.ok) {
        toast({ title: "Email sent", description: `Message ID: ${result?.messageId || "N/A"}` })
      } else {
        toast({ title: "Email test failed", description: result?.error || "Unknown error", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Email test failed", description: "Unable to send test email", variant: "destructive" })
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match", variant: "destructive" })
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters long", variant: "destructive" })
      return
    }

    try {
      setPasswordLoading(true)
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: (user as any)?.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })
      const result = await res.json()
      if (res.ok) {
        toast({ title: "Success", description: "Password updated successfully!" })
        setShowPasswordUpdate(false)
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        toast({ title: "Error", description: result.error || "Failed to update password", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to update password", variant: "destructive" })
    } finally {
      setPasswordLoading(false)
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return <ModernLoader message="Loading system settings" fullPage />
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {user?.institutionName && (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded mb-1">
              {user.institutionName}
            </div>
          )}
          {!user?.institutionName && user?.role === "SuperAdmin" && (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded mb-1">
              SuperAdmin
            </div>
          )}
          <h1 className="text-2xl font-semibold text-foreground">System Settings</h1>
          <p className="text-sm text-muted-foreground">Configure system preferences and manage all modules</p>
        </div>
        <Button
          className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:opacity-60"
          onClick={saveAllSettings}
          disabled={!isSuperAdmin || saving}
          aria-disabled={!isSuperAdmin || saving}
          title={!isSuperAdmin ? "Only SuperAdmin can save global settings" : "Save all settings"}
        >
          <Settings2 className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save All Settings"}
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{systemStats?.totalStaff || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today Present
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{systemStats?.todayAttendance?.present || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Present today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <PushNotificationManager />

      {isSuperAdmin && (
        <div className="space-y-6">
          <StorageMonitor />
          <QuarterlyReportsManager />
        </div>
      )}

      {isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Operations & Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance-enabled">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily restrict non-admin access during maintenance
                </p>
              </div>
              <Switch
                id="maintenance-enabled"
                checked={!!settings.maintenance?.enabled}
                onCheckedChange={(checked) => updateSettings("maintenance", "enabled", checked)}
              />
            </div>
            <div>
              <Label htmlFor="maintenance-message">Maintenance Message</Label>
              <Input
                id="maintenance-message"
                placeholder="We'll be back shortly..."
                value={settings.maintenance?.message || ""}
                onChange={(e) => updateSettings("maintenance", "message", e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Note: Click "Save All Settings" at the top to apply changes.
            </div>
          </CardContent>
        </Card>
      )}

      {isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="otp-login">OTP Login (Staff/Admin)</Label>
                <p className="text-sm text-muted-foreground">Require OTP verification for staff and admin login</p>
              </div>
              <Switch
                id="otp-login"
                checked={settings.authentication?.otpLoginEnabled ?? true}
                onCheckedChange={(checked) => updateSettings("authentication", "otpLoginEnabled", checked)}
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800">
                <strong>Enabled:</strong> Staff and admins must verify OTP sent to their email during login.
                <br />
                <strong>Disabled:</strong> Direct login without OTP (less secure, not recommended for production).
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <Select
                value={settings.dataManagement.backupFrequency}
                onValueChange={(value) => updateSettings("dataManagement", "backupFrequency", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="retention-period">Data Retention (months)</Label>
              <Input
                id="retention-period"
                type="number"
                value={settings.dataManagement.retentionPeriod}
                onChange={(e) => updateSettings("dataManagement", "retentionPeriod", Number.parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent" onClick={exportStaffData}>
                <Database className="mr-2 h-4 w-4" />
                Export Staff Data ({systemStats?.totalStaff || 0} records)
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={exportStudentData}>
                <Database className="mr-2 h-4 w-4" />
                Export Student Data ({systemStats?.totalStudents || 0} records)
              </Button>
              <Link href="/reports" className="w-full">
                <Button variant="outline" className="w-full justify-center bg-transparent">
                  <Database className="mr-2 h-4 w-4" />
                  Export Attendance Records (via Reports)
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-export">Auto Export Reports</Label>
                <p className="text-sm text-muted-foreground">Automatically export monthly reports</p>
              </div>
              <Switch
                id="auto-export"
                checked={settings.dataManagement.autoExport}
                onCheckedChange={(checked) => updateSettings("dataManagement", "autoExport", checked)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtp-server">SMTP Server</Label>
              <Input
                id="smtp-server"
                placeholder="smtp.gmail.com"
                value={settings.email.smtpServer}
                onChange={(e) => updateSettings("email", "smtpServer", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtp-port">Port</Label>
                <Input
                  id="smtp-port"
                  type="number"
                  value={settings.email.smtpPort}
                  onChange={(e) => updateSettings("email", "smtpPort", Number.parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="smtp-security">Security</Label>
                <Select
                  value={settings.email.smtpSecurity}
                  onValueChange={(value) => updateSettings("email", "smtpSecurity", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="from-email">From Email</Label>
              <Input
                id="from-email"
                type="email"
                placeholder="noreply@genamplify.com"
                value={settings.email.fromEmail}
                onChange={(e) => updateSettings("email", "fromEmail", e.target.value)}
                className="mt-1"
              />
            </div>

            <Button className="w-full" onClick={testEmailConfiguration}>
              <Mail className="mr-2 h-4 w-4" />
              Test Email Configuration
            </Button>
          </CardContent>
        </Card>
      )}

      {isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              PWA Update Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="skip-waiting">Auto-Update (Skip Waiting)</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically update the app without showing update prompt to users
                </p>
              </div>
              <Switch
                id="skip-waiting"
                checked={!!settings.pwaUpdate?.skipWaiting}
                onCheckedChange={(checked) => updateSettings("pwaUpdate", "skipWaiting", checked)}
              />
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800">
                <strong>Enabled:</strong> App updates automatically in the background without user interaction.
                <br />
                <strong>Disabled:</strong> Users see an update prompt and can choose when to update.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {isSuperAdmin && <LoginHistoryViewer userRole={(user as any)?.role || ""} />}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <Link href="/settings/shifts" className="w-full">
              <Button variant="outline" className="w-full justify-center bg-transparent">
                <Clock className="mr-2 h-4 w-4" />
                Shift Timings
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full justify-center bg-transparent"
              onClick={() => setShowProfileModal(true)}
            >
              <User className="mr-2 h-4 w-4" />
              View Profile
            </Button>
            <Link href="/reports" className="w-full">
              <Button variant="outline" className="w-full justify-center bg-transparent">
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full justify-center bg-transparent"
              onClick={() => setShowPasswordUpdate(true)}
            >
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
            <Button variant="destructive" className="w-full justify-center" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>Your account details</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div>
              <Label>Name</Label>
              <p className="text-sm text-foreground mt-1">{(user as any)?.name || "N/A"}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-sm text-foreground mt-1">{(user as any)?.email || "N/A"}</p>
            </div>
            <div>
              <Label>Role</Label>
              <p className="text-sm text-foreground mt-1">{(user as any)?.role || "N/A"}</p>
            </div>
            {(user as any)?.institutionName && (
              <div>
                <Label>Institution</Label>
                <p className="text-sm text-foreground mt-1">{(user as any)?.institutionName}</p>
              </div>
            )}
            <div className="pt-2">
              <Button variant="outline" onClick={() => setShowProfileModal(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPasswordUpdate} onOpenChange={setShowPasswordUpdate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current and new password</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex gap-2 pt-1 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordUpdate(false)
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordUpdate}
                disabled={
                  passwordLoading ||
                  !passwordData.currentPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword
                }
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

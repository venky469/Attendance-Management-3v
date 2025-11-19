// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { getStoredUser, logout } from "@/lib/auth"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { User, Mail, Phone, MapPin, Calendar, Badge, Lock, LogOut, Building2 } from "lucide-react"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// export default function ProfilePage() {
//   const router = useRouter()
//   const [user, setUser] = useState<any>(null)
//   const [showPasswordUpdate, setShowPasswordUpdate] = useState(false)
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   })
//   const [passwordLoading, setPasswordLoading] = useState(false)

//   useEffect(() => {
//     const storedUser = getStoredUser()
//     if (!storedUser) {
//       router.push("/login")
//     } else {
//       setUser(storedUser)
//     }
//   }, [router])

//   const handleLogout = () => {
//     logout()
//   }

//   const handlePasswordUpdate = async () => {
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       alert("New passwords do not match")
//       return
//     }

//     if (passwordData.newPassword.length < 6) {
//       alert("Password must be at least 6 characters long")
//       return
//     }

//     setPasswordLoading(true)
//     try {
//       const response = await fetch("/api/auth/change-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: user.id,
//           currentPassword: passwordData.currentPassword,
//           newPassword: passwordData.newPassword,
//         }),
//       })

//       const result = await response.json()

//       if (response.ok) {
//         alert("Password updated successfully!")
//         setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
//         setShowPasswordUpdate(false)
//       } else {
//         alert(result.error || "Failed to update password")
//       }
//     } catch (error) {
//       console.error("Password update error:", error)
//       alert("Failed to update password")
//     } finally {
//       setPasswordLoading(false)
//     }
//   }

//   if (!user) {
//     return null
//   }

//   return (
//     <div className="min-h-screen pb-20 lg:pb-6">
//       <div className="max-w-2xl mx-auto space-y-6">
//         {/* Profile Header */}
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex flex-col items-center text-center space-y-4">
//               <Avatar className="h-24 w-24 ring-4 ring-teal-500/20">
//                 <AvatarImage
//                   src={user?.photoUrl || undefined}
//                   alt={user?.name || "User"}
//                   onError={(e) => {
//                     e.currentTarget.style.display = "none"
//                   }}
//                 />
//                 <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-2xl">
//                   {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <h1 className="text-2xl font-bold">{user.name}</h1>
//                 <p className="text-muted-foreground capitalize">{user.role}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Personal Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="h-5 w-5" />
//               Personal Information
//             </CardTitle>
//             <CardDescription>Your account and profile details</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//               <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium">Email</p>
//                 <p className="text-sm text-muted-foreground truncate">{user.email}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//               <Badge className="h-5 w-5 text-muted-foreground flex-shrink-0" />
//               <div className="flex-1">
//                 <p className="text-sm font-medium">{user.role === "Student" ? "Roll Number" : "Employee Code"}</p>
//                 <p className="text-sm text-muted-foreground">{user.rollNumber || user.employeeCode || "N/A"}</p>
//               </div>
//             </div>

//             {user.phone && (
//               <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//                 <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">Phone</p>
//                   <p className="text-sm text-muted-foreground">{user.phone}</p>
//                 </div>
//               </div>
//             )}

//             {user.department && (
//               <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//                 <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">Department</p>
//                   <p className="text-sm text-muted-foreground">{user.department}</p>
//                 </div>
//               </div>
//             )}

//             {user.joiningDate && (
//               <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//                 <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">Joining Date</p>
//                   <p className="text-sm text-muted-foreground">{new Date(user.joiningDate).toLocaleDateString()}</p>
//                 </div>
//               </div>
//             )}

//             {user.institutionName && (
//               <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//                 <Building2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">Institution</p>
//                   <p className="text-sm text-muted-foreground">{user.institutionName}</p>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Security Settings */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Lock className="h-5 w-5" />
//               Security Settings
//             </CardTitle>
//             <CardDescription>Manage your account security</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
//               <div>
//                 <p className="font-medium">Password</p>
//                 <p className="text-sm text-muted-foreground">Update your account password</p>
//               </div>
//               <Button variant="outline" onClick={() => setShowPasswordUpdate(true)}>
//                 Change
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Logout Button */}
//         <Button onClick={handleLogout} variant="destructive" className="w-full" size="lg">
//           <LogOut className="mr-2 h-5 w-5" />
//           Log out
//         </Button>
//       </div>

//       {/* Password Update Dialog */}
//       <Dialog open={showPasswordUpdate} onOpenChange={setShowPasswordUpdate}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Lock className="h-5 w-5" />
//               Change Password
//             </DialogTitle>
//             <DialogDescription>Enter your current password and choose a new one</DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="current-password">Current Password</Label>
//               <Input
//                 id="current-password"
//                 type="password"
//                 value={passwordData.currentPassword}
//                 onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
//                 placeholder="Enter current password"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="new-password">New Password</Label>
//               <Input
//                 id="new-password"
//                 type="password"
//                 value={passwordData.newPassword}
//                 onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
//                 placeholder="Enter new password (min 6 characters)"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="confirm-password">Confirm New Password</Label>
//               <Input
//                 id="confirm-password"
//                 type="password"
//                 value={passwordData.confirmPassword}
//                 onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
//                 placeholder="Confirm new password"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-2">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowPasswordUpdate(false)
//                 setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handlePasswordUpdate}
//               disabled={
//                 passwordLoading ||
//                 !passwordData.currentPassword ||
//                 !passwordData.newPassword ||
//                 !passwordData.confirmPassword
//               }
//             >
//               {passwordLoading ? "Updating..." : "Update Password"}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { getStoredUser, logout } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, MapPin, Calendar, Badge, Lock, LogOut, Building2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModernLoader } from "@/components/modern-loader"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    const storedUser = getStoredUser()
    if (!storedUser) {
      router.push("/login")
    } else {
      setUser(storedUser)
    }
  }, [router])

  const handleLogout = () => {
    logout()
  }

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long")
      return
    }

    setPasswordLoading(true)
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Password updated successfully!")
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setShowPasswordUpdate(false)
      } else {
        alert(result.error || "Failed to update password")
      }
    } catch (error) {
      console.error("Password update error:", error)
      alert("Failed to update password")
    } finally {
      setPasswordLoading(false)
    }
  }

  if (!user) {
    return <ModernLoader message="Loading profile" fullPage />
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24 ring-4 ring-teal-500/20">
                <AvatarImage
                  src={user?.photoUrl || undefined}
                  alt={user?.name || "User"}
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-2xl">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your account and profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Badge className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">{user.role === "Student" ? "Roll Number" : "Employee Code"}</p>
                <p className="text-sm text-muted-foreground">{user.rollNumber || user.employeeCode || "N/A"}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
              </div>
            )}

            {user.department && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-sm text-muted-foreground">{user.department}</p>
                </div>
              </div>
            )}

            {user.joiningDate && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Joining Date</p>
                  <p className="text-sm text-muted-foreground">{new Date(user.joiningDate).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            {user.institutionName && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Building2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Institution</p>
                  <p className="text-sm text-muted-foreground">{user.institutionName}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
              <Button variant="outline" onClick={() => setShowPasswordUpdate(true)}>
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button onClick={handleLogout} variant="destructive" className="w-full" size="lg">
          <LogOut className="mr-2 h-5 w-5" />
          Log out
        </Button>
      </div>

      {/* Password Update Dialog */}
      <Dialog open={showPasswordUpdate} onOpenChange={setShowPasswordUpdate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </DialogTitle>
            <DialogDescription>Enter your current password and choose a new one</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
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
        </DialogContent>
      </Dialog>
    </div>
  )
}

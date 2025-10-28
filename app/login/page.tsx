
// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Eye, EyeOff, Clock, Users, TrendingUp, Calendar, Wifi, WifiOff } from "lucide-react"
// import { Checkbox } from "@/components/ui/checkbox"

// export default function Page() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [rememberMe, setRememberMe] = useState(false)
//   const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [networkStatus, setNetworkStatus] = useState<"normal" | "slow" | "offline">("normal")
//   const [currentTime, setCurrentTime] = useState(new Date())
//   const router = useRouter()

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date())
//     }, 1000)
//     return () => clearInterval(timer)
//   }, [])



//   useEffect(() => {
//   // Disable right-click
//   const handleContextMenu = (e: MouseEvent) => {
//     e.preventDefault();
//     // alert('Right-click is disabled for security reasons.');
//   };

//   // Disable inspect shortcuts
//   const handleKeyDown = (e: KeyboardEvent) => {
//     if (
//       (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
//       e.key === 'F12'
//     ) {
//       e.preventDefault();
//       // alert('Developer tools are disabled for this application.');
//     }
//   };

//   // Detect if DevTools is open and close window
//   const detectDevTools = () => {
//     const threshold = 160;
//     const widthThreshold = window.outerWidth - window.innerWidth > threshold;
//     const heightThreshold = window.outerHeight - window.innerHeight > threshold;

//     if (widthThreshold || heightThreshold) {
//       // alert('Developer tools detected. The window will be closed for security reasons.');
//       window.close();

//       // As a fallback for browsers that block window.close()
//       document.body.innerHTML =
//         '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;font-size:20px;color:red;">⚠️ Developer tools detected. Please ***  Close Inspect Page  *** and reopen the page.</div>';
//     }
//   };

//   // Check every second
//   const interval = setInterval(detectDevTools, 1000);
  

//   // Add listeners
//   document.addEventListener('contextmenu', handleContextMenu);
//   document.addEventListener('keydown', handleKeyDown);

//   // Cleanup
//   return () => {
//     document.removeEventListener('contextmenu', handleContextMenu);
//     document.removeEventListener('keydown', handleKeyDown);
//     clearInterval(interval);
//   };
// }, []);




//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setLoading(true)
//     setNetworkStatus("normal")

//     const controller = new AbortController()
//     const timeoutId = setTimeout(() => {
//       controller.abort()
//       setNetworkStatus("slow")
//     }, 10000)

//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//         signal: controller.signal,
//       })

//       clearTimeout(timeoutId)

//       const data = await response.json()

//       if (response.ok) {
//         const storage = rememberMe ? localStorage : sessionStorage
//         storage.setItem("user", JSON.stringify(data.user))

//         if (rememberMe) {
//           sessionStorage.removeItem("user")
//         } else {
//           localStorage.removeItem("user")
//         }

//         router.push("/")
//       } else {
//         if (response.status === 401) {
//           setError("Invalid email or password. Please check your credentials.")
//         } else if (response.status === 429) {
//           setError("Too many login attempts. Please try again later.")
//         } else if (response.status >= 500) {
//           setError("Server error. Please try again later.")
//         } else {
//           setError(data.error || "Login failed. Please try again.")
//         }
//       }
//     } catch (err: any) {
//       clearTimeout(timeoutId)

//       if (err.name === "AbortError") {
//         setNetworkStatus("slow")
//         setError("Network is slow. Please check your connection and try again.")
//       } else if (!navigator.onLine) {
//         setNetworkStatus("offline")
//         setError("You appear to be offline. Please check your internet connection.")
//       } else if (err.message?.includes("fetch")) {
//         setError("Network error. Please check your connection and try again.")
//       } else {
//         setError("An unexpected error occurred. Please try again.")
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleRetry = () => {
//     setError("")
//     setNetworkStatus("normal")
//     const form = document.querySelector("form") as HTMLFormElement
//     if (form) {
//       form.requestSubmit()
//     }
//   }

//   const getErrorIcon = () => {
//     if (networkStatus === "slow") return <Wifi className="h-4 w-4" />
//     if (networkStatus === "offline") return <WifiOff className="h-4 w-4" />
//     return null
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 pt-2 pb-8">
//       <div className="mx-auto max-w-6xl">
//         <div className="text-center mb-8">
//           {/* ... ClientRoot now renders the logo above this section ... */}
//           <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Face Attendance</h1>
//           <p className="text-muted-foreground text-lg">Smart Biometric Attendance with Face Recognition Technology</p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8 items-start">
//           <div className="flex items-center justify-center">
//             <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
//               <CardHeader className="space-y-1 text-center">
//                 <CardTitle className="text-2xl font-bold text-card-foreground">Secure Login</CardTitle>
//                 <CardDescription className="text-muted-foreground">
//                   Access your institution's attendance management portal
//                 </CardDescription>

//                 <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-muted rounded-lg">
//                   <Clock className="h-4 w-4 text-primary" />
//                   <span className="text-sm font-medium text-muted-foreground" suppressHydrationWarning>
//                     {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
//                   </span>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
//                       Email Address
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="Enter your email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                       className="h-11 bg-input border-border focus:border-primary focus:ring-primary"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="password" className="text-sm font-medium text-card-foreground">
//                       Password
//                     </Label>
//                     <div className="relative">
//                       <Input
//                         id="password"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter your password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         className="h-11 pr-10 bg-input border-border focus:border-primary focus:ring-primary"
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-4 w-4 text-muted-foreground" />
//                         ) : (
//                           <Eye className="h-4 w-4 text-muted-foreground" />
//                         )}
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="remember"
//                       checked={rememberMe}
//                       onCheckedChange={(checked) => setRememberMe(checked as boolean)}
//                     />
//                     <Label
//                       htmlFor="remember"
//                       className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
//                     >
//                       Remember me on this device
//                     </Label>
//                   </div>

//                   {error && (
//                     <Alert className="border-destructive/20 bg-destructive/10">
//                       <div className="flex items-start gap-2">
//                         {getErrorIcon()}
//                         <div className="flex-1">
//                           <AlertDescription className="text-destructive text-sm">{error}</AlertDescription>
//                           {(networkStatus === "slow" || networkStatus === "offline") && (
//                             <Button
//                               type="button"
//                               variant="outline"
//                               size="sm"
//                               className="mt-2 h-8 text-xs bg-transparent"
//                               onClick={handleRetry}
//                             >
//                               Try Again
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     </Alert>
//                   )}

//                   <Button
//                     type="submit"
//                     className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <div className="flex items-center gap-2">
//                         <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
//                         {networkStatus === "slow" ? "Connecting..." : "Signing in..."}
//                       </div>
//                     ) : (
//                       "Sign In"
//                     )}
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="space-y-6">
//             <div className="text-center lg:text-left">
//               <h2 className="text-2xl font-bold text-foreground mb-2">Revolutionize Attendance Management</h2>
//               <p className="text-muted-foreground">
//                 Streamline attendance tracking with AI-powered face recognition, real-time analytics, and comprehensive
//                 reporting for educational institutions and enterprises.
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <Card className="bg-card border-border">
//                 <CardContent className="p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
//                       <Users className="h-5 w-5 text-green-600" />
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-card-foreground">50K+</p>
//                       <p className="text-sm text-muted-foreground">Active Users</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="bg-card border-border">
//                 <CardContent className="p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
//                       <TrendingUp className="h-5 w-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-card-foreground">99.8%</p>
//                       <p className="text-sm text-muted-foreground">Accuracy Rate</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="bg-card border-border">
//                 <CardContent className="p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
//                       <Calendar className="h-5 w-5 text-amber-600" />
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-card-foreground">500+</p>
//                       <p className="text-sm text-muted-foreground">Institutions</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="bg-card border-border">
//                 <CardContent className="p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
//                       <Clock className="h-5 w-5 text-purple-600" />
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-card-foreground">&lt;2s</p>
//                       <p className="text-sm text-muted-foreground">Check-in Time</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card className="bg-card border-border">
//               <CardHeader>
//                 <CardTitle className="text-lg text-card-foreground">Powerful Features</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <div className="h-2 w-2 rounded-full bg-primary"></div>
//                   <span className="text-sm text-card-foreground">AI-Powered Face Recognition & Biometric Security</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-2 w-2 rounded-full bg-secondary"></div>
//                   <span className="text-sm text-card-foreground">Real-Time Attendance Tracking & Notifications</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-2 w-2 rounded-full bg-green-500"></div>
//                   <span className="text-sm text-card-foreground">Comprehensive Analytics & Custom Reports</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-2 w-2 rounded-full bg-purple-500"></div>
//                   <span className="text-sm text-card-foreground">Multi-Institution & Role-Based Access Control</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-2 w-2 rounded-full bg-amber-500"></div>
//                   <span className="text-sm text-card-foreground">Leave Management & Approval Workflows</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-2 w-2 rounded-full bg-blue-500"></div>
//                   <span className="text-sm text-card-foreground">Mobile App Support & Cloud Synchronization</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         <footer className="mt-12 text-center">
//           <div className="flex justify-center gap-6 text-sm">
//             <Link href="/privacy" className="text-secondary hover:text-secondary/80 transition-colors">
//               Privacy Policy
//             </Link>
//             <Link href="/terms" className="text-secondary hover:text-secondary/80 transition-colors">
//               Terms of Service
//             </Link>
//             <Link href="/contact" className="text-secondary hover:text-secondary/80 transition-colors">
//               Contact Support
//             </Link>
//           </div>
//           <p className="text-muted-foreground text-sm mt-4">© 2025 Face Attendence Services. All rights reserved.</p>
//         </footer>
//       </div>
//     </div>
//   )
// }




"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Clock, Users, TrendingUp, Calendar, Wifi, WifiOff } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [networkStatus, setNetworkStatus] = useState<"normal" | "slow" | "offline">("normal")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [requiresOTP, setRequiresOTP] = useState(false)
  const [otpMessage, setOtpMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setNetworkStatus("normal")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      setNetworkStatus("slow")
    }, 10000)

    try {
      if (requiresOTP) {
        const response = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        const data = await response.json()

        if (response.ok) {
          const storage = rememberMe ? localStorage : sessionStorage
          storage.setItem("user", JSON.stringify(data.user))

          if (rememberMe) {
            sessionStorage.removeItem("user")
          } else {
            localStorage.removeItem("user")
          }

          router.push("/")
        } else {
          setError(data.error || "Invalid OTP. Please try again.")
        }
      } else {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        const data = await response.json()

        if (response.ok) {
          if (data.requiresOTP) {
            setRequiresOTP(true)
            setOtpMessage(data.message || "OTP sent to your email")
            setError("")
          } else {
            const storage = rememberMe ? localStorage : sessionStorage
            storage.setItem("user", JSON.stringify(data.user))

            if (rememberMe) {
              sessionStorage.removeItem("user")
            } else {
              localStorage.removeItem("user")
            }

            router.push("/")
          }
        } else {
          if (response.status === 401) {
            setError("Invalid email or password. Please check your credentials.")
          } else if (response.status === 429) {
            setError("Too many login attempts. Please try again later.")
          } else if (response.status >= 500) {
            setError("Server error. Please try again later.")
          } else {
            setError(data.error || "Login failed. Please try again.")
          }
        }
      }
    } catch (err: any) {
      clearTimeout(timeoutId)

      if (err.name === "AbortError") {
        setNetworkStatus("slow")
        setError("Network is slow. Please check your connection and try again.")
      } else if (!navigator.onLine) {
        setNetworkStatus("offline")
        setError("You appear to be offline. Please check your internet connection.")
      } else if (err.message?.includes("fetch")) {
        setError("Network error. Please check your connection and try again.")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setError("")
    setNetworkStatus("normal")
    const form = document.querySelector("form") as HTMLFormElement
    if (form) {
      form.requestSubmit()
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.requiresOTP) {
        setOtpMessage("New OTP sent to your email")
        setOtp("")
      } else {
        setError("Failed to resend OTP. Please try again.")
      }
    } catch (err) {
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getErrorIcon = () => {
    if (networkStatus === "slow") return <Wifi className="h-4 w-4" />
    if (networkStatus === "offline") return <WifiOff className="h-4 w-4" />
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 pt-2 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Genamplify Attendance</h1>
          <p className="text-muted-foreground text-lg">Smart Biometric Attendance with Face Recognition Technology</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  {requiresOTP ? "Verify OTP" : "Secure Login"}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {requiresOTP
                    ? "Enter the 4-digit code sent to your email"
                    : "Access your institution's attendance management portal"}
                </CardDescription>

                <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-muted rounded-lg">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground" suppressHydrationWarning>
                    {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!requiresOTP ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-11 bg-input border-border focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-card-foreground">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-11 pr-10 bg-input border-border focus:border-primary focus:ring-primary"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Remember me on this device
                        </Label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-sm font-medium text-card-foreground">
                          Verification Code
                        </Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 4-digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          required
                          maxLength={4}
                          className="h-11 bg-input border-border focus:border-primary focus:ring-primary text-center text-2xl tracking-widest font-mono"
                        />
                      </div>

                      {otpMessage && (
                        <Alert className="border-primary/20 bg-primary/10">
                          <AlertDescription className="text-primary text-sm">{otpMessage}</AlertDescription>
                        </Alert>
                      )}

                      <div className="text-center">
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={handleResendOTP}
                          disabled={loading}
                          className="text-primary hover:text-primary/80"
                        >
                          Didn't receive code? Resend OTP
                        </Button>
                      </div>
                    </>
                  )}

                  {error && (
                    <Alert className="border-destructive/20 bg-destructive/10">
                      <div className="flex items-start gap-2">
                        {getErrorIcon()}
                        <div className="flex-1">
                          <AlertDescription className="text-destructive text-sm">{error}</AlertDescription>
                          {(networkStatus === "slow" || networkStatus === "offline") && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2 h-8 text-xs bg-transparent"
                              onClick={handleRetry}
                            >
                              Try Again
                            </Button>
                          )}
                        </div>
                      </div>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={loading || (requiresOTP && otp.length !== 4)}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                        {networkStatus === "slow" ? "Connecting..." : requiresOTP ? "Verifying..." : "Signing in..."}
                      </div>
                    ) : requiresOTP ? (
                      "Verify & Sign In"
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  {requiresOTP && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => {
                        setRequiresOTP(false)
                        setOtp("")
                        setOtpMessage("")
                        setError("")
                      }}
                    >
                      Back to Login
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-foreground mb-2">Revolutionize Attendance Management</h2>
              <p className="text-muted-foreground">
                Streamline attendance tracking with AI-powered face recognition, real-time analytics, and comprehensive
                reporting for educational institutions and enterprises.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-card-foreground">50K+</p>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-card-foreground">99.8%</p>
                      <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-card-foreground">500+</p>
                      <p className="text-sm text-muted-foreground">Institutions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-card-foreground">&lt;2s</p>
                      <p className="text-sm text-muted-foreground">Check-in Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Powerful Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-card-foreground">AI-Powered Face Recognition & Biometric Security</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-secondary"></div>
                  <span className="text-sm text-card-foreground">Real-Time Attendance Tracking & Notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-card-foreground">Comprehensive Analytics & Custom Reports</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-card-foreground">Multi-Institution & Role-Based Access Control</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-card-foreground">Leave Management & Approval Workflows</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-card-foreground">Mobile App Support & Cloud Synchronization</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <footer className="mt-12 text-center">
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-secondary hover:text-secondary/80 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-secondary hover:text-secondary/80 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-secondary hover:text-secondary/80 transition-colors">
              Contact Support
            </Link>
          </div>
          <p className="text-muted-foreground text-sm mt-4">© 2025 Genamplify Services. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

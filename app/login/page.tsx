
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, Clock, Users, TrendingUp, Calendar, Wifi, WifiOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [networkStatus, setNetworkStatus] = useState<"normal" | "slow" | "offline">("normal")
  const [currentTime, setCurrentTime] = useState(new Date())
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

useEffect(() => {
  // Disable right-click
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    // alert('Right-click is disabled for security reasons.');
  };

  // Disable inspect shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      e.key === 'F12'
    ) {
      e.preventDefault();
      // alert('Developer tools are disabled for this application.');
    }
  };

  // Detect if DevTools is open and close window
  const detectDevTools = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if (widthThreshold || heightThreshold) {
      // alert('Developer tools detected. The window will be closed for security reasons.');
      window.close();

      // As a fallback for browsers that block window.close()
      document.body.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;font-size:20px;color:red;">⚠️ Developer tools detected. Please ***  Close Inspect Page  *** and reopen the page.</div>';
    }
  };

  // Check every second
  const interval = setInterval(detectDevTools, 1000);

  // Add listeners
  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('keydown', handleKeyDown);

  // Cleanup
  return () => {
    document.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('keydown', handleKeyDown);
    clearInterval(interval);
  };
}, []);






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
        localStorage.setItem("user", JSON.stringify(data.user))
        router.push("/")
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

  const getErrorIcon = () => {
    if (networkStatus === "slow") return <Wifi className="h-4 w-4" />
    if (networkStatus === "offline") return <WifiOff className="h-4 w-4" />
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-lg">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Face Recognition Attendance System</h1>
          <p className="text-muted-foreground text-lg">Advanced Digital Attendance Management System</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold text-card-foreground">Welcome Back</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sign in to access your attendance dashboard
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
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                        {networkStatus === "slow" ? "Connecting..." : "Signing in..."}
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-foreground mb-2">Track Attendance Effortlessly</h2>
              <p className="text-muted-foreground">
                Monitor real-time attendance, generate reports, and manage your workforce with advanced analytics.
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
                      <p className="text-2xl font-bold text-card-foreground">94.2%</p>
                      <p className="text-sm text-muted-foreground">Avg Attendance</p>
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
                      <p className="text-2xl font-bold text-card-foreground">+12%</p>
                      <p className="text-sm text-muted-foreground">This Month</p>
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
                      <p className="text-2xl font-bold text-card-foreground">1,247</p>
                      <p className="text-sm text-muted-foreground">Total Records</p>
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
                      <p className="text-2xl font-bold text-card-foreground">8.2h</p>
                      <p className="text-sm text-muted-foreground">Avg Hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-card-foreground">Face ID Recognition Technology</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-secondary"></div>
                  <span className="text-sm text-card-foreground">Real-time Attendance Tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-card-foreground">Advanced Analytics & Reports</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-card-foreground">Multi-role Access Control</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <footer className="mt-12 text-center">
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="text-secondary hover:text-secondary/80 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-secondary hover:text-secondary/80 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-secondary hover:text-secondary/80 transition-colors">
              Contact Support
            </a>
          </div>
          <p className="text-muted-foreground text-sm mt-4">© 2025 Thota's Services. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}










// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Eye, EyeOff, Clock, Users, TrendingUp, Calendar, Wifi, WifiOff } from "lucide-react"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
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
//         localStorage.setItem("user", JSON.stringify(data.user))
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
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 px-4 pt-2 pb-8">
//       <div className="mx-auto max-w-6xl">
//         <div className="text-center mb-8">
//           {/* ... ClientRoot now renders the logo above this section ... */}
//           <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Genamplify</h1>
//           <p className="text-muted-foreground text-lg">Advanced Digital Attendance Management System</p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8 items-start">
//           <div className="flex items-center justify-center">
//             <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
//               <CardHeader className="space-y-1 text-center">
//                 <CardTitle className="text-2xl font-bold text-card-foreground">Welcome Back</CardTitle>
//                 <CardDescription className="text-muted-foreground">
//                   Sign in to access your attendance dashboard
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
//               <h2 className="text-2xl font-bold text-foreground mb-2">Track Attendance Effortlessly</h2>
//               <p className="text-muted-foreground">
//                 Monitor real-time attendance, generate reports, and manage your workforce with advanced analytics.
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
//                       <p className="text-2xl font-bold text-card-foreground">94.2%</p>
//                       <p className="text-sm text-muted-foreground">Avg Attendance</p>
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
//                       <p className="text-2xl font-bold text-card-foreground">+12%</p>
//                       <p className="text-sm text-muted-foreground">This Month</p>
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
//                       <p className="text-2xl font-bold text-card-foreground">1,247</p>
//                       <p className="text-sm text-muted-foreground">Total Records</p>
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
//                       <p className="text-2xl font-bold text-card-foreground">8.2h</p>
//                       <p className="text-sm text-muted-foreground">Avg Hours</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card className="bg-card border-border">
//               <CardHeader>
//                 <CardTitle className="text-lg text-card-foreground">Key Features</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <div className="h-2 w-2 rounded-full bg-primary"></div>
//                   <span className="text-sm text-card-foreground">Face ID Recognition Technology</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-2 w-2 rounded-full bg-secondary"></div>
//                   <span className="text-sm text-card-foreground">Real-time Attendance Tracking</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-2 w-2 rounded-full bg-green-500"></div>
//                   <span className="text-sm text-card-foreground">Advanced Analytics & Reports</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-2 w-2 rounded-full bg-purple-500"></div>
//                   <span className="text-sm text-card-foreground">Multi-role Access Control</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         <footer className="mt-12 text-center">
//           <div className="flex justify-center gap-6 text-sm">
//             <a href="#" className="text-secondary hover:text-secondary/80 transition-colors">
//               Privacy Policy
//             </a>
//             <a href="#" className="text-secondary hover:text-secondary/80 transition-colors">
//               Terms of Service
//             </a>
//             <a href="#" className="text-secondary hover:text-secondary/80 transition-colors">
//               Contact Support
//             </a>
//           </div>
//           <p className="text-muted-foreground text-sm mt-4">© 2024 Genamplify Services. All rights reserved.</p>
//         </footer>
//       </div>
//     </div>
//   )
// }




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
import {
  Eye,
  EyeOff,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { getCurrentLocation } from "@/lib/location-tracker"
import { startSessionTracking } from "@/lib/session-tracker"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [networkStatus, setNetworkStatus] = useState<"normal" | "slow" | "offline">("normal")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [requiresOTP, setRequiresOTP] = useState(false)
  const [otpMessage, setOtpMessage] = useState("")
  const [location, setLocation] = useState<any>(null)
  const [maintenanceMode, setMaintenanceMode] = useState<{ enabled: boolean; message: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const emailInput = document.getElementById("email")
    if (emailInput && !requiresOTP) {
      emailInput.focus()
    }
  }, [requiresOTP])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    console.log("[v0] Attempting to get user location...")
    getCurrentLocation()
      .then((loc) => {
        if (loc) {
          console.log("[v0] Location captured:", loc)
          setLocation(loc)
        } else {
          console.log("[v0] Location not available - user may have denied permission or geolocation not supported")
        }
      })
      .catch((err) => {
        console.error("[v0] Location error:", err)
      })
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





  useEffect(() => {
    fetch("/api/settings?scope=global")
      .then((r) => r.json())
      .then((data) => {
        if (data?.data?.maintenance?.enabled) {
          setMaintenanceMode({
            enabled: true,
            message: data.data.maintenance.message || "System is under maintenance. Please try again later.",
          })
        }
      })
      .catch(() => {
        // Silently fail - maintenance check is not critical
      })
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
        console.log("[v0] Verifying OTP with location:", location)
        const response = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp, location }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        const data = await response.json()

        if (response.ok) {
          localStorage.setItem("user", JSON.stringify(data.user))

          sessionStorage.removeItem("user")

          console.log("[v0] Starting session tracking for user:", data.user.id)
          startSessionTracking(data.user.id, data.user.email)

          window.dispatchEvent(new Event("userLogin"))

          router.push("/")
        } else {
          setError(data.error || "Invalid OTP. Please try again.")
        }
      } else {
        console.log("[v0] Logging in with location:", location)
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, location }),
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
            localStorage.setItem("user", JSON.stringify(data.user))

            sessionStorage.removeItem("user")

            startSessionTracking(data.user.id, data.user.email)

            window.dispatchEvent(new Event("userLogin"))

            router.push("/")
          }
        } else {
          if (response.status === 503 && data.maintenanceMode) {
            setError(data.error || "System is under maintenance. Only administrators can login at this time.")
          } else if (response.status === 401) {
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
    if (networkStatus === "slow") return <Wifi className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    if (networkStatus === "offline") return <WifiOff className="h-4 w-4 text-red-600 dark:text-red-400" />
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 px-4 pt-2 pb-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {maintenanceMode?.enabled && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 px-4 py-6 shadow-2xl animate-in slide-in-from-top duration-500">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 md:h-16 md:w-16 rounded-full bg-white/20 backdrop-blur-sm mb-3 md:mb-4 animate-pulse">
              <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-3 text-balance">
              🚧 System Under Maintenance
            </h2>
            <p className="text-base md:text-xl text-white/95 mb-2 text-pretty max-w-2xl mx-auto">
              {maintenanceMode.message}
            </p>
            <p className="text-white/80 text-sm md:text-base">
              Only system administrators can login during maintenance. Please check back later.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl relative z-10" style={{ marginTop: maintenanceMode?.enabled ? "160px" : "0" }}>
        <div className="text-center mb-6 md:mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <img
              src="/logo3.png"
              alt="FaceAttendence"
              className="h-16 w-16 md:h-24 md:w-24 rounded-xl md:rounded-2xl shadow-lg object-cover"
            />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent text-balance">
              FaceAttendence
            </h1>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg font-medium px-4">
            Smart Biometric Attendance with AI-Powered Face Recognition
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start">
          <div className="flex items-center justify-center animate-in fade-in slide-in-from-left duration-700 delay-200">
            <Card className="w-full max-w-md shadow-2xl border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {requiresOTP ? "Verify OTP" : "Secure Login"}
                </CardTitle>
                <CardDescription className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  {requiresOTP
                    ? "Enter the 4-digit code sent to your email"
                    : "Access your institution's attendance management portal"}
                </CardDescription>

                <div className="flex items-center justify-center gap-2 mt-4 p-2 md:p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span
                    className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300"
                    suppressHydrationWarning
                  >
                    {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!requiresOTP ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
                            className="h-11 pr-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
                          className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 text-center text-2xl tracking-widest font-mono"
                        />
                      </div>

                      {otpMessage && (
                        <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50">
                          <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
                            {otpMessage}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="text-center">
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={handleResendOTP}
                          disabled={loading}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          Didn't receive code? Resend OTP
                        </Button>
                      </div>
                    </>
                  )}

                  {error && (
                    <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
                      <div className="flex items-start gap-2">
                        {getErrorIcon()}
                        <div className="flex-1">
                          <AlertDescription className="text-red-700 dark:text-red-300 text-sm">
                            {error}
                          </AlertDescription>
                          {(networkStatus === "slow" || networkStatus === "offline") && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2 h-8 text-xs bg-transparent border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                              onClick={handleSubmit}
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
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={loading || (requiresOTP && otp.length !== 4)}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
                      className="w-full bg-transparent border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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

          <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right duration-700 delay-300">
            <div className="text-center lg:text-left px-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Revolutionize Attendance Management
              </h2>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                Streamline attendance tracking with AI-powered face recognition, real-time analytics, and comprehensive
                reporting for educational institutions and enterprises.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">50K+</p>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">99.8%</p>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">500+</p>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Institutions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Clock className="h-4 w-4 md:h-5 md:w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">&lt;2s</p>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Check-in Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-base md:text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
                  Powerful Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-3 group">
                  <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 group-hover:scale-150 transition-transform duration-300"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    AI-Powered Face Recognition & Biometric Security
                  </span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 group-hover:scale-150 transition-transform duration-300"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Real-Time Attendance Tracking & Notifications
                  </span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 group-hover:scale-150 transition-transform duration-300"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Comprehensive Analytics & Custom Reports
                  </span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 group-hover:scale-150 transition-transform duration-300"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Multi-Institution & Role-Based Access Control
                  </span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-400 group-hover:scale-150 transition-transform duration-300"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Leave Management & Approval Workflows
                  </span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 group-hover:scale-150 transition-transform duration-300"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Mobile App Support & Cloud Synchronization
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <footer className="mt-8 md:mt-12 text-center animate-in fade-in duration-700 delay-500">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm px-4">
            <Link
              href="/privacy"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact Support
            </Link>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-3 md:mt-4 px-4">
            © 2025 FaceAttendence. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}

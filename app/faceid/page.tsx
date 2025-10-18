// // "use client"

// // import { useEffect, useRef, useState } from "react"
// // import * as faceapi from "face-api.js"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { SHIFT_TIMINGS, getAttendanceStatus, getCountdownToShift, getDelayTime } from "@/lib/constants"
// // import { realtimeClient } from "@/lib/realtime-client"
// // import { Wifi, WifiOff, MapPin } from "lucide-react"
// // import { getStoredUser } from "@/lib/auth" // import user helper
// // import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision"
// // import { useRouter } from "next/navigation" // router for redirect

// // type PersonType = "staff" | "student"

// // type FaceTemplate = {
// //   personId: string
// //   personType: PersonType
// //   vector: number[] // 128-d face descriptor
// //   name?: string
// //   department?: string
// //   role?: string
// //   shift?: string
// //   className?: string
// //   branchClass?: string
// //   branch?: string
// //   location?: {
// //     latitude: number
// //     longitude: number
// //     address?: string
// //   }
// // }

// // type RecognizedEvent = {
// //   personId: string
// //   personType: PersonType
// //   name: string
// //   time: string
// //   distance: number
// //   department?: string
// //   role?: string
// //   shift?: string
// //   className?: string
// //   status: "present" | "late" | "absent" | "already_recorded" | "early" | "window_closed"
// //   delayInfo?: { hours: number; minutes: number }
// // }

// // export default function FaceIDPage() {
// //   const videoRef = useRef<HTMLVideoElement>(null)
// //   const canvasRef = useRef<HTMLCanvasElement>(null)
// //   const streamRef = useRef<MediaStream | null>(null)
// //   const rafRef = useRef<number | null>(null)
// //   const lastDetectRef = useRef<number>(0)
// //   const recentlyMarkedRef = useRef<Map<string, number>>(new Map()) // personId -> ts

// //   const [ready, setReady] = useState(false)
// //   const [modelsReady, setModelsReady] = useState(false)
// //   const [running, setRunning] = useState(false)
// //   const [templates, setTemplates] = useState<FaceTemplate[]>([])
// //   const [log, setLog] = useState<string[]>([])
// //   const [events, setEvents] = useState<RecognizedEvent[]>([])
// //   const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
// //   const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
// //   const [isConnected, setIsConnected] = useState(false)
// //   const [realtimeUpdates, setRealtimeUpdates] = useState(0)
// //   const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null)
// //   const [locationError, setLocationError] = useState<string | null>(null)
// //   const [locationLoading, setLocationLoading] = useState(false)

// //   const mpDetectorRef = useRef<FaceDetector | null>(null)
// //   const [mpReady, setMpReady] = useState(false)
// //   const [recogReady, setRecogReady] = useState(false)

// //   const router = useRouter() // router for redirect

// //   function logMsg(msg: string) {
// //     setLog((prev) => [msg, ...prev].slice(0, 8))
// //   }

// //   useEffect(() => {
// //     const u = getStoredUser()
// //     if (u?.role === "Student") {
// //       router.replace("/") // redirect students away from Face ID
// //     }
// //   }, [router])

// //   useEffect(() => {
// //     let cancelled = false
// //     async function loadModels() {
// //       try {
// //         // const MODEL_URL = "/models"
  
// //          const MODEL_URL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
// //         const recogPromise = (async () => {
// //           await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
// //           if (!cancelled) setRecogReady(true)
// //         })()

// //         const mpPromise = (async () => {
// //           const resolver = await FilesetResolver.forVisionTasks(
// //             "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
// //           )
// //           const detector = await FaceDetector.createFromOptions(resolver, {
// //             baseOptions: {
// //               modelAssetPath:
// //                  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
// //             },
// //             runningMode: "VIDEO",
// //           })
// //           if (!cancelled) {
// //             mpDetectorRef.current = detector
// //             setMpReady(true)
// //           }
// //         })()

// //         await Promise.all([recogPromise, mpPromise])
// //         if (!cancelled) setModelsReady(true)
// //       } catch (err) {
// //         console.error(err)
// //         alert("Failed to load models. Ensure /public/models exists for face-api recognition net.")
// //       }
// //     }
// //     loadModels()
// //     return () => {
// //       cancelled = true
// //     }
// //   }, [])

// //   useEffect(() => {
// //     async function loadDescriptors() {
// //       try {
// //         const u = getStoredUser()
// //         const instParam =
// //           u?.institutionName && u?.role !== "SuperAdmin"
// //             ? `?institutionName=${encodeURIComponent(u.institutionName)}`
// //             : ""
// //         const [staffRes, studentsRes] = await Promise.all([
// //           fetch(`/api/staff${instParam}`),
// //           fetch(`/api/students${instParam}`),
// //         ])
// //         const staffJson = await staffRes.json()
// //         const studentsJson = await studentsRes.json()

// //         const operatorRole = u?.role
// //         const operatorBranchRaw =
// //           ((u as any)?.branchClass as string | undefined) || ((u as any)?.branch as string | undefined) || ""
// //         const operatorBranch = operatorBranchRaw ? operatorBranchRaw.toUpperCase().trim() : ""
// //         const teacherUnassigned = operatorRole === "Teacher" && !operatorBranch

// //         function studentMatchesTeacherBranch(op: string, stBC?: string, stB?: string) {
// //           if (!op) return false
// //           const studentBC = (stBC || "").toUpperCase().trim()
// //           const studentB = (stB || "").toUpperCase().trim()
// //           if (op.includes("-")) {
// //             return studentBC === op
// //           }
// //           return studentB === op || studentBC === op || studentBC.startsWith(op + "-")
// //         }

// //         const t: FaceTemplate[] = []

// //         for (const s of staffJson.items as any[]) {
// //           if (Array.isArray(s.faceDescriptor)) {
// //             t.push({
// //               personId: s.id,
// //               personType: "staff",
// //               vector: s.faceDescriptor,
// //               name: s.name || s.fullName || s.firstName || s.email || s.id,
// //               department: s.department,
// //               role: s.role,
// //               shift: s.shift,
// //               location: s.location,
// //             })
// //           }
// //         }

// //         if (!teacherUnassigned) {
// //           for (const st of studentsJson.items as any[]) {
// //             if (!Array.isArray(st.faceDescriptor)) continue

// //             const stBranchClass = (st.branchClass || "").toUpperCase().trim()
// //             const stBranch = (st.branch || "").toUpperCase().trim()

// //             const teacherHasRestriction = operatorRole === "Teacher" && !!operatorBranch
// //             if (teacherHasRestriction && !studentMatchesTeacherBranch(operatorBranch, stBranchClass, stBranch)) {
// //               continue
// //             }

// //             t.push({
// //               personId: st.id,
// //               personType: "student",
// //               vector: st.faceDescriptor,
// //               name: st.name || st.fullName || st.firstName || st.email || st.id,
// //               department: st.department,
// //               className: st.className || st.class || st.grade,
// //               shift: st.shift,
// //               branchClass: stBranchClass || undefined,
// //               branch: stBranch || undefined,
// //               location: st.location,
// //             })
// //           }
// //         }

// //         setTemplates(t)
// //         console.log("[v0] Templates loaded:", {
// //           total: t.length,
// //           restrictedByBranch: operatorRole === "Teacher",
// //           operatorBranch,
// //           teacherUnassigned,
// //         })
// //         logMsg(`Loaded ${t.length} face templates.`)
// //       } catch (e) {
// //         console.error(e)
// //         logMsg("Failed to load templates from API.")
// //       }
// //     }
// //     loadDescriptors()
// //   }, [])

// //   useEffect(() => {
// //     async function detectCameras() {
// //       try {
// //         const devices = await navigator.mediaDevices.enumerateDevices()
// //         const videoDevices = devices.filter((device) => device.kind === "videoinput")
// //         setAvailableCameras(videoDevices)
// //       } catch (error) {
// //         console.error("Error detecting cameras:", error)
// //       }
// //     }
// //     detectCameras()
// //   }, [])

// //   useEffect(() => {
// //     // Connect to real-time updates
// //     realtimeClient.connect()
// //     setIsConnected(true)
// //     console.log("[v0] Real-time client connected to faceid page")

// //     return () => {
// //       realtimeClient.disconnect()
// //       setIsConnected(false)
// //     }
// //   }, [])

// //   useEffect(() => {
// //     if (navigator.geolocation) {
// //       setLocationLoading(true)
// //       navigator.geolocation.getCurrentPosition(
// //         (position) => {
// //           setCurrentLocation({
// //             latitude: position.coords.latitude,
// //             longitude: position.coords.longitude,
// //           })
// //           setLocationLoading(false)
// //           logMsg(`Location captured: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
// //         },
// //         (error) => {
// //           setLocationError(error.message)
// //           setLocationLoading(false)
// //           logMsg(`Location error: ${error.message}`)
// //         },
// //       )
// //     } else {
// //       setLocationError("Geolocation not supported")
// //       logMsg("Geolocation not supported by browser")
// //     }
// //   }, [])

// //   useEffect(() => {
// //     let active = true
// //     async function startCamera() {
// //       try {
// //         const stream = await navigator.mediaDevices.getUserMedia({
// //           video: { facingMode },
// //           audio: false,
// //         })
// //         if (!active) return
// //         if (videoRef.current) {
// //           videoRef.current.srcObject = stream
// //           await videoRef.current.play()
// //           streamRef.current = stream
// //           setReady(true)
// //           if (videoRef.current.readyState >= 2) {
// //             syncCanvasSize()
// //           } else {
// //             videoRef.current.onloadedmetadata = () => {
// //               syncCanvasSize()
// //             }
// //           }
// //         }
// //       } catch (e) {
// //         console.error(e)
// //         alert("Camera access failed. Please allow camera permissions.")
// //       }
// //     }
// //     startCamera()
// //     return () => {
// //       active = false
// //       stopLoop()
// //       stopCamera()
// //     }
// //   }, [facingMode])

// //   function syncCanvasSize() {
// //     const v = videoRef.current
// //     const c = canvasRef.current
// //     if (!v || !c) return
// //     const w = v.videoWidth || v.clientWidth
// //     const h = v.videoHeight || v.clientHeight
// //     c.width = w
// //     c.height = h
// //   }

// //   function stopCamera() {
// //     streamRef.current?.getTracks().forEach((t) => t.stop())
// //     streamRef.current = null
// //     setReady(false)
// //   }

// //   function stopLoop() {
// //     if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
// //     rafRef.current = null
// //     setRunning(false)
// //     const ctx = canvasRef.current?.getContext("2d")
// //     if (ctx && canvasRef.current) {
// //       ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
// //     }
// //   }

// //   function cosineSimilarity(a: number[], b: number[]): number {
// //     if (a.length !== b.length) return -1

// //     let dotProduct = 0
// //     let normA = 0
// //     let normB = 0

// //     for (let i = 0; i < a.length; i++) {
// //       dotProduct += a[i] * b[i]
// //       normA += a[i] * a[i]
// //       normB += b[i] * b[i]
// //     }

// //     return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
// //   }

// //   function l2(a: number[], b: number[]) {
// //     if (a.length !== b.length) return Number.POSITIVE_INFINITY
// //     let s = 0
// //     for (let i = 0; i < a.length; i++) {
// //       const d = a[i] - b[i]
// //       s += d * d
// //     }
// //     return Math.sqrt(s)
// //   }

// //   function matchDescriptor(vec: number[]) {
// //     let bestIdx = -1
// //     let bestL2 = Number.POSITIVE_INFINITY
// //     let bestCosine = -1

// //     for (let i = 0; i < templates.length; i++) {
// //       const l2Dist = l2(vec, templates[i].vector)
// //       const cosineSim = cosineSimilarity(vec, templates[i].vector)

// //       if (l2Dist < bestL2 && cosineSim > bestCosine) {
// //         bestL2 = l2Dist
// //         bestCosine = cosineSim
// //         bestIdx = i
// //       }
// //     }

// //     return { idx: bestIdx, l2Dist: bestL2, cosineSim: bestCosine }
// //   }

// //   async function loop() {
// //     const v = videoRef.current
// //     const c = canvasRef.current
// //     if (!v || !c || !mpReady || !recogReady || !ready) {
// //       rafRef.current = requestAnimationFrame(loop)
// //       return
// //     }

// //     const now = performance.now()
// //     const minIntervalMs = 350
// //     if (now - lastDetectRef.current < minIntervalMs) {
// //       rafRef.current = requestAnimationFrame(loop)
// //       return
// //     }
// //     lastDetectRef.current = now

// //     const ctx = c.getContext("2d")
// //     if (!ctx) {
// //       rafRef.current = requestAnimationFrame(loop)
// //       return
// //     }
// //     ctx.clearRect(0, 0, c.width, c.height)

// //     const detector = mpDetectorRef.current
// //     let mpDetections: any[] = []
// //     try {
// //       const result = await detector?.detectForVideo(v, now)
// //       mpDetections = result?.detections ?? []
// //     } catch (e) {
// //       console.error("[v0] MediaPipe detection error", e)
// //       rafRef.current = requestAnimationFrame(loop)
// //       return
// //     }

// //     for (const det of mpDetections) {
// //       const bb = det.boundingBox
// //       const x = bb.originX
// //       const y = bb.originY
// //       const width = bb.width
// //       const height = bb.height

// //       const score = det.categories?.[0]?.score ?? 0.0
// //       const faceSize = Math.min(width, height)
// //       let qualityScore = 0
// //       if (faceSize >= 100) qualityScore += 0.4
// //       else if (faceSize >= 80) qualityScore += 0.3
// //       else if (faceSize >= 60) qualityScore += 0.2
// //       else qualityScore += 0.1
// //       qualityScore += Math.max(0, Math.min(score, 1)) * 0.6
// //       const faceQuality = Math.min(qualityScore, 1.0)

// //       const side = Math.max(width, height)
// //       const cx = x + width / 2
// //       const cy = y + height / 2
// //       const sx = Math.max(0, cx - side / 2)
// //       const sy = Math.max(0, cy - side / 2)
// //       const sw = Math.min(side, c.width - sx)
// //       const sh = Math.min(side, c.height - sy)

// //       if (faceQuality < 0.6) {
// //         ctx.strokeStyle = "rgba(251, 191, 36, 0.95)"
// //         ctx.lineWidth = 2
// //         ctx.strokeRect(sx, sy, sw, sh)
// //         const label = "Low Quality"
// //         ctx.fillStyle = "rgba(251, 191, 36, 0.95)"
// //         ctx.font = "12px sans-serif"
// //         const textW = ctx.measureText(label).width + 8
// //         ctx.fillRect(sx, sy - 20, textW, 18)
// //         ctx.fillStyle = "#fff"
// //         ctx.fillText(label, sx + 4, sy - 6)
// //         continue
// //       }

// //       const faceCanvas = document.createElement("canvas")
// //       faceCanvas.width = Math.max(1, Math.floor(sw))
// //       faceCanvas.height = Math.max(1, Math.floor(sh))
// //       const fctx = faceCanvas.getContext("2d")
// //       if (!fctx) continue
// //       fctx.drawImage(v, sx, sy, sw, sh, 0, 0, faceCanvas.width, faceCanvas.height)

// //       let vec: number[] | null = null
// //       try {
// //         const desc = (await (faceapi as any).computeFaceDescriptor(faceCanvas)) as Float32Array | number[]
// //         if (desc) vec = Array.from(desc as any)
// //       } catch (e) {
// //         console.error("[v0] Descriptor compute failed", e)
// //         vec = null
// //       }
// //       if (!vec || templates.length === 0) {
// //         ctx.strokeStyle = "rgba(239, 68, 68, 0.95)"
// //         ctx.lineWidth = 3
// //         ctx.strokeRect(sx, sy, sw, sh)
// //         continue
// //       }

// //       const { idx, l2Dist, cosineSim } = matchDescriptor(vec)

// //       const l2Threshold = 0.45
// //       const cosineThreshold = 0.65

// //       if (idx >= 0 && l2Dist < l2Threshold && cosineSim > cosineThreshold) {
// //         const t = templates[idx]
// //         ctx.strokeStyle = "rgba(34, 197, 94, 0.95)"
// //         ctx.lineWidth = 3
// //         ctx.strokeRect(sx, sy, sw, sh)

// //         const nowMs = Date.now()
// //         const cooldownMs = 60_000
// //         const last = recentlyMarkedRef.current.get(t.personId) || 0
// //         if (nowMs - last > cooldownMs) {
// //           recentlyMarkedRef.current.set(t.personId, nowMs)
// //           markAttendance(t, l2Dist, cosineSim, faceQuality).catch((err) => {
// //             console.error(err)
// //             logMsg(`Failed to mark attendance for ${t.name || t.personId}`)
// //           })
// //         }

// //         const label = `${t.name || t.personId} • L2:${l2Dist.toFixed(3)} • Cos:${cosineSim.toFixed(3)} • Q:${faceQuality.toFixed(2)}`
// //         ctx.fillStyle = "rgba(34, 197, 94, 0.95)"
// //         ctx.font = "12px sans-serif"
// //         const textW = ctx.measureText(label).width + 10
// //         ctx.fillRect(sx, sy - 22, textW, 20)
// //         ctx.fillStyle = "#fff"
// //         ctx.fillText(label, sx + 5, sy - 8)
// //       } else {
// //         ctx.strokeStyle = "rgba(239, 68, 68, 0.95)"
// //         ctx.lineWidth = 3
// //         ctx.strokeRect(sx, sy, sw, sh)

// //         const label = `Unknown • L2:${l2Dist.toFixed(3)} • Cos:${cosineSim.toFixed(3)}`
// //         ctx.fillStyle = "rgba(239, 68, 68, 0.95)"
// //         ctx.font = "12px sans-serif"
// //         const textW = ctx.measureText(label).width + 10
// //         ctx.fillRect(sx, sy - 22, textW, 20)
// //         ctx.fillStyle = "#fff"
// //         ctx.fillText(label, sx + 5, sy - 8)
// //       }
// //     }

// //     rafRef.current = requestAnimationFrame(loop)
// //   }

// //   async function ensureCamera() {
// //     if (ready && streamRef.current) return
// //     try {
// //       const stream = await navigator.mediaDevices.getUserMedia({
// //         video: { facingMode },
// //         audio: false,
// //       })
// //       if (videoRef.current) {
// //         videoRef.current.srcObject = stream
// //         await videoRef.current.play()
// //         streamRef.current = stream
// //         setReady(true)
// //         syncCanvasSize()
// //       }
// //     } catch (e) {
// //       console.error(e)
// //       alert("Camera access failed. Please allow camera permissions.")
// //     }
// //   }

// //   async function markAttendance(t: FaceTemplate, l2Distance: number, cosineSim: number, faceQuality: number) {
// //     logMsg(
// //       `Recognized ${t.personType} ${t.name || t.personId} (L2: ${l2Distance.toFixed(3)}, Cosine: ${cosineSim.toFixed(3)}, Quality: ${faceQuality.toFixed(2)}). Checking shift timing...`,
// //     )

// //     const u = getStoredUser()
// //     const operatorRole = u?.role
// //     const operatorBranchRaw =
// //       ((u as any)?.branchClass as string | undefined) || ((u as any)?.branch as string | undefined) || ""
// //     const operatorBranch = operatorBranchRaw ? operatorBranchRaw.toUpperCase().trim() : ""
// //     if (t.personType === "student" && operatorRole === "Teacher" && !operatorBranch) {
// //       logMsg(`Blocked: You are a Teacher without assigned branch/class. Cannot mark student attendance.`)
// //       speakAnnouncement(t.name || t.personId, "window_closed")
// //       return
// //     }

// //     if (t.personType === "student" && operatorRole === "Teacher" && operatorBranch) {
// //       const stBC = (t.branchClass || "").toUpperCase().trim()
// //       const stB = (t.branch || "").toUpperCase().trim()
// //       const matches = operatorBranch.includes("-")
// //         ? stBC === operatorBranch
// //         : stB === operatorBranch || stBC === operatorBranch || stBC.startsWith(operatorBranch + "-")
// //       if (!matches) {
// //         logMsg(`${t.name || t.personId} - Blocked: student not in your assigned branch/class (${operatorBranch}).`)
// //         console.log("[v0] Blocked markAttendance outside teacher branch", {
// //           operatorBranch,
// //           studentBranchClass: stBC,
// //           studentBranch: stB,
// //         })
// //         speakAnnouncement(t.name || t.personId, "window_closed")
// //         return
// //       }
// //     }

// //     if (t.location?.latitude && t.location?.longitude) {
// //       if (!currentLocation) {
// //         logMsg(`${t.name || t.personId} - Location required but not available. Please enable location.`)
// //         speakAnnouncement(t.name || t.personId, "window_closed")
// //         return
// //       }
// //     }

// //     if (!t.shift || !SHIFT_TIMINGS[t.shift as keyof typeof SHIFT_TIMINGS]) {
// //       logMsg(`No valid shift found for ${t.name || t.personId}`)
// //       return
// //     }

// //     const shiftKey = t.shift as keyof typeof SHIFT_TIMINGS
// //     const status: "present" | "late" | "absent" | "already_recorded" | "early" | "window_closed" =
// //       getAttendanceStatus(shiftKey)

// //     if (status === "early") {
// //       const countdown = getCountdownToShift(shiftKey)
// //       logMsg(`${t.name || t.personId} - Early arrival. Please wait for shift time.`)
// //       speakAnnouncement(t.name || t.personId, "early", countdown)
// //       return
// //     }

// //     if (status === "window_closed") {
// //       logMsg(`${t.name || t.personId} - Attendance window closed for ${t.shift} shift`)
// //       speakAnnouncement(t.name || t.personId, "window_closed")
// //       return
// //     }

// //     let delayInfo = null
// //     if (status === "late") {
// //       delayInfo = getDelayTime(shiftKey)
// //     }

// //     logMsg(
// //       `Shift: ${t.shift}, Status: ${status}${delayInfo ? `, Delay: ${delayInfo.hours}h ${delayInfo.minutes}m` : ""}`,
// //     )

// //     const response = await fetch("/api/attendance", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         personId: t.personId,
// //         personType: t.personType,
// //         status: status === "early" || status === "window_closed" ? "present" : status,
// //         delayInfo,
// //         currentLocation: currentLocation || undefined,
// //         operator: {
// //           role: operatorRole,
// //           branch: operatorBranch || undefined,
// //         },
// //       }),
// //     })

// //     const result = await response.json()

// //     if (result.error === "LOCATION_REQUIRED" || result.error === "LOCATION_MISMATCH") {
// //       logMsg(`${t.name || t.personId} - ${result.message}`)
// //       speakAnnouncement(t.name || t.personId, "window_closed")
// //       return
// //     }

// //     if (result.alreadyMarked) {
// //       logMsg(`${t.name || t.personId} - Attendance already recorded for today`)
// //       speakAnnouncement(t.name || t.personId, "already_recorded")
// //       return
// //     }

// //     const nowStr = new Date().toLocaleString()
// //     const eventData = {
// //       personId: t.personId,
// //       personType: t.personType,
// //       name: t.name || t.personId,
// //       time: nowStr,
// //       distance: l2Distance,
// //       department: t.department,
// //       role: t.role,
// //       shift: t.shift,
// //       className: t.className,
// //       status: status as "present" | "late" | "absent" | "already_recorded" | "early" | "window_closed",
// //       delayInfo,
// //     }

// //     setEvents((prev) => [eventData, ...prev])

// //     if (isConnected) {
// //       await realtimeClient.emitToServer("attendance_update", {
// //         type: "attendance_marked",
// //         personId: t.personId,
// //         personType: t.personType,
// //         personName: t.name || t.personId,
// //         status: status === "early" || status === "window_closed" ? "present" : status,
// //         timestamp: new Date().toISOString(),
// //         department: t.department,
// //         role: t.role,
// //         shift: t.shift,
// //         className: t.className,
// //         delayInfo,
// //         source: "face-recognition",
// //         message: `${t.name || t.personId} marked as ${status.toUpperCase()} via Face Recognition`,
// //       })
// //       setRealtimeUpdates((prev) => prev + 1)
// //       logMsg(`Real-time update sent for ${t.name || t.personId}`)
// //     }

// //     logMsg("Attendance marked successfully.")

// //     speakAnnouncement(t.name || t.personId, status as any, delayInfo)
// //   }

// //   function speakAnnouncement(
// //     name: string,
// //     status: "present" | "late" | "absent" | "already_recorded" | "early" | "window_closed",
// //     extra?: any,
// //   ) {
// //     if ("speechSynthesis" in window) {
// //       let message: string

// //       switch (status) {
// //         case "already_recorded":
// //           message = `${name}, already today your attendance is recorded`
// //           break
// //         case "late":
// //           if (extra && extra.hours > 0) {
// //             message = `${name}, you are ${extra.hours} hour${extra.hours > 1 ? "s" : ""} ${extra.minutes} minute${extra.minutes !== 1 ? "s" : ""} late, attendance recorded`
// //           } else if (extra && extra.minutes > 0) {
// //             message = `${name}, you are ${extra.minutes} minute${extra.minutes !== 1 ? "s" : ""} late, attendance recorded`
// //           } else {
// //             message = `${name}, you are late, attendance recorded`
// //           }
// //           break
// //         case "early":
// //           message = `${name}, please wait for your shift time${extra ? `. Wait for ${extra}` : ""}`
// //           break
// //         case "window_closed":
// //           message = `${name}, attendance window is closed for your shift`
// //           break
// //         default:
// //           message = `${name}, today your attendance is recorded`
// //       }

// //       const utterance = new SpeechSynthesisUtterance(message)
// //       utterance.rate = 0.9
// //       utterance.pitch = 1.0
// //       utterance.volume = 0.8
// //       speechSynthesis.speak(utterance)
// //     }
// //   }

// //   async function startRecognizeLoop() {
// //     if (!modelsReady) {
// //       logMsg("Models are still loading...")
// //       return
// //     }
// //     await ensureCamera()
// //     if (running) return
// //     setRunning(true)
// //     syncCanvasSize()
// //     rafRef.current = requestAnimationFrame(loop)
// //     logMsg("Auto recognition started.")
// //   }

// //   function handleStop() {
// //     stopLoop()
// //     stopCamera()
// //     logMsg("Camera stopped.")
// //   }

// //   const switchCamera = () => {
// //     const newFacingMode = facingMode === "user" ? "environment" : "user"
// //     setFacingMode(newFacingMode)
// //     logMsg(`Switching to ${newFacingMode === "user" ? "front" : "back"} camera...`)
// //   }

// //   return (
// //     <div className="min-h-screen space-y-4 p-4 md:space-y-6 md:p-6">
// //       <header className="space-y-1">
// //         <div className="flex items-center gap-3">
// //           <h1 className="text-balance text-xl font-semibold md:text-2xl">Face ID Recognition</h1>
// //           <div className="flex items-center gap-2">
// //             {isConnected ? (
// //               <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
// //                 <Wifi className="h-3 w-3" />
// //                 Live
// //               </div>
// //             ) : (
// //               <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
// //                 <WifiOff className="h-3 w-3" />
// //                 Offline
// //               </div>
// //             )}
// //             {currentLocation ? (
// //               <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
// //                 <MapPin className="h-3 w-3" />
// //                 Location OK
// //               </div>
// //             ) : locationLoading ? (
// //               <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
// //                 <MapPin className="h-3 w-3" />
// //                 Getting location...
// //               </div>
// //             ) : (
// //               <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
// //                 <MapPin className="h-3 w-3" />
// //                 No location
// //               </div>
// //             )}
// //             {realtimeUpdates > 0 && (
// //               <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
// //                 {realtimeUpdates} sent
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //         <p className="text-xs text-gray-600 md:text-sm">
// //           Auto recognition using MediaPipe for detection and face-api.js for descriptors. Click Recognize &amp; Mark
// //           once to start; Stop Camera to end. Enrollment not required.
// //           {isConnected && " Real-time updates to attendance page enabled."}
// //           {locationError && (
// //             <span className="text-red-600"> Location access denied - attendance may be restricted for some users.</span>
// //           )}
// //         </p>
// //       </header>

// //       <Card>
// //         <CardHeader className="pb-3">
// //           <CardTitle className="text-lg md:text-xl">Live Camera</CardTitle>
// //         </CardHeader>
// //         <CardContent className="space-y-4">
// //           <div className="relative w-full max-w-full overflow-hidden rounded border bg-black">
// //             <video
// //               ref={videoRef}
// //               className="w-full h-auto max-h-[70vh] object-cover"
// //               playsInline
// //               muted
// //               autoPlay
// //               style={{ aspectRatio: "auto" }}
// //             />
// //             <canvas
// //               ref={canvasRef}
// //               className="pointer-events-none absolute inset-0 w-full h-full"
// //               style={{
// //                 width: "100%",
// //                 height: "100%",
// //                 objectFit: "cover",
// //               }}
// //               aria-hidden="true"
// //             />
// //           </div>

// //           <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
// //             <Button
// //               disabled={!modelsReady}
// //               onClick={startRecognizeLoop}
// //               className="w-full bg-teal-600 text-white hover:bg-teal-700 sm:w-auto sm:flex-1 md:flex-none"
// //               size="sm"
// //             >
// //               <span className="hidden sm:inline">Recognize &amp; Mark</span>
// //               <span className="sm:hidden">Start Recognition</span>
// //             </Button>
// //             <Button
// //               variant="secondary"
// //               onClick={handleStop}
// //               disabled={!ready && !running}
// //               className="w-full sm:w-auto sm:flex-1 md:flex-none"
// //               size="sm"
// //             >
// //               <span className="hidden sm:inline">Stop Camera</span>
// //               <span className="sm:hidden">Stop</span>
// //             </Button>
// //             {availableCameras.length > 1 && (
// //               <Button
// //                 variant="outline"
// //                 onClick={switchCamera}
// //                 disabled={running}
// //                 className="w-full bg-transparent sm:w-auto md:w-auto"
// //                 size="sm"
// //               >
// //                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
// //                   />
// //                 </svg>
// //                 <span className="ml-2 hidden sm:inline">
// //                   {facingMode === "user" ? "Switch to Back" : "Switch to Front"}
// //                 </span>
// //                 <span className="ml-2 sm:hidden">{facingMode === "user" ? "Back Cam" : "Front Cam"}</span>
// //               </Button>
// //             )}
// //           </div>

// //           <div className="rounded border bg-gray-50 p-3 text-xs text-gray-700">
// //             <div className="break-words text-xs sm:text-sm">
// //               Status: camera {ready ? "ready" : "not ready"} • Models {modelsReady ? "ready" : "loading"} • Templates{" "}
// //               {templates.length} • Loop {running ? "running" : "stopped"}
// //               <br className="sm:hidden" />
// //               <span className="hidden sm:inline"> • </span>Camera: {facingMode === "user" ? "Front" : "Back"}
// //               <br className="sm:hidden" />
// //               <span className="hidden sm:inline"> • </span>Real-time {isConnected ? "connected" : "disconnected"}
// //               {realtimeUpdates > 0 && (
// //                 <>
// //                   <br className="sm:hidden" />
// //                   <span className="hidden sm:inline"> • </span>
// //                   {realtimeUpdates} updates sent
// //                 </>
// //               )}
// //             </div>
// //             <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
// //               {log.map((l, i) => (
// //                 <li key={i} className="break-words">
// //                   {l}
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       <Card>
// //         <CardHeader className="pb-3">
// //           <CardTitle className="text-lg md:text-xl">Recognition Status</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           {events.length === 0 ? (
// //             <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center text-gray-500">
// //               <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
// //                 <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
// //                   />
// //                 </svg>
// //               </div>
// //               <p className="text-sm">No recognized records yet.</p>
// //               <p className="text-xs text-gray-400 mt-1">Start recognition to see attendance records here</p>
// //             </div>
// //           ) : (
// //             <>
// //               <div className="hidden overflow-x-auto lg:block">
// //                 <table className="min-w-full text-sm">
// //                   <thead>
// //                     <tr className="border-b bg-gray-50 text-left">
// //                       <th className="p-2">Time</th>
// //                       <th className="p-2">ID</th>
// //                       <th className="p-2">Name</th>
// //                       <th className="p-2">Type</th>
// //                       <th className="p-2">Dept</th>
// //                       <th className="p-2">Role</th>
// //                       <th className="p-2">Shift</th>
// //                       <th className="p-2">Class</th>
// //                       <th className="p-2">Match</th>
// //                       <th className="p-2">Status</th>
// //                       <th className="p-2">Delay</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {events.map((e, idx) => (
// //                       <tr key={idx} className="border-b">
// //                         <td className="p-2">{e.time}</td>
// //                         <td className="p-2">{e.personId}</td>
// //                         <td className="p-2">{e.name}</td>
// //                         <td className="p-2">{e.personType}</td>
// //                         <td className="p-2">{e.department || "-"}</td>
// //                         <td className="p-2">{e.role || "-"}</td>
// //                         <td className="p-2">{e.shift || "-"}</td>
// //                         <td className="p-2">{e.className || "-"}</td>
// //                         <td className="p-2">{e.distance.toFixed(3)}</td>
// //                         <td className="p-2">{e.status}</td>
// //                         <td className="p-2">{e.delayInfo ? `${e.delayInfo.hours}h ${e.delayInfo.minutes}m` : "-"}</td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>

// //               <div className="space-y-3 lg:hidden">
// //                 {events.map((e, idx) => (
// //                   <div key={idx} className="rounded-lg border bg-white p-4 shadow-sm">
// //                     <div className="mb-3 flex items-start justify-between">
// //                       <div>
// //                         <h3 className="font-medium text-gray-900">{e.name}</h3>
// //                         <p className="text-sm text-gray-500">
// //                           {e.personId} • {e.personType}
// //                         </p>
// //                       </div>
// //                       <div className="text-right">
// //                         <span
// //                           className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
// //                             e.status === "present"
// //                               ? "bg-green-100 text-green-800"
// //                               : e.status === "late"
// //                                 ? "bg-yellow-100 text-yellow-800"
// //                                 : e.status === "already_recorded"
// //                                   ? "bg-blue-100 text-blue-800"
// //                                   : "bg-red-100 text-red-800"
// //                           }`}
// //                         >
// //                           {e.status}
// //                         </span>
// //                       </div>
// //                     </div>

// //                     <div className="grid grid-cols-2 gap-2 text-sm">
// //                       <div>
// //                         <span className="text-gray-500">Time:</span>
// //                         <p className="font-medium">{e.time}</p>
// //                       </div>
// //                       {e.department && (
// //                         <div>
// //                           <span className="text-gray-500">Department:</span>
// //                           <p className="font-medium">{e.department}</p>
// //                         </div>
// //                       )}
// //                       {e.role && (
// //                         <div>
// //                           <span className="text-gray-500">Role:</span>
// //                           <p className="font-medium">{e.role}</p>
// //                         </div>
// //                       )}
// //                       {e.shift && (
// //                         <div>
// //                           <span className="text-gray-500">Shift:</span>
// //                           <p className="font-medium">{e.shift}</p>
// //                         </div>
// //                       )}
// //                       {e.className && (
// //                         <div>
// //                           <span className="text-gray-500">Class:</span>
// //                           <p className="font-medium">{e.className}</p>
// //                         </div>
// //                       )}
// //                       <div>
// //                         <span className="text-gray-500">Match Score:</span>
// //                         <p className="font-medium">{e.distance.toFixed(3)}</p>
// //                       </div>
// //                       {e.delayInfo && (
// //                         <div>
// //                           <span className="text-gray-500">Delay:</span>
// //                           <p className="font-medium">
// //                             {e.delayInfo.hours}h {e.delayInfo.minutes}m
// //                           </p>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </>
// //           )}
// //         </CardContent>
// //       </Card>
// //     </div>
// //   )
// // }




// "use client"

// import { useEffect, useRef, useState } from "react"
// import * as faceapi from "face-api.js"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { SHIFT_TIMINGS, getAttendanceStatus, getCountdownToShift, getDelayTime } from "@/lib/constants"
// import { realtimeClient } from "@/lib/realtime-client"
// import { Wifi, WifiOff, MapPin } from "lucide-react"
// import { getStoredUser } from "@/lib/auth" // import user helper
// import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision"
// import { useRouter } from "next/navigation" // router for redirect
// import { useToast } from "@/hooks/use-toast"

// type PersonType = "staff" | "student"

// type FaceTemplate = {
//   personId: string
//   personType: PersonType
//   vector: number[] // 128-d face descriptor
//   name?: string
//   department?: string
//   role?: string
//   shift?: string
//   className?: string
//   branchClass?: string
//   branch?: string
//   location?: {
//     latitude: number
//     longitude: number
//     address?: string
//   }
// }

// type RecognizedEvent = {
//   personId: string
//   personType: PersonType
//   name: string
//   time: string
//   distance: number
//   department?: string
//   role?: string
//   shift?: string
//   className?: string
//   status: "present" | "late" | "absent" | "already_recorded" | "early" | "window_closed"
//   delayInfo?: { hours: number; minutes: number }
// }

// export default function FaceIDPage() {
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const streamRef = useRef<MediaStream | null>(null)
//   const rafRef = useRef<number | null>(null)
//   const lastDetectRef = useRef<number>(0)
//   const recentlyMarkedRef = useRef<Map<string, number>>(new Map()) // personId -> ts

//   const [ready, setReady] = useState(false)
//   const [modelsReady, setModelsReady] = useState(false)
//   const [running, setRunning] = useState(false)
//   const [templates, setTemplates] = useState<FaceTemplate[]>([])
//   const [log, setLog] = useState<string[]>([])
//   const [events, setEvents] = useState<RecognizedEvent[]>([])
//   const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
//   const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
//   const [isConnected, setIsConnected] = useState(false)
//   const [realtimeUpdates, setRealtimeUpdates] = useState(0)
//   const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null)
//   const [locationError, setLocationError] = useState<string | null>(null)
//   const [locationLoading, setLocationLoading] = useState(false)

//   const mpDetectorRef = useRef<FaceDetector | null>(null)
//   const [mpReady, setMpReady] = useState(false)
//   const [recogReady, setRecogReady] = useState(false)

//   const router = useRouter() // router for redirect
//   const { toast } = useToast()

//   function logMsg(msg: string) {
//     setLog((prev) => [msg, ...prev].slice(0, 8))
//   }

//   useEffect(() => {
//     const u = getStoredUser()
//     if (u?.role === "Student") {
//       router.replace("/") // redirect students away from Face ID
//     }
//   }, [router])

//   useEffect(() => {
//     let cancelled = false
//     async function loadModels() {
//       try {
//         // const MODEL_URL = "/models"

//         const MODEL_URL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

//         const recogPromise = (async () => {
//           await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
//           if (!cancelled) setRecogReady(true)
//         })()

//         const mpPromise = (async () => {
//           const resolver = await FilesetResolver.forVisionTasks(
//             "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
//           )
//           const detector = await FaceDetector.createFromOptions(resolver, {
//             baseOptions: {
//               modelAssetPath:
//                  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
//             },
//             runningMode: "VIDEO",
//           })
//           if (!cancelled) {
//             mpDetectorRef.current = detector
//             setMpReady(true)
//           }
//         })()

//         await Promise.all([recogPromise, mpPromise])
//         if (!cancelled) setModelsReady(true)
//       } catch (err) {
//         console.error(err)
//         alert("Failed to load models. Ensure /public/models exists for face-api recognition net.")
//       }
//     }
//     loadModels()
//     return () => {
//       cancelled = true
//     }
//   }, [])

//   useEffect(() => {
//     async function loadDescriptors() {
//       try {
//         const u = getStoredUser()
//         const instParam =
//           u?.institutionName && u?.role !== "SuperAdmin"
//             ? `?institutionName=${encodeURIComponent(u.institutionName)}`
//             : ""
//         const [staffRes, studentsRes] = await Promise.all([
//           fetch(`/api/staff${instParam}`),
//           fetch(`/api/students${instParam}`),
//         ])
//         const staffJson = await staffRes.json()
//         const studentsJson = await studentsRes.json()

//         const operatorRole = u?.role
//         const operatorBranchRaw =
//           ((u as any)?.branchClass as string | undefined) || ((u as any)?.branch as string | undefined) || ""
//         const operatorBranch = operatorBranchRaw ? operatorBranchRaw.toUpperCase().trim() : ""
//         const teacherUnassigned = operatorRole === "Teacher" && !operatorBranch

//         function studentMatchesTeacherBranch(op: string, stBC?: string, stB?: string) {
//           if (!op) return false
//           const studentBC = (stBC || "").toUpperCase().trim()
//           const studentB = (stB || "").toUpperCase().trim()
//           if (op.includes("-")) {
//             return studentBC === op
//           }
//           return studentB === op || studentBC === op || studentBC.startsWith(op + "-")
//         }

//         const t: FaceTemplate[] = []

//         for (const s of staffJson.items as any[]) {
//           if (Array.isArray(s.faceDescriptor)) {
//             t.push({
//               personId: s.id,
//               personType: "staff",
//               vector: s.faceDescriptor,
//               name: s.name || s.fullName || s.firstName || s.email || s.id,
//               department: s.department,
//               role: s.role,
//               shift: s.shift,
//               location: s.location,
//             })
//           }
//         }

//         if (!teacherUnassigned) {
//           for (const st of studentsJson.items as any[]) {
//             if (!Array.isArray(st.faceDescriptor)) continue

//             const stBranchClass = (st.branchClass || "").toUpperCase().trim()
//             const stBranch = (st.branch || "").toUpperCase().trim()

//             const teacherHasRestriction = operatorRole === "Teacher" && !!operatorBranch
//             if (teacherHasRestriction && !studentMatchesTeacherBranch(operatorBranch, stBranchClass, stBranch)) {
//               continue
//             }

//             t.push({
//               personId: st.id,
//               personType: "student",
//               vector: st.faceDescriptor,
//               name: st.name || st.fullName || st.firstName || st.email || st.id,
//               department: st.department,
//               className: st.className || st.class || st.grade,
//               shift: st.shift,
//               branchClass: stBranchClass || undefined,
//               branch: stBranch || undefined,
//               location: st.location,
//             })
//           }
//         }

//         setTemplates(t)
//         console.log("[v0] Templates loaded:", {
//           total: t.length,
//           restrictedByBranch: operatorRole === "Teacher",
//           operatorBranch,
//           teacherUnassigned,
//         })
//         logMsg(`Loaded ${t.length} face templates.`)
//       } catch (e) {
//         console.error(e)
//         logMsg("Failed to load templates from API.")
//       }
//     }
//     loadDescriptors()
//   }, [])

//   useEffect(() => {
//     async function detectCameras() {
//       try {
//         const devices = await navigator.mediaDevices.enumerateDevices()
//         const videoDevices = devices.filter((device) => device.kind === "videoinput")
//         setAvailableCameras(videoDevices)
//       } catch (error) {
//         console.error("Error detecting cameras:", error)
//       }
//     }
//     detectCameras()
//   }, [])

//   useEffect(() => {
//     // Connect to real-time updates
//     realtimeClient.connect()
//     setIsConnected(true)
//     console.log("[v0] Real-time client connected to faceid page")

//     return () => {
//       realtimeClient.disconnect()
//       setIsConnected(false)
//     }
//   }, [])

//   useEffect(() => {
//     if (navigator.geolocation) {
//       setLocationLoading(true)
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           })
//           setLocationLoading(false)
//           logMsg(`Location captured: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
//         },
//         (error) => {
//           setLocationError(error.message)
//           setLocationLoading(false)
//           logMsg(`Location error: ${error.message}`)
//         },
//       )
//     } else {
//       setLocationError("Geolocation not supported")
//       logMsg("Geolocation not supported by browser")
//     }
//   }, [])

//   useEffect(() => {
//     let active = true
//     async function startCamera() {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode },
//           audio: false,
//         })
//         if (!active) return
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream
//           await videoRef.current.play()
//           streamRef.current = stream
//           setReady(true)
//           if (videoRef.current.readyState >= 2) {
//             syncCanvasSize()
//           } else {
//             videoRef.current.onloadedmetadata = () => {
//               syncCanvasSize()
//             }
//           }
//         }
//       } catch (e) {
//         console.error(e)
//         alert("Camera access failed. Please allow camera permissions.")
//       }
//     }
//     startCamera()
//     return () => {
//       active = false
//       stopLoop()
//       stopCamera()
//     }
//   }, [facingMode])

//   function syncCanvasSize() {
//     const v = videoRef.current
//     const c = canvasRef.current
//     if (!v || !c) return
//     const w = v.videoWidth || v.clientWidth
//     const h = v.videoHeight || v.clientHeight
//     c.width = w
//     c.height = h
//   }

//   function stopCamera() {
//     streamRef.current?.getTracks().forEach((t) => t.stop())
//     streamRef.current = null
//     setReady(false)
//   }

//   function stopLoop() {
//     if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
//     rafRef.current = null
//     setRunning(false)
//     const ctx = canvasRef.current?.getContext("2d")
//     if (ctx && canvasRef.current) {
//       ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
//     }
//   }

//   function cosineSimilarity(a: number[], b: number[]): number {
//     if (a.length !== b.length) return -1

//     let dotProduct = 0
//     let normA = 0
//     let normB = 0

//     for (let i = 0; i < a.length; i++) {
//       dotProduct += a[i] * b[i]
//       normA += a[i] * a[i]
//       normB += b[i] * b[i]
//     }

//     return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
//   }

//   function l2(a: number[], b: number[]) {
//     if (a.length !== b.length) return Number.POSITIVE_INFINITY
//     let s = 0
//     for (let i = 0; i < a.length; i++) {
//       const d = a[i] - b[i]
//       s += d * d
//     }
//     return Math.sqrt(s)
//   }

//   function matchDescriptor(vec: number[]) {
//     let bestIdx = -1
//     let bestL2 = Number.POSITIVE_INFINITY
//     let bestCosine = -1

//     for (let i = 0; i < templates.length; i++) {
//       const l2Dist = l2(vec, templates[i].vector)
//       const cosineSim = cosineSimilarity(vec, templates[i].vector)

//       if (l2Dist < bestL2 && cosineSim > bestCosine) {
//         bestL2 = l2Dist
//         bestCosine = cosineSim
//         bestIdx = i
//       }
//     }

//     return { idx: bestIdx, l2Dist: bestL2, cosineSim: bestCosine }
//   }

//   async function loop() {
//     const v = videoRef.current
//     const c = canvasRef.current
//     if (!v || !c || !mpReady || !recogReady || !ready) {
//       rafRef.current = requestAnimationFrame(loop)
//       return
//     }

//     const now = performance.now()
//     const minIntervalMs = 350
//     if (now - lastDetectRef.current < minIntervalMs) {
//       rafRef.current = requestAnimationFrame(loop)
//       return
//     }
//     lastDetectRef.current = now

//     const ctx = c.getContext("2d")
//     if (!ctx) {
//       rafRef.current = requestAnimationFrame(loop)
//       return
//     }
//     ctx.clearRect(0, 0, c.width, c.height)

//     const detector = mpDetectorRef.current
//     let mpDetections: any[] = []
//     try {
//       const result = await detector?.detectForVideo(v, now)
//       mpDetections = result?.detections ?? []
//     } catch (e) {
//       console.error("[v0] MediaPipe detection error", e)
//       rafRef.current = requestAnimationFrame(loop)
//       return
//     }

//     for (const det of mpDetections) {
//       const bb = det.boundingBox
//       const x = bb.originX
//       const y = bb.originY
//       const width = bb.width
//       const height = bb.height

//       const score = det.categories?.[0]?.score ?? 0.0
//       const faceSize = Math.min(width, height)
//       let qualityScore = 0
//       if (faceSize >= 100) qualityScore += 0.4
//       else if (faceSize >= 80) qualityScore += 0.3
//       else if (faceSize >= 60) qualityScore += 0.2
//       else qualityScore += 0.1
//       qualityScore += Math.max(0, Math.min(score, 1)) * 0.6
//       const faceQuality = Math.min(qualityScore, 1.0)

//       const side = Math.max(width, height)
//       const cx = x + width / 2
//       const cy = y + height / 2
//       const sx = Math.max(0, cx - side / 2)
//       const sy = Math.max(0, cy - side / 2)
//       const sw = Math.min(side, c.width - sx)
//       const sh = Math.min(side, c.height - sy)

//       if (faceQuality < 0.6) {
//         ctx.strokeStyle = "rgba(251, 191, 36, 0.95)"
//         ctx.lineWidth = 2
//         ctx.strokeRect(sx, sy, sw, sh)
//         const label = "Low Quality"
//         ctx.fillStyle = "rgba(251, 191, 36, 0.95)"
//         ctx.font = "12px sans-serif"
//         const textW = ctx.measureText(label).width + 8
//         ctx.fillRect(sx, sy - 20, textW, 18)
//         ctx.fillStyle = "#fff"
//         ctx.fillText(label, sx + 4, sy - 6)
//         continue
//       }

//       const faceCanvas = document.createElement("canvas")
//       faceCanvas.width = Math.max(1, Math.floor(sw))
//       faceCanvas.height = Math.max(1, Math.floor(sh))
//       const fctx = faceCanvas.getContext("2d")
//       if (!fctx) continue
//       fctx.drawImage(v, sx, sy, sw, sh, 0, 0, faceCanvas.width, faceCanvas.height)

//       let vec: number[] | null = null
//       try {
//         const desc = (await (faceapi as any).computeFaceDescriptor(faceCanvas)) as Float32Array | number[]
//         if (desc) vec = Array.from(desc as any)
//       } catch (e) {
//         console.error("[v0] Descriptor compute failed", e)
//         vec = null
//       }
//       if (!vec || templates.length === 0) {
//         ctx.strokeStyle = "rgba(239, 68, 68, 0.95)"
//         ctx.lineWidth = 3
//         ctx.strokeRect(sx, sy, sw, sh)
//         continue
//       }

//       const { idx, l2Dist, cosineSim } = matchDescriptor(vec)

//       const l2Threshold = 0.45
//       const cosineThreshold = 0.65

//       if (idx >= 0 && l2Dist < l2Threshold && cosineSim > cosineThreshold) {
//         const t = templates[idx]
//         ctx.strokeStyle = "rgba(34, 197, 94, 0.95)"
//         ctx.lineWidth = 3
//         ctx.strokeRect(sx, sy, sw, sh)

//         const nowMs = Date.now()
//         const cooldownMs = 60_000
//         const last = recentlyMarkedRef.current.get(t.personId) || 0
//         if (nowMs - last > cooldownMs) {
//           recentlyMarkedRef.current.set(t.personId, nowMs)
//           markAttendance(t, l2Dist, cosineSim, faceQuality).catch((err) => {
//             console.error(err)
//             logMsg(`Failed to mark attendance for ${t.name || t.personId}`)
//           })
//         }

//         const label = `${t.name || t.personId} • L2:${l2Dist.toFixed(3)} • Cos:${cosineSim.toFixed(3)} • Q:${faceQuality.toFixed(2)}`
//         ctx.fillStyle = "rgba(34, 197, 94, 0.95)"
//         ctx.font = "12px sans-serif"
//         const textW = ctx.measureText(label).width + 10
//         ctx.fillRect(sx, sy - 22, textW, 20)
//         ctx.fillStyle = "#fff"
//         ctx.fillText(label, sx + 5, sy - 8)
//       } else {
//         ctx.strokeStyle = "rgba(239, 68, 68, 0.95)"
//         ctx.lineWidth = 3
//         ctx.strokeRect(sx, sy, sw, sh)

//         const label = `Unknown • L2:${l2Dist.toFixed(3)} • Cos:${cosineSim.toFixed(3)}`
//         ctx.fillStyle = "rgba(239, 68, 68, 0.95)"
//         ctx.font = "12px sans-serif"
//         const textW = ctx.measureText(label).width + 10
//         ctx.fillRect(sx, sy - 22, textW, 20)
//         ctx.fillStyle = "#fff"
//         ctx.fillText(label, sx + 5, sy - 8)
//       }
//     }

//     rafRef.current = requestAnimationFrame(loop)
//   }

//   async function ensureCamera() {
//     if (ready && streamRef.current) return
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode },
//         audio: false,
//       })
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//         await videoRef.current.play()
//         streamRef.current = stream
//         setReady(true)
//         syncCanvasSize()
//       }
//     } catch (e) {
//       console.error(e)
//       alert("Camera access failed. Please allow camera permissions.")
//     }
//   }

//   async function markAttendance(t: FaceTemplate, l2Distance: number, cosineSim: number, faceQuality: number) {
//     logMsg(
//       `Recognized ${t.personType} ${t.name || t.personId} (L2: ${l2Distance.toFixed(3)}, Cosine: ${cosineSim.toFixed(3)}, Quality: ${faceQuality.toFixed(2)}). Checking shift timing...`,
//     )

//     const u = getStoredUser()
//     const operatorRole = u?.role
//     const operatorBranchRaw =
//       ((u as any)?.branchClass as string | undefined) || ((u as any)?.branch as string | undefined) || ""
//     const operatorBranch = operatorBranchRaw ? operatorBranchRaw.toUpperCase().trim() : ""
//     if (t.personType === "student" && operatorRole === "Teacher" && !operatorBranch) {
//       logMsg(`Blocked: You are a Teacher without assigned branch/class. Cannot mark student attendance.`)
//       speakAnnouncement(t.name || t.personId, "window_closed")
//       return
//     }

//     if (t.personType === "student" && operatorRole === "Teacher" && operatorBranch) {
//       const stBC = (t.branchClass || "").toUpperCase().trim()
//       const stB = (t.branch || "").toUpperCase().trim()
//       const matches = operatorBranch.includes("-")
//         ? stBC === operatorBranch
//         : stB === operatorBranch || stBC === operatorBranch || stBC.startsWith(operatorBranch + "-")
//       if (!matches) {
//         logMsg(`${t.name || t.personId} - Blocked: student not in your assigned branch/class (${operatorBranch}).`)
//         console.log("[v0] Blocked markAttendance outside teacher branch", {
//           operatorBranch,
//           studentBranchClass: stBC,
//           studentBranch: stB,
//         })
//         speakAnnouncement(t.name || t.personId, "window_closed")
//         return
//       }
//     }

//     if (t.location?.latitude && t.location?.longitude) {
//       if (!currentLocation) {
//         logMsg(`${t.name || t.personId} - Location required but not available. Please enable location.`)
//         speakAnnouncement(t.name || t.personId, "window_closed")
//         return
//       }
//     }

//     if (!t.shift || !SHIFT_TIMINGS[t.shift as keyof typeof SHIFT_TIMINGS]) {
//       logMsg(`No valid shift found for ${t.name || t.personId}`)
//       return
//     }

//     const shiftKey = t.shift as keyof typeof SHIFT_TIMINGS
//     const status: "present" | "late" | "absent" | "already_recorded" | "early" | "window_closed" =
//       getAttendanceStatus(shiftKey)

//     if (status === "early") {
//       const countdown = getCountdownToShift(shiftKey)
//       logMsg(`${t.name || t.personId} - Early arrival. Please wait for shift time.`)
//       speakAnnouncement(t.name || t.personId, "early", countdown)
//       return
//     }

//     if (status === "window_closed") {
//       logMsg(`${t.name || t.personId} - Attendance window closed for ${t.shift} shift`)
//       speakAnnouncement(t.name || t.personId, "window_closed")
//       return
//     }

//     let delayInfo = null
//     if (status === "late") {
//       delayInfo = getDelayTime(shiftKey)
//     }

//     logMsg(
//       `Shift: ${t.shift}, Status: ${status}${delayInfo ? `, Delay: ${delayInfo.hours}h ${delayInfo.minutes}m` : ""}`,
//     )

//     const response = await fetch("/api/attendance", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         personId: t.personId,
//         personType: t.personType,
//         status: status === "early" || status === "window_closed" ? "present" : status,
//         delayInfo,
//         currentLocation: currentLocation || undefined,
//         operator: {
//           role: operatorRole,
//           branch: operatorBranch || undefined,
//         },
//       }),
//     })

//     const result = await response.json()

//     if (result.error === "LOCATION_REQUIRED") {
//       const locationName =
//         t.location?.address || `${t.location?.latitude.toFixed(4)}, ${t.location?.longitude.toFixed(4)}`
//       logMsg(`${t.name || t.personId} - ${result.message}`)
//       toast({
//         title: `${t.name || t.personId} - Location Required`,
//         description: `Assigned location: ${locationName}. Please enable location services to mark attendance.`,
//         variant: "destructive",
//       })
//       speakAnnouncement(t.name || t.personId, "window_closed")
//       return
//     }

//     if (result.error === "LOCATION_MISMATCH") {
//       const locationName =
//         t.location?.address || `${t.location?.latitude.toFixed(4)}, ${t.location?.longitude.toFixed(4)}`
//       logMsg(`${t.name || t.personId} - ${result.message}`)
//       toast({
//         title: `${t.name || t.personId} - Location Not Matching`,
//         description: `You must be within 100 meters of the assigned location: ${locationName}`,
//         variant: "destructive",
//       })
//       speakAnnouncement(t.name || t.personId, "window_closed")
//       return
//     }

//     if (result.alreadyMarked) {
//       logMsg(`${t.name || t.personId} - Attendance already recorded for today`)
//       speakAnnouncement(t.name || t.personId, "already_recorded")
//       return
//     }

//     const nowStr = new Date().toLocaleString()
//     const eventData = {
//       personId: t.personId,
//       personType: t.personType,
//       name: t.name || t.personId,
//       time: nowStr,
//       distance: l2Distance,
//       department: t.department,
//       role: t.role,
//       shift: t.shift,
//       className: t.className,
//       status: status as "present" | "late" | "absent" | "already_recorded" | "early" | "window_closed",
//       delayInfo,
//     }

//     setEvents((prev) => [eventData, ...prev])

//     if (isConnected) {
//       await realtimeClient.emitToServer("attendance_update", {
//         type: "attendance_marked",
//         personId: t.personId,
//         personType: t.personType,
//         personName: t.name || t.personId,
//         status: status === "early" || status === "window_closed" ? "present" : status,
//         timestamp: new Date().toISOString(),
//         department: t.department,
//         role: t.role,
//         shift: t.shift,
//         className: t.className,
//         delayInfo,
//         source: "face-recognition",
//         message: `${t.name || t.personId} marked as ${status.toUpperCase()} via Face Recognition`,
//       })
//       setRealtimeUpdates((prev) => prev + 1)
//       logMsg(`Real-time update sent for ${t.name || t.personId}`)
//     }

//     logMsg("Attendance marked successfully.")

//     speakAnnouncement(t.name || t.personId, status as any, delayInfo)
//   }

//   function speakAnnouncement(
//     name: string,
//     status: "present" | "late" | "absent" | "already_recorded" | "early" | "window_closed",
//     extra?: any,
//   ) {
//     if ("speechSynthesis" in window) {
//       let message: string

//       switch (status) {
//         case "already_recorded":
//           message = `${name}, already today your attendance is recorded`
//           break
//         case "late":
//           if (extra && extra.hours > 0) {
//             message = `${name}, you are ${extra.hours} hour${extra.hours > 1 ? "s" : ""} ${extra.minutes} minute${extra.minutes !== 1 ? "s" : ""} late, attendance recorded`
//           } else if (extra && extra.minutes > 0) {
//             message = `${name}, you are ${extra.minutes} minute${extra.minutes !== 1 ? "s" : ""} late, attendance recorded`
//           } else {
//             message = `${name}, you are late, attendance recorded`
//           }
//           break
//         case "early":
//           message = `${name}, please wait for your shift time${extra ? `. Wait for ${extra}` : ""}`
//           break
//         case "window_closed":
//           message = `${name}, attendance window is closed for your shift`
//           break
//         default:
//           message = `${name}, today your attendance is recorded`
//       }

//       const utterance = new SpeechSynthesisUtterance(message)
//       utterance.rate = 0.9
//       utterance.pitch = 1.0
//       utterance.volume = 0.8
//       speechSynthesis.speak(utterance)
//     }
//   }

//   async function startRecognizeLoop() {
//     if (!modelsReady) {
//       logMsg("Models are still loading...")
//       return
//     }
//     await ensureCamera()
//     if (running) return
//     setRunning(true)
//     syncCanvasSize()
//     rafRef.current = requestAnimationFrame(loop)
//     logMsg("Auto recognition started.")
//   }

//   function handleStop() {
//     stopLoop()
//     stopCamera()
//     logMsg("Camera stopped.")
//   }

//   const switchCamera = () => {
//     const newFacingMode = facingMode === "user" ? "environment" : "user"
//     setFacingMode(newFacingMode)
//     logMsg(`Switching to ${newFacingMode === "user" ? "front" : "back"} camera...`)
//   }

//   return (
//     <div className="min-h-screen space-y-4 p-4 md:space-y-6 md:p-6">
//       <header className="space-y-1">
//         <div className="flex items-center gap-3">
//           <h1 className="text-balance text-xl font-semibold md:text-2xl">Face ID Recognition</h1>
//           <div className="flex items-center gap-2">
//             {isConnected ? (
//               <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
//                 <Wifi className="h-3 w-3" />
//                 Live
//               </div>
//             ) : (
//               <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
//                 <WifiOff className="h-3 w-3" />
//                 Offline
//               </div>
//             )}
//             {currentLocation ? (
//               <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                 <MapPin className="h-3 w-3" />
//                 Location OK
//               </div>
//             ) : locationLoading ? (
//               <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
//                 <MapPin className="h-3 w-3" />
//                 Getting location...
//               </div>
//             ) : (
//               <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
//                 <MapPin className="h-3 w-3" />
//                 No location
//               </div>
//             )}
//             {realtimeUpdates > 0 && (
//               <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                 {realtimeUpdates} sent
//               </div>
//             )}
//           </div>
//         </div>
//         <p className="text-xs text-gray-600 md:text-sm">
//           Auto recognition using MediaPipe for detection and face-api.js for descriptors. Click Recognize &amp; Mark
//           once to start; Stop Camera to end. Enrollment not required.
//           {isConnected && " Real-time updates to attendance page enabled."}
//           {locationError && (
//             <span className="text-red-600"> Location access denied - attendance may be restricted for some users.</span>
//           )}
//         </p>
//       </header>

//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="text-lg md:text-xl">Live Camera</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="relative w-full max-w-full overflow-hidden rounded border bg-black">
//             <video
//               ref={videoRef}
//               className="w-full h-auto max-h-[70vh] object-cover"
//               playsInline
//               muted
//               autoPlay
//               style={{ aspectRatio: "auto" }}
//             />
//             <canvas
//               ref={canvasRef}
//               className="pointer-events-none absolute inset-0 w-full h-full"
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//               }}
//               aria-hidden="true"
//             />
//           </div>

//           <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
//             <Button
//               disabled={!modelsReady}
//               onClick={startRecognizeLoop}
//               className="w-full bg-teal-600 text-white hover:bg-teal-700 sm:w-auto sm:flex-1 md:flex-none"
//               size="sm"
//             >
//               <span className="hidden sm:inline">Recognize &amp; Mark</span>
//               <span className="sm:hidden">Start Recognition</span>
//             </Button>
//             <Button
//               variant="secondary"
//               onClick={handleStop}
//               disabled={!ready && !running}
//               className="w-full sm:w-auto sm:flex-1 md:flex-none"
//               size="sm"
//             >
//               <span className="hidden sm:inline">Stop Camera</span>
//               <span className="sm:hidden">Stop</span>
//             </Button>
//             {availableCameras.length > 1 && (
//               <Button
//                 variant="outline"
//                 onClick={switchCamera}
//                 disabled={running}
//                 className="w-full bg-transparent sm:w-auto md:w-auto"
//                 size="sm"
//               >
//                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                   />
//                 </svg>
//                 <span className="ml-2 hidden sm:inline">
//                   {facingMode === "user" ? "Switch to Back" : "Switch to Front"}
//                 </span>
//                 <span className="ml-2 sm:hidden">{facingMode === "user" ? "Back Cam" : "Front Cam"}</span>
//               </Button>
//             )}
//           </div>

//           <div className="rounded border bg-gray-50 p-3 text-xs text-gray-700">
//             <div className="break-words text-xs sm:text-sm">
//               Status: camera {ready ? "ready" : "not ready"} • Models {modelsReady ? "ready" : "loading"} • Templates{" "}
//               {templates.length} • Loop {running ? "running" : "stopped"}
//               <br className="sm:hidden" />
//               <span className="hidden sm:inline"> • </span>Camera: {facingMode === "user" ? "Front" : "Back"}
//               <br className="sm:hidden" />
//               <span className="hidden sm:inline"> • </span>Real-time {isConnected ? "connected" : "disconnected"}
//               {realtimeUpdates > 0 && (
//                 <>
//                   <br className="sm:hidden" />
//                   <span className="hidden sm:inline"> • </span>
//                   {realtimeUpdates} updates sent
//                 </>
//               )}
//             </div>
//             <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
//               {log.map((l, i) => (
//                 <li key={i} className="break-words">
//                   {l}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="text-lg md:text-xl">Recognition Status</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {events.length === 0 ? (
//             <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center text-gray-500">
//               <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
//                 <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//               <p className="text-sm">No recognized records yet.</p>
//               <p className="text-xs text-gray-400 mt-1">Start recognition to see attendance records here</p>
//             </div>
//           ) : (
//             <>
//               <div className="hidden overflow-x-auto lg:block">
//                 <table className="min-w-full text-sm">
//                   <thead>
//                     <tr className="border-b bg-gray-50 text-left">
//                       <th className="p-2">Time</th>
//                       <th className="p-2">ID</th>
//                       <th className="p-2">Name</th>
//                       <th className="p-2">Type</th>
//                       <th className="p-2">Dept</th>
//                       <th className="p-2">Role</th>
//                       <th className="p-2">Shift</th>
//                       <th className="p-2">Class</th>
//                       <th className="p-2">Match</th>
//                       <th className="p-2">Status</th>
//                       <th className="p-2">Delay</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {events.map((e, idx) => (
//                       <tr key={idx} className="border-b">
//                         <td className="p-2">{e.time}</td>
//                         <td className="p-2">{e.personId}</td>
//                         <td className="p-2">{e.name}</td>
//                         <td className="p-2">{e.personType}</td>
//                         <td className="p-2">{e.department || "-"}</td>
//                         <td className="p-2">{e.role || "-"}</td>
//                         <td className="p-2">{e.shift || "-"}</td>
//                         <td className="p-2">{e.className || "-"}</td>
//                         <td className="p-2">{e.distance.toFixed(3)}</td>
//                         <td className="p-2">{e.status}</td>
//                         <td className="p-2">{e.delayInfo ? `${e.delayInfo.hours}h ${e.delayInfo.minutes}m` : "-"}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="space-y-3 lg:hidden">
//                 {events.map((e, idx) => (
//                   <div key={idx} className="rounded-lg border bg-white p-4 shadow-sm">
//                     <div className="mb-3 flex items-start justify-between">
//                       <div>
//                         <h3 className="font-medium text-gray-900">{e.name}</h3>
//                         <p className="text-sm text-gray-500">
//                           {e.personId} • {e.personType}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <span
//                           className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
//                             e.status === "present"
//                               ? "bg-green-100 text-green-800"
//                               : e.status === "late"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : e.status === "already_recorded"
//                                   ? "bg-blue-100 text-blue-800"
//                                   : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {e.status}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div>
//                         <span className="text-gray-500">Time:</span>
//                         <p className="font-medium">{e.time}</p>
//                       </div>
//                       {e.department && (
//                         <div>
//                           <span className="text-gray-500">Department:</span>
//                           <p className="font-medium">{e.department}</p>
//                         </div>
//                       )}
//                       {e.role && (
//                         <div>
//                           <span className="text-gray-500">Role:</span>
//                           <p className="font-medium">{e.role}</p>
//                         </div>
//                       )}
//                       {e.shift && (
//                         <div>
//                           <span className="text-gray-500">Shift:</span>
//                           <p className="font-medium">{e.shift}</p>
//                         </div>
//                       )}
//                       {e.className && (
//                         <div>
//                           <span className="text-gray-500">Class:</span>
//                           <p className="font-medium">{e.className}</p>
//                         </div>
//                       )}
//                       <div>
//                         <span className="text-gray-500">Match Score:</span>
//                         <p className="font-medium">{e.distance.toFixed(3)}</p>
//                       </div>
//                       {e.delayInfo && (
//                         <div>
//                           <span className="text-gray-500">Delay:</span>
//                           <p className="font-medium">
//                             {e.delayInfo.hours}h {e.delayInfo.minutes}m
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }



"use client"

import { useEffect, useRef, useState } from "react"
import * as faceapi from "face-api.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SHIFT_TIMINGS, getAttendanceStatus, getCountdownToShift, getDelayTime } from "@/lib/constants"
import { realtimeClient } from "@/lib/realtime-client"
import { Wifi, WifiOff, MapPin } from "lucide-react"
import { getStoredUser } from "@/lib/auth" // import user helper
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision"
import { useRouter } from "next/navigation" // router for redirect
import { useToast } from "@/hooks/use-toast"

type PersonType = "staff" | "student"

type FaceTemplate = {
  personId: string
  personType: PersonType
  vector: number[] // 128-d face descriptor
  name?: string
  department?: string
  role?: string
  shift?: string
  className?: string
  branchClass?: string
  branch?: string
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
}

type RecognizedEvent = {
  personId: string
  personType: PersonType
  name: string
  time: string
  distance: number
  department?: string
  role?: string
  shift?: string
  className?: string
  status: "present" | "late" | "absent" | "already_recorded" | "early" | "window_closed"
  delayInfo?: { hours: number; minutes: number }
}

export default function FaceIDPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastDetectRef = useRef<number>(0)
  const recentlyMarkedRef = useRef<Map<string, number>>(new Map()) // personId -> ts

  const [ready, setReady] = useState(false)
  const [modelsReady, setModelsReady] = useState(false)
  const [running, setRunning] = useState(false)
  const [templates, setTemplates] = useState<FaceTemplate[]>([])
  const [log, setLog] = useState<string[]>([])
  const [events, setEvents] = useState<RecognizedEvent[]>([])
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [realtimeUpdates, setRealtimeUpdates] = useState(0)
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)

  const mpDetectorRef = useRef<FaceDetector | null>(null)
  const [mpReady, setMpReady] = useState(false)
  const [recogReady, setRecogReady] = useState(false)

  const router = useRouter() // router for redirect
  const { toast } = useToast()

  function logMsg(msg: string) {
    setLog((prev) => [msg, ...prev].slice(0, 8))
  }

  useEffect(() => {
    const u = getStoredUser()
    if (u?.role === "Student") {
      router.replace("/") // redirect students away from Face ID
    }
  }, [router])

  useEffect(() => {
    let cancelled = false
    async function loadModels() {
      try {
        // const MODEL_URL = "/models"

        const MODEL_URL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

        const recogPromise = (async () => {
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
          if (!cancelled) setRecogReady(true)
        })()

        const mpPromise = (async () => {
          const resolver = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
          )
          const detector = await FaceDetector.createFromOptions(resolver, {
            baseOptions: {
              modelAssetPath:
                 "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
            },
            runningMode: "VIDEO",
          })
          if (!cancelled) {
            mpDetectorRef.current = detector
            setMpReady(true)
          }
        })()

        await Promise.all([recogPromise, mpPromise])
        if (!cancelled) setModelsReady(true)
      } catch (err) {
        console.error(err)
        alert("Failed to load models. Ensure /public/models exists for face-api recognition net.")
      }
    }
    loadModels()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    async function loadDescriptors() {
      try {
        const u = getStoredUser()
        const instParam =
          u?.institutionName && u?.role !== "SuperAdmin"
            ? `?institutionName=${encodeURIComponent(u.institutionName)}`
            : ""
        const [staffRes, studentsRes] = await Promise.all([
          fetch(`/api/staff${instParam}`),
          fetch(`/api/students${instParam}`),
        ])
        const staffJson = await staffRes.json()
        const studentsJson = await studentsRes.json()

        const operatorRole = u?.role
        const operatorBranchRaw =
          ((u as any)?.branchClass as string | undefined) || ((u as any)?.branch as string | undefined) || ""
        const operatorBranch = operatorBranchRaw ? operatorBranchRaw.toUpperCase().trim() : ""
        const teacherUnassigned = operatorRole === "Teacher" && !operatorBranch

        function studentMatchesTeacherBranch(op: string, stBC?: string, stB?: string) {
          if (!op) return false
          const studentBC = (stBC || "").toUpperCase().trim()
          const studentB = (stB || "").toUpperCase().trim()
          if (op.includes("-")) {
            return studentBC === op
          }
          return studentB === op || studentBC === op || studentBC.startsWith(op + "-")
        }

        const t: FaceTemplate[] = []

        for (const s of staffJson.items as any[]) {
          if (Array.isArray(s.faceDescriptor)) {
            t.push({
              personId: s.id,
              personType: "staff",
              vector: s.faceDescriptor,
              name: s.name || s.fullName || s.firstName || s.email || s.id,
              department: s.department,
              role: s.role,
              shift: s.shift,
              location: s.location,
            })
          }
        }

        if (!teacherUnassigned) {
          for (const st of studentsJson.items as any[]) {
            if (!Array.isArray(st.faceDescriptor)) continue

            const stBranchClass = (st.branchClass || "").toUpperCase().trim()
            const stBranch = (st.branch || "").toUpperCase().trim()

            const teacherHasRestriction = operatorRole === "Teacher" && !!operatorBranch
            if (teacherHasRestriction && !studentMatchesTeacherBranch(operatorBranch, stBranchClass, stBranch)) {
              continue
            }

            t.push({
              personId: st.id,
              personType: "student",
              vector: st.faceDescriptor,
              name: st.name || st.fullName || st.firstName || st.email || st.id,
              department: st.department,
              className: st.className || st.class || st.grade,
              shift: st.shift,
              branchClass: stBranchClass || undefined,
              branch: stBranch || undefined,
              location: st.location,
            })
          }
        }

        setTemplates(t)
        console.log("[v0] Templates loaded:", {
          total: t.length,
          restrictedByBranch: operatorRole === "Teacher",
          operatorBranch,
          teacherUnassigned,
        })
        logMsg(`Loaded ${t.length} face templates.`)
      } catch (e) {
        console.error(e)
        logMsg("Failed to load templates from API.")
      }
    }
    loadDescriptors()
  }, [])

  useEffect(() => {
    async function detectCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((device) => device.kind === "videoinput")
        setAvailableCameras(videoDevices)
      } catch (error) {
        console.error("Error detecting cameras:", error)
      }
    }
    detectCameras()
  }, [])

  useEffect(() => {
    // Connect to real-time updates
    realtimeClient.connect()
    setIsConnected(true)
    console.log("[v0] Real-time client connected to faceid page")

    return () => {
      realtimeClient.disconnect()
      setIsConnected(false)
    }
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      setLocationLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setLocationLoading(false)
          logMsg(`Location captured: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
        },
        (error) => {
          setLocationError(error.message)
          setLocationLoading(false)
          logMsg(`Location error: ${error.message}`)
        },
      )
    } else {
      setLocationError("Geolocation not supported")
      logMsg("Geolocation not supported by browser")
    }
  }, [])

  useEffect(() => {
    let active = true
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        })
        if (!active) return
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          streamRef.current = stream
          setReady(true)
          if (videoRef.current.readyState >= 2) {
            syncCanvasSize()
          } else {
            videoRef.current.onloadedmetadata = () => {
              syncCanvasSize()
            }
          }
        }
      } catch (e) {
        console.error(e)
        alert("Camera access failed. Please allow camera permissions.")
      }
    }
    startCamera()
    return () => {
      active = false
      stopLoop()
      stopCamera()
    }
  }, [facingMode])

  function syncCanvasSize() {
    const v = videoRef.current
    const c = canvasRef.current
    if (!v || !c) return
    const w = v.videoWidth || v.clientWidth
    const h = v.videoHeight || v.clientHeight
    c.width = w
    c.height = h
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setReady(false)
  }

  function stopLoop() {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    setRunning(false)
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return -1

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  function l2(a: number[], b: number[]) {
    if (a.length !== b.length) return Number.POSITIVE_INFINITY
    let s = 0
    for (let i = 0; i < a.length; i++) {
      const d = a[i] - b[i]
      s += d * d
    }
    return Math.sqrt(s)
  }

  function matchDescriptor(vec: number[]) {
    let bestIdx = -1
    let bestL2 = Number.POSITIVE_INFINITY
    let bestCosine = -1

    for (let i = 0; i < templates.length; i++) {
      const l2Dist = l2(vec, templates[i].vector)
      const cosineSim = cosineSimilarity(vec, templates[i].vector)

      if (l2Dist < bestL2 && cosineSim > bestCosine) {
        bestL2 = l2Dist
        bestCosine = cosineSim
        bestIdx = i
      }
    }

    return { idx: bestIdx, l2Dist: bestL2, cosineSim: bestCosine }
  }

  async function loop() {
    const v = videoRef.current
    const c = canvasRef.current
    if (!v || !c || !mpReady || !recogReady || !ready) {
      rafRef.current = requestAnimationFrame(loop)
      return
    }

    const now = performance.now()
    const minIntervalMs = 350
    if (now - lastDetectRef.current < minIntervalMs) {
      rafRef.current = requestAnimationFrame(loop)
      return
    }
    lastDetectRef.current = now

    const ctx = c.getContext("2d")
    if (!ctx) {
      rafRef.current = requestAnimationFrame(loop)
      return
    }
    ctx.clearRect(0, 0, c.width, c.height)

    const detector = mpDetectorRef.current
    let mpDetections: any[] = []
    try {
      const result = await detector?.detectForVideo(v, now)
      mpDetections = result?.detections ?? []
    } catch (e) {
      console.error("[v0] MediaPipe detection error", e)
      rafRef.current = requestAnimationFrame(loop)
      return
    }

    for (const det of mpDetections) {
      const bb = det.boundingBox
      const x = bb.originX
      const y = bb.originY
      const width = bb.width
      const height = bb.height

      const score = det.categories?.[0]?.score ?? 0.0
      const faceSize = Math.min(width, height)
      let qualityScore = 0
      if (faceSize >= 100) qualityScore += 0.4
      else if (faceSize >= 80) qualityScore += 0.3
      else if (faceSize >= 60) qualityScore += 0.2
      else qualityScore += 0.1
      qualityScore += Math.max(0, Math.min(score, 1)) * 0.6
      const faceQuality = Math.min(qualityScore, 1.0)

      const side = Math.max(width, height)
      const cx = x + width / 2
      const cy = y + height / 2
      const sx = Math.max(0, cx - side / 2)
      const sy = Math.max(0, cy - side / 2)
      const sw = Math.min(side, c.width - sx)
      const sh = Math.min(side, c.height - sy)

      if (faceQuality < 0.6) {
        ctx.strokeStyle = "rgba(251, 191, 36, 0.95)"
        ctx.lineWidth = 2
        ctx.strokeRect(sx, sy, sw, sh)
        const label = "Low Quality"
        ctx.fillStyle = "rgba(251, 191, 36, 0.95)"
        ctx.font = "12px sans-serif"
        const textW = ctx.measureText(label).width + 8
        ctx.fillRect(sx, sy - 20, textW, 18)
        ctx.fillStyle = "#fff"
        ctx.fillText(label, sx + 4, sy - 6)
        continue
      }

      const faceCanvas = document.createElement("canvas")
      faceCanvas.width = Math.max(1, Math.floor(sw))
      faceCanvas.height = Math.max(1, Math.floor(sh))
      const fctx = faceCanvas.getContext("2d")
      if (!fctx) continue
      fctx.drawImage(v, sx, sy, sw, sh, 0, 0, faceCanvas.width, faceCanvas.height)

      let vec: number[] | null = null
      try {
        const desc = (await (faceapi as any).computeFaceDescriptor(faceCanvas)) as Float32Array | number[]
        if (desc) vec = Array.from(desc as any)
      } catch (e) {
        console.error("[v0] Descriptor compute failed", e)
        vec = null
      }
      if (!vec || templates.length === 0) {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.95)"
        ctx.lineWidth = 3
        ctx.strokeRect(sx, sy, sw, sh)
        continue
      }

      const { idx, l2Dist, cosineSim } = matchDescriptor(vec)

      const l2Threshold = 0.45
      const cosineThreshold = 0.65

      if (idx >= 0 && l2Dist < l2Threshold && cosineSim > cosineThreshold) {
        const t = templates[idx]
        ctx.strokeStyle = "rgba(34, 197, 94, 0.95)"
        ctx.lineWidth = 3
        ctx.strokeRect(sx, sy, sw, sh)

        const nowMs = Date.now()
        const cooldownMs = 60_000
        const last = recentlyMarkedRef.current.get(t.personId) || 0
        if (nowMs - last > cooldownMs) {
          recentlyMarkedRef.current.set(t.personId, nowMs)
          markAttendance(t, l2Dist, cosineSim, faceQuality).catch((err) => {
            console.error(err)
            logMsg(`Failed to mark attendance for ${t.name || t.personId}`)
          })
        }

        const label = `${t.name || t.personId} • L2:${l2Dist.toFixed(3)} • Cos:${cosineSim.toFixed(3)} • Q:${faceQuality.toFixed(2)}`
        ctx.fillStyle = "rgba(34, 197, 94, 0.95)"
        ctx.font = "12px sans-serif"
        const textW = ctx.measureText(label).width + 10
        ctx.fillRect(sx, sy - 22, textW, 20)
        ctx.fillStyle = "#fff"
        ctx.fillText(label, sx + 5, sy - 8)
      } else {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.95)"
        ctx.lineWidth = 3
        ctx.strokeRect(sx, sy, sw, sh)

        const label = `Unknown • L2:${l2Dist.toFixed(3)} • Cos:${cosineSim.toFixed(3)}`
        ctx.fillStyle = "rgba(239, 68, 68, 0.95)"
        ctx.font = "12px sans-serif"
        const textW = ctx.measureText(label).width + 10
        ctx.fillRect(sx, sy - 22, textW, 20)
        ctx.fillStyle = "#fff"
        ctx.fillText(label, sx + 5, sy - 8)
      }
    }

    rafRef.current = requestAnimationFrame(loop)
  }

  async function ensureCamera() {
    if (ready && streamRef.current) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        streamRef.current = stream
        setReady(true)
        syncCanvasSize()
      }
    } catch (e) {
      console.error(e)
      alert("Camera access failed. Please allow camera permissions.")
    }
  }

  async function markAttendance(t: FaceTemplate, l2Distance: number, cosineSim: number, faceQuality: number) {
    logMsg(
      `Recognized ${t.personType} ${t.name || t.personId} (L2: ${l2Distance.toFixed(3)}, Cosine: ${cosineSim.toFixed(3)}, Quality: ${faceQuality.toFixed(2)}). Checking shift timing...`,
    )

    const u = getStoredUser()
    const operatorRole = u?.role
    const operatorBranchRaw =
      ((u as any)?.branchClass as string | undefined) || ((u as any)?.branch as string | undefined) || ""
    const operatorBranch = operatorBranchRaw ? operatorBranchRaw.toUpperCase().trim() : ""
    if (t.personType === "student" && operatorRole === "Teacher" && !operatorBranch) {
      logMsg(`Blocked: You are a Teacher without assigned branch/class. Cannot mark student attendance.`)
      speakAnnouncement(t.name || t.personId, "window_closed")
      return
    }

    if (t.personType === "student" && operatorRole === "Teacher" && operatorBranch) {
      const stBC = (t.branchClass || "").toUpperCase().trim()
      const stB = (t.branch || "").toUpperCase().trim()
      const matches = operatorBranch.includes("-")
        ? stBC === operatorBranch
        : stB === operatorBranch || stBC === operatorBranch || stBC.startsWith(operatorBranch + "-")
      if (!matches) {
        logMsg(`${t.name || t.personId} - Blocked: student not in your assigned branch/class (${operatorBranch}).`)
        console.log("[v0] Blocked markAttendance outside teacher branch", {
          operatorBranch,
          studentBranchClass: stBC,
          studentBranch: stB,
        })
        speakAnnouncement(t.name || t.personId, "window_closed")
        return
      }
    }

    if (t.location?.latitude && t.location?.longitude) {
      if (!currentLocation) {
        logMsg(`${t.name || t.personId} - Location required but not available. Please enable location.`)
        speakAnnouncement(t.name || t.personId, "window_closed")
        return
      }
    }

    if (!t.shift || !SHIFT_TIMINGS[t.shift as keyof typeof SHIFT_TIMINGS]) {
      logMsg(`No valid shift found for ${t.name || t.personId}`)
      return
    }

    const shiftKey = t.shift as keyof typeof SHIFT_TIMINGS
    const status: "present" | "late" | "absent" | "already_recorded" | "early" | "window_closed" =
      getAttendanceStatus(shiftKey)

    if (status === "early") {
      const countdown = getCountdownToShift(shiftKey)
      logMsg(`${t.name || t.personId} - Early arrival. Please wait for shift time.`)
      speakAnnouncement(t.name || t.personId, "early", countdown)
      return
    }

    if (status === "window_closed") {
      logMsg(`${t.name || t.personId} - Attendance window closed for ${t.shift} shift`)
      speakAnnouncement(t.name || t.personId, "window_closed")
      return
    }

    let delayInfo = null
    if (status === "late") {
      delayInfo = getDelayTime(shiftKey)
    }

    logMsg(
      `Shift: ${t.shift}, Status: ${status}${delayInfo ? `, Delay: ${delayInfo.hours}h ${delayInfo.minutes}m` : ""}`,
    )

    const response = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personId: t.personId,
        personType: t.personType,
        status: status === "early" || status === "window_closed" ? "present" : status,
        delayInfo,
        currentLocation: currentLocation || undefined,
        operator: {
          role: operatorRole,
          branch: operatorBranch || undefined,
        },
      }),
    })

    const result = await response.json()

    if (result.error === "LOCATION_REQUIRED") {
      const locationName =
        t.location?.address || `${t.location?.latitude.toFixed(4)}, ${t.location?.longitude.toFixed(4)}`
      logMsg(`${t.name || t.personId} - ${result.message}`)
      toast({
        title: `${t.name || t.personId} - Location Required`,
        description: `Assigned location: ${locationName}. Please enable location services to mark attendance.`,
        variant: "destructive",
        duration: 10000,
      })
      speakAnnouncement(t.name || t.personId, "location_mismatch")
      return
    }

    if (result.error === "LOCATION_MISMATCH") {
      const locationName =
        t.location?.address || `${t.location?.latitude.toFixed(4)}, ${t.location?.longitude.toFixed(4)}`
      logMsg(`${t.name || t.personId} - ${result.message}`)
      toast({
        title: `${t.name || t.personId} - Location Not Matching`,
        description: `You must be within 100 meters of the assigned location: ${locationName}`,
        variant: "destructive",
        duration: 10000,
      })
      speakAnnouncement(t.name || t.personId, "location_mismatch")
      return
    }

    if (result.alreadyMarked) {
      logMsg(`${t.name || t.personId} - Attendance already recorded for today`)
      speakAnnouncement(t.name || t.personId, "already_recorded")
      return
    }

    const nowStr = new Date().toLocaleString()
    const eventData = {
      personId: t.personId,
      personType: t.personType,
      name: t.name || t.personId,
      time: nowStr,
      distance: l2Distance,
      department: t.department,
      role: t.role,
      shift: t.shift,
      className: t.className,
      status: status as "present" | "late" | "absent" | "already_recorded" | "early" | "window_closed",
      delayInfo,
    }

    setEvents((prev) => [eventData, ...prev])

    if (isConnected) {
      await realtimeClient.emitToServer("attendance_update", {
        type: "attendance_marked",
        personId: t.personId,
        personType: t.personType,
        personName: t.name || t.personId,
        status: status === "early" || status === "window_closed" ? "present" : status,
        timestamp: new Date().toISOString(),
        department: t.department,
        role: t.role,
        shift: t.shift,
        className: t.className,
        delayInfo,
        source: "face-recognition",
        message: `${t.name || t.personId} marked as ${status.toUpperCase()} via Face Recognition`,
      })
      setRealtimeUpdates((prev) => prev + 1)
      logMsg(`Real-time update sent for ${t.name || t.personId}`)
    }

    logMsg("Attendance marked successfully.")

    toast({
      title: `${t.name || t.personId} - Attendance Recorded`,
      description: `Status: ${status.toUpperCase()}${delayInfo ? ` (Delay: ${delayInfo.hours}h ${delayInfo.minutes}m)` : ""}`,
      variant: "default",
      className: "bg-green-50 border-green-200",
      duration: 10000,
    })

    speakAnnouncement(t.name || t.personId, status as any, delayInfo)
  }

  function speakAnnouncement(
    name: string,
    status: "present" | "late" | "absent" | "already_recorded" | "early" | "window_closed" | "location_mismatch",
    extra?: any,
  ) {
    if ("speechSynthesis" in window) {
      let message: string

      switch (status) {
        case "already_recorded":
          message = `${name}, already today your attendance is recorded`
          break
        case "late":
          if (extra && extra.hours > 0) {
            message = `${name}, you are ${extra.hours} hour${extra.hours > 1 ? "s" : ""} ${extra.minutes} minute${extra.minutes !== 1 ? "s" : ""} late, attendance recorded`
          } else if (extra && extra.minutes > 0) {
            message = `${name}, you are ${extra.minutes} minute${extra.minutes !== 1 ? "s" : ""} late, attendance recorded`
          } else {
            message = `${name}, you are late, attendance recorded`
          }
          break
        case "early":
          message = `${name}, please wait for your shift time${extra ? `. Wait for ${extra}` : ""}`
          break
        case "location_mismatch":
          message = `${name}, your location is not matching`
          break
        case "window_closed":
          message = `${name}, attendance window is closed for your shift`
          break
        default:
          message = `${name}, today your attendance is recorded`
      }

      const utterance = new SpeechSynthesisUtterance(message)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  async function startRecognizeLoop() {
    if (!modelsReady) {
      logMsg("Models are still loading...")
      return
    }
    await ensureCamera()
    if (running) return
    setRunning(true)
    syncCanvasSize()
    rafRef.current = requestAnimationFrame(loop)
    logMsg("Auto recognition started.")
  }

  function handleStop() {
    stopLoop()
    stopCamera()
    logMsg("Camera stopped.")
  }

  const switchCamera = () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user"
    setFacingMode(newFacingMode)
    logMsg(`Switching to ${newFacingMode === "user" ? "front" : "back"} camera...`)
  }

  return (
    <div className="min-h-screen space-y-4 p-4 md:space-y-6 md:p-6">
      <header className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-balance text-xl font-semibold md:text-2xl">Face ID Recognition</h1>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                <Wifi className="h-3 w-3" />
                Live
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                <WifiOff className="h-3 w-3" />
                Offline
              </div>
            )}
            {currentLocation ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                <MapPin className="h-3 w-3" />
                Location OK
              </div>
            ) : locationLoading ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                <MapPin className="h-3 w-3" />
                Getting location...
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                <MapPin className="h-3 w-3" />
                No location
              </div>
            )}
            {realtimeUpdates > 0 && (
              <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {realtimeUpdates} sent
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-600 md:text-sm">
          Auto recognition using MediaPipe for detection and face-api.js for descriptors. Click Recognize &amp; Mark
          once to start; Stop Camera to end. Enrollment not required.
          {isConnected && " Real-time updates to attendance page enabled."}
          {locationError && (
            <span className="text-red-600"> Location access denied - attendance may be restricted for some users.</span>
          )}
        </p>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">Live Camera</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full max-w-full overflow-hidden rounded border bg-black">
            <video
              ref={videoRef}
              className="w-full h-auto max-h-[70vh] object-cover"
              playsInline
              muted
              autoPlay
              style={{ aspectRatio: "auto" }}
            />
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 w-full h-full"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <Button
              disabled={!modelsReady}
              onClick={startRecognizeLoop}
              className="w-full bg-teal-600 text-white hover:bg-teal-700 sm:w-auto sm:flex-1 md:flex-none"
              size="sm"
            >
              <span className="hidden sm:inline">Recognize &amp; Mark</span>
              <span className="sm:hidden">Start Recognition</span>
            </Button>
            <Button
              variant="secondary"
              onClick={handleStop}
              disabled={!ready && !running}
              className="w-full sm:w-auto sm:flex-1 md:flex-none"
              size="sm"
            >
              <span className="hidden sm:inline">Stop Camera</span>
              <span className="sm:hidden">Stop</span>
            </Button>
            {availableCameras.length > 1 && (
              <Button
                variant="outline"
                onClick={switchCamera}
                disabled={running}
                className="w-full bg-transparent sm:w-auto md:w-auto"
                size="sm"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="ml-2 hidden sm:inline">
                  {facingMode === "user" ? "Switch to Back" : "Switch to Front"}
                </span>
                <span className="ml-2 sm:hidden">{facingMode === "user" ? "Back Cam" : "Front Cam"}</span>
              </Button>
            )}
          </div>

          <div className="rounded border bg-gray-50 p-3 text-xs text-gray-700">
            <div className="break-words text-xs sm:text-sm">
              Status: camera {ready ? "ready" : "not ready"} • Models {modelsReady ? "ready" : "loading"} • Templates{" "}
              {templates.length} • Loop {running ? "running" : "stopped"}
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> • </span>Camera: {facingMode === "user" ? "Front" : "Back"}
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> • </span>Real-time {isConnected ? "connected" : "disconnected"}
              {realtimeUpdates > 0 && (
                <>
                  <br className="sm:hidden" />
                  <span className="hidden sm:inline"> • </span>
                  {realtimeUpdates} updates sent
                </>
              )}
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
              {log.map((l, i) => (
                <li key={i} className="break-words">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">Recognition Status</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center text-gray-500">
              <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm">No recognized records yet.</p>
              <p className="text-xs text-gray-400 mt-1">Start recognition to see attendance records here</p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left">
                      <th className="p-2">Time</th>
                      <th className="p-2">ID</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Dept</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Shift</th>
                      <th className="p-2">Class</th>
                      <th className="p-2">Match</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Delay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((e, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{e.time}</td>
                        <td className="p-2">{e.personId}</td>
                        <td className="p-2">{e.name}</td>
                        <td className="p-2">{e.personType}</td>
                        <td className="p-2">{e.department || "-"}</td>
                        <td className="p-2">{e.role || "-"}</td>
                        <td className="p-2">{e.shift || "-"}</td>
                        <td className="p-2">{e.className || "-"}</td>
                        <td className="p-2">{e.distance.toFixed(3)}</td>
                        <td className="p-2">{e.status}</td>
                        <td className="p-2">{e.delayInfo ? `${e.delayInfo.hours}h ${e.delayInfo.minutes}m` : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 lg:hidden">
                {events.map((e, idx) => (
                  <div key={idx} className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{e.name}</h3>
                        <p className="text-sm text-gray-500">
                          {e.personId} • {e.personType}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            e.status === "present"
                              ? "bg-green-100 text-green-800"
                              : e.status === "late"
                                ? "bg-yellow-100 text-yellow-800"
                                : e.status === "already_recorded"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {e.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Time:</span>
                        <p className="font-medium">{e.time}</p>
                      </div>
                      {e.department && (
                        <div>
                          <span className="text-gray-500">Department:</span>
                          <p className="font-medium">{e.department}</p>
                        </div>
                      )}
                      {e.role && (
                        <div>
                          <span className="text-gray-500">Role:</span>
                          <p className="font-medium">{e.role}</p>
                        </div>
                      )}
                      {e.shift && (
                        <div>
                          <span className="text-gray-500">Shift:</span>
                          <p className="font-medium">{e.shift}</p>
                        </div>
                      )}
                      {e.className && (
                        <div>
                          <span className="text-gray-500">Class:</span>
                          <p className="font-medium">{e.className}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Match Score:</span>
                        <p className="font-medium">{e.distance.toFixed(3)}</p>
                      </div>
                      {e.delayInfo && (
                        <div>
                          <span className="text-gray-500">Delay:</span>
                          <p className="font-medium">
                            {e.delayInfo.hours}h {e.delayInfo.minutes}m
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

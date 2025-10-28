import type * as faceapi from "face-api.js"

export type LivenessChallenge = "blink" | "turn_left" | "turn_right" | "smile" | "nod"

export interface LivenessResult {
  passed: boolean
  confidence: number
  reason?: string
  challenge?: LivenessChallenge
}

// Eye Aspect Ratio for blink detection
function calculateEAR(eye: faceapi.Point[]): number {
  if (eye.length !== 6) return 0
  const v1 = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y)
  const v2 = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y)
  const h = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y)
  return (v1 + v2) / (2.0 * h)
}

export class LivenessDetector {
  private earHistory: number[] = []
  private facePositionHistory: { x: number; y: number; yaw: number }[] = []
  private blinkDetected = false
  private movementDetected = false
  private frameCount = 0
  private readonly EAR_THRESHOLD = 0.21
  private readonly BLINK_FRAMES = 2
  private readonly MOVEMENT_THRESHOLD = 15
  private readonly YAW_THRESHOLD = 10

  reset() {
    this.earHistory = []
    this.facePositionHistory = []
    this.blinkDetected = false
    this.movementDetected = false
    this.frameCount = 0
  }

  detectBlink(landmarks: faceapi.FaceLandmarks68): boolean {
    const leftEye = landmarks.getLeftEye()
    const rightEye = landmarks.getRightEye()
    const leftEAR = calculateEAR(leftEye)
    const rightEAR = calculateEAR(rightEye)
    const avgEAR = (leftEAR + rightEAR) / 2.0
    this.earHistory.push(avgEAR)
    if (this.earHistory.length > 10) this.earHistory.shift()
    if (this.earHistory.length >= 5) {
      const recent = this.earHistory.slice(-5)
      const hasClosedEyes = recent.some((ear) => ear < this.EAR_THRESHOLD)
      const hasOpenEyes = recent.some((ear) => ear > this.EAR_THRESHOLD + 0.05)
      if (hasClosedEyes && hasOpenEyes) {
        this.blinkDetected = true
        return true
      }
    }
    return false
  }

  detectHeadMovement(detection: faceapi.FaceDetection, landmarks: faceapi.FaceLandmarks68): boolean {
    const box = detection.box
    const nose = landmarks.getNose()
    const centerX = box.x + box.width / 2
    const centerY = box.y + box.height / 2
    const noseTip = nose[3]
    const noseOffset = noseTip.x - centerX
    const yaw = (noseOffset / box.width) * 100
    this.facePositionHistory.push({ x: centerX, y: centerY, yaw })
    if (this.facePositionHistory.length > 10) this.facePositionHistory.shift()
    if (this.facePositionHistory.length >= 5) {
      const positions = this.facePositionHistory.slice(-5)
      const xMovement = Math.max(...positions.map((p) => p.x)) - Math.min(...positions.map((p) => p.x))
      const yawMovement = Math.max(...positions.map((p) => p.yaw)) - Math.min(...positions.map((p) => p.yaw))
      if (xMovement > this.MOVEMENT_THRESHOLD || Math.abs(yawMovement) > this.YAW_THRESHOLD) {
        this.movementDetected = true
        return true
      }
    }
    return false
  }

  // Multi-frame consistency check
  checkConsistency(descriptor: Float32Array | number[]): boolean {
    this.frameCount++
    return this.frameCount >= 3
  }

  // Overall liveness check
  checkLiveness(
    detection: faceapi.FaceDetection,
    landmarks: faceapi.FaceLandmarks68,
    descriptor: Float32Array | number[],
  ): LivenessResult {
    const hasBlink = this.detectBlink(landmarks)
    const hasMovement = this.detectHeadMovement(detection, landmarks)
    const isConsistent = this.checkConsistency(descriptor)

    let confidence = 0
    if (hasBlink) confidence += 0.4
    if (hasMovement) confidence += 0.3
    if (isConsistent) confidence += 1.0 // Full confidence if consistent frames

    const passed = confidence >= 0.6

    if (!passed) {
      let reason = "Liveness check failed: "
      if (!hasBlink) reason += "No blink detected. "
      if (!hasMovement) reason += "No head movement detected. "
      if (!isConsistent) reason += "Insufficient frames. "
      return { passed: false, confidence, reason }
    }

    return { passed: true, confidence }
  }

  static getRandomChallenge(): LivenessChallenge {
    const challenges: LivenessChallenge[] = ["blink", "turn_left", "turn_right", "smile", "nod"]
    return challenges[Math.floor(Math.random() * challenges.length)]
  }

  static getChallengeText(challenge: LivenessChallenge): string {
    switch (challenge) {
      case "blink":
        return "Please blink your eyes"
      case "turn_left":
        return "Please turn your head left"
      case "turn_right":
        return "Please turn your head right"
      case "smile":
        return "Please smile"
      case "nod":
        return "Please nod your head"
      default:
        return "Please look at the camera"
    }
  }
}

// Detect if image is from a screen (photo/video spoof)
export function detectScreenSpoof(imageData: ImageData): { isSpoof: boolean; confidence: number; reason?: string } {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height

  let moirePatternScore = 0
  const brightnessVariation = 0
  let colorAnomalies = 0
  let pixelPatternScore = 0
  let edgeSharpnessScore = 0
  let textureScore = 0
  const flickerScore = 0

  // Sample more pixels for better accuracy
  const sampleSize = Math.min(data.length / 4, 20000)
  const step = Math.floor(data.length / (sampleSize * 4))

  const brightnessValues: number[] = []
  const edgeStrengths: number[] = []

  // Analyze pixels
  for (let i = 0; i < data.length - step * 4; i += step * 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const brightness = (r + g + b) / 3
    brightnessValues.push(brightness)

    // 1. Enhanced moire pattern detection (stricter)
    const colorDiff = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b)
    if (colorDiff > 80) {
      moirePatternScore++
    }

    // 2. Color anomaly detection (RGB imbalance common in screens)
    if (Math.abs(r - g) > 40 || Math.abs(g - b) > 40 || Math.abs(r - b) > 40) {
      colorAnomalies++
    }

    // 3. Pixel grid pattern detection (LCD/LED screens)
    if (i >= step * 4 && i < data.length - step * 4) {
      const prevBrightness = (data[i - step * 4] + data[i - step * 4 + 1] + data[i - step * 4 + 2]) / 3
      const nextBrightness = (data[i + step * 4] + data[i + step * 4 + 1] + data[i + step * 4 + 2]) / 3

      // Check for regular patterns (screen pixels)
      const diff = Math.abs(brightness - prevBrightness) + Math.abs(brightness - nextBrightness)
      if (diff > 80) {
        pixelPatternScore++
      }

      // 4. Edge sharpness analysis (photos of screens have softer edges)
      const edgeStrength = Math.abs(brightness - prevBrightness)
      edgeStrengths.push(edgeStrength)
      if (edgeStrength > 5 && edgeStrength < 30) {
        edgeSharpnessScore++ // Soft edges indicate photo of screen
      }
    }

    // 5. Texture uniformity (screens have more uniform texture)
    const x = (i / 4) % width
    const y = Math.floor(i / 4 / width)
    if (x > 10 && x < width - 10 && y > 10 && y < height - 10) {
      // Check local variance
      const neighbors = [data[i - width * 4], data[i + width * 4], data[i - 4], data[i + 4]]
      const avgNeighbor = neighbors.reduce((a, b) => a + b, 0) / neighbors.length
      const variance = Math.abs(brightness - avgNeighbor)
      if (variance < 5) {
        textureScore++ // Too uniform = likely screen
      }
    }
  }

  // 6. Brightness distribution analysis
  const avgBrightness = brightnessValues.reduce((a, b) => a + b, 0) / brightnessValues.length
  const brightnessStdDev = Math.sqrt(
    brightnessValues.reduce((sum, val) => sum + Math.pow(val - avgBrightness, 2), 0) / brightnessValues.length,
  )

  // 7. Edge sharpness distribution
  const avgEdgeStrength = edgeStrengths.reduce((a, b) => a + b, 0) / edgeStrengths.length

  // Calculate ratios
  const moireRatio = moirePatternScore / (sampleSize || 1)
  const colorAnomalyRatio = colorAnomalies / (sampleSize || 1)
  const pixelPatternRatio = pixelPatternScore / (sampleSize || 1)
  const edgeSharpnessRatio = edgeSharpnessScore / (sampleSize || 1)
  const textureRatio = textureScore / (sampleSize || 1)

  // Scoring system (stricter thresholds)
  let spoofScore = 0
  const reasons: string[] = []

  // Extreme brightness (screen glare or backlight)
  if (avgBrightness > 230 || avgBrightness < 30) {
    spoofScore += 0.25
    reasons.push(avgBrightness > 230 ? "excessive screen brightness" : "insufficient lighting")
  }

  // Low brightness variation (screens are more uniform)
  if (brightnessStdDev < 20) {
    spoofScore += 0.2
    reasons.push("uniform brightness (screen characteristic)")
  }

  // Moire patterns (stricter threshold)
  if (moireRatio > 0.12) {
    spoofScore += 0.25
    reasons.push("moire interference patterns")
  }

  // Color anomalies (RGB imbalance)
  if (colorAnomalyRatio > 0.15) {
    spoofScore += 0.2
    reasons.push("color artifacts")
  }

  // Pixel grid patterns (LCD/LED)
  if (pixelPatternRatio > 0.2) {
    spoofScore += 0.25
    reasons.push("screen pixel grid detected")
  }

  // Soft edges (photo of screen)
  if (edgeSharpnessRatio > 0.3 || avgEdgeStrength < 15) {
    spoofScore += 0.2
    reasons.push("soft edges (photo characteristic)")
  }

  // Uniform texture (screen)
  if (textureRatio > 0.4) {
    spoofScore += 0.2
    reasons.push("uniform texture (screen surface)")
  }

  // More strict: require higher score to flag as spoof
  const isSpoof = spoofScore >= 0.6 // Increased from 0.5
  const confidence = isSpoof ? Math.min(spoofScore, 1.0) : 1.0 - spoofScore

  return {
    isSpoof,
    confidence,
    reason: isSpoof ? `Screen spoof detected: ${reasons.join(", ")}` : undefined,
  }
}

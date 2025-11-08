
import type * as FaceAPI from "face-api.js"

let faceApiInstance: typeof FaceAPI | null = null
let modelsLoaded = false

export async function loadFaceApi(): Promise<typeof FaceAPI> {
  if (faceApiInstance) return faceApiInstance

  const faceapi = await import("face-api.js")
  faceApiInstance = faceapi
  return faceapi
}

export async function loadFaceApiModels(): Promise<typeof FaceAPI> {
  const faceapi = await loadFaceApi()

  if (modelsLoaded) return faceapi

//   const MODEL_URL = "/models"
const MODEL_URL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

  // Create a timeout promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Face API model loading timeout after 30 seconds")), 30000)
  })

  try {
    // Race between model loading and timeout
    await Promise.race([
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]),
      timeoutPromise,
    ])

    modelsLoaded = true
    console.log("[v0] Face API models loaded successfully")
    return faceapi
  } catch (error) {
    console.error("[v0] Failed to load face API models:", error)
    throw error
  }
}

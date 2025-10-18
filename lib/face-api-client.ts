
"use client"
import * as faceapi from "face-api.js"

let loadPromise: Promise<typeof faceapi> | null = null

export async function loadFaceApiModels(): Promise<typeof faceapi> {
  if (loadPromise) return loadPromise
  loadPromise = (async () => {
    // const base = "/models" // models must exist in public/models
const base = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(base),
      faceapi.nets.faceLandmark68Net.loadFromUri(base),
      faceapi.nets.faceRecognitionNet.loadFromUri(base),
    ])
    return faceapi
  })()
  return loadPromise
}

// Utility function for forms; no change required
// Enrollment (people-form.tsx) still uses face-api detection + descriptors.
// Recognition path (faceid page) now loads only recognition net locally.

"use client"

type UploadResult = { url: string; public_id?: string }

export function useCloudinaryUpload() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET

  async function uploadFile(file: File): Promise<UploadResult> {
    if (!cloudName || !uploadPreset) {
      // Fallback: create a local object URL (not persistent) so the UI still works with mock data.
      const url = URL.createObjectURL(file)
      console.warn(
        "[Cloudinary] Env vars missing, using local URL fallback. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET in Project Settings.",
      )
      return { url }
    }
    const form = new FormData()
    form.append("file", file)
    form.append("upload_preset", uploadPreset)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: "POST",
      body: form,
    })
    if (!res.ok) throw new Error("Cloudinary upload failed")
    const data = await res.json()
    return { url: data.secure_url, public_id: data.public_id }
  }

  return { uploadFile, hasCloudinary: !!(cloudName && uploadPreset) }
}

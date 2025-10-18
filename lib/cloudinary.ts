export async function deleteCloudinaryImage(imageUrl: string): Promise<boolean> {
  if (!imageUrl || !imageUrl.includes("cloudinary.com")) {
    return true // Not a Cloudinary image, nothing to delete
  }

  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/public_id.jpg
    const urlParts = imageUrl.split("/")
    const uploadIndex = urlParts.findIndex((part) => part === "upload")
    if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
      console.warn("[cloudinary] Could not extract public_id from URL:", imageUrl)
      return false
    }

    // Get the public_id (remove file extension)
    const publicIdWithExt = urlParts.slice(uploadIndex + 2).join("/")
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "")

    const cloudinary = require("cloudinary").v2
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === "ok"
  } catch (error) {
    console.error("[cloudinary] Failed to delete image:", error)
    return false
  }
}

import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Face Attendance System",
    short_name: "FaceAttend ",
    description: "Advanced digital attendance and employee management system with Face ID recognition",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/logo3.jpg",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo3.jpg",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo3.jpg",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo3.jpg",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo3.jpg",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable",    
      },
      {
        src: "/logo3.jpg",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo3.jpg",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo3.jpg",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["business", "productivity", "education"],
    screenshots: [
      {
        src: "/logo3.jpg",
        sizes: "540x720",
        type: "image/png",
      },
    ],
  }
}

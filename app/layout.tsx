// // // // import type React from "react"
// // // // import type { Metadata } from "next"
// // // // import { Geist, Geist_Mono } from "next/font/google"
// // // // import { Navbar } from "@/components/navbar"
// // // // import "./globals.css"

// // // // const geistSans = Geist({
// // // //   subsets: ["latin"],
// // // //   display: "swap",
// // // //   variable: "--font-geist-sans",
// // // // })

// // // // const geistMono = Geist_Mono({
// // // //   subsets: ["latin"],
// // // //   display: "swap",
// // // //   variable: "--font-geist-mono",
// // // // })

// // // // export const metadata: Metadata = {
// // // //   title: "Thota's Attendance System",
// // // //   description:
// // // //     "Advanced digital attendance and employee management system with Face ID recognition",
// // // //   generator: "Thota's Services",
// // // //   icons: {
// // // //     icon: "/logo1.png",
// // // //     shortcut: "/logo1.png",
// // // //   },
// // // //   openGraph: {
// // // //     title: "Thota's Attendance System",
// // // //     description:
// // // //       "Smart attendance and employee tracking system with Face ID recognition",
// // // //     images: [
// // // //       {
// // // //         url: "/logo2.gif", // ✅ animated GIF instead of static image
// // // //         width: 768,
// // // //         height: 768,
// // // //         alt: "Animated Thota Attendance System Logo",
// // // //       },
// // // //     ],
// // // //   },
// // // // }


// // // // export default function RootLayout({ children }: { children: React.ReactNode }) {
// // // //   return (
// // // //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// // // //       <body className="font-sans bg-gray-50 text-gray-900">
// // // //         <Navbar />
// // // //         <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
// // // //       </body>
// // // //     </html>
// // // //   )
// // // // }



// // // import type React from "react"
// // // import type { Metadata } from "next"
// // // import { Geist, Geist_Mono } from "next/font/google"
// // // import { Navbar } from "@/components/navbar"
// // // import "./globals.css"

// // // // ✅ Font setup
// // // const geistSans = Geist({
// // //   subsets: ["latin"],
// // //   display: "swap",
// // //   variable: "--font-geist-sans",
// // // })

// // // const geistMono = Geist_Mono({
// // //   subsets: ["latin"],
// // //   display: "swap",
// // //   variable: "--font-geist-mono",
// // // })

// // // // ✅ Site metadata with animated GIF preview
// // // export const metadata: Metadata = {
// // //   title: "Thota's Attendance System",
// // //   description:
// // //     "Advanced digital attendance and employee management system with Face ID recognition.",
// // //   generator: "Thota's Services",
// // //   icons: {
// // //     icon: "/logo1.png",
// // //     shortcut: "/logo1.png",
// // //     apple: "/logo1.png",
// // //   },
// // //   openGraph: {
// // //     title: "Thota's Attendance System",
// // //     description:
// // //       "Smart attendance and employee tracking system with Face ID recognition.",
// // //     type: "website",
// // //     url: "https://liveattendecev2.netlify.app/", // 🔁 optional: replace with your actual domain
// // //     images: [
// // //       {
// // //         url: "/logo2.gif", // ✅ animated GIF
// // //         width: 768,
// // //         height: 768,
// // //         alt: "Animated Thota Attendance System Logo",
// // //       },
// // //     ],
// // //   },
// // //   twitter: {
// // //     card: "summary_large_image",
// // //     title: "Thota's Attendance System",
// // //     description:
// // //       "Next-gen attendance tracking with Face ID technology.",
// // //     images: ["/logo2.gif"], // ✅ Twitter supports GIF too
// // //   },
// // // }

// // // // ✅ Root layout component
// // // export default function RootLayout({ children }: { children: React.ReactNode }) {
// // //   return (
// // //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// // //       <body className="font-sans bg-gray-50 text-gray-900">
// // //         <Navbar />
// // //         <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
// // //       </body>
// // //     </html>
// // //   )
// // // }



// // import type React from "react"
// // import type { Metadata } from "next"
// // import { Geist, Geist_Mono } from "next/font/google"
// // import { Navbar } from "@/components/navbar"
// // import "./globals.css"

// // const geistSans = Geist({
// //   subsets: ["latin"],
// //   display: "swap",
// //   variable: "--font-geist-sans",
// // })

// // const geistMono = Geist_Mono({
// //   subsets: ["latin"],
// //   display: "swap",
// //   variable: "--font-geist-mono",
// // })

// // export const metadata: Metadata = {
// //   // ✅ Fixed: added metadataBase for proper OG/Twitter image URLs
// //   metadataBase: new URL("https://liveattendecev2.netlify.app"),
// //   title: "Thota's Attendance System",
// //   description:
// //     "Advanced digital attendance and employee management system with Face ID recognition.",
// //   generator: "Thota's Services",
// //   icons: {
// //     icon: "/logo1.png",
// //     shortcut: "/logo1.png",
// //     apple: "/logo1.png",
// //   },
// //   openGraph: {
// //     title: "Thota's Attendance System",
// //     description:
// //       "Smart attendance and employee tracking system with Face ID recognition.",
// //     type: "website",
// //     url: "https://liveattendecev2.netlify.app",
// //     images: [
// //       {
// //         url: "/logo2.gif", // ✅ animated logo
// //         width: 768,
// //         height: 768,
// //         alt: "Animated Thota Attendance System Logo",
// //       },
// //     ],
// //   },
// //   twitter: {
// //     card: "summary_large_image",
// //     title: "Thota's Attendance System",
// //     description:
// //       "Next-gen attendance tracking with Face ID technology.",
// //     images: ["/logo2.gif"],
// //   },
// // }

// // export default function RootLayout({ children }: { children: React.ReactNode }) {
// //   return (
// //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// //       <body className="font-sans bg-gray-50 text-gray-900">
// //         <Navbar />
// //         <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
// //       </body>
// //     </html>
// //   )
// // }



// import type React from "react"
// import type { Metadata } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
// import { Navbar } from "@/components/navbar"
// import "./globals.css"

// // ✅ Google Fonts
// const geistSans = Geist({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-geist-sans",
// })

// const geistMono = Geist_Mono({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-geist-mono",
// })

// // ✅ Site metadata with animated .mp4 logo
// export const metadata: Metadata = {
//   metadataBase: new URL("https://liveattendecev2.netlify.app"),
//   title: "Thota's Attendance System",
//   description:
//     "Advanced digital attendance and employee management system with Face ID recognition.",
//   generator: "Thota's Services",
//   icons: {
//     icon: "/logo1.png",
//     shortcut: "/logo1.png",
//     apple: "/logo1.png",
//   },
//   openGraph: {
//     title: "Thota's Attendance System",
//     description:
//       "Smart attendance and employee tracking system with Face ID recognition.",
//     type: "website",
//     url: "https://liveattendecev2.netlify.app",
//     images: [
//       {
//         url: "/logo1.png", // static fallback image
//         width: 768,
//         height: 768,
//         alt: "Thota Attendance System Logo",
//       },
//     ],
//     videos: [
//       {
//         url: "/logo2.mp4", // ✅ animated video version
//         width: 768,
//         height: 768,
//         type: "video/mp4",
//       },
//     ],
//   },
//   twitter: {
//     card: "player",
//     title: "Thota's Attendance System",
//     description:
//       "Next-gen attendance tracking with Face ID technology.",
//     images: ["/logo1.png"], // fallback static image
//     // player: "https://liveattendecev2.netlify.app/logo2.mp4", // ✅ plays inline on Twitter/X
//   },
// }

// // ✅ Root layout
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html
//       lang="en"
//       className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//     >
//       <body className="font-sans bg-gray-50 text-gray-900">
//         <Navbar />
//         <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

//         {/* ✅ Optional inline animated logo visible on page */}
//         {/* <div className="flex justify-center mt-6">
//           <video
//             src="/logo2.mp4"
//             autoPlay
//             loop
//             muted
//             playsInline
//             className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-xl"
//           />
//         </div> */}
//       </body>
//     </html>
//   )
// }



import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Navbar } from "@/components/navbar"
import "./globals.css"
import { ClientRoot } from "@/components/client-root"
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Live Attendance System",
  description: "Advanced digital attendance and employee management system with Face ID recognition",
   icons: {
    icon: "/logo1.png",
    shortcut: "/logo1.png",
    apple: "/logo1.png",
  },
  generator: "Live Attendence Services",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="font-sans bg-gray-50 text-gray-900">
        <Navbar />
        <ClientRoot>
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </ClientRoot>
        <Toaster />
      </body>
    </html>
  )
}

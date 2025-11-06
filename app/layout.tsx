
// // // // // // // // // // // import type React from "react"
// // // // // // // // // // // import type { Metadata } from "next"
// // // // // // // // // // // import { Geist, Geist_Mono } from "next/font/google"
// // // // // // // // // // // import { Navbar } from "@/components/navbar"
// // // // // // // // // // // import "./globals.css"
// // // // // // // // // // // import { ClientRoot } from "@/components/client-root"
// // // // // // // // // // // import { Toaster } from "@/components/ui/toaster"

// // // // // // // // // // // const geistSans = Geist({
// // // // // // // // // // //   subsets: ["latin"],
// // // // // // // // // // //   display: "swap",
// // // // // // // // // // //   variable: "--font-geist-sans",
// // // // // // // // // // // })

// // // // // // // // // // // const geistMono = Geist_Mono({
// // // // // // // // // // //   subsets: ["latin"],
// // // // // // // // // // //   display: "swap",
// // // // // // // // // // //   variable: "--font-geist-mono",
// // // // // // // // // // // })

// // // // // // // // // // // export const metadata: Metadata = {
// // // // // // // // // // //   title: "Face Attendance System",
// // // // // // // // // // //   description: "Advanced digital attendance and employee management system with Face ID recognition",
// // // // // // // // // // //    icons: {
// // // // // // // // // // //     icon: "/logo1.png",
// // // // // // // // // // //     shortcut: "/logo1.png",
// // // // // // // // // // //     apple: "/logo1.png",
// // // // // // // // // // //   },
// // // // // // // // // // //   generator: "Face Attendence Services",
// // // // // // // // // // // }

// // // // // // // // // // // export default function RootLayout({ children }: { children: React.ReactNode }) {
// // // // // // // // // // //   return (
// // // // // // // // // // //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// // // // // // // // // // //       <body className="font-sans bg-gray-50 text-gray-900">
// // // // // // // // // // //         <Navbar />
// // // // // // // // // // //         <ClientRoot>
// // // // // // // // // // //           <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
// // // // // // // // // // //         </ClientRoot>
// // // // // // // // // // //         <Toaster />
// // // // // // // // // // //       </body>
// // // // // // // // // // //     </html>
// // // // // // // // // // //   )
// // // // // // // // // // // }




// // // // // // // // // // import type React from "react"
// // // // // // // // // // import type { Metadata } from "next"
// // // // // // // // // // import { Geist, Geist_Mono } from "next/font/google"
// // // // // // // // // // import { Navbar } from "@/components/navbar"
// // // // // // // // // // import "./globals.css"
// // // // // // // // // // import { ClientRoot } from "@/components/client-root"
// // // // // // // // // // import { Toaster } from "@/components/ui/toaster"
// // // // // // // // // // import { PWAManager } from "@/components/pwa-manager"

// // // // // // // // // // const geistSans = Geist({
// // // // // // // // // //   subsets: ["latin"],
// // // // // // // // // //   display: "swap",
// // // // // // // // // //   variable: "--font-geist-sans",
// // // // // // // // // // })

// // // // // // // // // // const geistMono = Geist_Mono({
// // // // // // // // // //   subsets: ["latin"],
// // // // // // // // // //   display: "swap",
// // // // // // // // // //   variable: "--font-geist-mono",
// // // // // // // // // // })

// // // // // // // // // // export const metadata: Metadata = {
// // // // // // // // // //   title: "Face  Attendance System",
// // // // // // // // // //   description: "Advanced digital attendance and employee management system with Face ID recognition",
// // // // // // // // // //    icons: {
// // // // // // // // // //     icon: "/logo3.jpg",
// // // // // // // // // //     shortcut: "/logo3.jpg",
// // // // // // // // // //     apple: "/logo3.jpg",
// // // // // // // // // //   },
// // // // // // // // // //   generator: "Face Attendece Services",
// // // // // // // // // //   manifest: "/manifest.json",
// // // // // // // // // //   appleWebApp: {
// // // // // // // // // //     capable: true,
// // // // // // // // // //     statusBarStyle: "default",
// // // // // // // // // //     title: "FaceAttend",
// // // // // // // // // //   },
// // // // // // // // // //   formatDetection: {
// // // // // // // // // //     telephone: false,
// // // // // // // // // //   },
// // // // // // // // // //   themeColor: "#3b82f6",
// // // // // // // // // //   viewport: {
// // // // // // // // // //     width: "device-width",
// // // // // // // // // //     initialScale: 1,
// // // // // // // // // //     maximumScale: 1,
// // // // // // // // // //     userScalable: false,
// // // // // // // // // //   },
// // // // // // // // // // }

// // // // // // // // // // export default function RootLayout({ children }: { children: React.ReactNode }) {
// // // // // // // // // //   return (
// // // // // // // // // //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// // // // // // // // // //       <head>
// // // // // // // // // //         <link rel="apple-touch-icon" href="/logo3.jpg" />
// // // // // // // // // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // // // // // // // // //         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
// // // // // // // // // //         <meta name="mobile-web-app-capable" content="yes" />
// // // // // // // // // //       </head>
// // // // // // // // // //       <body className="font-sans bg-gray-50 text-gray-900">
// // // // // // // // // //         <Navbar />
// // // // // // // // // //         <ClientRoot>
// // // // // // // // // //           <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
// // // // // // // // // //         </ClientRoot>
// // // // // // // // // //         <Toaster />
// // // // // // // // // //         <PWAManager />
// // // // // // // // // //       </body>
// // // // // // // // // //     </html>
// // // // // // // // // //   )
// // // // // // // // // // }





// // // // // // // // // import type React from "react"
// // // // // // // // // import type { Metadata, Viewport } from "next"
// // // // // // // // // import { Geist, Geist_Mono } from "next/font/google"
// // // // // // // // // import { Navbar } from "@/components/navbar"
// // // // // // // // // import "./globals.css"
// // // // // // // // // import { ClientRoot } from "@/components/client-root"
// // // // // // // // // import { Toaster } from "@/components/ui/toaster"
// // // // // // // // // import { PWAManager } from "@/components/pwa-manager"

// // // // // // // // // const geistSans = Geist({
// // // // // // // // //   subsets: ["latin"],
// // // // // // // // //   display: "swap",
// // // // // // // // //   variable: "--font-geist-sans",
// // // // // // // // // })

// // // // // // // // // const geistMono = Geist_Mono({
// // // // // // // // //   subsets: ["latin"],
// // // // // // // // //   display: "swap",
// // // // // // // // //   variable: "--font-geist-mono",
// // // // // // // // // })

// // // // // // // // // export const metadata: Metadata = {
// // // // // // // // //   title: "Face Attendece  System",
// // // // // // // // //   description: "Advanced digital attendance and employee management system with Face ID recognition",
// // // // // // // // //   icons: {
// // // // // // // // //     icon: "/logo3.jpg",
// // // // // // // // //     shortcut: "/logo3.jpg",
// // // // // // // // //     apple: "/logo3.jpg",
// // // // // // // // //   },
// // // // // // // // //   generator: "Face Attendece Services",
// // // // // // // // //   manifest: "/manifest.json",
// // // // // // // // //   appleWebApp: {
// // // // // // // // //     capable: true,
// // // // // // // // //     statusBarStyle: "default",
// // // // // // // // //     title: "Face Attendece",
// // // // // // // // //   },
// // // // // // // // //   formatDetection: {
// // // // // // // // //     telephone: false,
// // // // // // // // //   },
// // // // // // // // // }

// // // // // // // // // export const viewport: Viewport = {
// // // // // // // // //   width: "device-width",
// // // // // // // // //   initialScale: 1,
// // // // // // // // //   maximumScale: 1,
// // // // // // // // //   userScalable: false,
// // // // // // // // //   themeColor: "#3b82f6",
// // // // // // // // // }

// // // // // // // // // export default function RootLayout({ children }: { children: React.ReactNode }) {
// // // // // // // // //   return (
// // // // // // // // //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// // // // // // // // //       <head>
// // // // // // // // //         <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
// // // // // // // // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // // // // // // // //         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
// // // // // // // // //         <meta name="mobile-web-app-capable" content="yes" />
// // // // // // // // //       </head>
// // // // // // // // //       <body className="font-sans bg-gray-50 text-gray-900">
// // // // // // // // //         <Navbar />
// // // // // // // // //         <ClientRoot>
// // // // // // // // //           <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
// // // // // // // // //         </ClientRoot>
// // // // // // // // //         <Toaster />
// // // // // // // // //         <PWAManager />
// // // // // // // // //       </body>
// // // // // // // // //     </html>
// // // // // // // // //   )
// // // // // // // // // }




// // // // // // // // import type React from "react"
// // // // // // // // import type { Metadata, Viewport } from "next"
// // // // // // // // import { Geist, Geist_Mono } from "next/font/google"
// // // // // // // // import { Navbar } from "@/components/navbar"
// // // // // // // // import "./globals.css"
// // // // // // // // import { ClientRoot } from "@/components/client-root"
// // // // // // // // import { Toaster } from "@/components/ui/toaster"
// // // // // // // // import { PWAManager } from "@/components/pwa-manager"

// // // // // // // // const geistSans = Geist({
// // // // // // // //   subsets: ["latin"],
// // // // // // // //   display: "swap",
// // // // // // // //   variable: "--font-geist-sans",
// // // // // // // // })

// // // // // // // // const geistMono = Geist_Mono({
// // // // // // // //   subsets: ["latin"],
// // // // // // // //   display: "swap",
// // // // // // // //   variable: "--font-geist-mono",
// // // // // // // // })

// // // // // // // // export const metadata: Metadata = {
// // // // // // // //   title: "FaceAttendance System",
// // // // // // // //   description: "Advanced digital attendance and employee management system with Face ID recognition",
// // // // // // // //   generator: "Face Attendance Services",
// // // // // // // //   icons: {
// // // // // // // //     icon: "/logo3.jpg",
// // // // // // // //     shortcut: "/logo3.jpg",
// // // // // // // //     apple: "/logo3.jpg",
// // // // // // // //   },
// // // // // // // //   manifest: "/manifest.json",
// // // // // // // //   appleWebApp: {
// // // // // // // //     capable: true,
// // // // // // // //     statusBarStyle: "default",
// // // // // // // //     title: "FaceAttendance",
// // // // // // // //   },
// // // // // // // //   formatDetection: {
// // // // // // // //     telephone: false,
// // // // // // // //   },
// // // // // // // // }

// // // // // // // // export const viewport: Viewport = {
// // // // // // // //   width: "device-width",
// // // // // // // //   initialScale: 1,
// // // // // // // //   maximumScale: 1,
// // // // // // // //   userScalable: false,
// // // // // // // //   themeColor: "#3b82f6",
// // // // // // // // }

// // // // // // // // export default function RootLayout({ children }: { children: React.ReactNode }) {
// // // // // // // //   return (
// // // // // // // //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// // // // // // // //       <head>
// // // // // // // //         <link rel="preconnect" href="https://res.cloudinary.com" />
// // // // // // // //         <link rel="dns-prefetch" href="https://res.cloudinary.com" />
// // // // // // // //         <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
// // // // // // // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // // // // // // //         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
// // // // // // // //         <meta name="mobile-web-app-capable" content="yes" />
// // // // // // // //       </head>
// // // // // // // //       <body className="font-sans bg-gray-50 text-gray-900">
// // // // // // // //         <Navbar />
// // // // // // // //         <ClientRoot>
// // // // // // // //           <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
// // // // // // // //         </ClientRoot>
// // // // // // // //         <Toaster />
// // // // // // // //         <PWAManager />
// // // // // // // //       </body>
// // // // // // // //     </html>
// // // // // // // //   )
// // // // // // // // }




// // // // // // // import type React from "react"
// // // // // // // import type { Metadata, Viewport } from "next"
// // // // // // // import { Geist, Geist_Mono } from "next/font/google"
// // // // // // // import { Navbar } from "@/components/navbar"
// // // // // // // import "./globals.css"
// // // // // // // import { ClientRoot } from "@/components/client-root"
// // // // // // // import { Toaster } from "@/components/ui/toaster"
// // // // // // // import { PWAManager } from "@/components/pwa-manager"
// // // // // // // import { ThemeProvider } from "@/contexts/theme-context"

// // // // // // // const geistSans = Geist({
// // // // // // //   subsets: ["latin"],
// // // // // // //   display: "swap",
// // // // // // //   variable: "--font-geist-sans",
// // // // // // // })

// // // // // // // const geistMono = Geist_Mono({
// // // // // // //   subsets: ["latin"],
// // // // // // //   display: "swap",
// // // // // // //   variable: "--font-geist-mono",
// // // // // // // })

// // // // // // // export const metadata: Metadata = {
// // // // // // //   title: "Genamplify Attendance System",
// // // // // // //   description: "Advanced digital attendance and employee management system with Face ID recognition",
// // // // // // //   generator: "Genamplify Services",
// // // // // // //   manifest: "/manifest.json",
// // // // // // //   appleWebApp: {
// // // // // // //     capable: true,
// // // // // // //     statusBarStyle: "default",
// // // // // // //     title: "Genamplify",
// // // // // // //   },
// // // // // // //   formatDetection: {
// // // // // // //     telephone: false,
// // // // // // //   },
// // // // // // // }

// // // // // // // export const viewport: Viewport = {
// // // // // // //   width: "device-width",
// // // // // // //   initialScale: 1,
// // // // // // //   maximumScale: 1,
// // // // // // //   userScalable: false,
// // // // // // //   themeColor: "#3b82f6",
// // // // // // // }

// // // // // // // export default function RootLayout({ children }: { children: React.ReactNode }) {
// // // // // // //   return (
// // // // // // //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// // // // // // //       <head>
// // // // // // //         <link rel="preconnect" href="https://res.cloudinary.com" />
// // // // // // //         <link rel="dns-prefetch" href="https://res.cloudinary.com" />
// // // // // // //         <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
// // // // // // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // // // // // //         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
// // // // // // //         <meta name="mobile-web-app-capable" content="yes" />
// // // // // // //       </head>
// // // // // // //       <body className="font-sans bg-background text-foreground">
// // // // // // //         <ThemeProvider>
// // // // // // //           <Navbar />
// // // // // // //           <ClientRoot>
// // // // // // //             <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
// // // // // // //           </ClientRoot>
// // // // // // //           <Toaster />
// // // // // // //           <PWAManager />
// // // // // // //         </ThemeProvider>
// // // // // // //       </body>
// // // // // // //     </html>
// // // // // // //   )
// // // // // // // }



// // // // // // import type React from "react"
// // // // // // import type { Metadata, Viewport } from "next"
// // // // // // import { Geist, Geist_Mono } from "next/font/google"
// // // // // // import { Navbar } from "@/components/navbar"
// // // // // // import "./globals.css"
// // // // // // import { ClientRoot } from "@/components/client-root"
// // // // // // import { Toaster } from "@/components/ui/toaster"
// // // // // // import { PWAManager } from "@/components/pwa-manager"
// // // // // // import { ThemeProvider } from "@/contexts/theme-context"
// // // // // // import { SessionResume } from "@/components/session-resume"

// // // // // // const geistSans = Geist({
// // // // // //   subsets: ["latin"],
// // // // // //   display: "swap",
// // // // // //   variable: "--font-geist-sans",
// // // // // // })

// // // // // // const geistMono = Geist_Mono({
// // // // // //   subsets: ["latin"],
// // // // // //   display: "swap",
// // // // // //   variable: "--font-geist-mono",
// // // // // // })

// // // // // // export const metadata: Metadata = {
// // // // // //   title: "Genamplify Attendance System",
// // // // // //   description: "Advanced digital attendance and employee management system with Face ID recognition",
// // // // // //   generator: "Genamplify Services",
// // // // // //   manifest: "/manifest.json",
// // // // // //   appleWebApp: {
// // // // // //     capable: true,
// // // // // //     statusBarStyle: "default",
// // // // // //     title: "Genamplify",
// // // // // //   },
// // // // // //   formatDetection: {
// // // // // //     telephone: false,
// // // // // //   },
// // // // // // }

// // // // // // export const viewport: Viewport = {
// // // // // //   width: "device-width",
// // // // // //   initialScale: 1,
// // // // // //   maximumScale: 1,
// // // // // //   userScalable: false,
// // // // // //   themeColor: "#3b82f6",
// // // // // // }

// // // // // // export default function RootLayout({ children }: { children: React.ReactNode }) {
// // // // // //   return (
// // // // // //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// // // // // //       <head>
// // // // // //         <link rel="preconnect" href="https://res.cloudinary.com" />
// // // // // //         <link rel="dns-prefetch" href="https://res.cloudinary.com" />
// // // // // //         <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
// // // // // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // // // // //         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
// // // // // //         <meta name="mobile-web-app-capable" content="yes" />
// // // // // //       </head>
// // // // // //       <body className="font-sans bg-background text-foreground">
// // // // // //         <ThemeProvider>
// // // // // //           <SessionResume />
// // // // // //           <Navbar />
// // // // // //           <ClientRoot>
// // // // // //             <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
// // // // // //           </ClientRoot>
// // // // // //           <Toaster />
// // // // // //           <PWAManager />
// // // // // //         </ThemeProvider>
// // // // // //       </body>
// // // // // //     </html>
// // // // // //   )
// // // // // // }




// // // // // import type React from "react"
// // // // // import type { Metadata, Viewport } from "next"
// // // // // import { Geist, Geist_Mono } from "next/font/google"
// // // // // import { Navbar } from "@/components/navbar"
// // // // // import "./globals.css"
// // // // // import { ClientRoot } from "@/components/client-root"
// // // // // import { Toaster } from "@/components/ui/toaster"
// // // // // import { PWAManager } from "@/components/pwa-manager"
// // // // // import { ThemeProvider } from "@/contexts/theme-context"
// // // // // import { SessionResume } from "@/components/session-resume"
// // // // // import { MaintenanceAlert } from "@/components/maintenance-alert"
// // // // // import { MaintenanceSpacer } from "@/components/maintenance-spacer"

// // // // // const geistSans = Geist({
// // // // //   subsets: ["latin"],
// // // // //   display: "swap",
// // // // //   variable: "--font-geist-sans",
// // // // // })

// // // // // const geistMono = Geist_Mono({
// // // // //   subsets: ["latin"],
// // // // //   display: "swap",
// // // // //   variable: "--font-geist-mono",
// // // // // })

// // // // // export const metadata: Metadata = {
// // // // //   title: "Genamplify Attendance System",
// // // // //   description: "Advanced digital attendance and employee management system with Face ID recognition",
// // // // //   generator: "Genamplify Services",
// // // // //   manifest: "/manifest.json",
// // // // //   appleWebApp: {
// // // // //     capable: true,
// // // // //     statusBarStyle: "default",
// // // // //     title: "Genamplify",
// // // // //   },
// // // // //   formatDetection: {
// // // // //     telephone: false,
// // // // //   },
// // // // // }

// // // // // export const viewport: Viewport = {
// // // // //   width: "device-width",
// // // // //   initialScale: 1,
// // // // //   maximumScale: 1,
// // // // //   userScalable: false,
// // // // //   themeColor: "#3b82f6",
// // // // // }

// // // // // export default function RootLayout({ children }: { children: React.ReactNode }) {
// // // // //   return (
// // // // //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// // // // //       <head>
// // // // //         <link rel="preconnect" href="https://res.cloudinary.com" />
// // // // //         <link rel="dns-prefetch" href="https://res.cloudinary.com" />
// // // // //         <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
// // // // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // // // //         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
// // // // //         <meta name="mobile-web-app-capable" content="yes" />
// // // // //       </head>
// // // // //       <body className="font-sans bg-background text-foreground">
// // // // //         <ThemeProvider>
// // // // //           <SessionResume />
// // // // //           <MaintenanceAlert />
// // // // //           <MaintenanceSpacer />
// // // // //           <Navbar />
// // // // //           <ClientRoot>
// // // // //             <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
// // // // //           </ClientRoot>
// // // // //           <Toaster />
// // // // //           <PWAManager />
// // // // //         </ThemeProvider>
// // // // //       </body>
// // // // //     </html>
// // // // //   )
// // // // // }



// // // // import type React from "react"
// // // // import type { Metadata, Viewport } from "next"
// // // // import { Geist, Geist_Mono } from "next/font/google"
// // // // import { Navbar } from "@/components/navbar"
// // // // import "./globals.css"
// // // // import { ClientRoot } from "@/components/client-root"
// // // // import { Toaster } from "@/components/ui/toaster"
// // // // import { PWAManager } from "@/components/pwa-manager"
// // // // import { ThemeProvider } from "@/contexts/theme-context"
// // // // import { SessionResume } from "@/components/session-resume"
// // // // import { MaintenanceAlert } from "@/components/maintenance-alert"
// // // // import { MaintenanceSpacer } from "@/components/maintenance-spacer"
// // // // import { NotificationSoundPlayer } from "@/components/notification-sound-player"
// // // // import { InAppNotificationToast } from "@/components/in-app-notification-toast"

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
// // // //   title: "Genamplify Attendance System",
// // // //   description: "Advanced digital attendance and employee management system with Face ID recognition",
// // // //   generator: "Genamplify Services",
// // // //   manifest: "/manifest.json",
// // // //   appleWebApp: {
// // // //     capable: true,
// // // //     statusBarStyle: "default",
// // // //     title: "Genamplify",
// // // //   },
// // // //   formatDetection: {
// // // //     telephone: false,
// // // //   },
// // // // }

// // // // export const viewport: Viewport = {
// // // //   width: "device-width",
// // // //   initialScale: 1,
// // // //   maximumScale: 1,
// // // //   userScalable: false,
// // // //   themeColor: "#3b82f6",
// // // // }

// // // // export default function RootLayout({ children }: { children: React.ReactNode }) {
// // // //   return (
// // // //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// // // //       <head>
// // // //         <link rel="preconnect" href="https://res.cloudinary.com" />
// // // //         <link rel="dns-prefetch" href="https://res.cloudinary.com" />
// // // //         <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
// // // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // // //         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
// // // //         <meta name="mobile-web-app-capable" content="yes" />
// // // //       </head>
// // // //       <body className="font-sans bg-background text-foreground">
// // // //         <ThemeProvider>
// // // //           <SessionResume />
// // // //           <MaintenanceAlert />
// // // //           <MaintenanceSpacer />
// // // //           <NotificationSoundPlayer />
// // // //           <InAppNotificationToast />
// // // //           <Navbar />
// // // //           <ClientRoot>
// // // //             <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
// // // //           </ClientRoot>
// // // //           <Toaster />
// // // //           <PWAManager />
// // // //         </ThemeProvider>
// // // //       </body>
// // // //     </html>
// // // //   )
// // // // }



// // // import type React from "react"
// // // import type { Metadata, Viewport } from "next"
// // // import { Geist, Geist_Mono } from "next/font/google"
// // // import { Navbar } from "@/components/navbar"
// // // import "./globals.css"
// // // import { ClientRoot } from "@/components/client-root"
// // // import { Toaster } from "@/components/ui/toaster"
// // // import { PWAManager } from "@/components/pwa-manager"
// // // import { ThemeProvider } from "@/contexts/theme-context"
// // // import { SessionResume } from "@/components/session-resume"
// // // import { MaintenanceAlert } from "@/components/maintenance-alert"
// // // import { MaintenanceSpacer } from "@/components/maintenance-spacer"
// // // import { NotificationSoundPlayer } from "@/components/notification-sound-player"
// // // import { InAppNotificationToast } from "@/components/in-app-notification-toast"

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

// // // export const metadata: Metadata = {
// // //   title: "Face Attendance System",
// // //   description: "Advanced digital attendance and employee management system with Face ID recognition",
// // //   generator: "Face Attendance Services",
// // //   manifest: "/manifest.json",
// // //   appleWebApp: {
// // //     capable: true,
// // //     statusBarStyle: "default",
// // //     title: "Face Attendance",
// // //   },
// // //   formatDetection: {
// // //     telephone: false,
// // //   },
// // //   icons: {
// // //     icon: "/logo3.jpg",
// // //     shortcut: "/logo3.jpg",
// // //     apple: "/logo3.jpg",
// // //   },
// // // }

// // // export const viewport: Viewport = {
// // //   width: "device-width",
// // //   initialScale: 1,
// // //   maximumScale: 1,
// // //   userScalable: false,
// // //   themeColor: "#3b82f6",
// // // }

// // // export default function RootLayout({ children }: { children: React.ReactNode }) {
// // //   return (
// // //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// // //       <head>
// // //         <link rel="preconnect" href="https://res.cloudinary.com" />
// // //         <link rel="dns-prefetch" href="https://res.cloudinary.com" />
// // //         <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
// // //         <meta name="apple-mobile-web-app-capable" content="yes" />
// // //         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
// // //         <meta name="mobile-web-app-capable" content="yes" />
// // //       </head>
// // //       <body className="font-sans bg-background text-foreground">
// // //         <ThemeProvider>
// // //           <SessionResume />
// // //           <MaintenanceAlert />
// // //           <MaintenanceSpacer />
// // //           <NotificationSoundPlayer />
// // //           <InAppNotificationToast />
// // //           <Navbar />
// // //           <ClientRoot>
// // //             <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
// // //           </ClientRoot>
// // //           <Toaster />
// // //           <PWAManager />
// // //         </ThemeProvider>
// // //       </body>
// // //     </html>
// // //   )
// // // }


// // import type React from "react"
// // import type { Metadata, Viewport } from "next"
// // import { Geist, Geist_Mono } from "next/font/google"
// // import { Navbar } from "@/components/navbar"
// // import "./globals.css"
// // import { ClientRoot } from "@/components/client-root"
// // import { Toaster } from "@/components/ui/toaster"
// // import dynamic from "next/dynamic"
// // import { ThemeProvider } from "@/contexts/theme-context"
// // import { SessionResume } from "@/components/session-resume"

// // const PWAManager = dynamic(() => import("@/components/pwa-manager").then((mod) => ({ default: mod.PWAManager })), {
// //   ssr: false,
// //   loading: () => null,
// // })

// // const MaintenanceAlert = dynamic(
// //   () => import("@/components/maintenance-alert").then((mod) => ({ default: mod.MaintenanceAlert })),
// //   {
// //     ssr: false,
// //     loading: () => null,
// //   },
// // )

// // const MaintenanceSpacer = dynamic(
// //   () => import("@/components/maintenance-spacer").then((mod) => ({ default: mod.MaintenanceSpacer })),
// //   {
// //     ssr: false,
// //     loading: () => null,
// //   },
// // )

// // const NotificationSoundPlayer = dynamic(
// //   () => import("@/components/notification-sound-player").then((mod) => ({ default: mod.NotificationSoundPlayer })),
// //   {
// //     ssr: false,
// //     loading: () => null,
// //   },
// // )

// // const InAppNotificationToast = dynamic(
// //   () => import("@/components/in-app-notification-toast").then((mod) => ({ default: mod.InAppNotificationToast })),
// //   {
// //     ssr: false,
// //     loading: () => null,
// //   },
// // )

// // const geistSans = Geist({
// //   subsets: ["latin"],
// //   display: "swap",
// //   variable: "--font-geist-sans",
// //   preload: true,
// // })

// // const geistMono = Geist_Mono({
// //   subsets: ["latin"],
// //   display: "swap",
// //   variable: "--font-geist-mono",
// //   preload: false,
// // })

// // export const metadata: Metadata = {
// //   title: "Face Attendance System",
// //   description: "Advanced digital attendance and employee management system with Face ID recognition",
// //   generator: "Face Attendance Services",
// //   manifest: "/manifest.json",
// //   appleWebApp: {
// //     capable: true,
// //     statusBarStyle: "default",
// //     title: "Face Attendance",
// //   },
// //   formatDetection: {
// //     telephone: false,
// //   },
// //   icons: {
// //     icon: "/logo3.jpg",
// //     shortcut: "/logo3.jpg",
// //     apple: "/logo3.jpg",
// //   },
// // }

// // export const viewport: Viewport = {
// //   width: "device-width",
// //   initialScale: 1,
// //   maximumScale: 1,
// //   userScalable: false,
// //   themeColor: "#3b82f6",
// // }

// // export default function RootLayout({ children }: { children: React.ReactNode }) {
// //   return (
// //     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// //       <head>
// //         <link rel="preconnect" href="https://res.cloudinary.com" />
// //         <link rel="dns-prefetch" href="https://res.cloudinary.com" />
// //         <link rel="preload" href="/logo3.jpg" as="image" />
// //         <link rel="apple-touch-icon" href="/logo3.jpg" />
// //         <meta name="apple-mobile-web-app-capable" content="yes" />
// //         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
// //         <meta name="mobile-web-app-capable" content="yes" />
// //       </head>
// //       <body className="font-sans bg-background text-foreground">
// //         <ThemeProvider>
// //           <SessionResume />
// //           <MaintenanceAlert />
// //           <MaintenanceSpacer />
// //           <NotificationSoundPlayer />
// //           <InAppNotificationToast />
// //           <Navbar />
// //           <ClientRoot>
// //             <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
// //           </ClientRoot>
// //           <Toaster />
// //           <PWAManager />
// //         </ThemeProvider>
// //       </body>
// //     </html>
// //   )
// // }



// import type React from "react"
// import type { Metadata, Viewport } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
// import { Navbar } from "@/components/navbar"
// import "./globals.css"
// import { ClientRoot } from "@/components/client-root"
// import { Toaster } from "@/components/ui/toaster"
// import { ThemeProvider } from "@/contexts/theme-context"
// import { SessionResume } from "@/components/session-resume"
// import { ClientProviders } from "@/components/client-providers"

// const geistSans = Geist({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-geist-sans",
//   preload: true,
// })

// const geistMono = Geist_Mono({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-geist-mono",
//   preload: false,
// })

// export const metadata: Metadata = {
//   title: "Face Attendance System",
//   description: "Advanced digital attendance and employee management system with Face ID recognition",
//   generator: "Face Attendance Services",
//   manifest: "/manifest.json",
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: "default",
//     title: "Face Attendance",
//   },
//   formatDetection: {
//     telephone: false,
//   },
//   icons: {
//     icon: "/logo3.jpg",
//     shortcut: "/logo3.jpg",
//     apple: "/logo3.jpg",
//   },
// }

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 1,
//   userScalable: false,
//   themeColor: "#3b82f6",
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
//       <head>
//         <link rel="preconnect" href="https://res.cloudinary.com" />
//         <link rel="dns-prefetch" href="https://res.cloudinary.com" />
//         <link rel="preload" href="/logo3.jpg" as="image" />
//         <link rel="apple-touch-icon" href="/logo3.jpg" />
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
//         <meta name="mobile-web-app-capable" content="yes" />
//       </head>
//       <body className="font-sans bg-background text-foreground">
//         <ThemeProvider>
//           <SessionResume />
//           <ClientProviders />
//           <Navbar />
//           <ClientRoot>
//             <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
//           </ClientRoot>
//           <Toaster />
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }



import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Navbar } from "@/components/navbar"
import "./globals.css"
import { ClientRoot } from "@/components/client-root"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/contexts/theme-context"
import { SessionResume } from "@/components/session-resume"
import { ClientProviders } from "@/components/client-providers"
import { RealTimeNotificationPoller } from "@/components/real-time-notification-poller"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
  preload: true,
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
  preload: false,
})

export const metadata: Metadata = {
  title: "Face Attendance System",
  description: "Advanced digital attendance and employee management system with Face ID recognition",
  generator: "Face Attendance Services",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Face Attendance",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/logo3.jpg",
    shortcut: "/logo3.jpg",
    apple: "/logo3.jpg",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preload" href="/logo3.jpg" as="image" />
        <link rel="apple-touch-icon" href="/logo3.jpg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans bg-background text-foreground">
        <ThemeProvider>
          <SessionResume />
          <ClientProviders />
          <RealTimeNotificationPoller />
          <Navbar />
          <ClientRoot>
            <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          </ClientRoot>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

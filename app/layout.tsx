

import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from 'next/font/google'
import { Navbar } from "@/components/navbar"
import "./globals.css"
import { ClientRoot } from "@/components/client-root"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/contexts/theme-context"
import { SessionResume } from "@/components/session-resume"
import { ClientProviders } from "@/components/client-providers"
import { RealTimeNotificationPoller } from "@/components/real-time-notification-poller"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { OnlineOfflineDetector } from "@/components/online-offline-detector"
import { HeartbeatTracker } from "@/components/heartbeat-tracker"

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
          <OnlineOfflineDetector />
          <SessionResume />
          <ClientProviders />
          <RealTimeNotificationPoller />
          <HeartbeatTracker />
          <Navbar />
          <ClientRoot>
            <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          </ClientRoot>
          <Toaster />
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  )
}

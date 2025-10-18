
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
  title: "Face Attendance System",
  description: "Advanced digital attendance and employee management system with Face ID recognition",
   icons: {
    icon: "/logo1.png",
    shortcut: "/logo1.png",
    apple: "/logo1.png",
  },
  generator: "Face Attendence Services",
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

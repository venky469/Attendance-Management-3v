
"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { MobileInstallPrompt } from "@/components/mobile-install-prompt"

export function ClientRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === "/login"

  return (
    <>
      {isLogin && (
        <header className="w-full flex items-center justify-center py-6">
          {/* <img src="/logo3.jpg" alt="Face Attendance" width={144} height={40} className="h-10 w-auto" /> */}
        </header>
      )}

      {children}

      <MobileInstallPrompt />
    </>
  )
}

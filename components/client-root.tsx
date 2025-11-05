// // "use client"

// // import type React from "react"

// // import { useEffect, useState } from "react"
// // import { usePathname } from "next/navigation"
// // import { MobileInstallPrompt } from "@/components/mobile-install-prompt"

// // export function ClientRoot({ children }: { children: React.ReactNode }) {
// //   const pathname = usePathname()
// //   const isLogin = pathname === "/login"

// //   const [showSplash, setShowSplash] = useState(false)
// //   useEffect(() => {
// //     if (isLogin) {
// //       setShowSplash(true)
// //       const timer = setTimeout(() => setShowSplash(false), 1400)
// //       return () => clearTimeout(timer)
// //     }
// //   }, [isLogin])

// //   return (
// //     <>
// //       {isLogin && (
// //         <header className="w-full flex items-center justify-center py-6">
// //           {/* <img src="/images/logo.jpg" alt="Genamplify" width={144} height={40} className="h-10 w-auto" /> */}
// //         </header>
// //       )}

// //       {children}

// //       <MobileInstallPrompt />

// //       {isLogin && showSplash && (
// //         <div
// //           className="fixed inset-0 z-[60] flex items-center justify-center bg-white/80 backdrop-blur-sm"
// //           aria-live="polite"
// //           aria-busy="true"
// //           role="status"
// //         >
// //           <div className="flex flex-col items-center gap-3">
// //             <img
// //               src="logo3.gif"
// //               alt="Loading..."
// //               width={56}
// //               height={56}
// //               className="h-14 w-14 rounded-md"
// //             />
// //             <p className="text-sm text-gray-600">Preparing sign in…</p>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   )
// // }




// "use client"

// import type React from "react"

// import { usePathname } from "next/navigation"
// import { MobileInstallPrompt } from "@/components/mobile-install-prompt"

// export function ClientRoot({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname()
//   const isLogin = pathname === "/login"

//   return (
//     <>
//       {isLogin && (
//         <header className="w-full flex items-center justify-center py-6">
//           <img src="/logo3.jpg" alt="FaceAttendance" width={144} height={40} className="h-10 w-auto" />
//         </header>
//       )}

//       {children}

//       <MobileInstallPrompt />
//     </>
//   )
// }



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

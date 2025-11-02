// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { RefreshCw, X } from "lucide-react"

// export function PWAUpdatePrompt() {
//   const [showPrompt, setShowPrompt] = useState(false)
//   const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
//   const [isUpdating, setIsUpdating] = useState(false)

//   useEffect(() => {
//     if (!("serviceWorker" in navigator)) return

//     // Listen for service worker updates
//     navigator.serviceWorker.ready.then((reg) => {
//       setRegistration(reg)

//       // Check if there's a waiting service worker
//       if (reg.waiting) {
//         setShowPrompt(true)
//       }

//       // Listen for new service worker installing
//       reg.addEventListener("updatefound", () => {
//         const newWorker = reg.installing
//         if (!newWorker) return

//         newWorker.addEventListener("statechange", () => {
//           if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
//             // New service worker is installed and waiting
//             setShowPrompt(true)
//           }
//         })
//       })
//     })

//     // Listen for controller change (new SW activated)
//     navigator.serviceWorker.addEventListener("controllerchange", () => {
//       console.log("[PWA] New service worker activated, reloading page...")
//       window.location.reload()
//     })
//   }, [])

//   const handleUpdate = () => {
//     if (!registration?.waiting) return

//     setIsUpdating(true)

//     // Send message to waiting service worker to skip waiting
//     registration.waiting.postMessage({ type: "SKIP_WAITING" })

//     // The page will reload automatically when controllerchange event fires
//   }

//   const handleDismiss = () => {
//     setShowPrompt(false)
//   }

//   if (!showPrompt) return null

//   return (
//     <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
//       <Card className="border-primary bg-card p-4 shadow-lg">
//         <div className="flex items-start gap-3">
//           <div className="flex-shrink-0">
//             <RefreshCw className="h-5 w-5 text-primary" />
//           </div>
//           <div className="flex-1 space-y-2">
//             <h3 className="font-semibold text-sm">Update Available</h3>
//             <p className="text-sm text-muted-foreground">
//               A new version of Genamplify is available. Update now to get the latest features and improvements.
//             </p>
//             <div className="flex gap-2 pt-2">
//               <Button size="sm" onClick={handleUpdate} disabled={isUpdating} className="flex-1">
//                 {isUpdating ? (
//                   <>
//                     <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                     Updating...
//                   </>
//                 ) : (
//                   "Update Now"
//                 )}
//               </Button>
//               <Button size="sm" variant="outline" onClick={handleDismiss} disabled={isUpdating}>
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }

// export default PWAUpdatePrompt




"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCw, X, Sparkles } from "lucide-react"
import { getLatestUpdate } from "@/lib/app-version"

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const latestUpdate = getLatestUpdate()

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    // Listen for service worker updates
    navigator.serviceWorker.ready.then((reg) => {
      setRegistration(reg)

      // Check if there's a waiting service worker
      if (reg.waiting) {
        setShowPrompt(true)
      }

      // Listen for new service worker installing
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing
        if (!newWorker) return

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New service worker is installed and waiting
            setShowPrompt(true)
          }
        })
      })
    })

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("[PWA] New service worker activated, reloading page...")
      window.location.reload()
    })
  }, [])

  const handleUpdate = () => {
    if (!registration?.waiting) return

    setIsUpdating(true)

    // Send message to waiting service worker to skip waiting
    registration.waiting.postMessage({ type: "SKIP_WAITING" })

    // The page will reload automatically when controllerchange event fires
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5">
      <Card className="border-primary bg-card p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="rounded-full bg-primary/10 p-2">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-base">New Update Available!</h3>
              <p className="text-xs text-muted-foreground">Version {latestUpdate.version}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">What's New:</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {latestUpdate.features.slice(0, 4).map((feature: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
                {latestUpdate.features.length > 4 && (
                  <li className="text-xs italic">+ {latestUpdate.features.length - 4} more improvements</li>
                )}
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={handleUpdate} disabled={isUpdating} className="flex-1 font-medium">
                {isUpdating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Update Now
                  </>
                )}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismiss} disabled={isUpdating} className="px-3">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PWAUpdatePrompt

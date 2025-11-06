// // "use client"

// // import { useState } from "react"
// // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// // import { Button } from "@/components/ui/button"
// // import { Badge } from "@/components/ui/badge"
// // import { ScrollArea } from "@/components/ui/scroll-area"
// // import { Separator } from "@/components/ui/separator"
// // import { CheckCircle2, Download, X, Calendar, Package, Sparkles } from "lucide-react"
// // import { FEATURE_UPDATES, type FeatureUpdate } from "@/lib/app-version"

// // interface UpdateModalProps {
// //   open: boolean
// //   onOpenChange: (open: boolean) => void
// //   currentVersion: string
// //   latestVersion: string
// //   onUpdate: () => void
// // }

// // export function UpdateModal({ open, onOpenChange, currentVersion, latestVersion, onUpdate }: UpdateModalProps) {
// //   const [updating, setUpdating] = useState(false)

// //   // Get updates between current and latest version
// //   const getUpdatesBetween = (current: string, latest: string): FeatureUpdate[] => {
// //     const updates: FeatureUpdate[] = []
// //     let foundCurrent = false

// //     for (const update of FEATURE_UPDATES) {
// //       if (update.version === current) {
// //         foundCurrent = true
// //         break
// //       }
// //       updates.push(update)
// //     }

// //     return updates
// //   }

// //   const updates = getUpdatesBetween(currentVersion, latestVersion)
// //   const updateCount = updates.length
// //   const latestUpdate = updates[0]

// //   const handleUpdate = async () => {
// //     setUpdating(true)
// //     try {
// //       await onUpdate()
// //       // Wait a bit for the update to process
// //       setTimeout(() => {
// //         window.location.reload()
// //       }, 1000)
// //     } catch (error) {
// //       console.error("Update failed:", error)
// //       setUpdating(false)
// //     }
// //   }

// //   return (
// //     <Dialog open={open} onOpenChange={onOpenChange}>
// //       <DialogContent className="max-w-2xl max-h-[90vh]">
// //         <DialogHeader>
// //           <div className="flex items-start justify-between">
// //             <div className="flex-1">
// //               <DialogTitle className="text-2xl font-bold flex items-center gap-2">
// //                 <Sparkles className="h-6 w-6 text-blue-600" />
// //                 Update Available
// //               </DialogTitle>
// //               <DialogDescription className="mt-2">
// //                 A new version of the app is ready to install with exciting new features and improvements.
// //               </DialogDescription>
// //             </div>
// //           </div>
// //         </DialogHeader>

// //         <div className="space-y-6">
// //           {/* Version Info */}
// //           <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950 rounded-lg border border-blue-200 dark:border-blue-800">
// //             <div className="flex items-center gap-4">
// //               <div className="text-center">
// //                 <p className="text-xs text-muted-foreground mb-1">Current</p>
// //                 <Badge variant="outline" className="text-sm font-mono">
// //                   v{currentVersion}
// //                 </Badge>
// //               </div>
// //               <div className="text-2xl text-muted-foreground">→</div>
// //               <div className="text-center">
// //                 <p className="text-xs text-muted-foreground mb-1">Latest</p>
// //                 <Badge className="text-sm font-mono bg-gradient-to-r from-blue-600 to-teal-600">v{latestVersion}</Badge>
// //               </div>
// //             </div>
// //             <div className="text-right">
// //               <p className="text-xs text-muted-foreground mb-1">Updates</p>
// //               <Badge variant="secondary" className="text-lg font-bold">
// //                 {updateCount}
// //               </Badge>
// //             </div>
// //           </div>

// //           {/* Latest Update Details */}
// //           {latestUpdate && (
// //             <div className="space-y-3">
// //               <div className="flex items-center gap-2">
// //                 <Package className="h-5 w-5 text-blue-600" />
// //                 <h3 className="text-lg font-semibold">What's New in v{latestUpdate.version}</h3>
// //               </div>
// //               <div className="flex items-center gap-2 text-sm text-muted-foreground">
// //                 <Calendar className="h-4 w-4" />
// //                 <span>Released on {new Date(latestUpdate.date).toLocaleDateString()}</span>
// //               </div>
// //               <ul className="space-y-2">
// //                 {latestUpdate.features.map((feature, index) => (
// //                   <li key={index} className="flex items-start gap-2">
// //                     <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
// //                     <span className="text-sm">{feature}</span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           )}

// //           {/* Update History */}
// //           {updateCount > 1 && (
// //             <>
// //               <Separator />
// //               <div className="space-y-3">
// //                 <h3 className="text-lg font-semibold flex items-center gap-2">
// //                   <Calendar className="h-5 w-5 text-muted-foreground" />
// //                   Previous Updates
// //                 </h3>
// //                 <ScrollArea className="h-48 pr-4">
// //                   <div className="space-y-4">
// //                     {updates.slice(1).map((update, index) => (
// //                       <div key={index} className="space-y-2">
// //                         <div className="flex items-center justify-between">
// //                           <Badge variant="outline" className="font-mono">
// //                             v{update.version}
// //                           </Badge>
// //                           <span className="text-xs text-muted-foreground">
// //                             {new Date(update.date).toLocaleDateString()}
// //                           </span>
// //                         </div>
// //                         <ul className="space-y-1 ml-4">
// //                           {update.features.map((feature, fIndex) => (
// //                             <li key={fIndex} className="flex items-start gap-2">
// //                               <span className="text-muted-foreground mt-1">•</span>
// //                               <span className="text-sm text-muted-foreground">{feature}</span>
// //                             </li>
// //                           ))}
// //                         </ul>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </ScrollArea>
// //               </div>
// //             </>
// //           )}

// //           {/* Action Buttons */}
// //           <div className="flex items-center justify-between gap-3 pt-4 border-t">
// //             <Button variant="outline" onClick={() => onOpenChange(false)} disabled={updating}>
// //               <X className="h-4 w-4 mr-2" />
// //               Later
// //             </Button>
// //             <Button
// //               onClick={handleUpdate}
// //               disabled={updating}
// //               className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
// //             >
// //               {updating ? (
// //                 <>
// //                   <Download className="h-4 w-4 mr-2 animate-bounce" />
// //                   Updating...
// //                 </>
// //               ) : (
// //                 <>
// //                   <Download className="h-4 w-4 mr-2" />
// //                   Update Now
// //                 </>
// //               )}
// //             </Button>
// //           </div>

// //           {/* Info Note */}
// //           <p className="text-xs text-muted-foreground text-center">
// //             The app will reload automatically after the update is installed.
// //           </p>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   )
// // }




// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Separator } from "@/components/ui/separator"
// import { CheckCircle2, Download, X, Calendar, Package, Sparkles } from "lucide-react"
// import { FEATURE_UPDATES, type FeatureUpdate } from "@/lib/app-version"

// interface UpdateModalProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   currentVersion: string
//   latestVersion: string
//   onUpdate: () => void
// }

// export function UpdateModal({ open, onOpenChange, currentVersion, latestVersion, onUpdate }: UpdateModalProps) {
//   const [updating, setUpdating] = useState(false)

//   // Get updates between current and latest version
//   const getUpdatesBetween = (current: string, latest: string): FeatureUpdate[] => {
//     const updates: FeatureUpdate[] = []
//     let foundCurrent = false

//     for (const update of FEATURE_UPDATES) {
//       if (update.version === current) {
//         foundCurrent = true
//         break
//       }
//       updates.push(update)
//     }

//     return updates
//   }

//   const updates = getUpdatesBetween(currentVersion, latestVersion)
//   const updateCount = updates.length
//   const latestUpdate = updates[0]

//   const handleUpdate = async () => {
//     setUpdating(true)
//     try {
//       await onUpdate()
//       // Wait a bit for the update to process
//       setTimeout(() => {
//         window.location.reload()
//       }, 1000)
//     } catch (error) {
//       console.error("Update failed:", error)
//       setUpdating(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
//         <DialogHeader>
//           <div className="flex items-start justify-between">
//             <div className="flex-1">
//               <DialogTitle className="text-2xl font-bold flex items-center gap-2">
//                 <Sparkles className="h-6 w-6 text-blue-600" />
//                 Update Available
//               </DialogTitle>
//               <DialogDescription className="mt-2">
//                 A new version of the app is ready to install with exciting new features and improvements.
//               </DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         {/* Version Info */}
//         <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950 rounded-lg border border-blue-200 dark:border-blue-800">
//           <div className="flex items-center gap-4">
//             <div className="text-center">
//               <p className="text-xs text-muted-foreground mb-1">Current</p>
//               <Badge variant="outline" className="text-sm font-mono">
//                 v{currentVersion}
//               </Badge>
//             </div>
//             <div className="text-2xl text-muted-foreground">→</div>
//             <div className="text-center">
//               <p className="text-xs text-muted-foreground mb-1">Latest</p>
//               <Badge className="text-sm font-mono bg-gradient-to-r from-blue-600 to-teal-600">v{latestVersion}</Badge>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-xs text-muted-foreground mb-1">Updates</p>
//             <Badge variant="secondary" className="text-lg font-bold">
//               {updateCount}
//             </Badge>
//           </div>
//         </div>

//         {/* Latest Update Details */}
//         {latestUpdate && (
//           <div className="space-y-3">
//             <div className="flex items-center gap-2">
//               <Package className="h-5 w-5 text-blue-600" />
//               <h3 className="text-lg font-semibold">What's New in v{latestUpdate.version}</h3>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <Calendar className="h-4 w-4" />
//               <span>Released on {new Date(latestUpdate.date).toLocaleDateString()}</span>
//             </div>
//             <ul className="space-y-2">
//               {latestUpdate.features.map((feature, index) => (
//                 <li key={index} className="flex items-start gap-2">
//                   <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <span className="text-sm">{feature}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Update History */}
//         {updateCount > 1 && (
//           <>
//             <Separator />
//             <div className="space-y-3">
//               <h3 className="text-lg font-semibold flex items-center gap-2">
//                 <Calendar className="h-5 w-5 text-muted-foreground" />
//                 Previous Updates
//               </h3>
//               <ScrollArea className="h-48 pr-4">
//                 <div className="space-y-4">
//                   {updates.slice(1).map((update, index) => (
//                     <div key={index} className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <Badge variant="outline" className="font-mono">
//                           v{update.version}
//                         </Badge>
//                         <span className="text-xs text-muted-foreground">
//                           {new Date(update.date).toLocaleDateString()}
//                         </span>
//                       </div>
//                       <ul className="space-y-1 ml-4">
//                         {update.features.map((feature, fIndex) => (
//                           <li key={fIndex} className="flex items-start gap-2">
//                             <span className="text-muted-foreground mt-1">•</span>
//                             <span className="text-sm text-muted-foreground">{feature}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//               </ScrollArea>
//             </div>
//           </>
//         )}

//         {/* Action Buttons */}
//         <div className="space-y-3 pt-4 border-t mt-4">
//           <div className="flex items-center justify-between gap-3">
//             <Button variant="outline" onClick={() => onOpenChange(false)} disabled={updating}>
//               <X className="h-4 w-4 mr-2" />
//               Later
//             </Button>
//             <Button
//               onClick={handleUpdate}
//               disabled={updating}
//               className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
//             >
//               {updating ? (
//                 <>
//                   <Download className="h-4 w-4 mr-2 animate-bounce" />
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <Download className="h-4 w-4 mr-2" />
//                   Update Now
//                 </>
//               )}
//             </Button>
//           </div>

//           {/* Info Note */}
//           <p className="text-xs text-muted-foreground text-center">
//             The app will reload automatically after the update is installed.
//           </p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }



"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Download, X, Calendar, Package, Sparkles } from "lucide-react"
import { FEATURE_UPDATES, type FeatureUpdate } from "@/lib/app-version"

interface UpdateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentVersion: string
  latestVersion: string
  onUpdate: () => void
}

export function UpdateModal({ open, onOpenChange, currentVersion, latestVersion, onUpdate }: UpdateModalProps) {
  const [updating, setUpdating] = useState(false)

  // Get updates between current and latest version
  const getUpdatesBetween = (current: string, latest: string): FeatureUpdate[] => {
    const updates: FeatureUpdate[] = []
    let foundCurrent = false

    for (const update of FEATURE_UPDATES) {
      if (update.version === current) {
        foundCurrent = true
        break
      }
      updates.push(update)
    }

    return updates
  }

  const updates = getUpdatesBetween(currentVersion, latestVersion)
  const updateCount = updates.length
  const latestUpdate = updates[0]

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      await onUpdate()
      // Wait a bit for the update to process
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error("Update failed:", error)
      setUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                Update Available
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm">
                A new version of the app is ready to install with exciting new features and improvements.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Version Info */}
        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-2">
          <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Current</p>
                <Badge variant="outline" className="text-xs sm:text-sm font-mono">
                  v{currentVersion}
                </Badge>
              </div>
              <div className="text-xl sm:text-2xl text-muted-foreground">→</div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Latest</p>
                <Badge className="text-xs sm:text-sm font-mono bg-gradient-to-r from-blue-600 to-teal-600">
                  v{latestVersion}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Updates</p>
              <Badge variant="secondary" className="text-base sm:text-lg font-bold">
                {updateCount}
              </Badge>
            </div>
          </div>

          {/* Latest Update Details */}
          {latestUpdate && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <h3 className="text-base sm:text-lg font-semibold">What's New in v{latestUpdate.version}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Released on {new Date(latestUpdate.date).toLocaleDateString()}</span>
              </div>
              <ul className="space-y-2">
                {latestUpdate.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Update History */}
          {updateCount > 1 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  Previous Updates
                </h3>
                <ScrollArea className="h-40 sm:h-48 pr-2 sm:pr-4">
                  <div className="space-y-4">
                    {updates.slice(1).map((update, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="font-mono text-xs">
                            v{update.version}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(update.date).toLocaleDateString()}
                          </span>
                        </div>
                        <ul className="space-y-1 ml-4">
                          {update.features.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-start gap-2">
                              <span className="text-muted-foreground mt-1">•</span>
                              <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t mt-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updating}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Later
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updating}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              {updating ? (
                <>
                  <Download className="h-4 w-4 mr-2 animate-bounce" />
                  Updating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Update Now
                </>
              )}
            </Button>
          </div>

          {/* Info Note */}
          <p className="text-xs text-muted-foreground text-center">
            The app will reload automatically after the update is installed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}


// "use client"

// import useSWR from "swr"
// import { useEffect, useMemo, useState } from "react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { useToast } from "@/hooks/use-toast"
// import { getStoredUser } from "@/lib/auth"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// type NotificationItem = {
//   id: string
//   title: string
//   message: string
//   audience: "institution" | "admins"
//   institutionName?: string
//   target?: "both" | "staff" | "students"
//   createdBy: { id: string; name: string; role: string }
//   createdAt: string
//   emailAttempted?: number
//   emailSent?: number
// }

// const fetcher = (url: string) => fetch(url).then((r) => r.json())

// export default function NotificationsPage() {
//   const { toast } = useToast()

//   const [mounted, setMounted] = useState(false)
//   const [user, setUser] = useState<any>(null)
//   const [role, setRole] = useState<string>("")
//   const [institution, setInstitution] = useState<string>("")

//   useEffect(() => {
//     const u = getStoredUser()
//     setUser(u)
//     setRole(u?.role || "")
//     setInstitution(u?.institutionName || "")
//     setMounted(true)
//   }, [])

//   const query = useMemo(() => {
//     const p = new URLSearchParams()
//     if (role) p.set("role", role)
//     if (institution) p.set("institution", institution)
//     return `/api/notifications?${p.toString()}`
//   }, [role, institution])

//   const { data, error, isLoading, mutate } = useSWR<{ items: NotificationItem[] }>(mounted ? query : null, (url) =>
//     fetch(url).then((r) => r.json()),
//   )

//   const canCreate = role === "Admin" || role === "SuperAdmin"
//   const [activeTab, setActiveTab] = useState<"incoming" | "send" | "saved">("incoming")

//   const [title, setTitle] = useState("")
//   const [message, setMessage] = useState("")
//   const [audience, setAudience] = useState<"institution" | "admins">(role === "SuperAdmin" ? "admins" : "institution")
//   const [target, setTarget] = useState<"both" | "staff" | "students">("both")
//   const [editingId, setEditingId] = useState<string | null>(null)
//   const [editTitle, setEditTitle] = useState("")
//   const [editMessage, setEditMessage] = useState("")
//   const [editAudience, setEditAudience] = useState<"admins" | "institution">("admins")
//   const [editTarget, setEditTarget] = useState<"both" | "staff" | "students">("both")
//   const [editInstitution, setEditInstitution] = useState<string>("")
//   const [submitting, setSubmitting] = useState(false)
//   const [viewOpen, setViewOpen] = useState(false)
//   const [viewItem, setViewItem] = useState<NotificationItem | null>(null)

//   const storageKey = useMemo(() => (user?.id ? `notif_prefs_${user.id}` : null), [user?.id])
//   const [saved, setSaved] = useState<Set<string>>(new Set())
//   const [cleared, setCleared] = useState<Set<string>>(new Set())
//   const [seen, setSeen] = useState<Set<string>>(new Set())

//   useEffect(() => {
//     if (!mounted || !storageKey) return
//     try {
//       const raw = localStorage.getItem(storageKey)
//       if (raw) {
//         const parsed = JSON.parse(raw) as { saved?: string[]; cleared?: string[]; seen?: string[] }
//         setSaved(new Set(parsed.saved || []))
//         setCleared(new Set(parsed.cleared || []))
//         setSeen(new Set(parsed.seen || []))
//       }
//     } catch {
//       // ignore parse errors
//     }
//   }, [mounted, storageKey])

//   useEffect(() => {
//     if (!storageKey) return
//     const payload = { saved: Array.from(saved), cleared: Array.from(cleared), seen: Array.from(seen) }
//     localStorage.setItem(storageKey, JSON.stringify(payload))
//   }, [storageKey, saved, cleared, seen])

//   useEffect(() => {
//     if (!mounted || !storageKey) return

//     if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
//       navigator.serviceWorker.controller.postMessage({ type: "CLEAR_BADGE" })
//     }

//     const incomingIds = data?.items.filter((n) => !cleared.has(n.id) && !saved.has(n.id)).map((n) => n.id) || []
//     if (incomingIds.length > 0) {
//       setSeen((prev) => {
//         const next = new Set(prev)
//         incomingIds.forEach((id) => next.add(id))
//         return next
//       })
//     }
//   }, [mounted, storageKey, data])

//   const { data: instData } = useSWR<{ items: { name: string }[] }>(
//     role === "SuperAdmin" ? "/api/institutions" : null,
//     fetcher,
//   )
//   const institutions = instData?.items?.map((i) => i.name) || []

//   const handleCreate = async () => {
//     if (!title || !message) {
//       toast({ title: "Missing info", description: "Title and message are required.", variant: "destructive" })
//       return
//     }
//     if (role === "SuperAdmin" && audience === "institution" && !editInstitution && !institution) {
//       toast({
//         title: "Select institution",
//         description: "Please choose an institution for this notice.",
//         variant: "destructive",
//       })
//       return
//     }
//     setSubmitting(true)
//     try {
//       const res = await fetch("/api/notifications", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title,
//           message,
//           audience: role === "SuperAdmin" ? audience : "institution",
//           institutionName:
//             role === "SuperAdmin" ? (audience === "institution" ? editInstitution : undefined) : institution,
//           target: role === "SuperAdmin" ? (audience === "institution" ? editTarget : undefined) : target,
//           creator: {
//             id: user?.id,
//             name: user?.name,
//             role: role,
//             institutionName: institution,
//           },
//         }),
//       })
//       const json = await res.json()
//       if (!res.ok) {
//         toast({ title: "Failed", description: json?.error || "Could not create notification.", variant: "destructive" })
//         return
//       }
//       toast({
//         title: "Notification sent",
//         description:
//           role === "SuperAdmin" && audience === "admins"
//             ? "Your message was sent to all admins."
//             : "Your message was sent to selected recipients in your institution.",
//       })
//       setTitle("")
//       setMessage("")
//       setTarget("both")
//       await mutate()
//     } catch {
//       toast({ title: "Error", description: "Something went wrong.", variant: "destructive" })
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const startEdit = (n: NotificationItem) => {
//     setEditingId(n.id)
//     setEditTitle(n.title)
//     setEditMessage(n.message)
//     setEditAudience(n.audience)
//     setEditTarget(n.target ?? "both")
//     setEditInstitution(n.institutionName || "")
//   }

//   const saveEdit = async () => {
//     if (!editingId) return
//     const payload: any = {
//       id: editingId,
//       title: editTitle,
//       message: editMessage,
//       actor: { id: user?.id, role, institutionName: institution },
//     }
//     if (role === "SuperAdmin") {
//       payload.audience = editAudience
//       if (editAudience === "institution") {
//         payload.institutionName = editInstitution
//         payload.target = editTarget
//       }
//     } else if (role === "Admin") {
//       payload.target = editTarget
//     }
//     const res = await fetch(`/api/notifications?id=${editingId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     })
//     const json = await res.json()
//     if (!res.ok) {
//       toast({ title: "Update failed", description: json?.error || "Could not save changes.", variant: "destructive" })
//       return
//     }
//     toast({ title: "Saved", description: "Notification updated successfully." })
//     setEditingId(null)
//     await mutate()
//   }

//   const deleteItem = async (id: string) => {
//     if (!confirm("Delete this notification?")) return
//     const res = await fetch(`/api/notifications?id=${id}`, {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ actor: { id: user?.id, role, institutionName: institution } }),
//     })
//     const json = await res.json()
//     if (!res.ok) {
//       toast({ title: "Delete failed", description: json?.error || "Could not delete.", variant: "destructive" })
//       return
//     }
//     toast({ title: "Deleted", description: "Notification removed." })
//     await mutate()
//   }

//   const toggleSave = (id: string) => {
//     setSaved((prev) => {
//       const next = new Set(prev)
//       if (next.has(id)) next.delete(id)
//       else next.add(id)
//       return next
//     })
//   }

//   const clearOne = (id: string) => {
//     setCleared((prev) => {
//       const next = new Set(prev)
//       next.add(id)
//       return next
//     })
//   }

//   const clearAll = (ids: string[]) => {
//     if (!ids?.length) return
//     setCleared((prev) => {
//       const next = new Set(prev)
//       ids.forEach((id) => next.add(id))
//       return next
//     })
//   }

//   const allItems = data?.items || []
//   const incomingItems = allItems.filter((n) => !cleared.has(n.id) && !saved.has(n.id))
//   const savedItems = allItems.filter((n) => saved.has(n.id) && !cleared.has(n.id))
//   const incomingCount = incomingItems.length
//   const savedCount = savedItems.length

//   if (!mounted) {
//     return (
//       <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
//         <header className="space-y-1">
//           <h1 className="text-2xl font-semibold text-pretty">Notification Hub</h1>
//           <p className="text-sm text-muted-foreground">Loading…</p>
//         </header>
//         <Card className="p-4 md:p-6">
//           <div className="h-6 w-40 bg-muted rounded mb-3" />
//           <div className="h-24 bg-muted rounded" />
//         </Card>
//       </main>
//     )
//   }

//   return (
//     <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
//       <header className="space-y-1">
//         <h1 className="text-2xl font-semibold text-pretty">Notification Hub</h1>
//         <p className="text-sm text-muted-foreground">
//           {role === "Admin"
//             ? "Goes to your institution."
//             : role === "SuperAdmin"
//               ? "Goes to admins or selected institution."
//               : "Read-only view."}
//         </p>
//       </header>

//       <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
//         <TabsList className="flex flex-wrap gap-2">
//           <TabsTrigger value="incoming">Incoming ({incomingCount})</TabsTrigger>
//           {canCreate && <TabsTrigger value="send">Send</TabsTrigger>}
//           <TabsTrigger value="saved">Saved ({savedCount})</TabsTrigger>
//         </TabsList>

//         <TabsContent value="send">
//           {canCreate && (
//             <Card className="p-4 md:p-6 space-y-4">
//               <div className="grid gap-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="title">Title</Label>
//                   <Input
//                     id="title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="e.g., Holiday on Friday"
//                   />
//                 </div>

//                 <div className="grid gap-2">
//                   <Label htmlFor="message">Message</Label>
//                   <Textarea
//                     id="message"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Enter the announcement details"
//                     rows={5}
//                   />
//                 </div>

//                 {role === "SuperAdmin" ? (
//                   <div className="grid gap-2">
//                     <Label>Audience</Label>
//                     <div className="flex flex-wrap items-center gap-2">
//                       <Button
//                         type="button"
//                         variant={audience === "admins" ? "default" : "outline"}
//                         onClick={() => setAudience("admins")}
//                       >
//                         Admins
//                       </Button>
//                       <Button
//                         type="button"
//                         variant={audience === "institution" ? "default" : "outline"}
//                         onClick={() => setAudience("institution")}
//                       >
//                         Institution
//                       </Button>
//                     </div>
//                     {audience === "institution" && (
//                       <div className="grid md:grid-cols-2 gap-3">
//                         <div className="grid gap-2">
//                           <Label>Institution</Label>
//                           <select
//                             className="h-9 rounded-md border bg-background px-3 text-sm"
//                             value={editInstitution}
//                             onChange={(e) => setEditInstitution(e.target.value)}
//                           >
//                             <option value="">Select institution</option>
//                             {institutions.map((name) => (
//                               <option key={name} value={name}>
//                                 {name}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div className="grid gap-2">
//                           <Label>Recipients</Label>
//                           <div className="flex flex-wrap items-center gap-2">
//                             <Button
//                               type="button"
//                               variant={editTarget === "both" ? "default" : "outline"}
//                               onClick={() => setEditTarget("both")}
//                             >
//                               Both
//                             </Button>
//                             <Button
//                               type="button"
//                               variant={editTarget === "staff" ? "default" : "outline"}
//                               onClick={() => setEditTarget("staff")}
//                             >
//                               Staff only
//                             </Button>
//                             <Button
//                               type="button"
//                               variant={editTarget === "students" ? "default" : "outline"}
//                               onClick={() => setEditTarget("students")}
//                             >
//                               Students only
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="grid gap-2">
//                     <Label>Recipients (My Institution{institution ? `: ${institution}` : ""})</Label>
//                     <div className="flex flex-wrap items-center gap-2">
//                       <Button
//                         type="button"
//                         variant={target === "both" ? "default" : "outline"}
//                         onClick={() => setTarget("both")}
//                       >
//                         Both
//                       </Button>
//                       <Button
//                         type="button"
//                         variant={target === "staff" ? "default" : "outline"}
//                         onClick={() => setTarget("staff")}
//                       >
//                         Staff only
//                       </Button>
//                       <Button
//                         type="button"
//                         variant={target === "students" ? "default" : "outline"}
//                         onClick={() => setTarget("students")}
//                       >
//                         Students only
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex justify-end">
//                   <Button onClick={handleCreate} disabled={submitting}>
//                     {submitting ? "Sending..." : "Send Notification"}
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           )}
//         </TabsContent>

//         <TabsContent value="incoming">
//           {(() => {
//             const idsToClear = incomingItems.map((n) => n.id)
//             return (
//               <section className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-lg font-medium">Recent Notifications</h2>
//                   {incomingItems.length > 0 && (
//                     <Button variant="outline" size="sm" onClick={() => clearAll(idsToClear)}>
//                       Clear All
//                     </Button>
//                   )}
//                 </div>
//                 {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
//                 {error && <p className="text-sm text-red-600">Failed to load notifications.</p>}
//                 <div className="space-y-3">
//                   {incomingItems.length ? (
//                     incomingItems.map((n) => {
//                       const hideCreatorForAdmin = role === "Admin" && n.createdBy?.role === "SuperAdmin"
//                       const canEditDelete =
//                         role === "SuperAdmin" ||
//                         (role === "Admin" && n.audience === "institution" && n.createdBy?.id === user?.id)
//                       const isEditing = editingId === n.id
//                       const isSaved = saved.has(n.id)
//                       const isSeen = seen.has(n.id)

//                       const openView = () => {
//                         setViewItem(n)
//                         setViewOpen(true)
//                         setSeen((prev) => {
//                           const next = new Set(prev)
//                           next.add(n.id)
//                           return next
//                         })
//                       }

//                       return (
//                         <Card
//                           key={n.id}
//                           className="p-4 md:p-5 cursor-pointer"
//                           role="button"
//                           tabIndex={0}
//                           onClick={openView}
//                         >
//                           {!isEditing ? (
//                             <>
//                               <div className="flex items-start justify-between gap-3">
//                                 <div className="min-w-0">
//                                   <h3 className="font-semibold text-pretty">{n.title}</h3>
//                                   <p className="text-sm text-muted-foreground">
//                                     {n.audience === "admins"
//                                       ? "Admins Only"
//                                       : `Institution${n.institutionName ? `: ${n.institutionName}` : ""}${
//                                           n.target ? ` • ${n.target}` : ""
//                                         }`}{" "}
//                                     • {new Date(n.createdAt).toLocaleString()}
//                                     {!hideCreatorForAdmin && (
//                                       <>
//                                         {" "}
//                                         • by {n.createdBy?.name} ({n.createdBy?.role})
//                                       </>
//                                     )}
//                                   </p>
//                                 </div>
//                                 <div className="shrink-0 flex gap-2">
//                                   <Button
//                                     size="sm"
//                                     variant={isSaved ? "secondary" : "outline"}
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       toggleSave(n.id)
//                                     }}
//                                   >
//                                     {isSaved ? "Unsave" : "Save"}
//                                   </Button>
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       clearOne(n.id)
//                                     }}
//                                   >
//                                     Clear
//                                   </Button>
//                                   {canEditDelete && (
//                                     <>
//                                       <Button
//                                         size="sm"
//                                         variant="outline"
//                                         onClick={(e) => {
//                                           e.stopPropagation()
//                                           startEdit(n)
//                                         }}
//                                       >
//                                         Edit
//                                       </Button>
//                                       <Button
//                                         size="sm"
//                                         variant="destructive"
//                                         onClick={(e) => {
//                                           e.stopPropagation()
//                                           deleteItem(n.id)
//                                         }}
//                                       >
//                                         Delete
//                                       </Button>
//                                     </>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="mt-3 text-sm line-clamp-4 whitespace-pre-wrap">{n.message}</div>
//                               {(typeof n.emailAttempted === "number" || typeof n.emailSent === "number") && (
//                                 <p className="mt-3 text-xs text-muted-foreground">
//                                   Email: attempted {n.emailAttempted ?? 0}, sent {n.emailSent ?? 0}
//                                 </p>
//                               )}
//                             </>
//                           ) : (
//                             <div />
//                           )}
//                         </Card>
//                       )
//                     })
//                   ) : (
//                     <p className="text-sm text-muted-foreground">No notifications yet.</p>
//                   )}
//                 </div>
//               </section>
//             )
//           })()}
//         </TabsContent>

//         <TabsContent value="saved">
//           {(() => {
//             return (
//               <section className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-lg font-medium">Saved Notifications</h2>
//                   {savedItems.length > 0 && (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => {
//                         setSaved((prev) => {
//                           const next = new Set(prev)
//                           savedItems.forEach((n) => next.delete(n.id))
//                           return next
//                         })
//                       }}
//                     >
//                       Unsave All
//                     </Button>
//                   )}
//                 </div>
//                 {!savedItems.length ? (
//                   <p className="text-sm text-muted-foreground">You haven’t saved any notifications yet.</p>
//                 ) : (
//                   <div className="space-y-3">
//                     {savedItems.map((n) => {
//                       const isSaved = saved.has(n.id)
//                       return (
//                         <Card
//                           key={n.id}
//                           className="p-4 md:p-5 cursor-pointer"
//                           role="button"
//                           tabIndex={0}
//                           onClick={() => {
//                             setViewItem(n)
//                             setViewOpen(true)
//                           }}
//                         >
//                           <div className="flex items-start justify-between gap-3">
//                             <div className="min-w-0">
//                               <h3 className="font-semibold text-pretty">{n.title}</h3>
//                               <p className="text-sm text-muted-foreground">
//                                 {n.audience === "admins"
//                                   ? "Admins Only"
//                                   : `Institution${n.institutionName ? `: ${n.institutionName}` : ""}${
//                                       n.target ? ` • ${n.target}` : ""
//                                     }`}{" "}
//                                 • {new Date(n.createdAt).toLocaleString()}
//                               </p>
//                             </div>
//                             <div className="shrink-0 flex gap-2">
//                               <Button
//                                 size="sm"
//                                 variant={isSaved ? "secondary" : "outline"}
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   toggleSave(n.id)
//                                 }}
//                               >
//                                 {isSaved ? "Unsave" : "Save"}
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   clearOne(n.id)
//                                 }}
//                               >
//                                 Clear
//                               </Button>
//                             </div>
//                           </div>
//                           <div className="mt-3 text-sm line-clamp-4 whitespace-pre-wrap">{n.message}</div>
//                         </Card>
//                       )
//                     })}
//                   </div>
//                 )}
//               </section>
//             )
//           })()}
//         </TabsContent>
//       </Tabs>

//       <Dialog open={viewOpen} onOpenChange={setViewOpen}>
//         <DialogContent className="max-w-xl">
//           <DialogHeader>
//             <DialogTitle>{viewItem?.title || "Notification"}</DialogTitle>
//             {viewItem && (
//               <DialogDescription>
//                 {(viewItem.audience === "admins"
//                   ? "Admins Only"
//                   : `Institution${viewItem.institutionName ? `: ${viewItem.institutionName}` : ""}${
//                       viewItem.target ? ` • ${viewItem.target}` : ""
//                     }`) +
//                   " • " +
//                   new Date(viewItem.createdAt).toLocaleString()}
//               </DialogDescription>
//             )}
//           </DialogHeader>
//           <div className="whitespace-pre-wrap text-sm">{viewItem?.message}</div>
//         </DialogContent>
//       </Dialog>
//     </main>
//   )
// }



"use client"

import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getStoredUser } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

type NotificationItem = {
  id: string
  title: string
  message: string
  audience: "institution" | "admins"
  institutionName?: string
  target?: "both" | "staff" | "students"
  createdBy: { id: string; name: string; role: string }
  createdAt: string
  emailAttempted?: number
  emailSent?: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function NotificationsPage() {
  const { toast } = useToast()

  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string>("")
  const [institution, setInstitution] = useState<string>("")

  useEffect(() => {
    const u = getStoredUser()
    setUser(u)
    setRole(u?.role || "")
    setInstitution(u?.institutionName || "")
    setMounted(true)
  }, [])

  const query = useMemo(() => {
    const p = new URLSearchParams()
    if (role) p.set("role", role)
    if (institution) p.set("institution", institution)
    return `/api/notifications?${p.toString()}`
  }, [role, institution])

  const { data, error, isLoading, mutate } = useSWR<{ items: NotificationItem[] }>(mounted ? query : null, (url) =>
    fetch(url).then((r) => r.json()),
  )

  const canCreate = role === "Admin" || role === "SuperAdmin"
  const [activeTab, setActiveTab] = useState<"incoming" | "send" | "saved">("incoming")

  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState<"institution" | "admins">(role === "SuperAdmin" ? "admins" : "institution")
  const [target, setTarget] = useState<"both" | "staff" | "students">("both")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editMessage, setEditMessage] = useState("")
  const [editAudience, setEditAudience] = useState<"admins" | "institution">("admins")
  const [editTarget, setEditTarget] = useState<"both" | "staff" | "students">("both")
  const [editInstitution, setEditInstitution] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewItem, setViewItem] = useState<NotificationItem | null>(null)

  const storageKey = useMemo(() => (user?.id ? `notif_prefs_${user.id}` : null), [user?.id])
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [cleared, setCleared] = useState<Set<string>>(new Set())
  const [seen, setSeen] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!mounted || !storageKey) return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as { saved?: string[]; cleared?: string[]; seen?: string[] }
        setSaved(new Set(parsed.saved || []))
        setCleared(new Set(parsed.cleared || []))
        setSeen(new Set(parsed.seen || []))
      }
    } catch {
      // ignore parse errors
    }
  }, [mounted, storageKey])

  useEffect(() => {
    if (!storageKey) return
    const payload = { saved: Array.from(saved), cleared: Array.from(cleared), seen: Array.from(seen) }
    localStorage.setItem(storageKey, JSON.stringify(payload))
  }, [storageKey, saved, cleared, seen])

  useEffect(() => {
    if (!mounted || !storageKey) return

    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "CLEAR_BADGE" })
    }

    const incomingIds = data?.items.filter((n) => !cleared.has(n.id) && !saved.has(n.id)).map((n) => n.id) || []
    if (incomingIds.length > 0) {
      setSeen((prev) => {
        const next = new Set(prev)
        incomingIds.forEach((id) => next.add(id))
        return next
      })
    }
  }, [mounted, storageKey, data])

  const { data: instData } = useSWR<{ items: { name: string }[] }>(
    role === "SuperAdmin" ? "/api/institutions" : null,
    fetcher,
  )
  const institutions = instData?.items?.map((i) => i.name) || []

  const handleCreate = async () => {
    if (!title || !message) {
      toast({ title: "Missing info", description: "Title and message are required.", variant: "destructive" })
      return
    }
    if (role === "SuperAdmin" && audience === "institution" && !editInstitution && !institution) {
      toast({
        title: "Select institution",
        description: "Please choose an institution for this notice.",
        variant: "destructive",
      })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          audience: role === "SuperAdmin" ? audience : "institution",
          institutionName:
            role === "SuperAdmin" ? (audience === "institution" ? editInstitution : undefined) : institution,
          target: role === "SuperAdmin" ? (audience === "institution" ? editTarget : undefined) : target,
          creator: {
            id: user?.id,
            name: user?.name,
            role: role,
            institutionName: institution,
          },
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast({ title: "Failed", description: json?.error || "Could not create notification.", variant: "destructive" })
        return
      }
      toast({
        title: "Notification sent",
        description:
          role === "SuperAdmin" && audience === "admins"
            ? "Your message was sent to all admins."
            : "Your message was sent to selected recipients in your institution.",
      })
      setTitle("")
      setMessage("")
      setTarget("both")
      await mutate()
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (n: NotificationItem) => {
    setEditingId(n.id)
    setEditTitle(n.title)
    setEditMessage(n.message)
    setEditAudience(n.audience)
    setEditTarget(n.target ?? "both")
    setEditInstitution(n.institutionName || "")
  }

  const saveEdit = async () => {
    if (!editingId) return
    const payload: any = {
      id: editingId,
      title: editTitle,
      message: editMessage,
      actor: { id: user?.id, role, institutionName: institution },
    }
    if (role === "SuperAdmin") {
      payload.audience = editAudience
      if (editAudience === "institution") {
        payload.institutionName = editInstitution
        payload.target = editTarget
      }
    } else if (role === "Admin") {
      payload.target = editTarget
    }
    const res = await fetch(`/api/notifications?id=${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok) {
      toast({ title: "Update failed", description: json?.error || "Could not save changes.", variant: "destructive" })
      return
    }
    toast({ title: "Saved", description: "Notification updated successfully." })
    setEditingId(null)
    await mutate()
  }

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this notification?")) return
    const res = await fetch(`/api/notifications?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actor: { id: user?.id, role, institutionName: institution } }),
    })
    const json = await res.json()
    if (!res.ok) {
      toast({ title: "Delete failed", description: json?.error || "Could not delete.", variant: "destructive" })
      return
    }
    toast({ title: "Deleted", description: "Notification removed." })
    await mutate()
  }

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearOne = (id: string) => {
    setCleared((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const clearAll = (ids: string[]) => {
    if (!ids?.length) return
    setCleared((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.add(id))
      return next
    })
  }

  const allItems = data?.items || []
  const incomingItems = allItems.filter((n) => !cleared.has(n.id) && !saved.has(n.id))
  const savedItems = allItems.filter((n) => saved.has(n.id) && !cleared.has(n.id))
  const incomingCount = incomingItems.length
  const savedCount = savedItems.length

  if (!mounted) {
    return (
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-pretty">Notification Hub</h1>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </header>
        <Card className="p-4 md:p-6">
          <div className="h-6 w-40 bg-muted rounded mb-3" />
          <div className="h-24 bg-muted rounded" />
        </Card>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-pretty">Notification Hub</h1>
        <p className="text-sm text-muted-foreground">
          {role === "Admin"
            ? "Goes to your institution."
            : role === "SuperAdmin"
              ? "Goes to admins or selected institution."
              : "Read-only view."}
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="incoming">Incoming ({incomingCount})</TabsTrigger>
          {canCreate && <TabsTrigger value="send">Send</TabsTrigger>}
          <TabsTrigger value="saved">Saved ({savedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          {canCreate && (
            <Card className="p-4 md:p-6 space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Holiday on Friday"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter the announcement details"
                    rows={5}
                  />
                </div>

                {role === "SuperAdmin" ? (
                  <div className="grid gap-2">
                    <Label>Audience</Label>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant={audience === "admins" ? "default" : "outline"}
                        onClick={() => setAudience("admins")}
                      >
                        Admins
                      </Button>
                      <Button
                        type="button"
                        variant={audience === "institution" ? "default" : "outline"}
                        onClick={() => setAudience("institution")}
                      >
                        Institution
                      </Button>
                    </div>
                    {audience === "institution" && (
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="grid gap-2">
                          <Label>Institution</Label>
                          <select
                            className="h-9 rounded-md border bg-background px-3 text-sm"
                            value={editInstitution}
                            onChange={(e) => setEditInstitution(e.target.value)}
                          >
                            <option value="">Select institution</option>
                            {institutions.map((name) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Recipients</Label>
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              type="button"
                              variant={editTarget === "both" ? "default" : "outline"}
                              onClick={() => setEditTarget("both")}
                            >
                              Both
                            </Button>
                            <Button
                              type="button"
                              variant={editTarget === "staff" ? "default" : "outline"}
                              onClick={() => setEditTarget("staff")}
                            >
                              Staff only
                            </Button>
                            <Button
                              type="button"
                              variant={editTarget === "students" ? "default" : "outline"}
                              onClick={() => setEditTarget("students")}
                            >
                              Students only
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label>Recipients (My Institution{institution ? `: ${institution}` : ""})</Label>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant={target === "both" ? "default" : "outline"}
                        onClick={() => setTarget("both")}
                      >
                        Both
                      </Button>
                      <Button
                        type="button"
                        variant={target === "staff" ? "default" : "outline"}
                        onClick={() => setTarget("staff")}
                      >
                        Staff only
                      </Button>
                      <Button
                        type="button"
                        variant={target === "students" ? "default" : "outline"}
                        onClick={() => setTarget("students")}
                      >
                        Students only
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleCreate} disabled={submitting}>
                    {submitting ? "Sending..." : "Send Notification"}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="incoming">
          {(() => {
            const idsToClear = incomingItems.map((n) => n.id)
            return (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Recent Notifications</h2>
                  {incomingItems.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => clearAll(idsToClear)}>
                      Clear All
                    </Button>
                  )}
                </div>
                {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
                {error && <p className="text-sm text-red-600">Failed to load notifications.</p>}
                <div className="space-y-3">
                  {incomingItems.length ? (
                    incomingItems.map((n) => {
                      const hideCreatorForAdmin = role === "Admin" && n.createdBy?.role === "SuperAdmin"
                      const canEditDelete =
                        role === "SuperAdmin" ||
                        (role === "Admin" && n.audience === "institution" && n.createdBy?.id === user?.id)
                      const isEditing = editingId === n.id
                      const isSaved = saved.has(n.id)
                      const isSeen = seen.has(n.id)

                      const openView = () => {
                        setViewItem(n)
                        setViewOpen(true)
                        setSeen((prev) => {
                          const next = new Set(prev)
                          next.add(n.id)
                          return next
                        })
                      }

                      return (
                        <Card
                          key={n.id}
                          className="p-4 md:p-5 cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onClick={openView}
                        >
                          {!isEditing ? (
                            <>
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-pretty">{n.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {n.audience === "admins"
                                      ? "Admins Only"
                                      : `Institution${n.institutionName ? `: ${n.institutionName}` : ""}${
                                          n.target ? ` • ${n.target}` : ""
                                        }`}{" "}
                                    • {new Date(n.createdAt).toLocaleString()}
                                    {!hideCreatorForAdmin && <> • by {n.createdBy?.name}</>}
                                  </p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleSave(n.id)
                                      }}
                                    >
                                      {isSaved ? "Unsave" : "Save"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        clearOne(n.id)
                                      }}
                                    >
                                      Clear
                                    </DropdownMenuItem>
                                    {canEditDelete && (
                                      <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            startEdit(n)
                                          }}
                                        >
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            deleteItem(n.id)
                                          }}
                                          className="text-destructive focus:text-destructive"
                                        >
                                          Delete
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="mt-3 text-sm line-clamp-4 whitespace-pre-wrap">{n.message}</div>
                            </>
                          ) : (
                            <div />
                          )}
                        </Card>
                      )
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">No notifications yet.</p>
                  )}
                </div>
              </section>
            )
          })()}
        </TabsContent>

        <TabsContent value="saved">
          {(() => {
            return (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Saved Notifications</h2>
                  {savedItems.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSaved((prev) => {
                          const next = new Set(prev)
                          savedItems.forEach((n) => next.delete(n.id))
                          return next
                        })
                      }}
                    >
                      Unsave All
                    </Button>
                  )}
                </div>
                {!savedItems.length ? (
                  <p className="text-sm text-muted-foreground">You haven’t saved any notifications yet.</p>
                ) : (
                  <div className="space-y-3">
                    {savedItems.map((n) => {
                      const isSaved = saved.has(n.id)
                      return (
                        <Card
                          key={n.id}
                          className="p-4 md:p-5 cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setViewItem(n)
                            setViewOpen(true)
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-pretty">{n.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {n.audience === "admins"
                                  ? "Admins Only"
                                  : `Institution${n.institutionName ? `: ${n.institutionName}` : ""}${
                                      n.target ? ` • ${n.target}` : ""
                                    }`}{" "}
                                • {new Date(n.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleSave(n.id)
                                  }}
                                >
                                  {isSaved ? "Unsave" : "Save"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    clearOne(n.id)
                                  }}
                                >
                                  Clear
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="mt-3 text-sm line-clamp-4 whitespace-pre-wrap">{n.message}</div>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </section>
            )
          })()}
        </TabsContent>
      </Tabs>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{viewItem?.title || "Notification"}</DialogTitle>
            {viewItem && (
              <DialogDescription>
                {(viewItem.audience === "admins"
                  ? "Admins Only"
                  : `Institution${viewItem.institutionName ? `: ${viewItem.institutionName}` : ""}${
                      viewItem.target ? ` • ${viewItem.target}` : ""
                    }`) +
                  " • " +
                  new Date(viewItem.createdAt).toLocaleString()}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm">{viewItem?.message}</div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

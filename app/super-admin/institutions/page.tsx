
// "use client"

// import useSWR from "swr"
// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Switch } from "@/components/ui/switch"
// import { Input } from "@/components/ui/input"
// import Link from "next/link"
// import { getStoredUser, type User } from "@/lib/auth"

// type InstitutionItem = {
//   name: string
//   blocked?: boolean
//   locationVerificationEnabled?: boolean
//   quarterlyReportsEnabled?: boolean
//   staffCount?: number
//   studentCount?: number
// }

// const fetcher = (url: string) => fetch(url).then((r) => r.json())

// export default function InstitutionsPage() {
//   const { data, isLoading, mutate } = useSWR<{ items: InstitutionItem[] }>("/api/institutions", fetcher)
//   const [creating, setCreating] = useState(false)
//   const [newName, setNewName] = useState("")
//   const [editingName, setEditingName] = useState<string | null>(null)
//   const [renameValue, setRenameValue] = useState<string>("")
//   const [deleting, setDeleting] = useState<string | null>(null)

//   const [user, setUser] = useState<User | null>(null)
//   const [hydrated, setHydrated] = useState(false)
//   useEffect(() => {
//     setUser(getStoredUser())
//     setHydrated(true)
//   }, [])
//   const isSuperAdmin = user?.role === "SuperAdmin"

//   async function toggleBlocked(name: string, blocked: boolean) {
//     if (!isSuperAdmin) return
//     const res = await fetch(`/api/institutions/${encodeURIComponent(name)}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ blocked }),
//     })
//     if (res.ok) mutate()
//   }

//   async function createInstitution() {
//     if (!isSuperAdmin) return
//     if (!newName.trim()) return
//     setCreating(true)
//     const res = await fetch("/api/institutions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name: newName.trim() }),
//     })
//     setCreating(false)
//     if (res.ok) {
//       setNewName("")
//       mutate()
//     }
//   }

//   async function saveRename(oldName: string) {
//     if (!isSuperAdmin) return
//     const val = renameValue.trim()
//     if (!val || val === oldName) {
//       setEditingName(null)
//       return
//     }
//     const res = await fetch(`/api/institutions/${encodeURIComponent(oldName)}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ newName: val }),
//     })
//     if (res.ok) {
//       setEditingName(null)
//       setRenameValue("")
//       mutate()
//     } else {
//       const msg = await res.json().catch(() => ({}))
//       alert(msg?.error || "Failed to rename institution")
//     }
//   }

//   async function deleteInstitution(name: string) {
//     if (!isSuperAdmin) return
//     if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
//     setDeleting(name)
//     const res = await fetch(`/api/institutions/${encodeURIComponent(name)}`, { method: "DELETE" })
//     setDeleting(null)
//     if (res.ok) {
//       mutate()
//     } else {
//       const msg = await res.json().catch(() => ({}))
//       alert(msg?.error || "Failed to delete institution")
//     }
//   }

//   async function toggleLocationVerification(name: string, enabled: boolean) {
//     if (!isSuperAdmin) return
//     const res = await fetch(`/api/institutions/${encodeURIComponent(name)}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ locationVerificationEnabled: enabled }),
//     })
//     if (res.ok) mutate()
//   }

//   async function toggleQuarterlyReports(name: string, enabled: boolean) {
//     if (!isSuperAdmin) return
//     const res = await fetch(`/api/institutions/${encodeURIComponent(name)}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ quarterlyReportsEnabled: enabled }),
//     })
//     if (res.ok) mutate()
//   }

//   const items = data?.items || []

//   if (!hydrated) {
//     return (
//       <main className="p-6">
//         <h1 className="text-xl font-semibold">Institution Folders</h1>
//         <p className="text-sm text-muted-foreground mt-2">Loading...</p>
//       </main>
//     )
//   }

//   if (!isSuperAdmin) {
//     return (
//       <main className="p-6">
//         <h1 className="text-xl font-semibold">Access denied</h1>
//         <p className="text-sm text-muted-foreground mt-2">Only SuperAdmin can manage institutions.</p>
//       </main>
//     )
//   }

//   return (
//     <main className="p-6 space-y-6">
//       <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <h1 className="text-2xl font-semibold text-pretty">Institution Folders</h1>
//         <div className="flex w-full md:w-auto items-center gap-2">
//           <Input
//             value={newName}
//             onChange={(e) => setNewName(e.target.value)}
//             placeholder="Add new institution (e.g., Sunrise Engineering College)"
//             className="w-full md:w-80"
//           />
//           <Button onClick={createInstitution} disabled={creating || !newName.trim()}>
//             {creating ? "Creating..." : "Create"}
//           </Button>
//         </div>
//       </header>

//       {isLoading ? (
//         <p>Loading institutions...</p>
//       ) : items.length === 0 ? (
//         <Card className="p-6">
//           <p className="text-sm">No institutions found yet. Create one to get started.</p>
//         </Card>
//       ) : (
//         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {items.map((inst) => {
//             const isEditing = editingName === inst.name
//             const disableDelete = (inst.staffCount ?? 0) > 0 || (inst.studentCount ?? 0) > 0
//             return (
//               <Card key={inst.name} className="p-5 space-y-4">
//                 <div className="flex flex-col gap-3">
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="min-w-0">
//                       {!isEditing ? (
//                         <>
//                           <h2 className="text-lg font-medium break-words">{inst.name}</h2>
//                           <p className="text-sm text-muted-foreground">
//                             Staff: {inst.staffCount ?? 0} · Students: {inst.studentCount ?? 0}
//                           </p>
//                         </>
//                       ) : (
//                         <div className="flex items-center gap-2 w-full">
//                           <Input
//                             autoFocus
//                             value={renameValue}
//                             onChange={(e) => setRenameValue(e.target.value)}
//                             placeholder="New name"
//                             className="w-full"
//                           />
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-2 shrink-0">
//                       <span className="text-xs">{inst.blocked ? "Blocked" : "Active"}</span>
//                       <Switch
//                         checked={!!inst.blocked}
//                         onCheckedChange={(v) => toggleBlocked(inst.name, v)}
//                         aria-label={inst.blocked ? "Unblock institution" : "Block institution"}
//                       />
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded-md">
//                     <div className="flex-1">
//                       <p className="text-sm font-medium">Location Verification</p>
//                       <p className="text-xs text-muted-foreground">
//                         Enable location-based attendance for this institution
//                       </p>
//                     </div>
//                     <Switch
//                       checked={!!inst.locationVerificationEnabled}
//                       onCheckedChange={(v) => toggleLocationVerification(inst.name, v)}
//                       aria-label="Toggle location verification"
//                     />
//                   </div>

//                   <div className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded-md">
//                     <div className="flex-1">
//                       <p className="text-sm font-medium">Quarterly Reports & Auto-Archive</p>
//                       <p className="text-xs text-muted-foreground">
//                         Auto-generate reports every 3 months and archive old attendance data
//                       </p>
//                     </div>
//                     <Switch
//                       checked={!!inst.quarterlyReportsEnabled}
//                       onCheckedChange={(v) => toggleQuarterlyReports(inst.name, v)}
//                       aria-label="Toggle quarterly reports"
//                     />
//                   </div>

//                   <div className="flex flex-wrap items-center gap-2">
//                     <Link
//                       href={`/staff?institutionName=${encodeURIComponent(inst.name)}`}
//                       className="text-sm underline"
//                     >
//                       View Staff
//                     </Link>
//                     <Link
//                       href={`/students?institutionName=${encodeURIComponent(inst.name)}`}
//                       className="text-sm underline"
//                     >
//                       View Students
//                     </Link>

//                     {!isEditing ? (
//                       <>
//                         <Button
//                           variant="secondary"
//                           size="sm"
//                           onClick={() => {
//                             setEditingName(inst.name)
//                             setRenameValue(inst.name)
//                           }}
//                         >
//                           Edit Name
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           disabled={disableDelete || deleting === inst.name}
//                           onClick={() => deleteInstitution(inst.name)}
//                           title={
//                             disableDelete ? "Cannot delete: move or remove staff/students first" : "Delete institution"
//                           }
//                         >
//                           {deleting === inst.name ? "Deleting..." : "Delete"}
//                         </Button>
//                       </>
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <Button size="sm" onClick={() => saveRename(inst.name)} disabled={!renameValue.trim()}>
//                           Save
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="ghost"
//                           onClick={() => {
//                             setEditingName(null)
//                             setRenameValue("")
//                           }}
//                         >
//                           Cancel
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {inst.blocked && (
//                   <p className="text-xs text-red-600">
//                     This college is blocked. Users cannot log in until it is unblocked.
//                   </p>
//                 )}
//               </Card>
//             )
//           })}
//         </section>
//       )}
//     </main>
//   )
// }




"use client"

import useSWR from "swr"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { getStoredUser, type User } from "@/lib/auth"
import { LiveMonitor } from "@/components/live-monitor"

type InstitutionItem = {
  name: string
  blocked?: boolean
  locationVerificationEnabled?: boolean
  quarterlyReportsEnabled?: boolean
  staffCount?: number
  studentCount?: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function InstitutionsPage() {
  const { data, isLoading, mutate } = useSWR<{ items: InstitutionItem[] }>("/api/institutions", fetcher)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [editingName, setEditingName] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState<string>("")
  const [deleting, setDeleting] = useState<string | null>(null)

  const [user, setUser] = useState<User | null>(null)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setUser(getStoredUser())
    setHydrated(true)
  }, [])
  const isSuperAdmin = user?.role === "SuperAdmin"

  async function toggleBlocked(name: string, blocked: boolean) {
    if (!isSuperAdmin) return
    const res = await fetch(`/api/institutions/${encodeURIComponent(name)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocked }),
    })
    if (res.ok) mutate()
  }

  async function createInstitution() {
    if (!isSuperAdmin) return
    if (!newName.trim()) return
    setCreating(true)
    const res = await fetch("/api/institutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    })
    setCreating(false)
    if (res.ok) {
      setNewName("")
      mutate()
    }
  }

  async function saveRename(oldName: string) {
    if (!isSuperAdmin) return
    const val = renameValue.trim()
    if (!val || val === oldName) {
      setEditingName(null)
      return
    }
    const res = await fetch(`/api/institutions/${encodeURIComponent(oldName)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newName: val }),
    })
    if (res.ok) {
      setEditingName(null)
      setRenameValue("")
      mutate()
    } else {
      const msg = await res.json().catch(() => ({}))
      alert(msg?.error || "Failed to rename institution")
    }
  }

  async function deleteInstitution(name: string) {
    if (!isSuperAdmin) return
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(name)
    const res = await fetch(`/api/institutions/${encodeURIComponent(name)}`, { method: "DELETE" })
    setDeleting(null)
    if (res.ok) {
      mutate()
    } else {
      const msg = await res.json().catch(() => ({}))
      alert(msg?.error || "Failed to delete institution")
    }
  }

  async function toggleLocationVerification(name: string, enabled: boolean) {
    if (!isSuperAdmin) return
    const res = await fetch(`/api/institutions/${encodeURIComponent(name)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locationVerificationEnabled: enabled }),
    })
    if (res.ok) mutate()
  }

  async function toggleQuarterlyReports(name: string, enabled: boolean) {
    if (!isSuperAdmin) return
    const res = await fetch(`/api/institutions/${encodeURIComponent(name)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quarterlyReportsEnabled: enabled }),
    })
    if (res.ok) mutate()
  }

  const items = data?.items || []

  if (!hydrated) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">Institution Folders</h1>
        <p className="text-sm text-muted-foreground mt-2">Loading...</p>
      </main>
    )
  }

  if (!isSuperAdmin) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="text-sm text-muted-foreground mt-2">Only SuperAdmin can manage institutions.</p>
      </main>
    )
  }

  return (
    <main className="p-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-semibold text-pretty">Institution Folders</h1>
        <div className="flex w-full md:w-auto items-center gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Add new institution (e.g., Sunrise Engineering College)"
            className="w-full md:w-80"
          />
          <Button onClick={createInstitution} disabled={creating || !newName.trim()}>
            {creating ? "Creating..." : "Create"}
          </Button>
        </div>
      </header>

      <LiveMonitor />

      {isLoading ? (
        <p>Loading institutions...</p>
      ) : items.length === 0 ? (
        <Card className="p-6">
          <p className="text-sm">No institutions found yet. Create one to get started.</p>
        </Card>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((inst) => {
            const isEditing = editingName === inst.name
            const disableDelete = (inst.staffCount ?? 0) > 0 || (inst.studentCount ?? 0) > 0
            return (
              <Card key={inst.name} className="p-5 space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {!isEditing ? (
                        <>
                          <h2 className="text-lg font-medium break-words">{inst.name}</h2>
                          <p className="text-sm text-muted-foreground">
                            Staff: {inst.staffCount ?? 0} · Students: {inst.studentCount ?? 0}
                          </p>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 w-full">
                          <Input
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            placeholder="New name"
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs">{inst.blocked ? "Blocked" : "Active"}</span>
                      <Switch
                        checked={!!inst.blocked}
                        onCheckedChange={(v) => toggleBlocked(inst.name, v)}
                        aria-label={inst.blocked ? "Unblock institution" : "Block institution"}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded-md">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Location Verification</p>
                      <p className="text-xs text-muted-foreground">
                        Enable location-based attendance for this institution
                      </p>
                    </div>
                    <Switch
                      checked={!!inst.locationVerificationEnabled}
                      onCheckedChange={(v) => toggleLocationVerification(inst.name, v)}
                      aria-label="Toggle location verification"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded-md">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Quarterly Reports & Auto-Archive</p>
                      <p className="text-xs text-muted-foreground">
                        Auto-generate reports every 3 months and archive old attendance data
                      </p>
                    </div>
                    <Switch
                      checked={!!inst.quarterlyReportsEnabled}
                      onCheckedChange={(v) => toggleQuarterlyReports(inst.name, v)}
                      aria-label="Toggle quarterly reports"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/staff?institutionName=${encodeURIComponent(inst.name)}`}
                      className="text-sm underline"
                    >
                      View Staff
                    </Link>
                    <Link
                      href={`/students?institutionName=${encodeURIComponent(inst.name)}`}
                      className="text-sm underline"
                    >
                      View Students
                    </Link>

                    {!isEditing ? (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setEditingName(inst.name)
                            setRenameValue(inst.name)
                          }}
                        >
                          Edit Name
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={disableDelete || deleting === inst.name}
                          onClick={() => deleteInstitution(inst.name)}
                          title={
                            disableDelete ? "Cannot delete: move or remove staff/students first" : "Delete institution"
                          }
                        >
                          {deleting === inst.name ? "Deleting..." : "Delete"}
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => saveRename(inst.name)} disabled={!renameValue.trim()}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingName(null)
                            setRenameValue("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {inst.blocked && (
                  <p className="text-xs text-red-600">
                    This college is blocked. Users cannot log in until it is unblocked.
                  </p>
                )}
              </Card>
            )
          })}
        </section>
      )}
    </main>
  )
}

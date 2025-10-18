
// // "use client"

// // import useSWR from "swr"
// // import type { Department, Role, Shift, Staff } from "@/lib/types"
// // import { Button } from "@/components/ui/button"
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// // import { PeopleForm } from "@/components/people-form"
// // import { PersonCard } from "@/components/person-card"
// // import { PersonDetailsModal } from "@/components/person-details-modal"
// // import { SearchBar } from "@/components/search-bar"
// // import { useState, useMemo, useEffect } from "react"
// // import { ExportDropdown } from "@/components/export-dropdown"
// // import { getStoredUser } from "@/lib/auth"

// // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // export default function StaffPage() {
// //   const [endpoint, setEndpoint] = useState<string | null>(null)
// //   const [open, setOpen] = useState(false)
// //   const [editing, setEditing] = useState<Staff | null>(null)
// //   const [detailsOpen, setDetailsOpen] = useState(false)
// //   const [selectedPersonId, setSelectedPersonId] = useState<string>("")
// //   const [searchQuery, setSearchQuery] = useState("")
// //   const [currentUser, setCurrentUser] = useState<any>(null)

// //   useEffect(() => {
// //     const u = getStoredUser()
// //     setCurrentUser(u)
// //     if (!u) {
// //       setEndpoint("/api/staff")
// //       return
// //     }
// //     if (u.role === "SuperAdmin") {
// //       setEndpoint("/api/staff")
// //     } else {
// //       const inst = u.institutionName || ""
// //       setEndpoint(`/api/staff?institutionName=${encodeURIComponent(inst)}`)
// //     }
// //   }, [])

// //   const { data, mutate } = useSWR<{ items: Staff[]; departments: Department[]; roles: Role[]; shifts: Shift[] }>(
// //     endpoint,
// //     endpoint ? fetcher : (null as any),
// //   )

// //   const filteredStaff = useMemo(() => {
// //     if (!data?.items || !searchQuery.trim()) return data?.items || []

// //     const query = searchQuery.toLowerCase().trim()
// //     return data.items.filter((staff) => {
// //       return (
// //         staff.name.toLowerCase().includes(query) ||
// //         staff.employeeCode?.toLowerCase().includes(query) ||
// //         staff.shift?.toString().toLowerCase().includes(query) ||
// //         staff.role?.toString().toLowerCase().includes(query)
// //       )
// //     })
// //   }, [data?.items, searchQuery])

// //   async function remove(id: string) {
// //     if (!confirm("Delete this staff member?")) return
// //     const res = await fetch(`/api/staff?id=${id}`, { method: "DELETE" })
// //     if (!res.ok) return alert("Delete failed")
// //     mutate()
// //   }

// //   const handleViewDetails = (personId: string) => {
// //     setSelectedPersonId(personId)
// //     setDetailsOpen(true)
// //   }

// //   return (
// //     <div className="space-y-6 px-4 sm:px-0">
// //       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //         <div className="space-y-1">
// //           {currentUser?.institutionName && (
// //             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
// //               {currentUser.institutionName}
// //             </div>
// //           )}
// //           <h1 className="text-balance text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
// //             Staff Management
// //           </h1>
// //           <p className="text-sm sm:text-base text-gray-600">Manage your team members and track their attendance</p>
// //         </div>
// //         <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
// //           <ExportDropdown type="staff" data={filteredStaff || []} disabled={!data?.items?.length} />
// //           <Dialog
// //             open={open}
// //             onOpenChange={(v) => {
// //               setOpen(v)
// //               if (!v) setEditing(null)
// //             }}
// //           >
// //             <DialogTrigger asChild>
// //               <Button className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 shadow-lg h-10 sm:h-9">
// //                 Add Staff Member
// //               </Button>
// //             </DialogTrigger>
// //             <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
// //               <DialogHeader>
// //                 <DialogTitle className="text-lg sm:text-xl">
// //                   {editing ? "Edit Staff Member" : "Add New Staff Member"}
// //                 </DialogTitle>
// //               </DialogHeader>
// //               {data && (
// //                 <PeopleForm
// //                   type="staff"
// //                   departments={data.departments}
// //                   roles={data.roles}
// //                   shifts={data.shifts}
// //                   initial={editing ?? undefined}
// //                   onSaved={() => {
// //                     setOpen(false)
// //                     setEditing(null)
// //                     mutate()
// //                   }}
// //                 />
// //               )}
// //             </DialogContent>
// //           </Dialog>
// //         </div>
// //       </div>

// //       <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
// //         <div className="flex-1 w-full sm:max-w-md">
// //           <SearchBar
// //             value={searchQuery}
// //             onChange={setSearchQuery}
// //             placeholder="Search by name, employee code, shift..."
// //           />
// //         </div>
// //         <div className="text-xs sm:text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border self-start sm:self-auto">
// //           Total Staff: <span className="font-semibold text-teal-600">{filteredStaff?.length || 0}</span>
// //           {searchQuery && data?.items && <span className="text-gray-500"> of {data.items.length}</span>}
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
// //         {filteredStaff?.map((person) => (
// //           <PersonCard
// //             key={person.id}
// //             person={person}
// //             type="staff"
// //             onView={() => handleViewDetails(person.id)}
// //             onEdit={() => {
// //               setEditing(person)
// //               setOpen(true)
// //             }}
// //             onDelete={() => remove(person.id)}
// //           />
// //         ))}
// //       </div>

// //       {searchQuery && filteredStaff?.length === 0 && (
// //         <div className="text-center py-8 sm:py-12">
// //           <p className="text-sm sm:text-base text-gray-500">No staff members found matching "{searchQuery}"</p>
// //         </div>
// //       )}

// //       <PersonDetailsModal
// //         isOpen={detailsOpen}
// //         onClose={() => setDetailsOpen(false)}
// //         personId={selectedPersonId}
// //         personType="staff"
// //       />
// //     </div>
// //   )
// // }



// "use client"

// import useSWR from "swr"
// import type { Department, Role, Shift, Staff, Branch } from "@/lib/types"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { PeopleForm } from "@/components/people-form"
// import { PersonCard } from "@/components/person-card"
// import { PersonDetailsModal } from "@/components/person-details-modal"
// import { SearchBar } from "@/components/search-bar"
// import { useState, useMemo, useEffect } from "react"
// import { ExportDropdown } from "@/components/export-dropdown"
// import { getStoredUser } from "@/lib/auth"
// import { Card, CardContent } from "@/components/ui/card"
// import { Folder, ArrowLeft } from "lucide-react"

// const fetcher = (url: string) => fetch(url).then((r) => r.json())

// export default function StaffPage() {
//   const [endpoint, setEndpoint] = useState<string | null>(null)
//   const [open, setOpen] = useState(false)
//   const [editing, setEditing] = useState<Staff | null>(null)
//   const [detailsOpen, setDetailsOpen] = useState(false)
//   const [selectedPersonId, setSelectedPersonId] = useState<string>("")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [currentUser, setCurrentUser] = useState<any>(null)
//   const [selectedBranch, setSelectedBranch] = useState<string | null>(null)

//   useEffect(() => {
//     const u = getStoredUser()
//     setCurrentUser(u)
//     if (!u) {
//       setEndpoint("/api/staff")
//       return
//     }
//     if (u.role === "SuperAdmin") {
//       setEndpoint("/api/staff")
//     } else {
//       const inst = u.institutionName || ""
//       setEndpoint(`/api/staff?institutionName=${encodeURIComponent(inst)}`)
//     }
//   }, [])

//   const { data, mutate } = useSWR<{ items: Staff[]; departments: Department[]; roles: Role[]; shifts: Shift[] }>(
//     endpoint,
//     endpoint ? fetcher : (null as any),
//   )

//   const branchList: Branch[] = ["ECE", "CSE", "EEE", "MECH", "CIVIL", "IT", "AERO", "CHEM", "BIOTECH", "TEXTILE"]
//   const getStaffBranch = (s: Staff): Branch | null => {
//     const spec = (s.specialization || "").toUpperCase().trim()
//     const match = branchList.find((b) => b.toUpperCase() === spec)
//     return match || null
//   }

//   const branchCounts = useMemo(() => {
//     const counts = new Map<string, number>()
//     if (!data?.items) return counts
//     for (const s of data.items) {
//       const b = getStaffBranch(s)
//       const key = b || "Common Staff"
//       counts.set(key, (counts.get(key) || 0) + 1)
//     }
//     return counts
//   }, [data?.items])

//   const baseList = useMemo(() => {
//     if (!data?.items) return []
//     if (!selectedBranch) return data.items
//     if (selectedBranch === "Common Staff") return data.items.filter((s) => !getStaffBranch(s))
//     return data.items.filter((s) => getStaffBranch(s) === selectedBranch)
//   }, [data?.items, selectedBranch])

//   const filteredStaff = useMemo(() => {
//     if (!baseList || !searchQuery.trim()) return baseList || []
//     const query = searchQuery.toLowerCase().trim()
//     return baseList.filter((staff) => {
//       return (
//         staff.name.toLowerCase().includes(query) ||
//         staff.employeeCode?.toLowerCase().includes(query) ||
//         staff.shift.name.toLowerCase().includes(query) ||
//         staff.role.name.toLowerCase().includes(query) ||
//         (getStaffBranch(staff) || "").toLowerCase().includes(query)
//       )
//     })
//   }, [baseList, searchQuery])

//   async function remove(id: string) {
//     if (!confirm("Delete this staff member?")) return
//     const res = await fetch(`/api/staff?id=${id}`, { method: "DELETE" })
//     if (!res.ok) return alert("Delete failed")
//     mutate()
//   }

//   const handleViewDetails = (personId: string) => {
//     setSelectedPersonId(personId)
//     setDetailsOpen(true)
//   }

//   return (
//     <div className="space-y-6 px-4 sm:px-0">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="space-y-1">
//           {currentUser?.institutionName && (
//             <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
//               {currentUser.institutionName}
//             </div>
//           )}
//           <h1 className="text-balance text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
//             Staff Management
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600">Manage your team members and track their attendance</p>
//         </div>
//         <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
//           <ExportDropdown type="staff" data={filteredStaff || []} disabled={!data?.items?.length} />
//           <Dialog
//             open={open}
//             onOpenChange={(v) => {
//               setOpen(v)
//               if (!v) setEditing(null)
//             }}
//           >
//             <DialogTrigger asChild>
//               <Button className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 shadow-lg h-10 sm:h-9">
//                 Add Staff Member
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
//               <DialogHeader>
//                 <DialogTitle className="text-lg sm:text-xl">
//                   {editing ? "Edit Staff Member" : "Add New Staff Member"}
//                 </DialogTitle>
//               </DialogHeader>
//               {data && (
//                 <PeopleForm
//                   type="staff"
//                   departments={data.departments}
//                   roles={data.roles}
//                   shifts={data.shifts}
//                   initial={editing ?? undefined}
//                   onSaved={() => {
//                     setOpen(false)
//                     setEditing(null)
//                     mutate()
//                   }}
//                 />
//               )}
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {selectedBranch && (
//         <div className="flex items-center justify-between">
//           <button
//             onClick={() => setSelectedBranch(null)}
//             className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
//             aria-label="Back to branches"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             <span>Back to branches</span>
//           </button>
//           <div className="text-sm text-gray-600">
//             Branch: <span className="font-semibold text-teal-600">{selectedBranch}</span> •{" "}
//             <span className="font-medium">{filteredStaff.length}</span> staff
//           </div>
//         </div>
//       )}

//       {!searchQuery && !selectedBranch && (
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
//           {Array.from(branchCounts.entries()).map(([branch, count]) => (
//             <Card
//               key={branch}
//               role="button"
//               onClick={() => setSelectedBranch(branch)}
//               className="hover:shadow-md transition-shadow cursor-pointer border-teal-200/60 bg-white"
//             >
//               <CardContent className="p-4 flex items-center gap-3">
//                 <div className="p-2 rounded-md bg-teal-50 text-teal-700">
//                   <Folder className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <div className="text-sm font-semibold text-gray-800">{branch}</div>
//                   <div className="text-xs text-gray-500">{count} staff</div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
//         <div className="flex-1 w-full sm:max-w-md">
//           <SearchBar
//             value={searchQuery}
//             onChange={setSearchQuery}
//             placeholder="Search by name, employee code, shift..."
//           />
//         </div>
//         <div className="text-xs sm:text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border self-start sm:self-auto">
//           Total Staff: <span className="font-semibold text-teal-600">{filteredStaff?.length || 0}</span>
//           {searchQuery && data?.items && <span className="text-gray-500"> of {data.items.length}</span>}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
//         {filteredStaff?.map((person) => (
//           <PersonCard
//             key={person.id}
//             person={person}
//             type="staff"
//             onView={() => handleViewDetails(person.id)}
//             onEdit={() => {
//               setEditing(person)
//               setOpen(true)
//             }}
//             onDelete={() => remove(person.id)}
//           />
//         ))}
//       </div>

//       {searchQuery && filteredStaff?.length === 0 && (
//         <div className="text-center py-8 sm:py-12">
//           <p className="text-sm sm:text-base text-gray-500">No staff members found matching "{searchQuery}"</p>
//         </div>
//       )}

//       <PersonDetailsModal
//         isOpen={detailsOpen}
//         onClose={() => setDetailsOpen(false)}
//         personId={selectedPersonId}
//         personType="staff"
//       />
//     </div>
//   )
// }


"use client"

import useSWR from "swr"
import type { Department, Role, Shift, Staff } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PeopleForm } from "@/components/people-form"
import { PersonCard } from "@/components/person-card"
import { PersonDetailsModal } from "@/components/person-details-modal"
import { SearchBar } from "@/components/search-bar"
import { useState, useMemo, useEffect } from "react"
import { ExportDropdown } from "@/components/export-dropdown"
import { getStoredUser } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Folder, ArrowLeft } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function StaffPage() {
  const [endpoint, setEndpoint] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Staff | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedPersonId, setSelectedPersonId] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null)

  useEffect(() => {
    const u = getStoredUser()
    setCurrentUser(u)
    if (!u) {
      setEndpoint("/api/staff")
      return
    }
    if (u.role === "SuperAdmin") {
      setEndpoint("/api/staff")
    } else {
      const inst = u.institutionName || ""
      setEndpoint(`/api/staff?institutionName=${encodeURIComponent(inst)}`)
    }
  }, [])

  const { data, mutate } = useSWR<{ items: Staff[]; departments: Department[]; roles: Role[]; shifts: Shift[] }>(
    endpoint,
    endpoint ? fetcher : (null as any),
  )

  const professionCounts = useMemo(() => {
    const counts = new Map<string, number>()
    if (!data?.items) return counts
    for (const s of data.items) {
      const key = s.profession || "Unassigned"
      counts.set(key, (counts.get(key) || 0) + 1)
    }
    return counts
  }, [data?.items])

  const baseList = useMemo(() => {
    if (!data?.items) return []
    if (!selectedProfession) return data.items
    return data.items.filter((s) => (s.profession || "Unassigned") === selectedProfession)
  }, [data?.items, selectedProfession])

  const filteredStaff = useMemo(() => {
    if (!baseList || !searchQuery.trim()) return baseList || []
    const query = searchQuery.toLowerCase().trim()
    return baseList.filter((staff) => {
      const bc = (staff as any).branchClass || ""
      return (
        staff.name.toLowerCase().includes(query) ||
        staff.employeeCode?.toLowerCase().includes(query) ||
        staff.shift?.toLowerCase().includes(query) ||
        staff.role?.toLowerCase().includes(query) ||
        (staff.profession || "").toLowerCase().includes(query) ||
        bc.toLowerCase().includes(query)
      )
    })
  }, [baseList, searchQuery])

  async function remove(id: string) {
    if (!confirm("Delete this staff member?")) return
    const res = await fetch(`/api/staff?id=${id}`, { method: "DELETE" })
    if (!res.ok) return alert("Delete failed")
    mutate()
  }

  const handleViewDetails = (personId: string) => {
    setSelectedPersonId(personId)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          {currentUser?.institutionName && (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
              {currentUser.institutionName}
            </div>
          )}
          <h1 className="text-balance text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Staff Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your team members and track their attendance</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <ExportDropdown type="staff" data={filteredStaff || []} disabled={!data?.items?.length} />
          <Dialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v)
              if (!v) setEditing(null)
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 shadow-lg h-10 sm:h-9">
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">
                  {editing ? "Edit Staff Member" : "Add New Staff Member"}
                </DialogTitle>
              </DialogHeader>
              {data && (
                <PeopleForm
                  type="staff"
                  departments={data.departments}
                  roles={data.roles}
                  shifts={data.shifts}
                  initial={editing ?? undefined}
                  onSaved={() => {
                    setOpen(false)
                    setEditing(null)
                    mutate()
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {selectedProfession && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedProfession(null)}
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            aria-label="Back to professions"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to professions</span>
          </button>
          <div className="text-sm text-gray-600">
            Profession: <span className="font-semibold text-teal-600">{selectedProfession}</span> •{" "}
            <span className="font-medium">{filteredStaff.length}</span> staff
          </div>
        </div>
      )}

      {!searchQuery && !selectedProfession && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from(professionCounts.entries()).map(([profession, count]) => (
            <Card
              key={profession}
              role="button"
              onClick={() => setSelectedProfession(profession)}
              className="hover:shadow-md transition-shadow cursor-pointer border-teal-200/60 bg-white"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-md bg-teal-50 text-teal-700">
                  <Folder className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{profession}</div>
                  <div className="text-xs text-gray-500">{count} staff</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, employee code, shift..."
          />
        </div>
        <div className="text-xs sm:text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border self-start sm:self-auto">
          Total Staff: <span className="font-semibold text-teal-600">{filteredStaff?.length || 0}</span>
          {searchQuery && data?.items && <span className="text-gray-500"> of {data.items.length}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredStaff?.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            type="staff"
            onView={() => handleViewDetails(person.id)}
            onEdit={() => {
              setEditing(person)
              setOpen(true)
            }}
            onDelete={() => remove(person.id)}
          />
        ))}
      </div>

      {searchQuery && filteredStaff?.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-gray-500">No staff members found matching "{searchQuery}"</p>
        </div>
      )}

      <PersonDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        personId={selectedPersonId}
        personType="staff"
      />
    </div>
  )
}

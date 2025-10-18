
// // "use client"

// // import useSWR from "swr"
// // import type { Department, Role, Shift, Student, ClassLevel } from "@/lib/types"
// // import { Button } from "@/components/ui/button"
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// // import { PeopleForm } from "@/components/people-form"
// // import { PersonCard } from "@/components/person-card"
// // import { PersonDetailsModal } from "@/components/person-details-modal"
// // import { SearchBar } from "@/components/search-bar"
// // import { ExportDropdown } from "@/components/export-dropdown"
// // import { useState, useMemo, useEffect } from "react"
// // import { getStoredUser } from "@/lib/auth"

// // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // export default function StudentsPage() {
// //   const [endpoint, setEndpoint] = useState<string | null>(null)
// //   const [currentUser, setCurrentUser] = useState<any>(null)
// //   const { data, mutate } = useSWR<{
// //     items: Student[]
// //     departments: Department[]
// //     roles: Role[]
// //     shifts: Shift[]
// //     classLevels: ClassLevel[]
// //   }>(endpoint, endpoint ? fetcher : (null as any))
// //   const [open, setOpen] = useState(false)
// //   const [editing, setEditing] = useState<Student | null>(null)
// //   const [detailsOpen, setDetailsOpen] = useState(false)
// //   const [selectedPersonId, setSelectedPersonId] = useState<string>("")
// //   const [searchQuery, setSearchQuery] = useState("")

// //   useEffect(() => {
// //     const u = getStoredUser()
// //     setCurrentUser(u)
// //     if (!u) {
// //       setEndpoint("/api/students")
// //       return
// //     }
// //     if (u.role === "SuperAdmin") {
// //       setEndpoint("/api/students")
// //     } else {
// //       const inst = u.institutionName || ""
// //       setEndpoint(`/api/students?institutionName=${encodeURIComponent(inst)}`)
// //     }
// //   }, [])

// //   const filteredStudents = useMemo(() => {
// //     if (!data?.items || !searchQuery.trim()) return data?.items || []

// //     const query = searchQuery.toLowerCase().trim()
// //     return data.items.filter((student) => {
// //       return (
// //         student.name.toLowerCase().includes(query) ||
// //         student.rollNumber?.toLowerCase().includes(query) ||
// //         student.shift?.toString().toLowerCase().includes(query) ||
// //         student.classLevel?.toString().toLowerCase().includes(query) ||
// //         student.role?.toString().toLowerCase().includes(query)
// //       )
// //     })
// //   }, [data?.items, searchQuery])

// //   async function remove(id: string) {
// //     if (!confirm("Delete this student?")) return
// //     const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" })
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
// //           <h1 className="text-balance text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
// //             Student Management
// //           </h1>
// //           <p className="text-sm sm:text-base text-gray-600">
// //             Manage student records from LKG to PG and track attendance
// //           </p>
// //         </div>
// //         <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
// //           <ExportDropdown type="students" data={filteredStudents || []} disabled={!data?.items?.length} />
// //           <Dialog
// //             open={open}
// //             onOpenChange={(v) => {
// //               setOpen(v)
// //               if (!v) setEditing(null)
// //             }}
// //           >
// //             <DialogTrigger asChild>
// //               <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg h-10 sm:h-9">
// //                 Add Student
// //               </Button>
// //             </DialogTrigger>
// //             <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
// //               <DialogHeader>
// //                 <DialogTitle className="text-lg sm:text-xl">{editing ? "Edit Student" : "Add New Student"}</DialogTitle>
// //               </DialogHeader>
// //               {data && (
// //                 <PeopleForm
// //                   type="student"
// //                   departments={data.departments}
// //                   roles={data.roles}
// //                   shifts={data.shifts}
// //                   classLevels={data.classLevels}
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
// //             placeholder="Search by name, roll number, class..."
// //           />
// //         </div>
// //         <div className="text-xs sm:text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border self-start sm:self-auto">
// //           Total Students: <span className="font-semibold text-purple-600">{filteredStudents?.length || 0}</span>
// //           {searchQuery && data?.items && <span className="text-gray-500"> of {data.items.length}</span>}
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
// //         {filteredStudents?.map((person) => (
// //           <PersonCard
// //             key={person.id}
// //             person={person}
// //             type="student"
// //             onView={() => handleViewDetails(person.id)}
// //             onEdit={() => {
// //               setEditing(person)
// //               setOpen(true)
// //             }}
// //             onDelete={() => remove(person.id)}
// //           />
// //         ))}
// //       </div>

// //       {searchQuery && filteredStudents?.length === 0 && (
// //         <div className="text-center py-8 sm:py-12">
// //           <p className="text-sm sm:text-base text-gray-500">No students found matching "{searchQuery}"</p>
// //         </div>
// //       )}

// //       <PersonDetailsModal
// //         isOpen={detailsOpen}
// //         onClose={() => setDetailsOpen(false)}
// //         personId={selectedPersonId}
// //         personType="student"
// //       />
// //     </div>
// //   )
// // }



// "use client"

// import useSWR from "swr"
// import type { Department, Role, Shift, Student, ClassLevel } from "@/lib/types"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { PeopleForm } from "@/components/people-form"
// import { PersonCard } from "@/components/person-card"
// import { PersonDetailsModal } from "@/components/person-details-modal"
// import { SearchBar } from "@/components/search-bar"
// import { ExportDropdown } from "@/components/export-dropdown"
// import { useState, useMemo, useEffect } from "react"
// import { getStoredUser } from "@/lib/auth"
// import { Card, CardContent } from "@/components/ui/card"
// import { Folder, ArrowLeft } from "lucide-react"

// const fetcher = (url: string) => fetch(url).then((r) => r.json())

// export default function StudentsPage() {
//   const [endpoint, setEndpoint] = useState<string | null>(null)
//   const [currentUser, setCurrentUser] = useState<any>(null)
//   const { data, mutate } = useSWR<{
//     items: Student[]
//     departments: Department[]
//     roles: Role[]
//     shifts: Shift[]
//     classLevels: ClassLevel[]
//   }>(endpoint, endpoint ? fetcher : (null as any))
//   const [open, setOpen] = useState(false)
//   const [editing, setEditing] = useState<Student | null>(null)
//   const [detailsOpen, setDetailsOpen] = useState(false)
//   const [selectedPersonId, setSelectedPersonId] = useState<string>("")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedBranch, setSelectedBranch] = useState<string | null>(null)

//   useEffect(() => {
//     const u = getStoredUser()
//     setCurrentUser(u)
//     if (!u) {
//       setEndpoint("/api/students")
//       return
//     }
//     if (u.role === "SuperAdmin") {
//       setEndpoint("/api/students")
//     } else {
//       const inst = u.institutionName || ""
//       setEndpoint(`/api/students?institutionName=${encodeURIComponent(inst)}`)
//     }
//   }, [])

//   const branchCounts = useMemo(() => {
//     const counts = new Map<string, number>()
//     if (!data?.items) return counts
//     for (const s of data.items) {
//       const key = s.branch || "Unassigned"
//       counts.set(key, (counts.get(key) || 0) + 1)
//     }
//     return counts
//   }, [data?.items])

//   const baseList = useMemo(() => {
//     if (!data?.items) return []
//     if (!selectedBranch) return data.items
//     return data.items.filter((s) => (selectedBranch === "Unassigned" ? !s.branch : s.branch === selectedBranch))
//   }, [data?.items, selectedBranch])

//   const filteredStudents = useMemo(() => {
//     if (!baseList || !searchQuery.trim()) return baseList || []
//     const query = searchQuery.toLowerCase().trim()
//     return baseList.filter((student) => {
//       return (
//         student.name.toLowerCase().includes(query) ||
//         student.rollNumber?.toLowerCase().includes(query) ||
//         student.shift.name.toLowerCase().includes(query) ||
//         student.classLevel?.name.toLowerCase().includes(query) ||
//         student.role.name.toLowerCase().includes(query) ||
//         (student.branch || "").toLowerCase().includes(query)
//       )
//     })
//   }, [baseList, searchQuery])

//   async function remove(id: string) {
//     if (!confirm("Delete this student?")) return
//     const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" })
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
//           <h1 className="text-balance text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//             Student Management
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600">
//             Manage student records from LKG to PG and track attendance
//           </p>
//         </div>
//         <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
//           <ExportDropdown type="students" data={filteredStudents || []} disabled={!data?.items?.length} />
//           <Dialog
//             open={open}
//             onOpenChange={(v) => {
//               setOpen(v)
//               if (!v) setEditing(null)
//             }}
//           >
//             <DialogTrigger asChild>
//               <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg h-10 sm:h-9">
//                 Add Student
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
//               <DialogHeader>
//                 <DialogTitle className="text-lg sm:text-xl">{editing ? "Edit Student" : "Add New Student"}</DialogTitle>
//               </DialogHeader>
//               {data && (
//                 <PeopleForm
//                   type="student"
//                   departments={data.departments}
//                   roles={data.roles}
//                   shifts={data.shifts}
//                   classLevels={data.classLevels}
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
//             Branch: <span className="font-semibold text-purple-600">{selectedBranch}</span> •{" "}
//             <span className="font-medium">{filteredStudents.length}</span> students
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
//               className="hover:shadow-md transition-shadow cursor-pointer border-purple-200/60 bg-white"
//             >
//               <CardContent className="p-4 flex items-center gap-3">
//                 <div className="p-2 rounded-md bg-purple-50 text-purple-700">
//                   <Folder className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <div className="text-sm font-semibold text-gray-800">{branch}</div>
//                   <div className="text-xs text-gray-500">{count} students</div>
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
//             placeholder="Search by name, roll number, class..."
//           />
//         </div>
//         <div className="text-xs sm:text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border self-start sm:self-auto">
//           Total Students: <span className="font-semibold text-purple-600">{filteredStudents?.length || 0}</span>
//           {searchQuery && data?.items && <span className="text-gray-500"> of {data.items.length}</span>}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
//         {filteredStudents?.map((person) => (
//           <PersonCard
//             key={person.id}
//             person={person}
//             type="student"
//             onView={() => handleViewDetails(person.id)}
//             onEdit={() => {
//               setEditing(person)
//               setOpen(true)
//             }}
//             onDelete={() => remove(person.id)}
//           />
//         ))}
//       </div>

//       {searchQuery && filteredStudents?.length === 0 && (
//         <div className="text-center py-8 sm:py-12">
//           <p className="text-sm sm:text-base text-gray-500">No students found matching "{searchQuery}"</p>
//         </div>
//       )}

//       <PersonDetailsModal
//         isOpen={detailsOpen}
//         onClose={() => setDetailsOpen(false)}
//         personId={selectedPersonId}
//         personType="student"
//       />
//     </div>
//   )
// }



"use client"

import useSWR from "swr"
import type { Department, Role, Shift, Student, ClassLevel } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PeopleForm } from "@/components/people-form"
import { PersonCard } from "@/components/person-card"
import { PersonDetailsModal } from "@/components/person-details-modal"
import { SearchBar } from "@/components/search-bar"
import { ExportDropdown } from "@/components/export-dropdown"
import { useState, useMemo, useEffect } from "react"
import { getStoredUser } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Folder, ArrowLeft } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function StudentsPage() {
  const [endpoint, setEndpoint] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { data, mutate } = useSWR<{
    items: Student[]
    departments: Department[]
    roles: Role[]
    shifts: Shift[]
    classLevels: ClassLevel[]
  }>(endpoint, endpoint ? fetcher : (null as any))
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedPersonId, setSelectedPersonId] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)

  useEffect(() => {
    const u = getStoredUser()
    setCurrentUser(u)
    if (!u) {
      setEndpoint("/api/students")
      return
    }
    if (u.role === "SuperAdmin") {
      setEndpoint("/api/students")
    } else {
      const inst = u.institutionName || ""
      setEndpoint(`/api/students?institutionName=${encodeURIComponent(inst)}`)
    }
  }, [])

  const branchCounts = useMemo(() => {
    const counts = new Map<string, number>()
    if (!data?.items) return counts
    for (const s of data.items) {
      const key = (s as any).branchClass?.trim() || s.branch || "Unassigned"
      counts.set(key, (counts.get(key) || 0) + 1)
    }
    return counts
  }, [data?.items])

  const baseList = useMemo(() => {
    if (!data?.items) return []
    if (!selectedBranch) return data.items
    return data.items.filter((s) => {
      const key = (s as any).branchClass?.trim() || s.branch || "Unassigned"
      return selectedBranch === key
    })
  }, [data?.items, selectedBranch])

  const filteredStudents = useMemo(() => {
    if (!baseList || !searchQuery.trim()) return baseList || []
    const query = searchQuery.toLowerCase().trim()
    return baseList.filter((student) => {
      const bc = (student as any).branchClass || ""
      return (
        student.name.toLowerCase().includes(query) ||
        student.rollNumber?.toLowerCase().includes(query) ||
        student.shift?.toLowerCase().includes(query) ||
        student.classLevel?.toLowerCase().includes(query) ||
        student.role?.toLowerCase().includes(query) ||
        bc.toLowerCase().includes(query) ||
        (student.branch || "").toLowerCase().includes(query)
      )
    })
  }, [baseList, searchQuery])

  async function remove(id: string) {
    if (!confirm("Delete this student?")) return
    const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" })
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
          <h1 className="text-balance text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Student Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage student records from LKG to PG and track attendance
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <ExportDropdown type="students" data={filteredStudents || []} disabled={!data?.items?.length} />
          <Dialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v)
              if (!v) setEditing(null)
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg h-10 sm:h-9">
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">{editing ? "Edit Student" : "Add New Student"}</DialogTitle>
              </DialogHeader>
              {data && (
                <PeopleForm
                  type="student"
                  departments={data.departments}
                  roles={data.roles}
                  shifts={data.shifts}
                  classLevels={data.classLevels}
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

      {selectedBranch && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedBranch(null)}
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            aria-label="Back to branches"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to branches</span>
          </button>
          <div className="text-sm text-gray-600">
            Branch: <span className="font-semibold text-purple-600">{selectedBranch}</span> •{" "}
            <span className="font-medium">{filteredStudents.length}</span> students
          </div>
        </div>
      )}

      {!searchQuery && !selectedBranch && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from(branchCounts.entries()).map(([branch, count]) => (
            <Card
              key={branch}
              role="button"
              onClick={() => setSelectedBranch(branch)}
              className="hover:shadow-md transition-shadow cursor-pointer border-purple-200/60 bg-white"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-md bg-purple-50 text-purple-700">
                  <Folder className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{branch}</div>
                  <div className="text-xs text-gray-500">{count} students</div>
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
            placeholder="Search by name, roll number, class..."
          />
        </div>
        <div className="text-xs sm:text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border self-start sm:self-auto">
          Total Students: <span className="font-semibold text-purple-600">{filteredStudents?.length || 0}</span>
          {searchQuery && data?.items && <span className="text-gray-500"> of {data.items.length}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredStudents?.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            type="student"
            onView={() => handleViewDetails(person.id)}
            onEdit={() => {
              setEditing(person)
              setOpen(true)
            }}
            onDelete={() => remove(person.id)}
          />
        ))}
      </div>

      {searchQuery && filteredStudents?.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-gray-500">No students found matching "{searchQuery}"</p>
        </div>
      )}

      <PersonDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        personId={selectedPersonId}
        personType="student"
      />
    </div>
  )
}

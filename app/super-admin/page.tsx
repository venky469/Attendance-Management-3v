
// // "use client"

// // import useSWR from "swr"
// // import { useEffect, useMemo, useState } from "react"
// // import { useRouter } from "next/navigation"
// // import { getStoredUser } from "@/lib/auth"
// // import type { Department, Role, Shift, Staff, Student } from "@/lib/types"
// // import { Button } from "@/components/ui/button"
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// // import { Input } from "@/components/ui/input"
// // import { PeopleForm } from "@/components/people-form"
// // import { PersonCard } from "@/components/person-card"
// // import { PersonDetailsModal } from "@/components/person-details-modal"
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // export default function SuperAdminPage() {
// //   const router = useRouter()
// //   const [user, setUser] = useState<any>(null)

// //   useEffect(() => {
// //     const u = getStoredUser()
// //     setUser(u)
// //     if (!u) {
// //       router.push("/login")
// //       return
// //     }
// //     if (u.role !== "SuperAdmin") {
// //       router.push("/")
// //     }
// //   }, [router])

// //   const { data: staffData, mutate: mutateStaff } = useSWR<{
// //     items: Staff[]
// //     departments: Department[]
// //     roles: Role[]
// //     shifts: Shift[]
// //   }>("/api/staff", fetcher)
// //   const { data: studentsData, mutate: mutateStudents } = useSWR<{
// //     items: Student[]
// //     departments: Department[]
// //     roles: Role[]
// //     shifts: Shift[]
// //     classLevels: any[]
// //   }>("/api/students", fetcher)

// //   const [activeTab, setActiveTab] = useState<"admins" | "staff" | "students">("admins")
// //   const [search, setSearch] = useState("")
// //   const [open, setOpen] = useState(false)
// //   const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
// //   const [editingStudent, setEditingStudent] = useState<Student | null>(null)
// //   const [editingAdmin, setEditingAdmin] = useState<Staff | null>(null)
// //   const [detailsOpen, setDetailsOpen] = useState(false)
// //   const [selectedPersonId, setSelectedPersonId] = useState<string>("")
// //   const [selectedPersonType, setSelectedPersonType] = useState<"staff" | "student">("staff")

// //   const filteredStaff = useMemo(() => {
// //     const all = staffData?.items || []
// //     if (!search.trim()) return all
// //     const q = search.toLowerCase().trim()
// //     return all.filter((s) =>
// //       [s.name, s.email, s.employeeCode, s.department, s.role, s.shift]
// //         .filter(Boolean)
// //         .some((v) => String(v).toLowerCase().includes(q)),
// //     )
// //   }, [staffData?.items, search])

// //   const filteredAdmins = useMemo(() => {
// //     const all = staffData?.items || []
// //     if (!search.trim()) return all.filter((s) => s.role === "Admin")
// //     const q = search.toLowerCase().trim()
// //     return all
// //       .filter((s) => s.role === "Admin")
// //       .filter((s) =>
// //         [s.name, s.email, s.employeeCode, s.department, s.shift, s.institutionName]
// //           .filter(Boolean)
// //           .some((v) => String(v).toLowerCase().includes(q)),
// //       )
// //   }, [staffData?.items, search])

// //   const filteredStudents = useMemo(() => {
// //     const all = studentsData?.items || []
// //     if (!search.trim()) return all
// //     const q = search.toLowerCase().trim()
// //     return all.filter((s) =>
// //       [s.name, s.email, s.rollNumber, s.department, s.role, s.shift, s.classLevel, s.branch]
// //         .filter(Boolean)
// //         .some((v) => String(v).toLowerCase().includes(q)),
// //     )
// //   }, [studentsData?.items, search])

// //   async function removeStaff(id: string) {
// //     if (!confirm("Delete this staff member?")) return
// //     const res = await fetch(`/api/staff?id=${id}`, { method: "DELETE" })
// //     if (!res.ok) return alert("Delete failed")
// //     mutateStaff()
// //   }

// //   async function removeStudent(id: string) {
// //     if (!confirm("Delete this student?")) return
// //     const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" })
// //     if (!res.ok) return alert("Delete failed")
// //     mutateStudents()
// //   }

// //   function onView(personId: string, type: "staff" | "student") {
// //     setSelectedPersonId(personId)
// //     setSelectedPersonType(type)
// //     setDetailsOpen(true)
// //   }

// //   async function seedDefaults() {
// //     const body = {
// //       staff: [
// //         {
// //           name: "Super Admin",
// //           email: "superadmin@genamplify.com",
// //           password: "superadmin123",
// //           phone: "+91-9000000000",
// //           department: "Engineering",
// //           role: "SuperAdmin",
// //           shift: "Morning",
// //           parentName: "N/A",
// //           address: "HQ",
// //           dateOfBirth: "1980-01-01",
// //           dateOfJoining: "2020-01-01",
// //         },
// //         {
// //           name: "Primary Admin",
// //           email: "admin@genamplify.com",
// //           password: "admin123",
// //           phone: "+91-9000000001",
// //           department: "HR",
// //           role: "Admin",
// //           shift: "Morning",
// //           parentName: "N/A",
// //           address: "HQ",
// //           dateOfBirth: "1985-02-02",
// //           dateOfJoining: "2021-01-01",
// //         },
// //         {
// //           name: "Ops Manager",
// //           email: "manager@genamplify.com",
// //           password: "manager123",
// //           phone: "+91-9000000002",
// //           department: "Operations",
// //           role: "Manager",
// //           shift: "Evening",
// //           parentName: "N/A",
// //           address: "Branch Office",
// //           dateOfBirth: "1987-03-03",
// //           dateOfJoining: "2022-06-01",
// //         },
// //         {
// //           name: "Head Master - Sunrise College",
// //           email: "headmaster.sunrise@example.com",
// //           password: "headmaster123",
// //           phone: "+91-9000000010",
// //           department: "Operations",
// //           role: "Admin",
// //           shift: "Morning",
// //           parentName: "N/A",
// //           address: "Sunrise Campus, City",
// //           dateOfBirth: "1982-07-07",
// //           dateOfJoining: "2023-01-10",
// //           institutionName: "Sunrise Engineering College",
// //         },
// //       ],
// //       students: [
// //         {
// //           name: "Test Student 1",
// //           email: "student1@genamplify.com",
// //           password: "student123",
// //           phone: "+91-9000001001",
// //           department: "Academics",
// //           role: "Student",
// //           shift: "Morning",
// //           parentName: "Parent A",
// //           address: "City A",
// //           dateOfBirth: "2003-04-04",
// //           dateOfJoining: "2024-06-01",
// //           academicYear: "2024-25",
// //           classLevel: "UG",
// //         },
// //         {
// //           name: "Test Student 2",
// //           email: "student2@genamplify.com",
// //           password: "student123",
// //           phone: "+91-9000001002",
// //           department: "Academics",
// //           role: "Student",
// //           shift: "Morning",
// //           parentName: "Parent B",
// //           address: "City B",
// //           dateOfBirth: "2002-05-05",
// //           dateOfJoining: "2024-06-01",
// //           academicYear: "2024-25",
// //           classLevel: "PG",
// //         },
// //       ],
// //     }

// //     try {
// //       const res = await fetch("/api/seed", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(body),
// //       })
// //       const json = await res.json()
// //       if (!res.ok || !json.success) {
// //         alert(json?.message || "Seeding failed")
// //         return
// //       }
// //       alert(json.message)
// //       mutateStaff()
// //       mutateStudents()
// //     } catch (e) {
// //       console.error("[super-admin] seed error", e)
// //       alert("Seeding failed. See console for details.")
// //     }
// //   }

// //   if (!user || user.role !== "SuperAdmin") return null

// //   return (
// //     <div className="space-y-6 px-4 sm:px-0">
// //       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //         <div className="space-y-1">
// //           <h1 className="text-balance text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
// //             Super Admin
// //           </h1>
// //           <p className="text-sm sm:text-base text-gray-600">Manage all users, seed defaults, and perform full CRUD</p>
// //         </div>
// //         <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
// //           <Button
// //             onClick={seedDefaults}
// //             className="bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 shadow-lg"
// //           >
// //             Seed Default Data
// //           </Button>
// //         </div>
// //       </div>

// //       <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
// //         <div className="flex-1 w-full sm:max-w-md">
// //           <Input
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             placeholder="Search by name, email, code, role, department..."
// //           />
// //         </div>
// //         <div className="text-xs sm:text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border self-start sm:self-auto">
// //           Total:{" "}
// //           <span className="font-semibold text-teal-600">
// //             {(activeTab === "staff" ? filteredStaff?.length : filteredStudents?.length) || 0}
// //           </span>
// //         </div>
// //       </div>

// //       <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
// //         <TabsList>
// //           <TabsTrigger value="admins">Admins (Head Masters)</TabsTrigger>
// //           <TabsTrigger value="staff">Staff</TabsTrigger>
// //           <TabsTrigger value="students">Students</TabsTrigger>
// //         </TabsList>

// //         <TabsContent value="admins" className="mt-4">
// //           <div className="flex justify-end mb-3">
// //             <Dialog
// //               open={open && activeTab === "admins"}
// //               onOpenChange={(v) => {
// //                 setOpen(v)
// //                 if (!v) setEditingAdmin(null)
// //               }}
// //             >
// //               <DialogTrigger asChild>
// //                 <Button className="bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700">
// //                   Add Head Master
// //                 </Button>
// //               </DialogTrigger>
// //               <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
// //                 <DialogHeader>
// //                   <DialogTitle>{editingAdmin ? "Edit Head Master" : "Add New Head Master"}</DialogTitle>
// //                 </DialogHeader>
// //                 {staffData && (
// //                   <PeopleForm
// //                     type="staff"
// //                     departments={staffData.departments}
// //                     roles={staffData.roles}
// //                     shifts={staffData.shifts}
// //                     initial={editingAdmin ? editingAdmin : ({ role: "Admin" } as any)}
// //                     onSaved={() => {
// //                       setOpen(false)
// //                       setEditingAdmin(null)
// //                       mutateStaff()
// //                     }}
// //                   />
// //                 )}
// //               </DialogContent>
// //             </Dialog>
// //           </div>

// //           <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
// //             {filteredAdmins?.map((person) => (
// //               <PersonCard
// //                 key={person.id}
// //                 person={person}
// //                 type="staff"
// //                 onView={() => onView(person.id, "staff")}
// //                 onEdit={() => {
// //                   setEditingAdmin(person)
// //                   setOpen(true)
// //                 }}
// //                 onDelete={() => removeStaff(person.id)}
// //               />
// //             ))}
// //           </div>
// //         </TabsContent>

// //         <TabsContent value="staff" className="mt-4">
// //           <div className="flex justify-end mb-3">
// //             <Dialog
// //               open={open && activeTab === "staff"}
// //               onOpenChange={(v) => {
// //                 setOpen(v)
// //                 if (!v) setEditingStaff(null)
// //               }}
// //             >
// //               <DialogTrigger asChild>
// //                 <Button className="bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700">
// //                   Add Staff
// //                 </Button>
// //               </DialogTrigger>
// //               <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
// //                 <DialogHeader>
// //                   <DialogTitle>{editingStaff ? "Edit Staff" : "Add New Staff"}</DialogTitle>
// //                 </DialogHeader>
// //                 {staffData && (
// //                   <PeopleForm
// //                     type="staff"
// //                     departments={staffData.departments}
// //                     roles={staffData.roles}
// //                     shifts={staffData.shifts}
// //                     initial={editingStaff ?? undefined}
// //                     onSaved={() => {
// //                       setOpen(false)
// //                       setEditingStaff(null)
// //                       mutateStaff()
// //                     }}
// //                   />
// //                 )}
// //               </DialogContent>
// //             </Dialog>
// //           </div>

// //           <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
// //             {filteredStaff?.map((person) => (
// //               <PersonCard
// //                 key={person.id}
// //                 person={person}
// //                 type="staff"
// //                 onView={() => onView(person.id, "staff")}
// //                 onEdit={() => {
// //                   setEditingStaff(person)
// //                   setOpen(true)
// //                 }}
// //                 onDelete={() => removeStaff(person.id)}
// //               />
// //             ))}
// //           </div>
// //         </TabsContent>

// //         <TabsContent value="students" className="mt-4">
// //           <div className="flex justify-end mb-3">
// //             <Dialog
// //               open={open && activeTab === "students"}
// //               onOpenChange={(v) => {
// //                 setOpen(v)
// //                 if (!v) setEditingStudent(null)
// //               }}
// //             >
// //               <DialogTrigger asChild>
// //                 <Button className="bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700">
// //                   Add Student
// //                 </Button>
// //               </DialogTrigger>
// //               <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
// //                 <DialogHeader>
// //                   <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
// //                 </DialogHeader>
// //                 {studentsData && (
// //                   <PeopleForm
// //                     type="student"
// //                     departments={studentsData.departments}
// //                     roles={studentsData.roles}
// //                     shifts={studentsData.shifts}
// //                     classLevels={studentsData.classLevels as any}
// //                     initial={editingStudent ?? undefined}
// //                     onSaved={() => {
// //                       setOpen(false)
// //                       setEditingStudent(null)
// //                       mutateStudents()
// //                     }}
// //                   />
// //                 )}
// //               </DialogContent>
// //             </Dialog>
// //           </div>

// //           <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
// //             {filteredStudents?.map((person) => (
// //               <PersonCard
// //                 key={person.id}
// //                 person={person}
// //                 type="student"
// //                 onView={() => onView(person.id, "student")}
// //                 onEdit={() => {
// //                   setEditingStudent(person)
// //                   setOpen(true)
// //                 }}
// //                 onDelete={() => removeStudent(person.id)}
// //               />
// //             ))}
// //           </div>
// //         </TabsContent>
// //       </Tabs>

// //       <PersonDetailsModal
// //         isOpen={detailsOpen}
// //         onClose={() => setDetailsOpen(false)}
// //         personId={selectedPersonId}
// //         personType={selectedPersonType}
// //       />
// //     </div>
// //   )
// // }



// "use client"

// import useSWR from "swr"
// import { useEffect, useMemo, useState } from "react"
// import { useRouter } from 'next/navigation'
// import { getStoredUser } from "@/lib/auth"
// import type { Department, Role, Shift, Staff, Student } from "@/lib/types"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { PeopleForm } from "@/components/people-form"
// import { PersonCard } from "@/components/person-card"
// import { PersonDetailsModal } from "@/components/person-details-modal"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ModernLoader } from "@/components/modern-loader"

// const fetcher = (url: string) => fetch(url).then((r) => r.json())

// export default function SuperAdminPage() {
//   const router = useRouter()
//   const [user, setUser] = useState<any>(null)

//   useEffect(() => {
//     const u = getStoredUser()
//     setUser(u)
//     if (!u) {
//       router.push("/login")
//       return
//     }
//     if (u.role !== "SuperAdmin") {
//       router.push("/")
//     }
//   }, [router])

//   const { data: staffData, mutate: mutateStaff } = useSWR<{
//     items: Staff[]
//     departments: Department[]
//     roles: Role[]
//     shifts: Shift[]
//   }>("/api/staff", fetcher)
//   const { data: studentsData, mutate: mutateStudents } = useSWR<{
//     items: Student[]
//     departments: Department[]
//     roles: Role[]
//     shifts: Shift[]
//     classLevels: any[]
//   }>("/api/students", fetcher)

//   const [activeTab, setActiveTab] = useState<"admins" | "staff" | "students">("admins")
//   const [search, setSearch] = useState("")
//   const [open, setOpen] = useState(false)
//   const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
//   const [editingStudent, setEditingStudent] = useState<Student | null>(null)
//   const [editingAdmin, setEditingAdmin] = useState<Staff | null>(null)
//   const [detailsOpen, setDetailsOpen] = useState(false)
//   const [selectedPersonId, setSelectedPersonId] = useState<string>("")
//   const [selectedPersonType, setSelectedPersonType] = useState<"staff" | "student">("staff")

//   const filteredStaff = useMemo(() => {
//     const all = staffData?.items || []
//     if (!search.trim()) return all
//     const q = search.toLowerCase().trim()
//     return all.filter((s) =>
//       [s.name, s.email, s.employeeCode, s.department, s.role, s.shift]
//         .filter(Boolean)
//         .some((v) => String(v).toLowerCase().includes(q)),
//     )
//   }, [staffData?.items, search])

//   const filteredAdmins = useMemo(() => {
//     const all = staffData?.items || []
//     if (!search.trim()) return all.filter((s) => s.role === "Admin")
//     const q = search.toLowerCase().trim()
//     return all
//       .filter((s) => s.role === "Admin")
//       .filter((s) =>
//         [s.name, s.email, s.employeeCode, s.department, s.shift, s.institutionName]
//           .filter(Boolean)
//           .some((v) => String(v).toLowerCase().includes(q)),
//       )
//   }, [staffData?.items, search])

//   const filteredStudents = useMemo(() => {
//     const all = studentsData?.items || []
//     if (!search.trim()) return all
//     const q = search.toLowerCase().trim()
//     return all.filter((s) =>
//       [s.name, s.email, s.rollNumber, s.department, s.role, s.shift, s.classLevel, s.branch]
//         .filter(Boolean)
//         .some((v) => String(v).toLowerCase().includes(q)),
//     )
//   }, [studentsData?.items, search])

//   async function removeStaff(id: string) {
//     if (!confirm("Delete this staff member?")) return
//     const res = await fetch(`/api/staff?id=${id}`, { method: "DELETE" })
//     if (!res.ok) return alert("Delete failed")
//     mutateStaff()
//   }

//   async function removeStudent(id: string) {
//     if (!confirm("Delete this student?")) return
//     const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" })
//     if (!res.ok) return alert("Delete failed")
//     mutateStudents()
//   }

//   function onView(personId: string, type: "staff" | "student") {
//     setSelectedPersonId(personId)
//     setSelectedPersonType(type)
//     setDetailsOpen(true)
//   }

//   async function seedDefaults() {
//     const body = {
//       staff: [
//         {
//           name: "Super Admin",
//           email: "superadmin@genamplify.com",
//           password: "superadmin123",
//           phone: "+91-9000000000",
//           department: "Engineering",
//           role: "SuperAdmin",
//           shift: "Morning",
//           parentName: "N/A",
//           address: "HQ",
//           dateOfBirth: "1980-01-01",
//           dateOfJoining: "2020-01-01",
//         },
//         {
//           name: "Primary Admin",
//           email: "admin@genamplify.com",
//           password: "admin123",
//           phone: "+91-9000000001",
//           department: "HR",
//           role: "Admin",
//           shift: "Morning",
//           parentName: "N/A",
//           address: "HQ",
//           dateOfBirth: "1985-02-02",
//           dateOfJoining: "2021-01-01",
//         },
//         {
//           name: "Ops Manager",
//           email: "manager@genamplify.com",
//           password: "manager123",
//           phone: "+91-9000000002",
//           department: "Operations",
//           role: "Manager",
//           shift: "Evening",
//           parentName: "N/A",
//           address: "Branch Office",
//           dateOfBirth: "1987-03-03",
//           dateOfJoining: "2022-06-01",
//         },
//         {
//           name: "Head Master - Sunrise College",
//           email: "headmaster.sunrise@example.com",
//           password: "headmaster123",
//           phone: "+91-9000000010",
//           department: "Operations",
//           role: "Admin",
//           shift: "Morning",
//           parentName: "N/A",
//           address: "Sunrise Campus, City",
//           dateOfBirth: "1982-07-07",
//           dateOfJoining: "2023-01-10",
//           institutionName: "Sunrise Engineering College",
//         },
//       ],
//       students: [
//         {
//           name: "Test Student 1",
//           email: "student1@genamplify.com",
//           password: "student123",
//           phone: "+91-9000001001",
//           department: "Academics",
//           role: "Student",
//           shift: "Morning",
//           parentName: "Parent A",
//           address: "City A",
//           dateOfBirth: "2003-04-04",
//           dateOfJoining: "2024-06-01",
//           academicYear: "2024-25",
//           classLevel: "UG",
//         },
//         {
//           name: "Test Student 2",
//           email: "student2@genamplify.com",
//           password: "student123",
//           phone: "+91-9000001002",
//           department: "Academics",
//           role: "Student",
//           shift: "Morning",
//           parentName: "Parent B",
//           address: "City B",
//           dateOfBirth: "2002-05-05",
//           dateOfJoining: "2024-06-01",
//           academicYear: "2024-25",
//           classLevel: "PG",
//         },
//       ],
//     }

//     try {
//       const res = await fetch("/api/seed", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       })
//       const json = await res.json()
//       if (!res.ok || !json.success) {
//         alert(json?.message || "Seeding failed")
//         return
//       }
//       alert(json.message)
//       mutateStaff()
//       mutateStudents()
//     } catch (e) {
//       console.error("[super-admin] seed error", e)
//       alert("Seeding failed. See console for details.")
//     }
//   }

//   if (!user || user.role !== "SuperAdmin") {
//     return <ModernLoader message="Loading super admin panel" fullPage />
//   }

//   return (
//     <div className="space-y-6 px-4 sm:px-0">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="space-y-1">
//           <h1 className="text-balance text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
//             Super Admin
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600">Manage all users, seed defaults, and perform full CRUD</p>
//         </div>
//         <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
//           <Button
//             onClick={seedDefaults}
//             className="bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 shadow-lg"
//           >
//             Seed Default Data
//           </Button>
//         </div>
//       </div>

//       <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
//         <div className="flex-1 w-full sm:max-w-md">
//           <Input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by name, email, code, role, department..."
//           />
//         </div>
//         <div className="text-xs sm:text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border self-start sm:self-auto">
//           Total:{" "}
//           <span className="font-semibold text-teal-600">
//             {(activeTab === "staff" ? filteredStaff?.length : filteredStudents?.length) || 0}
//           </span>
//         </div>
//       </div>

//       <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
//         <TabsList>
//           <TabsTrigger value="admins">Admins (Head Masters)</TabsTrigger>
//           <TabsTrigger value="staff">Staff</TabsTrigger>
//           <TabsTrigger value="students">Students</TabsTrigger>
//         </TabsList>

//         <TabsContent value="admins" className="mt-4">
//           <div className="flex justify-end mb-3">
//             <Dialog
//               open={open && activeTab === "admins"}
//               onOpenChange={(v) => {
//                 setOpen(v)
//                 if (!v) setEditingAdmin(null)
//               }}
//             >
//               <DialogTrigger asChild>
//                 <Button className="bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700">
//                   Add Head Master
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
//                 <DialogHeader>
//                   <DialogTitle>{editingAdmin ? "Edit Head Master" : "Add New Head Master"}</DialogTitle>
//                 </DialogHeader>
//                 {staffData && (
//                   <PeopleForm
//                     type="staff"
//                     departments={staffData.departments}
//                     roles={staffData.roles}
//                     shifts={staffData.shifts}
//                     initial={editingAdmin ? editingAdmin : ({ role: "Admin" } as any)}
//                     onSaved={() => {
//                       setOpen(false)
//                       setEditingAdmin(null)
//                       mutateStaff()
//                     }}
//                   />
//                 )}
//               </DialogContent>
//             </Dialog>
//           </div>

//           <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
//             {filteredAdmins?.map((person) => (
//               <PersonCard
//                 key={person.id}
//                 person={person}
//                 type="staff"
//                 onView={() => onView(person.id, "staff")}
//                 onEdit={() => {
//                   setEditingAdmin(person)
//                   setOpen(true)
//                 }}
//                 onDelete={() => removeStaff(person.id)}
//               />
//             ))}
//           </div>
//         </TabsContent>

//         <TabsContent value="staff" className="mt-4">
//           <div className="flex justify-end mb-3">
//             <Dialog
//               open={open && activeTab === "staff"}
//               onOpenChange={(v) => {
//                 setOpen(v)
//                 if (!v) setEditingStaff(null)
//               }}
//             >
//               <DialogTrigger asChild>
//                 <Button className="bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700">
//                   Add Staff
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
//                 <DialogHeader>
//                   <DialogTitle>{editingStaff ? "Edit Staff" : "Add New Staff"}</DialogTitle>
//                 </DialogHeader>
//                 {staffData && (
//                   <PeopleForm
//                     type="staff"
//                     departments={staffData.departments}
//                     roles={staffData.roles}
//                     shifts={staffData.shifts}
//                     initial={editingStaff ?? undefined}
//                     onSaved={() => {
//                       setOpen(false)
//                       setEditingStaff(null)
//                       mutateStaff()
//                     }}
//                   />
//                 )}
//               </DialogContent>
//             </Dialog>
//           </div>

//           <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
//             {filteredStaff?.map((person) => (
//               <PersonCard
//                 key={person.id}
//                 person={person}
//                 type="staff"
//                 onView={() => onView(person.id, "staff")}
//                 onEdit={() => {
//                   setEditingStaff(person)
//                   setOpen(true)
//                 }}
//                 onDelete={() => removeStaff(person.id)}
//               />
//             ))}
//           </div>
//         </TabsContent>

//         <TabsContent value="students" className="mt-4">
//           <div className="flex justify-end mb-3">
//             <Dialog
//               open={open && activeTab === "students"}
//               onOpenChange={(v) => {
//                 setOpen(v)
//                 if (!v) setEditingStudent(null)
//               }}
//             >
//               <DialogTrigger asChild>
//                 <Button className="bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700">
//                   Add Student
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
//                 <DialogHeader>
//                   <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
//                 </DialogHeader>
//                 {studentsData && (
//                   <PeopleForm
//                     type="student"
//                     departments={studentsData.departments}
//                     roles={studentsData.roles}
//                     shifts={studentsData.shifts}
//                     classLevels={studentsData.classLevels as any}
//                     initial={editingStudent ?? undefined}
//                     onSaved={() => {
//                       setOpen(false)
//                       setEditingStudent(null)
//                       mutateStudents()
//                     }}
//                   />
//                 )}
//               </DialogContent>
//             </Dialog>
//           </div>

//           <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
//             {filteredStudents?.map((person) => (
//               <PersonCard
//                 key={person.id}
//                 person={person}
//                 type="student"
//                 onView={() => onView(person.id, "student")}
//                 onEdit={() => {
//                   setEditingStudent(person)
//                   setOpen(true)
//                 }}
//                 onDelete={() => removeStudent(person.id)}
//               />
//             ))}
//           </div>
//         </TabsContent>
//       </Tabs>

//       <PersonDetailsModal
//         isOpen={detailsOpen}
//         onClose={() => setDetailsOpen(false)}
//         personId={selectedPersonId}
//         personType={selectedPersonType}
//       />
//     </div>
//   )
// }



"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { getStoredUser, hasMinimumRole, type User } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, Calendar, FileText, ClipboardList, CheckCircle } from 'lucide-react'
import Link from "next/link"
import LiveTimeDisplay from "@/components/live-time-display"
import AttendanceCalendar from "@/components/attendance-calendar"
import useSWR from "swr"
import { ModernLoader } from "@/components/modern-loader"

const BarChartCard = dynamic(() => import("@/components/dashboard/bar-chart-card-lazy"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded-lg"></div>,
  ssr: false,
})

const LineChartCard = dynamic(() => import("@/components/dashboard/line-chart-card-lazy"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded-lg"></div>,
  ssr: false,
})

type Summary = {
  todayPresent: number
  todayAbsent: number
  todayLeave: number
  byDepartment: { name: string; present: number; absent: number }[]
  byRole: { name: string; present: number; absent: number }[]
  byShift: { name: string; present: number; absent: number }[]
  last7Days: { date: string; present: number; absent: number }[]
  totalPeople: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [resolvedStudentId, setResolvedStudentId] = useState<string | null>(null)

  const { data: summary, isLoading: summaryLoading } = useSWR<Summary>(
    user && !user.role.toLowerCase().includes("student")
      ? user.role !== "SuperAdmin" && user.institutionName
        ? `/api/reports/summary?institutionName=${encodeURIComponent(user.institutionName)}`
        : "/api/reports/summary"
      : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  )

  const { data: leaveStats } = useSWR(
    user ? `/api/leave-requests?personId=${(user as any)?.id || (user as any)?._id?.toString?.()}` : null,
    async (url) => {
      const myRequestsRes = await fetch(url)
      if (!myRequestsRes.ok) return { pending: 0, myRequests: 0 }

      const myData = await myRequestsRes.json()
      const myRequestsCount = myData.leaveRequests?.length || 0

      let pendingCount = 0
      if (hasMinimumRole("Manager")) {
        const inst = user?.role !== "SuperAdmin" ? user?.institutionName : undefined
        const pUrl = `/api/leave-requests?status=pending${inst ? `&institutionName=${encodeURIComponent(inst)}` : ""}`
        const pendingRes = await fetch(pUrl)
        if (pendingRes.ok) {
          const pendingData = await pendingRes.json()
          pendingCount = pendingData.leaveRequests?.length || 0
        }
      }

      return { pending: pendingCount, myRequests: myRequestsCount }
    },
    { revalidateOnFocus: false },
  )

  const quickStudentId = (user as any)?.id || (user as any)?._id?.toString?.()
  const computedStudentId = resolvedStudentId || quickStudentId

  const {
    data: personDetails,
    error: personError,
    isLoading: personLoading,
    mutate: mutatePersonDetails,
  } = useSWR(
    computedStudentId && user?.role?.toLowerCase() === "student"
      ? `/api/person-details?personId=${computedStudentId}&personType=student`
      : null,
    fetcher,
    { revalidateOnFocus: true },
  )

  const roleNormalized = user?.role ? String(user.role).trim().toLowerCase() : ""
  const isStudent = roleNormalized === "student"

  const getLocalYMD = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)

    const initialId = (storedUser as any)?.id || (storedUser as any)?._id?.toString?.() || null
    if (initialId) {
      setResolvedStudentId(initialId)
    }

    const tryResolveStudentId = async () => {
      try {
        const roleNorm = storedUser?.role ? String(storedUser.role).trim().toLowerCase() : ""
        if (roleNorm !== "student") return
        if (initialId) return

        const inst = storedUser?.role !== "SuperAdmin" ? storedUser?.institutionName : undefined
        const url = inst ? `/api/students?institutionName=${encodeURIComponent(inst)}` : "/api/students"
        const res = await fetch(url, { cache: "no-store" })
        if (!res.ok) return
        const payload = await res.json()
        const items: any[] = Array.isArray(payload?.items) ? payload.items : []

        const found = items.find(
          (s) =>
            (storedUser?.email && s?.email === storedUser.email) || (storedUser as any)?.rollNumber === s?.rollNumber,
        )
        if (found?.id) {
          setResolvedStudentId(found.id)
        }
      } catch (e) {
        console.error("Failed to resolve studentId:", e)
      }
    }

    tryResolveStudentId()
  }, [])

  if (!user) {
    return <ModernLoader message="Loading dashboard" fullPage />
  }

  if (!isStudent && summaryLoading) {
    return <ModernLoader message="Loading dashboard data" fullPage />
  }

  if (!isStudent && !summary) {
    return <ModernLoader message="Loading dashboard data" fullPage />
  }

  if (isStudent) {
    if (!computedStudentId) {
      return (
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-sm text-gray-600">Resolving your student profile… Please re-login if this persists.</p>
        </div>
      )
    }

    if (personLoading) {
      return <ModernLoader message="Loading your attendance" fullPage />
    }

    if (personError || !personDetails) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-red-600">Unable to load your attendance details.</p>
            <p className="text-xs text-muted-foreground">
              {personError?.message || "Please try refreshing the page or contact support if the issue persists."}
            </p>
          </div>
          <Button
            onClick={() => mutatePersonDetails()}
            variant="outline"
            className="border-teal-600 text-teal-700 hover:bg-teal-50"
          >
            Retry
          </Button>
        </div>
      )
    }

    const att = personDetails.attendance || { present: [], absent: [], late: [], leave: [] }
    const present = Array.isArray(att.present) ? att.present : []
    const absent = Array.isArray(att.absent) ? att.absent : []
    const late = Array.isArray(att.late) ? att.late : []
    const leave = Array.isArray(att.leave) ? att.leave : []

    const todayKey = getLocalYMD(new Date())
    const todayPresent = present.find((r: any) => r?.date === todayKey)
    const todayLate = late.find((r: any) => r?.date === todayKey)
    const todayAbsent = absent.find((r: any) => r?.date === todayKey)
    const todayLeave = leave.find((r: any) => r?.date === todayKey)

    const todayStatus = todayPresent
      ? "present"
      : todayLate
        ? "late"
        : todayLeave
          ? "leave"
          : todayAbsent
            ? "absent"
            : "not-marked"

    const statusChip =
      todayStatus === "present"
        ? "bg-green-100 text-green-800 border border-green-200"
        : todayStatus === "late"
          ? "bg-amber-100 text-amber-800 border border-amber-200"
          : todayStatus === "absent"
            ? "bg-red-100 text-red-800 border border-red-200"
            : todayStatus === "leave"
              ? "bg-blue-100 text-blue-800 border border-blue-200"
              : "bg-gray-100 text-gray-800 border border-gray-200"

    return (
      <div className="space-y-6 pb-20">
        <header className="space-y-1">
          <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Welcome back, {user.name}!
          </h1>
          <p className="text-sm text-gray-600">Student Home - Your attendance overview.</p>
        </header>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-800">Today's Attendance</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => mutatePersonDetails()}
              className="border-teal-200 text-teal-700 hover:bg-teal-50"
            >
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${statusChip}`}>
                {todayStatus === "not-marked"
                  ? "Not Marked"
                  : todayStatus.charAt(0).toUpperCase() + todayStatus.slice(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                {todayStatus === "present" || todayStatus === "late"
                  ? `In: ${
                      (todayPresent || todayLate)?.timestamp
                        ? new Date((todayPresent || todayLate).timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"
                    }`
                  : todayStatus === "leave"
                    ? "On Leave"
                    : todayStatus === "absent"
                      ? "Absent today"
                      : "Attendance not marked yet"}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Present Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{present.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-rose-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Absent Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">{absent.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">Late Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700">{late.length}</div>
            </CardContent>
          </Card>

          {Array.isArray(leave) && (
            <Card className="border-0 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Leave Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">{leave.length}</div>
              </CardContent>
            </Card>
          )}
        </div>

        <AttendanceCalendar attendanceData={att} />

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-green-700">Present</div>
              {present.length > 0 ? (
                <>
                  {present.slice(0, 4).map((r: any, i: number) => (
                    <div
                      key={`p-${i}`}
                      className="flex justify-between items-center p-2 bg-card rounded-lg shadow-sm border"
                    >
                      <span className="text-sm font-medium text-card-foreground">
                        {new Date(r.date).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                        {(r.timestamp &&
                          new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })) ||
                          "In"}
                      </span>
                    </div>
                  ))}
                  {present.length > 4 && (
                    <Link href="/student-attendance">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-green-700 hover:bg-green-50 hover:text-green-800"
                      >
                        View More ({present.length - 4})
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">No present days</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-red-700">Absent</div>
              {absent.length > 0 ? (
                <>
                  {absent.slice(0, 4).map((r: any, i: number) => (
                    <div
                      key={`a-${i}`}
                      className="flex justify-between items-center p-2 bg-card rounded-lg shadow-sm border"
                    >
                      <span className="text-sm font-medium text-card-foreground">
                        {new Date(r.date).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 border border-red-200">
                        Absent
                      </span>
                    </div>
                  ))}
                  {absent.length > 4 && (
                    <Link href="/student-attendance">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-red-700 hover:bg-red-50 hover:text-red-800"
                      >
                        View More ({absent.length - 4})
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">No absent days</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-amber-700">Late</div>
              {late.length > 0 ? (
                <>
                  {late.slice(0, 4).map((r: any, i: number) => (
                    <div
                      key={`l-${i}`}
                      className="flex justify-between items-center p-2 bg-card rounded-lg shadow-sm border"
                    >
                      <span className="text-sm font-medium text-card-foreground">
                        {new Date(r.date).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 border border-amber-200">
                        Late
                      </span>
                    </div>
                  ))}
                  {late.length > 4 && (
                    <Link href="/student-attendance">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        View More ({late.length - 4})
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">No late days</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {user.institutionName && (
        <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
          {user.institutionName}
        </div>
      )}
      <header className="space-y-1">
        <h1 className="text-balance text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Welcome back, {user.name}!
        </h1>
        <p className="text-sm text-gray-600">
          {user.role} Dashboard - Real-time overview by department, role, shift, and trends.
        </p>
      </header>

      <LiveTimeDisplay />

      {hasMinimumRole("Manager") && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Link href="/staff">
            <Button
              variant="outline"
              className="h-24 w-full flex-col space-y-2 hover:bg-teal-50 hover:border-teal-300 bg-gradient-to-br from-white to-teal-50 shadow-md hover:shadow-lg transition-all duration-200 border-teal-200"
            >
              <div className="p-2 bg-teal-100 rounded-lg">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <span className="text-sm font-semibold text-teal-700">Manage Staff</span>
            </Button>
          </Link>

          {hasMinimumRole("Manager") && (
            <Link href="/students">
              <Button
                variant="outline"
                className="h-24 w-full flex-col space-y-2 hover:bg-blue-50 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50 shadow-md hover:shadow-lg transition-all duration-200 border-blue-200"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-blue-700">Manage Students</span>
              </Button>
            </Link>
          )}

          <Link href="/attendance">
            <Button
              variant="outline"
              className="h-24 w-full flex-col space-y-2 hover:bg-green-50 hover:border-green-300 bg-gradient-to-br from-white to-green-50 shadow-md hover:shadow-lg transition-all duration-200 border-green-200"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-green-700">Attendance</span>
            </Button>
          </Link>

          <Link href="/leave-approval">
            <Button
              variant="outline"
              className="h-24 w-full flex-col space-y-2 hover:bg-orange-50 hover:border-orange-300 bg-gradient-to-br from-white to-orange-50 shadow-md hover:shadow-lg transition-all duration-200 border-orange-200 relative"
            >
              <div className="p-2 bg-orange-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm font-semibold text-orange-700">Leave Approval</span>
              {leaveStats && leaveStats.pending > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {leaveStats.pending}
                </div>
              )}
            </Button>
          </Link>

          {user.role === "Admin" && (
            <Link href="/reports">
              <Button
                variant="outline"
                className="h-24 w-full flex-col space-y-2 hover:bg-purple-50 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50 shadow-md hover:shadow-lg transition-all duration-200 border-purple-200"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-purple-700">Reports</span>
              </Button>
            </Link>
          )}
        </div>
      )}

      {!hasMinimumRole("Manager") && !isStudent && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Link href="/faceid">
            <Button
              variant="outline"
              className="h-24 w-full flex-col space-y-2 hover:bg-green-50 hover:border-green-300 bg-gradient-to-br from-white to-green-50 shadow-md hover:shadow-lg transition-all duration-200 border-green-200"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-green-700">Mark Attendance</span>
            </Button>
          </Link>

          <Link href="/student-attendance">
            <Button
              variant="outline"
              className="h-24 w-full flex-col space-y-2 hover:bg-blue-50 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50 shadow-md hover:shadow-lg transition-all duration-200 border-blue-200"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-blue-700">My Attendance</span>
            </Button>
          </Link>

          <Link href="/leave-requests">
            <Button
              variant="outline"
              className="h-24 w-full flex-col space-y-2 hover:bg-orange-50 hover:border-orange-300 bg-gradient-to-br from-white to-orange-50 shadow-md hover:shadow-lg transition-all duration-200 border-orange-200"
            >
              <div className="p-2 bg-orange-100 rounded-lg">
                <ClipboardList className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-sm font-semibold text-orange-700">Request Leave</span>
              {leaveStats && leaveStats.myRequests > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {leaveStats.myRequests}
                </span>
              )}
            </Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-100 border-teal-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-teal-700 flex items-center gap-2">
              <div className="p-1 bg-teal-200 rounded-lg">
                <UserCheck className="h-4 w-4" />
              </div>
              Today Present
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-teal-700">{summary.todayPresent}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-amber-700 flex items-center gap-2">
              <div className="p-1 bg-amber-200 rounded-lg">
                <Users className="h-4 w-4" />
              </div>
              Today Absent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-700">{summary.todayAbsent}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <div className="p-1 bg-blue-200 rounded-lg">
                <Calendar className="h-4 w-4" />
              </div>
              On Leave Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-700">{summary.todayLeave || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


"use client"

import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from 'next/navigation'
import { getStoredUser } from "@/lib/auth"
import type { Department, Role, Shift, Staff, Student } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PeopleForm } from "@/components/people-form"
import { PersonCard } from "@/components/person-card"
import { PersonDetailsModal } from "@/components/person-details-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModernLoader } from "@/components/modern-loader"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SuperAdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const u = getStoredUser()
    setUser(u)
    if (!u) {
      router.push("/login")
      return
    }
    if (u.role !== "SuperAdmin") {
      router.push("/")
    }
  }, [router])

  const { data: staffData, mutate: mutateStaff } = useSWR<{
    items: Staff[]
    departments: Department[]
    roles: Role[]
    shifts: Shift[]
  }>("/api/staff", fetcher)
  const { data: studentsData, mutate: mutateStudents } = useSWR<{
    items: Student[]
    departments: Department[]
    roles: Role[]
    shifts: Shift[]
    classLevels: any[]
  }>("/api/students", fetcher)

  const [activeTab, setActiveTab] = useState<"admins" | "staff" | "students">("admins")
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [editingAdmin, setEditingAdmin] = useState<Staff | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedPersonId, setSelectedPersonId] = useState<string>("")
  const [selectedPersonType, setSelectedPersonType] = useState<"staff" | "student">("staff")

  const filteredStaff = useMemo(() => {
    const all = staffData?.items || []
    if (!search.trim()) return all
    const q = search.toLowerCase().trim()
    return all.filter((s) =>
      [s.name, s.email, s.employeeCode, s.department, s.role, s.shift]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    )
  }, [staffData?.items, search])

  const filteredAdmins = useMemo(() => {
    const all = staffData?.items || []
    if (!search.trim()) return all.filter((s) => s.role === "Admin")
    const q = search.toLowerCase().trim()
    return all
      .filter((s) => s.role === "Admin")
      .filter((s) =>
        [s.name, s.email, s.employeeCode, s.department, s.shift, s.institutionName]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q)),
      )
  }, [staffData?.items, search])

  const filteredStudents = useMemo(() => {
    const all = studentsData?.items || []
    if (!search.trim()) return all
    const q = search.toLowerCase().trim()
    return all.filter((s) =>
      [s.name, s.email, s.rollNumber, s.department, s.role, s.shift, s.classLevel, s.branch]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    )
  }, [studentsData?.items, search])

  async function removeStaff(id: string) {
    if (!confirm("Delete this staff member?")) return
    const res = await fetch(`/api/staff?id=${id}`, { method: "DELETE" })
    if (!res.ok) return alert("Delete failed")
    mutateStaff()
  }

  async function removeStudent(id: string) {
    if (!confirm("Delete this student?")) return
    const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" })
    if (!res.ok) return alert("Delete failed")
    mutateStudents()
  }

  function onView(personId: string, type: "staff" | "student") {
    setSelectedPersonId(personId)
    setSelectedPersonType(type)
    setDetailsOpen(true)
  }

  async function seedDefaults() {
    const body = {
      staff: [
        {
          name: "Super Admin",
          email: "superadmin@genamplify.com",
          password: "superadmin123",
          phone: "+91-9000000000",
          department: "Engineering",
          role: "SuperAdmin",
          shift: "Morning",
          parentName: "N/A",
          address: "HQ",
          dateOfBirth: "1980-01-01",
          dateOfJoining: "2020-01-01",
        },
        {
          name: "Primary Admin",
          email: "admin@genamplify.com",
          password: "admin123",
          phone: "+91-9000000001",
          department: "HR",
          role: "Admin",
          shift: "Morning",
          parentName: "N/A",
          address: "HQ",
          dateOfBirth: "1985-02-02",
          dateOfJoining: "2021-01-01",
        },
        {
          name: "Ops Manager",
          email: "manager@genamplify.com",
          password: "manager123",
          phone: "+91-9000000002",
          department: "Operations",
          role: "Manager",
          shift: "Evening",
          parentName: "N/A",
          address: "Branch Office",
          dateOfBirth: "1987-03-03",
          dateOfJoining: "2022-06-01",
        },
        {
          name: "Head Master - Sunrise College",
          email: "headmaster.sunrise@example.com",
          password: "headmaster123",
          phone: "+91-9000000010",
          department: "Operations",
          role: "Admin",
          shift: "Morning",
          parentName: "N/A",
          address: "Sunrise Campus, City",
          dateOfBirth: "1982-07-07",
          dateOfJoining: "2023-01-10",
          institutionName: "Sunrise Engineering College",
        },
      ],
      students: [
        {
          name: "Test Student 1",
          email: "student1@genamplify.com",
          password: "student123",
          phone: "+91-9000001001",
          department: "Academics",
          role: "Student",
          shift: "Morning",
          parentName: "Parent A",
          address: "City A",
          dateOfBirth: "2003-04-04",
          dateOfJoining: "2024-06-01",
          academicYear: "2024-25",
          classLevel: "UG",
        },
        {
          name: "Test Student 2",
          email: "student2@genamplify.com",
          password: "student123",
          phone: "+91-9000001002",
          department: "Academics",
          role: "Student",
          shift: "Morning",
          parentName: "Parent B",
          address: "City B",
          dateOfBirth: "2002-05-05",
          dateOfJoining: "2024-06-01",
          academicYear: "2024-25",
          classLevel: "PG",
        },
      ],
    }

    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        alert(json?.message || "Seeding failed")
        return
      }
      alert(json.message)
      mutateStaff()
      mutateStudents()
    } catch (e) {
      console.error("[super-admin] seed error", e)
      alert("Seeding failed. See console for details.")
    }
  }

  if (!user || user.role !== "SuperAdmin") {
    return <ModernLoader message="Loading super admin panel" fullPage />
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-balance text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Super Admin
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Manage all users, seed defaults, and perform full CRUD</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button
            onClick={seedDefaults}
            className="bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 shadow-lg"
          >
            Seed Default Data
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, code, role, department..."
          />
        </div>
        <div className="text-xs sm:text-sm text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-lg border self-start sm:self-auto">
          Total:{" "}
          <span className="font-semibold text-teal-600">
            {(activeTab === "staff" ? filteredStaff?.length : filteredStudents?.length) || 0}
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="admins">Admins (Head Masters)</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="mt-4">
          <div className="flex justify-end mb-3">
            <Dialog
              open={open && activeTab === "admins"}
              onOpenChange={(v) => {
                setOpen(v)
                if (!v) setEditingAdmin(null)
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700">
                  Add Head Master
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
                <DialogHeader>
                  <DialogTitle>{editingAdmin ? "Edit Head Master" : "Add New Head Master"}</DialogTitle>
                </DialogHeader>
                {staffData && (
                  <PeopleForm
                    type="staff"
                    departments={staffData.departments}
                    roles={staffData.roles}
                    shifts={staffData.shifts}
                    initial={editingAdmin ? editingAdmin : ({ role: "Admin" } as any)}
                    onSaved={() => {
                      setOpen(false)
                      setEditingAdmin(null)
                      mutateStaff()
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredAdmins?.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                type="staff"
                onView={() => onView(person.id, "staff")}
                onEdit={() => {
                  setEditingAdmin(person)
                  setOpen(true)
                }}
                onDelete={() => removeStaff(person.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="staff" className="mt-4">
          <div className="flex justify-end mb-3">
            <Dialog
              open={open && activeTab === "staff"}
              onOpenChange={(v) => {
                setOpen(v)
                if (!v) setEditingStaff(null)
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700">
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
                <DialogHeader>
                  <DialogTitle>{editingStaff ? "Edit Staff" : "Add New Staff"}</DialogTitle>
                </DialogHeader>
                {staffData && (
                  <PeopleForm
                    type="staff"
                    departments={staffData.departments}
                    roles={staffData.roles}
                    shifts={staffData.shifts}
                    initial={editingStaff ?? undefined}
                    onSaved={() => {
                      setOpen(false)
                      setEditingStaff(null)
                      mutateStaff()
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredStaff?.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                type="staff"
                onView={() => onView(person.id, "staff")}
                onEdit={() => {
                  setEditingStaff(person)
                  setOpen(true)
                }}
                onDelete={() => removeStaff(person.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="mt-4">
          <div className="flex justify-end mb-3">
            <Dialog
              open={open && activeTab === "students"}
              onOpenChange={(v) => {
                setOpen(v)
                if (!v) setEditingStudent(null)
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700">
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-2xl sm:mx-auto sm:w-full">
                <DialogHeader>
                  <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
                </DialogHeader>
                {studentsData && (
                  <PeopleForm
                    type="student"
                    departments={studentsData.departments}
                    roles={studentsData.roles}
                    shifts={studentsData.shifts}
                    classLevels={studentsData.classLevels as any}
                    initial={editingStudent ?? undefined}
                    onSaved={() => {
                      setOpen(false)
                      setEditingStudent(null)
                      mutateStudents()
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredStudents?.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                type="student"
                onView={() => onView(person.id, "student")}
                onEdit={() => {
                  setEditingStudent(person)
                  setOpen(true)
                }}
                onDelete={() => removeStudent(person.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <PersonDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        personId={selectedPersonId}
        personType={selectedPersonType}
      />
    </div>
  )
}

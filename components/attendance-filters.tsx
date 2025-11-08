

"use client"

import type { Department, Role, Shift } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export interface AttendanceFiltersState {
  department?: Department
  role?: Role
  shift?: Shift
  date?: string
  status?: "present" | "absent" | "late" | "leave" | "all"
  personType?: "all" | "staff" | "student"
}

export function AttendanceFilters({
  departments,
  roles,
  shifts,
  value,
  onChange,
}: {
  departments: Department[]
  roles: Role[]
  shifts: Shift[]
  value: AttendanceFiltersState
  onChange: (v: AttendanceFiltersState) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
      <div>
        <Label>Department</Label>
        <Select value={value.department} onValueChange={(v) => onChange({ ...value, department: v as any })}>
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Role</Label>
        <Select value={value.role} onValueChange={(v) => onChange({ ...value, role: v as any })}>
          <SelectTrigger>
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Shift</Label>
        <Select value={value.shift} onValueChange={(v) => onChange({ ...value, shift: v as any })}>
          <SelectTrigger>
            <SelectValue placeholder="All Shifts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            {shifts.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Status</Label>
        <Select value={value.status || "all"} onValueChange={(v) => onChange({ ...value, status: v as any })}>
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Date</Label>
        <Input type="date" value={value.date ?? ""} onChange={(e) => onChange({ ...value, date: e.target.value })} />
      </div>
      <div>
        <Label>Person Type</Label>
        <Select value={value.personType || "all"} onValueChange={(v) => onChange({ ...value, personType: v as any })}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

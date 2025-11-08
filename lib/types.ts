
export type ID = string

export type Department = "Engineering" | "HR" | "Finance" | "Operations" | "Academics"
export type Role = "SuperAdmin" | "Admin" | "Manager" | "Staff" | "Teacher" | "Student"
export type Shift = "Morning" | "Evening" | "Night"

export type ClassLevel =
  | "LKG"
  | "UKG"
  | "Class 1"
  | "Class 2"
  | "Class 3"
  | "Class 4"
  | "Class 5"
  | "Class 6"
  | "Class 7"
  | "Class 8"
  | "Class 9"
  | "Class 10"
  | "Class 11"
  | "Class 12"
  | "UG"
  | "PG"

export type Branch =
  | "ECE" // Electronics and Communication Engineering
  | "CSE" // Computer Science Engineering
  | "EEE" // Electrical and Electronics Engineering
  | "MECH" // Mechanical Engineering
  | "CIVIL" // Civil Engineering
  | "IT" // Information Technology
  | "AERO" // Aeronautical Engineering
  | "CHEM" // Chemical Engineering
  | "BIOTECH" // Biotechnology
  | "TEXTILE" // Textile Engineering

export type Profession =
  | "Professor"
  | "Associate Professor"
  | "Assistant Professor"
  | "Lecturer"
  | "Lab Assistant"
  | "Administrative Officer"
  | "Accountant"
  | "Librarian"
  | "Security Guard"
  | "Maintenance Staff"
  | "Counselor"
  | "Sports Instructor"
  | "Other"

export interface PersonBase {
  id: ID
  name: string
  email: string
  password?: string
  phone?: string
  photoUrl?: string
  department?: Department
  role: Role
  shift?: Shift
  parentName: string
  address: string
  dateOfBirth: string
  dateOfJoining: string
  createdAt: string
  updatedAt: string
  faceDescriptor?: number[]
  institutionName?: string // institution scoped to college/school
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  locationVerificationEnabled?: boolean // If true, enforce location check for this person
}

export interface Staff extends PersonBase {
  employeeCode: string
  profession: Profession
  qualification?: string
  experience?: string // Years of experience
  specialization?: string
  branchClass?: string // add branch/class assignment for staff like "ECE-A"
}

export interface Student extends PersonBase {
  rollNumber: string
  classLevel: ClassLevel
  academicYear: string
  branch?: Branch
  semester?: string
  cgpa?: string
  branchClass?: string // add free-text branch/class like "ECE-A" or "CSE-A"
}

export type AttendanceStatus = "present" | "absent" | "late"

export interface AttendanceRecord {
  id: ID
  personId: ID
  personType: "staff" | "student"
  timestamp: string
  date: string // YYYY-MM-DD
  status: AttendanceStatus
  department?: Department
  role?: Role
  shift?: Shift
}

export interface ReportSummary {
  todayPresent: number
  todayAbsent: number
  byDepartment: { name: Department; present: number; absent: number }[]
  byRole: { name: Role; present: number; absent: number }[]
  byShift: { name: Shift; present: number; absent: number }[]
  last7Days: { date: string; present: number; absent: number }[]
}

export interface Counter {
  _id: string
  sequence: number
}

export interface EmailConfig {
  to: string
  subject: string
  name: string
  code: string
  shift?: string
  password: string
  type: "staff" | "student"
}

export type LeaveType = "sick" | "casual" | "annual" | "maternity" | "emergency" | "other"
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled"

export interface LeaveRequest {
  id: ID
  personId: ID
  personType: "staff" | "student"
  leaveType: LeaveType
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  totalDays: number
  reason: string
  status: LeaveStatus
  appliedDate: string // ISO timestamp
  reviewedBy?: ID // personId of approver
  reviewedDate?: string // ISO timestamp
  reviewComments?: string
  attachments?: (string | { url: string; fileName: string })[] // URLs or objects with URL and filename
  approverEmail?: string // Email address of the specific approver
  createdAt: string
  updatedAt: string
  department?: Department
  role?: Role
  shift?: Shift
  personName?: string
  personEmail?: string
  approverName?: string
}

export interface LeaveNotification {
  id: ID
  leaveRequestId: ID
  recipientId: ID
  recipientEmail: string
  recipientType: "staff" | "student"
  notificationType: "request" | "approval" | "rejection"
  subject: string
  message: string
  sentAt: string
  status: "pending" | "sent" | "failed"
}

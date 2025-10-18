
// "use client"

// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { AttendanceCalendar } from "@/components/attendance-calendar"
// import {
//   Calendar,
//   Clock,
//   User,
//   MapPin,
//   Briefcase,
//   GraduationCap,
//   Mail,
//   Phone,
//   Users,
//   Home,
//   CalendarDays,
//   Award,
//   BookOpen,
//   Target,
// } from "lucide-react"
// import useSWR from "swr"

// interface PersonDetailsModalProps {
//   isOpen: boolean
//   onClose: () => void
//   personId: string
//   personType: "staff" | "student"
// }

// const fetcher = (url: string) => fetch(url).then((r) => r.json())

// export function PersonDetailsModal({ isOpen, onClose, personId, personType }: PersonDetailsModalProps) {
//   const { data, isLoading } = useSWR(
//     isOpen ? `/api/person-details?personId=${personId}&personType=${personType}` : null,
//     fetcher,
//   )

//   if (!isOpen) return null

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <User className="h-6 w-6 text-teal-600" />
//             <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
//               {personType === "staff" ? "Staff" : "Student"} Details
//             </span>
//           </DialogTitle>
//         </DialogHeader>

//         {isLoading ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="text-gray-500">Loading details...</div>
//           </div>
//         ) : data ? (
//           <div className="space-y-8">
//             <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6">
//               <div className="flex gap-8">
//                 {/* Profile Image */}
//                 <div className="flex-shrink-0">
//                   {data.person.photoUrl ? (
//                     <img
//                       src={data.person.photoUrl || "/placeholder.svg"}
//                       alt={data.person.name}
//                       className="w-40 h-40 rounded-2xl object-cover border-4 border-white shadow-lg"
//                     />
//                   ) : (
//                     <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
//                       <User className="h-16 w-16 text-gray-400" />
//                     </div>
//                   )}
//                 </div>

//                 {/* Basic Details */}
//                 <div className="flex-1 space-y-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.person.name}</h2>
//                     <div className="flex items-center gap-4">
//                       <Badge className="bg-teal-100 text-teal-800 border-teal-200">
//                         {personType === "staff" ? data.person.employeeCode : data.person.rollNumber}
//                       </Badge>
//                       <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
//                         ID: {data.person.id}
//                       </Badge>
//                     </div>
//                   </div>

//                   {/* Comprehensive Personal Information Section */}
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-3">
//                         <Briefcase className="h-5 w-5 text-gray-500" />
//                         <div>
//                           <span className="text-sm text-gray-500 block">Type</span>
//                           <span className="font-medium capitalize">{personType}</span>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <MapPin className="h-5 w-5 text-gray-500" />
//                         <div>
//                           <span className="text-sm text-gray-500 block">Department</span>
//                           <span className="font-medium">{data.person.department}</span>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <GraduationCap className="h-5 w-5 text-gray-500" />
//                         <div>
//                           <span className="text-sm text-gray-500 block">Role</span>
//                           <span className="font-medium">{data.person.role}</span>
//                         </div>
//                       </div>
//                       {personType === "staff" && data.person.profession && (
//                         <div className="flex items-center gap-3">
//                           <Briefcase className="h-5 w-5 text-gray-500" />
//                           <div>
//                             <span className="text-sm text-gray-500 block">Profession</span>
//                             <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
//                               {data.person.profession}
//                             </Badge>
//                           </div>
//                         </div>
//                       )}
//                       <div className="flex items-center gap-3">
//                         <Clock className="h-5 w-5 text-gray-500" />
//                         <div>
//                           <span className="text-sm text-gray-500 block">Shift</span>
//                           <Badge
//                             variant="outline"
//                             className={`${
//                               data.person.shift === "Morning"
//                                 ? "border-orange-200 text-orange-700 bg-orange-50"
//                                 : data.person.shift === "Evening"
//                                   ? "border-indigo-200 text-indigo-700 bg-indigo-50"
//                                   : "border-gray-200 text-gray-700 bg-gray-50"
//                             }`}
//                           >
//                             {data.person.shift}
//                           </Badge>
//                         </div>
//                       </div>
//                       {personType === "student" && data.person.classLevel && (
//                         <div className="flex items-center gap-3">
//                           <GraduationCap className="h-5 w-5 text-gray-500" />
//                           <div>
//                             <span className="text-sm text-gray-500 block">Class Level</span>
//                             <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
//                               {data.person.classLevel}
//                             </Badge>
//                           </div>
//                         </div>
//                       )}
//                       {personType === "student" &&
//                         data.person.branch &&
//                         (data.person.classLevel === "UG" || data.person.classLevel === "PG") && (
//                           <div className="flex items-center gap-3">
//                             <BookOpen className="h-5 w-5 text-gray-500" />
//                             <div>
//                               <span className="text-sm text-gray-500 block">Branch</span>
//                               <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
//                                 {data.person.branch}
//                               </Badge>
//                             </div>
//                           </div>
//                         )}
//                       {personType === "student" && data.person.academicYear && (
//                         <div className="flex items-center gap-3">
//                           <CalendarDays className="h-5 w-5 text-gray-500" />
//                           <div>
//                             <span className="text-sm text-gray-500 block">Academic Year</span>
//                             <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
//                               {data.person.academicYear}
//                             </Badge>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <div className="space-y-4">
//                       {personType === "staff" && data.person.qualification && (
//                         <div className="flex items-center gap-3">
//                           <Award className="h-5 w-5 text-gray-500" />
//                           <div>
//                             <span className="text-sm text-gray-500 block">Qualification</span>
//                             <span className="font-medium text-sm">{data.person.qualification}</span>
//                           </div>
//                         </div>
//                       )}
//                       {personType === "staff" && data.person.experience && (
//                         <div className="flex items-center gap-3">
//                           <Target className="h-5 w-5 text-gray-500" />
//                           <div>
//                             <span className="text-sm text-gray-500 block">Experience</span>
//                             <span className="font-medium text-sm">{data.person.experience} years</span>
//                           </div>
//                         </div>
//                       )}
//                       {personType === "staff" && data.person.specialization && (
//                         <div className="flex items-center gap-3">
//                           <BookOpen className="h-5 w-5 text-gray-500" />
//                           <div>
//                             <span className="text-sm text-gray-500 block">Specialization</span>
//                             <span className="font-medium text-sm">{data.person.specialization}</span>
//                           </div>
//                         </div>
//                       )}
//                       {data.person.email && (
//                         <div className="flex items-center gap-3">
//                           <Mail className="h-5 w-5 text-gray-500" />
//                           <div>
//                             <span className="text-sm text-gray-500 block">Email</span>
//                             <span className="font-medium text-sm">{data.person.email}</span>
//                           </div>
//                         </div>
//                       )}
//                       {data.person.phone && (
//                         <div className="flex items-center gap-3">
//                           <Phone className="h-5 w-5 text-gray-500" />
//                           <div>
//                             <span className="text-sm text-gray-500 block">Phone</span>
//                             <span className="font-medium">{data.person.phone}</span>
//                           </div>
//                         </div>
//                       )}
//                       {data.person.parentName && (
//                         <div className="flex items-center gap-3">
//                           <Users className="h-5 w-5 text-gray-500" />
//                           <div>
//                             <span className="text-sm text-gray-500 block">Parent Name</span>
//                             <span className="font-medium">{data.person.parentName}</span>
//                           </div>
//                         </div>
//                       )}
//                       {data.person.address && (
//                         <div className="flex items-center gap-3">
//                           <Home className="h-5 w-5 text-gray-500" />
//                           <div>
//                             <span className="text-sm text-gray-500 block">Address</span>
//                             <span className="font-medium text-sm">{data.person.address}</span>
//                           </div>
//                         </div>
//                       )}
//                       {data.person.dateOfBirth && (
//                         <div className="flex items-center gap-3">
//                           <Calendar className="h-5 w-5 text-gray-500" />
//                           <div>
//                             <span className="text-sm text-gray-500 block">Date of Birth</span>
//                             <span className="font-medium">
//                               {new Date(data.person.dateOfBirth).toLocaleDateString()}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                       {data.person.dateOfJoining && (
//                         <div className="flex items-center gap-3">
//                           <CalendarDays className="h-5 w-5 text-gray-500" />
//                           <div>
//                             <span className="text-sm text-gray-500 block">Date of Joining</span>
//                             <span className="font-medium">
//                               {new Date(data.person.dateOfJoining).toLocaleDateString()}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-4 gap-6">
//               <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     Present Days
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-green-700">{data.attendance.present.length}</div>
//                   <p className="text-xs text-green-600 mt-1">Total present</p>
//                 </CardContent>
//               </Card>
//               <Card className="border-0 bg-gradient-to-br from-red-50 to-rose-50">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                     Absent Days
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-red-700">{data.attendance.absent.length}</div>
//                   <p className="text-xs text-red-600 mt-1">Total absent</p>
//                 </CardContent>
//               </Card>
//               <Card className="border-0 bg-gradient-to-br from-amber-50 to-yellow-50">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
//                     Late Days
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-amber-700">{data.attendance.late.length}</div>
//                   <p className="text-xs text-amber-600 mt-1">Total late</p>
//                 </CardContent>
//               </Card>
//               <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                     Leave Days
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-blue-700">{data.attendance.leave?.length || 0}</div>
//                   <p className="text-xs text-blue-600 mt-1">Approved leave</p>
//                 </CardContent>
//               </Card>
//             </div>

//             <AttendanceCalendar attendanceData={data.attendance} />

//             <div className="space-y-6">
//               <h4 className="text-xl font-semibold flex items-center gap-3">
//                 <Calendar className="h-6 w-6 text-teal-600" />
//                 <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
//                   Recent Attendance History
//                 </span>
//               </h4>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Present Days */}
//                 <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50">
//                   <CardHeader>
//                     <CardTitle className="text-sm text-green-700 flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                       Present Days
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-3 max-h-64 overflow-y-auto">
//                     {data.attendance.present.length > 0 ? (
//                       data.attendance.present.slice(0, 10).map((record: any, index: number) => (
//                         <div
//                           key={index}
//                           className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
//                         >
//                           <span className="font-medium text-sm">{new Date(record.date).toLocaleDateString()}</span>
//                           <Badge className="bg-green-100 text-green-800 border-green-200">
//                             {record.timestamp
//                               ? new Date(record.timestamp).toLocaleTimeString([], {
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                 })
//                               : "N/A"}
//                           </Badge>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-gray-500 text-sm text-center py-4">No present days recorded</p>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Absent Days */}
//                 <Card className="border-0 bg-gradient-to-br from-red-50 to-rose-50">
//                   <CardHeader>
//                     <CardTitle className="text-sm text-red-700 flex items-center gap-2">
//                       <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                       Absent Days
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-3 max-h-64 overflow-y-auto">
//                     {data.attendance.absent.length > 0 ? (
//                       data.attendance.absent.slice(0, 10).map((record: any, index: number) => (
//                         <div
//                           key={index}
//                           className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
//                         >
//                           <span className="font-medium text-sm">{new Date(record.date).toLocaleDateString()}</span>
//                           <Badge className="bg-red-100 text-red-800 border-red-200">Absent</Badge>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-gray-500 text-sm text-center py-4">No absent days recorded</p>
//                     )}
//                   </CardContent>
//                 </Card>

//                 <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
//                   <CardHeader>
//                     <CardTitle className="text-sm text-blue-700 flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                       Leave Days
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-3 max-h-64 overflow-y-auto">
//                     {data.attendance.leave && data.attendance.leave.length > 0 ? (
//                       data.attendance.leave.slice(0, 10).map((record: any, index: number) => (
//                         <div
//                           key={index}
//                           className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
//                         >
//                           <span className="font-medium text-sm">{new Date(record.date).toLocaleDateString()}</span>
//                           <Badge className="bg-blue-100 text-blue-800 border-blue-200">Leave</Badge>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-gray-500 text-sm text-center py-4">No leave days recorded</p>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-12 text-gray-500">Failed to load person details</div>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }




"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AttendanceCalendar } from "@/components/attendance-calendar"
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Users,
  Home,
  CalendarDays,
  Award,
  BookOpen,
  Target,
} from "lucide-react"
import useSWR from "swr"

interface PersonDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  personId: string
  personType: "staff" | "student"
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function PersonDetailsModal({ isOpen, onClose, personId, personType }: PersonDetailsModalProps) {
  const { data, error, isLoading } = useSWR(
    isOpen ? `/api/person-details?personId=${personId}&personType=${personType}` : null,
    fetcher,
  )

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-6 w-6 text-teal-600" />
            <span className="text-teal-700">{personType === "staff" ? "Staff" : "Student"} Details</span>
          </DialogTitle>
        </DialogHeader>

        {error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-red-600">Failed to load person details</div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading details...</div>
          </div>
        ) : data ? (
          <div className="space-y-8">
            <div className="rounded-xl p-6 bg-gray-50">
              <div className="flex gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  {data.person.photoUrl ? (
                    <img
                      src={data.person.photoUrl || "/placeholder.svg?height=160&width=160&query=profile%20photo"}
                      alt={data.person.name}
                      className="w-40 h-40 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-2xl bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Basic Details */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.person.name}</h2>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-teal-50 text-teal-700 border-teal-200">
                        {personType === "staff" ? data.person.employeeCode : data.person.rollNumber}
                      </Badge>
                      <Badge variant="outline" className="border-gray-200 text-gray-700 bg-white">
                        ID: {data.person.id}
                      </Badge>
                    </div>
                  </div>

                  {/* Comprehensive Personal Information Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-500 block">Type</span>
                          <span className="font-medium capitalize">{personType}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-500 block">Department</span>
                          <span className="font-medium">{data.person.department}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-500 block">Role</span>
                          <span className="font-medium">{data.person.role}</span>
                        </div>
                      </div>
                      {personType === "staff" && data.person.profession && (
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 block">Profession</span>
                            <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                              {data.person.profession}
                            </Badge>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-500 block">Shift</span>
                          <Badge variant="outline" className="border-gray-200 text-gray-700 bg-gray-50">
                            {data.person.shift}
                          </Badge>
                        </div>
                      </div>
                      {personType === "student" && data.person.classLevel && (
                        <div className="flex items-center gap-3">
                          <GraduationCap className="h-5 w-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 block">Class Level</span>
                            <Badge variant="outline" className="border-teal-200 text-teal-700 bg-teal-50">
                              {data.person.classLevel}
                            </Badge>
                          </div>
                        </div>
                      )}
                      {personType === "student" &&
                        data.person.branch &&
                        (data.person.classLevel === "UG" || data.person.classLevel === "PG") && (
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-gray-500" />
                            <div>
                              <span className="text-sm text-gray-500 block">Branch</span>
                              <Badge variant="outline" className="border-teal-200 text-teal-700 bg-teal-50">
                                {data.person.branch}
                              </Badge>
                            </div>
                          </div>
                        )}
                      {personType === "student" && data.person.academicYear && (
                        <div className="flex items-center gap-3">
                          <CalendarDays className="h-5 w-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 block">Academic Year</span>
                            <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                              {data.person.academicYear}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {personType === "staff" && data.person.qualification && (
                        <div className="flex items-center gap-3">
                          <Award className="h-5 w-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 block">Qualification</span>
                            <span className="font-medium text-sm">{data.person.qualification}</span>
                          </div>
                        </div>
                      )}
                      {personType === "staff" && data.person.experience && (
                        <div className="flex items-center gap-3">
                          <Target className="h-5 w-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 block">Experience</span>
                            <span className="font-medium text-sm">{data.person.experience} years</span>
                          </div>
                        </div>
                      )}
                      {personType === "staff" && data.person.specialization && (
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 block">Specialization</span>
                            <span className="font-medium text-sm">{data.person.specialization}</span>
                          </div>
                        </div>
                      )}
                      {data.person.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 block">Email</span>
                            <span className="font-medium text-sm">{data.person.email}</span>
                          </div>
                        </div>
                      )}
                      {data.person.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 block">Phone</span>
                            <span className="font-medium">{data.person.phone}</span>
                          </div>
                        </div>
                      )}
                      {data.person.parentName && (
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 block">Parent Name</span>
                            <span className="font-medium">{data.person.parentName}</span>
                          </div>
                        </div>
                      )}
                      {data.person.address && (
                        <div className="flex items-center gap-3">
                          <Home className="h-5 w-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 block">Address</span>
                            <span className="font-medium text-sm">{data.person.address}</span>
                          </div>
                        </div>
                      )}
                      {data.person.dateOfBirth && (
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 block">Date of Birth</span>
                            <span className="font-medium">
                              {new Date(data.person.dateOfBirth).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                      {data.person.dateOfJoining && (
                        <div className="flex items-center gap-3">
                          <CalendarDays className="h-5 w-5 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 block">Date of Joining</span>
                            <span className="font-medium">
                              {new Date(data.person.dateOfJoining).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <Card className="border-0 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Present Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700">{data.attendance.present.length}</div>
                  <p className="text-xs text-green-700/80 mt-1">Total present</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-rose-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Absent Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-700">{data.attendance.absent.length}</div>
                  <p className="text-xs text-red-700/80 mt-1">Total absent</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-amber-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    Late Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-700">{data.attendance.late.length}</div>
                  <p className="text-xs text-amber-700/80 mt-1">Total late</p>
                </CardContent>
              </Card>

              {data.attendance.leave && (
                <Card className="border-0 bg-teal-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-teal-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                      Leave Days
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-teal-700">{data.attendance.leave.length}</div>
                    <p className="text-xs text-teal-700/80 mt-1">Approved leave</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <AttendanceCalendar attendanceData={data.attendance} />

            <div className="space-y-6">
              <h4 className="text-xl font-semibold flex items-center gap-3">
                <Calendar className="h-6 w-6 text-teal-600" />
                <span className="text-teal-700">Recent Attendance History</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Present Days */}
                <Card className="border-0 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-sm text-green-700 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Present Days
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                    {data.attendance.present.length > 0 ? (
                      data.attendance.present.slice(0, 10).map((record: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                        >
                          <span className="font-medium text-sm">{new Date(record.date).toLocaleDateString()}</span>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {record.timestamp
                              ? new Date(record.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No present days recorded</p>
                    )}
                  </CardContent>
                </Card>

                {/* Absent Days */}
                <Card className="border-0 bg-rose-50">
                  <CardHeader>
                    <CardTitle className="text-sm text-red-700 flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      Absent Days
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                    {data.attendance.absent.length > 0 ? (
                      data.attendance.absent.slice(0, 10).map((record: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                        >
                          <span className="font-medium text-sm">{new Date(record.date).toLocaleDateString()}</span>
                          <Badge className="bg-red-100 text-red-800 border-red-200">Absent</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No absent days recorded</p>
                    )}
                  </CardContent>
                </Card>

                {/* Leave Days (only if present) */}
                {data.attendance.leave && (
                  <Card className="border-0 bg-teal-50">
                    <CardHeader>
                      <CardTitle className="text-sm text-teal-700 flex items-center gap-2">
                        <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                        Leave Days
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                      {data.attendance.leave.length > 0 ? (
                        data.attendance.leave.slice(0, 10).map((record: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                          >
                            <span className="font-medium text-sm">{new Date(record.date).toLocaleDateString()}</span>
                            <Badge className="bg-teal-100 text-teal-800 border-teal-200">Leave</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-4">No leave days recorded</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">Failed to load person details</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

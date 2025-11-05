
// // "use client"

// // import { Card, CardContent } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Button } from "@/components/ui/button"
// // import { Eye, Edit, Trash2 } from "lucide-react"
// // import type { Staff, Student } from "@/lib/types"

// // interface PersonCardProps {
// //   person: Staff | Student
// //   type: "staff" | "student"
// //   onView: () => void
// //   onEdit: () => void
// //   onDelete: () => void
// // }

// // export function PersonCard({ person, type, onView, onEdit, onDelete }: PersonCardProps) {
// //   const isStaff = type === "staff"
// //   const code = isStaff ? (person as Staff).employeeCode : (person as Student).rollNumber
// //   const extraInfo = isStaff
// //     ? (person as Staff).profession
// //     : (person as Student).classLevel === "UG" || (person as Student).classLevel === "PG"
// //       ? `${(person as Student).classLevel} - ${(person as Student).branch || "N/A"}`
// //       : `Class: ${(person as Student).classLevel}`

// //   return (
// //     <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
// //       <CardContent className="p-6">
// //         <div className="flex items-start gap-4">
// //           {/* Profile Image */}
// //           <div className="relative">
// //             <img
// //               src={person.photoUrl ?? `/placeholder.svg?height=80&width=80&query=${type}%20photo`}
// //               alt={`${person.name} photo`}
// //               className="h-20 w-20 rounded-xl object-cover ring-2 ring-white shadow-md group-hover:scale-105 transition-transform duration-200"
// //             />
// //             <div className="absolute -top-1 -right-1">
// //               <Badge
// //                 variant="secondary"
// //                 className={`text-xs px-2 py-1 ${
// //                   isStaff
// //                     ? "bg-blue-100 text-blue-700 border-blue-200"
// //                     : "bg-purple-100 text-purple-700 border-purple-200"
// //                 }`}
// //               >
// //                 {isStaff ? "Staff" : "Student"}
// //               </Badge>
// //             </div>
// //           </div>

// //           {/* Person Info */}
// //           <div className="flex-1 min-w-0">
// //             <div className="flex items-start justify-between mb-3">
// //               <div>
// //                 <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1 group-hover:text-teal-700 transition-colors">
// //                   {person.name}
// //                 </h3>
// //                 <p className="text-sm text-gray-500 font-medium">
// //                   {isStaff ? "EMP" : "STU"} • {code}
// //                 </p>
// //               </div>
// //             </div>

// //             <div className="space-y-2 mb-4">
// //               <div className="flex items-center gap-2 text-sm">
// //                 <span className="text-gray-600">Department:</span>
// //                 <Badge variant="outline" className="text-xs">
// //                   {person.department}
// //                 </Badge>
// //               </div>
// //               <div className="flex items-center gap-2 text-sm">
// //                 <span className="text-gray-600">Shift:</span>
// //                 <Badge
// //                   variant="outline"
// //                   className={`text-xs ${
// //                     person.shift === "Morning"
// //                       ? "border-orange-200 text-orange-700 bg-orange-50"
// //                       : person.shift === "Evening"
// //                         ? "border-indigo-200 text-indigo-700 bg-indigo-50"
// //                         : "border-gray-200 text-gray-700 bg-gray-50"
// //                   }`}
// //                 >
// //                   {person.shift}
// //                 </Badge>
// //               </div>
// //               {extraInfo && (
// //                 <div className="flex items-center gap-2 text-sm">
// //                   <span className="text-gray-600">{isStaff ? "Profession:" : "Level:"}</span>
// //                   <Badge
// //                     variant="outline"
// //                     className={`text-xs ${
// //                       isStaff
// //                         ? "border-green-200 text-green-700 bg-green-50"
// //                         : "border-purple-200 text-purple-700 bg-purple-50"
// //                     }`}
// //                   >
// //                     {isStaff ? extraInfo : extraInfo.replace("Class: ", "")}
// //                   </Badge>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Action Buttons */}
// //             <div className="flex gap-2">
// //               <Button
// //                 size="sm"
// //                 variant="outline"
// //                 onClick={(e) => {
// //                   e.stopPropagation()
// //                   onView()
// //                 }}
// //                 className="flex-1 bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100 hover:border-teal-300"
// //               >
// //                 <Eye className="h-4 w-4 mr-1" />
// //                 View Details
// //               </Button>
// //               <Button
// //                 size="sm"
// //                 variant="outline"
// //                 onClick={(e) => {
// //                   e.stopPropagation()
// //                   onEdit()
// //                 }}
// //                 className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
// //               >
// //                 <Edit className="h-4 w-4" />
// //               </Button>
// //               <Button
// //                 size="sm"
// //                 variant="outline"
// //                 onClick={(e) => {
// //                   e.stopPropagation()
// //                   onDelete()
// //                 }}
// //                 className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
// //               >
// //                 <Trash2 className="h-4 w-4" />
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   )
// // }


// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Eye, Edit, Trash2 } from "lucide-react"
// import type { Staff, Student } from "@/lib/types"

// interface PersonCardProps {
//   person: Staff | Student
//   type: "staff" | "student"
//   onView: () => void
//   onEdit: () => void
//   onDelete: () => void
// }

// export function PersonCard({ person, type, onView, onEdit, onDelete }: PersonCardProps) {
//   const isStaff = type === "staff"
//   const code = isStaff ? (person as Staff).employeeCode : (person as Student).rollNumber
//   const extraInfo = isStaff
//     ? (person as Staff).profession
//     : (person as Student).classLevel === "UG" || (person as Student).classLevel === "PG"
//       ? `${(person as Student).classLevel} - ${(person as Student).branch || "N/A"}`
//       : `Class: ${(person as Student).classLevel}`

//   const branchClassText = isStaff ? (person as Staff).branchClass : (person as Student).branchClass

//   return (
//     <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
//       <CardContent className="p-6">
//         <div className="flex items-start gap-4">
//           {/* Profile Image */}
//           <div className="relative">
//             <img
//               src={person.photoUrl ?? `/placeholder.svg?height=80&width=80&query=${type}%20photo`}
//               alt={`${person.name} photo`}
//               className="h-20 w-20 rounded-xl object-cover ring-2 ring-white shadow-md group-hover:scale-105 transition-transform duration-200"
//             />
//             <div className="absolute -top-1 -right-1">
//               <Badge
//                 variant="secondary"
//                 className={`text-xs px-2 py-1 ${
//                   isStaff
//                     ? "bg-blue-100 text-blue-700 border-blue-200"
//                     : "bg-purple-100 text-purple-700 border-purple-200"
//                 }`}
//               >
//                 {isStaff ? "Staff" : "Student"}
//               </Badge>
//             </div>
//           </div>

//           {/* Person Info */}
//           <div className="flex-1 min-w-0">
//             <div className="flex items-start justify-between mb-3">
//               <div>
//                 <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1 group-hover:text-teal-700 transition-colors">
//                   {person.name}
//                 </h3>
//                 <p className="text-sm text-gray-500 font-medium">
//                   {isStaff ? "EMP" : "STU"} • {code}
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-2 mb-4">
//               <div className="flex items-center gap-2 text-sm">
//                 <span className="text-gray-600">Department:</span>
//                 <Badge variant="outline" className="text-xs">
//                   {person.department}
//                 </Badge>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <span className="text-gray-600">Shift:</span>
//                 <Badge
//                   variant="outline"
//                   className={`text-xs ${
//                     person.shift === "Morning"
//                       ? "border-orange-200 text-orange-700 bg-orange-50"
//                       : person.shift === "Evening"
//                         ? "border-indigo-200 text-indigo-700 bg-indigo-50"
//                         : "border-gray-200 text-gray-700 bg-gray-50"
//                   }`}
//                 >
//                   {person.shift}
//                 </Badge>
//               </div>
//               {extraInfo && (
//                 <div className="flex items-center gap-2 text-sm">
//                   <span className="text-gray-600">{isStaff ? "Profession:" : "Level:"}</span>
//                   <Badge
//                     variant="outline"
//                     className={`text-xs ${
//                       isStaff
//                         ? "border-green-200 text-green-700 bg-green-50"
//                         : "border-purple-200 text-purple-700 bg-purple-50"
//                     }`}
//                   >
//                     {isStaff ? extraInfo : extraInfo.replace("Class: ", "")}
//                   </Badge>
//                 </div>
//               )}
//               {branchClassText && (
//                 <div className="flex items-center gap-2 text-sm">
//                   <span className="text-gray-600">Branch/Class:</span>
//                   <Badge variant="outline" className="text-xs border-teal-200 text-teal-700 bg-teal-50">
//                     {branchClassText}
//                   </Badge>
//                 </div>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-2">
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   onView()
//                 }}
//                 className="flex-1 bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100 hover:border-teal-300"
//               >
//                 <Eye className="h-4 w-4 mr-1" />
//                 View Details
//               </Button>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   onEdit()
//                 }}
//                 className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
//               >
//                 <Edit className="h-4 w-4" />
//               </Button>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   onDelete()
//                 }}
//                 className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }



"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import type { Staff, Student } from "@/lib/types"

interface PersonCardProps {
  person: Staff | Student
  type: "staff" | "student"
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function PersonCard({ person, type, onView, onEdit, onDelete }: PersonCardProps) {
  const isStaff = type === "staff"
  const code = isStaff ? (person as Staff).employeeCode : (person as Student).rollNumber
  const extraInfo = isStaff
    ? (person as Staff).profession
    : (person as Student).classLevel === "UG" || (person as Student).classLevel === "PG"
      ? `${(person as Student).classLevel} - ${(person as Student).branch || "N/A"}`
      : `Class: ${(person as Student).classLevel}`

  const branchClassText = isStaff ? (person as Staff).branchClass : (person as Student).branchClass

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-card backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={person.photoUrl ?? `/placeholder.svg?height=80&width=80&query=${type}%20photo`}
              alt={`${person.name} photo`}
              className="h-20 w-20 rounded-xl object-cover ring-2 ring-white shadow-md group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute -top-1 -right-1">
              <Badge
                variant="secondary"
                className={`text-xs px-2 py-1 ${
                  isStaff
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-purple-100 text-purple-700 border-purple-200"
                }`}
              >
                {isStaff ? "Staff" : "Student"}
              </Badge>
            </div>
          </div>

          {/* Person Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-card-foreground text-lg leading-tight mb-1 group-hover:text-teal-700 transition-colors">
                  {person.name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {isStaff ? "EMP" : "STU"} • {code}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Department:</span>
                <Badge variant="outline" className="text-xs">
                  {person.department}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Shift:</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    person.shift === "Morning"
                      ? "border-orange-200 text-orange-700 bg-orange-50"
                      : person.shift === "Evening"
                        ? "border-indigo-200 text-indigo-700 bg-indigo-50"
                        : "border-gray-200 text-gray-700 bg-gray-50"
                  }`}
                >
                  {person.shift}
                </Badge>
              </div>
              {extraInfo && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{isStaff ? "Profession:" : "Level:"}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      isStaff
                        ? "border-green-200 text-green-700 bg-green-50"
                        : "border-purple-200 text-purple-700 bg-purple-50"
                    }`}
                  >
                    {isStaff ? extraInfo : extraInfo.replace("Class: ", "")}
                  </Badge>
                </div>
              )}
              {branchClassText && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Branch/Class:</span>
                  <Badge variant="outline" className="text-xs border-teal-200 text-teal-700 bg-teal-50">
                    {branchClassText}
                  </Badge>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  onView()
                }}
                className="flex-1 bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100 hover:border-teal-300"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


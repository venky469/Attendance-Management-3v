
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  TrendingUp,
  BarChart3,
} from "lucide-react"
import useSWR from "swr"
import { useState } from "react"

interface PersonDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  personId: string
  personType: "staff" | "student"
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function PersonDetailsModal({ isOpen, onClose, personId, personType }: PersonDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const { data, error, isLoading } = useSWR(
    isOpen ? `/api/person-details?personId=${personId}&personType=${personType}` : null,
    fetcher,
  )

  const calculateStats = () => {
    if (!data?.attendance) return null
    const total = data.attendance.present.length + data.attendance.absent.length + (data.attendance.late?.length || 0)
    const presentPercentage = total > 0 ? ((data.attendance.present.length / total) * 100).toFixed(1) : 0
    const absentPercentage = total > 0 ? ((data.attendance.absent.length / total) * 100).toFixed(1) : 0
    const latePercentage = total > 0 ? (((data.attendance.late?.length || 0) / total) * 100).toFixed(1) : 0
    return { total, presentPercentage, absentPercentage, latePercentage }
  }

  const stats = data ? calculateStats() : null

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            <span className="text-foreground">{personType === "staff" ? "Staff" : "Student"} Details</span>
          </DialogTitle>
        </DialogHeader>

        {error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-destructive">Failed to load person details</div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading details...</div>
          </div>
        ) : data ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="gap-2">
                <User className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="attendance" className="gap-2">
                <Calendar className="h-4 w-4" />
                Attendance
              </TabsTrigger>
              <TabsTrigger value="statistics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="rounded-xl p-6 bg-muted/50">
                <div className="flex gap-8">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    {data.person.photoUrl ? (
                      <img
                        src={data.person.photoUrl || "/placeholder.svg?height=160&width=160&query=profile%20photo"}
                        alt={data.person.name}
                        className="w-40 h-40 rounded-2xl object-cover border-4 border-background shadow-lg"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-2xl bg-muted flex items-center justify-center border-4 border-background shadow-lg">
                        <User className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Basic Details */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">{data.person.name}</h2>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {personType === "staff" ? data.person.employeeCode : data.person.rollNumber}
                        </Badge>
                        <Badge variant="outline">ID: {data.person.id}</Badge>
                      </div>
                    </div>

                    {/* Comprehensive Personal Information Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <span className="text-sm text-muted-foreground block">Type</span>
                            <span className="font-medium text-foreground capitalize">{personType}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <span className="text-sm text-muted-foreground block">Department</span>
                            <span className="font-medium text-foreground">{data.person.department}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <GraduationCap className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <span className="text-sm text-muted-foreground block">Role</span>
                            <span className="font-medium text-foreground">{data.person.role}</span>
                          </div>
                        </div>
                        {personType === "staff" && data.person.profession && (
                          <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Profession</span>
                              <Badge
                                variant="outline"
                                className="border-green-500/20 text-green-600 dark:text-green-400 bg-green-500/10"
                              >
                                {data.person.profession}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <span className="text-sm text-muted-foreground block">Shift</span>
                            <Badge variant="outline">{data.person.shift}</Badge>
                          </div>
                        </div>
                        {personType === "student" && data.person.classLevel && (
                          <div className="flex items-center gap-3">
                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Class Level</span>
                              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10">
                                {data.person.classLevel}
                              </Badge>
                            </div>
                          </div>
                        )}
                        {personType === "student" &&
                          data.person.branch &&
                          (data.person.classLevel === "UG" || data.person.classLevel === "PG") && (
                            <div className="flex items-center gap-3">
                              <BookOpen className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <span className="text-sm text-muted-foreground block">Branch</span>
                                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10">
                                  {data.person.branch}
                                </Badge>
                              </div>
                            </div>
                          )}
                        {personType === "student" && data.person.academicYear && (
                          <div className="flex items-center gap-3">
                            <CalendarDays className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Academic Year</span>
                              <Badge
                                variant="outline"
                                className="border-green-500/20 text-green-600 dark:text-green-400 bg-green-500/10"
                              >
                                {data.person.academicYear}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {personType === "staff" && data.person.qualification && (
                          <div className="flex items-center gap-3">
                            <Award className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Qualification</span>
                              <span className="font-medium text-foreground text-sm">{data.person.qualification}</span>
                            </div>
                          </div>
                        )}
                        {personType === "staff" && data.person.experience && (
                          <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Experience</span>
                              <span className="font-medium text-foreground text-sm">
                                {data.person.experience} years
                              </span>
                            </div>
                          </div>
                        )}
                        {personType === "staff" && data.person.specialization && (
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Specialization</span>
                              <span className="font-medium text-foreground text-sm">{data.person.specialization}</span>
                            </div>
                          </div>
                        )}
                        {data.person.email && (
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Email</span>
                              <span className="font-medium text-foreground text-sm">{data.person.email}</span>
                            </div>
                          </div>
                        )}
                        {data.person.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Phone</span>
                              <span className="font-medium text-foreground">{data.person.phone}</span>
                            </div>
                          </div>
                        )}
                        {data.person.parentName && (
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Parent Name</span>
                              <span className="font-medium text-foreground">{data.person.parentName}</span>
                            </div>
                          </div>
                        )}
                        {data.person.address && (
                          <div className="flex items-center gap-3">
                            <Home className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Address</span>
                              <span className="font-medium text-foreground text-sm">{data.person.address}</span>
                            </div>
                          </div>
                        )}
                        {data.person.dateOfBirth && (
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Date of Birth</span>
                              <span className="font-medium text-foreground">
                                {new Date(data.person.dateOfBirth).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                        {data.person.dateOfJoining && (
                          <div className="flex items-center gap-3">
                            <CalendarDays className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="text-sm text-muted-foreground block">Date of Joining</span>
                              <span className="font-medium text-foreground">
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
            </TabsContent>

            <TabsContent value="attendance" className="space-y-6 mt-6">
              <div className="grid grid-cols-4 gap-6">
                <Card className="border-0 bg-green-500/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Present Days
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {data.attendance.present.length}
                    </div>
                    <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">Total present</p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-red-500/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Absent Days
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {data.attendance.absent.length}
                    </div>
                    <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">Total absent</p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-amber-500/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      Late Days
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                      {data.attendance.late.length}
                    </div>
                    <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">Total late</p>
                  </CardContent>
                </Card>

                {data.attendance.leave && (
                  <Card className="border-0 bg-primary/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        Leave Days
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-primary">{data.attendance.leave.length}</div>
                      <p className="text-xs text-primary/80 mt-1">Approved leave</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <AttendanceCalendar attendanceData={data.attendance} />

              <div className="space-y-6">
                <h4 className="text-xl font-semibold flex items-center gap-3 text-foreground">
                  <Calendar className="h-6 w-6 text-primary" />
                  Recent Attendance History
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Present Days */}
                  <Card className="border-0 bg-green-500/10">
                    <CardHeader>
                      <CardTitle className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Present Days
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                      {data.attendance.present.length > 0 ? (
                        data.attendance.present.slice(0, 10).map((record: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-card rounded-lg shadow-sm"
                          >
                            <span className="font-medium text-sm text-foreground">
                              {new Date(record.date).toLocaleDateString()}
                            </span>
                            <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/20">
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
                        <p className="text-muted-foreground text-sm text-center py-4">No present days recorded</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Absent Days */}
                  <Card className="border-0 bg-red-500/10">
                    <CardHeader>
                      <CardTitle className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        Absent Days
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                      {data.attendance.absent.length > 0 ? (
                        data.attendance.absent.slice(0, 10).map((record: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-card rounded-lg shadow-sm"
                          >
                            <span className="font-medium text-sm text-foreground">
                              {new Date(record.date).toLocaleDateString()}
                            </span>
                            <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/20">
                              Absent
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm text-center py-4">No absent days recorded</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Leave Days (only if present) */}
                  {data.attendance.leave && (
                    <Card className="border-0 bg-primary/10">
                      <CardHeader>
                        <CardTitle className="text-sm text-primary flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          Leave Days
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                        {data.attendance.leave.length > 0 ? (
                          data.attendance.leave.slice(0, 10).map((record: any, index: number) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-card rounded-lg shadow-sm"
                            >
                              <span className="font-medium text-sm text-foreground">
                                {new Date(record.date).toLocaleDateString()}
                              </span>
                              <Badge className="bg-primary/20 text-primary border-primary/20">Leave</Badge>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm text-center py-4">No leave days recorded</p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Attendance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Present</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          {stats?.presentPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full transition-all"
                          style={{ width: `${stats?.presentPercentage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Absent</span>
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">
                          {stats?.absentPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-red-500 h-3 rounded-full transition-all"
                          style={{ width: `${stats?.absentPercentage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Late</span>
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                          {stats?.latePercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-amber-500 h-3 rounded-full transition-all"
                          style={{ width: `${stats?.latePercentage}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Total Days Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-foreground">Total Days Tracked</span>
                        <span className="text-2xl font-bold text-primary">{stats?.total}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-green-500/10 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {data.attendance.present.length}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Present</div>
                        </div>
                        <div className="text-center p-3 bg-red-500/10 rounded-lg">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {data.attendance.absent.length}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Absent</div>
                        </div>
                        <div className="text-center p-3 bg-amber-500/10 rounded-lg">
                          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {data.attendance.late.length}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Late</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12 text-muted-foreground">Failed to load person details</div>
        )}
      </DialogContent>
    </Dialog>
  )
}


"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload"
import { loadFaceApiModels } from "@/lib/face-api-client"
import { getStoredUser } from "@/lib/auth"
import useSWR from "swr"
import { DEFAULT_SHIFTS, type ShiftSetting } from "@/lib/shift-settings"
import { useToast } from "@/hooks/use-toast"
import type { Department, Role, Shift, ClassLevel, Staff, Student, Branch, Profession } from "@/lib/types"
import { MapPin } from "lucide-react"
import { Switch } from "@/components/ui/switch"

type PersonFormProps =
  | {
      type: "staff"
      departments: Department[]
      roles: Role[]
      shifts: Shift[]
      initial?: Partial<Staff>
      onSaved?: () => void
    }
  | {
      type: "student"
      departments: Department[]
      roles: Role[]
      shifts: Shift[]
      classLevels: ClassLevel[]
      initial?: Partial<Student>
      onSaved?: () => void
    }

export function PeopleForm(props: PersonFormProps) {
  const [name, setName] = useState(props.initial?.name ?? "")
  const [email, setEmail] = useState(props.initial?.email ?? "")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState(props.initial?.phone ?? "")
  const [parentName, setParentName] = useState(props.initial?.parentName ?? "")
  const [address, setAddress] = useState(props.initial?.address ?? "")
  const [dateOfBirth, setDateOfBirth] = useState(props.initial?.dateOfBirth ?? "")
  const [dateOfJoining, setDateOfJoining] = useState(props.initial?.dateOfJoining ?? "")
  const [academicYear, setAcademicYear] = useState(
    "academicYear" in (props.initial ?? {}) ? ((props.initial as any).academicYear ?? "") : "",
  )
  const [department, setDepartment] = useState<Department | undefined>(props.initial?.department as Department)
  const [role, setRole] = useState<Role | undefined>(
    (props.initial?.role as Role) ?? (props.type === "student" ? "Student" : "Staff"),
  )
  const [shift, setShift] = useState<Shift | undefined>(props.initial?.shift as Shift)
  const [photoUrl, setPhotoUrl] = useState(props.initial?.photoUrl ?? "")
  const [faceDescriptor, setFaceDescriptor] = useState<number[] | undefined>((props.initial as any)?.faceDescriptor)
  const [employeeCode, setEmployeeCode] = useState(
    "employeeCode" in (props.initial ?? {}) ? ((props.initial as any).employeeCode ?? "") : "",
  )
  const [rollNumber, setRollNumber] = useState(
    "rollNumber" in (props.initial ?? {}) ? ((props.initial as any).rollNumber ?? "") : "",
  )
  const [classLevel, setClassLevel] = useState<ClassLevel | undefined>(
    "classLevel" in (props.initial ?? {}) ? (props.initial as any).classLevel : undefined,
  )
  const [branch, setBranch] = useState<Branch | undefined>(
    "branch" in (props.initial ?? {}) ? (props.initial as any).branch : undefined,
  )
  const [branchClass, setBranchClass] = useState<string>(
    "branchClass" in (props.initial ?? {}) ? ((props.initial as any).branchClass ?? "").toUpperCase() : "",
  )
  const [semester, setSemester] = useState(
    "semester" in (props.initial ?? {}) ? ((props.initial as any).semester ?? "") : "",
  )
  const [cgpa, setCgpa] = useState("cgpa" in (props.initial ?? {}) ? ((props.initial as any).cgpa ?? "") : "")
  const [profession, setProfession] = useState<Profession | undefined>(
    "profession" in (props.initial ?? {}) ? (props.initial as any).profession : undefined,
  )
  const [qualification, setQualification] = useState(
    "qualification" in (props.initial ?? {}) ? ((props.initial as any).qualification ?? "") : "",
  )
  const [experience, setExperience] = useState(
    "experience" in (props.initial ?? {}) ? ((props.initial as any).experience ?? "") : "",
  )
  const [specialization, setSpecialization] = useState(
    "specialization" in (props.initial ?? {}) ? ((props.initial as any).specialization ?? "") : "",
  )
  const [institutionName, setInstitutionName] = useState((props.initial as any)?.institutionName ?? "")
  const [locationLat, setLocationLat] = useState<string>((props.initial as any)?.location?.latitude?.toString() ?? "")
  const [locationLng, setLocationLng] = useState<string>((props.initial as any)?.location?.longitude?.toString() ?? "")
  const [locationAddress, setLocationAddress] = useState<string>((props.initial as any)?.location?.address ?? "")
  const [searchAddress, setSearchAddress] = useState<string>("")
  const [geocoding, setGeocoding] = useState(false)
  const [locationVerificationEnabled, setLocationVerificationEnabled] = useState<boolean>(
    (props.initial as any)?.locationVerificationEnabled ?? false,
  )
  const [institutionLocationEnabled, setInstitutionLocationEnabled] = useState<boolean>(false)
  const [loadingInstitution, setLoadingInstitution] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { uploadFile } = useCloudinaryUpload()
  const { toast } = useToast()

  const branches: Branch[] = ["ECE", "CSE", "EEE", "MECH", "CIVIL", "IT", "AERO", "CHEM", "BIOTECH", "TEXTILE"]
  const professions: Profession[] = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Lecturer",
    "Lab Assistant",
    "Administrative Officer",
    "Accountant",
    "Librarian",
    "Security Guard",
    "Maintenance Staff",
    "Counselor",
    "Sports Instructor",
    "Other",
  ]

  const isSuperAdmin = currentUser?.role === "SuperAdmin"
  const canManageShifts =
    (currentUser?.role || "").toLowerCase() === "admin" ||
    (currentUser?.role || "").toLowerCase() === "superadmin" ||
    (currentUser?.role || "").toLowerCase() === "super-admin"
  const filteredRoles = useMemo(
    () => (isSuperAdmin ? props.roles : props.roles.filter((r) => r !== "SuperAdmin")),
    [isSuperAdmin, props.roles],
  )

  useEffect(() => {
    const u = getStoredUser()
    setCurrentUser(u)
    if (!institutionName && u?.institutionName) {
      setInstitutionName(u.institutionName)
    }
  }, [])

  useEffect(() => {
    async function fetchInstitutionSettings() {
      if (!institutionName) {
        setInstitutionLocationEnabled(false)
        return
      }

      setLoadingInstitution(true)
      try {
        const res = await fetch(`/api/institutions/${encodeURIComponent(institutionName)}`)
        if (res.ok) {
          const data = await res.json()
          setInstitutionLocationEnabled(data.locationVerificationEnabled ?? false)
        } else {
          setInstitutionLocationEnabled(false)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch institution settings:", error)
        setInstitutionLocationEnabled(false)
      } finally {
        setLoadingInstitution(false)
      }
    }

    fetchInstitutionSettings()
  }, [institutionName])

  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data: shiftsData } = useSWR(
    institutionName ? `/api/shifts?institutionName=${encodeURIComponent(institutionName)}` : null,
    fetcher,
  )

  const shiftSettings: ShiftSetting[] = shiftsData?.shifts || DEFAULT_SHIFTS
  const shiftLabel = (name: string) => {
    const s = shiftSettings.find((x) => x.name === name)
    return s ? `${s.name} (${s.start}–${s.end})` : name
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {}
    const isEdit = Boolean((props.initial as any)?.id)

    // Required for both create and edit
    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format"

    // Password only required on create; validate length if provided on edit
    if (!isEdit) {
      if (!password.trim()) newErrors.password = "Password is required"
      else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"
    } else if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Optional phone, but validate if provided
    if (phone && !/^\+?[\d\s-()]{10,}$/.test(phone)) newErrors.phone = "Invalid phone number format"

    // Keep core structure required
    if (!department) newErrors.department = "Department is required"
    if (!role) newErrors.role = "Role is required"
    if (!shift) newErrors.shift = "Shift is required"

    // Institution remains required (usually auto-filled from current user)
    if (!institutionName.trim()) newErrors.institutionName = "Institution is required"

    // Student specifics: class level required, branch required only for UG/PG
    if (props.type === "student") {
      if (!classLevel) newErrors.classLevel = "Class level is required"
      if ((classLevel === "UG" || classLevel === "PG") && !branch && !branchClass.trim()) {
        newErrors.branch = "Branch is required for UG/PG students (enter e.g., ECE-A or pick a branch)"
      }
    }

    // Make Branch/Class mandatory for Teachers (class teacher assignment)
    if (props.type === "staff" && (role === "Teacher" || (role as any)?.toString() === "Teacher")) {
      if (!branchClass.trim()) {
        newErrors.branchClass = "Branch/Class is required for Teachers"
      }
    }

    if (locationLat && !locationLng) {
      newErrors.locationLng = "Longitude is required when latitude is provided"
    }
    if (locationLng && !locationLat) {
      newErrors.locationLat = "Latitude is required when longitude is provided"
    }
    if (
      locationLat &&
      (isNaN(Number.parseFloat(locationLat)) ||
        Number.parseFloat(locationLat) < -90 ||
        Number.parseFloat(locationLat) > 90)
    ) {
      newErrors.locationLat = "Invalid latitude (must be between -90 and 90)"
    }
    if (
      locationLng &&
      (isNaN(Number.parseFloat(locationLng)) ||
        Number.parseFloat(locationLng) < -180 ||
        Number.parseFloat(locationLng) > 180)
    ) {
      newErrors.locationLng = "Invalid longitude (must be between -180 and 180)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function onSubmit() {
    if (!validateForm()) {
      alert("Please fill in required fields correctly.")
      return
    }

    setSaving(true)
    try {
      const location =
        locationLat && locationLng
          ? {
              latitude: Number.parseFloat(locationLat),
              longitude: Number.parseFloat(locationLng),
              address: locationAddress.trim() || undefined,
            }
          : undefined

      if (props.type === "staff") {
        const body = {
          name,
          email,
          ...(password.trim() && { password }),
          phone,
          parentName,
          address,
          dateOfBirth,
          dateOfJoining,
          department,
          role,
          shift,
          photoUrl, // optional
          faceDescriptor, // optional
          employeeCode,
          profession, // optional
          qualification,
          experience,
          specialization,
          branchClass: branchClass.trim().toUpperCase(),
          institutionName,
          location, // Add location
          locationVerificationEnabled,
          id: (props.initial as any)?.id,
        }
        const res = await fetch("/api/staff", {
          method: body.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          if (res.status === 409) {
            const err = await res.json().catch(() => ({}) as any)
            const field = err.field || "email"
            const message =
              err.message || (field === "phone" ? "Mobile number is already in use." : "Email is already in use.")
            setErrors((prev) => ({ ...prev, [field]: message }))
            toast({
              variant: "destructive",
              title: "Duplicate detected",
              description: message,
            })
            return
          }
          throw new Error("Failed to save staff")
        }
      } else {
        const body = {
          name,
          email,
          ...(password.trim() && { password }),
          phone,
          parentName,
          address,
          dateOfBirth,
          dateOfJoining,
          academicYear, // optional now
          department,
          role,
          shift,
          photoUrl, // optional
          faceDescriptor, // optional
          rollNumber,
          classLevel,
          branch, // required only if UG/PG
          branchClass: branchClass.trim().toUpperCase(),
          semester,
          cgpa,
          institutionName,
          location, // Add location
          locationVerificationEnabled,
          id: (props.initial as any)?.id,
        }
        const res = await fetch("/api/students", {
          method: body.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          if (res.status === 409) {
            const err = await res.json().catch(() => ({}) as any)
            const field = err.field || "email"
            const message =
              err.message || (field === "phone" ? "Mobile number is already in use." : "Email is already in use.")
            setErrors((prev) => ({ ...prev, [field]: message }))
            toast({
              variant: "destructive",
              title: "Duplicate detected",
              description: message,
            })
            return
          }
          throw new Error("Failed to save student")
        }
      }
      toast({ title: "Saved", description: "Record saved successfully." })
      props.onSaved?.()
    } catch (e) {
      console.error(e)
      alert("Save failed. See console for details.")
    } finally {
      setSaving(false)
    }
  }

  async function getCurrentLocation() {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Not supported",
        description: "Geolocation is not supported by your browser",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationLat(position.coords.latitude.toFixed(6))
        setLocationLng(position.coords.longitude.toFixed(6))
        toast({
          title: "Location captured",
          description: "Current location has been set",
        })
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Location error",
          description: error.message,
        })
      },
    )
  }

  async function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    try {
      const faceapi = await loadFaceApiModels()
      const imgUrl = URL.createObjectURL(f)
      const img = new Image()
      img.crossOrigin = "anonymous"
      const descriptor = await new Promise<number[] | null>((resolve) => {
        img.onload = async () => {
          try {
            const opts = new faceapi.TinyFaceDetectorOptions({
              inputSize: 320, // Higher resolution for better enrollment
              scoreThreshold: 0.6, // Stricter threshold for enrollment
            })
            const det = await faceapi.detectSingleFace(img, opts).withFaceLandmarks().withFaceDescriptor()

            if (det) {
              const faceSize = Math.min(det.detection.box.width, det.detection.box.height)
              const detectionScore = det.detection.score

              if (faceSize < 80) {
                alert("Face is too small in the image. Please use a clearer, closer photo.")
                resolve(null)
                return
              }

              if (detectionScore < 0.7) {
                alert("Face detection confidence is low. Please use a clearer photo with better lighting.")
                resolve(null)
                return
              }

              resolve(Array.from(det.descriptor))
            } else {
              resolve(null)
            }
          } catch {
            resolve(null)
          } finally {
            URL.revokeObjectURL(imgUrl)
          }
        }
        img.onerror = () => {
          URL.revokeObjectURL(imgUrl)
          resolve(null)
        }
        img.src = imgUrl
      })
      if (!descriptor) {
        alert(
          "No clear face detected in the selected photo. Please choose a high-quality face photo with good lighting and the face clearly visible.",
        )
        setFaceDescriptor(undefined)
      } else {
        setFaceDescriptor(descriptor)
      }
    } catch (err) {
      console.error("[face] descriptor error", err)
      setFaceDescriptor(undefined)
    }

    const result = await uploadFile(f)
    setPhotoUrl(result.url)
  }

  async function fetchLocationFromAddress() {
    if (!searchAddress.trim()) {
      toast({
        variant: "destructive",
        title: "Address required",
        description: "Please enter an address or place name",
      })
      return
    }

    setGeocoding(true)
    try {
      const res = await fetch(`/api/geocode?address=${encodeURIComponent(searchAddress)}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to geocode address")
      }

      setLocationLat(data.latitude.toFixed(6))
      setLocationLng(data.longitude.toFixed(6))
      setLocationAddress(data.formattedAddress || searchAddress)

      toast({
        title: "Location found",
        description: `Coordinates set from ${data.source === "google" ? "Google Maps" : "OpenStreetMap"}`,
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Geocoding failed",
        description: error.message || "Could not find location for the given address",
      })
    } finally {
      setGeocoding(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-h-[80vh] overflow-y-auto">
      <div className="space-y-3">
        <div>
          <Label>Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label>Email *</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label>Password {props.initial?.id ? "(Leave blank to keep current)" : "*"}</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={props.initial?.id ? "Enter new password to change" : "Enter password for login"}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 9876543210"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <Label>Parent Name *</Label>
          <Input
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            placeholder="Parent/Guardian full name"
            className={errors.parentName ? "border-red-500" : ""}
          />
          {errors.parentName && <p className="text-xs text-red-500 mt-1">{errors.parentName}</p>}
        </div>

        <div>
          <Label>Address *</Label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Complete address with city, state, pincode"
            className={`min-h-[80px] ${errors.address ? "border-red-500" : ""}`}
          />
          {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
        </div>

        {/* Date of Birth and Date of Joining fields */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              placeholder="YYYY-MM-DD"
              className={errors.dateOfBirth ? "border-red-500" : ""}
            />
            {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
          </div>
          <div>
            <Label>Date of Joining</Label>
            <Input
              type="date"
              value={dateOfJoining}
              onChange={(e) => setDateOfJoining(e.target.value)}
              placeholder="YYYY-MM-DD"
              className={errors.dateOfJoining ? "border-red-500" : ""}
            />
            {errors.dateOfJoining && <p className="text-xs text-red-500 mt-1">{errors.dateOfJoining}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <Label>Department *</Label>
            <Select value={department} onValueChange={(v) => setDepartment(v as any)}>
              <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {props.departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
          </div>

          <div>
            <Label>Role *</Label>
            <Select value={role} onValueChange={(v) => setRole(v as any)}>
              <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {filteredRoles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
          </div>

          <div>
            <Label>Shift *</Label>
            <Select value={shift} onValueChange={(v) => setShift(v as any)}>
              <SelectTrigger className={errors.shift ? "border-red-500" : ""}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {props.shifts.map((s) => (
                  <SelectItem key={s} value={s}>
                    {shiftLabel(s as string)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.shift && <p className="text-xs text-red-500 mt-1">{errors.shift}</p>}
            {canManageShifts && (
              <a href="/settings/shifts" className="mt-1 inline-block text-xs text-primary underline">
                Manage shift timings
              </a>
            )}
          </div>
        </div>

        <div>
          <Label>Institution (College/School) *</Label>
          <Input
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            placeholder="e.g., Sunrise Engineering College or Green Valley High School"
            className={errors.institutionName ? "border-red-500" : ""}
            disabled={currentUser?.role === "Admin"}
          />
          {errors.institutionName && <p className="text-xs text-red-500 mt-1">{errors.institutionName}</p>}
          {currentUser?.role === "Admin" && (
            <p className="text-xs text-gray-500 mt-1">Your institution is fixed by your account.</p>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-700" />
            <Label className="text-sm font-semibold text-blue-900">Assigned Location (Optional)</Label>
          </div>
          <p className="text-xs text-blue-700">
            Set the location where this person should mark attendance. Leave blank to allow attendance from anywhere.
          </p>

          {!institutionLocationEnabled && !loadingInstitution && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3">
              <p className="text-xs text-amber-800 font-medium">
                ⚠️ Location verification is disabled for this institution
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Super Admin must enable location verification for {institutionName || "this institution"} before you can
                use this feature.
              </p>
            </div>
          )}

          {institutionLocationEnabled && (
            <div className="flex items-center justify-between rounded-lg border border-blue-300 bg-white p-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-blue-900">Enable Location Verification</Label>
                <p className="text-xs text-blue-600">
                  When enabled, this person must be at the assigned location to mark attendance
                </p>
              </div>
              <Switch
                checked={locationVerificationEnabled}
                onCheckedChange={setLocationVerificationEnabled}
                disabled={!locationLat || !locationLng}
              />
            </div>
          )}

          {!locationLat && !locationLng && locationVerificationEnabled && (
            <p className="text-xs text-amber-600">Please set a location first before enabling location verification</p>
          )}

          <div className="space-y-2">
            <Label className="text-xs">Search by Address or Place Name</Label>
            <div className="flex gap-2">
              <Input
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="e.g., Malineni Perumallu Educational Society or 6CW5+XGW, Guntur"
                className="text-sm flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    fetchLocationFromAddress()
                  }
                }}
              />
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={fetchLocationFromAddress}
                disabled={geocoding}
                className="h-9 bg-blue-600 hover:bg-blue-700"
              >
                {geocoding ? "Searching..." : "Fetch Location"}
              </Button>
            </div>
            <p className="text-xs text-blue-600">
              Enter any address, institution name, or Plus Code and click Fetch Location
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            className="w-full h-8 text-xs bg-white border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            Use My Current Location
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Latitude</Label>
              <Input
                type="number"
                step="0.000001"
                value={locationLat}
                onChange={(e) => setLocationLat(e.target.value)}
                placeholder="17.385044"
                className={`text-sm ${errors.locationLat ? "border-red-500" : ""}`}
              />
              {errors.locationLat && <p className="text-xs text-red-500 mt-1">{errors.locationLat}</p>}
            </div>
            <div>
              <Label className="text-xs">Longitude</Label>
              <Input
                type="number"
                step="0.000001"
                value={locationLng}
                onChange={(e) => setLocationLng(e.target.value)}
                placeholder="78.486671"
                className={`text-sm ${errors.locationLng ? "border-red-500" : ""}`}
              />
              {errors.locationLng && <p className="text-xs text-red-500 mt-1">{errors.locationLng}</p>}
            </div>
          </div>

          <div>
            <Label className="text-xs">Location Name/Address</Label>
            <Input
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="e.g., Main Campus Building A"
              className="text-sm"
            />
          </div>

          {locationLat && locationLng && (
            <div className="flex items-start gap-2 rounded bg-green-50 border border-green-200 p-2">
              <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-green-700">
                <p className="font-medium">Location set successfully</p>
                <p className="text-green-600 mt-0.5">
                  {locationLat}, {locationLng}
                  {locationAddress && ` • ${locationAddress}`}
                </p>
                <p className="text-green-600 mt-1 font-medium">
                  Verification: {locationVerificationEnabled ? "Enabled ✓" : "Disabled"}
                </p>
              </div>
            </div>
          )}
        </div>

        {props.type === "staff" ? (
          <>
            <div>
              <Label>Employee Code</Label>
              <Input
                value={employeeCode || "Auto-generated (e.g., COLAP0001 for Assistant Professor)"}
                readOnly
                placeholder="Will be auto-generated"
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label>Profession</Label>
              <Select value={profession} onValueChange={(v) => setProfession(v as Profession)}>
                <SelectTrigger className={errors.profession ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select profession" />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.profession && <p className="text-xs text-red-500 mt-1">{errors.profession}</p>}
            </div>

            <div>
              <Label>Qualification</Label>
              <Input
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="B.Tech, M.Tech, PhD, etc."
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Experience (Years)</Label>
                <Input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="5"
                  type="number"
                />
              </div>

              <div>
                <Label>Specialization</Label>
                <Input
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="Machine Learning, VLSI, etc."
                />
              </div>
            </div>

            <div>
              {/* Label shows required star for Teachers and validates errors.branchClass */}
              <Label>Branch/Class {role === "Teacher" ? "*" : "(optional)"}</Label>
              <Input
                value={branchClass}
                onChange={(e) => setBranchClass(e.target.value.toUpperCase())}
                placeholder="e.g., ECE-A, CSE-B, 10-A"
                className={`uppercase ${errors.branchClass ? "border-red-500" : ""}`}
              />
              {errors.branchClass && <p className="text-xs text-red-500 mt-1">{errors.branchClass}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Assign the staff member to a branch/class like ECE-A. Required for Teachers.
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <Label>Roll Number</Label>
              <Input
                value={rollNumber || "Auto-generated (e.g., COLECE0001 for ECE branch)"}
                readOnly
                placeholder="Will be auto-generated"
                className="bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Class Level *</Label>
                <Select value={classLevel} onValueChange={(v) => setClassLevel(v as any)}>
                  <SelectTrigger className={errors.classLevel ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {props.classLevels.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.classLevel && <p className="text-xs text-red-500 mt-1">{errors.classLevel}</p>}
              </div>

              <div>
                <Label>Academic Year</Label>
                <Input
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2024-2025"
                  className={errors.academicYear ? "border-red-500" : ""}
                />
                {errors.academicYear && <p className="text-xs text-red-500 mt-1">{errors.academicYear}</p>}
              </div>
            </div>

            {(classLevel === "UG" || classLevel === "PG") && (
              <div>
                <Label>Branch (Dropdown) — optional if above entered</Label>
                <Select value={branch} onValueChange={(v) => setBranch(v as Branch)}>
                  <SelectTrigger className={errors.branch && !branchClass ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Branch/Class {classLevel === "UG" || classLevel === "PG" ? "*" : "(optional)"}</Label>
              <Input
                value={branchClass}
                onChange={(e) => setBranchClass(e.target.value.toUpperCase())}
                placeholder="e.g., ECE-A, CSE-A"
                className={`${errors.branch ? "border-red-500" : ""} uppercase`}
              />
              {errors.branch && <p className="text-xs text-red-500 mt-1">{errors.branch}</p>}
              <p className="text-xs text-gray-500 mt-1">Enter combined branch/section like ECE-A.</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Semester</Label>
                <Input value={semester} onChange={(e) => setSemester(e.target.value)} placeholder="1st, 2nd, 3rd..." />
              </div>

              <div>
                <Label>CGPA</Label>
                <Input
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder="8.5"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                />
              </div>
            </div>
          </>
        )}

        <div className="pt-2">
          <Button className="bg-teal-600 text-white hover:bg-teal-700" onClick={onSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Photo</Label>
        <Input type="file" accept="image/*" onChange={onSelectFile} className={errors.photo ? "border-red-500" : ""} />
        {errors.photo && <p className="text-xs text-red-500 mt-1">{errors.photo}</p>}

        <div className="mt-2">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl || "/placeholder.svg"}
              alt="Profile preview"
              className="h-32 w-32 rounded object-cover ring-1 ring-gray-200"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded bg-gray-100 text-gray-500">No photo</div>
          )}
        </div>
        {faceDescriptor ? (
          <div className="text-xs text-green-600">Face detected • descriptor ready</div>
        ) : (
          <div className="text-xs text-amber-600">Descriptor not ready</div>
        )}
      </div>
    </div>
  )
}

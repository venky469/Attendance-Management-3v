
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, X, Mail, FileText, ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { calculateWorkingDays, validateLeaveDates } from "@/lib/leave-helpers"
import type { LeaveType, Department, Role } from "@/lib/types"

interface LeaveRequestFormProps {
  personId: string
  personType: "staff" | "student"
  personName: string
  department?: Department
  role?: Role
  onSubmit?: () => void
  onCancel?: () => void
}

const LEAVE_TYPES: { value: LeaveType; label: string; description: string }[] = [
  { value: "sick", label: "Sick Leave", description: "Medical reasons or illness" },
  { value: "casual", label: "Casual Leave", description: "Personal reasons or urgent matters" },
  { value: "annual", label: "Annual Leave", description: "Planned vacation or holiday" },
  { value: "maternity", label: "Maternity Leave", description: "Maternity/paternity leave" },
  { value: "emergency", label: "Emergency Leave", description: "Urgent family or personal emergency" },
  { value: "other", label: "Other", description: "Other reasons (please specify)" },
]

export function LeaveRequestForm({
  personId,
  personType,
  personName,
  department,
  role,
  onSubmit,
  onCancel,
}: LeaveRequestFormProps) {
  const [leaveType, setLeaveType] = useState<LeaveType | "">("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [reason, setReason] = useState("")
  const [approverEmail, setApproverEmail] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalDays =
    startDate && endDate ? calculateWorkingDays(format(startDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd")) : 0

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!leaveType) newErrors.leaveType = "Please select a leave type"
    if (!startDate) newErrors.startDate = "Please select start date"
    if (!endDate) newErrors.endDate = "Please select end date"
    if (!reason.trim()) newErrors.reason = "Please provide a reason for leave"
    else if (reason.trim().length < 10) newErrors.reason = "Reason must be at least 10 characters"

    if (!approverEmail.trim()) newErrors.approverEmail = "Please enter the approver's email address"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(approverEmail.trim())) {
      newErrors.approverEmail = "Please enter a valid email address"
    }

    if (startDate && endDate) {
      const dateValidation = validateLeaveDates(format(startDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd"))
      if (!dateValidation.valid) {
        newErrors.dates = dateValidation.error || "Invalid date range"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/") || file.type === "application/pdf"
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      return isValidType && isValidSize
    })

    if (validFiles.length !== files.length) {
      alert("Some files were skipped. Only images and PDFs under 5MB are allowed.")
    }

    setAttachments((prev) => [...prev, ...validFiles].slice(0, 3)) // Max 3 files
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    }
    return <FileText className="h-4 w-4 text-red-500" />
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const attachmentData: { url: string; fileName: string }[] = []

      for (let i = 0; i < attachments.length; i++) {
        const file = attachments[i]
        setUploadProgress((prev) => ({ ...prev, [file.name]: true }))

        const formData = new FormData()
        formData.append("file", file)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json()
          attachmentData.push({ url, fileName: file.name })
        } else {
          throw new Error(`Failed to upload ${file.name}`)
        }

        setUploadProgress((prev) => ({ ...prev, [file.name]: false }))
      }

      const leaveRequest = {
        personId,
        personType,
        leaveType,
        startDate: format(startDate!, "yyyy-MM-dd"),
        endDate: format(endDate!, "yyyy-MM-dd"),
        totalDays,
        reason: reason.trim(),
        approverEmail: approverEmail.trim(),
        attachments: attachmentData,
        department,
        role,
      }

      const response = await fetch("/api/leave-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveRequest),
      })

      if (!response.ok) {
        throw new Error("Failed to submit leave request")
      }

      alert("Leave request submitted successfully! You will receive email notifications about the status.")
      onSubmit?.()
    } catch (error) {
      console.error("Error submitting leave request:", error)
      alert("Failed to submit leave request. Please try again.")
    } finally {
      setIsSubmitting(false)
      setUploadProgress({})
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Request Leave</h2>
        <p className="text-sm text-gray-600">
          Submit your leave request for approval. You'll receive email notifications about the status.
        </p>
        <div className="text-sm text-gray-500">
          <span className="font-medium">Requesting as:</span> {personName} (
          {personType === "staff" ? "Staff" : "Student"})
        </div>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="leaveType">Leave Type *</Label>
          <Select value={leaveType} onValueChange={(value) => setLeaveType(value as LeaveType)}>
            <SelectTrigger className={cn(errors.leaveType && "border-red-500")}>
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent>
              {LEAVE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{type.label}</span>
                    <span className="text-xs text-gray-500">{type.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.leaveType && <p className="text-xs text-red-500">{errors.leaveType}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="approverEmail">Send Request To (Email) *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="approverEmail"
              type="email"
              value={approverEmail}
              onChange={(e) => setApproverEmail(e.target.value)}
              placeholder="Enter approver's email address"
              className={cn("pl-10", errors.approverEmail && "border-red-500")}
            />
          </div>
          {errors.approverEmail && <p className="text-xs text-red-500">{errors.approverEmail}</p>}
          <p className="text-xs text-gray-500">
            Enter the email address of the person who should approve your leave request
            {personType === "student" ? " (teacher/admin)" : " (manager/supervisor)"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                    errors.startDate && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
          </div>

          <div className="space-y-2">
            <Label>End Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                    errors.endDate && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => date < (startDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
          </div>
        </div>

        {errors.dates && <p className="text-xs text-red-500">{errors.dates}</p>}

        {totalDays > 0 && (
          <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Total working days:</span> {totalDays} days
              <span className="text-xs text-blue-600 block mt-1">(Weekends are excluded from the count)</span>
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Leave *</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a detailed reason for your leave request..."
            className={cn("min-h-[100px]", errors.reason && "border-red-500")}
            maxLength={500}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{errors.reason && <span className="text-red-500">{errors.reason}</span>}</span>
            <span>{reason.length}/500</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Supporting Documents (Optional)</Label>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={attachments.length >= 3}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Documents ({attachments.length}/3)
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Upload medical certificates, official documents, etc. (Max 3 files, 5MB each, Images only)
            </p>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3 flex-1">
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-700 truncate block">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      {uploadProgress[file.name] && <div className="text-xs text-blue-600">Uploading...</div>}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      disabled={uploadProgress[file.name]}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? "Submitting..." : "Submit Leave Request"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

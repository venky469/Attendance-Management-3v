"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LeaveRequestForm } from "./leave-request-form"
import type { Department, Role } from "@/lib/types"

interface LeaveRequestModalProps {
  isOpen: boolean
  onClose: () => void
  personId: string
  personType: "staff" | "student"
  personName: string
  department?: Department
  role?: Role
}

export function LeaveRequestModal({
  isOpen,
  onClose,
  personId,
  personType,
  personName,
  department,
  role,
}: LeaveRequestModalProps) {
  const handleSubmit = () => {
    onClose()
    // Refresh the page or update the UI to show the new request
    window.location.reload()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Leave Request</DialogTitle>
        </DialogHeader>
        <LeaveRequestForm
          personId={personId}
          personType={personType}
          personName={personName}
          department={department}
          role={role}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}

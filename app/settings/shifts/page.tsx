
"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { DEFAULT_SHIFTS, type ShiftSetting, DEFAULT_ABSENT_MIN, DEFAULT_LATE_MIN } from "@/lib/shift-settings"
import { getStoredUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ShiftSettingsPage() {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<ReturnType<typeof getStoredUser> | null>(null)

  useEffect(() => {
    setUser(getStoredUser())
    setReady(true)
  }, [])

  const canManage = useMemo(() => {
    const role = (user?.role || "").toLowerCase()
    return role === "admin" || role === "superadmin" || role === "super-admin"
  }, [user])

  const institutionName = user?.institutionName || ""

  const { data, isLoading, mutate } = useSWR(
    ready ? `/api/shifts?institutionName=${encodeURIComponent(institutionName)}` : null,
    fetcher,
  )

  const [form, setForm] = useState<ShiftSetting[]>(DEFAULT_SHIFTS)
  const [initial, setInitial] = useState<ShiftSetting[]>(DEFAULT_SHIFTS)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (data?.shifts) {
      const normalized: ShiftSetting[] = data.shifts.map((s: ShiftSetting) => ({
        ...s,
        lateThresholdMinutes: s.lateThresholdMinutes ?? DEFAULT_LATE_MIN,
        absentThresholdMinutes: s.absentThresholdMinutes ?? DEFAULT_ABSENT_MIN,
      }))
      setForm(normalized)
      setInitial(normalized)
    }
  }, [data])

  const onChange = (name: ShiftSetting["name"], key: "start" | "end", value: string) => {
    setForm((prev) => prev.map((s) => (s.name === name ? { ...s, [key]: value } : s)))
  }

  const onChangeNum = (
    name: ShiftSetting["name"],
    key: "lateThresholdMinutes" | "absentThresholdMinutes",
    value: string,
  ) => {
    const num = Number(value)
    setForm((prev) => prev.map((s) => (s.name === name ? { ...s, [key]: Number.isFinite(num) ? num : undefined } : s)))
  }

  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(initial)
  }, [form, initial])

  const onSave = async () => {
    if (!isDirty) return
    setSaving(true)
    try {
      const res = await fetch("/api/shifts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionName,
          shifts: form,
          userRole: user?.role,
        }),
      })
      if (res.ok) {
        setInitial(form)
        await mutate()
        toast({
          title: "Shifts updated",
          description: "Your shift timings were saved successfully.",
        })
      } else {
        const msg = await res.text().catch(() => "Unable to save shifts.")
        toast({
          title: "Save failed",
          description: msg || "Unable to save shifts.",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!ready) {
    return (
      <main className="container mx-auto p-4">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </main>
    )
  }

  if (!canManage) {
    return (
      <main className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
          </CardHeader>
          <CardContent>You must be an Admin or SuperAdmin to manage shift timings.</CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Shift timings for {institutionName || "your institution"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {form.map((s) => (
            <div key={s.name} className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div>
                <Label className="text-sm">Shift</Label>
                <div className="text-base font-medium">{s.name}</div>
              </div>
              <div>
                <Label htmlFor={`${s.name}-start`} className="text-sm">
                  Start time
                </Label>
                <Input
                  id={`${s.name}-start`}
                  type="time"
                  value={s.start}
                  onChange={(e) => onChange(s.name, "start", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`${s.name}-end`} className="text-sm">
                  End time
                </Label>
                <Input
                  id={`${s.name}-end`}
                  type="time"
                  value={s.end}
                  onChange={(e) => onChange(s.name, "end", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`${s.name}-late`} className="text-sm">
                  Late threshold (min)
                </Label>
                <Input
                  id={`${s.name}-late`}
                  type="number"
                  min={0}
                  max={480}
                  inputMode="numeric"
                  value={s.lateThresholdMinutes ?? DEFAULT_LATE_MIN}
                  onChange={(e) => onChangeNum(s.name, "lateThresholdMinutes", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`${s.name}-absent`} className="text-sm">
                  Absent threshold (min)
                </Label>
                <Input
                  id={`${s.name}-absent`}
                  type="number"
                  min={0}
                  max={720}
                  inputMode="numeric"
                  value={s.absentThresholdMinutes ?? DEFAULT_ABSENT_MIN}
                  onChange={(e) => onChangeNum(s.name, "absentThresholdMinutes", e.target.value)}
                />
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
            <Button onClick={onSave} disabled={!isDirty || saving} className="w-full sm:w-auto">
              {saving ? "Saving..." : isDirty ? "Save shifts" : "No changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

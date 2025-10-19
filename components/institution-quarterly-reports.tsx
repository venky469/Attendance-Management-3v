"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Mail, Database, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getStoredUser } from "@/lib/auth"

export default function InstitutionQuarterlyReports() {
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [institution, setInstitution] = useState<any>(null)
  const user = getStoredUser()

  useEffect(() => {
    fetchInstitutionSettings()
  }, [])

  const fetchInstitutionSettings = async () => {
    try {
      setLoading(true)
      const institutionName = user?.institutionName
      if (!institutionName) {
        setLoading(false)
        return
      }

      const res = await fetch(`/api/institutions/${encodeURIComponent(institutionName)}`)
      if (res.ok) {
        const data = await res.json()
        setInstitution(data)
      }
    } catch (error) {
      console.error("Failed to fetch institution settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const testReportGeneration = async () => {
    try {
      setTesting(true)
      const res = await fetch("/api/cron/quarterly-report?test=true")
      if (res.ok) {
        const data = await res.json()
        toast({
          title: "Test Report Preview",
          description: `${data.stats.recordsToProcess} records will be processed. ${data.stats.emailsToSend} emails will be sent.`,
        })
      } else {
        throw new Error("Test failed")
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Unable to preview quarterly report",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quarterly Reports & Auto-Archiving
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isEnabled = institution?.quarterlyReportsEnabled === true

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quarterly Reports & Auto-Archiving
          </CardTitle>
          <Badge variant={isEnabled ? "default" : "secondary"} className={isEnabled ? "bg-green-600" : ""}>
            {isEnabled ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Enabled
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Disabled
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEnabled ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-900">Feature Not Enabled</p>
                <p className="text-sm text-amber-700">
                  Quarterly reports and auto-archiving are currently disabled for your institution. Contact your Super
                  Admin to enable this feature.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-900">Automated Reports Active</p>
                  <p className="text-sm text-green-700">
                    Your institution receives quarterly attendance reports automatically via email.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">Report Schedule</p>
                </div>
                <p className="text-sm text-blue-700">Every 3 months (quarterly)</p>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-purple-600" />
                  <p className="text-sm font-medium text-purple-900">Email Recipients</p>
                </div>
                <p className="text-sm text-purple-700">All Admins & Managers</p>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-teal-600" />
                  <p className="text-sm font-medium text-teal-900">Report Formats</p>
                </div>
                <p className="text-sm text-teal-700">PDF & Excel attachments</p>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-rose-600" />
                  <p className="text-sm font-medium text-rose-900">Auto-Archiving</p>
                </div>
                <p className="text-sm text-rose-700">Deletes data older than 3 months</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">What's Included in Reports:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                <li>Complete attendance records for the last 3 months</li>
                <li>Staff and student attendance statistics</li>
                <li>Department-wise breakdown</li>
                <li>Present, absent, and late counts</li>
                <li>Individual attendance details with timestamps</li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> After generating reports, attendance records older than 3 months are
                automatically deleted to optimize database storage. Reports are safely stored in your email.
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={testReportGeneration}
              disabled={testing}
            >
              {testing ? "Testing..." : "Preview Report Statistics"}
            </Button>
          </>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            This feature is managed by your Super Admin. To enable or disable quarterly reports, please contact your
            system administrator.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

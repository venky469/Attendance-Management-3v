"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Mail, Trash2, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export function QuarterlyReportsManager() {
  const [loading, setLoading] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [testData, setTestData] = useState<any>(null)
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleTestReport = async () => {
    setTestLoading(true)
    setResult(null)
    setTestData(null)

    try {
      const response = await fetch("/api/cron/quarterly-report?test=true")
      const data = await response.json()

      if (response.ok) {
        setTestData(data.stats)
        setResult({
          type: "success",
          message: "Test completed successfully. Review the statistics below.",
        })
      } else {
        setResult({
          type: "error",
          message: data.message || "Failed to test report generation",
        })
      }
    } catch (error) {
      setResult({
        type: "error",
        message: "Failed to connect to server",
      })
    } finally {
      setTestLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    if (
      !confirm(
        "Are you sure you want to generate the quarterly report now? This will:\n\n1. Generate PDF and Excel reports\n2. Email them to all admins/managers\n3. DELETE attendance records older than 3 months\n\nThis action cannot be undone!",
      )
    ) {
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const cronSecret = prompt("Enter CRON_SECRET to authorize:")
      if (!cronSecret) {
        setResult({ type: "error", message: "Authorization required" })
        setLoading(false)
        return
      }

      const response = await fetch("/api/cron/quarterly-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cronSecret}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          type: "success",
          message: `Report generated successfully! ${data.stats.emailsSent} emails sent, ${data.stats.recordsDeleted} old records deleted.`,
        })
      } else {
        setResult({
          type: "error",
          message: data.message || "Failed to generate report",
        })
      }
    } catch (error) {
      setResult({
        type: "error",
        message: "Failed to connect to server",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Quarterly Attendance Reports
        </CardTitle>
        <CardDescription>
          Automated report generation every 3 months. Reports are emailed to all admins/managers and old data is
          archived.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Info */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Report Distribution</span>
            </div>
            <Badge variant="secondary">All Admins & Managers</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Report Formats</span>
            </div>
            <Badge variant="secondary">PDF & Excel</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Data Retention</span>
            </div>
            <Badge variant="secondary">Last 3 Months</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Schedule</span>
            </div>
            <Badge variant="secondary">Every 3 Months</Badge>
          </div>
        </div>

        {/* Test Data Display */}
        {testData && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2 mt-2">
                <div className="font-semibold">Test Results:</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Records to process:</div>
                  <div className="font-medium">{testData.recordsToProcess.toLocaleString()}</div>
                  <div>Records to delete:</div>
                  <div className="font-medium text-destructive">{testData.recordsToDelete.toLocaleString()}</div>
                  <div>Emails to send:</div>
                  <div className="font-medium">{testData.emailsToSend}</div>
                  <div>Date range:</div>
                  <div className="font-medium text-xs">
                    {new Date(testData.dateRange.start).toLocaleDateString()} -{" "}
                    {new Date(testData.dateRange.end).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Result Message */}
        {result && (
          <Alert variant={result.type === "error" ? "destructive" : "default"}>
            {result.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleTestReport}
            disabled={testLoading || loading}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            {testLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <AlertCircle className="mr-2 h-4 w-4" />
                Test Report
              </>
            )}
          </Button>

          <Button onClick={handleGenerateReport} disabled={loading || testLoading} variant="default" className="flex-1">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Now
              </>
            )}
          </Button>
        </div>

        {/* Setup Instructions */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <div className="font-semibold mb-1">Setup Required:</div>
            <div>Configure an external cron service (EasyCron, Cron-Job.org, or GitHub Actions) to call:</div>
            <code className="block mt-1 p-2 bg-muted rounded text-xs">
              POST https://your-domain.netlify.app/api/cron/quarterly-report
            </code>
            <div className="mt-1">
              With header: <code className="bg-muted px-1 rounded">Authorization: Bearer YOUR_CRON_SECRET</code>
            </div>
            <div className="mt-2">
              See <code className="bg-muted px-1 rounded">docs/QUARTERLY_REPORTS_SETUP.md</code> for detailed
              instructions.
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

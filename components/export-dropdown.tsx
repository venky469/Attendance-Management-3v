"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet, File } from "lucide-react"
import { useState } from "react"

interface ExportDropdownProps {
  type: "staff" | "students"
  data: any[]
  disabled?: boolean
}

export function ExportDropdown({ type, data, disabled }: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: "pdf" | "excel" | "word") => {
    if (!data?.length) {
      alert("No data to export")
      return
    }

    setIsExporting(true)
    try {
      const response = await fetch(`/api/export/${type}?format=${format}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      })

      if (!response.ok) {
        throw new Error("Export failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      const timestamp = new Date().toISOString().split("T")[0]
      const extensions = { pdf: "pdf", excel: "xlsx", word: "docx" }
      a.download = `${type}_export_${timestamp}.${extensions[format]}`

      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Export error:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || isExporting}
          className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white/80"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="h-4 w-4 mr-2 text-red-600" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("word")}>
          <File className="h-4 w-4 mr-2 text-blue-600" />
          Export as Word
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

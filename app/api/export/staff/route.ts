
import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx"

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json()
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format")

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    // Prepare staff data for export
    const exportData = data.map((staff) => ({
      Name: staff.name,
      Email: staff.email || "N/A",
      "Employee Code": staff.employeeCode || "N/A",
      Profession: staff.profession || "N/A",
      "Branch/Class": staff.branchClass || "N/A",
      Role: staff.role || "N/A",
      Department: staff.department || "N/A",
      Shift: staff.shift || "N/A",
      "HR Code": staff.hrCode || "N/A",
      "Phone Number": staff.phone || "N/A",
      "Date of Birth": staff.dateOfBirth ? new Date(staff.dateOfBirth).toLocaleDateString() : "N/A",
      "Joining Date": staff.dateOfJoining ? new Date(staff.dateOfJoining).toLocaleDateString() : "N/A",
    }))

    switch (format) {
      case "excel": {
        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Staff")

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": "attachment; filename=staff_export.xlsx",
          },
        })
      }

      case "word": {
        const tableRows = [
          new TableRow({
            children: Object.keys(exportData[0] || {}).map(
              (key) =>
                new TableCell({
                  children: [new Paragraph(key)],
                  width: { size: 2000, type: WidthType.DXA },
                }),
            ),
          }),
          ...exportData.map(
            (staff) =>
              new TableRow({
                children: Object.values(staff).map(
                  (value) =>
                    new TableCell({
                      children: [new Paragraph(String(value))],
                      width: { size: 2000, type: WidthType.DXA },
                    }),
                ),
              }),
          ),
        ]

        const doc = new Document({
          sections: [
            {
              children: [
                new Paragraph({
                  text: "Staff Export Report",
                  heading: "Heading1",
                }),
                new Paragraph({
                  text: `Generated on: ${new Date().toLocaleDateString()}`,
                }),
                new Paragraph({ text: "" }),
                new Table({
                  rows: tableRows,
                  width: { size: 100, type: WidthType.PERCENTAGE },
                }),
              ],
            },
          ],
        })

        const buffer = await Packer.toBuffer(doc)

        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": "attachment; filename=staff_export.docx",
          },
        })
      }

      case "pdf": {
        // LaTeX template for PDF generation
        const latexContent = `
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{longtable}
\\usepackage{booktabs}
\\usepackage{array}
\\title{Staff Export Report}
\\author{Employee Management System}
\\date{${new Date().toLocaleDateString()}}

\\begin{document}
\\maketitle

\\section{Staff Members}
Total Staff: ${exportData.length}

\\begin{longtable}{|p{2cm}|p{2.5cm}|p{2cm}|p{2cm}|p{2cm}|p{2cm}|p{2cm}|p{2cm}|}
\\hline
\\textbf{Name} & \\textbf{Email} & \\textbf{Code} & \\textbf{Profession} & \\textbf{Branch/Class} & \\textbf{Role} & \\textbf{Dept} & \\textbf{Shift} \\\\
\\hline
\\endhead
${exportData
  .map(
    (staff) =>
      `${staff.Name} & ${staff.Email} & ${staff["Employee Code"]} & ${staff.Profession} & ${staff["Branch/Class"]} & ${staff.Role} & ${staff.Department} & ${staff.Shift} \\\\\\hline`,
  )
  .join("\n")}
\\end{longtable}

\\end{document}
        `

        return NextResponse.json({
          latex: latexContent,
          message: "LaTeX content generated. Use latexmk to compile to PDF.",
        })
      }

      default:
        return NextResponse.json({ error: "Invalid format" }, { status: 400 })
    }
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}

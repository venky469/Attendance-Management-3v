// import { type NextRequest, NextResponse } from "next/server"
// import * as XLSX from "xlsx"
// import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx"

// export async function POST(request: NextRequest) {
//   try {
//     const { data } = await request.json()
//     const { searchParams } = new URL(request.url)
//     const format = searchParams.get("format")

//     if (!data || !Array.isArray(data)) {
//       return NextResponse.json({ error: "Invalid data" }, { status: 400 })
//     }

//     // Prepare student data for export
//     const exportData = data.map((student) => ({
//       Name: student.name,
//       Email: student.email || "N/A",
//       "Roll Number": student.rollNumber || "N/A",
//       Class: student.classLevel?.name || "N/A",
//       Teacher: student.role?.name || "N/A",
//       Department: student.department?.name || "N/A",
//       Shift: student.shift?.name || "N/A",
//       "Phone Number": student.phoneNumber || "N/A",
//       "Date of Birth": student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "N/A",
//       "Admission Date": student.joiningDate ? new Date(student.joiningDate).toLocaleDateString() : "N/A",
//     }))

//     switch (format) {
//       case "excel": {
//         const worksheet = XLSX.utils.json_to_sheet(exportData)
//         const workbook = XLSX.utils.book_new()
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Students")

//         const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

//         return new NextResponse(buffer, {
//           headers: {
//             "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             "Content-Disposition": "attachment; filename=students_export.xlsx",
//           },
//         })
//       }

//       case "word": {
//         const tableRows = [
//           new TableRow({
//             children: Object.keys(exportData[0] || {}).map(
//               (key) =>
//                 new TableCell({
//                   children: [new Paragraph(key)],
//                   width: { size: 1800, type: WidthType.DXA },
//                 }),
//             ),
//           }),
//           ...exportData.map(
//             (student) =>
//               new TableRow({
//                 children: Object.values(student).map(
//                   (value) =>
//                     new TableCell({
//                       children: [new Paragraph(String(value))],
//                       width: { size: 1800, type: WidthType.DXA },
//                     }),
//                 ),
//               }),
//           ),
//         ]

//         const doc = new Document({
//           sections: [
//             {
//               children: [
//                 new Paragraph({
//                   text: "Students Export Report",
//                   heading: "Heading1",
//                 }),
//                 new Paragraph({
//                   text: `Generated on: ${new Date().toLocaleDateString()}`,
//                 }),
//                 new Paragraph({ text: "" }),
//                 new Table({
//                   rows: tableRows,
//                   width: { size: 100, type: WidthType.PERCENTAGE },
//                 }),
//               ],
//             },
//           ],
//         })

//         const buffer = await Packer.toBuffer(doc)

//         return new NextResponse(buffer, {
//           headers: {
//             "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//             "Content-Disposition": "attachment; filename=students_export.docx",
//           },
//         })
//       }

//       case "pdf": {
//         // LaTeX template for PDF generation
//         const latexContent = `
// \\documentclass[11pt,a4paper]{article}
// \\usepackage[utf8]{inputenc}
// \\usepackage[margin=1in]{geometry}
// \\usepackage{longtable}
// \\usepackage{booktabs}
// \\usepackage{array}
// \\title{Students Export Report}
// \\author{Employee Management System}
// \\date{${new Date().toLocaleDateString()}}

// \\begin{document}
// \\maketitle

// \\section{Students}
// Total Students: ${exportData.length}

// \\begin{longtable}{|p{2cm}|p{2.5cm}|p{2cm}|p{2cm}|p{2cm}|p{2cm}|}
// \\hline
// \\textbf{Name} & \\textbf{Email} & \\textbf{Roll No} & \\textbf{Class} & \\textbf{Teacher} & \\textbf{Shift} \\\\
// \\hline
// \\endhead
// ${exportData
//   .map(
//     (student) =>
//       `${student.Name} & ${student.Email} & ${student["Roll Number"]} & ${student.Class} & ${student.Teacher} & ${student.Shift} \\\\\\hline`,
//   )
//   .join("\n")}
// \\end{longtable}

// \\end{document}
//         `

//         return NextResponse.json({
//           latex: latexContent,
//           message: "LaTeX content generated. Use latexmk to compile to PDF.",
//         })
//       }

//       default:
//         return NextResponse.json({ error: "Invalid format" }, { status: 400 })
//     }
//   } catch (error) {
//     console.error("Export error:", error)
//     return NextResponse.json({ error: "Export failed" }, { status: 500 })
//   }
// }



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

    // Prepare student data for export
    const exportData = data.map((student) => ({
      Name: student.name,
      Email: student.email || "N/A",
      "Roll Number": student.rollNumber || "N/A",
      "Branch/Class": student.branchClass || student.branch || "N/A",
      Class: student.classLevel || "N/A",
      Teacher: student.role || "N/A",
      Department: student.department || "N/A",
      Shift: student.shift || "N/A",
      "Phone Number": student.phone || "N/A",
      "Date of Birth": student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "N/A",
      "Admission Date": student.dateOfJoining ? new Date(student.dateOfJoining).toLocaleDateString() : "N/A",
    }))

    switch (format) {
      case "excel": {
        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Students")

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": "attachment; filename=students_export.xlsx",
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
                  width: { size: 1800, type: WidthType.DXA },
                }),
            ),
          }),
          ...exportData.map(
            (student) =>
              new TableRow({
                children: Object.values(student).map(
                  (value) =>
                    new TableCell({
                      children: [new Paragraph(String(value))],
                      width: { size: 1800, type: WidthType.DXA },
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
                  text: "Students Export Report",
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
            "Content-Disposition": "attachment; filename=students_export.docx",
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
\\title{Students Export Report}
\\author{Employee Management System}
\\date{${new Date().toLocaleDateString()}}

\\begin{document}
\\maketitle

\\section{Students}
Total Students: ${exportData.length}

\\begin{longtable}{|p{2cm}|p{2.5cm}|p{2cm}|p{2cm}|p{2cm}|p{2cm}|}
\\hline
\\textbf{Name} & \\textbf{Email} & \\textbf{Roll No} & \\textbf{Branch/Class} & \\textbf{Teacher} & \\textbf{Shift} \\\\
\\hline
\\endhead
${exportData
  .map(
    (student) =>
      `${student.Name} & ${student.Email} & ${student["Roll Number"]} & ${student["Branch/Class"]} & ${student.Teacher} & ${student.Shift} \\\\\\hline`,
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

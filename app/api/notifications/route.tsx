
// import type { NextRequest } from "next/server"
// import { NextResponse } from "next/server"
// import { getDb } from "@/lib/mongo"
// import nodemailer from "nodemailer"

// type Audience = "institution" | "admins"
// type Target = "both" | "staff" | "students"

// const BRAND_NAME = "Employee Management System"

// function getTransport() {
//   const host = process.env.SMTP_HOST
//   const port = Number(process.env.SMTP_PORT || 587)
//   const user = process.env.SMTP_USER
//   const pass = process.env.SMTP_PASS
//   if (!host || !user || !pass) {
//     throw new Error("SMTP is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.")
//   }
//   return nodemailer.createTransport({
//     host,
//     port,
//     secure: port === 465,
//     auth: { user, pass },
//   })
// }

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const role = searchParams.get("role") || ""
//     const institution = searchParams.get("institution") || ""

//     const db = await getDb()
//     const col = db.collection("notifications")

//     let filter: any = {}

//     if (role === "SuperAdmin") {
//       // no filter - see all
//       filter = {}
//     } else if (role === "Admin") {
//       // admin sees institution notices + superadmin-to-admins
//       filter = {
//         $or: [{ audience: "institution", institutionName: institution }, { audience: "admins" }],
//       }
//     } else if (institution) {
//       // staff/teacher/student: only institution notices
//       filter = { audience: "institution", institutionName: institution }
//     }

//     const items = await col.find(filter).sort({ createdAt: -1 }).limit(200).toArray()

//     const normalized = items.map((n: any) => {
//       const { _id, ...rest } = n
//       return { id: _id?.toString(), ...rest }
//     })

//     return NextResponse.json({ items: normalized })
//   } catch (err: any) {
//     console.error("[notifications][GET] error:", err?.message || err)
//     return NextResponse.json({ error: "Failed to load notifications" }, { status: 500 })
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
//     const {
//       title,
//       message,
//       audience, // "institution" | "admins"
//       institutionName, // required when audience = institution
//       creator, // { id, name, role, institutionName? }
//       target = "both", // new: "both" | "staff" | "students" (only for institution audience)
//     }: {
//       title: string
//       message: string
//       audience: Audience
//       institutionName?: string
//       creator: { id: string; name: string; role: string; institutionName?: string }
//       target?: Target
//     } = body || {}

//     if (!title || !message || !audience || !creator?.role) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     // Admin can only send to their institution (any target: both/staff/students)
//     // SuperAdmin can send to admins OR a specific institution (any target)
//     if (creator.role === "Admin") {
//       if (audience !== "institution") {
//         return NextResponse.json({ error: "Admins can only send to their institution" }, { status: 403 })
//       }
//       if (!institutionName) {
//         return NextResponse.json({ error: "institutionName is required" }, { status: 400 })
//       }
//     } else if (creator.role === "SuperAdmin") {
//       if (audience !== "admins" && audience !== "institution") {
//         return NextResponse.json({ error: "Invalid audience" }, { status: 400 })
//       }
//       if (audience === "institution" && !institutionName) {
//         return NextResponse.json({ error: "institutionName is required" }, { status: 400 })
//       }
//     } else {
//       return NextResponse.json({ error: "Not allowed" }, { status: 403 })
//     }

//     const db = await getDb()

//     let bcc: string[] = []
//     if (audience === "institution" && institutionName) {
//       const wantStaff = target === "both" || target === "staff"
//       const wantStudents = target === "both" || target === "students"

//       const queries: Promise<any[]>[] = []
//       if (wantStaff) {
//         queries.push(
//           db
//             .collection("staff")
//             .find({ institutionName, email: { $exists: true, $ne: "" } })
//             .project({ email: 1 })
//             .toArray(),
//         )
//       }
//       if (wantStudents) {
//         queries.push(
//           db
//             .collection("students")
//             .find({ institutionName, email: { $exists: true, $ne: "" } })
//             .project({ email: 1 })
//             .toArray(),
//         )
//       }
//       const results = await Promise.all(queries)
//       bcc = Array.from(new Set(results.flat().map((x: any) => x.email))).filter(Boolean)
//     } else if (audience === "admins") {
//       const admins = await db
//         .collection("staff")
//         .find({
//           email: { $exists: true, $ne: "" },
//           $or: [{ role: "Admin" }, { "role.name": "Admin" }],
//         })
//         .project({ email: 1 })
//         .toArray()
//       bcc = Array.from(new Set(admins.map((x: any) => x.email))).filter(Boolean)
//     }

//     const now = new Date().toISOString()
//     const doc = {
//       title,
//       message,
//       audience,
//       institutionName: audience === "institution" ? institutionName : undefined,
//       target: audience === "institution" ? target : undefined,
//       createdBy: { id: creator.id, name: creator.name, role: creator.role },
//       createdAt: now,
//       sent: false, // Will be set to true by cron job after sending push notifications
//       emailAttempted: bcc.length,
//       emailSent: 0,
//       updatedAt: now,
//     }
//     const insertRes = await db.collection("notifications").insertOne(doc)
//     const insertedId = insertRes.insertedId?.toString()

//     // Send email (best-effort)
//     let sent = 0
//     try {
//       if (bcc.length > 0) {
//         const transporter = getTransport()

//         const emailSubject =
//           audience === "admins"
//             ? `${BRAND_NAME} - Admin Notice: ${title}`
//             : `${institutionName || BRAND_NAME} - ${doc.target ? `${doc.target.charAt(0).toUpperCase() + doc.target.slice(1)} ` : ""}Notification: ${title}`

//         const emailHtml = `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//             <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px 8px 0 0;">
//               <h2 style="margin: 0; color: #1f2937;">${audience === "admins" ? BRAND_NAME : institutionName || BRAND_NAME}</h2>
//               <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">
//                 ${audience === "admins" ? "Admin Notification" : `${doc.target ? doc.target.charAt(0).toUpperCase() + doc.target.slice(1) + " " : ""}Notification`}
//               </p>
//             </div>
//             <div style="background-color: white; padding: 20px; border: 1px solid #e5e7eb;">
//               <h3 style="color: #1f2937; margin-top: 0;">${title}</h3>
//               <p style="color: #374151; line-height: 1.6;">${message.replace(/\n/g, "<br/>")}</p>
//             </div>
//             <div style="background-color: #f9fafb; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
//               <p style="margin: 0; color: #6b7280; font-size: 12px;">
//                 This is an automated notification from ${BRAND_NAME}
//               </p>
//             </div>
//           </div>
//         `

//         await transporter.sendMail({
//           from: process.env.SMTP_USER,
//           to: "undisclosed-recipients:;",
//           bcc,
//           subject: emailSubject,
//           text: message,
//           html: emailHtml,
//         })
//         sent = bcc.length
//       }
//     } catch (emailErr) {
//       console.error("[notifications][POST] email error:", emailErr)
//     }

//     await db.collection("notifications").updateOne({ _id: insertRes.insertedId }, { $set: { emailSent: sent } })

//     return NextResponse.json({ ok: true, id: insertedId, emailAttempted: bcc.length, emailSent: sent })
//   } catch (err: any) {
//     console.error("[notifications][POST] error:", err?.message || err)
//     return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const idFromQuery = searchParams.get("id") || undefined
//     const body = await req.json()
//     const {
//       id = idFromQuery,
//       title,
//       message,
//       audience,
//       institutionName,
//       target,
//       actor,
//     }: {
//       id?: string
//       title?: string
//       message?: string
//       audience?: Audience
//       institutionName?: string
//       target?: Target
//       actor: { id: string; role: string; institutionName?: string }
//     } = body || {}

//     if (!id || !actor?.role || !actor?.id) {
//       return NextResponse.json({ error: "Missing id or actor" }, { status: 400 })
//     }

//     const db = await getDb()
//     const existing = await db.collection("notifications").findOne({ _id: new (require("mongodb").ObjectId)(id) })
//     if (!existing) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 })
//     }

//     // Permissions:
//     const isSuper = actor.role === "SuperAdmin"
//     const isAdmin = actor.role === "Admin"
//     if (!isSuper) {
//       // Admin can edit only institution notices created by themselves (and within their institution)
//       if (
//         !(
//           isAdmin &&
//           existing.audience === "institution" &&
//           existing.createdBy?.id === actor.id &&
//           (!actor.institutionName || existing.institutionName === actor.institutionName)
//         )
//       ) {
//         return NextResponse.json({ error: "Forbidden" }, { status: 403 })
//       }
//     }

//     const update: any = { updatedAt: new Date().toISOString() }
//     if (typeof title === "string") update.title = title
//     if (typeof message === "string") update.message = message

//     if (isSuper) {
//       // SuperAdmin may also change audience/institution/target
//       if (audience) update.audience = audience
//       if (audience === "institution") {
//         if (institutionName) update.institutionName = institutionName
//         if (target) update.target = target
//       } else {
//         update.institutionName = undefined
//         update.target = undefined
//       }
//     } else if (isAdmin) {
//       // Admin can adjust target within institution
//       if (typeof target === "string") update.target = target
//     }

//     await db.collection("notifications").updateOne({ _id: existing._id }, { $set: update })
//     return NextResponse.json({ ok: true })
//   } catch (err: any) {
//     console.error("[notifications][PUT] error:", err?.message || err)
//     return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const idFromQuery = searchParams.get("id") || undefined
//     const body = req.method === "DELETE" ? await req.json().catch(() => ({})) : {}
//     const { id = idFromQuery, actor } = body as {
//       id?: string
//       actor?: { id: string; role: string; institutionName?: string }
//     }

//     if (!id || !actor?.role || !actor?.id) {
//       return NextResponse.json({ error: "Missing id or actor" }, { status: 400 })
//     }

//     const db = await getDb()
//     const existing = await db.collection("notifications").findOne({ _id: new (require("mongodb").ObjectId)(id) })
//     if (!existing) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 })
//     }

//     const isSuper = actor.role === "SuperAdmin"
//     const isAdmin = actor.role === "Admin"
//     if (!isSuper) {
//       if (
//         !(
//           isAdmin &&
//           existing.audience === "institution" &&
//           existing.createdBy?.id === actor.id &&
//           (!actor.institutionName || existing.institutionName === actor.institutionName)
//         )
//       ) {
//         return NextResponse.json({ error: "Forbidden" }, { status: 403 })
//       }
//     }

//     await db.collection("notifications").deleteOne({ _id: existing._id })
//     return NextResponse.json({ ok: true })
//   } catch (err: any) {
//     console.error("[notifications][DELETE] error:", err?.message || err)
//     return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 })
//   }
// }



import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"
import nodemailer from "nodemailer"

type Audience = "institution" | "admins"
type Target = "both" | "staff" | "students"

const BRAND_NAME = "Employee Management System"

function getTransport() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.")
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role") || ""
    const institution = searchParams.get("institution") || ""
    const userId = searchParams.get("userId") || ""

    const db = await getDb()
    const col = db.collection("notifications")

    let filter: any = {}

    if (role === "SuperAdmin") {
      // no filter - see all
      filter = {}
    } else if (role === "Admin") {
      // admin sees institution notices + superadmin-to-admins
      filter = {
        $or: [{ audience: "institution", institutionName: institution }, { audience: "admins" }],
      }
    } else if (institution) {
      // staff/teacher/student: only institution notices
      filter = { audience: "institution", institutionName: institution }
    }

    const items = await col.find(filter).sort({ createdAt: -1 }).limit(200).toArray()

    let filteredItems = items
    if (userId) {
      const deletions = await db
        .collection("user_notification_deletions")
        .find({ userId })
        .project({ notificationId: 1 })
        .toArray()

      const deletedIds = new Set(deletions.map((d: any) => d.notificationId))
      filteredItems = items.filter((n: any) => !deletedIds.has(n._id?.toString()))
    }

    const normalized = filteredItems.map((n: any) => {
      const { _id, ...rest } = n
      return { id: _id?.toString(), ...rest }
    })

    return NextResponse.json({ items: normalized })
  } catch (err: any) {
    console.error("[notifications][GET] error:", err?.message || err)
    return NextResponse.json({ error: "Failed to load notifications" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title,
      message,
      audience, // "institution" | "admins"
      institutionName, // required when audience = institution
      creator, // { id, name, role, institutionName? }
      target = "both", // new: "both" | "staff" | "students" (only for institution audience)
    }: {
      title: string
      message: string
      audience: Audience
      institutionName?: string
      creator: { id: string; name: string; role: string; institutionName?: string }
      target?: Target
    } = body || {}

    if (!title || !message || !audience || !creator?.role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Admin can only send to their institution (any target: both/staff/students)
    // SuperAdmin can send to admins OR a specific institution (any target)
    if (creator.role === "Admin") {
      if (audience !== "institution") {
        return NextResponse.json({ error: "Admins can only send to their institution" }, { status: 403 })
      }
      if (!institutionName) {
        return NextResponse.json({ error: "institutionName is required" }, { status: 400 })
      }
    } else if (creator.role === "SuperAdmin") {
      if (audience !== "admins" && audience !== "institution") {
        return NextResponse.json({ error: "Invalid audience" }, { status: 400 })
      }
      if (audience === "institution" && !institutionName) {
        return NextResponse.json({ error: "institutionName is required" }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 })
    }

    const db = await getDb()

    let bcc: string[] = []
    if (audience === "institution" && institutionName) {
      const wantStaff = target === "both" || target === "staff"
      const wantStudents = target === "both" || target === "students"

      const queries: Promise<any[]>[] = []
      if (wantStaff) {
        queries.push(
          db
            .collection("staff")
            .find({ institutionName, email: { $exists: true, $ne: "" } })
            .project({ email: 1 })
            .toArray(),
        )
      }
      if (wantStudents) {
        queries.push(
          db
            .collection("students")
            .find({ institutionName, email: { $exists: true, $ne: "" } })
            .project({ email: 1 })
            .toArray(),
        )
      }
      const results = await Promise.all(queries)
      bcc = Array.from(new Set(results.flat().map((x: any) => x.email))).filter(Boolean)
    } else if (audience === "admins") {
      const admins = await db
        .collection("staff")
        .find({
          email: { $exists: true, $ne: "" },
          $or: [{ role: "Admin" }, { "role.name": "Admin" }],
        })
        .project({ email: 1 })
        .toArray()
      bcc = Array.from(new Set(admins.map((x: any) => x.email))).filter(Boolean)
    }

    const now = new Date().toISOString()
    const doc = {
      title,
      message,
      audience,
      institutionName: audience === "institution" ? institutionName : undefined,
      target: audience === "institution" ? target : undefined,
      createdBy: { id: creator.id, name: creator.name, role: creator.role },
      createdAt: now,
      sent: false, // Will be set to true by cron job after sending push notifications
      emailAttempted: bcc.length,
      emailSent: 0,
      updatedAt: now,
    }
    const insertRes = await db.collection("notifications").insertOne(doc)
    const insertedId = insertRes.insertedId?.toString()

    // Send email (best-effort)
    let sent = 0
    try {
      if (bcc.length > 0) {
        const transporter = getTransport()

        const emailSubject =
          audience === "admins"
            ? `${BRAND_NAME} - Admin Notice: ${title}`
            : `${institutionName || BRAND_NAME} - ${doc.target ? `${doc.target.charAt(0).toUpperCase() + doc.target.slice(1)} ` : ""}Notification: ${title}`

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0; color: #1f2937;">${audience === "admins" ? BRAND_NAME : institutionName || BRAND_NAME}</h2>
              <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">
                ${audience === "admins" ? "Admin Notification" : `${doc.target ? doc.target.charAt(0).toUpperCase() + doc.target.slice(1) + " " : ""}Notification`}
              </p>
            </div>
            <div style="background-color: white; padding: 20px; border: 1px solid #e5e7eb;">
              <h3 style="color: #1f2937; margin-top: 0;">${title}</h3>
              <p style="color: #374151; line-height: 1.6;">${message.replace(/\n/g, "<br/>")}</p>
            </div>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                This is an automated notification from ${BRAND_NAME}
              </p>
            </div>
          </div>
        `

        await transporter.sendMail({
          from: `${institutionName || "Face Attendance"} <faceattendance@noreply.com>`,
          to: "undisclosed-recipients:;",
          bcc,
          subject: emailSubject,
          text: message,
          html: emailHtml,
        })
        sent = bcc.length
      }
    } catch (emailErr) {
      console.error("[notifications][POST] email error:", emailErr)
    }

    await db.collection("notifications").updateOne({ _id: insertRes.insertedId }, { $set: { emailSent: sent } })

    return NextResponse.json({ ok: true, id: insertedId, emailAttempted: bcc.length, emailSent: sent })
  } catch (err: any) {
    console.error("[notifications][POST] error:", err?.message || err)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const idFromQuery = searchParams.get("id") || undefined
    const body = await req.json()
    const {
      id = idFromQuery,
      title,
      message,
      audience,
      institutionName,
      target,
      actor,
    }: {
      id?: string
      title?: string
      message?: string
      audience?: Audience
      institutionName?: string
      target?: Target
      actor: { id: string; role: string; institutionName?: string }
    } = body || {}

    if (!id || !actor?.role || !actor?.id) {
      return NextResponse.json({ error: "Missing id or actor" }, { status: 400 })
    }

    const db = await getDb()
    const existing = await db.collection("notifications").findOne({ _id: new (require("mongodb").ObjectId)(id) })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Permissions:
    const isSuper = actor.role === "SuperAdmin"
    const isAdmin = actor.role === "Admin"
    if (!isSuper) {
      // Admin can edit only institution notices created by themselves (and within their institution)
      if (
        !(
          isAdmin &&
          existing.audience === "institution" &&
          existing.createdBy?.id === actor.id &&
          (!actor.institutionName || existing.institutionName === actor.institutionName)
        )
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    const update: any = { updatedAt: new Date().toISOString() }
    if (typeof title === "string") update.title = title
    if (typeof message === "string") update.message = message

    if (isSuper) {
      // SuperAdmin may also change audience/institution/target
      if (audience) update.audience = audience
      if (audience === "institution") {
        if (institutionName) update.institutionName = institutionName
        if (target) update.target = target
      } else {
        update.institutionName = undefined
        update.target = undefined
      }
    } else if (isAdmin) {
      // Admin can adjust target within institution
      if (typeof target === "string") update.target = target
    }

    await db.collection("notifications").updateOne({ _id: existing._id }, { $set: update })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("[notifications][PUT] error:", err?.message || err)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const idFromQuery = searchParams.get("id") || undefined
    const body = req.method === "DELETE" ? await req.json().catch(() => ({})) : {}
    const { id = idFromQuery, actor } = body as {
      id?: string
      actor?: { id: string; role: string; institutionName?: string }
    }

    if (!id || !actor?.role || !actor?.id) {
      return NextResponse.json({ error: "Missing id or actor" }, { status: 400 })
    }

    const db = await getDb()
    const existing = await db.collection("notifications").findOne({ _id: new (require("mongodb").ObjectId)(id) })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const isSuper = actor.role === "SuperAdmin"
    const isAdmin = actor.role === "Admin"
    if (!isSuper) {
      if (
        !(
          isAdmin &&
          existing.audience === "institution" &&
          existing.createdBy?.id === actor.id &&
          (!actor.institutionName || existing.institutionName === actor.institutionName)
        )
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    await db.collection("notifications").deleteOne({ _id: existing._id })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("[notifications][DELETE] error:", err?.message || err)
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 })
  }
}

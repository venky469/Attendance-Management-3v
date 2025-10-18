import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    const { to, from, subject, text } = await req.json()

    const host = process.env.SMTP_HOST
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (!host || !user || !pass) {
      return NextResponse.json({ error: "SMTP env vars missing" }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    const info = await transporter.sendMail({
      from: from || user,
      to,
      subject: subject || "Test Email Configuration",
      text: text || "This is a test email to confirm SMTP configuration.",
    })

    return NextResponse.json({ ok: true, messageId: info.messageId })
  } catch (e) {
    console.error("[email/test] error:", e)
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 })
  }
}

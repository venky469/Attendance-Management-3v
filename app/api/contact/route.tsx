import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, mobile, purpose, message } = body

    // Validate required fields
    if (!name || !email || !mobile || !purpose) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "venkythota469@gmail.com",
      subject: `Contact Support Request from ${name} - ${purpose}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px;">New Contact Support Request</h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #374151; margin-bottom: 10px;">Contact Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; background-color: #f9fafb; font-weight: bold; width: 30%;">Name:</td>
                <td style="padding: 8px; background-color: #ffffff;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background-color: #f9fafb; font-weight: bold;">Email:</td>
                <td style="padding: 8px; background-color: #ffffff;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background-color: #f9fafb; font-weight: bold;">Mobile:</td>
                <td style="padding: 8px; background-color: #ffffff;">${mobile}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background-color: #f9fafb; font-weight: bold;">Purpose:</td>
                <td style="padding: 8px; background-color: #ffffff;">${purpose}</td>
              </tr>
            </table>
          </div>

          ${
            message
              ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #374151; margin-bottom: 10px;">Message:</h3>
            <div style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #0d9488; border-radius: 4px;">
              ${message}
            </div>
          </div>
          `
              : ""
          }

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This email was sent from the Genamplify Attendance System contact form.</p>
            <p>Timestamp: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: "Contact request sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error sending contact email:", error)
    return NextResponse.json({ error: "Failed to send contact request. Please try again later." }, { status: 500 })
  }
}

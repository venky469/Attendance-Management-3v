
import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongo"

type AppSettings = {
  notifications?: {
    emailNotifications?: boolean
    lateAlerts?: boolean
    absenceAlerts?: boolean
    updateNotifications?: boolean
  }
  security?: {
    sessionTimeout?: number
    passwordPolicy?: "low" | "medium" | "high"
    twoFactor?: boolean
    autoLogout?: boolean
  }
  authentication?: {
    otpLoginEnabled?: boolean
  }
  dataManagement?: {
    backupFrequency?: "hourly" | "daily" | "weekly" | "monthly"
    retentionPeriod?: number
    autoExport?: boolean
  }
  email?: {
    smtpServer?: string
    smtpPort?: number
    smtpSecurity?: "none" | "tls" | "ssl"
    fromEmail?: string
  }
  maintenance?: {
    enabled?: boolean
    message?: string
  }
  attendance?: {
    locationVerificationEnabled?: boolean
    locationRadiusMeters?: number
  }
}

// doc keyed by _id = "global" (SuperAdmin) or future variants like "inst:XYZ"
type SettingsDoc = {
  _id: string
  scope: "global"
  data: AppSettings
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const scope = searchParams.get("scope") || "global"

    if (scope !== "global") {
      return NextResponse.json({ error: "Unsupported scope" }, { status: 400 })
    }

    const db = await getDb()
    const doc = (await db.collection<SettingsDoc>("app_settings").findOne({ _id: "global" })) || null
    return NextResponse.json({ data: doc?.data || {} })
  } catch (e) {
    console.error("[settings][GET] error:", e)
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as { scope?: "global"; data?: AppSettings }
    const scope = body.scope || "global"
    const data = body.data || {}

    if (scope !== "global") {
      return NextResponse.json({ error: "Unsupported scope" }, { status: 400 })
    }

    const db = await getDb()
    await db
      .collection<SettingsDoc>("app_settings")
      .updateOne({ _id: "global" }, { $set: { scope: "global", data } }, { upsert: true })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[settings][PUT] error:", e)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}

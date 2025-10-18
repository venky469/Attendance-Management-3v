import { NextResponse } from "next/server"

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export function withCors(json: any, init?: ResponseInit) {
  return new NextResponse(JSON.stringify(json), {
    status: init?.status ?? 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...(init?.headers || {}),
    },
  })
}

export function corsOptions() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

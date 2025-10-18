export function getBaseUrl() {
  // Prefer headers() in RSC, but we can't call headers() from a plain lib file.
  // Consumers should pass host/protocol when available; otherwise we derive from env.
  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) return `https://${vercelUrl}`

  const publicBase = process.env.NEXT_PUBLIC_BASE_URL
  if (publicBase) return publicBase.replace(/\/$/, "")

  // Fallback for local dev
  return "http://localhost:3000"
}

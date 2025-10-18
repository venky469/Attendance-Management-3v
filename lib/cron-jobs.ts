import cron from "node-cron"

export function startCronJobs() {
  console.log("[Cron] Starting attendance cron jobs...")

  // Auto-mark absent every 5 minutes during shift hours
  cron.schedule("*/5 * * * *", async () => {
    try {
      console.log("[Cron] Running auto-mark absent job...")

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/cron/auto-mark-absent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      )

      const result = await response.json()

      if (result.markedAbsent > 0) {
        console.log(`[Cron] Auto-marked ${result.markedAbsent} people as absent`)
      }
    } catch (error) {
      console.error("[Cron] Auto-mark absent job failed:", error)
    }
  })

  // Daily cleanup at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("[Cron] Running daily cleanup...")
    // Add any daily cleanup tasks here
  })

  console.log("[Cron] Cron jobs started successfully")
}

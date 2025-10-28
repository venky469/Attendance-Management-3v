"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { type LivenessChallenge, LivenessDetector } from "@/lib/liveness-detection"
import { AlertCircle, CheckCircle2, Eye, MoveHorizontal, Smile } from "lucide-react"

interface LivenessCheckPromptProps {
  challenge: LivenessChallenge
  onComplete: () => void
  timeLimit?: number // seconds
}

export function LivenessCheckPrompt({ challenge, onComplete, timeLimit = 10 }: LivenessCheckPromptProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [status, setStatus] = useState<"waiting" | "success" | "failed">("waiting")

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus("failed")
          setTimeout(onComplete, 1000)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onComplete])

  const getChallengeIcon = () => {
    switch (challenge) {
      case "blink":
        return <Eye className="h-12 w-12" />
      case "turn_left":
      case "turn_right":
        return <MoveHorizontal className="h-12 w-12" />
      case "smile":
        return <Smile className="h-12 w-12" />
      case "nod":
        return <MoveHorizontal className="h-12 w-12 rotate-90" />
      default:
        return <AlertCircle className="h-12 w-12" />
    }
  }

  return (
    <Card className="border-2 border-primary shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          {status === "waiting" && (
            <>
              <div className="rounded-full bg-primary/10 p-4 text-primary">{getChallengeIcon()}</div>
              <div>
                <h3 className="text-xl font-semibold">Liveness Check</h3>
                <p className="mt-2 text-lg text-muted-foreground">{LivenessDetector.getChallengeText(challenge)}</p>
              </div>
              <div className="text-3xl font-bold text-primary">{timeLeft}s</div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
                />
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="rounded-full bg-green-100 p-4 text-green-600">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-600">Verified!</h3>
                <p className="mt-2 text-muted-foreground">Liveness check passed</p>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="rounded-full bg-red-100 p-4 text-red-600">
                <AlertCircle className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-red-600">Failed</h3>
                <p className="mt-2 text-muted-foreground">Please try again</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default LivenessCheckPrompt

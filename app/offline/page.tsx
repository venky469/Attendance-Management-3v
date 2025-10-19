import { WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">You're Offline</h1>
          <p className="text-gray-600 max-w-md">
            It looks like you've lost your internet connection. Some features may not be available until you're back
            online.
          </p>
        </div>
        <div className="space-y-3">
          <Button asChild className="w-full max-w-xs">
            <Link href="/">Try Again</Link>
          </Button>
          <p className="text-sm text-gray-500">Check your internet connection and try again</p>
        </div>
      </div>
    </div>
  )
}

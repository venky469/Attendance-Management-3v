import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ModernLoader } from '@/components/modern-loader'

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ModernLoader message="Loading Settings" />
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <ModernLoader message="Loading Stats" />
            </CardHeader>
            <CardContent>
              <ModernLoader message="Loading Data" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <ModernLoader message="Loading Settings" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <ModernLoader message="Loading Option" />
                  </div>
                  <ModernLoader message="Loading Action" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <ModernLoader message="Loading Quick Actions" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <ModernLoader key={i} message="Loading Action" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

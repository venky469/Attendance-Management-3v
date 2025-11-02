"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const BarChartCard = dynamic(() => import("./bar-chart-card"), {
  loading: () => (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-800">Loading chart...</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </CardContent>
    </Card>
  ),
  ssr: false,
})

export default BarChartCard

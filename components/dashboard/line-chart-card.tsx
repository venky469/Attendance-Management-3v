"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TrendPoint = { date: string; present: number; absent?: number }

export default function LineChartCard({
  title,
  data,
  height = 288,
}: {
  title: string
  data: TrendPoint[]
  height?: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">{title}</CardTitle>
      </CardHeader>
      <CardContent style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="present" stroke="#0d9488" name="Present" strokeWidth={2} dot={false} />
            {data.some((d) => typeof d.absent === "number") && (
              <Line type="monotone" dataKey="absent" stroke="#f59e0b" name="Absent" strokeWidth={2} dot={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DataPoint = { name: string; present: number; absent?: number }

export default function BarChartCard({
  title,
  data,
  height = 288,
}: {
  title: string
  data: DataPoint[]
  height?: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">{title}</CardTitle>
      </CardHeader>
      <CardContent style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="present" fill="#0d9488" name="Present" radius={[4, 4, 0, 0]} />
            {data.some((d) => typeof d.absent === "number") && (
              <Bar dataKey="absent" fill="#f59e0b" name="Absent" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

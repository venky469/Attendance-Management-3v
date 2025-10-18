"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type Props = {
  data: Array<{ name: string; present: number; absent?: number }>
  title?: string
  description?: string
}

export default function SummaryChart({
  data,
  title = "Attendance Summary",
  description = "Today by department",
}: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-pretty">{title}</CardTitle>
        <CardDescription className="text-pretty">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            present: { label: "Present", color: "hsl(var(--chart-1))" },
            absent: { label: "Absent", color: "hsl(var(--chart-2))" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="present" fill="var(--color-present)" name="Present" radius={[4, 4, 0, 0]} />
              {data.some((d) => typeof d.absent === "number") && (
                <Bar dataKey="absent" fill="var(--color-absent)" name="Absent" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

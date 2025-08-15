"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Standard Data Solutions", value: 83.3, bookings: 5, color: "hsl(var(--chart-1))" },
  { name: "Test Data Solutions", value: 16.7, bookings: 1, color: "hsl(var(--chart-5))" },
]

const chartConfig = {
  standard: {
    label: "Standard Data Solutions",
    color: "hsl(var(--chart-1))",
  },
  test: {
    label: "Test Data Solutions",
    color: "hsl(var(--chart-5))",
  },
}

export function CategoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Booking distribution by category</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <ChartContainer config={chartConfig} className="h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.value}% • {item.bookings} bookings
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { stats } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

// const data = [
//   { month: "Jan", revenue: 20000, bookings: 2 },
//   { month: "Feb", revenue: 5000, bookings: 1 },
//   { month: "Mar", revenue: 0, bookings: 0 },
//   { month: "Apr", revenue: 25000, bookings: 1 },
//   { month: "May", revenue: 0, bookings: 0 },
//   { month: "Jun", revenue: 60000, bookings: 2 },
//   { month: "Jul", revenue: 3333, bookings: 2 },
//   { month: "Aug", revenue: 0, bookings: 0 },
//   { month: "Sep", revenue: 0, bookings: 0 },
//   { month: "Oct", revenue: 0, bookings: 0 },
//   { month: "Nov", revenue: 0, bookings: 0 },
//   { month: "Dec", revenue: 0, bookings: 0 },
// ]

const chartConfig = {
  revenue: {
    label: "Revenue ($)",
    color: "hsl(var(--chart-2))",
  },
  bookings: {
    label: "Bookings",
    color: "hsl(var(--chart-2))",
  },
}

export function StatsChart() {

const {data,isError,isLoading}=useQuery({
  queryKey:['statsData'],
  queryFn:stats,
})

const datas= data?.data || ''
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <p className="text-sm text-muted-foreground">Monthly Revenue and Booking Trends</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datas}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "var(--color-chart-3)" }}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                 stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "var(--color-chart-1)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

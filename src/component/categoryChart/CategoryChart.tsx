"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { categoryStats } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";

// ==== Types ====
interface Category {
  category: string;
  bookings: number;
}

interface CategoryStatsResponse {
  data: Category[];
  userBookingPercentage: number;
}

interface PieChartItem {
  name: string;
  value: number;
  bookings: number;
  color: string;
}

// ==== Config ====
const chartConfig = {
  standard: {
    label: "Standard Data Solutions",
    color: "hsl(var(--chart-1))",
  },
  test: {
    label: "Test Data Solutions",
    color: "hsl(var(--chart-5))",
  },
};

// Colors for chart slices
const PIE_COLORS = [
  "#3B82F6", // blue
  "#EF4444", // red
  "#10B981", // green
  "#F59E0B", // amber
  "#8B5CF6", // violet
  "#EC4899", // pink
];

export function CategoryChart() {
  const { data, isLoading } = useQuery<CategoryStatsResponse>({
    queryKey: ["categoryData"],
    queryFn: categoryStats,
  });

  const rawData: Category[] = data?.data ?? [];

  // Process API data into percentages + assign colors
  const pieChartData: PieChartItem[] =
    rawData.length > 0
      ? rawData.map((item, index) => {
          const totalBookings = rawData.reduce(
            (sum, cat) => sum + cat.bookings,
            0
          );
          const percentage =
            totalBookings > 0
              ? parseFloat(((item.bookings / totalBookings) * 100).toFixed(1))
              : 0;

          return {
            name: item.category,
            value: percentage,
            bookings: item.bookings,
            color: PIE_COLORS[index % PIE_COLORS.length],
          };
        })
      : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          Booking distribution by category
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {/* Chart */}
          <ChartContainer config={chartConfig} className="h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}

                  {/* Center Label (from API userBookingPercentage) */}
                  <Label
                    value={`${data?.userBookingPercentage ?? 0}%`}
                    position="center"
                    className="text-xl font-bold fill-foreground"
                  />
                </Pie>

                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Legend */}
          <div className="space-y-4">
            {pieChartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
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
  );
}

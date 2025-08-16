'use client`'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calendar, Users, UserCheck } from "lucide-react";
import { StatsChart } from "../statsChart/StatsChart";
import { CategoryChart } from "../categoryChart/CategoryChart";
import { adminStats } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function DashboardContent() {
  

  const { data, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: adminStats,
  });
  const datas = data?.data || "";

  if(isLoading){
    return (
      <div>
        <h2 className=" p-5 ">Data is Loading</h2>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to your admin panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${datas.totalRevenue}</div>
            <p className="text-xs text-green-600">↗ Total revenue generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{datas.totalBookings}</div>
            <p className="text-xs text-blue-600">↗ Total bookings made</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{datas.totalUsers}</div>
            <p className="text-xs text-purple-600">↗ Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Users with Bookings
            </CardTitle>
            <UserCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-orange-600">↗ Active customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsChart />
        <CategoryChart />
      </div>
    </div>
  );
}

"use client"

import { useState } from "react"

import { DashboardContent } from "../dashboardContent/dashboard-content"
import { ServicesPage } from "../services/Services"
import { PaymentsPage } from "../payments/Payments"
import { SettingsPage } from "../settingspage/SettingsPage"
import { StrategyPage } from "../Strategy/StrategyPage"
import { SolutionsPage } from "../solutions/SolutionsPage"
import { DataSetsPage } from "../dataSetsPage/DataSetsPage"
import { BlogsPage } from "../blogs/Blogs"
import StaffingNeedPage from "../StaffingNeed/StaffingNeedPage"
import { Sidebar } from "../sidebar/sidebar"
import TopProfile from "./topprofile/TopProfile"

export type ActivePage =
  | "dashboard"
  | "services"
  | "payments"
  | "strategy"
  | "blogs"
  | "solutions"
  | "data-sets"
  | "staffing"
  | "settings"

export function Dashboard() {
  const [activePage, setActivePage] = useState<ActivePage>("dashboard")

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />
      case "services":
        return <ServicesPage />
      case "payments":
        return <PaymentsPage />
      case "settings":
        return <SettingsPage />
      case "strategy":
        return <StrategyPage />
      case "solutions":
        return <SolutionsPage />
      case "data-sets":
        return <DataSetsPage />
      case "blogs":
        return <BlogsPage />
      case "staffing":
        return <StaffingNeedPage />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="flex h-screen w-full justify-between">
      <div className="z-50">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />

      </div>

      <div className="w-full">
        <div className="bg-black text-white fixed top-0 right-0 w-full  z-40 flex justify-end">
          <TopProfile />
        </div>
        <div>

        </div>
      <main className="overflow-auto mt-24 pt-4 bg-white w-[calc(100vw-200px)] ms-auto h-full  ">{renderContent()}</main>
      </div>
    </div>
  )
}

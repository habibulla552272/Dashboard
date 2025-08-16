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
    <div className="flex h-screen w-full">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="flex-1 overflow-auto bg-white">{renderContent()}</main>
    </div>
  )
}

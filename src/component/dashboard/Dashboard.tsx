"use client"

import { useState } from "react"
import { DashboardContent } from "../dashboardContent/dashboard-content"
import { ServicesPage } from "../services/Services"
import { PaymentsPage } from "../payments/Payments"
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
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  )
}

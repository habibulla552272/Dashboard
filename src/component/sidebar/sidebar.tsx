"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings, CreditCard, FileText, Target, MapPin, Database, Users, LogOut } from "lucide-react"
import { ActivePage } from "../dashboard/Dashboard"
import { LogoutModal } from "../logout/Logout"


interface SidebarProps {
  activePage: ActivePage
  onPageChange: (page: ActivePage) => void
}

const menuItems = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "services" as const, label: "Services", icon: Settings },
  { id: "strategy" as const, label: "Strategy", icon: Target },
  { id: "blogs" as const, label: "Blogs", icon: FileText },
  { id: "solutions" as const, label: "Solutions", icon: MapPin },
  { id: "payments" as const, label: "Payments", icon: CreditCard },
  { id: "data-sets" as const, label: "Data Sets", icon: Database },
  { id: "staffing" as const, label: "Staffing Need", icon: Users },
  { id: "settings" as const, label: "Settings", icon: Settings },
]

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear tokens, redirect to login)
    console.log("[v0] Logging out user...")
    // For now, just log the action - you can integrate with NextAuth or your auth system
    // Example: signOut() from next-auth/react
    // Example: router.push('/login')
  }

  return (
    <>
      <div className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">Q</span>
            </div>
            <span className="font-semibold text-sidebar-foreground">QUANTIVO</span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activePage === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    activePage === item.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() => onPageChange(item.id)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <LogoutModal open={showLogoutModal} onOpenChange={setShowLogoutModal} onConfirm={handleLogout} />
    </>
  )
}

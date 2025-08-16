"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

interface StrategyEntry {
  _id: string
  user: {
    name: string
    email: string
  }
  companyName: string
  dataStrategyFocusArea: string
  dataStrategyNotes: string
  createdAt: string
}

export function StrategyPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock data matching the screenshot
  const mockStrategies: StrategyEntry[] = [
    {
      _id: "1",
      user: {
        name: "Md.Habibulla",
        email: "mdhabibulla.bdcalling@gmail.com",
      },
      companyName: "hakad",
      dataStrategyFocusArea: "business data solutions",
      dataStrategyNotes: "fkljdfjkl;asdf",
      createdAt: "2025-08-16T12:18:00Z",
    },
    {
      _id: "2",
      user: {
        name: "Zihadul Islam",
        email: "zihadulislam.bdcalling@gmail.com",
      },
      companyName: "bdcalling",
      dataStrategyFocusArea: "business data solutions",
      dataStrategyNotes: "Data Strategy Notes & Requests Write.....",
      createdAt: "2025-06-10T03:29:00Z",
    },
  ]

  const [strategies] = useState<StrategyEntry[]>(mockStrategies)

  const totalPages = Math.ceil(strategies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentStrategies = strategies.slice(startIndex, endIndex)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleView = (strategy: StrategyEntry) => {
    console.log("[v0] Viewing strategy:", strategy)
    // TODO: Implement view strategy functionality
  }

  const handleEdit = (strategy: StrategyEntry) => {
    console.log("[v0] Editing strategy:", strategy)
    // TODO: Implement edit strategy functionality
  }

  const handleDelete = (strategyId: string) => {
    console.log("[v0] Deleting strategy:", strategyId)
    // TODO: Implement delete strategy functionality
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Strategy</h1>
        <p className="text-sm text-gray-500">Dashboard &gt; Strategy Management</p>
      </div>

      {/* Strategy Table */}
      <div className="bg-white rounded-lg border">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 p-4 border-b bg-gray-50 font-medium text-gray-700">
          <div>User</div>
          <div>Company Name</div>
          <div>Data Strategy Focus Area</div>
          <div>Data Strategy Notes & Requests</div>
          <div>Time</div>
          <div>Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y">
          {currentStrategies.map((strategy) => (
            <div key={strategy._id} className="grid grid-cols-6 gap-4 p-4 items-center">
              {/* User Column */}
              <div>
                <p className="font-medium text-gray-900">{strategy.user.name}</p>
                <p className="text-sm text-gray-500">{strategy.user.email}</p>
              </div>

              {/* Company Name Column */}
              <div>
                <p className="text-gray-900">{strategy.companyName}</p>
              </div>

              {/* Data Strategy Focus Area Column */}
              <div>
                <p className="text-gray-900">{strategy.dataStrategyFocusArea}</p>
              </div>

              {/* Data Strategy Notes & Requests Column */}
              <div>
                <p className="text-gray-900 truncate max-w-xs" title={strategy.dataStrategyNotes}>
                  {strategy.dataStrategyNotes}
                </p>
              </div>

              {/* Time Column */}
              <div>
                <p className="text-sm text-gray-600">{formatDate(strategy.createdAt)}</p>
              </div>

              {/* Actions Column */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(strategy)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(strategy)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(strategy._id)}
                  className="h-8 w-8 p-0 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, strategies.length)} of {strategies.length} results
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

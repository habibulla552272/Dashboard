"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { toast } from "sonner"


interface Solution {
  _id: string
  title: string
  description: string
  createdAt: string
}

export function SolutionsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null)
  const itemsPerPage = 10


  // Mock data matching the screenshot
  const mockSolutions: Solution[] = [
    {
      _id: "1",
      title: "Make you credentials protected",
      description: "Do not share your credentials to anyone. Never",
      createdAt: "2025-06-10T15:42:00Z",
    },
  ]

  const [solutions, setSolutions] = useState<Solution[]>(mockSolutions)

  const totalPages = Math.ceil(solutions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSolutions = solutions.slice(startIndex, endIndex)

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

  const handleAddSolution = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newSolution: Solution = {
      _id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      createdAt: new Date().toISOString(),
    }

    setSolutions([...solutions, newSolution])
    setIsAddOpen(false)
    toast({ title: "Solution added successfully" })
    console.log("[v0] Added new solution:", newSolution)
  }

  const handleEditSolution = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingSolution) return

    const formData = new FormData(e.currentTarget)
    const updatedSolution: Solution = {
      ...editingSolution,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    }

    setSolutions(solutions.map((s) => (s._id === editingSolution._id ? updatedSolution : s)))
    setIsEditOpen(false)
    setEditingSolution(null)
    toast({ title: "Solution updated successfully" })
    console.log("[v0] Updated solution:", updatedSolution)
  }

  const handleEdit = (solution: Solution) => {
    setEditingSolution(solution)
    setIsEditOpen(true)
  }

  const handleDelete = (solutionId: string) => {
    setSolutions(solutions.filter((s) => s._id !== solutionId))
    toast({ title: "Solution deleted successfully" })
    console.log("[v0] Deleted solution:", solutionId)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Solutions</h1>
          <p className="text-sm text-gray-500">Dashboard &gt; Solutions</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Solution
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Solution</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSolution} className="space-y-4">
              <div>
                <Label htmlFor="add-title">Solution Title</Label>
                <Input id="add-title" name="title" required placeholder="Enter solution title" />
              </div>
              <div>
                <Label htmlFor="add-description">Description</Label>
                <Textarea
                  id="add-description"
                  name="description"
                  required
                  placeholder="Enter solution description"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600">
                Add Solution
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Solutions Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Solutions</h2>
      </div>

      {/* Solutions Table */}
      <div className="bg-white rounded-lg border">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 p-4 border-b bg-gray-50 font-medium text-gray-700">
          <div>Solution</div>
          <div>Added</div>
          <div>Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y">
          {currentSolutions.map((solution) => (
            <div key={solution._id} className="grid grid-cols-3 gap-4 p-4 items-center">
              {/* Solution Column */}
              <div>
                <p className="font-medium text-gray-900 mb-1">{solution.title}</p>
                <p className="text-sm text-gray-600">{solution.description}</p>
              </div>

              {/* Added Column */}
              <div>
                <p className="text-sm text-gray-600">{formatDate(solution.createdAt)}</p>
              </div>

              {/* Actions Column */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(solution)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(solution._id)}
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
            Showing {startIndex + 1} to {Math.min(endIndex, solutions.length)} of {solutions.length} results
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

      {/* Edit Solution Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Solution</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSolution} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Solution Title</Label>
              <Input
                id="edit-title"
                name="title"
                required
                defaultValue={editingSolution?.title}
                placeholder="Enter solution title"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                required
                defaultValue={editingSolution?.description}
                placeholder="Enter solution description"
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600">
              Update Solution
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

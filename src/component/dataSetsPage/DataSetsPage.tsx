"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { toast } from "sonner"


interface DataSet {
  _id: string
  dataSetName: string
  companyName: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  createdAt: string
}

export function DataSetsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingDataSet, setEditingDataSet] = useState<DataSet | null>(null)
  const itemsPerPage = 10


  // Mock data matching the screenshot
  const mockDataSets: DataSet[] = [
    {
      _id: "1",
      dataSetName: "ABC",
      companyName: "Elite Stack",
      user: {
        name: "Zihadul Islam",
        email: "zihadulislam.bdcalling@gmail.com",
        avatar: "/diverse-user-avatars.png",
      },
      createdAt: "2025-07-30T17:25:00Z",
    },
    {
      _id: "2",
      dataSetName: "data debo nah",
      companyName: "Elite Stack",
      user: {
        name: "Zihadul Islam",
        email: "zihadulislam.bdcalling@gmail.com",
        avatar: "/diverse-user-avatars.png",
      },
      createdAt: "2025-07-30T17:25:00Z",
    },
    {
      _id: "3",
      dataSetName: "why",
      companyName: "fams",
      user: {
        name: "Fahim ahmed",
        email: "fahim37.bdcalling@gmail.com",
        avatar: "/diverse-user-avatar-set-2.png",
      },
      createdAt: "2025-07-31T22:54:00Z",
    },
    {
      _id: "4",
      dataSetName: "New Data",
      companyName: "fams",
      user: {
        name: "Fahim ahmed",
        email: "fahim37.bdcalling@gmail.com",
        avatar: "/diverse-user-avatar-set-2.png",
      },
      createdAt: "2025-07-31T14:11:00Z",
    },
  ]

  const [dataSets, setDataSets] = useState<DataSet[]>(mockDataSets)

  const totalPages = Math.ceil(dataSets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDataSets = dataSets.slice(startIndex, endIndex)

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

  const handleAddDataSet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newDataSet: DataSet = {
      _id: Date.now().toString(),
      dataSetName: formData.get("dataSetName") as string,
      companyName: formData.get("companyName") as string,
      user: {
        name: formData.get("userName") as string,
        email: formData.get("userEmail") as string,
        avatar: "/abstract-user-avatar.png",
      },
      createdAt: new Date().toISOString(),
    }

    setDataSets([...dataSets, newDataSet])
    setIsAddOpen(false)
    toast({ title: "Data set added successfully" })
    console.log("[v0] Added new data set:", newDataSet)
  }

  const handleEditDataSet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingDataSet) return

    const formData = new FormData(e.currentTarget)
    const updatedDataSet: DataSet = {
      ...editingDataSet,
      dataSetName: formData.get("dataSetName") as string,
      companyName: formData.get("companyName") as string,
      user: {
        ...editingDataSet.user,
        name: formData.get("userName") as string,
        email: formData.get("userEmail") as string,
      },
    }

    setDataSets(dataSets.map((ds) => (ds._id === editingDataSet._id ? updatedDataSet : ds)))
    setIsEditOpen(false)
    setEditingDataSet(null)
    toast({ title: "Data set updated successfully" })
    console.log("[v0] Updated data set:", updatedDataSet)
  }

  const handleView = (dataSet: DataSet) => {
    console.log("[v0] Viewing data set:", dataSet)
    // TODO: Implement view data set functionality
  }

  const handleEdit = (dataSet: DataSet) => {
    setEditingDataSet(dataSet)
    setIsEditOpen(true)
  }

  const handleDelete = (dataSetId: string) => {
    setDataSets(dataSets.filter((ds) => ds._id !== dataSetId))
    toast({ title: "Data set deleted successfully" })
    console.log("[v0] Deleted data set:", dataSetId)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Data Set</h1>
          <p className="text-sm text-gray-500">Dashboard &gt; Data Set</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Data Set
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Data Set</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDataSet} className="space-y-4">
              <div>
                <Label htmlFor="add-dataSetName">Data Set Name</Label>
                <Input id="add-dataSetName" name="dataSetName" required placeholder="Enter data set name" />
              </div>
              <div>
                <Label htmlFor="add-companyName">Company Name</Label>
                <Input id="add-companyName" name="companyName" required placeholder="Enter company name" />
              </div>
              <div>
                <Label htmlFor="add-userName">User Name</Label>
                <Input id="add-userName" name="userName" required placeholder="Enter user name" />
              </div>
              <div>
                <Label htmlFor="add-userEmail">User Email</Label>
                <Input id="add-userEmail" name="userEmail" type="email" required placeholder="Enter user email" />
              </div>
              <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600">
                Add Data Set
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Sets Table */}
      <div className="bg-white rounded-lg border">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 p-4 border-b bg-gray-50 font-medium text-gray-700">
          <div>Data Set Name</div>
          <div>Company Name</div>
          <div>User Info</div>
          <div>Added</div>
          <div>Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y">
          {currentDataSets.map((dataSet) => (
            <div key={dataSet._id} className="grid grid-cols-5 gap-4 p-4 items-center">
              {/* Data Set Name Column */}
              <div>
                <p className="font-medium text-gray-900">{dataSet.dataSetName}</p>
              </div>

              {/* Company Name Column */}
              <div>
                <p className="text-gray-900">{dataSet.companyName}</p>
              </div>

              {/* User Info Column */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={dataSet.user.avatar || "/placeholder.svg"} alt={dataSet.user.name} />
                  <AvatarFallback className="bg-orange-500 text-white text-xs">
                    {dataSet.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{dataSet.user.name}</p>
                  <p className="text-xs text-gray-500">{dataSet.user.email}</p>
                </div>
              </div>

              {/* Added Column */}
              <div>
                <p className="text-sm text-gray-600">{formatDate(dataSet.createdAt)}</p>
              </div>

              {/* Actions Column */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(dataSet)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(dataSet)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(dataSet._id)}
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
            Showing {startIndex + 1} to {Math.min(endIndex, dataSets.length)} of {dataSets.length} results
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

      {/* Edit Data Set Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Set</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditDataSet} className="space-y-4">
            <div>
              <Label htmlFor="edit-dataSetName">Data Set Name</Label>
              <Input
                id="edit-dataSetName"
                name="dataSetName"
                required
                defaultValue={editingDataSet?.dataSetName}
                placeholder="Enter data set name"
              />
            </div>
            <div>
              <Label htmlFor="edit-companyName">Company Name</Label>
              <Input
                id="edit-companyName"
                name="companyName"
                required
                defaultValue={editingDataSet?.companyName}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="edit-userName">User Name</Label>
              <Input
                id="edit-userName"
                name="userName"
                required
                defaultValue={editingDataSet?.user.name}
                placeholder="Enter user name"
              />
            </div>
            <div>
              <Label htmlFor="edit-userEmail">User Email</Label>
              <Input
                id="edit-userEmail"
                name="userEmail"
                type="email"
                required
                defaultValue={editingDataSet?.user.email}
                placeholder="Enter user email"
              />
            </div>
            <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600">
              Update Data Set
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

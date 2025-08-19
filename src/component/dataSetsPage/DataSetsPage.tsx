"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Edit, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { dataSetCreate, dataSetDelete, dataSetUpdate, fetchDataSets } from "@/lib/api"

interface DataSet {
  _id: string
  dataSetName: string
  companyName: string
  userId: {
    firstName: string
    lastName: string
    email: string
    avatar?: string
    companyName?: string
  }
  createdAt: string
}

export function DataSetsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [editingDataSet, setEditingDataSet] = useState<DataSet | null>(null)
  const [viewingDataSet, setViewingDataSet] = useState<DataSet | null>(null)

  const itemsPerPage = 10
  const queryClient = useQueryClient()

  // Fetch data
  const { data } = useQuery({
    queryKey: ["dataSets"],
    queryFn: fetchDataSets,
  })
  const setsData = data?.data || []

  // Mutations
  const dataSetMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => dataSetUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataSets"] })
      toast.success("Data set updated successfully")
      setIsEditOpen(false)
      setEditingDataSet(null)
    },
    onError: () => toast.error("Failed to update data set"),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => dataSetCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataSets"] })
      toast.success("Data set created successfully")
      setIsAddOpen(false)
    },
    onError: () => toast.error("Failed to create data set"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dataSetDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataSets"] })
      toast.success("Data set deleted successfully")
    },
    onError: () => toast.error("Failed to delete data set"),
  })

  const totalPages = Math.ceil(setsData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDataSets = setsData.slice(startIndex, endIndex)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

  const handleView = (dataSet: DataSet) => {
    setViewingDataSet(dataSet)
    setIsViewOpen(true)
  }

  const handleEdit = (dataSet: DataSet) => {
    setEditingDataSet(dataSet)
    setIsEditOpen(true)
  }

  const handleDelete = (dataSetId: string) => {
    deleteMutation.mutate(dataSetId)
  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingDataSet) return

    const formData = new FormData(e.currentTarget)
    const updatedData = {
      dataSetName: formData.get("dataSetName") as string,
      companyName: formData.get("companyName") as string,
      userId: {
        firstName: formData.get("firstName") as string,
        email: formData.get("email") as string,
      },
    }

    dataSetMutation.mutate({ id: editingDataSet._id, data: updatedData })
  }

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newData = {
      dataSetName: formData.get("dataSetName") as string,
      companyName: formData.get("companyName") as string,
      userId: {
        firstName: formData.get("firstName") as string,
        email: formData.get("email") as string,
      },
    }
    createMutation.mutate(newData)
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
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <Label>Data Set Name</Label>
                <Input name="dataSetName" required placeholder="Enter data set name" />
              </div>
              <div>
                <Label>Company Name</Label>
                <Input name="companyName" required placeholder="Enter company name" />
              </div>
              <div>
                <Label>User Name</Label>
                <Input name="firstName" required placeholder="Enter user name" />
              </div>
              <div>
                <Label>User Email</Label>
                <Input name="email" type="email" required placeholder="Enter user email" />
              </div>
              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Add Data Set"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Sets Table */}
      <div className="bg-white rounded-lg border">
        <div className="grid grid-cols-5 gap-4 p-4 border-b bg-gray-50 font-medium text-gray-700">
          <div>Data Set Name</div>
          <div>Company Name</div>
          <div>User Info</div>
          <div>Added</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          {currentDataSets.map((dataSet: any) => (
            <div key={dataSet._id} className="grid grid-cols-5 gap-4 p-4 items-center">
              <div>
                <p className="font-medium text-gray-900">{dataSet?.dataSetName}</p>
              </div>
              <div>
                <p className="text-gray-900">{dataSet?.companyName}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={dataSet?.userId?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{dataSet?.userId?.firstName?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{`${dataSet?.userId?.firstName || ""} ${dataSet?.userId?.lastName || ""}`}</p>
                  <p className="text-xs text-gray-500">{dataSet?.userId?.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">{formatDate(dataSet.createdAt)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleView(dataSet)}>
                  <Eye className="h-4 w-4 text-gray-600" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(dataSet)}>
                  <Edit className="h-4 w-4 text-gray-600" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(dataSet._id)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Data Set Details</DialogTitle>
          </DialogHeader>
          {viewingDataSet && (
            <div className="space-y-4">
              <p><strong>Data Set Name:</strong> {viewingDataSet.dataSetName}</p>
              <p><strong>Company:</strong> {viewingDataSet.companyName}</p>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={viewingDataSet.userId?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{viewingDataSet.userId?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{`${viewingDataSet.userId?.firstName} ${viewingDataSet.userId?.lastName}`}</p>
                  <p className="text-sm text-gray-500">{viewingDataSet.userId?.email}</p>
                </div>
              </div>
              <p><strong>Added:</strong> {formatDate(viewingDataSet.createdAt)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Set</DialogTitle>
          </DialogHeader>
          {editingDataSet && (
            <form className="space-y-4" onSubmit={handleEditSubmit}>
              <div>
                <Label>Data Set Name</Label>
                <Input name="dataSetName" defaultValue={editingDataSet.dataSetName} />
              </div>
              <div>
                <Label>Company Name</Label>
                <Input name="companyName" defaultValue={editingDataSet?.companyName} />
              </div>
              <div>
                <Label>User First Name</Label>
                <Input name="firstName" defaultValue={editingDataSet.userId?.firstName} />
              </div>
              <div>
                <Label>User Email</Label>
                <Input name="email" type="email" defaultValue={editingDataSet.userId?.email} />
              </div>
              <Button type="submit" disabled={dataSetMutation.isPending} className="w-full bg-cyan-500 hover:bg-cyan-600">
                {dataSetMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

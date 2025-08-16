"use client"

import type React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Trash2, Upload, Plus, ArrowLeft } from "lucide-react"
import { serviceDelete, servicesApi, ServicesData, type Service } from "@/lib/api"
import { toast } from "sonner"
import Image from "next/image"
import { error } from "console"


const API_BASE_URL = "https://mohab0104-backend-w28i.onrender.com/api/v1"

export function ServicesPage() {
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [viewingService, setViewingService] = useState<Service | null>(null)

  const queryClient = useQueryClient()

  // const {
  //   data: servicesData,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["services"],
  //   queryFn: servicesApi.getAll,
  // })

  // console.log('services data' , servicesData);
  
  // const services = Array.isArray(servicesData)
  //   ? servicesData
  //   : Array.isArray(servicesData?.data)
  //     ? servicesData.data
  //     : Array.isArray(servicesData?.services)
  //       ? servicesData.services
  //       : []

  // const createMutation = useMutation({
  //   mutationFn: servicesApi.create,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["services"] })
  //     toast({ title: "Service created successfully" })
  //     const form = document.getElementById("add-service-form") as HTMLFormElement
  //     form?.reset()
  //     setSelectedImage(null)
  //     setShowAddForm(false)
  //   },
  //   onError: (error) => {
  //     toast({ title: "Failed to create service", variant: "destructive" })
  //   },
  // })

  // const updateMutation = useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: FormData }) => {
  //     console.log("[v0] PUT function called with ID:", id)
  //     return servicesApi.update(id, data)
  //   },
  //   onSuccess: () => {
  //     console.log("[v0] PUT function completed successfully")
  //     queryClient.invalidateQueries({ queryKey: ["services"] })
  //     setEditingService(null)
  //     toast({ title: "Service updated successfully" })
  //   },
  //   onError: (error) => {
  //     console.log("[v0] PUT function failed:", error)
  //     toast({ title: "Failed to update service", variant: "destructive" })
  //   },
  // })

  // const deleteMutation = useMutation({
  //   mutationFn: servicesApi.delete,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["services"] })
  //     toast({ title: "Service deleted successfully" })
  //   },
  //   onError: () => {
  //     toast({ title: "Failed to delete service", variant: "destructive" })
  //   },
  // })

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   const formData = new FormData(e.currentTarget)

  //   const serviceData = new FormData()
  //   serviceData.append("serviceTitle", formData.get("serviceTitle") as string)
  //   serviceData.append("serviceDescription", formData.get("serviceDescription") as string)
  //   serviceData.append("price", formData.get("price") as string)

  //   const imageFile = formData.get("image") as File
  //   if (imageFile && imageFile.size > 0) {
  //     serviceData.append("image", imageFile)
  //   }

  //   if (editingService) {
  //     console.log("[v0] Update button clicked - calling PUT function")
  //     console.log("[v0] Service ID:", editingService._id)
  //     console.log("[v0] Update data:", {
  //       serviceTitle: formData.get("serviceTitle"),
  //       serviceDescription: formData.get("serviceDescription"),
  //       price: formData.get("price"),
  //       hasImage: imageFile && imageFile.size > 0,
  //     })
  //     updateMutation.mutate({ id: editingService._id, data: serviceData })
  //   } else {
  //     createMutation.mutate(serviceData)
  //   }
  // }

  // const handleAddServiceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   const formData = new FormData(e.currentTarget)

  //   const serviceData = new FormData()
  //   serviceData.append("serviceTitle", formData.get("serviceTitle") as string)
  //   serviceData.append("serviceDescription", formData.get("serviceDescription") as string)
  //   serviceData.append("price", formData.get("price") as string)

  //   if (selectedImage) {
  //     serviceData.append("image", selectedImage)
  //   }

  //   createMutation.mutate(serviceData)
  // }

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (file) {
  //     setSelectedImage(file)
  //   }
  // }

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString("en-US", {
  //     month: "2-digit",
  //     day: "2-digit",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   })
  // }

  // const getImageUrl = (imagePath: string | undefined) => {
  //   if (!imagePath) return "/placeholder.svg"
  //   if (imagePath.startsWith("http")) return imagePath
  //   return `${API_BASE_URL.replace("/api/v1", "")}/${imagePath.replace(/^\//, "")}`
  // }

  // if (isLoading) {
  //   return <div className="p-6">Loading services...</div>
  // }

  // if (error) {
  //   return (
  //     <div className="p-6">
  //       <div className="bg-red-50 border border-red-200 rounded-lg p-4">
  //         <h3 className="text-red-800 font-semibold">Error loading services</h3>
  //         <p className="text-red-600 text-sm mt-1">Please check your connection and try again.</p>
  //       </div>
  //     </div>
  //   )
  // }

  // if (viewingService) {
  //   return (
  //     <div className="p-6 space-y-6">
  //       <div className="flex items-center gap-4">
  //         <Button variant="ghost" onClick={() => setViewingService(null)} className="flex items-center gap-2">
  //           <ArrowLeft className="w-4 h-4" />
  //           Back to Services
  //         </Button>
  //         <div>
  //           <h1 className="text-3xl font-bold text-gray-900">Service Details</h1>
  //           <p className="text-gray-600 mt-1">Dashboard &gt; Services &gt; {viewingService.serviceTitle}</p>
  //         </div>
  //       </div>

  //       <div className="bg-white rounded-lg border p-8">
  //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  //           <div>
  //             <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
  //               {viewingService.imagelink ? (
  //                 <img
  //                   src={getImageUrl(viewingService.imagelink) || "/placeholder.svg"}
  //                   alt={viewingService.serviceTitle}
  //                   className="w-full h-full object-cover rounded-lg"
  //                   onError={(e) => {
  //                     e.currentTarget.src = "/placeholder.svg"
  //                   }}
  //                 />
  //               ) : (
  //                 <div className="w-16 h-16 bg-white/20 rounded"></div>
  //               )}
  //             </div>
  //           </div>

  //           <div className="space-y-6">
  //             <div>
  //               <h2 className="text-2xl font-bold text-gray-900 mb-2">{viewingService.serviceTitle}</h2>
  //               <p className="text-3xl font-bold text-blue-600">${viewingService.price.toLocaleString()}</p>
  //             </div>

  //             <div>
  //               <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
  //               <p className="text-gray-600 leading-relaxed">{viewingService.serviceDescription}</p>
  //             </div>

  //             <div className="grid grid-cols-2 gap-4">
  //               <div>
  //                 <h4 className="font-semibold text-gray-900 mb-1">Category</h4>
  //                 <p className="text-gray-600">{viewingService.category || "N/A"}</p>
  //               </div>
  //               <div>
  //                 <h4 className="font-semibold text-gray-900 mb-1">Status</h4>
  //                 <span
  //                   className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
  //                     viewingService.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  //                   }`}
  //                 >
  //                   {viewingService.status || "Active"}
  //                 </span>
  //               </div>
  //             </div>

  //             <div>
  //               <h4 className="font-semibold text-gray-900 mb-1">Created</h4>
  //               <p className="text-gray-600">{formatDate(viewingService.createdAt)}</p>
  //             </div>

  //             <div className="flex gap-3 pt-4">
  //               <Button
  //                 onClick={() => {
  //                   setEditingService(viewingService)
  //                   setViewingService(null)
  //                 }}
  //                 className="flex items-center gap-2"
  //               >
  //                 <Edit className="w-4 h-4" />
  //                 Edit Service
  //               </Button>
  //               <Button
  //                 variant="destructive"
  //                 onClick={() => {
  //                   deleteMutation.mutate(viewingService._id)
  //                   setViewingService(null)
  //                 }}
  //                 className="flex items-center gap-2"
  //               >
  //                 <Trash2 className="w-4 h-4" />
  //                 Delete Service
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  const {data:servideData,isLoading}=useQuery({
    queryKey:['servicesData'],
    queryFn:ServicesData,
  })

  const serviceDatas = servideData?.data || [];
  console.log(serviceDatas);
  
  // delete services 

  const deleteMutation = useMutation({
    mutationFn: serviceDelete,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['servicesData']})
      toast.success('service deleted successfully')
    },
    onError:(error:any)=>{
      toast.error(error.message || 'failed to delte service')
    },
  })

  const handelDelete =(id:string)=>{
    deleteMutation.mutate(id)
    
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Dashboard &gt; Services</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          {showAddForm ? "Cancel" : "Add Service"}
        </Button>
      </div>

      <div className={`grid gap-6 ${showAddForm ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}>
        {showAddForm && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">Service Details</h2>

              <form id="add-service-form" onSubmit={handleAddServiceSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="serviceTitle">Service Name</Label>
                  <Input id="serviceTitle" name="serviceTitle" placeholder="Type Service name here..." required />
                </div>

                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" placeholder="Enter price..." required />
                </div>

                <div>
                  <Label htmlFor="serviceDescription">Description</Label>
                  <Textarea
                    id="serviceDescription"
                    name="serviceDescription"
                    placeholder="Type Service description here..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </form>
            </div>

            <div className="bg-white rounded-lg border p-6 mt-6">
              <h2 className="text-xl font-semibold mb-6">Photo</h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Drag and drop image here, or click add image</p>

                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />

                <Button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  Add Image
                </Button>

                {selectedImage && <p className="text-sm text-green-600 mt-2">Selected: {selectedImage.name}</p>}
              </div>
            </div>
          </div>
        )}

        <div className={showAddForm ? "lg:col-span-2" : "col-span-1"}>
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Service</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceDatas && serviceDatas.length > 0 ? (
                  serviceDatas.map((service) => (
                    <TableRow key={service._id}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Image
                                src={`${service.imageLink}`}
                                alt={service.serviceTitle}
                                className="w-full h-full object-cover rounded-lg"
                              width={100}
                              height={100}
                              />
                          </div>
                          <div className="flex-1 min-w-0 max-w-60">
                            <h3 className="font-semibold text-gray-900 mb-1">{service.serviceTitle}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{service.serviceDescription}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">${service.price.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                             {service.updatedAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setViewingService(service)}
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                          </Button>
                          <Dialog
                            open={editingService?._id === service._id}
                            onOpenChange={(open) => !open && setEditingService(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setEditingService(service)}
                              >
                                <Edit className="w-4 h-4 text-gray-500" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Service</DialogTitle>
                              </DialogHeader>
                             
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={()=> handelDelete(service._id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No services found. Add your first service to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* <div className="px-6 py-4 border-t">
              <p className="text-sm text-gray-600">
                Showing 1 to {services.length} of {services.length} results
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

// function ServiceForm({
//   onSubmit,
//   defaultValues,
// }: {
//   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
//   defaultValues?: Service
// }) {
//   return (
//     <form onSubmit={onSubmit} className="space-y-4">
//       <div>
//         <Label htmlFor="serviceTitle">Service Name</Label>
//         <Input id="serviceTitle" name="serviceTitle" defaultValue={defaultValues?.serviceTitle} />
//       </div>
//       <div>
//         <Label htmlFor="serviceDescription">Description</Label>
//         <Textarea id="serviceDescription" name="serviceDescription" defaultValue={defaultValues?.serviceDescription} />
//       </div>
//       <div>
//         <Label htmlFor="price">Price</Label>
//         <Input id="price" name="price" type="number" defaultValue={defaultValues?.price} />
//       </div>
//       <div>
//         <Label htmlFor="image">Image</Label>
//         <Input id="image" name="image" type="file" accept="image/*" />
//         {defaultValues?.imagelink && (
//           <p className="text-sm text-gray-500 mt-1">Current image: {defaultValues.imagelink}</p>
//         )}
//       </div>
//       <Button type="submit" className="w-full">
//         {defaultValues ? "Update" : "Create"} Service
//       </Button>
//     </form>
//   )
// }

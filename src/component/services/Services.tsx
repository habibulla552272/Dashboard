"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import {
  serviceDelete,
  serviceEdit,
  ServicesData,
  ServicesSingleData,
  type Service,
} from "@/lib/api";
import { toast } from "sonner";
import Image from "next/image";
import Add from "./add/Add";

export function ServicesPage() {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // state for view details dialog
  const [viewId, setViewId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const queryClient = useQueryClient();

  // fetch all services
  const { data: servideData, isLoading } = useQuery({
    queryKey: ["servicesData"],
    queryFn: ServicesData,
  });
  const serviceDatas = servideData?.data || [];

  // fetch single service only when viewId exists
  const { data: viewDa, isFetching: viewLoading } = useQuery({
    queryKey: ["singleservice", viewId],
    queryFn: () => ServicesSingleData(viewId as string),
    enabled: !!viewId, // only run when viewId is set
  });
  const viewData = viewDa?.data || [];

  // delete service
  const deleteMutation = useMutation({
    mutationFn: serviceDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicesData"] });
      toast.success("Service deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete service");
    },
  });

  // update service
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
      image,
    }: {
      id: string;
      data: any;
      image?: File;
    }) => await serviceEdit(id, data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicesData"] });
      setEditingService(null);
      toast.success("Service updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update service");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingService) return;

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      serviceTitle: formData.get("serviceTitle"),
      serviceDescription: formData.get("serviceDescription"),
      price: Number(formData.get("price")),
    };

    updateMutation.mutate({
      id: editingService._id,
      data: updatedData,
      image: selectedImage || undefined,
    });
  };

  const handleView = (id: string) => {
    setViewId(id);
    setViewOpen(true);
  };

  return (
    <section>
      <div className={`p-6 space-y-6 ${showAddForm ? 'hidden' :'block'}`}>
        <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Dashboard &gt; Services</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showAddForm ? "Cancel" : "Add Service"}
        </Button>
      </div>

        {/* TABLE */}
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
              {serviceDatas.length > 0 ? (
                serviceDatas.map((service) => (
                  <TableRow key={service._id}>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {service.imageLink ? (
                            <Image
                              src={service.imageLink}
                              alt={service.serviceTitle || "Service image"}
                              className="object-cover"
                              width={64}
                              height={64}
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">
                              No Image
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {service.serviceTitle}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 max-w-40">
                            {service.serviceDescription}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${service.price}</TableCell>
                    <TableCell>{service.updatedAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* View button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(service._id)}
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </Button>

                        {/* Edit button */}
                        <Dialog
                          open={editingService?._id === service._id}
                          onOpenChange={(open) =>
                            !open && setEditingService(null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingService(service)}
                            >
                              <Edit className="w-4 h-4 text-gray-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Service</DialogTitle>
                            </DialogHeader>

                            {/* EDIT FORM */}
                            <form
                              onSubmit={handleUpdateSubmit}
                              className="space-y-4"
                            >
                              <div>
                                <Label htmlFor="serviceTitle">Service Name</Label>
                                <Input
                                  id="serviceTitle"
                                  name="serviceTitle"
                                  defaultValue={editingService?.serviceTitle}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="price">Price</Label>
                                <Input
                                  id="price"
                                  name="price"
                                  type="number"
                                  defaultValue={editingService?.price}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="serviceDescription">
                                  Description
                                </Label>
                                <Textarea
                                  id="serviceDescription"
                                  name="serviceDescription"
                                  defaultValue={
                                    editingService?.serviceDescription
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="image">Image</Label>
                                <Input
                                  id="image"
                                  name="image"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    setSelectedImage(e.target.files?.[0] || null)
                                  }
                                />
                              </div>

                              <Button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600"
                                disabled={updateMutation.isPending}
                              >
                                {updateMutation.isPending
                                  ? "Updating..."
                                  : "Update Service"}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>

                        {/* Delete button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(service._id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No services found. Add your first service to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* VIEW DETAILS DIALOG */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Service Details</DialogTitle>
            </DialogHeader>

            {viewLoading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : viewData ? (
              <div className="space-y-4">
                <div className="flex gap-4">
                  {viewData.imageLink ? (
                    <Image
                      src={viewData.imageLink}
                      alt={viewData.serviceTitle || "Service image"}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] flex items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                      No Image
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {viewData.serviceTitle}
                    </h3>
                    <p className="text-gray-600">{viewData.serviceDescription}</p>
                    <p className="text-blue-600 font-bold mt-2">
                      ${viewData.price}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Added on: {new Date(viewData.updatedAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Failed to load service details
              </p>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className={`${showAddForm ? 'block' : 'hidden'}`}>
        <Add showAddForm={showAddForm} setShowAddForm={setShowAddForm} />
      </div>

    </section>
  );
}

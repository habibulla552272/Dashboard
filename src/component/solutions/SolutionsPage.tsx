"use client";

import type React from "react";

import { useState } from "react";
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
import { Edit, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { delteSolution, solutionData, updateSolution } from "@/lib/api";
import { error } from "console";

interface Solution {
  _id: string;
  solutionName: string;
  solutionDescription: string;
  updatedAt: string;
  createdAt: string;
}

export function SolutionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();
  // Mock data matching the screenshot
  const mockSolutions: Solution[] = [
    {
      _id: "1",
      title: "Make you credentials protected",
      description: "Do not share your credentials to anyone. Never",
      createdAt: "2025-06-10T15:42:00Z",
    },
  ];

  // solution data fetch use tanstack

  const {
    data: solution,
    isLoading,
    isEnabled,
  } = useQuery({
    queryKey: ["solutiondata"],
    queryFn: solutionData,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateSolution(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['solutiondata']})
      toast.success("Blog update succesfully");
      setIsEditOpen(false);
      setEditingSolution(null);
     
      setEditingSolution(null);
    },
    onError:(error:any)=>{
      toast.error(error.message||'Failed to update solution');
    }
  });

  const deleteMutaion= useMutation({
    mutationFn: delteSolution,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['solutiondata']})
      toast.success("Solution deleted successfully")
    },
    onError:(error:any)=>{
      toast.error(error.message|| 'Failed to delete solution')
    }
  })

  const solutiondata = solution?.data || [];

  const [solutions, setSolutions] = useState<Solution[]>(mockSolutions);
  const totalPages = Math.ceil(solutions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleAddSolution = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSolution: Solution = {
      _id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      createdAt: new Date().toISOString(),
    };

    setSolutions([...solutions, newSolution]);
    setIsAddOpen(false);
    toast({ title: "Solution added successfully" });
    console.log("[v0] Added new solution:", newSolution);
  };

  const handleEditSolution = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSolution) return;

    const formData = new FormData(e.currentTarget);
    const data: Solution = {
      ...editingSolution,
      solutionName: formData.get("solutionName") as string,
      solutionDescription: formData.get("solutionDiscription") as string,
    };

    updateMutation.mutate({ id: editingSolution._id, data });
  };

  const handleEdit = (solution: Solution) => {
    setEditingSolution(solution);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
   deleteMutaion.mutate(id)
   
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Solutions
          </h1>
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
                <Input
                  id="add-title"
                  name="title"
                  required
                  placeholder="Enter solution title"
                />
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
              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600"
              >
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
          {solutiondata.map((solution: Solution) => (
            <div
              key={solution._id}
              className="grid grid-cols-3 gap-4 p-4 items-center"
            >
              {/* Solution Column */}
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  {solution.solutionName}
                </p>
                <p className="text-sm text-gray-600">
                  {solution.solutionDescription}
                </p>
              </div>

              {/* Added Column */}
              <div>
                <p className="text-sm text-gray-600">
                  {formatDate(solution.createdAt)}
                </p>
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
            Showing {startIndex + 1} to {Math.min(endIndex, solutions.length)}{" "}
            of {solutions.length} results
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
              <Label htmlFor="edit-title">Solution Name</Label>
              <Input
                id="edit-title"
                name="solutionName"
                required
                defaultValue={editingSolution?.solutionName}
                placeholder="Enter solution title"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Solution Description</Label>
              <Textarea
                id="edit-description"
                name="solutionDiscription"
                required
                defaultValue={editingSolution?.solutionDescription}
                placeholder="Enter solution description"
                rows={3}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600"
            >
              Update Solution
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

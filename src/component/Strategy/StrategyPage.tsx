"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStrategies, deleteStrategy } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [response, setResponse] = useState("");
  const queryClient = useQueryClient();

  const { data: strategiesData, isLoading } = useQuery({
    queryKey: ["strategies", currentPage],
    queryFn: () => fetchStrategies(currentPage, 10),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStrategy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategies"] });
      toast.success("Strategy deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete strategy");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSendResponse = () => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    // Here you would typically send the response via API
    toast.success("Response sent successfully");
    setResponse("");
    setSelectedStrategy(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const strategies = strategiesData?.data || [];
  const meta = strategiesData


  return (
   
     <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Strategy</h1>
        <p className="text-gray-600 mt-1">Dashboard &gt; Strategy Management</p>
      </div>

      <Card>
        <CardHeader>
          <div className="grid grid-cols-12 gap-4 font-medium text-gray-600">
            <div className="col-span-2">User</div>
            <div className="col-span-2">Company Name</div>
            <div className="col-span-2">Data Strategy Focus Area</div>
            <div className="col-span-3">Data Strategy Notes & Requests</div>
            <div className="col-span-2">Time</div>
            <div className="col-span-1">Actions</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-t border-gray-200 mb-4"></div>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {strategies.map((strategy: any) => (
            <div
              key={strategy._id}
              className="grid grid-cols-12 gap-4 items-center py-4 border-b last:border-b-0"
            >
              <div className="col-span-2">
                <div>
                  <p className="font-medium text-gray-900">{strategy.name}</p>
                  <p className="text-sm text-gray-600">{strategy.email}</p>
                </div>
              </div>
              <div className="col-span-2 text-sm text-gray-900">
                {strategy.companyName}
              </div>
              <div className="col-span-2 text-sm text-gray-900">
                {strategy.dataStrategy}
              </div>
              <div className="col-span-3 text-sm text-gray-600">
                <p className="line-clamp-2">{strategy.strategyDescription}</p>
              </div>
              <div className="col-span-2 text-sm text-gray-600">
                {new Date(strategy.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedStrategy(strategy)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Data Strategy Notes & Requests</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {selectedStrategy?.strategyDescription}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="response">Answer</Label>
                        <Textarea
                          id="response"
                          placeholder="Write......"
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <Button
                        onClick={handleSendResponse}
                        className="w-full bg-blue-500 hover:bg-blue-600"
                      >
                        Send
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the strategy.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(strategy._id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {meta.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {[...Array(meta.totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(Math.min(meta.totalPages, currentPage + 1))
                }
                className={
                  currentPage === meta.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <div className="text-sm text-gray-600">
        Showing {(currentPage - 1) * 10 + 1} to{" "}
        {Math.min(currentPage * 10, meta.totalItems)} of {meta.totalItems} results
      </div>
    </div>
  )
}

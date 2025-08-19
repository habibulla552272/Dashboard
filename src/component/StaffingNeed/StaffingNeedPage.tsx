"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { StaffingNeed, staffingNeedApi, staffNeed } from "@/lib/api";
import { Eye  } from "lucide-react";

export default function StaffingNeedPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewingNeed, setViewingNeed] = useState<StaffingNeed | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["staffingNeeds"],
    queryFn: staffNeed,
  });

  const staffingNeeds: StaffingNeed[] = data?.data || [];

  const createMutation = useMutation({
    mutationFn: (newNeed: any) => staffingNeedApi.create(newNeed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffingNeeds"] });
      setShowAddForm(false);
      toast.success("Staffing need added successfully!");
    },
  });

  const handleView = (need: StaffingNeed) => {
    setViewingNeed(need);
    setDialogOpen(true);
  };



  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Staffing Needs</h1>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>User Company</TableHead>
              <TableHead>Data-Driven Staffing Need</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {staffingNeeds.length > 0 ? (
              staffingNeeds.map((need) => (
                <TableRow key={need._id}>
                  <TableCell className="flex items-center gap-2">
                    <div>
                      <p className="text-xl font-bold py-2">{`${need.firstName} ${need.lastName}`}</p>
                      <p>{need.businessEmail}</p>
                    </div>
                  </TableCell>

                  <TableCell>{need.companyName}</TableCell>

                  <TableCell>
                    <p>{need.staffDescription}</p>
                  </TableCell>

                  <TableCell>
                    {new Date(need.createdAt).toLocaleString()}
                  </TableCell>

                  <TableCell className="text-right flex justify-end gap-2">
                    <Button className="bg-cyan-400 text-white py-4 px-8 "
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(need)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No staffing needs found. Add your first one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Staffing Need Details</DialogTitle>
          </DialogHeader>

          {viewingNeed && (
            <div className="space-y-2">
              <p>
                <strong>User:</strong>{" "}
                {`${viewingNeed.firstName} ${viewingNeed.lastName}`}
              </p>
              <p>
                <strong>Email:</strong> {viewingNeed.email}
              </p>
              <p>
                <strong>Company:</strong> {viewingNeed.companyName}
              </p>
              <p>
                <strong>Focus Area:</strong> {viewingNeed.dataStrategyFocusArea}
              </p>
              <p>
                <strong>Notes:</strong> {viewingNeed.dataStrategyNotes}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(viewingNeed.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

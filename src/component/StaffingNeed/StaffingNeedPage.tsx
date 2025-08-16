"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
 // ✅ FIXED: import API
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StaffingNeed, staffingNeedApi } from "@/lib/api";

export default function StaffingNeedPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    dataStrategyFocusArea: "",
    dataStrategyNotes: "",
  });

  // Fetch staffing needs
  const { data: staffingNeeds, isLoading, error } = useQuery<StaffingNeed[]>({
    queryKey: ["staffingNeeds"],
    queryFn: staffingNeedApi.getAll,
  });

  // Create staffing need
  const createMutation = useMutation({
    mutationFn: staffingNeedApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffingNeeds"] });
      setShowAddForm(false);
      setFormData({
        companyName: "",
        dataStrategyFocusArea: "",
        dataStrategyNotes: "",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Staffing Needs</h1>

      <Button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Cancel" : "Add Staffing Need"}
      </Button>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow p-4 rounded space-y-4"
        >
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="focusArea">Data Strategy Focus Area</Label>
            <Input
              id="focusArea"
              value={formData.dataStrategyFocusArea}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dataStrategyFocusArea: e.target.value,
                })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Data Strategy Notes</Label>
            <Input
              id="notes"
              value={formData.dataStrategyNotes}
              onChange={(e) =>
                setFormData({ ...formData, dataStrategyNotes: e.target.value })
              }
              required
            />
          </div>

          <Button type="submit" disabled={createMutation.isLoading}>
            {createMutation.isLoading ? "Saving..." : "Save"}
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {staffingNeeds?.map((need) => (
          <div
            key={need._id}
            className="p-4 bg-gray-100 rounded shadow-sm"
          >
            <h2 className="font-bold">{need.companyName}</h2>
            <p>Focus Area: {need.dataStrategyFocusArea}</p>
            <p>Notes: {need.dataStrategyNotes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchPayment } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PaymentsPage() {
  const { data: payment = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayment,
  });

  const payments = payment?.data || [];

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(payments.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedPayments = payments.slice(startIndex, startIndex + rowsPerPage);

  if (isLoading) {
    return <div className="p-6">Loading payments...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Payments</h1>

      <div className="overflow-x-auto bg-white rounded-lg border shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Service</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Payment Method</TableHead>
              <TableHead className="font-semibold">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((p) => (
                <TableRow key={p._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {typeof p.userId === "string"
                          ? p.userId
                          : `${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`}
                      </p>
                      <p className="text-sm text-gray-500">{p.userId?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {typeof p.serviceId === "string"
                      ? p.serviceId
                      : p.serviceId?.serviceTitle || p.serviceId?._id}
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    ${p.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {p.paymentMethod || "Stripe"}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-gray-500"
                >
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {payments.length > rowsPerPage && (
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

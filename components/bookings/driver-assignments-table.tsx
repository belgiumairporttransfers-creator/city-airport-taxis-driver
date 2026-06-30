"use client";

import Link from "next/link";
import { Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Assignment } from "@/lib/schemas/assignment";
import { formatDate, formatTime } from "@/lib/utils";

const statusClasses: Record<string, string> = {
  pending: "bg-warning/10 text-warning border border-transparent",
  accepted: "bg-success/10 text-success border border-transparent",
  rejected: "bg-destructive/10 text-destructive border border-transparent",
  expired: "bg-default-100 text-default-600 border border-transparent",
  cancelled: "bg-default-100 text-default-600 border border-transparent",
  completed: "bg-info/10 text-info border border-transparent",
};

type DriverAssignmentsTableProps = {
  assignments: Assignment[];
  loading?: boolean;
};

const DriverAssignmentsTable = ({ assignments, loading = false }: DriverAssignmentsTableProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assignment ID</TableHead>
            <TableHead>Booking ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-default-500">
                Loading assignments...
              </TableCell>
            </TableRow>
          ) : assignments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-default-500">
                No pending assignments.
              </TableCell>
            </TableRow>
          ) : (
            assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-semibold text-default-900">
                  {assignment.assignmentNumber}
                </TableCell>
                <TableCell className="text-default-600">{assignment.bookingNumber}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      statusClasses[assignment.status] ?? "bg-default-100 text-default-600"
                    }`}
                  >
                    {assignment.status}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap text-default-600">
                  {formatDate(assignment.assignedAt)} {formatTime(assignment.assignedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" size="icon" variant="ghost" aria-label="Open actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/assignments/${assignment.id}`}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DriverAssignmentsTable;

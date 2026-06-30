"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import LayoutLoader from "@/components/layout-loader";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssignments } from "@/hooks/queries/use-assignments";

const statusClasses: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  accepted: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
  expired: "bg-default-100 text-default-600",
  cancelled: "bg-default-100 text-default-600",
  completed: "bg-info/10 text-info",
};

const AssignmentsPageView = () => {
  const { data, isLoading, isError } = useAssignments({ scope: "awaiting", limit: 20 });

  if (isLoading) {
    return <LayoutLoader />;
  }

  if (isError) {
    return <p className="text-destructive">Unable to load assignments.</p>;
  }

  const items = data?.items ?? [];

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Home className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/operations/bookings?tab=assignments">Bookings</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>Assignments</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pending assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-default-500">No pending assignments.</p>
          ) : (
            <div className="space-y-3">
              {items.map((assignment) => (
                <Link
                  key={assignment.id}
                  href={`/assignments/${assignment.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-default-50"
                >
                  <div>
                    <p className="font-medium text-default-900">{assignment.assignmentNumber}</p>
                    <p className="text-sm text-default-600">{assignment.bookingNumber}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClasses[assignment.status] ?? "bg-default-100 text-default-600"}`}
                  >
                    {assignment.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AssignmentsPageView;

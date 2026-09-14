"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Home } from "lucide-react";
import LayoutLoader from "@/components/layout-loader";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  useAcceptAssignment,
  useAssignment,
  useRejectAssignment,
} from "@/hooks/queries/use-assignments";

const AssignmentDetailPageView = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isError } = useAssignment(params.id);
  const acceptAssignment = useAcceptAssignment(params.id);
  const rejectAssignment = useRejectAssignment(params.id);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (isLoading) {
    return <LayoutLoader />;
  }

  if (isError || !data) {
    return <p className="text-destructive">Assignment not found.</p>;
  }

  const canRespond = data.status === "pending";
  const isSubmitting = rejectAssignment.isPending || acceptAssignment.isPending;

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Home className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/operations/bookings">Bookings</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/operations/bookings?tab=assignments">Assignments</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>{data.assignmentNumber}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{data.assignmentNumber}</CardTitle>
              <p className="mt-1 text-sm text-default-500">{data.bookingNumber}</p>
            </div>
            {canRespond ? (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm((current) => !current)}
                  disabled={isSubmitting}
                >
                  Reject
                </Button>
                <Button
                  onClick={async () => {
                    await acceptAssignment.mutateAsync();
                    router.push(`/trips/${data.bookingId}`);
                  }}
                  disabled={isSubmitting}
                >
                  Accept
                </Button>
              </div>
            ) : null}
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs text-default-500">Customer</p>
              <p className="font-medium text-default-900">
                {data.customer.firstName} {data.customer.lastName}
              </p>
              <p className="text-sm text-default-600">{data.customer.phone}</p>
            </div>
            <div>
              <p className="text-xs text-default-500">Pickup</p>
              <p className="font-medium text-default-900">
                {data.route.pickupDate} {data.route.pickupTime}
              </p>
              <p className="text-sm text-default-600">{data.route.pickupAddress}</p>
            </div>
            <div>
              <p className="text-xs text-default-500">Dropoff</p>
              <p className="text-sm text-default-600">{data.route.dropoffAddress}</p>
            </div>
            <div>
              <p className="text-xs text-default-500">Your payout</p>
              <p className="font-medium text-default-900">
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "EUR",
                }).format(data.pricing.driverEarning)}
              </p>
            </div>
          </CardContent>
        </Card>

        {showRejectForm && canRespond ? (
          <Card>
            <CardHeader>
              <CardTitle>Reject assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                placeholder="Reason for rejection"
                rows={4}
              />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowRejectForm(false)}>
                  Cancel
                </Button>
                <Button
                  color="destructive"
                  disabled={!rejectReason.trim() || isSubmitting}
                  onClick={async () => {
                    await rejectAssignment.mutateAsync(rejectReason.trim());
                    router.push("/operations/bookings?tab=assignments");
                  }}
                >
                  Confirm rejection
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {data.status === "accepted" ? (
          <Button asChild>
            <Link href={`/trips/${data.bookingId}`}>Open trip</Link>
          </Button>
        ) : null}
      </div>
    </>
  );
};

export default AssignmentDetailPageView;

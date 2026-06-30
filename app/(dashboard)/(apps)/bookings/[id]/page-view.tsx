"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, Home } from "lucide-react";
import LayoutLoader from "@/components/layout-loader";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAcceptDriverBooking, useDriverBooking } from "@/hooks/queries/use-driver-bookings";
import { formatPrice } from "@/lib/utils";

const EUR_SYMBOL = "€";

const DriverBookingDetailPageView = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isError, error } = useDriverBooking(params.id);
  const acceptBooking = useAcceptDriverBooking(params.id);

  if (isLoading) {
    return <LayoutLoader />;
  }

  if (isError || !data) {
    const message =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "Booking not found or no longer available.";

    return (
      <div className="mt-6 space-y-4">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-start gap-3 p-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="space-y-3">
              <p className="font-medium text-destructive">{message}</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/operations/bookings">Back to My Bookings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canAccept = data.canAccept && data.status === "confirmed" && !data.unavailableMessage;
  const isSubmitting = acceptBooking.isPending;
  const isOwnAcceptedBooking = data.status === "accepted";

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Home className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/operations/bookings">My Bookings</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>{data.bookingNumber}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="mt-6 space-y-6">
        {data.unavailableMessage ? (
          <Card className="border-warning/40 bg-warning/10">
            <CardContent className="flex items-start gap-3 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
              <div>
                <p className="font-medium text-default-900">{data.unavailableMessage}</p>
                <p className="mt-1 text-sm text-default-600">
                  Another driver accepted this trip first. You can no longer accept it.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{data.bookingNumber}</CardTitle>
              <p className="mt-1 text-sm capitalize text-default-500">{data.status}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {canAccept ? (
                <Button
                  onClick={async () => {
                    try {
                      const result = await acceptBooking.mutateAsync();
                      if (result?.assignment?.bookingId) {
                        router.push(`/trips/${result.assignment.bookingId}`);
                      }
                    } catch {
                      // Toast is shown by the mutation hook.
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Accept Booking
                </Button>
              ) : null}
              {isOwnAcceptedBooking ? (
                <>
                  <Button asChild variant="outline">
                    <Link href={`/trips/${data.id}`}>Manage Trip</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/trips/${data.id}`}>Mark Complete</Link>
                  </Button>
                </>
              ) : null}
              {data.status === "complete" ? (
                <Button asChild variant="outline">
                  <Link href="/operations/completed">View Completed</Link>
                </Button>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs text-default-500">Customer</p>
              <p className="font-medium text-default-900">
                {data.customer.firstName} {data.customer.lastName}
              </p>
              <p className="text-sm text-default-600">{data.customer.phone}</p>
              <p className="text-sm text-default-600">{data.customer.email}</p>
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
              <p className="text-xs text-default-500">Distance</p>
              <p className="font-medium text-default-900">{data.route.distance} km</p>
            </div>
            <div>
              <p className="text-xs text-default-500">Vehicle</p>
              <p className="font-medium text-default-900">{data.vehicle.categoryName}</p>
              <p className="text-sm text-default-600">
                {data.vehicle.passengers} passengers, {data.vehicle.luggage} luggage
              </p>
            </div>
            <div>
              <p className="text-xs text-default-500">Your earning</p>
              <p className="font-medium text-default-900">
                {formatPrice(data.pricing.driverEarning, EUR_SYMBOL)}
              </p>
            </div>
            {data.flight.required && data.flight.flightNumber ? (
              <div>
                <p className="text-xs text-default-500">Flight</p>
                <p className="font-medium text-default-900">{data.flight.flightNumber}</p>
                {data.flight.terminal ? (
                  <p className="text-sm text-default-600">Terminal {data.flight.terminal}</p>
                ) : null}
              </div>
            ) : null}
            {data.notes ? (
              <div className="md:col-span-2">
                <p className="text-xs text-default-500">Notes</p>
                <p className="text-sm text-default-600">{data.notes}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DriverBookingDetailPageView;

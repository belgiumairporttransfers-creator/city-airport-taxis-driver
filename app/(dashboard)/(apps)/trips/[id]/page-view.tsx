"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import LayoutLoader from "@/components/layout-loader";
import TripActionBar from "@/components/trips/trip-action-bar";
import TripStatusStepper from "@/components/trips/trip-status-stepper";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrip } from "@/hooks/queries/use-trips";
import {
  formatTripDateTime,
  getTripStepIndex,
  tripStatusLabels,
} from "@/lib/trips/trip-utils";

const TripDetailPageView = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useTrip(params.id);

  if (isLoading) {
    return <LayoutLoader />;
  }

  if (isError || !data) {
    return <p className="text-destructive">Trip not found.</p>;
  }

  const activeStep = getTripStepIndex(data.booking.status);

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Home className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/operations/bookings">Operations</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/trips">Active Trips</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>{data.booking.bookingNumber}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{data.booking.bookingNumber}</CardTitle>
              <motion.p
                key={data.booking.status}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-1 text-sm text-default-500"
              >
                {tripStatusLabels[data.booking.status] ?? data.booking.status}
              </motion.p>
            </div>
            <TripActionBar bookingId={data.booking.id} status={data.booking.status} />
          </CardHeader>
          <CardContent>
            <TripStatusStepper
              activeStep={activeStep}
              status={data.booking.status}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-default-600">
              <p className="font-medium text-default-900">
                {data.customer.firstName} {data.customer.lastName}
              </p>
              <p>{data.customer.phone}</p>
              <p>{data.customer.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Route</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-default-600">
              <p>
                Pickup: {data.route.pickupDate} {data.route.pickupTime}
              </p>
              <p>{data.route.pickupAddress}</p>
              <p>Dropoff: {data.route.dropoffAddress}</p>
              {data.flight.flightNumber ? (
                <p>
                  Flight {data.flight.flightNumber}
                  {data.flight.terminal ? ` · Terminal ${data.flight.terminal}` : ""}
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-default-600">
              <p>{data.vehicle.categoryName}</p>
              <p>
                {data.vehicle.passengers} passengers · {data.vehicle.luggage} luggage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.timeline.length === 0 ? (
                <p className="text-sm text-default-500">No events yet.</p>
              ) : (
                data.timeline.map((entry) => (
                  <div
                    key={`${entry.event}-${entry.at}`}
                    className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <p className="text-sm font-medium text-default-900">{entry.event}</p>
                    <p className="text-xs text-default-500">{formatTripDateTime(entry.at)}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {data.notes ? (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-default-600">{data.notes}</p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </>
  );
};

export default TripDetailPageView;

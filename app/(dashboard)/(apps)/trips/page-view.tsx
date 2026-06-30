"use client";

import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import LayoutLoader from "@/components/layout-loader";
import DriverTripsTable from "@/components/bookings/driver-trips-table";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTrips } from "@/hooks/queries/use-trips";
import { sortTripsByPickup } from "@/lib/trips/trip-utils";

const TripsPageView = () => {
  const [search, setSearch] = React.useState("");
  const { data, isLoading, isError, isFetching } = useTrips();

  if (isLoading) {
    return <LayoutLoader />;
  }

  if (isError || !data) {
    return <p className="text-destructive">Unable to load trips.</p>;
  }

  const activeTrips = sortTripsByPickup(data.active);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredTrips = normalizedSearch
    ? activeTrips.filter((trip) => {
        const haystack = [
          trip.bookingNumber,
          trip.customer.firstName,
          trip.customer.lastName,
          trip.route.pickupAddress,
          trip.route.dropoffAddress,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedSearch);
      })
    : activeTrips;

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem>
          <Home className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="/operations/bookings">Operations</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>Active Trips</BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mt-6 overflow-hidden">
        <CardHeader className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-default-900">Active Trips</CardTitle>
            <p className="mt-0.5 text-xs text-default-500">
              Accepted trips that are not completed yet. Open a trip to update status.
            </p>
          </div>
          <p className="text-sm text-default-500">
            {activeTrips.length} trip{activeTrips.length === 1 ? "" : "s"} in progress
          </p>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          <Input
            placeholder="Search by booking #, customer, or address"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm"
          />

          <DriverTripsTable trips={filteredTrips} loading={isFetching} />
        </CardContent>
      </Card>
    </>
  );
};

export default TripsPageView;

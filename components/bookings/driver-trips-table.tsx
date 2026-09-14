"use client";

import Link from "next/link";
import { Eye, MoreHorizontal, CheckCircle2 } from "lucide-react";
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
import type { TripSummary } from "@/lib/schemas/trip";
import { getTripTypeLabel } from "@/lib/trip-type-label";
import { tripStatusClasses, tripStatusLabels } from "@/lib/trips/trip-utils";

const truncateAddress = (value: string, maxLength = 22) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

type DriverTripsTableProps = {
  trips: TripSummary[];
  loading?: boolean;
};

const DriverTripsTable = ({ trips, loading = false }: DriverTripsTableProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Trip type</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Pickup</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Pickup Time</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Trip Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="py-8 text-center text-default-500">
                Loading trips...
              </TableCell>
            </TableRow>
          ) : trips.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="py-8 text-center text-default-500">
                No active trips yet. Accept a booking to start a trip.
              </TableCell>
            </TableRow>
          ) : (
            trips.map((trip) => {
              const tripType = getTripTypeLabel(trip.category);
              const legLabel =
                trip.tripLeg === "return"
                  ? "Return leg"
                  : trip.tripLeg === "outbound"
                    ? "Outbound"
                    : null;

              return (
                <TableRow key={`${trip.id}-${trip.tripLeg ?? "outbound"}`}>
                  <TableCell className="font-semibold text-default-900">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="text-primary hover:underline"
                    >
                      {trip.bookingNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex rounded-full bg-default-100 px-2.5 py-0.5 text-xs font-medium text-default-700">
                        {tripType}
                      </span>
                      {legLabel ? (
                        <span className="inline-flex rounded-full bg-info/10 px-2 py-0.5 text-xs font-medium text-info">
                          {legLabel}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-default-900">
                    {trip.customer.firstName}
                  </TableCell>
                  <TableCell
                    className="max-w-[180px] truncate text-default-600"
                    title={trip.route.pickupAddress}
                  >
                    {truncateAddress(trip.route.pickupAddress)}
                  </TableCell>
                  <TableCell
                    className="max-w-[180px] truncate text-default-600"
                    title={trip.route.dropoffAddress}
                  >
                    {truncateAddress(trip.route.dropoffAddress)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-default-600">
                    {trip.route.pickupDate} {trip.route.pickupTime}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-full bg-default-100 px-2.5 py-0.5 text-xs font-medium text-default-700">
                      {trip.vehicle.categoryName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tripStatusClasses[trip.status] ??
                        "bg-default-100 text-default-600"
                      }`}
                    >
                      {tripStatusLabels[trip.status] ?? trip.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label="Open actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/trips/${trip.id}`}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Trip
                          </Link>
                        </DropdownMenuItem>
                        {trip.status !== "completed" ? (
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/trips/${trip.id}`}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Manage trip
                            </Link>
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DriverTripsTable;

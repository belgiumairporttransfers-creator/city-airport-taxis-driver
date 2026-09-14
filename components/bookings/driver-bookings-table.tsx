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
import { Input } from "@/components/ui/input";
import type { DriverBooking } from "@/lib/schemas/booking";
import {
  getDriverBookingDisplayStatus,
  isDriverBookingInProgress,
} from "@/lib/booking-status-display";
import { getTripTypeLabel } from "@/lib/trip-type-label";
import { formatDate, formatPrice, formatTime } from "@/lib/utils";

const EUR_SYMBOL = "€";

const truncateAddress = (value: string, maxLength = 22) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

type DriverBookingsTableProps = {
  bookings: DriverBooking[];
  search: string;
  onSearchChange: (value: string) => void;
  loading?: boolean;
  showCompleteAction?: boolean;
  hideSearch?: boolean;
};

const DriverBookingsTable = ({
  bookings,
  search,
  onSearchChange,
  loading = false,
  showCompleteAction = true,
  hideSearch = false,
}: DriverBookingsTableProps) => {
  return (
    <div className="space-y-4">
      {!hideSearch ? (
        <Input
          placeholder="Search by booking #, customer, or address"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="max-w-sm"
        />
      ) : null}

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Trip type</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Pickup</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Your payout</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="py-8 text-center text-default-500">
                  Loading bookings...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="py-8 text-center text-default-500">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const display = getDriverBookingDisplayStatus(booking);
                const tripType = getTripTypeLabel(booking.category);

                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-semibold text-default-900">
                      <Link
                        href={`/bookings/${booking.id}`}
                        className="text-primary hover:underline"
                      >
                        {booking.bookingNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full bg-default-100 px-2.5 py-0.5 text-xs font-medium text-default-700">
                        {tripType}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-default-900">
                      {booking.customer.firstName}
                    </TableCell>
                    <TableCell
                      className="max-w-[180px] truncate text-default-600"
                      title={booking.route.pickupAddress}
                    >
                      {truncateAddress(booking.route.pickupAddress)}
                    </TableCell>
                    <TableCell
                      className="max-w-[180px] truncate text-default-600"
                      title={booking.route.dropoffAddress}
                    >
                      {truncateAddress(booking.route.dropoffAddress)}
                    </TableCell>
                    <TableCell className="font-semibold text-default-900">
                      {formatPrice(booking.pricing.driverEarning, EUR_SYMBOL)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full bg-default-100 px-2.5 py-0.5 text-xs font-medium text-default-700">
                        {booking.vehicle.categoryName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${display.className}`}
                      >
                        {display.label}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-default-600">
                      {formatDate(booking.createdAt)} {formatTime(booking.createdAt)}
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
                              href={`/bookings/${booking.id}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          {showCompleteAction && isDriverBookingInProgress(booking) ? (
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/trips/${booking.id}`}
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
    </div>
  );
};

export default DriverBookingsTable;

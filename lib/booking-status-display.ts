import type { DriverBooking } from "@/lib/schemas/booking";
import { tripStatusClasses, tripStatusLabels } from "@/lib/trips/trip-utils";

const bookingStatusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  accepted: "Accepted",
  complete: "Complete",
  cancelled: "Cancelled",
};

const bookingStatusClasses: Record<string, string> = {
  pending: "bg-default-50 text-default-700 border border-default-200",
  confirmed: "bg-primary/10 text-primary border border-transparent",
  accepted: "bg-info/10 text-info border border-transparent",
  complete: "bg-success/10 text-success border border-transparent",
  cancelled: "bg-default-100 text-default-600 border border-transparent",
};

type BookingStatusLike = {
  status: string;
  tripPhase?: DriverBooking["tripPhase"];
};

export const getDriverBookingDisplayStatus = (
  booking: BookingStatusLike
): { label: string; className: string; key: string } => {
  const phase = booking.tripPhase ?? null;

  if (phase) {
    return {
      key: phase,
      label: tripStatusLabels[phase] ?? phase,
      className: `${tripStatusClasses[phase] ?? "bg-default-100 text-default-600"} border border-transparent`,
    };
  }

  return {
    key: booking.status,
    label: bookingStatusLabels[booking.status] ?? booking.status,
    className:
      bookingStatusClasses[booking.status] ??
      "bg-default-100 text-default-600 border border-transparent",
  };
};

export const isDriverBookingInProgress = (booking: BookingStatusLike) => {
  if (booking.status === "complete" || booking.status === "cancelled") {
    return false;
  }

  if (booking.status === "accepted") {
    return booking.tripPhase !== "completed";
  }

  return false;
};

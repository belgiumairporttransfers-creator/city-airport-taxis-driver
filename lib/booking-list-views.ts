import type { DriverBookingTripPhase } from "@/lib/schemas/booking";

export type DriverBookingListViewKey =
  | "all"
  | "accepted"
  | "arrived"
  | "onboard"
  | "started"
  | "completed";

export type DriverBookingListView = {
  key: DriverBookingListViewKey;
  title: string;
  description: string;
  href: string;
  scope?: "accepted" | "completed" | "all";
  tripPhase?: DriverBookingTripPhase;
  showCompleteAction?: boolean;
  searchPlaceholder?: string;
};

export const DRIVER_BOOKING_LIST_VIEWS: Record<
  DriverBookingListViewKey,
  DriverBookingListView
> = {
  all: {
    key: "all",
    title: "My Bookings",
    description: "Only bookings you have accepted appear here.",
    href: "/operations/bookings",
    scope: "accepted",
    showCompleteAction: true,
  },
  accepted: {
    key: "accepted",
    title: "Accepted Bookings",
    description: "Accepted trips waiting for you to arrive at pickup.",
    href: "/operations/accepted",
    tripPhase: "driver_accepted",
    showCompleteAction: true,
  },
  arrived: {
    key: "arrived",
    title: "Arrived Bookings",
    description: "Trips where you have arrived at the pickup location.",
    href: "/operations/arrived",
    tripPhase: "driver_arrived",
    showCompleteAction: true,
  },
  onboard: {
    key: "onboard",
    title: "Passenger Onboard",
    description: "Trips where the passenger is onboard.",
    href: "/operations/onboard",
    tripPhase: "passenger_onboard",
    showCompleteAction: true,
  },
  started: {
    key: "started",
    title: "Started Trips",
    description: "Trips currently in progress.",
    href: "/operations/started",
    tripPhase: "trip_started",
    showCompleteAction: true,
  },
  completed: {
    key: "completed",
    title: "Completed Bookings",
    description: "Bookings you accepted and marked complete.",
    href: "/operations/completed",
    scope: "completed",
    showCompleteAction: false,
    searchPlaceholder: "Search completed bookings",
  },
};

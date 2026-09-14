import type { DriverBookingTripPhase } from "@/lib/schemas/booking";

export type DriverBookingListViewKey = "all" | "completed";

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
    title: "All Bookings",
    description: "All bookings you have accepted, including completed trips.",
    href: "/operations/bookings",
    scope: "all",
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

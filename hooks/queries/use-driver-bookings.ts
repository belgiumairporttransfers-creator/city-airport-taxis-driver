import {
  acceptDriverBooking,
  getDriverBooking,
  getDriverBookings,
} from "@/lib/api/booking";
import type { GetDriverBookingsParams } from "@/lib/schemas/booking";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const DRIVER_BOOKINGS_QUERY_KEY = ["driver-bookings"] as const;
export const driverBookingQueryKey = (id: string) => [...DRIVER_BOOKINGS_QUERY_KEY, id] as const;

type ApiError = { message?: string };

export const useDriverBookings = (
  params: GetDriverBookingsParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [...DRIVER_BOOKINGS_QUERY_KEY, params],
    queryFn: () => getDriverBookings(params),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    enabled: options?.enabled ?? true,
  });
};

export const useCalendarDriverBookings = () => {
  return useQuery({
    queryKey: [...DRIVER_BOOKINGS_QUERY_KEY, "calendar"],
    queryFn: () =>
      getDriverBookings({
        page: 1,
        limit: 100,
        scope: "all",
        sort: "route.pickupDate",
      }),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });
};

export const useDriverBooking = (id: string) => {
  return useQuery({
    queryKey: driverBookingQueryKey(id),
    queryFn: () => getDriverBooking(id),
    enabled: Boolean(id),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      const booking = query.state.data;
      if (booking?.canAccept && booking.status === "confirmed" && !booking.unavailableMessage) {
        return 10_000;
      }
      return false;
    },
  });
};

export const useAcceptDriverBooking = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => acceptDriverBooking(id),
    onSuccess: async () => {
      toast.success("Booking accepted");
      await queryClient.invalidateQueries({ queryKey: DRIVER_BOOKINGS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: driverBookingQueryKey(id) });
      await queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to accept booking.");
    },
  });
};

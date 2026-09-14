import {
  completeTrip,
  getTrip,
  getTrips,
  markPassengerOnboard,
  markTripArrived,
  startTrip,
} from "@/lib/api/trip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const TRIPS_QUERY_KEY = ["trips"] as const;
export const tripQueryKey = (bookingId: string) =>
  [...TRIPS_QUERY_KEY, bookingId] as const;

type ApiError = { message?: string };

const refreshTripQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
  bookingId: string
) => {
  await queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
  await queryClient.invalidateQueries({ queryKey: tripQueryKey(bookingId) });
  await queryClient.invalidateQueries({ queryKey: ["driver-bookings"] });
};

export const useTrips = () => {
  return useQuery({
    queryKey: TRIPS_QUERY_KEY,
    queryFn: getTrips,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useTrip = (bookingId: string) => {
  return useQuery({
    queryKey: tripQueryKey(bookingId),
    queryFn: () => getTrip(bookingId),
    enabled: Boolean(bookingId),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useMarkTripArrived = (bookingId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markTripArrived(bookingId),
    onSuccess: async () => {
      toast.success("Arrival recorded");
      await refreshTripQueries(queryClient, bookingId);
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to record arrival.");
    },
  });
};

export const useMarkPassengerOnboard = (bookingId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markPassengerOnboard(bookingId),
    onSuccess: async () => {
      toast.success("Passenger onboard recorded");
      await refreshTripQueries(queryClient, bookingId);
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to record passenger onboard.");
    },
  });
};

export const useStartTrip = (bookingId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => startTrip(bookingId),
    onSuccess: async () => {
      toast.success("Trip started");
      await refreshTripQueries(queryClient, bookingId);
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to start trip.");
    },
  });
};

export const useCompleteTrip = (bookingId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => completeTrip(bookingId),
    onSuccess: async () => {
      toast.success("Trip completed");
      await refreshTripQueries(queryClient, bookingId);
      await queryClient.invalidateQueries({ queryKey: ["driver-wallet"] });
      await queryClient.invalidateQueries({ queryKey: ["driver-wallet-transactions"] });
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to complete trip.");
    },
  });
};

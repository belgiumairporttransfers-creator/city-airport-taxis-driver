import API_ROUTES from "@/lib/api/routes";
import type { DriverTripDetail, DriverTripsList, TripSummary } from "@/lib/schemas/trip";
import { api } from "./client";

export const getTrips = async () => {
  return api.get<DriverTripsList>(API_ROUTES.DRIVER_TRIPS);
};

export const getTrip = async (bookingId: string) => {
  return api.get<DriverTripDetail>(`${API_ROUTES.DRIVER_TRIPS}/${bookingId}`);
};

export const markTripArrived = async (bookingId: string) => {
  return api.post<TripSummary>(`${API_ROUTES.DRIVER_TRIPS}/${bookingId}/arrived`);
};

export const markPassengerOnboard = async (bookingId: string) => {
  return api.post<TripSummary>(`${API_ROUTES.DRIVER_TRIPS}/${bookingId}/passenger-onboard`);
};

export const startTrip = async (bookingId: string) => {
  return api.post<TripSummary>(`${API_ROUTES.DRIVER_TRIPS}/${bookingId}/start`);
};

export const completeTrip = async (bookingId: string) => {
  return api.post<TripSummary>(`${API_ROUTES.DRIVER_TRIPS}/${bookingId}/complete`);
};

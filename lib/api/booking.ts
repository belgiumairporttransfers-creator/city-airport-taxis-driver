import API_ROUTES from "@/lib/api/routes";
import type {
  AcceptOpenBookingResponse,
  DriverBookingsResponse,
  DriverOpenBooking,
  GetDriverBookingsParams,
} from "@/lib/schemas/booking";
import { api } from "./client";

export const getDriverBookings = async (params?: GetDriverBookingsParams) => {
  return api.get<DriverBookingsResponse>(API_ROUTES.DRIVER_BOOKINGS, { params });
};

export const getDriverBooking = async (id: string) => {
  return api.get<DriverOpenBooking>(`${API_ROUTES.DRIVER_BOOKINGS}/${id}`);
};

export const acceptDriverBooking = async (id: string) => {
  return api.post<AcceptOpenBookingResponse>(`${API_ROUTES.DRIVER_BOOKINGS}/${id}/accept`);
};

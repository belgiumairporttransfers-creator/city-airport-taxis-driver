import { z } from "zod";
import { tripCustomerSchema, tripRouteSchema, tripVehicleSchema } from "../trip/trip.schema";

export const driverBookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "accepted",
  "complete",
  "cancelled",
]);

export const driverBookingSchema = z.object({
  id: z.string(),
  bookingNumber: z.string(),
  status: driverBookingStatusSchema,
  category: z.string(),
  customer: tripCustomerSchema,
  route: tripRouteSchema,
  vehicle: tripVehicleSchema,
  flight: z.object({
    required: z.boolean(),
    flightNumber: z.string().optional(),
    terminal: z.string().optional(),
  }),
  pricing: z.object({
    driverEarning: z.number(),
  }),
  driver: z.object({
    driverId: z.string().optional(),
    assignedAt: z.string().optional(),
    acceptedAt: z.string().optional(),
  }),
  timeline: z.array(
    z.object({
      event: z.string(),
      at: z.string(),
      metadata: z.record(z.unknown()).optional(),
    })
  ),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const driverBookingsResponseSchema = z.object({
  items: z.array(driverBookingSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const getDriverBookingsParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  scope: z.enum(["accepted", "completed", "all"]).optional(),
  sort: z.string().optional(),
});

export const driverOpenBookingSchema = z.object({
  id: z.string(),
  bookingNumber: z.string(),
  status: z.string(),
  category: z.string(),
  customer: tripCustomerSchema,
  route: tripRouteSchema,
  vehicle: tripVehicleSchema,
  flight: z.object({
    required: z.boolean(),
    flightNumber: z.string().optional(),
    terminal: z.string().optional(),
  }),
  notes: z.string().optional(),
  pricing: z.object({
    driverEarning: z.number(),
  }),
  canAccept: z.boolean(),
  assignmentId: z.string().optional(),
  unavailableMessage: z.string().optional(),
});

export const acceptOpenBookingResponseSchema = z.object({
  booking: driverOpenBookingSchema,
  assignment: z.object({
    id: z.string(),
    assignmentNumber: z.string(),
    bookingId: z.string(),
    bookingNumber: z.string(),
    status: z.string(),
  }),
});

export type DriverBooking = z.infer<typeof driverBookingSchema>;
export type DriverBookingsResponse = z.infer<typeof driverBookingsResponseSchema>;
export type GetDriverBookingsParams = z.infer<typeof getDriverBookingsParamsSchema>;
export type DriverOpenBooking = z.infer<typeof driverOpenBookingSchema>;
export type AcceptOpenBookingResponse = z.infer<typeof acceptOpenBookingResponseSchema>;

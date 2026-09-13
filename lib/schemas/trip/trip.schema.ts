import { z } from "zod";

export const tripCustomerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  email: z.string(),
});

export const tripRouteSchema = z.object({
  pickupAddress: z.string(),
  dropoffAddress: z.string(),
  pickupDate: z.string(),
  pickupTime: z.string(),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  distance: z.number(),
  durationMinutes: z.number().optional(),
  estimatedArrival: z.string().optional(),
  airportPickup: z.boolean(),
});

export const tripVehicleSchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  passengers: z.number(),
  luggage: z.number(),
  handLuggage: z.number().optional(),
  smallCheckedCase: z.number().optional(),
  largeCheckedCase: z.number().optional(),
});

export const tripTimestampsSchema = z.object({
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  driverArrivedAt: z.string().optional(),
  passengerBoardedAt: z.string().optional(),
  actualPickupTime: z.string().optional(),
  actualDropoffTime: z.string().optional(),
});

export const tripSummarySchema = z.object({
  id: z.string(),
  bookingNumber: z.string(),
  status: z.string(),
  category: z.string(),
  customer: tripCustomerSchema,
  route: tripRouteSchema,
  vehicle: tripVehicleSchema,
  trip: tripTimestampsSchema,
  tripLeg: z.enum(["outbound", "return"]).optional(),
  assignmentStatus: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const driverTripsListSchema = z.object({
  today: z.array(tripSummarySchema),
  upcoming: z.array(tripSummarySchema),
  active: z.array(tripSummarySchema),
  completed: z.array(tripSummarySchema),
});

export const tripTimelineEntrySchema = z.object({
  event: z.string(),
  at: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

export const tripAssignmentSchema = z.object({
  id: z.string(),
  assignmentNumber: z.string(),
  bookingId: z.string(),
  bookingNumber: z.string(),
  driverId: z.string(),
  driverUserId: z.string(),
  assignedBy: z.string(),
  status: z.string(),
  assignedAt: z.string(),
  acceptedAt: z.string().optional(),
  rejectedAt: z.string().optional(),
  expiredAt: z.string().optional(),
  completedAt: z.string().optional(),
  rejectReason: z.string().optional(),
  adminNotes: z.string().optional(),
  expiresAt: z.string().optional(),
  chatConversationId: z.string().nullable().optional(),
  callSessionId: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const tripFlightSchema = z.object({
  required: z.boolean(),
  flightNumber: z.string().optional(),
  terminal: z.string().optional(),
});

export const driverTripDetailSchema = z.object({
  booking: z.object({
    id: z.string(),
    bookingNumber: z.string(),
    status: z.string(),
    category: z.string(),
    notes: z.string().optional(),
  }),
  customer: tripCustomerSchema,
  flight: tripFlightSchema,
  route: tripRouteSchema,
  vehicle: tripVehicleSchema,
  notes: z.string().optional(),
  assignment: tripAssignmentSchema,
  timeline: z.array(tripTimelineEntrySchema),
  trip: tripTimestampsSchema,
});

export type TripSummary = z.infer<typeof tripSummarySchema>;
export type DriverTripsList = z.infer<typeof driverTripsListSchema>;
export type DriverTripDetail = z.infer<typeof driverTripDetailSchema>;

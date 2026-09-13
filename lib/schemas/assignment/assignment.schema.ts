import { z } from "zod";
import { tripCustomerSchema, tripRouteSchema, tripVehicleSchema } from "../trip/trip.schema";

export const assignmentStatusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
  "expired",
  "cancelled",
  "completed",
]);

export const assignmentSchema = z.object({
  id: z.string(),
  assignmentNumber: z.string(),
  bookingId: z.string(),
  bookingNumber: z.string(),
  driverId: z.string(),
  driverUserId: z.string(),
  assignedBy: z.string(),
  status: assignmentStatusSchema,
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

export const assignmentsResponseSchema = z.object({
  items: z.array(assignmentSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const assignmentDetailSchema = assignmentSchema.extend({
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
    total: z.number().optional(),
    commissionPercent: z.number().optional(),
    platformFee: z.number().optional(),
    driverEarning: z.number(),
  }),
});

export const getAssignmentsParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  status: assignmentStatusSchema.optional(),
  scope: z
    .enum(["today", "upcoming", "awaiting", "accepted", "completed", "cancelled"])
    .optional(),
  sort: z.string().optional(),
});

export type Assignment = z.infer<typeof assignmentSchema>;
export type AssignmentDetail = z.infer<typeof assignmentDetailSchema>;
export type AssignmentsResponse = z.infer<typeof assignmentsResponseSchema>;
export type GetAssignmentsParams = z.infer<typeof getAssignmentsParamsSchema>;

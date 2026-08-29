import { z } from "zod";

export const driverDashboardOverviewSchema = z.object({
  totals: z.object({
    totalEarned: z.number(),
    availableBalance: z.number(),
    todayEarned: z.number().optional().default(0),
    thisMonthEarned: z.number(),
    totalPaidOut: z.number().optional().default(0),
    activeBookings: z.number(),
    completedBookings: z.number(),
    totalTrips: z.number(),
    currency: z.string(),
  }),
  series: z.object({
    earnings: z.array(z.number()),
    activeBookings: z.array(z.number()),
    completedBookings: z.array(z.number()),
    thisMonthEarned: z.array(z.number()),
  }),
  transactions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      reference: z.string(),
      amount: z.number(),
      currency: z.string(),
      direction: z.string(),
      type: z.string(),
      status: z.string(),
      createdAt: z.string(),
    })
  ),
  recentOrders: z.array(
    z.object({
      id: z.string(),
      bookingNumber: z.string(),
      customerName: z.string(),
      date: z.string(),
      amount: z.number(),
      status: z.string(),
      isComplete: z.boolean(),
    })
  ),
});

export type DriverDashboardOverview = z.infer<typeof driverDashboardOverviewSchema>;

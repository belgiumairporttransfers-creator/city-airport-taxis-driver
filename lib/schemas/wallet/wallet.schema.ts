import { z } from "zod";

export const walletTransactionSchema = z.object({
  id: z.string(),
  bookingId: z.string().optional(),
  bookingNumber: z.string().optional(),
  type: z.string(),
  direction: z.string(),
  status: z.string(),
  grossAmount: z.number(),
  commissionPercent: z.number(),
  amount: z.number(),
  currency: z.string(),
  description: z.string(),
  createdAt: z.string(),
});

export const driverWalletSummarySchema = z.object({
  currency: z.string(),
  availableBalance: z.number(),
  totalEarned: z.number(),
  totalTrips: z.number(),
  commissionPercent: z.number(),
  thisMonthEarned: z.number(),
  lastMonthEarned: z.number(),
  recentTransactions: z.array(walletTransactionSchema),
});

export const walletTransactionsResponseSchema = z.object({
  items: z.array(walletTransactionSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean().optional(),
    hasPrevPage: z.boolean().optional(),
  }),
});

export type WalletTransaction = z.infer<typeof walletTransactionSchema>;
export type DriverWalletSummary = z.infer<typeof driverWalletSummarySchema>;
export type WalletTransactionsResponse = z.infer<typeof walletTransactionsResponseSchema>;

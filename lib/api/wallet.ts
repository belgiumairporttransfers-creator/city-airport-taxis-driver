import API_ROUTES from "@/lib/api/routes";
import type {
  DriverWalletSummary,
  WalletTransaction,
  WalletTransactionsResponse,
} from "@/lib/schemas/wallet/wallet.schema";
import { api } from "./client";

export type GetWalletTransactionsParams = {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
};

export type RequestPayoutPayload = {
  amount: number;
  note?: string;
};

export const getDriverWalletSummary = async () => {
  return api.get<DriverWalletSummary>(API_ROUTES.DRIVER_WALLET);
};

export const getDriverWalletTransactions = async (params?: GetWalletTransactionsParams) => {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.type) searchParams.set("type", params.type);
  if (params?.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  const url = query
    ? `${API_ROUTES.DRIVER_WALLET_TRANSACTIONS}?${query}`
    : API_ROUTES.DRIVER_WALLET_TRANSACTIONS;

  return api.get<WalletTransactionsResponse>(url);
};

export const getDriverWalletPayouts = async (params?: GetWalletTransactionsParams) => {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  const url = query
    ? `${API_ROUTES.DRIVER_WALLET_PAYOUTS}?${query}`
    : API_ROUTES.DRIVER_WALLET_PAYOUTS;

  return api.get<WalletTransactionsResponse>(url);
};

export const requestDriverPayout = async (payload: RequestPayoutPayload) => {
  return api.post<WalletTransaction>(API_ROUTES.DRIVER_WALLET_PAYOUTS, payload);
};

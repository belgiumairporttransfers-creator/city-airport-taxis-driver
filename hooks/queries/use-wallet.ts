import {
  getDriverWalletPayouts,
  getDriverWalletSummary,
  getDriverWalletTransactions,
  requestDriverPayout,
  type GetWalletTransactionsParams,
  type RequestPayoutPayload,
} from "@/lib/api/wallet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const DRIVER_WALLET_QUERY_KEY = ["driver-wallet"] as const;
export const DRIVER_WALLET_TRANSACTIONS_QUERY_KEY = ["driver-wallet-transactions"] as const;
export const DRIVER_WALLET_PAYOUTS_QUERY_KEY = ["driver-wallet-payouts"] as const;

type ApiError = { message?: string };

export const useDriverWallet = () => {
  return useQuery({
    queryKey: DRIVER_WALLET_QUERY_KEY,
    queryFn: getDriverWalletSummary,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useDriverWalletTransactions = (params: GetWalletTransactionsParams) => {
  return useQuery({
    queryKey: [...DRIVER_WALLET_TRANSACTIONS_QUERY_KEY, params],
    queryFn: () => getDriverWalletTransactions(params),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useDriverWalletPayouts = (params: GetWalletTransactionsParams) => {
  return useQuery({
    queryKey: [...DRIVER_WALLET_PAYOUTS_QUERY_KEY, params],
    queryFn: () => getDriverWalletPayouts(params),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useRequestDriverPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RequestPayoutPayload) => requestDriverPayout(payload),
    onSuccess: async () => {
      toast.success("Payout request submitted");
      await queryClient.invalidateQueries({ queryKey: DRIVER_WALLET_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: DRIVER_WALLET_TRANSACTIONS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: DRIVER_WALLET_PAYOUTS_QUERY_KEY });
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to request payout.");
    },
  });
};

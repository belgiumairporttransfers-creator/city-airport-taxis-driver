import {
  getDriverWalletSummary,
  getDriverWalletTransactions,
  type GetWalletTransactionsParams,
} from "@/lib/api/wallet";
import { useQuery } from "@tanstack/react-query";

export const DRIVER_WALLET_QUERY_KEY = ["driver-wallet"] as const;
export const DRIVER_WALLET_TRANSACTIONS_QUERY_KEY = ["driver-wallet-transactions"] as const;

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

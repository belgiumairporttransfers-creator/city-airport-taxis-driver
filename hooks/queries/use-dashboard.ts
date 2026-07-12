import { getDriverDashboard } from "@/lib/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export const DRIVER_DASHBOARD_QUERY_KEY = ["driver-dashboard"] as const;

export const useDriverDashboard = () => {
  return useQuery({
    queryKey: DRIVER_DASHBOARD_QUERY_KEY,
    queryFn: getDriverDashboard,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
};

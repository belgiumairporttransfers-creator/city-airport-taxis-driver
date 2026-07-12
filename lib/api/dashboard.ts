import API_ROUTES from "@/lib/api/routes";
import type { DriverDashboardOverview } from "@/lib/schemas/dashboard";
import { api } from "./client";

export const getDriverDashboard = async () => {
  return api.get<DriverDashboardOverview>(API_ROUTES.DRIVER_DASHBOARD);
};

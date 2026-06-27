import API_ROUTES from "@/lib/api/routes";
import type { DriverApplication, UpdateDriverProfilePayload } from "@/lib/schemas";
import { api } from "./client";

export const getMyDriverApplication = async () => {
  return api.get<DriverApplication>(API_ROUTES.DRIVER_APPLICATION_ME);
};

export const updateMyDriverApplication = async (payload: UpdateDriverProfilePayload) => {
  return api.patch<DriverApplication>(API_ROUTES.DRIVER_APPLICATION_ME, payload);
};

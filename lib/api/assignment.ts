import API_ROUTES from "@/lib/api/routes";
import type {
  Assignment,
  AssignmentDetail,
  AssignmentsResponse,
  GetAssignmentsParams,
} from "@/lib/schemas/assignment";
import { api } from "./client";

export const getAssignments = async (params?: GetAssignmentsParams) => {
  return api.get<AssignmentsResponse>(API_ROUTES.DRIVER_ASSIGNMENTS, { params });
};

export const getAssignment = async (id: string) => {
  return api.get<AssignmentDetail>(`${API_ROUTES.DRIVER_ASSIGNMENTS}/${id}`);
};

export const acceptAssignment = async (id: string) => {
  return api.post<Assignment>(`${API_ROUTES.DRIVER_ASSIGNMENTS}/${id}/accept`);
};

export const rejectAssignment = async (id: string, reason: string) => {
  return api.post<Assignment>(`${API_ROUTES.DRIVER_ASSIGNMENTS}/${id}/reject`, { reason });
};

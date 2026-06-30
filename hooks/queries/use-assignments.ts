import {
  acceptAssignment,
  getAssignment,
  getAssignments,
  rejectAssignment,
} from "@/lib/api/assignment";
import type { GetAssignmentsParams } from "@/lib/schemas/assignment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const ASSIGNMENTS_QUERY_KEY = ["assignments"] as const;
export const assignmentQueryKey = (id: string) => [...ASSIGNMENTS_QUERY_KEY, id] as const;

type ApiError = { message?: string };

export const useAssignments = (params: GetAssignmentsParams) => {
  return useQuery({
    queryKey: [...ASSIGNMENTS_QUERY_KEY, params],
    queryFn: () => getAssignments(params),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useAssignment = (id: string) => {
  return useQuery({
    queryKey: assignmentQueryKey(id),
    queryFn: () => getAssignment(id),
    enabled: Boolean(id),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useAcceptAssignment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => acceptAssignment(id),
    onSuccess: async () => {
      toast.success("Assignment accepted");
      await queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: assignmentQueryKey(id) });
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to accept assignment.");
    },
  });
};

export const useRejectAssignment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason: string) => rejectAssignment(id, reason),
    onSuccess: async () => {
      toast.success("Assignment rejected");
      await queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: assignmentQueryKey(id) });
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to reject assignment.");
    },
  });
};

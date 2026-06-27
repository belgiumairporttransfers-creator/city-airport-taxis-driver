import { getMyDriverApplication, updateMyDriverApplication } from "@/lib/api/driver";
import type { UpdateDriverProfilePayload } from "@/lib/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AUTH_ME_QUERY_KEY } from "./use-auth";

export const DRIVER_APPLICATION_QUERY_KEY = ["driver", "application", "me"] as const;

type ApiError = { message?: string };

export const useDriverApplication = () => {
  return useQuery({
    queryKey: DRIVER_APPLICATION_QUERY_KEY,
    queryFn: getMyDriverApplication,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useUpdateDriverApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDriverProfilePayload) => updateMyDriverApplication(payload),
    onSuccess: async () => {
      toast.success("Profile updated successfully");
      await queryClient.invalidateQueries({ queryKey: DRIVER_APPLICATION_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to update profile.");
    },
  });
};

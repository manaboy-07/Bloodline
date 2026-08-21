"use client";
import { updateMatch, UpdateMatchDto } from "@/api/services/match";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateMatchDto }) =>
      updateMatch(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matches"],
      });
    },
  });
};

"use client";
import { deleteMatch } from "@/api/services/match";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMatch,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matches"],
      });
    },
  });
};

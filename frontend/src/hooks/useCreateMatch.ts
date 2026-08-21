// hooks/useCreateMatch.ts
"use client";
import { createMatch } from "@/api/services/match";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMatch,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matches"],
      });
    },
  });
};

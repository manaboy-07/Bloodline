"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPrediction } from "../api/services/prediction";

export const useCreatePrediction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrediction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPredictions"] });
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
    },
  });
};

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePrediction } from "../api/services/prediction";

export const useDeletePrediction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePrediction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPredictions"] });
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
    },
  });
};

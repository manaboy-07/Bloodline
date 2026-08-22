"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePrediction } from "../api/services/prediction";

export const useUpdatePrediction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePrediction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPredictions"] });
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
    },
  });
};

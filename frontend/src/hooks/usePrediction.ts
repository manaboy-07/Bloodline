import { useQuery } from "@tanstack/react-query";
import { getAllPredictions } from "../api/services/prediction";

export const usePredictions = () => {
  return useQuery({
    queryKey: ["predictions"],
    queryFn: getAllPredictions,
  });
};

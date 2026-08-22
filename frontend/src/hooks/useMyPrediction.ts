import { useQuery } from "@tanstack/react-query";
import { getMyPredictions } from "../api/services/prediction";

export const useMyPredictions = () => {
  return useQuery({
    queryKey: ["myPredictions"],
    queryFn: getMyPredictions,
  });
};

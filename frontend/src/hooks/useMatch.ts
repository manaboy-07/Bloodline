import { getMatches } from "@/api/services/match";
import { Match } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useMatches = () => {
  return useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: getMatches,
  });
};
